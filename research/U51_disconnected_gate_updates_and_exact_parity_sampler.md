# U51 — Local gate updates can be disconnected even when exact uniform sampling is easy

Date: 2026-09-15. Status: proved growing-arity structural theorem, exact finite graph audits, and a constructive restricted sampler. No P-versus-NP result, unrestricted sampling lower bound, formal-kernel verification or claim of novelty.

## 1. The alternative actually investigated

After U50 rules out blind rejection as an efficient implementation of the constant-shrink anti-checker method, test the proposed replacement: start with a compatible circuit and repeatedly replace one gate, rejecting changes that violate the labels.

For parity on n>=2 input bits and the minimal budget s=n-1, we prove that the compatible-description graph has

    2^(n-2) n! (n-1)! vertices,
    n! (n-1)! / 2 connected components,
    2^(n-1) vertices in each component.

Thus local updates cannot converge from one component to the uniform distribution on all compatible descriptions. But we also construct an exact uniform sampler for the same entire family in expected polynomial time in n. The contrast is essential: failure of this Markov chain is not hardness of conditional sampling itself.

These are minimal-budget parity instances, not the growing Gap-MCSP NO instances of U50. In particular parity is computationally easy. The example refutes a universal mixing assertion; it does not establish disconnectedness on the specific promised histories of the full research target.

## 2. Precise graph and cost convention

Use B2, all sixteen Boolean functions on two inputs. Constants and uncomplemented input wires are free; all NOT operations must be charged unless absorbed into a gate. A raw description contains s ordered, topological triples (gate type, predecessor 1, predecessor 2), plus an output signal index. Repeated predecessors, unused gates and fan-out are permitted in the ambient universe.

The vertex set consists of descriptions that compute PAR_n(x)=x_1 XOR ... XOR x_n on the complete Boolean cube. Two vertices are adjacent if one entire gate triple is replaced, or only the output index is replaced. We even allow arbitrary simultaneous changes to the type and both predecessors of that single gate. Other fields stay fixed. Nonfeasible intermediate states are forbidden.

The natural proposal chooses a slot and replaces it uniformly from its fixed valid syntactic domain, accepting only compatible results. Its transition probabilities are symmetric; with self-loops, uniform measure on the whole feasible set is stationary. Stationarity does not imply convergence from an arbitrary starting vertex if the graph is disconnected.

## 3. Minimal circuits must be trees

Every essential input has a path to the output. Delete all gates and signals outside the output's ancestor graph. If k live binary gates, n essential inputs, and c distinct used constants remain, there are k+n+c vertices and 2k predecessor incidences. This ancestor graph is connected, so

    2k >= k+n+c-1.

Since k<=s=n-1, equality is forced: k=n-1, c=0, every edge incidence is distinct, and the underlying undirected graph is a tree. Hence there are no unused gates, no repeated predecessors, no shared subcomputations, and each input occurs exactly once. The output is the final gate. This is a consequence of the minimal budget, not an assumption that general circuits are formulas.

At every subtree, freeze all outside inputs. The target restriction is parity on that subtree's input variables, possibly complemented. The outside circuit acts as a unary function of the subtree output; this unary function must be identity or negation because that parity restriction is nonconstant. Therefore each subtree itself computes its local parity or its complement.

Its two child subtrees have disjoint nonempty variable sets and independently attain both bits. The parent gate must thus be XOR or XNOR on all four possible child values. Let its sign be zero for XOR and one for XNOR. The output sign is the XOR of all gate signs; the global target requires an even sign sum. All these conditions are also sufficient.

## 4. Exact enumeration without circuit search

Starting with n active input signals, a live gate merges two distinct active signals into its new output. After j gates, n-j active signals remain. A gate using a previously consumed signal would introduce forbidden fan-out in this tree.

There are

    product_(r=2)^n binomial(r,2) = n! (n-1)! / 2^(n-1)

unordered merge histories. At every gate its two predecessors may be ordered in two ways, giving 2^(n-1) orientation choices. The n-1 signs have even parity, giving 2^(n-2) choices. Multiplication yields

    A_n = 2^(n-2) n! (n-1)!

raw compatible descriptions. The output index is forced. Gate order matters: different topological orders are different histories and are counted separately. There is no division by circuit isomorphism or by the single underlying Boolean function.

## 5. Why one-gate changes preserve the component

Fix a compatible description and change gate j only. Every resulting compatible description still satisfies Section 3. Earlier signals have unchanged functions and supports. The old two child subtrees of j partition its input support into two disjoint nonempty sets A and B.

Any earlier available signal meeting this support is contained in one old child subtree, unless it is a proper ancestor of j; that ancestor cannot occur earlier in topological order. An unrelated earlier signal is disjoint. To preserve all essential inputs and keep every gate live, the replacement must keep both entire old child subtrees. Selecting a proper descendant would disconnect some old input or make an old gate unused. Thus the unordered predecessor pair cannot change.

With the same two predecessors, changing XOR to XNOR or conversely complements the whole output, because every downstream gate is XOR/XNOR and the unique path is unshared. So the type cannot change either. Only swapping the two ordered predecessors preserves feasibility. Changing the output pointer alone is impossible: every earlier signal omits some essential input.

Conversely, each predecessor swap is allowed and the n-1 swaps are independent. Each connected component is an (n-1)-dimensional hypercube of orientations, of size 2^(n-1), indexed by its unordered merge history and sign pattern. Dividing A_n by this size gives

    C_n = n! (n-1)! / 2.

Starting at a single feasible description, after any number of such updates the distribution is supported inside one component. Its total variation distance from the global uniform distribution is at least

    1 - 1/C_n.

For n>=3 this is at least 5/6 and tends to one. No spectral-gap estimate or long simulation is needed: there are exactly zero transitions between components. This conclusion does not apply to a sampler initialized with the correct mixture over all components, to larger blocks, to moves through inconsistent states, or to an enlarged gate budget.

## 6. A positive exact sampler for the same family

The enumeration in Section 4 gives a direct sampler, with no rejection based on circuit consistency:

1. Begin with the active input indices.
2. With r active signals, choose an ordered pair uniformly among its r(r-1) possibilities; replace them by the next gate output.
3. Independently choose XOR/XNOR uniformly at each gate except the last. Choose the last sign to make the XOR of all signs zero.
4. Output the final gate index and the resulting triples.

Every compatible description has exactly one sequence of these choices. Each sequence has probability

    [ product_(r=2)^n r(r-1) * 2^(n-2) ]^(-1) = 1/A_n.

Thus this samples all raw compatible descriptions exactly uniformly, including all disconnected components, without solving a generic counting problem. It uses the special global characterization of minimal parity circuits.

Uniform choices from a finite radix can be generated with fair bits by rejecting out-of-range integers; each such radix conversion accepts with probability greater than one half and takes fewer than two trials in expectation. This elementary randomness conversion is different from rejecting exponentially many circuit descriptions. A simple array implementation costs O(n^2 log(n+2)) expected bit operations and O(n log(n+2)) bits for the output and active list. If bounded runtime is required, cap each radix conversion at O(log(n/delta)) trials: the failure probability is at most delta, and conditional on success the resulting description is still exactly uniform. This is a restricted randomized sampler, not a deterministic SAT decider.

For an arbitrary explicit truth table, recognizing that it is this parity function first costs a full-table comparison; that cost is not hidden. Nothing here supplies a comparable characterization for all circuit-consistency instances.

## 7. Exhaustive finite checks and actual repairs

The TypeScript conditional enumerator searches all first s-1 gate triples. For the last gate it forms the four joint-value cells of its predecessors. A binary gate can fit the target iff the target is constant on each cell; unused cells permit both gate-table values. It enumerates all such choices. If an earlier signal is already the target, every last gate is additionally included with that earlier output index. This covers all raw descriptions and all output pointers exactly once. Each returned circuit is replayed on every Boolean input.

This is a complete finite search, not a semantic approximation or a restriction to XOR trees. At n=3,s=2 an independent brute-force enumeration of every raw gate description gives exactly the same set.

Observed exact results:

| n | s | compatible descriptions | one-block component histogram | at-most-two-block components |
|---|---|---:|---|---:|
| 2 | 1 | 2 | 1 of size 2 | 1 |
| 3 | 2 | 24 | 6 of size 4 | 1 |
| 4 | 3 | 576 | 72 of size 8 | 1 |
| 3 | 3 | 49,536 | 1 of size 49,536 | 1 |

The last row is an executed repair test: one spare gate restores connectivity in this particular finite example. Likewise, two-block updates restore connectivity in the checked minimal cases. Neither observation proves rapid mixing, a universal connectivity theorem, or correctness of a sampler at a changed size budget. Uniform sampling in the enlarged fiber is not automatically uniform sampling in the original one.

Blind rejection acceptance in the minimal rows is respectively 1/640, 1/67,200, and 1/7,225,344; with one spare gate at n=3 it is 43/1,254,400. These fractions use the full ambient raw-description count, not the number of distinct Boolean functions.

The direct sampler's deterministic choice map was exhausted through n=5: 2, 24, 576 and 23,040 histories, all distinct, with every output replayed. Through n=4 these sets match the complete general conditional enumeration. At n=5 only the structural generator and replay were run; no all-gate completeness search at n=5 is claimed. Equal branch denominators prove exact uniformity, rather than a sampled frequency histogram.

Python independently enumerated all n=3,s=2 raw descriptions by evaluating assignments separately, then computed components by pairwise differences instead of TypeScript's deletion-signature union-find. It also checked the 576 four-variable structural descriptions pairwise. Wolfram independently generated merge histories and checked all one-block adjacencies through n=4. These are independent implementations; the unbounded structural proof remains self-audited, not expert- or kernel-certified.

## 8. Research decision and next full-target obligation

Blind rejection provably becomes expensive along the promised constant-shrink paths (U50). Single-gate feasible updates are not even irreducible on all simple nonempty instances (this note). Nevertheless a structural direct sampler succeeds on the very family used to disprove that universal mixing assertion.

The surviving opportunity is a structure-aware, label-dependent sampler or counter with the actual budget, multiplicities and all costs preserved. A proposed generic procedure must prove its support, initialization, empty-set behavior and distributional error, rather than cite Markov-chain convergence or treat a SAT/hash oracle as free. The next question should concern this actual growing-budget conditional predicate, not another fixed-size certificate constant.

The mathematical target is unchanged: no ordinary general-circuit lower bound in the OPS regime, no polynomial-time SAT algorithm and no complete P-versus-NP candidate has been established.

## Sources and originality boundary

The XOR tree upper bound, dependence-on-input gate count, rejection formula and elementary Markov-chain support argument are standard mechanisms; the exact raw-description model is stated here to make their combination reproducible. Literature searches for minimal parity circuits, Boolean circuit reconfiguration and uniform consistent-circuit sampling did not establish novelty of this combined statement. No novelty claim is made.

Jerrum-Valiant-Vazirani (1986), DOI 10.1016/0304-3975(86)90174-X, publisher abstract, and Delannoy-Meel (2022), https://www.cs.toronto.edu/~meel/Papers/lics22.pdf , abstract/introduction, provide sampling/counting context only. Their finer algorithmic theorems are not dependencies of Sections 3-6.

Oliveira-Pich-Santhanam (2021), https://theoryofcomputing.org/articles/v017a011/v017a011.pdf , Theorem 1.4 and footnote 13, retain the exact active magnification target. The uniform-sampling procedure in Section 6 is not its missing unrestricted anti-checker construction.
