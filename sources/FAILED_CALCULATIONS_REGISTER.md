# Failed Calculations & Refuted Claims Register: The P versus NP Problem

Authoritative register of disproved claims, retracted papers, bugged lower-bound strategies, and refuted heuristics in the literature of the P versus NP problem.

The purpose of this register is to ensure that the autonomous research daemons and discrepancy hunters do **not** waste computational resources or cycle time re-evaluating known dead ends.

---

## 1. High-Profile Retracted Papers & Debunked Proofs

### 1.1 Norbert Blum (2017, arXiv:1708.03486)
- **Claimed Result**: "A Solution to the P versus NP Problem" ($P \ne NP$).
- **Proposed Mechanism**:
  - The author attempted to prove an exponential lower bound on the Boolean circuit complexity of the clique function (or Tardos' function) using the circuit approximation framework developed by Berg and Ulfberg (2001).
  - Blum claimed to extend the approximation method from monotone circuits to general non-monotone Boolean circuits by replacing NOT gates with an approximation operator $N(A)$ and establishing inductive error bounds.
- **The Fatal Flaw**:
  - In Theorem 6 of the preprint, Blum claimed that the error introduced by approximating NOT gates was sub-exponential. However, Berg & Ulfberg's method relies essentially on the monotonicity of the gate operations: in a monotone circuit, an approximation error (replacing a function by an approximator) only alters values monotonically in the Boolean lattice.
  - For general non-monotone circuits, the NOT gate inverts truth values ($0 \leftrightarrow 1$), meaning that an approximator that over-estimates the function on even a small fraction of inputs becomes an under-estimator that corrupts the entire output on an exponential fraction of inputs.
  - As pointed out by Luca Trevisan, Ryan Williams, and Alexander Razborov, the error accumulation in Theorem 6 is exponentially large ($2^{\Omega(n)}$), completely invalidating the lower bound.
  - The author formally retracted the paper on August 30, 2017.
- **Automated Filter**:
  - Any circuit approximation method that claims to handle NOT gates without an explicit, non-natural mechanism for bounding error propagation under lattice inversion is rejected.

### 1.2 Vinay Deolalikar (2010, HP Labs Technical Report)
- **Claimed Result**: "P != NP" via Finite Model Theory and Statistical Physics of Random CSPs.
- **Proposed Mechanism**:
  - Attempted to bridge descriptive complexity (Immerman-Vardi theorem: Least Fixed Point logic $FO(LFP) = P$ on ordered structures) with the geometry of solution spaces in random $k$-SAT (clustering, 1RSB condensation transitions from statistical physics).
  - Claimed that random $k$-SAT instances exhibit a clustered geometry that cannot be captured by $FO(LFP)$ inductive definitions, implying $3\text{-SAT} \notin P$.
- **The Fatal Flaws**:
  1. *Conditional Independence Fallacy*: Deolalikar modeled the clusters of solutions as a Markov Random Field and assumed that because clusters are far apart in Hamming distance, variables in different clusters are conditionally independent. Scott Aaronson, Terence Tao, and Michael Nielsen showed that conditional independence completely fails: long-range correlations between frozen variables persist across clusters.
  2. *Descriptive Complexity Order Mismatch*: Neil Immerman pointed out that $FO(LFP) = P$ holds **only** on finite structures equipped with an explicit, built-in total order $\le$. On unordered structures, $FO(LFP)$ is strictly weaker than $P$ (for example, it cannot even express whether the cardinality of an unordered set is even). Random formulas do not come with an intrinsic order, so the logic used by Deolalikar could not even express general polynomial-time algorithms.
- **Automated Filter**:
  - Automated hunters reject any argument that conflates solution cluster separation with probabilistic conditional independence.
  - Any descriptive complexity argument must verify that the logic is evaluated over ordered structures and accounts for arbitrary representation permutations.

### 1.3 Gerhard Woeginger's Archive of Failed Claims (100+ Papers)
- Gerhard Woeginger (TU Eindhoven) maintained the definitive historical archive of over 100 published and preprint attempts to resolve $P$ vs $NP$ between 1986 and 2020.
- **Common Failure Modes of Claimed $P = NP$ Proofs**:
  1. *Dynamic Programming State Collapse*: Defining a dynamic programming table for an NP-complete problem (e.g. 3-SAT, TSP, Subset Sum) and claiming polynomial runtime by "merging equivalent states" or pruning branches, while failing to prove that the number of distinct states remains polynomial in the worst case.
  2. *Greedy / Local Search Global Optimality Trap*: Claiming that local search heuristics (such as 2-opt, Kernighan-Lin, or gradient descent on continuous relaxations) always find the global optimum, overlooking exponentially deep local minima.
  3. *Unbounded Precision in Continuous Relaxations*: Simulating NP-hard problems using continuous dynamical systems or analog computers while requiring exponential precision in initial conditions (violating the polynomial bit-complexity model).
- **Common Failure Modes of Claimed $P \ne NP$ Proofs**:
  1. *Relativizing Diagonalization*: Attempting to diagonalize against all polynomial-time Turing machines without non-relativizing machinery.
  2. *Kolmogorov Complexity Conflation*: Proving that random strings have maximal Kolmogorov complexity and asserting that this implies high circuit complexity for specific problems like SAT. (SAT is highly structured, not random).

---

## 2. Canonical Structural Complexity Barriers

### 2.1 The Relativization Barrier (Baker, Gill, & Solovay, 1975)
- **Theorem**: There exist recursive oracles $A$ and $B$ such that:
  $$P^A = NP^A \quad \text{and} \quad P^B \ne NP^B$$
- **Mechanism**:
  - With an oracle $A$ that is PSPACE-complete (e.g. TQBF), $P^{\text{TQBF}} = NP^{\text{TQBF}} = \text{PSPACE}$.
  - With an oracle $B$ constructed by diagonalization to contain strings of length $n$ iff a certain property holds, $P^B \ne NP^B$.
- **What Fails**: Any proof technique that remains valid when the Turing machines are given access to an arbitrary oracle cannot resolve $P$ vs $NP$. This rules out standard simulation, clocking, and step-by-step diagonalization.
- **Automated Filter**:
  - Track 5 (`track5_barrier_compliance`) audits every proposed proof strategy: any candidate relying on pure step-by-step Turing simulation is tagged as `RELATIVIZING` and rejected.

### 2.2 The Natural Proofs Barrier (Razborov & Rudich, 1997)
- **Theorem**: Suppose pseudorandom function generators exist in $P/\text{poly}$ (which is implied by the existence of one-way functions, e.g. factoring or discrete log hardness). Then no property $\mathcal{P}$ of Boolean functions that is:
  1. *Constructive*: Given the $2^n$-bit truth table of $f$, $\mathcal{P}(f)$ can be decided in time $2^{O(n)}$;
  2. *Large*: At least a $2^{-O(n)}$ fraction of all $2^{2^n}$ Boolean functions satisfy $\mathcal{P}$;
  can prove that a function $f \notin P/\text{poly}$.
- **What Fails**: Most lower-bound techniques in circuit complexity (e.g. Hastad's Switching Lemma for $AC^0$, Razborov-Smolensky polynomial approximations for $AC^0[p]$, formal degrees, gate ranks) are natural proofs.
- **Automated Filter**:
  - Any circuit complexity lower-bound candidate is checked for constructivity and largeness. Proofs must exhibit explicit *non-naturality* (e.g. geometric invariant theory or algorithm-derived circuit lower bounds via Ryan Williams' framework).

### 2.3 The Algebrization Barrier (Aaronson & Wigderson, 2008)
- **Theorem**: There exist algebraic oracles $\widetilde{A}$ and $\widetilde{B}$ (oracles that allow queries to low-degree polynomial extensions over arbitrary finite fields) such that:
  $$P^{\widetilde{A}} = NP^{\widetilde{A}} \quad \text{and} \quad P^{\widetilde{B}} \ne NP^{\widetilde{B}}$$
- **What Fails**: Arithmetization techniques (which overcame the Relativization Barrier to prove $IP = PSPACE$ and $MIP = NEXP$) algebrize. Therefore, arithmetization alone cannot prove $P \ne NP$.
- **Automated Filter**:
  - Techniques that rely solely on low-degree polynomial extensions are flagged as `ALGEBRIZING` and rejected.

### 2.4 GCT No-Occurrence Obstruction Barrier (Ikenmeyer, Mulmuley, & Walter, 2017)
- **Proposed Framework**: Geometric Complexity Theory (Mulmuley & Sohoni) aims to prove $VP \ne VNP$ and $P \ne NP$ using algebraic geometry and representation theory of orbit closures. The original strategy was to find *occurrence obstructions*: irreducible representations that occur in the coordinate ring of the orbit closure of the determinant with multiplicity zero, but occur with positive multiplicity in the permanent.
- **Refutation**: Ikenmeyer, Mulmuley, and Walter (2017, *J. AMS*), and Bürgisser et al., proved that occurrence obstructions do **not** exist to separate the permanent from the determinant in characteristic zero.
- **What Fails**: Any attempt to separate algebraic complexity classes using multiplicity-free or occurrence-only representation theory is mathematically impossible. One must analyze *multiplicity obstructions* (where both multiplicities are strictly positive, but differ).
- **Automated Filter**:
  - Discard any GCT candidate that searches only for representation support (zero vs non-zero); only full multiplicity discrepancies are mathematically viable.

---

## 3. Computational Benchmark Fallacies (SAT & Heuristics)

### 3.1 Random SAT Benchmark Fallacy
- **Trap**: Observing that modern SAT solvers (CDCL, WalkSAT) solve uniform random 3-SAT instances with $N=10^4$ variables in milliseconds away from the phase transition, and claiming this demonstrates polynomial-time tractability.
- **Mathematical Fact**: Chvátal & Szemerédi (1988) proved that uniform random 3-SAT at clause density $\alpha = m/n$ near the satisfiability threshold $\alpha_c \approx 4.267$ requires resolution refutations of size:
  $$S \ge 2^{\Omega(n)}$$
  with probability $1 - o(1)$. No DPLL, CDCL, or resolution-based algorithm can ever run in polynomial time on these instances.
- **Automated Filter**:
  - Track 3 and Track 4 of the suite evaluate random 3-SAT precisely at the cliff $\alpha = 4.267$ and enforce exponential scaling checks.

### 3.2 Pigeonhole Principle ($PHP_n^{n+1}$) Resolution Barrier (Haken, 1985)
- **Trap**: Attempting to use clause learning or resolution to prove unsatisfiability of pigeonhole formulas in polynomial time.
- **Mathematical Fact**: Armin Haken (1985) proved that any resolution refutation of $PHP_n^{n+1}$ requires at least:
  $$2^{n / 20} = c^n$$
  clauses.
- **Automated Filter**:
  - Sieve Track 1 and Track 3 use exact integer clause tracking to verify the exponential resolution lower bound, automatically falsifying any algorithm claiming polynomial resolution proofs on $PHP$.

---

## 4. Register Summary Table

| Category | Reference / Target | Flaw / Barrier | Automated Action |
|---|---|---|---|
| **Retracted Paper** | Norbert Blum (2017, arXiv:1708.03486) | NOT-gate error explosion ($2^{\Omega(n)}$) in monotone approximations | Reject monotone network approximations applied to general circuits |
| **Debunked Draft** | Vinay Deolalikar (2010, HP Labs) | Conditional independence fallacy & unordered $FO(LFP)$ mismatch | Reject MRF cluster independence and unordered descriptive logic |
| **Barrier** | Baker, Gill, Solovay (1975) | Relativizing oracles ($P^A = NP^A, P^B \ne NP^B$) | Reject step-by-step Turing machine simulation arguments |
| **Barrier** | Razborov & Rudich (1997) | Natural Proofs: Constructive + Large properties cannot break $P/\text{poly}$ | Enforce non-naturality checks on circuit lower bounds |
| **Barrier** | Aaronson & Wigderson (2008) | Algebrizing oracles ($\widetilde{A}, \widetilde{B}$) | Exclude standard arithmetization / low-degree polynomial methods |
| **Barrier** | Ikenmeyer, Mulmuley, Walter (2017) | Occurrence obstructions do not exist for VP vs VNP | Reject zero-vs-nonzero GCT search; require multiplicity bounds |
| **Hard Benchmark** | Chvátal & Szemerédi (1988) | Exponential resolution lower bound $2^{\Omega(n)}$ for random 3-SAT | Reject heuristic scaling claims; verify exponential cliff |
| **Hard Benchmark** | Armin Haken (1985) | Exponential resolution refutation $2^{n/20}$ for $PHP_n^{n+1}$ | Verify exponential certificate length on pigeonhole formulas |
