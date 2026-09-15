# P versus NP — checkpoint after U46-U47

Date: 2026-09-15. **We have not solved P versus NP yet.** No complete candidate, formal proof-assistant certificate, or independent expert verification exists.

## Inspected scope and preservation

Assigned directory `/mnt/data/02-p-versus-np`; dedicated private repository `Joe-Simo/p-versus-np`, main. Starting remote head was `a92ee6d62c1b5447bcf9fc16709322be73f8fe98`, confirmed again before writes. The actual U45 checkpoint was read through GitHub. Privacy and push permission were rechecked. All three supplied archives were listed and only missing members restored. Final byte comparisons confirm every earlier archive member remains unchanged. No sibling project was scanned or changed.

The full governing RESEARCH_PROMPT.txt was read; its SHA-256 remains `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. Routine user updates require the exact success heading and at most three short sentences. The official Clay P-versus-NP page was checked and still labels the problem unsolved. There was no spending, publication, outside researcher contact, visibility change, or scheduled/background execution. Mathbox/Consensus were not used or claimed; prior discovery/quota notes were not retried without a need. Existing Wolfram allowance was used.

## Proven and checked results

**U46 topology.** Every single-output circuit of at most three B2 gates can be expressed as a formula of at most that size. The only genuinely reconvergent three-node shape has F=C(h,B(h,w)), and the two outer gates collapse into one binary operation of h,w. This is specific to the all-binary-functions basis and proves nothing about larger budgets.

**U46 sharp fixed-budget theorem.** Given an explicit N=2^n-bit table, either synthesize at most three gates or refute every such circuit with at most nine labeled samples. Nine is worst-case necessary for every n>=4. Proof: five essential input directions give a nine-point sensitive-edge certificate; otherwise reduce to a four-variable core. The finite core lemma is completely enumerated and independently checked, not formal-kernel certified. Complexity O(n^2*N)+K3, with a fixed finite core search K3 explicitly charged; not a growing-budget or succinct-input algorithm.

On four inputs the class contains 3,000 tables. The exact minimum certificate histogram outside it is 7 points ->61,848; 8 ->672; 9 ->16. The nine-point extremal tables are the complementary-pair indicators and their complements. The all-equal predicate on four inputs is a concrete sharpness witness.

**U47 exact nonlinear relation.** Enumerate signal pairs jointly realizable in s-1 gates; the target fits an s-th gate iff it is constant on their common input fibers. A factored GF(2) equation expresses this exactly. Explicit profile enumeration still costs up to 2^(O(s log(n+s))) candidates; this is not an efficient solution at the OPS magnification budgets.

**U47 joint cost and greedy failure.** Two functions (a AND b) OR c and (a AND b) OR d each cost two gates, but jointly cost three, so separate costs do not describe their shared implementation. This is not a single-output formula/circuit separation. Separately, for target 14366 the mask 15838 is an inclusion-minimal eleven-point anti-checker, while mask 3599 has seven points and is minimum. A fully specified greedy deletion sequence returns the eleven-point local minimum. Magnification does not demand exact minimum cardinality, so this only rejects an unjustified optimality claim about that deletion heuristic.

## Exact coverage and independent implementation

TypeScript final source: `code/u46_u47_audit.ts`.
- All 180,633,600 raw ordered three-gate descriptions at n=3 and 462,422,016 at n=4 were enumerated, including constants, repeated predecessors and internal sharing; output functions match formula and joint-profile constructors.
- All 43,046,721 consistent/absent/inconsistent four-variable partial labelings and 6,561 three-variable partial labelings were covered. Prime inconsistent patterns on n=4: 97,216. Expanding their completions yields exact minima, checked against every class member.
- The generic procedure was tested on 35 explicitly named examples over 1,2,3,4,5,6,8 inputs, not on every larger-arity function. Its output circuits are replayed completely and certificates checked by separate label-pattern synthesis.

Python/NumPy: `code/u46_u47_independent.py`. It derives class membership using cofactors/read-once row-column partitions, then uses 222 input/output symmetry orbits and agreement-mask subset closure to independently derive minima for all 65,536 four-variable functions. Every class bit and minimum entry matches TypeScript. It also checks the greedy counterexample. This is independent implementation, not independent expert review.

Wolfram 15.0.1 separately reconstructs class counts 70,526,3000; verifies the sharp all-equal target, all sample masks of size <=8, and its 64 minimum nine-point masks; and verifies each deletion witness of the eleven-point counterexample and the seven-point alternative. One first submission of the greedy cell had an extra bracket and returned a syntax failure; it was fixed and the clean call is the evidence. Actual code and returned expressions are preserved.

## Environment and reproduction

Node v22.16.0; TypeScript 5.8.3; Python 3.13.5; NumPy 2.3.5. No dependency installed. No Bun/project package manifest/configured linter/Lean executable was present in the inspected scope. Strict TypeScript with no-unused checks is the applicable lint/type equivalent. Successful commands and byte-identical reproductions are in `research/validation/u46_u47_final_checks.log`.

```sh
tsc --strict --noUncheckedIndexedAccess --noUnusedLocals --noUnusedParameters --target ES2022 --module commonjs --outDir research/validation/build-u46-u47 code/u46_u47_audit.ts
node --check research/validation/build-u46-u47/u46_u47_audit.js
node research/validation/build-u46-u47/u46_u47_audit.js
python code/u46_u47_independent.py
```

The Python script expects the already executed TypeScript output at `research/validation/u46_u47_results.json`; it does not use that file to construct its own class/minima, only to compare after computation. The package includes full raw output. Remote preservation should distinguish full sources/proofs/summaries from large raw outputs unless the receipt confirms their upload.

## Failed or limited exploratory steps

Before the finite certificate follow-up, all 84,934,656 descriptions of one four-gate fork/diamond topology on four inputs were checked against the complete four-gate formula class, with no difference. Two seeded samples of 2,000,000 five- and six-gate circuits each also found none. The samples do not prove equality, and the diamond enumeration does not cover all four-gate topologies. These were not used to assert an unbounded or higher-budget formula/circuit theorem.

Exploratory strict compilation flagged unused declarations during revisions; these were fixed. Final compilation and runtime checks pass. The earlier discovery snapshots/logs remain local; no truncated/failed output is counted as a successful theorem check. The final raw output and independent result were reproduced byte for byte, and the newly enumerated three-variable class matches U44's saved class.

## Source and novelty audit

Current official source: https://www.claymath.org/millennium/p-vs-np/ . External target retained from U42: OPS2021 Theorem 1.4, https://theoryofcomputing.org/articles/v017a011/v017a011.pdf . No claim that this run re-read the entire OPS paper. No theorem from it is needed for the fixed-budget proof.

Searches addressed three-gate Boolean formulas/circuits, exact four-input counts, functional decomposition/column multiplicity, anti-checker minimum certificates, and nine-point certificates. They did not authenticate novelty, and no novelty claim is made. Ashenhurst-Curtis background appears in the original-research article *Logic synthesis for PAL-based CPLD-s based on two-stage decomposition* (2007), DOI/source landing page https://www.sciencedirect.com/science/article/abs/pii/S0164121206002779 ; only its theorem-summary snippet was read, not a full proof. Our needed fiber criterion is proved directly. The surfaced preprint arXiv:2603.08033 concerns AIG, not B2; it was not used as a theorem.

## Next executable research step

Do not merely advance the fixed gate budget again. Return to the exact growing-budget size gap: N=2^n, s_low=floor(2^(beta*n)/(c*n)), s_high=floor(2^(beta*n)), one fixed epsilon and every sufficiently small beta in the OPS contract. Test whether a formula-oblivious random sample of the source's list size can even hit an input on which a sparse hard truth table differs from the zero circuit. Count sparse functions versus all s_high-size circuits, quantify their density and the sample miss probability, and distinguish an existence/counting argument from efficient construction of a hard table. Then inspect the source's genuinely input-dependent anti-checker step with its evaluator fully charged.

This tests the mechanism relevant to magnification rather than minimum-cardinality constants. All old nonuniform/free-terminal-label and low-degree false bridges remain retired. No full general-circuit lower bound, SAT algorithm, or complete candidate exists. Nothing is running after this checkpoint; future continuation requires another actual execution.

A confirmed completion commit is placed in the preservation receipt after writes, not guessed here.
