import fs from 'node:fs';
const OX=700,OY=170;
const {W,out}=JSON.parse(fs.readFileSync('_refs/run20/_joints.json','utf8'));
const track=Object.fromEntries(JSON.parse(fs.readFileSync('_refs/run20/track.json','utf8')).map(r=>[r.f,r]));
const hand=Object.fromEntries(JSON.parse(fs.readFileSync('_refs/run20/hand.json','utf8')).map(r=>[r.f,r.hand]));
const n=out.length;
const P=(p)=>[+(p[0]+OX).toFixed(1),+(p[1]+OY).toFixed(1)];
// nội suy vòng cho bàn tay thiếu (khuất sau thân)
const hx=out.map(r=>hand[r.f]?[hand[r.f].x,hand[r.f].y]:null);
for(let i=0;i<n;i++)if(!hx[i]){let a=i,b=i,da=0,db=0;while(!hx[(a-1+n)%n]&&da<n){a=(a-1+n)%n;da++;}a=(a-1+n)%n;da++;while(!hx[(b+1)%n]&&db<n){b=(b+1)%n;db++;}b=(b+1)%n;db++;const t=da/(da+db);hx[i]=[hx[a][0]*(1-t)+hx[b][0]*t,hx[a][1]*(1-t)+hx[b][1]*t,'interp'];}
const bc0=[580,432],tc0=[575,275],hc0=[670,145]; // tâm mẫu tại khung 120 (toạ độ crop)
const v0=[tc0[0]-bc0[0],tc0[1]-bc0[1]];const a0=Math.atan2(v0[1],v0[0]);
let maxResid=0;const frames=out.map((r,i)=>{const t=track[r.f];
  const bc=[bc0[0]+t.belt[0],bc0[1]+t.belt[1]],tc=[tc0[0]+t.torso[0],tc0[1]+t.torso[1]],hc=[hc0[0]+t.head[0],hc0[1]+t.head[1]];
  // khớp tương đồng (xoay + tịnh tiến) ba điểm nghỉ → ba điểm đo: thắt lưng, ngực, đầu
  const R0=[bc0,tc0,hc0],R1=[bc,tc,hc];const m0=[0,1].map(k=>R0.reduce((a,p)=>a+p[k],0)/3),m1=[0,1].map(k=>R1.reduce((a,p)=>a+p[k],0)/3);
  let sd=0,sc=0;for(let q=0;q<3;q++){const ax=R0[q][0]-m0[0],ay=R0[q][1]-m0[1],bx=R1[q][0]-m1[0],by=R1[q][1]-m1[1];sd+=ax*bx+ay*by;sc+=ax*by-ay*bx;}
  const th=Math.atan2(sc,sd),rot=th*180/Math.PI;const c=Math.cos(th),sn=Math.sin(th);
  const bcFit=[m1[0]+c*(bc0[0]-m0[0])-sn*(bc0[1]-m0[1]),m1[1]+sn*(bc0[0]-m0[0])+c*(bc0[1]-m0[1])];
  let resid=0;for(let q=0;q<3;q++){const px=m1[0]+c*(R0[q][0]-m0[0])-sn*(R0[q][1]-m0[1]),py=m1[1]+sn*(R0[q][0]-m0[0])+c*(R0[q][1]-m0[1]);resid=Math.max(resid,Math.hypot(px-R1[q][0],py-R1[q][1]));}
  maxResid=Math.max(maxResid,resid);
  const foot=(K,A,C,axis)=>{let dx=Math.cos(axis),dy=Math.sin(axis);const sx=A[0]-K[0],sy=A[1]-K[1];const px=sy,py=-sx;if(dx*px+dy*py<0){dx=-dx;dy=-dy;}return {ang:+(Math.atan2(dy,dx)*180/Math.PI).toFixed(1),c:P(C)};};
  return {src:r.f,belt:P(bcFit),chest:P(tc),headC:P(hc),rot:+rot.toFixed(2),hip:P(r.H),
    legs:[{k:P(r.K1),a:P(r.A1),foot:foot(r.K1,r.A1,r.foot1,r.axis1)},{k:P(r.K2),a:P(r.A2),foot:foot(r.K2,r.A2,r.foot2,r.axis2)}],
    hand:P(hx[i]),handSeen:hx[i][2]!=='interp'};});
// lọc điểm lệch góc giày (median 3 vòng) và làm mượt nhẹ gối/hông (vòng, [1,2,1]/4)
const N=frames.length,wrapI=i=>(i+N)%N;
for(const L of [0,1]){const a=frames.map(f=>f.legs[L].foot.ang);const med=a.map((v,i)=>[a[wrapI(i-1)],v,a[wrapI(i+1)]].sort((x,y)=>x-y)[1]);frames.forEach((f,i)=>{f.legs[L].foot.ang=+med[i].toFixed(1);});}
const smooth=(get,set)=>{const v=frames.map(get);frames.forEach((f,i)=>set(f,[0,1].map(k=>+(0.25*v[wrapI(i-1)][k]+0.5*v[i][k]+0.25*v[wrapI(i+1)][k]).toFixed(1))));};
smooth(f=>f.hip,(f,v)=>{f.hip=v;});
for(const L of [0,1])smooth(f=>f.legs[L].k,(f,v)=>{f.legs[L].k=v;});
fs.writeFileSync('content/projects/_ref-run20/run20_track.json',JSON.stringify({fps:24,refW:2520,refH:1080,widths:W,frames}));
console.log('sai số lớn nhất sau khớp ba điểm (px):',maxResid.toFixed(1));console.log('ghi',frames.length,'hình; rot range',Math.min(...frames.map(f=>f.rot)).toFixed(1),Math.max(...frames.map(f=>f.rot)).toFixed(1));
console.log('foot ang A',frames.map(f=>f.legs[0].foot.ang.toFixed(0)).join(' '));console.log('foot ang B',frames.map(f=>f.legs[1].foot.ang.toFixed(0)).join(' '));
