# U48 — Sparse hard tables force nearly linear access for short anti-checker extraction

Date: 2026-09-15. Status: self-contained, self-audited growing-parameter query lower bound with exact finite checks; **not** a P-versus-NP resolution or a general-circuit lower bound. No novelty or independent expert/formal verification is claimed.

## 1. Question and result

U47 asks whether the input-dependent list in the active magnification theorem could simply be replaced by a short random sample. The first obstruction is missing the support of a sparse function. A stronger obstruction follows from U45: a certificate must expose **many distinct positive labels**, since a small minterm circuit can fit all observed positive labels and every observed negative label.

Write N=2^n. For any fixed 0<beta<1/10, let

    S = floor(2^(beta*n)), s = floor(S/(10*n)), t = ceil(2^(10*beta*n)).

Consider a randomized procedure that, for every table F with circuit complexity greater than S, returns at most t input addresses constituting an anti-checker against size-s circuits with probability at least 2/3. It accesses F only by querying its entries; arbitrary computation between queries is free, and it may output addresses it never queried. There is no F-dependent auxiliary input or advice. The procedure is a total bounded-depth query procedure on all tables.

**Theorem.** The procedure must make Omega(N/n^2) worst-case queries, for all sufficiently large n (depending on beta). In particular, even arbitrary adaptive query selection does not make a genuinely short-read extractor possible. A table-independent randomized list of the stipulated size has vanishing worst-case success probability.

This is a query-model theorem about producing a particular certificate, not about deciding SAT, deciding Gap-MCSP by arbitrary circuits, or the time needed after all input bits are read. A full-table read uses N queries, so the result remains far below the required N^(1+epsilon) unrestricted circuit lower bound.

## 2. Encodings, costs, and certificate contract

C_a(n) denotes single-output circuits with at most a B2 gates: all sixteen binary Boolean operations are allowed, constants 0 and 1 and uncomplemented inputs are free, and fan-out and repeated predecessors are allowed. A circuit description orders its gates topologically, specifies two earlier signal indices and a gate type, and specifies an output signal. Minor basis changes affect constants, not the method's asymptotic conclusion.

An anti-checker Y against C_s(n) is a list of distinct input addresses with actual target labels F(y), such that no C in C_s(n) agrees with F on all addresses. Duplicated addresses add nothing. Labels supplied without querying them do not create information: our lower bound even allows the actual labels to be filled in later. Only addresses and their actual F-values determine validity.

The zero table is easy, but ruling it out alone does not constitute an anti-checker. This distinction strengthens the test requested in U47.

## 3. A sparse layer containing overwhelmingly many hard functions

Let w=2^b <=N, with b an integer. Use the family of all weight-w tables, equivalently all w-subsets of the N addresses. There are binomial(N,w) such tables.

Padding a smaller circuit with unused gates represents every function in C_w(n) by an exactly-w-gate description. The number of these raw descriptions, counting all output choices, is

    D(n,w) = (n+w+2) * product_(j=0)^(w-1) [16*(n+j+2)^2].

Distinct descriptions need not compute distinct functions. Consequently D is an **upper bound** on the number of easy tables, not a function count. Set L=ceil(log_2(n+w+2)). Then

    D(n,w) <= 2^[L+w*(4+2L)].

Also

    binomial(N,w) = product_(i=0)^(w-1) (N-i)/(w-i)
                   >= (N/w)^w = 2^[(n-b)w].

The factorwise inequality uses N>=w, including the endpoints. Hence the fraction of weight-w tables in C_w(n) is at most

    eta = 2^(-H),  H=(n-b-4-2L)w-L,

whenever H>0. Thus the complementary hard family H_w has size at least (1-eta) binomial(N,w).

For b=beta*n+O(1) and fixed beta<1/3, H=((1-3beta)n-O(1))w>0 eventually. This proves existence and abundance, not an efficient construction of one explicit hard table or one NP language with the desired lower bound. No exponentially large table has been generated in the numerical parameter examples below.

## 4. Why a certificate must include more than one positive example

For n>=2, a truth table supported on p>=1 specified input points has a circuit of at most n*p-1 B2 gates: each minterm costs n-1 gates with literal negations absorbed into B2 gates; ORing p minterms costs p-1 gates. The empty support is the free zero constant. This is the proved construction from U45, not a hardness assumption.

Set

    h = floor((s+1)/n)+1.

If Y has fewer than h positive labels, let P be precisely those positive addresses. The function 1_P fits every label of Y: it accepts P and rejects every other address. Its circuit size is at most s. Therefore:

    Y an anti-checker against C_s(n)  ==>  |Y intersect supp(F)| >= h.       (1)

There is no claim that this condition is sufficient. Constant-one and many more complicated circuits may still agree with the sample. The minterm argument requires distinct, consistently labeled points, as specified in the contract.

## 5. Exact adaptive-query bound, including unqueried output guesses

Fix any randomized procedure with at most q queries and at most t output addresses. Let K=min(N,q+t). Draw F uniformly from the entire weight-w layer, initially without conditioning on circuit hardness.

After its q queries, append queries to every previously unqueried output address. Remove repeated queries and pad arbitrarily to exactly K distinct queried addresses. This derived procedure includes every positive label in the output among the queried positive labels. Its next address can depend on all previous answers and on its original random seed.

**Adaptive sampling lemma.** For a uniformly random weight-w support, the number X of positives encountered by any such K-distinct-query procedure has the hypergeometric law

    Pr[X=x] = binomial(K,x)*binomial(N-K,w-x) / binomial(N,w).              (2)

**Proof.** Condition on the random seed. Given any reached transcript with a positives and j negatives, the unseen support is uniform among (w-a)-subsets of the N-a-j unseen coordinates. Every available next coordinate therefore has the same conditional positive probability (w-a)/(N-a-j), irrespective of how it is selected. Induction gives sampling without replacement; averaging over the independent seed preserves the law. This does not hold after conditioning directly on hardness, which is why that conditioning is delayed. QED.

Let B(N,w,K,h) be the sum of (2) over x>=h. On the full layer, (1) gives Pr[success] <= B. The hard family has probability at least 1-eta, so

    Pr[success | F in H_w] <= B(N,w,K,h)/(1-eta)
                           <= K*w/[N*h*(1-eta)].                        (3)

The last inequality is Markov's inequality and E[X]=K*w/N. Conditioning only divides the unconditional upper bound; it does not claim the remaining coordinates are exchangeable under the hard-only distribution. If an expression exceeds one, it is merely a vacuous upper bound and can be capped at one.

A stronger optional tail bound follows without an independence assumption:

    B <= binomial(K,h)*binomial(w,h)/binomial(N,h)
       <= binomial(K,h)*(w/N)^h,                                        (4)

when h<=K,w; otherwise B=0. The first inequality counts h-subsets of hits and uses E[binomial(X,h)]. Only (3) is needed for the theorem.

## 6. Quantitative consequences at the actual growing budgets

First take the exactly dyadic regime S=w=2^b and s=floor(w/(10n)). Then h>w/(10n^2), including all rounding. Equation (3) gives

    Pr[success | hard] < 10*n^2*(q+t)/[N*(1-eta)].                       (5)

If success is at least 2/3 on every hard table and eta<=1/2, then q+t>N/(30n^2). For b/n=beta<1/10 and t=2^(10b), t=o(N/n^2), proving q=Omega(N/n^2).

**All real beta and all sufficiently large lengths.** It is not legitimate to prove the active statement only when beta*n happens to be integral. For arbitrary fixed beta, take S=floor(2^(beta*n)) and let w be the smallest power of two with w>=S. Then S<=w<2S, so b=beta*n+O(1), and the hard family above excludes even C_w(n), hence certainly C_S(n). Use the actual lower budget s=floor(S/(10n)). Now h>S/(10n^2)>w/(20n^2), and (5) has 20 in place of 10. This changes the lower-bound constant from 1/30 to 1/60 once eta<=1/2. Since the stipulated t is still o(N/n^2) for every fixed beta<1/10, the same asymptotic lower bound holds without a subsequence restriction.

In particular, with q=0 a table-independent list distribution has worst-case success at most O(n^2*N^(10beta-1)), which tends to zero. This includes arbitrary biased or correlated sampling; independent uniform samples are not required.

## 7. A distinction the one-hit argument would miss

For n=1024, b=96, take w=2^96 and t=2^960. A uniform t-query sample has expected positive-hit count

    t*w/N = 2^32.

Thus merely asking whether it hits a positive point is a poor test in this regime. However the necessary count from (1) is

    h = 7,555,786,372,591,432,341,914.

The elementary conditional bound is no more than

    [5 / 8,796,093,022,208] / [1 - 2^(-H)],
    H = 57,836,558,635,412,966,443,287,083,745,183.

These are exact exponent/rational certificates. They do not mean a table of 2^1024 bits was built or tested. The finite count proves that the specified hard family exists; the probability inequality follows uniformly for the class of sampling procedures.

## 8. What this rules out, and what it does not

The proposed oblivious short-list substitution fails on genuine NO inputs of the growing circuit-size promise, not only on easy one-point functions. Allowing adaptive queries does not avoid the near-linear-in-N access requirement, up to n^2 factors.

The result does not contradict the source's almost-linear **gate-size** upper bound under NP subseteq P/poly. That source reads the full truth table and computes input-dependent survivor statistics. Its list length is not its query budget. A general circuit may depend on all N input bits and share subcomputations; it need not behave as a small-query sampler. The theorem therefore supplies none of the required N^(1+epsilon) general-circuit lower bound.

Even finding all positive entries is not a hardness certificate: the constant-one circuit fits all positive-only labels. The unresolved work is constructing an informative mixed-label list and determining consistency with every actual small circuit, with construction and evaluator costs both charged. U49 executes that follow-up rather than advancing the fixed gate budget.

## 9. Executed checks and their limits

TypeScript checked 180,740 support/policy instances, grouped into 800 exact hypergeometric histogram assertions, plus 3,744 hard-only finite cases. Policies include genuinely answer-dependent address choices. An independent Python implementation enumerated **all 1,193 distinct-read trees of depths 0-4 on four coordinates**, checking 19,088 tree/input pairs. Neither experiment proves a statement about every unbounded algorithm; the induction in Section 5 does.

Sparse interpolation was checked on all 6,561 partial labelings of the three-variable cube, with 1,280 cases within the tested circuit budget. Raw B2 enumeration counted descriptions separately from distinct functions. The finite high/low budgets used for these unit checks are not presented as asymptotic OPS instances.

Exact arithmetic verified 220 binomial inequalities and six large parameter certificates. Wolfram independently checked 106 adaptive histograms and the parameter integers/rationals. Full outputs and code are in the accompanying package; no floating-point probability or fitted growth curve is used as evidence.

## Sources and originality boundary

The active external contract is Oliveira-Pich-Santhanam, *Hardness Magnification Near State-of-the-Art Lower Bounds*, Theory of Computing 17(11), 2021, Theorem 1.4 and Lemma 4.1: https://theoryofcomputing.org/articles/v017a011/v017a011.pdf . Its t and circuit thresholds were checked directly in rendered pages 6 and 17. Sections 3-6 above are a self-derived elementary query-model application, not a claimed strengthening of that magnification theorem.

This is distinct from the stronger anti-checker-family hypothesis refuted in Chen et al., *Beyond Natural Proofs: Hardness Magnification and Locality*, arXiv:1911.08297, Corollary 61 (printed p.41): https://arxiv.org/pdf/1911.08297 . We checked that statement for attribution; we do not claim to reprove it or independently audit its complete proof. Searches for sparse circuit-hard functions and anti-checker query/sampling bounds did not establish novelty; no novelty is claimed.
