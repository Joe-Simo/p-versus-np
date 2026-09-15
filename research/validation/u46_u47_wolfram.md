# Exact Wolfram results for U46-U47

Date: 2026-09-15. Existing authorized allowance, no purchases. Each call was bounded by timeConstraint=40. Source: code/u46_u47_independent.wl; evaluate the two labeled cells separately. No local Wolfram installation is claimed.

## First invocation — successful sharpness check

Actual returned expression:

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)", "ClassCounts" -> {70, 526, 3000}, "ClassSums" -> {98302500, 4690111614380}, "Target" -> 32769, "MinimumPoints" -> 9, "MinimumCertificateCount" -> 64, "FirstMinimumMask" -> 33471, "AllMasksSizeAtMostEightConsistent" -> True|>
```

This independently constructs the three-gate function class and checks every sample mask for one target, using agreement-mask subset closure. It does not certify arbitrary-arity arguments.

## Second invocation — syntax failure

The initial greedy-check call contained one excess `]` in

```wolfram
BitAnd[BitXor[f,#],BitXor[mask,2^i]]]==0&
```

The tool returned a `ToExpression::sntx` diagnostic and `$Failed`, not a mathematical result. The corrected version defines `reduced` in a `With` and evaluates the shorter predicate. No assertion is supported by the failed call.

## Third invocation — corrected greedy check

Actual returned expression:

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)", "ClassCount" -> 3000, "Target" -> 14366, "ElevenPointMask" -> 15838, "ElevenPointValid" -> True, "EachDeletionHasFitter" -> True, "FittingTablesAfterDeletion" -> {{1, 30780}, {2, 14906}, {3, 64054}, {4, 30735}, {6, 64095}, {7, 64190}, {8, 15167}, {10, 15390}, {11, 12351}, {12, 10815}, {13, 23070}}, "AlternativeMask" -> 3599, "AlternativeSize" -> 7, "AlternativeValid" -> True|>
```

This verifies inclusion-minimality of the eleven-point mask and existence of a smaller seven-point mask. Exact optimality of seven is supplied by the full TypeScript/Python computations, not inferred solely from this call. The Wolfram algorithms, TypeScript raw-circuit/ternary algorithms, and Python cofactor/orbit algorithms differ; all are still AI-authored implementations, not independent expert review or formal kernel verification.
