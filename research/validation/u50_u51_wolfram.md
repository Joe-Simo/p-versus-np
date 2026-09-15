# U50-U51 independent Wolfram result

Executed on 2026-09-15 through WolframLanguageEvaluator, timeConstraint 40. Exact source is `code/u50_u51_independent.wl`; no tool error or timeout was returned. The contextual Wolfram call supplied no needed mathematical result and is not evidence.

Actual evaluator output:

```wolfram
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)",
"ParityRows_n_descriptions_unique_components_histogram_expectedDescriptions_expectedComponents" -> {{2, 2, 2, 1, {{2, 1}}, 2, 1}, {3, 24, 24, 6, {{4, 6}}, 24, 6}, {4, 576, 576, 72, {{8, 72}}, 576, 72}},
"InterpolationRoundingChecks" -> True,
"GeometricChecks" -> True,
"BinaryExponentialCertificate" -> True|>
```

The circuit set here is constructed through merge histories, using U51's independently stated structural lemma; this Wolfram calculation does not separately prove that every minimal circuit is a tree. It independently verifies all pairwise single-block adjacencies on those sets through n=4. TypeScript separately enumerates the general conditional circuit fiber; Python completely enumerates n=3 raw descriptions and reconstructs the component graph by pairwise comparisons. Agreement is independent implementation, not expert or proof-assistant verification.

Rounding assertions cover s=1..1000. Geometric inequalities cover five exact rational acceptance probabilities and proposal budgets 0..20 (105 cases). The exact integer inequality 16^11>2*15^11 justifies the reported symbolic exponential bounds. No enormous hard truth table was computed.
