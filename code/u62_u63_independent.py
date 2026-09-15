"""Independent U62-U63 finite checks using explicit four-row lists.
No normalized-shape helper or TypeScript result is used to construct references.
"""
from itertools import product
import json

ROWS=((0,0),(0,1),(1,0),(1,1))

def gate(table, a, b):
    return (table >> (2*a+b)) & 1

def col_gate(table, A, B):
    return tuple(gate(table,a,b) for a,b in zip(A,B))

def normalize(C):
    return tuple(x ^ C[0] for x in C[1:])

def ivec(x):
    return tuple((x>>i)&1 for i in range(3))

local=0
for aa in range(8):
    for bb in range(8):
        local+=1
        a=ivec(aa); b=ivec(bb)
        A=(0,)+a; B=(0,)+b
        actual=[normalize(col_gate(t,A,B)) for t in range(16)]
        predicted=[]
        for alpha,beta,gamma in product((0,1), repeat=3):
            h=tuple((alpha*a[i])^(beta*b[i])^(gamma*(a[i]&b[i])) for i in range(3))
            predicted.extend([h,h])
        assert sorted(actual)==sorted(predicted), (aa,bb)

ZERO=0
AND=8
XOR=6
OR=14
T=tuple(r[1] for r in ROWS)

def restricted(m, word):
    left=word[:m]; right=word[m:]
    xs=[col_gate(ZERO if z==0 else AND,T,T) for z in left]
    ys=[col_gate(ZERO if z==0 else AND,T,T) for z in right]
    ds=[col_gate(XOR,x,y) for x,y in zip(xs,ys)]
    acc=ds[0]
    for d in ds[1:]: acc=col_gate(OR,acc,d)
    return acc

eq=[]
for m in range(1,9):
    accepted=0
    for w in product((0,1), repeat=2*m):
        out=restricted(m,w)
        good=tuple(w[:m])==tuple(w[m:])
        assert (out==(0,0,0,0))==good
        accepted += good
    assert accepted==2**m
    eq.append((m,4**m,accepted))

zero_counts=[]
for A in product((0,1), repeat=4):
    for B in product((0,1), repeat=4):
        d=len(set(zip(A,B)))
        count=sum(col_gate(t,A,B)==(0,0,0,0) for t in range(16))
        assert count==2**(4-d)
        zero_counts.append(count)

print(json.dumps({
    "status":"pass",
    "localCases":local,
    "equalityRows":eq,
    "zeroParentPairs":len(zero_counts),
    "minimumZeroGateTypes":min(zero_counts),
    "maximumZeroGateTypes":max(zero_counts),
}, indent=2))
