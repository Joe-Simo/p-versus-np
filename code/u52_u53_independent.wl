(* Exact independent Wolfram invocation, 40-second limit. *)
ClearAll[gate, rawCounts, copyMass];
gate[g_Integer,a_Integer,b_Integer,q_Integer] := Sum[BitAnd[BitShiftRight[g,BitAnd[BitShiftRight[a,j],1]+2 BitAnd[BitShiftRight[b,j],1]],1] 2^j,{j,0,q-1}];
rawCounts[cols_List,q_Integer] := Module[{out=ConstantArray[0,2^q],v},Do[v=Append[cols,gate[g,cols[[a]],cols[[b]],q]];Do[out[[c+1]]++,{c,v}],{a,Length[cols]},{b,Length[cols]},{g,0,15}];out];
oneRows=Table[{cols,rawCounts[cols,2]},{cols,{{0,1,2,2,3},{0,1,2,3,3}}}];
(* Directly enumerate ordered first gates, not histogram representatives. *)
start={0,3,1,2}; two=Total[Flatten[Table[rawCounts[Append[start,gate[g,start[[a]],start[[b]],2]],2],{a,4},{b,4},{g,0,15}],2]];
copyMass[m_List,r_Integer] := Module[{d=Length[m],k=Total[m],ds,total=0,outs=ConstantArray[0,Length[m]],w},ds=Select[Tuples[Range[0,r],d],Total[#]==r&];Do[w=Multinomial@@delta;w*=Product[Pochhammer[m[[i]],delta[[i]]],{i,d}]*Pochhammer[k,r];total+=w;outs+=w*(m+delta),{delta,ds}];{m,r,Length[ds],total,outs,total==Pochhammer[k,r]^2 && outs*k==total*(k+r)*m}];
copyRows={copyMass[{1,2},2],copyMass[{1,1,1,1},4],copyMass[{3,2,1},5]};
bounds=And@@Table[With[{q=Floor[Log[2,s/2]],dd=2^Floor[Log[2,s/2]]},dd-q-2>=0 && 2 dd-q-2<=s && Binomial[2 dd-1,dd-1]>=2^(dd-1)],{s,8,128}];
<|"Version"->$Version,"OneGateCounts"->oneRows,"TwoGateCounts_n2_points12"->two,"RawTwoGateTotal"->Total[two],"CopyRows"->copyRows,"StateBoundChecks"->bounds|>
