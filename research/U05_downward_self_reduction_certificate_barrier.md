# U05 — Downward self-reduction does not by itself yield same-length error witnessing

Date: 2026-09-14
Status: verified partial method barrier; no P versus NP resolution.

## 1. Active question

After U02–U04, the surviving route was to keep the size-n^k circuit C external to the n-bit SAT formula and use SAT's downward self-reducibility: fix variables one at a time, query restricted formulas, and hope that a locally checkable inconsistency exposes an n-bit input on which C fails.

This note audits that idea.

## 2. Exact decision self-reduction

For a CNF formula F(x1,...,xm), satisfiability obeys

    SAT(F) = SAT(F[x1=0]) OR SAT(F[x1=1]).

Iterating this identity reduces search to decision when a correct SAT decision procedure is available: at each stage choose a branch certified satisfiable by the decision procedure.

This is an upper-bound transformation. It does not say that an arbitrary incorrect candidate circuit must reveal an error on one of the restrictions encountered by one chosen path.

## 3. Lemma U05.1 — one-path consistency can miss a unique off-path error

Let D be a correct SAT search/decision implementation on a finite encoded domain X. Let T be any deterministic procedure that, using D, adaptively inspects at most q formulas from X along a downward-self-reduction computation and finally outputs one formula phi. Suppose S is a family of satisfiable formulas with |S|>q+1 for which one-point corruptions C_x exist as in U02: C_x agrees with D everywhere except x and is wrong at x.

Then some C_x is indistinguishable from D throughout T's entire inspected self-reduction transcript and T's final phi is not an error of C_x.

### Proof

Run T with D. Let Q be the at-most-q formulas whose candidate answers T actually inspects, and let phi_D be its output. Choose x in S \ (Q union {phi_D}). On oracle C_x, every inspected answer is identical to D's answer, so induction on the adaptive transcript gives the same queries, branch choices, and output phi_D. Since x != phi_D and C_x agrees with D at phi_D, phi_D is not an error. QED.

## 4. Consequence for downward self-reducibility

Downward self-reducibility does not evade U02 merely by organizing the black-box probes as a restriction tree. Any method that follows only polynomially many nodes and uses C only through its answers remains subject to the same hidden-one-point-error adversary.

To force an error by exploring all possible restriction branches would in general require exponentially many leaves. Thus the ordinary search-to-decision self-reduction cannot by itself produce the Pich–Santhanam same-length witness.

## 5. External proof certificates do not automatically fix the issue

Suppose the method additionally records a polynomial-size certificate consisting only of local consistency assertions about the polynomially many inspected nodes—for example, that a parent's claimed SAT value agrees with the chosen children's claimed values, or that a returned assignment satisfies the current restriction.

For the one-point corruption C_x selected outside the inspected set, every such local assertion has exactly the same truth value as under D. Hence a certificate derived solely from the inspected transcript cannot distinguish C_x from D and cannot force x to be exposed.

Therefore a successful proof-sensitive witness must contain information not derivable merely from polynomially many candidate evaluations along the ordinary self-reduction tree. It must use genuinely white-box properties of the circuit description, a global proof object constraining unqueried inputs, or a separate lower-bound ingredient.

## 6. Why this matters

A recent critique of a claimed SAT lower bound identifies essentially the complementary logical danger: one cannot assume that every SAT algorithm has a special structure that exposes itself through downward self-reducibility. Our argument here is narrower and self-contained: even when we voluntarily build a downward-self-reduction tester, a one-point corrupted correct solver can hide its unique error off the inspected transcript.

Pich–Santhanam's feasible-witnessing function is description-sensitive, so U05 does not refute their framework. It eliminates the simplest remaining implementation of that framework: external circuit + ordinary downward self-reduction + polynomial local consistency transcript.

## 7. Surviving route

The next candidate must be genuinely global and white-box. A useful precise target is:

Construct in polynomial time from C a succinct globally checkable object P(C) such that, whenever C has any SAT-search error at length n, P(C) identifies or forces an n-bit error, while verification of P(C) does not itself require solving SAT and while P(C) is not simply an encoding of an exponentially large truth table.

This is close to proof-complexity / antichecker / learning structure rather than ordinary self-reducibility.

## 8. Literature context checked

- Pich and Santhanam, “Towards P != NP from Extended Frege lower bounds,” JACM 73 (2026): feasible witnessing remains explicitly description-sensitive.
- Chavrimootoo, He, Kotler-Berkowitz, Liuson, Nie, “Evaluating the Claims of ‘SAT Requires Exhaustive Search’,” arXiv:2312.02071 (2023): warns that a claimed lower-bound argument incorrectly assumes algorithms possess a downward-self-reducible structure sufficient for its conclusion.

No statement here is a P versus NP separation.