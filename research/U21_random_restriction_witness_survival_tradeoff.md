# U21 — Random restrictions: switching-style simplification conflicts with preserving a unique witness

Date: 2026-09-14
Status: proved method barrier for witness-oblivious restriction families; no P versus NP resolution.

## 1. Route

U20 proposed random restrictions/sparsification: transform a CNF into polynomially many restricted formulas, hoping each restricted instance becomes structurally easy while at least one still contains a satisfying assignment.

The decisive adversarial case is a formula with exactly one satisfying assignment a.

## 2. Random p-star restrictions

Consider the standard product distribution in which, independently for each variable,

- the variable is left unset (*) with probability p;
- it is fixed to 0 with probability (1-p)/2;
- it is fixed to 1 with probability (1-p)/2.

A fixed assignment a survives a restriction rho exactly when every fixed coordinate agrees with a.

### Lemma U21.1 — exact survival probability

For a fixed full assignment a,

    Pr[rho is compatible with a] = ((1+p)/2)^n.

### Proof

At each coordinate, compatibility occurs either because the variable is left unset (probability p) or because it is fixed to the correct bit (probability (1-p)/2). Thus the per-coordinate probability is

    p + (1-p)/2 = (1+p)/2.

Independence across n coordinates gives the product. QED.

## 3. Polynomially many restrictions cannot preserve a unique witness when a constant fraction is fixed

Take L(n) <= n^c independent samples. By the union bound, the probability that at least one sampled restriction is compatible with a fixed unique witness is at most

    n^c ((1+p)/2)^n.

If p <= 1-delta for any constant delta>0, then (1+p)/2 <= 1-delta/2 < 1, so this bound is

    exp(c log n - Omega(n)) = 2^{-Omega(n)}.

Hence polynomially many witness-oblivious random restrictions that fix a constant fraction of variables fail, with overwhelming probability, to preserve a unique satisfying assignment.

To obtain inverse-polynomial survival probability from polynomially many samples, one needs

    ((1+p)/2)^n >= n^{-O(1)},

which forces

    1-p = O((log n)/n).

So only O(log n) variables may be fixed in expectation.

## 4. Deterministic covering analogue

A restriction leaving exactly q variables free is compatible with exactly 2^q full assignments.

Therefore L such restrictions cover at most L*2^q assignments. Any witness-oblivious family guaranteed to preserve every possible unique satisfying assignment must satisfy

    L*2^q >= 2^n,

hence

    L >= 2^(n-q).

If L is polynomial in n, then necessarily

    n-q = O(log n).

Thus a polynomial-size universal restriction family can fix only O(log n) variables if it must cover every potential unique witness.

This is an exact counting statement, independent of probability.

## 5. Tension with switching-lemma simplification

Switching lemmas for bounded-width CNF/DNF become useful when a restriction leaves only a sufficiently small fraction p of variables alive; representative bounds have the form

    Pr[restricted decision-tree depth >= d] <= (C p k)^d

for k-CNF/k-DNF and an absolute constant C.

For fixed k, obtaining a base Cpk<1 requires p bounded away from 1 (indeed small enough as a function of k). Such a restriction fixes Theta(n) variables. By U21.1, a unique witness then survives only with exponentially small probability.

Conversely, choosing p=1-O(log n/n) so that polynomially many restrictions have a reasonable chance to preserve a unique witness leaves almost all variables alive and puts the switching-lemma factor Cpk far outside the useful small-p regime.

This establishes a concrete witness-preservation versus simplification tension for the naive combination of random restrictions with switching lemmas.

## 6. Numerical sanity check

Wolfram evaluated the survival probability ((1+p)/2)^n and n^5 times that value for representative n. For p=1/3, even n^5 samples give aggregate union-bound scale about 1.9e-24 at n=200 and 2.8e-75 at n=500. These are illustrations only; the asymptotic proof above is exact.

## 7. Literature context

- The Impagliazzo–Paturi–Zane sparsification lemma decomposes k-SAT into at most 2^{epsilon n} sparse k-CNFs, not polynomially many for fixed positive epsilon.
- Switching-lemma literature proves strong simplification under restrictions leaving a small fraction of variables unset; these restrictions are precisely in the regime where U21 shows unique-witness survival under witness-oblivious sampling is exponentially unlikely.

These known results are compatible with U21: they obtain useful simplification by paying subexponential/exponential branching rather than polynomially many witness-preserving restrictions.

## 8. Limitations

U21 does NOT rule out formula-dependent restrictions whose construction exploits syntax to steer toward a witness. It also does not rule out restrictions that preserve satisfiability through a more sophisticated transformation than literal compatibility with one original assignment.

The result blocks the direct route:

    polynomially many witness-oblivious strong random restrictions
    + switching-lemma simplification
    + OR over restricted instances.

## 9. Next route

Investigate formula-dependent branching/sparsification. The key question is whether one can derive a polynomial-size disjunction of tractable restricted instances by inspecting local clause structure, rather than sampling restrictions independently of the hidden witness. Existing sparsification produces 2^{epsilon n} instances, so the target is to identify exactly why reducing that count to poly(n) would require a qualitatively stronger theorem.

No statement here resolves P versus NP.