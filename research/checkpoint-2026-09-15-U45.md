# P versus NP — checkpoint after U44-U45

Date: 2026-09-15. **We have not solved P versus NP yet.** No complete candidate, formal proof or independent expert certification exists.

## Scope and actual starting state

Work remains in `/mnt/data/02-p-versus-np`, dedicated private repository `Joe-Simo/p-versus-np`, branch `main`. Starting remote head was `70125525001e68d5c5ff3a5e484f95797073612b`; its U43 checkpoint was fetched through GitHub. Repository privacy and push permission were rechecked. The two supplied archive packages were inspected, only missing files extracted, and prior files preserved. Their U42-U43 manifest hashes were checked. The complete governing prompt was read (SHA-256 `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`). Routine updates still require the exact heading and at most three short sentences.

The official Clay P-versus-NP page was queried during this run and still identifies this problem as unsolved. No claim about a different project changes this state. No spending, publication, researcher contact, or scheduled/background task was initiated. The earlier Mathbox availability and Consensus quota limitations were not retried unnecessarily; no execution by those tools is claimed. Wolfram used the existing authorized allowance.

## Established this run

**U44, finite synthesis.** Exact B2 size distributions on n=3 are 5,33,114,80,24 functions with minimum gate counts 0,1,2,3,4. All 16 binary gate types are allowed; constants and uncomplemented inputs are free. Available-signal-state merging is proved complete for minimum circuit size. Raw ordered descriptions were independently enumerated only through two gates. All layers of the semantic search completed.

**U44, nonlinear consistency.** A twelve-term cubic in the eight truth-table bits has zero set exactly the 152 three-variable functions computable in at most two gates. No quadratic universal vanishing equation exists for this finite class. Every outside table has a neighboring outside table; majority needs seven sample points to exclude all two-gate circuits. A separate cofactor characterization and Wolfram checks verify these finite facts.

**U44, positive uniform theorem.** For arbitrary arity, a full truth table can either be synthesized with <=2 gates or refuted against that class on at most seven labeled input points. Seven is optimal in the worst case for n>=3. Use four essential variables and the sensitivity-one lemma, or reduce to a three-variable core. The final procedure uses explicit cofactors and cubic evaluations, not a synthesized lookup table. Cost: O(n*2^n) probes and conservative O(n^2*2^n) bit operations. It is a fixed-budget, full-truth-table result, not a SAT or growing-budget algorithm. The proof includes a completely enumerated finite lemma rather than a formal kernel proof.

**U45.** Every support-t truth table on n>=2 variables has a B2 circuit with at most n*t-1 gates. Boolean Hamming-ball interpolation therefore shows that a nonzero multilinear equation vanishing on all size-s circuits must have degree >floor((s+1)/n), unless the whole cube is already included. At the active budget this is Omega(N^beta/log^2 N). High degree need not imply large general circuits.

**U45, different measure.** Arbitrary labels on t distinct input points interpolate with <=2*t-3 B2 gates (t>=2). Thus anti-checker point count is Omega(s), independently of the polynomial-degree bound. Do not confuse degree, point count and evaluator gate size.

## Executed evidence and limits

Final TypeScript source: `code/u44_u45_audit.ts`. Exact synthesis covers all 276 Boolean functions on n=1,2,3. Final uniform algorithm exhausts all 65,536 four-variable tables: 526 circuit outputs and 65,010 certificates; all certificates exclude every member of the independently enumerated 526-function two-gate class (34,195,260 comparisons). Output certificate size histogram: 5 ->37,310; 6 ->25,836; 7 ->1,864. These are not claimed individually minimal at n=4. One six-variable multiplexer is a targeted test only.

All 6,651 consistent partial tables on n=1..3 passed the interpolation construction, as did all sparse minterm circuit checks for n=2,3 and all tested Hamming-ball ranks. The code emits complete synthesis witnesses, exact minimum point certificates and separating polynomial terms for the n<=3 analyses.

Independent Wolfram 15.0.1 checks: cofactor class count 152, exact class bitmask agreement, zero cubic mismatches over 256 tables, point-minimum histogram {6:80,7:24}, finite feature and Hamming-ball ranks, absence of isolated cubic nonmembers, and all 247 majority subsets of size <=6. One redundant malformed pure-function expression emitted warnings; the clean corrected cell was rerun and is the counted evidence. See the separate source files and result record. No expert or proof assistant certified the results.

Node v22.16.0 and TypeScript 5.8.3. No Bun or configured linter/Lean executable was found in this environment; no package installed. Commands from the project root:

```sh
tsc --strict --noUncheckedIndexedAccess --noUnusedLocals --noUnusedParameters --target ES2022 --module commonjs --outDir research/validation/build-u44-u45 code/u44_u45_audit.ts
node --check research/validation/build-u44-u45/u44_u45_audit.js
node research/validation/build-u44-u45/u44_u45_audit.js
```

The final output was reproduced byte for byte. U40-U43 assertions were rerun in a separate build directory, with U42-U43 output matching the prior preserved file. Successful log files are actual captured commands/output, not proposed tests.

## Sources and novelty

OPS2021 primary PDF: https://theoryofcomputing.org/articles/v017a011/v017a011.pdf ; checked basis discussion p.4 and Theorem 1.4 p.6 in text and screenshots. The fixed-epsilon/for-every-small-beta contract remains binding; no magnification premise was proved. The Clay source was https://www.claymath.org/millennium/p-vs-np/ .

Searches included exact three-variable circuit counts, binary-gate cofactor identities, anti-checker consistency, and vanishing polynomials on Hamming balls. They did not establish novelty of the particular finite cubic or seven-point statement, so no novelty claim is made. Krinkin arXiv:2603.09379 appeared as nearby perturbation work; only its abstract was read and no theorem from it is a dependency. All new mathematical arguments distinguish self-derived facts, finite code verification and external motivation.

## Preserved evidence

The conversation package contains complete final raw output, all finite witnesses and separator coefficients, proofs, code, independent calculations, test logs, hashes, and this checkpoint. The remote additions contain proofs, executable code, independent checks, compact complete count/rank summaries and checkpoint. Large raw JSON/witness tables are in the package; the source reproduces them exactly. Do not describe the large tables as remotely committed unless a later receipt confirms that addition.

The completion commit belongs in the generated preservation receipt after confirmation, not guessed here. Earlier in-run eight-point and lookup-based outputs remain in the local workspace; the final archived output is the no-lookup seven-point version.

## Next executable mathematical task

The fixed two-gate case succeeded, but U45 rules out fixed-degree universal equations at growing budgets. Test whether the cubic's cofactor description extends compositionally through a third gate while preserving fan-out. Use the saved exact three-gate class (232 tables) as the oracle, explicitly allow an earlier gate to feed both a later gate and the output, and reject any recurrence that silently counts only formulas. Compare the constructed elimination relation with that entire finite class before suggesting a general closure theorem. The open full-target obligation is still an ordinary general-circuit lower bound in the OPS2021 parameter regime, not certificate size or algebraic degree alone.
