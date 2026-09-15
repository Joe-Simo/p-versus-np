/** Exact fixed-three-gate B2 certificates; finite audits, not P versus NP. */
export {};
type Tree = {readonly kind:'input'; readonly index:number} |
 {readonly kind:'gate'; readonly op:number; readonly a:Tree; readonly b:Tree};
type Gate = {readonly op:number; readonly a:number; readonly b:number};
function check(p:boolean,m:string):asserts p {if(!p)throw new Error(m);}
function at<T>(a:readonly T[],i:number):T {const x=a[i];check(x!==undefined,`index ${i}`);return x;}
function weight(x:number):number {let r=0;for(;x;x&=x-1)r++;return r;}
function baseTables(n:number):number[] {
 check(n>=1&&n<=4,'truth-mask domain is n=1..4');const N=2**n;
 return [0,2**N-1,...Array.from({length:n},(_,i)=>{let v=0;for(let x=0;x<N;x++)v|=((x>>>i)&1)<<x;return v;})];
}
function allOps(a:number,b:number,mask:number):number[] {
 const cells=[(~a&~b)&mask,(~a&b)&mask,(a&~b)&mask,a&b],out=Array<number>(16).fill(0);
 for(let op=1;op<16;op++){const l=op&-op;out[op]=at(out,op^l)|at(cells,Math.log2(l));}return out;
}
function directOp(op:number,a:number,b:number,N:number):number {
 let f=0;for(let x=0;x<N;x++)f|=((op>>>(2*((a>>>x)&1)+((b>>>x)&1)))&1)<<x;return f;
}
function formula(n:number,max:number) {
 const N=2**n,Q=2**N,base=baseTables(n),cost=new Uint8Array(Q).fill(255);
 const nets:(Tree|undefined)[]=Array<Tree|undefined>(Q).fill(undefined),layers:number[][]=[[]];
 base.forEach((f,i)=>{cost[f]=0;nets[f]={kind:'input',index:i};at(layers,0).push(f);});const rows=[];
 for(let s=1;s<=max;s++){
  const add:number[]=[];let pairs=0;
  for(let aSize=0;aSize<s;aSize++)for(const a of at(layers,aSize))for(const b of at(layers,s-1-aSize)){
   pairs++;const out=allOps(a,b,Q-1);
   for(let op=0;op<16;op++){
    const f=at(out,op);if(cost[f]!==255)continue;
    const an=nets[a],bn=nets[b];check(an!==undefined&&bn!==undefined,'missing subtree');
    cost[f]=s;nets[f]={kind:'gate',op,a:an,b:bn};add.push(f);
   }
  }
  layers.push(add);rows.push({gates:s,pairs,gateEvaluations:16*pairs,newFunctions:add.length,cumulative:cost.filter(x=>x<=s).length});
 }
 return {n,cost,nets,rows,members:Array.from({length:Q},(_,x)=>x).filter(x=>(cost[x]??255)<=max)};
}
function treeSize(t:Tree):number {return t.kind==='input'?0:1+treeSize(t.a)+treeSize(t.b);}
function treeValue(t:Tree,x:number):number {
 if(t.kind==='input')return t.index<2?t.index:(x>>>(t.index-2))&1;
 return(t.op>>>(2*treeValue(t.a,x)+treeValue(t.b,x)))&1;
}
function treeTruth(t:Tree,n:number):number {let f=0;for(let x=0;x<2**n;x++)f|=treeValue(t,x)<<x;return f;}
function rawThree(n:number) {
 const N=2**n,Q=2**N,base=baseTables(n),members=new Uint8Array(Q);let descriptions=0;
 // No equivalence pruning: ordered predecessors, all sixteen opcodes, output last.
 for(let a=0;a<base.length;a++)for(let b=0;b<base.length;b++)for(const h of allOps(at(base,a),at(base,b),Q-1)){
  const first=[...base,h];
  for(let c=0;c<first.length;c++)for(let d=0;d<first.length;d++)for(const j of allOps(at(first,c),at(first,d),Q-1)){
   const signals=[...first,j];
   for(let e=0;e<signals.length;e++)for(let f=0;f<signals.length;f++){
    const values=allOps(at(signals,e),at(signals,f),Q-1);descriptions+=16;
    for(const v of values)members[v]=1;
   }
  }
 }
 const expected=16n**3n*BigInt((n+2)*(n+3)*(n+4))**2n;
 check(BigInt(descriptions)===expected,'raw description count');
 return {descriptions:expected.toString(),members:Array.from({length:Q},(_,x)=>x).filter(x=>members[x]===1)};
}
function rootProfiles(n:number) {
 const N=2**n,Q=2**N,B=baseTables(n),one=new Set<number>();
 for(const a of B)for(const b of B)for(const f of allOps(a,b,Q-1))one.add(f);
 const pairs=new Set<number>();let prefixes=0;
 for(const h of one){const first=[...B,h];
  for(const a of first)for(const b of first)for(const j of allOps(a,b,Q-1)){
   prefixes++;const signals=[...first,j];
   for(const x of signals)for(const y of signals)pairs.add(Math.min(x,y)*Q+Math.max(x,y));
  }
 }
 const profiles=new Map<string,number[]>();
 for(const p of pairs){const a=Math.floor(p/Q),b=p%Q;
  const groups=[(~a&~b)&(Q-1),(~a&b)&(Q-1),(a&~b)&(Q-1),a&b].filter(x=>x!==0).sort((x,y)=>x-y);
  profiles.set(groups.join(','),groups);
 }
 const allowed=new Uint8Array(Q);
 for(const groups of profiles.values())for(let selection=0;selection<2**groups.length;selection++){
  let table=0;groups.forEach((g,i)=>{if((selection&(1<<i))!==0)table|=g;});allowed[table]=1;
 }
 return {prefixes,jointPairs:pairs.size,profiles:profiles.size,members:Array.from({length:Q},(_,x)=>x).filter(x=>allowed[x]===1)};
}
type Prime={readonly mask:number;readonly labels:number};
function pointCertificates(n:number,members:readonly number[]) {
 const N=2**n,Q=2**N,pow3=Array.from({length:N},(_,i)=>3**i),code=new Uint32Array(Q);
 for(let mask=1;mask<Q;mask++){const bit=mask&-mask;code[mask]=(code[mask^bit]??0)+at(pow3,Math.log2(bit));}
 const consistent=new Uint8Array(3**N);
 for(let mask=0;mask<Q;mask++)for(const f of members)consistent[(code[mask]??0)+(code[f&mask]??0)]=1;
 const minimum=new Uint8Array(Q).fill(255),certificate=new Uint16Array(Q),weights=Uint8Array.from({length:Q},(_,m)=>weight(m));
 let inconsistent=0,primeCount=0,completionVisits=0,firstPrime11:Prime|undefined;
 const primeHistogram:Record<string,number>={};
 for(let mask=0;mask<Q;mask++)for(let lab=mask;;lab=(lab-1)&mask){
  const p=(code[mask]??0)+(code[lab]??0);
  if(consistent[p]===0){
   inconsistent++;let prime=true;
   for(let rest=mask;rest;rest&=rest-1){const bit=rest&-rest;
    if(consistent[p-at(pow3,Math.log2(bit))*((lab&bit)!==0?2:1)]===0){prime=false;break;}
   }
   if(prime){
    primeCount++;const size=weights[mask]??0;primeHistogram[size]=(primeHistogram[size]??0)+1;
    if(size===11&&firstPrime11===undefined)firstPrime11={mask,labels:lab};
    const free=(Q-1)^mask;
    for(let extension=free;;extension=(extension-1)&free){
     completionVisits++;const f=lab|extension;
     if((minimum[f]??255)>size){minimum[f]=size;certificate[f]=mask;}
     if(extension===0)break;
    }
   }
  }
  if(lab===0)break;
 }
 const histogram:Record<string,number>={};let max=0,firstHardest=-1;
 const ms=new Set(members),hardest:number[]=[];
 for(let f=0;f<Q;f++){
  const size=minimum[f]??255;check((size===255)===ms.has(f),'all partial patterns vs class');
  if(size===255)continue;
  histogram[size]=(histogram[size]??0)+1;
  if(size>max){max=size;firstHardest=f;}
  const mask=certificate[f]??0;check(weight(mask)===size,'certificate size');
  check(members.every(g=>(g&mask)!==(f&mask)),'certificate does not exclude class');
 }
 for(let f=0;f<Q;f++)if(minimum[f]===max)hardest.push(f);
 return {minimum,certificate,firstPrime11,summary:{n,classCount:members.length,ternaryPatterns:3**N,inconsistent,primeCount,primeHistogram,completionVisits,minimumHistogram:histogram,maximum:max,firstHardest,hardest}};
}
function greedyAudit(prime:Prime,members:readonly number[],minimum:Uint8Array,cert:Uint16Array,nets:readonly (Tree|undefined)[]) {
 const f=prime.labels,order=[...Array.from({length:16},(_,i)=>i).filter(i=>(prime.mask&(1<<i))===0),...Array.from({length:16},(_,i)=>i).filter(i=>(prime.mask&(1<<i))!==0)];
 let mask=65535;const deletions=[];
 for(const i of order){const candidate=mask&~(1<<i),fitter=members.find(g=>(g&candidate)===(f&candidate));
  if(fitter===undefined)mask=candidate;
  deletions.push({removedPointCandidate:i,deleted:fitter===undefined,remainingMask:mask,fittingTable:fitter??null});
 }
 check(mask===prime.mask&&weight(mask)===11,'greedy counterexample');
 const fits=[];
 for(let i=0;i<16;i++)if((mask&(1<<i))!==0){const reduced=mask&~(1<<i),g=members.find(x=>(x&reduced)===(f&reduced));
  check(g!==undefined,'not inclusion-minimal');const tree=nets[g];check(tree!==undefined&&treeSize(tree)<=3&&treeTruth(tree,4)===g,'bad deletion fitter');fits.push({deletedPoint:i,table:g,tree});
 }
 const alternate=cert[f]??0;check(weight(alternate)===(minimum[f]??255)&&members.every(g=>(g&alternate)!==(f&alternate)),'alternate certificate');
 return {target:f,prime,greedySize:weight(mask),minimumSize:minimum[f],minimumMask:alternate,deletions,oneDeletionFittingCircuits:fits};
}
function localCoreCertificate(core:number,members:readonly number[]):number {
 // Runtime search, no table of preassigned answers; find a hitting set of differences.
 const differences=members.map(g=>g^core);check(differences.every(x=>x!==0),'cannot refute member');
 let best=65535,visits=0;
 function search(mask:number,remaining:readonly number[],budget:number):boolean {
  visits++;if(remaining.length===0){best=mask;return true;}if(budget===0)return false;
  let branch=at(remaining,0);for(const d of remaining)if(weight(d)<weight(branch))branch=d;
  const points=Array.from({length:16},(_,i)=>i).filter(i=>(branch&(1<<i))!==0);
  points.sort((a,b)=>remaining.filter(d=>(d&(1<<b))!==0).length-remaining.filter(d=>(d&(1<<a))!==0).length||a-b);
  for(const i of points)if(search(mask|(1<<i),remaining.filter(d=>(d&(1<<i))===0),budget-1))return true;
  return false;
 }
 check(search(0,differences,9),'finite nine-point upper bound failed');check(visits>0,'empty search');return best;
}
function uniformThree(n:number,table:Uint8Array,f4:ReturnType<typeof formula>) {
 check(n>=1&&n<=12&&table.length===2**n,'finite implementation supports n=1..12');
 const essential:{direction:number;point:number}[]=[];
 for(let i=0;i<n;i++){
  let point=-1;for(let x=0;x<table.length;x++)if((x&(1<<i))===0&&table[x]!==table[x|(1<<i)]){point=x;break;}
  if(point>=0)essential.push({direction:i,point});if(essential.length===5)break;
 }
 if(essential.length===5){
  for(let x=0;x<table.length;x++){
   const sensitive=Array.from({length:n},(_,i)=>i).filter(i=>table[x]!==table[x^(1<<i)]);
   if(sensitive.length<2)continue;
   const i=at(sensitive,0),j=at(sensitive,1),points=new Set([x,x^(1<<i),x^(1<<j)]);
   for(const edge of essential.filter(e=>e.direction!==i&&e.direction!==j).slice(0,3)){points.add(edge.point);points.add(edge.point^(1<<edge.direction));}
   check(points.size<=9,'support certificate bound');return {kind:'certificate' as const,points:[...points],method:'five-sensitive-directions'};
  }
  throw new Error('sensitivity-one lemma contradicted');
 }
 let core=0;
 for(let x=0;x<16;x++){let y=0;essential.forEach((e,j)=>{if((x&(1<<j))!==0)y|=1<<e.direction;});core|=(table[y]??0)<<x;}
 const tree=f4.nets[core];
 if(tree!==undefined){
  const lift=(t:Tree):Tree=>t.kind==='gate'?{kind:'gate',op:t.op,a:lift(t.a),b:lift(t.b)}:t.index<2?t:essential[t.index-2]===undefined?{kind:'input',index:0}:{kind:'input',index:(essential[t.index-2]?.direction??0)+2};
  const out=lift(tree);check(treeSize(out)<=3,'lifted circuit too large');
  for(let x=0;x<table.length;x++)check(treeValue(out,x)===table[x],'wrong synthesis');return {kind:'circuit' as const,tree:out};
 }
 const mask=localCoreCertificate(core,f4.members),points=new Set<number>();
 for(let x=0;x<16;x++)if((mask&(1<<x))!==0){let y=0;essential.forEach((e,j)=>{if((x&(1<<j))!==0)y|=1<<e.direction;});points.add(y);}
 return {kind:'certificate' as const,points:[...points],method:'four-variable-core'};
}
function verifyUniformCertificate(n:number,table:Uint8Array,points:readonly number[]):void {
 check(points.length<=9&&new Set(points).size===points.length,'malformed uniform certificate');
 const T=points.length,Q=2**T,base=[0,Q-1,...Array.from({length:n},(_,i)=>points.reduce((a,x,j)=>a|(((x>>>i)&1)<<j),0))];
 const layers=[new Set(base)];let reached=new Set(base);
 for(let s=1;s<=3;s++){
  const next=new Set<number>();for(let a=0;a<s;a++)for(const x of at(layers,a))for(const y of at(layers,s-1-a))for(const f of allOps(x,y,Q-1))if(!reached.has(f))next.add(f);
  layers.push(next);reached=new Set([...reached,...next]);
 }
 const lab=points.reduce((a,x,j)=>a|((table[x]??0)<<j),0);check(!reached.has(lab),'uniform certificate fits a three-gate formula');
}
function auditDiamondIdentity():number {
 let cases=0;
 for(let inner=0;inner<16;inner++)for(let outer=0;outer<16;outer++)for(const orientation of [0,1]){
  let q=0;for(let h=0;h<2;h++)for(let u=0;u<2;u++){
   const g=(inner>>>(2*h+u))&1,v=(outer>>>(orientation===0?2*h+g:2*g+h))&1;q|=v<<(2*h+u);
  }
  for(let h=0;h<2;h++)for(let u=0;u<2;u++){
   const g=(inner>>>(2*h+u))&1;check(((q>>>(2*h+u))&1)===((outer>>>(orientation===0?2*h+g:2*g+h))&1),'diamond elimination identity');cases++;
  }
 }
 return cases;
}
function auditSharedOutputs() {
 const n=4,gates:Gate[]=[{op:8,a:2,b:3},{op:14,a:6,b:4},{op:14,a:6,b:5}],signals=baseTables(n);
 for(const g of gates)signals.push(directOp(g.op,at(signals,g.a),at(signals,g.b),16));
 const first=at(signals,7),second=at(signals,8),two=formula(n,2);
 check(two.cost[first]===2&&two.cost[second]===2&&first!==second,'joint-output example');
 return {outputs:[first,second],individualMinimumSizes:[2,2],jointMinimumSize:3,gates,proof:'Two distinct non-primary outputs would have to be gates 1 and 2; neither can be gate 1 because each has three essential inputs.'};
}
// Primitive audit uses pointwise gate evaluation, not packed cell decomposition.
for(let a=0;a<16;a++)for(let b=0;b<16;b++)allOps(a,b,15).forEach((f,op)=>check(f===directOp(op,a,b,4),'opcode mismatch'));
const runs=[],full=[];
let f4:ReturnType<typeof formula>|undefined,cert4:ReturnType<typeof pointCertificates>|undefined;
for(const n of [3,4]){
 const f=formula(n,3);for(const x of f.members){const t=f.nets[x];check(t!==undefined&&treeSize(t)===(f.cost[x]??255)&&treeTruth(t,n)===x,'formula witness');}
 const raw=rawThree(n),profiles=rootProfiles(n);
 check(JSON.stringify(raw.members)===JSON.stringify(f.members),'DAG/formula mismatch');
 check(JSON.stringify(profiles.members)===JSON.stringify(f.members),'joint-root profile mismatch');
 const cert=pointCertificates(n,f.members);runs.push({n,formulaLayers:f.rows,rawDescriptions:raw.descriptions,rootPrefixes:profiles.prefixes,rootJointPairs:profiles.jointPairs,rootProfiles:profiles.profiles,certificateSummary:cert.summary});
 full.push({n,members:f.members,nets:f.nets.map(t=>t??null),minimumPoints:Array.from(cert.minimum),pointMasks:Array.from(cert.certificate)});
 if(n===4){f4=f;cert4=cert;}
}
check(f4!==undefined&&cert4!==undefined&&cert4.firstPrime11!==undefined,'missing finite objects');
check(cert4.summary.maximum===9,'maximum point bound');
const extreme=new Set<number>();for(let x=0;x<16;x++){const v=(1<<x)|(1<<(15^x));extreme.add(v);extreme.add(65535^v);}
check(cert4.summary.hardest.length===16&&cert4.summary.hardest.every(f=>extreme.has(f)),'hardest-family characterization');
const greedy=greedyAudit(cert4.firstPrime11,f4.members,cert4.minimum,cert4.certificate,f4.nets);
const targeted=[];
for(const n of [1,2,3,4,5,6,8])for(const type of ['zero','literal','parity','all-equal','shared']){
 const table=Uint8Array.from({length:2**n},(_,x)=>type==='zero'?0:type==='literal'?x&1:type==='parity'?weight(x)&1:type==='all-equal'?(x===0||x===2**n-1?1:0):((((x&1)&((x>>>1)&1))|((x>>>2)&1))^(((x&1)&((x>>>1)&1))|((x>>>3)&1))));
 const out=uniformThree(n,table,f4);if(out.kind==='certificate')verifyUniformCertificate(n,table,out.points);
 targeted.push({n,type,...out});
}
const summary={status:'pass',model:'B2; free constants/uncomplemented input wires; three gates; tables are explicit',diamondIdentityCases:auditDiamondIdentity(),runs,greedy,sharedOutput:auditSharedOutputs(),targeted};
console.log(JSON.stringify({summary,finite:full}));
