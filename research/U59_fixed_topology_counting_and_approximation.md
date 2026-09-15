# U59 — Fixed-topology exact hardness, but polynomial randomized approximation

Date: 2026-09-15. Status: self-contained exact reductions; approximation/sampling corollary of an explicitly cited published theorem; exact bounded implementation checks. No P-versus-NP solution, formal/expert verification or novelty claim.
Dependencies: U58, elementary polynomial interpolation, and Feng-Guo [1] only for the polynomial-time reliability approximation step.

## 1. The result and the limitation in one place

For a supplied binary-indegree DAG topology, exactly counting the choices of unrestricted B2 gate types consistent with two examples is #P-complete under polynomial-time **Turing** reductions. This is true already with one Boolean input, free constants and its two assignments as the examples. The proof below fixes the node-versus-edge issue and uses interpolation; it is not a parsimonious or approximation-preserving reduction.

Nevertheless, the same fixed-topology two-example problem admits polynomial-time randomized relative approximation, and approximate uniform sampling of its compatible type assignments. For equal output labels an exactly uniform sampler is even obtained by a constant-expected-trial rejection procedure. For unequal labels the polynomial approximation result uses the *published* 2024 DAG-reliability theorem, not an uncharged oracle or an algorithm developed here.

Both conclusions are partial. They neither contradict U55's exact unrestricted two-row counter, nor resolve growing-example circuit consistency, nor provide the ordinary N^(1+epsilon) general-circuit lower bound required by OPS2021.

## 2. Exact reduction from bipartite independent-set counting

Take a finite simple bipartite graph H=(L,R,E), v=|L|+|R|. A site will update its reachability bit as xi*(OR of its predecessors). Use one permanent source, a permanent zero, and the following acyclic network:

1. For each left vertex u, make a fair site L_u fed by the source.
2. For each right vertex w, combine the sites L_u for neighbors u using a binary tree of OR connectors; absent neighbors give the permanent zero. Feed this into a fair site R_w.
3. Combine all R_w with another binary OR tree and add one final pass connector.

A one-predecessor site is encoded with repeated predecessors. Temporarily give every connector open probability p, and the v left/right sites probability 1/2. Let D>=1 be the number of connectors; the extra final connector ensures this boundary case without changing behavior at p=1. Isolated vertices and empty edge sets are allowed.

At p=1, the output is reachable iff some edge (u,w) has both of its endpoint sites selected. Therefore

    #IS(H) = 2^v (1 - R_H(1)).                       (3)

This counts all independent sets, not minimum covers or maximum independent sets.

## 3. Remove deterministic connectors without unbounded fan-in

R_H(p) is a polynomial in p of degree at most D. Indeed, summing over all connector masks gives terms p^a(1-p)^(D-a) times the rational probability of the left/right mask. Its coefficients have denominator dividing 2^v.

For each ell=1,...,D+1, replace each p-connector by a chain of ell fair sites. The first site performs its two-predecessor OR; each remaining site repeats the preceding signal. The chain is live with probability 2^(-ell), independently of other connector chains, and transmits its input exactly when live. Thus the resulting **all-half, binary-indegree, acyclic** network has reliability R_H(2^(-ell)). Its size is

    s_ell = v + ell*D <= v + D(D+1).

All probabilities are now exactly 1/2. Convert this topology to a B2 topology with initial signals 0,1,x and sample rows x=0,1. Query the number Z_ell of type assignments whose output is (0,1). U58 gives

    R_H(2^(-ell)) = 2 Z_ell / 16^(s_ell).             (4)

D+1 distinct dyadic arguments determine R_H. Exact rational interpolation evaluates it at 1, and (3) returns #IS(H).

The construction uses polynomially many oracle calls on polynomial-size explicit graphs. A type count has at most 4s_ell+1 bits. The dyadic arguments have O(D) bits, and the products/differences in Lagrange interpolation have polynomial bit length (a coarse O(D^3+vD) bound suffices). All arithmetic is charged; the argument does not rely on unit-cost unbounded numbers.

**Example checked independently.** For H=K_(2,2), this particular connector layout has

    R_H(p)=3p^3/4-3p^4/16.

At p=1/2,1/4,1/8,1/16,1/32 the values are respectively 21/256, 45/4096, 93/65536, 189/1048576, 381/16777216. Interpolation returns #IS(H)=7. Expanded fair networks have 8,12,16,20,24 sites; weighted counts of their 2^s masks are not described as literal enumeration of all 16^s gate-type assignments.

## 4. Completeness, with the counting reduction exposed

Membership in #P is immediate: guess the 4s type bits and evaluate the fixed topology on both rows in polynomial time. The following elementary chain supplies the exact-hardness starting point, so our indegree/probability claim does not rest on transferring an uninspected reliability theorem.

**#3SAT to a specified independent-set coefficient.** For each variable create two adjacent vertices, representing its two truth values. For each clause create a clique whose vertices are the satisfying assignments to its distinct variables (at most eight when width<=3, allowing tautologies). Connect a clause-pattern vertex to variable-value vertices that disagree with the pattern. With n variables and m clauses, an independent set of size n+m must select one vertex in every group. It is therefore in bijection with satisfying assignments. Contradictory/empty clauses give zero; unused variables are counted through their variable pair. All groups and edges are explicit and polynomial in the formula length.

Let G be this graph and I_G(z)=sum_j i_j z^j. Its degree is at most n+m because each group is a clique. Obtain evaluations of I_G from an unweighted #IS oracle as follows: replace every vertex by an independent group of a twins, and every original edge by all edges between its two twin groups. A selected original vertex has 2^a-1 possible nonempty twin subsets, so the new count is I_G(2^a-1). For a=1,...,n+m+1, interpolate the leading coefficient i_(n+m), which is #SAT. Each expanded graph has polynomial size. This is a Turing reduction, not one-to-one counting of all independent sets.

**General #IS to bipartite #IS.** Given any graph G=(V,E), retain V as the left side. For each edge create a right vertices, each joined to its two endpoints. For each selected left subset S, exactly a*e(G[V\S]) right vertices are available, so the count is

    P_G(2^a), where P_G(z)=sum_(T subseteq V) z^(e(G[T])).

Its degree is at most |E|. Values for a=1,...,|E|+1 recover its constant coefficient, which is #IS(G). Sizes and exact arithmetic stay polynomial.

Together with (3)-(4) and the standard parsimonious Boolean-verifier/Cook-Levin representation of #3SAT, this proves #P-hardness under polynomial-time Turing reductions. To spell out the starting convention: an accepting witness for a polynomial-time verifier fixes all circuit gate values uniquely; the usual width-three gate constraints introduce no extra satisfying choices. This is the standard counting analogue, not a new result about #P.

Provan-Ball [2] is the original nearby published classification of bipartite-cover counting. Its publisher abstract was accessible, not its full proof. The self-contained chain above avoids importing unverified details of its reduction or any planarity/bounded-degree promise. No claim of finding a new reliability hardness theorem is made.

## 5. Why exact hardness is not an approximation obstruction

A relative approximation to values at 2^(-ell) does not automatically give a controlled relative approximation to the extrapolated value at 1, or to 1-R_H(1). Interpolation can combine signed coefficients, and the final complement can be tiny. The exact reduction is **not** claimed to preserve relative approximation. In particular we cannot infer that approximate type counting solves #BIS or SAT.

More decisively, a polynomial approximation method is available from an authenticated source. Feng and Guo [1, Theorem 1, p.62:2] give a randomized relative approximation scheme for two-terminal reliability in a DAG, accepting edge-failure probabilities in [0,1]. We use only that theorem and its stated domain, not an assertion that we have implemented or independently reproved the entire algorithm.

Convert U58's site network to an edge network by splitting each gate vertex into an in-vertex and out-vertex joined by an edge of open probability 1/2. All predecessor links and source links are deterministic open edges. For a pinned site use open probability 0 or 1. This preserves acyclicity and uses O(k+s) vertices/edges after duplicate links are removed. The required probabilities have constant-size rational encodings, so no precision-dependent model change is hidden.

For unlike labels use an estimate of R and multiply by 16^s/2. The factor has O(s) bits and relative error is unchanged. Zero is decided exactly by reachability in the graph with all positive-probability edges present, not by interpreting a failed random trial as emptiness.

For like labels, the designated output is itself a fair gate. Hence R<=1/2 and (1-R)/2>=1/4. Independent direct samples of the output pair therefore yield relative estimates in O(epsilon^(-2) log(1/delta)) trials by the usual bounded-variable concentration argument. Equivalently an additive epsilon/2 estimate of R suffices. We do not need a general unreliability approximation theorem, which has a different complexity status.

If the output is an initial signal, counts and sampling are trivial and handled separately. The statements allow dead slots and arbitrary initial two-row columns.

## 6. Conditional sampling consequence, including the cost of estimates

U58's reversible encoding reduces uniform type sampling to uniform xi masks conditional on a reachability outcome.

**Like labels.** Draw fair xi masks and accept when the output is not reached. Its probability is >=1/2, so there are at most two expected proposals. Fix eta_o to the desired first label and sample the remaining fair bits. This yields an **exactly** uniform type assignment in expected polynomial bit time. Equivalently, rejecting full random type assignments by their two actual labels has acceptance probability >=1/4 and at most four expected proposals. This does not contradict U50: two prescribed labels under a fixed topology are not its many-label hard terminal states.

**Unlike labels.** First check a path exists. Reveal xi coordinates one at a time. For either possible bit, the remaining count is 2^(number of free sites) times the reliability of a DAG with that prefix pinned; apply [1] to approximate the two weights. The factors 2^(number free) cancel in their ratio. Every query remains in the source's DAG domain with probabilities 0,1/2,1, and all calls and their work are charged.

For normalized branch weights, relative error eta on both true positive weights gives total variation error at most eta/(1-eta) per step. One proof: each normalized probability differs from its true value by at most 2eta/(1-eta) times that true probability; summing and dividing by two gives the assertion. Zero branches are detected by graph reachability and assigned exact zero.

With s steps, choose eta=epsilon/(8s), amplify each estimate's failure probability below epsilon/(8s), and use fresh randomness for adaptive queries. A union bound over 2s calls and sequential coupling bound the accumulated error; rounding each branch to sufficiently many binary places adds another <=epsilon/4. Thus the output distribution is within epsilon in total variation. Sampling the independent eta/z bits and decoding cannot increase that distance. On bad estimator events, a known open path provides a valid fallback; no invalid type assignment need be returned. Empty input is reported separately.

The published runtime is a relatively high polynomial, not a near-linear circuit bound. With error/failure parameters inverse-polynomial in s, the reduction remains polynomial in explicit topology length and epsilon^(-1). This is a theoretical corollary using [1]; the full source approximation routine is **not implemented or benchmarked** in our code. Finite code instead verifies exact conditional fibers and the error-control reduction using explicit exact probabilities with controlled perturbations.

## 7. Checks actually executed

The TypeScript all-half frontier counter evaluated 664 topology queries arising from all 157 bipartite graphs in the declared small dimensions, including empty sides and isolated vertices. Exact interpolation recovers each independent-set count. Of those expanded networks, 284 with <=12 sites were also checked by full site-mask enumeration. The largest has 47 sites; its result is computed by an exact frontier DP, not by listing 2^47 masks. The largest observed frontier is 15 states, a property of these small reduction instances only.

All 76 simple graphs on 0..4 vertices passed the separate general-IS to bipartite-IS interpolation test. Ten declared CNF cases passed the clause-pattern clique and leading-coefficient tests, including tautologies, repeated literals, an empty clause, contradictory units and unused variables. This is not an exhaustive test of all 3CNFs.

Python independently enumerates 58,938 original-network site masks to form Bernstein polynomials in the connector probability; it then compares **all 664 individual rational values** with the TypeScript expanded-network answers, only after independently constructing them. It also checks six exact-rational perturbed-prefix sampling laws against the coupling error bound. Those perturbations model accurate estimates; they do not implement [1].

Wolfram independently reconstructs K_(2,2)'s polynomial and interpolates its five dyadic values, alongside U58's literal gate checks. All actual outputs and the source are preserved.

The initial TypeScript compilation caught one unchecked array increment before execution. It was corrected via the existing checked-index helper. No mathematical assertion or runtime failure remains; the failed compiler message is preserved and not counted as passing evidence.

## 8. Consequence for the full research target

The feared fixed-topology counting obstruction is real for **exact** counts, but a blanket claim that two-row conditional approximation must be hard would be wrong. We have an exact probabilistic correspondence and a published algorithm that resolves the required rare-event approximation in this restricted model.

At the same time, fixing topology can make an exact term #P-hard even though summing all topologies yields the polynomial two-row recurrence of U55/U58. Neither this #P classification nor a generic count of topology terms is a general-circuit lower bound. #P-completeness is a reduction statement, not an unconditional proof that no polynomial algorithm exists.

The next interface is the joint law of **more than two examples**. A first exact follow-up already shows what must be treated carefully. On three rows, output complementation symmetry gives

    Pr[(X_0,X_1,X_2)=(0,0,1)] = (R_02+R_12-R_01)/4.

To prove it, pair each of the eight output patterns with its complement. There are four classes: all equal, or one of three rows differing. The three pair-disagreement indicators determine their class probabilities by these elementary linear equations; a specified orientation has half its class probability.

Take two initial columns A=(1,0,0), B=(0,0,1). Pass B through h gates with repeated predecessors, then apply a fresh arbitrary B2 gate to A and that signal. The pair reliabilities are R_01=R_02=1/2 and R_12=2^(-h-1), whereas the specific target probability is 2^(-h-3). The common large terms cancel. Type enumeration for h=0..3, covering 69,904 assignments, agrees with these identities.

Thus independently substituting relative estimates for the three R values need not give a useful relative estimate of the tiny full-label probability. In this simple example one can exploit the known equalities R_01=R_02; it is **not** a hardness argument for three-row approximation. The next task is to characterize or preserve such cancellations, or express the full event directly, rather than declaring the pair events independent or merely demanding more numerical precision. This is a joint-label question, not another fixed-gate-budget enumeration.


## Sources and version boundaries

[1] Weiming Feng, Heng Guo. *An FPRAS for Two Terminal Reliability in Directed Acyclic Graphs*. ICALP 2024, LIPIcs 297, 62:1-62:19. DOI 10.4230/LIPIcs.ICALP.2024.62. Primary PDF https://drops.dagstuhl.de/storage/00lipics/lipics-vol297-icalp2024/LIPIcs.ICALP.2024.62/LIPIcs.ICALP.2024.62.pdf . Theorem 1 and input probabilities, plus its contrast with unreliability, were read in text and rendered on pp.62:2-62:3. The algorithm overview on p.62:4 and the full-version node-splitting observation were consulted. No full independent correctness certification of that external paper is claimed.

[2] J. Scott Provan, Michael O. Ball. *The Complexity of Counting Cuts and of Computing the Probability that a Graph is Connected*. SIAM J. Computing 12(4),777-788 (1983), DOI 10.1137/0212053. Publisher page https://epubs.siam.org/doi/10.1137/0212053 . Its abstract explicitly lists bipartite vertex-cover counting; complements identify independent sets. Full proof not accessed; our reductions are supplied above. Provan's 1986 DOI 10.1137/0215050 is nearby planar/acyclic reliability literature, not used to assume our node/indegree restriction.

[3] Current search also found Feng-Fu-Guo, arXiv:2608.02523v1 (2026-08-03), claiming an extension to general directed/undirected graphs. Only its abstract/statement were inspected. That newer preprint is **not** needed here and its claimed generality is not substituted for the published DAG theorem.

The official Clay page https://www.claymath.org/millennium/p-vs-np/ and rules https://www.claymath.org/millennium-problems/rules/ were checked this run. P versus NP remains listed as unsolved; no publication, prize eligibility, contact or award is claimed.
