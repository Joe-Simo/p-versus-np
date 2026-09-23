# P versus NP Research — Working Instructions

**P versus NP is not solved.** Treat every claim of a general polynomial-time SAT algorithm or unconditional superpolynomial circuit lower bound as unverified until audited against primary source dependencies and verified under machine-checked Lean 4 formalization.

## HARD RULE: Every research cycle STARTS with a Jev call

Not "consider using Jev" — **the first tool call of every research turn is a Jev batch.** If you are about to read, audit, compare, or choose between candidate algorithms, circuit lower bounds, or papers, run the screen first using `python3 code/jev_genius.py` or `python3 code/jev_pnp.py`.

Jev decisions that are fast, cheap, and mandatory:
- **Triage & ranking**: screen every candidate hypothesis with `code/jev_genius.py triage`.
- **Failure mode check**: verify arguments against the 5 canonical P vs NP barriers.
- **Statement fidelity**: for formal Lean 4 files, audit statement fidelity with `code/jev_genius.py lean-audit`.

## Canonical P vs NP Failure Modes to Reject Immediately

1. **Relativization Trap**:
   Using diagonalization or simulation arguments that hold unchanged in the presence of an arbitrary oracle (refuted by Baker, Gill, & Solovay in 1975).
2. **Natural Proofs Trap**:
   Attempting to prove circuit lower bounds via constructive, dense combinatorial properties of truth tables (refuted by Razborov & Rudich in 1997).
3. **Algebrization Trap**:
   Relying on low-degree polynomial extensions over finite fields that algebrize (refuted by Aaronson & Wigderson in 2008).
4. **Heuristic / Average-Case Conflation**:
   Conflating empirical CDCL/DPLL performance on structured benchmarks with worst-case polynomial bounds.
5. **Circuit Model / Representation Laundering**:
   Claiming circuit lower bounds while stealthily restricting to monotone, bounded-depth $AC^0$, or formulas without explicit qualification.

## Tools & Files

| Path | Role |
|---|---|
| `code/jev.py` | Stdlib-only Jev client. Reads key from `$TYPESAFE_API_KEY` or `.env.local`. Never log or commit the key. |
| `code/jev_pnp.py` | Focused P vs NP failure-mode and candidate screener. |
| `code/jev_genius.py` | Multi-tier Jev mathematical intelligence engine for P vs NP. |
| `code/sat_circuit_sieve_fast.c` | OpenMP-accelerated C engine for hard SAT refutations and truth table circuit evaluation. |
| `code/comprehensive_pnp_discrepancy_suite.py` | Multi-track P vs NP discrepancy and counterexample hunt suite. |
| `code/autonomous_pnp_engine.py` | High-throughput multi-core autonomous research daemon. |
| `formalization/CookLevinFoundations.lean` | Lean 4 machine-checked proof of polynomial reduction and tableau consistency. |
| `sources/NO_GO_REGISTER.md` | Primary register of complexity barriers and refuted frameworks. |
| `sources/FAILED_CALCULATIONS_REGISTER.md` | Authoritative register of refuted literature calculations, retracted papers, and excluded heuristics. |
| `CHECKPOINT.json` | Persistent machine-readable project state. |
