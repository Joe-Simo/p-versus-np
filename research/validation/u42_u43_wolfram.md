# U42-U43 independent Wolfram calculations

Date: 2026-09-15. Tool: WolframLanguageEvaluator, timeConstraint 40 per invocation. Returned kernel version: **15.0.1 for Linux x86 (64-bit) (July 2, 2026)**. No paid upgrade was requested. These are exact finite computations, not independent theorem certification.

## Invocation 1 — success

Executed code is `code/u42_u43_independent.wl` (apart from its explanatory header). Actual returned expression:

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)",
"BatchReadRows_n_t_cases_failures" -> {{0, 3, 2, 0}, {1, 3, 32, 0}, {2, 3, 1024, 0}, {3, 1, 2048, 0}},
"DualRows_n_d_dimension_nonzero_minimum_expected" -> {{1, 0, 1, 1, 2, 2}, {2, 0, 3, 7, 2, 2}, {2, 1, 1, 1, 4, 4}, {3, 0, 7, 127, 2, 2}, {3, 1, 4, 15, 4, 4}, {3, 2, 1, 1, 8, 8}, {4, 0, 15, 32767, 2, 2}, {4, 1, 11, 2047, 4, 4}, {4, 2, 5, 31, 8, 8}, {4, 3, 1, 1, 16, 16}},
"AllPass" -> True|>
```

The first group contains 3,106 table/request assignments. The dual rows come from modular nullspace enumeration, unlike the TypeScript direct support scan. This invocation preceded the fast coefficient-selected face constructor and does not independently validate that constructor.

## Invocation 2 — syntax failure, not counted

The additional face-checking cell had an extra closing bracket in this selector:

```wolfram
points[[#, Complement[Range[n], axes]]]] == base[[Complement[Range[n], axes]]] &
```

Actual returned tool text:

```text
ToExpression::sntx: Invalid syntax in or before "];\n ^"."\n"
General::messages: Messages were generated which may indicate errors.
Out[1]= $Failed
```

No mathematical result was obtained from that invocation. The correction assigns `outside = Complement[Range[n], axes]` and compares `points[[#, outside]] === base[[outside]]`.

## Invocation 3 — corrected success

Executed code is `code/u43_gaussian_face_check.wl` (apart from its explanatory header). Actual returned expression:

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)",
"CoefficientSelectedFaceRows_n_d_cases_nonmembers_failures" -> {{1, 0, 4, 2, 0}, {2, 0, 16, 14, 0}, {2, 1, 16, 8, 0}, {3, 0, 256, 254, 0}, {3, 1, 256, 240, 0}, {3, 2, 256, 128, 0}},
"FullMonomialEvaluationRanks_n_rank_expected" -> {{1, 2, 2}, {2, 4, 4}, {3, 8, 8}, {4, 16, 16}, {5, 32, 32}},
"AllPass" -> True|>
```

This checks 804 function/degree pairs, including 646 nonmembers. Coefficients come from Gaussian elimination rather than the fast Mobius circuit, and faces are enumerated directly rather than conditionally differentiated. Full-rank checks are exact over GF(2). It is not a Boolean-gate cost measurement.
