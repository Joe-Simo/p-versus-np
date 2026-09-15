# U07 — Representation robustness: semantic invariance, circuit equivalence, and what remains open

Date: 2026-09-14
Status: verified partial structural analysis; no P versus NP resolution.

## 1. Target after U06

U06 corrected the local-corruption argument: a white-box witnesser may read a syntactically exposed corruption location. We now ask whether requiring representation robustness changes the problem.

Let C and C' be SAT-search circuits with the same n input bits and output convention. Write C ≡ C' when they compute exactly the same output string on every n-bit input.

A correct error witnesser need not itself be syntactically invariant: it may output different error inputs for equivalent circuits when the common function has multiple errors. But if the common function has exactly one satisfiable error x, then correctness forces every representation to yield x.

## 2. Lemma U07.1 — unique-error functions force semantic invariance automatically

Suppose a search function F has exactly one satisfiable input x on which R(x,F(x)) fails. Let C and C' be arbitrary circuit representations of F. Then every correct same-length error witnesser A satisfies

    phi(A(C)) = phi(A(C')) = x.

### Proof

A(C) must output an error input of F; x is the only one. The same holds for C'. QED.

Thus obfuscating or rewriting the syntax of a unique-error circuit does not change the mathematical target: the witnesser must recover the same semantic location from every representation.

## 3. Circuit equivalence is a semantic universal condition

For two Boolean circuits C,C' with identical arity, non-equivalence has an NP witness: an input z such that C(z) != C'(z). Therefore equivalence belongs to coNP under standard encodings.

Moreover, Boolean circuit equivalence is coNP-hard by the elementary reduction from TAUT: given a Boolean formula/circuit F, compare F with the constant-1 circuit. They are equivalent iff F is a tautology. Hence circuit equivalence is coNP-complete (for ordinary Boolean circuit/formula encodings with polynomial-time evaluation).

This is an unconditional classification, not an unconditional lower bound: coNP-completeness does not prove that equivalence is outside P unless P != NP/coNP is already known.

## 4. Lemma U07.2 — full semantic canonicalization would solve circuit equivalence

Suppose there is a polynomial-time map Can from circuit descriptions to strings satisfying

    Can(C)=Can(C')  iff  C ≡ C'.

Then Boolean circuit equivalence is decidable in polynomial time by computing and comparing Can(C),Can(C'). Consequently TAUT is in P and P=NP=coNP.

### Proof

The equivalence algorithm is immediate from the biconditional. Since TAUT polynomial-time reduces to equivalence, TAUT∈P. Because TAUT is coNP-complete, coNP⊆P. P is closed under complement, so NP⊆P as well; hence P=NP=coNP. QED.

Therefore we cannot use exact polynomial-time semantic canonicalization as an innocent preprocessing step in a P!=NP proof: constructing it would already resolve P versus NP in the equality direction.

## 5. Important non-implication

A representation-robust error witnesser does NOT obviously yield a full canonical form and does NOT obviously decide equivalence. It only has a correctness obligation on circuits that are wrong somewhere on satisfiable SAT inputs, and it may output one error rather than characterize the whole function.

Thus U07.2 is a warning about one proposed method, not a barrier theorem against white-box witnessing.

## 6. Unique-error promise problem

The representation-robust core can be isolated as a promise search task:

Input: a circuit C promised to be a SAT-search function with exactly one satisfiable n-bit input x on which its output is invalid.
Output: x (and, for the Pich–Santhanam form, a valid satisfying assignment for x).

Call this UNIQUE-SAT-SEARCH-ERROR(C).

If a polynomial-time same-length witnesser exists for all incorrect circuits, it solves this promise task. Conversely, solving only this promise task is not enough for full feasible witnessing, because arbitrary circuits can have many errors and need not be near-correct.

The promise itself is global and generally not efficiently verifiable: checking that there are no other errors universally quantifies over inputs and also depends on satisfiability. We must not assume the promise can be recognized in polynomial time.

## 7. Why simple syntactic hiding is insufficient as a proof technique

One can transform a circuit without changing its function by adding redundant gates, permuting independent gates, inserting double negations, or replacing gates by equivalent gadgets. These transformations can hide an obvious equality-test subcircuit from a naive parser, but they do not prove hardness of recovering x: a more sophisticated polynomial-time analysis might undo the transformations.

To prove unconditional hardness from such obfuscation would require a rigorous lower bound against all polynomial-time analyzers, which is essentially the kind of lower bound the project seeks. Therefore 'make the circuit messy' is not a valid separation argument.

## 8. New pivot

The representation-robustness route reaches a clean fork:

A. Exact semantic normalization is too strong as a presumed tool: it would imply P=NP.
B. Merely syntactic obfuscation supplies no unconditional hardness.
C. The remaining promising object is a proof system that can reason globally about C without computing a canonical form.

Accordingly the next route should return to the Pich–Santhanam witnessing formulas and ask a narrower question: can a polynomial-time f be constructed from a proof of a *specific local/global consistency statement* about C, rather than from C alone? If the proof is assumed as extra input, determine exactly whether producing that proof is already equivalent to the missing hard step.

No statement in U07 resolves P versus NP.