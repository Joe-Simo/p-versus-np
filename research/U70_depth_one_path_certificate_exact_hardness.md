# U70 — Depth-one path-certificate counting is exactly #P-complete

Date: 2026-09-16. Status: self-contained exact reduction plus finite independent checks. No approximation-hardness result, no P-versus-NP resolution, no formal-kernel or external expert certification, and no novelty claim.
Dependencies: U67's exact #P-completeness of balanced four-row fixed-topology output counting. The new reduction below is explicit.

## 1. The path-certificate counting problem

Fix four sampled input rows. A disagreement path for a row pair `(i,j)` is a path in the supplied circuit topology from a designated signal back to an initial signal such that every signal on the path takes different values on rows `i,j`. A fixed path certificate specifies one or more such paths in advance. The counting problem asks for the number of raw B2 gate-type assignments satisfying every required disagreement on those fixed paths.

All sixteen binary Boolean tables are raw gate types. Gate positions, predecessor indices, dead gates and multiplicities are retained exactly.

**Theorem U70.1.** Exact fixed path-certificate counting on four rows is #P-complete under polynomial-time Turing reductions. Hardness already holds when the certificate uses only one newly appended gate, every certified path has length one, and the certificate requires at most two row-pair disagreements.

This is an exact classification only. The particular hard probes below are dense and have trivial randomized approximation and exact rejection sampling.

## 2. Local simultaneous-disagreement count

Let the two parent columns of one B2 gate be `a,b in {0,1}^4`. For a row `r`, the gate consults truth-table address `u_r=(a_r,b_r)`.

Suppose a local certificate requires the output to differ on a set D of row pairs. Introduce the four truth-table output bits. Each required pair `(i,j)` contributes the affine GF(2) equation

`x_(u_i) + x_(u_j) = 1`.

Therefore the number of raw gate types satisfying the local requirements is zero if this four-variable affine system is inconsistent, and otherwise `2^(4-r)` where r is its coefficient rank.

The checker compares this formula with literal enumeration for all `16*16*64 = 16,384` choices of `(a,b,D)` and finds no mismatch.

### Small route-only failure

Take selected predecessor column `a=0001` and route both pairs `(0,1)` and `(0,3)` through it. The selected predecessor differs on both pairs.

- side column `b=0000`: the two requirements become the same truth-table inequality and 8 gate types work;
- side column `b=0010`: they become two independent inequalities and only 4 gate types work.

Each row-pair requirement alone has 8 satisfying types. Thus route shape alone does not determine the component weight; the side-parent sampled column matters.

## 3. Eight depth-one probes recover the complement-paired output distribution

Let P be any supplied four-row prefix topology with designated gate output O. For `b in {0,...,15}`, let `N_b` be the number of raw type assignments to P producing sampled output column b.

Choose a fresh input bit whose values on the four sampled rows form a fixed column a. Append one new gate G with parents `(a,O)`. For a set D of row pairs on which a differs, certify every pair in D by the length-one path `G -> a`.

Given `O=b`, the number of possible raw types for G is `w_(a,D)(b)`. Input complementation of the second argument permutes the sixteen B2 tables, so `w_(a,D)(b)=w_(a,D)(NOT b)`.

Write `C_c=N_c+N_(c xor 15)` for `c=0,...,7`. For eight explicit probes the exact weight matrix is

```text
8 8 8 8 8 8 8 8
8 8 4 4 4 4 8 8
8 8 4 4 8 8 4 4
8 8 8 8 4 4 4 4
8 4 8 4 4 8 4 8
8 4 8 4 8 4 8 4
8 4 4 8 8 4 4 8
8 4 4 8 4 4 4 4
```

The probe specifications `(a,D)` are

```text
(1,{01})
(1,{01,02})
(1,{01,03})
(1,{02,03})
(2,{01,12})
(2,{01,13})
(3,{02,12})
(3,{03,12})
```

The determinant is `2,097,152 = 2^21`, so the matrix is invertible. If `Q_i` is the exact count returned by the i-th path-certificate instance, then `Q=M C`. Because M is fixed 8-by-8, recovering C uses constant-dimensional exact arithmetic with polynomial bit complexity.

TypeScript, independent Python and independent Wolfram all reproduce the matrix, determinant, complement invariance and 8-versus-4 route counterexample.

## 4. Exact #P-hardness

U67 proves exact balanced four-row fixed-topology output counting is #P-hard under polynomial-time Turing reductions.

Take such an instance P with designated output O being a gate. Use the eight probes above. Their exact counts recover every complement-paired output count `C_c`.

Because O is itself a gate, complementing only O's raw truth table gives a fixed-point-free involution on raw descriptions that complements the sampled output column while leaving the earlier prefix unchanged. Hence `N_b=N_(b xor 15)` and each oriented count is half its complement-paired count.

Thus eight calls to exact depth-one path-certificate counting recover the exact target count of the original U67 instance. Membership in #P is immediate: guess all raw gate types and verify the fixed path disagreements by evaluating four rows. Therefore exact fixed path-certificate counting is #P-complete under polynomial-time Turing reductions.

A fresh input bit can realize the required four-row column a; unused dummy bits can make the four full sample assignments distinct if desired.

## 5. Why this is not an approximation barrier

Every entry of the eight probe matrix is either 4 or 8. Conditioned on any raw type assignment of P, a uniformly random type for the appended gate satisfies the probe certificate with probability at least `1/4`.

Therefore each probe has an exact uniform rejection sampler with at most four expected proposals, and Bernoulli estimation gives an elementary FPRAS for the probe count.

So the same restricted problem is #P-complete for exact counting while the hard-reduction probes are extremely easy to approximate and sample. This theorem is not evidence against an FPRAS for the arbitrary balanced favorable event.

## 6. Interpretation

The path-certificate idea does not fail because overlap is hard to recognize. Exact component counts can inherit the entire side-parent output-distribution problem even when the certified paths themselves have length one.

The mechanism is explicit: simultaneous disagreement requirements impose affine constraints on the same four B2 truth-table bits, and their rank depends on the actual sampled side-parent column. Side ancestry therefore cannot in general be erased from an exact component counter.

U71 separately shows that the number of certificates witnessing a sampled favorable word is easy to compute. That leaves component sampling/approximate counting—not overlap multiplicity—as the live Karp-Luby bottleneck.
