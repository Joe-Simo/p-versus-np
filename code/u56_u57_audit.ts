/** Exact live-core weighting and last-example correction audits. */
export {};
type Gate = readonly [number, number, number];
type Core = { readonly gates: readonly Gate[]; readonly output: number };
function check(v: boolean, why: string): asserts v { if (!v) throw new Error(why); }
function at<T>(a: readonly T[], i: number): T { const v = a[i]; check(v !== undefined, `index ${i}`); return v; }
function pop(v: number): number { let n = 0; for (; v; v &= v - 1) n++; return n; }
function sum(a: readonly bigint[]): bigint { return a.reduce((s, x) => s + x, 0n); }
function primary(n: number): number[] {
  const N = 2 ** n, a = [0, 2 ** N - 1];
  for (let i = 0; i < n; i++) { let f = 0; for (let x = 0; x < N; x++) f |= ((x >>> i) & 1) << x; a.push(f); }
  return a;
}
function parity(n: number): number { let f = 0; for (let x = 0; x < 2 ** n; x++) f |= (pop(x) & 1) << x; return f; }
function gateTable(n: number): Uint16Array {
  const D = 2 ** (2 ** n), t = new Uint16Array(D * D * 16);
  for (let a = 0; a < D; a++) for (let b = 0; b < D; b++) for (let g = 0; g < 16; g++) {
    let f = 0; for (let x = 0; x < 2 ** n; x++) f |= ((g >>> (((a >>> x) & 1) + 2 * ((b >>> x) & 1))) & 1) << x;
    t[(a * D + b) * 16 + g] = f;
  }
  return t;
}
function replay(n: number, c: Core): number {
  let f = 0;
  for (let x = 0; x < 2 ** n; x++) {
    const v = [0, 1, ...Array.from({ length: n }, (_, i) => (x >>> i) & 1)];
    for (const [a, b, g] of c.gates) { check(a < v.length && b < v.length, "noncausal gate"); v.push((g >>> (at(v, a) + 2 * at(v, b))) & 1); }
    f |= at(v, c.output) << x;
  }
  return f;
}
function binaryEssential(g: number): boolean {
  let a = false, b = false;
  for (let x = 0; x < 4; x++) { a ||= ((g >>> x) & 1) !== ((g >>> (x ^ 1)) & 1); b ||= ((g >>> x) & 1) !== ((g >>> (x ^ 2)) & 1); }
  return a && b;
}
function normalize(n: number, c: Core): Core {
  const k = n + 2, aliases = Array.from({ length: k }, (_, w) => 2 * w), gates: Gate[] = [];
  for (const [aa, bb, g] of c.gates) {
    const a = at(aliases, aa), b = at(aliases, bb);
    if (g === 0 || g === 15) aliases.push(g === 0 ? 0 : 2);
    else if (g === 10 || g === 5) aliases.push(a ^ (g === 5 ? 1 : 0));
    else if (g === 12 || g === 3) aliases.push(b ^ (g === 3 ? 1 : 0));
    else {
      let h = 0;
      for (let x = 0; x < 4; x++) h |= ((g >>> (((x & 1) ^ (a & 1)) + 2 * (((x >>> 1) & 1) ^ (b & 1)))) & 1) << x;
      aliases.push(2 * (k + gates.length)); gates.push([a >>> 1, b >>> 1, h]);
    }
  }
  const ref = at(aliases, c.output), out = ref >>> 1;
  if ((ref & 1) === 0) return { gates, output: out };
  if (out < 2) return { gates: [], output: out ^ 1 };
  if (out < k) return { gates: [[out, out, 5]], output: k };
  const clipped = gates.slice(0, out - k + 1), root = at(clipped, clipped.length - 1);
  clipped[clipped.length - 1] = [root[0], root[1], root[2] ^ 15];
  return { gates: clipped, output: out };
}
function normalizationAudit(data: ReturnType<typeof coreEnumeration>) {
  const { n, k, lookup, D } = data, cols = primary(n), gates: Gate[] = []; let cases = 0;
  function go(j: number): void {
    for (let out = 0; out < cols.length; out++) {
      const c = normalize(n, { gates, output: out }), B = gates.filter(g => binaryEssential(g[2])).length;
      check(c.gates.length <= Math.max(1, B), "binary-essential normalization size");
      check(replay(n, c) === at(cols, out), "normalization changes output"); cases++;
    }
    if (j === 2) return;
    for (let a = 0; a < k + j; a++) for (let b = 0; b < k + j; b++) for (let g = 0; g < 16; g++) {
      const f = lookup[(at(cols, a) * D + at(cols, b)) * 16 + g]; check(f !== undefined, "normalization lookup");
      gates.push([a,b,g]); cols.push(f); go(j+1); cols.pop(); gates.pop();
    }
  }
  go(0); return { n, allOutputTaggedCasesThroughTwoGates: cases };
}
function liveCount(k: number, c: Core): number {
  const seen = new Set<number>();
  function visit(w: number): void { if (w < k || seen.has(w)) return; seen.add(w); const g = at(c.gates, w - k); visit(g[0]); visit(g[1]); }
  visit(c.output); return seen.size;
}
function weights(k: number, s: number): bigint[] { return Array.from({ length: s }, (_, j) => 16n * BigInt(k + j) ** 2n); }
function coefficients(w: readonly bigint[]): bigint[][] {
  const rows: bigint[][] = [[1n]];
  for (const x of w) { const a = at(rows, rows.length - 1); rows.push(Array.from({ length: a.length + 1 }, (_, i) => (a[i] ?? 0n) * x + (i === 0 ? 0n : at(a, i - 1)))); }
  return rows;
}
function tails(w: readonly bigint[]): bigint[][] {
  const t: bigint[][] = Array.from({ length: w.length + 1 }, () => []); t[w.length] = [1n];
  for (let i = w.length - 1; i >= 0; i--) { const a = at(t, i + 1); t[i] = Array.from({ length: a.length + 1 }, (_, j) => (a[j] ?? 0n) * at(w, i) + (j === 0 ? 0n : at(a, j - 1))); }
  return t;
}
function coreEnumeration(n: number, max: number) {
  check(n >= 1 && n <= 3 && max <= 3, "bounded core enumeration only");
  const k = n + 2, D = 2 ** (2 ** n), p = primary(n), lookup = gateTable(n), target = parity(n);
  const distributions: bigint[][] = [], retained: Core[][] = [], representatives: (Core | undefined)[] = Array(D).fill(undefined);
  const rows = [];
  for (let ell = 0; ell <= max; ell++) {
    const counts = Array<number>(D).fill(0), keep: Core[] = [], cols = [...p], topology: (readonly [number, number])[] = [], anc: number[] = [], gates: Gate[] = [];
    let topologies = 0;
    function types(j: number): void {
      if (j === ell) {
        const output = k + ell - 1, f = at(cols, output); counts[f] = at(counts, f) + 1;
        if (representatives[f] === undefined) representatives[f] = { gates: [...gates], output };
        if (f === target && ell <= (n === 1 ? 1 : n === 2 ? 2 : 3)) keep.push({ gates: [...gates], output });
        return;
      }
      const [a, b] = at(topology, j), off = (at(cols, a) * D + at(cols, b)) * 16;
      for (let g = 0; g < 16; g++) { const f = lookup[off + g]; check(f !== undefined, "gate lookup"); cols.push(f); gates.push([a, b, g]); types(j + 1); gates.pop(); cols.pop(); }
    }
    function pairs(j: number): void {
      if (j === ell) { if (at(anc, ell - 1) === (1 << ell) - 1) { topologies++; types(0); } return; }
      for (let a = 0; a < k + j; a++) for (let b = 0; b < k + j; b++) {
        topology.push([a, b]); anc.push((1 << j) | (a < k ? 0 : at(anc, a - k)) | (b < k ? 0 : at(anc, b - k)));
        pairs(j + 1); anc.pop(); topology.pop();
      }
    }
    if (ell === 0) for (let i = 0; i < k; i++) {
      const f = at(p, i); counts[f] = at(counts, f) + 1;
      const c: Core = { gates: [], output: i }; if (representatives[f] === undefined) representatives[f] = c; if (f === target) keep.push(c);
    } else pairs(0);
    const typed = ell === 0 ? k : topologies * 16 ** ell;
    check(Number.isSafeInteger(typed) && counts.reduce((a, b) => a + b, 0) === typed, "typed core count");
    distributions.push(counts.map(BigInt)); retained.push(keep);
    rows.push({ ell, connectedTopologies: topologies, typedCores: typed, functions: counts.filter(x => x > 0).length, parityCores: at(counts, target) });
  }
  const A = coefficients(weights(k, max));
  const raw = A.map(row => Array.from({ length: D }, (_, f) => row.reduce((z, a, ell) => z + a * at(at(distributions, ell), f), 0n)));
  raw.forEach((row, s) => check(sum(row) === BigInt(k + s) * at(at(A, s), 0), "total raw transform"));
  return { n, k, target, distributions, retained, representatives, rows, raw, lookup, D };
}
function rawReference(data: ReturnType<typeof coreEnumeration>, s: number) {
  const { n, k, D, lookup } = data, cols = primary(n), anc: number[] = [];
  const counts = Array.from({ length: s + 1 }, () => Array<number>(D).fill(0)); let gateLists = 0;
  function go(j: number): void {
    if (j === s) { gateLists++; cols.forEach((f, o) => { const l = o < k ? 0 : pop(at(anc, o - k)); const row = at(counts, l); row[f] = at(row, f) + 1; }); return; }
    for (let a = 0; a < k + j; a++) for (let b = 0; b < k + j; b++) {
      const mask = (1 << j) | (a < k ? 0 : at(anc, a - k)) | (b < k ? 0 : at(anc, b - k));
      const off = (at(cols, a) * D + at(cols, b)) * 16;
      for (let g = 0; g < 16; g++) { const f = lookup[off + g]; check(f !== undefined, "lookup"); cols.push(f); anc.push(mask); go(j + 1); anc.pop(); cols.pop(); }
    }
  }
  go(0); const A = at(coefficients(weights(k, s)), s);
  for (let l = 0; l <= s; l++) for (let f = 0; f < D; f++) check(BigInt(at(at(counts, l), f)) === at(A, l) * at(at(data.distributions, l), f), "joint raw/core mismatch");
  return { n, s, gateLists, outputTaggedDescriptions: gateLists * (k + s), jointCells: (s + 1) * D };
}
function decodeDecoration(k: number, s: number, c: Core, initialRank: bigint, t: bigint[][]): Core {
  const ell = c.gates.length, slots: number[] = [], physical: Gate[] = []; let left = ell, rank = initialRank;
  check(rank >= 0n && rank < at(at(t, 0), ell), "decoration rank out of range");
  for (let i = 0; i < s; i++) {
    const child = at(t, i + 1), liveMass = left === 0 ? 0n : (child[left - 1] ?? 0n);
    if (rank < liveMass) {
      const g = at(c.gates, ell - left), expand = (w: number): number => w < k ? w : at(slots, w - k);
      physical.push([expand(g[0]), expand(g[1]), g[2]]); slots.push(k + i); left--;
    } else {
      rank -= liveMass; const mass = child[left] ?? 0n; check(mass > 0n, "empty decoration block");
      const option = rank / mass; rank %= mass; check(option < 16n * BigInt(k + i) ** 2n, "dead option range");
      const op = Number(option), g = op % 16, pair = Math.floor(op / 16);
      physical.push([Math.floor(pair / (k + i)), pair % (k + i), g]);
    }
  }
  check(left === 0 && rank === 0n, "decoration not exhausted");
  return { gates: physical, output: ell === 0 ? c.output : at(slots, ell - 1) };
}
function samplerAudit(data: ReturnType<typeof coreEnumeration>, s: number) {
  const { k, n, target } = data, t = tails(weights(k, s)), A = at(t, 0), cores = data.retained;
  const masses = A.map((a, l) => a * BigInt(at(cores, l).length)), total = sum(masses);
  check(total === at(at(data.raw, s), target), "core pool incomplete for sampler"); check(total <= 1000000n, "bounded exhaustive ranks");
  const seen = new Set<string>(), spectrum = Array<bigint>(s + 1).fill(0n);
  for (let R = 0n; R < total; R++) {
    let rank = R, l = 0; while (rank >= at(masses, l)) { rank -= at(masses, l); l++; }
    const a = at(A, l), core = at(at(cores, l), Number(rank / a)), c = decodeDecoration(k, s, core, rank % a, t);
    check(replay(n, c) === target, "conditional unrank semantic error"); check(liveCount(k, c) === l, "unrank live size");
    const key = `${c.output}|${c.gates.map(g => g.join(',')).join(';')}`; check(!seen.has(key), "duplicate raw description"); seen.add(key); spectrum[l] = at(spectrum, l) + 1n;
  }
  check(spectrum.every((x, l) => x === at(masses, l)), "sampler mass spectrum");
  return { n, s, target, ranks: total, liveSpectrum: spectrum, distinct: seen.size };
}
function separation(n: number, mask: number, x: number): number {
  let best = 0, size = n + 1;
  for (let J = 1; J < 2 ** n; J++) if (pop(J) < size) {
    let good = true; for (let z = 0; z < 2 ** n; z++) if ((mask & (1 << z)) && ((z ^ x) & J) === 0) good = false;
    if (good) { best = J; size = pop(J); }
  }
  check(best !== 0, "unseparated new point"); return best;
}
function patch(n: number, c: Core, x: number, J: number): Core {
  const k = n + 2, gates = [...c.gates], vars = Array.from({ length: n }, (_, i) => i).filter(i => (J & (1 << i)) !== 0), d = vars.length;
  check(d > 0, "no patch direction");
  function add(a: number, b: number, g: number): number { const w = k + gates.length; gates.push([a, b, g]); return w; }
  const first = at(vars, 0);
  let output: number;
  if (d === 1) output = add(c.output, first + 2, ((x >>> first) & 1) ? 6 : 9);
  else {
    const second = at(vars, 1); let m = add(first + 2, second + 2, 1 << (((x >>> first) & 1) + 2 * ((x >>> second) & 1)));
    for (let i = 2; i < d; i++) { const j = at(vars, i); m = add(m, j + 2, 1 << (1 + 2 * ((x >>> j) & 1))); }
    output = add(c.output, m, 6);
  }
  check(gates.length === c.gates.length + d, "patch gate bound"); return { gates, output };
}
function boundaryAudit(data: ReturnType<typeof coreEnumeration>) {
  const { n, D, representatives } = data, N = 2 ** n;
  const pats: { mask: number; label: number; min: number; witness: number }[] = [];
  function build(x: number, mask: number, label: number): void {
    if (x < N) { build(x + 1, mask, label); build(x + 1, mask | (1 << x), label); build(x + 1, mask | (1 << x), label | (1 << x)); return; }
    let min = 4, witness = -1;
    for (let f = 0; f < D; f++) if ((f & mask) === label) {
      const c = representatives[f]; if (c !== undefined && c.gates.length < min) { min = c.gates.length; witness = f; }
    }
    pats.push({ mask, label, min, witness });
  }
  build(0, 0, 0); const map = new Map(pats.map(p => [`${p.mask}:${p.label}`, p]));
  let boundaries = 0, replays = 0; const histogram: Record<string, number> = {}, examples = [];
  for (const p of pats) for (let s = 0; s <= 3; s++) if (p.min > s) {
    for (let x = 0; x < N; x++) if (p.mask & (1 << x)) {
      const mask = p.mask ^ (1 << x), label = p.label & mask, old = map.get(`${mask}:${label}`); check(old !== undefined, "missing prior pattern");
      if (old.min > s) continue; check(mask > 0, "one label always fits a constant");
      const J = separation(n, mask, x), d = pop(J); check(old.min > s - d, "last-example live cutoff failed");
      const c = representatives[old.witness]; check(c !== undefined, "missing fitting circuit");
      const patched = patch(n, c, x, J), f = replay(n, patched); check((f & p.mask) === p.label, "patch changed previous label");
      check(((f ^ old.witness) & (1 << x)) !== 0, "patch failed to change new label"); replays++; boundaries++;
      const key = `${s},${d},${old.min}`; histogram[key] = (histogram[key] ?? 0) + 1;
      if (s === 3 && examples.length < 3) examples.push({ mask: p.mask, label: p.label, newPoint: x, priorMask: mask, separator: J, priorMinimum: old.min, priorWitness: old.witness, patchedTable: f, priorLiveSpectrum: at(coefficients(weights(data.k, s)), s).map((w, l) => w * at(data.distributions, l).reduce((a, z, ff) => a + ((ff & mask) === label ? z : 0n), 0n)) });
    }
  }
  return { n, patterns: pats.length, boundaryPairs: boundaries, patchReplays: replays, histogram_budget_separatorSize_priorMinimum: histogram, examples };
}
function priorAudit(k: number, s: number) {
  const A = coefficients(weights(k, s)), c: bigint[] = [];
  for (let j = 0; j <= s; j++) {
    const row = at(A, j); let x = BigInt(k + j) * at(row, 0);
    for (let l = 0; l < j; l++) x -= at(row, l) * at(c, l);
    check(x > 0n, "connected count positivity"); c.push(x);
  }
  const row = at(A, s), spectrum = row.map((x, l) => x * at(c, l)), total = BigInt(k + s) * at(row, 0), moment = spectrum.reduce((a, x, l) => a + BigInt(l) * x, 0n);
  check(sum(spectrum) === total, "unconditional spectrum normalization");
  check(moment * BigInt(k + 1) <= BigInt(s) * total, "unfolded mean bound");
  return { k, s, totalBits: total.toString(2).length, coefficientCells: (s + 1) * (s + 2) / 2, expectedLive: { numerator: moment, denominator: total }, unfoldedExpectation: { numerator: s, denominator: k + 1 }, connectedTotals: c, spectrum };
}

function tailAudit(n: number) {
  const s = 16 * n, k = n + 2, m = Math.floor(s / 4), p = priorAudit(k, s);
  const numerator = sum(p.spectrum.slice(s - n + 1)), denominator = sum(p.spectrum);
  check(numerator * 16n ** BigInt(m) <= denominator * 15n ** BigInt(m), "near-full ancestry tail bound");
  let choose = 1n, binaryMass = 0n;
  for (let u = 0; u < n; u++) { binaryMass += choose * 6n ** BigInt(u) * 10n ** BigInt(s-u); choose = choose * BigInt(s-u) / BigInt(u+1); }
  check(binaryMass * 8n ** BigInt(s) <= 16n ** BigInt(s) * 7n ** BigInt(s), "essential-type tail bound");
  check(13n ** 16n < 7n ** 16n * 2n ** 15n, "exact MGF constant for type tail");
  return { n, k, s, typeTail: { numerator: binaryMass, denominator: 16n ** BigInt(s) }, typeUpperBound: { numerator: 7n ** BigInt(s), denominator: 8n ** BigInt(s) }, lastBlockSize: m, minimumLive: s - n + 1, exactTail: { numerator, denominator }, upperBound: { numerator: 15n ** BigInt(m), denominator: 16n ** BigInt(m) } };
}
function counterexamples() {
  const k = 3, s = 2, t = tails(weights(k, s)), c: Core = { gates: [[2, 2, 6]], output: 3 };
  const rootCounts = [0, 0], keys = new Set<string>();
  for (let r = 0n; r < 400n; r++) {
    const x = decodeDecoration(k, s, c, r, t); check(replay(1, x) === 0, "decorated core changed function");
    rootCounts[x.output - k] = at(rootCounts, x.output - k) + 1; keys.add(JSON.stringify(x));
  }
  check(rootCounts[0] === 256 && rootCounts[1] === 144 && keys.size === 400, "unequal embedding weights");
  let rejectedRanks = 0;
  for (const bad of [-1n, 400n]) { try { decodeDecoration(k, s, c, bad, t); } catch { rejectedRanks++; } }
  check(rejectedRanks === 2, "invalid rank accepted");
  let sharedZero = 0, independentZero = 0;
  for (let g = 0; g < 16; g++) {
    if (replay(2, { gates: [[2, 3, g], [4, 4, 6]], output: 5 }) === 0) sharedZero++;
    for (let h = 0; h < 16; h++) if (replay(2, { gates: [[2, 3, g], [2, 3, h], [4, 5, 6]], output: 6 }) === 0) independentZero++;
  }
  check(sharedZero === 16 && independentZero === 16, "sharing reference");
  return { oneCoreDecorationRanks: 400, rootCounts, rejectedRanks, sharedZero: { numerator: sharedZero, denominator: 16 }, independentZero: { numerator: independentZero, denominator: 256 } };
}
const finite = [], references = [], sampler = [], boundaries = [], normalization = [];
for (let n = 1; n <= 3; n++) {
  const data = coreEnumeration(n, 3);
  finite.push({ n, k: data.k, rows: data.rows, coreDistributions: data.distributions, rawDistributions: data.raw });
  for (let s = 0; s <= 2; s++) references.push(rawReference(data, s));
  const budgets = n === 1 ? [0, 1] : n === 2 ? [0, 1, 2] : [0, 1, 2, 3]; for (const s of budgets) sampler.push(samplerAudit(data, s));
  boundaries.push(boundaryAudit(data)); normalization.push(normalizationAudit(data));
}
const prior = [[3, 8], [5, 16], [8, 5], [18, 15], [34, 31], [5, 128]].map(([k, s]) => { check(k !== undefined && s !== undefined, "prior parameters"); return priorAudit(k, s); });
console.log(JSON.stringify({ status: "pass", finite, references, sampler, boundaries, normalization, prior, nearFullTail: [2, 3, 4, 8, 16].map(tailAudit), counterexamples: counterexamples() }, (_, v: unknown) => typeof v === 'bigint' ? v.toString() : v, 2));
