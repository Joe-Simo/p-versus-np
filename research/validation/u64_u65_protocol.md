# U64-U65 execution contract

Date: 2026-09-16.

Question: for at most four labeled sample rows and a fixed single-output B2 circuit topology with all remaining gate types free, is nonzero consistency determined only by which fixed leaf columns can reach the output? Is four rows the largest row bound for such a topology-oblivious feasibility criterion?

Implemented assertions:
1. Exhaust every pair of set partitions P,Q on q=1,2,3,4 rows and every binary target partition T coarser than P meet Q. Verify the four-edge compression lemma: binary summaries of P and Q suffice to determine T.
2. Construct a fanout-free selected arborescence inside fixed DAGs and a witness assignment of B2 types whenever the target is constant on the reachable-leaf information partition. Replay the produced assignment on explicit rows. Compare the criterion against brute-force type enumeration on bounded small topologies.
3. Verify exact whole-gate-prefix zero detection by treating already evaluated prefix outputs as fixed leaves for the free suffix.
4. On five rows, exhaust all 16^2 type assignments of the explicit two-gate bottleneck topology and confirm the declared target has zero realizations even though the three leaf columns distinguish all five rows. Verify an alternate two-gate grouping realizes the same target.

Domains and conventions: q<=4 for the positive theorem; q=5 only for the explicit sharpness counterexample. Gate types are all sixteen functions of two bits, ordered topologically; repeated predecessors and fan-out are allowed. Fixed leaves are literal sampled columns. Output is a gate unless explicitly handled as a fixed initial/prefix signal. Arithmetic is exact integer/bit-vector arithmetic; no floating point is used for mathematical claims.

What the run cannot prove: it does not count compatible descriptions, give an FPRAS, establish a general-circuit lower bound, solve growing-row anti-checker consistency, or resolve P versus NP. The five-row example proves failure of the specific topology-oblivious feasibility criterion, not NP-hardness.
