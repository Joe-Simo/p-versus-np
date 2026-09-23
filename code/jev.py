"""Jev (TypeSafe System One) client: typed routing signals for Riemann Hypothesis research.

Jev is NEVER a proof oracle. Every answer is stored tagged HYPOTHESIS_ONLY and may
only route attention; status changes to PROVED/REFUTED/VERIFIED require a derivation,
a counterexample, an exact computation, or a proof assistant.

Stdlib only (urllib). Key is read from $TYPESAFE_API_KEY or .env.local; never logged.
"""
from __future__ import annotations

import hashlib
import json
import os
import random
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Any

ENDPOINT = "https://api.typesafe.ai/v1/systemone"
MODEL = "jev-latest"
REPO = Path(__file__).resolve().parent.parent
EVIDENCE_DIR = REPO / "results" / "evidence"
CACHE_DIR = REPO / ".cache" / "jev"


class JevUnavailable(RuntimeError):
    """Service unreachable or refusing: caller must degrade to pure AI reasoning."""


def _api_key() -> str:
    key = os.environ.get("TYPESAFE_API_KEY")
    if key:
        return key.strip()
    envfile = REPO / ".env.local"
    if envfile.exists():
        for line in envfile.read_text().splitlines():
            line = line.strip()
            if line.startswith("TYPESAFE_API_KEY="):
                return line.split("=", 1)[1].strip().strip("'\"")
    raise JevUnavailable("TYPESAFE_API_KEY not set (env or .env.local)")


# ---------------------------------------------------------------- caching helpers

def _cache_key(state: Any, questions: dict[str, Any]) -> str:
    payload = json.dumps({"model": MODEL, "state": state, "questions": questions}, sort_keys=True, default=str)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def get_cached(state: Any, questions: dict[str, Any]) -> dict[str, Any] | None:
    """Retrieve cached response if available."""
    if os.environ.get("JEV_NO_CACHE") == "1":
        return None
    ckey = _cache_key(state, questions)
    cpath = CACHE_DIR / f"{ckey}.json"
    if cpath.exists():
        try:
            data = json.loads(cpath.read_text(encoding="utf-8"))
            if isinstance(data, dict) and "answers" in data:
                return data
        except Exception:
            pass
    return None


def store_cached(state: Any, questions: dict[str, Any], data: dict[str, Any]) -> None:
    """Store successful response into persistent query cache."""
    if os.environ.get("JEV_NO_CACHE") == "1":
        return
    try:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        ckey = _cache_key(state, questions)
        cpath = CACHE_DIR / f"{ckey}.json"
        cpath.write_text(json.dumps(data, indent=2), encoding="utf-8")
    except Exception:
        pass


def cache_stats() -> dict[str, Any]:
    """Return count and disk usage of Jev query cache."""
    if not CACHE_DIR.exists():
        return {"count": 0, "size_bytes": 0}
    files = list(CACHE_DIR.glob("*.json"))
    total_size = sum(f.stat().st_size for f in files)
    return {"count": len(files), "size_bytes": total_size}


def clear_cache() -> int:
    """Clear all cached Jev responses."""
    if not CACHE_DIR.exists():
        return 0
    count = 0
    for f in CACHE_DIR.glob("*.json"):
        try:
            f.unlink()
            count += 1
        except Exception:
            pass
    return count


# ---------------------------------------------------------------- question types

def noul(instructions: str, true: str, false: str) -> dict[str, Any]:
    return {"type": "noul", "instructions": instructions,
            "criteria": {"true": true, "false": false}}


def choice(instructions: str, criteria: dict[str, str]) -> dict[str, Any]:
    return {"type": "choice", "instructions": instructions, "criteria": criteria}


def score(instructions: str, criteria: list[str]) -> dict[str, Any]:
    return {"type": "score", "instructions": instructions, "criteria": criteria}


# ---------------------------------------------------------------- transport

def ask(state: Any, questions: dict[str, dict[str, Any]], *,
        timeout: float = 90.0, tries: int = 5, use_cache: bool = True) -> dict[str, Any]:
    """One request, one state. Returns {"answers": ..., "usage": ...}."""
    if use_cache:
        cached = get_cached(state, questions)
        if cached is not None:
            return cached

    body = json.dumps({"model": MODEL, "state": state, "questions": questions}).encode()
    headers = {"Authorization": f"Bearer {_api_key()}", "Content-Type": "application/json"}
    delay = 1.0
    for attempt in range(tries):
        req = urllib.request.Request(ENDPOINT, data=body, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                res = json.loads(resp.read().decode())
                if use_cache and "answers" in res:
                    store_cached(state, questions, res)
                return res
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504, 529) and attempt < tries - 1:
                time.sleep(delay + random.random() * 0.5)
                delay *= 2
                continue
            detail = e.read().decode()[:400]
            raise JevUnavailable(f"HTTP {e.code} from Jev: {detail}") from None
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < tries - 1:
                time.sleep(delay + random.random() * 0.5)
                delay *= 2
                continue
            raise JevUnavailable(f"Jev unreachable: {e}") from None
    raise JevUnavailable("Jev retries exhausted")


def ask_many(states: list[Any], questions: dict[str, dict[str, Any]], *,
             concurrency: int = 12, use_cache: bool = True,
             batch_size: int = 24) -> list[dict[str, Any]]:
    """Same questions over many states, concurrently."""
    def one(s: Any) -> dict[str, Any]:
        try:
            return ask(s, questions, use_cache=use_cache)
        except JevUnavailable as e:
            return {"error": str(e)}

    results: list[dict[str, Any]] = []
    for i in range(0, len(states), batch_size):
        batch = states[i:i + batch_size]
        with ThreadPoolExecutor(max_workers=min(concurrency, len(batch))) as pool:
            batch_results = list(pool.map(one, batch))
            results.extend(batch_results)
        if i + batch_size < len(states):
            time.sleep(0.05)
    return results


# ---------------------------------------------------------------- persistence

def persist(candidate_id: str, state: Any, questions: dict[str, Any],
            response: dict[str, Any]) -> Path:
    """Store raw request + answers so exploration tree can be reconstructed."""
    EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)
    path = EVIDENCE_DIR / f"{candidate_id}_{int(time.time())}.json"
    path.write_text(json.dumps({
        "state": "HYPOTHESIS_ONLY",
        "candidate_id": candidate_id,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "model": MODEL,
        "request_state": state,
        "questions": questions,
        "response": response,
    }, indent=2))
    return path
