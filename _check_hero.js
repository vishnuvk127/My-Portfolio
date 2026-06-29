const heroSection = document.getElementById('hero');
const mainVid = document.getElementById('mainVideo');
const ambVid  = document.getElementById('ambientVideo');
let hasStarted = false;

mainVid.muted  = false;
mainVid.volume = 1;

function tryPlay() {
  mainVid.play().then(() => {
    hasStarted = true;
  }).catch(() => {
    mainVid.muted = true;
    mainVid.play().catch(() => {});
    hasStarted = true;

    const unmute = () => {
      mainVid.muted  = false;
      mainVid.volume = 1;
    };
    window.addEventListener('click',      unmute, { once: true });
    window.addEventListener('touchstart', unmute, { once: true, passive: true });
    window.addEventListener('keydown',    unmute, { once: true });
  });
}
tryPlay();

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;

  requestAnimationFrame(() => {
    ticking = false;

    const { top, height } = heroSection.getBoundingClientRect();

    const scrolled  = Math.max(0, -top);
    const fadeZone  = height * 0.6;
    const progress  = Math.min(1, scrolled / fadeZone);
    const targetVol = 1 - progress;

    if (!mainVid.muted) {
      mainVid.volume = targetVol;
    }

    if (progress >= 1) {
      if (!mainVid.paused) mainVid.pause();
    } else if (mainVid.paused && hasStarted) {
      mainVid.play().catch(() => {});
    }
  });
}
window.addEventListener('scroll', onScroll, { passive: true });

document.getElementById('scrollIndicator').addEventListener('click', () => {
  document.getElementById('about').scrollIntoView({behavior:'smooth'});
});

gsap.timeline({delay:.35})
  .to('#tagline',   {opacity:1,duration:1.1,ease:'power3.out'})
  .to('#firstName', {opacity:1,y:0,duration:1.2,ease:'power4.out'},'-=0.55')
  .to('#lastName',  {opacity:1,y:0,duration:1.2,ease:'power4.out'},'-=0.95')
  .to('#subtitle',  {opacity:1,duration:1.1,ease:'power2.out'},'-=0.6')
  .to('#scrollIndicator',{opacity:.55,duration:1,ease:'power2.out'},'-=0.4');

(function(){
  const canvas = document.getElementById('threeCanvas');
  const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8));
  renderer.setClearColor(0x000000,0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55,1,0.1,1000);
  camera.position.z = 80;

  const N = 160, positions = [], sizes = [], nodeData = [];
  for(let i=0;i<N;i++){
    const x=(Math.random()-.5)*220, y=(Math.random()-.5)*130, z=(Math.random()-.5)*80;
    positions.push(x,y,z); sizes.push(Math.random()*2.8+.5);
    nodeData.push({ox:x,oy:y,oz:z,
      phaseX:Math.random()*Math.PI*2,phaseY:Math.random()*Math.PI*2,phaseZ:Math.random()*Math.PI*2,
      speedX:.18+Math.random()*.22,speedY:.12+Math.random()*.18,speedZ:.08+Math.random()*.12,
      ampX:4+Math.random()*7,ampY:3+Math.random()*5,ampZ:2+Math.random()*4});
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(positions),3));
  pGeo.setAttribute('size',new THREE.BufferAttribute(new Float32Array(sizes),1));
  const pMat = new THREE.ShaderMaterial({
    uniforms:{uTime:{value:0},uColor:{value:new THREE.Color(0xFF8C42)},uWhite:{value:new THREE.Color(0xFFEDD8)}},
    vertexShader:`attribute float size;uniform float uTime;varying float vW;void main(){vW=clamp(position.z/40.+.5,0.,1.);vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*(180./-mv.z);gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`uniform vec3 uColor,uWhite;varying float vW;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;float a=pow(1.-d,2.2)*.75;gl_FragColor=vec4(mix(uColor,uWhite,vW*.55),a);}`,
    transparent:true,blending:THREE.AdditiveBlending,depthWrite:false
  });
  scene.add(new THREE.Points(pGeo,pMat));

  const edgeVerts=[], pairs=new Set(); let att=0;
  while(edgeVerts.length/6<90&&att<2000){
    att++;const a=Math.floor(Math.random()*N),b=Math.floor(Math.random()*N);
    if(a===b)continue;const k=a<b?`${a}_${b}`:`${b}_${a}`;if(pairs.has(k))continue;
    const{ox:ax,oy:ay,oz:az}=nodeData[a],{ox:bx,oy:by,oz:bz}=nodeData[b];
    if(Math.hypot(ax-bx,ay-by,az-bz)>70)continue;
    pairs.add(k);edgeVerts.push(ax,ay,az,bx,by,bz);
  }
  const pairList=[...pairs].map(k=>k.split('_').map(Number));
  const eGeo=new THREE.BufferGeometry();
  eGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(edgeVerts),3));
  const eMat=new THREE.LineBasicMaterial({color:0xFF8C42,opacity:.07,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
  scene.add(new THREE.LineSegments(eGeo,eMat));

  let mX=0,mY=0,tX=0,tY=0;
  document.addEventListener('mousemove',e=>{mX=(e.clientX/innerWidth-.5)*2;mY=(e.clientY/innerHeight-.5)*2},{passive:true});

  const resize=()=>{const w=innerWidth,h=innerHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};
  resize(); window.addEventListener('resize',resize,{passive:true});

  const posAttr=pGeo.attributes.position, eAttr=eGeo.attributes.position;
  let raf;
  (function animate(t){
    raf=requestAnimationFrame(animate);
    const time=t*.001;
    pMat.uniforms.uTime.value=time;
    for(let i=0;i<N;i++){const d=nodeData[i];posAttr.setXYZ(i,d.ox+Math.sin(time*d.speedX+d.phaseX)*d.ampX,d.oy+Math.sin(time*d.speedY+d.phaseY)*d.ampY,d.oz+Math.sin(time*d.speedZ+d.phaseZ)*d.ampZ);}
    posAttr.needsUpdate=true;
    pairList.forEach(([a,b],i)=>{eAttr.setXYZ(i*2,posAttr.getX(a),posAttr.getY(a),posAttr.getZ(a));eAttr.setXYZ(i*2+1,posAttr.getX(b),posAttr.getY(b),posAttr.getZ(b));});
    eAttr.needsUpdate=true;
    tX+=(mX*6-tX)*.04; tY+=(-mY*3.5-tY)*.04;
    camera.position.x=tX; camera.position.y=tY; camera.lookAt(scene.position);
    renderer.render(scene,camera);
  })(0);
  window.addEventListener('beforeunload',()=>{cancelAnimationFrame(raf);pGeo.dispose();pMat.dispose();eGeo.dispose();eMat.dispose();renderer.dispose();});
})();
