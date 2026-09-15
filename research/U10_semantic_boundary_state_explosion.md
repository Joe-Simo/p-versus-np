# U10 — Equality track: semantic boundary compression can still have 2^m states

Date: 2026-09-14
Status: verified partial algorithm obstruction; no P versus NP resolution.

## 1. Candidate refinement of U09

U09 rejected enumerating all separator assignments individually. The proposed refinement groups assignments whenever they have the same semantic effect on clauses crossing the separator.

Formalize a boundary state as the vector indicating, for every boundary clause, whether its separator literals already satisfy that clause. Assignments with the same vector can be merged before solving the remaining components.

Question: can the number of such states be polynomial even when the separator has m variables?

## 2. Explicit family

Take separator variables x_1,...,x_m. For each i create two boundary clauses

    A_i = (x_i OR a_i)
    B_i = (NOT x_i OR b_i),

where a_i and b_i are variables outside the separator (they may belong to downstream components).

For a separator assignment alpha in {0,1}^m, record the 2m-bit boundary-satisfaction vector

    sigma(alpha) = (sat_alpha(A_1), sat_alpha(B_1), ..., sat_alpha(A_m), sat_alpha(B_m)),

where sat_alpha records whether the separator literal alone has already satisfied the clause.

For each i:

- if alpha_i=1, the pair is (1,0);
- if alpha_i=0, the pair is (0,1).

Therefore sigma is injective.

## 3. Theorem U10.1 — exact boundary-state count

The family has exactly 2^m distinct induced boundary states.

### Proof

There are 2^m separator assignments. If alpha != beta, choose i with alpha_i != beta_i. The corresponding pair (sat(A_i),sat(B_i)) is (1,0) for one assignment and (0,1) for the other, so sigma(alpha) != sigma(beta). Hence sigma is injective and its image has size 2^m. QED.

## 4. Computational verification

An independent exhaustive checker enumerated all separator assignments for m=1,...,16 and confirmed that the number of distinct boundary vectors is exactly 2^m in every case, reaching 65,536 distinct states at m=16.

The computation is only a finite sanity check; the theorem above is the proof for all m.

## 5. Consequence

The proposed semantic compression rule

    merge separator assignments iff they induce the same boundary-clause satisfaction state

does not yield a polynomial bound in general. Even with only 2m crossing clauses, all 2^m assignments can remain semantically distinguishable at the boundary.

This is stronger than U09's graph-width objection: the explosion persists after quotienting assignments by this natural clause-semantic equivalence.

## 6. Important limitation

The displayed family is not a SAT lower bound. In isolation it may be easy for another algorithm, and further semantic reasoning about the downstream variables could collapse cases. The theorem only rejects this particular proposed state representation as a universal polynomial compression.

Nor does it prove that every possible separator summary needs 2^m states. A stronger summary could exploit logical equivalence among residual subproblems rather than the raw boundary-satisfaction vector.

## 7. Next research target

Strengthen the quotient as far as possible: identify separator assignments when their entire residual formulas are logically equivalent with respect to satisfiability. Then ask whether an explicit polynomial-size CNF can induce exponentially many pairwise inequivalent residual Boolean functions after assigning a separator.

If yes, even perfect semantic merging of residual functions has an exponential state space on that family; if no, that would expose a potentially useful compression theorem.

No statement here resolves P versus NP.