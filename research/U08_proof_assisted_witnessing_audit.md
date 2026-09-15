# U08 — Proof-assisted witnessing: where the hard information must enter

Date: 2026-09-14
Status: verified partial structural analysis; no P versus NP resolution.

## 1. Question

U07 suggested giving the witness extractor not only a SAT-search circuit C but also a proof/certificate about C. Can this make same-length error extraction easy without assuming the missing hard step?

We separate three logically different proof types.

## 2. Type A: proof of a concrete error

Suppose P proves a statement of the form

    R(phi,a) AND NOT R(phi,C(phi))

for explicit phi,a.

Then extracting an error is trivial: read phi,a. But the proof already contains (or efficiently determines) the desired witness. This does not construct feasible witnessing from C alone; it relocates the search problem into proof production.

## 3. Type B: proof of existential incorrectness

Suppose P proves only

    EXISTS phi,a: R(phi,a) AND NOT R(phi,C(phi)).

A polynomial-time algorithm that, for every such proof in a proof system P, extracts phi,a is a witnessing/strategy-extraction property of P. It is not automatic from polynomial-time proof verification.

Proof verification checks that a supplied derivation is valid. Witness extraction additionally computes a satisfying assignment to the existential conclusion. Conflating these two operations would be a logical error.

For strong systems such as Frege/Extended Frege, assuming a general efficient extraction principle must therefore be justified separately; it cannot be inferred merely from Cook–Reckhow verifiability.

## 4. Lemma U08.1 — proof-assisted extraction plus efficiently constructible existential-error proofs gives the missing witnesser

Fix a proof system P. Suppose there are polynomial-time algorithms G and E such that:

1. whenever C is wrong on some satisfiable n-bit formula, G(C) outputs a valid P-proof pi_C of

       EXISTS phi,a: R(phi,a) AND NOT R(phi,C(phi));

2. from every proof pi_C produced by G, E(pi_C,C) outputs such an n-bit phi and valid a.

Then f(C)=E(G(C),C) is a polynomial-time same-length error witnesser.

### Proof

Composition of polynomial-time algorithms is polynomial time. Under the premise that C is wrong, G supplies a valid existential-error proof and E supplies the required witness. QED.

### Consequence

The pair (efficient proof production + efficient extraction) is not a weaker substitute for feasible witnessing; together they ARE feasible witnessing. Any proposal using both must identify which component contains genuinely new mathematics.

## 5. Lemma U08.2 — if the proof is extra advice, the model has changed

If pi_C is supplied externally and there is no polynomial-time construction of pi_C from C, then an efficient extractor E(C,pi_C) does not establish the Pich–Santhanam feasible-witnessing condition f(C). It establishes only a proof-assisted search algorithm whose running input includes extra information.

This extra proof may be polynomial in |C| and still be nonuniform/advice-like information unavailable to f(C). Therefore it cannot be silently omitted from the complexity accounting.

## 6. Type C: proof of global correctness/consistency principles

A more subtle possibility is a proof of a general principle about all inputs, from which an error can be derived when combined with C. But if a polynomial-time procedure constructs that proof for every C and a polynomial-time strategy extractor turns it into a concrete error whenever one exists, U08.1 applies again.

If the proof is instead a fixed theorem independent of C, then all C-specific information needed to locate an error must still be supplied by the extractor's analysis of C. The theorem may enable reasoning, but it cannot information-theoretically name an arbitrary unique error location by itself.

## 7. Connection to proof-complexity literature

The distinction above matches why feasible interpolation, strategy extraction, and witnessing are substantive properties of proof systems rather than consequences of proof checking. Known work obtains extraction for particular systems/settings, while strong systems such as Extended Frege are exactly where obtaining sufficiently powerful unconditional lower bounds or extraction consequences is difficult.

Müller–Pich study succinct circuit-lower-bound formulas expressed via feasible functions witnessing circuit errors and via anticheckers; this places error-witnessing itself inside the proof-complexity object rather than deriving it for free from a proof. Pich–Santhanam likewise take a polynomial-time witnessing function f as part of the hypothesis/axiom construction in their bridge toward SAT circuit lower bounds.

Recent Arteche–Khaniki–Pich–Santhanam work obtains proof-to-circuit consequences for implicit Extended Frege only under an efficiently provable derandomization/hardness assumption, illustrating that strong global proof reasoning does not currently supply the unconditional missing bridge.

## 8. Result of this route

Proof-assisted witnessing has not produced a new unconditional f(C). The audit identifies the exact circularity test:

- If the proof explicitly contains the error, proof production is the search problem.
- If it proves existential error only, efficient witness extraction is an additional nontrivial property.
- If both proof production and extraction are efficient, their composition is exactly the desired witnesser.
- If the proof is externally supplied, the computational model has gained advice/input and no longer proves feasible witnessing from C alone.

Thus the next useful direction should not keep moving the same witness between 'certificate', 'proof', and 'extractor'. We need a genuinely new structural source of information.

## 9. Next pivot

Return to the equality track in parallel. The separation-side feasible-witnessing route has now accumulated several precise barriers but no positive construction. A complementary high-information test is to formulate a concrete SAT algorithm based on structural decomposition (not generic memoization), then adversarially derive either a polynomial bound or an explicit exponential family. This preserves balance between P=NP and P!=NP attempts as required by the project prompt.

No statement here resolves P versus NP.