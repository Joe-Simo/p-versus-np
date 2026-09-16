"""Independent U70-U71 checks: literal B2 tables, exact Fraction elimination, explicit path lists.
The TypeScript result is read only after all reference objects are constructed.
"""
from __future__ import annotations
from fractions import Fraction
from itertools import combinations, product
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

def bit(x:int,i:int)->int:return (x>>i)&1

def gatecol(t:int,a:int,b:int)->int:
    out=0
    for i in range(4):
        addr=(bit(a,i)<<1)|bit(b,i)
        out|=((t>>addr)&1)<<i
    return out

def differs(c:int,p:tuple[int,int])->bool:return bit(c,p[0])!=bit(c,p[1])
ALL=list(combinations(range(4),2))
CROSS=[(0,1),(0,3),(2,1),(2,3)]

def weight(a:int, req:list[tuple[int,int]], b:int)->int:
    return sum(all(differs(gatecol(t,a,b),p) for p in req) for t in range(16))

def gf2_count(a:int,b:int,req:list[tuple[int,int]])->tuple[bool,int,int]:
    rows=[]
    for i,j in req:
        u=(bit(a,i)<<1)|bit(b,i); v=(bit(a,j)<<1)|bit(b,j)
        rows.append((1<<u)^(1<<v)^(1<<4))
    rank=0
    for c in range(4):
        p=next((r for r in range(rank,len(rows)) if (rows[r]>>c)&1),None)
        if p is None: continue
        rows[rank],rows[p]=rows[p],rows[rank]
        for r in range(len(rows)):
            if r!=rank and ((rows[r]>>c)&1): rows[r]^=rows[rank]
        rank+=1
    if any((r&15)==0 and ((r>>4)&1) for r in rows): return False,rank,0
    return True,rank,1<<(4-rank)

local=0
for a in range(16):
  for b in range(16):
    for mask in range(64):
      req=[ALL[i] for i in range(6) if (mask>>i)&1]
      brute=weight(a,req,b)
      assert brute==gf2_count(a,b,req)[2]
      local+=1

probes=[
 (1,[(0,1)]),(1,[(0,1),(0,2)]),(1,[(0,1),(0,3)]),(1,[(0,2),(0,3)]),
 (2,[(0,1),(1,2)]),(2,[(0,1),(1,3)]),(3,[(0,2),(1,2)]),(3,[(0,3),(1,2)])
]
M=[[weight(a,D,b) for b in range(8)] for a,D in probes]
for a,D in probes:
    assert all(weight(a,D,b)==weight(a,D,b^15) for b in range(16))

def determinant(A:list[list[int]])->int:
    m=[[Fraction(x) for x in row] for row in A]; det=Fraction(1)
    n=len(m)
    for c in range(n):
        p=next((r for r in range(c,n) if m[r][c]),None)
        if p is None:return 0
        if p!=c:m[c],m[p]=m[p],m[c];det=-det
        piv=m[c][c];det*=piv
        for j in range(c,n):m[c][j]/=piv
        for r in range(c+1,n):
            f=m[r][c]
            if f:
                for j in range(c,n):m[r][j]-=f*m[c][j]
    assert det.denominator==1
    return det.numerator
assert determinant(M)==2097152
assert min(map(min,M))==4

D=[(0,1),(0,3)]; a=1
route=(weight(a,D,0),weight(a,D,2))
assert route==(8,4)

Gate=tuple[int,int]
def evalword(initial:list[int],gates:list[Gate],types:list[int])->list[int]:
    vals=list(initial)
    for (x,y),t in zip(gates,types):vals.append(gatecol(t,vals[x],vals[y]))
    return vals

def path_lists(initial:list[int],gates:list[Gate],types:list[int],start:int,p:tuple[int,int]):
    vals=evalword(initial,gates,types); memo={}
    def rec(v:int):
        if v in memo:return memo[v]
        if not differs(vals[v],p):memo[v]=[];return []
        if v<len(initial):memo[v]=[(v,)];return memo[v]
        x,y=gates[v-len(initial)];ans=[]
        if differs(vals[x],p):ans += [(v,0)+q for q in rec(x)]
        if differs(vals[y],p):ans += [(v,1)+q for q in rec(y)]
        memo[v]=ans;return ans
    return rec(start)

def dp_counts(initial:list[int],gates:list[Gate],types:list[int],p:tuple[int,int]):
    vals=evalword(initial,gates,types); pc=[1 if differs(c,p) else 0 for c in initial]
    for j,(x,y) in enumerate(gates):
        v=len(initial)+j
        if not differs(vals[v],p):pc.append(0)
        else:pc.append((pc[x] if differs(vals[x],p) else 0)+(pc[y] if differs(vals[y],p) else 0))
    return pc

def witness(initial,gates,types,A,B):
    z=1
    for p in CROSS:
        pc=dp_counts(initial,gates,types,p);z*=pc[A]+pc[B]
    return z

def brute_witness(initial,gates,types,A,B):
    z=1
    for p in CROSS:z*=len(path_lists(initial,gates,types,A,p))+len(path_lists(initial,gates,types,B,p))
    return z

cases=[
 ([0,15,12,10],[(2,3)],4,3),
 ([0,15,12,10],[(2,3),(4,2)],5,4),
 ([0,15,12,10],[(2,3),(4,2),(4,3)],5,6),
 ([0,15,12,10],[(2,2),(4,3),(4,3)],5,6),
]
words=0; mx=0
for initial,gates,A,B in cases:
    for types in product(range(16),repeat=len(gates)):
        w=witness(initial,gates,list(types),A,B); wb=brute_witness(initial,gates,list(types),A,B)
        assert w==wb
        vals=evalword(initial,gates,list(types))
        fav=all(differs(vals[A],p) or differs(vals[B],p) for p in CROSS)
        assert (w>0)==fav
        mx=max(mx,w);words+=1

reference={
 "status":"pass","localChecks":local,"probeMatrix":M,"probeDeterminant":str(determinant(M)),
 "routeCounts":list(route),"witnessWords":words,"maxWitness":str(mx)
}
ts=json.loads((ROOT/'research/validation/u70_u71_results.json').read_text())
assert ts['localChecks']==local
assert ts['probeMatrix']==M
assert ts['probeDeterminant']==str(determinant(M))
assert [ts['routeOnlyCounterexample']['side0'],ts['routeOnlyCounterexample']['side2']]==list(route)
print(json.dumps(reference,indent=2))
