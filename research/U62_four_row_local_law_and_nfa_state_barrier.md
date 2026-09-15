# U62 — Four-row local law and an exponential exact-NFA barrier

Date: 2026-09-15. Status: self-contained structural theorem and exact finite checks; no P-versus-NP resolution, general-circuit lower bound, formal proof-assistant certification, expert review, or novelty claim.
Dependencies: the B2 convention from U52-U61 and elementary NFA fooling-set reasoning.

## 1. Question

U61 gives a polynomial-size positive #NFA reduction for up to three observed rows. The next required test is whether the same exact-language strategy can extend to four rows.

There are two distinct results here:

1. the four-row local gate distribution has an exact three-bit nonlinear normal form; and
2. there are explicit four-row fixed topologies whose exact compatible-type language needs exponentially many NFA states.

The second statement is only a barrier to that representation strategy. U63 shows that the same language family can still have trivial approximate counting and exact rejection sampling.

## 2. Exact normalized B2 law on four rows

Take four rows indexed 0,1,2,3. Let A,B be the two parent output columns of one B2 gate and normalize by row 0:

    a_i = A_i xor A_0,
    b_i = B_i xor B_0,       i=1,2,3.

Thus a,b are vectors in F_2^3. Every two-input Boolean gate has the unique algebraic normal form

    g(u,v)=c_0 + c_1 u + c_2 v + c_3 uv.

For the normalized child h_i=g(A_i,B_i)+g(A_0,B_0), direct expansion gives

    h = alpha a + beta b + gamma (a*b),                 (1)

where `*` is coordinatewise multiplication and

    alpha = c_1 + c_3 B_0,
    beta  = c_2 + c_3 A_0,
    gamma = c_3.

Together with the output orientation eta=g(A_0,B_0), the transformation

    (c_0,c_1,c_2,c_3) <-> (eta,alpha,beta,gamma)

is a bijective affine change of four bits. Hence under a uniform B2 type, eta,alpha,beta,gamma are independent fair bits.

Let

    V(a,b)=span{a,b,a*b}

and r=dim V. Then every h in V occurs for exactly 2^(3-r) triples (alpha,beta,gamma), and no h outside V occurs. Including either orientation, each normalized shape in V is produced by exactly 2^(4-r) of the sixteen raw gate types.

This is the exact four-row replacement for U61's affine law.

## 3. Why the three-row affine replacement stops here

Take

    a=110_2, b=101_2.

Then

    a*b=100_2,

while

    span{a,b}={000,110,101,011}.

Thus a*b is not in the affine/linear span of a,b, and

    dim span{a,b,a*b}=3.

All eight normalized shapes occur under the full B2 gate, while an affine gate can produce only four. This is the smallest exact obstruction behind U61's four-row counterexample; it is not merely a counting mismatch.

## 4. An explicit four-row topology family

Use the four distinct input rows

    00, 01, 10, 11.

Let t be the second input column, so

    t=(0,1,0,1).

For m>=1 define topology T_m with 4m-1 gates:

1. m left generator gates X_1,...,X_m, each with both predecessors t;
2. m right generator gates Y_1,...,Y_m, each with both predecessors t;
3. m difference gates D_i with predecessors X_i,Y_i;
4. m-1 binary gates forming an OR tree/chain over the D_i.

Now restrict the type word to the regular slice R_m:

- each generator is either ZERO or AND;
- each D_i is XOR;
- every final combiner is OR.

Since AND(t,t)=t, a generator symbol records one arbitrary bit:

    ZERO -> 0-column,
    AND  -> t-column.

XOR produces t exactly when its two generator bits differ. OR of 0/t columns is zero exactly when every difference is zero. Therefore on this slice

    output(T_m)=0000  iff  x_1...x_m = y_1...y_m.       (2)

So the restricted compatible-type language is the length-2m equality language EQ_m.

## 5. Theorem U62.1 — exact NFA recognition can require exponentially many states

Let L_m be the complete language of all 16-ary gate-type words of length 4m-1 that make T_m output 0000 on the four rows. Every NFA recognizing L_m exactly has at least 2^m states.

### Proof

Suppose A is an NFA for L_m with S states. For a binary word uv of length 2m, map each 0 generator bit to the ZERO gate type and each 1 to AND. After those 2m symbols, append the fixed suffix consisting of the m XOR types and m-1 OR types.

Construct an NFA B on alphabet {0,1} with the same state set as A. On a binary input symbol, B uses A's transition on the corresponding ZERO/AND gate symbol. Declare a state accepting in B iff A can follow the fixed XOR/OR suffix from that state to one of its accepting states. By (2), B recognizes

    EQ_m={uv : u,v in {0,1}^m and u=v}.

It remains to recall the elementary NFA lower bound. For every u choose one accepting path for uu and let p_u be its state after the first m symbols. If p_u=p_v for distinct u,v, splice the prefix of the accepting path for uu with the suffix of the accepting path for vv. That yields an accepting path for uv, contradiction. Hence all 2^m states p_u are distinct and S>=2^m. QED.

Since T_m has s=4m-1 gates, this is

    2^m = 2^((s+1)/4)

states. Thus the exact polynomial-size NFA representation used in U61 cannot extend to all four-row topologies.

## 6. What this does and does not rule out

This theorem is unconditional, but its scope is narrow:

- it lower-bounds **exact NFA state count** for a family of compatible-type languages;
- it is not a circuit lower bound;
- it is not a lower bound on randomized approximate counting;
- it is not a lower bound on samplers or arithmetic representations;
- it says nothing directly about the OPS2021 N^(1+epsilon) meta-circuit target.

U63 is an explicit counterexample to overinterpreting it: the full L_m has a constant-density all-zero target and therefore a trivial exact rejection sampler.

## 7. Executed checks

TypeScript `code/u62_u63_audit.ts` checks all 64 normalized parent-shape pairs against all sixteen gate types and verifies equation (1) with exact multiplicities. It also tests every 2m-bit restricted word for m=1,...,8: **87,380** words total. The accepted counts are exactly 2^m.

The same program checks all 256 full parent-column pairs and all sixteen output-gate types for the zero-target count used in U63.

Independent Python uses literal four-row tuples and direct truth-table evaluation. It independently checks the same 64 local cases, all restricted equality words through m=8, and all 256 parent-column pairs. Wolfram 15.0.1 independently verifies all 64 local cases and equality through m=4. The first Wolfram draft had a syntax error and returned no evidence; the corrected call passed and both facts are recorded in the validation file.

No finite check is used to prove the asymptotic NFA lower bound; the proof is Section 5.

## 8. Next interface

The correct next question is not whether a polynomial exact NFA exists: U62 answers no. Instead integrate the final gate type analytically, leaving a positive bounded weight on its two parent columns. U63 derives that identity and identifies the remaining favorable-prefix event for nonconstant targets.
