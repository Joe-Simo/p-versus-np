# P versus NP — checkpoint after U42-U43

Date: 2026-09-15. Success status: **We have not solved P versus NP yet.** No complete candidate or independently certified theorem has been obtained.

## Scope, starting state, and preservation

Assigned workspace `/mnt/data/02-p-versus-np`; private repository `Joe-Simo/p-versus-np`, branch main. Starting head, read from the connected API: `7ed39dcb2312e9f4cd0f17865e93340f11b20a14`. The repository's privacy and push permission were rechecked before saving. The previous package was inspected and only missing members extracted; old proofs, code, results, and checkpoints were not overwritten.

The complete governing prompt was read; SHA-256 `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. The exact success heading and maximum of three short routine-update sentences remain binding. No spending beyond existing allowances, publication, external expert contact, or background automation was initiated. Mathbox and Consensus were not claimed as used; the earlier unavailability/quota notes remain in effect. Wolfram and public primary sources were used.

## This run's results

**U42.** Correctly source and quantify OPS2021 Theorem 1.4. Independently construct an ordinary fan-in-two batch lookup circuit with O((N+t) log^3(N+t+2)) gates, instead of assuming Nt independent addressing is necessary. The recipe is two sorting networks with payload propagation. This is an upper bound/application of standard sorting, not a novel circuit lower bound or improvement to the separation theorem. Generator and succinct-consistency costs remain charged and unresolved for the full target.

**U43.** For every 0<=d<n and explicit N=2^n-bit truth table outside degree-d GF(2) polynomials, construct an exact 2^(d+1)-point anti-checker in O(n*N+n^2) ordinary gates. A self-contained interpolation proof establishes optimal point count. Mobius coefficients select directions; conditional derivatives and a second priority encoder locate the violating face. These are established Reed-Muller mechanisms with an explicitly implemented cost-aware extraction, not claimed new coding theory.

**Extension rejected.** AND_n has degree n and n-1 gates. More generally the degree-unrestricted squarefree monomials form a truth-table basis and each has at most n-1 AND gates: hence no nonzero universal GF(2) linear identity holds for general circuits already at that size. The restricted certificate cannot be interpreted as a small-general-circuit lower bound. This does not refute nonlinear anti-checkers.

## Executed evidence

TypeScript/Node constructed the actual gates and used exact exhaustive bit-slicing. Routing: 167,276 table/address assignments. Degree witnesses: 262,948 function/degree pairs, two circuits each, 455,880 valid certificate outputs; all checks pass. Every Boolean function for n=1..4 and every d<n was tested. Larger n=6,8,10,12 instances are topology/count checks only. Universal-linear-identity audit: 65,808 nonzero coefficient vectors, none annihilates all monomials.

Wolfram 15.0.1 independently checked 3,106 routing assignments, dual minimum supports via Gaussian nullspaces, 804 coefficient/face cases (646 nonmembers), and full monomial ranks through n=5. The first extra face-check submission had a syntax error; the corrected code passed and the failure is recorded. No formal proof assistant or separate expert audit was performed.

Node v22.16.0; TypeScript 5.8.3. Existing environment has no Bun or configured linter. No package was installed. Reproduce from the project root:

```sh
tsc --strict --noUncheckedIndexedAccess --noUnusedLocals --noUnusedParameters --target ES2022 --module commonjs --outDir research/validation/build-u42-u43 code/u42_u43_audit.ts
node --check research/validation/build-u42-u43/u42_u43_audit.js
node research/validation/build-u42-u43/u42_u43_audit.js
```

Actual output is in `research/validation/u42_u43_results.json`; protocol and commands are in the adjacent logs. Independent Wolfram source is in `code/u42_u43_independent.wl` and `code/u43_gaussian_face_check.wl`. A manifest pins the final local artifacts.

## Source audit

The 2021 primary PDF was checked at Theorem 1.4, Definition 2.4, Lemma 4.1 and its proof application; theorem pages were rendered. The Clay page still lists P versus NP as unsolved. Local PDF downloads failed because the container could not resolve the source hosts; no downloaded source copies are claimed. Batcher's original publisher PDF could not be retrieved; only publisher metadata and the standard self-contained construction were used. U43 distinguishes its exact full-table result from the randomized Reed-Muller testing literature.

## Active frontier and next executable test

Keep U40's nonuniform branching-program upper bound and U41's locality bound. Do not reopen U38-U39's false general-BP target. Keep the 2021 general-circuit magnification route, with one fixed epsilon required for every sufficiently small positive beta, and distinguish underlying n-input circuits from the N-input meta-decider.

The next candidate must handle **nonlinear consistency among general circuit descriptions**, not merely their linear span. A bounded next experiment is exact general-circuit synthesis at n<=3: enumerate functions by a specified small gate budget, compute minimal inconsistent labeled subsets and compare them with the linear-span closure, preserving duplicate-function versus circuit-description counts. This can expose whether a proposed nonlinear certificate collapses to a disguised circuit enumeration; it cannot establish asymptotic hardness by extrapolating finite data. Keep both generator and verifier costs explicit.

Remote completion commit is intentionally not guessed here. Read it from the connected API or accompanying preservation receipt; only successfully confirmed writes count as remote preservation.
