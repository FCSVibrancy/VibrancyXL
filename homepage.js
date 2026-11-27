'use strict';
(function(){
 const SHEET='https://docs.google.com/spreadsheets/d/1NJTD9kym-A6BeEFsEXm8bsCVG5jSE0EAjYuR5lAXpAU/gviz/tq?tqx=out:csv&sheet=Homepage&range=A1%3AI200&headers=1';
 function csv(text){const rows=[];let row=[],value='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(value);value='';}else if(/[\r\n]/.test(c)&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(value);if(row.some(Boolean))rows.push(row);row=[];value='';}else value+=c;}if(quoted)throw Error('Incomplete CSV');if(value||row.length){row.push(value);rows.push(row);}return rows;}
 function records(table){const [headers,...rows]=table;if(!['type','id','title','description','url','button','icon','sort_order','visible'].every(key=>headers?.includes(key)))throw Error('Invalid homepage headers');const data=rows.map(row=>Object.fromEntries(headers.map((h,i)=>[h,String(row[i]??'')])));if(!data.some(r=>r.type==='page'&&r.id==='home')||!data.some(r=>r.type==='tile'))throw Error('Incomplete homepage');return data;}
 function safeURL(value){return VibrancyMedia.source(value)||null;}
 function styleTiles(ready){const nav=document.querySelector(".pathways");for(const tile of nav.children){const area=new URL(tile.dataset.destination||tile.href,document.baseURI).pathname.split("/").pop().replace(".html","");const available=ready.has(area);tile.classList.toggle("pathway-featured",area==="learning");tile.classList.toggle("pathway-pending",!available);if(!available){tile.dataset.destination=tile.getAttribute("href")||tile.dataset.destination;tile.removeAttribute("href");tile.setAttribute("aria-disabled","true");tile.querySelector(".explore").textContent="Coming soon";}else {tile.removeAttribute("aria-disabled");if(tile.dataset.destination)tile.href=tile.dataset.destination;}if(area==="learning")nav.prepend(tile);}}
 function draw(data,icons,ready){const find=(type,id)=>data.find(r=>r.type===type&&r.id===id);const page=find('page','home');document.querySelector('#welcome-title').textContent=page.title;document.querySelector('.welcome>p:last-child').textContent=page.description;
 for(const [id,selector] of [['eyebrow','.eyebrow'],['district','.district-name'],['closing','.closing p']]){const item=find('label',id);if(item)document.querySelector(selector).textContent=item.title;}
 const image=find('image','header'),src=safeURL(image?.url);if(src){const img=document.querySelector('.hero img');img.src=src.endsWith('assets/vibrancy-header.png')?'assets/vibrancy-home-banner-4k.jpg':src;img.alt=image.title;}
 const tiles=data.filter(r=>r.type==='tile'&&!['FALSE','0','NO'].includes(r.visible.trim().toUpperCase())).sort((a,b)=>(Number(a.sort_order)||999)-(Number(b.sort_order)||999));const nav=document.querySelector('.pathways');nav.replaceChildren();for(const tile of tiles){const url=safeURL(tile.url);if(!url)continue;const a=document.createElement('a');a.className='pathway';a.href=url;const icon=document.createElement('span');icon.className='icon';if(VibrancyMedia.source(tile.icon))VibrancyMedia.image(icon,tile.icon);else if(icons[tile.icon])icon.innerHTML=icons[tile.icon];else icon.textContent=tile.icon||'✦';const h=document.createElement('h3');h.textContent=tile.title;const p=document.createElement('p');p.textContent=tile.description;const action=document.createElement('span');action.className='explore';action.textContent=tile.button||'Explore this area';a.append(icon,h,p,action);nav.append(a);}styleTiles(ready);}
 let learningEntry,entryLoader,entryRequest;
 function cancelEntry(){entryRequest=null;entryLoader?.stop();entryLoader=null;}
 function entryWindow(){
  if(learningEntry)return learningEntry;
  learningEntry=document.createElement('dialog');learningEntry.className='learning-entry-dialog';learningEntry.setAttribute('aria-labelledby','learning-entry-title');
  const close=document.createElement('button');close.type='button';close.className='learning-entry-close';close.setAttribute('aria-label','Cancel opening Vibrant Learning');close.textContent='×';close.autofocus=true;close.addEventListener('click',()=>learningEntry.close());
  const content=document.createElement('div');content.className='learning-entry-content';learningEntry.append(close,content);document.body.append(learningEntry);
  learningEntry.addEventListener('cancel',cancelEntry);
  learningEntry.addEventListener('close',()=>{cancelEntry();document.querySelector('.pathways .pathway-featured')?.focus({preventScroll:true});});
  learningEntry.addEventListener('click',event=>{if(event.target!==learningEntry)return;const rect=learningEntry.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)learningEntry.close();});
  return learningEntry;
 }
 async function enterLearning(destination){
  const dialog=entryWindow();if(dialog.open)return;
  const request=Symbol();entryRequest=request;
  entryLoader=VibrancyLoading.show(dialog.querySelector('.learning-entry-content'),{quote:VibrancyLoading.defaultQuote,titleId:'learning-entry-title',usePublishedQuote:false});
  dialog.showModal();entryLoader.update(5);
  await entryLoader.ready;
  if(entryRequest!==request||!dialog.open)return;
  entryLoader.stop();location.assign(destination.href);
 }
 document.querySelector('.pathways').addEventListener('click',event=>{
  if(event.target.closest('[aria-disabled="true"]')){event.preventDefault();return;}
  const link=event.target.closest('a[href]');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
  const destination=new URL(link.href,document.baseURI);
  if(destination.origin!==location.origin||!destination.pathname.endsWith('/learning.html')||!window.VibrancyLoading)return;
  event.preventDefault();enterLearning(destination);
 });
 window.addEventListener('pagehide',()=>{cancelEntry();if(learningEntry?.open)learningEntry.close();});
 styleTiles(new Set(['learning']));
 async function availability(){
 const ready=new Set(['learning']);
 try{const response=await fetch('/api/indicators',{cache:'no-store',signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error();const data=await response.json();for(const row of data.indicators)if(VibrancyAreaIndicators.populated(row))ready.add(row.area_id);}catch{/* Unverified areas remain inactive. */}
 return ready;
 }

 let busy=false;
 async function refresh(){if(busy)return;busy=true;const status=document.querySelector('#home-status'),button=document.querySelector('#home-refresh');button.disabled=true;status.textContent='Loading homepage updates…';try{const readyPromise=availability();const icons=await fetch('data/homepage-icons.json').then(r=>{if(!r.ok)throw Error();return r.json();});let data,live=true;try{const response=await fetch(SHEET+'&_='+Date.now(),{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(8000)});if(!response.ok)throw Error();data=records(csv(await response.text()));}catch{live=false;const response=await fetch('data/homepage.json',{cache:'no-store'});if(!response.ok)throw Error();data=records(await response.json());}draw(data,icons,await readyPromise);status.textContent=live?'Homepage loaded from Google Sheets.':'Live sheet unavailable — showing saved homepage content from November 25, 2026.';}catch{status.textContent='Homepage updates unavailable — showing the built-in content. Try refreshing.';}finally{button.disabled=false;busy=false;}}
 document.querySelector('#home-refresh').addEventListener('click',refresh);window.addEventListener('pageshow',event=>{if(event.persisted)refresh();});refresh();
})();
