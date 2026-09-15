/** Positive joint-row process, exact frontier unranking, and affine replacement.
 * Finite masks are restricted to q<=8. Asymptotic proofs use bit strings.
 * Bigint counts preserve every raw type assignment including dead slots.
 */
export {};
type Pair = readonly [number, number];
type Topology = readonly Pair[];
function check(ok: boolean, why: string): asserts ok { if (!ok) throw new Error(why); }
function at<T>(xs: readonly T[], i: number): T { const x = xs[i]; check(x !== undefined, `index ${i}`); return x; }
function bit(x: number, j: number): number { return (x >>> j) & 1; }
function pop(x: number): number { let k = 0; while (x) { x &= x - 1; k++; } return k; }
function mask(q: number): number { check(q >= 0 && q <= 8, "finite q bound"); return (1 << q) - 1; }
function gate(g: number, a: number, b: number, q: number): number {
  let v = 0; for (let i = 0; i < q; i++) v |= bit(g, bit(a, i) + 2 * bit(b, i)) << i; return v;
}
function shape(v: number, q: number): number { return (v >>> 1) ^ (bit(v, 0) ? mask(q - 1) : 0); }
function patterns(a: number, b: number, q: number): number[] {
  const p: number[] = []; for (let i = 0; i < q; i++) { const x = bit(a, i) + 2 * bit(b, i); if (!p.includes(x)) p.push(x); } return p;
}
function encode(g: number, a: number, b: number, q: number): readonly [number, number] {
  const p = patterns(a, b, q), eta = bit(g, at(p, 0)); let token = 0, pos = 0;
  for (let i = 1; i < p.length; i++) token |= (bit(g, at(p, i)) ^ eta) << pos++;
  for (let x = 0; x < 4; x++) if (!p.includes(x)) token |= bit(g, x) << pos++;
  check(pos === 3, "three controls"); return [eta, token];
}
function decode(eta: number, token: number, a: number, b: number, q: number): number {
  const p = patterns(a, b, q); let g = eta << at(p, 0), pos = 0;
  for (let i = 1; i < p.length; i++) g |= (eta ^ bit(token, pos++)) << at(p, i);
  for (let x = 0; x < 4; x++) if (!p.includes(x)) g |= bit(token, pos++) << x;
  return g;
}
function shapeStep(a: number, b: number, q: number, token: number): number {
  const aa = a << 1, bb = b << 1, p = patterns(aa, bb, q); let v = 0;
  for (let row = 1; row < q; row++) { const block = p.indexOf(bit(aa, row) + 2 * bit(bb, row)); if (block > 0) v |= bit(token, block - 1) << (row - 1); }
  return v;
}
function validate(initial: readonly number[], topo: Topology, q: number, out: number): void {
  const max = mask(q); check(initial.length > 0 && initial.every(x => x >= 0 && x <= max), "bad initial columns");
  check(out >= 0 && out < initial.length + topo.length, "bad output");
  topo.forEach(([a,b], j) => check(a >= 0 && b >= 0 && a < initial.length+j && b < initial.length+j, "not a DAG"));
}
function evaluate(initial: readonly number[], topo: Topology, types: readonly number[], q: number): number[] {
  const v = [...initial]; topo.forEach(([a,b], j) => v.push(gate(at(types,j), at(v,a), at(v,b), q))); return v;
}
function literal(initial: readonly number[], topo: Topology, q: number, out: number, affine = false): bigint[] {
  validate(initial,topo,q,out); const result = Array<bigint>(1<<q).fill(0n), v = [...initial];
  const types = Array.from({length:16},(_,i)=>i).filter(i=>!affine || pop(i)%2===0);
  function visit(j: number): void { if(j===topo.length) { const y=at(v,out); result[y]=at(result,y)+1n; return; }
    const [a,b]=at(topo,j); for(const g of types) {v.push(gate(g,at(v,a),at(v,b),q));visit(j+1);v.pop();} }
  visit(0);return result;
}
class Frontier {
  readonly memo = new Map<string,bigint>();
  readonly boundaries: number[][];
  readonly width: number;
  readonly initialShapes: number[];
  constructor(readonly initial: readonly number[], readonly topo: Topology, readonly q: number, readonly out: number, readonly target: number) {
    validate(initial,topo,q,out);check(q>=1 && target>=0 && target<=mask(q),"target");
    this.initialShapes=initial.map(v=>shape(v,q));const k=initial.length,s=topo.length,last=Array<number>(k+s).fill(-1);
    topo.forEach(([a,b],j)=>{last[a]=Math.max(at(last,a),j);last[b]=Math.max(at(last,b),j);});last[out]=s;
    this.boundaries=Array.from({length:s+1},(_,j)=>Array.from({length:j},(_,a)=>k+a).filter(a=>at(last,a)>=j));
    this.width=Math.max(0,...this.boundaries.map(x=>x.length));
  }
  value(j: number,state:readonly number[],a:number):number { return a<this.initial.length?at(this.initialShapes,a):at(state,at(this.boundaries,j).indexOf(a)); }
  next(j:number,state:readonly number[],token:number):number[] {
    const [a,b]=at(this.topo,j),z=shapeStep(this.value(j,state,a),this.value(j,state,b),this.q,token),node=this.initial.length+j;
    return at(this.boundaries,j+1).map(i=>i===node?z:this.value(j,state,i));
  }
  suffix(j:number,state:readonly number[]):bigint {
    if(j===this.topo.length)return this.value(j,state,this.out)===shape(this.target,this.q)?1n:0n;
    const key=`${j}:${state.join(',')}`;const old=this.memo.get(key);if(old!==undefined)return old;
    let total=0n;for(let token=0;token<8;token++)total+=this.suffix(j+1,this.next(j,state,token));this.memo.set(key,total);return total;
  }
  count():bigint {
    if(this.out<this.initial.length)return at(this.initial,this.out)===this.target?16n**BigInt(this.topo.length):0n;
    return this.suffix(0,[])*(2n**BigInt(this.topo.length-1));
  }
  unrank(rank:bigint):number[] {
    const total=this.count();check(rank>=0n && rank<total,"rank outside fiber");const s=this.topo.length,k=this.initial.length;
    if(this.out<k){const types:number[]=[];for(let j=0;j<s;j++){types.push(Number(rank%16n));rank/=16n;}return types;}
    const factor=2n**BigInt(s-1);let tr=rank/factor,orientation=rank%factor,state:number[]=[];const tokens:number[]=[];
    for(let j=0;j<s;j++){let chosen=-1;for(let token=0;token<8;token++){const z=this.next(j,state,token),mass=this.suffix(j+1,z);if(tr<mass){chosen=token;state=z;break;}tr-=mass;}check(chosen>=0,"unrank transition");tokens.push(chosen);}
    const values=[...this.initial],types:number[]=[];for(let j=0;j<s;j++){
      const eta=k+j===this.out?bit(this.target,0):Number(orientation&1n);if(k+j!==this.out)orientation>>=1n;
      const [a,b]=at(this.topo,j),g=decode(eta,at(tokens,j),at(values,a),at(values,b),this.q);types.push(g);values.push(gate(g,at(values,a),at(values,b),this.q));
    }check(at(values,this.out)===this.target,"unrank label");return types;
  }
}
function topologies(k:number,s:number,visit:(t:Topology)=>void):void {
  const t:Pair[]=[];function go(j:number):void{if(j===s){visit([...t]);return;}for(let a=0;a<k+j;a++)for(let b=0;b<k+j;b++){t.push([a,b]);go(j+1);t.pop();}}go(0);
}
function affineTable(a:number,b:number,c:number):number {let g=0;for(let u=0;u<2;u++)for(let v=0;v<2;v++)g|=(c^(a*u)^(b*v))<<(u+2*v);return g;}
function toAffine(initial:readonly number[],topo:Topology,types:readonly number[],q:number):{types:number[];unused:number[]} {
  check(q>=1&&q<=3,"affine row range");const values=[...initial],out:number[]=[],unused:number[]=[];
  topo.forEach(([a,b],j)=>{const g=at(types,j),p=patterns(at(values,a),at(values,b),q),missing=[0,1,2,3].find(x=>!p.includes(x));check(missing!==undefined,"missing pair");const d=pop(g)%2,h=g^(d<<missing);out.push(h);unused.push(d);values.push(gate(h,at(values,a),at(values,b),q));});return{types:out,unused};
}
function fromAffine(initial:readonly number[],topo:Topology,types:readonly number[],unused:readonly number[],q:number):number[]{
  const values=[...initial],out:number[]=[];topo.forEach(([a,b],j)=>{const h=at(types,j);check(pop(h)%2===0,"affine type");const p=patterns(at(values,a),at(values,b),q),missing=[0,1,2,3].find(x=>!p.includes(x));check(missing!==undefined,"missing");const g=h^(at(unused,j)<<missing);out.push(g);values.push(gate(g,at(values,a),at(values,b),q));});return out;
}
/** Construct an affine suffix iff the target belongs to the reachable-source span.
 * For q<=3 this is also complete for unrestricted B2 type feasibility.
 * A frozen prefix is represented by appending its known columns to initial.
 */
function affineFit(initial:readonly number[],topo:Topology,q:number,out:number,target:number):number[]|null {
  validate(initial,topo,q,out);if(out<initial.length)return at(initial,out)===target?Array<number>(topo.length).fill(0):null;
  const k=initial.length,active=Array<boolean>(k+topo.length).fill(false);
  function mark(i:number):void{if(at(active,i))return;active[i]=true;if(i>=k){const[a,b]=at(topo,i-k);mark(a);mark(b);}}mark(out);
  const basis=Array<number>(q).fill(0),cert=Array<bigint>(q).fill(0n);
  for(let i=0;i<k;i++)if(at(active,i)){let v=shape(at(initial,i),q),c=1n<<BigInt(i);for(let p=q-2;p>=0;p--)if(bit(v,p)){if(at(basis,p)){v^=at(basis,p);c^=at(cert,p);}else{basis[p]=v;cert[p]=c;break;}}}
  let v=shape(target,q),chosen=0n;for(let p=q-2;p>=0;p--)if(bit(v,p)){if(!at(basis,p))return null;v^=at(basis,p);chosen^=at(cert,p);}check(v===0,"elimination");
  const next=Array<number>(active.length).fill(-1);topo.forEach(([a,b],j)=>{const node=k+j;if(at(active,node)){if(at(next,a)<0)next[a]=node;if(at(next,b)<0)next[b]=node;}});
  let shift=bit(target,0);for(let i=0;i<k;i++)if((chosen&(1n<<BigInt(i)))!==0n)shift^=bit(at(initial,i),0);
  const result=topo.map(([a,b],j)=>{
    const node=k+j;if(!at(active,node))return 0;
    const use=(p:number):number=>at(next,p)===node?(p<k?Number((chosen>>BigInt(p))&1n):1):0;
    return affineTable(use(a),a===b?0:use(b),node===out?shift:0);
  });check(at(evaluate(initial,topo,result,q),out)===target,"constructed span witness");return result;
}
let localCases=0,affineLocal=0;
for(let q=1;q<=6;q++)for(let a=0;a<=mask(q);a++)for(let b=0;b<=mask(q);b++){
  const seen=new Set<number>();for(let g=0;g<16;g++){const[e,t]=encode(g,a,b,q);check(decode(e,t,a,b,q)===g,"local inverse");check(shape(gate(g,a,b,q),q)===shapeStep(shape(a,q),shape(b,q),q,t),"local shape");seen.add(e*8+t);localCases++;}check(seen.size===16,"local bijection");
  if(q<=3){const full=Array<number>(1<<q).fill(0),lin=Array<number>(1<<q).fill(0);for(let g=0;g<16;g++){const z=gate(g,a,b,q);full[z]=at(full,z)+1;if(pop(g)%2===0)lin[z]=at(lin,z)+1;}check(full.every((x,i)=>x===2*at(lin,i)),"local affine equality");affineLocal++;}
}
const initCases=[{q:1,v:[0,1,0,1]},{q:2,v:[0,3,2,1]},{q:3,v:[0,7,2,4]},{q:4,v:[0,15,10,12]},{q:5,v:[0,31,10,12]}];
let topologyCases=0,literalAssignments=0n,labelChecks=0,feasibilityChecks=0,affineDistributionChecks=0;const rows:unknown[]=[];
function auditTopology(initial:readonly number[],q:number,t:Topology):void {
  const out=initial.length+t.length-1,counts=literal(initial,t,q,out);topologyCases++;literalAssignments+=16n**BigInt(t.length);
  const affine=q<=3?literal(initial,t,q,out,true):null;
  for(let y=0;y<=mask(q);y++){
    const f=new Frontier(initial,t,q,out,y);check(f.count()===at(counts,y),"frontier vs literal");labelChecks++;
    if(affine){check(at(counts,y)===(2n**BigInt(t.length))*at(affine,y),"global affine distribution");affineDistributionChecks++;
      const fit=affineFit(initial,t,q,out,y);check((fit!==null)===(at(counts,y)>0n),"span feasibility mismatch");feasibilityChecks++;}
  }
}
for(const cfg of initCases)for(let s=0;s<=2;s++){const before=topologyCases;topologies(cfg.v.length,s,t=>auditTopology(cfg.v,cfg.q,t));rows.push({q:cfg.q,slots:s,topologies:topologyCases-before});}
// Complete two-initial-column families on three rows, not only distinct or balanced rows.
for(let a=0;a<8;a++)for(let b=0;b<8;b++)topologies(2,2,t=>auditTopology([a,b],3,t));
const named:[string,number[],number,Pair[]][]=[
  ["shared-diamond",[0,7,2],3,[[2,2],[3,3],[3,3],[4,5]]],
  ["three-row-reconvergence",[0,7,2,4],3,[[2,3],[4,2],[4,3],[5,6]]],
  ["four-row-nonlinearity",[0,15,10,12],4,[[2,3]]],
  ["five-row-joint",[0,31,10,12],5,[[2,3],[4,2],[4,3],[5,6]]],
  ["repeated-conflicting-rows",[0,7,0],3,[[2,2],[3,3]]]
];
for(const[,v,q,t]of named)auditTopology(v,q,t);
let bijections=0;const sampleRows:unknown[]=[];
for(const[name,initial,q,t]of named.slice(0,4)){
  const out=initial.length+t.length-1,counts=literal(initial,t,q,out);let total=0;
  for(let y=0;y<=mask(q);y++){const f=new Frontier(initial,t,q,out,y),set=new Set<string>();for(let rank=0n;rank<at(counts,y);rank++){
    const types=f.unrank(rank),key=types.join(',');check(!set.has(key),"duplicate unrank");set.add(key);
    if(q<=3){const a=toAffine(initial,t,types,q);check(fromAffine(initial,t,a.types,a.unused,q).join(',')===key,"global affine inverse");check(at(evaluate(initial,t,a.types,q),out)===y,"affine labels");bijections++;}
    total++;
  }check(BigInt(set.size)===at(counts,y),"fiber cardinality");}
  sampleRows.push({name,q,slots:t.length,allTypeRanks:total,counts:counts.map(String)});
}
// All prefixes of a three-gate topology: frozen prefix becomes initial signals.
let prefixChecks=0;
const pi=[0,7,2,4],pt:Pair[]=[[2,3],[4,2],[5,4]];
for(let p=0;p<=3;p++)for(let code=0;code<16**p;code++){
  let z=code;const types=Array.from({length:p},()=>{const x=z%16;z=Math.floor(z/16);return x;});
  const cols=evaluate(pi,pt.slice(0,p),types,3),suffix=pt.slice(p),out=pi.length+pt.length-1,counts=literal(cols,suffix,3,out);
  for(let y=0;y<8;y++){const fit=affineFit(cols,suffix,3,out,y);check((fit!==null)===(at(counts,y)>0n),"prefix feasibility");prefixChecks++;}
}
const widths:unknown[]=[];
for(const w of [1,2,4,8,12]){
  const ini=[0,7,2],t:Pair[]=Array.from({length:w},()=>[2,2] as const);let root=3;
  for(let i=1;i<w;i++){t.push([root,3+i]);root=3+t.length-1;}
  const counter=new Frontier(ini,t,3,root,2),result=counter.count();let numerator=1n,denominator=2n;
  for(let i=1;i<w;i++){numerator=denominator+numerator;denominator*=4n;}
  const expected=(16n**BigInt(t.length))*numerator/(2n*denominator);check(result===expected,"width-family independent recurrence");
  let states=new Set<string>(['']);for(let j=0;j<w;j++){const next=new Set<string>();for(const key of states){const state=key===''?[]:key.split(',').map(Number);for(let token=0;token<8;token++)next.add(counter.next(j,state,token).join(','));}states=next;}
  check(states.size===2**w,"frontier witness states");widths.push({w,slots:t.length,frontierWidth:counter.width,cutStates:states.size,memoStates:counter.memo.size,count:String(result)});
}
const full4=literal([10,12],[[0,1]],4,2),aff4=literal([10,12],[[0,1]],4,2,true);
check(at(full4,8)===1n&&at(aff4,8)===0n,"four-row AND distinction");
let marginalChecks=0;for(let subset=0;subset<16;subset++)if(pop(subset)<=3){const a=Array<bigint>(16).fill(0n),b=Array<bigint>(16).fill(0n);for(let y=0;y<16;y++){a[y&subset]=at(a,y&subset)+at(full4,y);b[y&subset]=at(b,y&subset)+at(aff4,y);}check(a.every((x,i)=>x===2n*at(b,i)),"low-order marginal equality");marginalChecks++;}
// q=0 and initial-output counts are exact boundary cases, not shape processing.
let boundaryChecks=0;for(let out=0;out<4;out++)for(let y=0;y<8;y++){const f=new Frontier(pi,pt,3,out,y);check(f.count()===at(literal(pi,pt,3,out),y),"initial output");boundaryChecks++;}
check(literal([0,0],[[0,1]],0,2)[0]===16n,"empty row count");boundaryChecks++;
let rejected=0;for(const rank of [-1n,16n]){try{new Frontier([10,12],[[0,1]],4,2,8).unrank(rank);}catch{rejected++;}}check(rejected===2,"invalid ranks rejected");
const baseResults={status:"pass",localCases,affineLocal,topologyCases,literalAssignments:String(literalAssignments),labelChecks,feasibilityChecks,affineDistributionChecks,rows,sampleRows,affineRoundTrips:bijections,prefixChecks,widths,fourRow:{full:full4.map(String),affine:aff4.map(String),marginalChecks,ANDtarget:8},boundaryChecks,invalidRanks:rejected,scope:"exact finite reductions; published #NFA FPRAS not implemented; no P/NP resolution"};

/** Explicit layered NFA for: target source-color reachable OR both other colors reachable.
 * The two path tokens read the SAME site-opening word; sharing is not resampled.
 * We count accepted words, never accepting paths, for the reliability reduction.
 */
class ColorNFA {
  readonly transitions: [number[],number[]][];
  readonly initial: number[]=[];
  readonly final:Set<number>;
  readonly edges:number;
  readonly L:number;
  readonly block:number;
  constructor(readonly cols:readonly number[],readonly topo:Topology,readonly out:number,readonly color:number) {
    check(color>=1&&color<=3,"nonconstant color");this.L=cols.length+topo.length;this.block=this.L+this.L*this.L;
    this.transitions=Array.from({length:(topo.length+1)*this.block},()=>[[],[]]);
    const colors=cols.map(x=>shape(x,3)),other=[1,2,3].filter(c=>c!==color);
    for(let i=0;i<cols.length;i++){
      if(at(colors,i)===color)this.initial.push(this.id(0,i));
      if(at(colors,i)===at(other,0))for(let j=0;j<cols.length;j++)if(at(colors,j)===at(other,1))this.initial.push(this.id(0,i,j));
    }
    let edges=0;
    topo.forEach(([a,b],j)=>{const node=cols.length+j;
      for(let symbol=0;symbol<2;symbol++){
        const options=(p:number):number[]=>symbol===1&&(p===a||p===b)?[p,node]:[p];
        for(let p=0;p<this.L;p++){
          const dest=options(p).map(u=>this.id(j+1,u));at(this.transitions,this.id(j,p))[symbol as 0|1]=dest;edges+=dest.length;
          for(let q=0;q<this.L;q++){const product:number[]=[];for(const u of options(p))for(const v of options(q))product.push(this.id(j+1,u,v));at(this.transitions,this.id(j,p,q))[symbol as 0|1]=product;edges+=product.length;}
        }
      }
    });
    this.edges=edges;this.final=new Set([this.id(topo.length,out),this.id(topo.length,out,out)]);
    check(this.transitions.length===(topo.length+1)*(this.L+this.L*this.L),"NFA size accounting");
    check(edges<=topo.length*(3*this.L+5*this.L*this.L),"NFA transition bound");
  }
  id(layer:number,p:number,q?:number):number{return layer*this.block+(q===undefined?p:this.L+p*this.L+q);}
  runs(word:number):bigint {
    let states=new Map<number,bigint>(this.initial.map(i=>[i,1n]));
    for(let j=0;j<this.topo.length;j++){const next=new Map<number,bigint>();for(const[i,count]of states)for(const z of at(at(this.transitions,i),bit(word,j)))next.set(z,(next.get(z)??0n)+count);states=next;}
    let total=0n;for(const[i,count]of states)if(this.final.has(i))total+=count;return total;
  }
}
function colorSet(initial:readonly number[],topo:Topology,out:number,word:number):number {
  const values=initial.map(x=>{const c=shape(x,3);return c===0?0:1<<(c-1);});
  topo.forEach(([a,b],j)=>values.push(bit(word,j)?at(values,a)|at(values,b):0));return at(values,out);
}
function weight(S:number,c:number):number{return S===(1<<(c-1))?2:pop(S)>=2?1:0;}
let nfaCases=0,nfaWordChecks=0,coloredLabelChecks=0,ambiguousCases=0;const colorRows:unknown[]=[];
function auditColor(initial:readonly number[],topo:Topology,name?:string):void {
  const out=initial.length+topo.length-1,raw=literal(initial,topo,3,out),rows:unknown[]=[];
  for(let c=1;c<=3;c++){
    const nfa=new ColorNFA(initial,topo,out,c);let sum=0n,words=0n,runs=0n;
    for(let word=0;word<2**topo.length;word++){const w=weight(colorSet(initial,topo,out,word),c),r=nfa.runs(word);check((w>0)===(r>0n),"NFA vs colored reach");sum+=BigInt(w);if(r>0n)words++;runs+=r;nfaWordChecks++;}
    const target=c<<1,expected=(2n**BigInt(3*topo.length-2))*sum;
    check(at(raw,target)===expected&&at(raw,target^7)===expected,"positive joint-label identity");coloredLabelChecks+=2;nfaCases++;
    if(runs>words)ambiguousCases++;
    if(name)rows.push({color:c,nfaStates:nfa.transitions.length,nfaEdges:nfa.edges,acceptedWords:String(words),acceptingRuns:String(runs),weightSum:String(sum),countPerOrientation:String(expected)});
  }
  if(name)colorRows.push({name,initial,topo,rows});
}
for(const initial of [[0,2,4],[0,7,2,4,6]])for(let s=1;s<=2;s++)topologies(initial.length,s,t=>auditColor(initial,t));
for(const[name,initial,q,topo]of named)if(q===3)auditColor(initial,topo,name);
for(let h=0;h<=5;h++){
  const initial=[1,4],topo:Pair[]=[];let source=1;
  for(let j=0;j<h;j++){topo.push([source,source]);source=initial.length+j;}
  topo.push([0,source]);
  // Large h uses exact frontier counts, not literal 16^(h+1) type enumeration.
  const out=initial.length+topo.length-1,c=2,target=4,nfa=new ColorNFA(initial,topo,out,c);
  let sum=0n,words=0n,runs=0n;for(let word=0;word<2**topo.length;word++){const w=weight(colorSet(initial,topo,out,word),c),r=nfa.runs(word);check((w>0)===(r>0n),"chain NFA");sum+=BigInt(w);if(r>0n)words++;runs+=r;nfaWordChecks++;}
  const count=new Frontier(initial,topo,3,out,target).count(),den=16n**BigInt(topo.length);
  check(count*(2n**BigInt(h+3))===den,"rare-chain formula");check(count===(2n**BigInt(3*topo.length-2))*sum,"chain positive identity");
  colorRows.push({name:`rare-chain-${h}`,initial,topo,rows:[{color:c,nfaStates:nfa.transitions.length,nfaEdges:nfa.edges,acceptedWords:String(words),acceptingRuns:String(runs),weightSum:String(sum),countPerOrientation:String(count)}]});nfaCases++;coloredLabelChecks++;
}
check(ambiguousCases>0,"must test words vs paths distinction");
console.log(JSON.stringify({...baseResults,colored:{nfaCases,nfaWordChecks,coloredLabelChecks,ambiguousCases,rows:colorRows}},null,2));
