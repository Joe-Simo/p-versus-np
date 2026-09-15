"""Independent finite checks. Constructs evidence before comparing TypeScript output.
All adaptive distinct-read trees on four bits are enumerated. Circuit truth
vectors use tuples and direct per-input Boolean operation evaluation rather
than TypeScript's packed operation table. No theorem follows from finite tests.
"""
from collections import Counter
from fractions import Fraction
from itertools import product
from math import comb
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

def trees(available, depth):
    if depth == 0:
        return [None]
    out = []
    for x in available:
        children = trees(tuple(y for y in available if y != x), depth - 1)
        out.extend((x, a, b) for a in children for b in children)
    return out

def read_tree(tree, value):
    total = 0
    while tree is not None:
        x, a, b = tree
        bit = (value >> x) & 1
        total += bit
        tree = b if bit else a
    return total

def adaptive_audit():
    rows = []
    pairs = 0
    for k in range(5):
        family = trees((0, 1, 2, 3), k)
        for tree in family:
            hist = Counter()
            for value in range(16):
                hist[value.bit_count(), read_tree(tree, value)] += 1
                pairs += 1
            for w in range(5):
                for x in range(5):
                    expected = (comb(k, x) * comb(4-k, w-x)
                                if 0 <= x <= k and 0 <= w-x <= 4-k else 0)
                    assert hist[w, x] == expected
        rows.append({'queries': k, 'trees': len(family)})
    return {'inputTreePairs': pairs, 'rows': rows}

def direct_distribution(n, size):
    points = tuple(product((0, 1), repeat=n))
    # Index conventions: primary i is the i-th low-order bit of the address.
    primary = [tuple(0 for _ in points), tuple(1 for _ in points)]
    primary += [tuple((x >> i) & 1 for x in range(2**n)) for i in range(n)]
    gate_lists = 0
    histogram = Counter()
    def visit(signals, left):
        nonlocal gate_lists
        if left == 0:
            gate_lists += 1
            for vector in signals:
                value = sum(bit << x for x, bit in enumerate(vector))
                histogram[value] += 1
            return
        for a, b in product(signals, repeat=2):
            for operation in product((0, 1), repeat=4):
                vector = tuple(operation[x+2*y] for x, y in zip(a, b))
                visit(signals + [vector], left - 1)
    visit(primary, size)
    return histogram, gate_lists

def halving_audit(histogram):
    n, domain = 3, 8
    rows = []
    for kind in ('descriptions', 'functions', 'perturbed'):
        for f in range(256):
            mask, samples, steps = 0, [], []
            while True:
                active = {g: (1 if kind == 'functions' else w)
                          for g, w in histogram.items() if (g ^ f) & mask == 0}
                if not active:
                    certificate = True
                    break
                total = sum(active.values())
                surviving = [sum(w for g, w in active.items() if (g >> x) & 1 == (f >> x) & 1)
                             for x in range(domain)]
                optimum = min(surviving)
                if optimum == total:
                    assert set(active) == {f}
                    certificate = False
                    break
                def score(x):
                    factor = (127 if (x+len(samples)) % 2 else 129) if kind == 'perturbed' else 128
                    return surviving[x] * factor
                selected = min(range(domain), key=score)
                remaining = surviving[selected]
                assert Fraction(remaining, 1) <= Fraction(129, 127)*optimum
                fallback = remaining == total
                if fallback:
                    assert 16*optimum > 15*total
                    selected = surviving.index(optimum)
                    remaining = optimum
                if 16*optimum <= 15*total:
                    assert 32*remaining <= 31*total
                steps.append(dict(selected=selected, total=total, remaining=remaining,
                                  optimum=optimum, fallback=fallback))
                assert selected not in samples
                samples.append(selected)
                mask |= 1 << selected
            assert certificate == (f not in histogram)
            rows.append(dict(kind=kind, f=f, certificate=certificate, samples=samples, steps=steps))
    return rows

def parameter_audit():
    rows = []
    for n, b in ((128,8),(256,16),(512,32),(512,48),(1024,96),(2048,192)):
        S = 2**b
        low = S//(10*n)
        h = (low+1)//n + 1
        length = (n+S+1).bit_length()
        gap = (n-b)*S - (length + S*(4+2*length))
        assert gap > 0 and 10*n*n*h > S
        rows.append((n,b,gap,str(Fraction(2**(10*b)*S, 2**n*h))))
    return rows

adaptive = adaptive_audit()
histogram, gate_lists = direct_distribution(3, 2)
assert len(histogram) == 152 and sum(histogram.values()) == 1612800
traces = halving_audit(histogram)
parameters = parameter_audit()
# The other implementation is read only after independent construction.
other = json.loads((ROOT/'research/validation/u48_u49_results.json').read_text())
other_histogram = dict(next(r for r in other['modelCounts'] if r['n']==3 and r['s']==2)['weightHistogram'])
assert dict(histogram) == other_histogram
assert traces == other['halving']['traces']
for ours, theirs in zip(parameters, other['counting']['rows']):
    n,b,gap,ratio = ours
    assert (n,b) == (theirs['n'],theirs['b'])
    assert theirs['easyFractionAtMost'] == f'2^(-{gap})'
    assert Fraction(ratio) == Fraction(theirs['unconditionedMarkov'])
result = dict(status='pass', adaptive=adaptive, rawGateLists=gate_lists,
              rawDescriptions=sum(histogram.values()), classFunctions=len(histogram),
              halvingTracesCompared=len(traces), parameterRows=len(parameters),
              perturbedFallbacks=sum(s['fallback'] for t in traces for s in t['steps']))
print(json.dumps(result, indent=2))
