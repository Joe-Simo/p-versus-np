# U25 — Bounded occurrence does not imply low GF(2) incidence rank

Date: 2026-09-14
Status: proved explicit structural obstruction with exact finite audit; no P versus NP resolution.

## 1. Target

After U22–U24, test whether sparse/bounded-occurrence CNFs might nevertheless admit a low-rank linear-algebraic representation. The simplest candidate invariant is the GF(2) rank of the clause-variable incidence matrix.

## 2. Explicit cyclic family

For n>=5, use variables x_0,...,x_{n-1} and n clauses whose variable supports are

    C_i uses {x_i, x_{i+1}, x_{i+2}}

with indices modulo n. Literal signs may be chosen arbitrarily; incidence rank depends only on supports.

Every clause has width 3. Every variable appears in exactly 3 clauses. Thus the family has constant width, constant occurrence, and linear size.

Its n x n incidence matrix A_n over GF(2) is circulant with first row having ones in positions 0,1,2.

## 3. Theorem U25.1 — rank is n except when 3 divides n, when it is n-2

Over GF(2), identify vectors with polynomials modulo z^n-1. The circulant linear map A_n is multiplication by

    f(z)=1+z+z^2.

The nullity equals deg gcd(f(z), z^n-1) over GF(2). Since

    z^3-1 = (z-1)(z^2+z+1)

and over GF(2), f(z)=z^2+z+1 is the nontrivial factor of z^3-1, f divides z^n-1 iff 3 divides n. Therefore:

- if 3 does not divide n, gcd(f,z^n-1)=1, nullity 0, rank n;
- if 3 divides n, gcd=f has degree 2, nullity 2, rank n-2.

Hence rank(A_n)=n-O(1) for every n, and exactly n for two thirds of lengths.

## 4. Exact finite audit

An independent Wolfram GF(2) Gaussian-elimination computation checked n=5,...,30. It returned rank n whenever n mod 3 != 0 and n-2 whenever n mod 3=0, exactly matching the theorem.

## 5. Consequence

The proposed structural inference

    bounded clause width + bounded variable occurrence => low GF(2) incidence rank

is false. Sparse formulas can have essentially full incidence rank.

Therefore a SAT algorithm whose polynomial runtime requires the ordinary incidence matrix to have rank O(log n), or even o(n), cannot obtain that bound merely from sparsification/bounded occurrence.

## 6. Important limitation

High incidence rank is not a SAT hardness proof. This cyclic family can have easy semantics depending on literal signs, and Gaussian rank of the unsigned support matrix is only one possible algebraic invariant. A successful algorithm might exploit signed clause polynomials, low rank after nonlinear lifting, matroid structure, or another representation.

## 7. Next question

Strengthen the algebraic test from unsigned incidence rank to the linear span of exact clause indicator polynomials in a multilinear/Fourier basis. Determine whether bounded-occurrence 3-CNFs can have linear or exponential-dimensional interaction spaces after low-degree lifting, and whether any rank compression actually preserves satisfiability rather than merely support information.

No statement here resolves P versus NP.