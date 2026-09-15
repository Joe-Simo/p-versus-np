/** Exact audits of rejection sampling and conditional B2 gate-edit graphs. */
export {};
type Gate = readonly [number, number, number]; // type, first predecessor, second predecessor
interface Desc { readonly gates: readonly Gate[]; readonly out: number; }
function check(ok: boolean, why: string): asserts ok { if (!ok) throw new Error(why); }
function at<T>(a: readonly T[], i: number): T { const v=a[i]; check(v!==undefined,`missing index ${i}`); return v; }
function pop(x:number):number {let c=0;while(x){x&=x-1;c++;}return c;}
function gcd(a:bigint,b:bigint):bigint{while(b){[a,b]=[b,a%b];}return a;}
function frac(a:bigint,b:bigint):string{check(b>0n,'positive denominator');const g=gcd(a,b);return `${a/g}/${b/g}`;}
function fact(n:number):bigint{let r=1n;for(let j=2;j<=n;j++)r*=BigInt(j);return r;}
function baseSignals(n:number):number[]{const N=2**n, mask=2**N-1;return[0,mask,...Array.from({length:n},(_,i)=>{let x=0;for(let a=0;a<N;a++)x|=((a>>>i)&1)<<a;return x>>>0;})];}
function gateValue(g:number,a:number,b:number,mask:number):number{
  return ((((g&1)?~a&~b:0)|((g&2)?a&~b:0)|((g&4)?~a&b:0)|((g&8)?a&b:0))&mask)>>>0;
}
function truth(n:number,d:Desc):number{const v=baseSignals(n),mask=2**(2**n)-1;for(const [g,a,b] of d.gates){check(a<v.length&&b<v.length,'DAG');v.push(gateValue(g,at(v,a),at(v,b),mask));}return at(v,d.out);}
function D(n:number,s:number):bigint{let d=BigInt(n+s+2);for(let j=0;j<s;j++)d*=16n*BigInt(n+j+2)**2n;return d;}
function descriptorKey(d:Desc):string{return [...d.gates.map(g=>g.join(',')),String(d.out)].join('|');}
function parityTable(n:number):number{let f=0;for(let x=0;x<2**n;x++)f|=(pop(x)&1)<<x;return f>>>0;}

// All n<=3/s<=2 descriptions, including output choices, for independent mass accounting.
function fullEnumeration(n:number,s:number){
 const v=baseSignals(n),mask=2**(2**n)-1, gates:Gate[]=[],weights=Array<bigint>(mask+1).fill(0n),parity:Desc[]=[];let lists=0n,total=0n;
 function visit(j:number):void{
  if(j===s){lists++;for(let out=0;out<v.length;out++){const f=at(v,out);weights[f]=at(weights,f)+1n;total++;if(f===parityTable(n))parity.push({gates:[...gates],out});}return;}
  const width=v.length;for(let a=0;a<width;a++)for(let b=0;b<width;b++)for(let g=0;g<16;g++){
   gates.push([g,a,b]);v.push(gateValue(g,at(v,a),at(v,b),mask));visit(j+1);v.pop();gates.pop();
  }
 }visit(0);check(total===D(n,s),'description count');return{weights,parity,lists,total};
}
// Conditional enumeration: exact prefixes plus all consistent binary root functions.
function conditional(n:number,s:number,f:number):Desc[]{
 check(n>=1&&n<=4&&s>=1,'finite conditional dimensions');const v=baseSignals(n),mask=2**(2**n)-1,gates:Gate[]=[],all:Desc[]=[];
 function visit(j:number):void{
  if(j<s-1){const width=v.length;for(let a=0;a<width;a++)for(let b=0;b<width;b++)for(let g=0;g<16;g++){
   gates.push([g,a,b]);v.push(gateValue(g,at(v,a),at(v,b),mask));visit(j+1);v.pop();gates.pop();
  }return;}
  const width=v.length,earlier:number[]=[];for(let k=0;k<width;k++)if(v[k]===f)earlier.push(k);
  for(let a=0;a<width;a++)for(let b=0;b<width;b++){
   const aa=at(v,a),bb=at(v,b),cells=[~aa&~bb&mask,aa&~bb&mask,~aa&bb&mask,aa&bb&mask];let forced=0,free=0,valid=true;
   for(let k=0;k<4;k++){const cell=at(cells,k),ones=cell&f;if(ones!==0&&ones!==cell){valid=false;break;}if(cell===0)free|=1<<k;else if(ones!==0)forced|=1<<k;}
   if(valid)for(let g=0;g<16;g++)if((g&~free)===forced)all.push({gates:[...gates,[g,a,b]],out:width});
   for(const out of earlier)for(let g=0;g<16;g++)all.push({gates:[...gates,[g,a,b]],out});
  }
 }visit(0);for(const d of all)check(truth(n,d)===f,'conditional description fails replay');
 const unique=new Set(all.map(descriptorKey));check(unique.size===all.length,'duplicate conditional description');return all;
}
class UnionFind{readonly p:number[];readonly sz:number[];constructor(n:number){this.p=Array.from({length:n},(_,i)=>i);this.sz=Array<number>(n).fill(1);}root(a:number):number{let x=a;while(at(this.p,x)!==x)x=at(this.p,x);while(a!==x){const b=at(this.p,a);this.p[a]=x;a=b;}return x;}join(a:number,b:number):void{a=this.root(a);b=this.root(b);if(a===b)return;if(at(this.sz,a)<at(this.sz,b))[a,b]=[b,a];this.p[b]=a;this.sz[a]=at(this.sz,a)+at(this.sz,b);}}
function components(ds:readonly Desc[],blocks:number){
 const s=at(ds,0).gates.length, slots=s+1, uf=new UnionFind(ds.length);let signatures=0;
 const fields=ds.map(d=>[...d.gates.map(g=>g.join(',')),String(d.out)]);
 const masks:number[]=[];for(let x=1;x<2**slots;x++)if(pop(x)<=blocks)masks.push(x);
 for(const removed of masks){const first=new Map<string,number>();for(let i=0;i<ds.length;i++){
  const key=at(fields,i).filter((_,j)=>!(removed&(1<<j))).join('|');const before=first.get(key);
  if(before===undefined)first.set(key,i);else uf.join(i,before);
 }signatures+=first.size;}
 const bins=new Map<number,number>();const labels:number[]=[],ids=new Map<number,number>();
 for(let i=0;i<ds.length;i++){const r=uf.root(i);if(!ids.has(r))ids.set(r,ids.size);labels.push(ids.get(r)??-1);if(r===i)bins.set(at(uf.sz,r),(bins.get(at(uf.sz,r))??0)+1);}
 return{count:ids.size,histogram:[...bins].sort((a,b)=>a[0]-b[0]),signatures,labels};
}
function normalized(d:Desc):string{return d.gates.map(([g,a,b])=>`${g},${Math.min(a,b)},${Math.max(a,b)}`).join('|')+`|${d.out}`;}
// Exhaust every branch of the direct uniform parity generator, not a random sample.
function allMergeHistories(n:number):Desc[]{
 check(n>=2&&n<=5,'bounded generator audit');const out:Desc[]=[];
 function visit(active:readonly number[],gates:readonly Gate[],sign:number):void{
  if(active.length===1){check(sign===0,'final parity offset');out.push({gates,out:at(active,0)});return;}
  for(let a=0;a<active.length;a++)for(let b=0;b<active.length;b++)if(a!==b){
   const remaining=active.filter((_,j)=>j!==a&&j!==b);remaining.push(n+2+gates.length);
   const choices=active.length===2?[sign]:[0,1];
   for(const offset of choices)visit(remaining,[...gates,[offset?9:6,at(active,a),at(active,b)]],sign^offset);
  }
 }visit(Array.from({length:n},(_,i)=>i+2),[],0);return out;
}
function uniformGeneratorChecks(){
 const rows=[];
 for(let n=2;n<=5;n++){
  const ds=allMergeHistories(n),keys=ds.map(descriptorKey);check(new Set(keys).size===ds.length,'ambiguous history encoding');
  for(const d of ds)check(truth(n,d)===parityTable(n),'direct generator bad output');
  const count=fact(n)*fact(n-1)*(1n<<BigInt(n-2));check(BigInt(ds.length)===count,'history count');
  if(n<=4)check(JSON.stringify(keys.sort())===JSON.stringify(conditional(n,n-1,parityTable(n)).map(descriptorKey).sort()),'direct vs general conditional fiber');
  // Every ordered-pair/sign choice has the same denominator independent of the path.
  let denominator=1n;for(let r=2;r<=n;r++)denominator*=BigInt(r*(r-1))*(r>2?2n:1n);
  check(denominator===count,'not equiprobable');
  rows.push({n,s:n-1,histories:ds.length,probabilityOfEachDescription:`1/${denominator}`,uniformity:'equal independent branch denominators and bijective histories',comparison:n<=4?'complete general conditional enumeration':'structural generation plus full replay; no all-gate search'});
 }
 return rows;
}
function parityModelChecks(full:ReturnType<typeof fullEnumeration>){
 const rows=[];let replays=0;
 for(const [n,s] of [[2,1],[3,2],[4,3],[3,3]] as const){
  const ds=conditional(n,s,parityTable(n)),one=components(ds,1),two=components(ds,2);replays+=ds.length;
  if(n===3&&s===2){const a=ds.map(descriptorKey).sort(),b=full.parity.map(descriptorKey).sort();check(JSON.stringify(a)===JSON.stringify(b),'root enumeration vs all-gate enumeration');}
  if(s===n-1){const predicted=fact(n)*fact(n-1)*(1n<<BigInt(n-2)),count=fact(n)*fact(n-1)/2n;
   check(BigInt(ds.length)===predicted,'minimal parity formula count');check(BigInt(one.count)===count,'minimal parity component count');check(one.histogram.length===1&&at(one.histogram,0)[0]===2**s,'orientation-only components');
   const signatureMap=new Map<string,number>();for(let i=0;i<ds.length;i++){const key=normalized(at(ds,i)),c=at(one.labels,i),prior=signatureMap.get(key);if(prior!==undefined)check(prior===c,'split orientation orbit');else signatureMap.set(key,c);}check(signatureMap.size===one.count,'topology/type invariant fails');
  }
  rows.push({n,s,target:parityTable(n),feasibleDescriptions:ds.length,totalDescriptions:String(D(n,s)),uniformAcceptance:frac(BigInt(ds.length),D(n,s)),expectedBlindAttempts:frac(D(n,s),BigInt(ds.length)),oneBlock:{count:one.count,histogram:one.histogram},twoBlock:{count:two.count,histogram:two.histogram},examples:ds.slice(0,Math.min(4,ds.length))});
 }
 return{replays,rows};
}
function rejectionChecks(full:ReturnType<typeof fullEnumeration>){
 const N=8,s=2,t=Math.floor((s+3)/2);let labelingCases=0,feasibleAtT=0,zeroCases=0,geometricChecks=0;const partitions=[];
 for(let sample=0;sample<256;sample++){
  const pts=Array.from({length:N},(_,i)=>i).filter(i=>!!(sample&(1<<i))),masses=Array<bigint>(2**pts.length).fill(0n);
  for(let f=0;f<256;f++){let pattern=0;for(let j=0;j<pts.length;j++)pattern|=((f>>>at(pts,j))&1)<<j;masses[pattern]=at(masses,pattern)+at(full.weights,f);}
  check(masses.reduce((a,b)=>a+b,0n)===full.total,'partition loses multiplicities');
  for(const mass of masses){labelingCases++;if(mass===0n){zeroCases++;continue;}if(pts.length<=t)feasibleAtT++;
   for(const B of [0,1,2,4,8]){
    const den=full.total**BigInt(B), miss=(full.total-mass)**BigInt(B);check((den-miss)*full.total<=BigInt(B)*mass*den,'union bound for finite rejection');geometricChecks++;
   }
  }
  if(pts.length<=t)check(masses.every(x=>x>0n),'interpolation must make every labeling feasible');
  if(pts.length===t){const max=full.total/BigInt(2**(t-1));check(masses.filter(x=>x<=max).length>=2**(t-1),'half-pattern rarity');partitions.push({sample,points:pts,masses:masses.map(String),leastAcceptance:frac(masses.reduce((a,b)=>a<b?a:b),full.total)});}
 }
 // Exact minimum-survivor point policy, re-evaluating whole multiplicity map every step.
 const traces=[];let nonemptyStages=0,forcedShrinkStages=0;
 for(let f=0;f<256;f++){
  let seen=0,active=Array.from({length:256},(_,g)=>g).filter(g=>at(full.weights,g)>0n);const stages=[];
  for(let r=0;r<=N;r++){
   const mass=active.reduce((a,g)=>a+at(full.weights,g),0n);if(mass===0n){stages.push({r,sample:seen,mass:'0',acceptance:'0/1',expected:'infinite/empty'});break;}
   nonemptyStages++;let best=-1,remaining=mass;
   for(let x=0;x<N;x++)if(!(seen&(1<<x))){const next=active.reduce((a,g)=>a+((((g^f)>>>x)&1)?0n:at(full.weights,g)),0n);if(best<0||next<remaining){remaining=next;best=x;}}
   const shrink=16n*remaining<=15n*mass;if(shrink)forcedShrinkStages++;
   stages.push({r,sample:seen,mass:String(mass),acceptance:frac(mass,full.total),expected:frac(full.total,mass),next:best,shrink});
   if(best<0||remaining===mass)break;seen|=1<<best;active=active.filter(g=>(((g^f)>>>best)&1)===0);
  }
  traces.push({target:f,member:at(full.weights,f)>0n,stages});
 }
 const symbolic=[];for(const [n,b] of [[128,8],[256,16],[512,32],[1024,64]] as const){
  const S=1n<<BigInt(b), low=S/(10n*BigInt(n)),r=(low+3n)/2n;
  if(low<8n)continue;check(1n<<BigInt(n)>r,'enough sample points');
  // (16/15)^11 > 2, so every 11 shrink rounds cost at least a factor two.
  check(16n**11n>2n*15n**11n,'rejection binary exponent bound');
  symbolic.push({n,b,S:String(S),s:String(low),nonemptyRounds:String(r),expectedAtLeastPowerOfTwo:String(r/11n),meaning:'E[attempts] >= (16/15)^r > 2^floor(r/11); not executed on a large hard table'});
 }
 return{labelingCases,feasibleAtT,zeroCases,geometricChecks,nonemptyStages,forcedShrinkStages,partitions,symbolic,traces};
}
const full=fullEnumeration(3,2);
check(full.weights.filter(w=>w>0n).length===152,'preserved B2 function count');
const rejection=rejectionChecks(full),parity=parityModelChecks(full);
console.log(JSON.stringify({status:'pass',model:'B2; raw ordered gate triples; constants and uncomplemented inputs free; output field counted',uniformParityGenerator:uniformGeneratorChecks(),raw:{n:3,s:2,gateLists:String(full.lists),descriptions:String(full.total),functionCount:152,weights:full.weights.map(String)},rejection,parity},null,2));
