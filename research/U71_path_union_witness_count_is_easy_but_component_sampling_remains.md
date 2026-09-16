# U71 — Path-union overlap multiplicity is polynomial-time computable; component sampling remains open

Date: 2026-09-16. Status: self-contained witness-union theorem, exact dynamic program, exhaustive bounded checks, and a precise remaining bottleneck. No P-versus-NP solution, no approximation-hardness theorem, no formal/expert certification, and no novelty claim.
Dependencies: U68's balanced favorable-prefix condition and U70's exact component-count classification.

## 1. Exact path-certificate union for a balanced target

Let the balanced four-row target Y have zero rows Z and one rows O. There are exactly four cross-label pairs `X=Z x O`.

After integrating the final B2 gate as in U63/U68, a prefix with final parents A,B is favorable exactly when for every `p in X`, A differs on p or B differs on p.

### Disagreement descent lemma

If a gate output differs on rows i,j, then at least one predecessor differs on rows i,j. If both predecessors agreed across the two rows, the gate would receive the same ordered input pair and produce the same output bit.

Iterating in the acyclic circuit shows every actual disagreement at A or B has a backward path of disagreements to an initial signal that differs on that row pair.

Therefore a positive certificate for favorability may choose, independently for each of the four cross pairs, a final parent A or B that differs and one backward disagreement path from that parent to an initially differing signal. The union over all such four-path tuples is exactly the favorable-prefix event.

## 2. Polynomial-time witness multiplicity for a sampled word

Fix a complete raw type word and evaluate its four sampled rows. For a row pair p and signal v, define `P_p(v)` as the number of backward disagreement paths from v to initially differing signals. Treat predecessor positions as distinct path choices, so repeated predecessors contribute twice when both wire positions are selected.

For an initial signal v, `P_p(v)=1` if v differs on p and zero otherwise.

For a gate v with predecessor positions a,b: if v does not differ on p then `P_p(v)=0`; otherwise

`P_p(v) = 1[a differs] P_p(a) + 1[b differs] P_p(b)`.

If the four cross pairs are `p_1,...,p_4`, the number W of four-path certificates witnessing one sampled prefix is

`W = product_r ( P_(p_r)(A) + P_(p_r)(B) ).`

Hence `W>0` iff the prefix is favorable.

The recurrence needs O(s) additions for each of four row pairs. Each path count is at most `2^s` per starting signal, so W has O(s) bits. Thus W is computable in polynomial bit complexity from a sampled raw word.

This is the overlap denominator needed by a Karp-Luby-style union correction once a suitable incidence sampler is available.

## 3. Exhaustive checks with sharing and repeated predecessors

The final TypeScript checker enumerates 74,000 complete raw type words across five declared topologies, including a chain, a reconvergent shared diamond, a four-gate shared topology and repeated predecessor positions.

For every word it independently lists every backward disagreement path and compares the literal four-path-tuple count with the dynamic-program value W. It also checks `W>0` iff the four cross-label separation requirements are satisfied by A,B.

All 74,000 words pass. The largest observed witness multiplicity is 1,024. Independent Python repeats 8,464 complete words using separate literal path lists and agrees. These are bounded implementation checks; the recurrence itself is the proof for arbitrary topology size.

## 4. Shared gates invalidate route-only local factorization

At a gate used by multiple certified row-pair paths, the local number of allowed B2 types is not determined solely by how many pair paths use each predecessor.

The exact local rule from U70 is the rank of the affine truth-table system `x_(address_i)+x_(address_j)=1`.

For fixed selected predecessor `a=0001` and requirements `(0,1),(0,3)` routed through it:

- side column `0000` makes both requirements the same equation, giving 8 types;
- side column `0010` makes them independent equations, giving 4 types.

Thus a path-shape-only product formula is false even at one shared gate. The sampled side-parent addresses matter, and those addresses may depend on arbitrary shared ancestry.

## 5. What this resolves for a union estimator

The path-certificate union strategy has two separate tasks:

1. **Overlap correction for a sampled favorable word.** Solved here: W is polynomial-time computable exactly.
2. **Generate the Karp-Luby incidence distribution**, requiring controlled counting/sampling of the fixed-certificate component sets. Not solved.

U70 shows exact fixed-certificate component counting is #P-complete even for depth-one probes, although those particular probes are dense and easy to approximate. Therefore exact counting cannot simply be assumed as a free subroutine.

Conversely, U70 does not prove arbitrary fixed certificates hard to approximate or sample. A single long path, for example, has simple local one-pair constraints even though raw acceptance can be exponentially small. Multiple shared paths are the unresolved case.

## 6. Consequence and next question

The Karp-Luby path-union route survives one important audit: witness multiplicity and overlap correction are cheap. It fails another naive simplification: component weights do not factor from route shape alone.

The next useful target is approximate/uniform sampling for one fixed four-path certificate. A natural candidate is topological sequential conditioning: at a constrained gate, after parent columns are known, choose uniformly from locally allowed B2 types. This is generally biased because the number of allowed types can depend on earlier sampled side columns, so future completion counts vary.

The next execution should quantify that bias/variance on a recursive family and test whether a polynomially computable correction based only on local ranks can restore an FPRAS/near-uniform sampler. If it does not, preserve the smallest explicit high-variance family. No approximation-hardness conclusion should be drawn solely from failure of that sampler.
