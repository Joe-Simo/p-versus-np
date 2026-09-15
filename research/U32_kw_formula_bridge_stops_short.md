# U32 — Karchmer-Wigderson bridge: strong for formulas, insufficient for the current general-circuit magnification target

Date: 2026-09-14
Status: structural audit; no P versus NP resolution.

## 1. Motivation

U31 showed ordinary two-party communication complexity is capped at O(N), so generic circuit-to-protocol simulation cannot prove the N^{1+epsilon} general-circuit lower bound required by the Gap-MCSP magnification target. Karchmer-Wigderson (KW) games give a much tighter correspondence for formulas.

## 2. KW relation

For a Boolean function f, Alice receives x with f(x)=1 and Bob receives y with f(y)=0. Their task is to find an index i with x_i != y_i (with the appropriate monotone variant when f is monotone).

The classical KW correspondence relates deterministic communication complexity of this search relation to Boolean formula depth; refined protocol/tree measures correspond to formula size.

Thus communication lower bounds can yield strong formula lower bounds without the crude gate-by-gate simulation of U31.

## 3. Exact model mismatch

The U29 magnification theorem requires a lower bound against general Boolean circuits of size N^{1+epsilon} for the specified Gap-MCSP problem. Formula lower bounds do not imply comparable circuit lower bounds because formulas forbid fan-out/reuse while circuits allow subcomputations to be shared.

A function can require a large formula yet have a much smaller circuit. Therefore even a successful KW lower bound for Gap-MCSP would, absent an additional theorem, establish hardness only for formulas.

## 4. Why superlinear formula size is not enough

Suppose KW methods proved Gap-MCSP requires formulas of size N^{1+delta} or even much larger. This does not satisfy the premise

    Gap-MCSP notin Circuit[N^{1+epsilon}].

Circuit[N^{1+epsilon}] is a strictly more permissive model than Formula[N^{1+epsilon}], and exclusion from the smaller class does not exclude membership in the larger one.

Thus the logical implication direction is wrong for plugging a formula lower bound directly into the magnification theorem.

## 5. Research consequence

The communication/KW route is useful only if paired with a separate formula-to-circuit lifting/magnification theorem with quantitatively adequate parameters. We do not currently possess such a bridge in the project evidence. Assuming one would simply hide the central general-circuit lower-bound problem.

Therefore the current communication route stops at a restricted model, just like the DNNF/OBDD/treewidth routes on the equality side.

## 6. New direction

Target a property that speaks about general circuits directly. Meta-complexity suggests two possibilities:

1. useful properties / natural-proofs style: construct an efficiently recognizable property of truth tables that excludes all small circuits, then audit constructivity/largeness and known barriers;
2. witness extraction for small-circuit claims: return to the Pich-Santhanam style circuit-description-sensitive route, now informed by the locality lesson from U30.

The first is more directly testable: determine exactly why a polynomial-time recognizable property separating one explicit NP truth-table family from all size-N^{1+epsilon} circuits would already amount to a strong circuit lower bound, and whether largeness/constructivity invokes the natural-proofs barrier.

No statement here resolves P versus NP.