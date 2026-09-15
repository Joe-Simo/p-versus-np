# U34 — Primary-source correction: the 2018 Gap-MCSP magnification theorem is formula/AC0 based, not the general-circuit theorem previously attributed to it

Date: 2026-09-14
Status: source-verified correction to U29/U31/U32 framing; no P versus NP resolution.
Corrects: the attribution/parameter framing used in U29–U32 where the 2018 Oliveira–Santhanam result was treated as requiring a general Boolean circuit lower bound N^{1+epsilon} for Gap-MCSP implying NP not subset P/poly.

## 1. Source authenticated

Primary conference paper checked in full:

Igor C. Oliveira and Rahul Santhanam, “Hardness Magnification for Natural Problems,” FOCS 2018, pp. 65–76. Conference PDF at ieee-focs.org; also cited as ECCC TR18-139 for the full version.

The checked conference paper uses N=2^n for the truth-table input length.

## 2. Exact theorem actually stated for Gap-MCSP

For (1,1-delta)-MCSP[s], Theorem 1 states formula magnification. In particular, with s(n)=n^k and delta(n)=n^{-k}:

- if the promise problem is not in Formula[N * (log N)^{O(1)}], then some NP language has no polynomial-size formulas;
- if it is not in Formula[N^{1+epsilon}] for some epsilon>0, then some NP language has much stronger formula lower bounds.

A further regime s(n)=2^{o(n)}, delta(n)=2^{-o(n)} also yields NP formula lower bounds from an N^{1+epsilon} formula lower bound.

Theorem 2 concerns superlinear lower bounds against bounded-depth AC0 circuits for the Gap-MCSP variant and concludes NP not subset NC1.

The paper explicitly says similar results can be proved for Boolean circuits and other devices, but the conference theorem displayed for Gap-MCSP is formulated for formulas/AC0. The general Boolean-circuit N^{1+epsilon} -> NP not subset P/poly implication previously recorded in U29 was not verified from this source and must not be treated as source-established.

## 3. Consequence for U31/U32

U31’s observation that ordinary two-party communication complexity is capped at O(N) remains mathematically correct, but its claim that this necessarily misses the relevant 2018 Gap-MCSP magnification threshold because the theorem requires *general circuits* was based on the misattributed target.

U32’s Karchmer-Wigderson route should therefore be reopened rather than rejected: formula lower bounds are exactly one of the computational models for which the primary theorem magnifies. A KW/formula lower bound compatible with the theorem’s parameters could be directly relevant.

## 4. Natural-proofs point

The primary source explicitly argues that hardness magnification can evade the natural-proofs barrier because the magnification step applies to special structured problems and destroys the density of the corresponding property. Thus U33’s generic natural-property warning remains useful, but it should not be interpreted as showing the magnification route is blocked by Razborov–Rudich.

## 5. New target

The corrected concrete target is:

For constructive s(n)=n^k and delta(n)=n^{-k}, prove a formula lower bound for

    (1,1-delta)-MCSP[s]

on N=2^n input bits exceeding N*(log N)^{O(1)} (or N^{1+epsilon} for the stronger consequence).

By the checked Theorem 1, such a lower bound yields an NP language without polynomial-size formulas. This is a major lower bound, but it is still weaker than P != NP: NP not subset Formula(poly) does not imply NP not subset P, because P computations may have polynomial-size circuits but can require superpolynomial formula size.

Therefore this theorem alone does NOT solve P versus NP.

## 6. Relation to the project objective

A successful Gap-MCSP formula lower bound would be a major intermediate result, not the final P vs NP resolution. To reach P != NP one still needs either:

- a magnification theorem whose conclusion separates P from NP; or
- an additional bridge from the resulting NP formula lower bound to P != NP, which is not supplied by Theorem 1.

The same paper's Theorem 8 gives a direct P != NP consequence from a time-space lower bound for parameterized Vertex Cover, but that is a different target/model.

No statement here resolves P versus NP.