# U64-U65 Wolfram record

Date: 2026-09-16. Wolfram Language 15.0.1 for Linux x86 (64-bit), July 2 2026.

Three evaluator submissions were made. The first returned `Symbol::undefined2`, zero compression counts and `AllPass -> False`; it is not evidence. The second fixed the naming issue but had an incorrectly parenthesized `refinesF` definition, returned unevaluated Boolean-list expressions and `AllPass -> False`; it is not evidence. The third, whose exact source is preserved in `code/u64_u65_independent.wl`, completed without warnings/errors and returned:

```
<|"Version" -> "15.0.1 for Linux x86 (64-bit) (July 2, 2026)",
  "CompressionRows_valid_pass" -> {{1, 1}, {7, 7}, {79, 79}, {1307, 1307}},
  "FiveCompression" -> {True, False},
  "FiveDistinctLeafTuples" -> 5,
  "BadTopologyCount" -> 0,
  "GoodTopologyCount" -> 4,
  "DeclaredWitness" -> {{1, 1, 1, 1, 0}, {0, 0, 1, 0, 1}},
  "AllPass" -> True|>
```

The successful call independently checks the finite partition-compression table and five-row type enumeration. It is not a formal proof or independent expert review.

A fourth, separate warning-free call checked the balanced-target support lemma and the same-information count separation. It returned:

```
<|"BalancedRows" -> {
    {3, 21, <|1 -> 6, 2 -> 12, 4 -> 3|>},
    {5, 21, <|1 -> 6, 2 -> 12, 4 -> 3|>},
    {6, 21, <|1 -> 6, 2 -> 12, 4 -> 3|>}},
  "CountSeparation" -> {8, 4},
  "AllPass" -> True|>
```
