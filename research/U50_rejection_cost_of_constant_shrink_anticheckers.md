# U50 — The constant-shrink method forces rare but nonempty sampler states

Date: 2026-09-15. Status: self-contained sampler-specific theorem, executed exact checks, and a hypothetical prefix-sampling construction with its counter explicitly charged. No P-versus-NP solution, general-circuit lower bound, formal-kernel certification or novelty claim.
Dependencies: U45 interpolation and U49's constant-shrink lemma, both rederived below in the portions used. The OPS theorem is motivation, not an unproved assumption inside the new bound.

## 1. What was tested

U49 constructs short anti-checkers by successively discarding at least a constant fraction of the circuit descriptions still compatible with observed labels. Its unresolved operation is computing or sampling that conditional distribution. This run tests the concrete proposal: draw ordinary random descriptions and reject those violating the labels.

**Result.** For every target satisfying U49's circuit-hardness promise, this implementation encounters a nonempty version space at which one more uniform conditional sample requires at least (16/15)^floor((s+3)/2) expected proposals. For the growing budget s=floor(N^beta/(10 log_2 N)), this is superpolynomial in N. This is not a lower bound for arbitrary conditional samplers; U51 supplies a positive example escaping rejection entirely.

## 2. Definitions and scope

Fix n>=4, N=2^n, s>=8, and r=floor((s+3)/2)<=N. A B2 gate is any of the sixteen binary Boolean functions. Constants 0,1 and uncomplemented input wires are free, repeated predecessors and fan-out are allowed. A raw description has exactly s topologically ordered gate triples plus one output index. Unused gates permit every at-most-s function to occur.

The original sampling universe has size

    D=(n+s+2) product_(j=0)^(s-1) 16(n+j+2)^2.

Uniform means uniform on these descriptions, not on distinct functions. Duplicate functions retain their syntactic multiplicities. For distinct labeled samples Y, V(Y) consists of all descriptions agreeing with every label. Testing a given description against Y costs polynomial time in its length and |Y|; finding/counting such descriptions is a different operation.

F is accessed as its full N-bit truth table. The hypothesis is that F needs more than 10ns B2 gates. This is a promise on F, not something this algorithm is assumed able to recognize efficiently.

## 3. Why the process cannot finish before r+1 samples

**Interpolation lemma.** Any consistent labeling of t>=2 distinct n-bit inputs can be extended by a B2 circuit with at most 2t-3 gates.

Proof. Recursively split the specified points on a coordinate where two of them differ, until each nonempty leaf has a single label. The resulting binary decision tree has at most t leaves and I<=t-1 internal nodes. At a node with two constant children its function is a constant or unary function of the split bit, costing at most one B2 gate. With one computed child and one constant, a single binary gate suffices. With two computed children, a three-gate Shannon multiplexer suffices. In particular, the cost is at most one plus the number of computed children at each node. There are I-1 edges between internal nodes, so the total is at most I+(I-1)=2I-1<=2t-3. A one-leaf tree costs zero. QED.

For t=1, a constant suffices. Since 2r-3<=s, every correctly labeled set of at most r distinct points has V(Y) nonempty, regardless of F's behavior at other inputs. Thus no sound anti-checker against size-s circuits has at most r points. This is an existence statement for a fitter, not a promise of efficient exact minimum synthesis.

## 4. Rechecked constant-shrink premise

For any distribution on size-s circuits, some input disagrees with F with probability greater than 1/16. Otherwise choose an odd L with n+1<=L<=n+2 independent samples. At a fixed input their majority errs with probability at most 2^L(1/16)^((L+1)/2)=2^(-L-2). A union bound over 2^n inputs is less than one, so some L-tuple has majority equal to F everywhere.

The explicit binary majority circuit in U49 costs at most 32L gates; its proof uses an ordinary adder tree and a constant comparison. Consequently this tuple computes F with at most (n+2)(s+32)<=10ns gates, contradicting the promise. No efficient construction of that tuple is inferred. This rechecks the mathematical use of U49; its executed majority code and original derivation remain preserved.

Applied to the uniform distribution on V_i, every exact-count selection round can ensure

    |V_(i+1)| <= (15/16)|V_i|.

A selected input is new while V_i is nonempty, since an old label eliminates no survivor. By Section 3, V_r is still nonempty, and

    0 < |V_r|/D <= (15/16)^r.                                      (1)

This holds on every history satisfying the stated shrink condition, not merely an adversarial labeling chosen independently of the algorithm.

## 5. Rejection cost and the emptiness distinction

Drawing independent uniform descriptions from the original universe and testing them against Y has success probability p=|V(Y)|/D. On a nonempty set, the first accepted description is exactly uniform on V(Y), with

    E[proposals]=1/p,
    Pr[no acceptance in B proposals]=(1-p)^B.

Therefore (1) forces E[proposals]>=(16/15)^r. The bound counts only proposals, granting their generation and evaluation free; charging actual operations cannot reduce it. For success probability at least 2/3 within a fixed B, the union bound Pr[accept]<=Bp already requires B>=2/(3p).

At N=2^n and any fixed 0<beta<1, let S=floor(N^beta) and s=floor(S/(10n)). For all sufficiently large n, the assumptions s>=8 and r<=N hold, and any F harder than S satisfies the stronger needed premise F harder than 10ns. The cost is

    2^Omega(s)=2^Omega(N^beta/log N),

which dominates every fixed polynomial in N. This is a lower bound for the explicitly described rejection implementation, not the OPS general-circuit premise.

Independent nested rejection does not avoid it: sampling V_i by repeatedly calling a fresh sampler for V_(i-1) has expected original proposals D/|V_i|, since the conditional acceptance factors telescope. This statement assumes fresh independent calls and no more powerful stateful sampler; it is not a theorem about every caching strategy.

On an empty V, ordinary rejection never accepts. Observing no acceptance after a finite cutoff is not a sound certificate of emptiness. A zero-detecting counter must distinguish this case from exponentially rare nonempty sets. No NP-completeness claim about this particular circuit-consistency problem is needed or asserted.

## 6. A broader but carefully scoped rarity observation

Fix r distinct input points. Every one of their 2^r labelings is feasible by Section 3. Under any fixed proposal distribution on size-s descriptions, these labelings partition its mass. At least half have acceptance probability at most 2^(1-r); some distributions assign probability zero to a feasible labeling. This applies even to nonuniform proposals that ignore the labels, but not to a proposal whose design uses those labels.

At the growing parameters, each labeling also has a circuit-harder-than-S completion once N-r exceeds the logarithm of the number of size-S descriptions. The latter is O(S log(n+S))=o(N), while r=o(N). This is an existence/counting observation, not an algorithm constructing a hard completion. More importantly, Section 4 already proves rarity along the actual constant-shrink histories.

A finite particle pool may become empty while V is nonempty. Its emptiness cannot replace a sound consistency check. We do not attach a probability estimate to histories selected using the same pool without separately analyzing that dependence.

## 7. What a counter really buys: prefix-conditioned sampling

Use a fixed injective binary encoding of raw descriptions, with length ell=O(s log(n+s)); invalid encodings are excluded by a polynomial-time verifier. Let C(p) count compatible descriptions extending prefix p. Exact counts give a uniform sampler: at each bit choose b with probability C(pb)/(C(p0)+C(p1)). Along a valid leaf the ratios telescope to 1/C(empty).

Suppose instead every queried count is within a relative factor 1+-delta of its true value, with zeros returned as zero. Each conditional branching probability differs from the true one by total variation at most 2delta/(1-delta). Coupling at successive prefixes gives an output distribution within 2ell*delta/(1-delta) of uniform. Thus delta=epsilon/(4ell), for 0<epsilon<=1/2, suffices for distance below epsilon. With randomized counts, add the failure probability of the at most 2ell+1 calls, using fresh random bits and a union bound. A final description check can reject invalid output, but does not construct the counter.

All of this is conditional on the count estimates being available at the charged cost. Prefixing leaves the same constrained counting task; it does not eliminate it. This is the familiar self-reduction mechanism underlying counting/generation connections, included with a direct proof rather than cited as a new result. It neither derandomizes SAT nor supplies the almost-linear ordinary circuit construction required for magnification.

## 8. Executed evidence and limits

The new TypeScript code enumerated 230,400 two-gate lists at n=3 and 1,612,800 descriptions including output choices, recovering the same 152 functions and all multiplicities as U49. It checked all 6,561 partial labelings, all 129 patterns on at most two points for feasibility, 31,245 exact finite geometric-tail inequalities, and 256 exact-count elimination traces. Python independently evaluated raw gates per assignment, reconstructed all surviving masses and verified the nested-cost identity only after its own computation.

The tiny budgets do not satisfy U49's n>=4,s>=8 hardness promise. They check the model, counting and sampling formulas, not the growing theorem by extrapolation. The proof of that theorem is Sections 3-5.

The hypothetical prefix sampler was exhaustively tested on all subsets of bitstrings of length 1,2,3, under exact counts and two deterministic relative perturbations: 828 cases including nine empty-root returns. All nonempty distributions were supported on the correct set; the maximum observed total-variation error was exactly 1/128. These counts were computed from explicit sets, not from an efficient generic circuit counter.

A numerical certificate at n=512, beta=1/16 has S=2^32, s=838,860 and r=419,431. Since 16^11>2*15^11, the expected rejection proposals exceed 2^38130. This is exact parameter arithmetic, not an executed massive experiment. Wolfram independently checked this elementary exponential inequality, all rounding cases s=1..1000, and 105 geometric inequalities.

## 9. Sources and next executed follow-up

The context is Oliveira-Pich-Santhanam, *Hardness Magnification Near State-of-the-Art Lower Bounds* (2021), Theorem 1.4 and footnote 13 on printed p.21, rechecked in parsed text and rendered pages: https://theoryofcomputing.org/articles/v017a011/v017a011.pdf . Its constant-fraction anti-checker idea is established literature; (1) is our elementary implementation audit, not a new magnification result.

Jerrum-Valiant-Vazirani, *Random generation of combinatorial structures from a uniform distribution* (1986), DOI 10.1016/0304-3975(86)90174-X: publisher abstract checked, not the full original proof. No unchecked detailed theorem from it is used; Section 7 is proved directly.

Delannoy-Meel, *On Almost-Uniform Generation of SAT Solutions: The power of 3-wise independent hashing* (2022), author copy https://www.cs.toronto.edu/~meel/Papers/lics22.pdf : the abstract and introduction explicitly retain a SAT oracle. Fewer oracle calls do not make the oracle an ordinary polynomial-time subroutine; no full independent paper audit is claimed.

U51 executes the natural alternative to global rejection: local updates inside the feasible circuit set. It finds a genuine disconnectedness obstruction, then constructs a direct uniform sampler for the same restricted family, so the distinction between an implementation failure and general sampling hardness remains explicit.
