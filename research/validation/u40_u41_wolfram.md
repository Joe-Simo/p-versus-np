# U40-U41 independent computation record

Date: 2026-09-15 UTC.
Tool: Wolfram.WolframLanguageEvaluator, timeConstraint=30 seconds.
Wolfram kernel version was not returned; no version is inferred.
Source: code/u40_u41_independent.wl (comments added only to explain the saved invocation).

Actual returned result:

```text
Out[1]= <|"KernelCases" -> 6505, "KernelFailures" -> 0, "FourVariableParityCNF" -> {{1, 9, 1}, {2, 67, 4}, {3, 183, 6}, {4, 256, 8}}|>
```

The graph experiment checks all labeled simple graphs with 0-5 vertices and every budget from 0 to the vertex count. It uses set-based cover enumeration, independently of the TypeScript representation. The parity experiment checks all subsets of four-variable even parity and tests allowed coordinate-projection closure, independently of TypeScript's clause-intersection test.

Agreement is a finite implementation cross-check, not independent expert verification or a formal proof. No claim is made that all reductions or asymptotic branching programs were enumerated.
