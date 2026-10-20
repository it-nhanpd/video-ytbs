import fs from 'node:fs';
import {load,mask,CW,CH} from './lib.mjs';
import {bootMask,comps} from './boots.mjs';
const T=33.75,F0=120,F1=276;
// 1) phát hiện giày + điểm cổ chân (biên chung với màu ống quần/xà cạp)
const det={};
for(let f=F0;f<=F1;f++){const d=await load(f);const bm=bootMask(d);const tm=mask(d);
  const cs=comps(bm,500).filter(c=>c.n<=1700&&(c.maxX-c.minX)<=Math.max(1,(c.maxY-c.minY))*3.2&&c.cy>640).sort((a,b)=>b.n-a.n).slice(0,2);
  // điểm cổ chân: các điểm khung bao giày gần pixel màu ống quần (xà cạp)
  for(const c of cs){let sx=0,sy=0,n=0;const R=14;
    for(let y=Math.max(0,Math.floor(c.minY)-R);y<=Math.min(CH-1,Math.ceil(c.maxY)+R);y++)for(let x=Math.max(0,Math.floor(c.minX)-R);x<=Math.min(CW-1,Math.ceil(c.maxX)+R);x++){
      if(!bm[y*CW+x])continue;let near=false;
      for(let dy=-R;dy<=R&&!near;dy+=4)for(let dx=-R;dx<=R;dx+=4){const yy=y+dy,xx=x+dx;if(yy>=0&&yy<CH&&xx>=0&&xx<CW&&yy>=480&&tm[yy*CW+xx]){near=true;break;}}
      if(near){sx+=x;sy+=y;n++;}}
    c.ax=n>20?sx/n:c.cx;c.ay=n>20?sy/n:c.cy-30;c.nAnk=n;}
  det[f]=cs;}
// 2) chuỗi liên tục chân X trong [F0, F0+T]
const dist=(a,b)=>Math.hypot(a.cx-b.cx,a.cy-b.cy);
const X={};let cur=det[F0].slice().sort((a,b)=>b.cx-a.cx)[0];X[F0]=cur;
for(let f=F0+1;f<=F0+34;f++){const c=det[f];let best=null,bd=1e9;for(const q of c){if(q.n>1700)continue;const dd=dist(q,cur);if(dd<bd){bd=dd;best=q;}}
  if(best&&bd<150){cur=best;X[f]=best;}else{X[f]=null;}}
console.log('X thiếu:',Object.entries(X).filter(([f,v])=>!v).map(([f])=>f).join(','),' đóng vòng: X(154) vs X(120) =',X[154]?dist(X[154],X[120]).toFixed(1):'?');
fs.writeFileSync('_refs/run20/_Xchain.json',JSON.stringify({X,det}));
for(let f=F0;f<=F0+34;f++)console.log(f,X[f]?`X (${X[f].cx.toFixed(0)},${X[f].cy.toFixed(0)}) ank (${X[f].ax.toFixed(0)},${X[f].ay.toFixed(0)}) nAnk ${X[f].nAnk}`:'—');
