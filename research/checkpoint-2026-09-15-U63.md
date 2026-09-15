# P versus NP — checkpoint after U62-U63

Date: 2026-09-15. **We have not solved P versus NP yet.** No complete candidate, formal-kernel verification, independent expert certification, or authenticated novelty claim exists.

## Scope and continuity

Assigned folder `/mnt/data/02-p-versus-np`; dedicated private repository `Joe-Simo/p-versus-np`, branch `main`. Starting remote head was `5c20591e3f2f802c0e5b9ac98600279ad5a884e6`; the U61 checkpoint was read before this work. Existing project files and all previous research packages were preserved. The governing `RESEARCH_PROMPT.txt` was reread in the assigned folder and remains the controlling scope; no sibling project was inspected or changed.

No spending, publication, outside researcher contact, visibility change, prize submission, or background automation occurred. Wolfram used the existing allowance; its first U62 draft had a syntax failure and the corrected call succeeded. Mathbox/Consensus were not invoked or claimed in this run.

## Results established

**U62, exact four-row local law.** Normalize four sampled rows by row 0. For parent shapes `a,b in F_2^3`, a uniform B2 gate has `h = alpha a + beta b + gamma (a*b)` with independent fair `alpha,beta,gamma`, plus an independent output-orientation bit. Thus the child is uniform on `span{a,b,a*b}`. The explicit pair `a=110`, `b=101` has `a*b=100` outside `span{a,b}`, so U61's affine replacement genuinely ends at three rows.

**U62, exact-NFA barrier.** For each m, an explicit four-row topology with `4m-1` gates has a regular type slice on which target `0000` is accepted exactly for the equality language `EQ_m={uv:u=v}`. Any NFA for the full compatible-type language would induce an NFA with the same states for `EQ_m`. The standard splice/fooling-set proof gives at least `2^m=2^((s+1)/4)` states. This rules out a polynomial-size exact #NFA representation for all four-row fixed topologies. It is a representation lower bound only.

**U63, positive final-gate integration.** Given the two output-parent columns A,B and target Y, let d be the number of distinct observed parent pairs `(A_i,B_i)`. If Y is constant on every parent-pair block, exactly `2^(4-d)` of the sixteen output gate types produce Y; otherwise none do. Hence the full count is a nonnegative weighted sum over favorable prefixes, with weights in `{1,2,4,8}`. For target `0000` the favorable event is automatic, so conditional acceptance is always at least `1/16`.

**U63, counterexample to overinterpreting U62.** For every four-row fixed topology whose output is a gate, uniformly sample full raw type words and accept those outputting `0000`. Acceptance probability is at least `1/16`, so rejection gives an exactly uniform compatible-description sampler in at most sixteen expected proposals. A multiplicative Bernoulli estimate gives an FPRAS for the count. Thus the U62 language family can have exponential exact-NFA state complexity while approximate counting and exact sampling are trivial.

## Executed evidence

TypeScript `code/u62_u63_audit.ts` exhaustively checks all 64 normalized parent-shape pairs against all sixteen B2 types; the exact rank/multiplicity law passes. It then checks every equality-slice word for `m=1..8`, **87,380** binary words total, with accepted counts `2,4,8,16,32,64,128,256`. All 256 full parent-column pairs are checked against all sixteen output gate types, confirming the exact zero-target count and minimum one compatible type.

Independent Python uses literal four-row tuples and direct gate tables, not the TypeScript normalized helper. It independently verifies the same 64 local cases, all equality words through m=8, and all 256 parent pairs. Wolfram 15.0.1 independently verifies all 64 local cases and equality through m=4; the first Wolfram submission returned a syntax error and no evidence, while the corrected call passed. The asymptotic NFA lower bound and final-gate count are mathematical proofs, not finite extrapolations.

Final environment: Node v22.16.0, TypeScript 5.8.3, Python 3.13.5. Strict/no-unused compilation and syntax checks pass. Final outputs reproduce byte for byte. Main result SHA-256 `a576ac798fb81c3e20113c0019bf94810e7106deaddb854966b3c520ea828791`; independent result SHA-256 `b2e878fd4c12422b7ce669f8920ac88f4eb616edfcf23844b2e00c8304aa5359`.

## Full-target distinction

Nothing here proves the OPS2021 `N^(1+epsilon)` ordinary general-circuit lower bound, a deterministic polynomial-time SAT algorithm, or any other complete P-versus-NP resolution. The exact-NFA lower bound is especially not such a bridge: U63 gives an explicit easy sampler/FPRAS for the same target family.

The live object is now the favorable-prefix event for a **nonconstant** four-row target: for every row pair with different target labels, at least one of the two output parents must distinguish that pair. After the last gate is integrated out, the residual weights vary only by a factor eight. The unresolved issue is whether those favorable prefixes admit a polynomial positive representation or sampler under arbitrary shared topology.

## Next executable obligation

Start with the 2-versus-2 four-row target, which has four cross-label separation requirements. Construct the smallest shared topologies where the four pair requirements are correlated. Compare exact prefix counts with three candidate summaries: (i) independent pair-reliability multiplication, expected to fail; (ii) a multi-token path/NFA event; and (iii) the partition of the four rows induced by each parent column. Either obtain a polynomial positive representation or give an explicit exponential/incorrectness witness for the proposed representation. Keep the final-gate weight integrated analytically and do not revert to exact full-language NFA size as a hardness proxy.

No process continues after this checkpoint; the next continuation must execute another proof or computation step.
