/** U54-U55: exact raw B2 suffix moments, complement quotient and two-row sampler.
 * Counts are bigint. Finite truth vectors are explicitly limited to q <= 8.
 * The sampler uses ranks, allowing complete finite bijection audits.
 */
export {};
type Gate = readonly [number, number, number];
type Desc = { readonly gates: readonly Gate[]; readonly out: number };
function check(p: boolean, why: string): asserts p { if (!p) throw new Error(why); }
function at<T>(a: readonly T[], i: number): T { const v = a[i]; check(v !== undefined, `missing ${i}`); return v; }
const gateTotals = new Map<string, bigint>();
function total(k: number, r: number): bigint {
 if (r === 0) return 1n;
 const id = `${k}/${r}`, old = gateTotals.get(id); if (old !== undefined) return old;
 const g = 16n * BigInt(k) ** 2n * total(k + 1, r - 1); gateTotals.set(id, g); return g;
}
function fact(n: number): bigint { let a = 1n; for (let j = 2; j <= n; j++) a *= BigInt(j); return a; }
function binom(n: number, j: number): bigint { let a = 1n; for (let i = 1; i <= j; i++) a = a * BigInt(n - i + 1) / BigInt(i); return a; }
function gate(g: number, a: number, b: number, q: number): number {
 const mask = 2 ** q - 1; let c = 0;
 if (g & 1) c |= ~a & ~b; if (g & 2) c |= a & ~b;
 if (g & 4) c |= ~a & b; if (g & 8) c |= a & b;
 return c & mask;
}
function initial(n: number, x: readonly number[]): number[] {
 check(n >= 0 && n <= 8 && x.length <= 8 && x.every(v => Number.isInteger(v) && v >= 0 && v < 2 ** n), 'finite input domain');
 return [0, 2 ** x.length - 1, ...Array.from({ length: n }, (_, i) => x.reduce((c, p, j) => c | (((p >>> i) & 1) << j), 0))];
}
function hist(cols: readonly number[], D: number): number[] { const m = Array<number>(D).fill(0); for (const c of cols) m[c] = at(m, c) + 1; return m; }
function tuples(domain: number, q: number): number[][] {
 let a: number[][] = [[]]; for (let j = 0; j < q; j++) a = a.flatMap(p => Array.from({ length: domain }, (_, x) => [...p, x])); return a;
}
function key(d: Desc): string { return `${d.gates.map(g => g.join(',')).join(';')}/${d.out}`; }
function replay(cols: readonly number[], d: Desc, q: number): number {
 const a = [...cols]; for (const [g, i, j] of d.gates) { check(i < a.length && j < a.length, 'invalid predecessor'); a.push(gate(g, at(a, i), at(a, j), q)); }
 return at(a, d.out);
}

// Reference: do not merge ordered prefix states. Truth vectors encode ALL inputs.
function raw(n: number, s: number, retain?: { readonly x: readonly number[]; readonly y: number }) {
 const N = 2 ** n, a = initial(n, Array.from({ length: N }, (_, x) => x));
 const counts = Array<number>(2 ** N).fill(0), gs: Gate[] = [], kept = new Set<string>(); let lists = 0;
 check(total(a.length, s) * BigInt(a.length + s) < 2n ** 53n, 'raw Number bound');
 function visit(left: number): void {
  if (left === 0) {
   lists++;
   for (let out = 0; out < a.length; out++) {
    const f = at(a, out); counts[f] = at(counts, f) + 1;
    if (retain && retain.x.reduce((v, x, j) => v | (((f >>> x) & 1) << j), 0) === retain.y) kept.add(key({ gates: gs, out }));
   }
   return;
  }
  const k = a.length;
  for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) for (let g = 0; g < 16; g++) {
   a.push(gate(g, at(a, i), at(a, j), N)); gs.push([g, i, j]); visit(left - 1); gs.pop(); a.pop();
  }
 }
 visit(s); check(BigInt(lists) === total(n + 2, s), 'raw list mass');
 return { counts: counts.map(BigInt), kept, lists };
}

// Full histogram reference; retains ALL column multiplicities.
class FullCounter {
 readonly memo = new Map<string, bigint[]>();
 constructor(readonly q: number) { check(q >= 1 && q <= 8, 'q'); }
 count(m: readonly number[], r: number): bigint[] {
  const id = `${r}/${m}`, old = this.memo.get(id); if (old) return old;
  if (r === 0) { const z = m.map(BigInt); this.memo.set(id, z); return z; }
  const D = m.length, rates = Array<bigint>(D).fill(0n), answer = Array<bigint>(D).fill(0n);
  for (let a = 0; a < D; a++) if (at(m, a)) for (let b = 0; b < D; b++) if (at(m, b)) {
   for (let g = 0; g < 16; g++) { const c = gate(g, a, b, this.q); rates[c] = at(rates, c) + BigInt(at(m, a) * at(m, b)); }
  }
  for (let c = 0; c < D; c++) if (at(rates, c)) {
   const child = [...m]; child[c] = at(child, c) + 1; const h = this.count(child, r - 1);
   for (let y = 0; y < D; y++) answer[y] = at(answer, y) + at(rates, c) * at(h, y);
  }
  this.memo.set(id, answer); return answer;
 }
}

// U55: T contains sums of multiplicities in complementary column pairs.
class ComplementCounter {
 readonly memo = new Map<string, bigint[]>(); readonly pair: number[][][];
 readonly D: number; readonly L: number; readonly mask: number;
 constructor(readonly q: number) {
  check(q >= 1 && q <= 8, 'q'); this.D = 2 ** q; this.L = this.D / 2; this.mask = this.D - 1;
  this.pair = Array.from({ length: this.L }, (_, a) => Array.from({ length: this.L }, (_, b) => {
   const v = Array<number>(this.L).fill(0);
   for (let g = 0; g < 16; g++) { const c = this.rep(gate(g, a, b, q)); v[c] = at(v, c) + 1; }
   check(v.every(x => x % 2 === 0), 'complement rates must be even'); return v;
  }));
 }
 rep(c: number): number { return Math.min(c, c ^ this.mask); }
 offsets(t: readonly number[], r: number): bigint[] {
  const id = `${r}/${t}`, old = this.memo.get(id); if (old) return old;
  const out = Array<bigint>(this.L).fill(0n); if (r === 0) { this.memo.set(id, out); return out; }
  const k = t.reduce((a, b) => a + b, 0), rates = Array<bigint>(this.L).fill(0n), suffix = total(k + 1, r - 1);
  for (let a = 0; a < this.L; a++) for (let b = 0; b < this.L; b++) if (at(t, a) && at(t, b)) {
   const p = at(at(this.pair, a), b);
   for (let z = 0; z < this.L; z++) rates[z] = at(rates, z) + BigInt(at(t, a) * at(t, b) * at(p, z));
  }
  check(rates.reduce((a, b) => a + b, 0n) === 16n * BigInt(k) ** 2n, 'quotient transition mass');
  for (let y = 0; y < this.L; y++) out[y] = (at(rates, y) / 2n) * suffix;
  for (let z = 0; z < this.L; z++) if (at(rates, z)) {
   const next = [...t]; next[z] = at(next, z) + 1; const b = this.offsets(next, r - 1);
   for (let y = 0; y < this.L; y++) out[y] = at(out, y) + at(rates, z) * at(b, y);
  }
  this.memo.set(id, out); return out;
 }
 counts(cols: readonly number[], r: number): bigint[] {
  const m = hist(cols, this.D), t = Array<number>(this.L).fill(0);
  for (let c = 0; c < this.D; c++) t[this.rep(c)] = at(t, this.rep(c)) + at(m, c);
  const b = this.offsets(t, r), g = total(cols.length, r);
  return m.map((my, y) => g * BigInt(my) + at(b, this.rep(y)));
 }
}

// Two-row exact scalar counter. No explicit full histogram states.
class TwoCounter {
 readonly memo = new Map<string, bigint>();
 plus(k: number, c: number, r: number): bigint {
  check(k >= 1 && c >= 0 && c <= k && r >= 0, 'scalar domain');
  const id = `${k},${c},${r}`, old = this.memo.get(id); if (old !== undefined) return old;
  if (r === 0) { this.memo.set(id, 0n); return 0n; }
  const kk = BigInt(k) ** 2n, cc = BigInt(c) ** 2n;
  const a = 8n * (kk + cc), b = 8n * (kk - cc);
  const out = a / 2n * total(k + 1, r - 1) + a * this.plus(k + 1, c + 1, r - 1) + b * this.plus(k + 1, c, r - 1);
  this.memo.set(id, out); return out;
 }
 count(k: number, c: number, my: number, y: number, r: number): bigint {
  check(y >= 0 && y < 4 && my >= 0 && my <= (y === 0 || y === 3 ? c : k - c), 'target multiplicity');
  const g = total(k, r), b = this.plus(k, c, r);
  return g * BigInt(my) + (y === 0 || y === 3 ? b : BigInt(r) * g / 2n - b);
 }
 counts(cols: readonly number[], r: number): bigint[] {
  const m = hist(cols, 4), c = at(m, 0) + at(m, 3);
  return m.map((my, y) => this.count(cols.length, c, my, y, r));
 }
}

// Closed unranking for a chosen new column; at most three pair classes, 16 gate types.
function triple(cols: readonly number[], z: number, ordinal: bigint): Gate {
 const k = cols.length, same = cols.map((v, i) => v === 0 || v === 3 ? i : -1).filter(i => i >= 0);
 const varying = cols.map((v, i) => v === 1 || v === 2 ? i : -1).filter(i => i >= 0);
 const all = Array.from({ length: k }, (_, i) => i);
 const groups: (readonly [readonly number[], readonly number[], number])[] = [];
 if (z === 0 || z === 3) groups.push([same, same, 8]);
 groups.push([varying, all, 4], [same, varying, 4]);
 for (const [left, right, types] of groups) {
  const mass = BigInt(left.length) * BigInt(right.length) * BigInt(types);
  if (ordinal >= mass) { ordinal -= mass; continue; }
  const pair = ordinal / BigInt(types), type = Number(ordinal % BigInt(types));
  const i = at(left, Number(pair / BigInt(right.length))), j = at(right, Number(pair % BigInt(right.length)));
  const allowed = Array.from({ length: 16 }, (_, g) => g).filter(g => gate(g, at(cols, i), at(cols, j), 2) === z);
  check(allowed.length === types, 'wrong free truth-entry count'); return [at(allowed, type), i, j];
 }
 throw new Error('gate ordinal outside interval');
}
function unrank(counter: TwoCounter, cols0: readonly number[], s: number, y: number, rank: bigint): Desc {
 const cols = [...cols0], gs: Gate[] = [];
 check(rank >= 0n && rank < at(counter.counts(cols, s), y), 'empty or invalid rank');
 for (let r = s; r > 0; r--) {
  const k = cols.length, m = hist(cols, 4), c = at(m, 0) + at(m, 3); let found = false;
  for (let z = 0; z < 4; z++) {
   const isC = z === 0 || z === 3, ways = 4n * (BigInt(k) ** 2n + (isC ? 1n : -1n) * BigInt(c) ** 2n);
   const child = counter.count(k + 1, c + Number(isC), at(m, y) + Number(z === y), y, r - 1), mass = ways * child;
   if (rank >= mass) { rank -= mass; continue; }
   const g = triple(cols, z, rank / child); rank %= child;
   check(gate(g[0], at(cols, g[1]), at(cols, g[2]), 2) === z, 'unrank replay');
   gs.push(g); cols.push(z); found = true; break;
  }
  check(found, 'unrank interval coverage');
 }
 const outputs = cols.map((c, i) => c === y ? i : -1).filter(i => i >= 0);
 return { gates: gs, out: at(outputs, Number(rank)) };
}

function auditQuotient() {
 const rows = []; let comparisons = 0, rawLists = 0, fullComparisons = 0;
 for (let n = 1; n <= 3; n++) for (let s = 0; s <= 2; s++) {
  const ref = raw(n, s), N = 2 ** n; rawLists += ref.lists; let local = 0;
  for (let q = 1; q <= (n <= 2 ? 3 : 2); q++) {
   const counter = new ComplementCounter(q), full = new FullCounter(q);
   for (const x of tuples(N, q)) {
    const cols = initial(n, x), actual = counter.counts(cols, s), literal = full.count(hist(cols, 2 ** q), s);
    const expected = Array<bigint>(2 ** q).fill(0n);
    for (let f = 0; f < ref.counts.length; f++) {
     const y = x.reduce((a, p, j) => a | (((f >>> p) & 1) << j), 0); expected[y] = at(expected, y) + at(ref.counts, f);
    }
    check(actual.every((a, y) => a === at(expected, y)), 'quotient/raw mismatch');
    check(actual.every((a, y) => a === at(literal, y)), 'quotient/full histogram mismatch');
    if (q === 2) check(new TwoCounter().counts(cols, s).every((a, y) => a === at(actual, y)), 'scalar mismatch');
    local += actual.length; fullComparisons += actual.length;
   }
  }
  if (n === 2) {
   const q = 4, x = [0, 1, 2, 3], c = new ComplementCounter(q);
   check(c.counts(initial(n, x), s).every((a, y) => a === at(ref.counts, y)), 'full four-row quotient'); local += 16;
  }
  comparisons += local; rows.push({ n, s, rawLists: ref.lists, descriptionCount: (total(n + 2, s) * BigInt(n + 2 + s)).toString(), labelCountsCompared: local });
 }
 // Arbitrary orientation splits, all histograms through k=6, q=2, r<=4.
 let orientationCases = 0;
 const full = new FullCounter(2), comp = new ComplementCounter(2), scalar = new TwoCounter();
 for (let k = 1; k <= 6; k++) for (let a = 0; a <= k; a++) for (let b = 0; b <= k - a; b++) for (let c = 0; c <= k - a - b; c++) {
  const m = [a,b,c,k-a-b-c], cols = m.flatMap((v, j) => Array<number>(v).fill(j));
  for (let r = 0; r <= 4; r++) {
   const ref = full.count(m, r), v = comp.counts(cols, r), w = scalar.counts(cols, r);
   check(ref.every((x, y) => x === at(v, y) && x === at(w, y)), 'orientation split count'); orientationCases += 4;
  }
 }
 return { rawLists, comparisons, fullComparisons, orientationCases, rows };
}
function momentExponents(d: number): number[][] {
 const out: number[][] = []; for (let a = 0; a <= d; a++) for (let b = 0; b <= d-a; b++) for (let c = 0; c <= d-a-b; c++) for (let e = 0; e <= d-a-b-c; e++) out.push([a,b,c,e]); return out;
}
function auditMoments() {
 const rows = []; let checks = 0, reachablePrefixes = 0;
 for (let d = 1; d <= 8; d++) {
  const k = d + 5, counter = new TwoCounter(), ms = Array.from({ length: d + 2 }, (_, j) => [2+j,0,d+2-j,1]);
  const frequencies = Array<number>(d + 2).fill(0);
  for (let pattern = 0; pattern < 2 ** (d + 1); pattern++) {
   const values = initial(2,[0,1]); let ones = 0;
   for (let i = 0; i <= d; i++) { const bit = (pattern >>> i) & 1; ones += bit; values.push(gate(10,at(values,bit ? 0 : 2),at(values,0),2)); }
   check(hist(values,4).every((v,j)=>v===at(at(ms,ones),j)), 'constructed prefix histogram');
   frequencies[ones] = at(frequencies,ones)+1; reachablePrefixes++;
  }
  check(frequencies.every((v,j)=>BigInt(v)===binom(d+1,j)), 'parity mixture multiplicities');
  for (const exponents of momentExponents(d)) {
   let a = 0n, b = 0n;
   for (let j = 0; j <= d+1; j++) {
    const value = at(ms,j).reduce((v, m, i) => v * BigInt(m) ** BigInt(at(exponents,i)), 1n) * binom(d+1,j);
    if (j % 2 === 0) a += value; else b += value;
   }
   check(a === b, 'equal moment construction failed'); checks++;
  }
  const gaps = [];
  for (let r = 0; r <= d; r++) {
   let numerator = 0n;
   for (let j = 0; j <= d+1; j++) numerator += (j % 2 === 0 ? 1n : -1n) * binom(d+1,j) * counter.count(k,3+j,2+j,0,r);
   check(numerator % (2n ** BigInt(d)) === 0n, 'nonintegral weighted gap');
   const gap = numerator / (2n ** BigInt(d));
   const want = r < d ? 0n : (d % 2 === 0 ? -1n : 1n) * fact(d+1) * fact(d) * 2n ** BigInt(2*d-1);
   check(gap === want, 'degree hierarchy gap'); gaps.push(gap.toString());
  }
  const values = ms.map((m,j) => counter.count(k,3+j,at(m,0),0,d).toString());
  rows.push({ d, k, commonMoments: momentExponents(d).length, binomialDenominator: (2n**BigInt(d)).toString(), histograms: ms, counts: values, gapsBySuffixLength: gaps });
 }
 return { checks, reachablePrefixes, rows };
}
function auditSampler() {
 const rows = []; let all = 0;
 const cases = [{n:1,s:0},{n:1,s:1},{n:1,s:2},{n:2,s:1},{n:2,s:2}];
 for (const {n,s} of cases) for (const y of (n===2 && s===2 ? [1] : [0,1,2,3])) {
  const x = [0,1], cols = initial(n,x), counter = new TwoCounter(), count = at(counter.counts(cols,s),y), ref = raw(n,s,{x,y}), seen = new Set<string>();
  check(count === BigInt(ref.kept.size), 'sampler raw count');
  for (let rank = 0n; rank < count; rank++) { const desc = unrank(counter,cols,s,y,rank), id = key(desc); check(!seen.has(id) && ref.kept.has(id), 'sampler not a bijection'); check(replay(cols,desc,2) === y, 'sampler wrong labels'); seen.add(id); }
  all += seen.size; rows.push({n,s,y,count:count.toString(),ranksChecked:seen.size});
 }
 const emptyCols = initial(2,[0,0]), empty = at(new TwoCounter().counts(emptyCols,4),1); check(empty===0n,'contradictory repeated row');
 let rejected = false; try { unrank(new TwoCounter(),emptyCols,4,1,0n); } catch { rejected=true; } check(rejected,'empty unrank accepted');
 const stress = new TwoCounter(), r=128, cols=initial(3,[0,7]), counts=stress.counts(cols,r);
 check(counts.reduce((a,b)=>a+b,0n)===total(cols.length,r)*BigInt(cols.length+r),'large scalar mass');
 check(stress.memo.size <= (r+1)*(r+2)/2,'scalar triangular state bound');
 return { allRanks:all, rows, emptyRejected:rejected, stress:{r,states:stress.memo.size,maxBits:Math.max(...counts.map(v=>v.toString(2).length)),counts:counts.map(String)} };
}
const result = { status:'pass', model:'ordered B2 raw descriptions, constants and inputs, repetition/fanout/dead gates, output index', quotient:auditQuotient(), moments:auditMoments(), sampler:auditSampler() };
console.log(JSON.stringify(result,null,2));
