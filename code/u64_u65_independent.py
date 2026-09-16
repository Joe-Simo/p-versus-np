"""Independent U64-U65 checks using tuple columns and literal truth tables.
The TypeScript result is read only after all reference objects are constructed.
"""
from __future__ import annotations
from itertools import product
from pathlib import Path
import json, random


def canon(xs):
    d={}; out=[]
    for x in xs:
        if x not in d: d[x]=len(d)
        out.append(d[x])
    return tuple(out)

def parts(n):
    return sorted({canon(x) for x in product(range(n), repeat=n)})

def bparts(n):
    return [(0,)+tail for tail in product((0,1), repeat=n-1)]

def refines(p,q):
    return all(p[i]!=p[j] or q[i]==q[j] for i in range(len(p)) for j in range(i+1,len(p)))

def meet(p,q): return canon([(p[i],q[i]) for i in range(len(p))])

def compressible(p,q,t):
    for a in bparts(len(p)):
        if not refines(p,a): continue
        for b in bparts(len(p)):
            if refines(q,b) and refines(meet(a,b),t): return True
    return False

compression={}
for n in range(1,5):
    c=0
    for p in parts(n):
        for q in parts(n):
            m=meet(p,q)
            for t in bparts(n):
                if refines(m,t):
                    c+=1
                    assert compressible(p,q,t)
    compression[str(n)]=c

p5=(0,0,0,1,1); q5=(0,1,2,0,1); t5=(0,0,1,0,1)
assert refines(meet(p5,q5),t5) and not compressible(p5,q5,t5)


# Balanced four-row normalized target: nonlinear uv term changes multiplicity, not support.
def span3(gs):
    out={0}
    for g in gs: out |= {x^g for x in list(out)}
    return out
def rank3(gs): return (len(span3(gs))).bit_length()-1
balanced=[]
for y in (0b011,0b101,0b110):
    hist={1:0,2:0,4:0}; fav=0
    for a in range(8):
        for b in range(8):
            full=y in span3((a,b,a&b)); aff=y in span3((a,b))
            assert full==aff
            if full:
                fav+=1; hist[1 << (3-rank3((a,b,a&b)))] += 1
    assert fav==21 and hist=={1:6,2:12,4:3}
    balanced.append({"targetShape":y,"favorablePairs":fav,"hist":hist})

# Literal gate tables: t's low bits are outputs on 00,01,10,11.
def gate(t,a,b):
    return tuple((t >> ((x<<1)|y)) & 1 for x,y in zip(a,b))

P=(0,0,0,1,1)
Q1=(0,0,1,0,0)
Q2=(0,1,0,0,1)
T=(0,0,1,0,1)
assert len(set(zip(P,Q1,Q2)))==5
bad=[]; good=[]
for f in range(16):
    h_bad=gate(f,Q1,Q2)
    h_good=gate(f,P,Q2)
    for g in range(16):
        if gate(g,P,h_bad)==T: bad.append((f,g,h_bad))
        if gate(g,h_good,Q1)==T: good.append((f,g,h_good))
assert len(bad)==0 and len(good)==4
assert gate(7,P,Q2)==(1,1,1,1,0)
assert gate(11,gate(7,P,Q2),Q1)==T

# Separate brute random small-topology criterion check using literal tuples.
def eval_top(leaves, gates, types):
    vals=list(leaves)
    for (a,b),t in zip(gates,types): vals.append(gate(t,vals[a],vals[b]))
    return vals

def reachable_leaves(k,gates,out):
    seen=set(); stack=[out]; leaves=set()
    while stack:
        v=stack.pop()
        if v in seen: continue
        seen.add(v)
        if v<k: leaves.add(v)
        else: stack.extend(gates[v-k])
    return sorted(leaves)

def criterion(leaves, idxs, target):
    q=len(target)
    for i in range(q):
        for j in range(i+1,q):
            if all(leaves[z][i]==leaves[z][j] for z in idxs) and target[i]!=target[j]: return False
    return True

def brute_set(leaves,gates):
    out=set(); q=len(leaves[0]); assert len(gates)<=3
    for types in product(range(16), repeat=len(gates)):
        out.add(eval_top(leaves,gates,types)[-1])
    return out

rng=random.Random(64065)
random_cases=0
for q in range(1,5):
    for _ in range(80):
        k=rng.choice((2,3))
        leaves=[tuple(rng.randrange(2) for _ in range(q)) for _ in range(k)]
        s=rng.choice((1,2,3))
        gates=[]
        for j in range(s):
            m=k+j; gates.append((rng.randrange(m),rng.randrange(m)))
        idxs=reachable_leaves(k,gates,k+s-1)
        got=brute_set(leaves,gates)
        expected={t for t in product((0,1),repeat=q) if criterion(leaves,idxs,t)}
        assert got==expected
        random_cases+=1


# Same reachable leaf information, same budget, different exact completion counts.
A4=(0,0,1,1); B4=(0,1,0,1); Y4=(0,1,1,0)
def count2(topo):
    c=0
    for f,g in product(range(16),repeat=2):
        vals=[A4,B4]
        vals.append(gate(f,vals[topo[0][0]],vals[topo[0][1]]))
        vals.append(gate(g,vals[topo[1][0]],vals[topo[1][1]]))
        c += vals[-1]==Y4
    return c
countA=count2(((0,1),(2,2))); countB=count2(((0,1),(0,2)))
assert (countA,countB)==(8,4)

reference={
    "status":"pass",
    "compressionByQ":compression,
    "compressionTotal":sum(compression.values()),
    "balancedSupport":balanced,
    "fiveRow":{"bad":len(bad),"good":len(good),"firstGood":list(good[0][:2]),"distinctLeafTuples":len(set(zip(P,Q1,Q2)))},
    "randomTopologyCases":random_cases,
    "countSeparation":[countA,countB],
}

# Compare only after independent construction.
main=json.loads(Path('/mnt/data/02-p-versus-np/research/validation/u64_u65_results.json').read_text())
assert main['compressionByQ']==compression
assert main['compressionCases']==reference['compressionTotal']
assert main['fiveRow']['badTopology']['count']==0
assert main['fiveRow']['goodTopology']['count']==len(good)
assert [r['favorablePairs'] for r in main['balancedSupport']]==[21,21,21]
assert [main['countSeparation']['topologyA']['count'],main['countSeparation']['topologyB']['count']]==[8,4]
print(json.dumps(reference,indent=2))
