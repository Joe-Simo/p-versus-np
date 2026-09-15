# U20 — Random hashing of witness fingerprints: unique witnesses are easy to preserve, but computing hashed mass remains the bottleneck

Date: 2026-09-14
Status: structural audit; no P versus NP resolution.

## 1. Proposal

U19 leaves an exponential assignment/partial-assignment algebra. Try hashing the 2^n witness fingerprint monomials into M=poly(n) buckets and keep only one aggregate value per bucket.

## 2. Collision behavior is not itself fatal for SAT existence

If coefficients are nonnegative integers and bucket aggregation uses ordinary integer addition, collisions cannot turn a nonempty satisfying set into the all-zero vector: every satisfying assignment contributes +1 to some bucket. Therefore the hashed vector is zero iff there are no satisfying assignments.

In fact, summing all buckets simply gives #SAT(F). So exact nonnegative hashing preserves existence perfectly regardless of collisions.

This observation kills a misleading line of attack: we do NOT need to isolate a unique witness merely to preserve nonzeroness under nonnegative aggregation.

## 3. The real difficulty moves to computation

To use the hashed vector, one must compute, for each bucket b,

    H_b(F) = number of satisfying assignments a with h(a)=b.

Even the total sum over buckets is #SAT(F). Thus a universal polynomial-time exact algorithm for all H_b immediately computes #SAT and in particular decides SAT.

Hashing reduces output dimension but does not by itself provide a way to evaluate the aggregates from the CNF.

## 4. Modular arithmetic reintroduces cancellation

If bucket values are stored modulo a small prime p to keep arithmetic bounded, a nonempty bucket can sum to 0 mod p. U15 already showed the general modular-count issue: nonzero model counts can vanish modulo chosen moduli.

Random weights can reduce cancellation probability for a *given explicitly enumerable witness set*, but evaluating the weighted sum over all satisfying assignments is again a partition-function computation. The unresolved work is computing the aggregate, not proving that a random aggregate would be informative if known.

## 5. Collision calculation for witness isolation

For completeness, if one insists that a distinguished witness receive a collision-free bucket under an ideal uniform hash into M buckets among N=2^n possible assignments, its collision probability is

    1 - (1-1/M)^(N-1).

For polynomial M this approaches 1 exponentially quickly as n grows. Wolfram exact/numerical checks illustrate this: at n=16, M=n^3=4096, collision probability is about 0.9999998877.

This does not rule out Valiant–Vazirani-style structured isolation, which uses random constraints rather than a single small bucket table. It only rejects naive polynomial-range collision-free hashing.

## 6. Research consequence

The algebraic equality route has repeatedly separated two notions:

1. information compression: a compact statistic would distinguish SAT from UNSAT if it were available;
2. computational accessibility: obtaining that statistic from arbitrary CNF may itself encode SAT/#SAT.

U20 shows random hashing does not bridge this gap. Exact nonnegative aggregation preserves existence but is #SAT-like to compute; small modular aggregation is computable only if we solve another hard counting problem and can suffer cancellation; collision-free polynomial-range hashing is overwhelmingly unlikely over the full assignment universe.

## 7. Next pivot

A genuinely new equality-side route should exploit a transformation that changes the CNF so the aggregate becomes locally computable, rather than merely compressing its output. Candidate families include random restrictions/sparsification and structural decomposition after restriction. The decisive question is whether one can prove that polynomially many restrictions cover all witnesses while each restricted formula enters a tractable structural class.

No statement here resolves P versus NP.