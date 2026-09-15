(* Actual successful independent Wolfram call; timeConstraint 40. *)
ClearAll[gate, raw, site, p];
gate[g_, a_, b_] := MapThread[BitAnd[BitShiftRight[g, #1 + 2 #2], 1] &, {a, b}];
raw[top_] := Module[{init = {{0, 0}, {1, 1}, {0, 1}}, outputs},
 outputs = Table[Module[{v = init}, Do[AppendTo[v, gate[gg[[j]], v[[top[[j, 1]]]], v[[top[[j, 2]]]]]], {j, Length[top]}]; Last[v][[1]] + 2 Last[v][[2]]], {gg, Tuples[Range[0, 15], Length[top]]}];
 Table[Count[outputs, i], {i, 0, 3}]];
site[top_, bits_] := Module[{v = {0, 0, 1}}, Do[AppendTo[v, bits[[j]] Max[v[[top[[j, 1]]]], v[[top[[j, 2]]]]]], {j, Length[top]}]; Last[v]];
tops = {{{3, 3}}, {{3, 3}, {4, 4}}, {{3, 3}, {4, 4}, {4, 4}, {5, 6}}, {{1, 2}, {4, 4}, {5, 5}}};
rows = Table[Module[{s = Length[top], h, counts, predicted}, h = Total[site[top, #] & /@ Tuples[{0, 1}, s]]; counts = raw[top]; predicted = 2^(3 s - 1) {2^s - h, h, h, 2^s - h}; {s, counts, h/2^s, counts == predicted}], {top, tops}];
net = {{3, 3}, {3, 3}, {4, 5}, {6, 6}, {4, 5}, {8, 8}, {7, 9}, {10, 10}};
marked = {3, 5, 7, 8};
poly = Expand[Total[Table[If[site[net, b] == 1, With[{h = Total[b[[marked]]]}, p^h (1 - p)^(4 - h)/16], 0], {b, Tuples[{0, 1}, 8]}]]];
points = Table[{2^-j, poly /. p -> 2^-j}, {j, 1, 5}];
recovered = Expand[InterpolatingPolynomial[points, p]];
<|"Version" -> $Version, "TopologyRows_slots_typeCounts_reliability_pass" -> rows, "K22Polynomial" -> poly, "InterpolationPoints" -> points, "InterpolationMatches" -> (recovered == poly), "RecoveredIndependentSets" -> (16 (1 - recovered) /. p -> 1), "SharedDiamondIncorrectIndependentValue" -> 7/32, "AllPass" -> (And @@ rows[[All, 4]] && recovered == poly && (16 (1 - recovered) /. p -> 1) == 7)|>
