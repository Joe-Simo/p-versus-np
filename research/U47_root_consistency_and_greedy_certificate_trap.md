# U47 — Charged root consistency and a greedy certificate trap

Date: 2026-09-15. Status: exact identities for circuit consistency and an explicitly checked counterexample to local cardinality optimization. No P versus NP resolution or claimed novelty.

## 1. An elimination relation that actually permits sharing

For n inputs and s>=1, let J_(s-1) be the set of pairs (A,B) of Boolean signal functions that are simultaneously available from one circuit prefix containing at most s-1 B2 gates, together with free inputs/constants. The word simultaneously is essential: separate descriptions of A and B are not the same resource as a joint prefix.

A target F has a circuit of at most s gates iff, for some (A,B) in J_(s-1), F is constant on each fiber of the map x -> (A(x),B(x)).

Proof. If F=g(A,B), equality of the pair implies equality of the output. Conversely, constant values on the nonempty fibers define a binary gate g; define its unused input patterns arbitrarily. Append that gate to the realizing prefix. Outputs that are already primary wires are included by a copy gate, and circuits with fewer than s gates are allowed. In the other direction, take the last relevant gate of a circuit for F. Its predecessors are jointly available from a prefix of at most s-1 gates. QED.

This is standard functional decomposition applied with explicitly charged joint realizability, not an unproved circuit lower bound.

## 2. A factored nonlinear polynomial, and where enumeration remains

Let Z_x denote the target truth-table coordinate at x. For a pair (A,B), select one representative r from every nonempty fiber B_r and define over GF(2)

    E_(A,B)(Z) = product_r product_(x in B_r, x != r) (1 + Z_x + Z_r).

On Boolean Z this equals one exactly when the target is constant on every fiber. Therefore

    P_s(Z) = product_((A,B) in J_(s-1)) (1 + E_(A,B)(Z))

vanishes exactly on the truth tables of size-at-most-s circuits.

Repeated pairs with the same fiber partition may be merged. This does not change the zero set. The expression is a genuine nonlinear consistency test, not a linear-span surrogate. Its fan-in-two arithmetic/Boolean implementation can evaluate each E in O(N) gates, so the direct total cost is O(N * number_of_profiles). That is an upper bound for this implementation, not a lower bound for all implementations.

Producing J from circuit descriptions is still expensive in general. Straight enumeration has 2^(O(s log(n+s))) candidates up to polynomial factors; neither the definition of J nor the compact notation for the product makes that search free. Likewise a compact high-degree polynomial is not automatically efficiently constructible. Boolean multilinear reduction of the displayed polynomial does not by itself bound the size of a circuit that computes it.

For the actual three-gate test, the exact jointly available pairs after two gates yield:

| n | Joint pairs | Distinct fiber partitions | Functions accepted |
|---|---:|---:|---:|
| 3 | 1,725 | 329 | 232 |
| 4 | 6,877 | 1,536 | 3,000 |

Both complete accepted sets match the independently generated formula class and every raw three-gate circuit. These are explicit finite constructions, not arbitrary terminal labels. The formula equality follows from U46's special three-gate topology lemma and must not be assumed at other budgets.

## 3. Joint cost cannot be replaced by the sum of individual costs

On four inputs a,b,c,d, take

    h = a AND b,
    A = h OR c,
    B = h OR d.

Each of A and B has minimum B2 size two because it depends on three essential inputs and has the displayed two-gate realization. The pair is jointly computed with three gates, not four. Two gates cannot jointly output the two distinct functions: both are non-primary outputs, so one would have to be the first gate, which cannot depend on three inputs.

Thus the exact joint cost is three while the sum of individual minimum costs is four. The source code provides the actual shared net and checks the truth tables 63736 and 65416.

This is a multi-output resource example, **not** a proof that a single-output function separates formula and circuit size. In fact,

    (h OR c) XOR (h OR d) = (NOT h) AND (c XOR d),

so a final XOR combines the pair into a function with a three-gate formula. Reoptimization of the complete output matters. The failure of additive accounting for a chosen pair does not establish an unavoidable gap for its final Boolean output.

## 4. Minimum certificate extraction is a hitting-set problem

For a fixed target F and a finite comparison class C, put

    D_G = {x : F(x) != G(x)} for G in C.

A set S of labeled inputs excludes every G iff S intersects every D_G. This is exactly the hitting-set condition. If F belongs to C then one D_G is empty and no certificate exists. Otherwise a finite hitting set always exists, for example the full domain.

A certificate is **inclusion-minimal** if deleting any one point destroys the property. It is **minimum-cardinality** if no smaller certificate exists anywhere. The first condition does not imply the second. U46 computes minima by complete enumeration, not by conflating the two conditions.

Conversely, any explicit family of nonempty subsets {D_i} of a finite universe can be represented by F=0 and comparison functions G_i equal to the indicators of D_i. Thus arbitrary explicit-class certificate minimization is exactly a general hitting-set instance. This elementary reduction is not a hardness theorem for the *complete class of all size-s circuits*: listing selected candidate circuits can omit other size-s functions, changing the question.

## 5. An eleven-point local minimum where seven points suffice

The complete three-gate class on four input variables gives a concrete counterexample inside an actual circuit-size class, without arbitrary selected candidates.

Use target truth table F=14366 (bit x is F(x)), and fixed-position mask M=15838. The eleven positions of M are

    {1,2,3,4,6,7,8,10,11,12,13}.

Every size-at-most-three B2 circuit disagrees with F somewhere on those positions. But after deletion of each point, a fitting three-gate circuit exists. The following table lists one fitting truth table for each deletion:

| Deleted position | Fitting table |
|---|---:|
| 1 | 30780 |
| 2 | 14906 |
| 3 | 64054 |
| 4 | 30735 |
| 6 | 64095 |
| 7 | 64190 |
| 8 | 15167 |
| 10 | 15390 |
| 11 | 12351 |
| 12 | 10815 |
| 13 | 23070 |

Actual gate/formula realizations for these fitters are in the raw result file, checked independently at every input. Wolfram independently regenerates the class and confirms the table above.

Nevertheless the seven-point mask 3599,

    {0,1,2,3,9,10,11},

also excludes every circuit in the same class, using the same F-labels. Seven is the true minimum, established by both complete finite implementations.

A deterministic single-deletion shrinker starting from all sixteen points can get trapped at M: attempt deletions in the order

    0,5,9,14,15, then 1,2,3,4,6,7,8,10,11,12,13.

The first five deletions preserve the eleven-point inconsistent pattern. None of the remaining deletions succeeds because M is inclusion-minimal. The code executes this sequence and saves each step. Finding a seven-point certificate requires changing the selected set, not just deleting from this particular local minimum.

The full four-variable enumeration contains 97,216 inclusion-minimal inconsistent patterns: 4,160 of size 7; 12,288 of size 8; 58,880 of size 9; 20,736 of size 10; and 1,152 of size 11. Yet every complete outside truth table has a minimum certificate of size at most 9. The two different distributions measure different objects and are both retained.

## 6. What this does and does not rule out

This counterexample rejects the claim that greedy single-point deletion always finds an optimal anti-checker, even for three-gate circuits. It does not rule out polynomially short certificates, approximate minimization, a better adaptive generator, or the magnification program. The magnification theorem does not require exact minimum cardinality, and a ratio of eleven to seven in a fixed instance is not an asymptotic lower bound.

The generic factored root identity is a positive exact formulation but still enumerates jointly realizable intermediate behavior. Replacing that family by independent minimum output costs would lose information; compiling it by truth tables would hide computation unless its construction and evaluator were charged.

## 7. Follow-up and stopping point for this bounded route

The planned third-gate test is complete: sharing was explicitly allowed, the only three-node internal reconvergence collapses in B2, and a sharp nine-point certificate theorem follows from a finite core. Repeatedly increasing a fixed gate budget is not yet a route to the growing budgets required by P versus NP.

The next full-target experiment should distinguish **short arbitrary certificates** from **efficiently generated size-gap anti-checkers**, rather than optimize constants in minimum-cardinality extraction. In the exact OPS2021 thresholds, test input-oblivious/uniform sampling against sparse truth tables that are hard by a counting argument, and then examine which formula-dependent choice the source anti-checker construction uses. Charge every search or oracle used to obtain that choice. U45's sparse-table construction supplies a useful check on the parameter calculation, but no claim of a general-circuit lower bound has been established.

Sources: functional decomposition is background, with the fiber criterion proved in Sections 1-2. OPS2021 is the fixed external target as cited in U42 and U46. No theorem about the hardness of minimum certificates, no conjectural circuit/formula gap, and no cryptographic assumption is used in the results above. No novelty claim is made.
