# U42 — Charged magnification and shared batch lookup

Date: 2026-09-15
Status: a proved constructive circuit upper bound and a source/quantifier audit; no P versus NP resolution.
Dependencies: U29, U30, U40, U41. This note does not reinstate the retired Vertex-Cover branching-program target.

## 1. What this checkpoint actually accomplishes

We return to the general-circuit magnification theorem, explicitly charge the work hidden inside small oracles, and implement one of its ordinary circuit components. A batch of t reads from an N-bit truth table does **not** inherently cost Nt gates: shared sorting gives a fan-in-two circuit with O((N+t) log^3(N+t+2)) gates. This is a self-derived application of standard sorting networks, not a claimed new sorting theorem or circuit lower bound.

The construction is an upper bound. Its significance here is diagnostic: charging t independent linear-size address circuits is permissible, but treating that cost as unavoidable would be false. In particular, neither a large count of queries nor a large count of possible address lists proves a general-circuit lower bound.

## 2. Source contract, with both circuit levels fixed

Source [1], Theorem 1.4: for some universal c, a fixed epsilon>0 and a lower bound Circuit[N^(1+epsilon)] for every sufficiently small beta>0 on Gap-MCSP[2^(beta*n)/(c*n), 2^(beta*n)] imply NP is not contained in polynomial-size circuits. Here N=2^n; Definition 2.4 uses YES complexity <=s1 and NO complexity >s2. This implies P!=NP.

Theorem 1.4 is in the three-author 2021 paper, not just the two-author 2018 formula theorem. Thus U34's purported refutation of U29 compared different results.

Under NP subseteq P/poly, [1, Lemma 4.1 and Section 4.1] produces an anti-checker list of length t=2^(10*beta*n) with generator size at most 2^(n+K*beta*n), for a constant K. Its final consistency decision has size m^ell on m=n+s+t*(n+2)+3 bits. The displayed proof charges O(Nt) for final addressing. These are conditional **upper bounds**, not unconditional lower bounds.

Integer-valued thresholds may be rounded down and t rounded up; preserve the gap and use sufficiently large n. The theorem's fixed epsilon must not be replaced by an epsilon that vanishes with beta.

## 3. Exact batch-lookup theorem

Let n,t be nonnegative integers, N=2^n, and suppose the inputs are

    F[0],...,F[N-1], a_0,...,a_(t-1),

where each a_j is an n-bit unsigned address. There is a constructible, ordinary fan-in-two Boolean circuit whose output is

    F[a_0],...,F[a_(t-1)]

and whose size is O((N+t) log^3(N+t+2)). The output order is the request order, not address order. Duplicate addresses and t>N are allowed. When t=0 there are no outputs; when n=0 all requests address the single table bit.

We allow constant wires and AND, OR, XOR gates. Replacing XOR with a constant-size AND/OR/NOT circuit changes only constants. No oracle gates, arbitrary terminal answer labels, nonuniform lookup tables of computed answers, or unit-cost arithmetic on long words are used.

## 4. Construction

For t>0, let P be the smallest power of two at least N+t, and h=log_2 P. Make P records of width w=O(log(N+t+2)):

- One source record for each x in [0,N): its constant address x, a source marker, its actual input value F[x], and an unused tag.
- One request record for each j in [0,t): its input address a_j, a request marker, a placeholder value, and its constant request tag j.
- Dummy records, marked as padding, to reach P records.

**First sort.** Use a fixed bitonic sorting network, lexicographically by (padding, address, request-marker), with source records preceding requests at equal addresses. Entire records, including the payload bit and tag, travel through each comparator.

**Propagation.** Traverse the sorted records in order. Maintain one carry bit. At a source record replace the carry by its payload; otherwise retain it. Assign the resulting carry to the current record's payload. This is a chain of ordinary Boolean multiplexers, not a memory oracle.

**Second sort.** Sort by (not-request-marker, request-tag), placing requests first and restoring their original tag order. Return the payloads of the first t records.

Addresses may depend on F through an upstream circuit. The same construction composes with that circuit, since it works on every joint assignment to F and the addresses. It does not eliminate dependencies between successive stages of an upstream adaptive generator.

## 5. Correctness proof

After the first sort, the unique source record for address x precedes all requests for x, and no source for a different address lies between that source and those requests. Thus the most recent source when any request for x is processed carries exactly F[x]. The carry assignment gives that value to every such request. Dummy records are after all real records and cannot change any real request's answer.

The second network merely permutes records. Each request has a unique tag, so its new position is precisely its tag j and its payload remains F[a_j]. This proves correctness, including repeated requests. The t=0 and n=0 boundary cases follow directly from their definitions.

The standard bitonic network sorts because a bitonic merge compares the two halves, produces a lower and an upper bitonic subsequence, and recursively merges them; recursively sorting halves in opposite directions supplies the required bitonic input. The implemented fixed comparator schedule is the ordinary power-of-two bitonic schedule [2]. The use of this standard fact is separate from the batch-read reduction above.

## 6. Full gate accounting

A bitonic sort on P=2^h records has

    P*h*(h+1)/4

comparators. Both sorts therefore use exactly P*h*(h+1)/2 comparators. Comparing O(w) key bits and conditionally exchanging two w-bit records uses O(w) binary gates. Carry propagation adds O(P) gates. As P<2(N+t), the total is

    O(P*h^2*w + P) = O((N+t) log^3(N+t+2)).

Every bit operation is charged. Addresses and request tags are constants or explicit input wires; their number is not confused with the number of arithmetic words. Circuit depth is unrestricted and fan-out/sharing is permitted. No formula-size or constant-depth bound is claimed.

This asymptotic upper bound need not beat the naive design at small dimensions. The finite circuits are deliberately unsimplified, and their reported gate counts include dead outputs, constants handled by ordinary gates, and routing overhead.

## 7. Cost-aware consequence for the active target

Let A(N,beta) be the actual gate size of a total anti-checker generator for the relevant promise, and let E(m) be the actual gate size of an exact consistency decider. Composing these explicit devices gives

    C_Gap(N) <= A(N,beta)
                 + O((N+t) log^3(N+t+2))
                 + E(n+s+t*(n+2)+3).

This is a construction inequality, not a lower bound or a claim that every circuit decomposes this way. In the source parameter regime t=N^(10*beta), beta<1/10 makes the final routing cost N*polylog(N). Under the source's collapse assumption the other terms are bounded by N^(1+K*beta) and N^(10*ell*beta+o(1)). Choosing beta after the fixed epsilon and constants gives the known magnification behavior.

The original proof's looser O(Nt) term was already sufficient. Removing it does not provide a missing circuit lower bound, remove the hypothesis NP subseteq P/poly, or improve the final separation. Moreover, the source notes that its generator can also produce labels along the way; our independent routing theorem is useful when only addresses are presented.

For an oracle-augmented circuit, replacing oracle i by an ordinary r_i-input evaluator costs the size of that evaluator, not merely r_i or one query. A naive truth-table implementation is exponential in r_i. The cost sum for separately substituted evaluators is itself only an implementation upper bound; sharing can make it smaller, as the batch-read construction illustrates. The locality discussion in [3] is a reason to track these distinctions, not an unconditional hardness theorem for every local method.

## 8. Executed checks

`code/u42_u43_audit.ts` generates the gate DAG itself and evaluates it on all assignments using exact bigint bit-slicing. Direct array addressing independently supplies expected answers. Topological gate ordering and the exact comparator formula are checked.

The gather experiments covered **167,276** table/address assignments across eleven cases: (n,t)=(0,0),(0,3),(1,1),(1,3),(2,1),(2,2),(2,3),(2,5),(3,1),(3,2),(3,3). There were zero mismatches. These include duplicate requests, constant tables, no requests, and more requests than locations.

Wolfram independently checked the sort/propagate semantics on **3,106** assignments using lists and sorting, rather than the TypeScript Boolean DAG. This second calculation does not verify the gate implementation or its asymptotic count; the proof and the explicit DAG accounting address those separately.

Actual commands, complete rows, versions, and the independent code are preserved under `research/validation/` and `code/`. No unbounded experiment, heuristic extrapolation, or floating-point inference is used.

## 9. Research decision

Do not attempt to prove the magnification target merely by charging repeated table access as Nt. Investigate the actual anti-checker generator and consistency predicate. U43 executes a positive-control experiment in an exactly solvable comparison class, to test whether a useful certificate can be **constructed and checked** with ordinary charged gates rather than postulated as an oracle answer.

## Sources and verification boundaries

[1] Igor C. Oliveira, Jan Pich, Rahul Santhanam. *Hardness Magnification Near State-of-the-Art Lower Bounds*. Theory of Computing 17(11), 1-38 (2021). DOI 10.4086/toc.2021.v017a011. https://theoryofcomputing.org/articles/v017a011/v017a011.pdf . Checked Theorem 1.4 (printed p.6), Definition 2.4 (p.11), Lemma 4.1 and its application (pp.17-18), with rendered PDF verification. The established theorem is used as literature; no claim of independently verifying its entire proof is made.

[2] K. E. Batcher. *Sorting networks and their applications*. AFIPS Spring Joint Computer Conference (1968), pp.307-314. DOI 10.1145/1468075.1468121. Publisher metadata verified; direct publisher PDF retrieval failed. The familiar network recurrence, explicit implementation and self-contained batch argument are the evidence used here; no full original-paper read is claimed.

[3] Lijie Chen, Shuichi Hirahara, Igor C. Oliveira, Jan Pich, Ninad Rajgopal, Rahul Santhanam. *Beyond Natural Proofs: Hardness Magnification and Locality*. https://arxiv.org/abs/1911.08297 . Consulted locality/oracle-model discussion. We do not assume cryptographic hardness or use a conditional barrier as an unconditional separation.
