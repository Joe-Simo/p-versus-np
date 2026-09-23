"""P versus NP Jev screening client (code/jev_pnp.py).

Screens mathematical claims, algorithms, and complexity lower bounds
against the canonical barriers (Relativization, Natural Proofs, Algebrization).
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "code"))

import jev


def build_questions() -> dict[str, Any]:
    return {
        "avoids_relativization_barrier": jev.noul(
            "Does the argument fail to relativize, overcoming the Baker-Gill-Solovay 1975 barrier?",
            true="Uses non-relativizing properties (e.g. arithmetization with interactive proofs or local decoding)",
            false="Relies on Turing machine simulation or diagonalization that holds unchanged relative to any oracle"
        ),
        "avoids_natural_proofs_barrier": jev.noul(
            "If proving circuit lower bounds, does the argument avoid the Razborov-Rudich 1997 Natural Proofs barrier?",
            true="Violates either constructivity or largeness (e.g. non-natural properties, algebraic geometry lower bounds)",
            false="Relies on constructive, dense combinatorial properties of truth tables refuted under pseudo-randomness"
        ),
        "avoids_algebrization_barrier": jev.noul(
            "Does the argument overcome the Aaronson-Wigderson 2008 Algebrization barrier?",
            true="Uses properties that fail relative to low-degree polynomial algebraic oracles",
            false="Relies only on polynomial method extensions that algebrize"
        ),
        "avoids_monotone_approximation_trap": jev.noul(
            "If using circuit approximations, does the argument avoid Norbert Blum's error explosion trap on NOT gates?",
            true="Avoids extending monotone approximations to general circuits without non-natural machinery",
            false="Claims to extend monotone circuit approximations to general circuits via bounded NOT errors"
        ),
        "worst_case_guarantee": jev.choice(
            "What computational model and guarantee does the candidate establish?",
            criteria={
                "worst_case_unconditional": "Unconditional worst-case lower or upper bound across all inputs",
                "average_case_or_heuristic": "Empirical performance or heuristic bound on specific distributions",
                "restricted_circuit_only": "Restricted lower bound (monotone, formulas, AC0, TC0) without general P/poly separation"
            }
        ),
        "viability_score": jev.score(
            "Score the research candidate's rigor and potential for P versus NP progress",
            criteria=[
                "Mathematically sound, explicit hypotheses, non-relativizing, non-natural, non-algebrizing",
                "Plausible path, relies on established complexity theorems with verified scope",
                "Exploratory but contains unverified barrier crossings or circular reductions",
                "Fatal flaw: relativizes, is naturalized, or confuses heuristic with worst-case"
            ]
        )
    }


def screen_candidate(candidate_id: str, text: str) -> dict[str, Any]:
    questions = build_questions()
    state = {
        "project": "P-versus-NP",
        "target": "Determine whether P = NP in the Cook/Clay formulation",
        "candidate_id": candidate_id,
        "proposal_text": text
    }
    resp = jev.ask(state, questions)
    try:
        jev.persist(candidate_id, state, questions, resp)
    except Exception:
        pass
    return resp


def main() -> None:
    parser = argparse.ArgumentParser(description="Jev P versus NP Screener")
    parser.add_argument("command", nargs="?", default="screen", choices=["screen", "triage", "cache-stats", "clear-cache"])
    parser.add_argument("--id", default="candidate", help="Candidate identifier")
    parser.add_argument("--text", help="Candidate text or hypothesis summary")
    args = parser.parse_args()

    if args.command == "cache-stats":
        print(json.dumps(jev.cache_stats(), indent=2))
    elif args.command == "clear-cache":
        count = jev.clear_cache()
        print(f"Cleared {count} cache entries")
    else:
        if not args.text:
            print("Error: --text required for screening", file=sys.stderr)
            sys.exit(1)
        res = screen_candidate(args.id, args.text)
        print(json.dumps(res, indent=2))


if __name__ == "__main__":
    main()
