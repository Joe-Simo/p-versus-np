# U12 — Equality track: compact algebraic aggregation versus hard coefficient extraction

Date: 2026-09-14
Status: proved structural equivalences and method limitation; no P versus NP resolution.

## 1. Motivation from U11

U11 showed that a linear-size CNF can have 2^m pairwise inequivalent residual Boolean functions after assigning m separator variables. A natural escape is not to merge those residual functions at all, but to represent all of them collectively by one compact algebraic object.

This note tests that idea.

## 2. U11 itself is algebraically compressible

For

    F_m(x,y) = AND_i (NOT x_i OR y_i),

an assignment alpha to x leaves

    R_alpha(y) = PRODUCT_{i: alpha_i=1} y_i.

Summing all residual monomials gives

    SUM_{alpha in {0,1}^m} R_alpha(y)
      = PRODUCT_{i=1}^m (1+y_i).

Thus U11's 2^m distinct residual functions admit a factorized arithmetic expression of size O(m), even though the expanded polynomial contains exactly 2^m squarefree monomials.

So exponential semantic-state count by itself is NOT a barrier to compact algebraic aggregation.

## 3. Exact finite verification

Wolfram Language was used to compare expanded monomial count with factorized expression size for

    PRODUCT_{i=1}^m (1+y_i),  1<=m<=10.

The expanded term counts were exactly 2^m: 2,4,8,...,1024, while the unexpanded expression had linear LeafCount growth (4,9,13,17,...,41 under the tested syntax). This computation is only a sanity check; the product identity proves the statement for every m.

## 4. Where the difficulty can move: coefficient extraction

Compact arithmetic representation does not imply that a desired coefficient can be read efficiently.

Given positive integers w_1,...,w_m and target T, define

    G(z) = PRODUCT_{i=1}^m (1 + z^{w_i}).

Expanding gives

    G(z) = SUM_{S subseteq [m]} z^{SUM_{i in S} w_i}.

Therefore

    [z^T] G(z)

is exactly the number of subsets S whose weights sum to T.

### Theorem U12.1 — coefficient nonzeroness is exactly SUBSET-SUM

For every instance (w_1,...,w_m,T),

    [z^T] G(z) > 0

if and only if there exists S subseteq [m] with

    SUM_{i in S} w_i = T.

### Proof

Each factor contributes either 1 (exclude i) or z^{w_i} (include i). Choosing one term from each factor is therefore in bijection with subsets S. The resulting exponent is the subset sum. Coefficients are nonnegative integers, so the T-th coefficient is positive exactly when at least one subset has sum T. QED.

Thus the decision problem for coefficient nonzeroness on this restricted family is literally the SUBSET-SUM decision problem, not merely reducible to something vaguely similar.

## 5. Compactness in the binary input model

If w_i is written in binary, z^{w_i} can be computed by repeated squaring using O(log w_i) multiplication gates. Hence G has a straight-line arithmetic circuit of size

    O(m + SUM_i log w_i),

up to standard gate/constant bookkeeping.

So a polynomial-size arithmetic circuit can compactly encode an exponential collection of subset choices even when the coefficient query remains computationally nontrivial.

## 6. Pseudo-polynomial dynamic programming does not give polynomial bit complexity

The standard coefficient table update

    D_i(t) = D_{i-1}(t) + D_{i-1}(t-w_i)

for 0<=t<=T runs in O(mT) arithmetic/table steps. This is polynomial in the numeric target T, but not necessarily in the input bit length log T. When T can be 2^{Theta(n)}, O(mT) is exponential in the binary input size.

Therefore replacing branch enumeration by a dense coefficient vector merely changes the parameter in which the exponential growth appears.

## 7. Independent exact check

Wolfram expanded G(z) on sample instances and compared Coefficient[G,z,T] with direct enumeration of subsets. The checked cases agreed exactly, including positive and zero coefficients. This finite computation validates the implementation of the identity on sample cases; Theorem U12.1 is the all-m proof.

## 8. Literature cross-check

Koiran and Perifel, “The complexity of two problems on arithmetic circuits,” Theoretical Computer Science 389 (2007), 172–181, study coefficient questions for arithmetic circuits. Their abstract explicitly emphasizes that arithmetic circuits can be exponentially more succinct than monomial lists while coefficient questions can remain hard; in particular they establish strong hardness for zero-mononomial-coefficient problems in general arithmetic circuits.

The present SUBSET-SUM equivalence is elementary and much more restricted; it does not rely on their theorem. The external result independently confirms that the compact-representation / hard-extraction phenomenon is well established in algebraic complexity.

## 9. Research consequence

The equality-side algebraic idea survives one test and fails another:

Positive:
- Exponentially many residual SAT states can sometimes be represented by a polynomial-size factorized polynomial.

Negative:
- A polynomial-size factorized polynomial does not imply that the coefficient/existence information needed for a decision can be extracted in polynomial time.
- On the family PRODUCT_i(1+z^{w_i}), coefficient nonzeroness exactly re-expresses SUBSET-SUM.

Hence a successful P=NP route cannot stop at “build a compact generating function.” It must supply a new polynomial-time extraction operation that avoids generic coefficient expansion and exploits additional structure strong enough to decide the encoded NP search.

## 10. What is NOT proved

1. This does not prove P != NP.
2. It does not prove coefficient extraction for every useful SAT-derived polynomial is hard.
3. It does not rule out a special algebraic invariant that decides SAT without asking a generic coefficient question.
4. It does not establish an arithmetic-circuit lower bound.

## 11. Next executable route

The next high-information question is whether SAT's own clause-satisfaction polynomial has a special evaluation identity that avoids generic coefficient extraction.

For a CNF F with clause-unsatisfaction indicators u_C(x), define on the Boolean cube

    P_F(x) = PRODUCT_C (1-u_C(x)),

which is 1 exactly on satisfying assignments and 0 otherwise. Then

    #SAT(F) = SUM_{x in {0,1}^n} P_F(x).

The next route should test exact variable elimination / multilinearization of P_F and identify whether a compact invariant survives on nontrivial high-width CNFs, or whether the computation becomes a known tensor-network / treewidth-style exponential elimination. The test must distinguish compact syntax from the complexity of exact summation.

No statement here resolves P versus NP.