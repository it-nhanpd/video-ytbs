import sharp from 'sharp';
import fs from 'node:fs';
import {load,CW,CH} from './lib.mjs';
import {comps} from './boots.mjs';
const FR=[120,121,123,124,125,126,128,129,130,131,133,134,135,136,138,139,140,141,143,144,145,146,148,149,150,151,153];
const hm=d=>{const m=new Uint8Array(CW*CH);for(let y=330;y<640;y++)for(let x=560;x<CW-40;x++){const o=(y*CW+x)*3,R=d[o],G=d[o+1],B=d[o+2];if(R>=140&&R-G>=25&&R-B>=18&&G>=80&&G<=215)m[y*CW+x]=1;}return m;};
const res=[];const tiles=[];
for(const f of FR){const d=await load(f);const m=hm(d);const cs=comps(m,120).sort((a,b)=>b.n-a.n);const c=cs[0];res.push({f,hand:c?{x:c.cx,y:c.cy,n:c.n,minX:c.minX,maxX:c.maxX,minY:c.minY,maxY:c.maxY}:null,ncomp:cs.length});}
fs.writeFileSync('_refs/run20/hand.json',JSON.stringify(res));
console.log(res.map(r=>r.f+':'+(r.hand?`${r.hand.x.toFixed(0)},${r.hand.y.toFixed(0)}(n${r.hand.n})`:'—')+(r.ncomp>1?`+${r.ncomp-1}`:'')).join('  '));
// ảnh kiểm tra: 6 khung
for(const f of [120,126,131,136,141,148]){const d=await load(f);const m=hm(d);const o=Buffer.from(d);for(let i=0;i<CW*CH;i++)if(m[i]){o[i*3]=0;o[i*3+1]=255;o[i*3+2]=0;}
  const r=res.find(q=>q.f===f);const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${CH}">${r.hand?`<circle cx="${r.hand.x}" cy="${r.hand.y}" r="9" fill="yellow"/>`:''}<text x="10" y="30" font-size="26" fill="white" stroke="black">f${f}</text></svg>`;
  tiles.push(await sharp(await sharp(o,{raw:{width:CW,height:CH,channels:3}}).extract({left:300,top:200,width:700,height:560}).png().toBuffer()).composite([{input:Buffer.from(svg).length?await sharp(Buffer.from(svg)).extract({left:300,top:200,width:700,height:560}).png().toBuffer():undefined}]).png().toBuffer());}
await sharp({create:{width:700*3+20,height:560*2+10,channels:3,background:'#000'}}).composite(tiles.map((t,i)=>({input:t,left:(i%3)*710,top:Math.floor(i/3)*570}))).png().toFile('_refs/run20/grid/hand.png');
