'use strict';
(function(root){
 const D=root.VibrancyDashboard,A=root.VibrancyAreaIndicators;
 const short={
  curriculum:'Every classroom teaches the same essential learning, with enough time for students to practice and show what they know.',
  standards:'Students explain what they are learning and why it matters when a Priority Standard is introduced.',
  scales:'Before showing proficiency, students use a Proficiency Scale to study examples and explain what makes the work successful.',
  expectations:'Students understand the expectations and do grade-level thinking, with support that keeps the thinking in their hands.',
  'thinking-1':'Students use grade-level learning to address a real problem and explain how evidence shaped their solution.',
  'thinking-2':'When a problem calls for it, students connect subjects and explain how those connections improved their response.',
  'voice-1':'Students explain a decision their input helped shape and what changed because of their ideas.',
  'voice-2':'Students make a meaningful choice about their work and explain how that choice shaped what they did.',
  'voice-3':'Students connect learning to their interests, strengths, experiences, community knowledge, or hopes for the future.',
  'work-1':'Students write weekly in every course to develop ideas or communicate understanding in that subject.',
  'work-2':'Students apply learning through authentic work. Priority Standards and BRIDGE Performance Indicators provide the criteria for judging readiness.',
  'work-3':'In grades 3–12, students select portfolio evidence and present what they can do, how they have progressed, and their next steps.',
  'scales-self-check':'During instruction, students use a Proficiency Scale to check their work and name a specific improvement while they have time to act.',
  'support-1':'Students receive timely help with challenging grade-level work and explain how it helped them move forward more independently.',
  'support-2':'Students explain their ideas, build on peers’ thinking, and identify how collaboration strengthened their understanding.',
  'support-3':'Students look for patterns in earlier work or feedback, set a learning goal, and choose a strategy or support.',
  'thriving-1':'Students compare earlier and later evidence of the same learning, explain their progress, and identify what helped.',
  'thriving-2':'Students show the learning expected for a Priority Standard. Reviewers use the aligned scale’s 3.0 target where available.',
  'thriving-3':'Students apply learning in a setting that shows preparation for their next grade, course, pathway, or life beyond school.',
  'thriving-agency':'Over time, students increasingly set goals, make decisions, and explain the results of directing their own learning.',
  'thriving-4':'Students describe belonging, self-awareness, and support for social, emotional, and physical well-being.'
 };
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function assemble(snapshot,wording,terms,area=[]){
  const saved=snapshot.rows.map(row=>Object.fromEntries(snapshot.headers.map((h,i)=>[h,String(row[i]??'')])));let data=D.applyPublishedWording(D.mergeDefinitions(saved,saved),wording);
  for(const r of wording)if(r.type==='kpi'&&!data.some(d=>d.type==='kpi'&&d.id===r.id))data.push({...r,sort_order:'999',percent:'',status:'Awaiting Evidence'});
  data=D.applyTermResults(data,terms);
  const sections=root.VibrancyExperiences.map(exp=>({...exp,kind:exp.id==='thriving'?'Learner outcomes':'Learner experience',indicators:D.indicatorRows(data,exp.id).map(r=>{
   const original=saved.find(d=>d.type==='kpi'&&d.id===r.id),description=original?.description===r.description&&short[r.id]?short[r.id]:r.description;
   return {...r,summary:description,terms:[1,2,3].map(term=>data.find(d=>d.type==='kpi'&&d.id===r.id&&(d.experience_id||'purpose')===D.reportingHome(r.id,r.experience_id||'purpose')&&D.reportingTerm(d,data)===term))};
  })}));
  const items=area.filter(r=>r.area_id==='learning'&&A.populated(r));
  if(items.length){const extra=A.dashboardData(items,'learning','',terms);sections.push({id:'learning',title:'More Vibrant Learning indicators',question:'Additional published indicators from Fleming County Schools.',kind:'Learner experience',indicators:D.indicatorRows(extra,'learning').map(r=>({...r,summary:r.description,terms:[1,2,3].map(t=>extra.find(d=>d.type==='kpi'&&d.id===r.id&&D.reportingTerm(d,extra)===t))}))});}
  return sections;
 }
 function result(row,available=true){if(!available)return 'Results unavailable';const n=/^(awaiting|pending)/i.test(row?.status||'')?null:A.percentage(row?.percent);return n===null?'Awaiting Evidence':`${n}%`;}
 function latestResult(indicator,available=true){
  if(available)for(let i=2;i>=0;i--){const row=indicator.terms[i],label=result(row,true);if(label.endsWith('%'))return {term:i+1,percent:A.percentage(row.percent),label};}
  return {term:null,percent:null,label:available?'Awaiting Evidence':'Results unavailable'};
 }
 function bar(indicator,available){const latest=latestResult(indicator,available);return `<div class="report-progress" aria-label="${escape(latest.term?'Latest reported: Term '+latest.term+', '+latest.label:latest.label)}"><div class="report-track"><span style="width:${latest.percent??0}%"></span></div><div class="report-scale"><span>0%</span><span>50%</span><span>100% expectation</span></div></div>`;}
 function markup(sections,{date=new Date(),resultsAvailable=true,warnings=[]}={}){
  const byId=id=>sections.find(s=>s.id===id),count=sections.reduce((n,s)=>n+s.indicators.length,0),day=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'America/New_York'}).format(date);
  const section=s=>!s?'':`<section class="report-section" data-report-experience="${escape(s.id)}"><h2><a href="/learning.html?experience=${escape(s.id)}">${escape(s.title)}</a></h2><p class="report-question">${escape(s.question)}</p>${s.id==='purpose'?'<p class="report-commitment">Two 100% commitments: explain the learning and its purpose; analyze examples with scales.</p>':s.id==='feedback'?'<p class="report-commitment">One 100% commitment: check work in progress with scales.</p>':''}${s.indicators.map(r=>`<article class="report-indicator" data-report-indicator="${escape(r.id)}"><h3><a href="/learning.html?experience=${escape(s.id)}">${escape(r.title)}</a></h3><p class="report-summary">${escape(r.summary)}</p>${bar(r,resultsAvailable)}<div class="report-terms" aria-label="${escape(r.title)} reporting-term results">${r.terms.map((row,i)=>`<div class="report-term"><span>Term ${i+1}</span><strong>${escape(result(row,resultsAvailable))}</strong></div>`).join('')}</div></article>`).join('')}</section>`;
  const header=`<header class="report-masthead"><div class="report-brand"><svg class="report-logo" viewBox="1770 510 2355 2355" role="img" aria-label="Fleming County Schools logo"><image href="/assets/fcs-district-report-logo.png" width="6000" height="3375"/></svg><div><div class="report-wordmark">VIBRANCY</div><div class="report-district">FLEMING COUNTY SCHOOLS</div></div></div><div class="report-meta">Published dashboard snapshot<br>${escape(day)}<br>7 experiences · ${count} indicators</div></header>`;
  const footer=page=>`<footer class="report-footer"><div class="footer-meta"><a href="https://vibrancyxl.vercel.app/learning.html">Full dashboards, term notes, and evidence: vibrancyxl.vercel.app/learning.html</a><span>${page} of 2</span></div><div><strong>Vibrancy</strong> · Fleming County Schools · A Member of the Learner Success Network</div><div>One Vision. One System. Every Learner Thriving!</div></footer>`;
  const warning=warnings.length?`<p class="report-warning">${escape(warnings.join(' '))}</p>`:'';
  return `<section class="report-sheet" aria-label="Vibrant Learning Report page 1">${header}<h1 class="report-title">Vibrant Learning Report</h1><p class="report-deck">What students experience, what they can demonstrate, and where evidence is still being gathered.</p><div class="report-key"><p><strong>Reading the results:</strong> Each bar shows the latest reported term; all three term values appear below. Results are dashboard findings, not student grades. <strong>Awaiting Evidence</strong> means no result has been reported. <strong>0%</strong> is a reported result.</p>${warning}</div><div class="report-columns"><div>${section(byId('purpose'))}${section(byId('thinking'))}</div><div>${section(byId('voice'))}${section(byId('work'))}</div></div>${footer(1)}</section><section class="report-sheet" aria-label="Vibrant Learning Report page 2">${header}<h2 class="report-continuation">Feedback, support, and thriving learners</h2><div class="report-columns"><div>${section(byId('feedback'))}${section(byId('support'))}${section(byId('learning'))}<section class="report-dimensions"><h2>Three different kinds of findings</h2><p>Priority Standards identify essential learning. Proficiency Scales describe what successful learning looks like. BRIDGE connects learning to authentic problems and demonstrations.</p><p><strong>Implementation maturity:</strong> how consistently adults put practices in place. See the detailed dashboards for these findings.</p><p><strong>Learner experience:</strong> what students experience in the first six areas.</p><p><strong>Learner outcomes:</strong> evidence of growth, mastery, readiness, agency, and well-being under Thriving Learner.</p></section></div><div>${section(byId('thriving'))}<p class="report-live-note">One student work sample can support several findings when each review identifies the distinct evidence and criteria used. Participation, quality of work, and growth are different claims.</p><p class="report-live-note">Explore the full dashboards for FCS Belief Statements, reporting-term notes, and Evidence of Practice links. This report summarizes the published indicators; it does not replace the evidence review.</p></div></div>${footer(2)}</section>`;
 }
 async function load(){
  const status=document.querySelector('#report-status'),button=document.querySelector('#report-print'),surface=document.querySelector('#learning-report');button.disabled=true;surface.setAttribute('aria-busy','true');status.textContent='Loading published learning information…';
  try{
   const read=async url=>{const r=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error(url);return r.json();};
   const [snapshot,wording,terms,area]=await Promise.allSettled([read('/data/learning-purpose.json'),read('/api/learning-wording'),read('/api/term-results'),read('/api/indicators')]);
   if(snapshot.status!=='fulfilled')throw Error('The report definitions could not be loaded. Please refresh the report.');
   const warnings=[];if(wording.status!=='fulfilled')warnings.push('Live wording unavailable; saved definitions are shown.');if(terms.status!=='fulfilled')warnings.push('Published results could not be loaded.');if(area.status!=='fulfilled')warnings.push('Additional indicators could not be checked.');
   const sections=assemble(snapshot.value,wording.status==='fulfilled'?wording.value.indicators:[],terms.status==='fulfilled'?terms.value.results:[],area.status==='fulfilled'?area.value.indicators:[]);
   surface.innerHTML=markup(sections,{resultsAvailable:terms.status==='fulfilled',warnings});status.textContent=warnings.length?warnings.join(' ')+' Refresh to try again.':'Report ready. Review the two pages below, then choose Download PDF.';button.disabled=false;
  }catch(e){status.textContent=e.message;surface.replaceChildren();}finally{surface.setAttribute('aria-busy','false');}
 }
 const api={assemble,markup,result,latestResult};root.VibrancyLearningReport=api;if(typeof module==='object'&&module.exports)module.exports=api;
 if(root.document){document.querySelector('#report-print').addEventListener('click',()=>{location.href='/vibrant-learning-report.pdf';});document.querySelector('#report-reload').addEventListener('click',load);load();}
})(typeof window==='object'?window:globalThis);
