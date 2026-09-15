"""Independent U60-U61 checks: per-row truth tables, backward reachability,
explicit path families, and rational prefix laws. No frontier quotient builds
reference counts; saved TypeScript results are read only after construction.
"""
from itertools import product
from fractions import Fraction
from pathlib import Path
import json


def value(g, a, b):
    return (g >> (a + 2 * b)) & 1


def tuple_column(v, q):
    return tuple((v >> i) & 1 for i in range(q))


def vector_number(v):
    return sum(b << i for i, b in enumerate(v))


def raw_counts(initial, topology, q, affine=False):
    types = [tuple((g >> j) & 1 for j in range(4)) for g in range(16)
             if not affine or g.bit_count() % 2 == 0]
    result = [0] * (1 << q)
    for gs in product(types, repeat=len(topology)):
        rows = []
        for r in range(q):
            signals = [(v >> r) & 1 for v in initial]
            for table, (a, b) in zip(gs, topology):
                signals.append(table[signals[a] + 2 * signals[b]])
            rows.append(signals[-1])
        result[vector_number(rows)] += 1
    return result


def source_colors(initial):
    return [((v >> 1) ^ (3 if v & 1 else 0)) for v in initial]


def backward_colors(initial, topology, word):
    k = len(initial)
    colors = source_colors(initial)
    active = [k + len(topology) - 1]
    visited, result = set(), set()
    while active:
        node = active.pop()
        if node in visited:
            continue
        visited.add(node)
        if node < k:
            if colors[node]:
                result.add(colors[node])
        elif (word >> (node - k)) & 1:
            active.extend(topology[node - k])
    return result


def path_masks(initial, topology):
    """Enumerate distinct required-site sets of paths, grouped by source color."""
    k = len(initial)
    colors = source_colors(initial)
    grouped = {c: set() for c in (1, 2, 3)}

    def walk(node, sites):
        if node < k:
            if colors[node]:
                grouped[colors[node]].add(sites)
            return
        sites |= 1 << (node - k)
        for parent in set(topology[node - k]):
            walk(parent, sites)

    walk(k + len(topology) - 1, 0)
    return grouped


def gf2_rank(rows):
    basis = {}
    for row in rows:
        row = list(row)
        while any(row):
            p = row.index(1)
            if p not in basis:
                basis[p] = row
                break
            row = [a ^ b for a, b in zip(row, basis[p])]
    return len(basis)


local_pairs = 0
for q in range(1, 4):
    for a in product((0, 1), repeat=q):
        for b in product((0, 1), repeat=q):
            restrictions = set(zip(a, b))
            matrix = [(1, u, v) for u, v in restrictions]
            assert gf2_rank(matrix) == len(restrictions)
            full, affine = {}, {}
            for g in range(16):
                col = tuple(value(g, u, v) for u, v in zip(a, b))
                full[col] = full.get(col, 0) + 1
                if g.bit_count() % 2 == 0:
                    affine[col] = affine.get(col, 0) + 1
            assert full == {v: 2 * m for v, m in affine.items()}
            local_pairs += 1

fixtures = [
    ("shared-diamond", [0, 7, 2], 3, [(2, 2), (3, 3), (3, 3), (4, 5)]),
    ("three-row-reconvergence", [0, 7, 2, 4], 3, [(2, 3), (4, 2), (4, 3), (5, 6)]),
    ("four-row-nonlinearity", [0, 15, 10, 12], 4, [(2, 3)]),
    ("five-row-joint", [0, 31, 10, 12], 5, [(2, 3), (4, 2), (4, 3), (5, 6)]),
    ("repeated-conflicting-rows", [0, 7, 0], 3, [(2, 2), (3, 3)])
]
raw_rows, colored_rows, sampling_rows = [], [], []
raw_assignments = 0
word_checks = 0
for name, initial, q, topology in fixtures:
    counts = raw_counts(initial, topology, q)
    raw_assignments += 16 ** len(topology)
    if q == 3:
        affine = raw_counts(initial, topology, q, True)
        assert counts == [x * 2 ** len(topology) for x in affine]
    raw_rows.append(dict(name=name, counts=[str(x) for x in counts]))

color_fixtures = [f for f in fixtures if f[2] == 3]
for h in range(6):
    t, current = [], 1
    for j in range(h):
        t.append((current, current))
        current = 2 + j
    t.append((0, current))
    color_fixtures.append((f"rare-chain-{h}", [1, 4], 3, t))

for name, initial, _, topology in color_fixtures:
    paths = path_masks(initial, topology)
    colors_to_check = [2] if name.startswith("rare-chain") else [1, 2, 3]
    for c in colors_to_check:
        accepted, weights = [], {}
        for word in range(2 ** len(topology)):
            reached = backward_colors(initial, topology, word)
            w = 2 if reached == {c} else 1 if len(reached) >= 2 else 0
            by_paths = {d for d in (1, 2, 3) if any(word & p == p for p in paths[d])}
            assert by_paths == reached
            other = {1, 2, 3} - {c}
            event = c in by_paths or other <= by_paths
            assert event == (w > 0)
            if event:
                accepted.append(word)
                weights[word] = w
            word_checks += 1
        color_mass = sum(weights.values())
        count = 2 ** (3 * len(topology) - 2) * color_mass
        row = dict(name=name, color=c, acceptedWords=str(len(accepted)),
                   weightSum=str(color_mass), countPerOrientation=str(count))
        colored_rows.append(row)
        if not accepted:
            continue
        # Exact rational model of accurate but perturbed prefix estimates.
        # This does not call or implement a general #NFA FPRAS.
        eta = Fraction(1, 256 * max(1, len(topology)))
        law = {0: Fraction(1)}
        for j in range(len(topology)):
            new = {}
            for prefix, probability in law.items():
                sizes = [sum((a & ((1 << (j+1))-1)) == prefix + (b << j) for a in accepted)
                         for b in (0, 1)]
                estimated = [sizes[0] * (1 + eta), sizes[1] * (1 - eta)]
                denominator = sum(estimated)
                assert denominator > 0
                for b in (0, 1):
                    if sizes[b]:
                        new[prefix + (b << j)] = probability * estimated[b] / denominator
            law = new
        assert set(law) == set(accepted)
        uniform = Fraction(1, len(accepted))
        tv = sum(abs(law[a] - uniform) for a in accepted) / 2
        expectation = sum(law[a] * weights[a] for a in accepted)
        mu = Fraction(color_mass, len(accepted))
        assert Fraction(1) <= mu <= 2
        assert tv <= len(topology) * eta / (1 - eta)
        assert abs(expectation - mu) <= tv
        sampling_rows.append(dict(name=name, color=c, tv=str(tv),
                                  exactMean=str(mu), perturbedMean=str(expectation)))

# Independently verify the four-row threshold and all <=3-row marginals.
full4 = raw_counts([10, 12], [(0, 1)], 4)
aff4 = raw_counts([10, 12], [(0, 1)], 4, True)
assert full4[8] == 1 and aff4[8] == 0
for subset in range(16):
    if subset.bit_count() <= 3:
        for label in range(16):
            assert sum(full4[x] for x in range(16) if x & subset == label) == 2 * sum(
                aff4[x] for x in range(16) if x & subset == label)

# Load main-run results only after all reference objects above are complete.
base = Path(__file__).resolve().parents[1]
main = json.loads((base / "research/validation/u60_u61_results.json").read_text())
main_raw = {x["name"]: x["counts"] for x in main["sampleRows"]}
for row in raw_rows:
    if row["name"] in main_raw:
        assert row["counts"] == main_raw[row["name"]]
main_color = {(f["name"], x["color"]): x for f in main["colored"]["rows"] for x in f["rows"]}
for row in colored_rows:
    target = main_color[(row["name"], row["color"])]
    for field in ("acceptedWords", "weightSum", "countPerOrientation"):
        assert row[field] == target[field]
print(json.dumps(dict(status="pass", localAffineRankCases=local_pairs,
                      literalTypeAssignments=raw_assignments, sitePathWordChecks=word_checks,
                      rawRows=raw_rows, coloredRows=colored_rows,
                      rationalPrefixCases=sampling_rows,
                      scope="independent finite implementations; source #NFA FPRAS not implemented"), indent=2))
