"""Multi-tier Jev mathematical intelligence engine for P versus NP research.

Provides:
- triage: Screen candidate algorithms or lower bounds against Relativization, Natural Proofs, and Algebrization.
- lean-audit: Audit Lean 4 statement fidelity and check for axiom contamination.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "code"))
import jev
import jev_pnp


def triage_hypothesis(candidate_id: str, text: str) -> dict[str, Any]:
    """Tier 1 triage of candidate complexity hypothesis."""
    return jev_pnp.screen_candidate(candidate_id, text)


def audit_lean_statement(lean_file: Path) -> dict[str, Any]:
    """Audit Lean 4 formalization for statement fidelity and circular shortcuts."""
    if not lean_file.exists():
        raise FileNotFoundError(f"Lean file not found: {lean_file}")

    content = lean_file.read_text()
    sorries = len(re.findall(r"\bsorry\b", content))
    axioms = len(re.findall(r"\baxiom\b", content))

    state = {
        "lean_file": str(lean_file),
        "source_length": len(content),
        "sorry_count": sorries,
        "axiom_count": axioms,
        "first_50_lines": "\n".join(content.splitlines()[:50]),
    }

    questions = {
        "statement_fidelity": jev.noul(
            "Does the Lean 4 formalization faithfully capture standard Cook-Levin complexity definitions?",
            true="Formalization models valid Turing machine computations, boolean formulas, and polynomial reductions",
            false="Formalization introduces toy models that fail to imply the genuine complexity theorems"
        ),
        "sorry_free": jev.noul(
            "Is the formalization completely free of sorry, admit, and unproved goals?",
            true="Zero sorry tokens found, every intermediate lemma is formally proved",
            false="Contains sorry or admitted steps"
        ),
        "formalization_verdict": jev.score(
            "Overall mathematical audit score of the Lean 4 formalization",
            criteria=[
                "Machine-checked formal proof of non-trivial theorem with zero sorry",
                "Substantial progress with verified helper lemmas, minor scaffolding remaining",
                "Incomplete formalization with structural gaps",
                "Trivial, tautological, or axiom-contaminated"
            ]
        )
    }

    cid = f"lean_audit_{lean_file.stem}"
    resp = jev.ask(state, questions)
    jev.persist(cid, state, questions, resp)
    return resp


def main() -> None:
    parser = argparse.ArgumentParser(description="JevGenius P versus NP Mathematical Intelligence")
    subparsers = parser.add_subparsers(dest="command", required=True)

    triage_p = subparsers.add_parser("triage")
    triage_p.add_argument("--id", required=True)
    triage_p.add_argument("--text", required=True)

    lean_p = subparsers.add_parser("lean-audit")
    lean_p.add_argument("--file", required=True, type=Path)

    args = parser.parse_args()

    if args.command == "triage":
        res = triage_hypothesis(args.id, args.text)
        print(json.dumps(res, indent=2))
    elif args.command == "lean-audit":
        res = audit_lean_statement(args.file)
        print(json.dumps(res, indent=2))


if __name__ == "__main__":
    main()
