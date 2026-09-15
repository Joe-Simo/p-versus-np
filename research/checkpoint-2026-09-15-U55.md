# P versus NP — checkpoint after U54-U55

Date: 2026-09-15. **We have not solved P versus NP yet.** No complete candidate, formal-kernel verification or independent expert certification exists.

## Inspected scope and preservation

Assigned folder `/mnt/data/02-p-versus-np`, private repository `Joe-Simo/p-versus-np`, branch main. Starting head `3c00ccbbb9c786b8d0af51014c821bde98ecc5e8` and U53 checkpoint were read through the connected GitHub API. Privacy/push permission and the same head were rechecked before writes. Seven supplied packages were inspected; 97 distinct missing paths were restored without overwriting existing content. All 104 earlier archive entries across those 97 paths were compared byte for byte after the research and remain unchanged. No sibling project was scanned or changed.

The complete governing prompt was read; SHA-256 `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. Its exact heading, at most three short routine-update sentences, private preservation and zero additional spending remain binding. No publication, researcher contact, prize submission, visibility change or background task occurred. Prior Mathbox/Consensus failures were not unnecessarily retried and neither tool is claimed used. One successful exact Wolfram call used the existing allowance.

## Established this run

**U54.** On the random raw B2 suffix process, a polynomial multiplicity observable of degree j may require degree j+1 after a gate. Already on two examples, E[C_r | C_0=c] has degree exactly r+1 and leading coefficient r!/[2^r(k)_r^2], where C counts columns agreeing across the examples.

For every d>=1, parity-conditioned ensembles of d+1 legal copy prefixes have all joint multiplicity moments through degree d equal, but their expected target-zero d-gate suffix counts differ by (-1)^(d+1)(d+1)!d!2^(2d-1). At d=2 the means and full pair moments agree yet counts average 3,385,920 versus 3,386,016. This disproves universally exact fixed-order closure on arbitrary prefix distributions. These are explicit attainable-prefix ensembles, NOT claimed actual U49 uniform posterior histories or a general counting lower bound. A deterministic histogram still equals its own first-moment vector.

**U55.** For unrestricted uniformly weighted B2 gate types, pair every q-bit sample column with its complement. Let T be the 2^(q-1) pair totals. Exact target counts have form H_r(M,y)=G_r(k)m_y+B_r(T,[y]); a proved recurrence constructs B. Input complement permutations preserve all gate types; output complementation splits each pair rate equally. The target's old orientation multiplicity must be retained. This is an exact symmetry quotient, not moment truncation.

For q=2, T reduces to a scalar agreeing count c. A triangular O(r^2)-state count and exact raw-description unranker are implemented, including a closed three-group enumeration of physical gate triples without scanning all predecessor pairs. All integer costs are charged. The sampler remains polynomial for two examples and numerical/unary gate budget; the general q quotient can still have 2^Omega(s) explicit states by the U53 bootstrap/copy construction. No lower bound for all counters follows.

## Executed evidence

TypeScript `code/u54_u55_audit.ts`: 370,467 raw gate lists across n=1..3,s=0..2; 2,868 projected label-count comparisons; 4,180 additional target counts across every four-column histogram of k=1..6 and r=0..4. Moment tests cover all 1,286 relevant joint monomials at d=1..8 and replay all 1,020 copy-choice prefixes. All 208,163 ranks of the declared conditional fibers are distinct, correctly replayed and exactly equal to complete raw compatible sets. Contradictory repeated-row labels and empty ranks are rejected.

At r=128,k=5 the scalar DP has 8,385 states and counts of up to 1,997 bits. This is an exact weighted count, NOT enumeration of the underlying enormous description space. No sampling-frequency estimate is used; uniformity tests exhaust complete finite rank sets.

Python `code/u54_u55_independent.py` uses literal per-row gate evaluation and full forward histogram masses, with exact rational polynomials. It computes before reading TypeScript results, then compares. It independently verifies all parent-pair complement symmetries through q=5 (1,364 pairs) and moment gaps through d=5. Wolfram 15.0.1 reconstructs the d=2 suffix counts, first/pair moments, seven polynomial degree/leading-coefficient rows and 44 exact gate-rate cases. No warning/error/timeout occurred in that call. These are independent implementations, not external expert review.

## Reproduction and failed compilation record

Observed Node v22.16.0, TypeScript 5.8.3, Python 3.13.5. No dependency installed; no Bun or proof assistant in the available environment. Strict/no-unused TypeScript checking is the repository-equivalent lint/type check. The initial revision used numerical zero to initialize five bigint arrays; the compiler rejected it before execution. It was fixed to 0n. The original revision and actual error log remain packaged, and no failed revision is counted as evidence.

```sh
tsc --noEmitOnError --strict --noUncheckedIndexedAccess --noUnusedLocals --noUnusedParameters --target ES2022 --module commonjs --outDir research/validation/build-u54-u55 code/u54_u55_audit.ts
node --check research/validation/build-u54-u55/u54_u55_audit.js
node research/validation/build-u54-u55/u54_u55_audit.js > research/validation/u54_u55_fresh.json
cmp research/validation/u54_u55_final_results.json research/validation/u54_u55_fresh.json
python -m py_compile code/u54_u55_independent.py
python code/u54_u55_independent.py
```

Both final outputs reproduced byte for byte. U52-U53 source was rebuilt separately and its complete output also matched its preserved result. The new full TypeScript result hash is `172a7a45227e851531fdd8a0103b57ffe1d6e4f642c611e6bc2a2b9e7a9cf4bc`. Python reads that result only for final comparison. The package contains all necessary inputs; preserve old files when restoring it.

## Sources and full-target distinction

Current Clay page https://www.claymath.org/millennium/p-vs-np/ lists Unsolved. The rules page https://www.claymath.org/millennium-problems/rules/ was rechecked: qualifying publication, at least two years, general acceptance and no direct submissions. No claim of eligibility or award is made.

OPS2021 https://theoryofcomputing.org/articles/v017a011/v017a011.pdf , Theorem 1.4 (printed p.6) and footnote 13 (p.21), were read in parsed text and screenshots. The target retains one fixed epsilon for every sufficiently small positive beta, ordinary circuits, and the distinct n-input versus N=2^n-bit meta-input levels. No premise of this magnification theorem has been proved.

Adjacent moment-closure and lumpability sources were read only at abstract level: Wuyts-Sieber arXiv:2111.07643; Banisch-Lima DOI 10.1142/S0219525915500113. No detailed theorem is used as a proof dependency; no global novelty is asserted. The new mathematical arguments are self-derived and self-audited.

## Next executable obligation

Try backward dependency-cone summation rather than another forward histogram size increase. Fix the raw s-gate index slots and output pointer. Reveal the ancestor gate set closed under predecessors; derive the exact weight of all unused gate slots, which can still choose arbitrary preceding indices/types. Prove that the resulting sum counts each raw description once, preserving shared subgraphs and target labels. Check against the saved small full-description distributions and sample-counts.

Then investigate whether this weighted live-DAG sum has a representation with a useful complexity bound. Do not silently replace sharing with independent branches, charge it as a formula, assume the target-conditioned ancestry distribution matches the unconditioned prior, or infer all-sampler hardness from failed rejection/moments. Keep the full growing-example consistency cost explicit and retain the prior retired false bridges. No process is running after this checkpoint.

## Packaging and remote distinction

The conversation package contains full proofs, final sources, full outputs, independent evidence, failed initial compile revision, actual logs, protocol, hashes and this checkpoint. Remote preservation covers proofs, final executable sources, summary, independent calculation record, successful checks and checkpoint; full per-case results are packaged unless an actual remote receipt says otherwise. The final commit is recorded only in the preservation receipt after confirmed writes, not guessed here.
