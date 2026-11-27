'use strict';
(async function(){
 const page=location.pathname.split('/').pop()?.replace('.html','')||'home';
 VibrancyMedia.areaNavigation(document,page);
 const notice=document.createElement('p');notice.setAttribute('role','status');notice.style.cssText='font:14px system-ui;padding:1rem;text-align:center';document.querySelector('main').append(notice);
 try{let table,live=true;try{const r=await fetch('https://docs.google.com/spreadsheets/d/1NJTD9kym-A6BeEFsEXm8bsCVG5jSE0EAjYuR5lAXpAU/gviz/tq?tqx=out:json&sheet=SiteContent&range=A1%3AF200&headers=1&_='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error();const text=await r.text();const data=JSON.parse(text.slice(text.indexOf('{'),text.lastIndexOf('}')+1));if(!data.table)throw Error();table=data.table.rows.map(r=>r.c.map(c=>String(c?.v??'')));}catch{live=false;const r=await fetch('data/site-content.json');if(!r.ok)throw Error();table=(await r.json()).slice(1);}
 for(const row of table){if(row[0]!==page)continue;const selector=row[1];if(!/^(h1|\.description|\.coming [hp][12]?|#page-title|\.subtitle|\.eyebrow|#results|\.card-[a-z]+ (h2|\.card-copy p))$/.test(selector))continue;let el=document.querySelector(selector);if(el){if(page==='learning'&&selector==='.subtitle')el=VibrancyPageCopy.apply(el,row[2]);else el.textContent=row[2];el.hidden=String(row[5]).toUpperCase()==='FALSE';}}
 VibrancyMedia.pages(document,table.filter(r=>r[0]===page).map(r=>({selector:r[1],value:r[2],description:r[3],url:r[4],visible:r[5]})));
 notice.textContent=live?'Page content loaded from Google Sheets.':'Live page content unavailable — showing saved November 25, 2026 content.';
 }catch{notice.textContent='Page updates unavailable. Showing built-in content.';}
})();
