'use strict';
(async function(){
 const area=location.pathname.split('/').pop().replace('.html','');if(!Object.hasOwn(VibrancyAreaIndicators.areas,area))return;
 const parent=document.querySelector('.section-page')||document.querySelector('main');
 const section=document.createElement('section');section.className='area-indicators-section';section.setAttribute('aria-label',VibrancyAreaIndicators.areas[area]+' indicators');const heading=document.createElement('h2');heading.textContent='Indicators';const status=document.createElement('p');status.setAttribute('role','status');status.textContent='Loading indicators…';const cards=document.createElement('div');section.append(heading,status,cards);parent.append(section);
 async function load(){try{const response=await fetch('/api/indicators',{cache:'no-store',signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error();const data=await response.json();const rows=data.indicators.filter(row=>row.area_id===area&&VibrancyAreaIndicators.populated(row));cards.hidden=!rows.length;if(rows.length)VibrancyAreaIndicators.render(cards,rows,{area,description:parent.querySelector('.description')?.textContent||''});status.textContent=rows.length?'':area==='learning'?'':'Indicators will appear here when published.';section.hidden=area==='learning'&&!rows.length;const coming=parent.querySelector('.coming');if(coming)coming.hidden=rows.length>0;}catch{status.textContent='Indicators are temporarily unavailable. Refresh to try again.';}}
 await load();window.addEventListener('pageshow',event=>{if(event.persisted)load();});
})();
