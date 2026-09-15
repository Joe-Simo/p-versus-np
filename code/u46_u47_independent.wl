(* Successful Wolfram cell 1: regenerate class, subset closure for sharp witness. *)
ClearAll[ops, closure];
ops[a_Integer, b_Integer, m_Integer] := Module[{u, v, w, z},
 u = BitAnd[BitXor[a, m], BitXor[b, m]];
 v = BitAnd[BitXor[a, m], b]; w = BitAnd[a, BitXor[b, m]]; z = BitAnd[a, b];
 {0, u, v, u+v, w, u+w, v+w, u+v+w, z, u+z, v+z, u+v+z, w+z, u+w+z, v+w+z, m}
];
closure[a_List, b_List, m_Integer] := Union[Flatten[Table[ops[x,y,m],{x,a},{y,b}]]];
n=4; nn=2^n; m=2^nn-1;
base=Join[{0,m}, Table[Sum[BitGet[x,i]*2^x,{x,0,nn-1}],{i,0,n-1}]];
c1=closure[base,base,m]; c2=Union[c1,closure[c1,base,m]];
c3=Union[c2,closure[c2,base,m],closure[c1,c1,m]];
f=1+2^15; good=ConstantArray[0,2^nn];
Do[good[[BitXor[m,BitXor[f,g]]+1]]=1,{g,c3}];
Do[good=Flatten[Function[row,Join[Unitize[Take[row,b]+Drop[row,b]],Drop[row,b]]]/@Partition[good,2*b]],{b,2^Range[0,nn-1]}];
bad=Flatten[Position[good,0]]-1;
weights=DigitCount[bad,2,1]; minw=Min[weights]; certs=Pick[bad,weights,minw];
<|"Version"->$Version,"ClassCounts"->{Length[c1],Length[c2],Length[c3]},"ClassSums"->{Total[c3],Total[c3^2]},"Target"->f,"MinimumPoints"->minw,"MinimumCertificateCount"->Length[certs],"FirstMinimumMask"->First[certs],"AllMasksSizeAtMostEightConsistent"->AllTrue[Pick[Range[0,m],DigitCount[Range[0,m],2,1],x_/;x<=8],good[[#+1]]==1&]|>

(* Successful corrected cell 2; each cell is independently executable. *)
ClearAll[ops, closure, valid];
ops[a_Integer,b_Integer,m_Integer] := Module[{u,v,w,z},u=BitAnd[BitXor[a,m],BitXor[b,m]];v=BitAnd[BitXor[a,m],b];w=BitAnd[a,BitXor[b,m]];z=BitAnd[a,b];{0,u,v,u+v,w,u+w,v+w,u+v+w,z,u+z,v+z,u+v+z,w+z,u+w+z,v+w+z,m}];
closure[a_List,b_List,m_Integer] := Union[Flatten[Table[ops[x,y,m],{x,a},{y,b}]]];
m=65535;base={0,m,43690,52428,61680,65280};
c1=closure[base,base,m];c2=Union[c1,closure[c1,base,m]];c3=Union[c2,closure[c2,base,m],closure[c1,c1,m]];
f=14366;mask=15838;alternate=3599;
valid[s_] := AllTrue[c3,BitAnd[BitXor[f,#],s]!=0&];
fits=Table[If[BitGet[mask,i]==1,With[{reduced=BitXor[mask,2^i]},{i,SelectFirst[c3,BitAnd[BitXor[f,#],reduced]==0&]}],Nothing],{i,0,15}];
<|"Version"->$Version,"ClassCount"->Length[c3],"Target"->f,"ElevenPointMask"->mask,"ElevenPointValid"->valid[mask],"EachDeletionHasFitter"->(Length[fits]==11&&AllTrue[fits,IntegerQ[#[[2]]]&]),"FittingTablesAfterDeletion"->fits,"AlternativeMask"->alternate,"AlternativeSize"->DigitCount[alternate,2,1],"AlternativeValid"->valid[alternate]|>
