# P versus NP — checkpoint after U70-U71

Date: 2026-09-16. **We have not solved P versus NP yet.** No complete candidate, formal-kernel certification, independent expert verification, or authenticated novelty claim exists.

## Scope and continuity

Assigned folder `/mnt/data/02-p-versus-np`; private repository `Joe-Simo/p-versus-np`, branch `main`. Starting research head for this continuation was `553abd4bcbb6aa7dc55f4d094f3697f6d2a671ea` after U68-U69. Existing files were preserved and only new U70-U71 paths were added locally before remote preservation.

The governing prompt remains `/mnt/data/02-p-versus-np/RESEARCH_PROMPT.txt`, SHA-256 `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. No spending, publication, researcher contact, prize submission, visibility change, or background task occurred. No Mathbox/Consensus result is claimed. Wolfram used the existing allowance for one clean independent finite calculation.

## U70: local rank and exact path-certificate classification

For four sampled rows, simultaneous output-disagreement requirements at one B2 gate become affine GF(2) equations on the four truth-table bits: each required row pair `(i,j)` imposes `x_(u_i)+x_(u_j)=1`, where `u_r` is the observed parent-pair address. The exact local number of B2 types is zero if inconsistent and otherwise `2^(4-rank)`. All 16,384 choices of parent columns and row-pair subsets were checked against literal gate enumeration.

A one-gate route-only factorization already fails. With selected predecessor column `0001` and routed pairs `(0,1),(0,3)`, side column `0000` gives eight compatible gate types while side column `0010` gives four. Each pair alone has eight types. The difference is the truth-table-address collision pattern, so route shape alone does not determine a component weight.

Eight explicit depth-one path-certificate probes yield the fixed 8-by-8 complement-paired weight matrix recorded in U70. Its determinant is `2^21`. Thus the eight exact probe counts recover the entire complement-paired four-row output distribution of an arbitrary side prefix. If the side output is a gate, complementing its final truth table pairs `b` with `NOT b`, recovering each oriented output count.

Composing this transform with U67 gives: **exact fixed path-certificate counting is #P-complete under polynomial-time Turing reductions**, already when every certified path has length one, there is only one appended probe gate, and each probe uses at most two row-pair requirements. Membership in #P is direct.

This is not approximation hardness. Every matrix entry is four or eight, so each hard-reduction probe has conditional density at least 1/4 regardless of the side prefix. Uniform rejection gives an exact sampler in at most four expected proposals and Bernoulli estimation gives an elementary FPRAS for each probe count.

## U71: exact union and cheap overlap multiplicity

For a balanced target there are four cross-label row pairs. A favorable prefix is exactly the union of certificates that, for each cross pair, choose a final parent that differs and a backward path of disagreements to an initially differing signal. The disagreement-descent lemma proves completeness of this certificate family.

For a fixed raw type word and row pair p, let `P_p(v)` be the number of backward disagreement paths from signal v. Initial signals contribute 0/1. At a gate v with predecessor positions a,b, if v differs then `P_p(v)` is the sum of the path counts of predecessor positions that also differ; otherwise it is zero. Repeated predecessor positions are deliberately counted as distinct witnesses.

The number of four-path certificates witnessing one sampled favorable word is therefore

`W = product_p (P_p(A)+P_p(B))`

over the four cross-label pairs. It is computable in O(s) bigint additions per pair with O(s)-bit values. Hence the Karp-Luby-style overlap denominator is polynomial-time computable exactly.

TypeScript exhaustively compared this recurrence with literal path-list enumeration on 74,000 complete raw words across chains, reconvergent diamonds, a four-gate shared topology, and repeated predecessors; all agree and `W>0` exactly matches favorability. Independent Python repeats 8,464 complete words with separately constructed path lists and agrees.

## Executed evidence

TypeScript `code/u70_u71_audit.ts`:
- 16,384 local affine-system versus literal B2 checks;
- exact route-only 8-versus-4 counterexample;
- fixed probe matrix and Bareiss determinant `2,097,152`;
- four complete side-prefix output-distribution transform checks;
- 74,000 full witness-word checks;
- maximum observed witness multiplicity 1,024.

Independent Python `code/u70_u71_independent.py` reconstructs all 16,384 local cases, the exact probe matrix/determinant, route counterexample, and 8,464 path-list cases before reading the TypeScript result for final comparison.

Wolfram 15.0.1 independently reconstructs the probe matrix, determinant, complement invariance, minimum probe weight four, and 8-versus-4 route witness. One clean call returned `AllPass -> True`.

The first TypeScript revision failed strict compilation before execution because of one unused constant and one unchecked array increment. The failure is preserved in `u70_u71_initial_compile_failure.log`; the corrected source passes strict/no-unused compilation, Node syntax checking, byte-identical rerun, Python compilation and byte-identical independent rerun.

Main result SHA-256: `ebb980236f4564333dc7df4814f436db36606a5e0570066f9ba69c6227828db9`.
Independent result SHA-256: `059fb0ee0df37e739e8ac7171eed7b9b9da3f4aa93b6f48702ab90b0fddc54a2`.

## Full-target distinction

Nothing in U70-U71 proves the Oliveira-Pich-Santhanam magnification premise, an `N^(1+epsilon)` ordinary general-circuit lower bound, a polynomial-time SAT algorithm, or P versus NP. Exact #P-completeness is not an unconditional running-time lower bound and the specific hard probes are easy to approximate.

The path-union approach survives one important audit: overlap/witness multiplicity is cheap. Its remaining missing primitive is controlled approximate counting or near-uniform sampling of an **arbitrary fixed multi-path certificate**, especially when several certified paths share gates and unconstrained side-parent ancestry.

## Next executable obligation

Test topological sequential conditioning for one fixed multi-path certificate. At each constrained gate, after parent sampled columns are known, the naive sampler chooses uniformly among locally allowed B2 types. This is generally not uniform globally because the allowed count can depend on earlier side-parent columns (2/4/8/16 possibilities).

Construct the smallest recursive family where this local sampler's likelihood ratio or importance weight spreads with depth. Compute exact target component counts and the naive proposal distribution for bounded depths; derive the asymptotic variance if possible. Then test whether a polynomially computable correction based only on the local ranks can restore an FPRAS/near-uniform sampler. If the scheme fails, record only that method-specific barrier, not approximation hardness of fixed certificates in general.

No process continues after this checkpoint.
