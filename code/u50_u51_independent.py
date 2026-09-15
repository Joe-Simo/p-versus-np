"""Independent exact finite reconstruction; standard library only.

The raw two-gate enumerator evaluates each assignment explicitly.  Components
are built by pairwise description differences, rather than deletion-signature
hashing.  The prefix sampler uses rational probabilities and explicit sets;
its count oracle is NOT claimed computationally cheap for arbitrary circuits.
"""
from collections import Counter
from fractions import Fraction
from itertools import combinations, product
import json
from pathlib import Path


def table_op(g, a, b, n):
    return sum(((g >> (((a >> x) & 1) + 2 * ((b >> x) & 1))) & 1) << x
               for x in range(1 << n))


def parity(n):
    return sum((x.bit_count() & 1) << x for x in range(1 << n))


def raw_two_gates(n):
    base = [0, (1 << (1 << n)) - 1] + [
        sum(((x >> i) & 1) << x for x in range(1 << n)) for i in range(n)]
    weights = Counter()
    feasible = []
    target = parity(n)
    for a, b, op in product(range(n + 2), range(n + 2), range(16)):
        va = table_op(op, base[a], base[b], n)
        v = base + [va]
        for c, d, gp in product(range(n + 3), range(n + 3), range(16)):
            vb = table_op(gp, v[c], v[d], n)
            for out, f in enumerate(v + [vb]):
                weights[f] += 1
                if f == target:
                    feasible.append(((op, a, b), (gp, c, d), out))
    return weights, feasible


def pairwise_components(descs, blocks=1):
    neighbors = [[] for _ in descs]
    edges = 0
    for i, a in enumerate(descs):
        for j in range(i):
            b = descs[j]
            if sum(x != y for x, y in zip(a, b)) <= blocks:
                neighbors[i].append(j)
                neighbors[j].append(i)
                edges += 1
    remaining = set(range(len(descs)))
    sizes = []
    while remaining:
        root = remaining.pop()
        todo, count = [root], 0
        while todo:
            v = todo.pop()
            count += 1
            for u in neighbors[v]:
                if u in remaining:
                    remaining.remove(u)
                    todo.append(u)
        sizes.append(count)
    return {"count": len(sizes), "sizes": sorted(Counter(sizes).items()), "edges": edges}


def unordered_histories(n):
    """Unordered merge trees, then all orientations and even gate signs."""
    topologies = []

    def visit(active, gs):
        if len(active) == 1:
            topologies.append(tuple(gs))
            return
        for a, b in combinations(active, 2):
            visit(tuple(x for x in active if x not in (a, b)) + (n + 2 + len(gs),), gs + [(a, b)])
    visit(tuple(range(2, n + 2)), [])
    descs = []
    for top in topologies:
        for orient in product(range(2), repeat=n-1):
            for signs in product(range(2), repeat=n-2):
                signs = signs + (sum(signs) % 2,)
                gs = []
                for (a, b), o, sign in zip(top, orient, signs):
                    gs.append((9 if sign else 6, b if o else a, a if o else b))
                descs.append(tuple(gs) + (2*n,))
    assert len(set(descs)) == len(descs)
    return descs


def prefix_distribution(support, width, mode):
    if not support:
        return None
    delta = Fraction(1, 64 * width)
    probabilities = {}
    def walk(prefix, depth, probability):
        if depth == width:
            assert prefix in support
            probabilities[prefix] = probability
            return
        groups = [[x for x in support if x >> (width-depth-1) == 2*prefix+b] for b in (0, 1)]
        counts = [len(g) for g in groups]
        if mode:
            estimates = [Fraction(c) * (1 + delta * (1 if (prefix+depth+b+mode) % 2 else -1)) for b, c in enumerate(counts)]
        else:
            estimates = [Fraction(c) for c in counts]
        denominator = sum(estimates)
        assert denominator > 0
        for b in (0, 1):
            if estimates[b] != 0:
                walk(2*prefix+b, depth+1, probability*estimates[b]/denominator)
    walk(0, 0, Fraction(1))
    assert sum(probabilities.values()) == 1
    assert set(probabilities) == set(support)
    tv = sum(abs(p - Fraction(1, len(support))) for p in probabilities.values()) / 2
    assert tv <= 2*width*delta/(1-delta) < Fraction(1, 16)
    if mode == 0:
        assert tv == 0
    return tv


def main():
    weights, descs = raw_two_gates(3)
    assert sum(weights.values()) == 1612800 and len(weights) == 152 and len(descs) == 24
    generated = unordered_histories(3)
    assert set(generated) == set(descs)
    graph3 = [pairwise_components(descs, b) for b in (1, 2)]
    graph4 = [pairwise_components(unordered_histories(4), b) for b in (1, 2)]
    prefix_cases = 0
    max_tv = Fraction(0)
    prefix_rows = []
    for width in range(1, 4):
        failures = 0
        for mask in range(1 << (1 << width)):
            support = [x for x in range(1 << width) if mask & (1 << x)]
            for mode in range(3):
                tv = prefix_distribution(support, width, mode)
                prefix_cases += 1
                if tv is None:
                    failures += 1
                else:
                    max_tv = max(max_tv, tv)
        prefix_rows.append({"bits": width, "sets": 1 << (1 << width), "emptyRootReturns": failures})
    # Compare only after independent reconstruction.
    root = Path(__file__).resolve().parents[1]
    observed = json.loads((root / 'research/validation/u50_u51_final_results.json').read_text())
    assert [weights.get(f, 0) for f in range(256)] == [int(w) for w in observed['raw']['weights']]
    for n, checked in ((3, graph3), (4, graph4)):
        row = next(r for r in observed['parity']['rows'] if r['n'] == n and r['s'] == n-1)
        for b, graph in zip(('oneBlock', 'twoBlock'), checked):
            assert graph['count'] == row[b]['count']
            assert [list(x) for x in graph['sizes']] == row[b]['histogram']
    for trace in observed['rejection']['traces']:
        f, prev_mass, nested_cost = trace['target'], sum(weights.values()), Fraction(1)
        for stage in trace['stages']:
            mask = stage['sample']
            mass = sum(w for g, w in weights.items() if (g ^ f) & mask == 0)
            assert mass == int(stage['mass'])
            if mass:
                nested_cost *= Fraction(prev_mass, mass)
                assert nested_cost == Fraction(sum(weights.values()), mass)
            prev_mass = mass
    result = {"status": "pass", "rawDescriptions": sum(weights.values()), "functions": len(weights),
              "n3ParityPrograms": len(descs), "n3PairwiseGraphs": graph3, "n4PairwiseGraphs": graph4,
              "prefixSamplerCases": prefix_cases, "prefixRows": prefix_rows, "maxPrefixTV": str(max_tv),
              "tracesIndependentlyReconstructed": len(observed['rejection']['traces']),
              "scope": "n=4 classification uses proved minimal-tree structure; n=3 all raw descriptions independently enumerated"}
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == '__main__':
    main()
