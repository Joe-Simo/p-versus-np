/** U66-U67: exact sampled-column factorization, variable elimination, and Karp-Luby audit. */
export {};

type Gate = readonly [number, number];
type Topology = { q: number; initial: number[]; gates: Gate[]; output: number };
type Factor = { scope: number[]; values: bigint[] };

function check(ok: boolean, why: string): asserts ok { if (!ok) throw new Error(why); }
function bit(x: number, i: number): number { return (x >>> i) & 1; }
function gateBit(tt: number, a: number, b: number): number { return (tt >>> (a + 2 * b)) & 1; }
function evalGate(tt: number, a: number, b: number, q: number): number {
  let h = 0;
  for (let i = 0; i < q; i++) h |= gateBit(tt, bit(a, i), bit(b, i)) << i;
  return h;
}
function localMultiplicity(a: number, b: number, h: number, q: number): number {
  const seen = new Int8Array(4); seen.fill(-1);
  let d = 0;
  for (let i = 0; i < q; i++) {
    const p = bit(a, i) + 2 * bit(b, i);
    const z = bit(h, i);
    if (seen[p] === -1) { seen[p] = z; d++; }
    else if (seen[p] !== z) return 0;
  }
  return 1 << (4 - d);
}
function compatibleTypes(a: number, b: number, h: number, q: number): number[] {
  const out: number[] = [];
  for (let tt = 0; tt < 16; tt++) if (evalGate(tt, a, b, q) === h) out.push(tt);
  return out;
}
function powInt(a: number, b: number): number { let x = 1; for (let i = 0; i < b; i++) x *= a; return x; }
function decode(idx: number, len: number, D: number): number[] {
  const a = new Array<number>(len);
  for (let i = 0; i < len; i++) { a[i] = idx % D; idx = Math.floor(idx / D); }
  return a;
}
function encode(vals: readonly number[], D: number): number {
  let m = 1, x = 0;
  for (const v of vals) { x += v * m; m *= D; }
  return x;
}
function projectIndex(unionScope: readonly number[], assign: readonly number[], scope: readonly number[], D: number): number {
  const vals: number[] = [];
  for (const v of scope) {
    const p = unionScope.indexOf(v); check(p >= 0, "scope projection"); vals.push(assign[p]!);
  }
  return encode(vals, D);
}
function makeFactor(scope: number[], fn: (vals: number[]) => bigint, D: number): Factor {
  const n = powInt(D, scope.length); const values = new Array<bigint>(n);
  for (let i = 0; i < n; i++) values[i] = fn(decode(i, scope.length, D));
  return { scope, values };
}
function multiplyAndSumOut(factors: Factor[], v: number, D: number): Factor {
  const unionScope = [...new Set(factors.flatMap(f => f.scope))].sort((a,b)=>a-b);
  check(unionScope.includes(v), "eliminated variable absent");
  const outScope = unionScope.filter(x => x !== v);
  const out = new Array<bigint>(powInt(D, outScope.length)).fill(0n);
  const total = powInt(D, unionScope.length);
  for (let i = 0; i < total; i++) {
    const assign = decode(i, unionScope.length, D);
    let p = 1n;
    for (const f of factors) {
      p *= f.values[projectIndex(unionScope, assign, f.scope, D)]!;
      if (p === 0n) break;
    }
    if (p !== 0n) {
      const vals = outScope.map(x => assign[unionScope.indexOf(x)]!);
      const oi=encode(vals,D); out[oi] = out[oi]! + p;
    }
  }
  return { scope: outScope, values: out };
}
function multiplyScalars(factors: Factor[]): bigint {
  let z = 1n;
  for (const f of factors) { check(f.scope.length === 0 && f.values.length === 1, "non-scalar left"); z *= f.values[0]!; }
  return z;
}
function signalColumn(t: Topology, gateCols: readonly number[], sig: number): number {
  const k = t.initial.length;
  return sig < k ? t.initial[sig]! : gateCols[sig-k]!;
}
function baseFactors(t: Topology, target: number, fixedCols: ReadonlyMap<number,number> = new Map()): Factor[] {
  const D = 1 << t.q, k=t.initial.length;
  const fs: Factor[]=[];
  for (let j=0;j<t.gates.length;j++) {
    const [pa,pb]=t.gates[j]!;
    const scope=[j];
    if (pa>=k) scope.push(pa-k);
    if (pb>=k && pb!==pa) scope.push(pb-k);
    scope.sort((a,b)=>a-b);
    fs.push(makeFactor(scope, vals => {
      const amap = new Map<number,number>(); scope.forEach((x,i)=>amap.set(x, vals[i]!));
      const h=amap.get(j)!;
      const a=pa<k?t.initial[pa]!:amap.get(pa-k)!;
      const b=pb<k?t.initial[pb]!:amap.get(pb-k)!;
      return BigInt(localMultiplicity(a,b,h,t.q));
    },D));
  }
  const outVar=t.output-k;
  if (t.output<k) fs.push({scope:[],values:[t.initial[t.output]===target?1n:0n]});
  else fs.push(makeFactor([outVar],v=>v[0]===target?1n:0n,D));
  for (const [v,c] of fixedCols) fs.push(makeFactor([v],x=>x[0]===c?1n:0n,D));
  return fs;
}
function primalGraph(t: Topology): Set<number>[] {
  const k=t.initial.length, s=t.gates.length;
  const g=Array.from({length:s},()=>new Set<number>());
  for (let j=0;j<s;j++) {
    const vars=[j]; const [a,b]=t.gates[j]!;
    if(a>=k)vars.push(a-k); if(b>=k && b!==a)vars.push(b-k);
    for(let x=0;x<vars.length;x++)for(let y=x+1;y<vars.length;y++){g[vars[x]!]!.add(vars[y]!);g[vars[y]!]!.add(vars[x]!);}
  }
  return g;
}
function minFillOrder(t: Topology): {order:number[];width:number} {
  const g=primalGraph(t); const alive=new Set(g.map((_,i)=>i)); const order:number[]=[]; let width=0;
  while(alive.size){
    let best=-1,bestFill=Infinity,bestDeg=Infinity;
    for(const v of alive){ const ns=[...g[v]!].filter(x=>alive.has(x)); let fill=0;
      for(let i=0;i<ns.length;i++)for(let j=i+1;j<ns.length;j++)if(!g[ns[i]!]!.has(ns[j]!))fill++;
      if(fill<bestFill || (fill===bestFill&&ns.length<bestDeg)){best=v;bestFill=fill;bestDeg=ns.length;}
    }
    const ns=[...g[best]!].filter(x=>alive.has(x)); width=Math.max(width,ns.length);
    for(let i=0;i<ns.length;i++)for(let j=i+1;j<ns.length;j++){g[ns[i]!]!.add(ns[j]!);g[ns[j]!]!.add(ns[i]!);}
    alive.delete(best); order.push(best);
  }
  return {order,width};
}
function partitionCount(t: Topology,target:number,fixedCols:ReadonlyMap<number,number>=new Map()): {count:bigint,width:number,order:number[]} {
  const D=1<<t.q; let fs=baseFactors(t,target,fixedCols); const {order,width}=minFillOrder(t);
  for(const v of order){ const hit=fs.filter(f=>f.scope.includes(v)); if(!hit.length)continue; fs=fs.filter(f=>!f.scope.includes(v)); fs.push(multiplyAndSumOut(hit,v,D)); }
  return {count:multiplyScalars(fs),width,order};
}
function bruteCount(t:Topology,target:number): bigint {
  const s=t.gates.length,total=powInt(16,s); let count=0n;
  for(let code=0;code<total;code++){
    let x=code; const sig=t.initial.slice();
    for(let j=0;j<s;j++){const tt=x%16;x=Math.floor(x/16);const[a,b]=t.gates[j]!;sig.push(evalGate(tt,sig[a]!,sig[b]!,t.q));}
    if(sig[t.output]===target)count++;
  }
  return count;
}
function unrankRaw(t:Topology,target:number,rank:bigint): number[] {
  const s=t.gates.length,D=1<<t.q; const total=partitionCount(t,target).count; check(rank>=0n&&rank<total,"rank range");
  const fixed=new Map<number,number>();
  for(let v=0;v<s;v++){
    let chosen=-1;
    for(let h=0;h<D;h++){
      const f2=new Map(fixed);f2.set(v,h); const c=partitionCount(t,target,f2).count;
      if(rank<c){chosen=h;fixed.set(v,h);break;} rank-=c;
    }
    check(chosen>=0,"shape unrank");
  }
  const gateCols=Array.from({length:s},(_,i)=>fixed.get(i)!); const lists:number[][]=[];
  for(let j=0;j<s;j++){const[a,b]=t.gates[j]!;const ca=signalColumn(t,gateCols,a),cb=signalColumn(t,gateCols,b),h=gateCols[j]!; const ls=compatibleTypes(ca,cb,h,t.q);check(ls.length===localMultiplicity(ca,cb,h,t.q),"type multiplicity");lists.push(ls);}
  let W=1n;for(const ls of lists)W*=BigInt(ls.length);check(rank<W,"residual rank");
  const types:number[]=[];
  for(const ls of lists){const n=BigInt(ls.length);types.push(ls[Number(rank%n)]!);rank/=n;}
  check(rank===0n,"residual exhaustion"); return types;
}
function replayTypes(t:Topology,types:readonly number[]): number {
  const sig=t.initial.slice(); for(let j=0;j<t.gates.length;j++){const[a,b]=t.gates[j]!;sig.push(evalGate(types[j]!,sig[a]!,sig[b]!,t.q));} return sig[t.output]!;
}
function normalize(col:number,q:number):number{const r=bit(col,0);let x=0;for(let i=1;i<q;i++)x|=(bit(col,i)^r)<<(i-1);return x;}
function favorableBalanced(a:number,b:number,yNorm:number,q=4):boolean{const x=normalize(a,q),z=normalize(b,q);return x===yNorm||z===yNorm||(x^z)===yNorm;}

let localChecks=0;
for(let a=0;a<16;a++)for(let b=0;b<16;b++)for(let h=0;h<16;h++){const literal=compatibleTypes(a,b,h,4).length;check(literal===localMultiplicity(a,b,h,4),"local factor mismatch");localChecks++;}
const Y=0b1100;
const chain=(m:number):Topology=>{const gates:Gate[]=[];for(let j=0;j<m;j++){const p=j===0?0:j;gates.push([p,p]);}return{q:4,initial:[Y],gates,output:m};};
const rows:any[]=[]; let bruteCases=0,rankCases=0;
for(let m=1;m<=4;m++){
  const t=chain(m);const dp=partitionCount(t,Y);const expected=BigInt(8**m)/2n;check(dp.count===expected,`chain formula ${m}`);check(bruteCount(t,Y)===dp.count,`chain brute ${m}`);bruteCases++;
  const lim=dp.count<64n?dp.count:64n; const seen=new Set<string>();
  for(let r=0n;r<lim;r++){const ts=unrankRaw(t,Y,r);check(replayTypes(t,ts)===Y,"chain unrank replay");seen.add(ts.join(','));rankCases++;}
  check(BigInt(seen.size)===lim,"chain unrank distinct prefix");
  rows.push({name:`rare-chain-${m}`,count:dp.count.toString(),width:dp.width,rawTotal:(16n**BigInt(m)).toString()});
}
const diamond:Topology={q:4,initial:[0b0011,0b0011,0b0101],gates:[[0,1],[3,2],[3,2],[4,5]],output:6};
const dd=partitionCount(diamond,Y);check(dd.count===1344n,"diamond exact expected");check(bruteCount(diamond,Y)===dd.count,"diamond brute");bruteCases++;
for(let r=0n;r<100n;r++){const ts=unrankRaw(diamond,Y,r);check(replayTypes(diamond,ts)===Y,"diamond unrank");rankCases++;}
rows.push({name:"shared-diamond",count:dd.count.toString(),width:dd.width,rawTotal:(16n**4n).toString()});
let favorable=0, weighted=0;const ma=new Array<number>(16).fill(0),mb=new Array<number>(16).fill(0);const yNorm=normalize(Y,4);
for(let t0=0;t0<16;t0++){const h0=evalGate(t0,0b0011,0b0011,4);for(let t1=0;t1<16;t1++){const a=evalGate(t1,h0,0b0101,4);for(let t2=0;t2<16;t2++){const b=evalGate(t2,h0,0b0101,4);ma[a]=ma[a]!+1;mb[b]=mb[b]!+1;if(favorableBalanced(a,b,yNorm))favorable++;weighted+=localMultiplicity(a,b,Y,4);}}}
let independentFavNum=0, independentWeightNum=0;
for(let a=0;a<16;a++)for(let b=0;b<16;b++){if(favorableBalanced(a,b,yNorm))independentFavNum+=ma[a]!*mb[b]!;independentWeightNum+=ma[a]!*mb[b]!*localMultiplicity(a,b,Y,4);}
check(favorable===672,"diamond support count");check(weighted===1344,"diamond weighted count");check(independentFavNum===720*4096,"diamond independent support arithmetic");check(independentWeightNum===1440*4096,"diamond independent weight arithmetic");
let seed=0x6a09e667;function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;}
for(let c=0;c<60;c++){
  const k=2+(rnd()%2),s=1+(rnd()%3);const init=Array.from({length:k},()=>rnd()%16);const gates:Gate[]=[];
  for(let j=0;j<s;j++){const n=k+j;gates.push([rnd()%n,rnd()%n]);}
  const t:Topology={q:4,initial:init,gates,output:k+s-1};const target=rnd()%16;const a=partitionCount(t,target).count,b=bruteCount(t,target);check(a===b,`random factor audit ${c}`);bruteCases++;
}
let duplicateCases=0;
for(let c=0;c<40;c++){
  const k=2+(rnd()%2),s=1+(rnd()%3);const init2=Array.from({length:k},()=>rnd()%4);const gates:Gate[]=[];
  for(let j=0;j<s;j++){const n=k+j;gates.push([rnd()%n,rnd()%n]);}
  const t2:Topology={q:2,initial:init2,gates,output:k+s-1};
  const init4=init2.map(c2=>{const r0=bit(c2,0),r1=bit(c2,1);return r0|(r0<<1)|(r1<<2)|(r1<<3);});
  const t4:Topology={q:4,initial:init4,gates,output:k+s-1};
  const c2=partitionCount(t2,0b10).count,c4=partitionCount(t4,Y).count;check(c2===c4,`duplicate transfer ${c}`);duplicateCases++;
}
const summary={status:"pass",model:"exact B2 local-column factors",localChecks,bruteCases,rankCases,duplicateCases,rows,diamond:{favorablePrefix: favorable,weightedTarget:weighted,independentFavorablePrediction:720,independentWeightedPrediction:1440},complexity:"variable elimination over domain 2^q; O(poly(s,q)*2^(q(w+1))) table work for induced width w",scope:"bounded-treewidth exact positive result and Karp-Luby component audit; no unrestricted FPRAS or P/NP resolution"};
console.log(JSON.stringify(summary,null,2));
