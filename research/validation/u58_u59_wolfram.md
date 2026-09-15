# U58-U59 independent Wolfram result

One successful WolframLanguageEvaluator invocation with timeConstraint=40. Source `code/u58_u59_independent.wl`, excluding its header. No error, warning or timeout was returned. This independently checks finite literal type counts and the K22 interpolation example; it does not implement the FPRAS, certify the whole reduction, or provide expert/formal verification.

Actual returned expression:

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)",
"TopologyRows_slots_typeCounts_reliability_pass" -> {{1, {4, 4, 4, 4}, 1/2, True}, {2, {96, 32, 32, 96}, 1/4, True}, {4, {26624, 6144, 6144, 26624}, 3/16, True}, {3, {2048, 0, 0, 2048}, 0, True}},
"K22Polynomial" -> (3*p^3)/4 - (3*p^4)/16,
"InterpolationPoints" -> {{1/2, 21/256}, {1/4, 45/4096}, {1/8, 93/65536}, {1/16, 189/1048576}, {1/32, 381/16777216}},
"InterpolationMatches" -> True, "RecoveredIndependentSets" -> 7,
"SharedDiamondIncorrectIndependentValue" -> 7/32, "AllPass" -> True|>
```
