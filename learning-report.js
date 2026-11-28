'use strict';
(function(root){
 const D=root.VibrancyDashboard,A=root.VibrancyAreaIndicators,M=root.VibrancyMaturity;
 const short={
  "curriculum": "Shared grade/course expectations cover all required standards, with time for teaching, practice, review and support.",
  "standards": "At the introduction of each Priority Standard, students explain WHAT they are learning, WHY it matters and its use.",
  "scales": "Before first demonstrating proficiency, students compare examples with the aligned scale and explain specific features of quality.",
  "expectations": "Students do the standard's grade-level thinking themselves, with accessible materials, scaffolds and required accommodations.",
  "thinking-1": "Students apply grade-level knowledge to authentic problems, compare responses and justify decisions with evidence.",
  "thinking-2": "Students integrate two or more disciplines in one task and explain each subject's contribution; relevant standards are assessed.",
  "thinking-3": "Family, community and workforce contributions shape learning design; records identify the input and what changed.",
  "voice-1": "Students identify a learning decision influenced by their input and explain what changed.",
  "voice-2": "Students make consequential choices about learning and explain how their choices meet shared expectations.",
  "voice-3": "Students connect work to personal interests, strengths, experiences or aspirations and identify a further opportunity to explore.",
  "voice-4": "Students ask questions, investigate and test ideas, explain discoveries and identify what to explore next.",
  "work-1": "Students write weekly in every course; teachers give feedback on subject thinking and relevant writing criteria.",
  "work-2": "Students apply standards in authentic demonstrations; teachers assess each student with criteria shared in advance.",
  "work-3": "In grades 3-12, students justify growth, mastery, readiness and BPI claims with portfolio evidence and answer audience questions.",
  "work-4": "Sustained inquiry includes standards, decisions, critique, revision, an appropriate audience and checks of individual learning.",
  "work-5": "Teachers plan, teach and assess BPIs; students use their criteria to evaluate and improve work.",
  "work-6": "Grade 3-12 BPI websites contain dated, indicator-linked evidence and reflection that students can navigate and explain.",
  "work-7": "Each student explains their contribution and demonstrates targeted learning; group completion does not establish individual mastery.",
  "scales-self-check": "At least once during instruction on each Priority Standard, students use its scale to check and improve unfinished work.",
  "feedback-3": "Feedback identifies evidence against the standard or scale and a usable next step while learning is underway.",
  "feedback-4": "Students act on feedback and explain the improvement; teachers reassess the targeted learning.",
  "feedback-5": "Teacher teams independently score common work, resolve differences with criteria and check agreement again.",
  "support-1": "Current evidence triggers targeted teaching or extension while maintaining access to challenging grade-level learning.",
  "support-2": "Students contribute reasoning, respond to peers and explain how collaboration improved their understanding; participation is equitable.",
  "support-3": "Students identify patterns, set a specific goal and strategy, then check progress in the next task or unit.",
  "support-4": "Targeted tutoring has a provider, schedule, regular attendance, parent communication, access support and progress monitoring.",
  "support-5": "Workshops combine focused teaching, protected application, responsive conferences or small groups, and reflection.",
  "support-6": "Follow-up work shows whether the targeted learning improved and informs continuation, change, intensification or conclusion of support.",
  "thriving-1": "Growth is evaluated in every grade and content area using comparable earlier/later evidence and individual learning goals.",
  "thriving-2": "Mastery is expected and evaluated in all grades and content areas; aligned individual evidence demonstrates expected learning.",
  "thriving-3": "Readiness is expected and evaluated across all grades and content areas against identified next-step demands.",
  "thriving-agency": "Agency is expected and evaluated across all grades and content areas through goals, decisions, monitoring and adjustment.",
  "thriving-4": "Students experience safety, belonging and support, know a trusted adult and how to obtain help; leaders follow up."
};
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function assemble(snapshot,wording,terms,area=[]){
  const saved=snapshot.rows.map(row=>Object.fromEntries(snapshot.headers.map((h,i)=>[h,String(row[i]??'')])));let data=D.applyPublishedWording(D.mergeDefinitions(saved,saved),wording);
  for(const r of wording)if(r.type==='kpi'&&!data.some(d=>d.type==='kpi'&&d.id===r.id))data.push({...r,sort_order:'999',percent:'',status:'Awaiting Evidence'});
  data=D.applyTermResults(data,terms);
  const sections=root.VibrancyExperiences.map(exp=>({...exp,kind:exp.id==='thriving'?'Learner outcomes':'Learner experience',indicators:D.indicatorRows(data,exp.id).map(r=>{
   const original=saved.find(d=>d.type==='kpi'&&d.id===r.id),description=short[r.id]&&(!original||original.description===r.description)?short[r.id]:r.description;
   return {...r,accountabilityMaturity:rating(r,data),summary:description.replace(/\*\*([^*]+)\*\*/g,'$1'),terms:[1,2,3].map(term=>data.find(d=>d.type==='kpi'&&d.id===r.id&&(d.experience_id||'purpose')===D.reportingHome(r.id,r.experience_id||'purpose')&&D.reportingTerm(d,data)===term))};
  })}));
  const items=area.filter(r=>r.area_id==='learning'&&A.populated(r));
  if(items.length){const extra=A.dashboardData(items,'learning','',terms);sections.push({id:'learning',title:'More Vibrant Learning indicators',question:'Additional published indicators from Fleming County Schools.',kind:'Learner experience',indicators:D.indicatorRows(extra,'learning').map(r=>({...r,accountabilityMaturity:rating(r,extra),summary:r.description,terms:[1,2,3].map(t=>extra.find(d=>d.type==='kpi'&&d.id===r.id&&D.reportingTerm(d,extra)===t))}))});}
  return sections;
 }
 function rating(row,data){const review=M.assess(row,data);return {stage:review.stage,label:review.label,period:review.review?.period||null};}
 function maturity(indicator){return indicator.accountabilityMaturity||{stage:-1,label:'Not Yet Rated',period:null};}
 function maturityLabel(indicator){const value=maturity(indicator);return value.stage<0?value.label:`${value.stage+1} - ${value.label}`;}
 const pagePlan=[{title:'Vibrant Learning Report',columns:[['purpose'],['thinking','voice']]},{title:'Demonstrating learning and using feedback',columns:[['work'],['feedback','learning']]},{title:'Support and thriving learners',columns:[['support'],['thriving']]}];
 function pages(sections){return pagePlan.map(page=>({...page,columns:page.columns.map(ids=>ids.map(id=>sections.find(s=>s.id===id)).filter(Boolean))}));}
 function result(row,available=true){if(!available)return 'Results unavailable';const n=/^(awaiting|pending)/i.test(row?.status||'')?null:A.percentage(row?.percent);return n===null?'Awaiting Evidence':`${n}%`;}
 function latestResult(indicator,available=true){
  if(available)for(let i=2;i>=0;i--){const row=indicator.terms[i],label=result(row,true);if(label.endsWith('%'))return {term:i+1,percent:A.percentage(row.percent),label};}
  return {term:null,percent:null,label:available?'Awaiting Evidence':'Results unavailable'};
 }
 function bar(indicator,available){const latest=latestResult(indicator,available);return `<div class="report-progress" aria-label="${escape(latest.term?'Latest reported: Term '+latest.term+', '+latest.label:latest.label)}"><div class="report-track"><span style="width:${latest.percent??0}%"></span></div><div class="report-scale"><span>0%</span><span>50%</span><span>100% expectation</span></div></div>`;}
 function markup(sections,{date=new Date(),resultsAvailable=true,warnings=[]}={}){
  const byId=id=>sections.find(s=>s.id===id),count=sections.reduce((n,s)=>n+s.indicators.length,0),day=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'America/New_York'}).format(date);
  const section=s=>!s?'':`<section class="report-section" data-report-experience="${escape(s.id)}"><h2><a href="/learning.html?experience=${escape(s.id)}">${escape(s.title)}</a></h2><p class="report-question">${escape(s.question)}</p>${s.id==='purpose'?'<p class="report-commitment">Two 100% commitments: explain the learning and its purpose; analyze examples with scales.</p>':s.id==='feedback'?'<p class="report-commitment">One 100% commitment: check work in progress with scales.</p>':''}${s.indicators.map(r=>`<article class="report-indicator" data-report-indicator="${escape(r.id)}"><h3><a href="/learning.html?experience=${escape(s.id)}">${escape(r.title)}</a></h3><p class="report-summary">${escape(r.summary)}</p>${bar(r,resultsAvailable)}<div class="report-terms" aria-label="${escape(r.title)} reporting-term results">${r.terms.map((row,i)=>`<div class="report-term"><span>Term ${i+1}</span><strong>${escape(result(row,resultsAvailable))}</strong></div>`).join('')}</div><div class="report-maturity"><span>Accountability Maturity:</span><strong class="report-maturity-stage report-maturity-${maturity(r).stage<0?'unrated':maturity(r).stage}">${escape(maturityLabel(r))}</strong></div></article>`).join('')}</section>`;
  const header=`<header class="report-masthead"><div class="report-brand"><svg class="report-logo" viewBox="1770 510 2355 2355" role="img" aria-label="Fleming County Schools logo"><image href="/assets/fcs-district-report-logo.png" width="6000" height="3375"/></svg><div><div class="report-wordmark">VIBRANCY</div><div class="report-district">FLEMING COUNTY SCHOOLS</div></div></div><div class="report-meta">Published dashboard snapshot<br>${escape(day)}<br>7 experiences · ${count} indicators</div></header>`;
  const footer=(page,total)=>`<footer class="report-footer"><div class="footer-meta"><a href="https://vibrancyxl.vercel.app/learning.html">Full dashboards, term notes, and evidence: vibrancyxl.vercel.app/learning.html</a><span>${page} of ${total}</span></div><div><strong>Vibrancy</strong> · Fleming County Schools · A Member of the Learner Success Network</div><div>One Vision. One System. Every Learner Thriving!</div></footer>`;
  const warning=warnings.length?`<p class="report-warning">${escape(warnings.join(' '))}</p>`:'';
  const reportPages=pages(sections);
  const maturityKey=`<section class="report-dimensions report-maturity-key"><h2>Understanding Accountability Maturity</h2><p>Maturity describes consistent practice and the intended learner experience within the settings reviewed. It is separate from term percentages.</p><ol><li>Not Started</li><li>Establishing</li><li>Developing</li><li><strong>Implementing - expectation</strong></li><li>Sustaining and Advancing</li></ol><p><strong>Not Yet Rated</strong> is outside these five stages: evidence is insufficient or a completed review has not been published. It does not mean Not Started.</p></section>`;
  const dimensions=`<section class="report-dimensions"><h2>Three different kinds of findings</h2><p>Priority Standards identify essential learning. Proficiency Scales describe successful learning. BRIDGE connects learning to authentic problems and demonstrations.</p><p><strong>Accountability Maturity</strong> describes implementation and the intended learner experience verified in the settings reviewed.</p><p><strong>Learner experience:</strong> what students experience in the first six areas.</p><p><strong>Learner outcomes:</strong> evidence of growth, mastery, readiness, agency, and well-being under Thriving Learner.</p></section>`;
  const evidenceNote='<p class="report-live-note">One student work sample can support several findings when each review identifies the distinct evidence and criteria used. Participation, quality of work, and growth are different claims.</p><p class="report-live-note">Explore the full dashboards for FCS Belief Statements, reporting-term notes, and Evidence of Practice links. This report summarizes the published indicators; it does not replace the evidence review.</p>';
  return reportPages.map((page,index)=>`<section class="report-sheet" aria-label="Vibrant Learning Report page ${index+1}">${header}${index===0?`<h1 class="report-title">${escape(page.title)}</h1><p class="report-deck">What students experience, what they can demonstrate, and where evidence is still being gathered.</p><div class="report-key"><p><strong>Reading the results:</strong> Each bar shows the latest reported term; all three term values appear below. Results are dashboard findings, not student grades. <strong>Awaiting Evidence</strong> means no result has been reported. <strong>0%</strong> is a reported result.</p>${warning}</div>`:`<h2 class="report-continuation">${escape(page.title)}</h2>`}<div class="report-columns"><div>${page.columns[0].map(section).join('')}${index===0?dimensions:''}</div><div>${page.columns[1].map(section).join('')}${index===1?maturityKey:index===2?evidenceNote:''}</div></div>${footer(index+1,reportPages.length)}</section>`).join('');
 }
 async function load(){
  const status=document.querySelector('#report-status'),button=document.querySelector('#report-print'),surface=document.querySelector('#learning-report');button.disabled=true;surface.setAttribute('aria-busy','true');status.textContent='Loading published learning information…';
  try{
   const read=async url=>{const r=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error(url);return r.json();};
   const [snapshot,wording,terms,area]=await Promise.allSettled([read('/data/learning-purpose.json'),read('/api/learning-wording'),read('/api/term-results'),read('/api/indicators')]);
   if(snapshot.status!=='fulfilled')throw Error('The report definitions could not be loaded. Please refresh the report.');
   const warnings=[];if(wording.status!=='fulfilled')warnings.push('Live wording unavailable; saved definitions are shown.');if(terms.status!=='fulfilled')warnings.push('Published results could not be loaded.');if(area.status!=='fulfilled')warnings.push('Additional indicators could not be checked.');
   const sections=assemble(snapshot.value,wording.status==='fulfilled'?wording.value.indicators:[],terms.status==='fulfilled'?terms.value.results:[],area.status==='fulfilled'?area.value.indicators:[]);
   surface.innerHTML=markup(sections,{resultsAvailable:terms.status==='fulfilled',warnings});status.textContent=warnings.length?warnings.join(' ')+' Refresh to try again.':'Report ready. Review the three pages below, then choose Download PDF.';button.disabled=false;
  }catch(e){status.textContent=e.message;surface.replaceChildren();}finally{surface.setAttribute('aria-busy','false');}
 }
 const api={assemble,markup,result,latestResult,maturity,maturityLabel,pages};root.VibrancyLearningReport=api;if(typeof module==='object'&&module.exports)module.exports=api;
 if(root.document){document.querySelector('#report-print').addEventListener('click',()=>{location.href='/vibrant-learning-report.pdf';});document.querySelector('#report-reload').addEventListener('click',load);load();}
})(typeof window==='object'?window:globalThis);
