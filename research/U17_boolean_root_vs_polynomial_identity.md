# U17 — Unique-SAT algebraization: Boolean-root existence is not polynomial identity testing

Date: 2026-09-14
Status: proved reduction/equivalence statements; no P versus NP resolution.

## 1. Motivation

U16 left a possible route: isolate a unique satisfying assignment, encode it algebraically, then use randomized polynomial identity testing (PIT). This note tests whether the algebraic target is actually PIT.

## 2. Standard Boolean polynomial encoding

Given a CNF F=C_1 AND ... AND C_m on variables x_1,...,x_n, work over any field K and add Boolean equations

    x_i^2-x_i = 0  for i=1,...,n.

For a literal l define its falsity indicator

    q(x_i)=1-x_i for positive literal x_i,
    q(NOT x_i)=x_i.

For a clause C=(l_1 OR ... OR l_r), define

    Q_C(x)=product_j q(l_j).

On Boolean assignments, Q_C=1 exactly when C is false and Q_C=0 exactly when C is true. Therefore F is satisfiable iff the polynomial system

    Q_C(x)=0 for every clause C,
    x_i^2-x_i=0 for every variable i

has a common root over K^n.

The Boolean equations force every coordinate of a root to be 0 or 1 over every field because x_i(x_i-1)=0.

## 3. Lemma U17.1 — Boolean root existence is exactly SAT for this encoding

The map F -> {Q_C, x_i^2-x_i} is computable in polynomial time and the system has a common root iff F is satisfiable.

### Proof

If a satisfies F, every clause has a true literal, so its falsity-indicator product is zero; Boolean equations also vanish. Conversely any common root is Boolean by x_i^2-x_i=0, and Q_C=0 means not all literals of C are false, so each clause is true. QED.

Thus a polynomial-time algorithm for this root-existence problem would itself give P=NP. Algebraization has not reduced SAT to an easier known problem; it has represented SAT exactly.

## 4. Why PIT is different

PIT asks whether a polynomial P represented by a formula/circuit is the zero polynomial, equivalently whether all its coefficients vanish. Schwartz–Zippel-style randomized evaluation works because a nonzero polynomial cannot vanish on too large a fraction of a sufficiently large field/grid.

SAT's algebraic encoding instead asks whether several generally nonzero polynomials have a *common Boolean root*. Each clause polynomial Q_C is typically visibly nonzero regardless of whether the full CNF is satisfiable.

Therefore running PIT on Q_C individually says nothing useful: both satisfiable and unsatisfiable formulas normally produce nonzero clause polynomials.

## 5. Attempted single-polynomial combination and field caveat

Over the reals one might combine equations as a sum of squares

    H(x)=sum_C Q_C(x)^2 + sum_i (x_i^2-x_i)^2,

so H(a)=0 over real a iff every term vanishes. But PIT of H asks whether H is identically zero, not whether H has a zero. H is almost never identically zero.

Over finite fields, even the implication 'sum of squares equals zero => every term equals zero' is not generally valid, so the combination needs additional care. In either setting, root existence remains distinct from identity testing.

## 6. Unique-SAT does not repair the mismatch

If F is promised to have at most one satisfying assignment, the polynomial system is promised to have at most one Boolean common root. PIT still does not locate or detect that isolated root: the defining polynomials remain nonzero as formal polynomials in both the zero-root and one-root cases.

Hence isolation plus ordinary PIT does not yield a polynomial-time unique-SAT algorithm.

## 7. A precise positive target

For PIT to become useful, one would need a polynomial-time transformation F -> P_F such that

    F is satisfiable iff P_F is NOT identically zero

(or the reverse), while P_F has a polynomial-size arithmetic-circuit representation and polynomially bounded degree suitable for PIT.

But if such a randomized PIT reduction existed with one-sided/error-controlled polynomial time, it would place SAT in randomized polynomial time (at least RP/coRP depending on direction), a major unresolved consequence. If the transformation and deterministic PIT were polynomial, it would give P=NP.

Thus this transformation itself is the substantive missing object.

## 8. Next route

Investigate whether inclusion–exclusion / exterior-algebra style encodings can transform Boolean witness existence into formal nonzeroness without exponential cancellation or degree. Search for the exact point where known algebraic sieving succeeds for special problems (e.g. multilinear detection) and why arbitrary SAT clauses defeat the same mechanism.

No statement here resolves P versus NP.