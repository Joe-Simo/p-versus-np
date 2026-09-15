# U52-U53 independent exact Wolfram check

Executed once on 2026-09-15 with timeConstraint=40. Actual tool: WolframLanguageEvaluator. Source: `code/u52_u53_independent.wl`, excluding the explanatory file header. Returned kernel version is recorded below. No additional purchase or subscription was requested.

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)",
"OneGateCounts" -> {{{0, 1, 2, 2, 3}, {516, 484, 884, 516}}, {{0, 1, 2, 3, 3}, {536, 464, 464, 936}}},
"TwoGateCounts_n2_points12" -> {167296, 139904, 139904, 167296},
"RawTwoGateTotal" -> 614400,
"CopyRows" -> {{{1, 2}, 2, 3, 144, {240, 480}, True}, {{1, 1, 1, 1}, 4, 35, 705600, {1411200, 1411200, 1411200, 1411200}, True}, {{3, 2, 1}, 5, 21, 914457600, {5029516800, 3353011200, 1676505600}, True}},
"StateBoundChecks" -> True|>
```

The two-gate case enumerates raw first gates and then directly enumerates each allowed second gate/output. It is independent of the histogram dynamic program. The copy counts are calculated from a multinomial/rising-factorial sum rather than that dynamic program. State-bound inequalities were checked at every integer s=8..128; the proof establishes them for all larger budgets without extrapolating from these cases.

No error, timeout, or warning occurred in this evaluator call. These are finite independent implementations, not formal or external expert verification. They do not establish P!=NP or a lower bound for all exact counters.
