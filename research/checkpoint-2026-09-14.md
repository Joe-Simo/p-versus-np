# P versus NP research checkpoint — 2026-09-14

## Status

No complete proof of P = NP or P != NP has been found or verified.

This checkpoint initializes the dedicated `02-p-versus-np` workspace after confirming that the private GitHub repository `Joe-Simo/p-versus-np` is empty and that the local project workspace initially contained only the research prompt. No evidence from other mathematical projects is imported.

## Exact target and model contract

We use the standard worst-case uniform model in Stephen Cook's official Clay problem description.

- Fix a finite alphabet with at least two symbols; for convenience all languages are binary-encoded.
- A deterministic Turing machine is a decider only when it halts on every encoded input. Its worst-case running time on length `n` is the maximum number of transition steps over all strings of length `n`.
- `P` is the set of languages decided by one deterministic Turing machine with running time bounded by one fixed polynomial `n^k + k` for all input lengths.
- `NP` is the set of languages for which membership has polynomially bounded witnesses checked by one deterministic polynomial-time relation.
- Encodings of formulas and machines are finite self-delimiting binary strings. Malformed SAT encodings are rejected. Running time is measured in bit operations / Turing-machine steps on the complete encoding; integers or tables are not unit-cost if their bit lengths grow.
- `SAT` means Boolean formula satisfiability under a fixed polynomial-time parsable binary encoding. Cook's official description records SAT as NP-complete under polynomial-time reductions, so a deterministic polynomial-time SAT decider would imply `P = NP`.
- A separation must establish that some language in `NP` is not in deterministic polynomial time; no finite list of hard instances suffices.

## Current official status and prize procedure

Checked on 2026-09-14:

1. Clay Mathematics Institute currently labels P vs NP **Unsolved**.
2. CMI allocates US$1,000,000 to each Millennium Prize Problem.
3. CMI's current rules say it does not accept direct submissions; before CMI considers a proposed solution, it must be published in a qualifying outlet, at least two years must pass, and the work must receive general acceptance in the global mathematics community.

Primary URLs:
- https://www.claymath.org/millennium/p-vs-np/
- https://www.claymath.org/wp-content/uploads/2022/06/pvsnp.pdf
- https://www.claymath.org/millennium-problems/
- https://www.claymath.org/millennium-problems/rules/

## Barrier map from original / primary literature

### Relativization

Baker, Gill, Solovay (SIAM J. Comput. 4 (1975), 431–442, DOI 10.1137/0204037) construct recursive oracles `A,B` with `P^A = NP^A` and `P^B != NP^B`. Therefore any proof method whose reasoning relativizes uniformly cannot by itself settle unrelativized P versus NP.

This is a restriction on a method, not a proof that P versus NP is inaccessible.

### Natural proofs

Razborov and Rudich, *Natural Proofs* (STOC 1994; JCSS 55 (1997), 24–35, DOI 10.1006/jcss.1997.1494) define a broad class of constructive-and-large circuit lower-bound properties and show, under pseudorandom-generator hardness assumptions, that such natural proofs cannot yield the desired superpolynomial lower bounds against general circuits.

The barrier is conditional in its strongest general-circuit form and does not rule out non-natural lower-bound arguments.

### Algebrization

Aaronson and Wigderson, *Algebrization: A New Barrier in Complexity Theory* (ECCC TR08-005, 2008), show that many major techniques that overcome ordinary relativization still algebrize, and that P versus NP cannot be resolved by an algebrizing proof. Again this is a method barrier rather than a theorem about the truth value of P versus NP.

## Three active routes

### Route A — exact SAT state compression

**Central move.** Search for a deterministic SAT algorithm whose branching states collapse to only polynomially many canonical residual subproblems.

**First uncertain implication.** Does canonicalization / memoization force only polynomially many semantically distinct residual formulas on every input?

**Cheapest decisive test.** Construct a linear-size CNF family with exponentially many distinct residual Boolean functions after assigning a chosen variable block.

**Result of test: FAILED for residual-deduplication alone.** See Lemma A1 below.

### Route B — circuit/refuter lower bounds

**Central move.** Prove a constructive lower bound: given a candidate polynomial-time algorithm or small circuit, efficiently construct an input on which it errs.

**Established connection.** If `SAT notin P/poly`, then `P != NP`, because `P = NP` would put SAT in `P`, and every language in `P` has polynomial-size circuit families. Chen–Jin–Santhanam–Williams (TheoretiCS 3 (2024), DOI 10.46298/theoretics.24.3) also show that constructiveness of certain already-known restricted lower bounds would imply major general lower bounds, including P != NP in some settings; the paper emphasizes that producing hard instances is itself a central obstacle.

**First uncertain implication.** Find a non-natural, non-algebrizing mechanism that turns a weak-model lower bound into an efficiently constructible hard instance against unrestricted polynomial computation.

### Route C — proof complexity / Cook–Reckhow

**Central move.** Use lower bounds on propositional proof lengths to separate complexity classes.

Cook–Reckhow (JSL 44 (1979), 36–50) show: `NP` is closed under complement iff `TAUT` has a polynomially bounded propositional proof system. Thus proving that **every** propositional proof system has superpolynomial lower bounds would prove `NP != coNP`, and therefore `P != NP`.

A lower bound for one concrete system such as Extended Frege is not enough by itself, because a different stronger proof system might still be polynomially bounded. Pich–Santhanam, *Towards P≠NP from Extended Frege lower bounds* (JACM 73 (2026), DOI 10.1145/3801091), develops extra bridge conditions under which Extended Frege lower bounds can imply SAT circuit lower bounds; those bridge conditions are themselves nontrivial obligations rather than an existing P != NP proof.

## Substantive derivation A1 — exponential residual-state family

### Lemma A1

For every integer `m >= 1`, let

`F_m = AND_{i=1}^m (x_i OR y_i)`.

The formula has size `O(m)`. After assigning all variables `x_1,...,x_m`, the set of simplified residual Boolean functions on `y_1,...,y_m` has cardinality exactly `2^m`.

### Proof

For an assignment `a in {0,1}^m` to the `x` variables, clause `(x_i OR y_i)` disappears when `a_i=1`, and becomes the unit clause `y_i` when `a_i=0`. Therefore the residual is

`R_a(y) = AND_{i : a_i=0} y_i`.

Each subset `S subseteq {1,...,m}` occurs by taking `S={i:a_i=0}`. If `S != T`, choose `j` in the symmetric difference. Setting `y_j=0` and all other `y_i=1` makes one of `AND_{i in S} y_i` and `AND_{i in T} y_i` false while the other is true. Hence the residual functions are pairwise semantically distinct, giving exactly `2^m` residuals. QED.

### Consequence

Any proposed polynomial-time SAT mechanism whose only reason for avoiding the `2^m` assignment tree is that canonicalization or memoization will merge all but polynomially many residual formulas is false. This lemma does **not** prove SAT requires exponential time: `F_m` is easy and a stronger algorithm can recognize satisfiability without exploring all residuals.

### Independent bounded check

`code/residual_state_check.py` exhaustively enumerates all `2^m` assignments for `1 <= m <= 18`, canonicalizes the residuals as tuples of remaining unit clauses, and verifies the exact count `2^m` in every case. Log: `research/residual_state_check.log`.

The finite computation is only a checker for the closed-form lemma; the proof above supplies the all-`m` statement.

## Substantive derivation S1 — why direct universal polynomial-time diagonalization stalls

A tempting separation idea is to enumerate all alleged polynomial-time deciders as pairs `(M,k)`, where `M` is claimed to run in at most `n^k` steps, and define a universal language that simulates `M` on its own encoded input and flips the answer.

### Lemma S1 (clock-exponent obstruction)

Suppose a single deterministic machine `U` has a fixed polynomial running-time bound `O(n^c)`. If, on inputs encoding arbitrary pairs `(M,k)` with unbounded `k`, `U` literally simulates `M` on the **same length-`n` input** for up to `n^k` steps before flipping the result, then `U` cannot satisfy its `O(n^c)` bound on all such inputs.

### Proof

Choose any encoded pair with `k>c` and a machine `M` whose simulated computation actually lasts `n^k` steps on infinitely many such inputs. A step-by-step universal simulation requires at least one simulation operation per simulated step (up to a fixed/polylog overhead), hence at least `n^k` work, which eventually exceeds every constant multiple of `n^c`. QED.

### Padding audit

Padding can make a simulation of `M` on a **shorter core string** polynomial in the padded length, but that no longer diagonalizes against `M`'s behavior on the actual padded input. If `M` is still simulated on the full padded input of length `N`, its declared time is `N^k`; padding does not turn an unbounded exponent `k` into one fixed exponent `c`.

### Consequence

The direct diagonalization that separates fixed time classes does not automatically lift to `P = union_k DTIME(n^k)`: a universal diagonalizer must handle unbounded clock exponents, which defeats a fixed polynomial running-time guarantee. This records the earliest concrete failure of this structural route; it does not rule out non-relativizing diagonalization variants.

## Current research judgement

The strongest immediate direction is Route B/C at their interface: seek an explicit constructive hard-instance/refuter principle that is strong enough to imply a SAT circuit lower bound but avoids merely restating `SAT notin P/poly`. The recent Pich–Santhanam and Chen–Jin–Santhanam–Williams results provide precise modern bridge targets and expose where a new lemma would have to do genuine work.

## Open obligations

1. Formalize one candidate refuter principle with exact quantifiers and prove whether it would imply `SAT notin P/poly` or only a restricted lower bound.
2. Check that the candidate principle is not a natural property in the Razborov–Rudich sense and does not relativize/algebrize in a way already blocked by known oracle constructions.
3. Attempt a construction or adversarial refutation of that principle on a restricted but nontrivial circuit class, preserving the exact missing bridge to general circuits.
4. Continue an independent equality track: any candidate SAT compression rule must be attacked with explicit exponential residual families, adversarial unsatisfiable instances, and bit-complexity accounting before it is promoted.

## Artifact inventory

- `research/checkpoint-2026-09-14.md` — this checkpoint.
- `code/residual_state_check.py` — exact bounded checker for Lemma A1.
- `research/residual_state_check.log` — actual completed output for `m=1..18`.

No complete P versus NP candidate exists at this checkpoint.
