# U72 — Sequential local conditioning can accumulate exponential importance-weight variance

Date: 2026-09-16. Status: method-specific negative result and exact toy calculation; no P-versus-NP resolution.
Dependencies: U70-U71.

## 1. Question

U71 left one concrete primitive: approximately count or near-uniformly sample the raw descriptions satisfying one fixed multi-path certificate. A tempting proposal processes constrained gates topologically and, once the two sampled parent columns are known, chooses uniformly among the locally allowed B2 truth tables. Because a local certificate induces affine GF(2) constraints, the allowed multiplicity is one of 2,4,8,16 whenever nonzero.

This note tests whether correcting the resulting proposal only by multiplying local allowed-count factors is automatically low variance.

## 2. Exact abstract recurrence

Consider a recursive family in which each layer exposes one fair hidden binary branch and the ratio between the two possible local continuation multiplicities is four: equivalently, after an irrelevant common factor is divided out, the one-step importance multiplier is 2 on one branch and 1/2 on the other. The branches are independent across layers. This is the smallest multiplicative model consistent with the 2-versus-8 spread allowed by the exact local rank formula.

For depth m and K~Binomial(m,1/2), the unnormalized importance weight is

    W_m = 2^(2K-m).

Therefore

    E[W_m] = (5/4)^m,
    E[W_m^2] = (17/8)^m,

and the squared coefficient of variation is exactly

    CV^2(W_m) = E[W_m^2]/E[W_m]^2 - 1
              = (34/25)^m - 1.

Thus relative variance grows exponentially with base 34/25 = 1.36. A plain importance-sampling estimator based on this proposal needs exponentially many samples to obtain fixed relative error on this family.

## 3. What is and is not proved

This calculation is exact for the stated multiplicative recurrence. It proves that **local rank correction by itself has no generic variance guarantee**: bounded one-step ratios do not prevent exponential product-weight variance.

It does not yet prove that the recurrence is realizable by one fixed four-row path certificate in the B2 circuit model. That realization is the next required falsification step. Without it, this is a warning/necessary-condition result, not a circuit-family counterexample.

It also does not prove approximation hardness of fixed certificates, rule out sequential Monte Carlo with resampling, rule out dynamic programming on additional state, or imply any circuit lower bound.

## 4. Independent exact calculation

Wolfram 15.0.1 evaluated the complete binomial distribution for m=1..12 and simplified the variance formula to

    -1 + (34/25)^m.

No floating-point inference is used in the proof; the reported growth base 1.36 is only the decimal rendering of 34/25.

## 5. Next executable obligation

Construct or refute an actual B2 recursive gadget realizing a persistent two-state branch whose certificate-local continuation multiplicities reproduce a nontrivial product-weight spread. Exhaustively enumerate bounded depths and compare exact component counts, proposal probabilities, and importance-weight second moments. If realizable with exponential CV, then test whether augmenting the proposal state by the complete four-row side-parent column (only 16 states per live side signal) collapses the variance; if the number of simultaneously live side signals grows, quantify that frontier width rather than calling the problem hard.

No statement here resolves P versus NP.