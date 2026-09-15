# P versus NP — checkpoint after U56-U57

Date: 2026-09-15. **We have not solved P versus NP yet.** No complete candidate, formal-kernel verification, or independent expert certification exists.

## Scope and continuity

Assigned folder `/mnt/data/02-p-versus-np`; dedicated private repository `Joe-Simo/p-versus-np`, branch main. Starting head `2a6c678ee9d0cd618a017e683deb4443097a67cf` and the full U55 checkpoint were read through the connected GitHub API. Repository privacy and push permission were rechecked. Eight supplied archives were inspected; 113 missing paths were restored without overwriting a conflicting file. Final comparisons found all 124 archive members across 113 paths unchanged, as well as all eleven initially present files. No sibling project was inspected or modified.

The governing prompt was read in full; SHA-256 `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. Its exact heading, three-short-sentence routine update, private preservation and no-extra-spending requirements remain binding. No publication, researcher contact, prize claim, visibility change or background task occurred. Mathbox/Consensus were not used or claimed; earlier unavailable/quota notes were not retried needlessly. One focused successful Wolfram invocation used the existing allowance.

## Established results

**U56.** For k initial named signals and s raw B2 slots, c_ell(Y) counts all-live compressed cores fitting sample Y. Then H_s(Y)=sum_ell A_(s,ell)c_ell(Y), with A_(s,ell)=[z^ell]product_(j<s)(16(k+j)^2+z). Prune pointer ancestry, retaining fan-out and both pointers of constant/projection gates; compress indices in order; integrate each unused physical slot with its original weight. This is a bijection, not a formula approximation.

All embedding coefficients are computed in polynomial bit work. Exact weighted rank/unrank handles embeddings AND actual unused triples. A conditional raw-description sampler follows when compatible core listings/counts are supplied; the implemented finite lists are enumerated and charged, not assumed cheap. Summing over output labels also gives an independent polynomial-time triangular recurrence for the unconditional live-size distribution.

**U57, actual terminal states.** Suppose Y has a size-s fitting circuit and adding one correctly labeled new point makes it inconsistent. A d-coordinate separator for that point permits a d-gate correction, including d=1 via XOR/XNOR. Thus every fitting function already requires >s-d gates, every fitting raw description has >=s-d+1 live gates, and at most d-1 slots are unused. Full d=n suffices. This applies to the final positive state of every terminating anti-checker history, not just synthetic mixtures. A small-live-core truncation returns a false zero there. At the growing budget s=N^beta/(10n), the unused fraction vanishes.

The exact count in that state reduces to at most d near-maximal core terms, weighted by e_u(W) for u<d. Cheap dead-slot weights do not solve those almost-full core consistency problems.

**U57, stronger rarity.** Signed-alias normalization removes constants/projections and absorbs unary negations, showing C(F)<=max(1,B) when B is the number of gate types depending on both inputs. There are ten such types among sixteen. At s>=16n the compatible prior mass at the terminal positive state is therefore <=16^(-s) sum_(u<n)binom(s,u)6^u10^(s-u)<(7/8)^s. One blind original-prior rejection sample costs at least (8/7)^s expected proposals. This strengthens the earlier specific rejection obstruction without claiming a lower bound for all samplers or circuits.

A weaker topology-only tail bound and the exact unconditioned unfolded expectation s/(k+1) are also proved and checked. Neither prior law is confused with the target-conditioned distribution. Previous fixed-example positive samplers and retired false bridges remain valid/in place.

## Executed evidence

TypeScript `code/u56_u57_audit.ts`: 31,458,604 typed connected cores through three live gates on n=1,2,3; independent literal raw enumeration through two slots covers 370,467 gate lists and 2,415,788 output-tagged descriptions. The latter are also all replayed through signed-alias normalization. Every output and size bound passes.

All 51,311 ranks of six nonempty conditional parity fibers are distinct and correct; three empty fibers, 400 additional weighted decorations, invalid ranks and a shared-versus-independent-child counterexample are checked. All 6,651 partial tables through n=3 produce 12,458 positive-to-empty boundary pairs; every cutoff and constructed patch passes. Full truth-table distribution coordinates at three slots agree with Python. Large counts through 256 slots are weighted arithmetic, not description enumeration.

Python `code/u56_u57_independent.py` uses per-row truth values, raw-prefix single/pair masses, explicit predecessor-topology walks and rational tail calculations. It constructs independently before comparison. Coverage includes 191,853 topologies, 1,383,156 output cases, 2,633,085 block-edge checks, 1,046 old-set/new-point separator cases and all 64 signed-input truth-table rewrites. Both resulting files are exactly reproducible.

Wolfram 15.0.1 independently checks three topology histograms, eight parent-edge tail bounds, coefficient arithmetic and a patch. Its parity core counts were supplied and it did not check the later signed-alias follow-up; these limits are explicit in its record. There was no warning, timeout or failed computation in that invocation. Independent implementations are not independent expert review.

## Reproduction and preservation

Node v22.16.0, TypeScript 5.8.3, Python 3.13.5. No package installed. Bun and Lean executables were not found; no package manifest or configured project linter is present. Strict/no-unused compilation is the applicable lint/type equivalent. No introduced compile or assertion failure occurred. Final new outputs repeated byte for byte, and the unchanged U54-U55 source reran with byte-identical output.

```sh
tsc --noEmitOnError --strict --noUncheckedIndexedAccess --noUnusedLocals --noUnusedParameters --target ES2022 --module commonjs --outDir research/validation/build-u56-u57 code/u56_u57_audit.ts
node --check research/validation/build-u56-u57/u56_u57_audit.js
node research/validation/build-u56-u57/u56_u57_audit.js > research/validation/u56_u57_fresh.json
cmp research/validation/u56_u57_results.json research/validation/u56_u57_fresh.json
python -m py_compile code/u56_u57_independent.py
python code/u56_u57_independent.py
```

The Python script reads `research/validation/u56_u57_results.json` only for final comparisons. Full result SHA-256: `3e7743c617930c5db79a0859e8b579b9778f1eaaa2bdcae4515fde72d4824e2a`. Independent result SHA-256: `6880e615d35637d1c675ff12179785b55a236f0ecc6aa130ffb790554c4e33dd`. Use a fresh output path on rerun. The package contains full data; remote additions contain complete proofs and executable sources, compact result summary, logs and independent record. Do not claim the full large result JSON is remotely committed unless a later receipt confirms it. Final remote commit/parentage belongs in the separately verified receipt, not a guessed value here.

## Sources and full problem

The current Clay page https://www.claymath.org/millennium/p-vs-np/ still states Unsolved. The published rules at https://www.claymath.org/millennium-problems/rules/ retain qualifying publication, at least two years and community acceptance; no prize eligibility is claimed.

OPS2021 https://theoryofcomputing.org/articles/v017a011/v017a011.pdf Theorem 1.4 (printed p.6) and the constant-shrink discussion/footnote 13 (p.21) were read/rendered. The fixed-epsilon/every-small-beta ordinary general-circuit target is unchanged. The new counting and rejection results do not prove its premise.

Janson, Random Structures & Algorithms 64 (2024), DOI 10.1002/rsa.21195, was consulted for adjacent unconditioned DAG-ancestry context at the introduction/backward-exposure/several-root sections. No limit law was applied to conditional circuits. Focused literature searches did not authenticate novelty; none is claimed. All new proof dependencies are explicit elementary arguments, not an inaccessible theorem.

## Next executable obligation

Do not merely increase the forward histogram or small gate budget. Test the following candidate exact correspondence for a FIXED shared predecessor topology and two example rows: if B_j marks disagreement across the two rows, then B_j should have the law xi_j AND (B_a OR B_b), with fresh independent fair bits xi_j. This would express fixed-topology type counts using directed site reliability. First derive the gate-level conditional law, handle repeated predecessors, shared subgraphs and the output orientation, and compare the resulting 2^s weighted process against literal 16^s gate-table assignments on small graphs.

Then inspect any claimed hardness theorem for the exact DAG/indegree/node-versus-edge model before importing it. Hardness with a topology fixed is NOT automatically hardness of the unrestricted sum over all topologies: U55 already gives an efficient unrestricted two-row counter. The aim is to expose what averaging over topology actually simplifies, not to rename the same unproved general consistency oracle.

The full P-versus-NP target has no complete candidate. No process continues after the final response.
