# U22 — Formula-dependent sparsification: bounded occurrence is not a tractable endpoint

Date: 2026-09-14
Status: literature-grounded structural audit; no P versus NP resolution.

## 1. Route after U21

U21 ruled out the direct witness-oblivious strategy of sampling polynomially many strong restrictions. The remaining possibility is formula-dependent branching/sparsification: inspect the CNF and produce a small OR of structurally simpler instances.

The first question is whether standard sparsity/low occurrence is itself sufficient structural simplification.

## 2. Best-known sparsification guarantee

For fixed clause width k and epsilon>0, the sparsification lemma expresses an n-variable k-CNF as an OR of at most

    2^(epsilon n)

k-CNFs in which each variable has bounded occurrence depending only on k and epsilon. Modern bounds give occurrence/sparsity parameter

    C(k,epsilon) = (k/epsilon)^{O(k)}.

Calabro–Impagliazzo–Paturi give a concrete guarantee of the form O((k/epsilon)^(3k)) for literal/variable occurrence quantities in their version.

This theorem is extremely useful for subexponential reductions, but for every fixed positive epsilon the number of branches remains exponential in n.

## 3. Forcing polynomially many branches destroys the constant-sparsity guarantee

If we formally choose

    epsilon(n) = c log_2(n)/n,

then

    2^(epsilon n) = n^c,

so the branch count becomes polynomial.

But substituting this epsilon into the known sparsity bound gives, for fixed k,

    C(k,epsilon(n)) = (k n/(c log n))^{O(k)},

which grows polynomially with n rather than remaining constant.

For k=3 and the explicit O((k/epsilon)^(3k)) bound, the guarantee becomes roughly

    O((3n/(c log_2 n))^9).

Thus the known theorem does not simultaneously provide polynomially many branches and a bounded-occurrence target class.

This is a statement about the parameter tradeoff in the known sparsification guarantee, not a lower bound proving that a stronger sparsification theorem is impossible.

## 4. More importantly: constant occurrence 3-SAT is still hard

Tovey (Discrete Applied Mathematics 8, 1984) proved that exact 3-SAT remains NP-complete when every variable appears in at most four clauses. In the same setting, if every variable appears in at most three clauses, the exact 3-SAT instances are in the trivial satisfiable regime (under the standard restrictions used in that result).

Therefore even an ideal sparsification that produced only 4-occurrence exact 3-CNFs would not place the branches in a polynomial-time class unless P=NP.

This is stronger than the parameter observation above: bounded occurrence per se is not the missing structural invariant.

## 5. Lemma U22.1 — OR-decomposition into a tractable class is already a SAT algorithm

Let T be any class of formulas whose satisfiability is decidable in polynomial time. Suppose a polynomial-time algorithm D maps every CNF F to polynomially many formulas G_1,...,G_r in T such that

    F is satisfiable iff at least one G_i is satisfiable.

Then SAT is in P.

### Proof

Run D(F), then run the polynomial-time T-decision algorithm on every polynomially many G_i and OR the answers. QED.

This is elementary but clarifies the burden: a polynomial-branch formula-dependent sparsifier into a genuinely tractable class is not a preprocessing lemma short of the goal. It is itself a P=NP algorithm.

## 6. The sharp 3-occurrence/4-occurrence warning

For the Tovey exact-3-SAT setting, trying to improve the target from occurrence 4 to occurrence 3 crosses directly from an NP-complete class to a trivial satisfiable class. Consequently, a polynomial-time OR-decomposition of arbitrary 3-SAT into polynomially many at-most-3-occurrence exact 3-CNFs would immediately decide 3-SAT: every nonempty output branch is satisfiable, so an unsatisfiable input would have to be recognized by producing no satisfiable branch.

Thus the decomposition algorithm would necessarily contain essentially the missing decision power.

## 7. Numerical parameter sanity check

Using epsilon=log_2(n)/n and the explicit k=3 exponent 3k=9, Wolfram evaluated the scale (3/epsilon)^9. While the branch count is only n, the bound grows rapidly (e.g. about 4.50e15 at n=128 and 2.44e22 at n=1024). These values only illustrate the asymptotic tradeoff; hidden constants are suppressed and no finite numerical claim is load-bearing.

## 8. Research consequence

The random-restriction/sparsification route now has two distinct obstructions:

1. witness-oblivious strong restrictions simplify but lose unique witnesses exponentially often (U21);
2. formula-dependent standard sparsification preserves solutions but pays 2^{epsilon n} branches, and its bounded-occurrence endpoint is not automatically tractable—4-occurrence 3-SAT is already NP-complete.

The missing structure must therefore be stronger than sparsity or bounded occurrence alone.

## 9. Next route

Investigate whether sparsification plus a second structural invariant—treewidth, incidence separators, or clause interaction rank—can become tractable on every branch. The cheapest falsification test is bounded-occurrence formulas whose incidence/primal graphs still have linear-width expander structure. If such families exist with NP-hard satisfiability, sparsity+width decomposition will fail for the same reason.

No statement here resolves P versus NP.