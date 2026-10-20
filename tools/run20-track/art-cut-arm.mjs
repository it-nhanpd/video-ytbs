import sharp from 'sharp';
import fs from 'node:fs';
const src='content/projects/_ref-run20/assets/rig_ref20_foreArm.png';
const {data,info}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const W=info.width,H=info.height;
const arc=[[0,166],[3,160],[8,152],[15,145],[25,139],[35,137],[45,139],[52,143],[58,148],[63,155],[68,162],[200,162]];
const arcY=x=>{for(let i=1;i<arc.length;i++){if(x<=arc[i][0]){const [x0,y0]=arc[i-1],[x1,y1]=arc[i];return y0+(y1-y0)*(x-x0)/(x1-x0);}}return 162;};
const F=Buffer.from(data),U=Buffer.from(data);
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const o=(y*W+x)*4;const ay=arcY(x);
  if(y<ay-1)F[o+3]=0;            // cẳng tay: từ vòng cung xuống
  if(y>ay+3||y>178)U[o+3]=0;     // tay áo trên: phần trên vòng cung (chồng 3 px)
}
// tâm bàn tay (màu da) trong ảnh
let n=0,sx=0,sy=0;for(let y=300;y<H;y++)for(let x=0;x<W;x++){const o=(y*W+x)*4;const R=data[o],G=data[o+1],B=data[o+2],a=data[o+3];if(a>200&&R>=140&&R-G>=20&&R-B>=15&&G>=80){n++;sx+=x;sy+=y;}}
const hand=[sx/n,sy/n];console.log('tâm bàn tay art',hand.map(v=>v.toFixed(1)),'n',n);
const piv=[36,150];const d=Math.hypot(hand[0]-piv[0],hand[1]-piv[1]);console.log('khoảng cách khuỷu→tay',d.toFixed(1),'góc art (độ, y xuống)',(Math.atan2(hand[1]-piv[1],hand[0]-piv[0])*180/Math.PI).toFixed(1));
await sharp(F,{raw:{width:W,height:H,channels:4}}).png().toFile('content/projects/_ref-run20/assets/run_arm_fore.png');
await sharp(U,{raw:{width:W,height:H,channels:4}}).extract({left:0,top:0,width:W,height:182}).png().toFile('content/projects/_ref-run20/assets/run_arm_up.png');
const t=[await sharp('content/projects/_ref-run20/assets/run_arm_fore.png').flatten({background:'#808080'}).png().toBuffer(),await sharp('content/projects/_ref-run20/assets/run_arm_up.png').flatten({background:'#808080'}).png().toBuffer()];
await sharp({create:{width:240,height:430,channels:3,background:'#000'}}).composite([{input:t[0],left:0,top:0},{input:t[1],left:125,top:0}]).png().toFile('content/projects/_ref-run20/qa/arm_split_check.png');
