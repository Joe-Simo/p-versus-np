# U63 — Positive final-gate integration and an easy dense language with exponential NFA complexity

Date: 2026-09-15. Status: exact positive counting identity and exact sampling/FPRAS result for constant four-row targets; no P-versus-NP resolution, unrestricted four-row approximation theorem, or novelty claim.
Dependencies: U62's local law and elementary rejection/Chernoff arguments.

## 1. Why this unit is necessary

U62 proves an exponential exact-NFA lower bound for a four-row compatible-type language. That could be mistaken for evidence that the associated count or conditional sampling problem is difficult. It is not.

For the very same topology family and target 0000, compatible words have constant density under the uniform raw type prior. Uniform rejection therefore samples them exactly in constant expected trials. This separates language-recognition representation size from approximate counting complexity.

## 2. Integrate the output gate exactly

Fix all gate types except the final output gate. Let its two four-row parent columns be A and B, and let Y be the desired four-row output column.

Partition the four rows by their observed parent pair `(A_i,B_i)`. Let d(A,B) be the number of distinct pair values appearing. A gate type produces Y iff Y is constant on every block of this parent-pair partition. If that compatibility condition holds, the truth-table entries on the d observed pairs are forced and the other 4-d entries are free. Hence

    # final gate types producing Y = 2^(4-d(A,B))

when Y respects the partition, and is zero otherwise.

Therefore for a topology with s gates,

    Z_Y = sum_prefix  1[E_Y(prefix)] * 2^(4-d(prefix)),

where E_Y is the event that Y is constant on equal parent-pair blocks. This is fully nonnegative.

## 3. Equivalent favorable-prefix condition

For every pair of rows i,j with Y_i != Y_j, the rows must not have the same parent pair. Thus

    E_Y iff for every cross-label pair (i,j), A_i != A_j OR B_i != B_j.

There are at most four cross-label pairs for four rows. On E_Y, the positive weight lies in {1,2,4,8}.

Consequently, a relative counter for E_Y plus an almost-uniform sampler from E_Y would suffice to approximate Z_Y: estimate the bounded conditional mean of `2^(4-d)` and multiply by |E_Y|. This is a reduction, not a solution; efficient handling of E_Y for arbitrary shared topology remains open here.

## 4. Constant targets are completely easy

Take Y=0000. It is constant on every parent-pair block, so E_Y always holds. For fixed parents A,B, exactly `2^(4-d(A,B))` of the sixteen output gate types produce zero. Since d<=4,

    Pr[final output=0000 | every earlier gate type] >= 1/16.

The same holds for 1111.

Uniformly sample complete raw type words and accept iff the output is 0000. Conditional on acceptance, the word is exactly uniform over all compatible descriptions. Expected proposals are at most sixteen. A multiplicative Bernoulli estimate of the acceptance probability, multiplied by 16^s, gives an FPRAS with O(epsilon^(-2) log(1/delta)) trials up to an absolute constant.

## 5. Exponential NFA size coexists with this trivial sampler

Apply Section 4 to U62's T_m. U62 proves the exact language requires at least 2^m NFA states, yet the exact uniform sampler above needs at most sixteen expected proposals independent of m.

Therefore exponential exact-NFA state complexity is not evidence of approximate-counting or sampling hardness. A future four-row obstruction must survive positive analytic elimination such as the final-gate identity, not merely exact-language state lower bounds.

## 6. Executed checks

TypeScript enumerates all 256 four-row parent-column pairs and all sixteen B2 types, confirming `count(0000)=2^(4-d)` exactly. The minimum is one type, proving the 1/16 conditional bound. Independent Python repeats the calculation using tuple columns. Wolfram independently verifies the same minimum within the corrected U62-U63 call.

## 7. Next executable obligation

Attack E_Y for a nonconstant 2-versus-2 target after integrating the final gate. Build the smallest shared topologies where its four cross-label separation requirements interact. Compare exact prefix counts against: (i) independent pair-reliability multiplication; (ii) a multi-token path/NFA event; and (iii) a row-partition summary. Either obtain a polynomial positive representation or produce an explicit failure/exponential witness for the proposed summary. Do not revert to exact full-language NFA size as a hardness proxy.
