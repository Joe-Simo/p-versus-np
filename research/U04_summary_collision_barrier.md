# U04 — Collision barrier for compressed description-sensitive witnessing

Date: 2026-09-14
Status: verified conditional method barrier; no P versus NP resolution.

## 1. Setup

Let X be the n-bit input domain of an NP search problem with verification relation R(x,y). Assume there is a correct search circuit D on X. Let S be a set of solvable inputs such that for every x in S there is a circuit C_x in the target size class with exactly one search error:

    C_x(z)=D(z) for z != x,
    R(x,C_x(x)) is false.

For SAT search this is the same local-corruption family used in U01/U02, constructed by adding an equality test for x and forcing a known bad output at x.

Suppose a description-sensitive witnesser first computes a summary h(C) in {0,1}^r and its final counterexample input depends only on that summary:

    phi(C) = g(h(C)).

The algorithm may inspect the full circuit description while computing h, but after compression no other information about C is used to choose phi.

## 2. Theorem U04.1 — summaries must distinguish all one-point corruptions

If phi(C_x) is required to be an error input for every x in S, then h is injective on the family {C_x : x in S}. Consequently

    r >= ceil(log_2 |S|).

### Proof

Suppose x != y but h(C_x)=h(C_y). Then

    phi(C_x)=g(h(C_x))=g(h(C_y))=phi(C_y)=phi.

Because C_x has exactly one error, at x, correctness of the witnesser on C_x forces phi=x. Because C_y has exactly one error, at y, correctness on C_y forces phi=y. Hence x=y, contradiction. Therefore all summaries h(C_x) are distinct. There are at most 2^r r-bit summaries, so 2^r >= |S|. QED.

## 3. SAT consequence

For standard SAT encodings there are exponentially many explicitly satisfiable n-bit formulas at suitable lengths; taking an exponentially large local-corruption family gives

    |S| = 2^{Omega(n)}

and therefore

    r = Omega(n).

Thus no o(n)-bit fingerprint of the circuit can by itself identify a guaranteed same-length error across the local-corruption family, even though the fingerprint computation is allowed full white-box access to the circuit description.

This does not rule out an O(n)-bit summary, nor a procedure that continues to use the circuit description after producing the summary. It shows that compression cannot make the problem qualitatively smaller than identifying an n-bit bad input: in the hardest nearby family, the summary must already contain essentially the information needed to distinguish exponentially many possible error locations.

## 4. Relation to U02 and U03

- U02: polynomially many black-box probes cannot locate a hidden one-point error.
- U03.1: losslessly embedding the entire n^k-size circuit description into an n-bit SAT instance is impossible for k>1.
- U04.1: compressing the description to an o(n)-bit fingerprint and choosing the counterexample only from that fingerprint is also insufficient on the local-corruption family.

The remaining logical space is therefore narrower: a feasible same-length witnesser must use the circuit description in a more structured way that extracts about n bits of decisive error-location information without solving the entire SAT-search problem by brute force and without embedding the complete n^k-size description into the counterexample.

## 5. Next obligation

Investigate proof-sensitive external certificates and downward self-reducibility. In particular, determine whether the circuit's failure can be forced by a short sequence of locally checkable consistency conditions whose descriptions remain external to the n-bit SAT instance, rather than being compressed into it.
