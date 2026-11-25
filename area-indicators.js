'use strict';
(function(root){
 const areas={learning:'Vibrant Learning',ecosystem:'Vibrant Ecosystem',logistics:'Vibrant Logistics of Learning',accountability:'Vibrant Accountability','culture-community':'Vibrant Culture and Community',journey:'The Journey to Local Accountability'};
 const headers=['id','area_id','title','description','percent','status','evidence_url','visible','sort_order'];
 const visible=value=>!['false','no','0'].includes(String(value??'').trim().toLowerCase());
 function percentage(value){const s=String(value??'').trim();const n=Number(s.replace(/%$/,''));return s&&Number.isFinite(n)&&n>=0&&n<=100?n:null;}
 function evidenceURL(value){try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:'';}catch{return '';}}
 function records(table){if(!headers.every((h,i)=>table?.[0]?.[i]===h))throw Error('Invalid area indicator headers');return table.slice(1).filter(row=>row.some(v=>String(v??'').trim())).map((row,i)=>Object.fromEntries([...headers.map((h,c)=>[h,String(row[c]??'').trim()]),['_row',i+1]]));}
 function populated(row){return /^indicator-[a-z0-9-]+$/.test(row.id||'')&&Object.hasOwn(areas,row.area_id)&&Boolean(row.title?.trim()&&row.description?.trim())&&visible(row.visible)&&(row.percent===''||percentage(row.percent)!==null)&&(!row.evidence_url||Boolean(evidenceURL(row.evidence_url)));}
 function published(table){return records(table).filter(populated).map(row=>Object.fromEntries(headers.map(h=>[h,row[h]]))).sort((a,b)=>(Number(a.sort_order)||999)-(Number(b.sort_order)||999));}
 function render(container,items,{preview=false,onSelect}={}){
  container.replaceChildren();container.className='area-indicators';
  for(const row of items){const card=document.createElement('article');card.className='area-indicator'+(preview&&!populated(row)?' indicator-draft':'');
   const title=document.createElement('h2');title.textContent=row.title||'Untitled indicator';const description=document.createElement('p');description.textContent=row.description||'Add the indicator description.';card.append(title,description);
   const n=percentage(row.percent),status=document.createElement('p');status.className='indicator-status';status.textContent=row.status||(n===null?'Awaiting data':n+'%');card.append(status);
   if(n!==null){const meter=document.createElement('progress');meter.max=100;meter.value=n;meter.setAttribute('aria-label',row.title||'Indicator progress');card.append(meter);}
   const url=evidenceURL(row.evidence_url);if(url){const a=document.createElement('a');a.href=url;a.textContent='View evidence';a.target='_blank';a.rel='noopener';card.append(a);}
   if(preview){const note=document.createElement('p');note.className='indicator-preview-note';note.textContent=populated(row)?'Ready to appear when published.':'Not public: add a title and description, and set visibility to Visible.';card.append(note);card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','Edit '+(row.title||'Untitled indicator'));card.addEventListener('click',event=>{event.preventDefault();onSelect?.(row._row);});card.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();onSelect?.(row._row);}});}
   container.append(card);
  }
 }
 const api={areas,headers,visible,percentage,evidenceURL,records,populated,published,render};root.VibrancyAreaIndicators=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
