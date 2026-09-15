# U18 — Exact witness-fingerprint polynomial: SAT is formal nonzeroness, but construction is the hard step

Date: 2026-09-14
Status: proved exact equivalence and isolated the missing construction; no P versus NP resolution.

## 1. Motivation

U17 asked for a transformation from SAT witness existence to formal polynomial nonzeroness, so that polynomial identity testing could in principle become relevant. There is an elementary exact transformation at the semantic level.

## 2. Definition

For a CNF F on Boolean variables x_1,...,x_n, introduce marker variables y_1,...,y_n. For each Boolean assignment a in {0,1}^n define the squarefree fingerprint monomial

    M_a(y) = product_{i : a_i=1} y_i.

Define

    W_F(y) = sum_{a in {0,1}^n, F(a)=1} M_a(y).

Equivalently, W_F is the generating polynomial of satisfying assignments, indexed by their support sets.

## 3. Theorem U18.1 — exact nonzeroness equivalence without cancellation

Over every field K,

    F is satisfiable  iff  W_F is not the zero polynomial in K[y_1,...,y_n].

### Proof

Distinct Boolean assignments have distinct support sets, hence distinct squarefree monomials M_a. Every satisfying assignment contributes coefficient 1 to its own monomial and no other assignment contributes to that monomial. Therefore no two witnesses cancel, in any characteristic. W_F is zero exactly when there are no satisfying assignments. QED.

This avoids the root-existence/PIT mismatch of U17 at the semantic level.

## 4. Exact Boolean-sum representation

Let P_F(x) be any multilinear Boolean indicator of F on {0,1}^n. Then

    W_F(y)
      = sum_{a in {0,1}^n} P_F(a) product_i y_i^{a_i}.

A completely explicit selector form is

    W_F(y)
      = sum_{a in {0,1}^n} P_F(a) product_i [ a_i y_i + (1-a_i) ].

This expression has 2^n summands if written literally. The research question is whether, given compact CNF F, one can construct a polynomial-size arithmetic circuit for W_F without enumerating assignments.

## 5. Lemma U18.2 — polynomial-size construction plus PIT would give randomized SAT

Suppose an algorithm A maps every CNF F in polynomial time to an arithmetic circuit C_F of polynomial size and polynomial degree computing W_F. Then standard randomized polynomial identity testing applied to C_F decides SAT in randomized polynomial time with one-sided error: UNSAT gives the identically zero polynomial; SAT gives a nonzero polynomial.

If the relevant PIT were deterministic polynomial time, the same construction would give P=NP.

Thus the compact-construction problem is not bookkeeping. It is a major missing object.

## 6. Why naive clause multiplication does not construct W_F

The compact clause-indicator product P_F(x) from U13 evaluates F on Boolean assignments, but it does not retain a separate marker monomial for each assignment. To obtain W_F one must sum over the Boolean cube while preserving the y fingerprint. Algebraically this is a partition-function / variable-elimination computation:

    Sum_{x_1 in {0,1}} ... Sum_{x_n in {0,1}} P_F(x) product_i y_i^{x_i}.

Eliminating variables locally is easy when the factor graph has bounded width. For arbitrary CNF, intermediate factors can depend on many remaining variables; U09–U14 already documented analogous width/representation blowups. No polynomial bound for arbitrary CNF follows from this identity.

## 7. Independent finite sanity check

Wolfram was used on several explicit satisfying sets over three variables. It produced distinct squarefree monomials with coefficient 1 for each assignment, including multi-witness sets, confirming the no-cancellation fingerprint behavior in finite examples. This computation is only a sanity check; U18.1 is the universal proof.

## 8. Interpretation

This is a useful positive reformulation: arbitrary SAT *can* be transformed conceptually into polynomial nonzeroness with perfect witness isolation and no cancellation. The obstruction is no longer logical existence versus identity. It is computational: construct the witness-generating polynomial compactly from the CNF.

The route therefore becomes closely related to exact partition functions, algebraic branching programs, tensor-network contraction, and knowledge compilation. A universal polynomial-size construction would have major complexity consequences.

## 9. Next attack

Try to construct W_F compositionally from clauses using a different algebra than ordinary polynomials—exterior/nilpotent/idempotent variables, group algebras, or subset convolution—where inconsistent local assignments annihilate and consistent assignments combine automatically. Audit the dimension of the resulting algebra. The decisive question is whether consistency can be enforced without carrying 2^n basis states.

No statement here resolves P versus NP.