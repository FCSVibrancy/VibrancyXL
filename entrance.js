'use strict';
// Opt-in animation: content stays visible if observers or motion are unavailable.
(function(root){
 function animateEntrance(container,scrollRoot=null){
  if(!root.IntersectionObserver||root.matchMedia('(prefers-reduced-motion: reduce)').matches)return ()=>{};
  const tiles=[...container.querySelectorAll('.card, .purpose-kpi')];
  const meters=[...container.querySelectorAll('.purpose-meter-wrap')];
  const targets=[...tiles,...meters];
  if(!targets.length)return ()=>{};
  let observer;
  const reveal=target=>{target.classList.add('entrance-visible');observer.unobserve(target);};
  const focus=event=>{for(const target of targets)if(target.contains(event.target)){target.style.setProperty('--entrance-delay','0ms');reveal(target);}};
  try{
   observer=new root.IntersectionObserver(entries=>{
    let stagger=0;
    for(const entry of entries){if(!entry.isIntersecting)continue;
     const target=entry.target;
     if(tiles.includes(target))target.style.setProperty('--entrance-delay',`${Math.min(stagger++ * 90,270)}ms`);
     reveal(target);
    }
   },{root:scrollRoot,threshold:0.12});
   for(const target of targets){target.classList.add('entrance-ready');observer.observe(target);}
   container.addEventListener('focusin',focus);
  }catch{for(const target of targets)target.classList.remove('entrance-ready');observer?.disconnect();}
  return ()=>{observer?.disconnect();container.removeEventListener('focusin',focus);for(const target of targets)target.classList.remove('entrance-ready','entrance-visible');};
 }
 root.animateEntrance=animateEntrance;
})(typeof window==='undefined'?globalThis:window);
