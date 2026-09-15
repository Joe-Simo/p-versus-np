# U58 — Two-example circuit counts are fixed-DAG site reliability

Date: 2026-09-15. Status: self-contained exact correspondence, constructive probability-space bijection, and finite independent checks. No P-versus-NP resolution, formal-kernel or independent expert certification, or claim of novelty.
Dependencies: the explicit B2/raw-description convention in U52-U57. No hardness assumption is used.

## 1. The next obligation and the result

The U57 checkpoint asks whether, on a fixed shared predecessor topology, the disagreement bit at gate j has the law

    B_j = xi_j AND (B_a OR B_b),

where the xi_j are independent fair bits. This is **exact**, even with repeated predecessors, unused nodes and reconvergent sharing. It is a joint law for all gates, not only a recurrence for their separate expectations.

There is a bijection from the 16^s gate-type assignments to four independent bits per gate: one output orientation eta_j, one site-opening bit xi_j, and two unused truth-table bits. As a consequence, fixed-topology two-example counting reduces exactly to directed site reliability, and sampling reduces to sampling site configurations with a specified reachability outcome. U59 proves a counting reduction in the reverse direction and checks the *different* approximation consequences against current primary literature.

This result addresses a proposed counting component, not the OPS2021 general-circuit lower-bound premise. A fixed-topology counter and the unrestricted sum over all topologies are different inputs/problems.

## 2. Model and counting contract

There are k named initial signals, each with a prescribed value on two sample rows. There are s indexed gate slots. For gate j, both ordered predecessors a_j,b_j are fixed indices of earlier signals; its type g_j is one of all 16 binary Boolean functions. Repeated indices are allowed. The designated output index o is fixed. The count includes every type choice at every slot, including syntactically or semantically irrelevant slots. The topology and all indices have ordinary finite binary encodings; malformed forward pointers and invalid indices are rejected.

Let X_v^0,X_v^1 be the values of signal v on the two examples, and B_v=X_v^0 XOR X_v^1. Let Z_T(y_0,y_1) count type assignments producing the specified two labels. The k input columns are fixed data, not independent random variables.

For a gate-output o and R_T=Pr[B_o=1], the exact counts are

    Z_T(0,1)=Z_T(1,0)=16^s R_T/2,
    Z_T(0,0)=Z_T(1,1)=16^s (1-R_T)/2.                 (1)

If h_T is the number of successful site masks among the 2^s masks, the two integer quantities are respectively

    2^(3s-1) h_T,   2^(3s-1)(2^s-h_T).              (2)

These formulas are for a gate output, so s>=1. For an initial-signal output its pair is fixed; its count is either 16^s or zero, including s=0. An output before the last slot is allowed: later types remain counted but do not affect its value.

## 3. The local law

The gate is queried at two table positions

    u=(X_a^0,X_b^0), v=(X_a^1,X_b^1).

If u=v, the same table entry is used twice, so B_j=0. If u differs from v, the two entries of a uniform four-bit truth table are independent fair bits; their XOR is fair. Moreover u differs from v exactly when B_a OR B_b=1. The pair distribution in the unequal case is uniform on all four output pairs. The orientation X_j^0 is fair and independent of the resulting disagreement.

Fresh gate types are independent of previously exposed gate types. Conditional on all predecessors, this gives the stated transition kernel. Induction over the topological order gives the joint process, including correlations created by shared ancestors.

**Do not replace OR by an independence formula.** For the four-gate diamond

    h=xi_1, a=xi_2*h, b=xi_3*h, out=xi_4*(a OR b),

R=3/16. Treating a and b as independent with their correct individual probabilities 1/4 gives 7/32, a different answer. The reachability representation preserves their shared h.

## 4. A reversible four-bit encoding

Fix a numeric ordering of the four input-pair positions. For each gate, set u to the first row's position. If the second position v is different, set w=v; otherwise take the first position after u cyclically, so w!=u. Let t_0,t_1 be the remaining positions in sorted order. Encode the gate table by

    eta=g(u), xi=g(u) XOR g(w), z_0=g(t_0), z_1=g(t_1).

For fixed predecessor values this is a bijection of sixteen choices. Decode by writing eta at u, eta XOR xi at w, and the unused bits at t_0,t_1. Predecessor values needed by decoding are computed from already decoded gates. Thus the per-gate bijections compose into a full bijection; every 4s-bit code has exactly one original type assignment.

When both rows query u, xi refers to an unqueried entry and does not affect the output. This unused fair bit is essential to the uniform joint construction; it is not silently removed or biased.

Under the uniform type distribution, all eta,xi,z bits are mutually independent and fair. The B-process depends only on initial disagreements and xi. Every gate's first-row output is its eta_j, independent of the entire xi vector. This proves (1)-(2), not just their marginals.

## 5. Reachability and the exact sampler reduction

Make one vertex for every gate and directed arcs from predecessor vertices to it. The gates are independently open according to xi. Connect a super-source to each initially disagreeing input, with agreeing inputs never sources. Then B_o=1 precisely when there is a source-to-o directed path whose gate vertices are all open. Repeated predecessor arcs can be deduplicated for reachability, but the original physical topology remains available when decoding types.

For output labels y_0,y_1, sample xi uniformly among masks with B_o=y_0 XOR y_1; set eta_o=y_0; sample the other s-1 orientation bits and all 2s unused bits fairly; decode the tables. Every compatible description has the same probability, by the bijection, so the resulting sampler is exactly uniform **when the conditioned site sampler is exact**. If that sampler is within total variation epsilon, the output is within epsilon as well. This is a reduction, not an assumption that exact reliability counting is efficient.

Our executable finite version uses exact site counts to unrank all conditional masks and then enumerates all orientation/unused-bit choices. The site-count costs are included. The independent approximation theorem used for a general polynomial bound is discussed separately in U59 and was not implemented here.

## 6. What averaging over topology really removes

When both predecessor indices are independently uniform among K available signals, let C be the number that agree across the two rows. Exactly C^2 ordered pairs agree in both input coordinates. Summing over all 16 gate types gives the two transition weights

    agreeing new column:     8(K^2+C^2),
    disagreeing new column:  8(K^2-C^2).

Thus the *unrestricted* raw distribution updates the scalar C, which either increases by one or remains fixed; at step j, K=k+j. The reachable scalar states form a triangular O(s^2) table, with ordinary bigint weights of polynomial bit length. At the last gate, each orientation receives half its pair's weight. This is the q=2 special quotient from U55, now recovered from the fixed-topology law.

This averaging statement does not apply to a fixed topology: its selected predecessors can share arbitrary ancestry and are not fresh uniform samples from the histogram. U59 shows why the distinction is substantive. Neither a hard summand nor the number of summands lower-bounds an efficiently aggregable total.

## 7. Executed evidence

TypeScript `code/u58_u59_audit.ts`:

- All 256 choices of two parent columns and one B2 type pass the reversible gate map.
- All 8,125 declared ordered topologies, with 31,933,795 literal type assignments, pass 191,024 output/label comparisons against independent site-mask enumeration. Initial columns are (0,3,2), (0,3,0), (1,2), encoded least-significant bit first; every slot count 0..3 is covered.
- A last-use frontier site counter agrees with brute masks, and every gate output satisfies R<=1/2. The shared diamond is explicitly checked against the false independent-branch value.
- All 8,464 ranks across four small topology families and all four label choices give distinct correct type lists, exactly equal to literal compatible sets. Empty fibers are retained with count zero.
- The topology-averaged scalar count matches the corresponding full literal totals for each nonzero slot case.

Python independently evaluates gate tables one row at a time and computes reachability by searching the actual open-vertex graph. It checks 196 topology instances and 120,016 type assignments, including the four-gate diamond and a disconnected output. It does not use the TypeScript gate evaluator or frontier recurrence.

Wolfram independently checks the chain, shared diamond and disconnected output by literal truth-table assignments and direct site masks. Its exact returned numbers are preserved in `research/validation/u58_u59_wolfram.md`.

These finite checks support the encodings and implementation. The universal correspondence follows from the bijection and induction above; no finite-to-infinite extrapolation or formal/expert certification is asserted.

## 8. Next implication actually executed

U59 constructs exact reductions with the indegree, node probabilities and bit lengths fixed, rather than borrowing an edge-reliability hardness slogan. It also checks the published DAG-reliability approximation theorem, because exact counting hardness is not a reason to discard a potentially efficient approximate sampler.
