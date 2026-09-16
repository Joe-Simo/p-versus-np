# P versus NP — checkpoint after U73

Date: 2026-09-16. **We have not solved P versus NP yet.**

U73 closes the realizability gap deliberately left by U72: an ordinary four-row B2 gate can sustain hidden-state-dependent continuation multiplicities.

Exact witness: fixed parent A=0001; live state B in {0001,0010}; require child disagreement on rows (0,1) and child state in the same pair. Enumerating all sixteen B2 tables gives transition matrix `[[4,0],[2,2]]`. Repeating the gadget yields exact state counts `(2*4^m-2^m, 2^m)` from initial vector `(1,1)`, so one live branch has conditioned mass `2^(-m-1)`.

This proves local rank/disagreement information alone cannot support an unbiased near-uniform sequential sampler. However, carrying the complete two-state column repairs this particular chain by a trivial backward dynamic program, so it is not approximation hardness.

Wolfram independently searched the one-gate space and found 960 nonsymmetric two-state systems in the specified search family, including this witness, then checked the matrix recurrence through depth 12.

Next: construct a k-signal reconvergent ladder and determine whether suffix weights factor over the live signals or require a state space exponential in frontier width. This connects the sampling question directly to U66's factor-graph width parameter rather than to local rank alone.