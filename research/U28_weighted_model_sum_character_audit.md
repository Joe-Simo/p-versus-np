# U28 — Succinct weighted witness sums: separable and Fourier weights do not bypass constrained summation

Date: 2026-09-14
Status: exact reduction/audit; no P versus NP resolution.

## 1. Target after U27

Study succinct weights r(a) for the aggregate

    S_r(F)=sum_{a:F(a)=1} r(a).

Can some easily described r make S_r polynomial-time computable for arbitrary CNF while preserving SAT nonzeroness?

## 2. Product-separable weights contain #SAT as a special case

Let

    r(a)=product_i r_i(a_i).

Choosing r_i(0)=r_i(1)=1 gives r(a)=1 for every assignment and

    S_r(F)=#SAT(F).

Therefore there cannot be a general theorem saying that all product-separable weighted sums over arbitrary CNF are polynomial-time computable unless #SAT itself is polynomial-time computable (which would in particular imply P=NP).

Separability of the weight does not separate the CNF constraints.

## 3. Fourier characters are equally constrained

For s in {0,1}^n define the parity character

    chi_s(a)=(-1)^{s dot a}.

Then

    S_s(F)=sum_{a:F(a)=1} chi_s(a)

is (up to normalization convention) a Fourier coefficient of the Boolean indicator of F. The trivial character s=0 is exactly #SAT(F).

For nontrivial s, S_s(F) can vanish even when F is satisfiable because witnesses of opposite parity cancel. Hence one fixed nontrivial character does not give one-sided SAT detection.

Wolfram verified two-point examples where nonempty satisfying sets have zero sum for selected characters.

## 4. All Fourier coefficients recover the function but are exponential

The full set of 2^n character sums is the Walsh-Hadamard transform of the truth table and therefore determines the Boolean function exactly. But materializing all coefficients is exponential.

Keeping polynomially many predetermined characters cannot be justified by a simple 'some coefficient must be nonzero' argument: although every nonzero Boolean function has at least one nonzero Fourier coefficient, that coefficient may lie outside the chosen subset. The trivial character avoids this over characteristic zero because it equals the positive model count, but computing it is #SAT.

## 5. Low tensor-rank weights

A sum of t product-separable weights,

    r(a)=sum_{j=1}^t product_i r_{j,i}(a_i),

with polynomial t remains succinct, but computing S_r requires a sum of t constrained partition functions. The t=1 all-ones instance already contains #SAT, so low tensor rank of the weight alone gives no universal tractability.

This does not rule out a specially chosen weight family whose algebra interacts with clause structure in a useful way; it rules out inferring tractability solely from low rank/separability of r.

## 6. Core lesson

The exponential object is not necessarily the weight, projection, or output dimension. A one-dimensional, constant weight already carries perfect SAT information over characteristic zero. The hard operation is contracting that weight against the CNF-defined witness set.

In tensor-network language, simple local tensors can define a globally hard contraction because the constraint network, not the local tensor rank, controls contraction complexity.

## 7. Next pivot

The equality-side program has repeatedly rediscovered constrained summation in different representations. Continuing to rename it is low-information. Return to the separation side with the new structural lesson: seek a lower bound against a restricted but expressive model of exact witness contraction (e.g. bounded-width tensor/branching representations), where unconditional lower bounds are possible, and then audit whether a hardness-magnification theorem can lift that restricted lower bound toward general circuits without assuming the desired conclusion.

No statement here resolves P versus NP.