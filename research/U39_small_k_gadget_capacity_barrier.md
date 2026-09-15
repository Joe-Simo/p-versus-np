# U39 — Small-k Vertex-Cover gadget capacity: standard choice-per-bit encodings cannot meet the magnification regime

Date: 2026-09-14
Status: exact combinatorial audit plus literature context; no P versus NP resolution.

## 1. Target

U38 proposed encoding a branching-program-hard predicate H(z) into a graph G(z) such that tau(G(z))<=k iff H(z)=1, while keeping k=n^{o(1)} in the final graph. Test whether standard Vertex-Cover gadget reductions can satisfy this.

## 2. Standard variable gadgets spend cover budget linearly

The textbook SAT-to-Vertex-Cover construction represents a Boolean variable by an edge between two literal vertices. Any cover of the intended optimum must select at least one endpoint of each such edge. Therefore q independently encoded Boolean choices require cover budget at least q before clause/consistency gadgets are counted.

More generally, if a reduction contains q pairwise vertex-disjoint edges whose endpoint choice represents q independent binary decisions, every vertex cover has size at least q because each disjoint edge needs a selected endpoint.

Hence any 'one disjoint choice gadget per source bit' construction has

    k >= q.

If q is polynomially related to the final graph size n, this violates k=n^{o(1)}.

## 3. Lemma U39.1 — matching-based choice gadgets force large k

If G contains a matching of size q, then tau(G)>=q.

Proof: each vertex covers at most one edge of the matching, so covering all q disjoint edges requires at least q vertices. QED.

Thus any reduction whose independent source choices create a matching of comparable size automatically spends the same order of cover budget.

## 4. Number of possible small covers is not itself an information lower bound

An n-vertex graph has at most

    sum_{j=0}^k binom(n,j)

candidate covers of size at most k, which is at most (en/k)^k for k<=n/2. Its logarithm is O(k log(n/k)).

It is tempting to conclude that a small-k graph cannot encode many source bits. That conclusion is invalid in general: the input information resides in the adjacency matrix, not only in the identity of the winning cover. A single candidate cover can be valid or invalid depending on many edge bits. Therefore cover-counting alone is not a reduction lower bound.

The valid barrier is narrower: constructions that use distinct selected vertices to record independent choices pay directly in k.

## 5. Kernelization literature context

Vertex Cover itself has a polynomial kernel: classic reductions yield O(k) vertices (e.g. the Nemhauser-Trotter 2k-vertex kernel), while simple Buss-style reasoning gives O(k^2)-scale edge/kernel bounds. Dell–van Melkebeek prove conditional evidence that O(k^{2-epsilon})-edge kernels for Vertex Cover would imply coNP subset NP/poly and collapse PH.

These results reinforce that small-k Vertex Cover is highly compressible to poly(k) size, but they do NOT unconditionally rule out the special reduction sought in U38. The Dell–van Melkebeek lower bound is conditional and cannot be used inside a proof of P!=NP without circular assumptions.

## 6. Consequence for GIP/tensor gadget plan

The obvious plan—one variable/bit gadget for every coordinate of a generalized-inner-product or tensor input—fails the k=n^{o(1)} requirement because it creates a large matching or otherwise requires one selected vertex per independent choice.

To keep k subpolynomial while H has many input coordinates, a successful encoding must reuse the same small set of potential cover vertices to test many input bits. In other words, source information must affect *whether a small global set covers all edges*, rather than be stored as one local cover choice per source bit.

## 7. A different encoding template

Let C={c_1,...,c_k} be a small candidate cover set and U a large outside set. Because a YES graph with cover C cannot contain edges inside U, the only variable edges are between C and U or within C. A fixed C therefore always covers all such variable edges, so edge values alone cannot make C cease being a cover unless some U-U edge is introduced.

To create a one-bit YES/NO gap while keeping the optimum near k, one can make many candidate cover sets C_s and let the input determine whether at least one candidate survives. The computational problem becomes an OR over many globally constrained candidate covers.

There can be n^{O(k)} candidate k-sets, enormous even for subpolynomial k, so this template has more expressive capacity than one-gadget-per-bit. The challenge is to encode a branching-program-hard predicate into the simultaneous invalidation of all candidate covers using locally controlled edge bits.

## 8. New exact reformulation via independent set

Vertex Cover satisfies

    tau(G) <= k  iff  alpha(G) >= n-k,

where alpha is maximum independent-set size. For k=n^{o(1)}, the question is whether the graph contains an independent set containing all but k vertices.

Equivalently, the complement graph has a clique of size at least n-k. Thus small-k Vertex Cover asks whether deleting at most k vertices makes the original graph edgeless, or whether the complement is 'almost complete.'

This deletion-to-edgeless formulation may be better for communication gadgets: each selected cover vertex deletes all incident violations simultaneously, allowing one selected vertex to account for many source bits. It exposes the needed compression mechanism rather than fighting it.

## 9. Next attack

Construct a promise family in which each of k deletion vertices corresponds not to one source bit but to one *block* or *party*, and its incident edges encode an entire string. Then tau<=k iff there exists a choice of one deletion vertex from each block satisfying a global consistency predicate. Analyze whether this becomes a known hard communication problem (set disjointness/GIP) and whether the graph can be built with k=n^{o(1)} while retaining enough independent adjacency variables for the Beame–Vee cylinder criterion.

No statement here resolves P versus NP.