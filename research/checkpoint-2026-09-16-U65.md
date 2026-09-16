# P versus NP — checkpoint after U64-U65

Date: 2026-09-16. **We have not solved P versus NP yet.** No complete candidate, formal-kernel verification, independent expert certification, or authenticated novelty claim exists.

## Scope and continuity

Assigned folder `/mnt/data/02-p-versus-np`; private repository `Joe-Simo/p-versus-np`, branch `main`. The starting remote head was `20c3870f84a7da8a88c2859aaba776230586b402`, and the U63 checkpoint was read before this work. All supplied research packages were restored only with no-overwrite extraction; the governing `RESEARCH_PROMPT.txt` hash remains `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. No sibling project was inspected or modified.

No spending, publication, outside researcher contact, prize submission, visibility change, or background task occurred. Wolfram used the existing allowance. Two early Wolfram attempts were invalid and are explicitly excluded; two later warning-free calls are the evidence. Consensus/Mathbox were not used or claimed.

The current official Clay P-versus-NP page was rechecked on 2026-09-16 and still states `Unsolved`: https://www.claymath.org/millennium/p-vs-np/ . The familiar Ashenhurst/Curtis functional-decomposition literature was surfaced only as adjacent background; no external theorem from it is required for U64-U65 and no novelty claim is made.

## Results established

**U64, four-row topology-feasibility collapse.** Fix at most four sampled rows. In any single-output DAG suffix whose remaining gates are free B2 gates, treat original inputs and already-fixed whole-prefix outputs as fixed leaf columns. Let two rows be equivalent when every fixed leaf that can reach the free output gate has the same bit on them. A target column is realizable by some assignment of the remaining gate types iff it is constant on those equivalence blocks. Thus for `q<=4`, reconvergent sharing creates no additional zero/nonzero obstruction.

The proof has two components. First, a four-edge compression lemma: for partitions `P,Q` of at most four points and a binary target determined by their common refinement, one-bit summaries of `P` and `Q` always suffice. The proof uses the bipartite graph of occupied `(P,Q)` cells: with at most four edges it is either a forest, where an XOR vertex potential works, or a four-cycle, where each side can be encoded injectively by one bit. Second, select one outgoing use on a shortest path to the output for each ancestor signal, producing a fanout-free arborescence while retaining every reachable fixed leaf. Unselected physical inputs are ignored by projections. Recursive use of the compression lemma realizes the target without conflicting shared assignments.

**U64, exact whole-gate-prefix zero detection.** After fixing any topological prefix of whole gate tables, evaluate those columns and apply the same suffix theorem. Feasibility of every branch is therefore decidable in time linear in the explicit topology for fixed `q<=4`. This supplies exact zero detection to a future self-reduction, but not the nonzero completion counts.

**U64, balanced 2-versus-2 target support.** Normalize a four-row column by XOR with row 0, giving vectors in `F_2^3`. For a balanced target shape `y` of Hamming weight two and parent shapes `a,b`,

`y in span{a,b,a*b}` iff `y in span{a,b}`.

The nontrivial direction uses a separating linear functional. After permuting coordinates to `y=(0,1,1)`, every functional with value one on `y` has kernel of one of the four forms `x2=0`, `x3=0`, `x1=x2`, `x1=x3`; each kernel is closed under coordinatewise multiplication. Hence U63's balanced favorable-prefix support is affine: `a=y OR b=y OR a+b=y`. The nonlinear coefficient still affects multiplicity. For each of the three balanced target shapes there are 21 favorable ordered parent-shape pairs; full-gate multiplicities are 1 on six, 2 on twelve, and 4 on three.

**U65, five-row sharpness.** Fixed leaves
`P=(0,0,0,1,1)`, `Q1=(0,0,1,0,0)`, `Q2=(0,1,0,0,1)` distinguish all five sample rows. Yet the two-gate grouping `h=f(Q1,Q2); o=g(P,h)` cannot realize target `T=(0,0,1,0,1)` for any B2 tables `f,g`. Analytically every `h` is `(a,b,c,a,b)`; target constraints force `a!=b` and then simultaneously force both `g(0,0)=g(0,1)=0` while requiring one of them to equal one, a contradiction. Literal enumeration confirms zero of 256 assignments.

The obstruction is topology-specific: regrouping as `h'=NAND(P,Q2); o'=(NOT h') OR Q1` realizes the same target, and exact enumeration finds four fitting ordered type pairs. Therefore four rows are sharp for the topology-oblivious feasibility theorem.

**Quantitative separation.** Even on four rows, reachable information and gate budget do not determine completion counts. With leaves `A=(0,0,1,1)`, `B=(0,1,0,1)` and target `Y=(0,1,1,0)`, the two two-gate topologies `h=f(A,B); o=g(h,h)` and `h=f(A,B); o=g(A,h)` expose the same leaves and budget but have exactly 8 and 4 compatible ordered type pairs respectively. U64 is therefore an exact zero/nonzero theorem, not a counting quotient.

## Executed evidence

TypeScript `code/u64_u65_audit.ts`:
- Exhausts 1,394 applicable partition-compression cases: 1, 7, 79, 1,307 for q=1..4.
- Checks 52 declared shared/repeated-predecessor topologies against the theorem, all 52 also by literal type enumeration.
- Checks 96,660 whole-prefix target branches against literal suffix enumeration.
- Constructs and replays 308 explicit selected-arborescence witnesses.
- Exhausts all 3*64 balanced target/parent-shape cases and the multiplicity histograms.
- Exhausts both five-row 256-description topology families and the four-row 256-description count-separation pair.

Independent Python `code/u64_u65_independent.py` reconstructs the partition lemma, the balanced support law, the five-row raw gate enumeration, 320 seeded random small-topology brute checks, and the 8-versus-4 completion-count separation before reading the TypeScript output. Its totals agree.

Wolfram 15.0.1 independently verifies the same partition counts, the failed five-row compression, 0/4 five-row topology counts, the declared witness, all three balanced-support histograms and the 8/4 quantitative separation. Two earlier evaluator submissions were invalid and are preserved as failures; only the warning-free results in `research/validation/u64_u65_wolfram.md` count as evidence.

The first TypeScript revision failed strict compilation only for unused declarations; no mathematical execution occurred from it. The corrected source passes strict/no-unused compilation and all final outputs reproduce byte-for-byte.

Final hashes:
- main result `045b149dea80bbbb35be186481ab73ed1034ffb9081d29875f8810e9f52091d3`
- independent result `724624b39e558846117b0fdd35519560b86739d1db8f87763db81d407c651da5`
- TypeScript source `43617f6aeec212f537cfcdcf9eebaf711980415eb967096738a15f86763e19b2`
- Python source `e3b7cee628e656c4d7781db2a17790bb68d7aba3674ec13ade63f3c85ec297c4`

Environment: Node v22.16.0, TypeScript 5.8.3, Python 3.13.5. No proof assistant was installed or used.

## Full-target distinction

Nothing in U64-U65 proves the OPS2021 `N^(1+epsilon)` ordinary general-circuit lower bound, a polynomial-time SAT algorithm, or a complete P-versus-NP resolution. The four-row theorem concerns only feasibility on a constant number of examples; the active magnification route ultimately needs growing example sets and ordinary circuit complexity.

U65 also shows why the four-row zero-detection collapse cannot simply be iterated to growing anti-checkers: topology-dependent information bottlenecks already appear at five rows.

## Next executable obligation

Return to the quantitative balanced four-row problem now that exact prefix zero detection is available. Use the new support identity

`a=y OR b=y OR a+b=y`

for the integrated final gate, while retaining the multiplicity weights `1,2,4`. Test a Karp-Luby-style positive union estimator/sampler for these three affine-support events on fixed shared topologies. Include rare chain examples where direct rejection has exponentially small density and shared-diamond examples where separate marginals are misleading. Every branch counter or sampler must charge shared-prefix correlations; do not replace them with independent copies.

If that union route still requires an unavailable completion counter, isolate the exact subproblem and test whether the four-row partition-state process gives a tractable approximation on bounded-treewidth topologies before making any general hardness claim. Exact zero detection is no longer the blocker; nonzero multiplicity estimation is.

No process continues after this checkpoint.
