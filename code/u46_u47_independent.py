"""Independent cofactor/partition class and NPN-orbit certificate audit.

Uses exact NumPy bit operations and subset closure, not TS ternary enumeration.
The recorded TS data is read only for a final comparison after deriving results.
"""
from __future__ import annotations
import hashlib
import itertools
import json
from pathlib import Path
import platform
import numpy as np

ROOT = Path(__file__).resolve().parents[1]

def cofactors(f: int, n: int, i: int) -> tuple[int, int]:
    out = [0, 0]
    other = [j for j in range(n) if j != i]
    for x in range(1 << (n-1)):
        p = sum(((x >> j) & 1) << b for j, b in enumerate(other))
        for v in range(2):
            out[v] |= ((f >> (p | (v << i))) & 1) << x
    return out[0], out[1]

def op(a: int, b: int, g: int, n: int) -> int:
    return sum(((g >> (2*((a >> x)&1) + ((b >> x)&1)))&1) << x
               for x in range(1 << n))

# Three-input two-gate characterization, independent of minimum-size DP.
c2 = {f for f in range(256) if any(
    l in (0,15) or h in (0,15) or l == h or l == (15 ^ h)
    for l,h in [cofactors(f,3,i) for i in range(3)])}
base3 = [0,255,170,204,240]
one3 = {f for f in range(256) if sum(cofactors(f,3,i)[0] != cofactors(f,3,i)[1]
                                   for i in range(3)) <= 2}
c3 = {op(a,b,g,3) for a,b in itertools.chain(itertools.product(c2,base3),
              itertools.product(one3,one3)) for g in range(16)}
# Functions depending on at most three original inputs.
low_arity = set()
for unused in range(4):
    axes = [i for i in range(4) if i != unused]
    for f in c3:
        low_arity.add(sum(((f >> sum(((x>>i)&1)<<j for j,i in enumerate(axes)))&1)<<x
                         for x in range(16)))
all_f = np.arange(65536, dtype=np.uint32)
accepted = np.zeros(65536,dtype=np.bool_)
accepted[list(low_arity)] = True
c2_lookup = np.array([f in c2 for f in range(256)],dtype=np.bool_)
# A three-gate circuit with four essential inputs is read-once.
# Chain split: one input and a two-gate three-input function.
for i in range(4):
    axes = [j for j in range(4) if j != i]
    l = np.zeros(65536,dtype=np.uint32)
    h = l.copy()
    for x in range(8):
        p = sum(((x>>j)&1)<<b for j,b in enumerate(axes))
        l |= ((all_f>>p)&1)<<x
        h |= ((all_f>>(p|(1<<i)))&1)<<x
    accepted |= (c2_lookup[l] & ((l==h)|(l==(255^h))|(h==0)|(h==255)))
    accepted |= (c2_lookup[h] & ((l==0)|(l==255)))

def at_most_two(values: list[np.ndarray]) -> np.ndarray:
    unique = np.ones(65536,dtype=np.uint8)
    for j in range(1,len(values)):
        new = np.ones(65536,dtype=np.bool_)
        for i in range(j):
            new &= values[j] != values[i]
        unique += new.astype(np.uint8)
    return unique <= 2

# Balanced split: both the row and column multiplicities are at most two.
for right in (1,2,3):
    a = [0,right]
    b = [i for i in range(4) if i not in a]
    rows = []
    cols = []
    for u in range(4):
        row = np.zeros(65536,dtype=np.uint32)
        col = row.copy()
        for v in range(4):
            p = sum(((u>>j)&1)<<i for j,i in enumerate(a)) | sum(((v>>j)&1)<<i for j,i in enumerate(b))
            q = sum(((v>>j)&1)<<i for j,i in enumerate(a)) | sum(((u>>j)&1)<<i for j,i in enumerate(b))
            row |= ((all_f>>p)&1)<<v
            col |= ((all_f>>q)&1)<<v
        rows.append(row);cols.append(col)
    accepted |= at_most_two(rows) & at_most_two(cols)
members = np.flatnonzero(accepted).astype(np.uint32)
# NPN maps permute the original four inputs, negate them, and complement output.
maps = np.array([[sum(((x>>j)&1)<<p[j] for j in range(4)) ^ flip for x in range(16)]
                 for p in itertools.permutations(range(4)) for flip in range(16)],dtype=np.uint32)
unseen = np.ones(65536,dtype=np.bool_)
weights = np.array([i.bit_count() for i in range(65536)],dtype=np.uint8)
minima = np.full(65536,255,dtype=np.uint8)
orbit_rows = []
while unseen.any():
    f = int(np.flatnonzero(unseen)[0])
    transforms = np.bitwise_or.reduce((((f>>maps)&1)<<np.arange(16,dtype=np.uint32)),axis=1)
    orbit = np.unique(np.concatenate((transforms,65535^transforms)))
    assert unseen[orbit].all(), "orbits overlap"
    unseen[orbit] = False
    assert np.all(accepted[orbit]==accepted[f]), "class not NPN invariant"
    if accepted[f]:
        orbit_rows.append({'representative':f,'size':int(orbit.size),'member':True})
        continue
    good = np.zeros(65536,dtype=np.bool_)
    good[65535^(members^f)] = True
    # All subsets of an agreement set are consistent partial tables.
    for i in range(16):
        view = good.reshape(-1,2,1<<i)
        view[:,0,:] |= view[:,1,:]
    bad = np.flatnonzero(~good)
    minimum = int(weights[bad].min())
    minima[orbit] = minimum
    best = int(bad[weights[bad]==minimum][0])
    assert not np.any(((members^f)&best)==0), "invalid independent certificate"
    orbit_rows.append({'representative':f,'size':int(orbit.size),'member':False,
                       'minimum':minimum,'firstMask':best,'inconsistentMasks':int(bad.size)})
# Comparison occurs only after independently computing the class and all minima.
recorded = json.loads((ROOT/'research/validation/u46_u47_results.json').read_text())
ts = recorded['finite'][1]
assert members.tolist() == ts['members'], 'independent cofactor vs DAG class mismatch'
assert minima.tolist() == ts['minimumPoints'], 'all-function minimum comparison failed'
greedy = recorded['summary']['greedy']
f = greedy['target']; mask = greedy['prime']['mask']
assert not np.any(((members^f)&mask)==0)
for i in range(16):
    if (mask>>i)&1:
        assert np.any(((members^f)&(mask&~(1<<i)))==0)
assert not np.any(((members^f)&greedy['minimumMask'])==0)
values,counts = np.unique(minima[minima!=255],return_counts=True)
result = {'status':'pass','python':platform.python_version(),'numpy':np.__version__,
          'independentThreeInputCounts':{'one':len(one3),'two':len(c2),'three':len(c3)},
          'fourInputClassCount':int(members.size),'classSum':int(members.sum()),
          'classSquareSum':sum(int(f)**2 for f in members),'classIndicatorSha256':hashlib.sha256(accepted.astype(np.uint8).tobytes()).hexdigest(),
          'orbitCount':len(orbit_rows),'functionsCovered':sum(row['size'] for row in orbit_rows),
          'minimumHistogram':{str(int(v)):int(c) for v,c in zip(values,counts)},
          'minimumComparison':'all 65536 functions match independently',
          'greedyCounterexampleVerified':True,'orbits':orbit_rows}
print(json.dumps(result,indent=2))
