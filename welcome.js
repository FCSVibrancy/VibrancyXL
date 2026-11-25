'use strict';
(function(){
 const home=new URL('home.html',location.href),key='vibrancy-welcome-seen';
 const documentRoot=document.documentElement,link=document.querySelector('.enter-vibrancy');
 let leaving=false,timer;
 try{if(sessionStorage.getItem(key)==='yes'){location.replace(home.href);return;}}catch{}
 documentRoot.classList.add('welcome-loading');
 function enter(){if(leaving)return;leaving=true;clearTimeout(timer);try{sessionStorage.setItem(key,'yes');}catch{}
 documentRoot.classList.add('welcome-leaving');
 setTimeout(()=>location.replace(home.href),matchMedia('(prefers-reduced-motion: reduce)').matches?0:900);
 }
 link.addEventListener('click',event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();enter();});
 const images=[...document.querySelectorAll('img'),...document.querySelectorAll('svg image')].map(el=>{
 if(el.tagName.toLowerCase()==='img')return el.decode?.().catch(()=>{})||Promise.resolve();
 const image=new Image();image.src=el.getAttribute('href');return image.decode().catch(()=>{});
 });
 Promise.all(images).finally(()=>{documentRoot.classList.remove('welcome-loading');documentRoot.classList.add('welcome-ready');timer=setTimeout(enter,14000);});
 window.addEventListener('pagehide',()=>clearTimeout(timer));
})();
