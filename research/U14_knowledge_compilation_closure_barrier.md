# U14 — Equality track: unconditional knowledge-compilation barrier to universal compact elimination

Date: 2026-09-14
Status: literature-verified representation barrier; no P versus NP resolution.

## 1. Target from U13

U13 isolated a desirable representation class R for a polynomial-time SAT algorithm:

1. each clause has a polynomial-size R representation;
2. arbitrary conjunction / Boolean-reduced multiplication stays polynomial-size;
3. existential elimination or model aggregation is polynomial-time in representation size.

This note tests mature knowledge-compilation languages that were explicitly designed to trade representation size for tractable reasoning.

## 2. DNNF as a candidate

A decomposable negation normal form (DNNF) is an NNF circuit in which the children of every AND gate depend on disjoint variable sets. This decomposability supports efficient forms of reasoning and makes DNNF a natural candidate for the kind of correlation-aware representation sought in U13.

Each individual CNF clause has a trivial O(k)-size DNNF representation, where k is the clause width.

The decisive question is therefore whether arbitrary polynomial-size CNFs can remain polynomial-size when compiled into DNNF.

## 3. External theorem — strongly exponential CNF-to-DNNF separation

Bova, Capelli, Mengel and Slivovsky, “A Strongly Exponential Separation of DNNFs from CNF Formulas” / “Expander CNFs have Exponential DNNF Size,” construct a class of CNF formulas based on expander graphs and prove a strongly exponential lower bound on the size of any equivalent DNNF.

Their result is unconditional: there are CNFs of size linear in the number of variables for which every equivalent DNNF has exponential size.

This was checked against the authors' paper/abstract and independent publication metadata, not inferred from memory.

## 4. Theorem U14.1 — DNNF cannot satisfy the universal compactness requirement

There is no transformation that maps every polynomial-size CNF F to an equivalent polynomial-size DNNF.

### Proof

Immediate from the Bova–Capelli–Mengel–Slivovsky expander-CNF lower bound: their linear-size CNF family requires DNNF size 2^{Omega(n)}. QED.

### Consequence for the U13 program

Because every clause starts tiny but some conjunctions of those clauses require exponentially large DNNF, the desired closure property fails for DNNF on arbitrary CNFs. The loss occurs when globally combining the local constraints, exactly where U13 predicted correlation information could become expensive.

This is stronger evidence than our earlier explicit residual-state examples: it rules out a highly expressive representation class by an unconditional lower bound, rather than merely defeating one hand-designed state summary.

## 5. OBDD corroboration

Bova and Slivovsky, “On Compiling Structured CNFs to OBDDs” (Theory of Computing Systems 61(2), 2017, DOI 10.1007/s00224-016-9715-z), prove an exponential lower bound on OBDD size for a family of CNF formulas whose incidence graphs even have bounded degree.

Hence choosing a clever variable order does not universally rescue ordered decision-diagram compilation. OBDDs remain extremely effective on structured subclasses, but polynomial-size compilation for all CNFs is false.

## 6. Width explains both successes and failures

Related knowledge-compilation work connects bounded treewidth/pathwidth with efficient compilation, while proving matching exponential lower bounds as width grows. This supports a coherent picture:

- bounded structural width -> compact representations and tractable elimination;
- unbounded width -> explicit families can force exponential compiled size.

This is consistent with U09's separator obstruction, but substantially stronger because the lower bounds apply after sophisticated semantic compilation, not merely to a naive separator algorithm.

## 7. What this does not prove

1. DNNF/OBDD lower bounds do not imply general circuit lower bounds for SAT.
2. They do not imply P != NP.
3. A hypothetical new representation outside current knowledge-compilation classes could evade these lower bounds.
4. A SAT algorithm need not explicitly compile the whole formula into a reusable representation before deciding satisfiability.

Therefore this is a route barrier, not a complexity separation.

## 8. Structural lesson

The equality track has moved from weak to increasingly expressive state models:

- exact residual formulas (U11),
- compact arithmetic circuits (U12),
- Boolean quotient/multilinear algebra (U13),
- DNNF/OBDD semantic compilation (U14).

At each stage, either extraction or representation size can carry the exponential difficulty. The DNNF result is the first externally established unconditional exponential representation lower bound encountered in this sequence.

## 9. Next route

A genuinely new equality-side attempt should avoid full compilation. The next candidate is an *on-demand decision-only invariant*: maintain only enough global information to decide whether the current CNF has at least one satisfying assignment, without preserving all models or all residual functions.

To make this nontrivial, define a scalar or low-dimensional invariant I(F) with:

1. I(F) computable from clauses in polynomial time;
2. I(F) determines SAT(F);
3. updates under clause addition avoid reconstructing a DNNF/OBDD or full coefficient table.

The first audit should test candidate invariants derived from low-degree polynomial evaluations, modular counts, or random restrictions, and construct pairs of SAT/UNSAT formulas indistinguishable by the invariant whenever possible.

No statement here resolves P versus NP.