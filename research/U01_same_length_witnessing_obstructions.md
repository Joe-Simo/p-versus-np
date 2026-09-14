# U01 — Same-length SAT witnessing: exact implications and two obstructions

Date: 2026-09-14
Status: verified partial research only; no P versus NP resolution.

## 1. Target object

Fix an encoding of SAT instances as n-bit strings and a polynomial-size search circuit C with n input bits and at most n output bits. A same-length witnessing function for exponent k is a polynomial-time function f such that, whenever C of size <= n^k fails to output a satisfying assignment for at least one satisfiable n-bit formula, f(C) outputs an n-bit formula phi and assignment a satisfying phi while C(phi) is not a satisfying assignment of phi.

This is the exact form isolated by Pich--Santhanam in their witnessing formulas w_n^k(f). It is stronger than merely producing some hard instance at an unspecified input length.

## 2. Lemma U01.1 — polynomial anticheckers directly encode a circuit lower bound

Let g:{0,1}^n->{0,1}. Suppose g has a Boolean circuit D of size s. Let q(n) be an upper bound on the size of a circuit EQ_x(y) computing [y=x] for a fixed x in {0,1}^n; q(n)=O(n) for a standard fan-in-2 basis.

For each x define

    C_x(y) = D(y) XOR EQ_x(y).

Then C_x has size at most s+q(n)+O(1) and differs from g on exactly the single input x.

Therefore any set A subseteq {0,1}^n with the property

    every circuit of size <= s+q(n)+O(1) that fails to compute g
    disagrees with g on some input in A

must equal the full domain {0,1}^n.

### Proof

Fix x. C_x is an incorrect circuit in the stated size range, and its unique error is x. Hence the hitting property forces x in A. Since x was arbitrary, A contains all 2^n strings. QED.

### Consequence

A polynomial-size universal antichecker against circuits only O(n) larger than a correct circuit cannot coexist with that correct circuit. Thus obtaining a small antichecker at nearly the same size scale is already a genuine circuit lower-bound statement, not a cheap black-box consequence of enumerating tests.

This also explains why the Lipton--Young antichecker theorem quoted by Pich--Santhanam uses a size gap: hardness against s^3-size circuits yields a poly(s)-size antichecker against s-size circuits. The local-repair construction above does not contradict that gap.

## 3. Lemma U01.2 — the uniform dreambreaker theorem does not yield same-length nonuniform witnessing by hardwiring one circuit

Assume a theorem of the following uniform form: for every polynomial-time SAT search algorithm A, a polynomial-time procedure D(A,1^m,t(m)) outputs, for infinitely many lengths m, a satisfiable m-bit formula on which A fails, together with a witness.

Fix one n-bit circuit C_n. Define a uniform algorithm A_{C_n} that simulates C_n on n-bit inputs and rejects on all other input lengths.

Then applying the uniform dreambreaker theorem to A_{C_n} gives no guarantee of an error at length n. In fact, every satisfiable formula of every length m != n is already an error of A_{C_n}; hence the theorem's infinitely-many-length conclusion can be satisfied entirely away from n without revealing any error of C_n.

### Proof

By definition A_{C_n} rejects all inputs of lengths m != n. For each such m admitting at least one satisfiable encoding, any satisfiable formula is a witnessed error. Thus an infinite set of off-target hard lengths exists independently of C_n's behavior at n. The uniform theorem does not specify that n belongs to its hard-length set. QED.

### Consequence

The naive reduction

    single-length circuit C_n -> hardwire into a uniform algorithm -> invoke dreambreaker

does not solve the same-length witnessing problem. Any successful adaptation needs an additional synchronization mechanism forcing the produced counterexample to remain at the circuit's own length.

## 4. Padding audit

Ordinary SAT padding only gives one-way control of lengths: an m-bit formula can be expanded to a longer equivalent formula by adding syntactic padding. This lets a solver for a sufficiently large target length sometimes solve smaller source instances. It does not force a uniform dreambreaker, whose guaranteed hard length is unspecified, to land on a chosen n. If the hard length exceeds n, mapping it back to exactly n would require a nontrivial compression preserving satisfiability and a way to transfer the candidate circuit's behavior; no such unconditional mechanism is supplied by ordinary padding.

Therefore padding does not close U01.2.

## 5. Research consequence

The most precise current bottleneck at the Route B/C interface is now:

**Synchronization problem.** Construct, from an n-input search circuit C that is wrong somewhere on satisfiable n-bit SAT instances, in poly(n,|C|) time an n-bit satisfiable formula phi plus a satisfying assignment a such that C(phi) fails.

The requirement is conditional on C actually being wrong at that length. It must not assume a stronger primitive (one-way functions, pre-existing hard E functions, or SAT circuit lower bounds) that already carries comparable hardness unless that dependency is made explicit.

Pich--Santhanam show that such witnessing, when suitably formalizable, can bridge strong proof-complexity lower bounds to SAT circuit lower bounds. Bogdanov--Talwar--Wan provide a related uniform dreambreaker but do not supply this same-length nonuniform synchronization.

## 6. Next executable attacks

1. Search for a length-preserving self-reduction or locally checkable consistency transformation for SAT that can turn an arbitrary same-length search circuit C into a certified same-length error.
2. Try to prove an impossibility for purely black-box synchronization strategies that only query C on polynomially many n-bit formulas, using local repair/adversarial completion.
3. Keep an equality track separate: a failure of same-length witnessing is not evidence for P=NP.
