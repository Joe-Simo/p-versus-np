# U60-U61 independent Wolfram calculation

Date: 2026-09-15. Tool: WolframLanguageEvaluator, timeConstraint 40. Two calls were made; the second is the corrected, warning-free evidence. Returned version: **15.0.1 for Linux x86 (64-bit) (July 2, 2026)**. No additional purchase or subscription was requested.

## First invocation: warning recorded, not silently discarded

The local rank-check Table used unscoped iterator names `A,B`. It returned the same numerical result as below, but also:

```text
Symbol::undefined2: Warning: Global symbols "A, B, A, B" are undefined.
General::messages: Messages were generated which may indicate errors.
```

The rank-check iterators were moved into `Module[{q,aa,bb}, ...]`. The next invocation returned without warnings. There was no change to the counting or positive-weight formulas. The first warning-bearing output is not counted as an extra independent successful check.

## Corrected invocation: actual result

The complete executed source is `code/u60_u61_independent.wl`, excluding its explanatory header. Actual returned expression:

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)",
"Rows_full_affine_weightSums_affinePass_positivePass" -> {
 {{26624, 0, 6144, 0, 0, 6144, 0, 26624},
  {1664, 0, 384, 0, 0, 384, 0, 1664}, {6, 0, 0}, True, {True, True, True}},
 {{16384, 4096, 6144, 6144, 6144, 6144, 4096, 16384},
  {1024, 256, 384, 384, 384, 384, 256, 1024}, {6, 6, 4}, True, {True, True, True}}},
"ThreeRowLocalRankPass" -> True,
"FourRowANDCounts" -> {1, 0},
"PositiveWeightTable" -> {{{}, {0, 0, 0}}, {{1}, {2, 0, 0}}, {{2}, {0, 2, 0}}, {{3}, {0, 0, 2}},
 {{1, 2}, {1, 1, 1}}, {{1, 3}, {1, 1, 1}}, {{2, 3}, {1, 1, 1}}, {{1, 2, 3}, {1, 1, 1}}}|>
```

This calculation uses full-column-state weighted enumeration, modular matrix rank and direct color propagation. It does not use the main shape-frontier recurrence, implement the published #NFA FPRAS, check the asymptotic automaton size by experiment, or formally certify the mathematical proof. The two four-gate distributions account for 16^4 type assignments each by weighted state sums; they are not described as separate literal executions of all assignments in this Wolfram call. The local rank test covers all parent-column pairs on one, two and three rows. The four-row single-gate AND example has one B2 type and no affine type.
