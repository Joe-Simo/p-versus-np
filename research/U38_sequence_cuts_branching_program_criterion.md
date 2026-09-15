# U38 — Sequence-of-cuts route: branching-program conversion is valid, but the missing object is a hard restriction family for small-k Vertex Cover

Date: 2026-09-14
Status: literature-backed lower-bound framework instantiated and audited; no P versus NP resolution.

## 1. Goal

Continue U37's proposed sequence-of-computation-cuts route for adjacency-matrix k-Vertex-Cover. Determine what a T-time, S-space random-access algorithm implies structurally and what property of Vertex Cover would suffice for a superlinear lower bound.

## 2. Random-access algorithms to branching programs

A deterministic T-time, S-workspace random-access computation can be unfolded into a leveled branching program whose levels encode time and whose nodes encode machine configurations. Up to standard logarithmic overhead for the program counter/addressing state, the branching program has:

    length O(T),
    width 2^{O(S+log T)}.

Conversely, branching-program lower bounds apply to RAM/Turing models in the literature used for time-space tradeoffs. Beame–Vee explicitly use general branching programs with time equal to longest path and space log(size), and state that their lower bounds imply lower bounds for Turing machines and RAMs.

Thus U37's sequence-of-cuts idea is not a new model: it is essentially the general branching-program framework where cut configurations are branching-program nodes.

## 3. The known general criterion

Beame–Vee (STOC 2002), extending Beame–Saks–Sun–Vee and earlier work, prove a criterion for general branching programs based on embedded p-cylinder intersections.

Informally: divide a length-kn branching computation into many blocks. For a suitable p-way assignment of blocks, each party has a substantial set of variables unseen in its blocks. Fixing the boundary nodes between blocks plus a spine assignment yields an embedded p-cylinder intersection contained in one output fiber of the program. If the program has small space, at least one such cylinder intersection must have substantial density and substantial 'feet'.

Therefore, to prove a time-space lower bound for a function f, it suffices to show that f cannot be constant on any sufficiently dense embedded p-cylinder intersection with sufficiently large feet.

This is precisely the rigorous version of the proposed 'accumulated information transfer across many cuts' approach.

## 4. Why this escapes U31's O(N) communication ceiling

U31 considered one ordinary two-party protocol and obtained only O(N) communication. The branching-program criterion uses many computation blocks and records a sequence of boundary nodes. Its structural consequence is not simply D^cc(f)>R => circuit size>R. Instead, a low-time/low-space program forces a large structured monochromatic set. One then rules out that set combinatorially.

Thus the framework can yield superlinear time lower bounds even though ordinary communication is at most linear.

## 5. What must be proved for k-Vertex-Cover

Let f_{n,k} be adjacency-matrix k-Vertex-Cover on M=binom(n,2) Boolean variables (edge bits), with k=n^{o(1)}.

To use the general branching-program criterion, we need a promise/restriction family R of adjacency matrices satisfying both:

A. Vertex-Cover remains nonconstant/hard on R for the chosen k.
B. Every sufficiently dense embedded p-cylinder intersection over the remaining edge variables contains both a YES graph (vertex cover <=k) and a NO graph (vertex cover >k).

If B could be proved with parameters strong enough that any length M^{1+epsilon}, space M^{o(1)} branching program forced a forbidden monochromatic cylinder, Theorem 35 of Oliveira–Santhanam would yield P!=NP.

This is now an exact combinatorial target.

## 6. Immediate obstruction from the kernel structure

Small-k Vertex Cover has a severe asymmetry. A YES graph with cover C of size k has no edges entirely inside V\C. Therefore all edge variables among n-k outside vertices are forced to zero. The number of potentially free edge bits in a YES graph with a fixed cover C is only

    binom(n,2)-binom(n-k,2) = kn - binom(k+1,2) = O(kn).

For k=n^{o(1)}, this is n^{1+o(1)}, whereas the full adjacency matrix has M=Theta(n^2) bits.

Thus every fixed-cover YES subcube has dimension only O(kn)=M^{1/2+o(1)}, and fixes M-O(kn) edge variables to zero.

This makes it difficult to prove that a *large-foot/high-density* cylinder intersection necessarily contains a YES graph: most of the Boolean cube consists of dense graphs whose minimum vertex cover is n-O(log n), far above k.

## 7. Lemma U38.1 — density of the YES set is exponentially tiny in M for subpolynomial k

For a fixed cover C of size at most k, all binom(n-|C|,2) edges outside C must be absent. There are at most 2^{O(kn)} graphs compatible with C. Union bounding over at most n^k choices of C gives

    #YES <= n^k * 2^{kn}

(up to harmless lower-order terms), while the universe has 2^M graphs.

Hence

    Pr_G[VC(G)<=k] <= 2^{-M + O(kn+k log n)}
                         = 2^{-Theta(n^2)}

when k=n^{o(1)}.

So the YES set has exponentially tiny density in the full adjacency-matrix cube.

## 8. Consequence for cylinder methods

Known branching-program criteria are often most effective for reasonably balanced functions/output fibers, or after finding restrictions where a large hard core remains. Directly applying a density argument to unrestricted small-k Vertex Cover is poorly matched because the YES fiber is extraordinarily sparse.

Therefore the next task is not merely 'prove cylinder discrepancy for Vertex Cover'. We first need a restriction/promise distribution that balances YES and NO while retaining many independent edge variables and preserving k=n^{o(1)}.

## 9. Candidate balanced promise

A natural attempt is to hard-wire a base graph that already requires k-1 cover vertices, then leave a large gadget whose state decides whether one additional cover vertex suffices or at least two are needed. But a single local gadget is too easy; to obtain a time-space lower bound, many distributed edge blocks must jointly determine the +1 versus +2 gap while the total optimum stays near k.

This suggests encoding a global communication predicate into the choice among many alternative size-k covers, rather than into dense arbitrary graphs.

The combinatorial design problem is:

    construct a family G(z) on n vertices, indexed by many independent bits z,
    such that tau(G(z)) <= k iff H(z)=1,

where H has strong embedded-cylinder/discrepancy lower bounds, k=n^{o(1)}, and each z-bit controls O(1) or locally computable adjacency entries.

A construction with near-linear locality and H chosen from a known branching-program-hard function could transfer its time-space hardness to k-Vertex-Cover without a generic SAT reduction.

## 10. Next attack

Try H = generalized inner product / tensor function used in Beame–Vee, because its cylinder discrepancy is already proved. Design a parameterized Vertex-Cover gadget whose minimum cover has baseline k0 plus a one-bit gap equal to H(z), while keeping total vertices polynomial in the number of H variables and k=n^{o(1)} relative to the final graph size.

First audit whether standard graph gadgets necessarily require k linear in the number of encoded variables. If yes, quantify the barrier; if no, derive the local reduction and transfer the known branching-program lower bound.

No statement here resolves P versus NP.