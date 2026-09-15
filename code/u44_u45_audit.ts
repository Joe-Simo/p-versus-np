/** Exact B2 synthesis and nonlinear certificates on finite Boolean domains. */
export {};
type Gate = { readonly op: number; readonly a: number; readonly b: number };
type Net = { readonly gates: readonly Gate[]; readonly output: number };
type State = { readonly signals: readonly number[]; readonly gates: readonly Gate[] };
function assert(p: boolean, m: string): asserts p { if (!p) throw new Error(m); }
function at<T>(a: readonly T[], i: number): T { const x=a[i]; assert(x!==undefined, `index ${i}`); return x; }
function weight(x: number): number { let r=0; for (;x;x&=x-1) r++; return r; }
function evalGate(op: number,a: number,b: number,N: number): number {
 let f=0; for(let x=0;x<N;x++) f|=((op>>> (2*((a>>>x)&1)+((b>>>x)&1)))&1)<<x; return f;
}
function inputs(n: number): number[] {
 const N=2**n; return [0,2**N-1,...Array.from({length:n},(_,i)=>{
  let f=0; for(let x=0;x<N;x++) f|=((x>>>i)&1)<<x; return f;
 })];
}
function verifyNet(n: number,net: Net,expected: number): void {
 const v=inputs(n), N=2**n;
 for(const g of net.gates) {
  assert(g.a>=0&&g.a<v.length&&g.b>=0&&g.b<v.length&&g.op>=0&&g.op<16,'invalid DAG');
  v.push(evalGate(g.op,at(v,g.a),at(v,g.b),N));
 }
 assert(at(v,net.output)===expected,'incorrect synthesized network');
}
function opTable(N: number): readonly Uint16Array[] {
 const Q=2**N, all: Uint16Array[]=[];
 for(let a=0;a<Q;a++) for(let b=0;b<Q;b++) {
  all.push(Uint16Array.from({length:16},(_,op)=>evalGate(op,a,b,N)));
 }
 return all;
}
function synth(n: number) {
 const N=2**n,Q=2**N, table=opTable(N), base=inputs(n);
 const witness: (Net|undefined)[]=Array<Net|undefined>(Q).fill(undefined);
 base.forEach((f,i)=>{witness[f]={gates:[],output:i};});
 let states: State[]=[{signals:base,gates:[]}]; const layers=[];
 for(let s=1;s<=4;s++) {
  const next=new Map<string,State>(); let candidates=0;
  for(const st of states) {
   const present=new Set(st.signals), add=new Map<number,Gate>();
   for(let a=0;a<st.signals.length;a++) for(let b=0;b<st.signals.length;b++) {
    const vals=at(table,at(st.signals,a)*Q+at(st.signals,b));
    for(let op=0;op<16;op++) {
     candidates++; const f=vals[op]; assert(f!==undefined,'opcode');
     if(!present.has(f)&&!add.has(f)) add.set(f,{op,a,b});
    }
   }
   for(const [f,g] of add) {
    const gates=[...st.gates,g];
    if(witness[f]===undefined) witness[f]={gates,output:base.length+s-1};
    if(s<4) {
     const signals=[...st.signals,f], key=[...signals].sort((a,b)=>a-b).join(',');
     if(!next.has(key)) next.set(key,{signals,gates});
    }
   }
  }
  const reached=witness.filter(x=>x!==undefined).length;
  layers.push({gates:s,completePrefixStates:states.length,gateDescriptionsEvaluated:candidates,nextDistinctAvailableSets:s<4?next.size:null,functionsReached:reached,layerComplete:true});
  if(reached===Q) break;
  states=[...next.values()]; assert(states.length<1000000,'resource cap on available sets');
 }
 assert(witness.every(x=>x!==undefined),'not all functions synthesized under declared cap');
 const nets=witness.map((x,f)=>{assert(x!==undefined,'witness'); verifyNet(n,x,f); return x;});
 const max=Math.max(...nets.map(x=>x.gates.length));
 const histogram=Array.from({length:max+1},(_,s)=>nets.filter(x=>x.gates.length===s).length);
 // No semantic pruning: enumerate all raw ordered last-gate descriptions through depth two.
 const rawSets=[new Set(base),new Set<number>(),new Set<number>()]; let counts=[BigInt(base.length),0n,0n];
 function visit(signals: readonly number[],depth: number): void {
  if(depth===2) return;
  for(let a=0;a<signals.length;a++) for(let b=0;b<signals.length;b++) for(let op=0;op<16;op++) {
   const f=evalGate(op,at(signals,a),at(signals,b),N), level=depth+1;
   at(rawSets,level).add(f); counts[level]=(counts[level]??0n)+1n; visit([...signals,f],level);
  }
 }
 visit(base,0);
 let formula=1n; const raw=[];
 for(let s=0;s<=max;s++) {
  if(s>0) formula*=16n*BigInt(base.length+s-1)**2n;
  const expected=s===0?BigInt(base.length):formula;
  if(s<=2) {
   assert(counts[s]===expected,'raw count formula');
   const a=nets.map((net,f)=>net.gates.length<=s?f:-1).filter(f=>f>=0);
   assert(a.length===at(rawSets,s).size&&a.every(f=>at(rawSets,s).has(f)),'raw/BFS function-class mismatch');
  }
  raw.push({gates:s,lastGateDescriptionCount:expected.toString(),independentlyEnumerated:s<=2});
 }
 return {n,N,max,histogram,layers,raw,nets};
}
// Bigint row elimination with coefficient provenance. All operations are over GF(2).
type BasisRow={readonly v:bigint;readonly combo:bigint};
function top(v: bigint): number { return v.toString(2).length-1; }
function insert(basis:Map<number,BasisRow>,v0:bigint,combo0:bigint): bigint|undefined {
 let v=v0,combo=combo0;
 while(v) {const p=top(v),b=basis.get(p); if(b===undefined){basis.set(p,{v,combo});return undefined;} v^=b.v;combo^=b.combo;}
 return combo;
}
function inSpan(basis:Map<number,BasisRow>,v0:bigint):boolean {
 let v=v0;while(v){const b=basis.get(top(v));if(b===undefined)return false;v^=b.v;}return true;
}
function feature(f:number,monomials:readonly number[]):bigint {
 let v=0n;monomials.forEach((m,j)=>{if((f&m)===m)v|=1n<<BigInt(j);});return v;
}
function parityBig(v:bigint):number {let r=0;for(;v;v&=v-1n)r^=1;return r;}
function polynomial(f:number,terms:readonly number[]):number {let r=0;for(const m of terms)if((f&m)===m)r^=1;return r;}
function certificateAnalysis(n:number,nets:readonly Net[]) {
 const N=2**n,Q=2**N,max=Math.max(...nets.map(x=>x.gates.length));const rows=[];
 for(let s=0;s<=max;s++) {
  const members=nets.map((g,f)=>g.gates.length<=s?f:-1).filter(f=>f>=0), membersSet=new Set(members);
  const nonmembers=Array.from({length:Q},(_,f)=>f).filter(f=>!membersSet.has(f));
  const subsets=Array.from({length:Q},(_,m)=>m).sort((a,b)=>weight(a)-weight(b)||a-b);
  const firstCertificate=new Map<number,number>(); let testedPartialLabels=0,inconsistentLabels=0;
  for(const mask of subsets) {
   const patterns=new Set(members.map(f=>f&mask));
   for(let lab=mask;;lab=(lab-1)&mask) {
    testedPartialLabels++;if(!patterns.has(lab))inconsistentLabels++;
    if(lab===0)break;
   }
   for(const f of nonmembers) if(!firstCertificate.has(f)&&!patterns.has(f&mask)) firstCertificate.set(f,mask);
  }
  const minimalDegree=new Map<number,number>(),separators=new Map<number,number[]>(),degreeRows=[];
  for(let d=0;d<=N;d++) {
   const monomials=Array.from({length:Q},(_,m)=>m).filter(m=>weight(m)<=d);
   const evalRows=members.map(f=>feature(f,monomials)),rowBasis=new Map<number,BasisRow>();
   evalRows.forEach((v,i)=>insert(rowBasis,v,1n<<BigInt(i)));
   const columns=new Map<number,BasisRow>(),nullBasis:bigint[]=[];
   monomials.forEach((_,j)=>{
    let col=0n;evalRows.forEach((v,i)=>{if((v&(1n<<BigInt(j)))!==0n)col|=1n<<BigInt(i);});
    const dependency=insert(columns,col,1n<<BigInt(j));if(dependency!==undefined)nullBasis.push(dependency);
   });
   assert(rowBasis.size===columns.size&&nullBasis.length===monomials.length-rowBasis.size,'rank/nullity');
   degreeRows.push({degree:d,monomials:monomials.length,rank:rowBasis.size,nullity:nullBasis.length});
   for(const f of nonmembers) if(!minimalDegree.has(f)) {
    const v=feature(f,monomials),outside=!inSpan(rowBasis,v);
    const sep=nullBasis.find(a=>parityBig(a&v)===1);assert(outside===(sep!==undefined),'row/column separation duality');
    if(sep!==undefined){
     const terms=monomials.filter((_,i)=>(sep&(1n<<BigInt(i)))!==0n);
     assert(members.every(c=>polynomial(c,terms)===0)&&polynomial(f,terms)===1,'invalid separating polynomial');
     minimalDegree.set(f,d);separators.set(f,terms);
    }
   }
  }
  assert(minimalDegree.size===nonmembers.length,'nonmember not separated');
  const targets=nonmembers.map(f=>{
   const mask=firstCertificate.get(f),d=minimalDegree.get(f),terms=separators.get(f);
   assert(mask!==undefined&&d!==undefined&&terms!==undefined,'missing certificate');
   assert(d<=weight(mask),'pattern polynomial upper bound');
   return {truthTable:f,minimumInputPoints:weight(mask),pointMask:mask,minimumPolynomialDegree:d,polynomialTerms:terms};
  });
  const pointHist:Record<string,number>={},degreeHist:Record<string,number>={};
  for(const t of targets){pointHist[t.minimumInputPoints]=(pointHist[t.minimumInputPoints]??0)+1;degreeHist[t.minimumPolynomialDegree]=(degreeHist[t.minimumPolynomialDegree]??0)+1;}
  rows.push({budget:s,memberCount:members.length,members,testedPartialLabels,inconsistentLabels,pointHistogram:pointHist,degreeHistogram:degreeHist,degreeRows,targets});
 }
 return rows;
}
class Builder {
 readonly gates:Gate[]=[];
 gate(op:number,a:number,b:number):number{this.gates.push({op,a,b});return this.n+1+this.gates.length;}
 constructor(readonly n:number){}
}
function interpolate(n:number,mask:number,labels:number):Net {
 const b=new Builder(n),pts=Array.from({length:2**n},(_,x)=>x).filter(x=>(mask&(1<<x))!==0);
 function rec(points:readonly number[]):number {
  if(points.length===0)return 0;
  const first=(labels>>>at(points,0))&1;
  if(points.every(x=>((labels>>>x)&1)===first))return first;
  let i=0;while(i<n&&points.every(x=>((x>>>i)&1)===((at(points,0)>>>i)&1)))i++;
  assert(i<n,'unseparable points');
  const left=rec(points.filter(x=>((x>>>i)&1)===0)),right=rec(points.filter(x=>((x>>>i)&1)===1)),x=i+2;
  if(left<2||right<2){
   const varying=left<2?right:left; let op=0;
   for(let a=0;a<=1;a++)for(let v=0;v<=1;v++){
    const l=left<2?left:v,r=right<2?right:v;op|=(a===0?l:r)<<(2*a+v);
   }
   return b.gate(op,x,varying);
  }
  // (~x & left) OR (x & right).
  return b.gate(14,b.gate(2,x,left),b.gate(8,x,right));
 }
 const output=rec(pts);return {gates:b.gates,output};
}
function sparse(n:number,f:number):Net {
 assert(n>=2,'sparse construction starts at n=2');const b=new Builder(n);let output=0,count=0;
 for(let x=0;x<2**n;x++)if(((f>>>x)&1)!==0){
  let term=b.gate(1<<(2*(x&1)+((x>>>1)&1)),2,3);
  for(let i=2;i<n;i++)term=b.gate(1<<(2+((x>>>i)&1)),term,i+2);
  output=count++===0?term:b.gate(14,output,term);
 }
 const bound=count===0?0:n*count-1;assert(b.gates.length===bound,'sparse gate cost');return {gates:b.gates,output};
}
function constructiveAudit() {
 const interpolationRows=[],sparseRows=[],ballRows=[];
 for(let n=1;n<=3;n++){
  const N=2**n,Q=2**N;let cases=0,maxGates=0;
  for(let mask=0;mask<Q;mask++)for(let lab=mask;;lab=(lab-1)&mask){
   const net=interpolate(n,mask,lab),v=inputs(n);
   for(const g of net.gates)v.push(evalGate(g.op,at(v,g.a),at(v,g.b),N));
   assert((at(v,net.output)&mask)===lab,'interpolation mismatch');
   const t=weight(mask),bound=t<=1?0:2*t-3;assert(net.gates.length<=bound,'interpolation gate bound');
   maxGates=Math.max(maxGates,net.gates.length);cases++;if(lab===0)break;
  }
  assert(cases===3**N,'partial table enumeration');interpolationRows.push({n,cases,maxGates});
  if(n>=2){for(let f=0;f<Q;f++)verifyNet(n,sparse(n,f),f);sparseRows.push({n,allFunctions:Q});}
  for(let d=0;d<=N;d++){
   const masks=Array.from({length:Q},(_,m)=>m).filter(m=>weight(m)<=d),basis=new Map<number,BasisRow>();
   masks.forEach((f,i)=>insert(basis,feature(f,masks),1n<<BigInt(i)));
   assert(basis.size===masks.length,'Hamming-ball interpolation rank');ballRows.push({n,degree:d,rank:basis.size});
  }
 }
 return {interpolationRows,sparseRows,ballRows};
}

// A constant-size nonlinear identity discovered on the complete three-input domain.
const cubicTerms = [22,24,36,41,66,73,97,104,129,134,146,148] as const;
function coreThree(f:number,axes:readonly number[]):number {
 let core=0;
 for(let y=0;y<8;y++){
  let x=0;axes.forEach((axis,j)=>{if((y&(1<<j))!==0)x|=1<<axis;});
  core|=((f>>>x)&1)<<y;
 }
 return core;
}
function cofactorDecomposable(f:number):boolean {
 for(let axis=0;axis<3;axis++){
  const others=[0,1,2].filter(x=>x!==axis);let low=0,high=0;
  for(let a=0;a<4;a++){
   let x=0;others.forEach((i,j)=>{if((a&(1<<j))!==0)x|=1<<i;});
   low|=((f>>>x)&1)<<a;high|=((f>>>(x|(1<<axis)))&1)<<a;
  }
  if(low===0||low===15||high===0||high===15||low===high||(low^high)===15)return true;
 }
 return false;
}
// Any non-dictatorial Boolean function has a vertex with sensitivity >=2.
function sevenPointCertificate(n:number,value:(x:number)=>number,axes:readonly number[],pairs:readonly (readonly [number,number])[]):number[] {
 let root=-1;let near:number[]=[];
 for(let x=0;x<2**n&&root<0;x++){
  const neighbors:number[]=[];
  for(let i=0;i<n&&neighbors.length<2;i++)if(value(x)!==value(x^(1<<i)))neighbors.push(i);
  if(neighbors.length===2){root=x;near=neighbors;}
 }
 assert(root>=0,'sensitivity-one function cannot have four essential variables');
 const out=new Set([root,root^(1<<at(near,0)),root^(1<<at(near,1))]);
 let colors=2;
 for(let j=0;j<axes.length&&colors<4;j++)if(!near.includes(at(axes,j))){
  const pair=at(pairs,j);assert(value(pair[0])!==value(pair[1]),'invalid sensitive edge');
  out.add(pair[0]);out.add(pair[1]);colors++;
 }
 assert(colors===4&&out.size<=7,'seven point support');return [...out].sort((a,b)=>a-b);
}
function uniformTwoGate(n:number,f:number) {
 const N=2**n,axes:number[]=[],pairs: [number,number][]=[];
 for(let i=0;i<n;i++) {
  let point=-1;
  for(let x=0;x<N;x++)if((x&(1<<i))===0&&((f>>>x)&1)!==((f>>>(x|(1<<i)))&1)){point=x;break;}
  if(point>=0){axes.push(i);pairs.push([point,point|(1<<i)]);}
  if(axes.length===4){const pts=sevenPointCertificate(n,x=>(f>>>x)&1,axes,pairs);return {kind:'certificate' as const,mask:pts.reduce((m,x)=>m|(1<<x),0),reason:'four essential variables'};}
 }
 const core=coreThree(f,axes);
 if(polynomial(core,cubicTerms)===1){
  const omitted=Array.from({length:8},(_,x)=>x).find(x=>polynomial(core^(1<<x),cubicTerms)===1);
  assert(omitted!==undefined,'isolated point in cubic one-set');const m=255^(1<<omitted);let mask=0;
  for(let y=0;y<8;y++)if((m&(1<<y))!==0){
   let x=0;axes.forEach((axis,j)=>{if((y&(1<<j))!==0)x|=1<<axis;});mask|=1<<x;
  }
  return {kind:'certificate' as const,mask,reason:'nonlinear three-variable core'};
 }
 // Direct cofactor construction, no synthesis table consulted by the algorithm.
 const b=new Builder(n);
 for(let axis=0;axis<3;axis++){
  const other=[0,1,2].filter(x=>x!==axis);const rows=[0,0];
  for(let side=0;side<2;side++)for(let a=0;a<4;a++){
   let x=side<<axis;other.forEach((j,t)=>{if((a&(1<<t))!==0)x|=1<<j;});
   rows[side]=at(rows,side)|(((core>>>x)&1)<<a);
  }
  const lo=at(rows,0),hi=at(rows,1);
  if(!(lo===0||lo===15||hi===0||hi===15||lo===hi||(lo^hi)===15))continue;
  const h=rows.find(x=>x!==0&&x!==15)??0;
  const wire=(i:number)=>axes[i]===undefined?0:at(axes,i)+2;
  let hop=0;
  for(let a=0;a<2;a++)for(let z=0;z<2;z++)hop|=((h>>>(a+2*z))&1)<<(2*a+z);
  const hw=h===0?0:b.gate(hop,wire(at(other,0)),wire(at(other,1)));
  let op=0;
  for(let hv=0;hv<2;hv++)for(let side=0;side<2;side++){
   const row=at(rows,side);const bit=row===0?0:row===15?1:row===h?hv:1-hv;
   op|=bit<<(2*hv+side);
  }
  return {kind:'circuit' as const,net:{gates:b.gates,output:b.gate(op,hw,wire(axis))}};
 }
 throw new Error('cubic zero-set not decomposable');
}
function allTwoGate(n:number):Set<number> {
 const N=2**n,base=inputs(n),one=new Set(base),two=new Set(base);
 for(const a of base)for(const b of base)for(let op=0;op<16;op++)one.add(evalGate(op,a,b,N));
 // This independent enumeration retains every distinct first gate, not BFS sets.
 for(const f of one){const avail=[...base,f];for(const a of avail)for(const b of avail)for(let op=0;op<16;op++)two.add(evalGate(op,a,b,N));}
 return two;
}
function uniformAudit(nets3:readonly Net[]) {
 for(let f=0;f<256;f++) {
  const fits=at(nets3,f).gates.length<=2;
  assert(fits===(polynomial(f,cubicTerms)===0)&&fits===cofactorDecomposable(f),'cubic/cofactor/synthesis mismatch');
 }
 const n=4,N=16,Q=65536,members=allTwoGate(n);assert(members.size===526,'four-input two-gate class count');
 let circuits=0,certificates=0,checkedAgainstCandidates=0;const sizes:Record<string,number>={},reasons:Record<string,number>={};
 const examples: {truthTable:number;mask:number;size:number;reason:string}[]=[];
 for(let f=0;f<Q;f++){
  const result=uniformTwoGate(n,f);
  assert((result.kind==='circuit')===members.has(f),'uniform classification mismatch');
  if(result.kind==='circuit'){verifyNet(n,result.net,f);circuits++;}
  else {
   const t=weight(result.mask);assert(t<=7&&t>0,'seven-point bound');
   for(const g of members){checkedAgainstCandidates++;assert(((f^g)&result.mask)!==0,'unsound uniform certificate');}
   certificates++;sizes[t]=(sizes[t]??0)+1;reasons[result.reason]=(reasons[result.reason]??0)+1;
   if(!examples.some(x=>x.size===t))examples.push({truthTable:f,mask:result.mask,size:t,reason:result.reason});
  }
 }
 // First four variables are data, last two select one of them; naive separate witnesses can be disjoint.
 const val=(x:number)=>(x>>>((x>>>4)&3))&1;
 const axes=[0,1,2,3],pairs: [number,number][]=axes.map(i=>{
  const x=Array.from({length:64},(_,j)=>j).find(j=>(j&(1<<i))===0&&val(j)!==val(j|(1<<i)));
  assert(x!==undefined,'multiplexer essential direction');return [x,x|(1<<i)];
 });
 const pts=sevenPointCertificate(6,val,axes,pairs), colors=new Set<number>();
 for(const x of pts)for(const y of pts)if(weight(x^y)===1&&val(x)!==val(y))colors.add(Math.log2(x^y));
 assert(colors.size>=4&&pts.length<=7,'six-variable multiplexer certificate');
 return {n,N,allFunctions:Q,circuits,certificates,checkedAgainstCandidates,certificateSizes:sizes,reasons,examples,cubicTerms,
  targetedMultiplexer:{n:6,points:pts,labels:pts.map(val),sensitiveDirections:[...colors].sort((a,b)=>a-b)}};
}
const runs=[];
for(let n=1;n<=3;n++){
 const r=synth(n),analysis=certificateAnalysis(n,r.nets);runs.push({...r,analysis});
}
const three=at(runs,2);
console.log(JSON.stringify({status:'pass',model:'B2 arbitrary binary gates; constants and uncomplemented inputs free; output arbitrary wire',runs,constructive:constructiveAudit(),uniformTwoGate:uniformAudit(three.nets)},null,2));
