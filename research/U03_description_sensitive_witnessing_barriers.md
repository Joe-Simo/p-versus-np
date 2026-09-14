# U03 — Description-sensitive witnessing: scale barrier and refuter consequence

Date: 2026-09-14
Status: verified partial research only; no P versus NP resolution.

## 1. Context

The active question is whether a polynomial-time function can take the description of an n-input SAT-search circuit C of size n^k which is wrong on some satisfiable n-bit formula and output, at the same input length n, a satisfiable formula phi together with a satisfying assignment a such that C(phi) is not a valid satisfying assignment.

U02 rules out purely black-box polynomial-query strategies. The surviving possibilities must inspect the circuit description, use proof structure, or use non-black-box self-reference.

This note establishes two constraints on those possibilities.

## 2. Lemma U03.1 — lossless direct self-embedding cannot be same-length for k>1

Let Enc be any map from a set D of binary circuit descriptions to binary strings such that the original description d can be recovered uniquely from Enc(d). Then Enc is injective, and for every m for which D contains all m-bit strings, some image Enc(d) has length at least m.

More generally, if every m-bit d in D is encoded into a string of length at most N, then necessarily

    2^m <= sum_{i=0}^N 2^i < 2^(N+1),

so N >= m-1.

### Proof

Unique recoverability implies injectivity. There are 2^m possible m-bit descriptions. There are fewer than 2^(N+1) binary strings of length at most N. Injectivity therefore forces 2^m < 2^(N+1), hence N >= m-1. QED.

### Circuit consequence

A standard fan-in-2 Boolean circuit with s gates needs Omega(s) bits even under an optimistically compact lossless description convention, and standard explicit descriptions use Omega(s) to O(s log s) bits depending on gate-address encoding.

Therefore any self-referential SAT instance which literally and losslessly contains the entire description of an arbitrary size-s circuit C requires Omega(s) bits merely to carry that description.

For the Pich--Santhanam target s=n^k with k>1, this is Omega(n^k), while the required counterexample formula has encoded length exactly n. Thus a direct construction of the form

    "build an n-bit formula containing the whole description of C and ask it to diagonalize against C"

cannot work for arbitrary size-n^k circuits when k>1.

This is an information-theoretic statement about lossless full-description embedding. It does not rule out a witnesser that uses only a compressed property of C, exploits non-injective syntax classes, or computes the counterexample from C without embedding C into the formula.

## 3. Tseitin/Cook--Levin specialization

The same obstruction appears concretely in the usual circuit-to-CNF route. A gate-by-gate Tseitin encoding introduces O(1) clauses and at least one consistency variable per non-input gate, so the resulting formula has size Theta(s) up to ordinary addressing/encoding factors.

Hence applying ordinary Cook--Levin/Tseitin compilation to the computation of a size-n^k circuit produces a formula whose encoding length is polynomially larger than n for every k>1. Padding can increase a formula's length but cannot compress this Theta(n^k)-scale description back to n while retaining the direct gate-by-gate simulation.

Consequently, ordinary recursion-theorem intuition plus a standard circuit simulation does not solve the same-length synchronization problem.

## 4. Lemma U03.2 — a conditional refuter plus persistent lower bounds would contradict the 2025 Chen--Li--Oliveira refuter theorem

Chen, Li, and Oliveira (arXiv:2404.11841v3, Theorem 3.2) prove the following unconditional statement for SAT decision circuits: if rational constants satisfy

    1 < k < c < k^2,

then there is no nonuniform refuter family R_n of size at most n^c which, for every sufficiently large n and every co-nondeterministic circuit E of size at most n^k, outputs an n-bit x with E(x) != SAT_n(x).

Now suppose W_n is a *conditional* error witnesser of size at most n^c with the weaker guarantee

    if E is incorrect on length n, W_n(E) outputs x of length n with E(x) != SAT_n(x).

Then SAT_n must be computable by some co-nondeterministic circuit of size at most n^k for infinitely many n.

### Proof

Assume the contrary: for every sufficiently large n, no co-nondeterministic circuit of size n^k computes SAT_n correctly. Then every such E is incorrect. By the conditional guarantee, W_n(E) returns an error for every E in the class at every sufficiently large n. Therefore W is a full refuter in the sense prohibited by Chen--Li--Oliveira Theorem 3.2, contradiction. QED.

### Interpretation

This does not refute the Pich--Santhanam feasible-witnessing program, because their target is a SAT *search* circuit and the guarantee is conditional on that circuit being wrong. It does show a structural phenomenon in the closest decision-circuit analogue: a low-complexity same-length conditional witnesser cannot coexist with an eventual lower bound at the corresponding co-nondeterministic size scale; instead it forces infinitely-often upper bounds.

Thus description-sensitive witnessing is not merely a syntactic diagonalization trick. At some parameter ranges, its existence already interacts nontrivially with circuit upper bounds.

## 5. Relation to Pich--Santhanam

Pich--Santhanam define, for a p-time function f, formulas w_n^k(f) expressing that for every n-bit formula x and every size-n^k search circuit C, either C produces a satisfying assignment whenever one exists or f(C) produces a same-length satisfiable counterexample with an explicit satisfying assignment on which C fails.

Their paper explicitly notes that the Bogdanov--Talwar--Wan dreambreaker does not guarantee that the counterexample has the circuit's own input length, and that this same-length feature is crucial.

U03.1 shows that the most literal non-black-box fix -- embedding the entire circuit into its own n-bit adversarial formula -- cannot meet this requirement for k>1. U03.2 shows that, in the nearby decision/co-nondeterministic setting, a low-complexity conditional witnesser would already force infinitely-often small circuits.

## 6. Current route constraint

The surviving same-length approach must avoid both of the following:

1. polynomially many black-box probes of C alone (U02), and
2. lossless full-description embedding of C into the n-bit counterexample (U03.1).

A viable construction would therefore have to extract from C a much shorter, nontrivial invariant or certificate which is sufficient to identify a failure, or use proof-theoretic structure where the circuit description remains external to the n-bit SAT instance.

The next research target is to test whether downward self-reducibility of SAT can supply such a short external certificate without already performing NP-hard search.

## 7. Sources checked

- J. Pich and R. Santhanam, "Towards P != NP from Extended Frege Lower Bounds", ECCC TR23-199 (2023), especially the feasible-witnessing definition and w_n^k(f) construction.
- L. Chen, J. Li, and I. C. Oliveira, "On the Unprovability of Circuit Size Bounds in Intuitionistic S^1_2", arXiv:2404.11841v3 (2025), especially Theorem 3.2 and Lemma 3.4.

No claim in this note is a P versus NP separation.