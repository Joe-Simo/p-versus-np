# P versus NP — checkpoint after U52-U53

Date: 2026-09-15. **We have not solved P versus NP yet.** No complete candidate, formal-kernel certificate or independent expert verification exists.

## Scope and starting evidence

Assigned folder `/mnt/data/02-p-versus-np`; dedicated private repository `Joe-Simo/p-versus-np`, branch main. The connected GitHub API confirmed starting head `ec2d508f27d51d2bf21a054f7e357d81335ee2a0` and supplied the full U51 checkpoint. Its next mathematical obligation was executed, not replaced by another tiny gate-budget exercise.

Six supplied archives were inspected. Eighty-three missing files were restored; duplicate members matched, and no existing content was overwritten. Final byte comparisons checked all 88 archive entries across 83 distinct paths unchanged. No sibling project was inspected or modified. The governing `RESEARCH_PROMPT.txt` was read in full; SHA-256 `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127` remains correct. Routine user updates require its exact heading and at most three short sentences.

There was no additional spending, publication, researcher contact, visibility change or background task. Mathbox/Consensus were not used or claimed; earlier discovery/quota failures were not retried unnecessarily. The existing Wolfram allowance was used once for a focused exact calculation. GitHub privacy and permission are checked again before preservation writes; the completion receipt, not this text, records the confirmed final commit.

## Established mathematical results

**U52: positive exact counter and sampler.** For q fixed example rows, a prefix's sample-value column histogram M and remaining budget r determine all raw suffix multiplicities. H_0(M,y)=m_y and H_r(M,y)=sum_(a,b,g) m_a*m_b*H_(r-1)(M+e_g(a,b),y). Predecessor repetition, fan-out, semantically duplicate gates, dead gates and all output indices are retained. Dropping column multiplicity is demonstrably false (same column support and terminal multiplicity, next-suffix counts 484 versus 464).

A constructive weighted DP visits at most binom(r+2^q,2^q) states, with O(r log(n+r+2)) bits per count. This gives polynomial bit complexity for each fixed q, not an exponent uniform in q or a bound polynomial in log r alone. Exact rank/unrank supplies uniform raw-description sampling without blind rejection from a rare original-prior fiber. Empty counts are distinguished exactly; fair-bit numerical-interval rejection accepts with probability at least one half. All count costs are included.

**U53: state growth with a counterexample to overinterpreting it.** At q=floor(log_2(s/2)), n>=q, unit-vector examples give q unit columns. B=2^q-q-2 OR gates make every column available. D=2^q copy gates yield binom(2D-1,D-1) distinct nonempty-count states, and common padding reaches budget s. This is 2^Omega(s), still exponential after quotienting by sample-row permutations. It is a lower bound on explicit histogram enumeration, not all exact counters, nor proof those examples form an actual U49 shrink history.

For copy-only suffixes, the exponential sum collapses exactly: Hcopy_r=(k)_r^2*(k+r)*m_y/k. A direct conditional sampler chooses first index i with weight m_y+[column_i=y], second index uniformly, then the final matching output uniformly. It is exact, expected polynomial-time and does not construct the histogram DP or use a generic counting oracle. The proof and finite tests therefore explicitly refute the inference that many reachable states always require many arithmetic operations.

An old histogram need not refine to one new histogram when another example is appended: AND and OR prefixes coincide on 00 but give distinct columns after adding 10. A representative-based deterministic refinement is invalid. Rebuilding, richer states or a weighted splitting calculation remain possible; no general impossibility is inferred.

## Executed coverage

TypeScript: `code/u52_u53_audit.ts`.
- All 6,561 three-variable partial labelings at two gates agree with raw enumeration.
- Complete output distributions at (n,s)=(2,1),(3,2),(3,3): 16,152,232 functions, counting 1,280; 1,612,800; and 1,445,068,800 descriptions. The last total is obtained from raw two-gate prefixes with exact last-gate summation, not individual execution of 1.4 billion full descriptions.
- All 49,562 ranks for parity fibers of sizes 2,24,49,536 map bijectively to the complete raw compatible sets.
- 104 q=0/1 boundary cases, repeated contradictory labels, empty sampler input and numerical interval rejection checked.
- Constructive copy-histogram cases have 3,35,6435 states. Weighted counts, not explicit enumeration of 67 quadrillion gate lists, give the last case's total.
- All 3,865 output-tagged leaves of six small conditional copy samplers have exactly the predicted common probability.

Python: `code/u52_u53_independent.py` uses per-example tuples, all 230,400 literal two-gate prefixes and their final-gate single/pair moments. It computes independently before reading TypeScript results, then compares all distributions and partial counts. It also matches U51's preserved complete two-gate distribution. Independent weak-composition sums verify copy counts; exact Fractions verify the conditional sampler. Both implementations check the refinement counterexample.

Wolfram 15.0.1 directly enumerates a 614,400-description two-example/two-gate distribution, the multiplicity example, three multinomial copy sums and 121 state-bound inequalities. One successful call; no timeout, warning or failed mathematical result. Its complete source/output are preserved. These are independent implementations, not external expert or formal verification.

## Reproduction

Observed Node v22.16.0, TypeScript 5.8.3, Python 3.13.5. No dependency installed. No Bun, Lean, package manifest or configured linter in the available project environment; strict/no-unused compilation is the repository-equivalent lint/type check. Final executed commands and successful byte-identical reruns are in `research/validation/u52_u53_final_checks.log`.

```sh
tsc --noEmitOnError --strict --noUncheckedIndexedAccess --noUnusedLocals --noUnusedParameters --target ES2022 --module commonjs --outDir research/validation/build-u52-u53 code/u52_u53_audit.ts
node --check research/validation/build-u52-u53/u52_u53_audit.js
node research/validation/build-u52-u53/u52_u53_audit.js > research/validation/u52_u53_fresh.json
cmp research/validation/u52_u53_results.json research/validation/u52_u53_fresh.json
python -m py_compile code/u52_u53_independent.py
python code/u52_u53_independent.py
```

The Python script expects the executed TypeScript result and preserved U51 result, only for final comparisons. To restore those inputs, extract the supplied packages without overwriting a conflicting file. Full final TypeScript result SHA-256: `4f9f0a6304a22944c8a64b71ccd2ee3dc734e61cd85489b3467d76fe0ac82585`. No introduced compile/assertion failure remains. The q=1 bootstrap boundary was corrected during review before running that test; there was no failed run being represented as a pass.

## Sources and full-target distinction

Current official Clay page https://www.claymath.org/millennium/p-vs-np/ continues to label the problem unsolved. The rules page https://www.claymath.org/millennium-problems/rules/ was rechecked: no direct submissions and qualifying publication, at least two years and general acceptance before consideration. No prize-eligibility or payment claim is made.

OPS2021 https://theoryofcomputing.org/articles/v017a011/v017a011.pdf Theorem 1.4 (printed p.6) and description-counting/constant-shrink text with footnote 13 (p.21) were reread and rendered. The full target still needs one fixed epsilon for every sufficiently small beta in the stated **ordinary general-circuit** regime. Neither the new fixed-q upper bound nor the exponential size of its explicit DP supplies that lower bound.

Nearby literature: Feser-Dillig-Solar-Lezama, *Metric Program Synthesis*, arXiv:2206.06164, abstract only. Observational equivalence is established synthesis background. No theorem from that work is imported into the proofs and no global novelty claim follows from the focused searches. The counter, exact sampler and copy identities were derived and proved explicitly in U52-U53.

## Next executable obligation

Investigate a closure representation rather than another larger histogram run. For the uniform raw-suffix process, the next-column rates are quadratic in current multiplicities. Derive the induced evolution of low-order moments, remembering that a gate can repeat a predecessor and that the terminal output count is a first moment. Test whether proposed first/pair-moment compression remains closed under one more unrestricted B2 gate; construct exact equal-moment/different-completion examples if it does not. The copy-only identities give a positive control where closure really occurs. Any claim for general descriptions must retain their multiplicities and charge closure construction/evaluation; no uncharged count or terminal-label oracle is allowed.

The continuing full-problem objective has no complete candidate. Preserve the old corrections and retired false bridges. No process continues after the response; the next continuation must perform another actual computation or proof step.

## Preservation

The new conversation package contains full final results and independent outputs, proofs, all new sources, protocol, logs, hashes and checkpoint. Private remote additions contain proofs, sources, result summary, independent calculation record, execution log and checkpoint; large complete per-sample JSON is packaged rather than claimed remotely uploaded. The separate preservation receipt records confirmed writes and final parentage only after success.
