# U55 — Complement-pair quotient and an exact two-row conditional sampler

Date: 2026-09-15. Status: self-contained positive exact counting/sampling construction and bounded independent audits. No P-versus-NP solution, growing-example polynomial bound, formal-kernel certificate, expert verification or novelty claim.
Dependencies: the U52 raw B2 model; unrestricted use of all sixteen binary gate types with equal raw-description weight is load-bearing.

## 1. Result and what it changes

U54 rejects fixed-order moment closure on arbitrary prefix ensembles. That does not force retention of U52's entire histogram distribution. We derive an exact symmetry quotient for every fixed q>=1: pair each sample column a with its bitwise complement. Except for the initial multiplicity of the requested label, conditional completion counts depend only on the **2^(q-1) complementary-pair totals**, rather than all 2^q column multiplicities.

At q=2 this becomes a scalar birth process, yielding a counter with O(r^2) arithmetic operations on explicitly bounded integers and an exact uniform raw-description sampler. Neither blind rejection from a rare fiber nor a generic consistency oracle is used. This is an improvement to the declared representation, not an assertion that exact counting for two examples was previously open.

## 2. Counting identity for all q

Columns lie in {0,1}^q; write bar(a) for bitwise complement and [a]={a,bar(a)}. Pick the smaller little-endian integer as representative. Let

    T_[a]=m_a+m_bar(a), k=sum_[a] T_[a],
    G_r(k)=product_(j=0)^(r-1)16(k+j)^2.

For canonical representatives a,b define L_ab,z as the number of B2 gate truth tables whose output column on a,b lies in pair z. This count is unchanged if either parent column is complemented: complementing one argument permutes all sixteen truth tables. Complementing the gate's output pairs its truth table with a different truth table, so exactly half of these gates produce either specified orientation of pair z. Therefore

    R_z(T)=sum_[a],[b] T_[a] T_[b] L_ab,z

is the exact number of first-gate triples appending a column in pair z. Each orientation has R_z(T)/2 triples, and sum_z R_z(T)=16k^2. Repeated predecessor indices are retained in T_[a]^2; no distinctness correction is permitted.

The projected process T -> T+e_z with these rates is exact for every prefix, not merely an approximation under independent column assumptions. This property is often called lumpability; the counting proof here establishes it directly.

## 3. Terminal labels require one additional initial statistic

The output may point to an old signal, so forgetting the orientation of every old column would lose the terminal multiplicity m_y. It is sufficient to retain this one number separately. There are offsets B_r(T,z), independent of the orientation split inside each pair, such that

    H_r(M,y)=G_r(k)m_y+B_r(T,[y]).

Explicitly,

    B_0(T,z)=0,
    B_r(T,z)=R_z(T)/2 * G_(r-1)(k+1)
                + sum_w R_w(T) B_(r-1)(T+e_w,z).

Proof by induction: partition all suffixes by their first physical gate. The old m_y contributes 16k^2 G_(r-1)m_y=G_r m_y. Exactly R_[y]/2 first-gate triples create an additional target-valued signal. Remaining contributions are child offsets, which depend only on the new pair histogram. This proves both the formula and its exact multiplicity accounting. QED.

Thus two prefixes with the same T and m_y have equal suffix counts even if other orientation multiplicities differ. This is stronger than U52's sufficient full-histogram condition, but does not contradict its example: that example changes a complementary-pair total.

With L=2^(q-1), at most binom(r+L,L) pair-histogram states occur through r gates. Precompute the finite L_ab,z rates by actually applying all gates. Computing all target offsets uses polynomial work per state in L,q and b, where

    b=O((r+1) log(k+r+2))

bounds all exact count bit lengths. A conservative schoolbook bound is O(binomial(r+L,L) L^2(q+L+b^2)), plus input evaluation. This is polynomial for fixed q and numerical/unary r, not a bound polynomial in q or log r.

This symmetry uses all sixteen equally weighted gate types. For a restricted gate basis or nonuniform gate prior, the input/output complement permutations may no longer preserve weights; a separate proof would be required.

## 4. Exact specialization to two rows

Let c=m_0+m_3, the agreeing-column count, and m=m_y. There are two complementary pairs: {00,11} and {10,01}. As derived by direct truth-entry counting,

    R_+(k,c)=8(k^2+c^2), R_-(k,c)=8(k^2-c^2).

Define B_r^+(k,c) for one agreeing output label, not for both labels combined. Then

    B_0^+=0,
    B_r^+(k,c)=4(k^2+c^2)G_(r-1)(k+1)
       +8(k^2+c^2)B_(r-1)^+(k+1,c+1)
       +8(k^2-c^2)B_(r-1)^+(k+1,c).

There are r newly created signals, split between two agreeing and two differing columns, so

    B_r^-(k,c)=r G_r(k)/2 - B_r^+(k,c).

For any target column y,

    H_r=G_r(k)m_y+B_r^+  if y is 00 or 11,
    H_r=G_r(k)m_y+B_r^-  if y is 10 or 01.

All offsets and counts are integers. The r=0 expression is interpreted directly as m_y; r*G_r/2 is then zero. Sum_y H_r=(k+r)G_r is a useful exact check.

From one initial (k,c,r), after j gates the scalar states are (k+j,c+h,r-j), 0<=h<=j. Thus at most (r+1)(r+2)/2 states are needed. G_r is precomputed/cached along the same levels, not recomputed as an r-factor product at every state. Counts therefore require O(r^2) integer additions/multiplications and O(r^2 b) bits of storage, with conservative O(r^2 b^2) bit work. Initial evaluation of the two n-bit examples and storage of physical signal indices are additional polynomial costs. The gate budget is charged numerically; no polynomial bound in its binary encoding length is asserted.

## 5. Uniform sampling with explicitly implemented local choices

Compute H_s and return EMPTY if zero. Otherwise draw a uniform integer R in [0,H_s); ceil(log_2 H_s) fair bits with numerical-interval rejection accept with probability at least one half. This is not rejection of candidate circuits.

At a current physical prefix, for each candidate new column z set

    Q_z=4(k^2+c^2) for agreeing z,
    Q_z=4(k^2-c^2) for differing z,
    h_z=H_(r-1)(k+1,c+[z agrees],m_y+[z=y],y).

Partition the current rank interval into four blocks of lengths Q_z*h_z. After choosing z, quotient and remainder by h_z choose respectively one of its Q_z physical gate triples and a suffix rank. Zero blocks are skipped.

Those triples can be decoded without scanning k^2 pairs:

- Both predecessors agreeing: c^2 ordered pairs, eight compatible gate types per pair; this group exists only for an agreeing z.
- First predecessor differing, second arbitrary: (k-c)k pairs, four types each.
- First predecessor agreeing, second differing: c(k-c) pairs, four types each.

These groups are disjoint and exhaustive. Integer division indexes a pair using stored lists of agreeing/differing physical signal indices. At most sixteen truth tables are checked to select the requested compatible type. On two rows there are exactly one or two distinct gate-table entries to fix, explaining the factors eight/four. Signal orientations and original indices are retained when the physical gate is printed.

Append that gate and repeat. At r=0, select the rank-th target-valued physical signal as output. The construction is a bijection between [0,H_s) and all compatible raw descriptions: first blocks partition by new column; subdivisions partition by actual gate; suffixes are bijective by induction; terminal choices are output indices. Therefore the sampler is exactly uniform on descriptions, not on distinct Boolean functions.

A straightforward implementation rebuilds the physical index pools in O(k+j) work per step. Together with precomputed counts, exact rank arithmetic and at-most-sixteen gate checks, its bit cost remains polynomial, for example O(r^2 b^2 + r(k+r) log(k+r+2)). Division on b-bit integers may conservatively be charged O(b^2). Repeated examples and contradictory labels are handled exactly by zero counts; r=0 and empty fibers are tested. This works with all unrestricted B2 gates, not only copy gates.

## 6. Why this is not polynomial in growing example count

Halving the number of column types does not resolve the growing-q state explosion. Reuse U53's construction: q unit-vector example rows and their input columns; D=2^q. Using D-q-2 OR gates (q>=2), make every column available. Now append L=D/2 copies chosen among one representative from each complementary pair. Every weak composition of L additions into L pair totals is reachable, giving

    binom(2L-1,L-1) >= 2^(L-1)

different projected states. Both zero and one are present, so target-zero suffix counts remain nonzero. For q=floor(log_2(s/2)), all these gates plus common zero-copy padding fit in s slots, and L>s/8; hence there are 2^Omega(s) states even after this quotient.

This lower bound concerns explicit projected-state enumeration, not every scalar counter. U53's copy resummation remains a counterexample to equating states with necessary work. Nor are the example lists claimed to be the actual histories produced by the full magnification construction.

## 7. Executed checks

TypeScript `code/u54_u55_audit.ts`:

- Literally enumerated 370,467 gate lists across n=1,2,3 and s=0,1,2, retaining output-index multiplicities. Their distributions were projected onto the declared ordered example lists, including repeated points. All 2,868 target-count comparisons agree with the complement quotient; 2,820 also compare to the independently stored full-histogram recurrence, the remaining 48 use complete four-row tables directly.
- All four-column histograms of total k=1..6 and r=0..4: 4,180 target counts agree among the full histogram, complement quotient and scalar algorithms. These include unequal orientation splits and synthetic boundary states, not all claimed actual prefixes.
- All 208,163 ranks in the declared two-row conditional fibers were decoded, replayed, checked unique, and compared to complete raw compatible-description sets. Empty/contradictory repeated-row labels are rejected.
- At r=128, k=5 the scalar count uses 8,385 states and counts as large as 1,997 bits. Only this exact recurrence and its mass identity were evaluated; the astronomically many underlying descriptions were NOT enumerated.

Python independently evaluates gate outputs as row tuples, enumerates small raw prefixes, propagates full four-column weights for the moment cases, and checks complement invariance for every parent pair at q=1..5 (1,364 pairs). It reads TypeScript output only after constructing its own results. Wolfram independently confirms two-row rate formulas on 44 (k,c) cases and U54's exact counterexample. These are independent implementations, not independent expert review or formal proof verification.

## 8. Research decision and next obligation

We have both a negative result (fixed moment order is not universally exact) and a positive replacement (an exactly closed symmetry quotient). Neither proves the ordinary general-circuit lower bound in OPS2021 Theorem 1.4; the growth in the number of examples remains decisive for this implementation.

The next materially different count representation to audit is backward ancestry. Starting from the output pointer, reveal only the gates in its dependency cone and sum unused gates analytically with their original 16(k+j)^2 weights. Derive a correct sum over shared live DAGs; do not replace shared subgraphs by independent trees or assume small average ancestry on the conditioned hard-target distribution. Test the exact weighting against the existing full-description counts before making a complexity claim. This is queued mathematics, not a running background task.

## Sources and attribution

OPS2021, *Hardness Magnification Near State-of-the-Art Lower Bounds*, DOI 10.4086/toc.2021.v017a011, Theorem 1.4 and footnote 13: https://theoryofcomputing.org/articles/v017a011/v017a011.pdf . Those pages were reread and rendered this run. Their anti-checker construction motivates the counter; no new magnification premise is established here.

Symmetry-based lumpability is established background; Banisch-Lima, *Markov Chain Aggregation for Simple Agent-Based Models on Symmetric Networks: The Voter Model*, DOI 10.1142/S0219525915500113, abstract read only. No detailed external theorem is imported. The gate-specific quotient and sampler are proved directly above, and focused searches do not establish global novelty.
