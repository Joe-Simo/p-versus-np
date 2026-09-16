"""Independent U66-U67 reference: forward sampled-column mass expansion and literal raw enumeration.
No variable-elimination tables are used to construct reference counts. The TypeScript result is read only after all independent calculations.
"""
from __future__ import annotations
from collections import defaultdict
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]

def bit(x:int,i:int)->int:return (x>>i)&1
def gbit(tt:int,a:int,b:int)->int:return (tt>>(a+2*b))&1
def gate(tt:int,a:int,b:int,q:int)->int:
    return sum(gbit(tt,bit(a,i),bit(b,i))<<i for i in range(q))
def mult(a:int,b:int,h:int,q:int)->int:
    seen={}
    for i in range(q):
        p=(bit(a,i),bit(b,i)); z=bit(h,i)
        if p in seen and seen[p]!=z:return 0
        seen[p]=z
    return 1<<(4-len(seen))
def type_count(a:int,b:int,h:int,q:int)->int:
    return sum(gate(tt,a,b,q)==h for tt in range(16))

def forward_count(q:int,initial:list[int],gates:list[tuple[int,int]],output:int,target:int)->int:
    k=len(initial)
    states={():1}
    for j,(pa,pb) in enumerate(gates):
        nxt=defaultdict(int)
        for cols,w in states.items():
            def col(sig:int)->int:
                return initial[sig] if sig<k else cols[sig-k]
            a,b=col(pa),col(pb)
            for h in range(1<<q):
                m=mult(a,b,h,q)
                if m:nxt[cols+(h,)]+=w*m
        states=nxt
    if output<k:return (16**len(gates) if initial[output]==target else 0)
    return sum(w for cols,w in states.items() if cols[output-k]==target)

def brute(q:int,initial:list[int],gates:list[tuple[int,int]],output:int,target:int)->int:
    s=len(gates); k=len(initial); ans=0
    for code in range(16**s):
        x=code; sig=initial[:]
        for a,b in gates:
            tt=x&15;x>>=4;sig.append(gate(tt,sig[a],sig[b],q))
        ans+=sig[output]==target
    return ans

def norm(c:int,q=4)->int:
    r=bit(c,0)
    return sum((bit(c,i)^r)<<(i-1) for i in range(1,q))
def favorable(a:int,b:int,y:int)->bool:
    a,b=norm(a),norm(b)
    return a==y or b==y or (a^b)==y

local=0
for a in range(16):
    for b in range(16):
        for h in range(16):
            assert mult(a,b,h,4)==type_count(a,b,h,4)
            local+=1

Y=0b1100
chains=[]
for m in range(1,5):
    gates=[]
    for j in range(m):
        p=0 if j==0 else j
        gates.append((p,p))
    c=forward_count(4,[Y],gates,m,Y)
    assert c==8**m//2
    assert c==brute(4,[Y],gates,m,Y)
    chains.append((m,c))

init=[0b0011,0b0011,0b0101]; gates=[(0,1),(3,2),(3,2),(4,5)]; output=6
c=forward_count(4,init,gates,output,Y)
assert c==1344==brute(4,init,gates,output,Y)

ma=[0]*16;mb=[0]*16; fav=weighted=0; yn=norm(Y)
for t0 in range(16):
    h0=gate(t0,init[0],init[1],4)
    for t1 in range(16):
        a=gate(t1,h0,init[2],4)
        for t2 in range(16):
            b=gate(t2,h0,init[2],4)
            ma[a]+=1;mb[b]+=1
            fav+=favorable(a,b,yn)
            weighted+=mult(a,b,Y,4)
assert (fav,weighted)==(672,1344)
ind_fav=sum(ma[a]*mb[b] for a in range(16) for b in range(16) if favorable(a,b,yn))//4096
ind_w=sum(ma[a]*mb[b]*mult(a,b,Y,4) for a in range(16) for b in range(16))//4096
assert (ind_fav,ind_w)==(720,1440)

seed=0x6A09E667
def rnd()->int:
    global seed
    seed=(seed*1664525+1013904223)&0xffffffff
    return seed
random_cases=0
for case in range(60):
    k=2+rnd()%2;s=1+rnd()%3;initial=[rnd()%16 for _ in range(k)];gg=[]
    for j in range(s):
        n=k+j;gg.append((rnd()%n,rnd()%n))
    target=rnd()%16
    assert forward_count(4,initial,gg,k+s-1,target)==brute(4,initial,gg,k+s-1,target)
    random_cases+=1

duplicates=0
for case in range(40):
    k=2+rnd()%2;s=1+rnd()%3;initial2=[rnd()%4 for _ in range(k)];gg=[]
    for j in range(s):
        n=k+j;gg.append((rnd()%n,rnd()%n))
    def dup(c:int)->int:
        r0,r1=bit(c,0),bit(c,1)
        return r0|(r0<<1)|(r1<<2)|(r1<<3)
    c2=forward_count(2,initial2,gg,k+s-1,0b10)
    c4=forward_count(4,[dup(x) for x in initial2],gg,k+s-1,Y)
    assert c2==c4
    duplicates+=1

result={
    "status":"pass","localChecks":local,"chains":chains,"diamond":{"count":c,"favorable":fav,"weighted":weighted,"independentFavorable":ind_fav,"independentWeighted":ind_w},
    "randomCases":random_cases,"duplicateCases":duplicates,
    "method":"forward sampled-column mass expansion plus literal raw enumeration; no variable elimination"
}
ts=json.loads((ROOT/'research/validation/u66_u67_results.json').read_text())
assert ts['status']=='pass'
assert ts['localChecks']==local and ts['duplicateCases']==duplicates
assert ts['diamond']['favorablePrefix']==fav and ts['diamond']['weightedTarget']==weighted
print(json.dumps(result,indent=2))
