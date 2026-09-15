# U33 — Useful truth-table properties: usefulness is easy by counting, constructivity is the hard part

Date: 2026-09-14
Status: exact counting/logic audit; no P versus NP resolution.

## 1. Target

After U32, attack general circuits directly via a property P_N of N-bit truth tables. Ideally P_N should be:

1. useful against circuits of size s=N^{1+epsilon}: no truth table computed by such a circuit has P_N;
2. constructive: P_N is decidable in time polynomial in N;
3. sufficiently large/dense to support a natural-proofs style argument, unless we deliberately seek a non-natural property.

## 2. Counting small circuits

A fan-in-2 Boolean circuit of size s over N input bits can be described gate-by-gate. Each gate specifies a constant-size gate type and two predecessors chosen from at most N+s available wires. Thus the number of descriptions is at most

    2^{O(s log(N+s))}.

Hence the number of distinct N-input Boolean functions computed by size-s circuits is at most this quantity.

For the truth-table viewpoint relevant to MCSP, be careful with parameters: an N-bit string is the truth table of a Boolean function on n=log_2 N variables. A circuit for that n-variable function of size s has descriptions bounded by

    2^{O(s log(s+n))}.

The universe contains 2^N truth tables.

For s=N^{1+epsilon}, this crude description bound exceeds 2^N and is therefore useless as a density estimate. For s=o(N/log N), however, it proves that almost all truth tables require larger circuits.

This parameter distinction matters: the magnification threshold is deliberately around/slightly above linear in truth-table length, where naive counting no longer separates.

## 3. Shannon counting regime

The elementary counting argument establishes existence of hard functions with circuit complexity Omega(N/log N) (up to constants/model conventions), because the number of circuits below that scale is much smaller than 2^N.

It does not establish the explicit or constructive lower bound N^{1+epsilon} needed in U29. Indeed, N^{1+epsilon} is above the truth-table length N, while every n-variable Boolean function has some circuit of size O(N/n) or O(N) by direct DNF/truth-table constructions depending on gate conventions. Therefore a claim that an arbitrary truth table needs N^{1+epsilon} ordinary gates would be impossible.

This flags a parameterization issue that must be checked against U29: the Gap-MCSP circuit lower bound there concerns circuits computing the *meta-problem on N-bit truth-table inputs*, not the circuit complexity of the truth table encoded by one input. These are two different circuit models/levels.

## 4. Property of meta-inputs

A useful property for the magnification target is itself a Boolean function on N input bits: given a truth table x, decide whether x has the property. The desired lower bound is against circuits computing this property/Gap-MCSP decision function, not against circuits computing x as an n-variable function.

Thus the naive property

    P_N(x) := 'the n-variable function encoded by x has circuit complexity > threshold'

is semantically useful for MCSP but recognizing it is precisely a meta-complexity problem. We cannot assume polynomial-time constructivity.

## 5. Lemma U33.1 — usefulness without constructivity is trivial

For any circuit class C_N that is a strict subset of {0,1}^{ {0,1}^N }, there exists a property P_N excluding C_N: take P_N to be the complement of the set of functions computed by C_N, or even a singleton hard function.

The difficulty is making P_N explicit/constructive and proving it useful.

In the truth-table-string setting, similarly, defining a property by 'x is not accepted by any small circuit for the meta-problem' merely restates the desired lower bound and gives no algorithm for recognizing P_N.

## 6. Natural-proofs warning

Razborov-Rudich natural proofs concern properties of Boolean functions that are constructive and large and useful against circuit classes, under cryptographic pseudorandomness assumptions. Therefore if we seek a property satisfying all three in a regime covered by that barrier, we should expect a cryptographic obstruction.

A non-natural route must intentionally violate at least one naturalness ingredient—typically largeness or the relevant constructivity notion—while still being explicit enough to prove a lower bound. Merely proposing a rare property is not sufficient; one still needs to prove usefulness against all target circuits.

## 7. Research consequence

The property route does not magically bypass general-circuit lower bounds. At the magnification scale, the hard part is exactly to prove that a constructive meta-property rejects every N^{1+epsilon}-size circuit computing the Gap-MCSP decision function. Counting individual truth tables addresses the wrong level.

The key correction is the two-level distinction:

    level 1: circuit complexity of the n-variable function encoded by an N=2^n-bit string;
    level 2: circuit complexity of the N-input meta-function Gap-MCSP/MCSP.

Confusing these levels would create a false 'counting proof' of magnification.

## 8. Next route

Audit the exact U29 magnification theorem parameters from its primary source and pin the level-1 versus level-2 circuit sizes. Then formulate a candidate non-natural property at the correct level and test whether its recognition/usefulness is any easier than Gap-MCSP itself.

No statement here resolves P versus NP.