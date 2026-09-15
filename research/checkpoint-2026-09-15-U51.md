# P versus NP — checkpoint after U50-U51

Date: 2026-09-15. **We have not solved P versus NP yet.** No complete candidate, independent expert verification or formal-kernel certificate exists.

## Inspected scope and preservation

Workspace `/mnt/data/02-p-versus-np`; private repository `Joe-Simo/p-versus-np`, main. Starting remote head `abb2875b9f1379462eee8622a62880666a80d592` and the full U49 checkpoint were read through GitHub. Five supplied archives were inspected and 69 missing files restored without overwriting existing content; there were no conflicts. All 73 earlier archive members were compared byte for byte after the new runs and remain unchanged. No sibling project was inspected or modified.

The governing prompt was read in full. SHA-256 `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. Exact heading and at most three short routine-update sentences remain binding. No spending, external publication/contact, visibility change or background automation occurred. Prior Mathbox/Consensus availability/quota limits were not pointlessly retried; neither tool is claimed used. Wolfram used the existing authorized allowance.

## Established this run

**U50, actual promised-history obstruction.** Any correctly labeled t-point set with t>=2 interpolates in <=2t-3 B2 gates (one point needs only a constant), so r=floor((s+3)/2) samples cannot yet empty the size-s version space. Along the proved U49 15/16-shrink histories for F harder than 10ns, that still-nonempty space has original-prior mass <=(15/16)^r. Blind rejection from the original uniform raw descriptions therefore needs at least (16/15)^r expected proposals for its next conditional sample. At s=floor(N^beta/(10n)), this is 2^Omega(N^beta/n), superpolynomial in N. This refutes one specified implementation, not all samplers or any general circuit family.

U50 also distinguishes zero detection from failed finite sampling, derives a general fixed-proposal rarity fact and gives a charged prefix-count-to-sampling reduction. Good relative count estimates at accuracy O(epsilon/ell) suffice for epsilon total-variation error with O(ell) calls, but the same conditional counting predicate remains an assumed subroutine. No NP-hardness of circuit consistency or deterministic SAT algorithm is inferred.

**U51, growing-arity topology.** At exactly n-1 B2 gates, every n-parity circuit is a read-once XOR/XNOR tree. There are 2^(n-2)*n!*(n-1)! raw descriptions. Allowing one whole gate triple or the output pointer to change while remaining correct leaves exactly n!*(n-1)!/2 components, each containing only the 2^(n-1) input orientations of fixed gate types/topology. From one component no such chain mixes to the full uniform distribution.

**U51, positive sampler.** Uniformly choose successive ordered pairs of active signals and all but the last XOR/XNOR signs; force the last sign to correct parity. This samples the entire compatible-description set exactly uniformly in expected O(n^2 log n) bit operations. Thus the failed local chain does NOT imply that even this conditional sampling problem is hard. These parity instances are easy, minimal-budget instances; they are not the source's growing-gap NO family.

## Exact finite evidence

TypeScript: all 230,400 two-gate lists/1,612,800 raw output-tagged descriptions on n=3 were enumerated; the complete 152-function multiplicity distribution equals U49's. All 6,561 partial labelings, 129 at-most-two-point patterns, 31,245 geometric inequalities, and 256 exact-count traces were checked.

General conditional circuit synthesis (all prefixes plus exact last-gate fiber fitting and every earlier-output case) replayed 50,138 compatible descriptions. Rows (n,s)=(2,1),(3,2),(4,3),(3,3) have counts 2,24,576,49,536 and one-block component counts 1,6,72,1. The two-block graph is connected in all four checked cases. A spare gate repairs connectivity at n=3, but no rapid-mixing or unbounded repair theorem is claimed.

The direct sampler's entire choice map was enumerated through n=5: 2,24,576,23,040 outputs, no duplicates, all correct, equal branch denominators. Through n=4 the result equals complete general conditional synthesis; n=5 is structural generation/replay only.

Python independently evaluates each input of the raw two-gate enumerator and computes component graphs by pairwise differences, rather than signature hashing. All multiplicities, n=3 and n=4 minimal component histograms, and 256 reconstructed trace masses/telescoping costs agree. Prefix sampling on all explicit subsets of strings of widths 1..3 gave 828 exact-rational cases, nine empty-root returns and maximum observed TV error 1/128. These explicit-set counters are not efficient generic circuit counters.

Wolfram 15.0.1 independently generated/pairwise-checked the minimal parity sets through n=4 and verified rounding s=1..1000, 105 geometric bounds and 16^11>2*15^11. No error/timeout occurred in that evaluator call. These are independent implementations, not independent expert review or proofs by extrapolation.

## Reproduction and environment

Node v22.16.0, TypeScript 5.8.3, Python 3.13.5. No dependencies installed. Bun, Lean, a project package manifest and configured linter are absent in the inspected environment; strict/no-unused TypeScript checks are the applicable lint/type equivalent. Final code uses exact bigint counts and unsigned finite truth vectors through 32 bits. No assertion relies on unit-cost unbounded arithmetic.

```sh
tsc --noEmitOnError --strict --noUncheckedIndexedAccess --noUnusedLocals --noUnusedParameters --target ES2022 --module commonjs --outDir research/validation/build-u50-u51 code/u50_u51_audit.ts
node --check research/validation/build-u50-u51/u50_u51_audit.js
node research/validation/build-u50-u51/u50_u51_audit.js > research/validation/u50_u51_new_results.json
cmp research/validation/u50_u51_final_results.json research/validation/u50_u51_new_results.json
python -m py_compile code/u50_u51_independent.py
python code/u50_u51_independent.py
```

Python reads the preserved final TypeScript file only after its own constructions for comparison. Final TypeScript and Python outputs reproduced byte for byte; U49's complete output was rebuilt separately and also byte-identical. Actual commands/results are in `research/validation/u50_u51_final_checks.log`. Final full TypeScript JSON SHA-256: `3ab70d91555f6298696bba2f49086692220cac789b4fbaf61c3c61d425d636af`.

## Primary sources and novelty

The Clay page https://www.claymath.org/millennium/p-vs-np/ still lists the problem as unsolved. Its rules page was rechecked: no direct submissions; qualifying publication, at least two years and general community acceptance precede consideration. No award/prize-eligibility claim is made.

OPS2021 https://theoryofcomputing.org/articles/v017a011/v017a011.pdf , Theorem 1.4 (printed p.6) and footnote 13 (printed p.21), were inspected in text and screenshots. The fixed-epsilon/every-sufficiently-small-beta ordinary-circuit contract remains unchanged. Jerrum-Valiant-Vazirani (1986) publisher abstract was read, not its complete proof. Delannoy-Meel (2022) author copy https://www.cs.toronto.edu/~meel/Papers/lics22.pdf abstract/introduction explicitly retain a SAT oracle; those pages were read/rendered. No unchecked detailed theorem is used as a proof dependency.

No novelty claim is made. The new proofs combine elementary interpolation, probability, input-dependence and tree counting; adjacent searches did not authenticate originality. No formal or external expert verification has been obtained.

## Next executable obligation

Do not merely test another gate budget or claim all sampling is blocked. Test a specific label-aware quotient for the generic conditional counter: does the number of completions depend only on the multiset of currently available sample-value columns, their multiplicities, and the remaining gate budget?

Proposed exact recurrence to audit: for a multiset M of q-bit signal columns and r remaining gates, terminal count is the multiplicity in M of the desired q-bit label column (each matching signal is a different allowed output index). A transition chooses two columns a,b and one binary gate g, adds column g(a,b), and is weighted by multiplicity(a)*multiplicity(b), because repeated predecessor indices are allowed. Sum the completion counts over these transitions. This could preserve syntax multiplicities while merging equivalent partial states. It is not yet claimed cheap: bound state count and bit cost explicitly, test against the full n=3,s=2 raw distribution and n=3,s=3 parity count, and derive a sampler only after the suffix-count identity is verified.

If the recurrence is exact but still expensive, record precisely that result rather than treating profile count as an unrestricted circuit lower bound. Retain U40's free-terminal-label warning, U43-U45's false linear/degree bridges, U48's access limitation and U50's rejection failure. The full P-versus-NP target has no complete candidate.

## Packaging and remote receipts

The conversation package includes proofs, all final executable sources, full raw trace output, independent output, actual logs, manifests, source context and this checkpoint. Remote preservation should distinguish proofs/sources/summaries from the large raw trace JSON unless a successful write confirms the latter. A completion commit is placed in the separate preservation receipt only after confirmed writes, never guessed. No process continues after the final reply.
