/** U70-U71: path-certificate local rank, exact-probe hardness, and witness multiplicity. */
export {};

type Pair = readonly [number, number];
type Gate = readonly [number, number];

function check(ok: boolean, why: string): asserts ok { if (!ok) throw new Error(why); }
function bit(x: number, i: number): number { return (x >>> i) & 1; }
function gateColumn(type: number, a: number, b: number): number {
  let out = 0;
  for (let i = 0; i < 4; i++) {
    const addr = (bit(a, i) << 1) | bit(b, i);
    out |= ((type >>> addr) & 1) << i;
  }
  return out;
}
function differs(col: number, p: Pair): boolean { return bit(col, p[0]) !== bit(col, p[1]); }

const allPairs: Pair[] = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const crossPairs: Pair[] = [[0,1],[0,3],[2,1],[2,3]];

function allowedGateTypes(a: number, b: number, req: readonly Pair[]): number[] {
  const ans: number[] = [];
  for (let t = 0; t < 16; t++) {
    const h = gateColumn(t, a, b);
    if (req.every(p => differs(h, p))) ans.push(t);
  }
  return ans;
}

/** Solve equations x_u xor x_v = 1 on four truth-table bits. */
function affineConstraintCount(a: number, b: number, req: readonly Pair[]): {consistent:boolean, rank:number, count:number} {
  const rows: number[] = [];
  for (const [i,j] of req) {
    const ui = (bit(a,i) << 1) | bit(b,i);
    const uj = (bit(a,j) << 1) | bit(b,j);
    // bits 0..3 are coefficients, bit 4 is RHS 1.
    rows.push((1 << ui) ^ (1 << uj) ^ (1 << 4));
  }
  let rank = 0;
  for (let c = 0; c < 4; c++) {
    let pivot = -1;
    for (let r = rank; r < rows.length; r++) if ((rows[r]! >>> c) & 1) { pivot = r; break; }
    if (pivot < 0) continue;
    [rows[rank], rows[pivot]] = [rows[pivot]!, rows[rank]!];
    for (let r = 0; r < rows.length; r++) if (r !== rank && ((rows[r]! >>> c) & 1)) rows[r] = rows[r]! ^ rows[rank]!;
    rank++;
  }
  for (const row of rows) if ((row & 15) === 0 && ((row >>> 4) & 1)) return {consistent:false, rank, count:0};
  return {consistent:true, rank, count:1 << (4-rank)};
}

let localChecks = 0;
for (let a = 0; a < 16; a++) for (let b = 0; b < 16; b++) for (let mask = 0; mask < 64; mask++) {
  const req = allPairs.filter((_,i) => ((mask >>> i) & 1) !== 0);
  const brute = allowedGateTypes(a,b,req).length;
  const linear = affineConstraintCount(a,b,req);
  check(brute === linear.count, `local affine mismatch a=${a} b=${b} mask=${mask}`);
  localChecks++;
}

// Minimal route-only failure: same selected predecessor a=0001 and same two routed pairs.
const routeReq: Pair[] = [[0,1],[0,3]];
const routeA = 0b0001;
check(routeReq.every(p => differs(routeA,p)), "selected predecessor must disagree on both routed pairs");
const routeCountSide0 = allowedGateTypes(routeA, 0b0000, routeReq).length;
const routeCountSide2 = allowedGateTypes(routeA, 0b0010, routeReq).length;
check(routeCountSide0 === 8 && routeCountSide2 === 4, "route-only counterexample changed");
check(allowedGateTypes(routeA,0,[[0,1]]).length === 8 && allowedGateTypes(routeA,0,[[0,3]]).length === 8, "single pair count");

/** Path probe: append gate G=(fixed a, arbitrary side b), route every req pair through a. */
function probeWeight(a: number, req: readonly Pair[], b: number): number {
  check(req.every(p => differs(a,p)), "invalid path probe: fixed predecessor does not disagree");
  return allowedGateTypes(a,b,req).length;
}

const complementClasses = [0,1,2,3,4,5,6,7];
const probes: ReadonlyArray<readonly [number, readonly Pair[]]> = [
  [1, [[0,1]]],
  [1, [[0,1],[0,2]]],
  [1, [[0,1],[0,3]]],
  [1, [[0,2],[0,3]]],
  [2, [[0,1],[1,2]]],
  [2, [[0,1],[1,3]]],
  [3, [[0,2],[1,2]]],
  [3, [[0,3],[1,2]]],
];
const probeMatrix = probes.map(([a,req]) => complementClasses.map(b => probeWeight(a,req,b)));
const expectedMatrix = [
  [8,8,8,8,8,8,8,8],
  [8,8,4,4,4,4,8,8],
  [8,8,4,4,8,8,4,4],
  [8,8,8,8,4,4,4,4],
  [8,4,8,4,4,8,4,8],
  [8,4,8,4,8,4,8,4],
  [8,4,4,8,8,4,4,8],
  [8,4,4,8,4,4,4,4],
];
check(JSON.stringify(probeMatrix) === JSON.stringify(expectedMatrix), "probe matrix mismatch");
for (const [a,req] of probes) for (let b=0;b<16;b++) check(probeWeight(a,req,b) === probeWeight(a,req,b^15), "complement invariance");

/** Fraction-free Bareiss determinant. */
function detBareiss(m0: readonly (readonly number[])[]): bigint {
  const n=m0.length; const m=m0.map(r=>r.map(BigInt)); let sign=1n; let prev=1n;
  for(let k=0;k<n-1;k++){
    let p=k; while(p<n && m[p]![k]===0n)p++;
    if(p===n)return 0n;
    if(p!==k){[m[p],m[k]]=[m[k]!,m[p]!];sign=-sign;}
    const pivot=m[k]![k]!;
    for(let i=k+1;i<n;i++) for(let j=k+1;j<n;j++) m[i]![j]=(m[i]![j]!*pivot-m[i]![k]!*m[k]![j]!)/prev;
    for(let i=k+1;i<n;i++)m[i]![k]=0n;
    prev=pivot;
  }
  return sign*m[n-1]![n-1]!;
}
const probeDet = detBareiss(probeMatrix);
check(probeDet === 2097152n, `probe determinant ${probeDet}`);
check(probeMatrix.flat().every(x=>x>=4), "all probe components should be dense");

// Verify the probe transform on complete small raw distributions.
function evalWord(initial: readonly number[], gates: readonly Gate[], types: readonly number[]): number[] {
  check(gates.length===types.length,"length mismatch"); const vals=[...initial];
  for(let j=0;j<gates.length;j++){const [x,y]=gates[j]!;vals.push(gateColumn(types[j]!,vals[x]!,vals[y]!));}
  return vals;
}
function outputDistribution(initial: readonly number[], gates: readonly Gate[], output: number): bigint[] {
  check(gates.length<=4,"enumeration cap"); const out=Array<bigint>(16).fill(0n); const total=16**gates.length;
  for(let code=0;code<total;code++){let z=code;const types:number[]=[];for(let j=0;j<gates.length;j++){types.push(z%16);z=Math.floor(z/16);}const col=evalWord(initial,gates,types)[output]; check(col!==undefined,"missing output"); out[col]=out[col]!+1n;}
  return out;
}
function probeCountsFromDist(dist: readonly bigint[]): bigint[] {
  return probes.map(([a,req])=>dist.reduce((s,n,b)=>s+n*BigInt(probeWeight(a,req,b)),0n));
}
const distTests: Array<{initial:number[],gates:Gate[],output:number}> = [
  {initial:[0,15,12,10],gates:[[2,3]],output:4},
  {initial:[0,15,12,10],gates:[[2,3],[4,2]],output:5},
  {initial:[0,15,12,10],gates:[[2,3],[4,2],[4,3]],output:6},
  {initial:[0,15,12,10],gates:[[2,3],[4,2],[4,3],[5,6]],output:7},
];
let distributionChecks=0;
for(const tc of distTests){const d=outputDistribution(tc.initial,tc.gates,tc.output);const cls=complementClasses.map(c=>d[c]!+d[c^15]!);const q=probeCountsFromDist(d);for(let i=0;i<8;i++){let s=0n;for(let c=0;c<8;c++)s+=BigInt(probeMatrix[i]![c]!)*cls[c]!;check(s===q[i]!,"probe linear transform mismatch");}distributionChecks++;}

// Witness multiplicity for balanced favorable-prefix path tuples.
function pathCountsForPair(initial: readonly number[], gates: readonly Gate[], types: readonly number[], p: Pair): bigint[] {
  const vals=evalWord(initial,gates,types); const pc=Array<bigint>(vals.length).fill(0n);
  for(let i=0;i<initial.length;i++) pc[i]=differs(vals[i]!,p)?1n:0n;
  for(let j=0;j<gates.length;j++){
    const v=initial.length+j; if(!differs(vals[v]!,p)){pc[v]=0n;continue;}
    const [a,b]=gates[j]!;
    // Predecessor positions are distinct witnesses even when a=b.
    pc[v]=(differs(vals[a]!,p)?pc[a]!:0n)+(differs(vals[b]!,p)?pc[b]!:0n);
  }
  return pc;
}
function witnessMultiplicity(initial: readonly number[], gates: readonly Gate[], types: readonly number[], finalA:number, finalB:number): bigint {
  let w=1n;
  for(const p of crossPairs){const pc=pathCountsForPair(initial,gates,types,p);w*=pc[finalA]!+pc[finalB]!;}
  return w;
}
function enumerateDisagreementPaths(initial: readonly number[], gates: readonly Gate[], types: readonly number[], start:number,p:Pair): number[][] {
  const vals=evalWord(initial,gates,types); const memo=new Map<number,number[][]>();
  function rec(v:number):number[][]{
    const old=memo.get(v);if(old)return old;
    if(!differs(vals[v]!,p)){memo.set(v,[]);return [];}
    if(v<initial.length){const z=[[v]];memo.set(v,z);return z;}
    const [a,b]=gates[v-initial.length]!; const ans:number[][]=[];
    if(differs(vals[a]!,p))for(const q of rec(a))ans.push([v,0,...q]);
    if(differs(vals[b]!,p))for(const q of rec(b))ans.push([v,1,...q]);
    memo.set(v,ans);return ans;
  }
  return rec(start);
}
function bruteWitnessMultiplicity(initial: readonly number[], gates: readonly Gate[], types: readonly number[], finalA:number,finalB:number): bigint {
  let w=1n;
  for(const p of crossPairs){const n=enumerateDisagreementPaths(initial,gates,types,finalA,p).length+enumerateDisagreementPaths(initial,gates,types,finalB,p).length;w*=BigInt(n);}
  return w;
}
function favorableColumns(vals: readonly number[], a:number,b:number):boolean{
  return crossPairs.every(p=>differs(vals[a]!,p)||differs(vals[b]!,p));
}
const pathTopologies: Array<{initial:number[],gates:Gate[],finalA:number,finalB:number}> = [
  {initial:[0,15,12,10],gates:[[2,3]],finalA:4,finalB:3},
  {initial:[0,15,12,10],gates:[[2,3],[4,2]],finalA:5,finalB:4},
  {initial:[0,15,12,10],gates:[[2,3],[4,2],[4,3]],finalA:5,finalB:6},
  {initial:[0,15,12,10],gates:[[2,3],[4,2],[4,3],[5,6]],finalA:7,finalB:4},
  {initial:[0,15,12,10],gates:[[2,2],[4,3],[4,3]],finalA:5,finalB:6},
];
let witnessWords=0, favorableWords=0, maxWitness=0n;
for(const tc of pathTopologies){const total=16**tc.gates.length;for(let code=0;code<total;code++){let z=code;const types:number[]=[];for(let j=0;j<tc.gates.length;j++){types.push(z%16);z=Math.floor(z/16);}const vals=evalWord(tc.initial,tc.gates,types);const w=witnessMultiplicity(tc.initial,tc.gates,types,tc.finalA,tc.finalB);const wb=bruteWitnessMultiplicity(tc.initial,tc.gates,types,tc.finalA,tc.finalB);check(w===wb,"witness DP/brute mismatch");check((w>0n)===favorableColumns(vals,tc.finalA,tc.finalB),"witness union does not match favorability");if(w>0n)favorableWords++;if(w>maxWitness)maxWitness=w;witnessWords++;}}

// Bound witness count bit length by O(s): each pair has <=2^(s+1) final-parent paths.
for(const tc of pathTopologies){const s=tc.gates.length;const bound=1n<<BigInt(4*(s+1));const total=16**s;for(let code=0;code<Math.min(total,2048);code++){let z=code;const types:number[]=[];for(let j=0;j<s;j++){types.push(z%16);z=Math.floor(z/16);}check(witnessMultiplicity(tc.initial,tc.gates,types,tc.finalA,tc.finalB)<=bound,"witness bit bound");}}

const result = {
  status:"pass",
  localChecks,
  routeOnlyCounterexample:{selectedColumn:routeA,requirements:routeReq,side0:routeCountSide0,side2:routeCountSide2},
  probeMatrix,
  probeDeterminant:probeDet.toString(),
  probeMinimumWeight:Math.min(...probeMatrix.flat()),
  probeMaximumExpectedRejectionProposals:4,
  distributionChecks,
  witnessWords,
  favorableWords,
  maxWitness:maxWitness.toString(),
  witnessFormula:"product over four cross pairs of (backward disagreement paths from final parent A + from final parent B)",
  scope:"Exact path-certificate counting classification and overlap-count audit only; no approximation hardness or P-versus-NP resolution"
};
console.log(JSON.stringify(result,null,2));
