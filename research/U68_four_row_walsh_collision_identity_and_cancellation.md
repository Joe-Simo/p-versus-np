# U68 — Four-row Walsh collision identity, a positive balanced formula, and an exponential cancellation family

Date: 2026-09-16. Status: self-contained exact identities and a method-specific cancellation obstruction, with independent exhaustive checks. No P-versus-NP resolution, general approximation lower bound, formal-kernel certification, independent expert review, or novelty claim.
Dependencies: the B2/raw-description convention from U52-U67; no external theorem is used.

## 1. Exact character moment for one fresh B2 gate

Fix q sampled rows. Let the two parent sampled columns be A,B, and write

    p_i = (A_i,B_i) in {0,1}^2.

Choose a B2 gate g uniformly from the sixteen truth tables and put H_i=g(p_i). For a subset S of rows, use the Walsh character

    chi_S(H) = (-1)^(sum_(i in S) H_i).

For each truth-table address z in {0,1}^2 let epsilon_z=(-1)^(g(z)). Under a uniform raw B2 table the four epsilon_z are independent fair signs. Therefore

    chi_S(H) = product_z epsilon_z^(m_z(S)),

where m_z(S) counts rows i in S with p_i=z. Taking expectation gives the exact rule

    E_g[chi_S(H)] = 1  if every m_z(S) is even,
                    0  otherwise.                              (1)

This is a local equality/collision identity. It includes repeated rows and repeated predecessor values automatically; no independence is asserted between different row-pair events after the parents themselves are random.

The TypeScript checker verifies (1) for all 256 four-row parent-column pairs and all 16 subsets S, 4,096 literal character checks. Independent Python and Wolfram reconstruct the same identity from literal truth-table values.

## 2. Specialization to four rows

For rows i,j define the joint-parent collision indicator

    C_ij = 1[(A_i,B_i)=(A_j,B_j)].

For |S|=2, equation (1) gives

    E chi_{ij}(H) = C_ij.                                      (2)

For S={0,1,2,3}, let Q be the event that every parent-pair address used by the four rows occurs an even number of times. With four rows the only possible block-size patterns are 4 or 2+2. Hence Q is exactly the union of the three pairings

    P_01|23 = C_01 C_23,
    P_02|13 = C_02 C_13,
    P_03|12 = C_03 C_12.

Any intersection of two distinct pairing events forces all four parent pairs to be equal. Let A4 be that all-equal event. Inclusion-exclusion therefore gives the pointwise identity

    Q = C_01 C_23 + C_02 C_13 + C_03 C_12 - 2 A4.             (3)

All 256 parent-column pairs satisfy (3) in each implementation.

## 3. Fourier inversion for a requested four-row output

For a fixed target Y in {0,1}^4,

    1[H=Y] = 2^-4 sum_(S subseteq [4])
                  (-1)^(sum_(i in S) Y_i) chi_S(H).

Odd-cardinality characters vanish under a fresh uniform B2 gate, so equations (1)-(3) yield

    Pr_g[H=Y | A,B]
      = 1/16 * ( 1
                 + sum_(i<j) (-1)^(Y_i+Y_j) C_ij
                 + (-1)^(|Y|) Q ).                            (4)

For a balanced target |Y|=2 the four-row term has positive sign. Equation (4) is exact, but it is an alternating expression and is therefore not automatically suitable for relative approximation.

## 4. A pointwise nonnegative balanced-target identity

Now assume Y has exactly two zero rows and two one rows. Let Z={z1,z2} be its zero-label rows and O={o1,o2} its one-label rows. Define

    C_Z = C_z1,z2,
    C_O = C_o1,o2,

and let F_Y be the favorable-prefix event that no parent-pair block contains both target labels:

    F_Y = product_(i in Z, j in O) (1-C_ij).                  (5)

This is exactly U63's final-gate compatibility event.

If F_Y fails, one truth-table address would be required to output both 0 and 1, so no B2 type fits Y. If F_Y holds, the addresses used by the zero rows and one rows are disjoint. Within each two-row label class there is either one distinct address or two. Thus

    d(A,B) = (2-C_Z) + (2-C_O) = 4-C_Z-C_O.

The number of raw B2 tables producing Y is 2^(4-d), and therefore

    # {g : g(A_i,B_i)=Y_i for all i}
      = F_Y (1+C_Z)(1+C_O).                                  (6)

Equivalently,

    Pr_g[H=Y | A,B]
      = F_Y (1+C_Z)(1+C_O) / 16.                              (7)

This is a completely nonnegative form of the same probability as (4). Its nonzero raw multiplicities are 1,2,4. Exhaustive checks over all six balanced targets and all 256 parent pairs give, for each target, exactly 84 favorable parent pairs with multiplicity histogram

    1 -> 24,
    2 -> 48,
    4 -> 12.

Equation (7) does not solve the prefix problem: one must still relatively count or sample F_Y under the shared prefix distribution. It does show that catastrophic subtraction is avoidable locally at the last gate.

## 5. Exponential cancellation if one instead estimates the Fourier terms separately

Consider the repeated-predecessor chain from U66. Start with the balanced column

    Y = 0011

(up to row-order convention), and for m stages choose a fresh uniform B2 gate whose two predecessors are both the previous signal.

If the current signal is nonconstant, only g(0,0) and g(1,1) matter. They are independent fair bits. Hence the next signal is constant with probability 1/2, or is the current signal / its complement with probability 1/4 each. Once constant, it stays constant. Therefore after m gates

    Pr[nonconstant] = 2^-m,
    Pr[output=Y]    = 2^-(m+1).                               (8)

The two within-label pair characters are identically +1. Each of the four cross-label pair characters has expectation

    1 - 2^(1-m),                                               (9)

because it is +1 on constant outputs and -1 on the surviving nonconstant outputs. The four-row parity character is also identically +1 because all reachable columns have even Hamming weight.

Substituting into the balanced Fourier formula gives

    Pr[Y]
      = 1/16 * (1 + 1 + 1
                - 4(1-2^(1-m))
                + 1)
      = 2^-(m+1).                                              (10)

Thus O(1) positive and negative terms cancel down to an exponentially small residual. To get a constant-factor relative estimate of (10) from separately estimated Fourier moments, the cross moments require additive accuracy on the order of 2^-m. A generic collection of constant-relative-error estimates is insufficient.

This is a method-specific obstruction, not an approximation lower bound. The chain itself has an exact closed form and width-one factorization, so it is easy by U66. The point is only that separate relative approximation of the signed Fourier terms is numerically/analytically unstable for the target probability.

The executable recurrence checks m=1..12 exactly. Target counts are

    4, 32, 256, 2048, ... = 8^m/2,

and the signed Fourier residual equals sixteen times the exact target count in every row.

## 6. Consequence

The equality/Walsh basis gives useful exact structure:

- every two-row character is a joint-parent collision event;
- the four-row character is the union of three pairings;
- balanced target probabilities have an exact pointwise positive form after final-gate integration.

But signed character estimates should not be combined independently to obtain a relative balanced-target estimate: the repeated-predecessor family exhibits exponential cancellation. U69 therefore tests the remaining positive favorable-prefix language itself rather than continuing the signed-moment route.
