/** Exact finite audits for U40-U41. All graph/assignment universes are explicit.
 * Run with tsc --strict --target ES2022 --module commonjs, then node.
 * Tests do not establish the asymptotic theorems; see the accompanying proofs.
 */
type Edge = readonly [number, number];
type Kernel =
  | { readonly tag: "reject"; readonly reason: "forced" | "edges"; readonly queries: number }
  | { readonly tag: "kernel"; readonly edges: readonly Edge[]; readonly budget: number; readonly queries: number };

function check(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function population(value: number): number {
  let count = 0;
  while (value !== 0) { value &= value - 1; count++; }
  return count;
}

function pairs(n: number): Edge[] {
  const edges: Edge[] = [];
  for (let u = 0; u < n; u++) for (let v = u + 1; v < n; v++) edges.push([u, v]);
  return edges;
}

// Independent original-instance oracle: enumerate every vertex subset.
function minimumCover(n: number, edges: readonly Edge[]): number {
  let best = n;
  for (let mask = 0; mask < 2 ** n; mask++) {
    const size = population(mask);
    if (size < best && edges.every(([u, v]) => (mask & ((1 << u) | (1 << v))) !== 0)) best = size;
  }
  return best;
}

// Terminal-label oracle: recursive edge branching, not original-subset enumeration.
function residualAnswer(edges: readonly Edge[], budget: number): boolean {
  if (edges.length === 0) return true;
  if (budget === 0) return false;
  const first = edges[0];
  check(first !== undefined, "missing first edge");
  return first.some(vertex => residualAnswer(edges.filter(([u, v]) => u !== vertex && v !== vertex), budget - 1));
}

function kernelize(n: number, k: number, inputBit: (u: number, v: number) => boolean): Kernel {
  check(Number.isSafeInteger(n) && n >= 0 && Number.isSafeInteger(k) && k >= 0 && k <= n, "invalid n or k");
  let queries = 0;
  const read = (u: number, v: number): boolean => { queries++; return inputBit(u, v); };
  const forced: number[] = [];
  // First phase: each off-diagonal adjacency entry is queried in its row.
  for (let u = 0; u < n; u++) {
    let degree = 0;
    for (let v = 0; v < n; v++) if (u !== v && read(u, v)) degree++;
    if (degree > k) forced.push(u);
    if (forced.length > k) return { tag: "reject", reason: "forced", queries };
  }
  const budget = k - forced.length;
  const residual: Edge[] = [];
  // Second phase: fixed upper-triangle scan; only the residual edge list is retained.
  for (let u = 0; u < n; u++) for (let v = u + 1; v < n; v++) {
    const present = read(u, v);
    if (present && !forced.includes(u) && !forced.includes(v)) {
      // Reject on the next edge without retaining an over-budget list.
      if (residual.length === k * budget) return { tag: "reject", reason: "edges", queries };
      residual.push([u, v]);
    }
  }
  return { tag: "kernel", edges: residual, budget, queries };
}

function auditKernels() {
  const rows = [];
  let graphCount = 0, caseCount = 0;
  for (let n = 0; n <= 6; n++) {
    const possible = pairs(n);
    const index = Array.from({ length: n }, () => Array<number>(n).fill(-1));
    possible.forEach(([u, v], i) => { index[u]![v] = i; index[v]![u] = i; });
    const counts = { graphs: 2 ** possible.length, cases: 0, forcedRejects: 0, edgeRejects: 0, retained: 0, maximumQueries: 0 };
    for (let bits = 0; bits < 2 ** possible.length; bits++) {
      const edges = possible.filter((_, i) => (bits & (1 << i)) !== 0);
      const optimum = minimumCover(n, edges);
      for (let k = 0; k <= n; k++) {
        const result = kernelize(n, k, (u, v) => (bits & (1 << index[u]![v]!)) !== 0);
        check(result.queries <= 3 * possible.length, `query bound n=${n}, k=${k}, bits=${bits}`);
        const actual = result.tag === "kernel" && residualAnswer(result.edges, result.budget);
        check(actual === (optimum <= k), `wrong answer n=${n}, k=${k}, bits=${bits}`);
        if (result.tag === "kernel") {
          check(result.edges.length <= k * result.budget, "residual-size bound");
          counts.retained++;
        } else if (result.reason === "forced") counts.forcedRejects++;
        else counts.edgeRejects++;
        counts.maximumQueries = Math.max(counts.maximumQueries, result.queries);
        counts.cases++; caseCount++;
      }
      graphCount++;
    }
    rows.push({ n, ...counts });
  }
  return { graphCount, caseCount, rows };
}

type ClauseMask = { readonly width: number; readonly accepted: bigint };
function clauseMasks(q: number): ClauseMask[] {
  const clauses: ClauseMask[] = [];
  // Ternary digits: absent, positive, negative. No duplicate/tautological literals.
  for (let encoded = 1; encoded < 3 ** q; encoded++) {
    let rest = encoded, positive = 0, negative = 0, width = 0;
    for (let i = 0; i < q; i++) {
      const digit = rest % 3; rest = Math.floor(rest / 3);
      if (digit !== 0) width++;
      if (digit === 1) positive |= 1 << i;
      if (digit === 2) negative |= 1 << i;
    }
    let accepted = 0n;
    for (let a = 0; a < 2 ** q; a++) {
      if ((a & positive) !== 0 || ((~a) & negative) !== 0) accepted |= 1n << BigInt(a);
    }
    clauses.push({ width, accepted });
  }
  return clauses;
}

function auditParityCNFs() {
  const rows = [];
  let checkedSets = 0;
  for (let q = 1; q <= 5; q++) {
    const universe = (1n << BigInt(2 ** q)) - 1n;
    const evenAssignments = Array.from({ length: 2 ** q }, (_, a) => a).filter(a => population(a) % 2 === 0);
    const clauses = clauseMasks(q);
    const maxSize = Array<number>(q + 1).fill(0);
    const definableCounts = Array<number>(q + 1).fill(1); // Empty relation is the empty-clause CNF.
    // A relation S is b-CNF definable iff intersecting all width<=b clauses
    // that are true on S produces S again. This is an exact closure test.
    for (let selector = 1; selector < 2 ** evenAssignments.length; selector++) {
      let relation = 0n;
      for (let i = 0; i < evenAssignments.length; i++) if ((selector & (1 << i)) !== 0) relation |= 1n << BigInt(evenAssignments[i]!);
      const size = population(selector);
      const layers = Array<bigint>(q + 1).fill(universe);
      for (const clause of clauses) if ((relation & clause.accepted) === relation) layers[clause.width] = layers[clause.width]! & clause.accepted;
      let closure = universe;
      for (let b = 1; b <= q; b++) {
        closure &= layers[b]!;
        if (closure === relation) {
          // Integer equivalent of size <= 2^(q-q/b); no floating-point rounding.
          check(BigInt(size) ** BigInt(b) <= 2n ** BigInt(q * (b - 1)), `coding bound q=${q}, b=${b}`);
          maxSize[b] = Math.max(maxSize[b]!, size);
          definableCounts[b] = definableCounts[b]! + 1;
        }
      }
      checkedSets++;
    }
    checkedSets++; // Include the empty subset for this q.
    rows.push({ q, subsetsChecked: 2 ** evenAssignments.length, maximumByWidth: maxSize.slice(1), definableCountsByWidth: definableCounts.slice(1) });
  }
  // Critical negative control: two-junta constraints can share several same-parity inputs.
  check(rows[3]!.maximumByWidth[1] === 4, "two-local equality-pairs negative control");
  return { checkedSets, rows };
}

const report = {
  status: "PASS",
  scope: "Finite exhaustive audits only; asymptotic arguments are in U40 and U41.",
  arithmetic: "Exact bounded integer graph arithmetic; arbitrary-precision bigint truth tables and inequalities.",
  kernels: auditKernels(),
  parityCNFs: auditParityCNFs(),
};
console.log(JSON.stringify(report, null, 2));
