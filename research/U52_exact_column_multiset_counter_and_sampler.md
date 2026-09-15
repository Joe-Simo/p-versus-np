# U52 — Exact column-multiset counting and uniform circuit sampling

Date: 2026-09-15. Status: self-contained fixed-sample counting/sampling theorem, implemented and independently checked on declared finite domains. No P-versus-NP resolution, formal-kernel certificate, expert review, or novelty claim.
Dependencies: the explicit B2 description convention used in U49-U51; no hardness assumption or counting oracle.

## 1. Question and established result

U51 proposed merging circuit prefixes that have the same multiset of values on the observed examples. This proposal is **exact**, provided multiplicities are retained. We prove and implement a counter for all compatible raw descriptions and an exactly uniform sampler, not merely a search for one fitting function.

For a fixed number q of examples, the algorithm takes polynomial time in the arity and the numerical gate budget. This is a parameter-restricted positive result. Its straightforward state enumeration has an exponential worst case when q grows; U53 proves that bound and also supplies an analytic compression for a special suffix family. Neither result proves a lower bound for all counters or circuits.

## 2. Model and input/output contract

A description consists of exactly s ordered B2 gates and an output index. Each gate has one of all sixteen binary truth tables and two ordered predecessor indices, with repetition allowed. Constants 0 and 1 and n uncomplemented input signals are initially present. All previous signals remain usable, so arbitrary fan-out and dead gates are included. The output may select any initial or created signal. This is the uniform distribution on raw **descriptions**, not on distinct functions, DAG isomorphism classes, or minimum circuits.

The data are a list X=(x_1,...,x_q) of n-bit points and labels y in {0,1}^q. The counter returns the exact number of descriptions matching every label. Repeated points are permitted; contradictory labels at repeated points force zero. On zero count, sampling reports an empty set. Invalid dimensions, out-of-range points, or nonbinary labels are invalid inputs, not mathematical instances.

For arbitrary-parameter complexity, example rows and labels are explicit bit strings, the gate budget is charged numerically (or in unary), and all big-integer operations are charged. The finite TypeScript checker declares q<=8 and bounded arity rather than pretending machine-word masks handle arbitrary q. The theorem uses ordinary bit-string columns without that finite implementation limit.

After a fixed prefix, let k be the number of currently available signals. For each column a in {0,1}^q, let m_a be the number of those signals whose evaluations on X are exactly a. Write M=(m_a), with sum m_a=k. Past syntax is unrestricted except for this already fixed prefix; future gates have the original unrestricted B2 rules.

## 3. Exact suffix recurrence

Let H_r(M,y) be the number of r-gate suffixes, including the final output index, that produce labels y. Then

    H_0(M,y) = m_y,

    H_r(M,y) = sum_(a,b in {0,1}^q) m_a m_b
                  sum_(g in B2) H_(r-1)(M + e_(g(a,b)), y).

The gate is applied coordinatewise to its two q-bit columns. In particular, when a=b the factor is m_a^2, not m_a(m_a-1): the same predecessor index may be used twice. Distinct gate truth tables that coincide on the currently observed pairs still represent distinct descriptions and are separately counted.

Equivalently define

    W_M(c) = sum_(a,b) m_a m_b * #{g in B2 : g(a,b)=c}.

Then H_r=sum_c W_M(c) H_(r-1)(M+e_c,y), and

    sum_c W_M(c)=16 k^2.

### Proof

For r=0, each matching signal is a different allowed output index, giving m_y. For r>0, partition all suffixes by their first physical predecessor pair and gate type. A pair with columns a,b has m_a m_b realizations. It adds exactly one signal of column g(a,b); its future suffix has the displayed count by induction. These alternatives are disjoint and exhaustive.

More explicitly, any two prefixes with the same histogram admit a bijection between their signal indices preserving the sampled columns. Use this bijection on first-gate predecessors, extend it by pairing the new gate indices, and proceed inductively. It maps complete suffix descriptions bijectively and preserves their output labels. Thus no dependence on the discarded prefix syntax is hidden in the recurrence. This does not hold for additional, unmodeled restrictions on which old indices future gates may use. QED.

## 4. Multiplicities cannot be discarded

On two examples, compare

    M_A = [00, 10, 01, 01, 11],
    M_B = [00, 10, 01, 11, 11],

where the ordered bit convention lists sample one first. In the code's little-endian integers these are [0,1,2,2,3] and [0,1,2,3,3]. They have the same column support, five signals, and one signal with target column 10 (integer 1). Nevertheless their one-gate suffix counts for that target are respectively **484** and **464**.

Both states can occur after one gate on the same two-variable sample X=(10,01): start with columns 00,11,10,01 and either copy the 01 signal or copy the 11 signal. Thus this is not an artifact of unreachable synthetic histograms. Full direct enumeration and an independent Wolfram calculation check the two counts. Retaining only a set of values loses future syntax multiplicities even when the terminal target multiplicity is unchanged.

## 5. Completely charged complexity

Let D=2^q. After j new gates a state is M+delta for a nonnegative D-vector delta of sum j. Therefore the number of possible states at that level is at most binom(j+D-1,D-1), and the number at all levels through r is at most

    B(r,D) = binom(r+D,D).

This is an upper bound; the algorithm explores only reachable states. Each stored histogram has O(D log(k+r+2)) bits. Its count is bounded by the number of all suffix descriptions,

    A_r(k)=(k+r) product_(j=0)^(r-1) 16(k+j)^2.

Consequently a count fits in

    L=O(log(k+r+2)+r log(k+r+2))

bits. Transition construction uses at most 16D^2 column pairs/gate choices with O(q) bit work per evaluation. Child keys and arithmetic can be handled, conservatively, in

    O(B(r,D) D^2 [q + D log(k+r+2) + L^2])

bit operations with schoolbook arithmetic, in addition to input-column construction. This explicitly charges dictionary-key storage and multiplications; no long integer or q-bit vector is a unit-cost oracle. For each fixed q this is polynomial in n+r and in the explicit input size. It is not a polynomial bound with an exponent independent of q, nor a claim polynomial in log r alone.

Two boundary cases have simple checks. For q=0 the answer is A_r(k). For q=1, write G_r(k)=product_j 16(k+j)^2. For either label,

    H_r(M,y)=G_r(k) [m_y+r/2].

To see this, a uniform random binary gate type returns an unbiased bit at any fixed pair of bits. Thus every newly created signal has marginal probability 1/2 of matching the label, irrespective of the preceding prefix. Linearity of expectation counts matching output indices; independence among different new signals is not assumed. The formula is integral, including r=0.

## 6. Exact uniform sampler without original-prior rejection

First compute C=H_s(M_initial,y). Return EMPTY when C=0. Otherwise choose an integer R uniformly in [0,C), then perform deterministic unranking.

At an actual ordered prefix, order all physical triples (i,j,g) lexicographically. Give one such triple the interval length

    H_(r-1)(M+e_(g(column_i,column_j)),y).

Their intervals partition [0,H_r). Select the interval containing R, subtract its starting offset, append that physical gate, and repeat. At r=0, use the remaining rank to choose one of the matching physical output indices.

Induction proves a bijection from ranks to compatible complete descriptions: first intervals are disjoint and correspond to the first gate, then suffix unranking is bijective, and terminal ranks correspond to output indices. Every complete description therefore has probability exactly 1/C. The counter, rather than an assumed consistency oracle, supplies every interval length.

Uniform integer generation uses fair bits: draw ceil(log_2 C) bits and reject only integers >=C. The success probability is greater than 1/2 (or the draw is deterministic for C=1), so expected bit cost is O(L). This rejection is over a numerical interval of acceptance at least one half, not over rare compatible descriptions. With the DP computed, at most s rounds of 16(k+s)^2 suffix lookups and exact integer comparisons suffice. All lookup tables were constructed with the costs above. This is expected-time randomized sampling, not a deterministic SAT algorithm.

## 7. What was executed

`code/u52_u53_audit.ts` implements both a forward weighted quotient and a backward suffix counter/unranker. It never replaces a reachable histogram's terminal answer by an uncharged precomputed label.

- Every one of the **6,561** consistently labeled partial tables on the three-variable cube was counted at s=2. The counts agree with a literal raw enumerator, including every multiplicity.
- Full-table distributions at (n,s)=(2,1),(3,2),(3,3) contain 16,152,232 distinct functions. They count respectively 1,280; 1,612,800; and 1,445,068,800 raw descriptions. The last distribution is independently obtained by enumerating 230,400 raw two-gate prefixes and summing every allowed final gate/output, not by executing 1.4 billion full descriptions individually.
- Full-sample histogram layers at n=3 are [1,38,1041] through two gates and [1,38,1041,26884] through three. Counting these states is a cost measurement for this implementation, not a lower bound for all algorithms.
- All ranks were unranked for parity at (2,1),(3,2),(3,3): **2,24,49,536** outputs, totaling **49,562**. Each was distinct and belonged to the independently enumerated raw survivor set. This checks a complete finite bijection, not empirical sampling frequencies.
- The q=0 and q=1 formulas were checked for k=2..5 and r=0..12, giving 104 cases. Repeated rows with contradictory labels return zero; empty sampling is rejected; a scripted fair-bit test exercises interval rejection.

Python uses literal per-example Boolean tuples and the last-gate single/pair moments of all raw prefixes, not the histogram DP, to reproduce full distributions and all partial counts. It reads TypeScript output only afterward. The n=3,s=2 distribution also equals the preserved U51 data. Wolfram independently enumerates two-example/two-gate counts on n=2, the multiplicity counterexample, and the U53 summation identities. Versions, complete outputs and scope are recorded under `research/validation/`.

No failed assertion or solver result is counted as evidence. This is self-audited mathematics with separate implementations, not an independent expert or formal verification claim.

## 8. Connection back to the full project

U50's rejection cost does not apply to this sampler: it works by exact conditional counts. U51's disconnected local-update graph also does not obstruct it, because unranking may directly choose any correct description. But neither obstacle disappears for free: the generic counter still has the growing-q cost proved in U53.

The active full target remains OPS2021 Theorem 1.4: one fixed epsilon>0 and, for every sufficiently small beta>0, the specified N^(1+epsilon) ordinary-circuit lower bound for Gap-MCSP. This checkpoint establishes neither that bound nor a polynomial-time algorithm on succinct SAT instances. It studies one subroutine of the existing anti-checker construction.

## Attribution and source audit

Oliveira, Pich, Santhanam, *Hardness Magnification Near State-of-the-Art Lower Bounds*, Theory of Computing 17(11), 2021, DOI 10.4086/toc.2021.v017a011, https://theoryofcomputing.org/articles/v017a011/v017a011.pdf . Theorem 1.4 (printed p.6) and the description-counting/constant-shrink discussion with footnote 13 (printed p.21) were reread and rendered this run. They motivate the subroutine; the recurrence and its proof above are self-contained and are not attributed to that paper.

Feser, Dillig, Solar-Lezama, *Metric Program Synthesis*, arXiv:2206.06164, https://arxiv.org/abs/2206.06164 . Its abstract identifies observational equivalence as established bottom-up synthesis practice. Only the abstract was consulted, not its full proof. Our use of sample columns belongs to that general idea; exact syntax weights, the suffix recurrence, and this implementation are not claimed to be new in the literature. Search scope did not authenticate novelty.
