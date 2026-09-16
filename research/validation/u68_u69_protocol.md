# U68-U69 execution protocol

Date: 2026-09-16.

1. Preserve U64-U67 unchanged and continue from checkpoint U67.
2. Derive the exact Walsh/Fourier character moments of one fresh uniform B2 output gate on four sampled rows; check every parent-column pair and every character against literal enumeration of all sixteen gate types.
3. Decompose the four-row even character into the three row pairings, keeping overlap terms exact. Derive the balanced-target Fourier formula and compare it to a pointwise nonnegative collision/separation formula for all six balanced targets and all parent-column pairs.
4. Build a repeated-predecessor chain where the Fourier expression has exponentially severe cancellation. Quantify the residual exactly; do not infer an algorithmic lower bound from cancellation alone.
5. Test the remaining favorable-prefix language itself against the exact-NFA strategy. Adapt the U62 equality slice so that a balanced target is favorable iff the two encoded m-bit words are equal. Prove the resulting favorable-prefix language needs at least 2^m NFA states.
6. Separately test whether that same full favorable-prefix language is nevertheless dense enough for trivial rejection sampling. If so, record the representation barrier without turning it into approximation hardness.
7. Implement independent TypeScript, Python and Wolfram checks. Failed compile/evaluator drafts must be preserved or explicitly excluded from evidence. No finite check may be presented as the proof of the asymptotic NFA lower bound.
