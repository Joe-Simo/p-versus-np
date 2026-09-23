# No-Go Register: P versus NP

Authoritative register of disproved conjectures, structural complexity barriers, and known methodological traps for the P versus NP problem.

---

## 1. The Three Canonical Complexity Barriers

### 1.1 Relativization Barrier (Baker, Gill, & Solovay, 1975)
- **Theorem**: There exist recursive oracles $A$ and $B$ such that:
  $$P^A = NP^A \quad \text{and} \quad P^B \ne NP^B$$
- **Implication**: Any proof technique that simulates a Turing machine step-by-step or preserves truth when queries to an arbitrary oracle are added cannot resolve $P$ vs $NP$.
- **Rule**: Direct diagonalization and simulation techniques that relativize are strictly excluded.

### 1.2 Natural Proofs Barrier (Razborov & Rudich, 1997)
- **Theorem**: Suppose secure pseudorandom function generators exist in $P/\text{poly}$ (e.g. based on hardness of factoring, discrete log, or lattice problems). Then no combinatorial property $C_n$ of Boolean functions that is:
  1. *Constructive*: Decidable in time polynomial in the truth-table size $2^n$;
  2. *Large (Dense)*: Possessed by at least a $2^{-O(n)}$ fraction of all functions;
  can prove superpolynomial circuit lower bounds for general circuits ($P/\text{poly}$).
- **Rule**: Any candidate circuit lower bound must explicitly violate either constructivity or largeness (e.g., non-natural properties via algebraic geometry or algorithmic lower bounds).

### 1.3 Algebrization Barrier (Aaronson & Wigderson, 2008)
- **Theorem**: There exist algebraic oracles (extensions of oracles to low-degree polynomials over finite fields) $\widetilde{A}$ and $\widetilde{B}$ such that $P^{\widetilde{A}} = NP^{\widetilde{A}}$ and $P^{\widetilde{B}} \ne NP^{\widetilde{B}}$.
- **Implication**: Techniques that algebrize (including the polynomial method used in $IP = PSPACE$ and Interactive Proofs) cannot separate $P$ and $NP$.
- **Rule**: Non-algebrizing techniques are strictly mandatory.

---

## 2. Refuted Heuristics & Computational Traps

### 2.1 Heuristic / Average-Case Benchmark Conflation
- **Trap**: Observing that modern SAT solvers (CDCL, WalkSAT) solve industrial instances with millions of variables in seconds, and claiming this hints at $P = NP$.
- **Reality**: Worst-case instances (such as random 3-SAT at the phase transition $\alpha \approx 4.26$, Pigeonhole Principle formulas $PHP_n^{n+1}$, and Tseitin graph formulas) require provably exponential time for resolution and DPLL.

### 2.2 Unconditional Polynomial Hierarchy Collapses
- **Trap**: Assuming an unconditional collapse of the Polynomial Hierarchy ($PH = \Sigma_k^P$) without a complete constructive proof.
- **Rule**: Karp-Lipton ($NP \subset P/\text{poly} \implies PH = \Sigma_2^P$) is conditional; never treat conditional consequences as unconditional facts.
