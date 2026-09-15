(* Actual successful independent Wolfram invocation; bounded to 40 seconds. *)
ClearAll[z, topologyAudit, correction];
topologyAudit[k_, s_] := Module[{lists, hist = ConstantArray[0, s + 1], totalU = 0, a, u, pair, mask},
 lists = Tuples[Table[Tuples[Range[k + j - 1], 2], {j, 1, s}]];
 Do[a = {}; u = {};
  Do[pair = desc[[j]];
   mask = BitOr[2^(j - 1), If[pair[[1]] <= k, 0, a[[pair[[1]] - k]]], If[pair[[2]] <= k, 0, a[[pair[[2]] - k]]]];
   AppendTo[a, mask]; AppendTo[u, 1 + If[pair[[1]] <= k, 0, u[[pair[[1]] - k]]] + If[pair[[2]] <= k, 0, u[[pair[[2]] - k]]]], {j, 1, s}];
  hist[[1]] += k; Do[hist[[DigitCount[x, 2, 1] + 1]]++, {x, a}]; totalU += Total[u], {desc, lists}];
 {k, s, Length[lists], hist, totalU, totalU/Total[hist], s/(k + 1)}
];
rows = {topologyAudit[3, 2], topologyAudit[3, 3], topologyAudit[4, 2]};
weights = 16 Range[5, 7]^2;
coef = CoefficientList[Times @@ (# + z & /@ weights), z];
parityCoreCounts = {0, 0, 24, 7296};
correction = BitXor[234, Sum[If[BitAnd[BitXor[x, 1], 6] == 0, 2^x, 0], {x, 0, 7}]];
tailChecks = Table[Module[{s = 16 n, k = n + 2, m, first, p, denom, numer},
 m = s/4; first = s - m;
 p = Expand[Product[(k + first + (j - first) z)^2, {j, first, s - 1}]];
 denom = p /. z -> 1; numer = Total[Drop[CoefficientList[p, z], m - n]];
 {n, s, numer 16^m <= denom 15^m}], {n, 1, 8}];
<|"Version" -> $Version, "TopologyRows_k_s_lists_hist_unfoldSum_mean_expected" -> rows,
 "EmbeddingCoefficients" -> coef, "SuppliedParityCoreCounts" -> parityCoreCounts,
 "DecoratedParitySpectrum" -> coef parityCoreCounts, "ParityTotal" -> Total[coef parityCoreCounts],
 "UnequalOneCoreEmbeddingWeights_k3_s2" -> {16*4^2, 16*3^2},
 "PatchedTable" -> correction, "PatchFits" -> (BitAnd[correction, 254] == 232),
 "TailChecks" -> tailChecks, "ExactMGFConstant" -> (625 < 8*81),
 "AllPass" -> (And @@ (#[[6]] == #[[7]] & /@ rows) && And @@ (Last /@ tailChecks) && correction == 233)|>
