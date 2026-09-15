# U56-U57 independent Wolfram result

One successful WolframLanguageEvaluator invocation, timeConstraint=40, on 2026-09-15. Source `code/u56_u57_independent.wl`, except its explanatory header. No error, warning or timeout returned. Actual result:

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)",
"TopologyRows_k_s_lists_hist_unfoldSum_mean_expected" -> {{3, 2, 144, {432, 225, 63}, 360, 1/2, 1/2}, {3, 3, 3600, {10800, 6921, 3150, 729}, 16200, 3/4, 3/4}, {4, 2, 400, {1600, 656, 144}, 960, 2/5, 2/5}},
"EmbeddingCoefficients" -> {180633600, 995584, 1760, 1},
"SuppliedParityCoreCounts" -> {0, 0, 24, 7296},
"DecoratedParitySpectrum" -> {0, 0, 42240, 7296}, "ParityTotal" -> 49536,
"UnequalOneCoreEmbeddingWeights_k3_s2" -> {256, 144},
"PatchedTable" -> 233, "PatchFits" -> True,
"TailChecks" -> {{1, 16, True}, {2, 32, True}, {3, 48, True}, {4, 64, True}, {5, 80, True}, {6, 96, True}, {7, 112, True}, {8, 128, True}},
"ExactMGFConstant" -> True, "AllPass" -> True|>
```

This independently checks predecessor topology enumeration, unfolded expectations, coefficient arithmetic, unequal decoration counts, one truth-table patch and the earlier topology-only tail bound. The parity core counts are deliberately supplied: this call does not independently enumerate all typed cores. The stronger signed-alias/type-tail follow-up was checked by TypeScript and Python after this invocation, not by Wolfram. This is independent implementation of finite components, not independent expert or formal proof verification.
