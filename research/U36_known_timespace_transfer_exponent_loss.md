# U36 — Known SAT time-space lower bounds transfer to Vertex Cover only under very tight reductions; adjacency-matrix encoding destroys the exponent naively

Date: 2026-09-14
Status: primary-source-informed transfer audit; no P versus NP resolution.

## 1. Source checked

Ryan Williams, “Inductive Time-Space Lower Bounds for SAT and Related Problems” (journal version; source PDF from author site). The paper proves, for deterministic random-access machines, SAT not solvable in n^{1.7327} time and n^{o(1)} space, and states that its lower bounds transfer to NP problems admitting simultaneously quasi-linear-time/polylog-space reductions from SAT with locally computable output bits. It explicitly lists Vertex Cover among examples.

The same source defines the random-access Turing model and emphasizes that tight reduction complexity matters.

## 2. Generic exponent-transfer calculation

Suppose a SAT instance of bitlength n is reduced to a target instance of encoded bitlength M=Theta(n^a polylog n). If the target had a deterministic M^c-time, M^{o(1)}-space algorithm, composing gives SAT time approximately n^{a c+o(1)}.

Therefore Williams's rho=1.7327 SAT lower bound transfers only for

    a*c < rho,

or

    c < rho/a.

To obtain any superlinear target lower bound c>1, we need a<rho≈1.7327. A quadratic encoding blowup a=2 yields only c<0.86635, which is weaker than linear and useless for the U35 magnification premise.

Wolfram checked rho/a for representative a: 1 ->1.7327; 1.1->1.5752; 1.5->1.1551; 2->0.86635.

## 3. Why adjacency matrices are the problem

Standard gadget reductions from SAT to Vertex Cover can produce a graph with V=Theta(n polylog n) or similar near-linear vertex/edge description size when represented sparsely. Williams's transfer theorem is compatible with such tight encodings.

But U35 requires the Vertex Cover input to be an adjacency matrix of m=Theta(V^2) bits. If V is linear (or quasi-linear) in the SAT input length, writing the full adjacency matrix creates roughly quadratic encoded length. A target m^{1+epsilon} algorithm then corresponds to SAT time roughly n^{2(1+epsilon)}, far above the known 1.7327 lower-bound exponent. No contradiction follows.

Thus the already-known SAT lower bound cannot be plugged into Theorem 8 through the naive SAT->Vertex-Cover gadget reduction plus explicit adjacency-matrix encoding.

## 4. Small-k issue is independent

The standard SAT-to-Vertex-Cover reduction also typically sets the target cover size proportional to formula size (e.g. one choice per variable plus clause-gadget contributions), so k is polynomial/linear in the number of gadgets, not n_graph^{o(1)} in the magnification theorem's intended small-parameter regime.

Therefore two constraints fail simultaneously:

1. adjacency-matrix encoding causes quadratic length blowup;
2. the natural target k is too large.

Fixing only one is insufficient.

## 5. What a successful reduction would need

To transfer the existing rho=1.7327 lower bound and obtain a target exponent 1+epsilon, a reduction from SAT length n to adjacency-matrix Vertex Cover length m must satisfy

    m <= n^{a+o(1)} with a < rho/(1+epsilon) < rho.

Since m=Theta(V^2), this requires

    V <= n^{rho/(2(1+epsilon))+o(1)},

which is sublinear in n for every epsilon>=0 because rho/2≈0.86635.

At the same time it must map to k(V)=V^{o(1)}.

So a direct many-one reduction would need to compress an n-bit SAT instance into a Vertex-Cover graph with sublinear number of vertices while preserving exact satisfiability and tiny cover parameter. That is far stronger than standard gadget reductions and resembles a nontrivial compression/kernelization phenomenon.

## 6. Important caveat

This calculation does not prove such a reduction impossible. It proves the standard near-linear-vertex gadget route cannot leverage the existing 1.7327 SAT time-space lower bound once the target is charged for a full adjacency matrix.

A different lower-bound proof could work directly on adjacency-matrix Vertex Cover without reducing from SAT, or could exploit the magnification theorem's kernelization structure rather than transfer the known SAT exponent.

## 7. Next attack

Study Theorem 8's proof itself rather than trying to import the old SAT lower bound. The contrapositive/kernelization construction may reveal the exact computation whose time-space lower bound is needed. Re-derive the magnification proof and identify whether one can strengthen one of its internal hierarchy contradictions using the Williams inductive simulations, potentially avoiding the quadratic reduction loss.

No statement here resolves P versus NP.