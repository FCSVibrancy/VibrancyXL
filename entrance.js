'use strict';
(function(root){
 function animateEntrance(container,scrollRoot=null){
  const motion=root.matchMedia('(prefers-reduced-motion: reduce)');
  if(!root.IntersectionObserver||motion.matches||!root.Element.prototype.animate)return ()=>{};
  const tiles=[...container.querySelectorAll('.card, .purpose-kpi')];
  const meters=[...container.querySelectorAll('.purpose-meter-wrap')];
  const targets=[...tiles,...meters],animations=new Set(),tileEnds=new Map();
  if(!targets.length)return ()=>{};
  let observer,stopped=false;
  function play(element,frames,duration,delay=0){
   const animation=element.animate(frames,{duration,delay,easing:'ease-out',fill:'both'});
   animations.add(animation);
   animation.onfinish=()=>{animation.cancel();animations.delete(animation);};
  }
  function revealTile(tile,delay=0){
   if(tile.classList.contains('entrance-visible'))return;
   tile.classList.add('entrance-visible');
   tileEnds.set(tile,root.performance.now()+delay+850);
   play(tile,[{opacity:0},{opacity:1}],850,delay);
   observer.unobserve(tile);
  }
  function revealMeter(meter){
   if(meter.classList.contains('entrance-visible'))return;
   const tile=meter.closest('.purpose-kpi');
   if(tile&&!tile.classList.contains('entrance-visible'))revealTile(tile);
   const wait=Math.max(0,(tileEnds.get(tile)||0)-root.performance.now())+180;
   meter.classList.add('entrance-visible');
   play(meter,[{opacity:0},{opacity:1}],450,wait);
   const fill=meter.querySelector('.purpose-meter>span');
   if(fill)play(fill,[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],1600,wait+450);
   observer.unobserve(meter);
  }
  function cleanup(){
   stopped=true;observer?.disconnect();
   for(const animation of animations)animation.cancel();animations.clear();
   container.removeEventListener('focusin',focus);motion.removeEventListener?.('change',onMotion);
   for(const target of targets)target.classList.remove('entrance-ready','entrance-visible');
  }
  function onMotion(event){if(event.matches)cleanup();}
  function focus(event){for(const tile of tiles)if(tile.contains(event.target))revealTile(tile);}
  try{
   observer=new root.IntersectionObserver(entries=>{
    if(stopped)return;
    const visible=entries.filter(entry=>entry.isIntersecting);
    let stagger=0;
    for(const {target} of visible)if(tiles.includes(target))revealTile(target,Math.min(stagger++ * 160,480));
    for(const {target} of visible)if(meters.includes(target))revealMeter(target);
   },{root:scrollRoot,threshold:0.12});
   for(const target of targets){target.classList.add('entrance-ready');observer.observe(target);}
   container.addEventListener('focusin',focus);motion.addEventListener?.('change',onMotion);
  }catch{cleanup();}
  return cleanup;
 }
 root.animateEntrance=animateEntrance;
})(typeof window==='undefined'?globalThis:window);
