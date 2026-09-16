# U69 — The balanced favorable-prefix language can need exponential NFA states while exact rejection sampling stays constant-time in expectation

Date: 2026-09-16. Status: self-contained exact-NFA state lower bound for the favorable-prefix event plus an exact sampler/FPRAS for the same topology family. No P-versus-NP resolution, approximation hardness theorem, unrestricted sampler, formal proof-assistant verification, independent expert certification, or novelty claim.
Dependencies: U62's equality-slice topology and U63/U68's balanced favorable-prefix condition.

## 1. Why this test matters

U63 reduced balanced four-row target counting to a nonnegative weighted sum over prefixes satisfying the favorable event F_Y. U61 had succeeded for three rows because the relevant positive language had a polynomial-size NFA and could use the published #NFA FPRAS. U62 showed that the full four-row compatible language can need exponentially many NFA states, but U63 correctly warned that the favorable-prefix support might still be simpler.

This unit closes that exact-language loophole: the favorable-prefix language itself can require exponentially many NFA states. It then immediately shows why this remains only a representation barrier: the same full favorable language has density at least 1/8 and therefore admits trivial exact rejection sampling and an elementary FPRAS.

## 2. Start from U62's equality slice

Use the four distinct sampled rows

    00, 01, 10, 11,

and let

    t = (0,1,0,1)

be the second input column.

For m>=1, U62 defines a topology T_m with 4m-1 gates. On the regular type slice:

- each X_i and Y_i generator is ZERO or AND on (t,t), encoding bits x_i,y_i;
- each difference gate is XOR;
- the m-1 combining gates are OR.

Its output O satisfies

    O=0000  iff x=y,
    O=t     iff x!=y.                                         (1)

The second line holds because every difference is either 0 or t and their OR is t as soon as one differs.

## 3. Convert equality into balanced favorable-prefix support

Add one more prefix gate R with parents O and t and fix its type on the restricted slice to

    r(u,v) = v AND NOT u.

In raw B2 table encoding this is a legitimate single type. From (1),

    R=t     if x=y,
    R=0000  if x!=y.                                          (2)

Now imagine one final free B2 output gate whose parents are

    A=0000, B=R,

with balanced requested target Y=t. Integrate this final gate analytically as in U63. Since A is constant, Y is constant on the blocks of (A,B) exactly when the bipartition induced by B matches the bipartition induced by t. Thus the favorable-prefix event is

    F_t  iff  B=t or B=NOT t.                                 (3)

On the restricted slice (2), B is only t or 0000, so

    F_t  iff x=y.                                              (4)

The prefix has exactly 4m gates: the 4m-1 gates of T_m plus R. The final integrated gate would make the complete topology size 4m+1.

## 4. Theorem U69.1 — exponential exact-NFA state complexity already for favorable support

Let L_m^fav be the language of all 16-ary raw type words for the 4m prefix gates that satisfy F_t. Any NFA recognizing L_m^fav exactly has at least 2^m states.

### Proof

Suppose A is an NFA for L_m^fav. Restrict the first 2m generator positions to the two symbols ZERO/AND and fix the remaining m XOR, m-1 OR, and one transform symbol exactly as above. For a binary word xy of length 2m, map 0 to ZERO and 1 to AND in the generator positions.

Create a binary-alphabet NFA B with the same states as A. B simulates those generator transitions, and a state is accepting exactly when A can consume the fixed XOR/OR/transform suffix from it and end accepting. By (4), B recognizes

    EQ_m={xy : x,y in {0,1}^m and x=y}.

For each x choose one accepting path for xx and let p_x be the state after the first m symbols. If p_x=p_y for x!=y, splice the prefix of the accepting path for xx with the suffix of the accepting path for yy; this accepts xy, contradiction. Hence all 2^m states p_x are distinct.

Therefore

    states(A) >= 2^m = 2^(r/4),                                (5)

where r=4m is the prefix length. In terms of the complete topology including the final integrated gate, this is 2^((s-1)/4).

The finite code checks every restricted xy through m=8, 87,380 words total; exactly 2^m are favorable at each m. Those checks support the implementation but do not prove the asymptotic lower bound; the splice argument does.

## 5. Theorem U69.2 — the same full favorable language is dense

The NFA lower bound does not imply approximate counting or sampling hardness.

Condition on arbitrary raw types for the first 4m-1 gates, so O is now an arbitrary four-row column. Leave only the transform gate R random and uniform over its sixteen B2 types.

Two raw transform types work for every possible O:

    r_1(u,v)=v,
    r_2(u,v)=NOT v.

They produce R=t and R=NOT t respectively, and both satisfy (3). Therefore

    Pr[F_t | every earlier raw type] >= 2/16 = 1/8.            (6)

The bound is sharp. For example, take O=(0,0,1,1); together with t=(0,1,0,1), the four rows realize all four input pairs 00,01,10,11. Producing t or NOT t then fixes all four truth-table entries, giving exactly two favorable raw transform types.

Literal enumeration over all sixteen possible O columns yields transform favorable-count histogram

    2 -> 4 columns,
    4 -> 8 columns,
    8 -> 4 columns,

so the minimum two is exact.

### Exact uniform sampler

Draw all 4m prefix gate types uniformly, evaluate the four rows, and accept iff F_t holds. Conditioning a uniform raw word on acceptance is exactly uniform on L_m^fav. By (6), the expected number of proposals is at most eight.

### Relative approximate counter

Let p=|L_m^fav|/16^(4m). Since p>=1/8, independent Bernoulli trials estimate p multiplicatively using O(epsilon^-2 log(1/delta)) samples up to an absolute constant. Multiplying by 16^(4m) gives an elementary FPRAS for |L_m^fav|.

No external theorem is used for either statement.

## 6. Interpretation

This gives a second sharp warning about representation lower bounds:

    exponential exact-NFA state complexity

can coexist with

    constant-expected-time exact rejection sampling

and an elementary FPRAS, even for the nonconstant balanced favorable-prefix event that remains after final-gate integration.

Therefore an exact-NFA lower bound is not the missing four-row approximation obstruction. Conversely, the easy sampler here is topology-family-specific because of the deliberately added transform gate; it is not an unrestricted four-row FPRAS.

Combined with U68:

- signed Fourier decomposition is exact but can have exponential cancellation;
- pointwise positive final-gate integration avoids that cancellation;
- the positive favorable support can still have exponential exact-NFA complexity;
- that NFA complexity still does not imply approximate hardness.

The unresolved object remains arbitrary-topology relative counting/sampling of a possibly rare balanced favorable-prefix event.
