# U44 — Exact synthesis and optimal seven-point anti-checkers for two-gate circuits

Date: 2026-09-15. Status: proved fixed-budget construction using an independently checked finite lemma; no P versus NP solution, no formal proof-assistant certification, and no claim of literature novelty.
Dependencies: the explicitly fixed B2 model below, elementary gate/essential-variable arguments, and complete finite checks on the three-variable cube. The magnification theorem is context, not a premise used in this construction.

## 1. Question and result

U43 ruled out universal *linear* identities for sufficiently large small-circuit classes. This checkpoint tests genuinely nonlinear consistency with actual general Boolean circuits, rather than another linear surrogate.

**Fixed-budget theorem.** For every n>=1, given the complete N=2^n-bit truth table F, a uniform procedure either constructs a circuit of at most two B2 gates computing F, or returns at most seven distinct inputs, with their actual F-labels, on which no two-gate circuit can agree. For n>=3 the worst-case seven-point bound is optimal. With random access to the explicit table, the procedure uses O(n*N) input probes and O(n^2*N) bit operations. This is not an algorithm on a succinct CNF and not an algorithm for growing gate budget.

The proof below reduces arbitrary arity to a finite three-variable claim. That finite claim was checked completely by two independently implemented exact methods. Its proof is computational, with code and outputs retained; it has not been checked by a formal kernel.

## 2. Model, encodings and counted objects

B2 contains all 16 Boolean functions of two bits. Each gate costs one; 0, 1 and uncomplemented input wires are free; repeated predecessors and unrestricted fan-out are allowed. The output is any available wire. A bare NOT costs one gate, although a negation can be absorbed into a subsequent B2 operation. This convention is essential for the finite size counts.

Point x is numbered by x_0+2*x_1+...+2^(n-1)*x_(n-1). An integer f encodes the truth table with bit x equal to F(x). Opcode bit 2*a+b gives the gate output on the ordered inputs (a,b). Nets store predecessor wire indices, not arbitrary precomputed truth functions. Every stored synthesis witness is reevaluated gate by gate from the actual input wires.

The record distinguishes: syntactic descriptions; distinct sets of currently available signal functions; distinct output functions; polynomial feature vectors in *truth-table coordinates*; and subsets of the original input domain. None of these counts is substituted for circuit size.

## 3. Exact finite synthesis

The discovery procedure grows sets of available wire functions in breadth-first order. A gate whose output is already available is omitted. States with the same available function set at the same depth are merged, retaining an actual realizing gate list.

**Completeness of this reduction.** A functionally redundant gate can be removed and every use redirected to an earlier equal wire, since fan-out is unrestricted. Future gates depend only on available wire functions, so two states with identical sets admit the same possible next functions. Thus merging cannot remove a minimum-size realization. Every layer through the first realization of a function is completed. This does not enumerate formula trees only; shared subcomputations are included.

Exact minimum-gate distributions are:

| n | size 0 | size 1 | size 2 | size 3 | size 4 |
|---|---:|---:|---:|---:|---:|
| 1 | 3 | 1 | 0 | 0 | 0 |
| 2 | 4 | 12 | 0 | 0 | 0 |
| 3 | 5 | 33 | 114 | 80 | 24 |

For n=3, the complete prefix-state counts at depths 0,1,2,3 are 1,33,828,20,360. The four expansion layers evaluate 400,19,008,649,152,20,848,640 next-gate descriptions, respectively. Those counts are *not* counts of all raw circuits.

Separately, all ordered raw last-gate descriptions through two gates were enumerated without semantic pruning and gave identical function classes. With n+2 base wires, the raw count for exactly s>=1 gates and the last gate as output is

    product_(j=0)^(s-1) 16*(n+2+j)^2.

At n=3 these counts are 400,230,400,180,633,600,184,968,806,400 for s=1,2,3,4. The last two numbers are algebraic counts, NOT numbers of raw circuits actually enumerated. Circuits with an earlier output reduce to a smaller budget or can append a copy gate.

## 4. A concrete nonlinear identity

Write Z_0,...,Z_7 for the eight truth-table coordinates of a three-input function. Over GF(2), define

    P(Z) = Z0*Z7 + Z1*Z6 + Z2*Z5 + Z3*Z4
           + Z1*Z2*Z4 + Z0*Z3*Z5 + Z0*Z3*Z6 + Z0*Z5*Z6
           + Z3*Z5*Z6 + Z1*Z2*Z7 + Z1*Z4*Z7 + Z2*Z4*Z7.

**Finite lemma A.** F has a B2 circuit of at most two gates iff P(F)=0. Its zero set consists of 152 tables. Its 104 nonzero tables are all separated by this *one cubic polynomial*. No nonzero multilinear polynomial of degree at most two vanishes on all 152 tables.

This is not inferred from the linear span of the original function class. Evaluation matrices with columns all squarefree monomials in Z of degree <=0,1,2,3 have ranks 1,9,37,92, versus column counts 1,9,37,93. The cubic above spans the one-dimensional kernel at degree three. Direct evaluation on every one of the 256 tables verifies the exact zero-set assertion.

A separate structural characterization supplies an independent class definition. For a chosen original input variable x_i, let L,H be its two two-input cofactors. A three-input function has at most two gates iff for some i, L or H is constant, or L=H, or L=1+H. Indeed, a two-gate circuit depending on all three variables must have the shape g(h(x_j,x_k),x_i); its two cofactors are among 0,1,h,1+h. Conversely any such pair is implemented by one gate for h and one for g. Functions depending on fewer variables are included. This characterization, not the BFS synthesis, was used for the Wolfram comparison with P.

Naively evaluating P takes 20 AND and 11 XOR gates on the eight Z inputs. This is a fixed ordinary circuit, not an oracle. It does not give a lower bound for growing gate budgets.

## 5. Short certificates and algebraic degree are different

For each outside target F we separately minimized:

- the number of labeled original inputs excluding the whole circuit class;
- the degree of a polynomial in Z which vanishes on the class and is nonzero at F.

For the three-input two-gate class, 80 targets require exactly six sample points and 24 require seven, but all 104 are separated by degree three. For the three-gate class, all 24 outside targets require seven sample points and have minimum separating degree five. The latter class has no nonzero vanishing polynomial through degree four (rank 163 of 163 columns).

Thus a degree-three global equation is NOT a three-point certificate: it can use all eight coordinates. Equating these quantities would be an invalid inference.

## 6. Two finite facts that finish the uniform construction

**Finite lemma B.** Every table with P(F)=1 has some coordinate x for which P(F XOR 2^x)=1. There are no isolated vertices in the 104-table nonzero set under one-coordinate flips.

Therefore the seven labeled locations other than x exclude every two-gate function: the only two completions of those labels are F and F XOR 2^x, and both have P=1. The procedure finds x by at most eight evaluations of the fixed P. No enumeration of circuits is needed by this generator or its core verifier.

**Finite lemma C.** Three-input majority has table number 232 and cannot be excluded on six or fewer labeled points. Every one of the 247 subsets of the eight locations of size <=6 admits a fitting two-gate table. The seven-point masks 127 and 254 do exclude it. This establishes the lower bound of seven.

The complete TypeScript calculation checks all target/subset pairs. Wolfram independently checks the cofactor class, polynomial, all 104 neighbor conditions, and the 247 majority subsets. These are bounded exhaustive statements, not extrapolations to larger n.

## 7. Seven points for arbitrary arity

A variable is essential when F differs on two inputs differing only at that variable. Such a pair is called a sensitive edge here.

**Gate support lemma.** A single-output fan-in-two circuit with s gates depends on at most s+1 input variables. Remove gates not reaching the output. If r gates remain, at least r-1 internal wires connect them; out of 2r incoming gate wires at most r+1 can therefore come from distinct original inputs. A two-gate circuit cannot fit sensitive pairs for four distinct variables.

**Sensitivity-one lemma.** A Boolean function with at most one sensitive edge incident to each cube vertex is constant or a literal. If it has a sensitive edge in direction i, then at both endpoints every other direction j is insensitive. The parallel i-edge across the (i,j) square is consequently sensitive. Repeating this argument through all j propagates sensitivity to every i-edge; no other direction can be sensitive. The function is x_i or its negation. If there is no sensitive edge, connectedness of the cube makes it constant.

Algorithm:

1. Scan for sensitive pairs in input-variable order, stopping once four essential variables have been found.
2. If four were found, the sensitivity-one lemma supplies a vertex with sensitive edges in two distinct directions. Find such a vertex by scanning. Its vertex and two neighbors use three points. From the four recorded directions, take two distinct directions not in that pair, and add their sensitive endpoint pairs. The union has at most 3+2+2=7 points and witnesses four essential variables for any function fitting its labels. Hence it excludes all two-gate circuits.
3. Otherwise all essential variables, at most three, have been identified. Fix all other inputs to zero and form the eight-entry three-variable core, using dummy variables when fewer than three are essential. If P(core)=0, explicitly construct the two-gate decomposition from its cofactors and map its inputs back. If P(core)=1, use lemma B to output seven points in the core face and lift them to n-bit inputs. A two-gate circuit fitting these points would restrict to a forbidden two-gate core.

The second scan costs O(n*N) probes, as does essential-variable detection. With explicit n-bit addresses, O(n^2*N) bit operations is a conservative bound. Labels are read from F. Cofactor selection, cubic evaluation, and all eight neighbor tests have fixed size independent of n. The delivered algorithm consults no synthesized circuit database: accepted cores are reconstructed from cofactors and rejected cores from two cubic evaluations per candidate omitted point.

For sharpness at any n>=3, pad majority on three coordinates by ignoring the others. Any sample of at most six n-bit points projects to at most six consistently labeled three-bit points. Lemma C supplies a fitting two-gate core, which ignores all the extra coordinates. Therefore no six-point certificate exists for that padded target. Seven is the exact worst-case bound, not necessarily the minimum for every target.

## 8. Executed validation and what was not tested

Final code: `code/u44_u45_audit.ts`. Final complete output: `research/validation/u44_u45_results_final.json` in the conversation package. A compact summary is also preserved remotely.

- Complete exact synthesis for all 276 functions on n=1,2,3, with circuit witnesses, raw-prefix cross-checks, finite minimum-point certificates and degree-rank certificates.
- The uniform procedure was checked on ALL 65,536 four-input functions. It constructed valid <=2-gate circuits for 526, and produced sound certificates for the other 65,010. Each certificate was compared with ALL 526 separately enumerated two-gate functions: 34,195,260 candidate comparisons, with zero failures.
- The final certificate sizes were 5 for 37,310 targets, 6 for 25,836, and 7 for 1,864. We do not assert these individually minimal at n=4.
- One targeted six-variable multiplexer produced a seven-point certificate with sensitive directions 0,1,2,4. This tests sharing-sensitive-edge logic on a different structure; it is not exhaustive n=6 coverage.
- Exact repetition reproduced the final JSON byte for byte. Strict compiler/no-unused and compiled-syntax checks passed. Prior U40-U43 executable assertions were rerun, and U42-U43 output matched its preserved file byte for byte.

Initial variants allowed eight points, then seven with a constant certificate lookup; the final variant eliminates the lookup from the algorithm. Earlier outputs are kept in the local workspace, not overwritten. No failed TypeScript assertion was observed. One redundant malformed Wolfram expression caused warnings; it was removed and a clean corrected invocation reproduced the required checks (see the evidence record).

The TypeScript truth-table masks are intentionally bounded to the stated finite domains; they are not a purported arbitrary-size bit-vector implementation. The arbitrary-n theorem is the explicit reduction and probe/bit-cost proof in Section 7. No proof assistant or independent human reviewer has certified it.

## 9. Connection to the original project

This is a positive, costed construction for a fixed small gate budget. The general-circuit target in OPS2021 requires growing underlying circuit budgets approximately N^beta/(c*log N), and a fixed superlinear exponent for the meta-decider. None of those lower bounds follows from the seven-point result. The next companion note, U45, tests how far polynomial identities can scale and gives a general lower bound on their necessary degree.

Sources: Oliveira, Pich and Santhanam, *Hardness Magnification Near State-of-the-Art Lower Bounds*, Theory of Computing 17(11), 2021, DOI 10.4086/toc.2021.v017a011, https://theoryofcomputing.org/articles/v017a011/v017a011.pdf ; basis discussion p.4, Theorem 1.4 p.6, checked in parsed text and rendered pages this run. This source motivates anti-checkers but is NOT claimed to state our exact finite cubic or seven-point construction. No global novelty claim is made for either; see the source-search record in the checkpoint.
