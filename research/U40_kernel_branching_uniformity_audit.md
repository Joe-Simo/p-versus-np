# U40 — Kernelization gives a nonuniform branching-program upper bound

Date: 2026-09-15 (UTC).
Project: P versus NP only.
Base remote revision: `00655a55757b6ef9160c21687567937df3912eca`.
Status: complete elementary derivation, self-audited and supported by finite checks; not a P-versus-NP solution, formal proof, or independent expert verification.
Corrects: the proposed general-branching-program target in U38 and its continuation in U39; also the source substitution in U34.

## 1. The decisive issue

U38 proposed proving a superlinear time lower bound for adjacency-matrix small-parameter Vertex Cover against general branching programs, then invoking a theorem about uniform time-space algorithms. That stronger branching-program lower bound is false in the required space regime: an unconditional linear-query branching program already exists.

The reason is not merely that an available lower-bound technique is weak. After a short computation has stored a small exact kernel, a nonuniform branching program may attach the correct answer to every possible terminal state. No efficient algorithm for constructing those labels is required in this model.

This observation does not give a fast uniform Vertex-Cover algorithm. It identifies where replacing uniform computation by a more permissive nonuniform model loses the difficulty.

## 2. Definitions and source contract

Let G be a simple undirected graph on vertex set [v]. Its input consists of M = binom(v,2) independent edge bits, in lexicographic order of unordered pairs. There are no diagonal bits, multiple edges, or encoding ambiguities. Fix an integer 0 <= k <= v. Write tau(G) for its minimum vertex-cover size.

A binary branching program queries one input coordinate at each nonterminal node and follows the edge labeled with that bit. Its time is maximum consistent path length. Its space here is log_2 of the total number of nodes, as in [S2, Section 2]; using log width instead only removes an additive O(log M).

The input-query order may repeat coordinates. An oblivious program has one fixed coordinate per level, independent of the input. Its graph, transitions, and terminal labels are nonuniform; construction time is not part of query time.

[S1, Theorem 35] concerns a uniform random-input-access Turing-machine model, not arbitrary branching programs. The implication from a branching-program lower bound to a uniform lower bound is valid, but it is useless when the branching-program lower-bound premise is false.

## 3. A three-query-per-edge kernel transducer

Compute H = {u : deg_G(u) > k} by scanning every off-diagonal row. Each independent edge is read twice. Keep a degree counter and the list H, rejecting immediately if its length exceeds k.

If not rejected, put k' = k - |H|. Scan the independent edge bits once more. Retain exactly those present edges with both endpoints outside H. Reject if their count would exceed k*k'. Otherwise retain the full residual edge list E'. Every retained endpoint is an original vertex label.

The output is either REJECT or (k',E'). The procedure needs at most 3M input queries and retains at most k^2 edges. No v-bit degree vector, membership vector, or whole input matrix is stored.

### Correctness

Every vertex of degree greater than k must occur in every cover of size at most k: omitting it forces more than k distinct neighbors into the cover. Thus |H| > k certifies rejection.

When |H| <= k, a cover of G of size at most k exists exactly when G-H has a cover of size at most k'. All edges touching H have already been covered. Each vertex of G-H has degree at most k, because deleting vertices cannot increase degrees. Therefore a k'-vertex set covers at most k*k' residual edges. Rejecting when the residual count exceeds k*k' is sound.

On a nonrejected input E' is the entire residual graph, up to isolated vertices, and

    tau(G) <= k  iff  tau(([v] minus H, E')) <= k'.

These arguments include k=0, k'=0, an edgeless graph, and v in {0,1}. The first two reject upon finding an incompatible edge; the latter cases are immediate.

### Resources

The lists and counters require

    B(v,k) = O((k+1)^2 log_2(v+2)) bits.

The query schedule can be fixed: two endpoint-row reads of each edge and one final upper-triangle scan. A rejecting state can be made absorbing while the rest of the fixed schedule is performed.

As a uniform transducer, scanning the H list for membership gives a conservative bound M*poly(k+1,log(v+2)) time and B(v,k) space. As a branching program, each finite update is encoded directly by the transition table and costs just the corresponding input query. These are deliberately different cost models.

## 4. Theorem U40.1 — unconditional nonuniform upper bound

For every v and 0 <= k <= v, adjacency-matrix k-Vertex-Cover has an oblivious binary branching program of length at most 3M and space

    O((k+1)^2 log(v+2) + log(M+2)).

### Proof

Make a node for each reachable pair (query level, transducer state). There are at most (3M+1)*2^{O(B(v,k))} such nodes. Transitions implement the transducer above. All nodes at a level query the same edge bit.

At the final level label a REJECT state 0. Label every other state (k',E') with 1 precisely when the finite graph represented by E' has a cover of size at most k'. This labeling exists by finite enumeration; it need not be found efficiently. Kernel correctness ensures that it is a well-defined correct label even when many different original inputs reach that state.

No new input queries are needed for this labeling. Taking logarithms of the node count proves the space bound. For M=0 use a single correctly labeled sink. QED.

### Consequence for the attempted route

If k(v)=v^{o(1)}, then B(v,k)=M^{o(1)}. Thus there are, unconditionally, programs satisfying

    T <= 3M,   S = M^{o(1)}.

Consequently no correct lower bound excluding every M^{1+epsilon}-time, M^{o(1)}-space general branching program for this family can be established. The upper bound works even with a fixed query schedule.

This statement is specifically about the union of subpolynomial space bounds. It does not rule out lower bounds at a smaller explicitly fixed workspace, such as log v or o(k^2 log v). Such narrower bounds would not by themselves establish the premise of [S1, Theorem 35].

## 5. General kernel-to-terminal-label principle

Suppose a finite-state input-query computation produces, in at most t queries using s bits of state, a summary K(x), and the desired answer is an arbitrary function h(K(x)). A nonuniform branching program can compute h(K(x)) with the same query length and O(s+log t) space by replacing terminal summaries with h-labels.

For a uniform algorithm, evaluating h must be implemented and charged. An arbitrary labeling may require exponentially much offline work and a description of exponential size in s. Neither is a uniform polynomial-time decider. In particular this principle supplies no implication P=NP.

For small-parameter Vertex Cover, the missing uniform step is exactly the computation on the retained kernel. It is not loss of information across computation cuts: all answer-relevant information fits in the available subpolynomial state.

## 6. Follow-up: restoring an honest uniform upper bound

On E', branch on an uncovered edge {a,b}; select a or b and reduce the budget by one. At most 2^{k'+1}-1 search-tree nodes are visited. Each node uses poly(k,log v) work on the stored kernel, so a direct uniform implementation has

    time <= M*poly(k,log v) + 2^k*poly(k,log v),
    space <= poly(k,log v).

This is not polynomial time for arbitrary subpolynomial k. It does show that k=o(log M) cannot be used to obtain the required lower bound: both stages then take M^{1+o(1)} time and M^{o(1)} space. A concrete nontrivial parameter still eligible for investigation is k(v)=ceil((log_2 v)^2).

No search-tree lower bound is asserted. A better uniform algorithm may exist, and ruling out all such algorithms remains the missing theorem.

## 7. Important source correction: U34 compared different papers

U29 actually cited Oliveira–Pich–Santhanam, *Hardness Magnification Near State-of-the-Art Lower Bounds*, Theory of Computing 17(11), 2021 [S3]. U34 inspected the different two-author FOCS 2018 paper, then treated its displayed formula results as a correction of U29's circuit theorem.

The actual 2021 paper states on pages 1–2 that, for a universal c, if some epsilon>0 works for every sufficiently small beta>0, then

    Gap-MCSP[2^{beta*n}/(c*n), 2^{beta*n}]
        notin Circuit[N^{1+epsilon}],  N=2^n,
    implies NP notsubseteq Circuit[poly].

The circuit/formula distinction in U29 was therefore correct for its cited source. U34 did not refute it. Keep approximation-agreement gaps in the 2018 paper separate from circuit-size gaps in the 2021 paper. This is a restored research target, not an established lower bound.

## 8. Computation and audit status

`code/u40_u41_audit.ts` exhaustively checks all 33,868 labeled simple graphs with 0–6 vertices and every budget 0 <= k <= v: 235,881 graph/budget pairs. It compares kernel-plus-recursive-solver output with a separate original-instance subset-enumeration oracle, verifies the 3M query bound, and checks the residual edge-count bound. All checks passed.

A separately written Wolfram set-based implementation checked 6,505 graph/budget pairs with 0–5 vertices, with zero discrepancies. The finite runs validate the kernel invariant; they do not construct all asymptotic branching programs or certify P versus NP.

The terminal-label proof received a separate self-audit: the only additional power used is explicitly nonuniform finite labeling; sink-label construction is not silently charged as zero-cost uniform work. There is no machine-checked theorem or independent expert review.

## 9. Dependencies and continuation

Retain the uniform theorem in [S1]. Retire U38's proposed general-branching-program antecedent and U39's attempt to reach it. U41 separately gives a precise obstruction to the proposed local parity/GIP reduction; that is useful as a model-specific application, not as the missing uniform lower bound.

Continue from the correctly sourced general-circuit magnification target in [S3], preserving the all-small-beta quantifier and charging every local oracle/terminal evaluator by circuit size. The next exact question is whether a proposed lower-bound measure can distinguish ordinary circuits from the sampler-plus-local-oracle upper bounds; it must not remain unchanged when the hard local computation is supplied for free.

## Sources

[S1] Igor C. Oliveira and Rahul Santhanam, *Hardness Magnification for Natural Problems*, ECCC TR18-139, August 10, 2018, Section 4.1, Theorem 35 and proof, printed pp. 25–26. https://eccc.weizmann.ac.il/report/2018/139/download/

[S2] Paul Beame and Erik Vee, *Time-Space Tradeoffs, Multiparty Communication Complexity, and Nearest-Neighbor Problems*, STOC 2002, Section 2 (branching-program definitions), PDF p. 2. https://homes.cs.washington.edu/~beame/papers/multibp.pdf

[S3] Igor C. Oliveira, Jan Pich, and Rahul Santhanam, *Hardness Magnification Near State-of-the-Art Lower Bounds*, Theory of Computing 17(11), 2021, pp. 1–2, abstract Theorem, item (1); DOI 10.4086/toc.2021.v017a011. https://theoryofcomputing.org/articles/v017a011/v017a011.pdf

Sources accessed September 15, 2026. The application in Sections 3–5 is derived here from standard kernelization and model definitions. No global novelty claim is made.
