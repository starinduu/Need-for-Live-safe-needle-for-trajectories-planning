const cv=document.getElementById('cv'),
        ctx=cv.getContext('2d'),
        msg=document.getElementById('msg');
const DEF=[['udara/luar',0,0,0,1,true],
        ['tulang',255,255,255,1,true],
        ['paru-paru',128,128,128,1,true],
        ['liver',208,96,48,1,false],
        ['jaringan lunak',224,160,144,1,false],
        ['pembuluh darah',48,96,255,20,false],
        ['target (lesi/tumor)',64,192,96,1,false]];
const mk=()=>DEF.map(([name,r,g,b,cost,forbid])=>({rgb:[r,g,b],name,cost,forbid}));
let W=0,H=0,lab=null,classes=mk(),base=null,start=null,goal=null,expanded=null,path=null;
const MAX=192;

function loadImg(img,demo){
 const s=Math.min(1,MAX/Math.max(img.width,img.height));
        W=Math.round(img.width*s);
        H=Math.round(img.height*s);
 const o=document.createElement('canvas');
        o.width=W;o.height=H;const c=o.getContext('2d');
        c.imageSmoothingEnabled=false;c.drawImage(img,0,0,W,H);
        base=c.getImageData(0,0,W,H);buildClasses();reset();
}

function buildClasses(){
 const d=base.data;lab=new Int16Array(W*H);
 for(let i=0;i<W*H;i++){let b=0,bd=1e9;
    for(let j=0;j<classes.length;j++){const r=classes[j].rgb,
        dr=d[i*4]-r[0],dg=d[i*4+1]-r[1],db=d[i*4+2]-r[2],
        q=dr*dr+dg*dg+db*db;if(q<bd){bd=q;b=j}}lab[i]=b}
}

function renderTable(){
 const t=document.getElementById('cls');
 t.innerHTML='<tr><th></th><th>Nama</th><th>Cost</th><th>Forbid</th></tr>';
 classes.forEach((c,i)=>{const r=t.insertRow();
    r.innerHTML=`<td><span class="sw" style="background:rgb(${c.rgb})"></span></td><td><input type="text" value="${c.name}"></td><td><input type="number" min="0.1" step="0.1" value="${c.cost}"></td><td><input type="checkbox" ${c.forbid?'checked':''}></td>`;
  const q=r.querySelectorAll('input');
  q[0].oninput=e=>c.name=e.target.value;q[1].oninput=e=>c.cost=Math.max(0.1,+e.target.value||1);q[2].onchange=e=>c.forbid=e.target.checked})
}

function draw(){
 cv.width=W;cv.height=H;ctx.putImageData(base,0,0);
 if(expanded){ctx.fillStyle='rgba(255,220,0,.35)';
    for(let i=0;i<expanded.length;i++)if(expanded[i])ctx.fillRect(i%W,(i/W)|0,1,1)}
 if(path){ctx.strokeStyle='#ff2d2d';
    ctx.lineWidth=1.5;
    ctx.beginPath();p
    ath.forEach((p,i)=>{const x=p%W+.5,y=((p/W)|0)+.5;
        i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()}
 const dot=(p,c)=>{if(p==null)return;
    ctx.fillStyle=c;ctx.beginPath();
    ctx.arc(p%W+.5,((p/W)|0)+.5,3,0,7);ctx.fill()};
 dot(start,'#00e5ff');dot(goal,'#ff00cc');
}

function reset(){start=goal=null;
    expanded=path=null;
    msg.textContent='Klik titik masuk.';
    document.getElementById('out').innerHTML='<p class="s">Belum ada hasil.</p>';draw()}
cv.addEventListener('click',e=>{if(!lab)return;
    const r=cv.getBoundingClientRect(),
            x=Math.floor((e.clientX-r.left)/r.width*W),
            y=Math.floor((e.clientY-r.top)/r.height*H),
            p=y*W+x;
 if(classes[lab[p]].forbid){msg.textContent='Titik itu di kelas forbidden, pilih titik lain.';
    return
}
 if(start==null||goal!=null){start=p;
    goal=null;
    expanded=path=null;
    msg.textContent='Klik titik target.'}
        else{goal=p;msg.textContent='Tekan "Cari jalur".'}
        draw()
    });

// binary min-heap
class Heap{constructor(){this.a=[]}push(f,v){const a=this.a;a.push([f,v]);let i=a.length-1;while(i>0){const p=(i-1)>>1;if(a[p][0]<=a[i][0])break;[a[p],a[i]]=[a[i],a[p]];i=p}}
 pop(){const a=this.a,t=a[0],l=a.pop();if(a.length){a[0]=l;let i=0;for(;;){let m=i,L=2*i+1,R=L+1;if(L<a.length&&a[L][0]<a[m][0])m=L;if(R<a.length&&a[R][0]<a[m][0])m=R;if(m==i)break;[a[m],a[i]]=[a[i],a[m]];i=m}}return t}get n(){return this.a.length}}
function astar(s,g,w,diag){
 const cost=classes.map(c=>c.cost),forb=classes.map(c=>c.forbid);
 const cmin=Math.min(...classes.filter(c=>!c.forbid).map(c=>c.cost));
 const gx=g%W,gy=(g/W)|0,G=new Float64Array(W*H).fill(Infinity),P=new Int32Array(W*H).fill(-1),cl=new Uint8Array(W*H);
 const h=n=>w*cmin*Math.hypot(n%W-gx,((n/W)|0)-gy);
 const D=diag?[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]:[[1,0],[-1,0],[0,1],[0,-1]];
 const H_=new Heap();G[s]=0;H_.push(h(s),s);let n=0;
 while(H_.n){const [,u]=H_.pop();if(cl[u])continue;cl[u]=1;n++;if(u==g)break;
  const ux=u%W,uy=(u/W)|0;
  for(const [dx,dy] of D){const vx=ux+dx,vy=uy+dy;if(vx<0||vy<0||vx>=W||vy>=H)continue;const v=vy*W+vx;if(forb[lab[v]]||cl[v])continue;
   if(dx&&dy&&(forb[lab[uy*W+vx]]||forb[lab[vy*W+ux]]))continue;
   const ng=G[u]+Math.hypot(dx,dy)*(cost[lab[u]]+cost[lab[v]])/2;
   if(ng<G[v]){G[v]=ng;P[v]=u;H_.push(ng+h(v),v)}}}
 if(!isFinite(G[g]))return {found:false,n,cl};
 const pt=[];for(let u=g;u!=-1;u=P[u])pt.push(u);pt.reverse();
 return {found:true,path:pt,cost:G[g],n,cl};
}

document.getElementById('run').onclick=()=>{
 if(start==null||goal==null){msg.textContent='Pilih titik masuk dan target dulu.';return}
 const w=+document.getElementById('w').value,
    dg=document.getElementById('diag').checked;
 const t0=performance.now();
 const r=astar(start,goal,w,dg);
 const ms=performance.now()-t0;
 expanded=r.cl;path=r.found?r.path:null;draw();
 let len=0;if(r.found)for(let i=1;i<r.path.length;i++){const a=r.path[i-1],b=r.path[i];len+=Math.hypot(a%W-b%W,((a/W)|0)-((b/W)|0))}
 const pass=r.found?[...new Set(r.path.map(p=>classes[lab[p]].name))].join(', '):'-';
 document.getElementById('out').innerHTML=r.found?`<div><span>Status</span><b>Jalur ditemukan</b></div><div><span>Panjang (piksel)</span><b>${len.toFixed(1)}</b></div><div><span>Total cost</span><b>${r.cost.toFixed(1)}</b></div><div><span>Node diekspansi</span><b>${r.n}</b></div><div><span>Waktu</span><b>${ms.toFixed(1)} ms</b></div><div><span>Menembus</span><b>${pass}</b></div>`:'<p class="s">Tidak ada jalur (terhalang kelas forbidden).</p>';
 msg.textContent='Ubah cost/w lalu jalankan lagi untuk membandingkan.';
};

document.getElementById('reset').onclick=reset;
document.getElementById('file').onchange=e=>{const f=e.target.files[0];if(!f)return;const img=new Image();img.onload=()=>loadImg(img,false);img.src=URL.createObjectURL(f)};
function phantom(){
 const c=document.createElement('canvas');c.width=c.height=160;const x=c.getContext('2d');
 x.fillStyle='#000';x.fillRect(0,0,160,160);
 x.fillStyle='#e0a090';x.beginPath();x.ellipse(80,80,72,58,0,0,7);x.fill();
 x.fillStyle='#fff';[[50,60,10],[112,58,9],[80,108,12],[100,96,7]].forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r,0,7);x.fill()});
 x.fillStyle='#3060ff';[[72,52,3],[90,74,3],[66,88,3],[60,36,2]].forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r,0,7);x.fill()});
 x.fillStyle='#40c060';x.beginPath();x.arc(80,84,6,0,7);x.fill();
 const i=new Image();i.onload=()=>loadImg(i,true);i.src=c.toDataURL();
}
document.getElementById('demo').onclick=phantom;
document.getElementById('defcls').onclick=()=>{classes=mk();document.getElementById('w').value=1;renderTable();if(base){buildClasses();reset()}};
renderTable();phantom();