# U24 — Source boundary: bounded-occurrence hardness via expanders does not yet give the exact NP-hard expander-SAT theorem needed

Date: 2026-09-14
Status: literature-boundary record; no P versus NP resolution.

## 1. Question from U23

U23 constructed bounded-occurrence CNFs with expander primal/incidence structure and linear treewidth, but those explicit formulas were semantically easy. We asked whether the literature supplies the stronger statement that exact SAT remains NP-hard on bounded-occurrence instances whose relevant graph is itself an expander / necessarily has linear treewidth.

## 2. What the checked sources do establish

Papadimitriou–Yannakakis-style bounded-occurrence hardness reductions for MAX E3SAT use constant-degree expander graphs to duplicate variables while enforcing consistency. Later expositions and Haviv–Regev–Ta-Shma explicitly describe bounded-occurrence inapproximability/hardness reductions based on expanders (and superconcentrators for higher polynomial-hierarchy levels).

Separately, proof-complexity/benchmark work constructs SAT/CSP instances with highly expanding incidence graphs and relates expansion to resolution width/size.

These facts strongly support the relevance of expansion to hard bounded-occurrence constraint systems.

## 3. What was NOT verified

The checked sources did not, in the material inspected, establish the exact statement:

    exact 3-SAT is NP-complete even when the formula has bounded occurrence
    AND its primal or clause-variable incidence graph is a constant-degree
    vertex expander (hence has linear treewidth).

The MAX-3SAT inapproximability reductions and experimental/proof-complexity expander constructions are not automatically equivalent to this exact decision restriction.

Therefore U23 must remain a structural non-implication, not an NP-hardness theorem for expander-structured exact SAT.

## 4. Research consequence

The route "sparsification + treewidth" is still weakened by two independently verified facts:

1. bounded occurrence exact 3-SAT is NP-complete already at occurrence 4 (Tovey);
2. bounded occurrence does not imply small treewidth (U23 expander construction).

But combining those into one NP-hard family with both properties would require an additional reduction/source theorem not yet verified here.

## 5. Next mathematical option

Either construct such a reduction explicitly, carefully preserving exact satisfiability and expansion, or avoid depending on the combined theorem and move to a different invariant. A new reduction would need to prove:

- polynomial size;
- iff preservation of satisfiability;
- bounded clause width and occurrence;
- quantitative expansion / linear treewidth after gadget insertion.

Until all four are checked, no combined hardness claim is permitted.

No statement here resolves P versus NP.