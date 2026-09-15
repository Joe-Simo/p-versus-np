# U56 — Exact live-core summation, with unused slots integrated out

Date: 2026-09-15. Status: self-contained counting identity and constructive decoration sampler, with exact independent finite checks. No P-versus-NP solution, general counting lower bound, formal-kernel certification, independent expert review, or novelty claim.

## 1. The executed next step

U55 asked for a backward-ancestry representation that preserves sharing and raw-description multiplicities. This representation is exact and its unused-slot sum admits a polynomial-time coefficient calculation. It does not require enumerating every possible placement of a live core.

The resulting identity is

    H_s(Y) = sum_(ell=0)^s A_(s,ell) c_ell(Y),
    A_(s,ell) = [z^ell] product_(j=0)^(s-1) (16(k+j)^2 + z).

Here H counts all output-tagged raw descriptions satisfying labels Y, and c counts only descriptions with every gate in the output's syntactic dependency cone. The coefficient A is independent of the sample labels. Computing c for growing budgets remains unresolved by this identity. U57 tests precisely whether those cores can safely be assumed small.

## 2. Exact model

There are k named initial signals. In the full problem k=n+2: constants 0 and 1, followed by uncomplemented n input bits. More generally these k signals may have given columns on q sample rows; their physical indices remain distinct even when their columns coincide.

There are exactly s ordered gate slots j=0,...,s-1. Gate j chooses an ordered pair of indices in [0,k+j), repetition allowed, and one of the 16 binary Boolean operations. An output index is chosen from [0,k+s). Thus

    W_j = 16(k+j)^2,
    G_s = product_j W_j,
    total descriptions = (k+s)G_s.

Circuits with fewer gates are represented by padding unused slots and retaining the output pointer; this explains the equivalence of consistency with the at-most-s semantic class. Counts are nevertheless of exact-s raw descriptions, not distinct functions.

An ancestor follows BOTH predecessor pointers, including an ignored argument of a constant or projection gate. This is **syntactic**, not semantic, liveness. Shared predecessors are one vertex, not independent copies. A raw description with initial-signal output has no live gates. With a gate output, the compressed live core has ell gates, all ancestral to its last gate, which is the output. Compressed gate indices preserve the original relative order. For ell=0 the core records the initial output index, so c_0(Y) is the number of matching initial signals.

## 3. Bijection and weight proof

Prune a raw description to its ancestor gate set J={j_0<...<j_(ell-1)}. Every live predecessor is either an initial signal or an earlier member of J. Removing the other gates and relabeling J in order therefore gives a unique compressed all-live core. Its sample output is unchanged.

Conversely, fix a compressed core and a subset J of the s slots of size ell. Embed the core in J, translating each live predecessor to its corresponding physical slot. Each unselected slot j can independently choose ANY of its W_j raw gate triples, including pointers to previous unused slots or live slots. Such choices cannot change the output or make an unused slot ancestral: no live slot points to it. The number of decorations is exactly

    product_(j notin J) W_j.

This inverse reconstructs a unique description. In particular, no extra factor for an output gate is appropriate: for ell>0 it is the largest member of J. For ell=0 the initial-output choice is already in the core count. Summing over all J proves the stated coefficient identity, with each raw description counted once.

There is no premise that unused gates are semantically constant, independent in value, or inaccessible to later unused gates. Only their absence from the output's pointer ancestry is used.

## 4. All placement weights in polynomial bit work

The coefficients satisfy

    A_(0,0)=1,
    A_(s,ell)=W_(s-1) A_(s-1,ell) + A_(s-1,ell-1),

with out-of-range entries zero. All coefficients through s take O(s^2) integer operations. They have O(s log(k+s+2)) bits; schoolbook arithmetic therefore gives, for example, O(s^2 b^2) bit work and O(s^2 b) storage, b=O((s+1)log(k+s+2)). The budget is numerical/unary, not its binary bit length alone.

Given the c_ell(Y), the final contraction takes O(s) further products/sums of similarly bounded integers. This explicitly charges but does not supply the label-dependent core counts. A bound on arithmetic operations for A must not be confused with an algorithm for H without c.

## 5. Exact uniform decoration and conditional sampling

Let E(i,l)=[z^l] product_(j=i)^(s-1)(W_j+z). With l active slots still needed, the rank interval at slot i has two parts:

- Active slot: E(i+1,l-1) possibilities. Insert the next core gate, translating its predecessor indices.
- Unused slot: W_i E(i+1,l) possibilities. Divide the residual rank by E(i+1,l) to select one actual gate triple; the remainder is the suffix rank.

This is a bijection from [0,A_(s,ell)) to decorated embeddings of any fixed core. It neither samples positions uniformly nor rejects candidate circuits. Fair-bit interval sampling to choose a numerical rank has acceptance at least one half.

If an explicit uniform listing/unranker for the c_ell(Y) compatible cores is available, a complete raw-description unranker first selects ell and a core from blocks of size c_ell(Y)A_(s,ell), then unpacks the decoration rank as above. Each completed description has probability exactly 1/H_s(Y). The code supplies these lists by fully charged finite enumeration on its declared small domains, not by an oracle. The growing-budget core-list cost remains real.

A simple trap: with k=3,s=2 and one fixed one-gate core, placing it first has 256 decorations; placing it last has 144. The correct embedding probabilities are 16/25 and 9/25, not 1/2 and 1/2. All 400 ranks were checked.

## 6. Unconditional ancestry is itself exactly countable

Sum c_ell(Y) over all possible output labels, obtaining C_ell(k). Since A_(s,s)=1 and the unrestricted total is known,

    C_0(k)=k,
    C_s(k)=(k+s)G_s - sum_(ell<s) A_(s,ell) C_ell(k).

This gives every unconditional all-live count through s in polynomial bit work. Although this form subtracts, the bijection proves nonnegativity. The exact prior distribution is

    Pr[L=ell] = A_(s,ell) C_ell(k) / ((k+s)G_s).

No type semantics need be evaluated for this prior. Every topology has 16^ell type assignments, so C_ell/16^ell is the connected predecessor-topology count for ell>0. This scalar recurrence does not compute c_ell(Y) after labels are imposed.

## 7. Sharing cannot be replaced by independent branches

For a free choice of one binary gate h on two input bits, the shared core XOR(h,h) is identically zero for all 16 choices of h. Replacing it with independent h_1,h_2 gives XOR(h_1,h_2), identically zero for only 16 of 256 pairs. The latter is a different three-gate object, not an equivalent way to sum the two-gate shared core. Both distributions were checked explicitly.

A blind all-live enumeration still has an exponential candidate count: fixing every gate after the first to take its previous gate as its first predecessor leaves at least

    16^ell k^2 product_(j=1)^(ell-1)(k+j)

typed connected cores. This is a lower bound on the enumerator's candidate space, **not** on every method for evaluating a label-dependent scalar sum. The easy unconditional recurrence above illustrates why the distinction matters.

## 8. Actual finite evidence

TypeScript `code/u56_u57_audit.ts`:

- Enumerated 31,458,604 typed connected cores across n=1,2,3 and ell=0,1,2,3, retaining ordered predecessors, repeated pointers, every gate type and initial-output choices.
- Separately enumerated 370,467 raw gate lists through two slots, covering 2,415,788 output-tagged descriptions. The joint distribution of output truth table AND live size equals A_(s,ell)c_ell for every cell.
- For three slots, all 276 truth-table coordinates across n=1,2,3 agree with the independent full-description distribution constructed by Python. Higher raw totals, including 1,445,068,800 descriptions at n=3,s=3, are obtained by weighted last-gate summation, NOT by individually executing that many full descriptions.
- Exhausted 51,311 conditional ranks in six nonempty declared parity fibers, plus three empty fibers. Each physical circuit replays correctly, all ranks are distinct, and their cardinalities equal independently checked raw counts. The extra one-core decoration test has 400 ranks. Negative and upper-end invalid ranks are rejected.
- At n=3,s=3, the parity spectrum by live size is (0,0,42240,7296). Here c_2=24, c_3=7296 and A_(3,2)=1760. This also illustrates that gate-budget slack changes the conditional ancestry distribution.
- Computed exact unconditional prior distributions through 256 slots in the declared rows; no large-description enumeration is claimed.

Python `code/u56_u57_independent.py` computes Boolean counts by literal row-vector evaluation of raw two-gate prefixes and a final-gate sum from single/pair masses, without using the live-core identity. Separately it enumerates 191,853 predecessor topologies with 1,383,156 output cases. Only after independent construction does it read the TypeScript result for comparison.

Wolfram independently checks three topology histograms, coefficient arithmetic, unequal embedding weights, and a correction example. Its parity core counts are explicitly supplied, not claimed independently enumerated by that call. Full results and code distinguish these coverage levels.

## 9. Interpretation

Backward summation is a valid positive replacement for explicit enumeration of all dead-slot decorations. It is not a solution to the remaining connected-core consistency problem. U57 establishes that immediately before an anti-checker becomes inconsistent, every fitting circuit has a nearly full live core; truncating this exact sum at a small live size returns a false zero.

## Source context

The active external target remains Oliveira-Pich-Santhanam, *Hardness Magnification Near State-of-the-Art Lower Bounds*, Theory of Computing 17(11), 2021, DOI 10.4086/toc.2021.v017a011, Theorem 1.4 and footnote 13: https://theoryofcomputing.org/articles/v017a011/v017a011.pdf . The former requires one fixed epsilon for every sufficiently small beta and an ordinary general-circuit lower bound. Neither a cheap decoration sum nor a prior ancestry statistic proves that premise.

Adjacent primary research: Svante Janson, *The number of descendants in a random directed acyclic graph*, Random Structures & Algorithms 64 (2024), 768-803, DOI 10.1002/rsa.21195, https://onlinelibrary.wiley.com/doi/full/10.1002/rsa.21195 . Its introduction, backward-exposure description in Section 2.1 and several-root discussion were consulted; its limiting laws concern an unconditioned random DAG. No asymptotic theorem from it is a dependency of the identities here or is applied to the target-conditioned distribution. Focused searches did not authenticate originality, and no novelty claim is made.
