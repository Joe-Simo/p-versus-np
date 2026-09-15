# U60 — Positive joint-row process and an exact frontier sampler

Date: 2026-09-15. Status: self-contained counting/sampling identities, a parameterized exact algorithm, and bounded independent checks. No P-versus-NP resolution, formal-kernel verification, independent expert certification, or novelty claim.
Starting evidence: U58-U59, repository `f9489c4e2a01b26f204d2929857aa4deedeff3bd`. The next obligation is a direct joint-label representation, not independent estimates of pair events.

## 1. Model and conclusion

Fix k named initial signals, s topologically ordered gate slots, two ordered earlier predecessors at each slot, and one designated output signal. Repetition of a predecessor, fan-out, unused slots and an output earlier than the last slot are permitted. Each slot independently chooses uniformly from all sixteen binary Boolean functions, called B2 types. The input also specifies q example values for each initial signal and q desired output values. A description here consists only of the s gate types: the wiring is supplied, not summed over. We count raw type assignments, not different functions.

For q>=1, there is an exact reversible change of coordinates from the 4s type bits to:

- s output-orientation bits;
- 3s independent fair control bits driving a process on column shapes.

This holds for arbitrary q and arbitrary shared topology. No subtraction of probabilities is needed. If the output is a gate and W is the number of 3s-bit control words producing the desired shape, its exact label count is

    H = 2^(s-1) W.                                            (1)

A frontier algorithm computes W and supplies exact uniform rank/unrank. Its complexity is polynomial in the explicit topology size, q, the count bit length, and 2^((q-1)w), where w is the number of prior gate outputs that must simultaneously be retained in the supplied topological order. This is NOT polynomial in general. U61 obtains a stronger approximation result for three rows by a different, polynomial-size automaton.

## 2. Shapes and the collision partition

For a q-bit column v, retain its orientation eta=v_0 and define its shape

    z(v)=(v_1 XOR v_0,...,v_(q-1) XOR v_0).

There are 2^(q-1) shapes. For parent columns a,b, partition example rows by the pair (a_i,b_i). There are c distinct pairs, 1<=c<=min(q,4). Order the blocks by their first appearance among the rows. Block zero contains row zero.

Complementing either parent permutes the pair labels but does not change which rows belong to each block or the first-appearance order. Thus this partition depends only on the two parent shapes. It does not require their orientations.

A uniform B2 truth table assigns independent fair bits to the c observed pairs. Its output shape is obtained by giving block zero relative bit zero and the other c-1 blocks independent fair relative bits. The remaining 4-c type bits are unused by these examples, but must still be counted.

The positive transition rule uses one token u in {0,...,7} per gate. Its first c-1 bits are relative block labels, and the remaining 4-c bits retain unobserved truth-table entries. Therefore each possible next shape has exactly 2^(4-c) of the eight tokens. Multiple paths to the same shape retain their integer multiplicities.

## 3. Explicit bijection: no lost orientation or dead-type multiplicity

For the actual parent pair values, write p_0,...,p_(c-1) for their distinct observed truth-table addresses. Given a gate table g:

1. Set eta=g(p_0).
2. Put g(p_j) XOR eta into control bit j-1 for j=1,...,c-1.
3. Put g(p), for the missing addresses p in numerical order, into the remaining 4-c control bits.

This maps four bits to four bits invertibly. To invert it, put eta at p_0, put eta XOR the appropriate control bit at each other observed address, and restore the missing entries from the remaining bits.

Apply the map in gate order. Given earlier decoded gates, the actual parent columns and address order are known, so the next gate is uniquely decoded. Conversely, forward encoding is unique. Induction proves a global bijection on all 16^s type assignments. The new coordinates are consequently independent uniform bits, despite the input-dependent way they are interpreted.

The entire shape history depends only on the control tokens. It retains shared nodes as single shared states; it never assigns separate random types to different uses of the same gate. Orientation at a designated gate is its own independent bit. Fixing that bit and its shape proves (1). Each other orientation is free, including the orientations of gates after the output.

If the output is initial, all 16^s assignments fit or none do according to that initial column. For q=0 there is no label condition and the answer is 16^s. These cases are treated separately, rather than using an absent anchor row.

## 4. Exact frontier recurrence and sampler

For each gate output, compute its last use by a later gate; also regard the designated output as used after all slots. At boundary j retain the shapes of earlier gate outputs whose last use has not passed. The shapes of initial signals are fixed input data and need not be stored in this changing state.

For a boundary state v and token u, the next state T_j(v,u) is obtained by the positive partition rule and deleting expired columns. Let Q(j,v) count control-word suffixes giving the target shape. Then

    Q(s,v)=1 or 0 according to the final shape;
    Q(j,v)=sum_(u=0)^7 Q(j+1,T_j(v,u)).                       (2)

This is an exact integer recurrence. Gates which are unused still have all eight token choices; their contribution must not be removed without its weight.

There are at most sum_j 2^((q-1)|frontier_j|) states. Each transition builds a partition of at most four blocks in O(q) elementary bit work plus explicit state/index work. Counts have at most 3s+1 bits. A coarse bit bound of poly(k+s,q)*2^((q-1)w) therefore accounts for construction, additions, storage and subsequent sampling. No unit-cost unbounded integer or implicit constant-width assumption is used. The supplied order, not an optimally found order, defines w.

For exact unranking, select each token in its ordinary order using the eight suffix counts in (2). This is a bijection between ranks 0,...,W-1 and accepted control words. Independently unrank s-1 orientation bits, pin the output orientation, and decode the original gate tables. Every compatible raw type assignment appears once. To sample a uniform rank, fair-bit rejection in a numerical interval has expected fewer than two trials; this does not reject circuit descriptions from a rare prior event. All suffix-count work remains charged.

## 5. Why positivity does not itself prove a polynomial algorithm

Even with three rows, w independent gates fed by the same nonconstant initial signal can each have either zero shape or that signal's shape. Schedule all w first and use them later. All 2^w frontier assignments occur with positive probability before those uses. Taking a subsequent chain of gates gives an explicit topology with s=2w-1 and frontier width w.

This proves an exponential reachable-state count for the explicit frontier representation in that order. It is not a lower bound on all algorithms or all orders. Indeed, for this particular family the output's disagreement probability has a simple scalar recurrence p_1=1/2 and p_(j+1)=1/4+p_j/4. The code checks that recurrence against the frontier count. This positive control prevents confusing a large intermediate table with unavoidable computational hardness.

U55's unrestricted two-row counter is also not contradicted: it sums a different set of objects, including all wirings. U59's fixed-topology exact #P classification remains a reduction statement, not an unconditional time lower bound.

## 6. What was actually executed

`code/u60_u61_audit.ts` constructs the recurrence and unranker and compares them to literal gate-type evaluation.

- 87,360 local gate encodings for all parent columns on q=1,...,6 rows are inverted and checked against the shape rule.
- 4,394 declared fixed-topology/example cases account for 1,299,989 literal type assignments and 44,358 output-label comparisons. The families include all topologies through two slots for five specified initial-column sets at q=1,...,5, all two-slot topologies for every pair of three-row initial columns, and five named shared/repeated examples. These counts are not an exhaustive enumeration of all topologies or all arbitrary initial columns at every q.
- Four named conditional families exhaust all 196,624 raw type ranks; each is distinct and has the required labels. Two of these give 131,072 independently reversible affine round trips, used by U61.
- The width-growing family is evaluated at w=1,2,4,8,12. The largest has 4,096 attainable cut states and 12,283 nonterminal memo states. Its count is weighted arithmetic, not enumeration of all 16^23 assignments.
- Empty examples, initial-signal outputs, contradictory repeated rows, zero fibers and invalid ranks are checked.

The independent Python implementation evaluates each row separately on five named families (196,880 type assignments), uses backward reachability/path masks for the U61 follow-up, and reads the main result only afterward. Wolfram supplies an additional independent full-column-state calculation, not the shape-frontier implementation. Complete results and exact coverage are in the validation files.

These finite checks support the implemented identities. The arbitrary-size statements are proved above, not inferred from a finite trend. No formal proof kernel or outside expert has verified them.

## 7. Research consequence

The general joint-label question now has a positive, exact representation with sharing retained and all type multiplicities counted. It removes a numerical-cancellation problem, but its unrestricted frontier cost is still potentially exponential. U61 follows a different route for three rows: a shared colored reachability event has a polynomial-size NFA, allowing an explicitly sourced approximation theorem to apply.

## Sources and attribution

The orientation quotient extends the project's U55 and U58 arguments; those are prior internal work, not independent literature. The mathematics here is self-derived and no global originality is asserted. The full target remains OPS2021 Theorem 1.4, which was reread at printed p.6: https://theoryofcomputing.org/articles/v017a011/v017a011.pdf . That target concerns ordinary general circuits at growing parameter values; neither (1) nor (2) proves its lower-bound premise.
