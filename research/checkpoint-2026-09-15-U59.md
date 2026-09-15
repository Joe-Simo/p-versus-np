# P versus NP — checkpoint after U58-U59

Date: 2026-09-15. **We have not solved P versus NP yet.** No complete candidate, formal-kernel verification or independent expert certification exists.

## Scope and continuity

Assigned folder `/mnt/data/02-p-versus-np`; dedicated private repository `Joe-Simo/p-versus-np`, main. Starting head `abf2e7ed52bc5f93563b326b19b0b7c066ad7d8e` and the complete U57 checkpoint were read through GitHub. Nine supplied packages were inspected and 130 missing paths restored without overwriting existing content. A final byte comparison checked all 142 archive entries across 130 distinct paths and all 12 initially present files unchanged. No sibling project was inspected or changed.

The governing prompt was read in full; SHA-256 `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. Its exact heading, at most three short routine-update sentences, private preservation and no additional spending remain binding. No publication, researcher contact, prize submission, visibility change or background automation occurred. Mathbox/Consensus were not claimed as used; their earlier availability/quota limitations were not needlessly retried. Wolfram used the existing allowance once successfully. The preservation receipt records the actual final commit after verification, not a guess in this file.

## Established results

**U58: exact fixed-topology law.** For two rows and independent uniform B2 types, disagreement obeys B_j=xi_j*(B_a OR B_b), with independent fair xi_j, even when predecessors repeat or share ancestors. A reversible four-bit-per-gate encoding proves the joint law and output orientation independence. If h of the 2^s site masks reach a designated gate output, unlike-label counts are 2^(3s-1)*h and like-label counts are 2^(3s-1)*(2^s-h). Initial-signal outputs are separate. An exact conditioned site sampler gives an exact conditioned type sampler; approximation in total variation also transfers.

The unrestricted sum over topologies again has scalar agreeing-column transition weights 8(K^2+C^2) and 8(K^2-C^2), recovering U55. Fixed topology is a different counting problem. A shared diamond gives 3/16, not the 7/32 obtained by incorrectly independent parent probabilities.

**U59: exact classification.** Counting type assignments on a fixed binary-indegree DAG consistent with two rows is #P-complete under polynomial-time Turing reductions, already for initial constants plus one input x and rows x=0,1. The self-contained reduction starts with bipartite independent sets, treats OR connectors as probability p, replaces each with an ell-site fair chain for p=2^(-ell), and interpolates at p=1. Auxiliary reductions expose the #3SAT -> independent-set coefficient -> bipartite-independent-set chain. This is exact interpolation, NOT an approximation-preserving reduction or an unconditional lower bound against all algorithms.

**U59: positive approximation escape.** By the published Feng-Guo ICALP2024 Theorem 1, DAG two-terminal reliability admits polynomial randomized relative approximation. Site splitting preserves the theorem's domain, including pinned probabilities 0,1/2,1. Thus fixed-topology two-row unlike-label counts have such an approximation; a charged prefix self-reduction gives approximate uniform conditional type sampling. Like-label probability is at least 1/4, so elementary sampling gives relative estimates and blind rejection gives an exact uniform type sampler with at most four expected proposals. These are restricted positive results and do not address the many-label terminal histories of U57.

**Implementation limit.** The full published FPRAS was NOT implemented or benchmarked. Its polynomial-time claim is explicitly a literature-based corollary. Our actual code implements and checks exact finite type/site correspondences, exact frontier counts, exact interpolation reductions and conditional bijections; an independent rational experiment tests the prefix error bound with controlled perturbations, not with outputs from that FPRAS. No uncharged oracle or observed low frontier width is presented as a general algorithm.

## Executed evidence

TypeScript `code/u58_u59_audit.ts`: 256 local reversible gate maps; 8,125 fixed topology cases; 31,933,795 literal gate-type assignments; 191,024 output-label comparisons; all 8,464 declared conditional ranks bijectively match complete compatible type sets. Initial-output, disconnected, repeated-predecessor and shared-diamond cases are included. Topology-averaged totals match a separate scalar recurrence.

The exact reduction tests cover all 157 bipartite graphs in the declared dimensions and 664 expanded-topology count calls. Of these, 284 networks with at most twelve sites were also checked by full site enumeration. The largest expanded graph has 47 sites, evaluated by exact frontier DP; the largest observed frontier had fifteen states, not a general-width claim. Separate interpolation tests cover all 76 simple graphs through four vertices and ten explicitly listed CNF cases. No enormous truth table or hard random instance is claimed constructed.

Python `code/u58_u59_independent.py` uses literal per-row gate evaluation, graph reachability search, and original-network Bernstein polynomials, instead of the main frontier counter. It independently constructs 196 topology cases/120,016 type assignments and 58,938 marked-network site cases, then compares all 664 rational reliability values. It checks six exact-rational perturbed conditional distributions against the proved error bound. It reads the main output only after its independent calculations.

Wolfram 15.0.1 independently checks chains, a disconnected output and the shared diamond by literal types, and reconstructs K_(2,2)'s reliability polynomial 3p^3/4-3p^4/16 and all five interpolation values, recovering seven independent sets. One successful call with no warning, error or timeout; the later three-row follow-up was not included in that call. Independent implementations are not independent expert or formal proof review.

## A further executed joint-label test

On three rows, global output complementation gives Pr[001]=(R_02+R_12-R_01)/4. A specific chain-plus-gate family has R_01=R_02=1/2, R_12=2^(-h-1), and target probability 2^(-h-3). Literal type enumeration for h=0..3 covered 69,904 assignments and confirmed every equality. Independently estimating the three pair quantities can lose a relative guarantee through cancellation. This family has exploitable exact symmetry, so it is NOT a hardness theorem for three-row approximation.

## Reproduction and failed compilation record

Observed Node v22.16.0, TypeScript 5.8.3, Python 3.13.5. No package installed; Bun and Lean are absent and there is no configured project linter. Strict/no-unused TypeScript compilation is the repository-equivalent lint/type check. Initial compilation rejected an unchecked increment before execution; it was changed to a checked-index read/write. The actual error log is retained, and no failed revision is counted as evidence.

```sh
tsc --noEmitOnError --strict --noUncheckedIndexedAccess --noUnusedLocals --noUnusedParameters --target ES2022 --module commonjs --outDir research/validation/build-u58-u59 code/u58_u59_audit.ts
node --check research/validation/build-u58-u59/u58_u59_audit.js
node research/validation/build-u58-u59/u58_u59_audit.js > research/validation/u58_u59_fresh.json
cmp research/validation/u58_u59_final_results.json research/validation/u58_u59_fresh.json
python -m py_compile code/u58_u59_independent.py
python code/u58_u59_independent.py
```

Final outputs were reproduced byte for byte and the final checks rerun after review. Full main-result SHA-256: `12de64736372742b00bd4d97dced394fe21f6b3dd2f7239974161c8de8d56daa`. Independent-result SHA-256: `f380c2b62f960c31781313485ee1ee9269d8dafb71f8d7edca11fe723135b477`. Python expects the executed main result only for its concluding comparisons. Use a fresh output path on reproduction.

## Sources and the full target

Feng-Guo, ICALP2024, DOI 10.4230/LIPIcs.ICALP.2024.62: Theorem 1, probability domain and contrasts with unreliability read in text and screenshots on printed pp.62:2-62:3; overview p.62:4 and full-version node splitting consulted. No full independent verification of its proof is claimed. Provan-Ball (1983), DOI 10.1137/0212053: publisher abstract only; the exact reductions we need are separately supplied. A 2026 general-reliability preprint arXiv:2608.02523v1 surfaced and its abstract/statement was inspected, but it is not a dependency or substituted for the published DAG theorem. No novelty is asserted.

The official Clay P-versus-NP and rules pages were checked; the problem remains listed unsolved. The OPS2021 target retained from U42 needs an ordinary general-circuit N^(1+epsilon) lower bound, with one fixed epsilon for every sufficiently small beta. Exact #P classification, a published approximation scheme and fixed-example identities do not prove that premise or settle uniform P versus NP.

## Next executable obligation

Continue with a direct joint-label representation for three or more example rows, not another larger forward histogram. For one gate, partition the rows by their two predecessor values; a uniform type assigns one independent fair bit to each of at most four blocks. Derive the induced partition/output-pattern process with shared ancestry retained, and test whether it admits a positive-weight event representation avoiding the cancellation exhibited above. Charge the size of any product graph or nondeterministic automaton before invoking reliability/NFA approximation. A polynomial construction for fixed row count is not automatically uniform in a growing row count, and approximating each pair separately is not sufficient.

The current exact correspondence and finite code are positive evidence for this narrower step, not grounds for predicting a solution. Retain the earlier retired false bridges and distinction between fixed-topology counts and the unrestricted sum. Nothing runs after the final response.

## Preservation distinction

The conversation package contains complete proofs, source, full main/independent results, protocol, logs, hashes and checkpoint. Remote additions are the proofs, full executable sources, result summary, independent calculation record, execution log and checkpoint; the full per-query JSON is packaged rather than claimed remotely committed unless a later receipt confirms it. Confirmed remote commit and parentage belong in the separate receipt after successful writes.
