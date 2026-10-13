import * as THREE from './vendor/three.module.js';

const embedMode=new URLSearchParams(location.search).get('embed');
if(embedMode)document.body.classList.add('embedded',embedMode==='hero'?'hero-embedded':'project-embedded');

const $ = s => document.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const stage = $('#stage');
const state = { mode:'closed', design:'heritage', spin: embedMode==='hero' && !reduce.matches, dragging:false, yaw:-.35, pitch:.04, zoom:7.9, light:.65, active:true };
const descriptions = {closed:'The complete package. Drag to discover every side.',open:'A moment of discovery. The cover lifts to reveal the inner tray.',exploded:'Three separate elements: illustrated cover, inner tray and outer shell.'};
let scene, renderer, camera, product, lid, tray, keyLight, rimLight, goldSpot, beamMesh;
let textures={}, ready=false, dateModels=[], dateTextures={}, dateMaterial;
const anim={open:0,explode:0};
function tween(target,values,duration=.9){if(window.gsap&&!reduce.matches)gsap.to(target,{...values,duration,ease:'power3.inOut',overwrite:'auto'});else Object.assign(target,values);}
function setMode(mode){state.mode=mode;document.querySelectorAll('[data-state]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.state===mode)));const desc=$('#state-description');if(desc)desc.textContent=descriptions[mode];tween(anim,{open:mode==='closed'?0:1,explode:mode==='exploded'?1:0});if(window.parent&&window.parent!==window){try{window.parent.postMessage({type:'unbox-state',open:mode!=='closed'},'*');}catch(_){}}}
if(embedMode==='hero'){

 window.addEventListener('message',e=>{if(!e.data)return;if(e.data.type==='toggle-unbox'){const next=state.mode==='closed'?'open':'closed';setMode(next);return;}if(e.data.type==='set-unbox'){setMode(e.data.open?'open':'closed');return;}if(e.data.type==='hero-progress'&&!reduce.matches){const v=Math.max(0,Math.min(1,Number(e.data.value)||0));if(v>0){tween(anim,{open:v,explode:v*.45},.3);}else if(state.mode==='closed'){tween(anim,{open:0,explode:0},.3);}}});
}
document.querySelectorAll('[data-state]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.state)));
document.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>{setMode(b.dataset.demo);$('#experience').scrollIntoView({behavior:reduce.matches?'instant':'smooth'});}));
document.querySelectorAll('[data-design]').forEach(b=>b.addEventListener('click',()=>{state.design=b.dataset.design;document.querySelectorAll('[data-design]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));if(ready){lid.userData.art.material.map=textures[state.design];lid.userData.art.material.needsUpdate=true;}$('#fallback').src=`assets/${state.design}.jpg`;$('#angle').textContent=state.design==='heritage'?'01 / HERITAGE':'02 / ARCHITECTURE';}));
$('#spin').addEventListener('click',()=>{state.spin=!state.spin;$('#spin').setAttribute('aria-pressed',String(state.spin));});
$('#reset').addEventListener('click',()=>{state.spin=false;$('#spin').setAttribute('aria-pressed','false');tween(state,{yaw:-.35,pitch:.04,zoom:7.9});setMode('closed');});
function zoom(delta){tween(state,{zoom:THREE.MathUtils.clamp(state.zoom+delta,5.7,11)},.3);}
$('#zoom-in').addEventListener('click',()=>zoom(-.65));$('#zoom-out').addEventListener('click',()=>zoom(.65));
$('#light').addEventListener('input',e=>{state.light=Number(e.target.value)/100;$('#light-value').textContent=e.target.value+'%';});
stage.addEventListener('keydown',e=>{const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'];if(!keys.includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')state.yaw-=.15;if(e.key==='ArrowRight')state.yaw+=.15;if(e.key==='ArrowUp')state.pitch=Math.max(-.4,state.pitch-.1);if(e.key==='ArrowDown')state.pitch=Math.min(.7,state.pitch+.1);if(e.key==='+'||e.key==='=')zoom(-.5);if(e.key==='-')zoom(.5);});
let px=0,py=0;
stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;state.dragging=true;state.spin=false;$('#spin').setAttribute('aria-pressed','false');px=e.clientX;py=e.clientY;stage.setPointerCapture(e.pointerId);});
stage.addEventListener('pointermove',e=>{if(!state.dragging)return;state.yaw+=(e.clientX-px)*.009;if(e.pointerType==='mouse')state.pitch=THREE.MathUtils.clamp(state.pitch+(e.clientY-py)*.005,-.4,.7);px=e.clientX;py=e.clientY;});
for(const name of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(name,()=>state.dragging=false);

// Projective UV sampling maps the visible four corners of the original render
// to the cover. Source pixels and lettering are preserved; unseen faces are neutral.
async function artworkTexture(url){const img=new Image();img.src=url;await img.decode();const source=document.createElement('canvas');source.width=1024;source.height=1024;const sx=source.getContext('2d',{willReadFrequently:true});sx.drawImage(img,0,0,1024,1024);const data=sx.getImageData(0,0,1024,1024).data;
 const pts=[[.285,.334],[.686,.185],[.778,.562],[.401,.785]].map(p=>p.map(v=>v*1024));
 const [a,b,c,d]=pts;const dx1=b[0]-c[0],dx2=d[0]-c[0],dx3=a[0]-b[0]+c[0]-d[0],dy1=b[1]-c[1],dy2=d[1]-c[1],dy3=a[1]-b[1]+c[1]-d[1],den=dx1*dy2-dx2*dy1;const g=(dx3*dy2-dx2*dy3)/den,h=(dx1*dy3-dx3*dy1)/den;const A=b[0]-a[0]+g*b[0],B=d[0]-a[0]+h*d[0],D=b[1]-a[1]+g*b[1],E=d[1]-a[1]+h*d[1];
 const out=document.createElement('canvas');out.width=out.height=1024;const ctx=out.getContext('2d'),dst=ctx.createImageData(1024,1024);for(let y=0;y<1024;y++)for(let x=0;x<1024;x++){const u=x/1023,v=y/1023,w=g*u+h*v+1,ix=Math.max(0,Math.min(1023,Math.round((A*u+B*v+a[0])/w))),iy=Math.max(0,Math.min(1023,Math.round((D*u+E*v+a[1])/w))),j=(iy*1024+ix)*4,k=(y*1024+x)*4;dst.data[k]=data[j];dst.data[k+1]=data[j+1];dst.data[k+2]=data[j+2];dst.data[k+3]=255;}ctx.putImageData(dst,0,0);const tex=new THREE.CanvasTexture(out);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;return tex;}
function box(w,h,d,mat,x,y,z,parent){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function populateDates(){
 if(!tray)return;
 const old=[];tray.children.forEach(c=>{if(c.userData.isFruit)old.push(c);});
 old.forEach(c=>tray.remove(c));
 const fruitGeoms=dateModels&&dateModels.length?dateModels:[new THREE.SphereGeometry(.18,14,10)];
 for(let r=0;r<4;r++)for(let col=0;col<5;col++){
  const gIdx=(r*5+col)%fruitGeoms.length;
  const geo=fruitGeoms[gIdx];
  const mat=dateMaterial?dateMaterial.clone():new THREE.MeshStandardMaterial({color:new THREE.Color([0x753b1b,0x7d401e,0x854622,0x6e3619,0x783c1c][col]),roughness:.45});
  if(dateMaterial){
   mat.map=dateTextures.diffuse2||dateTextures.diffuse;
   mat.bumpMap=dateTextures.bump2||dateTextures.bump;
   mat.bumpScale=0.02;
   mat.color.setHex(0xb87540);
  }
  const date=new THREE.Mesh(geo,mat);
  date.userData.isFruit=true;
  if(dateModels&&dateModels.length){
   const s=0.18+0.007*Math.sin(r*3+col);
   date.scale.set(s,s*0.96,s);
  }else{
   date.scale.set(1.4,.55,.95);
  }
  date.position.set(-1.1+col*.55,-.02,-.96+r*.64);
  const yawAngle=((col%2===0?0:Math.PI)+0.15*Math.sin(r+col*2));
  date.rotation.set(0.04*(r%2?1:-1),yawAngle,0.02*(col%2?1:-1));
  date.castShadow=true;
  date.receiveShadow=false;
  tray.add(date);
 }
}
function createModel(){product=new THREE.Group();scene.add(product);product.position.y=.23;
 const paper=new THREE.MeshStandardMaterial({color:0xe8dcbf,roughness:.78}),inside=new THREE.MeshStandardMaterial({color:0x998360,roughness:.9}),edge=new THREE.MeshStandardMaterial({color:0xb6a17c,roughness:.64,metalness:.12});
 const base=new THREE.Group();product.add(base);box(3,.09,2.75,paper,0,-.41,0,base);box(3,.56,.07,paper,0,-.12,-1.34,base);box(3,.56,.07,paper,0,-.12,1.34,base);box(.07,.56,2.75,paper,-1.47,-.12,0,base);box(.07,.56,2.75,paper,1.47,-.12,0,base);
 tray=new THREE.Group();product.add(tray);
 const trayBase=box(2.8,.09,2.55,inside,0,-.19,0,tray);trayBase.receiveShadow=false;
 for(let i=0;i<5;i++){const b=box(.025,.14,2.51,edge,-1.12+i*.56,-.08,0,tray);b.receiveShadow=false;}
 for(let i=0;i<4;i++){const b=box(2.75,.14,.025,edge,0,-.08,-.96+i*.64,tray);b.receiveShadow=false;}
 populateDates();
 lid=new THREE.Group();product.add(lid);box(3.06,.07,2.81,paper,0,.3,0,lid);box(3.06,.19,.045,paper,0,.18,-1.38,lid);box(3.06,.19,.045,paper,0,.18,1.38,lid);box(.045,.19,2.81,paper,-1.507,.18,0,lid);box(.045,.19,2.81,paper,1.507,.18,0,lid);
 const artMat=new THREE.MeshStandardMaterial({color:0xf5edd8,roughness:.76,map:textures[state.design]||null});
 const art=new THREE.Mesh(new THREE.PlaneGeometry(3.045,2.795),artMat);art.rotation.x=-Math.PI/2;art.position.y=.337;lid.add(art);lid.userData.art=art;
}
async function loadDatesAsync(tl){
 try{
  const [d1,b1,d2,b2,modelsJson]=await Promise.all([
   tl.loadAsync('assets/date_diffuse.jpg').catch(()=>null),
   tl.loadAsync('assets/date_bump.jpg').catch(()=>null),
   tl.loadAsync('assets/date_diffuse_2.jpg').catch(()=>null),
   tl.loadAsync('assets/date_bump_2.jpg').catch(()=>null),
   fetch('assets/dates_models.json').then(r=>r.json()).catch(()=>null)
  ]);
  const mainDiff=d2||d1, mainBump=b2||b1;
  if(mainDiff){
   if(d1)d1.colorSpace=THREE.SRGBColorSpace;
   if(d2)d2.colorSpace=THREE.SRGBColorSpace;
   dateTextures={diffuse:d1,bump:b1,diffuse2:d2,bump2:b2};
   dateMaterial=new THREE.MeshStandardMaterial({map:mainDiff,bumpMap:mainBump,bumpScale:.02,roughness:.45,metalness:.02,color:0xb87540});
  }
  if(modelsJson){
   dateModels=[];
   for(const key of ['dates','dates4']){
    if(modelsJson[key]){
     const d=modelsJson[key],g=new THREE.BufferGeometry();
     g.setAttribute('position',new THREE.Float32BufferAttribute(d.position,3));
     if(d.normal?.length)g.setAttribute('normal',new THREE.Float32BufferAttribute(d.normal,3));
     if(d.uv?.length)g.setAttribute('uv',new THREE.Float32BufferAttribute(d.uv,2));
     if(d.index)g.setIndex(d.index);
     g.computeVertexNormals();dateModels.push(g);
    }
   }
  }
  populateDates();
 }catch(e){console.warn('Background dates load failed',e);}
}
let trayFill;
async function init(){try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=0.98;stage.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(34,1,.1,100);scene.add(new THREE.HemisphereLight(0xfff6ea,0x241d15,1.05));
goldSpot=new THREE.SpotLight(0xffd580,2.1,24,Math.PI/4.4,0.85,1.2);goldSpot.position.set(5.2,5.5,3.0);goldSpot.castShadow=true;goldSpot.shadow.mapSize.set(1024,1024);goldSpot.shadow.bias=-0.0003;scene.add(goldSpot);scene.add(goldSpot.target);goldSpot.target.position.set(0,0.1,0);
keyLight=new THREE.DirectionalLight(0xfff5e3,1.35);keyLight.position.set(-3.2,5.0,3.2);keyLight.castShadow=true;keyLight.shadow.mapSize.set(1024,1024);keyLight.shadow.camera.left=-5;keyLight.shadow.camera.right=5;keyLight.shadow.camera.top=5;keyLight.shadow.camera.bottom=-5;keyLight.shadow.normalBias=.03;scene.add(keyLight);rimLight=new THREE.DirectionalLight(0xffe6a3,0.7);rimLight.position.set(3.5,3.0,-3.2);scene.add(rimLight);
trayFill=new THREE.DirectionalLight(0xffeed6,0.65);trayFill.position.set(0.8,4.5,2.5);trayFill.castShadow=false;scene.add(trayFill);
/* ground shadow removed */
createModel();ready=true;$('#loading').hidden=true;if(window.parent&&window.parent!==window){try{window.parent.postMessage({type:'unbox-state',open:state.mode!=='closed'},'*');}catch(_){}}
const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;camera.aspect=w/h;camera.fov=w<600?43:34;camera.updateProjectionMatrix();renderer.setSize(w,h);};new ResizeObserver(resize).observe(stage);resize();if(embedMode){state.active=true;}else{new IntersectionObserver(entries=>state.active=entries[0].isIntersecting,{rootMargin:'100px'}).observe(stage);}
let last=performance.now();function render(t){requestAnimationFrame(render);const dt=Math.min((t-last)/1000,.04);last=t;if(!state.active||document.hidden)return;if(state.spin&&!state.dragging)state.yaw+=dt*.22;product.rotation.set(state.pitch,state.yaw,0);lid.position.y=anim.open*(.9+anim.explode*.8);lid.rotation.z=anim.open*(1-anim.explode)*-.09;lid.position.x=anim.open*(1-anim.explode)*.18;tray.position.y=anim.explode*.72;product.position.y=.23-anim.open*.22;camera.position.set(state.zoom*.27,state.zoom*.65,state.zoom*.73);camera.lookAt(0,.1,0);keyLight.intensity=0.65+state.light*0.9;if(goldSpot)goldSpot.intensity=0.85+state.light*1.4;if(trayFill)trayFill.intensity=(0.4+anim.open*0.4)*(0.6+state.light*0.5);rimLight.intensity=.25+state.light*0.45;renderer.render(scene,camera);}requestAnimationFrame(render);
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback('3D paused. Reload to try again; the original artwork is available below.');});
const tl=new THREE.TextureLoader();
const applyCover=(k,u)=>{tl.load(u,tex=>{tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;textures[k]=tex;if(state.design===k&&lid?.userData?.art){lid.userData.art.material.map=tex;lid.userData.art.material.needsUpdate=true;}},undefined,()=>{artworkTexture(`assets/${k}.jpg`).then(tex=>{textures[k]=tex;if(state.design===k&&lid?.userData?.art){lid.userData.art.material.map=tex;lid.userData.art.material.needsUpdate=true;}}).catch(()=>{});});};
applyCover('heritage','assets/heritage_cover.jpg');applyCover('architecture','assets/architecture_cover.jpg');
loadDatesAsync(tl);
}catch(err){console.error(err);fallback('Your browser could not load 3D. Explore the original artwork below.');}}
function fallback(message){$('#loading').hidden=true;$('#fallback').hidden=false;$('#state-description').textContent=message;$('#drag-hint').textContent='Original artwork preview';document.querySelectorAll('[data-state],.view-tools button,#light,[data-demo]').forEach(b=>b.disabled=true);$('.live').textContent='ARTWORK VIEW';if(renderer)renderer.domElement.hidden=true;}
init();
const dialog=$('#lightbox');let opener;
document.querySelectorAll('[data-full]').forEach(b=>b.addEventListener('click',()=>{opener=b;dialog.querySelector('img').src=b.dataset.full;dialog.showModal();}));$('#close-lightbox').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});dialog.addEventListener('close',()=>opener?.focus());
if(!reduce.matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){if(window.gsap)gsap.to(e.target,{opacity:1,y:0,duration:.8,ease:'power2.out'});else e.target.classList.remove('reveal-ready');observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.section-intro,.artwork-grid,.process,.prototype-note').forEach(el=>{el.classList.add('reveal-ready');observer.observe(el);});}
