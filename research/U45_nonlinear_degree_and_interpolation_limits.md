# U45 — Nonlinear degree limits from sparse tables, and a separate interpolation bound

Date: 2026-09-15. Status: self-contained elementary derivations and exact finite checks; no P versus NP resolution or formal/expert verification.
Dependencies: U44's B2 cost convention, elementary polynomial interpolation on the Boolean cube. No cryptographic or unproved complexity assumption is used.

## 1. The next proposed extension

U44 found a cubic equation describing the three-input two-gate function class exactly. Could a low-degree equation in the N=2^n truth-table entries similarly vanish on all small general circuits, allowing its violation to certify the required magnification gap?

Here degree is in truth-table coordinates Z_x, NOT the algebraic degree of F as a function of its n original inputs. Also distinguish polynomial degree, number of monomials, number of involved coordinates, evaluation circuit size, and the number of labeled samples in an anti-checker.

We prove that any nonzero such equation must have degree at least floor((s+1)/n)+1 when the allowed original circuit budget is s (n>=2, in the nontrivial regime). Thus no fixed-degree family of identities can certify hardness against the growing budgets of the active magnification target. This is a bound for this algebraic method, not a Boolean-circuit lower bound for SAT or Gap-MCSP.

## 2. Sparse functions fit in explicitly charged circuits

**Lemma 1.** For n>=2, every truth table having exactly t>=1 ones has a B2 circuit of size at most n*t-1. The all-zero table costs zero gates.

Proof. For each accepting input a, its equality indicator is a minterm. A first B2 gate checks the first two required bit values together. Each subsequent variable is checked with one B2 gate that ANDs the current result with the required literal. Thus a minterm costs n-1 gates, including all negations absorbed into gate types. OR the t minterms with t-1 further gates. Total t*(n-1)+(t-1)=n*t-1. All gates are ordinary binary gates; constants and original variables have the convention of U44. QED.

The n=1 exception is deliberate: the negative literal costs one gate whereas the displayed formula at t=1 would give zero. All following quantitative uses assume n>=2.

This familiar minterm construction is not new. It is explicitly implemented and verified for every table at n=2,3. Changing to any other fixed finite complete basis changes the cost only by a fixed simulation constant, so the order s/n in the following bound remains, although its exact integer formula changes.

## 3. Boolean Hamming-ball interpolation over any field

Let K be any field and Q(Z_1,...,Z_N) be multilinear, with degree <=r. Suppose Q(1_A)=0 for every A subseteq [N] of size at most r. Then Q is the zero polynomial.

Write Q=sum_(|T|<=r) c_T Z^T. At A=empty, evaluation gives c_empty=0. Induct on |A|. If all smaller coefficients vanish, evaluation at 1_A gives

    0 = Q(1_A) = sum_(T subseteq A) c_T = c_A.

All coefficients therefore vanish. Equivalently, the evaluation matrix on the radius-r Hamming ball, with columns the monomials of degree <=r, is triangular by inclusion with diagonal one. The argument works in every characteristic.

An arbitrary polynomial should first be reduced modulo Z_i^2-Z_i. A syntactically nonzero polynomial that vanishes on the entire Boolean cube is not a useful separating invariant. The theorem concerns its nonzero multilinear representative as a Boolean function.

A translated version also holds: a degree<=r polynomial cannot vanish on every Boolean point of distance <=r from a fixed Boolean table g unless it vanishes everywhere. Substitute Z_i=g_i+(1-2g_i)Y_i. This is an invertible affine substitution, even in characteristic two, and preserves the degree bound. Lemma 1 plus an XOR with a circuit for g gives an explicit circuit-cost interpretation of those perturbations, but the center-zero case is already sufficient below.

## 4. General nonlinear obstruction

Let C_s(n) be the truth tables computable with at most s B2 gates. Suppose a multilinear polynomial Q over K vanishes on all of C_s(n), but is nonzero at some Boolean table.

For any integer r with 0<=r<=N and n*r-1<=s, Lemma 1 shows that the radius-r Hamming ball about zero is contained in C_s(n). Section 3 then rules out deg Q<=r. In particular, if

    r = min(N, floor((s+1)/n)),

and r<N, then

    deg Q >= r+1.

If r=N, C_s(n) already contains the full cube under this generous size bound, and there is no nonzero separating Q at all. The claim does not depend on Q being efficiently found or evaluated.

This extends U43's exclusion of universal linear identities, but it must not be overstated. It excludes bounded-degree polynomial equations, not arbitrary nonlinear predicates, certificate systems, circuit-description arguments, or high-degree polynomials represented by small circuits.

## 5. Consequence at the actual magnification parameters

Keep N=2^n distinct from the original function arity n. For the YES budget

    s = floor(2^(beta*n)/(c*n)),

the lower bound on any useful vanishing equation is of order

    deg Q = Omega(N^beta / (log N)^2)

for fixed beta>0 and c. Therefore no constant-degree equation suffices asymptotically, and a naive full monomial feature space at the required degree has binomial(N, <=deg Q) columns.

Neither this degree bound nor that ambient dimension proves a superlinear general-circuit lower bound. High-degree polynomials may be compactly factored, and feature enumeration is only one implementation. Even the simple Boolean function AND of D truth-table coordinates has degree D but a circuit of D-1 gates. Do not turn a cost of the chosen representation into a lower bound against every representation.

OPS2021's fixed-epsilon/for-every-small-beta quantifier remains unchanged. This checkpoint does not supply its premise. U44's cubic is compatible with the obstruction because its budget is fixed at two and its arity is fixed at three.

## 6. A different bound: arbitrary partial labels are easy to interpolate

**Lemma 2.** Any consistent assignment of labels to t distinct points in {0,1}^n extends to a B2 circuit with at most 2*t-3 gates for t>=2; for t=0,1, a constant suffices.

Construct a decision tree by splitting any still mixed-labeled set on an input coordinate on which its points differ, until leaves have constant labels. Both sides are nonempty at every split. If both child circuits are nonconstant, use a three-gate multiplexer. If at least one child is constant, its multiplexing with the other child is a single B2 operation of the tested variable and the other child output. If both sides contain one point, one gate suffices.

Induction on t proves the bound. For two subproblems of sizes t1,t2>=2, the sum is (2*t1-3)+(2*t2-3)+3=2*t-3. If one side has one point, the bound is at most (2*(t-1)-3)+1=2*t-4 (the two-point base handles the small exception). A larger constant-labeled child only reduces the cost. A separating coordinate always exists while there are two differently labeled distinct points. QED.

This is an explicit interpolation algorithm, not just a counting argument. Its description can be constructed in polynomial time in n*t by scanning coordinates and recursively partitioning the given samples. No function on an exponential truth-table universe is enumerated by the construction.

**Corollary.** An anti-checker against C_s(n) must contain more than floor((s+3)/2) distinct labeled points whenever such a certificate exists. Repeated points with consistent labels add no strength. Inconsistent repeated labels are invalid as samples of a target function.

This sample bound is unrelated to the polynomial-degree bound in Section 4: a polynomial of low degree can inspect many truth-table coordinates at once. U44 explicitly exhibits a cubic that separates targets whose smallest point certificates need six or seven points.

## 7. Executed checks

The same exact TypeScript source checks:

- all 9,81,6,561 consistent partial tables on n=1,2,3 respectively (3^(2^n) choices, each point absent/zero/one), and the actual constructed circuit for each, including the 2*t-3 gate count;
- the minterm circuits for all 16 and 256 truth tables at n=2,3;
- full-rank Hamming-ball evaluation matrices at every radius for N=2,4,8, using bigint GF(2) elimination;
- degree-feature ranks for all finite circuit classes discovered in U44, and explicit separating polynomials for every outside target.

Wolfram independently produced radius-0 through radius-4 ranks 1,9,37,93,163 on N=8 coordinates. Its independently defined two-gate cofactor class has full degree-two rank 37 and degree-three rank 92 of 93 columns, confirming that the finite cubic is genuinely nonlinear and minimum degree there. Numerical floating-point rank is not used.

The arbitrary-field and arbitrary-n conclusions come from the proofs, not those finite checks. The latter test encodings, sparse-circuit costs, feature conventions and implementation errors.

## 8. What remains and the next question

The experiment now has both a positive and a negative outcome. Nonlinear consistency can be exactly recognized and constructively certified for a fixed actual general-circuit budget; it is not intrinsically the same as linear span. But fixed-degree universal equations cannot scale to the required growing budgets.

The next meaningful question is whether a **succinct high-degree** consistency invariant can be constructed without enumerating all small-circuit descriptions, and whether its construction or evaluation—not merely its degree—can yield the required circuit lower bound. A first falsifiable test is to examine compositional identities for small circuits under fan-out/reuse and test them on four-gate shared-subcomputation examples, rather than assume the cofactor decomposition of the two-gate case persists. No such bridge is presently proved.

## Attribution and source boundaries

The interpolation and Hamming-ball arguments are elementary self-derived applications, not claimed new polynomial-method results. Searches for vanishing polynomials on Hamming balls, truth-table circuit identities, and exact three-variable circuit sizes did not authenticate a source for the precise cubic or seven-point statement; this is NOT evidence of novelty. Nearby work includes Kirill Krinkin, *A Simple Constructive Bound on Circuit Size Change Under Truth Table Perturbation*, arXiv:2603.09379 (2026); only its abstract was inspected, and no theorem from it is used.

The active external target remains Oliveira-Pich-Santhanam (2021), Theorem 1.4, cited in U44. All lemmas in this note are proved above independently of that paper. No hardness assumption, oracle answer, or unproved compression claim is introduced into the conclusions.
