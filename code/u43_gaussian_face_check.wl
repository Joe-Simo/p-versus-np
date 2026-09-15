(* Independently executed Wolfram tool cell 2, corrected successful version.
   Gaussian elimination recovers coefficients; faces are checked by enumeration. *)
ClearAll[checkFastWitness];
checkFastWitness[n_, d_] := Module[{points, supports, eval, cases = 0, nonmembers = 0, failures = 0},
 points = Tuples[{0, 1}, n]; supports = Subsets[Range[n]];
 eval = Table[Times @@ point[[support]], {point, points}, {support, supports}];
 Do[Module[{a, high, axes, outside, bases, good, face, parity},
   cases++; a = LinearSolve[eval, f, Modulus -> 2];
   high = Select[Range[Length[supports]], a[[#]] == 1 && Length[supports[[#]]] > d &];
   If[high =!= {}, nonmembers++; axes = Take[supports[[First[high]]], d + 1];
    outside = Complement[Range[n], axes];
    bases = Select[points, Total[#[[axes]]] == 0 &]; good = False;
    Do[face = Select[Range[Length[points]], points[[#, outside]] === base[[outside]] &];
     parity = Mod[Total[f[[face]]], 2];
     If[parity == 1,
      good = (Length[face] == 2^(d + 1) && And @@ Table[Mod[Total[eval[[face, j]]], 2] == 0, {j, Select[Range[Length[supports]], Length[supports[[#]]] <= d &]}]); Break[]],
     {base, bases}];
    If[!good, failures++]]], {f, Tuples[{0, 1}, 2^n]}];
 {n, d, cases, nonmembers, failures}
];
rows = Flatten[Table[Table[checkFastWitness[n, d], {d, 0, n - 1}], {n, 1, 3}], 1];
fullRanks = Table[Module[{p = Tuples[{0, 1}, n], s = Subsets[Range[n]], e}, e = Table[Times @@ x[[u]], {x, p}, {u, s}]; {n, MatrixRank[e, Modulus -> 2], 2^n}], {n, 1, 5}];
<|"Version" -> $Version, "CoefficientSelectedFaceRows_n_d_cases_nonmembers_failures" -> rows, "FullMonomialEvaluationRanks_n_rank_expected" -> fullRanks, "AllPass" -> (And @@ (Last[#] == 0 & /@ rows) && And @@ (#[[2]] == #[[3]] & /@ fullRanks))|>
