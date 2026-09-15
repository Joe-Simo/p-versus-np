# P versus NP — checkpoint after U60-U61

Date: 2026-09-15. **We have not solved P versus NP yet.** No complete candidate, formal-kernel certification, independent expert verification or authenticated novelty claim exists.

## Scope and preservation

Assigned folder `/mnt/data/02-p-versus-np`; private repository `Joe-Simo/p-versus-np`, main. Starting head `f9489c4e2a01b26f204d2929857aa4deedeff3bd` and the full U59 checkpoint were read through GitHub. Privacy and push permission were checked before preservation. Ten supplied packages were inspected; 150 missing paths were restored without overwriting existing content. Final hash comparisons confirm all 163 archive entries across 150 paths and all thirteen initially present files unchanged. No sibling project was scanned or changed.

The complete governing prompt was read and its SHA-256 remains `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. The exact status heading, at most three short routine-update sentences, private work and no extra spending remain binding. No external publication, researcher contact, prize submission, visibility change or background automation occurred. The prior Mathbox/Consensus availability/quota limits were not retried unnecessarily; neither is claimed used. Wolfram used the existing allowance for a warning-bearing invocation and a clean corrected repeat.

## Results established

**U60: general joint-row identity.** For arbitrary q>=1 rows on a supplied topology, each B2 gate bijects to one output-orientation bit and three control bits. Its collision partition depends only on parent column shapes modulo complementation. The whole map is reversible despite sharing and repeats. For a gate output H=2^(s-1)W, where W counts 3s-bit control words producing the target shape. Initial outputs and zero rows are handled separately.

An exact frontier counter and raw-type unranker cost poly(k+s,q)*2^((q-1)w), with count bit lengths charged. This can be exponential. A w-wide family has 2^w reachable cut states, but its particular scalar answer has an elementary recurrence, so this is not an all-algorithm lower bound.

**U61: fixed-topology three-row approximation.** For <=3 rows, a missing truth-table entry lets every B2 gate be replaced bijectively by an affine gate plus one unused bit. The full sampled-column law is unchanged and #B2=2^s #Affine. Exact feasibility is polynomial: the requested normalized shape is in the GF(2) span of the initial shapes reachable from the output. A routed in-tree constructs a fitting suffix, including after a fully fixed gate prefix. Partial bit pinning inside a gate is not covered.

For q=3 color each nonconstant initial shape by one of the three nonzero GF(2)^2 vectors. On one common fair-site DAG let S be the set of colors reaching the output. For target color c, set w_c(S)=2 if S={c}, 1 if |S|>=2, 0 otherwise. Then Pr[specified label]=E[w_c(S)]/4. This is a scalar expectation identity, NOT a joint generative law for all colors.

The event w_c>0 is a path from color c OR simultaneous paths from the other two colors. An explicitly built layered NFA tracks one or two path tokens on the SAME s-bit site word, with O((s+1)(k+s)^2) states and polynomially many edges. It counts site words, not runs. Thus the published #NFA FPRAS [1] applies. Approximate uniform accepted words estimate the bounded weight in [1,2]; H=2^(3s-2)|E_c|*E[w|E_c]. This gives a relative FPRAS for all three-row fixed-topology type counts. One/two rows pad by duplicates; constant labels have probability >=1/8 and zero rows are trivial.

A further whole-gate prefix self-reduction, with sixteen charged count calls per slot and exact zero detection, gives polynomial-time almost-uniform compatible-type sampling. All accuracy/failure parameters, word lengths and product-state sizes are polynomially bounded. No low polynomial exponent, exact nonconstant sampler, growing-q guarantee or ordinary near-linear general-circuit consequence is claimed.

**Implementation boundary.** The full published #NFA approximation algorithm was NOT implemented or benchmarked. The approximation theorem above is a theoretical corollary using its authenticated statement. Our implementations construct the automaton, exact counts, feasibility witnesses and conditional finite bijections. Controlled rational perturbations validate the self-reduction error accounting, not the actual FPRAS runtime.

**Four-row counterexample.** One gate on all four binary pairs is uniform over sixteen B2 tables, whereas affine gates give only eight. AND has counts 1 versus 0; all <=3-row marginals still agree. This rules out that affine/marginal extension, not every conceivable four-row approximation algorithm.

## Exact executed evidence

TypeScript `code/u60_u61_audit.ts` checks 87,360 local gate encodings, 4,394 fixed-topology/example cases and 1,299,989 literal type assignments, with 44,358 label comparisons. These are declared small families, not all arbitrary topologies/initial columns at all row counts. All 196,624 conditional ranks in four named families are bijective and correct; 131,072 type assignments on two shared topologies also invert the affine mapping. Full-prefix tests give 34,952 exact feasibility checks.

The code constructs actual NFAs in 3,249 cases, compares all 12,966 declared site words with direct color propagation, and checks 6,492 colored-label counts. In 146 cases accepting runs overcount words; explicit examples have 3 words/4 runs and 4 words/14 runs. The rare-chain family has a one-word accepting language and the expected tiny target probability; the last cases use exact frontier arithmetic, not literal huge gate enumeration.

Width tests at w=1,2,4,8,12 include 4,096 reachable cut states and 12,283 memo states in the largest case. Their counts use weighted arithmetic. q=0, initial outputs, repeated contradictory rows, empty fibers and invalid ranks are checked.

Python `code/u60_u61_independent.py` constructs references before reading TypeScript output. It uses literal row evaluations (196,880 type assignments), backward color reachability and enumerated path masks (234 site/path checks). Ten exact-rational conditional-prefix examples satisfy the TV bound; maximum observed TV is 45028/78602245. All named output/color counts agree.

Wolfram 15.0.1 independently uses full-column-state weighted enumeration, modular matrix ranks and direct colored propagation. The first call returned an undefined-iterator-symbol warning; a scoped corrected call returned identical results without warnings. Its exact code and actual outputs are preserved. None of these independent implementations is independent expert or formal proof review.

## Reproduction and actual logs

Node v22.16.0; TypeScript 5.8.3; Python 3.13.5. No dependency installed. No Bun, Lean, package manifest or configured linter was available; strict/no-unused compilation is the applicable lint/type equivalent. No introduced compile or mathematical assertion failure occurred. Both final outputs repeated byte for byte; actual commands/results are in `research/validation/u60_u61_final_checks.log`.

```sh
tsc --noEmitOnError --strict --noUncheckedIndexedAccess --noUnusedLocals --noUnusedParameters --target ES2022 --module commonjs --outDir research/validation/build-u60-u61 code/u60_u61_audit.ts
node --check research/validation/build-u60-u61/u60_u61_audit.js
node research/validation/build-u60-u61/u60_u61_audit.js > research/validation/u60_u61_fresh.json
cmp research/validation/u60_u61_results.json research/validation/u60_u61_fresh.json
python -m py_compile code/u60_u61_independent.py
python code/u60_u61_independent.py
```

The Python reference reads `research/validation/u60_u61_results.json` only after constructing its own objects. Full main SHA-256: `f1e18816f7af1ce842d28573125823de093a1da5a7d4bb7be0de784f03416301`; independent SHA-256: `06d81da92887ea39430a3993d7fe71f42186769ae9cd327f87fb5877062fab20`. Do not overwrite verified files during reproduction; use a fresh path and compare.

## Sources and actual full target

[1] Arenas, Croquevielle, Jayaram, Riveros, *#NFA Admits an FPRAS*, JACM 68(6), article 48 (2021), DOI 10.1145/3477045. Author version https://arxiv.org/pdf/1906.09226 , v4 dated June 23, 2021. Theorem 6.2, the binary-alphabet/multiple-initial-state/unary-length model, and the word-versus-path distinction were read and rendered at printed p.19; Section 6 overview consulted. Only the counting theorem is used; approximate generation is separately derived. No claim of independent verification of the full 39-page proof.

Feng–Guo ICALP2024, https://drops.dagstuhl.de/storage/00lipics/lipics-vol297-icalp2024/LIPIcs.ICALP.2024.62/LIPIcs.ICALP.2024.62.pdf , p.62:3, explicitly relates DAG reliability to #NFA. It motivates but does not substitute for the new two-token construction.

OPS2021 https://theoryofcomputing.org/articles/v017a011/v017a011.pdf , Theorem 1.4 printed p.6, was read/rendered. One fixed epsilon and every sufficiently small beta, with distinct underlying n-input circuits and N=2^n-bit meta-input, remain necessary. A fixed-three-row approximation theorem does not prove its general-circuit lower-bound premise or settle uniform P versus NP. Current official Clay P-versus-NP and rules pages were checked; Unsolved, no prize-eligibility claim.

The new reductions are self-derived applications; searches did not authenticate global originality. The literature-dependent approximation result is distinct from the executed exact code.

## Next executable obligation

Test the missing four-row component rather than only adding more topology states. For four observed input pairs, a B2 gate has the affine coefficients plus an independent uv coefficient. Derive an exact evolution for the four-row parity component and its interaction with pair/triple data under shared ancestry. First use the single-gate B2/affine example to reject any insufficient summary. Then determine whether a nonnegative acceptance representation exists with a product/NFA size polynomial in explicit topology, or whether a proposed representation already requires exponentially many coordinates. Charge every bit and count accepted words rather than paths; no blanket hardness claim follows from one failed representation.

Do not silently generalize the scalar three-color expectation identity to a joint distribution, freeze partial gate bits when invoking the full-affine suffix theorem, or equate polynomial fixed-q algorithms with a growing-example solution. Retain the earlier distinction between fixed-wiring counts and sums over all wirings. No complete full-problem candidate exists, and nothing is running after the final response.

## Packaging and confirmed remote state

The package contains complete proofs, final code, main/independent outputs, actual logs, protocol, Wolfram record, preservation hashes and this checkpoint. The separate receipt records which files were remotely stored and the verified completion commit after successful writes; it is not guessed here. Existing history is preserved by additive tree construction and a non-forced fast-forward only.
