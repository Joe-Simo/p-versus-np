# U26 — Clause indicators live in polynomial low-degree space, but conjunction escapes by degree growth

Date: 2026-09-14
Status: exact algebraic audit; no P versus NP resolution.

## 1. Candidate idea

U25 rejects low ordinary incidence rank. A stronger possibility is to represent each width-3 clause by its exact multilinear Boolean indicator and work in the vector space of all degree<=3 squarefree monomials.

## 2. Clause-level compression is genuinely polynomial

On {0,1}^n, the indicator of a 3-literal clause is a multilinear polynomial of degree at most 3. The vector space V_{<=3} of all multilinear polynomials of degree <=3 has dimension

    D(n)=sum_{d=0}^3 binomial(n,d)=O(n^3).

Therefore every collection of 3-CNF clause indicators lies in a polynomial-dimensional linear space. This is a real positive structural fact: clause-level information does not require exponential dimension.

## 3. Why linear span alone does not encode conjunction

SAT needs the product/AND of clause indicators, not merely their linear span. Multiplying two multilinear degree-3 functions and reducing modulo x_i^2=x_i can have degree up to 6; after m clauses the exact conjunction can have degree up to min(n,3m).

Once degree reaches n, the full multilinear function space has dimension

    sum_{d=0}^n binomial(n,d)=2^n.

Thus polynomial clause-level dimension does not by itself give a polynomial-dimensional space closed under arbitrary conjunction.

## 4. Explicit degree-growth example

Take disjoint triples and clauses

    C_j = (x_{3j+1} OR x_{3j+2} OR x_{3j+3}).

The exact Boolean indicator is

    I_j = 1 - (1-x_a)(1-x_b)(1-x_c),

which contains the degree-3 monomial x_a x_b x_c with nonzero coefficient. For t disjoint clauses, the product product_j I_j contains the degree-3t monomial consisting of all 3t variables, with nonzero coefficient (the product of the degree-3 terms). No Boolean reduction lowers it because variables are disjoint.

Hence exact conjunction degree grows linearly with the number of disjoint clauses until reaching n.

## 5. Consequence

A strategy that stores the exact conjunction only through coefficients in a fixed degree-O(1) multilinear/Fourier space loses information on simple 3-CNFs. To remain exact under unrestricted conjunction, the degree cutoff must grow with the instance and can reach n, where the ambient basis is exponential.

This does not prove every circuit representation of the high-degree polynomial is exponential: the product of disjoint clause indicators itself has a compact factored expression. As in U12, degree/basis expansion and arithmetic-circuit size are different measures.

## 6. Research lesson

We have found another recurring separation:

- local constraints have low-degree polynomial descriptions;
- exact global conjunction can have high degree while retaining compact factorization;
- deciding whether that compact high-degree product has a Boolean witness remains the hard operation.

So low-degree rank compression is insufficient unless paired with an operation that preserves satisfiability while truncating or projecting high-degree interactions.

## 7. Next route

Test whether random low-degree projections can preserve zero-vs-nonzero on the Boolean cube for unique-witness formulas. U16 already shows additive approximation fails; the new question is algebraic projection of the exact witness-fingerprint polynomial rather than approximation of its value. Determine the minimum projection dimension needed to avoid mapping every possible single-witness monomial to zero/collision under one-sided correctness.

No statement here resolves P versus NP.