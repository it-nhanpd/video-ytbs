import fs from 'node:fs';
import {load,mask,CW,CH} from './lib.mjs';
const {G,X,Y}=JSON.parse(fs.readFileSync('_refs/run20/_ikG.json','utf8'));
const track=Object.fromEntries(JSON.parse(fs.readFileSync('_refs/run20/track.json','utf8')).map(r=>[r.f,r]));
const FR=[120,121,123,124,125,126,128,129,130,131,133,134,135,136,138,139,140,141,143,144,145,146,148,149,150,151,153];
// nội suy Y khung thiếu (theo khung 30 fps liên tiếp)
const Yf={};for(let f=120;f<=154;f++)Yf[f]=Y[f];
for(let f=120;f<=154;f++)if(!Yf[f]){let a=f-1,b=f+1;while(a>=120&&!Yf[a])a--;while(b<=154&&!Yf[b])b++;if(a<120||b>154)continue;const t=(f-a)/(b-a);const L=(k)=>Yf[a][k]*(1-t)+Yf[b][k]*t;Yf[f]={cx:L('cx'),cy:L('cy'),ax:L('ax'),ay:L('ay'),axis:(Yf[a].axis+Yf[b].axis)/2,interp:true};}
const S=3,GW=Math.ceil(CW/S),GH=Math.ceil(CH/S),YMIN=480;
const down=m=>{const g=new Uint8Array(GW*GH);for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const sx=x*S+1,sy=y*S+1;if(sy>=YMIN&&m[sy*CW+sx])g[y*GW+x]=1;}return g;};
const tg={};for(const f of FR)tg[f]=down(mask(await load(f)));
function raster(grid,segs){for(const [x0,y0,w0,x1,y1,w1] of segs){const dx=x1-x0,dy=y1-y0,L2=dx*dx+dy*dy||1,W=Math.max(w0,w1);
  const bx0=Math.max(0,Math.floor((Math.min(x0,x1)-W)/S)),bx1=Math.min(GW-1,Math.ceil((Math.max(x0,x1)+W)/S)),by0=Math.max(0,Math.floor((Math.min(y0,y1)-W)/S)),by1=Math.min(GH-1,Math.ceil((Math.max(y0,y1)+W)/S));
  for(let gy=by0;gy<=by1;gy++)for(let gx=bx0;gx<=bx1;gx++){const px=gx*S+1,py=gy*S+1;let t=((px-x0)*dx+(py-y0)*dy)/L2;t=Math.max(0,Math.min(1,t));const cx=x0+t*dx,cy=y0+t*dy,w=(w0+(w1-w0)*t)/2;if((px-cx)**2+(py-cy)**2<=w*w)grid[gy*GW+gx]=1;}}}
function ik(H,A,L1,L2){let dx=A[0]-H[0],dy=A[1]-H[1];let D=Math.hypot(dx,dy);const dmax=(L1+L2)*0.999;if(D>dmax){dx*=dmax/D;dy*=dmax/D;D=dmax;}D=Math.max(D,Math.abs(L1-L2)+1e-3);
  const ux=dx/Math.hypot(dx,dy),uy=dy/Math.hypot(dx,dy),a=(L1*L1-L2*L2+D*D)/(2*D),h=Math.sqrt(Math.max(0,L1*L1-a*a));return [H[0]+a*ux+h*uy,H[1]+a*uy-h*ux];}
const W={wh:100,wk:94,wa:60};
function iou(f,H,K1,A1,K2,A2){const g=new Uint8Array(GW*GH);raster(g,[[H[0],H[1],W.wh,K1[0],K1[1],W.wk],[K1[0],K1[1],W.wk,A1[0],A1[1],W.wa],[H[0],H[1],W.wh,K2[0],K2[1],W.wk],[K2[0],K2[1],W.wk,A2[0],A2[1],W.wa]]);
  const t=tg[f];let tp=0,fp=0,fn=0;for(let i=0;i<g.length;i++){if(g[i]&&t[i])tp++;else if(g[i])fp++;else if(t[i])fn++;}return tp/(tp+fp+fn);}
const out=[];let tot=0,tot0=0;
for(const f of FR){const bx=track[f].belt;const H0=[535+bx[0]+G.ox,385+bx[1]+G.oy];
  const A1=[X[f].ax,X[f].ay],A2=[Yf[f].ax,Yf[f].ay];
  let K1=ik(H0,A1,G.Lt,G.Ls),K2=ik(H0,A2,G.Lt,G.Ls),H=[...H0];const init1=[...K1],init2=[...K2];
  const i0=iou(f,H,K1,A1,K2,A2);let best=i0;
  const lim=(P,P0,r)=>Math.hypot(P[0]-P0[0],P[1]-P0[1])<=r;
  for(const st of [12,6,3,1.5]){let imp=true,it=0;while(imp&&it++<25){imp=false;
    for(const [P,P0,r] of [[K1,init1,90],[K2,init2,90],[H,H0,25]])for(const ax of [0,1])for(const d of [1,-1]){const o=P[ax];P[ax]=o+d*st;if(!lim(P,P0,r)){P[ax]=o;continue;}const v=iou(f,H,K1,A1,K2,A2);if(v>best+1e-5){best=v;imp=true;}else P[ax]=o;}}}
  tot+=best;tot0+=i0;out.push({f,H,K1,A1,K2,A2,iou:best,iou0:i0,interpY:!!Yf[f].interp,foot1:[X[f].cx,X[f].cy],foot2:[Yf[f].cx,Yf[f].cy],axis1:X[f].axis,axis2:Yf[f].axis,n1:X[f].n,n2:Yf[f].n||0});}
console.log('IoU IK',(tot0/FR.length).toFixed(3),'→ sau tinh chỉnh',(tot/FR.length).toFixed(3));
console.log(out.map(r=>r.f+':'+r.iou.toFixed(2)+(r.interpY?'*':'')).join(' '));
fs.writeFileSync('_refs/run20/_joints.json',JSON.stringify({W,out}));
