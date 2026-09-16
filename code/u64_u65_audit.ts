/** U64-U65: <=4-row topology-feasibility collapse and sharp five-row bottleneck. */
export {};

type Gate = readonly [number, number];
function check(ok: boolean, why: string): asserts ok { if (!ok) throw new Error(why); }
function bit(x: number, i: number): number { return (x >>> i) & 1; }
function mask(q: number): number { return (1 << q) - 1; }
function gateColumn(type: number, a: number, b: number, q: number): number {
  let out = 0;
  for (let i = 0; i < q; i++) {
    const idx = (bit(a, i) << 1) | bit(b, i);
    out |= ((type >>> idx) & 1) << i;
  }
  return out;
}
function partitionKey(columns: readonly number[], row: number): string {
  return columns.map(c => String(bit(c, row))).join("");
}
function targetConstantOnInfo(columns: readonly number[], target: number, q: number): boolean {
  for (let i = 0; i < q; i++) for (let j = i + 1; j < q; j++) {
    if (partitionKey(columns, i) === partitionKey(columns, j) && bit(target, i) !== bit(target, j)) return false;
  }
  return true;
}
function distinctInfoBlocks(columns: readonly number[], q: number): number {
  return new Set(Array.from({length:q}, (_,i) => partitionKey(columns,i))).size;
}
function canon(labels: readonly number[]): string {
  const m = new Map<number, number>(); let next = 0; const out: number[] = [];
  for (const x of labels) { if (!m.has(x)) m.set(x, next++); out.push(m.get(x)!); }
  return out.join(",");
}
function allPartitions(q: number): number[][] {
  const seen = new Map<string, number[]>();
  const total = q ** q;
  for (let z = 0; z < total; z++) {
    let x = z; const a: number[] = [];
    for (let i = 0; i < q; i++) { a.push(x % q); x = Math.floor(x / q); }
    const key = canon(a); if (!seen.has(key)) seen.set(key, key.split(",").map(Number));
  }
  return [...seen.values()];
}
function refines(p: readonly number[], qpart: readonly number[]): boolean {
  for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) {
    if (p[i] === p[j] && qpart[i] !== qpart[j]) return false;
  }
  return true;
}
function meet(p: readonly number[], qpart: readonly number[]): number[] {
  const ids = new Map<string, number>(); let next = 0;
  return p.map((x,i) => { const k=`${x}|${qpart[i]}`; if(!ids.has(k)) ids.set(k,next++); return ids.get(k)!; });
}
function binaryPartitions(q: number): number[][] {
  const ans: number[][] = [];
  for (let z = 0; z < (1 << (q-1)); z++) {
    const a=[0]; for(let i=1;i<q;i++) a.push((z >>> (i-1)) & 1); ans.push(a);
  }
  return ans;
}
function compressionWitness(p: readonly number[], qpart: readonly number[], target: readonly number[]): [number[],number[]] | null {
  const bp = binaryPartitions(p.length).filter(a => refines(p,a));
  const bq = binaryPartitions(p.length).filter(b => refines(qpart,b));
  for (const a of bp) for (const b of bq) if (refines(meet(a,b), target)) return [a,b];
  return null;
}
function reachableFixed(fixedCount: number, gates: readonly Gate[], output: number): number[] {
  const seen = new Set<number>(); const stack=[output]; const leaves = new Set<number>();
  while (stack.length) {
    const v=stack.pop()!; if(seen.has(v)) continue; seen.add(v);
    if(v < fixedCount) { leaves.add(v); continue; }
    const [a,b]=gates[v-fixedCount]!; stack.push(a,b);
  }
  return [...leaves].sort((a,b)=>a-b);
}
function selectedChildren(fixedCount: number, gates: readonly Gate[], output: number): Map<number, number[]> {
  const total=fixedCount+gates.length;
  check(output>=0 && output<total,"bad output");
  const ancestors=new Set<number>(); const stack=[output];
  while(stack.length){const v=stack.pop()!; if(ancestors.has(v))continue; ancestors.add(v); if(v>=fixedCount){const [a,b]=gates[v-fixedCount]!; stack.push(a,b);}}
  const consumers=new Map<number, number[]>();
  for(let j=0;j<gates.length;j++){
    const v=fixedCount+j; if(!ancestors.has(v)) continue;
    const [a,b]=gates[j]!;
    for(const u of new Set([a,b])) if(ancestors.has(u)) { const arr=consumers.get(u)??[]; arr.push(v); consumers.set(u,arr); }
  }
  const dist=new Array<number>(total).fill(Number.POSITIVE_INFINITY); dist[output]=0;
  for(let v=output;v>=fixedCount;v--){ if(!ancestors.has(v) || !Number.isFinite(dist[v]!)) continue; const [a,b]=gates[v-fixedCount]!; for(const u of new Set([a,b])) if(ancestors.has(u)) dist[u]=Math.min(dist[u]!,dist[v]!+1); }
  const chosenSucc=new Map<number,number>();
  for(const u of ancestors){ if(u===output)continue; const cs=(consumers.get(u)??[]).filter(v=>dist[v]===dist[u]!-1).sort((a,b)=>a-b); check(cs.length>0,`no successor ${u}`); chosenSucc.set(u,cs[0]!); }
  const kids=new Map<number,number[]>();
  for(const [u,v] of chosenSucc){ const arr=kids.get(v)??[]; arr.push(u); kids.set(v,arr); }
  for(const [v,arr] of kids) { arr.sort((a,b)=>a-b); check(arr.length<=2,`too many selected children ${v}`); }
  return kids;
}
function possibleColumnsSelected(fixedColumns: readonly number[], gates: readonly Gate[], output: number, q: number): {possible:Set<number>, kids:Map<number,number[]>} {
  const fixedCount=fixedColumns.length; const kids=selectedChildren(fixedCount,gates,output);
  const memo=new Map<number,Set<number>>();
  function rec(v:number):Set<number>{
    const old=memo.get(v); if(old)return old;
    if(v<fixedCount){const s=new Set([fixedColumns[v]!]);memo.set(v,s);return s;}
    const ks=kids.get(v)??[]; const out=new Set<number>();
    if(ks.length===0){out.add(0);out.add(mask(q));}
    else if(ks.length===1){for(const a of rec(ks[0]!)){out.add(0);out.add(mask(q));out.add(a);out.add(mask(q)^a);}}
    else {for(const a of rec(ks[0]!)) for(const b of rec(ks[1]!)) for(let t=0;t<16;t++) out.add(gateColumn(t,a,b,q));}
    memo.set(v,out);return out;
  }
  return {possible:rec(output),kids};
}
function selectedLeafSet(fixedColumns: readonly number[], output:number, kids:Map<number,number[]>): number[] {
  const fixedCount=fixedColumns.length; const leaves=new Set<number>(); const stack=[output]; const seen=new Set<number>();
  while(stack.length){const v=stack.pop()!;if(seen.has(v))continue;seen.add(v);if(v<fixedCount){leaves.add(v);continue;} for(const u of (kids.get(v)??[]))stack.push(u);}
  return [...leaves].sort((a,b)=>a-b);
}
function constructSelectedWitness(fixedColumns: readonly number[], gates: readonly Gate[], output:number, q:number, target:number): number[] | null {
  const fixedCount=fixedColumns.length; const kids=selectedChildren(fixedCount,gates,output); const memo=new Map<number,Set<number>>();
  function poss(v:number):Set<number>{
    const old=memo.get(v); if(old)return old;
    if(v<fixedCount){const z=new Set([fixedColumns[v]!]);memo.set(v,z);return z;}
    const ks=kids.get(v)??[]; const z=new Set<number>();
    if(ks.length===0){z.add(0);z.add(mask(q));}
    else if(ks.length===1){for(const c of poss(ks[0]!)){z.add(0);z.add(mask(q));z.add(c);z.add(mask(q)^c);}}
    else {const [pa,pb]=gates[v-fixedCount]!;for(const a of poss(pa))for(const b of poss(pb))for(let t=0;t<16;t++)z.add(gateColumn(t,a,b,q));}
    memo.set(v,z);return z;
  }
  if(!poss(output).has(target))return null;
  const types=new Array<number>(gates.length).fill(0);
  function build(v:number,want:number):void{
    if(v<fixedCount){check(fixedColumns[v]===want,`fixed leaf mismatch ${v}`);return;}
    const j=v-fixedCount, [pa,pb]=gates[j]!, ks=kids.get(v)??[];
    if(ks.length===0){check(want===0||want===mask(q),"nonconstant zero-child target");types[j]=want===0?0:15;return;}
    if(ks.length===1){const u=ks[0]!;for(const c of poss(u)){let chosen:number|null=null;if(pa===pb && pa===u){for(let t=0;t<16;t++)if(gateColumn(t,c,c,q)===want){chosen=t;break;}}else if(pa===u){for(let t=0;t<16;t++)if(gateColumn(t,c,0,q)===want&&gateColumn(t,c,mask(q),q)===want){chosen=t;break;}}else if(pb===u){for(let t=0;t<16;t++)if(gateColumn(t,0,c,q)===want&&gateColumn(t,mask(q),c,q)===want){chosen=t;break;}}if(chosen!==null){build(u,c);types[j]=chosen;return;}}throw new Error("one-child witness missing");}
    check(pa!==pb && ks.includes(pa) && ks.includes(pb),"two-child physical mismatch");
    for(const a of poss(pa))for(const b of poss(pb))for(let t=0;t<16;t++)if(gateColumn(t,a,b,q)===want){build(pa,a);build(pb,b);types[j]=t;return;}
    throw new Error("two-child witness missing");
  }
  build(output,target);
  const vals=[...fixedColumns]; for(let j=0;j<gates.length;j++){const [a,b]=gates[j]!;vals.push(gateColumn(types[j]!,vals[a]!,vals[b]!,q));}
  check(vals[output]===target,"constructed witness replay failed");
  return types;
}
function bruteOutputColumns(fixedColumns: readonly number[], gates: readonly Gate[], output:number,q:number):Set<number>{
  const free=gates.length; check(free<=4,"brute cap"); const out=new Set<number>(); const total=16**free;
  for(let code=0;code<total;code++){
    let z=code; const vals=[...fixedColumns];
    for(let j=0;j<free;j++){const t=z%16;z=Math.floor(z/16);const [a,b]=gates[j]!;vals.push(gateColumn(t,vals[a]!,vals[b]!,q));}
    out.add(vals[output]!);
  }
  return out;
}
function evalPrefix(initial:readonly number[], gates:readonly Gate[], types:readonly number[],q:number):number[]{const vals=[...initial];for(let j=0;j<types.length;j++){const [a,b]=gates[j]!;vals.push(gateColumn(types[j]!,vals[a]!,vals[b]!,q));}return vals;}
let compressionCases=0; const compressionByQ: Record<string,number>={};
for(let q=1;q<=4;q++){const parts=allPartitions(q), bins=binaryPartitions(q); let c=0;for(const p of parts) for(const r of parts){const m=meet(p,r); for(const t of bins){if(!refines(m,t))continue; c++; compressionCases++; check(compressionWitness(p,r,t)!==null,`compression fail q=${q}`);}}compressionByQ[String(q)]=c;}
function rank3(xs: readonly number[]): number {const basis=[0,0,0]; let r=0;for(const v0 of xs){let v=v0; for(let b=2;b>=0;b--){if(((v>>>b)&1)===0)continue; if(basis[b]!==0)v^=basis[b]!; else {basis[b]=v;r++;break;}}}return r;}
function spanContains3(gens: readonly number[], y:number): boolean {for(let z=0;z<(1<<gens.length);z++){let v=0;for(let i=0;i<gens.length;i++)if((z>>>i)&1)v^=gens[i]!;if(v===y)return true;}return false;}
const balancedSupport: Array<Record<string,unknown>>=[];
for(const y of [0b011,0b101,0b110]){let favorable=0; const multiplicity:Record<string,number>={};for(let a=0;a<8;a++)for(let b=0;b<8;b++){const full=spanContains3([a,b,a&b],y), affine=spanContains3([a,b],y);check(full===affine,`balanced support nonlinear gap y=${y},a=${a},b=${b}`);if(full){favorable++; const ways=1<<(3-rank3([a,b,a&b])); multiplicity[String(ways)]=(multiplicity[String(ways)]??0)+1;}}check(favorable===21,"balanced favorable count");check(JSON.stringify(multiplicity)===JSON.stringify({"1":6,"2":12,"4":3}),"balanced multiplicity histogram");balancedSupport.push({targetShape:y,favorablePairs:favorable,gateTypeMultiplicityHistogram:multiplicity});}
const p5=[0,0,0,1,1], q5=[0,1,2,0,1], t5=[0,0,1,0,1];check(refines(meet(p5,q5),t5),"five target not determined by full pair info");check(compressionWitness(p5,q5,t5)===null,"five-row compression unexpectedly succeeds");
let topologyCases=0, bruteCases=0, prefixCases=0, constructedWitnesses=0; const topoRows:Array<Record<string,unknown>>=[];
for(let q=1;q<=4;q++){
  const m=mask(q); const leafSets:number[][]=[[0,m],[0,Math.min(m,0b1010&m),Math.min(m,0b1100&m)],[Math.min(m,0b0011&m),Math.min(m,0b0101&m),Math.min(m,0b0110&m)]]; const topologies:Gate[][]=[[[0,1]],[[0,1],[1,2]],[[0,1],[0,2],[3,4]],[[0,1],[0,1],[2,3]],[[0,1],[1,2],[3,4]]];
  for(const leaves0 of leafSets)for(const g0 of topologies){const k=leaves0.length; let valid=true;for(let j=0;j<g0.length;j++){if(g0[j]![0]>=k+j||g0[j]![1]>=k+j){valid=false;break;}}if(!valid)continue;const output=k+g0.length-1;const {possible,kids}=possibleColumnsSelected(leaves0,g0,output,q);const selected=selectedLeafSet(leaves0,output,kids);const reachable=reachableFixed(k,g0,output);const reachCols=reachable.map(i=>leaves0[i]!);check(selected.join(",")===reachable.join(","),"selected leaves lost reachable fixed signal");const expected=new Set<number>();for(let target=0;target<=m;target++)if(targetConstantOnInfo(reachCols,target,q))expected.add(target);check([...possible].sort((a,b)=>a-b).join(",")===[...expected].sort((a,b)=>a-b).join(","),`tree collapse mismatch q=${q}`);for(const target of expected){const wit=constructSelectedWitness(leaves0,g0,output,q,target);check(wit!==null,"constructive witness missing");constructedWitnesses++;}topologyCases++;if(g0.length<=3){const raw=bruteOutputColumns(leaves0,g0,output,q);check([...raw].sort((a,b)=>a-b).join(",")===[...expected].sort((a,b)=>a-b).join(","),`raw mismatch q=${q}`);bruteCases++;}topoRows.push({q,k,gates:g0.length,infoBlocks:distinctInfoBlocks(reachCols,q),possible:possible.size});for(let pin=0;pin<=g0.length;pin++){if(g0.length-pin>2)continue;const prefixTotal=16**pin; const sampleLimit=Math.min(prefixTotal,pin<=2?prefixTotal:64);for(let code=0;code<sampleLimit;code++){let z=code; const types:number[]=[];for(let j=0;j<pin;j++){types.push(z%16);z=Math.floor(z/16);}const vals=evalPrefix(leaves0,g0,types,q);if(pin===g0.length){for(let target=0;target<=m;target++){prefixCases++;}continue;}const fixedCols=vals; const suffix=g0.slice(pin); const suffixOutput=fixedCols.length+suffix.length-1;const reach=reachableFixed(fixedCols.length,suffix,suffixOutput);const rc=reach.map(i=>fixedCols[i]!);const raw=bruteOutputColumns(fixedCols,suffix,suffixOutput,q);for(let target=0;target<=m;target++){const criterion=targetConstantOnInfo(rc,target,q);check(criterion===raw.has(target),`prefix criterion fail q=${q},pin=${pin}`);prefixCases++;}}}}
}
const q=5, P=0b11000, Q1=0b00100, Q2=0b10010, T=0b10100; const badGates:Gate[]=[[1,2],[0,3]]; const goodGates:Gate[]=[[0,2],[3,1]];
function countTarget(leaves:number[],gates:Gate[],target:number):{count:number,witness:number[]|null}{let count=0;let witness:number[]|null=null;for(let f=0;f<16;f++)for(let g=0;g<16;g++){const vals=[...leaves];vals.push(gateColumn(f,vals[gates[0]![0]]!,vals[gates[0]![1]]!,q));vals.push(gateColumn(g,vals[gates[1]![0]]!,vals[gates[1]![1]]!,q));if(vals[4]===target){count++;if(witness===null)witness=[f,g];}}return {count,witness};}
const leafTuples=new Set<string>();for(let i=0;i<q;i++)leafTuples.add(`${bit(P,i)}${bit(Q1,i)}${bit(Q2,i)}`);check(leafTuples.size===5,"five leaves do not distinguish rows");const bad=countTarget([P,Q1,Q2],badGates,T), good=countTarget([P,Q1,Q2],goodGates,T);check(bad.count===0,"bad bottleneck has witness");check(good.count>0&&good.witness!==null,"good grouping lacks witness");const nandType=0b0111; const notHOrQ1=0b1011; const goodVals=[P,Q1,Q2];goodVals.push(gateColumn(nandType,P,Q2,q));goodVals.push(gateColumn(notHOrQ1,goodVals[3]!,Q1,q));check(goodVals[4]===T,"declared five-row witness failed");
const q4=4, LA=0b1100, LB=0b1010, LY=0b0110;function countTwoGateQ4(gates:Gate[]):number{let c=0;for(let f=0;f<16;f++)for(let g=0;g<16;g++){const vals=[LA,LB];vals.push(gateColumn(f,vals[gates[0]![0]]!,vals[gates[0]![1]]!,q4));vals.push(gateColumn(g,vals[gates[1]![0]]!,vals[gates[1]![1]]!,q4));if(vals[3]===LY)c++;}return c;}const countTopologyA:Gate[]=[[0,1],[2,2]], countTopologyB:Gate[]=[[0,1],[0,2]];const countA=countTwoGateQ4(countTopologyA), countB=countTwoGateQ4(countTopologyB);check(countA===8&&countB===4,"quantitative separation mismatch");
console.log(JSON.stringify({status:"pass",compressionCases,compressionByQ,balancedSupport,topologyCases,bruteCases,prefixCases,constructedWitnesses,topologyRows:topoRows,fiveRow:{partitions:{p:p5,q:q5,target:t5,meet:meet(p5,q5)},leafColumns:[P,Q1,Q2],distinctLeafTuples:leafTuples.size,badTopology:{gates:badGates,count:bad.count},goodTopology:{gates:goodGates,count:good.count,firstWitness:good.witness,declaredWitness:[nandType,notHOrQ1],intermediate:goodVals[3]}},countSeparation:{leafColumns:[LA,LB],target:LY,topologyA:{gates:countTopologyA,count:countA},topologyB:{gates:countTopologyB,count:countB}},scope:"Feasibility/zero-detection only; no counting FPRAS or P-vs-NP resolution"},null,2));
