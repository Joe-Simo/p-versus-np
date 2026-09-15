# U43 — Optimal low-degree anti-checkers with fully charged construction

Date: 2026-09-15
Status: proved restricted constructive result, exact finite audits, and an explicit obstruction to the proposed general-circuit extension. No P versus NP resolution.
Dependencies: U42's cost discipline. This is not a degree-truncation algorithm for SAT.

## 1. Positive target rather than another representation count

The corrected magnification route uses an anti-checker: a list of inputs on which every allowed small device disagrees with the target truth table at least once. We test both existence and construction in a comparison class where the algebra is exact.

Let P(n,d) be the Boolean functions represented by multilinear polynomials of degree at most d over GF(2). For every n>=1 and 0<=d<n, and every explicit N=2^n-bit truth table F outside P(n,d), we construct an anti-checker of **exactly 2^(d+1) distinct points**, using a Boolean circuit of **O(n*2^n+n^2) gates**. No anti-checker for that same comparison class and any target can use fewer points.

These geometric and interpolation facts are standard Reed-Muller phenomena, not a claim to invent a new coding theorem. The contribution to this research record is a self-contained extraction argument, explicit gate accounting, executable circuits, and a precise test of why they do not transfer to general circuit hardness.

## 2. Definitions and exact output contract

All addition below is modulo 2. A truth table F is indexed by points x in {0,1}^n. Its unique algebraic normal form is

    F(x) = sum over S subseteq [n] of a_S * product_(i in S) x_i.

A list Y is an anti-checker against P(n,d) when no g in P(n,d) satisfies g(y)=F(y) for every y in Y. Labels F(y) are actual target values, not guessed or supplied as additional advice.

The circuit outputs a validity bit and 2^(d+1) n-bit addresses. If F is outside P(n,d), validity is one and those distinct addresses form an anti-checker. If F is in P(n,d), validity is zero and the address outputs have no obligation. This is a total circuit with a specified behavior outside the output promise.

The input is the **entire truth table**, not a short CNF or a circuit that computes it. Thus near-linear complexity in N is exponential complexity in the original arity n. This distinction precludes a spurious P=NP interpretation.

## 3. Coordinate-face certificates

For i in [n], define the discrete derivative

    Delta_i F(x) = F(x) + F(x+e_i).

For J subseteq [n], derivatives commute and

    Delta_J F(x) = sum_(u subseteq J) F(x+1_u).

Here 1_u is the indicator vector of u, and vector addition is bitwise XOR. When |J|=d+1, every degree-at-most-d polynomial has Delta_J g identically zero. Therefore a coordinate face b+{1_u : u subseteq J} whose F-parity is one certifies disagreement with every such g.

This is one parity constraint on 2^(d+1) distinct labeled points. It is stronger than merely observing a nonzero high-degree coefficient: it returns an explicit small set on which no allowed polynomial can fit the target labels.

## 4. Existence and efficient selection of a violating face

Choose any S with a_S=1 and |S|>d, and choose any (d+1)-element subset J of S. On a monomial, Delta_i removes x_i if it is present and annihilates the monomial otherwise. Consequently,

    Delta_J F(x) = sum_(T containing J) a_T * product_(i in T\J) x_i.

Distinct T containing J give distinct T\J. In particular, the coefficient of x^(S\J) is a_S=1; there is no cancellation from another T. Thus Delta_J F is nonzero as a Boolean function. There exists y with Delta_J F(y)=1. Clearing the coordinates of y in J gives a base b without changing that derivative. The face b+{1_u:u subseteq J} is the desired certificate.

No maximality or uniqueness of S is required. This detail matters: the implemented selector chooses the first high-degree coefficient, not necessarily one of maximum degree.

Conversely, if all coefficients of degree>d vanish, every such derivative vanishes. The validity flag can therefore be computed exactly from the coefficients.

## 5. A circuit for selection, not an exponential list of candidate faces

Let r=d+1. The following is an explicit fan-in-two circuit, with constants, XOR, AND and OR and unrestricted fan-out.

### 5.1 Transform and choose a nonzero high coefficient

Apply the Boolean Mobius transform to the N input bits. In stage i, for each index S containing i, replace a[S] by a[S] XOR a[S\{i}]. There are n*N/2 XOR gates. Triangularity of the monomial evaluation matrix proves this computes the unique coefficients.

Set to zero the wires at indices of weight <=d; these indices are known when constructing the topology. A balanced priority encoder returns the first remaining nonzero index S and a validity bit. The encoder's fallback index is immaterial when no such coefficient exists.

For clarity, the priority encoder does not calculate all N one-hot flags and then separately OR them into every output bit. It recursively combines two encoders: OR their validity bits, select the appropriate child index by a multiplexer, and output the chosen half. For N=2^n, its gate count is at most

    sum_(j=0)^(n-1) [N/2^(j+1)]*(3j+2) < 5N.

The multiplexer is a XOR (s AND (a XOR b)), which uses three binary gates.

### 5.2 Pick r coordinate directions

Scan the n bits of S in a fixed circuit order. A capped one-hot counter records how many ones have occurred, stopping at r. Retain a bit if it is among the first r ones. This yields the mask J and the r rank-indexed one-hot axis vectors E_0,...,E_(r-1).

This circuit uses at most 5*n*(n+1) gates, uniformly for r<=n. On valid inputs S has at least r set bits, so the axes exist and are distinct. No enumeration over binom(n,r) directions is needed.

### 5.3 Compute the selected derivative over the whole table

Start with the input table. At each coordinate i, compute a XOR b for every pair of entries whose indices differ exactly at i. If i is selected, replace both members of each pair with that XOR; otherwise retain each member. This uses one XOR and two three-gate multiplexers per pair, hence at most (7/2)*n*N gates across all n stages.

The output is exactly Delta_J F. This is a sequence of N-wide conditional Boolean transformations with every gate charged, not a unit-cost operation on a vector of exponential dimension.

A second priority encoder, with at most 5N gates, finds a position y where the derivative equals one. On valid inputs such a position exists by Section 4. Clear the selected coordinates using at most 2n more gates, obtaining b.

### 5.4 Print the face

Set address[0]=b. For each nonzero r-bit mask z, let j be the position of its least significant set bit; this is a compile-time choice. Define

    address[z] = address[z without bit j] XOR E_j.

This requires n*(2^r-1) XOR gates and prints all points exactly once. It avoids a multiplexer over an exponentially stored catalog of faces.

### 5.5 Combined bound

The implemented unsimplified circuit satisfies the explicit upper bound

    gates <= 5*n*N + 10*N + 5*n*(n+1) + 2*n.

The n^2 term can be absorbed into O(n*N) for n>=1, but we retain it to expose the selection cost. Output length is 1+n*2^r bits. The topology can be generated in polynomial time in N and the output length; no precomputed answers to difficult instances are embedded. We claim neither small formula size nor constant depth.

For contrast, enumerating all r-dimensional coordinate faces uses binom(n,r)*2^(n-r) candidates. We retain that slower constructor as an independently structured finite verifier, but it is not the proof of the fast bound.

## 6. Why 2^(d+1) points are necessary

We prove the following interpolation lemma directly.

**Lemma.** For any set A of fewer than 2^(d+1) distinct points in {0,1}^n, every assignment of Boolean labels on A extends to a polynomial in P(n,d), provided 0<=d<n.

Consider the evaluation matrix whose rows are points in A and columns are squarefree monomials of degree<=d. If the matrix did not have full row rank over GF(2), some nonempty subset B of rows would sum to zero. Thus

    sum_(x in B) product_(i in T) x_i = 0

for every |T|<=d. We show by induction on d that any nonempty B with this property has |B|>=2^(d+1).

For d=0, the constant monomial says |B| is a positive even integer, hence |B|>=2.

For d>=1, the constant condition gives |B|>=2, so two distinct points differ in some coordinate i. Divide B by that coordinate into nonempty B_0 and B_1, and project both onto the other n-1 coordinates. Within each half the projection is injective. For every monomial m of degree<=d-1 on those remaining coordinates, the hypotheses applied to x_i*m and (1+x_i)*m give

    sum_(x in B_1) m(x)=0 and sum_(x in B_0) m(x)=0.

Both sets therefore satisfy the induction hypothesis, yielding |B_b|>=2^d for b=0,1. Hence |B|>=2^(d+1), as claimed.

Thus the matrix has full row rank whenever |A|<2^(d+1). Its coefficient-to-label map is surjective, proving the interpolation lemma. An arbitrary labeled list shorter than this cannot be an anti-checker. Repeated points do not help. Sections 3-5 attain exactly the lower bound for every nonmember F. QED.

This is an exact minimum-cardinality result. It is not a lower bound on computation time, and it must not be extrapolated from polynomial degree to general Boolean circuit size.

## 7. Two audited failures of the general-circuit extension

### 7.1 Explicit easy counterexample

The function AND_n(x)=product_i x_i has degree n but a binary circuit with n-1 AND gates. The extractor returns a certificate against P(n,d) for every d<n. Yet for every fixed beta>0 and c, eventually

    n-1 <= 2^(beta*n)/(c*n).

Consequently AND_n is a promised YES instance at the small-circuit threshold of U42. Declaring it circuit-hard from the degree certificate would violate the actual Gap-MCSP promise. This is not merely lack of a proof bridge: that direct extension is false. Taking d=n avoids the example only by making P(n,n) the entire truth-table space.

### 7.2 Stronger obstruction: no universal nonzero linear identity

Let C contain the constant-zero function and all squarefree monomials on n variables. In particular, general circuits with n-1 AND gates and free input/constant wires contain this family. There is **no** nonzero GF(2) linear functional lambda on N-bit truth tables, or nontrivial affine linear equation, that holds for every function in C.

Proof: the N squarefree monomial evaluation vectors are a basis of GF(2)^N. One way to see this is to order points and monomials by their support masks: the evaluation entry is one exactly when the monomial support is contained in the point support, giving an invertible triangular matrix with diagonal ones. If lambda annihilates all these vectors, lambda=0. If an affine equation lambda(F)=b holds on C, the zero function forces b=0, reducing to the same argument. QED.

Thus the parity-identity mechanism that makes the restricted certificates inexpensive cannot extend to all small general circuits, even when a different linear equation is chosen for each target: every equation claimed to be universal for that circuit class is trivial. This does **not** rule out anti-checkers themselves. Consistency with a non-linear family of circuits can impose non-linear restrictions even when its linear span is the whole space.

This pinpoints a useful distinction for the next attempt: the generator and verifier must use constraints on circuit descriptions or genuinely non-linear consistency, not a universal low-degree moment identity.

## 8. Computation and adversarial verification

The TypeScript code constructs both complete circuits, not just abstract functions. Exact bit-slicing tested **all 262,948 function/degree pairs** for n=1,2,3,4 and all 0<=d<n, evaluating two circuits per pair (**525,896 evaluations**). There were **227,940 nonmember pairs** and **455,880 returned certificates** checked. Every certificate was tested for distinct points, odd target parity and zero parity against every allowed monomial. Both circuits also reject AND_n as a member of the restricted class, as required for the counterexample.

The degree oracle uses the Mobius transform. To avoid depending on this same structure alone, the second circuit enumerates coordinate faces directly, and the independent Wolfram follow-up recovers coefficients by modular Gaussian elimination and locates faces by direct enumeration. For n<=3 it checked all **804** function/degree pairs, including **646** nonmembers, with no failures.

All nonzero dual supports for n<=4 were enumerated to verify minimum size 2^(d+1). Wolfram independently generated these supports by a modular nullspace basis; the results agree. A further **65,808** nonzero linear functionals for n<=4 were checked against all monomials and none was universal. Wolfram confirmed full monomial evaluation ranks through n=5.

For n=6,8,10,12, we constructed fast circuit topologies and counted gates at two degree cutoffs each. These larger builds are **not exhaustive semantic tests**. Their explicit size bounds passed, including n=12,d=11: 287,262 binary gates and 49,153 output wires.

The first submission of the additional Wolfram coefficient/face checker had one extra closing bracket and returned a syntax failure. It was corrected and rerun; the failed invocation is recorded separately and is not counted as mathematical evidence. Exact code and actual tool output are preserved. No proof assistant or external expert has certified the asymptotic proof.

## 9. Meaning for the project

This cycle succeeds at a restricted positive task: an optimal anti-checker is both found and output with near-linear work in its explicit input length. It also proves that its simple linear verification mechanism cannot witness the required hardness of general circuits. Neither statement is a resolution or evidence of proximity to one.

The live full-problem target remains the precisely quantified general-circuit theorem in U42. Future work must separately account for construction and for consistency with the **actual** small-circuit family. U40's free-terminal-label upper bound and this note's full-linear-span obstruction are mandatory counterexamples for any proposed bridge.

## Literature attribution

[1] Arnab Bhattacharyya, Swastik Kopparty, Grant Schoenebeck, Madhu Sudan, David Zuckerman. *Optimal Testing of Reed-Muller Codes*. https://arxiv.org/abs/0910.0641 ; PDF https://arxiv.org/pdf/0910.0641 . The paper studies randomized affine-flat tests of degree bounded functions. Its 2^(d+1)-query geometry is established background. Here we instead give a deterministic full-table, coordinate-face extractor with charged Boolean gates; we do not claim its existence or optimal support size is a new coding-theoretic phenomenon. The self-contained proofs above, rather than a statistical tester guarantee, establish our exact output contract.

[2] Oliveira-Pich-Santhanam (2021), cited and parameterized in U42. Its general-circuit class is not P(n,d). This model difference is the reason that the proposed direct extension fails.
