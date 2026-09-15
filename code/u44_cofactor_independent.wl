(* Independent Wolfram cell 1: class defined by cofactors, not circuit synthesis. *)
ClearAll[cofactorOK, table, valuePoly];
table[f_Integer] := Reverse[IntegerDigits[f, 2, 8]];
points = Reverse /@ IntegerDigits[Range[0, 7], 2, 3];
cofactorOK[f_Integer] := Module[{v=table[f], rows, low, high},
 Or @@ Table[rows=Table[Pick[v, points[[All, i]], b],{b,0,1}]; low=rows[[1]]; high=rows[[2]];
  (Length[Union[low]]==1 || Length[Union[high]]==1 || low===high || Mod[low+high,2]===ConstantArray[1,4]), {i,1,3}]];
members = Select[Range[0,255], cofactorOK]; outsiders = Complement[Range[0,255],members];
terms={22,24,36,41,66,73,97,104,129,134,146,148};
valuePoly[f_] := Mod[Total[Boole[BitAnd[f,#]==#]& /@ terms],2];
failures=Count[Table[cofactorOK[f] === (valuePoly[f]==0), {f,0,255}],False];
ranks=Table[Module[{s=Subsets[Range[8],{0,d}], mat}, mat=Table[Times@@table[f][[u]],{f,members},{u,s}]; {d,Length[s],MatrixRank[mat,Modulus->2]}],{d,0,3}];
subsets=SortBy[Range[0,255],{DigitCount[#,2,1]&,Identity}];
patterns=Table[Union[BitAnd[#,mask]& /@ members],{mask,0,255}];
minimumSizes=Table[Module[{m=SelectFirst[subsets, !MemberQ[patterns[[#+1]],BitAnd[f,#]]&]}, DigitCount[m,2,1]],{f,outsiders}];
ballRanks=Table[Module[{s=Select[Range[0,255],DigitCount[#,2,1]<=r&],mat},mat=Table[Boole[BitAnd[f,u]==u],{f,s},{u,s}];{r,Length[s],MatrixRank[mat,Modulus->2]}],{r,0,4}];
<|"Version"->$Version,"CofactorClassCount"->Length[members],"CofactorClassMaskHex"->IntegerString[Total[2^members],16],"CubicFailures"->failures,"DegreeFeatureRanks_d_columns_rank"->ranks,"MinimumPointCounts_size_number"->Sort[Tally[minimumSizes]],"HammingBallRanks_r_columns_rank"->ballRanks|>
