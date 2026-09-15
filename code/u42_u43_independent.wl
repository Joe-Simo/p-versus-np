(* Independently executed Wolfram tool cell 1: high-level routing and GF(2) nullspaces.
   The TypeScript Boolean circuits are not evaluated by this cell. *)
ClearAll[batchRead, dualAudit];
batchRead[f_List, a_List] := Module[{rows, carry = 0},
 rows = SortBy[Join[Table[{i - 1, 0, 0, f[[i]]}, {i, Length[f]}], Table[{a[[j]], 1, j, 0}, {j, Length[a]}]], #[[{1, 2}]] &];
 rows = Map[Function[row, If[row[[2]] == 0, carry = row[[4]]]; ReplacePart[row, 4 -> carry]], rows];
 rows = SortBy[Select[rows, #[[2]] == 1 &], #[[3]] &];
 If[rows == {}, {}, rows[[All, 4]]]
];
gatherRows = Table[Module[{n = pair[[1]], t = pair[[2]], count = 0, failed = 0, nn}, nn = 2^n;
 Do[count++; If[batchRead[f, a] =!= f[[a + 1]], failed++], {f, Tuples[{0, 1}, nn]}, {a, Tuples[Range[0, nn - 1], t]}];
 {n, t, count, failed}], {pair, {{0, 3}, {1, 3}, {2, 3}, {3, 1}}}];
dualAudit[n_, d_] := Module[{points, supports, matrix, basis, words, weights},
 points = Tuples[{0, 1}, n]; supports = Subsets[Range[n], {0, d}];
 matrix = Table[Times @@ point[[support]], {support, supports}, {point, points}];
 basis = NullSpace[matrix, Modulus -> 2];
 words = Mod[Tuples[{0, 1}, Length[basis]].basis, 2];
 weights = DeleteCases[Total /@ words, 0];
 {n, d, Length[basis], Length[weights], Min[weights], 2^(d + 1)}
];
dualRows = Flatten[Table[Table[dualAudit[n, d], {d, 0, n - 1}], {n, 1, 4}], 1];
<|"Version" -> $Version, "BatchReadRows_n_t_cases_failures" -> gatherRows, "DualRows_n_d_dimension_nonzero_minimum_expected" -> dualRows, "AllPass" -> (And @@ (Last[#] == 0 & /@ gatherRows) && And @@ (#[[5]] == #[[6]] & /@ dualRows))|>
