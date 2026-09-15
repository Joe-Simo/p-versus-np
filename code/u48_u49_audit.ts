/** U48-U49: exact support-query laws and charged adaptive anti-checker components. */
export {};
function check(ok: boolean, why: string): asserts ok { if (!ok) throw new Error(why); }
function at<T>(xs: readonly T[], i: number): T { const a=xs[i]; check(a!==undefined, `index ${i}`); return a; }
function pc(x: number): number { let n=0; while(x){x&=x-1;n++;} return n; }
function choose(n: number, k: number): bigint {
  if(k<0||k>n)return 0n; k=Math.min(k,n-k); let v=1n;
  for(let i=1;i<=k;i++)v=v*BigInt(n-k+i)/BigInt(i); return v;
}
function gcd(a: bigint,b: bigint): bigint { while(b){const t=a%b;a=b;b=t;}return a; }
function fraction(a: bigint,b: bigint): string {check(b>0n,'fraction denominator');const g=gcd(a,b);return `${a/g}/${b/g}`;}
function ceilLog(x: bigint): bigint {check(x>0n,'positive log');return BigInt((x-1n).toString(2).length)-(x===1n?1n:0n);}
function rawCount(n: number,s: number): bigint {let d=BigInt(n+s+2);for(let j=0;j<s;j++)d*=16n*BigInt(n+j+2)**2n;return d;}
function op(g: number,a: number,b: number,mask: number): number {
  let z=0; if(g&1)z|=(~a)&(~b); if(g&2)z|=a&(~b); if(g&4)z|=(~a)&b; if(g&8)z|=a&b; return z&mask;
}
function enumerate(n: number,s: number) {
  const N=2**n, mask=2**N-1, weights=new Uint32Array(2**N), signals=[0,mask];let gates=0,descriptions=0;
  for(let i=0;i<n;i++){let z=0;for(let x=0;x<N;x++)z|=((x>>>i)&1)<<x;signals.push(z);}
  function visit(depth: number): void {
    if(depth===s){gates++;for(const f of signals){weights[f]=(weights[f]??0)+1;descriptions++;}return;}
    const width=signals.length;
    for(let a=0;a<width;a++)for(let b=0;b<width;b++)for(let g=0;g<16;g++){
      signals.push(op(g,at(signals,a),at(signals,b),mask));visit(depth+1);signals.pop();
    }
  }
  check(rawCount(n,s)<2n**32n,'bounded raw count');visit(0);
  check(BigInt(descriptions)===rawCount(n,s),'description formula');
  const fs=Array.from(weights.keys()).filter(f=>(weights[f]??0)>0);
  return {n,s,N,gateLists:gates,descriptions,fs,weights:Array.from(weights)};
}
function policyHits(mask: number,N: number,K: number,policy: number): {hits:number;seen:number} {
  const left=Array.from({length:N},(_,i)=>i);let state=policy+1,hits=0,seen=0;
  for(let j=0;j<K;j++){
    const p=policy===0?0:policy===1?left.length-1:(state*7+j*3+policy)%left.length;
    const x=at(left,p);left.splice(p,1);const b=(mask>>>x)&1;hits+=b;seen|=1<<x;
    state=(state*5+x+11*b+3)%997;
  }
  return {hits,seen};
}
function auditQueries(model: ReturnType<typeof enumerate>) {
  let runs=0,histograms=0,conditionalRuns=0;const rows=[];
  for(const N of [2,4,8,16]){
    const maxW=N===16?4:N, byWeight=Array.from({length:maxW+1},()=>[] as number[]);
    for(let f=0;f<2**N;f++){const w=pc(f);if(w<=maxW)at(byWeight,w).push(f);}
    for(let w=0;w<=maxW;w++)for(let K=0;K<=N;K++){
      for(let p=0;p<4;p++){
        const actual=Array<bigint>(w+1).fill(0n);
        for(const mask of at(byWeight,w)){const x=policyHits(mask,N,K,p).hits;actual[x]=at(actual,x)+1n;runs++;}
        for(let x=0;x<=w;x++)check(at(actual,x)===choose(K,x)*choose(N-K,w-x),'adaptive hypergeometric law');histograms++;
      }
      if(N===model.N){
        const hard=at(byWeight,w).filter(f=>at(model.weights,f)===0), h=Math.floor((model.s+1)/3)+1;
        if(hard.length){
          let tail=0n;for(let x=h;x<=w;x++)tail+=choose(K,x)*choose(N-K,w-x);
          for(let p=0;p<4;p++){
            let success=0,positivePass=0;
            for(const f of hard){const {hits,seen}=policyHits(f,N,K,p);if(hits>=h)positivePass++;
              if(model.fs.every(g=>((g^f)&seen)!==0)){success++;check(hits>=h,'positive-count necessity');}
              conditionalRuns++;
            }
            check(BigInt(success)<=BigInt(positivePass)&&BigInt(positivePass)<=tail,'conditional hard-tail inequality');
            check(BigInt(positivePass)*BigInt(N*h)<=choose(N,w)*BigInt(K*w),'Markov bound before conditioning');
            if(p===2)rows.push({N,w,K,h,hard:hard.length,certificates:success,positivePass,unconditionalTailNumerator:String(tail),conditionalBound:fraction(tail,BigInt(hard.length))});
          }
        }
      }
    }
  }
  return {runs,histograms,conditionalRuns,rows};
}
function auditCounting(){
  let binomialBounds=0;for(let n=2;n<=10;n++){const N=2**n;for(let w=1;w<=Math.min(32,N);w++){
    check(choose(N,w)*BigInt(w)**BigInt(w)>=BigInt(N)**BigInt(w),'binomial product bound');binomialBounds++;
  }}
  const rows=[];
  for(const [n,b] of [[128,8],[256,16],[512,32],[512,48],[1024,96],[2048,192]] as const){
    const S=1n<<BigInt(b), low=S/(10n*BigInt(n)), h=(low+1n)/BigInt(n)+1n,L=ceilLog(BigInt(n)+S+2n);
    const countGap=BigInt(n-b)*S-(L+S*(4n+2n*L));check(countGap>0n,'nonempty hard sparse layer');
    const t=1n<<BigInt(10*b),N=1n<<BigInt(n), markNum=t*S,markDen=N*h;
    check(10n*BigInt(n)**2n*h>S,'threshold rounding bound');
    rows.push({n,b,beta:`${b}/${n}`,S:String(S),low:String(low),h:String(h),log2DescriptionUpper:String(L+S*(4n+2n*L)),easyFractionAtMost:`2^(-${countGap})`,sampleLength:`2^${10*b}`,expectedHits:fraction(markNum,N),unconditionedMarkov:fraction(markNum,markDen),simplifiedMarkov:fraction(10n*BigInt(n)**2n*t,N),hardConditioning:'divide by (1 - easyFractionAtMost); no hard table constructed'});
  }
  return {binomialBounds,rows};
}
function auditSparseInterpolation(model: ReturnType<typeof enumerate>){
  const n=3,N=8;let cases=0,budgetCovered=0;
  for(let code=0;code<3**N;code++){
    let work=code,ones=0,zeros=0,p=0;
    for(let x=0;x<N;x++){const d=work%3;work=Math.floor(work/3);if(d===1)zeros|=1<<x;if(d===2){ones|=1<<x;p++;}}
    let computed=0,cost=0;
    for(let x=0;x<N;x++)if((ones>>>x)&1){
      let minterm=0;const firstType=1<<((x&1)+2*((x>>>1)&1));
      let a=0,b=0;for(let y=0;y<N;y++){a|=(y&1)<<y;b|=((y>>>1)&1)<<y;}
      minterm=op(firstType,a,b,255);cost++;
      const last=Array.from({length:N},(_,y)=>((y>>>2)&1)<<y).reduce((v,x)=>v|x,0);
      minterm=op(((x>>>2)&1)?8:2,minterm,last,255);cost++;
      if(computed){computed=op(14,computed,minterm,255);cost++;}else computed=minterm;
    }
    check(computed===ones&&(computed&zeros)===0,'sparse circuit labels');
    check(cost===(p===0?0:n*p-1),'sparse circuit cost');cases++;
    if(cost<=model.s){check(at(model.weights,computed)>0,'enumerator misses sparse interpolator');budgetCovered++;}
  }
  return {cases,budgetCovered};
}

type Gate={op:'and'|'or'|'xor';a:number;b:number};
function buildMajority(L:number){
  check(L>=1&&(L&1)===1,'odd majority length');const gates:Gate[]=[];
  const gate=(op:Gate['op'],a:number,b:number)=>{const out=2+L+gates.length;check(a<out&&b<out,'DAG order');gates.push({op,a,b});return out;};
  let P=1;while(P<L)P*=2;let numbers=Array.from({length:P},(_,i)=>[i<L?i+2:0]);
  while(numbers.length>1){const next:number[][]=[];for(let j=0;j<numbers.length;j+=2){
    const a=at(numbers,j),b=at(numbers,j+1);check(a.length===b.length,'adder width');const sum:number[]=[];let carry=0;
    for(let i=0;i<a.length;i++){const x=at(a,i),y=at(b,i),xy=gate('xor',x,y);sum.push(i===0?xy:gate('xor',xy,carry));
      const both=gate('and',x,y);carry=i===0?both:gate('or',both,gate('and',xy,carry));}
    sum.push(carry);next.push(sum);
  }numbers=next;}
  const result=at(numbers,0), threshold=(L+1)/2;let ge=1;
  for(let i=0;i<result.length;i++){const x=at(result,i);ge=((threshold>>>i)&1)?gate('and',x,ge):gate('or',x,ge);}
  check(gates.length<=32*L,'majority cost bound');return {L,gates,out:ge};
}
function auditMajority(){
  let assignments=0;const rows=[];
  for(let L=1;L<=19;L+=2){const c=buildMajority(L),size=2**L,all=(1n<<BigInt(size))-1n,v=[0n,all];
    for(let i=0;i<L;i++){const step=1n<<BigInt(i),block=((1n<<step)-1n)<<step;v.push(all/((1n<<(2n*step))-1n)*block);}
    for(const g of c.gates){const a=at(v,g.a),b=at(v,g.b);v.push(g.op==='and'?a&b:g.op==='or'?a|b:a^b);}
    const bytes=new Uint8Array(Math.ceil(size/8));for(let x=0;x<size;x++)if(pc(x)>L/2)bytes[x>>>3]=(bytes[x>>>3]??0)|(1<<(x&7));
    const hex=Array.from(bytes).reverse().map(x=>x.toString(16).padStart(2,'0')).join('');
    check(at(v,c.out)===BigInt(`0x${hex}`),'majority semantics');assignments+=size;rows.push({L,gates:c.gates.length,assignments:size});
  }
  let tailChecks=0;for(let n=4;n<=64;n++){const L=n+1+((n+1)%2===0?1:0);let numerator=0n;
    for(let j=(L+1)/2;j<=L;j++)numerator+=choose(L,j)*15n**BigInt(L-j);
    check(numerator*(1n<<BigInt(L+2))<=16n**BigInt(L),'majority tail');
    check((1n<<BigInt(n))*numerator<16n**BigInt(L),'union bound below one');
    for(const s of [8,9,16,256])check(L*(s+32)<=10*n*s,'original gap constants');tailChecks++;
  }
  return {assignments,rows,tailChecks,constructionOnly:[33,65,129,257,513].map(L=>({L,gates:buildMajority(L).gates.length,semantic:'count/topology only'}))};
}
function auditHalving(model:ReturnType<typeof enumerate>){
  type Step={selected:number;total:number;remaining:number;optimum:number;fallback:boolean};
  const traces:{kind:string;f:number;certificate:boolean;samples:number[];steps:Step[]}[]=[];let runCount=0,weightComparisons=0,certificateCount=0;
  for(const kind of ['descriptions','functions','perturbed'] as const)for(let f=0;f<256;f++){
    let active=model.fs.map(g=>({g,w:kind==='functions'?1:at(model.weights,g)}));const samples:number[]=[];const steps:Step[]=[];
    while(active.length){
      const total=active.reduce((a,c)=>a+c.w,0),survivors=Array.from({length:8},(_,x)=>active.reduce((a,c)=>a+((((c.g^f)>>>x)&1)===0?c.w:0),0));
      weightComparisons+=8*active.length;
      let selected=0;const scores=survivors.map((v,x)=>v*(kind==='perturbed'?((x+samples.length)%2?127:129):128));
      for(let x=1;x<8;x++)if(at(scores,x)<at(scores,selected))selected=x;
      const optimum=Math.min(...survivors);let remaining=at(survivors,selected);let fallback=false;
      check(remaining*127<=optimum*129,'relative count choice bound');
      if(optimum===total){check(active.every(c=>c.g===f),'member output');break;}
      if(16*optimum<=15*total)check(32*remaining<=31*total,'promised approximate progress');
      if(remaining===total){fallback=true;selected=survivors.indexOf(optimum);remaining=optimum;}
      check(remaining<total,'exact fallback progress');check(!samples.includes(selected),'repeated eliminated point');
      steps.push({selected,total,remaining,optimum,fallback});samples.push(selected);
      active=active.filter(c=>(((c.g^f)>>>selected)&1)===0);
    }
    const certificate=active.length===0;check(certificate===(at(model.weights,f)===0),'halving membership');
    if(certificate){check(model.fs.every(g=>samples.some(x=>(((g^f)>>>x)&1)!==0)),'full certificate check');certificateCount++;}
    traces.push({kind,f,certificate,samples,steps});runCount++;
  }
  const resultKinds=['descriptions','functions','perturbed'].map(kind=>{const rows=traces.filter(x=>x.kind===kind);return{kind,runs:rows.length,certificates:rows.filter(x=>x.certificate).length,maxPoints:Math.max(...rows.map(x=>x.samples.length)),fallbacks:rows.reduce((z,x)=>z+x.steps.filter(s=>s.fallback).length,0)};});
  return {runCount,weightComparisons,certificateCount,resultKinds,traces};
}
const models=[enumerate(1,0),enumerate(2,1),enumerate(3,1),enumerate(3,2),enumerate(4,1)];
const model=at(models,3);
check(model.fs.length===152,'three-variable comparison class');
const halving=auditHalving(model);
console.log(JSON.stringify({status:'pass',modelConvention:'B2; ordered gates; repeated predecessors; free constants; arbitrary output wire; raw exact-s descriptions padded for at-most-s functions',modelCounts:models.map(({n,s,N,gateLists,descriptions,fs,weights})=>({n,s,N,gateLists,descriptions,functions:fs.length,weightHistogram:fs.map(f=>[f,at(weights,f)])})),counting:auditCounting(),query:auditQueries(model),sparseInterpolation:auditSparseInterpolation(model),majority:auditMajority(),halving},null,2));
