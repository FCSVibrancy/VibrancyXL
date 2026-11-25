'use strict';
// Prototype records only. Replace these examples with reviewed, permissioned evidence.
const experiences = [
 {id:'purpose',title:'Learning with Purpose',question:'What am I learning, and why does it matter?',action:'Hear students explain',crop:'16 300 235 294',groups:['elementary','middle','high'],example:'A student connects a water-quality investigation to the health of a local creek, explains the learning goal, and describes why the work matters beyond the classroom.',lookFor:['Students explain the goal in their own words.','Students connect learning to a meaningful context.','Their work reflects the purpose they describe.'],next:'Ask students to revisit their explanation after the investigation. What can they explain now that they could not explain before?'},
 {id:'thinking',title:'Big Thinking, Real Problems',question:'How am I using what I know to tackle a real problem?',action:'Explore a local challenge',crop:'541 300 220 294',groups:['middle','high'],example:'A team designs a model bridge, tests its load capacity, and uses the test results to revise the structure. Students explain the tradeoffs behind their design choices.',lookFor:['The challenge requires reasoning and a choice of approaches.','Students use subject knowledge to justify decisions.','Testing leads to a documented change in thinking.'],next:'Compare the original design with the revision. Ask which evidence changed the team’s approach.'},
 {id:'voice',title:'My Voice, My Choices',question:'Where can I shape what I explore or how I show what I know?',action:'See a student decision',crop:'1060 300 225 294',groups:['elementary','middle','high'],example:'A student chooses a question to investigate and proposes a visual explanation for an audience. They explain how their choices help communicate the learning goal.',lookFor:['Students make a meaningful decision about the work.','Choices stay connected to shared learning goals.','Students explain how a choice supports their learning.'],next:'Invite students to reflect on one choice they would make differently and why.'},
 {id:'work',title:'Show What You Can Do',question:'What have I written, made, or presented?',action:'Explore student work',image:'assets/student-bpi-portfolio.png',crop:'16 614 238 305',groups:['elementary','middle','high'],example:'A student presents their BPI portfolio website, shares learning artifacts, and explains how the work and reflections demonstrate their learning and growth.',lookFor:['The artifact makes the learning visible.','The explanation shows understanding beyond completion.','Success criteria connect the work to the learning goal.'],next:'Review the artifact alongside the student’s explanation. Identify what each reveals about understanding.'},
 {id:'feedback',title:'Feedback That Moves Me Forward',question:'How do I know where I stand and how to improve?',action:'Compare a draft and revision',crop:'541 614 220 305',groups:['middle','high'],example:'A writer receives feedback about the clarity of their argument, revises a paragraph with stronger evidence, and explains how the revision better supports the claim.',lookFor:['Feedback names a specific next step.','A revision responds to that feedback.','The student explains what improved and why.'],next:'Place the draft and revision side by side. Ask the student to point to the change that made the greatest difference.'},
 {id:'support',title:'Support to Take the Next Step',question:'When learning gets tough, what helps me move forward?',action:'See support in action',crop:'1060 614 238 305',groups:['elementary','middle','high'],example:'During a check-in, a student identifies where they are stuck. A teacher offers a prompt and a worked example, then the student applies the strategy independently.',lookFor:['Support responds to an identified learning need.','The student remains responsible for the thinking.','The next attempt shows increasing independence.'],next:'Return to the student’s next attempt. Look for how they use the strategy without the same level of support.'}
];
const school = document.querySelector('#school');
const experience = document.querySelector('#experience');
const cards = document.querySelector('#cards');
const dialog = document.querySelector('#detail');
const content = document.querySelector('#detail-content');
for (const item of experiences) { const option = document.createElement('option'); option.value=item.id; option.textContent=item.title; experience.append(option); }
let clearCardEntrance=()=>{};
function render(){
 clearCardEntrance();
 const filtered=experiences.filter(item=>(school.value==='all'||item.groups.includes(school.value))&&(experience.value==='all'||item.id===experience.value));
 cards.innerHTML=filtered.map(item=>`<article class="card"><div class="photo" aria-hidden="true">${item.image ? `<img src="${item.image}" alt="" class="standalone-photo">` : `<svg viewBox="${item.crop}" preserveAspectRatio="xMidYMid slice"><image href="assets/dashboard-reference.png" width="1586" height="992"/></svg>`}</div><div class="card-copy"><h2>${item.title}</h2><p>${item.question}</p><button data-id="${item.id}" aria-label="Explore Learning: ${item.title}">Explore Learning</button></div></article>`).join('');
 clearCardEntrance=animateEntrance(cards);
 document.querySelector('#results').textContent=school.value==='all'&&experience.value==='all'?'Six ways to see learning in action':`${filtered.length} illustrative experience${filtered.length===1?'':'s'} · ${school.options[school.selectedIndex].text}`;
 document.querySelector('#empty').hidden=filtered.length>0;
 document.querySelector('#reset').hidden=school.value==='all'&&experience.value==='all';
 const params=new URLSearchParams(); if(school.value!=='all')params.set('school',school.value); if(experience.value!=='all')params.set('experience',experience.value);
 history.replaceState(null,'',location.pathname+(params.size?'?'+params:'')+location.hash);
}

 const icons={book:'<path d="M10 18q14-7 27 0v39q-13-7-27 0zm27 0q13-7 27 0v39q-13-7-27 0z"/><path d="M5 22v41h57M16 22v29m43-29v24"/><circle cx="58" cy="56" r="15"/><path d="m65 49-5 10-10 5 5-10z"/>',target:'<circle cx="38" cy="40" r="26"/><circle cx="38" cy="40" r="16"/><circle cx="38" cy="40" r="5"/><path d="m38 40 29-29m-10 0 10-1-1 10"/>',checklist:'<rect x="13" y="9" width="51" height="62" rx="3"/><path d="m21 24 4 4 7-8m7 5h17M21 40l4 4 7-8m7 5h17M21 56l4 4 7-8m7 5h17"/>',steps:'<path d="M9 66V49h20V33h20V17h21v49z"/>'};
 function icon(name){return `<svg viewBox="0 0 80 80" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">${icons[name]||icons.book}</svg>`;}

const indicatorPages = {
  "thinking": {
    "intro": "Students use what they know to tackle challenging questions, test ideas, and solve problems that matter.",
    "kpis": [
      [
        "Challenging, Grade-Level Thinking",
        "Students explain, analyze, or justify their thinking at the level the Kentucky Priority Standard calls for.",
        "Students do the thinking the standard requires.",
        "steps"
      ],
      [
        "Real-World Application",
        "Students use their learning to address a real or unfamiliar problem and explain why their approach makes sense.",
        "Students can use what they know in a new situation.",
        "target"
      ],
      [
        "Interdisciplinary Learning",
        "Students use ideas or methods from two or more subjects to investigate a question, solve a problem, or create something.",
        "Students see how ideas from different subjects work together.",
        "book"
      ]
    ]
  },
  "voice": {
    "intro": "Students help shape their learning and explain the decisions they make.",
    "kpis": [
      [
        "Student Voice",
        "Students contribute ideas and identify a learning decision their input helped shape.",
        "Students see how their input can change their experience.",
        "target"
      ],
      [
        "Meaningful Choices",
        "Students choose and explain how they investigate, approach, or demonstrate their learning within shared expectations.",
        "Students make decisions that help them reach the learning goal.",
        "checklist"
      ],
      [
        "Interests, Passions, and Aspirations",
        "Students regularly pursue curriculum-connected questions or problems that matter to them.",
        "Students connect school learning to what they care about and where they want to go.",
        "book"
      ],
      [
        "Skills, Talents, and Ownership",
        "Students choose a skill or talent to use in their work and explain how it helps them meet the learning goal.",
        "Students recognize strengths they can use in new ways.",
        "steps"
      ]
    ]
  },
  "work": {
    "intro": "Students show what they know through writing, products, performances, and explanations of their progress.",
    "kpis": [
      [
        "Writing Across the Content",
        "Students write weekly in every course to develop or communicate their understanding.",
        "Writing makes reasoning and understanding visible across subjects.",
        "book"
      ],
      [
        "Compelling Evidence",
        "Students have multiple opportunities to show what they know and can do for each Kentucky Priority Standard.",
        "Several pieces of work give a fuller picture of learning.",
        "checklist"
      ],
      [
        "BRIDGE Performance Indicators and Assessments",
        "During scheduled BRIDGE tasks, students apply their learning and explain how their work demonstrates the targeted skills.",
        "Students can show how they communicate, solve problems, create, or reflect in action.",
        "target"
      ],
      [
        "BPI Portfolios and Presentations of Learning",
        "In grades 3-12, students select and explain portfolio evidence and use it to describe progress and next steps in scheduled Presentations of Learning.",
        "Students can explain how their learning has changed using their own work.",
        "steps"
      ]
    ]
  },
  "feedback": {
    "intro": "Students find out where they stand, receive feedback they can use, and have time to make their work stronger.",
    "kpis": [
      [
        "Check Understanding During Learning",
        "Students show what they understand early enough for teachers to adjust instruction, support, or challenge.",
        "Students get help or a greater challenge while they are still learning.",
        "target"
      ],
      [
        "Feedback Students Can Use",
        "Students receive specific feedback tied to the learning expectations and have time and support to act on it.",
        "Students know what to work on and can put the feedback to use.",
        "checklist"
      ],
      [
        "Revision and Improvement",
        "Students use feedback to revise, practice, or try again and explain what changed and why.",
        "Students can see how a specific change strengthened their work.",
        "steps"
      ]
    ]
  },
  "support": {
    "intro": "Students get the time, guidance, and opportunities they need to keep thinking when work gets difficult.",
    "kpis": [
      [
        "Responsive Learning Support",
        "Students receive timely prompts, tools, or guidance that let them participate in challenging grade-level work.",
        "Students get the help they need to do the thinking themselves.",
        "target"
      ],
      [
        "Purposeful Work Time",
        "Students have sustained time to practice, get help when needed, and reflect on what they are learning.",
        "Students can work through a challenge before moving on.",
        "book"
      ],
      [
        "Purposeful Collaboration",
        "Students contribute ideas, explain their reasoning, and build on the thinking of others.",
        "Students learn to explain an idea and consider another approach.",
        "checklist"
      ],
      [
        "Reflection and Next Steps",
        "Students use evidence from their work to explain where they got stuck, which strategy helped, and what they will try next.",
        "Students learn how to move forward with increasing independence.",
        "steps"
      ]
    ]
  }
};
const maturityLevels = ['Not Started','Establishing','Developing','Implementing','Sustaining and Advancing'];

function openIndicatorDashboard(item) {
 const page = indicatorPages[item.id];
 openPurposeDashboard.requestId = null;
 openPurposeDashboard.clearEntrance?.();
 dialog.classList.add('purpose-dialog');
 content.innerHTML = `
  <header class="purpose-brand"><svg viewBox="53 4 120 88" aria-hidden="true"><image href="assets/dashboard-reference.png" width="1586" height="992"/></svg><span><strong>VIBRANCY 5.0</strong><small>FLEMING COUNTY SCHOOLS</small></span></header>
  <nav class="purpose-nav" aria-label="Learning experiences">${experiences.map(domain=>`<button type="button" data-domain="${domain.id}" ${domain.id===item.id?'aria-current="page"':''}>${domain.title}</button>`).join('')}</nav>
  <section class="purpose-heading"><div><h2 id="detail-title">${item.title}</h2><p>${page.intro}</p></div></section>
  <p class="purpose-commitment">Proposed district commitment: 100% for each KPI</p>
  <section class="purpose-kpis" aria-label="${item.title} leading indicators">
   ${page.kpis.map(([title,description,why,symbol],index)=>`<article class="purpose-kpi purpose-tone-${index%4}">
    <div class="purpose-kpi-intro"><div class="purpose-icon">${icon(symbol)}</div><div><h3>${title}</h3><p>${description}</p><p class="purpose-why"><strong>Why it matters</strong> ${why}</p></div></div>
    <div class="purpose-status"><div><span>Current Status</span><strong class="purpose-status-pending">Awaiting data</strong></div><div class="purpose-meter-wrap"><div class="purpose-meter" aria-hidden="true"><span style="width:0%"></span></div><div class="purpose-rating-row"><span class="purpose-rating pending">Awaiting evidence</span></div></div></div>
   </article>`).join('')}
  </section>
  <section class="purpose-examples"><h3>Illustrative classroom example</h3><div><p>${item.example}</p><p>${item.next}</p></div></section>
  <section class="purpose-legend"><h3>Implementation maturity</h3><ul>${maturityLevels.map((label,index)=>`<li class="maturity-${index}">${label}</li>`).join('')}</ul></section>
  <p class="purpose-source">Proposed indicators. Current status will be reported when evidence is available.</p>`;
 if (!dialog.open) dialog.showModal();
 content.querySelectorAll('[data-domain]').forEach(button=>button.addEventListener('click',()=>{
  if (button.dataset.domain!==item.id) {
   openDetail(experiences.find(domain=>domain.id===button.dataset.domain));
   content.querySelector('[aria-current="page"]')?.focus();
  }
 }));
 content.querySelector('[aria-current="page"]')?.focus();
}
function openDetail(item) {
 if (item.id==='purpose') {
  openPurposeDashboard(id=>openDetail(experiences.find(domain=>domain.id===id)));
 } else {
  openIndicatorDashboard(item);
 }
}
const params=new URLSearchParams(location.search);
if([...school.options].some(o=>o.value===params.get('school')))school.value=params.get('school');
if(experiences.some(item=>item.id===params.get('experience')))experience.value=params.get('experience');
school.addEventListener('change',render);experience.addEventListener('change',render);
document.querySelector('#reset').addEventListener('click',()=>{school.value='all';experience.value='all';render();});
cards.addEventListener('click',event=>{const button=event.target.closest('button[data-id]');if(button)openDetail(experiences.find(item=>item.id===button.dataset.id));});
dialog.addEventListener('close',()=>{dialog.classList.remove('purpose-dialog');openPurposeDashboard.requestId=null;});
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
document.querySelector('#review').addEventListener('click',()=>{dialog.classList.remove('purpose-dialog');content.innerHTML='<span class="tag">Suggested review process</span><h2 id="detail-title">How we review evidence</h2><p>Start with what a student says, makes, or does. Consider the learning goal and classroom context before drawing a conclusion.</p><h3>Look across sources</h3><p>Pair student explanations with work samples, observations, and revisions. A single photograph or artifact cannot establish learning growth.</p><h3>Look for change over time</h3><p>Compare earlier and later evidence against clear success criteria. Describe the change and the next learning step.</p><h3>Share with care</h3><p>Use school-approved permissions before publishing student images, names, recordings, or work. Review evidence for context and accessibility.</p><p class="school-note">This is a proposed process for this prototype, not an adopted district policy. All current examples and imagery are illustrative.</p>';dialog.showModal();});
render();
