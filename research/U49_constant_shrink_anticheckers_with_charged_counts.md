# U49 — Constant-shrink anti-checkers: the adaptive step works, but its counter remains charged

Date: 2026-09-15. Status: explicit self-contained reconstruction of an established anti-checker method, an executed circuit component, and a promise-sensitive audit. No full P-versus-NP solution, new magnification theorem, or novelty claim.

## 1. Why continue beyond the sampling obstruction

U48 proves that short oblivious lists cannot replace the source's genuinely input-dependent construction. It does not prove that useful short lists fail to exist. We now implement the alternative idea: repeatedly choose a point that eliminates a substantial fraction of all still-consistent circuit descriptions.

The primary paper explicitly describes a **constant-fraction** variant in footnote 13 on printed p.21, crediting prior learning work. The constant-shrink idea is therefore known, not a discovery of this project. Below we provide our own elementary constants and charged majority implementation, and identify exactly which operation is not presently supplied with the needed unconditional cost bound.

## 2. A general version-space lemma

Use U48's B2 convention. Let n>=4 and s>=8 be integers. Let F have circuit complexity strictly greater than 10*n*s. Let V be any nonempty finite multiset of descriptions of circuits with at most s gates, with repetitions allowed.

**Lemma.** Some input x has a disagreement fraction strictly greater than 1/16:

    |{C in V : C(x) != F(x)}| / |V| > 1/16.                             (1)

The circuits may already be constrained by earlier samples. No restriction on the number of survivors is needed. Equal truth tables can be aggregated only if their multiplicities are retained when the distribution is uniform on descriptions.

### Proof

Suppose every x has disagreement probability at most 1/16 under a uniform independent draw from V. Choose L to be the smallest odd integer at least n+1; thus L<=n+2. Draw L descriptions independently, with replacement.

At any fixed x, the probability their majority errs is at most

    sum_(j >= (L+1)/2) binomial(L,j) (1/16)^j
    <= 2^L * (1/16)^((L+1)/2) = 2^(-L-2).

We have dropped factors (15/16)^(L-j) only to enlarge the bound. A union bound over all N=2^n inputs gives error probability at most 2^(n-L-2)<1. Consequently at least one sampled tuple has a majority equal to F everywhere.

Section 3 supplies a majority circuit using at most 32L ordinary B2 gates. The combined circuit uses at most

    L*s + 32L <= (n+2)(s+32) <= 10*n*s,

where n>=4,s>=8 ensure the final inequality (indeed (1+2/n)(1+32/s)<=7.5). This contradicts the stated complexity of F. QED.

This is a finite probabilistic existence argument, not a claim that the successful tuple is found cheaply. It works with any weighting induced by a multiset; an analogous formulation for arbitrary distributions follows by the same proof.

## 3. Ordinary gates for majority: no free oracle

For odd L>=1 pad the L input bits by zeros to P=2^a, the next power of two. Add the bits in a balanced tree, propagating full binary sums. At level j there are P/2^j additions of two j-bit integers. A half-adder on their lowest bits needs two gates; each higher bit uses a five-gate full-adder. Thus each addition uses 5j-3 gates and creates a j+1-bit result.

The total addition cost is

    sum_(j=1)^a [P/2^j]*(5j-3) < 7P < 14L.

For L=1 the addition cost is zero. Compare the final a+1 bits with the constant threshold (L+1)/2. The implemented least-significant-bit recurrence maintains whether the lower prefix is at least the corresponding constant prefix: when the next constant bit is zero use OR with the next sum bit; when it is one use AND. It needs a+1 further gates. For L>=3, a+1<=L, so the total is below 15L and in particular below 32L. The L=1 implementation uses one gate and also satisfies the claimed bound.

Every adder gate is AND, OR, or XOR, each a legal B2 operation. Zero padding is constant wiring. No unbounded-fan-in majority, unit-cost long arithmetic, or preassigned truth-table answer is used. This deliberately loose upper bound is sufficient for the constants in Section 2.

The executable TypeScript program constructs the actual gate DAG. All assignments were tested for every odd L from 1 through 19, totaling 699,050 assignments. Larger L=33,65,129,257,513 builds check topology and size only. The largest construction has 7,122 gates, not an asymptotic lower-bound measurement.

## 4. A small list with a large implementation cost

Start with all exactly-s-gate raw descriptions, allowing an arbitrary output signal; padding ensures every <=s-gate function is present. There are

    D(n,s) = (n+s+2) * product_(j=0)^(s-1) [16*(n+j+2)^2]

descriptions. At each step, for every x compute the number of survivors that would remain after adding the labeled point (x,F(x)). Select a point minimizing that count and delete the disagreeing descriptions.

If F is harder than 10ns, Section 2 shows that every nonempty version space loses more than 1/16 of its mass. Therefore after at most

    R = ceil(ln D(n,s)/ln(16/15)) + 1 = O(s log(n+s))

rounds no candidate remains. The list of selected points is an anti-checker, since every description was removed at a point where it disagrees with F. Selected points are distinct while candidates remain: an already used point removes nothing.

At s=floor(S/(10n)), if F is harder than S it is also harder than 10ns. For every fixed beta>0 with S=floor(N^beta), the stated list bound is O(S) and eventually smaller than the source's t=ceil(N^(10beta)). Constant padding can enlarge a shorter list if a fixed output length is needed.

**Cost audit.** Enumeration and evaluation are not free. A straightforward uniform realization evaluates D descriptions on N inputs, requiring at least the operations of that explicit enumeration and an upper bound O(N*D*s*poly(n+log s)) bit operations. Scanning disagreement counts and selecting a minimum for R rounds has an elementary upper bound O(R*N*D*log(D+2)), with ample explicit-table storage. This is an implementation bound, not a universal lower bound.

Although D=2^(O(s log(n+s))) is an upper bound, the explicit enumeration also has D>=16^s descriptions. Since s=floor(N^beta/(10n)) grows faster than log N for every fixed beta>0, D>=2^(4s) is superpolynomial in N. Thus this particular enumeration implementation is not polynomial in N at the growing budget; this is not a lower bound on all implementations. Aggregating identical output functions preserves exact description weights and saves work in finite cases; no efficient universal construction of that compressed collection is assumed.

Query cost and computation cost therefore separate sharply: read F's N bits once, retain them, and perform this expensive construction. Together with U48, short anti-checker extraction has query complexity between Omega(N/n^2) and N in this model, but that says nothing close to a polynomial-time construction or the needed superlinear general-circuit lower bound.

## 5. Constant-precision approximate counts would suffice for promised progress

Let d_x be the true survivor count after candidate point x. Suppose estimates satisfy

    (127/128)*d_x <= estimated_d_x <= (129/128)*d_x

simultaneously. Choose a point minimizing the estimate. Then its actual count is at most (129/127) min_x d_x. Under the hardness promise, min_x d_x <(15/16)|V|, so

    selected survivors < (129/127)*(15/16)*|V| < (31/32)*|V|.

Thus constant relative accuracy already provides a constant-factor reduction; improving precision alone is not the missing breakthrough. Exact zero is preserved by such a relative approximation, which remains a substantive computational requirement.

The source obtains its needed counters conditionally using approximate counting with a SAT oracle, then replaces the oracle under its assumed circuit-class inclusion. We do not assume that inclusion. Our finite code counts the entire specified class exactly; it does not implement an efficient substitute for the source's conditional counting machinery.

## 6. Deliberate adversarial test: outside the promise, approximate selection can stall

We initially asserted that the perturbed-count version would make strict progress on **every** small test target. Execution refuted that assertion. A relative error can mask a tiny decrease when a target already has a surviving exact circuit; there is then no hardness promise to force the decrease in Section 2.

For example, one tested state has total description mass 2,320 and optimum survivor count 2,312. The difference is less than the allowed perturbation. The initial assertion failed; it was not counted as a successful check.

The final finite experiment explicitly records an exact-count fallback only when approximate selection would remove nothing, and separately verifies that a fallback never occurs when the best true count is <=15/16 of the mass. There were 18 such fallbacks, all on member functions, and none in a certified promised-progress situation. The fallback is permitted because this finite audit already enumerates all descriptions; it is **not** an uncharged subroutine in a claimed growing-budget algorithm.

This is a counterexample to an overbroad implementation claim, not a flaw in the promise-specific lemma. A promise-correct anti-checker generator need not meaningfully shrink the class on easy targets: its output can be arbitrary there, and a later consistency test will still find the actual small circuit.

## 7. Executed nonlinear consistency audit

The TypeScript raw enumerator counts 230,400 ordered two-gate lists with seven possible output signals on three inputs: 1,612,800 descriptions, representing 152 distinct functions. A separate Python implementation uses per-assignment Boolean vectors and independently reconstructs every multiplicity. Only afterward does it compare to the TypeScript result; every weight agrees.

All 256 three-input target tables were processed under three policies: description-uniform, function-uniform, and multiplicatively perturbed description counts. The 768 traces agree entry-for-entry with a separate Python implementation that reconstructs each survivor set from accumulated sample constraints rather than mutating the previous list. The 312 resulting certificates were checked against the entire finite class. Their maximum size is eight; no minimum-cardinality claim is made. The remaining runs end with a function equal to the target.

The policy scans made 1,785,296 finite weighted agreement comparisons. These counts are implementation evidence, not evidence for an asymptotic growth law. The finite n=3,s=2 domain does not satisfy the high-budget premise n>=4,s>=8; it tests algorithm semantics, the handling of easy cases and multiplicities, not the universal hardness implication.

Wolfram separately checked 125 exact majority-tail/cost parameter cases and the rational approximate-selection inequality. Independent code agreement is not independent expert review or formal-kernel certification.

## 8. Source audit and unresolved next obligation

Oliveira-Pich-Santhanam (2021), Theorem 1.4, Lemma 4.1, Corollary 4.3, Lemma 4.7 and **footnote 13**, https://theoryofcomputing.org/articles/v017a011/v017a011.pdf , were inspected at their relevant rendered pages. The external target still requires one fixed epsilon for every sufficiently small beta and concerns ordinary circuits on N-bit meta-inputs. The constant-shrink idea is expressly present in the footnote; our constants and executable component checks do not constitute a new magnification result.

Lipton-Young, *Simple Strategies for Large Zero-Sum Games with Applications to Complexity Theory*, STOC 1994, archived as arXiv:cs/0205035, Section 5, https://arxiv.org/pdf/cs/0205035 , establishes earlier anti-checker/majority methods. Its circuit-size convention uses encoding length in its stated theorem, so its numerical constants are not transplanted into our B2 gate count. Sections 2-5 above supply the needed direct proof under our convention.

The next full-problem obligation is not more finite gate-budget enumeration or a smaller list constant. It is to understand the actual predicate

    number of size-s descriptions consistent with a given labeled list,

or find a different way to choose a point with certified progress, without silently invoking the conditional counter. A useful next test is a direct low-space/streaming counter approximation whose accuracy is relative even when the consistent-description set is exponentially rare. Before proposing this as efficient, audit the acceptance fraction under uniform circuit descriptions and whether any conditional sampler can be implemented without the same consistency oracle. This is a new computational obligation, not a conclusion that all alternatives are impossible.
