# U66 — Exact sampled-column factor graph and bounded-width raw-circuit sampler

Date: 2026-09-16. Status: self-contained exact counting/sampling representation with executed finite checks. No unrestricted four-row FPRAS, general-circuit lower bound, P-versus-NP resolution, formal-kernel verification, independent expert certification, or novelty claim.

## 1. Exact local factor

Fix `q>=1` sampled input rows and a supplied acyclic single-output topology with `s` free B2 gates. The sixteen two-input Boolean tables are equally distinct raw gate types; repeated predecessors and fan-out are allowed. Initial-signal sampled columns are fixed.

For q-bit parent columns `A,B` and a proposed q-bit child column `H`, define

    phi(A,B,H) = #{ g:{0,1}^2->{0,1} : g(A_i,B_i)=H_i for every sampled row i }.

Let `d(A,B)` be the number of distinct pairs `(A_i,B_i)` occurring on the sampled rows. Then

    phi(A,B,H) = 0

if two rows have the same parent pair but different H-bits, and otherwise

    phi(A,B,H) = 2^(4-d(A,B)).

Proof: every observed parent pair fixes one truth-table entry of `g`; consistency is exactly the stated block-constancy condition, and the remaining `4-d` entries are free. This counts raw B2 tables, not semantic functions after quotienting unused entries.

The TypeScript and independent Wolfram checks compare this formula with literal enumeration of all sixteen gate tables for all `16^3=4096` four-row triples `(A,B,H)`.

## 2. Global partition-function identity

Create one variable `X_j in {0,1}^q` for the sampled output column of each gate `j`. If a parent of gate j is an initial signal, substitute its fixed column; if it is another gate, use the corresponding variable.

For a target sampled output column `Y`, the exact number of raw gate-type assignments is

    Z(Y) = sum_X  1[X_out=Y] * product_j phi(X_p(j), X_q(j), X_j).        (1)

If the designated output is an initial signal, the indicator is evaluated directly and every unused gate contributes its ordinary factor through the same product/sum.

**Proof.** Fix one complete assignment of sampled columns to all gate outputs. For each gate, `phi` is exactly the number of its sixteen raw tables compatible with its two already specified parent columns and specified child column. Gate-table slots are independent syntactic choices, so the number of raw type words inducing that complete column assignment is the product of the local `phi` factors. Different complete column assignments induce disjoint raw type-word sets. Summing proves (1).

This keeps reconvergent sharing exactly once. No parent occurrence is duplicated into a formula branch.

## 3. Variable elimination and its charged width

The factor for gate `j` contains at most three gate variables: its child and whichever parents are themselves gates. Add the target unary factor. Form the ordinary primal graph by making every factor scope a clique.

Let an explicit elimination order have induced width `w`, and let `D=2^q`. Bucket/variable elimination evaluates (1) using tables on at most `w+1` live variables. A direct bound is

    poly(s,q) * D^(w+1) = poly(s,q) * 2^(q(w+1))

integer operations. Every count is at most `16^s`, so exact integers have `O(s)` bits; charging bigint arithmetic preserves fixed-parameter tractability in `q*w`.

Consequences:

- fixed q and constant w: polynomial exact counting;
- q=4 and `w=O(log s)`: polynomial exact counting for any supplied order with that bound;
- this is not a polynomial algorithm for arbitrary shared topologies, because w may be linear.

The implementation uses a min-fill order only as a finite-test heuristic. No claim is made that it computes optimal treewidth.

## 4. Exact uniform raw-description sampling

Unary factors fixing already chosen gate columns do not increase the primal width. Therefore a deterministic rank/unrank sampler can repeatedly compute the exact branch masses for the at most `D` possible columns of the next gate and select the branch containing the requested rank.

After all sampled columns are fixed, gate `j` has exactly `phi_j` compatible raw B2 tables. Enumerate those at most sixteen tables and unrank the remaining product lexicographically.

For a complete column assignment X, the first stage selects it with weight `product_j phi_j`; the second stage selects each of those `product_j phi_j` raw type words once. Hence every compatible raw description has exactly one rank in `[0,Z(Y))`. A randomized exact sampler follows by choosing a uniform integer rank.

The executable audit replays 264 declared ranks. This is bounded evidence for the implementation; the uniformity proof is the algebraic rank argument above.

## 5. Rare-event and shared-correlation checks

### Rare repeated-predecessor chain

Start with the balanced four-row column `Y=1100`. For m gates, each gate takes the previous signal twice, and the last gate is the output. Once the signal becomes constant it can never become nonconstant again. From a nonconstant signal, exactly eight of the sixteen B2 tables keep it nonconstant, and the final nonconstant orientation is balanced between `Y` and its complement. Thus for `m>=1`

    Z_m(Y) = 8^m / 2,
    Pr[output=Y] = 2^(-(m+1)).

Literal enumeration and the factor calculation agree for m=1..4: counts `4,32,256,2048`. The induced widths are 0,1,1,1. This is an exponentially rare target on which direct rejection degrades, while exact bounded-width inference remains small.

### Shared diamond

Use initial columns `0011,0011,0101` and prefix

    h = f(I0,I1),
    a = g(h,I2),
    b = k(h,I2),

followed by a final free gate on `(a,b)` with target `1100`.

Among the `16^3=4096` prefix type words, the balanced-support event from U64 holds 672 times. Integrating the final gate gives exact weighted count 1,344. If the two parent marginals are incorrectly treated as independent, the corresponding predictions are 720 and 1,440. Thus separate marginal calculations cannot replace the shared-prefix factor graph.

## 6. Executed evidence

Main TypeScript `code/u66_u67_audit.ts`:

- all 4,096 four-row local factor entries checked against literal B2 tables;
- 65 complete raw-enumeration comparisons (the four rare chains, shared diamond, and 60 seeded small topologies);
- 264 exact rank/replay checks;
- 40 duplicated-row transfer checks used again in U67;
- shared-diamond exact values `672,1344` versus independent-marginal predictions `720,1440`.

Independent Python `code/u66_u67_independent.py` uses forward expansion of complete sampled-column tuples rather than variable elimination, followed by literal raw enumeration on the bounded cases. It independently reproduces all declared counts before reading the TypeScript result.

Wolfram 15.0.1 independently checks all 4,096 local entries, the four chain formulas, the diamond values and all 16 one-gate duplicated-column pairs. Its first call had an avoidable symbol warning; the clean second call is the counted evidence.

The initial TypeScript revision failed strict compilation before execution because of unchecked-array/unused-variable diagnostics. Those were corrected; no failed executable result is counted as evidence.

## 7. Scope

Equation (1) is an exact representation, not a lower bound. Exponential table width for one elimination scheme is not evidence that all algorithms need exponential time. Conversely, easy zero detection from U64 does not evaluate the nonzero partition function.

U67 uses this representation to audit the proposed Karp-Luby union step and to classify exact balanced four-row counting. The open approximation problem is still arbitrary-width, genuinely four-distinct-row quantitative counting.
