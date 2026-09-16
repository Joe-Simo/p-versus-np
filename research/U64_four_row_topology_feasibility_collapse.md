# U64 — Four-row free-gate feasibility collapses to reachable information

Date: 2026-09-16. Status: self-contained exact feasibility theorem with constructive proof and exhaustive finite sublemmas. No counting FPRAS, lower bound, P-versus-NP resolution, formal-kernel certification, external expert review, or novelty claim.

## 1. Result

Fix at most four sample rows and a single-output acyclic circuit topology whose free internal nodes may each choose any of the sixteen Boolean functions of two inputs (B2). Some earlier gates may already be fixed, provided they form a whole topological prefix; their sampled output columns are then treated as fixed leaves for the remaining suffix.

For a free output gate `o`, let `L(o)` be the fixed leaf signals that have a path to `o` through the free suffix. Partition the sample rows by their complete vector of values on `L(o)`: two rows are equivalent when every reachable fixed leaf has the same bit on those rows.

**Theorem.** For `q <= 4`, a target sampled output column `Y` can be produced at `o` by some assignment of the remaining B2 gate types **if and only if** `Y` is constant on every block of that reachable-leaf partition.

The necessity is ordinary determinism. The content is sufficiency: for four or fewer rows, reconvergent sharing and the detailed arrangement of the free gates create no additional zero/nonzero obstruction once reachable fixed information is accounted for.

If the designated output itself is already fixed, feasibility is just literal equality with its sampled column.

## 2. Four-edge compression lemma

The combinatorial core is independent of circuits.

Let `P` and `Q` be two partitions of a set `X` with `|X| <= 4`, and let `T` be a binary target partition. Suppose `T` is coarser than the common refinement `P meet Q`; equivalently, knowing a point's `P`-block and `Q`-block determines its target label.

**Lemma.** There exist binary summaries `A` and `B`, with `A` constant on every `P`-block and `B` constant on every `Q`-block, such that the pair `(A,B)` determines `T`.

### Proof

Construct a bipartite graph. Its left vertices are the `P`-blocks, its right vertices are the `Q`-blocks, and each sample row contributes an edge joining its two blocks, colored by the target bit. If several rows give the same edge, the hypothesis says they have the same color, so duplicates may be merged.

There are at most four edges.

- If this bipartite graph is acyclic, assign one bit to each vertex so that for every edge, the XOR of its endpoint bits equals the edge color. Choose a root bit arbitrarily in each component and propagate across edges. Then the endpoint pair determines the edge color.
- If it contains a cycle, a simple bipartite cycle needs at least four edges. Since there are at most four, the nontrivial component is exactly a four-cycle using all four edges. Its two left vertices and two right vertices can each be assigned distinct bits. Every edge then receives a distinct endpoint-bit pair, so any coloring of those four edges is a function of that pair.

The resulting left and right vertex bits are the binary summaries `A` and `B`. This proves the lemma.

The TypeScript/Python/Wolfram audits exhaust all partition triples for `q=1,2,3,4`: respectively 1, 7, 79, and 1,307 applicable `(P,Q,T)` cases, all passing.

## 3. Remove fan-out without losing reachable leaves

Consider the ancestor DAG of the free output gate. For every ancestor signal other than the output, select exactly one outgoing use that lies on a shortest path to the output. Following selected uses therefore always reaches the output.

The selected edges have outdegree at most one, so they form a fanout-free in-arborescence toward the output. Every fixed leaf that could reach the output in the original free suffix still has a selected path to it.

Physical inputs that are not selected are not deleted from the topology. Instead, their consuming gate is chosen to ignore them. The B2 basis contains constants, projections, complemented projections, and every two-input truth table, so this is exact.

Thus it suffices to realize the target on a fanout-free selected tree whose leaf-information partition at the root is the same as in the original suffix.

## 4. Realization on the selected tree

Proceed from the root recursively.

- A selected gate with no selected child can output either constant.
- With one selected child, any binary function of that child's bit can be absorbed into the gate; the other physical input is ignored.
- With two selected children, let `P` and `Q` be the information partitions of the two disjoint selected subtrees. A desired root target is constant on `P meet Q`. By the four-edge compression lemma, choose one binary summary from each subtree such that their pair determines the target. An internal child subtree recursively realizes its summary. If a child is already a fixed leaf, the needed unary recoding of its literal bit is absorbed into the current B2 gate. Finally choose the current B2 table to map the two summaries to the desired target.

Because the selected subtrees are disjoint, these recursive gate choices do not conflict. This constructs a fitting assignment.

The executable checker additionally constructs and replays 308 explicit witnesses on the declared finite topology suite.

## 5. Whole-gate-prefix zero detection

Suppose gate types are fixed in topological order through slot `t`. Their sampled columns can be evaluated immediately. The remaining gates form a free suffix; original input columns plus the evaluated prefix outputs are fixed leaves.

Applying the theorem to that suffix gives exact zero detection for every whole-gate prefix on at most four rows:

1. walk backward from the output through free gates until fixed leaves are reached;
2. compare rows by the reachable fixed-leaf columns;
3. return feasible exactly when every pair of rows indistinguishable on those leaves has the same target label.

For constant `q<=4`, this takes linear time in the explicit topology, apart from ordinary bit-vector bookkeeping. It supplies the exact zero/nonzero test that a counting or sampling self-reduction would need after complete gate choices are pinned. It does **not** supply the completion counts of the nonzero branches.

The TypeScript run compares this criterion against literal suffix enumeration in 96,660 bounded prefix/target cases.

## 6. Balanced 2-versus-2 targets need no nonlinear support at the last gate

Normalize a four-row column by XORing every row with row 0, so a column becomes a vector in `F_2^3`. If the target has a 2-versus-2 split, its normalized vector `y` has Hamming weight two. For normalized parent vectors `a,b`, an arbitrary B2 gate can produce normalized outputs in

    span{a, b, a*b},

where `a*b` is coordinatewise multiplication.

**Lemma.** For every weight-two `y`,

    y in span{a,b,a*b}    iff    y in span{a,b}.

The reverse implication is immediate. For the forward direction, suppose `y` is not in `span{a,b}`. Choose a linear functional `lambda` that vanishes on `span{a,b}` but has `lambda(y)=1`. After permuting coordinates write `y=(0,1,1)`. Every such separating functional has kernel of one of the four forms

    x2=0,  x3=0,  x1=x2,  x1=x3.

Each kernel is closed under coordinatewise multiplication. Since `a,b` lie in the kernel, so does `a*b`, and therefore their full nonlinear span cannot contain `y`.

Thus U63's favorable-prefix support for a balanced target is already affine: over `F_2`, the condition is exactly

    a = y  OR  b = y  OR  a+b = y.

The nonlinear coefficient still changes the **multiplicity** of fitting final gate tables. Across each of the three balanced target shapes, the 64 ordered parent-shape pairs contain 21 favorable pairs; their fitting full-gate multiplicities are 1 for six pairs, 2 for twelve pairs, and 4 for three pairs. Hence this support simplification is not by itself a counting algorithm.

The TypeScript and independent Python checks exhaust all 3*64 parent/target cases.

## 7. What this changes and what it does not

This removes one possible obstruction in the current fixed-four-row approximation route: **feasibility itself is easy, even after an arbitrary whole-gate prefix.** Any remaining difficulty is quantitative—estimating how many completions survive—not detecting whether any survive.

The theorem does not extend automatically to five rows. U65 gives an explicit two-gate counterexample showing that four is sharp for this topology-oblivious criterion. It also records a same-information, same-budget pair whose exact completion counts differ, so the collapse is genuinely only a zero/nonzero theorem.

Nothing here establishes a polynomial-time counter, an anti-checker algorithm at growing row count, an `N^(1+epsilon)` circuit lower bound, or a P-versus-NP resolution.
