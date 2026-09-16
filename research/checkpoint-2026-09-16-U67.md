# P versus NP — checkpoint after U64-U67

Date: 2026-09-16. **We have not solved P versus NP yet.** No complete candidate, formal-kernel certification, independent expert verification, or authenticated novelty claim exists.

## Scope and continuity

Assigned folder `/mnt/data/02-p-versus-np`; private repository `Joe-Simo/p-versus-np`, branch `main`. The remotely confirmed starting head for this continuation was `20c3870f84a7da8a88c2859aaba776230586b402` (U62-U63). U64-U65 were already executed locally in the interrupted continuation and have now been preserved/package-audited before U66-U67. Existing prior artifacts were not overwritten.

The governing prompt remains `/mnt/data/02-p-versus-np/RESEARCH_PROMPT.txt`, SHA-256 `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. No sibling project was inspected or changed. No spending, publication, outside researcher contact, prize submission, visibility change, or background task occurred.

The official Clay P-versus-NP page was checked on 2026-09-16 and still marks the problem **Unsolved**: https://www.claymath.org/millennium/p-vs-np/ .

## U64-U65 preserved result

**U64.** With at most four sampled rows, free B2-gate feasibility after any whole-gate prefix collapses exactly to reachable fixed information: the target is feasible iff it is constant on the equivalence classes induced by fixed leaves that can reach the output. The proof uses the four-edge partition-compression lemma plus a selected fanout-free arborescence. Balanced 2-versus-2 final-gate support is affine: normalized target `y` is feasible from normalized parents `a,b` iff `a=y OR b=y OR a+b=y`.

**U65.** Five rows are sharp for that topology-oblivious feasibility collapse: an explicit two-gate topology has five fully distinguished leaf tuples but cannot realize the declared target, while a regrouped topology can. Even at four rows, same reachable information/budget need not give the same completion count (explicit 8-versus-4 pair).

## U66: exact local-factor partition function

For arbitrary q sampled rows, parent columns A,B and child column H, the number of raw B2 tables realizing H is zero if H is inconsistent on a repeated `(A_i,B_i)` block, and otherwise is `2^(4-d(A,B))`, where d is the number of distinct observed parent pairs.

Introducing one `2^q`-state variable for each gate's sampled output column gives an exact factorization

`Z(Y)=sum_X 1[X_out=Y] product_j phi_j`.

This counts every raw type word exactly once and keeps reconvergent sharing shared. Given an elimination order of induced width w, exact variable elimination costs `poly(s,q)*2^(q(w+1))` table work with O(s)-bit counts. Unary column pins preserve width, so exact rank/unrank yields a uniform raw-description sampler with the same fixed-parameter character.

At q=4 this is polynomial for any supplied order with `w=O(log s)`. It is not a polynomial algorithm for arbitrary topology width, and the implementation's min-fill order is only a heuristic order, not an optimal-treewidth certificate.

## U67: Karp-Luby audit and exact classification

For a balanced target, U64's positive support union is `E1 OR E2 OR E3` with `E1:a=y`, `E2:b=y`, `E3:a+b=y`. This does not yet instantiate a Karp-Luby union estimator: component E1 on an arbitrary prefix is already the original balanced four-row output-shape counting/sampling problem (up to the explicit complement-orientation factor and any fully unconstrained later slots). The union representation therefore moves, rather than solves, the missing quantitative primitive.

Exact balanced four-row fixed-topology type counting is #P-complete under polynomial-time Turing reductions. The reduction composes U59's two-row exact hardness with a parsimonious row duplication: two source rows become four rows in duplicated pairs and target `01` becomes `0011`. If distinct sample inputs are required, append unused dummy input bits so the four full assignments are distinct while the topology evaluates them in pairs. Membership in #P is direct.

This exact hardness is **not** approximation hardness. The duplicated-row subclass is still effectively a two-row instance and therefore retains U59's literature-based FPRAS. No #BIS-hardness, NP=RP consequence, or absence of an FPRAS is claimed for genuinely four-distinct-row balanced instances.

## Executed evidence

TypeScript `code/u66_u67_audit.ts`:
- all 4,096 four-row local `(A,B,H)` factor entries checked against literal enumeration of all sixteen B2 tables;
- 65 complete raw-enumeration comparisons: four rare repeated-predecessor chains, one shared diamond, and 60 seeded small topologies;
- 264 exact rank/replay checks;
- 40 duplicated-row transfer checks;
- rare-chain counts `4,32,256,2048` for m=1..4, matching `8^m/2`;
- shared-diamond favorable-prefix count `672` and weighted target count `1344`, versus invalid independent-parent predictions `720` and `1440`.

Independent Python uses forward expansion over complete sampled-column tuples and literal raw enumeration, not variable elimination. It reproduces the local factors, chains, diamond, 60 random cases, and 40 duplication cases before reading the TypeScript result.

Wolfram 15.0.1 independently checks all 4,096 local factor entries, all four chain formulas, the diamond values, and every one-gate duplicated two-column pair. Its first invocation had an avoidable global-symbol warning; the clean second invocation returned `AllPass -> True` without warnings/errors/timeouts and is the counted evidence.

The first TypeScript revision failed strict compilation before execution because of unchecked-array and unused-variable diagnostics. The corrected source passes strict/no-unused compilation. Failed compiler output is not counted as mathematical evidence.

## Source audit

Karp-Luby-Madras, *Monte-Carlo Approximation Algorithms for Enumeration Problems*, Journal of Algorithms 10 (1989), 429-448, DOI 10.1016/0196-6774(89)90038-2, was checked as the classic DNF/union-of-sets approximation source. We use it only to motivate the union-method prerequisites; U66-U67's mathematical identities do not depend on an unverified theorem from that paper.

The current full-target reference remains Oliveira-Pich-Santhanam 2021, Theorem 1.4: the needed magnification premise is an ordinary general-circuit `N^(1+epsilon)` lower bound for one fixed epsilon and every sufficiently small beta. Fixed-q counting structure does not establish that premise.

## What the finite examples show

A repeated-predecessor chain has target density `2^(-(m+1))`, so rarity alone can be exponential even at induced width one; U66 still counts it exactly. A shared-diamond prefix shows that separate parent marginals are quantitatively wrong because the parents share an ancestor. Thus neither naive rejection nor independence multiplication is the correct general mechanism.

## Next executable obligation

Analyze the four-row factor model in the Fourier/equality basis before trying another generic sampler. For a fresh random B2 output gate, derive the exact even-character moments: each two-row character should become a parent-pair collision event, while the four-row character should be the event that every used parent-pair block has even multiplicity. Decompose that four-row event into the three pairings of four rows and test whether its component counts reduce to known two-terminal reliability/unreliability problems or retain genuinely shared multi-pair structure.

Then test whether the balanced-target probability can be rewritten as a **positive** combination of those collision events without catastrophic subtraction. If not, build an explicit cancellation family and quantify it. Do not infer approximation hardness merely from exact #P-completeness or from one exponential-width elimination order.

The growing anti-checker/magnification objective remains open. No complete P-versus-NP candidate exists, and no process continues after this checkpoint.
