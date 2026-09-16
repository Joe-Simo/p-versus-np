# U66-U67 independent Wolfram calculation

Date: 2026-09-16. Tool: WolframLanguageEvaluator, version **15.0.1 for Linux x86 (64-bit) (July 2, 2026)**.

The first submission completed with the correct numeric results but emitted an avoidable global-symbol warning; it is not counted as the clean evidence. The second, scoped call returned without warnings/errors/timeouts:

```text
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)",
  "LocalPass" -> True,
  "ChainRows" -> {{1, 4, 4}, {2, 32, 32}, {3, 256, 256}, {4, 2048, 2048}},
  "Diamond" -> {672, 1344, 720, 1440},
  "DuplicateOneGatePass" -> True,
  "AllPass" -> True|>
```

The clean source is `code/u66_u67_independent.wl`. It independently checks all 4,096 local `(a,b,h)` factor entries against literal B2 tables, the rare-chain formula through four gates, the shared-diamond correlation/count values, and all 16 two-input-column pairs for the one-gate duplicated-row transfer. It does not implement variable elimination or certify asymptotic treewidth complexity.
