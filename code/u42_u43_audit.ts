/** U42-U43: finite audits of actual fan-in-two Boolean circuits.
 * Exact bigint bit-slicing exhausts all assignments of each bounded circuit.
 * No oracle gates, computed truth-table labels, or SAT solver calls are used.
 * Gate counts measure the constructed circuits, not an asymptotic lower bound.
 */
export {};

type Wire = number;
type Op = "and" | "or" | "xor";
type Gate = { readonly op: Op; readonly a: Wire; readonly b: Wire };
function check(ok: boolean, message: string): asserts ok {
  if (!ok) throw new Error(message);
}
function at<T>(xs: readonly T[], i: number): T {
  const x = xs[i]; check(x !== undefined, `missing index ${i}`); return x;
}
function pop(x: number): number {
  let result = 0; while (x !== 0) { x &= x - 1; result++; } return result;
}
function pow2ceil(x: number): number { let p = 1; while (p < x) p *= 2; return p; }
function bits(x: number, width: number): Wire[] {
  return Array.from({ length: width }, (_, i) => (x >>> i) & 1);
}

class Circuit {
  readonly gates: Gate[] = [];
  readonly input: Wire[];
  constructor(readonly arity: number) {
    check(Number.isSafeInteger(arity) && arity >= 0, "invalid circuit arity");
    this.input = Array.from({ length: arity }, (_, i) => i + 2);
  }
  gate(op: Op, a: Wire, b: Wire): Wire {
    const out = this.arity + 2 + this.gates.length;
    check(a >= 0 && b >= 0 && a < out && b < out, "not a topological DAG");
    this.gates.push({ op, a, b }); return out;
  }
  not(a: Wire): Wire { return this.gate("xor", a, 1); }
  mux(s: Wire, a: Wire, b: Wire): Wire {
    // Output a when s=0, b when s=1: three ordinary binary gates.
    return this.gate("xor", a, this.gate("and", s, this.gate("xor", a, b)));
  }
  gt(a: readonly Wire[], b: readonly Wire[]): Wire {
    check(a.length === b.length, "comparison width mismatch");
    let greater = 0;
    for (let i = 0; i < a.length; i++) {
      const ai = at(a, i), bi = at(b, i);
      const local = this.gate("and", ai, this.not(bi));
      const equal = this.not(this.gate("xor", ai, bi));
      greater = this.gate("or", local, this.gate("and", equal, greater));
    }
    return greater;
  }
  evaluateAll(outputs: readonly Wire[]): bigint[] {
    check(this.arity <= 18, "exhaustive domain capped at 18 input bits");
    const count = 2 ** this.arity;
    const universe = (1n << BigInt(count)) - 1n;
    const values: bigint[] = [0n, universe];
    for (let i = 0; i < this.arity; i++) {
      const step = 1n << BigInt(i);
      const block = ((1n << step) - 1n) << step;
      values.push((universe / ((1n << (2n * step)) - 1n)) * block);
    }
    // Reclaim dead truth tables, so memory follows live wires rather than DAG size.
    const refs = Array<number>(this.arity + 2 + this.gates.length).fill(0);
    for (const g of this.gates) { refs[g.a] = at(refs, g.a) + 1; refs[g.b] = at(refs, g.b) + 1; }
    for (const out of outputs) refs[out] = at(refs, out) + 1;
    for (const g of this.gates) {
      const a = at(values, g.a), b = at(values, g.b);
      values.push(g.op === "and" ? a & b : g.op === "or" ? a | b : a ^ b);
      for (const w of [g.a, g.b]) {
        refs[w] = at(refs, w) - 1;
        if (refs[w] === 0) values[w] = 0n;
      }
    }
    return outputs.map(w => at(values, w));
  }
}

function bitTable(count: number, predicate: (assignment: number) => boolean): bigint {
  const bytes = new Uint8Array(Math.ceil(count / 8));
  for (let a = 0; a < count; a++) if (predicate(a)) bytes[a >>> 3] = (bytes[a >>> 3] ?? 0) | (1 << (a & 7));
  const hex = Array.from(bytes).reverse().map(x => x.toString(16).padStart(2, "0")).join("");
  return BigInt(`0x${hex || "0"}`);
}
function unpack(mask: bigint, count: number): Uint8Array {
  const len = Math.ceil(count / 8), hex = mask.toString(16).padStart(2 * len, "0");
  return Uint8Array.from({ length: len }, (_, i) => parseInt(hex.slice(2 * (len - 1 - i), 2 * (len - i)), 16));
}
function readPacked(bytes: Uint8Array, i: number): number { return ((bytes[i >>> 3] ?? 0) >>> (i & 7)) & 1; }

function sortNetwork(c: Circuit, rows: Wire[][], key: (row: readonly Wire[]) => Wire[]): number {
  const p = rows.length; check((p & (p - 1)) === 0, "network size must be a power of two");
  let comparisons = 0;
  for (let size = 2; size <= p; size *= 2) for (let stride = size / 2; stride >= 1; stride /= 2) {
    for (let i = 0; i < p; i++) {
      const j = i ^ stride; if (j <= i) continue;
      const a = at(rows, i), b = at(rows, j);
      const swap = (i & size) === 0 ? c.gt(key(a), key(b)) : c.gt(key(b), key(a));
      const left: Wire[] = [], right: Wire[] = [];
      for (let q = 0; q < a.length; q++) {
        const ai = at(a, q), bi = at(b, q);
        const delta = c.gate("and", swap, c.gate("xor", ai, bi));
        left.push(c.gate("xor", ai, delta)); right.push(c.gate("xor", bi, delta));
      }
      rows[i] = left; rows[j] = right; comparisons++;
    }
  }
  return comparisons;
}

function buildGather(n: number, t: number) {
  check(Number.isSafeInteger(n) && n >= 0 && Number.isSafeInteger(t) && t >= 0, "bad gather dimensions");
  const N = 2 ** n, c = new Circuit(N + n * t);
  if (t === 0) return { c, outputs: [] as Wire[], comparisons: 0, padded: 0 };
  const tagWidth = Math.ceil(Math.log2(Math.max(1, t))), p = pow2ceil(N + t);
  // Record fields: address[n], query, padding, source, value, tag[tagWidth].
  const query = n, padding = n + 1, source = n + 2, value = n + 3, tag = n + 4;
  const rows: Wire[][] = [];
  for (let x = 0; x < N; x++) rows.push([...bits(x, n), 0, 0, 1, at(c.input, x), ...bits(0, tagWidth)]);
  for (let j = 0; j < t; j++) rows.push([...c.input.slice(N + j * n, N + (j + 1) * n), 1, 0, 0, 0, ...bits(j, tagWidth)]);
  while (rows.length < p) rows.push([...bits(0, n), 0, 1, 0, 0, ...bits(0, tagWidth)]);
  let comparisons = sortNetwork(c, rows, row => [at(row, query), ...row.slice(0, n), at(row, padding)]);
  let carry = 0;
  for (const row of rows) { carry = c.mux(at(row, source), carry, at(row, value)); row[value] = carry; }
  comparisons += sortNetwork(c, rows, row => [...row.slice(tag), c.not(at(row, query))]);
  return { c, outputs: rows.slice(0, t).map(row => at(row, value)), comparisons, padded: p };
}

function auditGather() {
  const cases: readonly (readonly [number, number])[] = [[0,0],[0,3],[1,1],[1,3],[2,1],[2,2],[2,3],[2,5],[3,1],[3,2],[3,3]];
  const rows = []; let assignments = 0;
  for (const [n, t] of cases) {
    const N = 2 ** n, { c, outputs, comparisons, padded } = buildGather(n, t), count = 2 ** c.arity;
    const actual = c.evaluateAll(outputs), tableMask = (1 << N) - 1;
    for (let j = 0; j < t; j++) {
      const expected = bitTable(count, a => {
        const f = a & tableMask, address = (a >>> (N + n * j)) & (N - 1);
        return ((f >>> address) & 1) === 1;
      });
      check(at(actual, j) === expected, `gather mismatch at n=${n}, t=${t}, output=${j}`);
    }
    const h = padded === 0 ? 0 : Math.log2(padded);
    check(comparisons === padded * h * (h + 1) / 2, "comparator-count formula failed");
    assignments += count;
    rows.push({ n, N, t, inputBits: c.arity, assignments: count, comparisons, binaryGates: c.gates.length, status: "pass" });
  }
  return { assignments, rows };
}

type Face = readonly number[];
function faces(n: number, dimension: number): Face[] {
  const N = 2 ** n, out: number[][] = [];
  for (let directions = 0; directions < N; directions++) if (pop(directions) === dimension) {
    for (let base = 0; base < N; base++) if ((base & directions) === 0) {
      const points: number[] = [];
      for (let subset = 0; subset < N; subset++) if ((subset & directions) === subset) points.push(base | subset);
      out.push(points);
    }
  }
  return out;
}
function buildFaceWitness(n: number, d: number) {
  check(n >= 1 && d >= 0 && d < n, "require 0 <= d < n");
  const N = 2 ** n, c = new Circuit(N), allFaces = faces(n, d + 1), selected: Wire[] = [];
  let any = 0;
  for (const face of allFaces) {
    let parity = 0;
    for (const x of face) parity = c.gate("xor", parity, at(c.input, x));
    selected.push(c.gate("and", parity, c.not(any)));
    any = c.gate("or", any, parity);
  }
  const outputs: Wire[] = [any];
  for (let j = 0; j < 2 ** (d + 1); j++) for (let bit = 0; bit < n; bit++) {
    let output = 0;
    for (let i = 0; i < allFaces.length; i++) if (((at(at(allFaces, i), j) >>> bit) & 1) !== 0) {
      output = c.gate("or", output, at(selected, i));
    }
    outputs.push(output);
  }
  return { c, outputs, faceCount: allFaces.length };
}

// Independent truth-table oracle: Boolean Mobius transform, not face testing.
function algebraicDegree(f: number, n: number): number {
  const N = 2 ** n, a = Array.from({ length: N }, (_, x) => (f >>> x) & 1);
  for (let i = 0; i < n; i++) for (let x = 0; x < N; x++) if ((x & (1 << i)) !== 0) a[x] = at(a, x) ^ at(a, x ^ (1 << i));
  let degree = 0;
  for (let x = 0; x < N; x++) if (a[x] === 1) degree = Math.max(degree, pop(x));
  return degree;
}
function monomialTruth(n: number, support: number): number {
  let mask = 0;
  for (let x = 0; x < 2 ** n; x++) if ((x & support) === support) mask |= 1 << x;
  return mask;
}
function firstSet(c: Circuit, flags: readonly Wire[]) {
  check(flags.length > 0 && (flags.length & (flags.length - 1)) === 0, "priority encoder power-of-two size");
  let level = flags.map(valid => ({ valid, index: [] as Wire[] }));
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = at(level, i), right = at(level, i + 1);
      const index = left.index.map((w, j) => c.mux(left.valid, at(right.index, j), w));
      index.push(c.not(left.valid));
      next.push({ valid: c.gate("or", left.valid, right.valid), index });
    }
    level = next;
  }
  return at(level, 0);
}

// Improved constructor: O(n*2^n+n^2) gates for every d<n, not face enumeration.
function buildFastDegreeWitness(n: number, d: number) {
  check(n >= 1 && d >= 0 && d < n, "require 0 <= d < n");
  const N = 2 ** n, r = d + 1, c = new Circuit(N), coefficients = [...c.input];
  for (let i = 0; i < n; i++) for (let x = 0; x < N; x++) if ((x & (1 << i)) !== 0) {
    coefficients[x] = c.gate("xor", at(coefficients, x), at(coefficients, x ^ (1 << i)));
  }
  const high = firstSet(c, coefficients.map((w, support) => pop(support) > d ? w : 0));
  const selected: Wire[] = [], axes = Array.from({ length: r }, () => Array<Wire>(n).fill(0));
  let count: Wire[] = [1, ...Array<Wire>(r).fill(0)]; // capped one-hot count
  for (let i = 0; i < n; i++) {
    const bit = at(high.index, i), notBit = c.not(bit), old = count;
    for (let j = 0; j < r; j++) at(axes, j)[i] = c.gate("and", bit, at(old, j));
    selected.push(c.gate("and", bit, c.not(at(old, r))));
    count = [c.gate("and", at(old, 0), notBit)];
    for (let j = 1; j < r; j++) count.push(c.gate("or", c.gate("and", at(old, j), notBit), c.gate("and", at(old, j - 1), bit)));
    count.push(c.gate("or", at(old, r), c.gate("and", at(old, r - 1), bit)));
  }
  let derivative = [...c.input];
  for (let i = 0; i < n; i++) {
    const next = [...derivative];
    for (let x = 0; x < N; x++) if ((x & (1 << i)) === 0) {
      const y = x | (1 << i), a = at(derivative, x), b = at(derivative, y), delta = c.gate("xor", a, b);
      next[x] = c.mux(at(selected, i), a, delta); next[y] = c.mux(at(selected, i), b, delta);
    }
    derivative = next;
  }
  const nonzero = firstSet(c, derivative);
  const base = nonzero.index.map((w, i) => c.gate("and", w, c.not(at(selected, i))));
  const points: Wire[][] = [base];
  for (let j = 1; j < 2 ** r; j++) {
    const low = j & -j, axis = at(axes, Math.log2(low)), prev = at(points, j ^ low);
    points.push(prev.map((w, i) => c.gate("xor", w, at(axis, i))));
  }
  const bound = 5 * n * N + 10 * N + 5 * n * (n + 1) + 2 * n;
  check(c.gates.length <= bound, "explicit fast gate bound exceeded");
  return { c, outputs: [high.valid, ...points.flat()], derivativeFound: nonzero.valid, gateUpperBound: bound };
}

function auditDegreeWitnesses() {
  const rows = []; let assignments = 0, certificates = 0;
  for (let n = 1; n <= 4; n++) {
    const N = 2 ** n, count = 2 ** N;
    const degrees = Uint8Array.from({ length: count }, (_, f) => algebraicDegree(f, n));
    for (let d = 0; d < n; d++) {
      const naive = buildFaceWitness(n, d), fast = buildFastDegreeWitness(n, d);
      const fastTables = fast.c.evaluateAll([...fast.outputs, fast.derivativeFound]);
      check(at(fastTables, 0) === at(fastTables, fastTables.length - 1), "coefficient/derivative validity disagreement");
      const implementations = [
        { name: "coordinate-face enumeration", tables: naive.c.evaluateAll(naive.outputs) },
        { name: "Mobius and conditional derivatives", tables: fastTables.slice(0, -1) }
      ];
      const lowMonomials = Array.from({ length: N }, (_, i) => i).filter(i => pop(i) <= d).map(i => monomialTruth(n, i));
      let found = 0;
      for (const implementation of implementations) {
        const packed = implementation.tables.map(x => unpack(x, count));
        let foundHere = 0;
        for (let f = 0; f < count; f++) {
          const valid = readPacked(at(packed, 0), f) === 1;
          check(valid === ((degrees[f] ?? 0) > d), `degree classification failed in ${implementation.name}, n=${n}, d=${d}, f=${f}`);
          if (!valid) continue;
          let points = 0;
          for (let j = 0; j < 2 ** (d + 1); j++) {
            let x = 0;
            for (let bit = 0; bit < n; bit++) x |= readPacked(at(packed, 1 + j * n + bit), f) << bit;
            check((points & (1 << x)) === 0, "witness has duplicate points"); points |= 1 << x;
          }
          check((pop(f & points) & 1) === 1, "returned witness does not refute input");
          check(lowMonomials.every(m => (pop(m & points) & 1) === 0), "witness also refutes allowed polynomial");
          foundHere++;
        }
        if (found !== 0) check(found === foundHere, "nonmember counts disagree");
        found = foundHere;
        const conjunctionTable = 2 ** (N - 1);
        check(readPacked(at(packed, 0), conjunctionTable) === 1, "missing easy-circuit counterexample");
      }
      let minDualWeight = N + 1, dualWords = 0;
      for (let subset = 1; subset < count; subset++) if (lowMonomials.every(m => (pop(subset & m) & 1) === 0)) {
        dualWords++; minDualWeight = Math.min(minDualWeight, pop(subset));
      }
      check(minDualWeight === 2 ** (d + 1), "minimum certificate size mismatch");
      assignments += count; certificates += found;
      rows.push({ n, N, d, assignments: count, nonmembers: found, faceCount: naive.faceCount, faceCircuitGates: naive.c.gates.length, fastCircuitGates: fast.c.gates.length, fastGateUpperBound: fast.gateUpperBound, minimumCertificate: minDualWeight, nonzeroDualRelations: dualWords, status: "pass" });
    }
  }
  const constructionOnly = [];
  for (const n of [6, 8, 10, 12]) for (const d of [Math.floor(n / 2), n - 1]) {
    const built = buildFastDegreeWitness(n, d);
    constructionOnly.push({ n, N: 2 ** n, d, binaryGates: built.c.gates.length, outputs: built.outputs.length, gateUpperBound: built.gateUpperBound, semanticTest: "not exhaustive at this size; topology and count only" });
  }
  return { uniqueFunctionDegreePairs: assignments, twoCircuitEvaluations: 2 * assignments, nonmemberPairs: certificates, certificateOutputsChecked: 2 * certificates, rows, constructionOnly };
}

function auditFullLinearSpan() {
  const rows = []; let coefficientVectors = 0;
  for (let n = 1; n <= 4; n++) {
    const N = 2 ** n, allMonomials = Array.from({ length: N }, (_, s) => monomialTruth(n, s));
    for (let lambda = 1; lambda < 2 ** N; lambda++) {
      check(allMonomials.some(m => (pop(lambda & m) & 1) === 1), "nonzero universal linear identity found");
    }
    coefficientVectors += 2 ** N - 1;
    rows.push({ n, N, nonzeroCoefficientVectors: 2 ** N - 1, annihilatorsFound: 0 });
  }
  return { coefficientVectors, rows };
}

function auditBooleanPrimitives(): void {
  const c = new Circuit(2), a = at(c.input, 0), b = at(c.input, 1);
  const result = c.evaluateAll([c.gate("and", a, b), c.gate("or", a, b), c.gate("xor", a, b), c.not(a)]);
  check(result.every((x, i) => x === at([8n, 14n, 6n, 5n], i)), "bit-slicing primitive audit failed");
}

auditBooleanPrimitives();
console.log(JSON.stringify({ status: "pass", arithmetic: "bigint exhaustive bit-slicing; bounded integer truth-table oracle", gather: auditGather(), lowDegree: auditDegreeWitnesses(), generalCircuitLinearIdentity: auditFullLinearSpan() }, null, 2));
