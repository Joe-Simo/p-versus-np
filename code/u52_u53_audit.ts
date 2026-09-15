/** Exact sample-column quotient, raw-description counting, and uniform unranking.
 * Fixed finite tests: q <= 8, n <= 3, small gate budgets. All DP masses use bigint.
 * Raw reference counts use Number only below an asserted 2^53 bound.
 */
export {};
type Gate = readonly [number, number, number];
type Description = { readonly gates: readonly Gate[]; readonly output: number };
function check(p: boolean, why: string): asserts p { if (!p) throw new Error(why); }
function at<T>(a: readonly T[], i: number): T { const x = a[i]; check(x !== undefined, `missing ${i}`); return x; }
function choose(n: number, k: number): bigint { let a = 1n; for (let j = 1; j <= k; j++) a = a * BigInt(n - j + 1) / BigInt(j); return a; }
function totalDescriptions(k: number, r: number): bigint { let t = BigInt(k + r); for (let j = 0; j < r; j++) t *= 16n * BigInt(k + j) ** 2n; return t; }
function key(a: readonly number[]): string { return a.join(','); }
function insert(a: readonly number[], c: number): number[] { const b = [...a]; let j = 0; while (j < b.length && at(b, j) <= c) j++; b.splice(j, 0, c); return b; }
function base(n: number, points: readonly number[]): number[] {
 check(n >= 0 && n <= 16 && points.length <= 8, 'finite domain');
 check(points.every(p => Number.isInteger(p) && p >= 0 && p < 2 ** n), 'bad point');
 const a = [0, 2 ** points.length - 1];
 for (let i = 0; i < n; i++) { let c = 0; for (let j = 0; j < points.length; j++) c |= ((at(points, j) >>> i) & 1) << j; a.push(c); }
 return a;
}
class Quotient {
 readonly D: number; readonly mask: number;
 private readonly pairCache = new Map<number, readonly (readonly [number, number])[]>();
 readonly transitionCache = new Map<string, readonly (readonly [number, bigint])[]>();
 readonly memo = new Map<string, bigint>();
 constructor(readonly q: number) { check(q >= 0 && q <= 8, 'bounded q'); this.D = 2 ** q; this.mask = this.D - 1; }
 eval(g: number, a: number, b: number): number {
  let c = 0; if (g & 1) c |= ~a & ~b; if (g & 2) c |= a & ~b; if (g & 4) c |= ~a & b; if (g & 8) c |= a & b; return c & this.mask;
 }
 pair(a: number, b: number): readonly (readonly [number, number])[] {
  const id = a * this.D + b, old = this.pairCache.get(id); if (old !== undefined) return old;
  const out = new Map<number, number>(); for (let g = 0; g < 16; g++) { const c = this.eval(g, a, b); out.set(c, (out.get(c) ?? 0) + 1); }
  const result = [...out].sort((u, v) => u[0] - v[0]); this.pairCache.set(id, result); return result;
 }
 transitions(sorted: readonly number[]): readonly (readonly [number, bigint])[] {
  const id = key(sorted), prior = this.transitionCache.get(id); if (prior !== undefined) return prior;
  const hist = new Map<number, bigint>(); for (const c of sorted) hist.set(c, (hist.get(c) ?? 0n) + 1n);
  const weights = new Map<number, bigint>();
  for (const [a, ma] of hist) for (const [b, mb] of hist) for (const [c, gates] of this.pair(a, b)) weights.set(c, (weights.get(c) ?? 0n) + ma * mb * BigInt(gates));
  check([...weights.values()].reduce((a, b) => a + b, 0n) === 16n * BigInt(sorted.length) ** 2n, 'transition mass');
  const result = [...weights].sort((u, v) => u[0] - v[0]); this.transitionCache.set(id, result); return result;
 }
 count(sorted: readonly number[], r: number, y: number): bigint {
  const id = `${r}/${y}/${key(sorted)}`, prior = this.memo.get(id); if (prior !== undefined) return prior;
  let value = 0n;
  if (r === 0) value = BigInt(sorted.filter(c => c === y).length);
  else for (const [c, w] of this.transitions(sorted)) value += w * this.count(insert(sorted, c), r - 1, y);
  this.memo.set(id, value); return value;
 }
 forward(initial: readonly number[], r: number) {
  let states = new Map<string, { cols: number[]; mass: bigint }>();
  const sorted = [...initial].sort((a, b) => a - b); states.set(key(sorted), { cols: sorted, mass: 1n });
  const layers = [1]; let gateLists = 1n, arcs = 0;
  for (let j = 0; j < r; j++) {
   const next = new Map<string, { cols: number[]; mass: bigint }>();
   for (const state of states.values()) for (const [c, w] of this.transitions(state.cols)) {
    const cols = insert(state.cols, c), id = key(cols), prior = next.get(id); arcs++;
    if (prior === undefined) next.set(id, { cols, mass: state.mass * w }); else prior.mass += state.mass * w;
   }
   gateLists *= 16n * BigInt(initial.length + j) ** 2n;
   check([...next.values()].reduce((a, b) => a + b.mass, 0n) === gateLists, 'lost gate-list mass');
   states = next; layers.push(states.size);
  }
  const counts = Array<bigint>(this.D).fill(0n);
  for (const state of states.values()) for (const c of state.cols) counts[c] = at(counts, c) + state.mass;
  check(counts.reduce((a, b) => a + b, 0n) === totalDescriptions(initial.length, r), 'output indices not counted');
  return { counts, layers, arcs, terminalStates: states.size };
 }
}

// Literal prefix enumeration: ordered signals are never merged. Only the final
// gate is summed directly from its 16 possible truth tables (in pair bins).
function raw(n: number, s: number, target: number) {
 const points = Array.from({ length: 2 ** n }, (_, x) => x), values = base(n, points), Q = new Quotient(points.length);
 const counts = Array<number>(Q.D).fill(0), gates: Gate[] = [], selected: Description[] = []; let prefixes = 0;
 check(totalDescriptions(n + 2, s) < 2n ** 53n, 'raw Number domain exceeds exact bound');
 function visit(j: number): void {
  if (j === s) { prefixes++; for (let out = 0; out < values.length; out++) { const f = at(values, out); counts[f] = at(counts, f) + 1; if (f === target) selected.push({ gates: [...gates], output: out }); } return; }
  if (j === s - 1 && s >= 3) {
   prefixes++; const m = values.length, ways = 16 * m * m;
   for (let out = 0; out < m; out++) counts[at(values, out)] = at(counts, at(values, out)) + ways;
   for (let a = 0; a < m; a++) for (let b = 0; b < m; b++) {
    for (const [c, w] of Q.pair(at(values, a), at(values, b))) counts[c] = at(counts, c) + w;
    const oldOuts = values.map((v, i) => v === target ? i : -1).filter(i => i >= 0);
    for (let g = 0; g < 16; g++) {
     const last: Gate = [g, a, b];
     if (Q.eval(g, at(values, a), at(values, b)) === target) selected.push({ gates: [...gates, last], output: m });
     for (const out of oldOuts) selected.push({ gates: [...gates, last], output: out });
    }
   } return;
  }
  const m = values.length;
  for (let a = 0; a < m; a++) for (let b = 0; b < m; b++) for (let g = 0; g < 16; g++) {
   gates.push([g, a, b]); values.push(Q.eval(g, at(values, a), at(values, b))); visit(j + 1); values.pop(); gates.pop();
  }
 }
 visit(0);
 check(counts.reduce((a, b) => a + BigInt(b), 0n) === totalDescriptions(n + 2, s), 'raw mass');
 return { counts: counts.map(BigInt), selected, prefixes };
}
function descKey(d: Description): string { return `${d.gates.map(g => g.join(',')).join(';')}/${d.output}`; }
class Unranker {
 private readonly choices = new Map<string, readonly { readonly gate: Gate; readonly c: number; readonly start: bigint; readonly end: bigint }[]>();
 constructor(readonly Q: Quotient, readonly y: number) {}
 private options(values: readonly number[], r: number) {
  const id = `${r}/${key(values)}`, old = this.choices.get(id); if (old !== undefined) return old;
  const sorted = [...values].sort((a, b) => a - b), result = []; let offset = 0n;
  for (let a = 0; a < values.length; a++) for (let b = 0; b < values.length; b++) for (let g = 0; g < 16; g++) {
   const c = this.Q.eval(g, at(values, a), at(values, b)), weight = this.Q.count(insert(sorted, c), r - 1, this.y);
   if (weight > 0n) result.push({ gate: [g, a, b] as Gate, c, start: offset, end: offset + weight }); offset += weight;
  }
  check(offset === this.Q.count(sorted, r, this.y), 'sampler normalization'); this.choices.set(id, result); return result;
 }
 unrank(initial: readonly number[], r: number, rank: bigint): Description {
  const values = [...initial], gates: Gate[] = [], mass = this.Q.count([...values].sort((a, b) => a - b), r, this.y);
  check(rank >= 0n && rank < mass, 'invalid or empty rank');
  for (let j = r; j > 0; j--) {
   const options = this.options(values, j); let lo = 0, hi = options.length;
   while (lo < hi) { const mid = Math.floor((lo + hi) / 2); if (at(options, mid).end <= rank) lo = mid + 1; else hi = mid; }
   const next = at(options, lo); rank -= next.start; gates.push(next.gate); values.push(next.c);
  }
  const out = values.map((v, i) => v === this.y ? i : -1).filter(i => i >= 0);
  check(rank < BigInt(out.length), 'terminal multiplicity'); return { gates, output: at(out, Number(rank)) };
 }
}
function uniformBelow(limit: bigint, bit: () => 0 | 1): bigint {
 check(limit > 0n, 'cannot sample empty fiber'); if (limit === 1n) return 0n;
 const width = (limit - 1n).toString(2).length;
 for (;;) { let value = 0n; for (let i = 0; i < width; i++) value = 2n * value + BigInt(bit()); if (value < limit) return value; }
}
function projectionMask(f: number, points: readonly number[]): number { let y = 0; for (let j = 0; j < points.length; j++) y |= ((f >>> at(points, j)) & 1) << j; return y; }

function copyCounter(initial: readonly number[], r: number) {
 let states = new Map<string, { cols: number[]; mass: bigint }>(); const sorted = [...initial].sort((a, b) => a - b); states.set(key(sorted), { cols: sorted, mass: 1n }); const layers = [1];
 for (let j = 0; j < r; j++) {
  const next = new Map<string, { cols: number[]; mass: bigint }>();
  for (const state of states.values()) { const hist = new Map<number, number>(); for (const c of state.cols) hist.set(c, (hist.get(c) ?? 0) + 1);
   for (const [c, m] of hist) { const cols = insert(state.cols, c), id = key(cols), amount = state.mass * BigInt(m * state.cols.length), old = next.get(id); if (old === undefined) next.set(id, { cols, mass: amount }); else old.mass += amount; }
  } states = next; layers.push(states.size);
 }
 return { states, layers };
}

const raw2 = raw(3, 2, 150); // odd parity: truth-table bits 1,2,4,7.
const partialRows = []; let partialCases = 0;
for (let mask = 0; mask < 256; mask++) {
 const points = Array.from({ length: 8 }, (_, x) => x).filter(x => !!(mask & (1 << x))), Q = new Quotient(points.length), got = Q.forward(base(3, points), 2), expected = Array<bigint>(2 ** points.length).fill(0n);
 for (let f = 0; f < 256; f++) { const y = projectionMask(f, points); expected[y] = at(expected, y) + at(raw2.counts, f); }
 check(expected.every((x, i) => x === at(got.counts, i)), `partial sample ${mask}`); partialCases += expected.length;
 partialRows.push({ sample: mask, counts: got.counts.map(String), layers: got.layers });
}
const samplerRows = [], fullRows = [];
for (const [n, s] of [[2, 1], [3, 2], [3, 3]] as const) {
 const points = Array.from({ length: 2 ** n }, (_, x) => x), target = n === 2 ? 6 : 150, reference = n === 3 && s === 2 ? raw2 : raw(n, s, target);
 const Q = new Quotient(points.length), initial = base(n, points), forward = Q.forward(initial, s);
 check(reference.counts.every((v, i) => v === at(forward.counts, i)), 'full distribution mismatch');
 const U = new Unranker(Q, target), mass = Q.count([...initial].sort((a, b) => a - b), s, target), expected = new Set(reference.selected.map(descKey)), seen = new Set<string>();
 check(mass === BigInt(expected.size), 'conditional sample count');
 for (let i = 0n; i < mass; i++) { const d = U.unrank(initial, s, i), id = descKey(d); check(expected.has(id) && !seen.has(id), 'unranking not bijective'); seen.add(id); }
 samplerRows.push({ n, s, target, descriptions: String(mass), bijection: 'all ranks match distinct raw descriptions', memoStates: Q.memo.size });
 fullRows.push({ n, s, counts: forward.counts.map(String), layers: forward.layers, arcs: forward.arcs, rawPrefixes: reference.prefixes, rawDescriptionCount: String(totalDescriptions(n + 2, s)) });
}
const boundaryRows = [];
for (const q of [0, 1]) for (let k = 2; k <= 5; k++) for (let s = 0; s <= 12; s++) {
 const initial = Array.from({ length: k }, (_, i) => q === 0 ? 0 : i % 2), Q = new Quotient(q), got = Q.forward(initial, s); let G = 1n;
 for (let j = 0; j < s; j++) G *= 16n * BigInt(k + j) ** 2n;
 if (q === 0) check(at(got.counts, 0) === G * BigInt(k + s), 'q=0 formula');
 else for (const y of [0, 1]) check(2n * at(got.counts, y) === G * BigInt(2 * initial.filter(c => c === y).length + s), 'q=1 formula');
 boundaryRows.push({ q, k, s, counts: got.counts.map(String), layers: got.layers });
}
// Repeated input rows do not invalidate counting, but contradictory labels must be empty.
const repeated = new Quotient(2).forward(base(2, [0, 0]), 2); check(at(repeated.counts, 1) === 0n && at(repeated.counts, 2) === 0n, 'contradictory labels');
let emptyRejected = false; try { new Unranker(new Quotient(2), 1).unrank(base(2, [0, 0]), 1, 0n); } catch { emptyRejected = true; } check(emptyRejected, 'empty unrank');
const stream: (0 | 1)[] = [1, 1, 1, 0]; let index = 0; check(uniformBelow(3n, () => at(stream, index++)) === 2n && index === 4, 'fair-bit rejection test');

const multiplicityRows = [];
for (let repeatedColumn = 0; repeatedColumn < 4; repeatedColumn++) {
 const cols = insert([0, 1, 2, 3], repeatedColumn), Q = new Quotient(2), got = Q.forward(cols, 1); multiplicityRows.push({ cols, counts: got.counts.map(String) });
}
// The support and total count alone are demonstrably insufficient even with the
// same terminal target multiplicity. This particular pair is checked, not assumed.
let multiplicityWitness: { a: readonly number[]; b: readonly number[]; y: number; aCount: string; bCount: string } | undefined;
for (let i = 0; i < multiplicityRows.length; i++) for (let j = i + 1; j < multiplicityRows.length; j++) for (let y = 0; y < 4; y++) {
 const a = at(multiplicityRows, i), b = at(multiplicityRows, j);
 if (a.cols.filter(c => c === y).length === b.cols.filter(c => c === y).length && at(a.counts, y) !== at(b.counts, y)) multiplicityWitness = { a: a.cols, b: b.cols, y, aCount: at(a.counts, y), bCount: at(b.counts, y) };
}
check(multiplicityWitness !== undefined, 'multiplicity witness not found');

const explosionRows = [];
for (const q of [1, 2, 3]) {
 const D = 2 ** q, Q = new Quotient(q), values = base(q, Array.from({ length: q }, (_, j) => 1 << j)), bootstrap: Gate[] = [];
 for (let c = 0; c < D; c++) if (!values.includes(c)) {
  const low = c & -c, rest = c ^ low, a = values.indexOf(low), b = values.indexOf(rest); check(a >= 0 && b >= 0, 'bootstrap unavailable predecessor'); const g: Gate = [14, a, b]; bootstrap.push(g); values.push(Q.eval(...[g[0], at(values, g[1]), at(values, g[2])] as const)); check(at(values, values.length - 1) === c, 'bootstrap value');
 }
 check(new Set(values).size === D && bootstrap.length === D - Math.min(D, q + 2), 'bootstrap count');
 const r = D, copy = copyCounter(values, r), expectedStates = choose(r + D - 1, D - 1); check(BigInt(copy.states.size) === expectedStates, 'histogram count');
 let G = 1n; for (let j = 0; j < r; j++) G *= BigInt(values.length + j) ** 2n;
 const counts = Array<bigint>(D).fill(0n); let sum = 0n;
 for (const state of copy.states.values()) { sum += state.mass; for (const c of state.cols) counts[c] = at(counts, c) + state.mass; }
 check(sum === G, 'copy total');
 for (let y = 0; y < D; y++) check(at(counts, y) * BigInt(values.length) === G * BigInt((values.length + r) * values.filter(c => c === y).length), 'copy suffix closed form');
 explosionRows.push({ q, D, bootstrapGates: bootstrap.length, copyingGates: r, totalBudget: bootstrap.length + r, states: copy.states.size, predicted: String(expectedStates), layers: copy.layers, rawCopyGateLists: String(G), outputCounts: counts.map(String), closedFormPass: true });
}

// A quotient for a fixed sample does not have a unique refinement when a new
// example arrives. Two old-equal prefixes split, including their terminal mass.
const oldQ = new Quotient(1), newQ = new Quotient(2), oldBase = base(2, [0]), newBase = base(2, [0, 1]);
const oldAnd = insert([...oldBase].sort((a, b) => a - b), oldQ.eval(8, at(oldBase, 2), at(oldBase, 3)));
const oldOr = insert([...oldBase].sort((a, b) => a - b), oldQ.eval(14, at(oldBase, 2), at(oldBase, 3)));
const newAnd = insert([...newBase].sort((a, b) => a - b), newQ.eval(8, at(newBase, 2), at(newBase, 3)));
const newOr = insert([...newBase].sort((a, b) => a - b), newQ.eval(14, at(newBase, 2), at(newBase, 3)));
check(key(oldAnd) === key(oldOr) && key(newAnd) !== key(newOr), 'single-state refinement fails');
const refinementCounts = [newQ.count(newAnd, 0, 2), newQ.count(newOr, 0, 2)];
check(refinementCounts[0] === 1n && refinementCounts[1] === 2n, 'refinement terminal distinction');
const refinement = { oldHistogram: oldAnd, newAND: newAnd, newOR: newOr, targetColumn: 2, terminalCounts: refinementCounts.map(String) };
const wolframComparison = new Quotient(2).forward(base(2, [1, 2]), 2).counts;
check(wolframComparison.every((v, i) => v === at([167296n, 139904n, 139904n, 167296n], i)), 'independent Wolfram raw enumeration');

// Count-free, label-conditioned sampler for syntactic copy-only suffixes.
// Exhaust its complete branch tree; each terminal description must have 1/C mass.
const copySamplerRows = [];
for (const [initial, r, y] of [ [[0, 1], 3, 0], [[0, 0, 1], 2, 0], [[0, 1, 2, 3], 2, 0], [[0, 0, 1, 1], 2, 0], [[0, 0], 2, 0], [[0, 1], 0, 0] ] as const) {
 let G = 1n; for (let j = 0; j < r; j++) G *= BigInt(initial.length + j) ** 2n;
 const total = G * BigInt((initial.length + r) * initial.filter(c => c === y).length) / BigInt(initial.length);
 let leaves = 0n;
 function visitCopy(values: readonly number[], remaining: number, num: bigint, den: bigint): void {
  const m = values.filter(c => c === y).length, k = values.length;
  if (remaining === 0) { for (const value of values) if (value === y) { check(num * total === den * BigInt(m), 'biased conditional copy sampler'); leaves++; } return; }
  for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) {
   const c = at(values, a), weight = m + (c === y ? 1 : 0);
   visitCopy([...values, c], remaining - 1, num * BigInt(weight), den * BigInt(k * (k + 1) * m));
  }
 }
 visitCopy(initial, r, 1n, 1n); check(leaves === total, 'copy sampler support');
 copySamplerRows.push({ initial, r, y, descriptions: String(total), probabilityOfEach: `1/${total}` });
}

console.log(JSON.stringify({ status: 'pass', model: 'exact ordered B2 gate lists with repeated predecessors and output index', partialCases, partialRows, fullRows, samplerRows, boundaryRows, repeatedContradictoryCounts: repeated.counts.map(String), multiplicityRows, multiplicityWitness, explosionRows, refinement, wolframComparison: wolframComparison.map(String), copySamplerRows }, null, 2));
