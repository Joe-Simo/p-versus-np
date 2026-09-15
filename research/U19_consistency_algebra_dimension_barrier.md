# U19 — Compositional consistency algebra: exact local annihilation needs exponential natural state space

Date: 2026-09-14
Status: proved for the explicit natural algebra; method barrier only; no P versus NP resolution.

## 1. Goal

U18 suggests constructing the satisfying-assignment fingerprint polynomial compositionally from clauses. The desired algebra should let compatible partial assignments multiply, while contradictory assignments annihilate automatically.

## 2. Natural partial-assignment algebra

For one Boolean variable introduce three semantic states:

    *  (unset), 0, 1.

For n variables, a partial assignment is a word p in {*,0,1}^n. Let e_p be a basis symbol. Define multiplication on basis elements by coordinatewise merge:

- *=b and b=* merge to b;
- b with b merges to b for b in {0,1};
- 0 with 1 (or 1 with 0) is inconsistent and the product is 0.

Extend bilinearly.

This algebra exactly enforces consistency of local assignment fragments: multiplying compatible fragments yields their union; any contradictory pair vanishes.

## 3. Lemma U19.1 — the natural basis has 3^n states

There are exactly 3^n partial assignments, hence the explicit basis {e_p} has dimension 3^n before any quotienting.

The subspace spanned by complete assignments alone has 2^n basis states.

Thus a direct dynamic program that stores an arbitrary algebra element by all coefficients is exponential.

## 4. Why the basis states are semantically distinguishable

Distinct partial assignments p != q differ at some coordinate or in whether a coordinate is set. They have different sets of compatible complete assignments. Therefore they cannot simply be identified if the representation is required to preserve exact future compatibility with every possible continuation.

More precisely, for each partial assignment p let Ext(p) be the set of complete Boolean assignments extending p. If p != q then Ext(p) != Ext(q): choose a coordinate where they differ; when one fixes 0 and the other fixes 1 the sets are disjoint on that coordinate, and when one is unset while the other fixes b, choose a completion with value 1-b. Hence exact continuation semantics distinguishes all 3^n states.

This proves an exponential lower bound for the number of equivalence classes under the specific equivalence relation 'same set of compatible complete continuations.'

## 5. Important limitation

This is NOT a lower bound on arbitrary arithmetic circuits representing algebra elements. As U12 demonstrated, exponentially many monomials/basis contributions can sometimes have a small factored circuit. Nor is it a lower bound on every conceivable algebra for SAT.

The result says only that the most direct consistency algebra does not solve the problem by reducing the semantic state count: its exact natural continuation semantics has 3^n distinct states.

## 6. Factorization question

A successful route would need a circuit representation of these algebra elements that remains polynomial-size under the sequence of clause combinations needed for arbitrary CNF. That is a closure question analogous to U14's DNNF barrier. Proving universal closure for a sufficiently expressive exact representation would be highly nontrivial.

## 7. Wolfram sanity check

Wolfram computed 3^n versus 2^n for n=1,...,12, reaching 531441 partial-assignment states versus 4096 complete assignments at n=12. This is only numerical illustration; the counting proof is exact for all n.

## 8. Next route

The algebraic equality track has now reached representation closure again. Rather than invent another unrestricted exact representation, investigate whether randomized hashing of the witness fingerprints can reduce the algebra dimension while preserving nonzeroness with useful probability. The key adversarial test is cancellation/collision when there is a unique witness versus many witnesses, and whether the hash range can be polynomial without losing one-sided detection.

No statement here resolves P versus NP.