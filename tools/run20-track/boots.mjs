import sharp from 'sharp';
import fs from 'node:fs';
import {load,CW,CH} from './lib.mjs';
export function bootMask(d){const m=new Uint8Array(CW*CH);
  for(let y=560;y<CH-5;y++)for(let x=0;x<CW;x++){const o=(y*CW+x)*3,R=d[o],G=d[o+1],B=d[o+2];
    if(R>=38&&R<=72&&R-G>=15&&R-G<=36&&Math.abs(G-B)<=8&&G>=22)m[y*CW+x]=1;}return m;}
// thành phần liên thông (4-lân cận), bỏ mảnh < minPx
export function comps(m,minPx=900){const lab=new Int32Array(CW*CH);const out=[];let id=0;
  for(let i=0;i<CW*CH;i++){if(!m[i]||lab[i])continue;id++;const st=[i];lab[i]=id;let n=0,sx=0,sy=0,sxx=0,syy=0,sxy=0,minY=1e9,maxY=-1,minX=1e9,maxX=-1;const px=[];
    while(st.length){const p=st.pop();const x=p%CW,y=(p-x)/CW;n++;sx+=x;sy+=y;sxx+=x*x;syy+=y*y;sxy+=x*y;px.push(p);if(y<minY)minY=y;if(y>maxY)maxY=y;if(x<minX)minX=x;if(x>maxX)maxX=x;
      for(const q of [p-1,p+1,p-CW,p+CW]){if(q>=0&&q<CW*CH&&m[q]&&!lab[q]){lab[q]=id;st.push(q);}}}
    if(n>=minPx){const cx=sx/n,cy=sy/n,vxx=sxx/n-cx*cx,vyy=syy/n-cy*cy,vxy=sxy/n-cx*cy;const th=0.5*Math.atan2(2*vxy,vxx-vyy);
      out.push({n,cx,cy,minX,maxX,minY,maxY,axis:th});}}
  return out;}
if(process.argv[1].endsWith('boots.mjs')){
  const tiles=[];
  for(const f of process.argv.slice(2).map(Number)){const d=await load(f),m=bootMask(d),cs=comps(m);const o=Buffer.from(d);
    for(let i=0;i<CW*CH;i++)if(m[i]){o[i*3]=255;o[i*3+1]=0;o[i*3+2]=255;}
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${CH}">${cs.map(c=>`<circle cx="${c.cx}" cy="${c.cy}" r="6" fill="yellow"/><text x="${c.cx+8}" y="${c.cy}" font-size="20" fill="white" stroke="black" stroke-width="0.8">${c.n}</text>`).join('')}<text x="10" y="30" font-size="26" fill="white" stroke="black">f${f} n=${cs.length}</text></svg>`;
    tiles.push(await sharp(await sharp(o,{raw:{width:CW,height:CH,channels:3}}).png().toBuffer()).composite([{input:Buffer.from(svg)}]).png().toBuffer());console.log(f,cs.map(c=>`(${c.cx.toFixed(0)},${c.cy.toFixed(0)}) n=${c.n}`).join(' '));}
  await sharp({create:{width:CW*tiles.length+10*(tiles.length-1),height:CH,channels:3,background:'#000'}}).composite(tiles.map((t,i)=>({input:t,left:i*(CW+10),top:0}))).png().toFile('_refs/run20/grid/boots.png');
}
