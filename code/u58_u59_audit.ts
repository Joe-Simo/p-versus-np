/** Fixed-topology B2 counts, reversible site coupling, and exact interpolation.
 * Number arithmetic is restricted to explicitly bounded finite masks/counts;
 * unbounded counts and rational interpolation use bigint. */
export {};
type Pair = readonly [number, number];
function ck(p: boolean, s: string): asserts p { if (!p) throw new Error(s); }
function at<T>(a: readonly T[], i: number): T { const x=a[i]; ck(x!==undefined,`index ${i}`); return x; }
function pow(a: bigint,b: number): bigint { return a**BigInt(b); }
function add<K>(m: Map<K,bigint>, k: K,v: bigint): void { m.set(k,(m.get(k)??0n)+v); }
function gate(g: number,a: number,b: number): number {
  return ((g>>((a&1)+2*(b&1)))&1) + 2*((g>>((a>>1)+2*(b>>1)))&1);
}
function diff(a: number): number { return (a&1)^(a>>1); }
function positions(a: number,b: number): number[] {
  const u=(a&1)+2*(b&1), v=(a>>1)+2*(b>>1), w=u===v?(u+1)%4:v;
  return [u,w,...[0,1,2,3].filter(i=>i!==u&&i!==w)];
}
function encode(g: number,a: number,b: number): number {
  const p=positions(a,b), eta=(g>>at(p,0))&1;
  return eta+2*(eta^((g>>at(p,1))&1))+4*((g>>at(p,2))&1)+8*((g>>at(p,3))&1);
}
function decode(z: number,a: number,b: number): number {
  const p=positions(a,b), eta=z&1, vals=[eta,eta^((z>>1)&1),(z>>2)&1,(z>>3)&1];
  return vals.reduce((t,v,i)=>t+(v<<at(p,i)),0);
}
function topoEach(k: number,s: number,fn:(t: readonly Pair[])=>void): void {
  const t:Pair[]=[]; const rec=()=>{if(t.length===s){fn(t);return;}const m=k+t.length;
    for(let a=0;a<m;a++)for(let b=0;b<m;b++){t.push([a,b]);rec();t.pop();}};rec();
}
function raw(init: readonly number[],top: readonly Pair[]): number[][] {
  ck(top.length<=4,'literal enumeration limit'); const a=[...init], counts=Array.from({length:init.length+top.length},()=>[0,0,0,0]);
  const rec=(j:number)=>{if(j===top.length){for(let i=0;i<a.length;i++){const row=at(counts,i),y=at(a,i);row[y]=at(row,y)+1;}return;}
    const [u,v]=at(top,j); for(let g=0;g<16;g++){a.push(gate(g,at(a,u),at(a,v)));rec(j+1);a.pop();}};rec(0);
  return counts;
}
function bruteSites(init: readonly number[],top: readonly Pair[]): number[] {
  ck(top.length<=18,'site enumeration limit'); const counts=Array<number>(init.length+top.length).fill(0);
  for(let mask=0;mask<2**top.length;mask++) {const a=init.map(diff);
    for(let j=0;j<top.length;j++){const [u,v]=at(top,j);a.push(((mask>>j)&1)*(at(a,u)|at(a,v)));}
    a.forEach((b,i)=>{counts[i]=at(counts,i)+b;});}return counts;
}
/** Exact frontier merging. Pinned entries are -1 (fair), 0 or 1. */
function siteCount(init: readonly number[],top: readonly Pair[],out: number,pins: readonly number[]=[]): {hit:bigint; total:bigint;peak:number} {
  const k=init.length,s=top.length,last=Array<number>(s).fill(-1); ck(out>=0&&out<k+s,'output');
  top.forEach(([a,b],j)=>{for(const p of [a,b]){ck(p>=0&&p<k+j,'topology');if(p>=k)last[p-k]=j;}});
  if(out>=k)last[out-k]=s;
  let states=new Map<bigint,bigint>([[0n,1n]]),total=1n,peak=1;
  for(let j=0;j<s;j++) {const [u,v]=at(top,j),pin=pins[j]??-1;ck(pin===-1||pin===0||pin===1,'pin');
    let keep=0n;for(let i=0;i<=j;i++)if(at(last,i)>j)keep|=1n<<BigInt(i);
    const nxt=new Map<bigint,bigint>(); for(const [st,mass]of states) {
      const read=(p:number)=>p<k?diff(at(init,p)):Number((st>>BigInt(p-k))&1n), val=read(u)|read(v);
      for(const bit of pin<0?[0,1]:[pin])add(nxt,(st|(BigInt(bit*val)<<BigInt(j)))&keep,mass);
    }
    if(pin<0)total*=2n;states=nxt;peak=Math.max(peak,states.size);
  }
  let hit=0n,check=0n;for(const [st,m]of states){check+=m;if(out<k?diff(at(init,out))===1:((st>>BigInt(out-k))&1n)===1n)hit+=m;}
  ck(check===total,'frontier mass');return {hit,total,peak};
}
function targetCount(init: readonly number[],top: readonly Pair[],out:number,y:number): bigint {
  if(out<init.length)return at(init,out)===y?pow(16n,top.length):0n;
  const {hit,total}=siteCount(init,top,out);const h=diff(y)?hit:total-hit;
  return pow(16n,top.length)*h/(2n*total);
}
function topologyAverage(init:readonly number[],s:number):bigint[]{
  ck(s>=1,'average requires gate output');const k=init.length,c0=init.filter(x=>diff(x)===0).length;
  let weights=new Map<number,bigint>([[c0,1n]]);const answer=[0n,0n,0n,0n];
  for(let j=0;j<s;j++){const K=BigInt(k+j),next=new Map<number,bigint>();
    for(const [c,w]of weights){const C=BigInt(c),agree=8n*(K*K+C*C),different=8n*(K*K-C*C);
      if(j===s-1){for(const y of [0,3])answer[y]=at(answer,y)+w*agree/2n;for(const y of [1,2])answer[y]=at(answer,y)+w*different/2n;}
      add(next,c+1,w*agree);add(next,c,w*different);}
    weights=next;
  }return answer;
}
function auditLaw() {
  let local=0;for(let a=0;a<4;a++)for(let b=0;b<4;b++){const seen=new Set<number>();for(let g=0;g<16;g++){
    const z=encode(g,a,b),eta=z&1,xi=(z>>1)&1;ck(decode(z,a,b)===g,'gate inverse');seen.add(z);
    ck(gate(g,a,b)===(eta+2*(eta^(xi*(diff(a)|diff(b))))),'gate coupling');local++;}ck(seen.size===16,'gate bijection');}
  let topologies=0,literalAssignments=0,outputTests=0; const rows=[];
  for(const init of [[0,3,2],[0,3,0],[1,2]])for(let s=0;s<=3;s++) {
    let num=0;const totals=[0n,0n,0n,0n];topoEach(init.length,s,top=>{const r=raw(init,top),p=bruteSites(init,top),den=2**s,total=16**s;
      for(let out=0;out<init.length+s;out++)for(let y=0;y<4;y++) {
        const expected=out<init.length?(at(init,out)===y?total:0):total*(diff(y)?at(p,out):den-at(p,out))/(2*den);
        ck(at(at(r,out),y)===expected,'literal/site mismatch');outputTests++;
      }
      if(s>0){const f=siteCount(init,top,init.length+s-1);ck(f.hit===BigInt(at(p,init.length+s-1)),'frontier/brute');ck(2n*f.hit<=f.total,'last gate bound');}
      for(let y=0;y<4;y++)totals[y]=at(totals,y)+BigInt(at(at(r,init.length+s-1),y));num++;literalAssignments+=total;
    });if(s>0){const avg=topologyAverage(init,s);ck(avg.every((w,y)=>w===at(totals,y)),'topology average');}topologies+=num;rows.push({initialColumns:init,slots:s,topologies:num,literalTypeAssignments:num*16**s,lastSignalCounts:totals.map(String)});
  }
  // Explicit shared-ancestor diamond: independent branch marginals give a wrong answer.
  const diamond:Pair[]=[[2,2],[3,3],[3,3],[4,5]], d=siteCount([0,3,2],diamond,6);
  ck(d.hit===3n&&d.total===16n,'diamond');
  return {localGateBijections:local,topologies,literalAssignments,outputTests,rows,diamond:{exact:'3/16',independentBranches:'7/32'}};
}
function unrankSite(init:readonly number[],top:readonly Pair[],out:number,want:number,rank:bigint):number[] {
  const pins=Array<number>(top.length).fill(-1),root=siteCount(init,top,out),count=want?root.hit:root.total-root.hit;
  ck(rank>=0n&&rank<count,'rank out of range');
  for(let i=0;i<top.length;i++){pins[i]=0;const r=siteCount(init,top,out,pins),m=want?r.hit:r.total-r.hit;
    if(rank>=m){rank-=m;pins[i]=1;}}ck(rank===0n,'site rank residual');return pins;
}
function typesFromBits(init:readonly number[],top:readonly Pair[],xi:readonly number[],eta:readonly number[],junk:number):number[] {
  const a=[...init],types:number[]=[];top.forEach(([u,v],j)=>{const z=at(eta,j)+2*at(xi,j)+4*((junk>>(2*j))&3),g=decode(z,at(a,u),at(a,v));types.push(g);a.push(gate(g,at(a,u),at(a,v)));});return types;
}
function replay(init:readonly number[],top:readonly Pair[],types:readonly number[]):number[]{const a=[...init];top.forEach(([u,v],j)=>a.push(gate(at(types,j),at(a,u),at(a,v))));return a;}
function auditSampler(){const init=[0,3,2],cases:Pair[][]=[[[2,2]],[[2,2],[3,3]],[[2,2],[3,2],[3,4]],[[0,1],[3,2],[4,4]]];let ranks=0;const rows=[];
  for(const top of cases){const s=top.length,out=init.length+s-1,reference=Array.from({length:4},()=>new Set<string>());
    for(let t=0;t<16**s;t++){const types=Array.from({length:s},(_,j)=>(t>>(4*j))&15);at(reference,at(replay(init,top,types),out)).add(types.join(','));}
    for(let y=0;y<4;y++){const count=targetCount(init,top,out,y),site=siteCount(init,top,out),h=diff(y)?site.hit:site.total-site.hit,set=new Set<string>();
      for(let z=0n;z<h;z++){const xi=unrankSite(init,top,out,diff(y),z);for(let et=0;et<2**(s-1);et++)for(let junk=0;junk<4**s;junk++){
        const eta=Array.from({length:s},(_,j)=>j===s-1?y&1:(et>>j)&1),types=typesFromBits(init,top,xi,eta,junk),key=types.join(',');
        ck(!set.has(key)&&at(reference,y).has(key),'type unrank');set.add(key);ranks++;}}
      ck(BigInt(set.size)===count&&set.size===at(reference,y).size,'sampler coverage');rows.push({slots:s,target:y,count:String(count)});
    }}return {ranks,rows};}
function gcd(a:bigint,b:bigint):bigint{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b];}return a;}
class Q {readonly a:bigint;readonly b:bigint;constructor(a:bigint,b=1n){ck(b!==0n,'zero denominator');if(b<0n){a=-a;b=-b;}const g=gcd(a,b);this.a=a/g;this.b=b/g;}
 add(x:Q):Q{return new Q(this.a*x.b+x.a*this.b,this.b*x.b);} mul(x:Q):Q{return new Q(this.a*x.a,this.b*x.b);} neg():Q{return new Q(-this.a,this.b);} sub(x:Q):Q{return this.add(x.neg());} div(x:Q):Q{return new Q(this.a*x.b,this.b*x.a);} str():string{return `${this.a}/${this.b}`;}}
function interpolate(points:readonly (readonly [Q,Q])[],x:Q):Q {let result=new Q(0n);points.forEach(([xi,yi],i)=>{let v=yi;points.forEach(([xj],j)=>{if(i!==j)v=v.mul(x.sub(xj)).div(xi.sub(xj));});result=result.add(v);});return result;}
type Marked={top:Pair[];marked:boolean[];randomNodes:number};
function bipNet(l:number,r:number,edges:readonly Pair[]):Marked{const top:Pair[]=[],marked:boolean[]=[];const append=(a:number,b:number,m:boolean)=>{top.push([a,b]);marked.push(m);return 2+top.length;};
 const left=Array.from({length:l},()=>append(2,2,false)),right:number[]=[];
 const join=(xs:number[])=>{if(!xs.length)return 0;let v=at(xs,0);for(const w of xs.slice(1))v=append(v,w,true);return v;};
 for(let j=0;j<r;j++){const prev=join(edges.filter(e=>e[1]===j).map(e=>at(left,e[0])));right.push(append(prev,prev,false));}
 const z=join(right);append(z,z,true);return {top,marked,randomNodes:l+r};}
function expand(net:Marked,length:number):Pair[]{ck(length>=1,'chain length');const t:Pair[]=[],map=[0,1,2];
 net.top.forEach(([u,v],j)=>{t.push([at(map,u),at(map,v)]);let idx=2+t.length;if(at(net.marked,j))for(let h=1;h<length;h++){t.push([idx,idx]);idx=2+t.length;}map.push(idx);});return t;}
function independentBip(l:number,r:number,edges:readonly Pair[]):bigint{ck(l<=12,'left oracle bound');let ans=0n;for(let mask=0;mask<2**l;mask++){let available=0;for(let j=0;j<r;j++)if(!edges.some(([i,k])=>k===j&&((mask>>i)&1)===1))available++;ans+=1n<<BigInt(available);}return ans;}
function auditReduction(){let instances=0,oracleCalls=0,bruteCalls=0,largest=0,peak=0;const rows=[],details=[];
 for(const [l,r]of [[0,0],[0,2],[2,0],[1,1],[1,2],[2,1],[2,2],[2,3],[3,2]]as Pair[]){let calls=0;for(let m=0;m<2**(l*r);m++){
   const edges:Pair[]=[];for(let i=0;i<l;i++)for(let j=0;j<r;j++)if((m>>(i*r+j))&1)edges.push([i,j]);
   const net=bipNet(l,r,edges),d=net.marked.filter(Boolean).length,points:(readonly[Q,Q])[]=[],values=[];
   for(let a=1;a<=d+1;a++){const t=expand(net,a),s=t.length,res=siteCount([0,3,2],t,s+2),types=pow(2n,3*s-1)*res.hit;
     const probability=new Q(2n*types,pow(16n,s));ck(probability.str()===new Q(res.hit,res.total).str(),'count conversion');points.push([new Q(1n,1n<<BigInt(a)),probability]);
     if(s<=12){ck(BigInt(at(bruteSites([0,3,2],t),s+2))===res.hit,'expanded chain reference');bruteCalls++;}
     values.push({chainLength:a,slots:s,hit:String(res.hit),total:String(res.total)});largest=Math.max(largest,s);peak=Math.max(peak,res.peak);oracleCalls++;calls++;}
   const recovered=new Q(pow(2n,l+r)).mul(new Q(1n).sub(interpolate(points,new Q(1n)))),expected=independentBip(l,r,edges);
   ck(recovered.b===1n&&recovered.a===expected,'BIS interpolation');details.push({left:l,right:r,edgeMask:m,marked:d,independentSets:String(expected),values});instances++;
 }rows.push({left:l,right:r,graphs:2**(l*r),oracleCalls:calls});}
 // Direct interpolation reduction from general independent sets to bipartite ones.
 let general=0;for(let n=0;n<=4;n++) {const poss:Pair[]=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)poss.push([i,j]);
 for(let m=0;m<2**poss.length;m++){const e=poss.filter((_,j)=>((m>>j)&1)===1),pts:(readonly[Q,Q])[]=[];
  for(let a=1;a<=e.length+1;a++){const be:Pair[]=[];e.forEach(([u,v],j)=>{for(let b=0;b<a;b++){be.push([u,j*a+b],[v,j*a+b]);}});pts.push([new Q(pow(2n,a)),new Q(independentBip(n,e.length*a,be))]);}
  let count=0n;for(let z=0;z<2**n;z++)if(!e.some(([a,b])=>((z>>a)&1)&&((z>>b)&1)))count++;
  const ans=interpolate(pts,new Q(0n));ck(ans.a===count&&ans.b===1n,'IS to BIS');general++;}}
 return {instances,oracleCalls,expandedBruteCalls:bruteCalls,largestExpandedSlots:largest,maxFrontierStates:peak,rows,generalIndependentSetInterpolationCases:general,details};}

function auditSatStart(){
 const cases:readonly {n:number;cnf:readonly (readonly number[])[]}[]=[
 {n:0,cnf:[]},{n:1,cnf:[]},{n:1,cnf:[[1]]},{n:1,cnf:[[1],[-1]]},
 {n:2,cnf:[[1,2],[-1,2]]},{n:2,cnf:[[1,1],[-1,2]]},{n:2,cnf:[[1,-1,2]]},
 {n:2,cnf:[[]]},{n:3,cnf:[[1,2,3]]},{n:3,cnf:[[1,2],[-2,3]]}];
 const rows=[];
 for(const {n,cnf}of cases){let sat=0;for(let z=0;z<2**n;z++)if(cnf.every(c=>c.some(l=>(((z>>(Math.abs(l)-1))&1)===1)===(l>0))))sat++;
  let vertices=2*n;const edges:Pair[]=Array.from({length:n},(_,i)=>[2*i,2*i+1]);
  for(const clause of cnf){const vars=[...new Set(clause.map(l=>Math.abs(l)-1))],nodes:number[]=[];
   for(let z=0;z<2**vars.length;z++){const val=(l:number)=>((z>>vars.indexOf(Math.abs(l)-1))&1)===(l>0?1:0);
    if(!clause.some(val))continue;const node=vertices++;nodes.push(node);vars.forEach((v,j)=>edges.push([node,2*v+(1-((z>>j)&1))]));}
   for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++)edges.push([at(nodes,i),at(nodes,j)]);}
  ck(vertices<=18,'SAT-component enumeration cap');const poly=Array<bigint>(vertices+1).fill(0n);
  for(let z=0;z<2**vertices;z++)if(!edges.some(([a,b])=>((z>>a)&1)&&((z>>b)&1))){let c=0,t=z;while(t){t&=t-1;c++;}poly[c]=at(poly,c)+1n;}
  const degree=n+cnf.length;ck((poly[degree]??0n)===BigInt(sat),'parsimonious max-IS');
  if(degree<=vertices){const pts=Array.from({length:degree+1},(_,i)=>{const x=pow(2n,i+1)-1n;return [new Q(x),new Q(poly.reduce((sum,a,j)=>sum+a*pow(x,j),0n))]as const;});
   let leading=new Q(0n);pts.forEach(([x,y],i)=>{let term=y;pts.forEach(([w],j)=>{if(i!==j)term=term.div(x.sub(w));});leading=leading.add(term);});
   ck(leading.a===BigInt(sat)&&leading.b===1n,'independence-polynomial leading coefficient');}
  rows.push({variables:n,clauses:cnf.length,graphVertices:vertices,satisfyingAssignments:sat});}
 return {cases:rows.length,rows};}


function auditThreeRowGap(){const rows=[];
 for(let chain=0;chain<=3;chain++){const top:Pair[]=[],init=[0,7,1,4];let b=3;
  for(let i=0;i<chain;i++){top.push([b,b]);b=3+top.length;}top.push([2,b]);
  const a=[...init],counts=Array<number>(8).fill(0);
  const rec=(j:number)=>{if(j===top.length){const y=at(a,a.length-1);counts[y]=at(counts,y)+1;return;}
    const [u,v]=at(top,j);for(let g=0;g<16;g++){let y=0;for(let row=0;row<3;row++)y|=((g>>(((at(a,u)>>row)&1)+2*((at(a,v)>>row)&1)))&1)<<row;
      a.push(y);rec(j+1);a.pop();}};rec(0);
  const total=16**top.length,r01=counts.reduce((s,c,y)=>s+((((y>>0)^(y>>1))&1)?c:0),0),r02=counts.reduce((s,c,y)=>s+((((y>>0)^(y>>2))&1)?c:0),0),r12=counts.reduce((s,c,y)=>s+((((y>>1)^(y>>2))&1)?c:0),0);
  ck(r01===total/2&&r02===total/2&&r12===total/2**(chain+1),'three-row marginals');
  ck(at(counts,4)===(r02+r12-r01)/4&&at(counts,4)===total/2**(chain+3),'three-row rare target');
  rows.push({chainGates:chain,typeAssignments:total,counts,pair01:new Q(BigInt(r01),BigInt(total)).str(),pair02:new Q(BigInt(r02),BigInt(total)).str(),pair12:new Q(BigInt(r12),BigInt(total)).str(),target001:new Q(BigInt(at(counts,4)),BigInt(total)).str()});
 }return rows;
}

const law=auditLaw(),sampler=auditSampler(),reduction=auditReduction(),satStart=auditSatStart(),threeRow=auditThreeRowGap();
console.log(JSON.stringify({status:'pass',law,sampler,reduction,satStart,threeRow,scope:'Exact finite reductions and bijections; no implementation of the literature FPRAS; no P/NP resolution'},null,2));
