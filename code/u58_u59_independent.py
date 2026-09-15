"""Independent finite checks: literal row evaluations, graph reachability,
Bernstein reliability polynomials, and rational prefix sampling.
The TypeScript output is read only after independent calculations finish.
This is not an implementation of Feng-Guo's FPRAS.
"""
from collections import Counter
from fractions import Fraction as F
from itertools import product
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

def reachable(initial, topology, openings, output=None):
    """Build the surviving graph and search; do not multiply marginals."""
    k = len(initial)
    if output is None:
        output = k + len(topology) - 1
    children = [[] for _ in range(k + len(topology))]
    for j, (a, b) in enumerate(topology):
        if openings[j]:
            children[a].append(k+j)
            children[b].append(k+j)
    seen = {i for i, col in enumerate(initial) if col[0] != col[1]}
    queue = list(seen)
    while queue:
        for v in children[queue.pop()]:
            if v not in seen:
                seen.add(v)
                queue.append(v)
    return output in seen

def types_distribution(initial, top):
    dist = Counter()
    for types in product(range(16), repeat=len(top)):
        values = list(initial)
        for g, (a,b) in zip(types, top):
            values.append(tuple((g >> (values[a][i] + 2*values[b][i])) & 1 for i in range(2)))
        dist[values[-1]] += 1
    return dist

def topologies(k,s):
    for choices in product(*(list(product(range(k+j), repeat=2)) for j in range(s))):
        yield choices

law_cases = 0
literal_assignments = 0
for initial, cap in [([(0,0),(1,1),(0,1)],2), ([(1,0),(0,1)],2)]:
    for s in range(1,cap+1):
        for top in topologies(len(initial),s):
            exact = types_distribution(initial,top)
            hit = sum(reachable(initial,top,b) for b in product((0,1),repeat=s))
            for y in product((0,1),repeat=2):
                expected = 2**(3*s-1)*(hit if y[0] != y[1] else 2**s-hit)
                assert exact[y] == expected
            law_cases += 1
            literal_assignments += 16**s
# Shared diamond, early output and a disconnected output.
extra = [[(2,2),(3,3),(3,3),(4,5)], [(2,2),(3,0),(3,4)], [(0,1),(3,3),(4,4)]]
for top in extra:
    init=[(0,0),(1,1),(0,1)]
    exact=types_distribution(init,top)
    hit=sum(reachable(init,top,b) for b in product((0,1),repeat=len(top)))
    assert all(exact[y] == 2**(3*len(top)-1)*(hit if y[0]!=y[1] else 2**len(top)-hit)
               for y in product((0,1),repeat=2))
    law_cases+=1
    literal_assignments+=16**len(top)

def marked_network(l,r,edges):
    top=[]; marks=[]
    def node(a,b,mark):
        top.append((a,b));marks.append(mark)
        return len(top)+2
    left=[node(2,2,False) for _ in range(l)]
    def aggregate(xs):
        if not xs: return 0
        z=xs[0]
        for v in xs[1:]: z=node(z,v,True)
        return z
    right=[]
    for j in range(r):
        z=aggregate([left[i] for i in range(l) if (i,j) in edges])
        right.append(node(z,z,False))
    z=aggregate(right);node(z,z,True)
    return top,marks

computed={}; graph_results={}; reliability_terms=0
for l,r in [(0,0),(0,2),(2,0),(1,1),(1,2),(2,1),(2,2),(2,3),(3,2)]:
    for m in range(2**(l*r)):
        edges={(i,j) for i in range(l) for j in range(r) if m>>(i*r+j)&1}
        top,marks=marked_network(l,r,edges);d=sum(marks);coeff=Counter()
        for b in product((0,1),repeat=len(top)):
            if reachable([(0,0),(1,1),(0,1)],top,b):
                coeff[sum(x for x,mark in zip(b,marks) if mark)]+=1
            reliability_terms+=1
        for ell in range(1,d+2):
            p=F(1,2**ell)
            computed[l,r,m,ell]=sum(F(c,2**(l+r))*p**h*(1-p)**(d-h) for h,c in coeff.items())
        independent=sum(not any(bits[i] and bits[l+j] for i,j in edges)
                        for bits in product((0,1),repeat=l+r))
        # At connector probability 1, only the all-open term survives.
        assert independent == 2**(l+r)-coeff[d]
        graph_results[l,r,m]=independent

# Approximate conditioning tested with exact finite counts perturbed relatively.
# This verifies the error-control reduction only, not the external FPRAS.
tv_rows=[]
for top in extra:
    s=len(top); all_bits=list(product((0,1),repeat=s))
    solutions=[b for b in all_bits if reachable([(0,0),(1,1),(0,1)],top,b)]
    if not solutions: continue
    for eta in [F(1,128),F(1,32),F(1,8)]:
        law={():F(1)}
        for j in range(s):
            new={}
            for prefix,prob in law.items():
                masses=[]
                for bit in (0,1):
                    count=sum(b[:j+1]==prefix+(bit,) for b in solutions)
                    sign=1 if (sum(prefix)+bit+j)%2 else -1
                    masses.append(count*(1+sign*eta))
                assert sum(masses)>0
                for bit in (0,1):
                    if masses[bit]: new[prefix+(bit,)]=prob*masses[bit]/sum(masses)
            law=new
        tv=sum(abs(law.get(b,F(0))-F(1,len(solutions))) for b in solutions)/2
        bound=s*eta/(1-eta)
        assert sum(law.values())==1 and tv<=bound
        tv_rows.append({'slots':s,'relativeError':str(eta),'actualTV':str(tv),'provedBound':str(bound)})

# Read the other implementation only now.
other=json.loads((ROOT/'research/validation/u58_u59_final_results.json').read_text())
comparisons=0
for row in other['reduction']['details']:
    key=(row['left'],row['right'],row['edgeMask'])
    assert graph_results[key] == int(row['independentSets'])
    for x in row['values']:
        assert computed[key+(x['chainLength'],)]==F(int(x['hit']),int(x['total']))
        comparisons+=1
assert comparisons==other['reduction']['oracleCalls']
print(json.dumps({'status':'pass','literalTopologyCases':law_cases,
 'literalTypeAssignments':literal_assignments,'unexpandedSiteAssignments':reliability_terms,
 'bipartiteGraphs':len(graph_results),'independentRationalOracleComparisons':comparisons,
 'approximatePrefixSurrogateTests':tv_rows,
 'scope':'Per-row and graph/polynomial reference; no FPRAS runtime or infinite theorem certification'},indent=2))
