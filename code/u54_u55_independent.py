"""Independent U54-U55 checks: row-tuples, forward weights, rational polynomials.
Construct evidence before opening the TypeScript result. No complement quotient
or scalar backward suffix counter is used for the reference completion counts.
"""
from collections import Counter, defaultdict
from fractions import Fraction
from functools import lru_cache
from itertools import product
from math import comb, factorial
from pathlib import Path
import json


def operation(g, a, b):
    return tuple((g >> (x + 2 * y)) & 1 for x, y in zip(a, b))


def raw_rows(n, s):
    # Two actual examples: all-zero and the point with input coordinate zero set.
    values = [(0, 0), (1, 1)] + [(0, int(i == 0)) for i in range(n)]
    counts = Counter()
    lists = 0

    def rec(r):
        nonlocal lists
        if not r:
            lists += 1
            counts.update(values)
            return
        k = len(values)
        for i, j, g in product(range(k), range(k), range(16)):
            values.append(operation(g, values[i], values[j]))
            rec(r - 1)
            values.pop()

    rec(s)
    return {"n": n, "s": s, "lists": lists,
            "counts": [counts[(c & 1, (c >> 1) & 1)] for c in range(4)]}


columns = list(product(range(2), repeat=2))
# Match the declared little-endian convention, rather than tuple lexical order.
columns = [(c & 1, (c >> 1) & 1) for c in range(4)]
pair_rates = {}
for a, b in product(range(4), repeat=2):
    rate = Counter(operation(g, columns[a], columns[b]) for g in range(16))
    pair_rates[a, b] = [rate[v] for v in columns]


def forward(m, r):
    """Literal weighted four-column histogram evolution, not a moment closure."""
    current = {tuple(m): 1}
    for _ in range(r):
        nxt = defaultdict(int)
        for h, mass in current.items():
            for a, b in product(range(4), repeat=2):
                for z, types in enumerate(pair_rates[a, b]):
                    if types and h[a] and h[b]:
                        child = list(h)
                        child[z] += 1
                        nxt[tuple(child)] += mass * h[a] * h[b] * types
        current = nxt
    return [sum(w * h[y] for h, w in current.items()) for y in range(4)]


def moment_rows():
    rows = []
    for d in range(1, 6):
        hs = [(2+j, 0, d+2-j, 1) for j in range(d+2)]
        degree_checks = 0
        for e in product(range(d+1), repeat=4):
            if sum(e) > d:
                continue
            v = 0
            for j, h in enumerate(hs):
                p = 1
                for a, b in zip(h, e):
                    p *= a ** b
                v += (-1) ** j * comb(d+1, j) * p
            assert v == 0
            degree_checks += 1
        counts = [forward(h, d)[0] for h in hs]
        gap = sum(Fraction((-1) ** j * comb(d+1, j), 2**d) * c
                  for j, c in enumerate(counts))
        expected = (-1)**(d+1) * factorial(d+1) * factorial(d) * 2**(2*d-1)
        assert gap == expected
        rows.append({"d": d, "moments": degree_checks,
                     "counts": counts, "gap": int(gap)})
    return rows


@lru_cache(None)
def polynomial(k, r):
    """E[C_r | C_0=x] as rational coefficients; no numerical interpolation."""
    if r == 0:
        return (Fraction(0), Fraction(1))
    f = polynomial(k+1, r-1)
    delta = [Fraction(0)] * (len(f)-1)
    for i in range(1, len(f)):
        for j in range(i):
            delta[j] += f[i] * comb(i, j)
    out = list(f) + [Fraction(0)]
    for j, a in enumerate(delta):
        out[j] += a / 2
        out[j+2] += a / (2*k*k)
    return tuple(out)


def symmetry_check():
    pairs = 0
    for q in range(1, 6):
        cs = list(product(range(2), repeat=q))
        for a, b in product(cs, repeat=2):
            rates = Counter(operation(g, a, b) for g in range(16))
            for aa, bb in ((tuple(1-x for x in a), b),
                           (a, tuple(1-y for y in b))):
                assert rates == Counter(operation(g, aa, bb) for g in range(16))
            for c, count in rates.items():
                assert rates[tuple(1-z for z in c)] == count
            pairs += 1
    return pairs


raw = [raw_rows(n, s) for n in (1, 2, 3) for s in (0, 1, 2)]
ms = moment_rows()
ps = []
for r in range(7):
    f = polynomial(12, r)
    rising = 1
    for j in range(r):
        rising *= 12+j
    assert len(f)-1 == r+1 and f[-1] == Fraction(factorial(r), 2**r*rising*rising)
    ps.append({"r": r, "degree": len(f)-1, "leading": str(f[-1])})
pairs = symmetry_check()

# Compare only AFTER constructing the independent data.
root = Path(__file__).resolve().parents[1]
ts = json.loads((root/'research/validation/u54_u55_final_results.json').read_text())
for r in raw:
    qrow = next(x for x in ts['quotient']['rows'] if x['n'] == r['n'] and x['s'] == r['s'])
    assert qrow['rawLists'] == r['lists']
    for row in ts['sampler']['rows']:
        if row['n'] == r['n'] and row['s'] == r['s']:
            assert int(row['count']) == r['counts'][row['y']]
for r in ms:
    row = next(x for x in ts['moments']['rows'] if x['d'] == r['d'])
    assert list(map(int, row['counts'])) == r['counts']
    assert int(row['gapsBySuffixLength'][-1]) == r['gap']
print(json.dumps({"status": "pass", "rawRows": raw, "moments": ms,
                  "polynomials": ps, "complementPairTests": pairs,
                  "comparedAfterConstruction": True}, indent=2))
