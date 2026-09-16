# U67 — Balanced four-row exact counting is #P-complete; the three-event union step is circular in general

Date: 2026-09-16. Status: self-contained reduction/audit building on U59 and U64-U66. No approximation hardness theorem, no unrestricted lower bound, no P-versus-NP resolution, and no novelty claim.

## 1. The proposed positive union

For a balanced four-row target, normalize columns by XOR with row 0, and write the target shape as a weight-two vector `y in F_2^3`. U64 proved that for the two final parent shapes `a,b`, the support of the integrated last gate is exactly

    E1 OR E2 OR E3,

where

    E1: a=y,
    E2: b=y,
    E3: a+b=y.

The final-gate multiplicity on this support is positive and lies in `{1,2,4}`.

This is a valid positive union, but it is not by itself a Karp-Luby algorithm. The classical union-of-sets method requires a count and a uniform sampler (or separately justified sufficiently accurate replacements) for each component set, plus membership testing. Here membership is trivial once a prefix type word is evaluated, but the first two component primitives are not supplied by the union identity.

## 2. Why E1 already contains the original problem

Take an arbitrary fixed-topology four-row instance whose designated gate output is `a` and whose requested normalized shape is y. Counting prefix descriptions in E1 is exactly counting descriptions for which `a` has that requested shape.

For a gate output, full columns with the two orientations of the same normalized shape have equal counts: complement the designated gate's truth table while leaving all other raw gate tables unchanged. This is a bijection, and any later gates that are unconstrained simply retain all sixteen choices. Hence the E1 shape count is exactly twice one chosen-orientation target count, up to the explicit factor `16^r` from any unconstrained later prefix slots.

Therefore a general exact counter/uniform sampler for the E1 component is already a general exact counter/uniform sampler for the balanced four-row output problem. Decomposing the final support into `E1,E2,E3` does not make the missing quantitative primitive cheaper.

This does not invalidate Karp-Luby. It says that **our current decomposition has not met its prerequisites**. On bounded-width topologies U66 supplies those component primitives—and in that regime the full weighted count is already exactly tractable without the union estimator.

## 3. Exact #P-completeness of balanced four-row counting

U59 established that exact fixed-topology two-row B2 type counting is #P-complete under polynomial-time Turing reductions, already for an unlike target pair.

Map any such two-row instance to four rows by duplicating the first sampled assignment twice and the second sampled assignment twice, with the same topology and the same raw gate-type word. Require balanced target

    0011.

Every raw type assignment produces a four-row output of form `(u,u,v,v)`. It equals `0011` exactly when the original two-row output equals `01`. The transformation is therefore parsimonious on raw type words.

If distinct sampled inputs are required, append two fresh dummy input bits that the topology never reads and choose four different dummy settings, for example

    (x0,00), (x0,01), (x1,10), (x1,11).

All four complete input assignments are then distinct while the circuit still evaluates in duplicated pairs. Thus the exact hardness transfer does not rely on literally repeated sample points.

Membership in #P is immediate: guess the `4s` gate-table bits and evaluate the explicit topology on four rows in polynomial time. Consequently:

**Theorem.** Exact balanced four-row fixed-topology B2 type counting is #P-complete under polynomial-time Turing reductions.

The hardness inherited from U59 is a Turing-hardness statement because U59's upstream reduction used interpolation. The row-duplication step itself is one-call and parsimonious.

## 4. Why this is not approximation hardness

The duplicated-row subclass has only two distinct circuit-evaluation rows. U59 already supplies a literature-based FPRAS for that two-row problem through DAG reliability. Therefore exact #P-completeness here is fully compatible with efficient randomized approximation.

No conclusion such as “no FPRAS unless NP=RP” or “#BIS-hard to approximate” is established for genuinely four-distinct-row balanced counting. Exact hardness is being used only to prevent an unjustified claim that the Karp-Luby component counts are elementary.

## 5. The shared-diamond audit

U66's three-gate shared prefix has 4,096 raw prefix words. The actual balanced favorable set contains 672. Multiplying the separately computed parent marginals as though the two parents were independent predicts 720. After applying the true `{1,2,4}` final-gate weights, the exact target count is 1,344 while the independent-parent calculation predicts 1,440.

The discrepancy is caused by the common ancestor gate, not finite-sample noise. This explicitly rejects a tempting implementation of the union estimator that samples E1/E2/E3 from independent copies of the two parent processes.

## 6. Positive tractable slice retained

U66's factor graph makes the balanced problem exactly solvable, and exactly uniformly samplable, for any supplied elimination order of induced width w in

    poly(s,q) * 2^(q(w+1))

integer-table work. At q=4 this is polynomial whenever `w=O(log s)` with a fixed constant in the bound. The rare repeated-predecessor family has exponentially small target density but width at most one, and is counted exactly by the closed formula `8^m/2`.

Thus rarity alone is not the obstacle, and shared correlation alone is not the obstacle on low-width graphs. The unresolved regime is arbitrary-width shared topology with four genuinely informative rows.

## 7. What remains open

The next useful question is whether the exact 16-state local-factor model from U66 has a general approximation property—correlation decay, a cluster/Polymer representation, a reduction to a known reliability problem, or an approximation-preserving hardness embedding. Any such claim must address arbitrary-width shared ancestry and the zeros in the local factors.

The anti-checker/magnification objective is still much farther away: it needs growing example sets and an ordinary general-circuit lower bound in the OPS2021 regime. Neither fixed-q exact #P classification nor bounded-width exact inference proves that premise.
