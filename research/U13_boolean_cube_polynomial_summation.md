# U13 — Equality track: Boolean-cube polynomial summation and the multilinearization bottleneck

Date: 2026-09-14
Status: proved exact identities and refuted a tempting algebraic shortcut; no P versus NP resolution.

## 1. SAT satisfaction polynomial

For a Boolean CNF F over variables x_1,...,x_n, define for each clause C its unsatisfaction indicator

    u_C(x) = PRODUCT_{positive literal x_i in C} (1-x_i)
             PRODUCT_{negative literal NOT x_j in C} x_j.

On {0,1}^n, u_C(x)=1 exactly when C is false. Hence

    P_F(x) = PRODUCT_{clauses C} (1-u_C(x))

is 1 exactly on satisfying assignments and 0 otherwise. Therefore

    #SAT(F) = SUM_{a in {0,1}^n} P_F(a).

This is an exact algebraic encoding, not an approximation.

## 2. Unique multilinear representative

Modulo the Boolean relations

    x_i^2 = x_i,

every polynomial has a unique multilinear representative, denoted ML(P). P and ML(P) agree on the Boolean cube.

Thus

    #SAT(F) = SUM_{a in {0,1}^n} ML(P_F)(a).

## 3. Theorem U13.1 — Boolean-cube averaging identity

For every multilinear polynomial q(x_1,...,x_n),

    SUM_{a in {0,1}^n} q(a)
      = 2^n q(1/2,...,1/2).

### Proof

Write

    q(x)=SUM_{S subseteq [n]} c_S PRODUCT_{i in S} x_i.

For a fixed S, exactly 2^{n-|S|} Boolean assignments make PRODUCT_{i in S}x_i equal 1. Hence

    SUM_a q(a)
      = SUM_S c_S 2^{n-|S|}
      = 2^n SUM_S c_S (1/2)^{|S|}
      = 2^n q(1/2,...,1/2).

QED.

Therefore

    #SAT(F) = 2^n ML(P_F)(1/2,...,1/2).

At first sight this looks like a possible collapse of the exponential Boolean sum to one evaluation.

## 4. The tempting shortcut is false

One cannot in general replace ML(P_F) by the original compact product P_F:

    2^n P_F(1/2,...,1/2)

need not equal #SAT(F).

The reason is algebraic: the reduction x_i^2 -> x_i is valid on {0,1}, but substituting x_i=1/2 does not respect x_i^2=x_i. Evaluation at 1/2 is therefore not a ring homomorphism from the Boolean quotient ring.

### Smallest example

For one variable, take p(x)=x^2. On the Boolean cube p agrees with x, so

    SUM_{x in {0,1}} p(x)=1.

But

    2 p(1/2)=1/2,

whereas

    ML(p)=x,
    2 ML(p)(1/2)=1.

Hence 'evaluate the compact polynomial at 1/2' is invalid unless multilinearization has already been accounted for.

## 5. Independent exact Wolfram check

Wolfram Language reduced sample polynomials modulo {x^2-x,y^2-y}, explicitly summed them over the Boolean cube, and compared the result with evaluation before and after multilinearization.

Examples included:

- x^2: pre-multilinear evaluation fails, post-multilinear evaluation agrees;
- x(1-x): original evaluation at 1/2 is nonzero although the Boolean function is identically zero;
- (1-(1-x)(1-y))^2: the compact expression gives 9/4 after scaled midpoint evaluation, while Boolean-cube summation and the multilinear representative both give 3.

These finite checks support the exact algebra above; the proofs are symbolic and valid for all n.

## 6. Why multilinearization is the actual bottleneck

The quotient ring

    Q[x_1,...,x_n]/(x_1^2-x_1,...,x_n^2-x_n)

has vector-space basis

    { PRODUCT_{i in S} x_i : S subseteq [n] },

so its explicit coefficient-vector representation has dimension 2^n.

Multiplication followed by Boolean reduction obeys

    x_S * x_T = x_{S union T}.

Thus an algorithm that materializes the complete multilinear coefficient vector can require 2^n coordinates. U12 already warns that compact arithmetic-circuit syntax does not automatically make extraction operations easy.

This is a representation barrier, not an arithmetic-circuit lower bound: special polynomials may still have compact factored representations in the quotient ring.

## 7. Scalar summaries lose overlap information

A second tempting idea is to summarize each factor only by its Boolean-cube sum and combine those summaries. This cannot work for overlapping variables.

On one Boolean variable x,

    SUM_x x = 1,
    SUM_x (1-x) = 1,

but

    SUM_x x*x = 1,
    SUM_x x*(1-x) = 0.

So knowing the separate sums of two factors does not determine the sum of their product. Exact elimination must preserve correlation information about shared variables.

This is the same mechanism that makes variable elimination/tensor contraction depend on boundary width: shared-variable correlations, not merely individual factor counts, must survive.

## 8. Research consequence

The algebraic route has now passed through three increasingly precise stages:

1. U11: exponentially many residual Boolean functions can occur.
2. U12: they can sometimes be stored compactly, but useful coefficient extraction can encode NP-complete search.
3. U13: for SAT's own satisfaction polynomial, Boolean-cube summation reduces to midpoint evaluation only after exact Boolean multilinearization; ordinary compact evaluation fails, and overlap correlations must be retained.

A successful P=NP algebraic algorithm would therefore need a compact representation closed under Boolean multilinearized multiplication and elimination, together with polynomial-time extraction of the final scalar, for arbitrary CNFs. Merely having a compact ordinary arithmetic circuit is not sufficient.

## 9. Next executable question

Search for a representation class R satisfying all three properties:

1. every clause indicator has polynomial-size R representation;
2. R is closed under product plus Boolean reduction x_i^2=x_i with polynomial size growth;
3. summing/eliminating variables is polynomial-time in representation size.

Known restricted representations (bounded-width decision diagrams, bounded-treewidth tensor/factor decompositions, decomposable circuits) achieve variants of these properties only under structural restrictions. The next route should formalize the closure obstruction for one concrete representation rather than assert a universal impossibility.

No statement here resolves P versus NP.