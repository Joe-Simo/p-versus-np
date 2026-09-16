# U68-U69 independent Wolfram result

Date: 2026-09-16. Tool: WolframLanguageEvaluator 15.0.1 for Linux x86 (64-bit), time constraint 40 seconds. One successful call; no warning, error or timeout was returned.

The independent call checked:

- all four-row Walsh character identities over every parent-column pair and all 16 row subsets;
- the three-pairing decomposition of the four-row even character;
- the balanced-target positive collision/separation identity for all parent-column pairs and all six balanced targets;
- repeated-predecessor chain target counts for m=1..6;
- the favorable-prefix equality slice for m=1..5;
- the transform-gate favorable-count histogram and sharp minimum two favorable raw gate types.

Returned summary:

```text
Version -> 15.0.1 for Linux x86 (64-bit) (July 2, 2026)
WalshPass -> True
PairingPass -> True
BalancedPositivePass -> True
ChainRows_m_actual_expected -> {{1,4,4},{2,32,32},{3,256,256},{4,2048,2048},{5,16384,16384},{6,131072,131072}}
EqualityRows_m_actual_expected -> {{1,2,2},{2,4,4},{3,8,8},{4,16,16},{5,32,32}}
TransformHistogram -> <|8 -> 4, 4 -> 8, 2 -> 4|>
TransformMin -> 2
AllPass -> True
```

This is an independent implementation check, not an external expert review or proof-assistant certificate.
