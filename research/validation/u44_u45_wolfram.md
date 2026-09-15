# U44-U45 independent exact computations

Date: 2026-09-15. WolframLanguageEvaluator; timeConstraint=40 per call. Returned version: **15.0.1 for Linux x86 (64-bit) (July 2, 2026)**. Independent implementations, not independent expert or formal verification. All ranks use `Modulus -> 2`.

## Successful first cell

Source: `code/u44_cofactor_independent.wl`, apart from its comment header. Actual output:

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)", "CofactorClassCount" -> 152, "CofactorClassMaskHex" -> "fffffc03f0a5f359cc99cf6596699595a9a99669a6f399339acfa50fc03fffff", "CubicFailures" -> 0, "DegreeFeatureRanks_d_columns_rank" -> {{0, 1, 1}, {1, 9, 9}, {2, 37, 37}, {3, 93, 92}}, "MinimumPointCounts_size_number" -> {{6, 80}, {7, 24}}, "HammingBallRanks_r_columns_rank" -> {{0, 1, 1}, {1, 9, 9}, {2, 37, 37}, {3, 93, 93}, {4, 163, 163}}|>
```

This class is defined by cofactor compatibility, not by importing the TypeScript synthesis result. The class bitmask was compared exactly with the TypeScript class. The cubic coefficients were supplied as the conjectured certificate and tested on the full 256-table domain. This call independently covers the two-gate class, not the TypeScript three/four-gate minimum-size claims.

## Follow-up invocation with warnings — not counted as clean evidence

A redundant line before a later correct calculation used nested pure-function slots incorrectly:

```wolfram
isolated=Select[hard,AllTrue[Range[0,7],cubic[BitXor[#,2^#2]]==0& /. #2->0]&];
```

It emitted `Function::slotn` three times and `General::stop`; the tool also warned that messages may indicate errors. The correctly named-argument calculation later in the same cell overwrote `isolated` and returned the values below, but this invocation is not used as the clean independent check. The redundant expression was removed and the whole cell reexecuted.

## Successful corrected follow-up

Source: `code/u44_seven_point_independent.wl`, apart from its comment header. Actual output, with no warnings:

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)", "Nonmembers" -> 104, "IsolatedCubicNonmembers" -> {}, "SensitivityAtMostOneTables" -> {0, 15, 51, 85, 170, 204, 240, 255}, "MajorityTruthTable" -> 232, "SmallSubsetsChecked" -> 247, "MajoritySmallCertificateFailures" -> 0, "MajoritySevenPointCertificates" -> {127, 254}|>
```

The sensitivity calculation exhausts only the three-variable case; the arbitrary-dimensional sensitivity-one claim is proved in U44. The majority calculation checks every subset of size at most six and both seven-point certificates. It does not infer an asymptotic theorem from an increasing numerical pattern.
