(* Actual corrected successful Wolfram invocation, timeConstraint 40. *)
ClearAll[gt, counts, col, reaches, w];
gt[g_, a_, b_, q_] := Sum[BitGet[g, BitGet[a, i] + 2 BitGet[b, i]] 2^i, {i, 0, q - 1}];
counts[ini_, top_, q_, gates_] := Module[{states = {ini -> 1}, all}, Do[all = Flatten[Table[With[{v = First[state], mass = Last[state]}, Table[Append[v, gt[g, v[[edge[[1]] + 1]], v[[edge[[2]] + 1]], q]] -> mass, {g, gates}]], {state, states}], 1]; states = Normal[Merge[all, Total]], {edge, top}]; Table[Total[Last /@ Select[states, Last[First[#]] == y &]], {y, 0, 2^q - 1}]];
col[x_] := BitXor[BitShiftRight[x, 1], If[BitGet[x, 0] == 1, 3, 0]];
reaches[ini_, top_, mask_] := Module[{sets = (If[col[#] == 0, {}, {col[#]}] & /@ ini)}, Do[AppendTo[sets, If[BitGet[mask, j - 1] == 1, Union[sets[[top[[j, 1]] + 1]], sets[[top[[j, 2]] + 1]]], {}]], {j, Length[top]}]; Last[sets]];
w[set_, c_] := If[set == {c}, 2, If[Length[set] >= 2, 1, 0]];
fixtures = {{{0, 7, 2}, {{2, 2}, {3, 3}, {3, 3}, {4, 5}}}, {{0, 7, 2, 4}, {{2, 3}, {4, 2}, {4, 3}, {5, 6}}}};
rows = Table[Module[{ini = f[[1]], top = f[[2]], full, affine, sums, predicted}, full = counts[ini, top, 3, Range[0, 15]]; affine = counts[ini, top, 3, Select[Range[0, 15], EvenQ[DigitCount[#, 2, 1]] &]]; sums = Table[Sum[w[reaches[ini, top, z], c], {z, 0, 2^Length[top] - 1}], {c, 1, 3}]; predicted = 2^(3 Length[top] - 2) sums; {full, affine, sums, full == 2^Length[top] affine, Table[full[[2 c + 1]] == predicted[[c]], {c, 1, 3}]}], {f, fixtures}];
local = Module[{q, aa, bb}, And @@ Flatten[Table[Module[{a = BitGet[aa, Range[0, q - 1]], b = BitGet[bb, Range[0, q - 1]], mat}, mat = DeleteDuplicates[Transpose[{ConstantArray[1, q], a, b}]]; MatrixRank[mat, Modulus -> 2] == Length[mat]], {q, 1, 3}, {aa, 0, 2^q - 1}, {bb, 0, 2^q - 1}]]];
full4 = counts[{10, 12}, {{0, 1}}, 4, Range[0, 15]];
aff4 = counts[{10, 12}, {{0, 1}}, 4, Select[Range[0, 15], EvenQ[DigitCount[#, 2, 1]] &]];
<|"Version" -> $Version, "Rows_full_affine_weightSums_affinePass_positivePass" -> rows, "ThreeRowLocalRankPass" -> local, "FourRowANDCounts" -> {full4[[9]], aff4[[9]]}, "PositiveWeightTable" -> Table[{set, Table[w[set, c], {c, 1, 3}]}, {set, Subsets[{1, 2, 3}]}]|>
