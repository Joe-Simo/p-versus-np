# U57 — Last-positive consistency states require nearly the full live budget

Date: 2026-09-15. Status: self-contained growing-parameter structural and sampler-specific bounds, with independent finite component checks. No P-versus-NP separation, general-circuit lower bound, formal verification, external expert certification, or novelty claim.
Dependencies: the explicit B2 gate convention and U56's counting identity. The main cutoff proof does not assume hardness magnification or any unproved complexity statement.

## 1. Main result: the proposed small-core shortcut fails on actual terminal histories

Let n>=1. Let Y be consistent labels on distinct n-bit inputs, and let x be a new input. Suppose at least one circuit of at most s B2 gates fits Y, but none fits Y together with (x,b).

Choose a set J of input coordinates separating x from all previously labeled inputs: for every z in Y, some coordinate in J differs between z and x. Write d=|J|; full J=[n] always works, so d<=n. The empty prior sample cannot satisfy the premises, because a single labeled point always fits a constant; hence a nonempty separator may be used.

**Theorem.** Every Boolean function fitting Y has circuit complexity strictly greater than s-d. In particular, every compatible raw s-gate description has at least s-d+1 syntactically live gates and at most d-1 unused slots.

With d=n this is at least s-n+1 live gates. In the active growing regime s=floor(N^beta/(10n)), N=2^n, the unused fraction is at most (n-1)/s, which tends to zero for every fixed beta>0. Unlike the synthetic prefix ensembles in U54, this applies to the last nonempty state of **every** valid sequential anti-checker that stops when its consistency set first becomes empty, including the U49 histories.

It does not claim every intermediate state is like this. Nor does it assume that identifying the terminal boundary is computationally free.

## 2. Proof by an explicitly charged correction circuit

Suppose, toward a contradiction, that g fits Y and has a circuit of at most s-d gates (this is impossible already if s-d<0). Then g(x) must differ from b; otherwise this size-at-most-s circuit also fits the extended labels. Let

    delta_(x,J)(z) = product_(i in J) [z_i=x_i].

This function is one at x and zero at every previously labeled point. Thus g'=g XOR delta_(x,J) fits the extended sample.

For d>=2, the delta function uses d-1 B2 gates: the first gate conjoins two appropriately signed literals, and every following gate conjoins one more literal with its sign absorbed into its truth table. One final XOR gate gives a total of d added gates. For d=1, XOR or XNOR with the single input bit implements the correction directly in one gate. Negated input wires are NOT assumed free.

The corrected circuit has at most s gates, contradicting the premise. This proves the complexity cutoff. Removing unused slots from any fitting raw description leaves a circuit with exactly its live-gate count, giving the liveness assertion. Shared subgraphs are neither duplicated nor charged as formulas. QED.

## 3. Exact consequences for the U56 sum

Write c_ell(Y) for the all-live core counts and W_j=16(n+2+j)^2. The theorem gives

    c_ell(Y)=0 for ell<=s-d.

Consequently

    H_s(Y)=sum_(u=0)^(d-1) e_u(W_0,...,W_(s-1)) c_(s-u)(Y),

where e_u is the elementary symmetric polynomial. All needed placement coefficients can be obtained in O(sd) integer operations. This is a positive shortening of the length sum, but the remaining terms are precisely the almost-s-sized live-core consistency problems.

A method that discards cores larger than s-d returns zero at this state even though H_s(Y)>0. Therefore it cannot be a zero-correct multiplicative approximation, regardless of how small this state's mass is under the unconditional prior. In particular, any sublinear live-size cap eventually fails in the growing regime. This rejects the specified truncation, not every representation or conditional sampler.

## 4. Average unconditioned ancestry is not the relevant conditional law

Let U_j be the number of gate occurrences in the unfolded dependency tree of raw gate slot j, counting a shared ancestor again at each occurrence. Initial signals have U=0. Averaging over independent uniform predecessors,

    E[U_j] = 1 + 2/(k+j) sum_(i<j) E[U_i]
           = 1 + 2j/(k+1).

The equality follows by induction. A uniformly selected output among k+s signals therefore satisfies

    E[U_output]=s/(k+1),  E[L]<=s/(k+1).

This is an unconditioned upper bound on distinct live gates, not a statement about the conditioned sample Y. For minimal parity at s=n-1, k=n+2, every correct circuit has all s gates live, whereas the prior unfolded expectation is (n-1)/(n+3)<1. That is an easy parity example, not a hard Gap-MCSP target. The actual-history theorem in Section 1 is what establishes the relevant growing-budget cutoff.

No asymptotic random-DAG result is needed for this elementary calculation.

## 5. A stronger normalization bound, with all unary gates accounted for

There are ten B2 truth tables depending on both inputs, and six that do not: the two constants, two projections, and their two negations.

**Normalization lemma.** If a circuit has B gates whose gate truth table depends on both inputs, its output function has a B2 circuit of size at most max(1,B).

Process the gates in order, keeping signed aliases for signals. A constant gate becomes a constant alias; a projection or negated projection becomes a signed predecessor alias. For a two-input-essential gate, keep one gate and absorb each incoming alias sign into its truth table. This preserves every current signal value without creating a gate for each NOT, even with fan-out.

At the output, an unnegated alias is already represented. A negated initial variable needs one NOT gate, and a negated constant needs none. If the output is a negated alias to a retained gate, discard all later retained gates, complement that gate's truth table, and make it the output. It has no later live use, so other required values are unaffected. This proves the bound. Note the necessary max(1,B): a lone NOT of an uncomplemented input costs one gate when B=0.

At a boundary with s-d>=1, Section 1 therefore forces B>=s-d+1. Thus every fitting raw description also has at most d-1 **non-two-input-essential gate types**, not just at most d-1 unused slots. The two notions are different, and neither was silently substituted for the other.

## 6. Exponentially rare last-positive states without a shrink assumption

Now take the uniform prior on all exact-s raw descriptions with k=n+2. Each gate type is independently uniform among 16 possibilities, independent of predecessor choices and the output index. By Section 5, at the boundary

    Pr[description fits Y]
      <= Pr[B >= s-n+1]
      = 16^(-s) sum_(u=0)^(n-1) binom(s,u) 6^u 10^(s-u).

For s>=16n, the threshold is at least 15s/16. Since B is binomial with success probability 5/8,

    Pr[B >= 15s/16] <= E[2^B]/2^(15s/16)
                     = (13/8)^s / 2^(15s/16)
                     < (7/8)^s.

The last constant comparison follows from the exact integer inequality 13^16 < 7^16 * 2^15. No floating-point tail approximation is used.

Hence blind rejection from this original prior requires at least (8/7)^s expected proposals for one uniform conditional sample requested at that last-positive state. This strengthens U50's implementation-specific diagnosis: no constant-shrink hypothesis is needed, only a positive-to-empty boundary. It still does not lower-bound an arbitrary conditional sampler, an algorithm that does not request such a sample, or an unrestricted circuit for the decision problem.

At the full growing budget this is 2^Omega(N^beta/n) expected proposals. The statement is about blind rejection, not an established time bound for P-versus-NP decision.

## 7. Separate topology-only tail bound, retained as a cross-check

Before the normalization bound, a weaker but independent ancestry argument was derived. Let m=floor(s/4), m>=4n, and look at the last m slots. If L>=s-n+1, at least m-n+1 of these slots are live. Except for the output root, each such vertex must be referenced by a later slot in this same block. Let X count all parent pointers from block gates to earlier block gates; then X>=m-n>=3m/4.

Each of the 2m independent parent choices lands in the block with probability at most 1/4, so E[2^X]<=(5/4)^(2m). Therefore

    Pr[L>=s-n+1] <= (5/4)^(2m) / 2^(3m/4) < (15/16)^m.

The constant comparison is (5/3)^4<8, equivalently 625<648. This bounds an unconditional topology event; it does not assert equality with the label-conditioned law. Section 6 is stronger for bounding the actual compatible fiber. Both were checked rather than deleting the weaker derivation from the research record.

## 8. Executed evidence and precise limits

- All 6,651 partial tables on n=1,2,3, at every s=0,1,2,3, were inspected. There are 12,458 single-example positive-to-empty boundary pairs in these finite classes. The minimum fitting budget, minimum coordinate separator, and predicted cutoff agree in every case; an explicit correction circuit was constructed and fully replayed for each pair.
- Example: n=3,s=3, labels represented by mask 254 and value 232. Removing point 1 gives a nonempty six-point sample with live-size spectrum (0,0,28160,6272). A two-coordinate correction of fitting table 234 gives table 233, fitting all seven labels but using four gates. Truncating the prior count to cores of size <=1 would falsely return zero instead of 34,432.
- The normalization routine was replayed on **2,415,788** output-tagged descriptions through two gates over n=1,2,3, including constants, repeated predecessors, earlier outputs, and unary gates. Every output is preserved and every result obeys max(1,B). This is finite code evidence accompanying the general signed-alias proof, not proof by exhaustive cases.
- Python independently checks every previous-set/new-point pair for n<=3 (1,046 cases), full raw output distributions, and 2,633,085 topology/block implications. Its topology enumeration verifies the exact unfolded expectation, independently of the scalar connected-count recurrence.
- Exact prior live-size tails were computed at (n,s)=(2,32),(3,48),(4,64),(8,128),(16,256). These are weighted integer computations, not literal enumeration of their enormous description spaces. The topology event probabilities satisfy the topology tail bound; exact binomial type tails satisfy the stronger type bound. These finite sizes are not claimed to instantiate hard anti-checker targets at those same n.
- Wolfram independently checks three topology histograms, eight exact parent-edge tail bounds, the first patch example, and coefficient arithmetic. It does not independently certify the general proofs or the signed-alias implementation.

All computations use exact counts/rationals. Displayed approximate tail ratios in exploratory console output are illustrations only, not proof inputs. No introduced compiler or assertion failure occurred in this cycle; final runs were repeated byte for byte. These are independent implementations, not independent expert review.

## 9. Full-target consequence and next obligation

The growing-example counter still lacks a cheap evaluation of c_ell(Y) for almost-full connected cores. The new identities separate a genuinely easy part (placement and unused-slot weights) from the still-unresolved label-dependent live computation. Large cores alone are not a general-circuit lower bound, and no premise of OPS2021 Theorem 1.4 is supplied.

The next specific test is to fix a shared live topology and derive its two-example gate-type sum. A candidate coupling identifies a gate's disagreement indicator with a fresh fair bit AND the OR of its two parents' disagreement indicators. Test this against literal gate-table enumeration before using it; assess it as a possible connection to directed site reliability. Do not import a reliability hardness claim without verifying its graph model and reductions, and do not assume hardness for a fixed topology transfers to the sum over all topologies (U55's unrestricted two-example counter is already polynomial).

## Source context and attribution

The actual-history application refers to the anti-checker construction in Oliveira-Pich-Santhanam (2021), Theorem 1.4, Lemma 4.7 and footnote 13, https://theoryofcomputing.org/articles/v017a011/v017a011.pdf . The needed terminal-boundary premise is stated and proved from scratch above; no detail of that paper is assumed to establish the cutoff or rarity bounds.

Janson (2024), DOI 10.1002/rsa.21195, is adjacent unconditioned random-DAG literature, not authority for a target-conditioned expectation. The proof here deliberately keeps that conditioning separate. Point-correction circuits, signed gate aliases, and probability-generating functions are elementary established techniques; focused searches do not establish novelty of these combinations, and none is claimed.
