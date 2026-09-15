/** U62-U63: exact four-row local law, equality-slice embedding, and dense zero-target check. */
export {};

function check(ok: boolean, why: string): asserts ok {
  if (!ok) throw new Error(why);
}

function gateBit(type: number, a: number, b: number): number {
  return (type >>> (2 * a + b)) & 1;
}

function evalGateColumn(type: number, aCol: number, bCol: number, rows = 4): number {
  let out = 0;
  for (let r = 0; r < rows; r++) {
    const a = (aCol >>> r) & 1;
    const b = (bCol >>> r) & 1;
    out |= gateBit(type, a, b) << r;
  }
  return out;
}

function normalize4(col: number): number {
  const base = col & 1;
  let shape = 0;
  for (let r = 1; r < 4; r++) {
    const bit = ((col >>> r) & 1) ^ base;
    shape |= bit << (r - 1);
  }
  return shape;
}

function shapeToColumn(shape: number, orientation = 0): number {
  let col = orientation & 1;
  for (let r = 1; r < 4; r++) {
    const bit = ((shape >>> (r - 1)) & 1) ^ orientation;
    col |= bit << r;
  }
  return col;
}

function span3(gens: readonly number[]): Set<number> {
  const out = new Set<number>([0]);
  for (const g of gens) {
    for (const x of [...out]) out.add(x ^ g);
  }
  return out;
}

function rank3(gens: readonly number[]): number {
  return Math.log2(span3(gens).size);
}

const localRows: Array<Record<string, unknown>> = [];
let localCases = 0;
for (let a = 0; a < 8; a++) {
  for (let b = 0; b < 8; b++) {
    localCases++;
    const aCol = shapeToColumn(a, 0);
    const bCol = shapeToColumn(b, 0);
    const counts = Array<bigint>(8).fill(0n);
    for (let type = 0; type < 16; type++) {
      const h = normalize4(evalGateColumn(type, aCol, bCol));
      counts[h] = (counts[h] ?? 0n) + 1n;
    }
    const product = a & b;
    const support = span3([a, b, product]);
    const r = rank3([a, b, product]);
    const expected = BigInt(2 ** (4 - r));
    for (let h = 0; h < 8; h++) {
      const want = support.has(h) ? expected : 0n;
      check(counts[h] === want, `local-law mismatch a=${a} b=${b} h=${h}`);
    }
    localRows.push({ a, b, rank: r, support: [...support].sort((x,y)=>x-y), multiplicity: expected.toString() });
  }
}

const affineA = 0b110;
const affineB = 0b101;
const nonlinear = affineA & affineB;
check(!span3([affineA, affineB]).has(nonlinear), "chosen nonlinear direction accidentally affine");
check(rank3([affineA, affineB, nonlinear]) === 3, "chosen four-row parents should have rank 3");

const ZERO = 0b0000;
const XOR = 0b0110;
const AND = 0b1000;
const OR = 0b1110;
const TCOL = 0b1010;

function equalityTopologyWord(m: number, left: readonly number[], right: readonly number[]): number {
  check(left.length === m && right.length === m, "block length mismatch");
  const xs: number[] = [];
  const ys: number[] = [];
  for (const bit of left) xs.push(evalGateColumn(bit === 0 ? ZERO : AND, TCOL, TCOL));
  for (const bit of right) ys.push(evalGateColumn(bit === 0 ? ZERO : AND, TCOL, TCOL));
  const diffs = xs.map((x, i) => evalGateColumn(XOR, x, ys[i]!));
  let acc = diffs[0]!;
  for (let i = 1; i < diffs.length; i++) acc = evalGateColumn(OR, acc, diffs[i]!);
  return acc;
}

const equalityRows = [];
let equalityChecks = 0;
for (let m = 1; m <= 8; m++) {
  let accepted = 0;
  const total = 1 << (2 * m);
  for (let word = 0; word < total; word++) {
    const left = Array.from({ length: m }, (_, i) => (word >>> i) & 1);
    const right = Array.from({ length: m }, (_, i) => (word >>> (m + i)) & 1);
    const output = equalityTopologyWord(m, left, right);
    const equal = left.every((x, i) => x === right[i]);
    check((output === 0) === equal, `equality slice mismatch m=${m} word=${word}`);
    if (output === 0) accepted++;
    equalityChecks++;
  }
  check(accepted === (1 << m), `wrong accepted equality count m=${m}`);
  equalityRows.push({ m, gates: 4 * m - 1, binaryWords: total, accepted });
}

const zeroTargetRows = [];
let minZeroTypes = 16;
for (let aCol = 0; aCol < 16; aCol++) {
  for (let bCol = 0; bCol < 16; bCol++) {
    let count = 0;
    const pairs = new Set<number>();
    for (let r = 0; r < 4; r++) pairs.add(2 * ((aCol >>> r) & 1) + ((bCol >>> r) & 1));
    for (let type = 0; type < 16; type++) if (evalGateColumn(type, aCol, bCol) === 0) count++;
    const expected = 1 << (4 - pairs.size);
    check(count === expected, `zero-type count mismatch a=${aCol} b=${bCol}`);
    minZeroTypes = Math.min(minZeroTypes, count);
    zeroTargetRows.push({ aCol, bCol, blocks: pairs.size, count });
  }
}
check(minZeroTypes === 1, "minimum zero-output type count should be one");

const summary = {
  status: "pass",
  localCases,
  localRows,
  affineFailure: {
    a: affineA,
    b: affineB,
    product: nonlinear,
    affineSpan: [...span3([affineA, affineB])].sort((x,y)=>x-y),
    fullRank: rank3([affineA, affineB, nonlinear])
  },
  equalityChecks,
  equalityRows,
  nfaLowerBound: equalityRows.map(row => ({ m: row.m, topologyGates: row.gates, foolingSetSize: 1 << row.m })),
  zeroTarget: {
    parentPairsChecked: zeroTargetRows.length,
    minimumCompatibleGateTypes: minZeroTypes,
    minimumAcceptanceProbability: "1/16",
    rows: zeroTargetRows
  },
  interpretation: "Exact NFA recognition can require exponentially many states on a regular slice, while the full all-zero target language has constant-density acceptance and trivial rejection sampling. This is not a P/NP result."
};
console.log(JSON.stringify(summary, null, 2));
