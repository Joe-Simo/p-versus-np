"""Independent exact checks: literal row-vector prefixes, then last-gate moments.
No sample-histogram dynamic program is used to construct the reference counts.
The TypeScript result is read only after all independent objects are computed.
"""
from collections import Counter
from functools import lru_cache
from itertools import product
from math import comb, factorial, prod
from fractions import Fraction
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]


def require(ok: bool, message: str) -> None:
    if not ok:
        raise AssertionError(message)


def inputs(n: int, points: tuple[int, ...]) -> list[tuple[int, ...]]:
    return [(0,) * len(points), (1,) * len(points)] + [tuple((p >> i) & 1 for p in points) for i in range(n)]


@lru_cache(maxsize=None)
def apply_gate(g: int, a: tuple[int, ...], b: tuple[int, ...]) -> tuple[int, ...]:
    return tuple((g >> (aa + 2 * bb)) & 1 for aa, bb in zip(a, b, strict=True))


def as_integer(v: tuple[int, ...]) -> int:
    return sum(bit << i for i, bit in enumerate(v))


def enumerate_prefix_moments(n: int) -> tuple[list[int], list[int], int]:
    """Count s=2 literally and s=3 via single/pair moments of every raw prefix."""
    v = inputs(n, tuple(range(1 << n)))
    output_two: Counter[tuple[int, ...]] = Counter()
    singles: Counter[tuple[int, ...]] = Counter()
    pairs: Counter[tuple[tuple[int, ...], tuple[int, ...]]] = Counter()
    prefixes = 0
    # No prefixes with identical signal vectors are merged in this loop.
    for a, b, g in product(range(n + 2), range(n + 2), range(16)):
        v.append(apply_gate(g, v[a], v[b]))
        for aa, bb, gg in product(range(n + 3), range(n + 3), range(16)):
            v.append(apply_gate(gg, v[aa], v[bb]))
            prefixes += 1
            output_two.update(v)
            singles.update(v)
            pairs.update(product(v, repeat=2))
            v.pop()
        v.pop()
    output_three: Counter[tuple[int, ...]] = Counter()
    for c, count in singles.items():
        output_three[c] += count * 16 * (n + 4) ** 2
    for (a, b), count in pairs.items():
        for g in range(16):
            output_three[apply_gate(g, a, b)] += count
    domain = 1 << (1 << n)
    two, three = [0] * domain, [0] * domain
    for c, count in output_two.items():
        two[as_integer(c)] = count
    for c, count in output_three.items():
        three[as_integer(c)] = count
    return two, three, prefixes


def direct_suffix(cols: list[tuple[int, ...]], y: tuple[int, ...]) -> int:
    total = 0
    for a, b, g in product(range(len(cols)), range(len(cols)), range(16)):
        total += (cols + [apply_gate(g, cols[a], cols[b])]).count(y)
    return total


def weak_compositions(total: int, width: int):
    if width == 1:
        yield (total,)
    else:
        for i in range(total + 1):
            for suffix in weak_compositions(total - i, width - 1):
                yield (i,) + suffix


def rising(a: int, r: int) -> int:
    return prod(range(a, a + r))


def copy_closed_checks():
    rows = []
    cases = [((1, 2), 2), ((1, 1, 1, 1), 4), ((1,) * 8, 8), ((3, 2, 1), 5)]
    for m, r in cases:
        k, D = sum(m), len(m)
        total = 0
        outputs = [0] * D
        states = 0
        for delta in weak_compositions(r, D):
            weight = factorial(r) // prod(factorial(d) for d in delta)
            weight *= prod(rising(mc, dc) for mc, dc in zip(m, delta, strict=True)) * rising(k, r)
            total += weight
            for y in range(D):
                outputs[y] += weight * (m[y] + delta[y])
            states += 1
        require(total == rising(k, r) ** 2, 'copy-list total')
        require(states == comb(r + D - 1, D - 1), 'composition count')
        require(all(out * k == total * (k + r) * m[y] for y, out in enumerate(outputs)), 'copy terminal mass')
        rows.append({'multiplicities': m, 'r': r, 'states': states, 'gateLists': str(total), 'outputs': list(map(str, outputs))})
    return rows


def refinement_example():
    old = inputs(2, (0,))
    new = inputs(2, (0, 1))
    old_and = sorted(old + [apply_gate(8, old[2], old[3])])
    old_or = sorted(old + [apply_gate(14, old[2], old[3])])
    new_and = sorted(new + [apply_gate(8, new[2], new[3])])
    new_or = sorted(new + [apply_gate(14, new[2], new[3])])
    require(old_and == old_or and new_and != new_or, 'refinement counterexample')
    target = (0, 1)
    require(new_and.count(target) == 1 and new_or.count(target) == 2, 'different refined counts')
    return {'oldHistogram': list(map(as_integer, old_and)), 'newAND': list(map(as_integer, new_and)), 'newOR': list(map(as_integer, new_or)), 'targetColumn': 2, 'terminalCounts': [1, 2]}


def copy_sampler_check():
    rows = []
    for initial, r, y in [((0,1),3,0), ((0,0,1),2,0), ((0,1,2,3),2,0), ((0,0,1,1),2,0), ((0,0),2,0), ((0,1),0,0)]:
        probabilities = []
        def visit(values, left, probability):
            k, m = len(values), values.count(y)
            if left == 0:
                probabilities.extend([probability / m] * m)
                return
            weights = [m + (value == y) for value in values]
            require(sum(weights) == (k + 1) * m, 'conditional weights')
            for a, b in product(range(k), repeat=2):
                visit(values + (values[a],), left - 1, probability * Fraction(weights[a], sum(weights) * k))
        visit(initial, r, Fraction(1))
        total = rising(len(initial), r) ** 2 * (len(initial) + r) * initial.count(y) // len(initial)
        require(len(probabilities) == total and set(probabilities) == {Fraction(1,total)}, 'copy uniformity')
        rows.append({'initial': initial, 'r': r, 'y': y, 'descriptions': str(total), 'probabilityOfEach': f'1/{total}'})
    return rows


def main():
    two, three, prefixes = enumerate_prefix_moments(3)
    partial = []
    for mask in range(256):
        points = tuple(i for i in range(8) if mask & (1 << i))
        counts = [0] * (1 << len(points))
        for f, mass in enumerate(two):
            counts[sum(((f >> p) & 1) << j for j, p in enumerate(points))] += mass
        partial.append(list(map(str, counts)))
    refinement = refinement_example()
    copy_rows = copy_closed_checks()
    copy_samples = copy_sampler_check()
    cols_a = [tuple((x >> j) & 1 for j in range(2)) for x in (0, 1, 2, 2, 3)]
    cols_b = [tuple((x >> j) & 1 for j in range(2)) for x in (0, 1, 2, 3, 3)]
    multiplicity_counts = [direct_suffix(cols_a, (1, 0)), direct_suffix(cols_b, (1, 0))]
    require(multiplicity_counts == [484, 464], 'multiplicity difference')
    # Independent computation complete: only now read the other implementation.
    result = json.loads((ROOT / 'research/validation/u52_u53_results.json').read_text())
    for actual, expected in zip(result['partialRows'], partial, strict=True):
        require(actual['counts'] == expected, 'partial label count comparison')
    full = {(row['n'], row['s']): row for row in result['fullRows']}
    require(full[3, 2]['counts'] == list(map(str, two)), 'two-gate distribution')
    require(full[3, 3]['counts'] == list(map(str, three)), 'three-gate distribution')
    prior = json.loads((ROOT / 'research/validation/u50_u51_final_results.json').read_text())
    require(prior['raw']['weights'] == list(map(str, two)), 'preserved U51 raw distribution')
    for row, expected in zip(result['explosionRows'], copy_rows[:3], strict=True):
        require(row['rawCopyGateLists'] == expected['gateLists'] and row['outputCounts'] == expected['outputs'], 'copy DP versus multinomial sum')
    require(json.loads(json.dumps(copy_samples)) == result['copySamplerRows'], 'conditional copy sampler comparison')
    print(json.dumps({'status': 'pass', 'independentMethod': 'literal per-row two-gate prefixes and final ordered pair moments', 'rawTwoGatePrefixes': prefixes, 'partialLabelCases': sum(len(p) for p in partial), 'threeGateOutputDescriptions': str(sum(three)), 'parityCounts': [str(two[150]), str(three[150])], 'multiplicityCounts': multiplicity_counts, 'sampleRefinementCounterexample': refinement, 'copyClosedFormChecks': copy_rows, 'conditionalCopySampler': copy_samples}, indent=2))


if __name__ == '__main__':
    main()
