# U27 — Linear projection of witness fingerprints: what one-sided unique-witness preservation really requires

Date: 2026-09-14
Status: exact linear-algebra audit; no P versus NP resolution.

## 1. Target

U26 proposed projecting U18's witness-fingerprint polynomial into a polynomial-dimensional algebra while preserving SAT-vs-UNSAT, especially for unique-witness formulas.

Let V be the 2^n-dimensional vector space over a field K with basis {e_a : a in {0,1}^n}, one basis vector per Boolean assignment. The exact witness fingerprint of a formula is

    w_F = sum_{a : F(a)=1} e_a.

Consider a linear map L: V -> K^d.

## 2. Unique-witness preservation alone is surprisingly cheap

For formulas promised to have either zero or exactly one witness, one-sided correctness only requires

    L(e_a) != 0 for every assignment a.

This does NOT require d >= 2^n. A one-dimensional map can satisfy it: for example over any field, set L(e_a)=1 for every a. Then zero witnesses map to 0 and every unique witness maps to 1.

Thus a naive dimension-counting claim that unique-witness preservation alone forces exponentially many output dimensions is false.

This is an important correction: collisions among different unique witnesses are harmless if the only decision is zero versus nonzero.

## 3. Why the one-dimensional map does not solve SAT

For a general formula,

    L(w_F)=#SAT(F)

under the all-ones map. Over characteristic zero this is nonzero iff F is satisfiable, so the *information* is sufficient. But computing L(w_F) from a compact CNF is exactly model counting, the bottleneck already isolated in U13/U18/U20.

Over finite characteristic p, nonempty witness sets of size divisible by p can cancel to zero.

Therefore projection dimension is not the central obstruction. Computational accessibility of the projected aggregate is.

## 4. Degree truncation fails even on unique witnesses

A different proposed projection keeps only marker monomials of degree <=d. A unique assignment a of Hamming weight >d has fingerprint monomial e_a (equivalently product_{i:a_i=1} y_i) entirely outside the retained subspace and projects to zero.

Hence any fixed degree d<n fails one-sided preservation for unique witnesses of sufficiently large Hamming weight.

For d=O(log n), the number of retained monomials is polynomial/quasipolynomial depending on the constant/regime, but most possible witnesses are discarded. Wolfram counts illustrate the fraction: at n=64,d=6 only about 4.5e-12 of all squarefree fingerprints have degree <=6.

Randomly permuting variables does not change Hamming weight, so it cannot repair simple degree truncation.

## 5. Random dense linear projections

A random linear map to even one field element can send every fixed nonzero w_F to nonzero with high probability if the coefficients multiplying basis vectors are chosen independently from a large field. But specifying 2^n independent random coefficients is itself exponential.

Using a succinct pseudorandom coefficient function r(a) makes the projected statistic

    S_r(F)=sum_{a:F(a)=1} r(a).

Again, the key question is whether S_r(F) can be computed from F in polynomial time. Merely having a succinct formula for r(a) does not make the exponentially large constrained sum easy.

## 6. Research conclusion

The proposed lower bound 'one-sided unique-witness preservation requires exponential projection dimension' is refuted. Dimension can be 1.

The stronger and correct bottleneck is:

    find a projection/aggregate that is both informative for SAT and efficiently computable from arbitrary CNF.

Every simple informative projection encountered so far is a weighted model count or partition function.

## 7. Next route

Instead of lower-bounding projection dimension, classify which succinct weight functions r(a) make

    sum_{a:F(a)=1} r(a)

polynomial-time computable for arbitrary CNF. Start with product-separable weights r(a)=product_i r_i(a_i), low-rank tensor weights, and characters/parities. Determine whether any such tractable family can preserve nonzeroness for all satisfying sets without effectively computing #SAT.

No statement here resolves P versus NP.