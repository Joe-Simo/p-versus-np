(* Actual independent Wolfram invocation, timeConstraint=40. *)
ClearAll[gate2, suffix, fpoly];
gate2[g_, a_, b_] := Sum[BitGet[g, BitGet[a, i] + 2 BitGet[b, i]] 2^i, {i, 0, 1}];
suffix[cols_List, 0] := Count[cols, 0];
suffix[cols_List, r_Integer?Positive] := suffix[cols, r] = Total[Flatten[Table[suffix[Sort[Append[cols, gate2[g, cols[[i]], cols[[j]]]]], r - 1], {i, Length[cols]}, {j, Length[cols]}, {g, 0, 15}]]];
hists = Table[{2 + j, 0, 4 - j, 1}, {j, 0, 3}];
counts = suffix[Flatten[MapIndexed[ConstantArray[First[#2] - 1, #1] &, #]], 2] & /@ hists;
we = {1, 0, 3, 0}/4; wo = {0, 3, 0, 1}/4;
first = {we.hists, wo.hists}; second = {(we.(Flatten[Outer[Times, #, #]] & /@ hists)), (wo.(Flatten[Outer[Times, #, #]] & /@ hists))};
fpoly[k_, 0] := x;
fpoly[k_, r_Integer?Positive] := fpoly[k, r] = Module[{f = fpoly[k + 1, r - 1]}, Expand[f + (1 + x^2/k^2)/2 ((f /. x -> x + 1) - f)]];
polyRows = Table[{r, Exponent[fpoly[12, r], x], Coefficient[fpoly[12, r], x, r + 1], r!/(2^r Pochhammer[12, r]^2)}, {r, 0, 6}];
rateChecks = Flatten[Table[Module[{cols = Join[ConstantArray[0, c], ConstantArray[2, k - c]], actual}, actual = Counts[Flatten[Table[gate2[g, a, b], {a, cols}, {b, cols}, {g, 0, 15}]]]; And @@ Table[Lookup[actual, y, 0] == 4 (k^2 + If[MemberQ[{0, 3}, y], 1, -1] c^2), {y, 0, 3}]], {k, 1, 8}, {c, 0, k}]];
<|"Version" -> $Version, "Histograms" -> hists, "ExactTwoGateCounts" -> counts, "EqualFirstMoments" -> (first[[1]] == first[[2]]), "FirstMoments" -> first[[1]], "EqualPairMoments" -> (second[[1]] == second[[2]]), "MixtureCompletionCounts" -> {we.counts, wo.counts}, "Difference" -> (we - wo).counts, "DegreeLeadingRows_r_degree_actual_expected" -> polyRows, "RateCases" -> Length[rateChecks], "AllPass" -> (And @@ rateChecks && And @@ (#[[3]] == #[[4]] & /@ polyRows) && (we - wo).counts == -96)|>
