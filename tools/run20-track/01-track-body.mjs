import sharp from 'sharp';
import fs from 'node:fs';
import {CW,CH,X0,Y0} from './lib.mjs';
const gray=async f=>{const {data}=await sharp(`_refs/run20/frames/f_${String(f).padStart(4,'0')}.jpg`).extract({left:X0,top:Y0,width:CW,height:CH}).greyscale().raw().toBuffer({resolveWithObject:true});return data;};
const T={torso:{x:515,y:215,w:120,h:120},head:{x:610,y:80,w:120,h:130},belt:{x:535,y:385,w:90,h:95}};
const f0=Number(process.argv[2]??120),f1=Number(process.argv[3]??290);
const g0=await gray(120);
const tpl={};for(const [k,r] of Object.entries(T)){const a=new Float32Array(r.w*r.h);for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++)a[y*r.w+x]=g0[(r.y+y)*CW+r.x+x];tpl[k]=a;}
function ssd(g,r,a,px,py,step){let s=0;for(let y=0;y<r.h;y+=step)for(let x=0;x<r.w;x+=step){const d=g[(py+y)*CW+px+x]-a[y*r.w+x];s+=d*d;}return s;}
const pos={torso:[515,215],head:[610,80],belt:[535,385]};
const out=[];
for(let f=f0;f<=f1;f++){const g=await gray(f);const row={f};
  for(const k of ['torso','head','belt']){const r=T[k];const [cx,cy]=pos[k];let best=[1e18,cx,cy];
    for(let dy=-50;dy<=50;dy+=3)for(let dx=-50;dx<=50;dx+=3){const px=cx+dx,py=cy+dy;if(px<0||py<0||px+r.w>=CW||py+r.h>=CH)continue;const s=ssd(g,r,tpl[k],px,py,3);if(s<best[0])best=[s,px,py];}
    let [bs,bx,by]=best;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const px=bx+dx,py=by+dy;if(px<0||py<0||px+r.w>=CW||py+r.h>=CH)continue;const s=ssd(g,r,tpl[k],px,py,1);if(s<bs){bs=s;bx=px;by=py;}}
    pos[k]=[bx,by];row[k]=[bx-T[k].x,by-T[k].y];row[k+'Err']=Math.sqrt(bs/(r.w*r.h));}
  out.push(row);if(f%10===0)console.log(f,JSON.stringify(row));}
fs.writeFileSync('_refs/run20/track.json',JSON.stringify(out));
