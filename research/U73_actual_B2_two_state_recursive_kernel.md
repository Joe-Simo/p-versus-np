# U73 — An actual four-row B2 gate realizes a persistent two-state multiplicity imbalance

Date: 2026-09-16. Status: exact local construction and transfer-matrix analysis; no P-versus-NP resolution.
Dependencies: U70-U72.

## 1. Goal

U72 proved that multiplicative local-weight variation can create exponential importance variance in an abstract recurrence, but explicitly left open whether such a recurrence can occur inside the actual four-row B2 circuit model. This note executes the first realization search.

## 2. Exact local gadget

Use four sampled rows indexed 0,1,2,3. Let the fixed first parent column be

    A = 0001

(bit 0 is one, the others zero). Restrict the live second-parent/state column to

    b0 = 0001,
    b1 = 0010.

Require the child to disagree on row pair (0,1), and require the child column to remain in {b0,b1}. Literal enumeration of all sixteen B2 truth tables gives the transition-count matrix

             next b0   next b1
    b0          4          0
    b1          2          2

Every entry is the number of raw two-input Boolean truth tables producing that child column from the specified parents while satisfying the routed disagreement requirement. The requirement is automatically satisfied by both allowed child states because both b0 and b1 separate rows 0 and 1.

This is a genuine B2 local multiplicity imbalance: state b0 has four continuations and state b1 splits into two continuations of each state. It is not the symmetric 2-versus-1/2 recurrence used in U72, but it proves that persistent hidden-state-dependent local multiplicities are realizable by ordinary B2 gates.

## 3. Recursive chain

Repeat the same gate gadget m times, always using A=0001 as first parent and the previous state column as second parent. If the initial state-count row vector is v0=(1,1), exact raw-description counts evolve as

    v_m = v0 M^m,
    M = [[4,0],[2,2]].

The eigenvalues are 4 and 2. Direct multiplication gives

    v_m = (2*4^m - 2^m, 2^m),
    total = 2*4^m.

Thus under the exact conditioned distribution, the b1 branch has probability 2^m/(2*4^m)=2^(-m-1), exponentially small, despite being present at every depth.

This is already enough to falsify any proposal that treats the two live states as approximately equiprobable or summarizes them only by the common disagreement bit.

## 4. Relation to naive sequential conditioning

A sampler that knows the current full four-row state and chooses uniformly among the locally allowed raw B2 tables is exact for this simple Markov chain only if it also accounts for the number of valid suffix completions from the chosen next state. Local uniform choice alone does not: from b1 it chooses b0 and b1 with probability 1/2 each, while their future completion masses differ by a factor that approaches 2^(remaining depth).

Therefore the missing correction is a backward partition function on the live state. For this two-state chain that correction is trivial: compute powers of M or a two-state backward recurrence. The example is consequently **not an approximation-hard family**. Its value is structural: it realizes the hidden-state phenomenon inside the actual B2 model and shows exactly why local rank alone is insufficient.

## 5. Independent computation

Wolfram exhaustively searched one-gate candidates. Among a restricted search it found 960 nonsymmetric two-state transition systems with at least two distinct positive multiplicities. The first reported witness is exactly A=0001, states {0001,0010}, routed pair {(0,1)}, with matrix [[4,0],[2,2]]. A separate exact matrix-power calculation returned totals 8,32,128,...,2*4^m through m=12 and eigenvalues {4,2}. The second call emitted only a harmless global-symbol warning; the arithmetic output is exact and the formulas above are proved directly.

## 6. Consequence and next frontier

Carrying the complete state repairs this chain with only two states. The true question is therefore not whether local conditioning can be biased—it can—but whether a fixed multi-path certificate can force the number of simultaneously relevant four-row side states to grow with topology frontier width.

Next construct a reconvergent ladder with k live side signals, each capable of the b0/b1 distinction, and determine whether exact suffix weights factor across signals. If they factor, a polynomial correction survives. If shared gates couple them, compute the transfer tensor and measure its rank/treewidth. The correct complexity parameter is likely frontier width, consistent with U66's exact factor-graph result.

No statement here resolves P versus NP.