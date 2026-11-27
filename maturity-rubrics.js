'use strict';
(function(root){
 const stages=['Not Started','Establishing','Developing','Implementing','Sustaining and Advancing'];
 const definitions={
  "curriculum": [
    "receive shared essential grade-level instruction, assessment, and time to practice",
    "schools, grades, courses, and essential learning sequences",
    "align curriculum maps and plan learning time",
    "Students receive the shared essential learning and show work from instruction, practice, and assessment with enough time for each",
    "adjust pacing after reviewing unfinished essential learning, then check whether students have the time needed"
  ],
  "standards": [
    "explain both what a Priority Standard asks them to learn and why it matters",
    "classrooms and the start of instruction on each Priority Standard",
    "identify Priority Standards and model student-friendly WHAT and WHY explanations",
    "Students explain both the expected learning and a meaningful use or connection in their own words at the start of instruction",
    "refine WHAT and WHY prompts, then check whether students explain both more independently"
  ],
  "scales": [
    "use aligned Proficiency Scales to study examples before their first demonstration of proficiency",
    "classrooms and Priority Standards with an aligned scale",
    "select examples and model comparing their features with the aligned scale",
    "Students analyze examples before their first demonstration of proficiency and point to specific features that match the scale",
    "refine examples or prompts using student explanations, then check whether students explain the connection to the scale more independently"
  ],
  "expectations": [
    "do grade-level thinking with clear expectations and support as needed",
    "grades, courses, classrooms, and grade-level tasks",
    "align tasks to grade-level expectations and plan supports",
    "Student work shows the knowledge and thinking the grade-level standard requires, and students explain their own reasoning rather than having it supplied for them",
    "revise a task or support, then check whether students do more of the required thinking themselves"
  ],
  "thinking-1": [
    "weigh possible responses to a real problem and justify a decision with evidence",
    "courses, classrooms, and real-world problem-solving tasks",
    "design a real-world problem and model weighing options",
    "Students compare possible responses, justify a solution or recommendation, and explain how evidence shaped their decision",
    "revise a problem or reasoning prompt, then check whether students justify decisions with more relevant evidence"
  ],
  "thinking-2": [
    "bring knowledge from multiple subjects together to address a real problem",
    "courses and real-world tasks that call for more than one subject",
    "plan a problem that needs contributions from multiple subjects",
    "Students use knowledge from the relevant subjects together and explain what each subject helped them understand or do",
    "adjust subject connections in a task, then check whether students explain how the subjects work together"
  ],
  "thinking-3": [
    "address a real challenge shaped by a family, community, or workforce partner",
    "partner-designed challenges, courses, and participating classrooms",
    "invite partners to help frame questions, information, or solution requirements",
    "Design records show a partner contribution that shaped the challenge, and students identify how that contribution affects their work",
    "revise how partners contribute to task design, then check whether students use that contribution in their responses"
  ],
  "voice-1": [
    "identify a learning decision shaped by their input and explain what changed",
    "classrooms and decisions about questions, projects, or class routines",
    "plan a way to gather student input and model how it can shape a decision",
    "Decision records and student explanations connect student input to an actual change in the learning experience",
    "change how student input is gathered or used, then check whether students can trace their input to decisions"
  ],
  "voice-2": [
    "make a meaningful choice about their work and explain its effect",
    "classrooms, courses, and tasks with a choice of investigation, approach, or demonstration",
    "design meaningful choices tied to shared learning expectations",
    "Students explain why they chose an investigation, approach, or demonstration and show how it shaped work that meets shared expectations",
    "refine choice options or decision supports, then check whether students explain and use choices more thoughtfully"
  ],
  "voice-3": [
    "connect a specific piece of work to an interest, strength, experience, or aspiration",
    "classrooms, courses, and learning tasks with personal connections",
    "plan invitations for students to connect work to their lives and aspirations",
    "Students point to a specific piece of work and explain its connection to who they are, what matters to them, or what they want to explore",
    "adjust invitations for personal connections, then check whether students describe more specific connections in their work"
  ],
  "work-1": [
    "write to develop or communicate subject understanding weekly in every course",
    "courses and instructional weeks",
    "plan weekly subject-specific writing and model a purposeful response",
    "Dated writing shows subject-purposeful writing every instructional week in every course reviewed, and students explain the understanding their writing communicates",
    "adjust writing prompts using student work, then check whether the writing makes subject thinking clearer"
  ],
  "work-2": [
    "produce multiple pieces of evidence of grade-level learning and real-world application",
    "courses, BRIDGE assessment cycles, Priority Standards, and BRIDGE Performance Indicators",
    "design BRIDGE tasks and identify aligned criteria for judging work",
    "Multiple products, presentations, or performances demonstrate application, and reviewers use the relevant Priority Standards and BRIDGE Performance Indicators to explain what each piece shows",
    "revise a BRIDGE task or evidence set, then check whether it reveals students’ application of learning more clearly"
  ],
  "work-3": [
    "select BPI portfolio evidence and explain it in Presentations of Learning",
    "grades 3–12, portfolios, and scheduled Presentation of Learning cycles",
    "plan portfolio selection and model an evidence-based presentation",
    "During each scheduled cycle reviewed, students explain selected portfolio examples showing what they can do, their progress, and preparation for next steps",
    "refine portfolio selection or presentation prompts, then check whether students explain progress with more specific evidence"
  ],
  "scales-self-check": [
    "apply an aligned scale to their own unfinished work and identify a next step",
    "classrooms and instruction on each Priority Standard with an aligned scale",
    "model a scale-based check of unfinished work",
    "At least once during instruction on each applicable Priority Standard, students locate where their own unfinished work meets the scale and identify a next step while time remains to act",
    "refine self-check prompts, then check whether students identify more precise next steps in unfinished work"
  ],
  "feedback-3": [
    "receive specific, aligned feedback while time remains to use it",
    "classrooms, Priority Standards, and feedback opportunities before work is finished",
    "plan feedback timing and model comments tied to work and learning criteria",
    "Feedback points to something in student work and the Priority Standard or scale, arrives while time remains to use it, and students explain what to keep or improve",
    "adjust feedback wording or timing, then check whether students explain a useful next step before the work is finished"
  ],
  "feedback-4": [
    "revise in response to feedback and explain how the change improves learning or performance",
    "classrooms, tasks, and feedback-and-revision opportunities",
    "model a revision and plan time for students to act on feedback",
    "Before-and-after work and student explanations identify a feedback-based change and how it strengthens reasoning, corrects a misunderstanding, or improves performance",
    "refine revision supports using before-and-after work, then check whether students explain how their changes better meet the expectation"
  ],
  "support-1": [
    "use timely support to move forward on challenging grade-level work",
    "classrooms, grade-level tasks, and occasions when students get stuck",
    "plan guiding questions, conferences, or tools for challenging work",
    "Students receive support when needed, explain what it helped them understand, and show how they moved forward while doing the challenging thinking themselves",
    "adjust a support using student explanations, then check whether students move forward with greater independence"
  ],
  "support-2": [
    "contribute reasoning and build on a peer’s thinking",
    "classrooms and collaborative learning tasks",
    "plan collaborative tasks and model responding to a peer’s reasoning",
    "Students contribute ideas and identify a peer question, explanation, or idea that helped them reconsider or strengthen their own understanding",
    "revise discussion structures, then check whether students use peers’ reasoning to improve their own explanations"
  ],
  "support-3": [
    "look across earlier work or feedback and plan a specific next step",
    "classrooms and reflection opportunities across tasks or units",
    "model finding patterns in work and setting a goal with a strategy",
    "Students identify a pattern across earlier work or feedback, set a specific goal for a future task or unit, and name a strategy or support",
    "refine reflection prompts, then check whether students carry a useful strategy into the next task"
  ],
  "thriving-1": [
    "compare earlier and later evidence tied to the same learning expectation",
    "students, learning expectations, and paired assessment or work-sample cycles",
    "select comparable earlier and later work and model explaining a change",
    "Paired work or assessments directly show how learning changed, and students explain what helped and what needs attention next",
    "improve how comparable evidence is selected, then check whether students and families can identify changes more precisely"
  ],
  "thriving-2": [
    "demonstrate Priority Standard expectations in aligned work or assessments",
    "students, Priority Standards, and assessment opportunities",
    "align assessments and model judging work against the standard",
    "Aligned work or assessments directly demonstrate the expected knowledge, skills, and thinking; reviewers distinguish mastery from participation and use 3.0 as the expectation where a scale applies",
    "refine an assessment or scoring process, then check whether judgments of demonstrated learning are clearer and consistent"
  ],
  "thriving-3": [
    "apply learning to a task that reflects the demands of their next step",
    "students, transition tasks, and next grades, courses, pathways, or opportunities",
    "identify next-step demands and plan a task that reflects them",
    "Work directly demonstrates application to next-step demands, and students explain how specific evidence shows preparation for that grade, course, pathway, or opportunity",
    "refine a transition task against next-step demands, then check whether work demonstrates the relevant preparation"
  ],
  "thriving-agency": [
    "set or adjust goals, decide how to proceed, and explain the effect using evidence",
    "students and different learning experiences over time",
    "model goal setting, decisions, and evidence-based reflection",
    "Across different experiences, dated student decisions and work show increasing responsibility, and students use evidence to explain how their choices affected learning",
    "adjust decision supports, then check whether students direct and adapt their learning with greater independence"
  ],
  "thriving-4": [
    "describe belonging, self-understanding, and how they access help",
    "students, schools, grades, and opportunities to hear student perspectives",
    "plan student conversations and introduce relationships, routines, and resources for support",
    "Student accounts directly describe belonging, self-understanding, and access to help, including specific relationships, routines, or resources supporting health and school participation",
    "change a support in response to student accounts, then check whether students describe improved connection or access to help"
  ]
};
 const aliases={'feedback-1':'scales','feedback-2':'scales-self-check'};
 const rubrics=Object.fromEntries(Object.entries(definitions).map(([id,[practice,settings,preparation,consistent,improvement]])=>{
 const cycle=id==='work-1'?'Recurring use means dated writing in repeated instructional weeks; consistency means every instructional week in every course reviewed.':id==='work-3'?'Recurring use means portfolio selection and presentations in repeated scheduled cycles; consistency means every scheduled cycle and applicable grade 3–12 setting reviewed. Record the district schedule; do not substitute a weekly expectation.':id==='scales'?'Recurring use means analysis on repeated Priority Standards before the first demonstration; consistency means this timing and student explanation on every applicable standard and classroom reviewed.':id==='scales-self-check'?'Recurring use means self-checks on repeated Priority Standards; consistency means at least one check during instruction on every applicable standard in every classroom reviewed.':'Recurring use means the practice is documented on more than one applicable opportunity in the indicator’s actual learning or assessment cycle. Consistency means the practice and learner experience are verified across all applicable settings and opportunities in the approved review sample.';
 return [id,{settings,cycle,advancement:[
 `To reach Establishing: ${preparation}, then begin an **initial student trial**.`,
 `To reach Developing: verify that students **repeatedly ${practice}**, using their explanations or work as evidence.`,
 `To reach Implementing: verify this experience **consistently across the applicable settings and opportunities reviewed**: ${consistent.charAt(0).toLowerCase()+consistent.slice(1)}.`,
 `To reach Sustaining and Advancing: verify the Implementing practice **across reporting periods**; ${improvement}, with the improvement and follow-up finding recorded.`,
 `To continue advancing: keep checking this practice **across reporting periods** and use the findings to ${improvement}.`
 ],sampling:'District review needed: approve sample size, selection, coverage, cycle dates, and any decision thresholds before assigning a stage. Record exceptions and exclusions; a sample does not establish district-wide implementation.',stages:[
 `A completed review confirms that students have **yet to begin to ${practice}** in the ${settings} reviewed.`,
 `Teams **${preparation}**, or students try the practice in an **initial trial**. Reviewers have yet to verify recurring student use.`,
 `Students **repeatedly ${practice}**, with student explanations or work documenting their experience. **Use or quality varies** across the ${settings} reviewed.`,
 `Across the applicable ${settings} and opportunities reviewed during the reporting period, **consistent use is verified**. ${consistent}.`,
 `The Implementing criteria hold **across reporting periods**. Teams **${improvement}**, documenting the change and follow-up finding.`]}];
 }));
 // Only district-reviewed records belong here, keyed by existing indicator ID and reporting period.
 rubrics.scales.stages=[
 'A review confirms that students have **yet to begin using aligned Proficiency Scales to study examples** in the classrooms and Priority Standards reviewed.',
 'Teachers **select examples and model how to compare them with the aligned scale**, or students try the practice during an initial lesson. Reviewers have yet to verify recurring student use.',
 'Students **repeatedly use the scale to explain features of sample work** in some classrooms or for some Priority Standards reviewed. The **timing or quality of that analysis varies** across the settings reviewed.',
 'Across the classrooms and Priority Standards reviewed, students **routinely analyze examples before their first demonstration of proficiency**. They **point to specific features of the work and explain how those features relate to the scale**.',
 'Students demonstrate the Implementing practice **across reporting periods**. Teacher teams use students’ explanations to refine examples or prompts, then **check whether students explain the connection to the scale more independently**.'
 ];
 const reviews={};
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const rich=value=>esc(value).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
 function assess(row,data=[]){
  const id=aliases[row.id]||row.id,rubric=rubrics[id];
  const candidates=[...Object.values(reviews[id]||{}),...data.filter(r=>r.type==='kpi'&&(aliases[r.id]||r.id)===id).map(r=>r.maturity_review).filter(Boolean)].filter(r=>row.reporting_window==='current'||!row.reporting_window||r.period===row.reporting_window).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  const review=row.maturity_review||candidates[0];
  let stage=-1,issue='';
  const complete=rubric&&review?.approved===true&&review.reviewer&&review.period&&/^\d{4}-\d{2}-\d{2}$/.test(review.date||'')&&review.scope&&review.finding&&Array.isArray(review.evidence)&&review.evidence.length&&review.evidence.every(e=>e.label&&e.reference)&&review.samplingApproved===true&&review.sampling;
  if(complete){
   // Each assertion attests that the complete indicator-specific stage criteria were reviewed.
   for(let i=4;i>=0;i--)if(review.criteria?.[stages[i]]===true){stage=i;break;}
   if(stage===4&&(!review.priorPeriods?.length||!review.improvement||!review.followUp)){stage=review.criteria?.Implementing===true?3:-1;issue='The cross-period evidence, specific improvement, and follow-up check need review.';}
   const zeros=data.filter(r=>r.type==='kpi'&&(aliases[r.id]||r.id)===id&&r.reporting_window===review.period&&String(r.percent).trim()!==''&&Number(r.percent)===0);
   if(stage>=3&&zeros.some(r=>!review.distinctProgressMeasures?.[r.reporting_window]?.reason)){stage=-1;issue='A reported 0% may conflict with this rating. District review must reconcile the student action, period, and scope before publishing a stage.';}
  }
  return {id,rubric,review:complete?review:null,stage,label:stages[stage]||'Not Yet Rated',issue};
 }
 // The chart glyph matches Vibrant Accountability on the homepage.
 const accountabilityMedallion='<span class="accountability-medallion" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3v18h17M8 16v-4m5 4V8m5 8V4"/></svg></span>';
 function badge(row,data){const r=assess(row,data);return `<button type="button" class="maturity-stage maturity-${r.stage<0?'unrated':r.stage}" data-maturity-open aria-haspopup="dialog">${esc(r.label)}</button>`;}
 function details(row,data){
  const r=assess(row,data),id='maturity-profile-'+[row.experience_id,row.id,row.reporting_window].map(value=>encodeURIComponent(value||'current')).join('-');
  const entry=(label,description,current,advancement='')=>`<li class="maturity-profile-stage${current?' is-current':''}"${current?' aria-current="step"':''}>${current?'<p class="maturity-current-label">Current Maturity Profile Rating</p>':''}<h3><span${current?` class="maturity-stage-label maturity-${r.stage<0?'unrated':r.stage}"`:''}>${esc(label)}</span></h3><p>${rich(description)}</p>${advancement?`<p class="maturity-advance">${rich(advancement)}</p>`:''}</li>`;
  return `<section class="accountability-maturity" aria-label="Accountability Maturity"><div class="maturity-footer-heading">${accountabilityMedallion}<h4>Accountability Maturity</h4></div><div class="maturity-actions">${badge(row,data)}<button type="button" class="maturity-details-button" data-maturity-open aria-haspopup="dialog">View Maturity Details</button></div><dialog class="maturity-profile" aria-labelledby="${id}"><header class="maturity-profile-header"><div><p>Accountability Maturity</p><h2 id="${id}">${esc(row.title||'Indicator')} · Maturity Profile</h2></div><button type="button" class="maturity-profile-close" data-maturity-close aria-label="Close maturity profile" autofocus>×</button></header><ol class="maturity-profile-stages">${r.stage<0?entry('Not Yet Rated','Evidence is **insufficient to assign a stage**, or a review has yet to be completed.',true):''}${r.rubric?(r.stage<0?stages.map((_,i)=>i):[r.stage,...stages.map((_,i)=>i).filter(i=>i!==r.stage)]).map(i=>entry(stages[i],r.rubric.stages[i],r.stage===i,r.rubric.advancement[i])).join(''):'<li>Indicator-specific descriptions are awaiting district review.</li>'}</ol></dialog></section>`;
 }
 // Keep keyboard activation inside editor cards from selecting the outer card.
 if(root.document)root.document.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)&&event.composedPath().some(el=>el?.matches?.('[data-maturity-open],[data-maturity-close]')))event.stopPropagation();},true);
 // Capture composed events so the same controls work inside area shadow roots and editor previews.
 if(root.document)root.document.addEventListener('click',event=>{
  const path=event.composedPath();
  const control=path.find(el=>el?.matches?.('[data-maturity-open],[data-maturity-close]'));
  if(control){
   event.preventDefault();event.stopPropagation();
   const dialog=control.closest('.accountability-maturity')?.querySelector('.maturity-profile');
   if(!dialog)return;
   if(control.hasAttribute('data-maturity-close'))dialog.close();
   else if(!dialog.open)dialog.showModal();
   return;
  }
  const dialog=path[0];
  if(dialog?.matches?.('dialog.maturity-profile')&&dialog.open){
   const bounds=dialog.getBoundingClientRect();
   if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();
  }
 },true);
 const api={stages,rubrics,reviews,assess,badge,details};root.VibrancyMaturity=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
