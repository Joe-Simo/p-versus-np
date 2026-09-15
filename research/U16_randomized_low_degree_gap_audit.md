# U16 — Randomized/low-degree polynomial SAT route: exact gap audit

Date: 2026-09-14
Status: verified structural obstruction/route refinement; no P versus NP resolution.

## 1. Target

After U12–U15, test whether low-degree or randomized polynomial information can distinguish SAT from UNSAT without explicitly preserving all models, all residual functions, or exact #SAT.

The strongest possible decision gap is tiny: an n-variable satisfiable formula may have exactly one satisfying assignment, while an unsatisfiable formula has zero.

## 2. Lemma U16.1 — additive approximation requires exponential precision in the unique-solution regime

Let p(F)=#SAT(F)/2^n be the acceptance probability of F under a uniform random assignment. Any procedure guaranteed to distinguish UNSAT from every satisfiable n-variable formula solely from an additive approximation q satisfying |q-p(F)|<epsilon must have epsilon<2^{-(n+1)} in the worst case.

### Proof

UNSAT has p=0. A uniquely satisfiable formula has p=2^{-n}. If epsilon>=2^{-(n+1)}, the admissible approximation intervals around 0 and 2^{-n} intersect (at 2^{-(n+1)} when equality is allowed, and arbitrarily near it otherwise). Hence such an additive approximation cannot guarantee distinction. QED.

This does not prove computing such precision is hard; it shows that inverse-polynomial additive approximation is insufficient for exact SAT.

## 3. Lemma U16.2 — naive uniform sampling needs exponential samples for constant success on unique-SAT

Consider the algorithm that samples t independent uniform assignments and accepts iff one satisfies F. On a formula with exactly one satisfying assignment, its success probability is

    1-(1-2^{-n})^t <= t/2^n.

Therefore success probability at least 2/3 requires t >= (2/3)2^n.

### Proof

The exact expression is elementary. The upper bound is the union bound (or Bernoulli inequality). QED.

Thus random assignment sampling cannot supply a polynomial-time exact SAT algorithm.

## 4. Low-degree polynomial approximations: what they can and cannot immediately do

Low-degree polynomial representations are powerful for restricted circuit classes and underlie nontrivial SAT/#SAT algorithms and circuit lower bounds. But for unrestricted CNF SAT, an approximation that is only pointwise/high-probability or average-case accurate does not automatically preserve the existential event 'there exists one satisfying assignment.' A single exceptional Boolean point can decide SAT.

Any proposed randomized polynomial route must therefore provide one of:

1. a one-sided guarantee preserving every satisfying assignment;
2. an isolation/amplification transformation that converts existence of one witness into a detectable global signal while preserving polynomial complexity;
3. exact enough aggregate computation to detect a 2^{-n} mass;
4. a different algebraic certificate whose nonzeroness can be tested efficiently without expanding to exact #SAT.

Without such a mechanism, average approximation is insufficient.

## 5. Important opening: isolation rather than approximation

The obstruction suggests a materially different route: amplify a single witness before applying algebraic/global statistics. Valiant–Vazirani-style hashing is the canonical conceptual mechanism: randomized constraints can isolate a witness with inverse-polynomial probability. However, isolation reduces general SAT to a unique-witness promise; it does not by itself make unique-SAT easy. U16.2 shows that uniform sampling remains exponential even after uniqueness.

Thus the useful question is not merely 'can we isolate?' but 'after isolation, is there an algebraic invariant that detects a unique solution in polynomial time?'

## 6. Literature alignment

Recent #SAT algorithm work for restricted threshold/circuit classes explicitly uses polynomial representations and probabilistic rank, while Williams-style algorithms-to-lower-bounds results show that even modest improvements over exhaustive search for circuit SAT can imply major circuit lower bounds. This validates polynomial representation as a serious technique, but also warns that extending it from restricted classes to unrestricted circuits would cross major known frontiers.

## 7. New research target

Study the unique-solution algebraic case directly. Encode a Boolean formula F by a polynomial over a finite field whose value/nonzeroness is tied to existence of a unique Boolean root, then test whether randomized polynomial identity testing can detect that root without constructing an exponentially large polynomial.

The decisive audit is to distinguish:

- polynomial identity testing of an explicitly/compactly represented polynomial, which can be randomized efficiently in many settings;
- existence of a Boolean point where a polynomial system vanishes/nonvanishes, which is a different problem and can retain NP hardness.

Do not conflate these.

No statement here resolves P versus NP.