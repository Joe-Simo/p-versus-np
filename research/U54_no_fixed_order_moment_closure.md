# U54 — Exact failure of fixed-order moment closure for circuit-prefix ensembles

Date: 2026-09-15. Status: self-contained growing-parameter method-specific theorem, with exact finite checks. No P-versus-NP resolution, general circuit lower bound, independent expert verification, formal-kernel certificate or novelty claim.
Dependencies: U52's raw-description convention; the needed recurrence is rederived here. U55 supplies an exact alternative rather than interpreting this obstruction as general counting hardness.

## 1. Question and scope

U53 asks whether first and pair moments can replace the distribution over sample-column histograms. A moment is an expectation of a product of column multiplicities, not a pointwise summary of one deterministic histogram. We prove a sharper statement: **no fixed moment order suffices for a universally exact propagation rule on all distributions over attainable prefixes**. For every d>=1 there are two explicitly samplable ensembles of reachable prefixes, agreeing in every joint moment of total degree <=d, but with different expected numbers of compatible d-gate suffixes.

The ensembles are uniform over particular sets of copy prefixes. They are not claimed to be the posterior of all uniformly chosen B2 descriptions under an anti-checker history. This theorem therefore does not prove that the specific histories in U49 defeat every moment-based algorithm. Nor does it rule out approximations with proved error, computing needed higher moments from additional information, or a different exact state representation.

A deterministic histogram already equals its own first-moment vector; this note does not say that its information is insufficient. The obstruction is to discarding the higher moments of a *random* histogram while claiming exact future evolution for all such distributions.

## 2. Model and the polynomial hierarchy

Fix q example rows. For each q-bit column a, m_a counts the currently available physical signals with that column, and k=sum_a m_a. One new raw B2 gate chooses ordered physical predecessors, with repetition, and one of all sixteen binary operations. All old signals remain available. The rate of appending c is

    Q_c(M) = sum_(a,b,g: g(a,b)=c) m_a m_b,
    sum_c Q_c(M) = 16 k^2.

Uniformly choosing a gate therefore gives M'=M+e_c with probability Q_c(M)/(16k^2). If p is a polynomial in multiplicities of total degree j, then, on the fixed-total-k hyperplane,

    E[p(M') | M]
      = p(M) + (1/(16k^2)) sum_c Q_c(M)[p(M+e_c)-p(M)].

Each difference has degree at most j-1, so the right side has degree at most j+1. Denominators depend only on the deterministic signal total at that time. This is an upper bound, not a claim that the extra degree always survives. Copy-only gates from U53 are a positive control with genuine first-order closure.

The unrestricted B2 hierarchy is strict already with two example rows, as proved next.

## 3. The two-row process

Use little-endian columns 0=00, 1=10, 2=01, 3=11, where the first listed bit is the first example's value. Let

    c = m_0 + m_3

be the number of columns that agree across the two rows. For two chosen parents, the gate is asked about the same input pair on both rows exactly when both parents have agreeing columns. There are c^2 such ordered predecessor choices. On those pairs, eight gate types give 00 and eight give 11. On the other k^2-c^2 pairs, the two gate-table entries are distinct, and each of the four output columns has four compatible gate types. Thus

    Q_0=Q_3=4(k^2+c^2),
    Q_1=Q_2=4(k^2-c^2).

The agreeing-column count C increases by one with probability

    p_k(c) = (1+c^2/k^2)/2,

and otherwise stays c. Both signs of each kind occur equally often. Repeated predecessors, constant gates and dead gates were included, not removed.

Let F_r^(k)(c)=E[C after r gates | initial C=c, initial total=k]. Then

    F_0^(k)(c)=c,
    F_r^(k)(c)=F_(r-1)^(k+1)(c)
       + (1+c^2/k^2)/2 * [F_(r-1)^(k+1)(c+1)-F_(r-1)^(k+1)(c)].

As a rational polynomial in c, its degree is **exactly r+1**, with leading coefficient

    a_r(k) = r! / [2^r (k)_r^2],
    (k)_r = k(k+1)...(k+r-1).

Proof: degree one and leading coefficient one hold at r=0. A degree-r polynomial with leading coefficient a has forward difference of degree r-1 with leading coefficient r*a. Multiplication by c^2/(2k^2) produces a nonzero term of degree r+1. All other terms have smaller degree. This gives a_r(k)=r*a_(r-1)(k+1)/(2k^2), proving the formula. QED.

## 4. From moments to exact raw completion counts

There are G_r(k)=16^r (k)_r^2 raw r-gate lists. Their uniform distribution is precisely the process above because the number of predecessor choices at a time depends only on that time. The final output index is also part of a description.

For labels y=00, the expected number of matching output indices is

    m_0 + [F_r^(k)(c)-c]/2.

Indeed each newly created agreeing column is 00 with probability one half, and linearity of expectation suffices; independent gate outcomes are not assumed. Hence the exact compatible-description count is

    H_r(M,0) = G_r(k) * {m_0 + [F_r^(k)(c)-c]/2}.

For r>=1 and a one-parameter family where m_0 is affine in c, this is a degree-(r+1) polynomial with leading coefficient

    r! * 2^(3r-1).

This is a statement about the polynomial on that line of histograms. Choosing enough feasible points on that line below makes it a genuine finite-distribution counterexample, not just a formal leading-term argument outside the state space.

## 5. Reachable equal-moment ensembles for every order

Take n=2 inputs and examples 00 and 10. The initial histogram is (2,0,1,1), from the zero, one, x_1 and x_2 signals. Append d+1 projection gates g(a,b)=a, always choosing the second predecessor to be the original zero signal. At each gate choose the original zero or the original x_1 as first predecessor. If zero is copied j times, the final histogram is

    M_j=(2+j, 0, d+2-j, 1), j=0,...,d+1,
    k=d+5, c=3+j.

Every such prefix is an actual legal raw description of the same length. Choose the d+1 copy-choice bits uniformly subject to even parity to obtain ensemble E, and subject to odd parity to obtain ensemble O. They are samplable using d fair bits with the last parity bit forced. Consequently the histogram probabilities are binom(d+1,j)/2^d on the respective parity classes.

Each multiplicity is affine in j. Every joint moment of total degree <=d is consequently the expectation of a degree-<=d polynomial in j. The identity

    sum_(j=0)^(d+1) (-1)^j binom(d+1,j) p(j)=0

for degree(p)<=d proves equality of **all** those moments, not just marginal means and variances.

However the degree calculation and the (d+1)-st finite difference give

    E_E[H_d(M,0)] - E_O[H_d(M,0)]
       = (-1)^(d+1) (d+1)! d! 2^(2d-1) != 0.

For every r<d the corresponding difference is zero. The same separation persists after normalizing by G_d(k), or by G_d(k)(k+d) to interpret it as probability of a uniformly chosen full description fitting the labels. The denominators are common to both ensembles. Thus even a nonlinear function of the retained moments cannot produce the correct answer for both ensembles. QED.

## 6. Concrete first-and-pair-moment counterexample

Set d=2. The four reachable histograms are

    M_0=(2,0,4,1), M_1=(3,0,3,1),
    M_2=(4,0,2,1), M_3=(5,0,1,1).

E gives probabilities 1/4,3/4 to M_0,M_2; O gives 3/4,1/4 to M_1,M_3. Both have means (7/2,0,5/2,1) and identical full second-moment matrices. Yet their exact mean two-gate completion counts are

    E: 3,385,920; O: 3,386,016.

The difference is -96. The four unaveraged counts are 2,085,120; 2,944,288; 3,819,520; 4,711,200. These are compatible raw descriptions including output pointers, not numbers of distinct functions.

## 7. Executed audits and limitations

TypeScript checks d=1..8, all 1,286 multivariate monomials of total degree up to the relevant cutoff, all shorter suffix lengths, and the displayed exact gap. All 1,020 copy-choice patterns were physically replayed to establish the claimed histograms and binomial multiplicities. Python independently propagates full four-column histogram masses via literal row-tuple gate evaluation for d<=5, then compares only after constructing its results.

Wolfram independently recomputes the four two-gate counts using all physical predecessor/gate choices in a memoized suffix recurrence; it matches the means, pair moments and -96 gap. Separate symbolic polynomial expansion matches degrees and rational leading coefficients through r=6. Finite checks audit the implementations; Sections 2-5 are the all-parameter argument.

No generic conditional sampler lower bound follows. In particular U55 solves the two-row conditional count and sampling problem exactly by a scalar-state representation. Failure of moment closure and tractability by another representation coexist here.

## 8. Literature and next step

Moment hierarchies and symmetry-based exact aggregation are established methods. Nearby sources read for terminology/novelty context, not used as proof dependencies: Wuyts-Sieber, arXiv:2111.07643 (abstract); Banisch-Lima, DOI 10.1142/S0219525915500113 (abstract). Neither source is claimed to prove the B2-specific coefficient or ensemble identity above, and no global novelty claim is made.

The full target is still OPS2021 Theorem 1.4's ordinary general-circuit premise; this note does not establish it. U55 executes the justified follow-up: seek an exactly closed state quotient, rather than truncate a nonclosing moment hierarchy.
