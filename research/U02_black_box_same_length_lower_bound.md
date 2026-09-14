# U02 — Black-box lower bound for same-length SAT error witnessing

Date: 2026-09-14
Status: verified partial theorem; no P versus NP resolution.

## 1. Abstract search setting

Let X be a finite input set and let R(x,y) be a polynomial-time checkable search relation. Call x solvable when there exists y with R(x,y). A search function D is correct on X when, for every solvable x in X, R(x,D(x)) holds.

A deterministic black-box error-witnessing procedure W has oracle access to a candidate search function C. It may adaptively query C(x) on inputs x in X, and eventually outputs a pair (phi,a). Its intended guarantee is:

if C is incorrect on at least one solvable input in X, then phi is solvable, R(phi,a) holds, and R(phi,C(phi)) fails.

W is black-box in the strict sense that its behavior depends on C only through oracle answers to its queries, not through inspection of a circuit/program description of C.

## 2. Theorem U02.1 — local-repair adversary

Assume there exists a correct search function D on X. Suppose that for every x in a subset S of solvable inputs there exists a candidate implementation C_x in the target implementation class satisfying

1. C_x(z)=D(z) for every z != x;
2. R(x,C_x(x)) fails.

Let W be a deterministic black-box witnessing procedure that makes at most q oracle queries and outputs one input phi. If |S| > q+1, then W cannot satisfy the intended guarantee for every C_x.

### Proof

Run W with oracle D. Let Q be the set of oracle inputs queried in this run; |Q|<=q. Let phi_D be the input component of W's final output. Since |S|>q+1, choose

    x in S \ (Q union {phi_D}).

Now run W with oracle C_x. Because C_x and D agree on every element of Q, induction on the adaptive query sequence shows that W receives exactly the same answers as in the D run. Therefore it makes the same queries and outputs the same phi_D.

But x != phi_D, so C_x(phi_D)=D(phi_D). If phi_D is solvable, D is correct there, hence R(phi_D,C_x(phi_D)) holds. Thus phi_D is not an error of C_x. Yet C_x is genuinely incorrect at the solvable input x. W therefore fails its guarantee on C_x. QED.

## 3. Circuit specialization

Suppose D is implemented by a search circuit of size s on n-bit inputs and l(n)-bit outputs. For a fixed n-bit x, a locally corrupted circuit C_x can be built with only O(n+l(n)) extra gates:

- compute EQ_x(z)=[z=x] using O(n) fan-in-2 gates;
- when EQ_x(z)=0, output D(z);
- when EQ_x(z)=1, output a fixed invalid assignment string for x (or flip/control enough output bits to force verification failure, provided such a fixed bad output is chosen for the selected x).

For SAT search, choose x from a family of satisfiable formulas for which an explicit bad assignment is known. Then C_x is correct everywhere D is, except at x, and has size s+O(n+l(n)).

Consequently, if there is a correct small SAT search circuit at length n, no deterministic black-box procedure using fewer than |S|-1 probes can be guaranteed to find a same-length error in every circuit obtained by one-point corruption of that solver.

For any standard SAT encoding admitting exponentially many explicitly satisfiable n-bit instances (or an exponentially large family at a linearly related length), polynomially many probes are therefore insufficient for this black-box strategy.

## 4. Why this does not prove a circuit lower bound

The theorem is conditional on a correct search function D existing in the implementation class. It does not show that SAT has such circuits. Instead it establishes a method barrier:

- if SAT search has small circuits, then black-box same-length error extraction from arbitrary nearby bad circuits requires exponentially many probes;
- therefore a polynomial-time same-length witnessing function, if it exists unconditionally in the Pich--Santhanam sense, must exploit more than input/output probing in the small-circuit world.

In particular, it may inspect the description of C, use proof-theoretic structure, exploit non-black-box self-reference, or rely on additional hardness assumptions. U02 does not rule those possibilities out.

## 5. Relationship to the active literature route

Pich--Santhanam formulate a polynomial-time function f(C) on the *description* of a circuit C and ask for same-length witnessing. Their framework is therefore explicitly non-black-box enough to evade U02. The theorem explains why weakening their target to a generic tester that only evaluates C on polynomially many formulas would lose essential power.

Bogdanov--Talwar--Wan's uniform dreambreaker also does not contradict U02: its guarantee ranges over infinitely many lengths of one uniform algorithm and is not a same-length black-box witness for an arbitrary single nonuniform circuit.

## 6. New route constraint

The Route B/C search should now discard purely black-box probing strategies. The next viable subroutes are:

1. **Description-sensitive diagonalization:** exploit the syntax of C while keeping the produced formula at exactly the same length n.
2. **Proof-sensitive witnessing:** derive a short, checkable inconsistency from a circuit's claimed SAT-search behavior and compile it to a same-length satisfiable formula.
3. **Non-black-box self-reference:** use a recursion/fixed-point construction that embeds selected information about C into the formula without increasing length beyond the required encoding budget.

Each must be checked for circular dependence on SAT hardness and for the relativization/natural-proofs/algebrization barriers.
