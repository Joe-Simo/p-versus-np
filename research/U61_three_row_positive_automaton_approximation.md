# U61 — Three-row positive reduction to approximate word counting

Date: 2026-09-15. Status: self-contained reduction, constructive feasibility theorem, and approximation/sampling consequences of a published theorem, with independent finite checks. No P-versus-NP solution, formal/expert certification, or novelty claim.
Dependencies: U58's two-row law (rederived in Section 3), U60's model, and Arenas–Croquevielle–Jayaram–Riveros [1], Theorem 6.2, only for the polynomial randomized word-counting primitive.

## 1. Main result and scope

For a supplied shared B2 topology and at most three example rows, the number of compatible gate-type assignments admits a fully polynomial randomized relative approximation scheme. Their uniform conditional distribution admits a polynomial-time almost-uniform sampler. The topology and gate budget may grow; the row bound is three. One or two rows can be padded to three by repeating a row and its target label, without changing the count; zero rows impose no condition and give 16^s assignments.

The argument first replaces unstable subtraction of pair probabilities by a nonnegative weighted event. Its support is recognized by an explicitly constructible NFA with O((s+1)(k+s)^2) states. A published approximation theorem for the number of accepted **words**, not paths, then applies. All calls, precision parameters, automaton size and suffix operations are charged below.

The source #NFA FPRAS is **not implemented or benchmarked** in this run. Our executed code constructs the automaton and exact finite counters, checks every word on declared small instances, and validates the probability reduction. The polynomial approximation statement is a literature-dependent corollary, not an observed solver runtime. It extends U59's theoretical two-row result; it does not solve arbitrary growing-row consistency or supply an OPS2021 general-circuit lower bound.

## 2. Independent structural result: three-row affine replacement

Let an affine binary gate be h(u,v)=alpha*u XOR beta*v XOR gamma. There are eight such truth tables: precisely those with even parity over all four input pairs.

On at most three rows, every gate leaves at least one input pair p* unobserved. Choose the first such pair. For an arbitrary type g, let delta be the parity of all four entries and set

    h = g XOR (delta times the indicator of p*).

Then h is affine and agrees with g on every observed pair. The map g <-> (h,delta) is bijective: the inverse flips the same missing entry. In gate order the parents' observed columns agree throughout, so the missing pair is the same for encoding and decoding at every stage.

**Consequences.** For every fixed topology, the full joint law of all gate columns on <=3 examples under uniform B2 types equals that under uniform affine types. Every affine type sequence has exactly 2^s B2 sequences in its fiber. Thus each desired-output count satisfies

    #B2(Y) = 2^s #Affine(Y).                                  (3)

No independent-branch assumption is involved; the entire shared DAG is retained. The fact that affine functions are three-wise independent on a binary gate's input space is elementary background; no new independence theorem is claimed.

### Polynomial exact feasibility, including frozen prefixes

For a designated gate output, normalize initial columns by their row-zero values and regard them as vectors of dimension at most two over GF(2). The desired shape is achievable iff it is in the span of the initial-signal shapes reachable backward from the output.

Necessity follows because every affine circuit output is an affine combination of its ancestor inputs. For sufficiency, solve for coefficients of those shapes. Choose one outgoing occurrence toward the output for each ancestor node other than the root. The graph is acyclic, and each chosen successor is itself an ancestor, so these choices form a directed in-tree with unique routes to the root. At each gate add only parents whose chosen occurrence enters it. At an initial signal's first edge use its desired coefficient; internal chosen edges have coefficient one. Repeated predecessor pointers use only one occurrence. A final constant at the root adjusts row-zero orientation. Every desired initial contribution arrives exactly once. The resulting types are affine and respect the given wiring.

All graph operations and Gaussian elimination are polynomial in the explicit input. For a completely fixed prefix of gate types, evaluate it on the examples and treat its outputs as additional initial signals; the remaining free suffix obeys the same criterion. If the output is already fixed, test its known column directly. This provides exact zero detection and a fitting suffix, NOT an exact efficient count. Partial pinning of bits inside a gate is not assumed: the sampling construction below always branches on a complete gate type.

## 3. A cancellation-free identity for a nonconstant three-row label

There are three nonzero normalized shapes c in GF(2)^2. Color each initial signal by its nonzero shape, or omit it if its shape is zero. Give every gate one independent fair site bit xi. For each gate propagate a set of source colors:

    S_j = empty if xi_j=0;
    S_j = S_a union S_b if xi_j=1.                             (4)

These are colors reachable through open gates from initial sources. One site bit is shared among ALL paths and color tests using a gate. For a requested nonzero shape c, define the integer weight

    w_c(S) = 2 if S={c};
             1 if S contains at least two distinct colors;
             0 otherwise.                                    (5)

If y is either of the two three-bit labels of shape c, then

    Pr[B2 output = y] = E[w_c(S_output)]/4;
    #B2(Y) = 2^(3s-2) sum_(xi in {0,1}^s) w_c(S_output(xi)).   (6)

The output must be a gate; initial outputs are separate. Formula (6) is nonnegative and exact. It is NOT a joint generative coupling of all output colors: for one site mask several weights can be positive. It is an identity for the one scalar event being counted.

### Proof of (6)

For a pair of example rows, a fresh uniform B2 gate sees either the same input pair twice, forcing equal outputs, or two different pairs, whose outputs disagree with probability 1/2 independently of earlier types. Therefore their disagreement has the joint site-reachability law B_j=xi_j*(B_a OR B_b), as established in U58.

The three nonzero linear functionals chi on GF(2)^2 correspond to the three pair-disagreement bits among three rows. For fixed c, exactly two of them, chi_1 and chi_2, are one at c, and the remaining chi_0 is zero. For every actual output shape Z,

    1[Z=c] = (chi_1(Z)+chi_2(Z)-chi_0(Z))/2.

In the common site construction (4), the reachability indicator for functional chi is I_chi=1[some color in S has chi=1]. It has the required marginal disagreement probability, though this common coupling is not asserted to reproduce the full actual three-row distribution. Inspection of the eight possible subsets of the three nonzero colors gives

    I_chi_1+I_chi_2-I_chi_0 = w_c(S).

Taking expectations is therefore valid. Output complementation symmetry of the fresh gate divides a shape's probability equally between its two orientations, giving the additional factor 1/2 and proving (6).

For a constant three-row label, its probability is at least 1/8: the output gate evaluates at most three distinct input pairs, and assigning all of them the required bit has probability at least 2^-3. Elementary relative Monte Carlo and exact rejection sampling are already polynomial (at most eight expected proposals for exact sampling). For arbitrary q the analogous constant-label bound is 1/16; this does not help with general nonconstant histories.

## 4. Polynomial automaton for the support of the positive weight

Let d,e be the other two colors. The event w_c>0 is exactly

    E_c = {a c-colored source reaches the output}
          OR {a d-colored source AND an e-colored source both reach it}.  (7)

Construct a layered binary NFA reading the s site bits once, in topological gate order. With L=k+s, it has two disjoint modes:

- One path token at a node v, initially at any c-colored initial source.
- Two path tokens at nodes (v_d,v_e), initially at a d-source and an e-source.

At step j, on symbol zero a token stays put. On symbol one it may stay put or, if its current node is a predecessor of gate j, jump to j. In the two-token mode both make their choices using the **same** symbol. Both may jump through one shared gate on the same bit. Skips are allowed so a path can wait for its next gate. Accept after s symbols when the single token, or both tokens, are at the designated output.

A run exactly guesses one open path, or two open paths, respectively. Conversely any such paths follow increasing gate indices and produce accepting runs. Hence the accepted words are precisely the site masks in (7).

The direct construction has at most

    (s+1)(L+L^2) states, and s(3L+5L^2) transitions.

It uses initial-state sets, as permitted explicitly in [1]. s is the actual number of listed gates, so its unary encoding is polynomial in the input size. No exponentially large product over all signal values is hidden.

Many words have multiple accepting runs. Counting runs would be wrong: on the checked shared diamond, one color's event has three accepted masks but four accepting runs; another example has four accepted masks but fourteen accepting runs. The use of #NFA, which counts distinct words, is load-bearing.

## 5. From the published primitive to relative approximation

Let C=|E_c| be the number of accepted s-bit words. Theorem 6.2 of [1] gives an FPRAS for C for the explicitly constructed NFA. Empty languages at the prescribed length can be detected exactly by reachability through its layers. When C>0, set

    mu = E[w_c(S) | E_c], so 1<=mu<=2.

Equation (6) becomes

    #B2(Y) = 2^(3s-2) C mu.                                  (8)

An almost-uniform word sampler is obtained from the same FPRAS by prefix self-reduction. After a word prefix, compute the reachable NFA state set and use it as the initial set for the remaining length. Count suffixes extending zero and one, not accepting runs. If both estimates have relative error eta, normalizing the two weights changes their distribution by at most eta/(1-eta) in total variation. With s steps, use eta=O(epsilon/s), amplify failure probabilities below O(epsilon/s), and round branch probabilities to sufficiently many binary digits. All calls and bit lengths remain polynomial. On a failed estimate a deterministic accepting path supplies a valid fallback word. This uses the counting theorem only; it does not import the more delicate exact-generation convention of [1, Theorem 6.3].

Draw independent almost-uniform words at total-variation distance at most alpha/4. Because w is between one and two on this language, the mean bias is at most alpha/4. Ordinary bounded-variable concentration with O(alpha^-2 log(1/delta)) samples estimates mu to additive error O(alpha), which is also relative error O(alpha) because mu>=1. Taking alpha a sufficiently small constant multiple of the requested epsilon, and estimating C to the same relative scale, proves the FPRAS for (8). Multiplying by the explicit power of two costs polynomial bit work; it does not affect relative error. Repeated independent runs and a median amplify success probability.

This avoids both exponential blind rejection from a rare event and subtraction of two large approximate probabilities. The rare-chain example from U59 now has an NFA language of one word; its rarity does not alter the polynomial running-time guarantee of the published counting theorem. Our code checks that reduction exactly, but does not run that theorem's full algorithm.

## 6. Almost-uniform sampling of original types

Reveal one complete gate type at a time, not one partially pinned truth-table bit. For each of its sixteen choices, evaluate the enlarged prefix on the examples and invoke the just-proved suffix counter on the remaining free topology. Prefix outputs become named initial columns. Exact zero detection is supplied by Section 2. Choose among positive branches with probabilities proportional to the approximate suffix counts.

There are at most 16s count calls per sample. Choose each relative error and failure probability O(epsilon/s), with constants small enough for the union/coupling bound. The normalized-weights estimate above applies to any finite number of branches. Summing per-stage errors and failure probabilities gives total variation at most epsilon. Invalid branches have exact zero and are never taken; if numerical estimates fail, the constructive affine suffix provides a valid fallback.

Thus the original uniform distribution on compatible B2 type assignments admits a fully polynomial almost-uniform generator. The count primitive, its confidence amplification, all prefix evaluations, and the automata it constructs are included in the polynomial. No claim of a low exponent, practical speed, ordinary near-linear meta-circuit, or exact uniform nonconstant sampler is made.

## 7. The four-row boundary is a demonstrated failure, not an extrapolation

One gate on all four binary input pairs has sixteen possible output tables under B2 and only eight under affine types. The AND table has probability 1/16 under B2 and zero under affine types. Nevertheless every marginal on at most three of the four rows is identical under the two uniform distributions.

Therefore neither the affine replacement nor reconstruction from only up-to-three-row marginals is a valid general solution at four or more rows. This refutes those proposed extensions specifically. It does not prove that four-row approximation is hard or that no different positive reduction exists.

The OPS2021 application has a growing example set and also sums or constrains circuit descriptions in a different model. An approximation theorem for three fixed rows does not establish its required general-circuit lower bound or decide worst-case SAT.

## 8. Executed evidence and limitations

Main code: `code/u60_u61_audit.ts`; independent code: `code/u60_u61_independent.py` and `.wl`.

- All 84 local parent-column pairs on q<=3 pass full-versus-affine distribution and independent rank tests. The main complete small families give 24,294 full-versus-affine output-count/feasibility comparisons.
- 131,072 raw type assignments on two four-gate shared topologies are mapped to affine assignments and inverted exactly.
- Every fully fixed prefix of one specified three-gate topology is tested against literal suffix enumeration, giving 34,952 label-feasibility checks.
- The explicit polynomial automata are built for 3,249 cases; 12,966 complete site words are compared with direct color propagation. The nonnegative weighted identity gives 6,492 label checks. There are 146 cases where accepting runs overcount accepted words.
- Python independently evaluates rows, obtains color sets by backward traversal, and forms path-mask families. It checks all named color counts and 234 site/path words, then ten exact-rational perturbed-prefix laws; the maximum observed TV error is 45028/78602245. These perturbations are controlled arithmetic tests, not the outputs of a generic approximate word counter.
- Wolfram independently checks full-column-state counts, the affine scaling, the positive-weight table, three-row local ranks and the AND counterexample. An initial invocation emitted an undefined-symbol warning for two iterator names; a scoped corrected invocation repeated the same numerical conclusions without warnings. Both the issue and the successful code/output are recorded.

No external approximation routine was executed. No proof assistant or separate expert validated the arbitrary-size reduction. The source theorem is used with its exact model, not claimed independently reproved. The main and independent source/results are reproducible; all finite scopes are explicit.

## 9. Literature verification and next obligation

[1] Marcelo Arenas, Luis Alberto Croquevielle, Rajesh Jayaram, Cristian Riveros, *#NFA Admits an FPRAS: Efficient Enumeration, Counting, and Uniform Generation for Logspace Classes*, JACM 68(6), article 48 (2021), DOI 10.1145/3477045. Primary author version arXiv:1906.09226v4, June 23, 2021: https://arxiv.org/pdf/1906.09226 . Theorem 6.2 and the exact binary NFA/initial-set/unary-length definition on printed p.19 were read and rendered. Section 6's algorithm organization and word-versus-run distinction were inspected. The entire 39-page proof was not independently certified. Publisher metadata was checked at https://doi.org/10.1145/3477045 .

[2] Feng–Guo, ICALP2024, https://drops.dagstuhl.de/storage/00lipics/lipics-vol297-icalp2024/LIPIcs.ICALP.2024.62/LIPIcs.ICALP.2024.62.pdf . Printed p.62:3 was read/rendered: it explicitly discusses reductions from DAG reliability to #NFA and the word-counting primitive. This is supporting context, not a theorem that automatically covers the two-color conjunction; Section 4 supplies that construction and charges its product size.

The exact three-row affine and colored identities are self-derived applications; searches did not establish their originality, and no novelty claim is made. The next meaningful question is whether four-row information admits a similarly positive polynomial-size acceptance event. Any proposed extension must separate the single-gate B2/affine distributions and preserve correlated shared sites, not just multiply path probabilities or count runs. First test the missing four-row parity component explicitly before attempting a growing-q closure theorem.
