# U09 — Equality track: separator-decomposition SAT algorithm and explicit exponential obstruction

Date: 2026-09-14
Status: verified partial algorithm audit; no P versus NP resolution.

## 1. Candidate algorithm

We test a structural SAT idea distinct from residual-formula memoization.

Given a CNF formula F, form its primal graph G(F): variables are vertices and two variables are adjacent when they occur together in a clause. Recursively choose a balanced vertex separator S, enumerate all 2^|S| assignments to S, simplify F, and solve the resulting disconnected components independently. Cache component solutions by their exact simplified formulas.

If every recursive subproblem had a separator of O(log n) variables and the decomposition remained balanced, this would suggest polynomial work per level and polynomially many levels. The question is whether arbitrary SAT instances admit such separators.

## 2. Correctness

The algorithm is correct regardless of separator size if all assignments to S are enumerated and all resulting components are solved exactly. Every satisfying assignment restricts to one enumerated assignment on S; after that restriction, disconnected components share no variables and can be solved independently. Conversely compatible satisfying assignments of all components plus the separator assignment satisfy the original formula.

Thus the issue is runtime, not logical correctness.

## 3. Lemma U09.1 — clique primal graphs force linear balanced separators

Let G=K_n. Define a balanced separator S to mean that every connected component of G-S has at most alpha n vertices for a fixed alpha<1 (for example alpha=2/3).

Then every balanced separator has

    |S| >= (1-alpha)n.

### Proof

K_n-S is itself a clique on n-|S| vertices and therefore is connected whenever nonempty. Balance requires n-|S| <= alpha n, hence |S| >= (1-alpha)n. QED.

For alpha=2/3, |S|>=n/3, so explicit enumeration of separator assignments costs at least 2^(n/3) branches at the root.

## 4. SAT formulas realizing K_n with linear-size clauses

A single clause containing all n variables already makes the primal graph K_n, because every pair co-occurs in that clause. But that formula is trivially satisfiable, and a sensible implementation would simplify it without separator branching.

Therefore graph density alone is not an adequate hardness certificate. We need formulas for which the algorithm's stated rules actually trigger the separator step after its preprocessing.

A more robust family is obtained by adding a dense clause to an arbitrary core H while preserving satisfiability equivalently using a fresh forced literal. For example, with fresh z, include the unit clause (not z) and the dense clause

    (z OR x1 OR ... OR xn).

This dense clause is then equivalent, under unit propagation, to (x1 OR ... OR xn), so unit propagation still leaves a large clause and a clique among the x variables. However this transformation changes H by imposing the extra disjunction and therefore is not equivalence-preserving for arbitrary H.

This attempted reduction is invalid as a universal hardness transfer. It is recorded rather than silently used.

## 5. Cleaner obstruction: bounded separator is simply false for arbitrary CNF primal graphs

Even without an NP-hard dense family, U09.1 is sufficient to refute the *runtime proof premise* that arbitrary CNFs have O(log n) balanced primal separators. CNFs can realize arbitrary graphs: for every graph G=(V,E), create a 2-CNF containing clause (u OR v) for each edge {u,v}. Its primal graph is exactly G.

In particular, taking G=K_n yields the monotone 2-CNF

    F_n = AND_{1<=i<j<=n} (x_i OR x_j),

whose primal graph is K_n. It is satisfiable (indeed assignments with at most one zero satisfy it), but under the candidate algorithm as specified, a balanced-separator step must choose Omega(n) variables and enumerate 2^Omega(n) assignments unless a separate preprocessing rule recognizes the easy structure.

Therefore the proposed general polynomial runtime cannot follow from separator width alone.

## 6. Preprocessing escape and adversarial requirement

One could add a special rule recognizing monotone formulas such as F_n. That defeats this particular example but not the graph-theoretic obstruction: the separator argument still provides no polynomial bound on arbitrary instances. To prove polynomial time after preprocessing, one must prove that every formula not solved by preprocessing has small separators, or otherwise bound the branching. No such theorem has been established.

Adding successively stronger polynomial-time preprocessing rules cannot be assumed eventually to cover all dense/high-treewidth formulas; that would itself need proof.

## 7. Relation to treewidth

The algorithm is essentially a variable-separator/treewidth dynamic program. Its natural complexity is exponential in separator width/treewidth and polynomial in formula size for bounded width. This is valuable for restricted SAT but does not imply P=NP because arbitrary primal graphs have treewidth Theta(n), including K_n.

## 8. Result

The separator-decomposition equality route is rejected as a general polynomial-time SAT algorithm in its present form. The exact failure is the unproved bounded-separator premise, with an explicit K_n primal-graph family forcing linear separators and exponential enumeration under the stated algorithm.

This does not prove SAT requires exponential time: another algorithm can exploit semantic structure ignored by the primal graph, as the monotone K_n example itself demonstrates.

## 9. Next equality-track target

A stronger structural algorithm must combine graph decomposition with semantics rather than graph width alone. The next candidate to audit is clause/variable incidence decomposition with algebraic or symmetry compression: group separator assignments by their induced boundary clause state rather than enumerate all assignments individually. The decisive question is whether the number of distinct boundary states can still be exponential on an explicit family.

No statement here resolves P versus NP.