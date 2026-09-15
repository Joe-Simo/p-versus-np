# U58-U59 execution contract

Question: On a fixed predecessor topology with independent uniform B2 gate tables, do disagreements between two sample rows evolve as independent fair site openings, and what exactly follows for topology-conditioned counting and approximation?

Raw model: k named initial signals with fixed two-row bit columns; s topologically ordered gate slots; both ordered predecessors and output pointer fixed; each of the 16 binary Boolean truth tables remains a distinct type choice. Dead nodes and repeated parents are retained. Output columns use bit 0 for row 0, bit 1 for row 1.

Tests: exhaustive literal type assignments on all declared small ordered topologies; independent site-mask enumeration and a last-use frontier counter; per-gate reversible random-bit encoding including unused table bits; exact coefficient/interpolation reduction from bipartite independent-set counts to all-half site counts on binary-indegree DAGs. Count with integers/rationals. Exhaust finite rank sets for selected conditional samplers. Include no-gate outputs, agreeing/repeated input rows, repeated predecessors, common ancestors, no source-to-output path and unused gate slots.

The test cannot prove an infinite complexity classification or the published approximation theorem. Those need separate mathematical arguments and explicit literature statements. A weighted frontier count is not enumeration of all gate assignments, and exact finite self-reduction is not an implementation of the Feng-Guo FPRAS. Hardness of a topology-conditioned term is not hardness of its unrestricted topology average. No full P-versus-NP claim is made.
