"""Independent U68-U69 checks using tuple-valued rows and literal gate tables.
The TypeScript result is read only after all reference objects are constructed.
"""
from __future__ import annotations
from collections import Counter
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def bits4(x: int) -> tuple[int,int,int,int]:
    return tuple((x >> i) & 1 for i in range(4))  # type: ignore[return-value]

def gate_table(t: int) -> tuple[int,int,int,int]:
    return tuple((t >> i) & 1 for i in range(4))

def apply_gate(t: int, a: tuple[int,...], b: tuple[int,...]) -> tuple[int,...]:
    tab = gate_table(t)
    return tuple(tab[(u << 1) | v] for u,v in zip(a,b))

def collision(a: tuple[int,...], b: tuple[int,...], i: int, j: int) -> int:
    return int((a[i],b[i]) == (a[j],b[j]))

def target_count(a: tuple[int,...], b: tuple[int,...], y: tuple[int,...]) -> int:
    return sum(apply_gate(t,a,b) == y for t in range(16))

def favorable(a: tuple[int,...], b: tuple[int,...], y: tuple[int,...]) -> bool:
    for i in range(4):
        for j in range(i+1,4):
            if y[i] != y[j] and (a[i],b[i]) == (a[j],b[j]):
                return False
    return True

walsh_checks = pairing_checks = balanced_checks = 0
balanced_hist: dict[int,tuple[int,Counter[int]]] = {}
for ai in range(16):
    a = bits4(ai)
    for bi in range(16):
        b = bits4(bi)
        addresses = [(a[i],b[i]) for i in range(4)]
        for subset in range(16):
            s = 0
            idx = [i for i in range(4) if (subset >> i) & 1]
            for t in range(16):
                h = apply_gate(t,a,b)
                p = sum(h[i] for i in idx) & 1
                s += 1 if p == 0 else -1
            if subset == 0:
                expected = 16
            else:
                cnt = Counter(addresses[i] for i in idx)
                expected = 16 if all(v % 2 == 0 for v in cnt.values()) else 0
            assert s == expected
            walsh_checks += 1
        q = int(all(v % 2 == 0 for v in Counter(addresses).values()))
        p1 = collision(a,b,0,1)*collision(a,b,2,3)
        p2 = collision(a,b,0,2)*collision(a,b,1,3)
        p3 = collision(a,b,0,3)*collision(a,b,1,2)
        all4 = int(len(set(addresses)) == 1)
        assert q == p1+p2+p3-2*all4
        pairing_checks += 1
        for yi in range(16):
            y = bits4(yi)
            if sum(y) != 2:
                continue
            literal = target_count(a,b,y)
            fourier = 1 + q
            for i in range(4):
                for j in range(i+1,4):
                    fourier += (1 if y[i] == y[j] else -1)*collision(a,b,i,j)
            z = [i for i,v in enumerate(y) if v == 0]
            o = [i for i,v in enumerate(y) if v == 1]
            pos = (1+collision(a,b,z[0],z[1]))*(1+collision(a,b,o[0],o[1])) if favorable(a,b,y) else 0
            assert literal == fourier == pos
            balanced_checks += 1

for yi in range(16):
    y=bits4(yi)
    if sum(y)!=2: continue
    h=Counter()
    fav=0
    for ai in range(16):
        for bi in range(16):
            c=target_count(bits4(ai),bits4(bi),y)
            if c:
                fav+=1; h[c]+=1
    balanced_hist[yi]=(fav,h)

Y=(0,0,1,1)
dist=Counter({Y:1})
cancellation=[]
for m in range(1,13):
    nxt=Counter()
    for x,n in dist.items():
        for t in range(16):
            nxt[apply_gate(t,x,x)] += n
    dist=nxt
    total=16**m
    target=dist[Y]
    assert target == 8**m//2
    def char_num(i:int,j:int)->int:
        return sum((1 if h[i]==h[j] else -1)*n for h,n in dist.items())
    within=(char_num(0,1),char_num(2,3))
    cross=[char_num(0,2),char_num(0,3),char_num(1,2),char_num(1,3)]
    qnum=sum((1 if sum(h)%2==0 else -1)*n for h,n in dist.items())
    assert within == (total,total)
    expected_cross = total - 2**(3*m+1)
    assert cross == [expected_cross]*4
    assert qnum == total
    residual=total+within[0]+within[1]-sum(cross)+qnum
    assert residual==16*target
    cancellation.append((m,total,target,expected_cross,residual))

ZERO,AND,XOR,OR,TRANSFORM=0,8,6,14,2
t=(0,1,0,1)
def restricted(m:int,x:int,y:int)->bool:
    xs=[apply_gate(AND if (x>>i)&1 else ZERO,t,t) for i in range(m)]
    ys=[apply_gate(AND if (y>>i)&1 else ZERO,t,t) for i in range(m)]
    ds=[apply_gate(XOR,xs[i],ys[i]) for i in range(m)]
    out=ds[0]
    for d in ds[1:]: out=apply_gate(OR,out,d)
    r=apply_gate(TRANSFORM,out,t)
    z=(0,0,0,0)
    return favorable(z,r,t)

eq_rows=[]; restricted_words=0
for m in range(1,9):
    n=1<<m; acc=0
    for x in range(n):
        for y in range(n):
            got=restricted(m,x,y)
            assert got == (x==y)
            acc += int(got); restricted_words += 1
    assert acc==n
    eq_rows.append((m,n*n,acc,n,4*m))

z=(0,0,0,0)
transform_counts=[]
for oi in range(16):
    o=bits4(oi)
    c=sum(favorable(z,apply_gate(g,o,t),t) for g in range(16))
    transform_counts.append(c)
assert min(transform_counts)==2
assert Counter(transform_counts)==Counter({2:4,4:8,8:4})

ref = {
    "walshChecks": walsh_checks,
    "pairingChecks": pairing_checks,
    "balancedChecks": balanced_checks,
    "balancedRows": {str(k): [v[0], dict(v[1])] for k,v in balanced_hist.items()},
    "cancellation": cancellation,
    "restrictedWords": restricted_words,
    "eqRows": eq_rows,
    "transformHistogram": dict(Counter(transform_counts)),
}

main=json.loads((ROOT/'research/validation/u68_u69_results.json').read_text())
assert main['walshChecks']==walsh_checks
assert main['pairingChecks']==pairing_checks
assert main['balancedChecks']==balanced_checks
assert main['favorableLanguage']['restrictedWords']==restricted_words
assert {int(k):v for k,v in main['favorableLanguage']['transformHistogram'].items()}==dict(Counter(transform_counts))
for row in main['balancedRows']:
    yi=int(row['target']); fav,h=balanced_hist[yi]
    assert row['favorableParentPairs']==fav
    assert {int(k):int(v) for k,v in row['gateMultiplicityHistogram'].items()}==dict(h)
for got, exp in zip(main['favorableLanguage']['equalityRows'],eq_rows):
    assert (got['m'],got['words'],got['accepted'],got['nfaLowerBound'],got['prefixGates'])==exp

out=ROOT/'research/validation/u68_u69_independent_results.json'
out.write_text(json.dumps({"status":"pass",**ref},indent=2)+"\n")
print(json.dumps({"status":"pass","walshChecks":walsh_checks,"pairingChecks":pairing_checks,"balancedChecks":balanced_checks,"restrictedWords":restricted_words,"transformHistogram":dict(Counter(transform_counts))},sort_keys=True))
