import sharp from 'sharp';
const art=await sharp('content/projects/_ref-run20/assets/run_upper.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const ref=await sharp('_refs/run20/frames/f_0120.jpg').removeAlpha().raw().toBuffer({resolveWithObject:true});
const AW=art.info.width,AH=art.info.height,RW=ref.info.width,RH=ref.info.height;
const pts=[];for(let y=0;y<AH;y+=3)for(let x=0;x<AW;x+=3){const o=(y*AW+x)*4;if(art.data[o+3]>230)pts.push([x,y,art.data[o],art.data[o+1],art.data[o+2]]);}
const cost=(k,hx,hy,rot)=>{const c=Math.cos(rot*Math.PI/180),s=Math.sin(rot*Math.PI/180);let sum=0,n=0;
  for(const [x,y,r,g,b] of pts){const dx=(x-370)*k,dy=(y-10)*k;const X=Math.round(hx+c*dx-s*dy),Y=Math.round(hy+s*dx+c*dy);if(X<0||Y<0||X>=RW||Y>=RH){sum+=300;n++;continue;}
    const o=(Y*RW+X)*3;sum+=Math.abs(ref.data[o]-r)+Math.abs(ref.data[o+1]-g)+Math.abs(ref.data[o+2]-b);n++;}
  return sum/n;};
let P={k:1.07,hx:1375,hy:261,rot:0};let best=cost(P.k,P.hx,P.hy,P.rot);console.log('đầu',best.toFixed(1));
for(const st of [[0.04,6,6,2],[0.02,3,3,1],[0.01,1.5,1.5,0.5],[0.005,0.7,0.7,0.25]]){let imp=true,it=0;while(imp&&it++<40){imp=false;
  for(const [key,s] of [['k',st[0]],['hx',st[1]],['hy',st[2]],['rot',st[3]]]){for(const d of [1,-1]){const o=P[key];P[key]=o+d*s;const v=cost(P.k,P.hx,P.hy,P.rot);if(v<best-0.01){best=v;imp=true;}else P[key]=o;}}}}
console.log('sau',best.toFixed(1),JSON.stringify(P));
