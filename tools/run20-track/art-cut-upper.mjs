import sharp from 'sharp';
import fs from 'node:fs';
const src='content/projects/_ref-run20/assets/run_ref20_f9.png';
const {data,info}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const W=info.width,H=info.height;
const hem=[[0,430],[270,430],[278,432],[290,438],[320,448],[350,458],[380,465],[410,468],[430,467],[445,459],[458,451],[1000,451]];
const hemY=x=>{for(let i=1;i<hem.length;i++){if(x<=hem[i][0]){const [x0,y0]=hem[i-1],[x1,y1]=hem[i];return y0+(y1-y0)*(x-x0)/(x1-x0);}}return 451;};
const out=Buffer.from(data);
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const o=(y*W+x)*4;
  const mag=x>=411&&x<=435&&y<=483;
  const below=y>hemY(x);
  const handTip=x>=458&&y>=424;
  if((below&&!mag)||handTip)out[o+3]=0;}
// trim
let minX=W,maxX=-1,minY=H,maxY=-1;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(out[(y*W+x)*4+3]>8){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}}
console.log('bbox',minX,minY,maxX,maxY);
await sharp(out,{raw:{width:W,height:H,channels:4}}).extract({left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1}).png().toFile('content/projects/_ref-run20/assets/run_upper.png');
fs.writeFileSync('_refs/run20/_upper_off.json',JSON.stringify({minX,minY,w:maxX-minX+1,h:maxY-minY+1}));
await sharp('content/projects/_ref-run20/assets/run_upper.png').flatten({background:'#808080'}).png().toFile('content/projects/_ref-run20/qa/run_upper_check.png');
