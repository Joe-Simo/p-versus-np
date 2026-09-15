# U46 — Three-gate fan-out audit and optimal nine-point certificates

Date: 2026-09-15. Status: fixed-budget theorem with a fully enumerated finite lemma and an independent exact implementation; no P versus NP resolution, formal-kernel certification, independent expert review, or claim of novelty.

## 1. Exact result and its scope

Continue U45's requested test: does the two-gate cofactor method survive a third gate when internal signals may be reused?

**Theorem.** For every n>=1 and a complete N=2^n-bit Boolean truth table F, a uniform procedure either constructs a circuit of at most three B2 gates computing F, or supplies at most nine distinct inputs, labeled by their actual F-values, on which no such circuit agrees. For n>=4, nine is necessary in the worst case.

B2 means all sixteen functions of two Boolean inputs. Constants 0 and 1 and uncomplemented input wires are free. A NOT costs a gate unless absorbed into an adjacent B2 gate. Repeated predecessors and unlimited fan-out are allowed. The procedure's cost is O(n^2*N)+K3 bit operations for a fixed finite search bound K3 described below. Keeping K3 visible is deliberate: this is not a practical claim of a small leading constant, a succinct-input SAT algorithm, or a result uniform in a growing gate budget.

The asymptotic/arbitrary-arity part has a short mathematical proof. The exact nine-point core lemma is established by complete finite enumeration in two separately implemented checkers, not by a proof-assistant kernel. The executable generic routine is tested on a declared bounded domain; the mathematical algorithm uses ordinary bit-string addresses, not unbounded unit-cost integers.

## 2. Why three gates do not yet distinguish formulas from circuits

**Lemma 1.** Every single-output B2 circuit with at most three gates has a formula with no more gates computing the same function, at arbitrary input arity.

Remove all gates that do not reach the output. Parallel uses of the same signal as both inputs to a gate implement a unary function of that signal. In a size-minimal single-output circuit this unary operation can be removed or absorbed into its predecessor, except when another use of that predecessor must also be retained; that exceptional use is exactly the reconvergent case considered next.

If there is no internal fan-out to different later gates, unfolding the remaining graph does not duplicate a gate, so it is already a formula. With only three active gates, the only remaining internal reconvergence has the form

    h = A(u,v),  j = B(h,w),  F = C(h,j)

or the same expressions with gate arguments reversed. Here u,v,w are primary inputs or constants; repeated primary inputs are harmless. Define the B2 gate

    D(a,b) = C(a,B(a,b)).

Then F=D(A(u,v),w), a two-gate formula. Any gate whose two arguments both equal h again has a unary function that can be absorbed. If the output is an earlier wire, the discarded gates were irrelevant. This exhausts the possible active three-node DAGs. QED.

This lemma is specific to the full B2 basis: the replacement D is charged as one of its sixteen allowed gates. It cannot be imported with the same gate count into a different basis. Nor does it assert formula/circuit equality for unbounded size.

An exact four-bit check tested 2,048 instances of D(a,b)=C(a,B(a,b)) (all B,C, both final argument orders, all a,b). More importantly, all raw ordered three-gate descriptions were independently enumerated on three and four variables, without merging identical prefix states. Their computed function classes match the formula recurrence exactly.

## 3. Composition and a separately charged root relation

Let F_j contain precisely the functions of minimum formula size j. A minimum-size formula with s gates has a root g(A,B), where its two subformulas have minimum sizes a and b with a+b=s-1. Replacing a non-minimum child by a smaller equivalent formula would decrease the total, proving completeness of the recurrence. It includes repeated variables across subtrees.

The resulting counts are:

| Input arity | Size 0 | Size 1 | Size 2 | Size 3 | Total <=3 |
|---|---:|---:|---:|---:|---:|
| 3 | 5 | 33 | 114 | 80 | 232 |
| 4 | 6 | 64 | 456 | 2,474 | 3,000 |

Each retained formula is evaluated independently at every input, with its actual gate count checked. The original n=3 counts agree with U44, but are recomputed here.

A second construction enumerates jointly available signal pairs after two prefix gates and eliminates the final gate by its input fibers; it is defined for arbitrary gate budgets in U47. For n=3 it has 1,725 pairs and 329 distinct fiber partitions; for n=4 it has 6,877 pairs and 1,536 partitions. This independently reproduces the same 232 and 3,000 output functions, explicitly including internal reuse.

The raw last-gate description counts actually enumerated are

    16^3 * ((n+2)(n+3)(n+4))^2
    = 180,633,600 at n=3;
    = 462,422,016 at n=4.

These are syntactic counts, not distinct functions or a lower bound. Earlier output wires are covered by smaller budgets or by appended copy gates. Primitive gate evaluation is checked against a pointwise Boolean implementation, independently of packed truth-mask operations.

## 4. Finite four-variable certificate lemma

A labeled partial table has a fixed-position mask M and values L with L subseteq M. It is inconsistent with C3 if there is no G in the 3,000-function class such that G & M = L.

**Finite lemma.** Every four-variable table outside C3 has an inconsistent restriction on at most nine points. The exact minimum-cardinality histogram is:

| Minimum points | Outside tables |
|---|---:|
| 7 | 61,848 |
| 8 | 672 |
| 9 | 16 |

Together with the 3,000 members, this covers every one of the 65,536 Boolean functions of four variables. A separate three-variable run finds that each of its 24 outside functions needs seven points.

### Exhaustive computation and why it proves the finite assertion

Encode each of the sixteen point coordinates by a trit: 0=unspecified, 1=fixed zero, 2=fixed one. The TypeScript checker marks every restriction of every class member. There are exactly 3^16=43,046,721 possible partial labelings and 3,000*2^16 marking visits.

It then visits every partial labeling. A pattern is inclusion-minimal inconsistent exactly when it is inconsistent and every single deletion is consistent: consistency is preserved by deleting labels, so checking these immediate parents suffices. There are 97,216 such patterns. Their sizes range from seven through eleven; this does not contradict the minimum-cardinality histogram, as U47 demonstrates explicitly.

For each inclusion-minimal inconsistent pattern, the checker enumerates all full-table completions and updates their smallest known certificate. Every inconsistent pattern has an inclusion-minimal inconsistent subpattern by finite deletion. Consequently this enumeration finds the exact minimum for every outside target, not just some certificate. Every final certificate is checked against every class member.

The resulting class membership and all 65,536 minimum-cardinality entries are reproduced by the independent Python/NumPy checker. That checker constructs C3 using cofactors and the two possible read-once splits for functions with four essential inputs; functions with at most three essential inputs are embedded separately. It does not use the TypeScript ternary table or its prime enumeration.

It then computes orbits under permutations/negations of original inputs and output complementation. These operations preserve C3 and permute input samples, so minimum certificate size is invariant. The 222 disjoint orbits cover all 65,536 functions. For one representative of each nonmember orbit, exact subset closure of the agreement masks {positions where F=G : G in C3} determines consistency of every sample subset. Orbit transport gives the full minimum table. Only after these results are obtained is the TypeScript file opened for comparison; every entry matches.

### Concrete sharpness witness

Take E4(x)=1 exactly at x=0000 and x=1111; with the project's least-significant-bit point convention its table integer is 32769. Its minimum certificate has nine points. Mask 33471 is one of 64 nine-point certificates. Every sample subset of size at most eight is consistent with some three-gate circuit.

Wolfram independently generated the 3,000-function class and performed agreement-mask subset closure for E4, confirming all of those statements. It returned class sums 98,302,500 and 4,690,111,614,380 (first and second powers), agreeing with the other implementation. These checks are finite verification, not an expert mathematical review.

The sixteen nine-point extremal tables are precisely the indicators of complementary pairs of points, and their output complements. This characterization follows from the explicit complete minimum table; no global combinatorial classification beyond this finite cube is asserted.

## 5. Lifting the upper bound to arbitrary arity

A variable is essential if some two inputs differing only in that coordinate have different outputs. Store such a sensitive pair as a witness.

**Support bound.** A single-output circuit with s binary gates depends on at most s+1 primary variables. After removing irrelevant gates, r active gates have at least r-1 connecting internal wires, leaving at most 2r-(r-1)=r+1 input-wire occurrences for distinct primary variables. Thus three gates cannot fit sensitive pairs in five distinct directions.

**Sensitivity-one fact.** If a Boolean function has at most one sensitive incident edge at each input, it is a constant or a literal. A sensitive i-edge forces all other directions j at its endpoints to be insensitive, which forces the parallel i-edge across each (i,j) square to be sensitive. Propagation proves all i-edges sensitive and no others sensitive. If no edge is sensitive, connectedness makes the function constant.

The procedure scans for essential variables, stopping after five:

- If five are found, the function is not a literal, so the sensitivity-one fact supplies a vertex sensitive in two directions i,j. Those three vertices witness two essential directions. Select three of the five recorded directions different from i,j and add their sensitive pairs. At most 3+2*3=9 points now witness five essential directions and exclude every three-gate circuit. Overlap only improves the point count.
- Otherwise identify all essential variables (at most four), set the remaining inputs to zero, and form the four-variable core, adding dummy variables when necessary. Membership and synthesis come from the explicitly generated finite C3 class. For a nonmember, search for a hitting set of size at most nine among its disagreements with the class (U47). The finite lemma guarantees success. Lift those core inputs to the original arity, fixing all other coordinates to zero, and remove duplicate samples introduced by dummy variables.

If an original-arity three-gate circuit fitted the lifted samples, fixing its extra inputs to zero would give a three-gate core circuit fitting the forbidden core labels. This contradicts the finite certificate. A synthesized core circuit instead lifts by replacing its primary wires by the essential variables and setting nonexistent dummy inputs to zero. All cases are covered.

## 6. Lifting sharpness and counting cost honestly

For n>=4, let F(x)=E4(x_0,x_1,x_2,x_3), ignoring the remaining variables. Any set of at most eight n-bit sample inputs projects onto at most eight distinct four-bit inputs with consistent labels. A three-gate circuit fitting the projected labels exists by the finite sharpness witness and can ignore the extra variables. Therefore no eight-point certificate refutes this F. This proves the worst-case lower bound for all n>=4.

The scans require O(n*N) queries and O(n^2*N) conservative bit work for address handling. The core class is generated from gates, not installed as an uncharged answer oracle. Its finite construction and the hitting-set search add K3, independent of n but potentially large. The bounded implementation uses a depth-nine search branching on at most sixteen point coordinates and testing disagreements with 3,000 explicit class members; this gives a finite constant upper bound (even a crude O(3000*16^11) bound suffices).

No such constant is claimed uniformly in s. Enumerating the core of an s-gate problem can require a domain of size 2^(s+1) and a very large finite search. Calling that constant when s grows with N would invalidate a polynomial-time argument. This theorem does not provide the ordinary general-circuit lower bound required by OPS2021.

## 7. Code, tests, and verification limits

`code/u46_u47_audit.ts` implements all three class constructors, raw descriptions, exhaustive partial-label analysis, certificate checking, and the uniform three-gate procedure. Its actual total of raw three-gate descriptions checked is 643,055,616, with complete input truth tables evaluated in packed exact masks. The four-variable certificate result covers all 65,536 functions and all 43,046,721 partial labelings. The three-variable parallel run covers 6,561 partial labelings.

The generic procedure itself is additionally exercised on 35 targeted tables (constants, literals, parity, all-equal, and a shared-signal expression; arities 1,2,3,4,5,6,8). All synthesized circuits are evaluated on every input; each returned sample is independently checked against all three-gate formula label patterns on that sample. This is not an exhaustive test of larger arities. The arbitrary-arity theorem follows from the proof in Sections 5-6.

Python/NumPy provides the independently derived full finite comparison described above. Wolfram provides the separately implemented sharpness test. No proof assistant or separate expert certified the theorem. Primitive/compile failures and exploratory limits are recorded in the continuation checkpoint.

## 8. Relation to literature and the full target

Functional decomposition is established background. Our fiber and cofactor arguments are proved here rather than attributed to an unread theorem. A search for exact three-gate/nine-point certificate results did not establish whether this particular statement has appeared before; no novelty claim is made. The encountered AIG preprint `arXiv:2603.08033` concerns a different basis and was not used as a theorem or as evidence of unbounded formula/circuit equality.

The official Clay P-versus-NP page was rechecked on 2026-09-15 and still labels that problem unsolved: https://www.claymath.org/millennium/p-vs-np/ . The active external magnification target is Oliveira-Pich-Santhanam, *Hardness Magnification Near State-of-the-Art Lower Bounds*, Theory of Computing 17(11), 2021, Theorem 1.4, as fixed in U42: https://theoryofcomputing.org/articles/v017a011/v017a011.pdf . This run does not claim a new read or reproof of that whole source; no theorem from it is needed to prove the fixed-budget result.
