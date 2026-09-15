# U06 — Global-certificate barrier from one-point corruption

Date: 2026-09-14
Status: verified conditional structural lemma; no P versus NP resolution.

## 1. Motivation

U05 left a possible escape: use the full circuit description to construct a polynomial-size globally checkable object P(C), rather than probing only polynomially many SAT inputs. This note asks what such a global certificate must accomplish on the one-point-corruption family.

## 2. Setup

Fix an input length n and a SAT-search verification relation R(phi,a). Assume there is a correct search circuit D on all n-bit formulas in the chosen domain. Let S be a set of satisfiable n-bit formulas. For each x in S, let C_x be a circuit that agrees with D everywhere except x, where it returns an invalid witness. Assume the target circuit-size budget is large enough to contain these O(n)-overhead corruptions.

Let A be any deterministic polynomial-time description-sensitive witnesser. A receives the complete circuit description of C and must output an n-bit formula phi(C) and a valid satisfying assignment a(C) such that, whenever C is wrong on some satisfiable n-bit formula, C fails on phi(C).

## 3. Lemma U06.1 — exact recovery on the local-corruption family

For every x in S,

    phi(C_x) = x.

### Proof

C_x has exactly one search error on satisfiable inputs, namely x. A is required to output an error input of C_x. Therefore its output input must be x. QED.

This elementary observation is stronger than a generic statement that A must distinguish the circuits: on this family A computes the inverse map

    C_x -> x.

Thus feasible same-length witnessing contains, as a subproblem, polynomial-time recovery of the hidden corruption location from the syntax of a circuit that is otherwise an arbitrary correct solver.

## 4. Lemma U06.2 — any sound global certificate must bind to the corruption location

Suppose A factors as

    C -> P(C) -> phi(C),

where P(C) is any intermediate certificate/object and the second map uses only P(C). Then P is injective on {C_x : x in S}; hence if P(C) is represented by r bits,

    r >= ceil(log_2 |S|).

This recovers U04 for arbitrary global certificates, not only objects called summaries.

More importantly, if P is not required to determine phi by itself, but a verifier V(C,P,phi,a) is claimed to certify that phi is an error using the full circuit description, then soundness on C_x still forces every accepted tuple to have phi=x. Therefore either the construction of P/phi or the verification relation must exploit syntactic information that distinguishes the unique exceptional branch x from all other inputs.

The certificate cannot establish error merely from a global aggregate property shared by all C_x while leaving the exceptional input unidentified.

## 5. Syntactic-location caveat

For the explicit corruption construction used in U02, x is literally hardwired into an equality-test subcircuit. A white-box algorithm can recover x by parsing that specially presented circuit. Therefore the local-corruption family is NOT by itself a lower bound against arbitrary description-sensitive algorithms: circuit syntax may leak the answer.

This is a crucial correction to an over-strong interpretation of U02–U05. Those units prove barriers for black-box probing, short summaries, direct self-embedding, and transcript-only certificates, but they do not prove that white-box witnessing is hard.

Any genuine lower bound on white-box witness extraction would need a representation-robust family in which the error location is not trivially encoded in a canonical syntactic location, or a theorem showing that recovering it from arbitrary equivalent circuit descriptions is computationally hard. Establishing such hardness unconditionally would itself approach major circuit/minimization or P-versus-NP difficulties.

## 6. Consequence for the active route

The correct next question is therefore not simply whether a global certificate exists. It is whether one can exploit arbitrary circuit syntax in a representation-independent way to force a SAT error.

Two directions remain mathematically meaningful:

1. Normalize or canonicalize circuits sufficiently to expose semantic inconsistencies. But exact semantic canonicalization risks being at least as hard as circuit equivalence/minimization and cannot be assumed polynomial-time.
2. Use proof complexity to reason about the circuit's claimed correctness without canonicalizing it. Pich–Santhanam's witnessing formulas are designed precisely to express this global claim, but their work treats feasible witnessing as an additional condition rather than supplying an unconditional witnesser.

## 7. Research-state correction

The strongest valid statement after U06 is:

- black-box and transcript-local strategies are eliminated by the local-corruption adversary;
- direct full self-embedding and o(n)-bit output-determining compression are eliminated by information bounds;
- arbitrary white-box extraction remains open because syntax can reveal information invisible to black-box methods.

Therefore no claim that 'all same-length witnessing strategies are blocked' is justified.

## 8. Next obligation

Investigate representation robustness. Construct pairs/families of polynomial-size circuits computing the same near-correct SAT-search function but with substantially different syntax, and determine whether a polynomial-time normalization sufficient for witness extraction would imply an independently hard problem such as general circuit equivalence, minimization, or a known meta-complexity task. Keep any implication exact; do not assume those problems are unconditionally hard.

No statement in this note separates P from NP.