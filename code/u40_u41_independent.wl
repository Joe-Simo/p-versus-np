(* Independent finite audits; executed through WolframLanguageEvaluator with timeConstraint -> 30.
   This is not a machine-checked proof of the asymptotic statements. *)
ClearAll[coverExists,reduceGraph];
coverExists[verts_,edges_,k_] := If[k<0,False,AnyTrue[Subsets[verts,{0,Min[k,Length[verts]]}], Function[c,AllTrue[edges,Function[e,Intersection[c,e]!={}]]]]];
reduceGraph[verts_,edges_,k_] := Module[{forced,budget,left}, forced=Select[verts,Function[v,Count[edges,e_/;MemberQ[e,v]]>k]]; If[Length[forced]>k,Return[False]]; budget=k-Length[forced];left=Select[edges,Intersection[#,forced]=={}&]; If[Length[left]>k budget,Return[False]];coverExists[Union[Flatten[left]],left,budget]];
checks=0;bad={};Do[verts=Range[n];possible=Subsets[verts,{2}];Do[Do[checks++;If[coverExists[verts,edges,k]=!=reduceGraph[verts,edges,k],AppendTo[bad,{n,edges,k}]],{k,0,n}],{edges,Subsets[possible]}],{n,0,5}];
q=4;cube=Tuples[{0,1},q];evens=Select[cube,EvenQ[Total[#]]&];parityAudit=Table[coords=Flatten[Table[Subsets[Range[q],{j}],{j,1,b}],1];valid=Select[Subsets[evens],Function[s,With[{projections=Table[DeleteDuplicates[(#[[js]]&)/@s],{js,coords}]},Select[cube,Function[a,And@@MapThread[MemberQ[#1,a[[#2]]]&, {projections,coords}]]]===s]]];{b,Length[valid],Max[Length/@valid]},{b,1,q}];
<|"KernelCases"->checks,"KernelFailures"->Length[bad],"FourVariableParityCNF"->parityAudit|>
