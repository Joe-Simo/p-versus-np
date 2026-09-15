(* Independent Wolfram cell 2, corrected clean invocation. *)
ClearAll[val,cubic,sens];
val[f_,x_] := BitGet[f,x];
terms={22,24,36,41,66,73,97,104,129,134,146,148};
cubic[f_] := Mod[Total[Boole[BitAnd[f,#]==#]& /@ terms],2];
hard=Select[Range[0,255],cubic[#]==1&]; easy=Complement[Range[0,255],hard];
isolated=Select[hard,Function[f,AllTrue[Range[0,7],Function[x,cubic[BitXor[f,2^x]]==0]]]];
sens[f_]:=Max[Table[Count[Table[val[f,x]!=val[f,BitXor[x,2^i]],{i,0,2}],True],{x,0,7}]];
low=Select[Range[0,255],sens[#]<=1&];
majority=Sum[If[DigitCount[x,2,1]>=2,2^x,0],{x,0,7}];
small=Select[Range[0,255],DigitCount[#,2,1]<=6&];
majoritySmallFailures=Count[Table[AnyTrue[easy,Function[g,BitAnd[BitXor[g,majority],m]==0]],{m,small}],False];
seven=Select[Range[0,255],Function[m,DigitCount[m,2,1]==7 && !AnyTrue[easy,Function[g,BitAnd[BitXor[g,majority],m]==0]]]];
<|"Version"->$Version,"Nonmembers"->Length[hard],"IsolatedCubicNonmembers"->isolated,"SensitivityAtMostOneTables"->low,"MajorityTruthTable"->majority,"SmallSubsetsChecked"->Length[small],"MajoritySmallCertificateFailures"->majoritySmallFailures,"MajoritySevenPointCertificates"->seven|>
