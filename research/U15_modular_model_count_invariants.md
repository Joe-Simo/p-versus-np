# U15 — Equality track: modular model-count invariants and an exact collision threshold

Date: 2026-09-14
Status: proved exact limitation and threshold statement; no P versus NP resolution.

## 1. Candidate decision-only invariant

After U14, avoid compiling all satisfying assignments. Instead try to decide SAT from a compact global statistic such as

    #SAT(F) mod m_1, ..., #SAT(F) mod m_r.

Since UNSAT formulas have #SAT=0, one might hope that a small collection of modular counts distinguishes zero from positive counts while avoiding exact counting.

This note isolates the exact information-theoretic limit of that idea.

## 2. Exact-q formulas of polynomial size

For every k and every integer q with 0<=q<=2^k, there is a polynomial-size CNF with exactly q satisfying assignments over its full variable set, using a deterministic comparator circuit plus Tseitin variables.

Construction: take k input bits encoding an integer X in [0,2^k-1], build a polynomial-size Boolean circuit computing [X<q], Tseitin-encode every gate equivalence, and force the output gate to 1.

Because the circuit is deterministic and every gate variable is constrained to equal its gate function, each input X has exactly one satisfying extension to the auxiliary variables. Exactly the q inputs X=0,...,q-1 satisfy the forced output. Hence the CNF has exactly q satisfying assignments.

For powers of two an even simpler construction suffices: fixing k-r variables and leaving r variables free gives exactly 2^r satisfying assignments.

## 3. Theorem U15.1 — collision for any bounded combined modulus

Let m_1,...,m_r be positive moduli and let

    L = lcm(m_1,...,m_r).

If L <= 2^k, then there exists a satisfiable polynomial-size CNF F and an unsatisfiable polynomial-size CNF U such that

    #SAT(F) ≡ #SAT(U) (mod m_j)

for every j.

### Proof

Choose F with exactly L satisfying assignments using the exact-q construction above. Choose any unsatisfiable CNF U, so #SAT(U)=0. Since each m_j divides L,

    L ≡ 0 (mod m_j)

for every j. Therefore all modular residues agree, although F is satisfiable and U is not. QED.

## 4. Corollary — parity and small-modulus summaries cannot decide SAT universally

Any invariant consisting only of #SAT modulo moduli whose least common multiple is at most the maximum possible model count admits SAT/UNSAT collisions.

In particular:

- parity alone cannot distinguish UNSAT from a formula with 2 satisfying assignments;
- #SAT mod 2^t cannot distinguish UNSAT from a formula with exactly 2^t solutions;
- any fixed finite list of constant moduli fails for sufficiently many variables.

## 5. Sharp information-theoretic threshold

There is also a converse at the level of information only.

If F has at most k unconstrained input bits so that

    0 <= #SAT(F) <= 2^k,

and L=lcm(m_1,...,m_r) > 2^k, then the residue vector is zero for all m_j if and only if #SAT(F)=0.

### Proof

If all residues vanish, L divides #SAT(F). The only multiple of L in [0,2^k] is 0. Conversely zero has all zero residues. QED.

So modular residues are not fundamentally too small to encode the SAT/UNSAT distinction: with enough combined modulus they can information-theoretically determine whether the count is zero.

The difficulty moves to computing those residues efficiently.

## 6. Why this does not yield P=NP

Taking enough primes so that their product exceeds 2^n gives O(n) or polynomially many bits of modular information, potentially enough to identify the exact count by the Chinese remainder theorem. But there is no established polynomial-time method for obtaining these #SAT residues on arbitrary CNFs.

Thus 'use modular counts' does not solve SAT unless the residue-computation step is supplied. The proposed invariant compresses output information, not necessarily computational work.

## 7. Wolfram sanity check

Wolfram exhaustively counted binary integers X<q for small k, confirming that the comparator predicate has exactly q accepting inputs in the tested range. This is only a finite implementation check; the counting claim follows directly from the definition of X<q.

## 8. Research consequence

The decision-only invariant route has a clean bifurcation:

- too little combined modulus -> explicit SAT/UNSAT collisions;
- enough combined modulus -> information suffices, but computing the invariant is essentially a modular counting problem and remains the missing algorithmic step.

This mirrors U12: compact output or representation does not by itself make extraction/computation easy.

## 9. Next route

The next promising decision-only attempt should use information easier to compute than exact modular model counts. Two candidates are:

1. randomized polynomial fingerprints / restrictions, where one seeks a one-sided test for nonzeroness of the Boolean satisfaction function;
2. spectral/Fourier summaries of the multilinear satisfaction polynomial, where low-degree information might be computable without full expansion.

The first decisive question is whether satisfiable and unsatisfiable CNFs can be separated by a polynomial number of efficiently computable low-degree or random evaluations without embedding an NP-hard subproblem in the evaluation step.

No statement here resolves P versus NP.