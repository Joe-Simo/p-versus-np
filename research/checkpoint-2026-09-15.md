# P versus NP — executable checkpoint, September 15, 2026

## Success status

We have not solved P versus NP yet. No complete candidate exists. No formal proof or independent expert verification has been obtained.

## Authorized scope and inspected state

Workspace: `/mnt/data/02-p-versus-np`. Dedicated private repository: `Joe-Simo/p-versus-np`, branch `main`; privacy and write access were confirmed through the connected GitHub API. The inspected and rechecked starting head was `00655a55757b6ef9160c21687567937df3912eca` (U39). Existing work was preserved; this run only adds files.

The full governing prompt was read from the supplied `P_vs_NP_Astra_Research_Prompt.txt` and copied unchanged into the workspace as `RESEARCH_PROMPT.txt`; SHA-256 `e53dd9e6b9b8e3e6dea67084a3689dce196f60e98bb0af766eab1f093a223127`. The remote repository root did not contain this prompt. The prompt is included in the local research package, not claimed to have been committed remotely. Routine user updates must begin with the exact status heading and contain at most three short sentences; details belong in artifacts. Additional spending is not authorized.

The official Clay P-versus-NP page was checked this run and still lists the problem as unsolved. This project targets standard uniform worst-case P versus NP, not any restricted variant.

## Established this run

**U40.** A uniform three-query-per-edge kernel transducer stores at most k^2 residual edges, using O((k+1)^2 log(v+2)) bits. A nonuniform oblivious branching program can attach the correct finite answer to each terminal kernel state, with at most 3M queries and logarithmic total node count O((k+1)^2 log(v+2)+log(M+2)), M=binom(v,2). Thus for k=v^{o(1)} the general branching-program lower-bound premise sought in U38 is false. This does not compute terminal answers efficiently in the uniform model and does not imply P=NP.

**U41.** If each edge in an exact reduction from q-bit parity to v-vertex k-Vertex-Cover is computed by a source-query decision tree of depth at most b, then q <= b(1+log_2 binom(v,k)). Proof: each fixed cover gives a width-b CNF whose solutions are isolated; use the established Paturi-Pudlak-Zane coding lemma and union bound. A parity restriction gives the same constraint for GIP columns. This is model-specific, not a SAT lower bound or a claimed new coding lemma.

## Corrections and dependency map

- Retire U38's proposed nonuniform branching-program lower-bound target and U39's attempt to reach that target: U40 provides a contradicting upper bound.
- Keep the uniform adjacency-matrix small-k magnification theorem of Oliveira-Santhanam, ECCC TR18-139 Theorem 35. Its missing step is uniformly solving the kernel, not retaining answer-relevant input information.
- U34's purported correction of U29 compared different papers. Actual U29 cites the three-author 2021 Theory of Computing paper, which does state general-circuit magnification to NP notsubseteq Circuit[poly]. Restore that precisely quantified target. Formula magnification in the 2018 paper does not invalidate it.
- Ordinary GIP is linear-query/logspace under unrestricted input access; fixed-partition communication hardness alone is not general branching-program hardness.
- No claim of novelty beyond a self-derived application is made; no claims in old U01-U39 were silently rewritten.

## Reproduction

Environment observed: Node v22.16.0, TypeScript 5.8.3. No Bun, repository package manifest, or linter configuration was available in the inspected project. Strict compiler/no-unused checks and compiled-code syntax checks passed; no package was installed.

Run from the authorized folder:

```sh
tsc --strict --noUncheckedIndexedAccess --noUnusedLocals --noUnusedParameters --target ES2022 --module commonjs --outDir research/validation/build code/u40_u41_audit.ts
node research/validation/build/u40_u41_audit.js
```

The existing `research/validation/u40_u41_results.json` is the actual saved successful output. Do not overwrite it with an unverified or partial run.

TypeScript checked 33,868 labeled graphs on 0-6 vertices, all 235,881 graph/budget pairs, and 65,814 subsets of parity assignments on 1-5 variables. All assertions passed. Wolfram independently checked 6,505 graph/budget pairs and four-variable parity closures; its actual output is in `research/validation/u40_u41_wolfram.md` and its executable source in `code/u40_u41_independent.wl`. Its kernel version was not returned. These are finite code checks, not formal theorem verification.

## Verification limitations and tool state

The mathematical proofs were self-audited; the finite implementations use different algorithms/representations. No separate expert or proof assistant certified the conclusions. Mathbox discovery returned no matching plugin in this run, so no Mathbox execution is claimed. Consensus was not retried after the previously observed quota limit. Public primary sources and the existing Wolfram allowance were used; no purchases, overages, publication, or external researcher contact occurred. No background research task is running.

## Next executable mathematical task

Read U40 Sections 7-9 and the actual 2021 source at https://theoryofcomputing.org/articles/v017a011/v017a011.pdf, pp. 1-2 and the detailed theorem, together with U29-U30. Fix the two circuit levels: an N=2^n-bit truth table has underlying circuit thresholds 2^{beta*n}/(c*n) and 2^{beta*n}, while the meta-decider has the target size N^{1+epsilon}. Preserve the requirement of one fixed epsilon for every sufficiently small positive beta.

Audit a proposed lower-bound invariant under the sampler-plus-local-oracle construction: explicitly charge the size of the kernel/oracle evaluator rather than its number of input queries alone. Reject any argument that remains valid after allowing arbitrary uncharged terminal labels, because U40 exhibits precisely why that change can erase the uniform difficulty. No such qualifying general-circuit lower bound has yet been proved.

Preservation before this checkpoint: proof commits `22529ad4dbdc1903131bd6224b2553610283c68e` (U40), `59b6dd2531ea4fbf12b8d7e9cd02b9b634f3ad44` (U41); supporting code/results were added through `0b9e3b7bab3c0cf8d89d3d49ccb7189ddac68cbb`. The final checkpoint commit should be read from the remote, not guessed from this text.
