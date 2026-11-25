'use strict';
(function(root){
 const SHEET_ID='1NJTD9kym-A6BeEFsEXm8bsCVG5jSE0EAjYuR5lAXpAU';
 const SHEET_URL=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1&range=A1%3AZ250&headers=1`;
 function parseCSV(text){
  const rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(ch===','&&!quoted){row.push(field);field='';}else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(Boolean))rows.push(row);row=[];field='';}else field+=ch;}
  if(field||row.length){row.push(field);rows.push(row);}if(quoted)throw Error('Incomplete CSV');return rows;
 }
 function records(table){const [headers,...rows]=table;if(!headers||!['type','id','title','percent'].every(k=>headers.includes(k)))throw Error('Invalid sheet headers');const result=rows.filter(r=>r[0]).map(r=>Object.fromEntries(headers.map((key,i)=>[key,String(r[i]??'')])));if(!result.some(r=>r.type==='page'&&r.id==='purpose')||!result.some(r=>r.type==='kpi'))throw Error('Missing purpose content');return result;}
 const EXPERIENCE_IDS={
  'Learning with Purpose':'purpose','Big Thinking, Real Problems':'thinking','My Voice, My Choices':'voice','Show What You Can Do':'work','Feedback That Moves Me Forward':'feedback','Support to Take the Next Step':'support','Thriving Learner':'thriving'
 };
 function applyAlignment(data,table){
  const index=table.findIndex(row=>row[0]?.trim()==='Dashboard tile'&&row[1]?.trim()==='KPI card title');
  if(index<0)throw Error('Alignment headers not found');
  const aliases={...EXPERIENCE_IDS,...Object.fromEntries(data.filter(r=>r.type==='nav').map(r=>[r.title,r.id]))};
  const updates=new Map();
  const primary=text=>String(text||'').match(/\b[A-G]\d+\b/)?.[0];
  for(const row of table.slice(index+1)){
   const id=aliases[row[0]?.trim()];if(!id||id==='purpose'||id==='thriving'||!row[1]?.trim())continue;
   const code=primary(row[3]);
   const target=data.find(r=>r.type==='kpi'&&r.experience_id===id&&((code&&primary(r.walkthrough_alignment)===code)||r.title===row[1]));
   if(target)updates.set(target.id,{title:row[1],description:row[2]||'',walkthrough_alignment:row[3]||''});
  }
  if(!updates.size)throw Error('Alignment KPI definitions not found');
  return data.map(row=>row.type==='kpi'&&updates.has(row.id)?{...row,...updates.get(row.id)}:row);
 }
 function percentage(raw){const s=String(raw??'').trim();if(!s)return null;const n=Number(s.replace(/%$/,''));return Number.isFinite(n)&&n>=0&&n<=100?n:null;}
 const escape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 function evidenceSection(row,label){
  const links=root.evidenceLinks(row);let external='';try{const url=new URL(row.external_evidence_url);if(url.protocol==='https:'&&!url.username&&!url.password)external=url.href;}catch{}
  return `<section class="purpose-evidence"><h4>${escape(label('evidence_practice')||'Evidence of Practice')}</h4>${links.length?`<div class="purpose-evidence-links">${links.map(link=>`<button type="button" data-evidence-id="${escape(row.id)}" data-evidence-slot="${link.slot}" aria-haspopup="dialog">${escape(link.label)}</button>`).join('')}</div>`:external?`<div class="purpose-evidence-links"><a href="${escape(external)}" target="_blank" rel="noopener noreferrer">View evidence</a></div>`:`<p class="purpose-evidence-empty">${escape(label('no_evidence')||'Evidence will appear here when available.')}</p>`}</section>`;
 }
 const icons={heart:'<path d="M40 67 13 40C-3 22 20 4 40 24 60 4 83 22 67 40Z"/>',book:'<path d="M10 18q14-7 27 0v39q-13-7-27 0zm27 0q13-7 27 0v39q-13-7-27 0z"/><path d="M5 22v41h57M16 22v29m43-29v24"/><circle cx="58" cy="56" r="15"/><path d="m65 49-5 10-10 5 5-10z"/>',target:'<circle cx="38" cy="40" r="26"/><circle cx="38" cy="40" r="16"/><circle cx="38" cy="40" r="5"/><path d="m38 40 29-29m-10 0 10-1-1 10"/>',checklist:'<rect x="13" y="9" width="51" height="62" rx="3"/><path d="m21 24 4 4 7-8m7 5h17M21 40l4 4 7-8m7 5h17M21 56l4 4 7-8m7 5h17"/>',steps:'<path d="M9 66V49h20V33h20V17h21v49z"/>'};
 function icon(name){return `<svg viewBox="0 0 80 80" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">${icons[name]||icons.book}</svg>`;}
 function markup(data,windowId,experienceId='purpose'){
  const label=id=>data.find(r=>r.type==='label'&&r.id===id)?.title||'';
  const page=data.find(r=>r.type==='page'&&r.id===experienceId);const sorted=type=>data.filter(r=>r.type===type).sort((a,b)=>(a.sort_order.trim()?Number(a.sort_order):999)-(b.sort_order.trim()?Number(b.sort_order):999));
  const windows=sorted('window');const kpis=sorted('kpi').filter(r=>(r.experience_id||'purpose')===experienceId&&(!r.reporting_window||r.reporting_window===windowId));
  const examples=sorted('example').filter(r=>(r.experience_id||'purpose')===experienceId&&(!r.reporting_window||r.reporting_window===windowId));
  return `<header class="purpose-brand"><svg viewBox="53 4 120 88" aria-hidden="true"><image href="assets/dashboard-reference.png" width="1586" height="992"/></svg><span><strong>${escape(label('brand'))}</strong><small>${escape(label('district'))}</small></span></header>
  ${sorted('nav').length?`<nav class="purpose-nav" aria-label="Learning experiences">${sorted('nav').map(r=>`<button data-purpose-nav="${escape(r.id)}" ${r.id===experienceId?'aria-current="page"':''}>${escape(r.title)}</button>`).join('')}</nav>`:''}
  <section class="purpose-heading"><div><h2 id="detail-title">${escape(page.title)}</h2><p>${escape(page.description)}</p></div><label class="purpose-reporting"><span>${escape(label('reporting'))}</span><select id="purpose-window" aria-label="${escape(label('reporting'))}">${windows.map(r=>`<option value="${escape(r.id)}" ${r.id===windowId?'selected':''}>${escape(r.title)}</option>`).join('')}</select></label></section>
  <p class="purpose-commitment">${escape(label('commitment'))}</p>
  <section class="purpose-kpis" aria-label="${escape(page.title)} KPIs">${kpis.map((r,i)=>{const n=percentage(r.percent);return `<article class="purpose-kpi purpose-tone-${i%4}"><div class="purpose-kpi-intro"><div class="purpose-icon">${icon(r.icon)}</div><div><h3>${escape(r.title)}</h3><p>${escape(r.description)}</p>${r.why_it_matters?`<p class="purpose-why"><strong>${escape(label('why'))}</strong> ${escape(r.why_it_matters)}</p>`:''}</div></div><div class="purpose-status"><div><span>${escape(label('current_status'))}</span><strong class="${n===null?'purpose-status-pending':'purpose-status-value'}">${escape(r.status||(n===null?label('awaiting'):n+'%'))}</strong></div><div class="purpose-meter-wrap"><div class="purpose-meter" ${n===null?'aria-hidden="true"':`role="progressbar" aria-label="${escape(r.title)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${n}"`}><span style="width:${n??0}%"></span></div><div class="purpose-rating-row"><span class="purpose-rating ${n===null?'pending':''}">${escape(r.maturity||label('evidence'))}</span>${r.note?`<span class="purpose-note">${escape(r.note)}</span>`:''}</div></div></div>${r.walkthrough_alignment?`<p class="purpose-alignment"><strong>${escape(label('alignment')||'Walkthrough alignment')}</strong> ${escape(r.walkthrough_alignment)}</p>`:''}${evidenceSection(r,label)}</article>`;}).join('')}</section>
  ${examples.length?`<section class="purpose-examples"><h3>${escape(label('examples'))}</h3>${examples.map(r=>`<div><h4>${escape(r.title)}</h4><p>${escape(r.description)}</p></div>`).join('')}</section>`:''}
  <section class="purpose-legend"><h3>${escape(label('maturity'))}</h3><ul>${sorted('maturity').map((r,i)=>`<li class="maturity-${i}">${escape(r.title)}</li>`).join('')}</ul></section>`;
 }
 async function openPurposeDashboard(onNavigate,experienceId='purpose'){
  openPurposeDashboard.clearEntrance?.();
 const dialog=document.querySelector('#detail'),content=document.querySelector('#detail-content');dialog.classList.add('purpose-dialog');
  content.innerHTML='<h2 id="detail-title">Loading learning evidence…</h2><p role="status">Reading the Google Sheet.</p>';if(!dialog.open)dialog.showModal();
  const requestId=Symbol();openPurposeDashboard.requestId=requestId;
  let data,source='live';try{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);try{const response=await fetch(SHEET_URL+'&_='+Date.now(),{signal:controller.signal,credentials:'omit',cache:'no-store'});if(!response.ok)throw Error('Sheet unavailable');data=records(parseCSV(await response.text()));}finally{clearTimeout(timer);}}
  catch(error){source='snapshot';try{const response=await fetch('data/learning-purpose.json',{cache:'no-store'});if(!response.ok)throw Error('Snapshot unavailable');const snapshot=await response.json();data=records([snapshot.headers,...snapshot.rows]);}catch{if(openPurposeDashboard.requestId===requestId&&dialog.open)content.innerHTML='<h2 id="detail-title">Learning evidence is unavailable</h2><p>Please close this window and try again.</p>';return;}}
  if(openPurposeDashboard.requestId!==requestId||!dialog.open||!dialog.classList.contains('purpose-dialog'))return;
  let alignmentNotice='';
  if(source==='live'&&!['purpose','thriving'].includes(experienceId)){
   try{const response=await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Alignment&range=A4%3AD100&headers=1&_=${Date.now()}`,{credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(8000)});if(!response.ok)throw Error('Alignment unavailable');data=applyAlignment(data,parseCSV(await response.text()));}
   catch{alignmentNotice=' · Alignment unavailable; showing the saved KPI definitions in Sheet1.';}
  }
  if(openPurposeDashboard.requestId!==requestId||!dialog.open||!dialog.classList.contains('purpose-dialog'))return;
  const windows=data.filter(r=>r.type==='window').sort((a,b)=>(a.sort_order.trim()?Number(a.sort_order):999)-(b.sort_order.trim()?Number(b.sort_order):999));let selected=windows[0]?.id||'current';
  function draw(){openPurposeDashboard.clearEntrance?.();content.innerHTML=markup(data,selected,experienceId)+`<div class="purpose-source" role="status">${source==='live'?'Loaded from Google Sheets':'Live sheet unavailable — showing the saved sheet snapshot from November 25, 2026. Ratings may be out of date.'}${alignmentNotice} · <a href="https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit" target="_blank" rel="noopener">View source sheet</a> <button id="purpose-refresh">Refresh data</button></div>`;content.querySelector('#purpose-window').addEventListener('change',event=>{selected=event.target.value;draw();content.querySelector('#purpose-window').focus();});content.querySelector('#purpose-refresh').addEventListener('click',()=>openPurposeDashboard(onNavigate,experienceId));content.querySelectorAll('[data-purpose-nav]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.purposeNav!==experienceId){openPurposeDashboard.requestId=null;dialog.classList.remove('purpose-dialog');openPurposeDashboard.clearEntrance?.();onNavigate(button.dataset.purposeNav);}}));content.querySelectorAll('[data-evidence-id]').forEach(button=>button.addEventListener('click',()=>{
   const row=data.find(r=>r.type==='kpi'&&r.id===button.dataset.evidenceId&&(!r.reporting_window||r.reporting_window===selected));
   const link=root.evidenceLinks(row||{}).find(link=>link.slot===Number(button.dataset.evidenceSlot));if(link)root.openEvidence(link,button);
  }));openPurposeDashboard.clearEntrance=animateEntrance(content,dialog);}
  dialog.addEventListener('close',()=>openPurposeDashboard.clearEntrance?.(),{once:true});
  draw();
 }
 root.VibrancyDashboard={markup,applyAlignment};
 root.openPurposeDashboard=openPurposeDashboard;
 if(typeof module!=='undefined')module.exports={parseCSV,records,percentage,markup,applyAlignment};
})(typeof window==='undefined'?globalThis:window);
