# U41 — A quantitative locality bound for parity-to-small-cover reductions

Date: 2026-09-15 (UTC).
Base remote revision: `00655a55757b6ef9160c21687567937df3912eca`.
Status: rigorous application of the known satisfiability coding lemma; self-audited, finite checks completed; no claim of global novelty or a P-versus-NP solution.
Follows U39's block-selection proposal. U40 independently rules out the proposed nonuniform time-space target.

## 1. What is being tested

U39 correctly observed that merely counting possible small covers does not limit the information an unrestricted graph reduction may compute. Here an explicit locality hypothesis makes that counting argument valid.

Let z in {0,1}^q be the source input, and let G(z) be a simple graph on a fixed vertex set [v]. For every potential edge e, its presence g_e(z) is computed by a deterministic input-query decision tree of depth at most b, where 1 <= b <= q. The queried coordinates may be adaptive and may differ between edges. Constants and source literals are allowed. A function depending on at most b coordinates is a special case.

There are no additional uncharged source-dependent auxiliary variables, no promise restricting the parity inputs, and no randomized error. The cover budget k is fixed, 0 <= k < v. The reduction requirement is exact on all inputs:

    tau(G(z)) <= k  iff  parity(z)=1.

Even parity gives the same result by complementing one source bit.

## 2. Turning a candidate cover into a bounded-width CNF

For a fixed C subseteq [v] of size k, let

    A_C(z) = AND over edges e disjoint from C of NOT g_e(z).

This is exactly the condition that C covers G(z). Every cover of size at most k can be enlarged to size k, so

    [tau(G(z)) <= k] = OR over |C|=k of A_C(z).

Each factor NOT g_e is representable by a CNF of clause width at most b: for every 1-leaf in a depth-b decision tree for g_e, include the clause that forbids that leaf's partial assignment. The conjunction excludes exactly the inputs for which g_e=1. Normalize repeated queries and discard unreachable paths. Therefore A_C is a b-CNF in the q source variables, without auxiliary variables.

This representation need not be explicitly built by the reduction. It is used for a structural lower bound. At most 2^b clauses per edge suffice, but our counting argument does not depend on the clause count.

## 3. The established coding lemma

Paturi–Pudlak–Zane [S1, Lemma 4] show that a width-b CNF on q variables has at most

    2^{q-q/b}

isolated satisfying assignments, meaning assignments for which flipping any one bit falsifies the CNF. The width/auxiliary-variable argument in [S2, Section 3.2] applies the same fact to a union of bounded-width CNFs.

For completeness, the probability proof is short. An isolated solution has, for each variable, a clause for which that variable is the only satisfied literal. Choose a random variable order, force a variable when its unit clause is present, and otherwise guess a fair bit. A chosen critical clause forces its variable whenever it is last among that clause's at most b variables, an event of probability at least 1/b. Thus the expected number of forced variables along a fixed solution is at least q/b. Its output probability, averaged over orders, is at least 2^{-q+q/b} by convexity. Distinct output events are disjoint, proving the count bound. This reproduces the known lemma, not a new SAT algorithm.

## 4. Theorem U41.1 — cover budget versus edge-query depth

Under the exact reduction contract of Section 1,

    binom(v,k) >= 2^{q/b-1}.

Equivalently,

    q <= b * (1 + log_2 binom(v,k)).

For k>=1 this yields the weaker but convenient necessary condition

    q <= b * (1 + k log_2(e*v/k)).

### Proof

Every A_C accepts only odd-parity inputs, since acceptance by any one cover makes the graph a YES instance. Therefore all its satisfying assignments are isolated. By the coding lemma, A_C accepts at most 2^{q-q/b} inputs. The union of the binom(v,k) possible A_C must cover all 2^{q-1} odd-parity inputs. Overlap only makes this harder, so

    2^{q-1} <= sum_C |A_C^{-1}(1)|
             <= binom(v,k) * 2^{q-q/b}.

Divide to obtain the result. The final estimate uses binom(v,k) <= (e*v/k)^k. QED.

### Literal-projection special case

At b=1, each nonempty A_C is a subcube contained in a parity class. Such a subcube contains only one point, giving binom(v,k) >= 2^{q-1} without the coding lemma.

### Consequence for the proposed block strategy

If k(v)=v^{o(1)} and b(v)=v^{o(1)}, the right side of q <= b(1+k log_2 v) is v^{o(1)}. Thus the reduction cannot represent parity on q >= v^delta source bits for any fixed delta>0 eventually.

In particular, replacing one-bit gadgets by polylogarithmic-query block gadgets does not fix the small-k problem at polynomially related source/target lengths. The new bound makes explicit how increasing per-edge computation must pay for reducing the cover budget.

## 5. Generalized inner product

Define

    GIP_{r,p}(z) = XOR_{i=1}^r AND_{j=1}^p z_{j,i}.

Fix z_{j,i}=1 for all j>=2. The remaining function is parity on r independent variables. Restriction cannot increase an edge decision tree's depth. Therefore every b-query-local exact reduction of this GIP function to v-vertex k-Vertex-Cover satisfies

    r <= b * (1 + log_2 binom(v,k)).

This tests the GIP option suggested in U38–U39. It does not automatically apply to every tensor function in Beame–Vee; a suitable parity restriction must be proved for each separate family.

There is also a model warning: ordinary GIP itself has a uniform linear-query, logarithmic-space algorithm that processes one column at a time while keeping the running AND and XOR. Its hardness for a fixed multiparty communication partition is not a general random-access time-space lower bound. The tensor construction in Beame–Vee has additional structure; the two must not be conflated.

## 6. The limitations are necessary, not cosmetic

Without locality, arbitrary H can be encoded into a two-vertex graph with edge bit g(z)=NOT H(z) and budget k=0. Then tau(G(z))<=0 iff H(z)=1. That construction simply performs all of H inside the edge evaluator. It demonstrates why an unrestricted cover-count argument is invalid.

At b=2, one cover may accept more than one parity input: the CNF enforcing z1=z2 and z3=z4 accepts 0000, 0011, 1100, and 1111, all even. Thus the b=1 singleton proof cannot be reused for block queries. The coding lemma gives the correct weaker bound.

The theorem also does not exclude nonlocal reductions, large b, large k, huge vertex blowup, promise-only encodings, or extra computed variables outside the stated contract. It proves no lower bound for arbitrary SAT algorithms.

## 7. Exact finite audit

The TypeScript checker enumerates every subset of the even-parity assignments for q=1,...,5: 65,814 subsets total. For each subset and every width 1<=b<=q, it tests bounded-width CNF definability by closure under all clauses true on that subset.

This is exhaustive over solution sets, not merely a sample of CNF syntax. If S is definable by a b-CNF, intersecting all width-at-most-b clauses that hold on S gives exactly S; conversely, that intersection explicitly defines S. The empty relation is represented by an empty clause and is counted separately.

All definable sets satisfy the exact integer inequality

    |S|^b <= 2^{q(b-1)}.

No logarithm or floating-point comparison is used in this test. Maximum accepted-set sizes, listed by b=1,...,q, were:

| q | Maximum sizes |
|---|---|
| 1 | 1 |
| 2 | 1, 2 |
| 3 | 1, 2, 4 |
| 4 | 1, 4, 6, 8 |
| 5 | 1, 4, 8, 12, 16 |

A separately implemented Wolfram checker used allowed coordinate projections rather than clause truth-table intersection. For q=4 it independently obtained maxima 1,4,6,8 and numbers of definable subsets 9,67,183,256, matching TypeScript exactly.

These tests do not enumerate all graph reductions. They audit the bounded-width sublemma and detect the false stronger assertion that every block-local candidate cover accepts at most one parity input. The all-length reduction theorem is the proof in Section 4.

## 8. Research consequence

U39's reuse idea needs more than many available candidate vertices: under low-query edge access, parity/GIP imposes the quantified tradeoff above. More importantly, U40 already gives an unconditional upper bound in the unrestricted branching-program model targeted by U38. Thus evading only this locality bound would not rescue that time-space route.

The useful surviving lesson is to charge the cost of computing an edge predicate or terminal label. Source information cannot be treated as hard when all of its difficult processing is delegated to an uncharged local function.

## Sources

[S1] Ramamohan Paturi, Pavel Pudlak, and Francis Zane, *Satisfiability Coding Lemma*, Chicago Journal of Theoretical Computer Science, 1999, Article 11, Section 2, Lemmas 2 and 4; printed pp. 5–7, especially p. 7 (PDF p. 9). https://scholar.lib.vt.edu/ejournals/CJTCS/cjtcs-mirror/articles/1999/11/cj99-11.pdf

[S2] Gregory Emdin, Alexander S. Kulikov, Ivan Mihajlin, and Nikita Slezkin, *CNF Encodings of Parity*, arXiv:2203.01082, Section 3.2, Lemma 6 and width proof, p. 9 of accessed PDF. https://arxiv.org/abs/2203.01082

Accessed September 15, 2026. The elementary union-of-CNFs argument is established literature; the graph-specific parameter application is derived here. Searches for vertex-cover/parity/projection and kernelization/nonuniform-branching terminology did not authenticate an exact prior statement of this application. That does not establish novelty.
