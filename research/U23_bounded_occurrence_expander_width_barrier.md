# U23 — Bounded occurrence does not imply small treewidth: expander CNF families

Date: 2026-09-14
Status: proved structural non-implication; no P versus NP resolution.

## 1. Motivation

U22 showed that bounded occurrence alone is not a tractable endpoint: exact 3-SAT remains NP-complete at occurrence bound 4. A natural repair is to ask for bounded occurrence plus small treewidth/separators, enabling dynamic programming.

This note tests whether bounded occurrence itself helps force that second invariant.

## 2. Construction from a graph

Given a simple graph G=(V,E), create a monotone 2-CNF

    F_G = AND_{ {u,v} in E } (x_u OR x_v).

Then:

1. every variable x_v occurs in exactly deg_G(v) clauses;
2. the primal graph of F_G is exactly G, because x_u and x_v co-occur in a clause iff {u,v} is an edge.

Thus any graph-theoretic family can be realized directly as the primal graph of a bounded-width CNF, with variable occurrence equal to graph degree.

## 3. Expander consequence

Take an infinite family of constant-degree vertex expanders G_n on n vertices. Such families exist. Their maximum degree is a fixed constant d, so F_{G_n} has constant variable occurrence d and O(n) clauses.

At the same time, constant-degree expanders have treewidth Theta(n). One standard proof uses balanced separators: a graph of treewidth t has a balanced separator of size O(t), while an alpha-expander requires every balanced separator to contain Omega(n) vertices. Hence t=Omega(n); the trivial upper bound gives Theta(n).

Therefore the corresponding CNFs simultaneously have:

- constant clause width (2);
- O(n) clauses;
- constant variable occurrence;
- primal treewidth Theta(n).

## 4. Lemma U23.1 — no implication from bounded occurrence to sublinear primal treewidth

There is no function f(d)=o(n) depending only on a constant occurrence bound d such that every n-variable CNF of maximum variable occurrence at most d has primal treewidth at most f(d) (or even o(n)).

### Proof

Use the family F_{G_n} above for a fixed-degree expander family. The occurrence bound is fixed while treewidth grows linearly with n. QED.

## 5. Incidence-graph version

A similar phenomenon occurs directly for clause-variable incidence graphs: bounded-degree bipartite expanders have linear treewidth. By using a bounded-degree bipartite graph as an incidence pattern for a monotone bounded-width CNF, one obtains linear-size, bounded-occurrence formulas whose incidence graph still has linear treewidth.

Hence switching from primal to incidence treewidth does not make bounded occurrence imply small width.

## 6. Important limitation

The explicit F_G above is easy SAT: it is monotone and 2-CNF, so setting every variable true satisfies it. Therefore U23 is NOT a SAT lower bound and does not show that bounded-occurrence hard 3-SAT instances necessarily form expanders.

What U23 proves is a structural non-implication: sparsification/low occurrence cannot by itself guarantee the small-separator property needed by treewidth dynamic programming.

Combined with U22, the two facts are complementary:

- low occurrence does not imply easy satisfiability (4-occurrence exact 3-SAT is NP-complete);
- low occurrence does not imply low graph width (constant-degree expander CNFs have linear treewidth).

Thus an algorithm relying on both properties must establish the second property by a new formula-dependent transformation, not infer it from sparsity.

## 7. Literature facts checked

- Tovey (1984): exact 3-SAT remains NP-complete with each variable in at most four clauses.
- Constant-degree alpha-expanders have treewidth Theta(n); standard proofs proceed through the linear balanced-separator requirement of expanders.
- Treewidth and balanced-separator number are linearly related up to constant factors.

## 8. Next route

Test a different second invariant that is algebraic rather than graph-theoretic: rank of the clause-variable interaction over finite fields / low-rank factorization of the constraint tensor. The falsification target is a sparse bounded-occurrence family with full linear rank, showing that sparsity does not force algebraic low dimension either.

No statement here resolves P versus NP.