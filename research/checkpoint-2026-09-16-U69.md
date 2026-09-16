# P versus NP — checkpoint after U68-U69

Date: 2026-09-16. **We have not solved P versus NP yet.** No complete candidate, formal-kernel certification, independent expert verification, or authenticated novelty claim exists.

## Scope and continuity

Assigned folder `/mnt/data/02-p-versus-np`; private repository `Joe-Simo/p-versus-np`, branch `main`. The confirmed starting research head for this unit was `050cf28f943f25e172e320f42a4eb1ade22abcb2` after U66-U67. Earlier artifacts were preserved; no sibling project was inspected or changed.

The governing prompt remains `/mnt/data/02-p-versus-np/RESEARCH_PROMPT.txt`, SHA-256 `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. No spending, publication, outside researcher contact, prize submission, visibility change, or background automation occurred.

The official Clay P-versus-NP page was checked on 2026-09-16 and still marks the problem **Unsolved**: https://www.claymath.org/millennium/p-vs-np/ .

## U68: exact Fourier/equality structure

For any sampled-row subset S at one fresh uniform B2 gate, the Walsh character expectation is 1 exactly when every observed parent-pair address occurs an even number of times inside S, and 0 otherwise. On four rows this makes each two-row character the joint-parent collision indicator C_ij. The four-row character is the union of the three pairings 01|23, 02|13, 03|12, with exact indicator formula `Q=P1+P2+P3-2*A4` where A4 means all four parent pairs equal.

For a balanced target Y with two zero rows Z and two one rows O, Fourier inversion gives the alternating exact target probability. A second, pointwise nonnegative identity is sharper for approximation purposes:

`# final B2 types producing Y = F_Y (1+C_Z)(1+C_O)`,

where F_Y says no cross-label row pair has identical joint parents. This is exactly the final-gate favorable event, and the nonzero raw multiplicities are 1,2,4. All six balanced targets have 84 favorable parent-column pairs, with multiplicity histogram 1->24, 2->48, 4->12.

A repeated-predecessor chain shows why independently approximating the signed Fourier terms is unsafe: the target probability is `2^(-(m+1))`, while the positive and negative character contributions are individually O(1) and cancel to that residual. Constant-factor relative estimates of the individual moments do not control the final relative error; additive precision on the order of `2^-m` is needed. This is a method-specific cancellation example, not an approximation lower bound, because the chain itself is exactly tractable.

## U69: favorable support itself has an exact-NFA barrier

Adapt U62's equality topology. On its regular slice the output O is zero iff encoded m-bit words x,y are equal and is t=(0,1,0,1) otherwise. Add one fixed transform gate `R = t AND NOT O` in the rowwise sense, implemented by the raw B2 type `r(u,v)=v AND NOT u` with second parent t. Then R=t iff x=y and R=0 otherwise.

Let the final integrated gate have parents A=0 and B=R with balanced target t. The favorable-prefix event is exactly that R induces the t bipartition, i.e. R=t or NOT t. On the regular slice this occurs iff x=y. Therefore any exact NFA for the complete favorable-prefix language on 4m prefix gates would induce an NFA for `EQ_m`, so it needs at least `2^m=2^(r/4)` states. With the final integrated gate counted in the topology, the lower bound is `2^((s-1)/4)`.

This closes the exact-NFA loophole left after U62: not only the full four-row compatible language, but the positive favorable support itself can require exponentially many exact NFA states.

## U69: the same full favorable language is still easy to sample/approximately count

The NFA lower bound is again not approximation hardness. Condition on arbitrary earlier raw gate types, leaving only the transform gate random. Projection to its second input produces R=t and negated projection produces R=NOT t. Thus at least two of sixteen transform types are favorable for every earlier prefix:

`Pr[F_t | earlier prefix] >= 1/8`.

The bound is sharp. Across the sixteen possible earlier output columns, the exact favorable-transform histogram is 2->4, 4->8, 8->4. Consequently uniform rejection over full prefix type words yields an **exactly uniform** favorable-prefix sampler in at most eight expected proposals, and Bernoulli estimation gives an elementary FPRAS for the favorable-language size.

So exponential exact-NFA state complexity can coexist with constant-expected exact rejection sampling even for a nonconstant balanced favorable-prefix event. Exact-language representation size is not the missing approximation obstruction.

## Executed evidence

TypeScript `code/u68_u69_audit.ts`:
- 4,096 literal Walsh-character checks;
- 256 four-row pairing-identity checks;
- 1,536 balanced-target Fourier/positive-form comparisons;
- exact repeated-predecessor recurrences through m=12;
- all 87,380 restricted equality words through m=8;
- all sixteen transform-parent columns and all sixteen transform gate types.

Independent Python uses tuple-valued four-row columns and literal B2 truth tables. It constructs all reference objects before reading the TypeScript result and agrees on every declared count. Wolfram 15.0.1 independently checks the Walsh/pairing/balanced identities, chain through m=6, equality slice through m=5, and transform histogram; one clean call returned `AllPass -> True`.

The first TypeScript compile attempt was rejected before execution solely because an unused type alias violated the no-unused rule. The alias was removed. The failed compiler line is preserved and is not counted as mathematical evidence. Final strict TypeScript, Node syntax, byte-for-byte rerun and Python compile/execution all pass.

Main result SHA-256: `919700afc642fc2743d03d656eab8d38b36e94ccd72979df2861cebc48c9a57e`.
Independent result SHA-256: `5b64beff723b9a8a2654f9440e4b175e7146f9b25fb94c830b0c8308de6b412a`.

## Source/full-target audit

U68-U69 require no external mathematical theorem beyond elementary Walsh inversion and the self-contained NFA splice argument. The #NFA FPRAS from Arenas-Croquevielle-Jayaram-Riveros remains relevant only as historical motivation for why exact NFA size was tested; no call to that theorem is needed for the new sampler/FPRAS result.

The full target remains the Oliveira-Pich-Santhanam 2021 magnification premise: an ordinary general-circuit `N^(1+epsilon)` lower bound for one fixed epsilon and every sufficiently small beta. Fixed-four-row representation/cancellation results do not establish it.

## Next executable obligation

Do not return to exact NFA size or separately estimated Fourier characters. Test a **path-certificate union estimator** for the arbitrary balanced favorable event.

For each of the four cross-label row pairs, favorability requires a disagreement at at least one of the two final parents. Every actual disagreement has a backward path of disagreements to an initially differing signal. A candidate positive certificate therefore chooses, for each cross pair, one final parent and one backward disagreement path. Audit whether the set of raw type words satisfying a fixed four-path certificate has a count that factors or can be computed in polynomial time while preserving gates shared by several certificates.

The critical falsification test is a shared gate used by two or more row-pair paths: the gate imposes multiple parity constraints on the same four truth-table bits, and their rank depends on the actual parent-row addresses. Determine whether those addresses can be represented with only polynomial certificate state or whether verifying/counting one certificate recursively pulls in the full side-parent ancestry. Compare against exhaustive small shared-diamond instances. If the certificate sets are tractable, implement Karp-Luby-style overlap correction with the exact number of witnessing path tuples for a sampled word; if not, preserve the smallest explicit counterexample.

Do not infer approximation hardness from a failure of this certificate scheme. The growing anti-checker/magnification objective remains open; no complete P-versus-NP candidate exists, and no process continues after this checkpoint.
