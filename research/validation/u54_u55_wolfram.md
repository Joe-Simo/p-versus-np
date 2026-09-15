# U54-U55 independent Wolfram evidence

Executed once on 2026-09-15, WolframLanguageEvaluator, timeConstraint 40. Source is `code/u54_u55_independent.wl` excluding its explanatory header. No warning, failure or timeout was returned. The actual output was:

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)",
"Histograms" -> {{2, 0, 4, 1}, {3, 0, 3, 1}, {4, 0, 2, 1}, {5, 0, 1, 1}},
"ExactTwoGateCounts" -> {2085120, 2944288, 3819520, 4711200},
"EqualFirstMoments" -> True, "FirstMoments" -> {7/2, 0, 5/2, 1},
"EqualPairMoments" -> True,
"MixtureCompletionCounts" -> {3385920, 3386016}, "Difference" -> -96,
"DegreeLeadingRows_r_degree_actual_expected" -> {{0, 1, 1, 1}, {1, 2, 1/288, 1/288}, {2, 3, 1/48672, 1/48672}, {3, 4, 1/6359808, 1/6359808}, {4, 5, 1/715478400, 1/715478400}, {5, 6, 1/73264988160, 1/73264988160}, {6, 7, 1/7057860526080, 1/7057860526080}},
"RateCases" -> 44, "AllPass" -> True|>
```

The four suffix counts enumerate physical predecessor/gate choices with memoization of equal sorted-column lists. They are not obtained by inserting the proposed closed scalar formula. Rate cases and polynomial expansion separately check the algebra. This does not formally certify the all-parameter proof, verify every TypeScript sampler rank, or constitute external expert review. No additional credits or subscription were purchased.
