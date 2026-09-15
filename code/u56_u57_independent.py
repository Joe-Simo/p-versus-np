"""Independent reference: literal row evaluations, raw-prefix moments, topology walks.
The new connected-core transform is NOT used to obtain Boolean output counts.
Only after all independent calculations is the TypeScript result read for comparison.
"""
from collections import Counter
from fractions import Fraction
from functools import lru_cache
from itertools import product
from math import comb
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

@lru_cache(maxsize=None)
def gate(g, a, b):
    return tuple((g >> (x + 2*y)) & 1 for x, y in zip(a, b, strict=True))

def initial(n):
    return [(0,)*(2**n), (1,)*(2**n)] + [tuple((x >> i)&1 for x in range(2**n)) for i in range(n)]

def encode(v):
    return sum(b << i for i, b in enumerate(v))

def raw_distributions(n):
    """Raw two-gate lists are literal; final gate summed from prefix single/pair mass."""
    v = initial(n)
    zero = Counter(v)
    one, two, singles, pairs = Counter(), Counter(), Counter(), Counter()
    count = 0
    for a, b, g in product(range(n+2), range(n+2), range(16)):
        v.append(gate(g, v[a], v[b]))
        one.update(v)
        for aa, bb, gg in product(range(n+3), range(n+3), range(16)):
            v.append(gate(gg, v[aa], v[bb]))
            count += 1
            two.update(v)
            singles.update(v)
            pairs.update(product(v, repeat=2))
            v.pop()
        v.pop()
    three = Counter({x: c*16*(n+4)**2 for x,c in singles.items()})
    for (a,b), c in pairs.items():
        for g in range(16):
            three[gate(g,a,b)] += c
    dist = []
    for counter in (zero, one, two, three):
        out = [0]*(2**(2**n))
        for f,c in counter.items():
            out[encode(f)] = c
        dist.append(out)
    return {'n':n, 'literal_two_gate_lists':count, 'distributions':dist}

def topology_walk(k, s):
    """All predecessor graphs and output pointers; gates have no role in ancestry."""
    hist = [0]*(s+1)
    cones, unfolded = [], []
    pairs = []
    lists = unfold_sum = checks = 0
    def rec(j):
        nonlocal lists, unfold_sum, checks
        if j == s:
            lists += 1
            hist[0] += k
            for root in range(s):
                L = cones[root].bit_count()
                hist[L] += 1
                unfold_sum += unfolded[root]
                for m in range(1, s+1):
                    b = s-m
                    X = sum(a >= k+b for p in pairs[b:] for a in p)
                    live_in_block = (cones[root] >> b).bit_count()
                    assert X >= live_in_block - 1
                    checks += 1
            return
        for a,b in product(range(k+j),repeat=2):
            cones.append((1 << j) | (cones[a-k] if a>=k else 0) | (cones[b-k] if b>=k else 0))
            unfolded.append(1+(unfolded[a-k] if a>=k else 0)+(unfolded[b-k] if b>=k else 0))
            pairs.append((a,b))
            rec(j+1)
            pairs.pop(); unfolded.pop(); cones.pop()
    rec(0)
    total = lists*(k+s)
    assert sum(hist)==total
    assert Fraction(unfold_sum,total)==Fraction(s,k+1)
    assert sum(i*c for i,c in enumerate(hist)) <= unfold_sum
    return {'k':k,'s':s,'topologies':lists,'output_cases':total,'live_histogram':hist,'unfolded_sum':unfold_sum,'block_edge_checks':checks}

def parent_tail(n):
    k,s = n+2,16*n
    m = s//4; start=s-m
    counts=[1]; denominator=1
    for j in range(start,s):
        hits=j-start; misses=k+start
        for _ in range(2):
            new=[0]*(len(counts)+1)
            for x,c in enumerate(counts):
                new[x]+=c*misses;new[x+1]+=c*hits
            counts=new;denominator*=k+j
    assert sum(counts)==denominator
    numerator=sum(counts[m-n:])
    assert numerator*16**m <= denominator*15**m
    assert 625 < 8*81  # (25/16)/2^(3/4) < 15/16
    return {'n':n,'s':s,'m':m,'edge_tail_numerator':numerator,'edge_tail_denominator':denominator}

def patch_audit(n):
    """Independently test truth-space point corrections and minimum separators."""
    N=2**n
    cases=0
    for old_mask in range(1,1<<N):
        for x in range(N):
            if (old_mask >> x)&1:
                continue
            choices=[J for J in range(1,1<<n) if all(((z^x)&J)!=0 for z in range(N) if (old_mask>>z)&1)]
            J=min(choices,key=lambda z:(z.bit_count(),z))
            assert J.bit_count()<=n
            delta=sum(1<<z for z in range(N) if ((z^x)&J)==0)
            assert not (delta & old_mask) and ((delta >> x)&1)
            # XOR this delta flips x and preserves all old labels, for ANY old function.
            cases+=1
    return {'n':n,'old_set_new_point_cases':cases}

raw=[raw_distributions(n) for n in (1,2,3)]
topology=[topology_walk(k,s) for k,s in [(3,1),(3,2),(3,3),(3,4),(4,3),(5,3)]]
tails=[parent_tail(n) for n in (2,3,4,8,16)]
patches=[patch_audit(n) for n in (1,2,3)]

def type_checks():
    essential=[]; local=0
    for g in range(16):
        values=[(g >> i)&1 for i in range(4)]
        dep=[any(values[x]!=values[x^(1<<i)] for x in range(4)) for i in range(2)]
        if all(dep): essential.append(g)
        for sa,sb in product((0,1),repeat=2):
            rewired=[values[(a^sa)+2*(b^sb)] for b in (0,1) for a in (0,1)]
            assert all(rewired[a+2*b]==((g >> ((a^sa)+2*(b^sb)))&1) for a,b in product((0,1),repeat=2))
            local+=1
    assert len(essential)==10
    assert sorted(set(range(16))-set(essential))==[0,3,5,10,12,15]
    rows=[]
    for n in (2,3,4,8,16):
        s=16*n
        numerator=sum(comb(s,u)*6**u*10**(s-u) for u in range(n))
        assert numerator*8**s <= 16**s*7**s
        rows.append({'n':n,'s':s,'numerator':numerator,'denominator':16**s})
    assert 13**16 < 7**16*2**15
    return {'two_input_essential_types':essential,'signed_input_truth_checks':local,'tails':rows}
types=type_checks()

# Comparison happens after constructing all independent objects.
data=json.loads((ROOT/'research/validation/u56_u57_results.json').read_text())
for row in raw:
    observed=data['finite'][row['n']-1]
    assert row['distributions']==[[int(v) for v in a] for a in observed['rawDistributions']]
for row in topology:
    k,s=row['k'],row['s']
    if s<=3:
        obs=data['finite'][k-3]
        W=[16*(k+i)**2 for i in range(s)]
        coefficients=[1]
        for w in W:
            old=coefficients;coefficients=[w*(old[j] if j<len(old) else 0)+(old[j-1] if j else 0) for j in range(len(old)+1)]
        spectrum=[coefficients[l]*sum(map(int,obs['coreDistributions'][l])) for l in range(s+1)]
        assert spectrum==[v*16**s for v in row['live_histogram']]
for a,b in zip(types['tails'],data['nearFullTail'],strict=True):
    assert a['numerator']==int(b['typeTail']['numerator']) and a['denominator']==int(b['typeTail']['denominator'])
for a,b in zip(tails,data['nearFullTail'],strict=True):
    assert a['n']==b['n']
    assert Fraction(int(b['exactTail']['numerator']),int(b['exactTail']['denominator'])) <= Fraction(a['edge_tail_numerator'],a['edge_tail_denominator'])

out={'status':'pass','raw_reference':[{'n':r['n'],'literal_two_gate_lists':r['literal_two_gate_lists'],'output_totals':[sum(x) for x in r['distributions']]} for r in raw], 'topology':topology,'parent_edge_tails':tails,'patches':patches,'gate_types':types,'all_distribution_entries_match':True}
print(json.dumps(out,indent=2))
