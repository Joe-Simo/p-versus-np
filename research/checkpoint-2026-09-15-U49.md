# P versus NP — checkpoint after U48-U49

Date: 2026-09-15. **We have not solved P versus NP yet.** No complete candidate, formal-kernel verification or independent expert certification exists.

## Scope and inspected starting state

Assigned workspace `/mnt/data/02-p-versus-np`, dedicated private repository `Joe-Simo/p-versus-np`, branch `main`. Starting main was `f3769d77c1aa6eb39d551b3ff7c6132886957dbc`, read through GitHub together with the full U47 checkpoint. The four supplied packages were listed; 52 missing members were restored without overwriting existing members or encountering a content conflict. A final byte comparison checks all 55 earlier archive members unchanged. No sibling project was inspected or modified.

The complete `RESEARCH_PROMPT.txt` was read; SHA-256 `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. Its exact status heading, at-most-three-short-sentence routine update, no additional spending, and private preservation remain binding. No publication, prize submission, researcher contact, or background automation was performed. Mathbox/Consensus were not used or claimed; previously observed availability/quota limits were not repeatedly retried. Wolfram used the existing allowance.

## Established this run: a growing-budget test

**U48.** For fixed 0<beta<1/10, N=2^n, high budget S=floor(N^beta), lower budget s=floor(S/(10n)), output length at most t=ceil(N^(10beta)), any total randomized truth-table-query extractor that produces an anti-checker for every circuit-harder-than-S table with success >=2/3 needs Omega(N/n^2) worst-case queries. It may adapt queries, do arbitrary free computation between them, and output unqueried guesses; target-dependent advice is not permitted. This is a query lower bound for certificate extraction, NOT the N^(1+epsilon) general-circuit premise needed for P versus NP.

Proof structure: count weight-w tables versus all w-gate descriptions to obtain a sparse hard family; any refuting list must contain h=floor((s+1)/n)+1 positive labels, because fewer labels can be memorized with small minterm circuits; any K distinct adaptive queries on an initially uniform weight-w support see a hypergeometric number of positives; only afterward condition on hardness. Append up to t extra queries to cover unqueried output guesses. Rounding w to the next power of two above S handles all sufficiently large lengths for every real fixed beta, not just a dyadic subsequence.

**U49.** Reconstruct the established constant-shrink anti-checker method with all gates charged. If F requires >10ns gates (n>=4,s>=8), every nonempty multiset of size-s circuits has an input misclassified by more than 1/16 of its mass. Otherwise O(n) independent samples have a majority equal to F everywhere, using at most 10ns gates. An explicit adder-tree majority circuit uses <=32L B2 gates; all assignments through odd L=19 were checked.

The resulting exact-count construction needs O(s log(n+s)) selected examples. Relative estimates within 1/128 suffice for a <31/32 survivor fraction under the promise. A straightforward implementation still enumerates D descriptions, where D>=16^s and D=2^(O(s log(n+s))); its computation is superpolynomial in N at growing budgets. This shows why a short certificate or nearly linear query complexity does not supply a cheap consistency counter. The constant-shrink idea is explicitly in OPS2021 footnote 13 and earlier anti-checker/learning literature; no novelty or improved separation theorem is claimed.

## Executed evidence, not asymptotic extrapolation

TypeScript actual gate/description/combinatorial code: `code/u48_u49_audit.ts`.

- Raw three-input/two-gate enumeration: 230,400 ordered gate lists, 1,612,800 descriptions including output choices, 152 functions, multiplicities retained.
- Adaptive support experiment: 180,740 support/policy runs, 800 complete hypergeometric histogram assertions, 3,744 hard-only finite runs; 220 exact binomial inequalities and six large parameter certificates.
- Sparse interpolation: all 6,561 three-variable partial labelings, including 1,280 covered by the finite budget.
- Actual majority DAGs: 699,050 input assignments (all assignments to odd input counts 1..19). Larger L=33,65,129,257,513 constructions check topology/gates only.
- Three version-space policies on every three-input target: 768 traces, 312 valid refutations, maximum eight examples, 1,785,296 weighted agreement comparisons. No minimum-cardinality claim.

Independent Python reconstructs all 1,193 distinct-read trees on four coordinates (19,088 tree/input pairs), builds circuit truth vectors per assignment, counts descriptions, and reconstructs survivors from accumulated constraints. Only after construction does it read the TypeScript output. Every multiplicity and all 768 traces match. Parameter ratios also match.

Wolfram 15.0.1 independently checked 106 adaptive histograms, all six parameter rows, 125 analytic majority-tail/size cases through n=128, and the rational approximate-selection inequality. Its exact code and returned expression are preserved. No enormous hard table is constructed: the n=1024 numerical example represents exponent/rational inequalities, not an exhaustive experiment. Small n=3,s=2 elimination tests do not satisfy the high-budget lemma's premise and are labeled component checks.

## Failed assertion and its correction

The first TypeScript revision had inferred-array type errors and a false assertion that multiplicatively perturbed selection strictly progresses on every tiny target. A finite member-target state with mass 2320 and optimum survivors 2312 can stall. Final code records an exact-count fallback on zero progress and proves/checks it never occurs when the certified 15/16 progress condition holds. There were 18 fallback targets, all members. This fallback is already paid for by finite enumeration and is not presented as an efficient growing-budget operation. The initial source and failure record remain in the package and are not passing evidence.

## Reproduction and environment

Node v22.16.0, TypeScript 5.8.3, Python 3.13.5. No dependency installed. No Bun, proof assistant, package manifest or configured linter was present; strict/no-unused compiler checks are the repository-equivalent lint/type checks. Final commands and byte-identical successful reruns are captured in `research/validation/u48_u49_final_checks.log`.

```sh
tsc --noEmitOnError --strict --noUncheckedIndexedAccess --noUnusedLocals --noUnusedParameters --target ES2022 --module commonjs --outDir research/validation/build-u48-u49 code/u48_u49_audit.ts
node --check research/validation/build-u48-u49/u48_u49_audit.js
node research/validation/build-u48-u49/u48_u49_audit.js > research/validation/u48_u49_results.json
python -m py_compile code/u48_u49_independent.py
python code/u48_u49_independent.py
```

For reproduction in an existing workspace, write fresh output to a new path and compare before replacing anything. The Python script expects the previously executed TypeScript result at the indicated location only for its final comparison. Full successful result SHA-256: `5b123cc5154f1385f38b41ba5cfbeec34e2b5a495fe9780715d89bdf68fb8d57`.

## Sources, dependencies and what remains open

Checked current Clay status at https://www.claymath.org/millennium/p-vs-np/ : unsolved. Checked OPS2021, https://theoryofcomputing.org/articles/v017a011/v017a011.pdf , Theorem 1.4, Lemma 4.1, Corollary 4.3, Lemma 4.7 and footnote 13 in text and relevant page screenshots (printed pp.6,17,19,21). Read the earlier Lipton-Young anti-checker discussion in Section 5 of https://arxiv.org/pdf/cs/0205035 ; its description-length convention is not transplanted into our gate constants. Chen et al., https://arxiv.org/pdf/1911.08297 , Corollary 61, was checked to avoid confusing its different anti-checker hypothesis with our query argument. No complete independent verification of these external papers is claimed.

Do not reopen the free-terminal-label branching-program target or advance a tiny gate budget as the next main task. The correct full target remains ordinary general-circuit magnification with one fixed epsilon for every sufficiently small beta. U48's near-linear-query lower bound cannot satisfy it. No polynomial SAT algorithm or general circuit lower bound has been established.

## Next executable obligation

Test a genuinely cheap way to approximate survivor counts or to sample uniformly from the consistent size-s descriptions. First audit rejection sampling on rare survivor sets: derive the acceptance-probability/sample-cost tradeoff with rigorous multiplicity accounting, and see whether any proposed conditional sampler uses the same consistency oracle it claims to avoid. A zero-detecting relative counter must handle empty sets as well as rare nonempty ones. Separate input-bit access, description enumeration, exact/relative count verification, and ordinary gate size. If attempting a new sampler, execute it against the already preserved exact finite distribution and report actual failure cases rather than only a proposed construction.

## Preservation contract

The local package contains full raw output (including all traces), independent outputs, proofs, code, original failed revision, logs, hashes, and checkpoint. Remote additions are the proofs, complete final executable sources, count summary, independent checks, validation records and checkpoint; the large trace JSON is not claimed remotely uploaded. The confirmed remote completion commit belongs in a separate preservation receipt after writes, not guessed here. No research is running after the final reply.
