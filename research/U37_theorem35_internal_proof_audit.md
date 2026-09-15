# U37 — Full proof audit of the direct P!=NP Vertex-Cover magnification theorem

Date: 2026-09-14
Status: primary-source proof reconstructed; identifies exact missing lower-bound resource; no P versus NP resolution.

## 1. Primary source

Full ECCC TR18-139 version of Oliveira–Santhanam, “Hardness Magnification for Natural Problems,” Section 4.1, especially Theorem 35 (called Theorem 8 in the conference overview).

Theorem 35: let k(n)=n^{o(1)}. If for some epsilon>0, k-Vertex-Cover on n-vertex adjacency-matrix inputs of bitlength m=Theta(n^2) is not in DTISP[m^{1+epsilon},m^{o(1)}], then P!=NP.

The proof is by contrapositive.

## 2. Kernel used by the proof

Given G and parameter k:

1. T={v : deg_G(v)>k}. Reject if |T|>k.
2. Remove T and form G^- = G[V\T].
3. Delete isolated vertices from G^-.
4. Set k'=k-|T|.
5. Reject if the remaining graph G' has more than 2k^2 vertices.
6. Otherwise output (G',k').

Correctness: every degree>k vertex must belong to every size-k vertex cover. After removing those, maximum degree is at most k. A non-isolated graph on >2k^2 vertices has >k^2 edges, while k'<=k vertices of degree at most k can cover at most kk'<=k^2 edges.

Thus the kernel has at most 2k^2 vertices.

## 3. Crucial observation from the full proof

The theorem does NOT derive the desired time-space algorithm by reducing SAT into an adjacency matrix. It directly scans/manipulates the original adjacency-matrix Vertex-Cover instance and kernelizes it.

Under P=NP, the resulting poly(k)-size Vertex-Cover kernel is solved in polynomial time. Since k=n^{o(1)}, its size and the solver's time/space are m^{o(1)}.

The dominant cost is therefore the kernelization of the original m-bit adjacency matrix, not solving the kernel.

This confirms that U36's quadratic reduction-loss objection is irrelevant to the internal contrapositive proof itself; it only blocks importing Williams's existing SAT lower bound through a standard SAT->VC reduction.

## 4. What the source claims about kernelization complexity

For the time-space version, the full source says the vectors used in the AC0 proof need not be stored. Instead, using random access and logarithmic-space counting, one stores only a poly(k)-vertex list encoding the surviving kernel vertices, then outputs the adjacency matrix of G'. This is asserted to fit in time m^{1+epsilon} and space m^{o(1)} for k=n^{o(1)}.

In fact, inspecting the operations suggests the construction is close to linear in m up to subpolynomial factors:

- degrees of all n vertices can be computed by scanning n adjacency rows: Theta(n^2)=Theta(m) input inspections;
- T has at most k entries on non-rejected instances and can be stored in k log n=m^{o(1)} bits;
- testing whether a vertex outside T is isolated in G[V\T] can be done by scanning its row and checking endpoints against the stored T list;
- collecting at most 2k^2 surviving vertices uses poly(k)log n=m^{o(1)} space;
- outputting/checking the kernel adjacency matrix costs poly(k)^2 random input accesses=m^{o(1)}.

Naively checking membership in T by scanning the stored T list adds a factor k=n^{o(1)}, giving m^{1+o(1)} time, still below m^{1+epsilon} for every fixed epsilon>0 eventually.

## 5. Consequence: exact direct lower-bound target

To prove P!=NP through Theorem 35, it is enough to prove that this *particular decision problem* cannot be solved in m^{1+epsilon} time and m^{o(1)} space for some fixed epsilon, despite the fact that under P=NP the standard kernelization plus polynomial kernel solver would achieve m^{1+o(1)}.

Therefore the hard part cannot be the kernel construction alone: the kernel construction is unconditional and nearly linear. Any unconditional lower bound must show that no small-space algorithm can correctly solve the residual poly(k)-vertex kernel quickly on every input, even though reading/compressing the original matrix is cheap.

But the residual kernel has only n^{o(1)} vertices. An unconditional brute-force solver takes 2^{poly(k)} time, which may or may not fit m^{1+epsilon} depending on k. Under P=NP it becomes polynomial in k; this is exactly where the contrapositive uses the unresolved assumption.

## 6. Why Williams's inductive SAT simulations do not plug in directly

Williams's lower bounds begin from nondeterministic linear/quasilinear-time completeness and derive contradictions under a hypothetical fast deterministic small-space SAT algorithm. To apply them to the residual Vertex-Cover kernel, one would need a tight completeness/reduction statement showing that solving the small-k kernel family in m^{1+epsilon} small space simulates an appropriate nondeterministic class with sufficiently small exponent loss.

The original m input is huge compared with the poly(k)-size kernel. Standard SAT hardness of the kernel does not help because k=n^{o(1)} and the kernel's absolute size is subpolynomial in m. Conversely, encoding arbitrary linear-size SAT computations into such tiny kernels would amount to a strong compression.

Thus simply replacing the final P=NP kernel solver with Williams's hierarchy machinery does not produce a contradiction.

## 7. New sharpened frontier

Theorem 35 magnifies precisely because P=NP would make a tiny kernel easy. To prove its antecedent unconditionally, we need a lower-bound technique sensitive to the *information lost by kernelization/limited workspace*, not a standard NP-hardness reduction.

Two possible concrete attacks remain:

A. Time-space lower bound directly for adjacency-matrix k-Vertex-Cover using computation-cut/branching-program arguments, exploiting that a small workspace cannot retain enough information about the dense input while determining the tiny kernel's answer.

B. A compression lower bound: show that any m^{1+epsilon}-time, m^{o(1)}-space solver would induce a forbidden efficient compression/sketch for an explicit communication/query problem. This must be unconditional and avoid ordinary two-party communication's O(m) ceiling by using time-space product/sequence-of-cuts rather than a single protocol.

## 8. Next task

Develop the sequence-of-cuts route. For a T-time, S-space random-access computation, partition time into blocks and encode boundary configurations of S bits. Attempt to derive a multi-round communication or branching-program representation whose cost depends on T and S. Then instantiate it on a carefully chosen promise family of adjacency matrices where k is subpolynomial and Vertex-Cover encodes a known time-space-hard problem. Quantify all parameters before claiming transfer.

No statement here resolves P versus NP.