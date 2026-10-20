import fs from 'node:fs';
import {load,mask,CW,CH} from './lib.mjs';
const {X,det}=JSON.parse(fs.readFileSync('_refs/run20/_Xchain.json','utf8'));
const track=Object.fromEntries(JSON.parse(fs.readFileSync('_refs/run20/track.json','utf8')).map(r=>[r.f,r]));
const FR=[120,121,123,124,125,126,128,129,130,131,133,134,135,136,138,139,140,141,143,144,145,146,148,149,150,151,153];
// chân Y = phát hiện còn lại (không phải X), gần quỹ đạo liên tục
const dist=(a,b)=>Math.hypot(a.cx-b.cx,a.cy-b.cy);
const Y={};let cur=det[120].slice().sort((a,b)=>a.cx-b.cx)[0];
for(let f=120;f<=154;f++){const c=det[f].filter(q=>q.n<=1700&&(!X[f]||dist(q,X[f])>40));let best=null,bd=1e9;for(const q of c){const dd=dist(q,cur);if(dd<bd){bd=dd;best=q;}}
  if(best&&bd<170){cur=best;Y[f]=best;}else Y[f]=null;}
console.log('Y thiếu:',Object.entries(Y).filter(([f,v])=>!v).map(([f])=>f).join(',')||'không');for(let f=120;f<=154;f++)console.log(f,Y[f]?Y[f].cx.toFixed(0)+','+Y[f].cy.toFixed(0)+' n'+Y[f].n:'—','| det:',det[f].map(q=>q.cx.toFixed(0)+','+q.cy.toFixed(0)+' n'+q.n).join(' ; '));
const S=3,GW=Math.ceil(CW/S),GH=Math.ceil(CH/S),YMIN=480;
const down=m=>{const g=new Uint8Array(GW*GH);for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const sx=x*S+1,sy=y*S+1;if(sy>=YMIN&&m[sy*CW+sx])g[y*GW+x]=1;}return g;};
const tg={};for(const f of FR)tg[f]=down(mask(await load(f)));
function raster(grid,segs){for(const [x0,y0,w0,x1,y1,w1] of segs){const dx=x1-x0,dy=y1-y0,L2=dx*dx+dy*dy||1,W=Math.max(w0,w1);
  const bx0=Math.max(0,Math.floor((Math.min(x0,x1)-W)/S)),bx1=Math.min(GW-1,Math.ceil((Math.max(x0,x1)+W)/S)),by0=Math.max(0,Math.floor((Math.min(y0,y1)-W)/S)),by1=Math.min(GH-1,Math.ceil((Math.max(y0,y1)+W)/S));
  for(let gy=by0;gy<=by1;gy++)for(let gx=bx0;gx<=bx1;gx++){const px=gx*S+1,py=gy*S+1;let t=((px-x0)*dx+(py-y0)*dy)/L2;t=Math.max(0,Math.min(1,t));const cx=x0+t*dx,cy=y0+t*dy,w=(w0+(w1-w0)*t)/2;if((px-cx)**2+(py-cy)**2<=w*w)grid[gy*GW+gx]=1;}}}
function ik(H,A,L1,L2){let dx=A[0]-H[0],dy=A[1]-H[1];let D=Math.hypot(dx,dy);const dmax=(L1+L2)*0.999;if(D>dmax){dx*=dmax/D;dy*=dmax/D;D=dmax;}D=Math.max(D,Math.abs(L1-L2)+1e-3);
  const ux=dx/Math.hypot(dx,dy),uy=dy/Math.hypot(dx,dy),a=(L1*L1-L2*L2+D*D)/(2*D),h=Math.sqrt(Math.max(0,L1*L1-a*a)),nx=uy,ny=-ux;
  return [[H[0]+a*ux+h*nx,H[1]+a*uy+h*ny],[H[0]+dx,H[1]+dy]];}
let G={ox:-5,oy:130,Lt:200,Ls:190,wh:108,wk:96,wa:62,ao:0};
const hip=f=>[535+track[f].belt[0]+G.ox,385+track[f].belt[1]+G.oy];
function legSegs(f,G){const H=hip(f),o=[];for(const B of [X[f],Y[f]]){if(!B)continue;const A=[B.ax,B.ay];const [K,A2]=ik(H,A,G.Lt,G.Ls);
  const sx=A2[0]-K[0],sy=A2[1]-K[1],sl=Math.hypot(sx,sy)||1;const E=[A2[0]+G.ao*sx/sl,A2[1]+G.ao*sy/sl];
  o.push([H[0],H[1],G.wh,K[0],K[1],G.wk],[K[0],K[1],G.wk,E[0],E[1],G.wa]);}return o;}
function iouOf(f,G){const g=new Uint8Array(GW*GH);raster(g,legSegs(f,G));const t=tg[f];let tp=0,fp=0,fn=0;for(let i=0;i<g.length;i++){if(g[i]&&t[i])tp++;else if(g[i])fp++;else if(t[i])fn++;}return tp/(tp+fp+fn);}
const mean=G=>FR.reduce((a,f)=>a+iouOf(f,G),0)/FR.length;
let best=mean(G);console.log('IoU ban đầu',best.toFixed(3));
for(const st of [16,8,4,2,1]){let imp=true,it=0;while(imp&&it++<30){imp=false;for(const k of Object.keys(G)){for(const d of [1,-1]){const o=G[k];G[k]=o+d*st*(k==='ao'?1:1);const v=mean(G);if(v>best+1e-5){best=v;imp=true;}else G[k]=o;}}}}
console.log('IoU sau tối ưu',best.toFixed(3),JSON.stringify(G));
const per=FR.map(f=>[f,iouOf(f,G)]);console.log('từng hình:',per.map(([f,v])=>f+':'+v.toFixed(2)).join(' '));
fs.writeFileSync('_refs/run20/_ikG.json',JSON.stringify({G,X,Y}));
