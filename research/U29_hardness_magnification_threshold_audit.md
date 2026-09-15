# U29 — Separation pivot: exact hardness-magnification target and threshold audit

Date: 2026-09-14
Status: source-verified route specification; no P versus NP resolution.

## 1. Why pivot here

U09–U28 repeatedly show that local SAT constraints are easy to encode while exact global witness contraction reintroduces exponential structure. Rather than invent another equality-side encoding, test whether an unconditional lower bound in a weak exact-computation model can be magnified into a general circuit lower bound.

## 2. Verified magnification theorem

Oliveira, Pich, and Santhanam, Theory of Computing 17 (2021), prove hardness magnification for gap versions of MCSP/MKtP. One stated frontier is:

For a universal constant c>=1, if there exists epsilon>0 such that (for every sufficiently small beta>0, with the paper's parameterization)

    Gap-MCSP[2^(beta n)/(c n), 2^(beta n)] notin Circuit[N^(1+epsilon)],

where N=2^n is the truth-table input length, then

    NP notsubseteq Circuit[poly].

The exact theorem is about a specific gap-MCSP promise problem and a slightly-superlinear lower bound against general Boolean circuits in truth-table input length N. It is not a theorem saying that an arbitrary restricted-model lower bound magnifies automatically.

## 3. Why this would settle P versus NP

If NP is not contained in polynomial-size nonuniform circuits, then in particular NP is not contained in P, because every polynomial-time language has polynomial-size circuit families. Thus the magnified conclusion implies P != NP.

## 4. Threshold arithmetic

N=2^n. A lower bound N^(1+epsilon) equals 2^((1+epsilon)n). The target is only a polynomial factor N^epsilon above linear in the explicit truth-table length N, but it is an exponential-size lower bound when measured in the underlying function arity n.

This explains the term magnification: a marginal exponent improvement in the N-scale lower bound implies a major complexity separation.

## 5. Existing lower bounds are close but model-sensitive

The same paper gives lower bounds for gap-MCSP/gap-MKtP against several weaker models near relevant thresholds. However the desired Item (1) is against general Circuit[N^(1+epsilon)]. A lower bound against formulas, branching programs, AC0, bounded-width contraction, OBDDs, DNNFs, etc. cannot simply be substituted.

Therefore our U09–U28 restricted-representation barriers do not currently trigger the theorem.

## 6. Locality barrier

Chen, Hirahara, Oliveira, Pich, Rajgopal, and Santhanam (ITCS 2020 / JACM work) identify a locality barrier for hardness magnification. Existing magnification theorems yield unconditional highly efficient circuits for the magnification problem when augmented by small-fan-in oracle gates. Many standard weak-model lower-bound techniques remain valid even with such local oracle gates. Such techniques are therefore too coarse to prove the exact lower bound needed for magnification, because they would incorrectly rule out circuits that are unconditionally known to exist in the oracle-augmented model.

This is directly relevant to our plan: simply porting a width/state-count argument from U09–U28 to MCSP is unlikely to cross the magnification threshold.

## 7. Research target sharpened

A useful new lower-bound technique must distinguish ordinary small circuits from the small-fan-in-oracle-augmented circuits supplied by the magnification reduction. In other words it must be non-local in a sense not captured by standard state counting or local restrictions.

Candidate invariants to test:

1. global consistency across many overlapping truth-table blocks;
2. communication/information measures that are not preserved by arbitrary local oracle gates;
3. proof-complexity witnessing properties tied specifically to MCSP's semantic circuit-minimization promise.

## 8. No false bridge

We have not proved the required Gap-MCSP circuit lower bound. The value of U29 is to prevent a category error: restricted exact-contraction lower bounds are interesting but do not magnify unless an exact theorem maps that model/threshold to a strong circuit separation.

## 9. Next executable route

Attack the locality barrier itself on a simplified magnification-style promise problem. Construct an explicit global invariant of a truth table that (a) distinguishes low-complexity from high-complexity tables on a controlled family, and (b) is demonstrably not handled by the local-oracle extension that defeats standard lower-bound methods. If no such invariant survives, record the obstruction rather than claiming magnification.

Sources verified on 2026-09-14:
- Oliveira, Pich, Santhanam, Hardness Magnification Near State-of-the-Art Lower Bounds, Theory of Computing 17 (2021), DOI 10.4086/toc.2021.v017a011.
- Chen et al., Beyond Natural Proofs: Hardness Magnification and Locality, ITCS 2020 / arXiv:1911.08297.

No statement here resolves P versus NP.