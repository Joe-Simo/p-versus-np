/** U68-U69: four-row Walsh identities, positive collision form, cancellation,
 * and an exact-NFA barrier for the balanced favorable-prefix language.
 */
export {};

function check(ok: boolean, why: string): asserts ok {
  if (!ok) throw new Error(why);
}
function bit(x: number, i: number): number { return (x >>> i) & 1; }
function parity(x: number): number {
  let p = 0;
  while (x) { p ^= x & 1; x >>>= 1; }
  return p;
}
function gateColumn(type: number, a: number, b: number, q = 4): number {
  let out = 0;
  for (let i = 0; i < q; i++) {
    const idx = (bit(a, i) << 1) | bit(b, i);
    out |= ((type >>> idx) & 1) << i;
  }
  return out;
}
function collision(a: number, b: number, i: number, j: number): number {
  return bit(a, i) === bit(a, j) && bit(b, i) === bit(b, j) ? 1 : 0;
}
function allEvenAddressMultiplicity(a: number, b: number): number {
  const counts = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) counts[(bit(a, i) << 1) | bit(b, i)]!++;
  return counts.every(c => (c & 1) === 0) ? 1 : 0;
}
function charNumerator(a: number, b: number, subset: number): number {
  let s = 0;
  for (let t = 0; t < 16; t++) {
    const h = gateColumn(t, a, b);
    s += parity(h & subset) === 0 ? 1 : -1;
  }
  return s;
}
function targetCount(a: number, b: number, y: number): number {
  let c = 0;
  for (let t = 0; t < 16; t++) if (gateColumn(t, a, b) === y) c++;
  return c;
}
function isBalanced(y: number): boolean {
  let w = 0;
  for (let i = 0; i < 4; i++) w += bit(y, i);
  return w === 2;
}
function favorable(a: number, b: number, y: number): boolean {
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
    if (bit(y, i) !== bit(y, j) && collision(a, b, i, j) === 1) return false;
  }
  return true;
}

let walshChecks = 0;
let pairingChecks = 0;
let balancedChecks = 0;
const balancedRows: Array<Record<string, unknown>> = [];
for (let a = 0; a < 16; a++) for (let b = 0; b < 16; b++) {
  for (let subset = 0; subset < 16; subset++) {
    const literal = charNumerator(a, b, subset);
    let expected: number;
    if (subset === 0) expected = 16;
    else {
      const counts = [0, 0, 0, 0];
      for (let i = 0; i < 4; i++) if ((subset >>> i) & 1) counts[(bit(a, i) << 1) | bit(b, i)]!++;
      expected = counts.every(c => (c & 1) === 0) ? 16 : 0;
    }
    check(literal === expected, `Walsh mismatch a=${a} b=${b} subset=${subset}`);
    walshChecks++;
  }
  const c01 = collision(a, b, 0, 1), c23 = collision(a, b, 2, 3);
  const c02 = collision(a, b, 0, 2), c13 = collision(a, b, 1, 3);
  const c03 = collision(a, b, 0, 3), c12 = collision(a, b, 1, 2);
  const all4 = collision(a, b, 0, 1) * collision(a, b, 0, 2) * collision(a, b, 0, 3);
  const q = allEvenAddressMultiplicity(a, b);
  check(q === (c01 * c23 + c02 * c13 + c03 * c12 - 2 * all4), `pairing identity mismatch a=${a} b=${b}`);
  pairingChecks++;
  for (let y = 0; y < 16; y++) if (isBalanced(y)) {
    let fourierRaw = 1 + q;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const sign = bit(y, i) === bit(y, j) ? 1 : -1;
      fourierRaw += sign * collision(a, b, i, j);
    }
    const zeros: number[] = [], ones: number[] = [];
    for (let i = 0; i < 4; i++) (bit(y, i) === 0 ? zeros : ones).push(i);
    check(zeros.length === 2 && ones.length === 2, "balanced class size");
    const cz = collision(a, b, zeros[0]!, zeros[1]!);
    const co = collision(a, b, ones[0]!, ones[1]!);
    const positiveRaw = favorable(a, b, y) ? (1 + cz) * (1 + co) : 0;
    const literal = targetCount(a, b, y);
    check(literal === fourierRaw, `balanced Fourier mismatch a=${a} b=${b} y=${y}`);
    check(literal === positiveRaw, `balanced positive mismatch a=${a} b=${b} y=${y}`);
    balancedChecks++;
  }
}
for (let y = 0; y < 16; y++) if (isBalanced(y)) {
  const hist: Record<string, number> = {};
  let favorablePairs = 0;
  for (let a = 0; a < 16; a++) for (let b = 0; b < 16; b++) {
    const c = targetCount(a, b, y);
    if (c > 0) { favorablePairs++; hist[String(c)] = (hist[String(c)] ?? 0) + 1; }
  }
  balancedRows.push({target:y, favorableParentPairs:favorablePairs, gateMultiplicityHistogram:hist});
}

const chainTarget = 0b1100;
const cancellationRows: Array<Record<string, unknown>> = [];
let dist = new Array<bigint>(16).fill(0n);
dist[chainTarget] = 1n;
for (let m = 1; m <= 12; m++) {
  const next = new Array<bigint>(16).fill(0n);
  for (let x = 0; x < 16; x++) if (dist[x] !== 0n) {
    for (let t = 0; t < 16; t++) next[gateColumn(t, x, x)]! += dist[x]!;
  }
  dist = next;
  const total = 16n ** BigInt(m);
  const target = dist[chainTarget]!;
  const expectedTarget = (8n ** BigInt(m)) / 2n;
  check(target === expectedTarget, `chain target mismatch m=${m}`);
  const pairNums: Record<string, string> = {};
  for (const [i,j] of [[0,1],[2,3],[0,2],[0,3],[1,2],[1,3]] as const) {
    let num = 0n;
    for (let h = 0; h < 16; h++) num += (bit(h,i) === bit(h,j) ? 1n : -1n) * dist[h]!;
    pairNums[`${i}${j}`] = num.toString();
  }
  let quadNum = 0n;
  for (let h = 0; h < 16; h++) quadNum += (parity(h) === 0 ? 1n : -1n) * dist[h]!;
  check(pairNums["01"] === total.toString() && pairNums["23"] === total.toString(), `within moment mismatch m=${m}`);
  const crossExpected = total - (2n ** BigInt(3*m + 1));
  for (const k of ["02","03","12","13"]) check(pairNums[k] === crossExpected.toString(), `cross moment mismatch m=${m} ${k}`);
  check(quadNum === total, `quad moment mismatch m=${m}`);
  const signedResidual = total + BigInt(pairNums["01"]!) + BigInt(pairNums["23"]!)
    - BigInt(pairNums["02"]!) - BigInt(pairNums["03"]!) - BigInt(pairNums["12"]!) - BigInt(pairNums["13"]!) + quadNum;
  check(signedResidual === 16n * target, `Fourier inversion residual mismatch m=${m}`);
  cancellationRows.push({m,total:total.toString(),targetCount:target.toString(),targetProbability:`1/${2n**BigInt(m+1)}`,crossMomentNumerator:crossExpected.toString(),signedResidual:signedResidual.toString()});
}

const ZERO = 0, AND = 8, XOR = 6, OR = 14, TRANSFORM = 2;
const tcol = 0b1010;
function evalFixed(type: number, a: number, b: number): number { return gateColumn(type,a,b); }
function restrictedFavorable(m: number, x: number, y: number): boolean {
  const xs: number[] = [], ys: number[] = [];
  for (let i = 0; i < m; i++) xs.push(evalFixed(((x >>> i)&1) ? AND : ZERO, tcol, tcol));
  for (let i = 0; i < m; i++) ys.push(evalFixed(((y >>> i)&1) ? AND : ZERO, tcol, tcol));
  const ds = xs.map((v,i)=>evalFixed(XOR,v,ys[i]!));
  let o = ds[0]!;
  for (let i = 1; i < m; i++) o = evalFixed(OR,o,ds[i]!);
  const r = evalFixed(TRANSFORM,o,tcol);
  return favorable(0,r,tcol);
}
const equalityRows: Array<Record<string, unknown>> = [];
let restrictedWords = 0;
for (let m = 1; m <= 8; m++) {
  let accepted = 0;
  const lim = 1 << m;
  for (let x = 0; x < lim; x++) for (let y = 0; y < lim; y++) {
    const got = restrictedFavorable(m,x,y);
    check(got === (x === y), `equality favorable mismatch m=${m} x=${x} y=${y}`);
    if (got) accepted++;
    restrictedWords++;
  }
  check(accepted === lim, `equality accepted mismatch m=${m}`);
  equalityRows.push({m,words:lim*lim,accepted,nfaLowerBound:lim,prefixGates:4*m});
}

let minTransformFavorable = 16;
let maxTransformFavorable = 0;
const transformHistogram: Record<string, number> = {};
for (let o = 0; o < 16; o++) {
  let c = 0;
  for (let type = 0; type < 16; type++) {
    const r = gateColumn(type,o,tcol);
    if (favorable(0,r,tcol)) c++;
  }
  minTransformFavorable = Math.min(minTransformFavorable,c);
  maxTransformFavorable = Math.max(maxTransformFavorable,c);
  transformHistogram[String(c)] = (transformHistogram[String(c)] ?? 0) + 1;
}
check(minTransformFavorable === 2, `expected sharp minimum 2, got ${minTransformFavorable}`);
check(maxTransformFavorable <= 16, "transform max");

const result = {
  status:"pass",
  walshChecks,
  pairingChecks,
  balancedChecks,
  balancedRows,
  cancellationRows,
  favorableLanguage:{restrictedWords,equalityRows,minTransformFavorable,maxTransformFavorable,transformHistogram,expectedRejectionProposalsAtMost:8},
  scope:"Exact four-row identities and exact-NFA representation barrier; no approximation hardness and no P-vs-NP resolution"
};
console.log(JSON.stringify(result,null,2));
