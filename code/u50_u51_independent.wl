(* Exact tool invocation preserved verbatim; finite evidence only. *)
ClearAll[histories, descendants, audit];
histories[n_Integer] := Module[{grow},
 grow[active_List, gs_List, sign_Integer] := If[Length[active] == 1, {Append[gs, First[active]]},
   Flatten[Table[If[i == j, {}, Flatten[Table[
     grow[Append[Delete[active, List /@ Reverse[Sort[{i, j}]]], n + 2 + Length[gs]], Append[gs, {If[c == 0, 6, 9], active[[i]], active[[j]]}], Mod[sign + c, 2]],
     {c, If[Length[active] == 2, {sign}, {0, 1}]}], 1]],
   {i, Length[active]}, {j, Length[active]}], 2]];
 grow[Range[2, n + 1], {}, 0]
];
audit[n_Integer] := Module[{ds = histories[n], edges, comps, counts},
 edges = Reap[Do[If[Count[MapThread[SameQ, {ds[[i]], ds[[j]]}], False] <= 1, Sow[UndirectedEdge[i,j]]], {i, Length[ds]}, {j, i - 1}]][[2]];
 edges = If[edges == {}, {}, First[edges]];
 comps = ConnectedComponents[Graph[Range[Length[ds]], edges]];
 counts = Sort[Tally[Length /@ comps]];
 {n, Length[ds], Length[DeleteDuplicates[ds]], Length[comps], counts, 2^(n-2) Factorial[n] Factorial[n-1], Factorial[n] Factorial[n-1]/2}
];
rows = Table[audit[n], {n, 2, 4}];
rChecks = And @@ Table[2 Floor[(s+3)/2]-3 <= s, {s, 1, 1000}];
geoChecks = And @@ Flatten[Table[1-(1-p)^b <= b p, {p, {1/67200, 1/7225344, 43/1254400, 1/16, 15/16}}, {b, 0, 20}]];
<|"Version" -> $Version, "ParityRows_n_descriptions_unique_components_histogram_expectedDescriptions_expectedComponents" -> rows, "InterpolationRoundingChecks" -> rChecks, "GeometricChecks" -> geoChecks, "BinaryExponentialCertificate" -> (16^11 > 2*15^11)|>
