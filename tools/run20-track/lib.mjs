import sharp from 'sharp';
export const X0=700,Y0=170,CW=1060,CH=910;
export async function load(f){
  const {data,info}=await sharp(`_refs/run20/frames/f_${String(f).padStart(4,'0')}.jpg`).extract({left:X0,top:Y0,width:CW,height:CH}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  return data;
}
export function mask(d){
  const m=new Uint8Array(CW*CH);
  for(let y=300;y<CH;y++)for(let x=0;x<CW;x++){const o=(y*CW+x)*3,R=d[o],G=d[o+1],B=d[o+2];
    if(Math.abs(R-G)<=9&&G-B>=0&&G-B<=14&&R-B<=16&&R>=70&&R<=140)m[y*CW+x]=1;}
  return m;
}
if(process.argv[1].endsWith('lib.mjs')){
  const out=[];
  for(const f of [120,134]){const d=await load(f),m=mask(d);const o=Buffer.from(d);
    for(let i=0;i<CW*CH;i++)if(m[i]){o[i*3]=o[i*3]*0.4+255*0.6;o[i*3+1]*=0.4;o[i*3+2]=o[i*3+2]*0.4+255*0.6;}
    out.push(await sharp(o,{raw:{width:CW,height:CH,channels:3}}).png().toBuffer());}
  await sharp({create:{width:CW*2+10,height:CH,channels:3,background:'#000'}}).composite([{input:out[0],left:0,top:0},{input:out[1],left:CW+10,top:0}]).png().toFile('_refs/run20/grid/mask_pair.png');
}
