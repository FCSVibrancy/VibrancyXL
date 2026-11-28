'use strict';
(function(root){
 const stages=['Not Started','Establishing','Developing','Implementing','Sustaining and Advancing'];
 const definitions={
  "curriculum": [
    "receive the shared required curriculum with sufficient instruction, practice, review and support",
    "classrooms, grades, courses and applicable learning cycles",
    "plan guaranteed and viable curriculum, its evidence and review cycle",
    "Teachers use a shared curriculum aligned to all required Kentucky Academic Standards. Priority Standards focus essential learning without excluding other required standards. Teams plan sufficient time for instruction, practice, review and additional support across classrooms and schools",
    "use evidence to refine guaranteed and viable curriculum, then check whether the intended learner experience and learning improve"
  ],
  "standards": [
    "explain WHAT they are learning, WHY it matters and a meaningful use in their own words",
    "classrooms, grades, courses and applicable learning cycles",
    "plan kentucky priority standards: learning and purpose, its evidence and review cycle",
    "At the start of instruction on each Priority Standard, teachers establish the learning and its purpose. Students explain WHAT they are learning, WHY it matters and where they can use it, in their own words, and connect their work to that purpose",
    "use evidence to refine kentucky priority standards: learning and purpose, then check whether the intended learner experience and learning improve"
  ],
  "scales": [
    "use aligned scales to compare examples before their first demonstration of proficiency and explain features of quality",
    "classrooms, grades, courses and applicable learning cycles",
    "plan proficiency scales: exemplar review and discussion, its evidence and review cycle",
    "Before their first demonstration of proficiency on each Priority Standard with a scale, students compare and discuss examples of different quality using the aligned scale. They identify specific features that meet the criteria and explain what to apply in their own work",
    "use evidence to refine proficiency scales: exemplar review and discussion, then check whether the intended learner experience and learning improve"
  ],
  "expectations": [
    "do the standard's grade-level thinking with accessible materials and appropriate supports",
    "classrooms, grades, courses and applicable learning cycles",
    "plan grade-level expectations, its evidence and review cycle",
    "Tasks and assessments match the standard's knowledge, skills and level of thinking. Teachers provide accessible materials, models and scaffolds while maintaining the learning expectation. Students explain their reasoning and do the thinking themselves, with approved accommodations as needed",
    "use evidence to refine grade-level expectations, then check whether the intended learner experience and learning improve"
  ],
  "thinking-1": [
    "apply learning to authentic problems and justify decisions with evidence",
    "classrooms, grades, courses and applicable learning cycles",
    "plan real-world learning connections, its evidence and review cycle",
    "Students apply grade-level knowledge and skills to an authentic problem, need or decision connected to life, community or work. They explain who is affected, compare possible responses and justify a solution or recommendation with evidence",
    "use evidence to refine real-world learning connections, then check whether the intended learner experience and learning improve"
  ],
  "thinking-2": [
    "use learning from two or more disciplines in one coherent task and explain each contribution",
    "classrooms, grades, courses and applicable learning cycles",
    "plan interdisciplinary learning, its evidence and review cycle",
    "When a problem requires multiple subjects, students use learning from two or more disciplines in one coherent task. Teachers identify and assess the relevant standards in each discipline. Students explain what each subject contributes to their understanding or solution",
    "use evidence to refine interdisciplinary learning, then check whether the intended learner experience and learning improve"
  ],
  "thinking-3": [
    "experience learning tasks shaped by documented family, community and workforce contributions",
    "classrooms, grades, courses and applicable learning cycles",
    "plan community partnerships in learning design, its evidence and review cycle",
    "Teachers develop learning experiences in partnership with families, community members and local workforce partners. Partners help frame problems, contribute expertise or define authentic success criteria. Plans and student explanations show how partner input shaped the learning, with opportunities accessible to all students. Record each contributor group and its design contribution; audience attendance alone does not establish co-design. A single partnership finding does not establish all elements of a qualifying vibrant learning experience",
    "use evidence to refine community partnerships in learning design, then check whether the intended learner experience and learning improve"
  ],
  "voice-1": [
    "identify an actual learning decision changed by their input",
    "classrooms, grades, courses and applicable learning cycles",
    "plan student voice, its evidence and review cycle",
    "Students influence learning decisions. Teachers explain how student input was used, and students identify what changed because of their input. Evidence connects a student contribution to an actual decision about questions, learning experiences or classroom practice",
    "use evidence to refine student voice, then check whether the intended learner experience and learning improve"
  ],
  "voice-2": [
    "make consequential choices that meet shared learning expectations",
    "classrooms, grades, courses and applicable learning cycles",
    "plan student choice, its evidence and review cycle",
    "Students make meaningful choices about questions, approaches or demonstrations of learning. They explain their reasons, how their choices shaped the work and how the work meets shared learning expectations",
    "use evidence to refine student choice, then check whether the intended learner experience and learning improve"
  ],
  "voice-3": [
    "connect work to interests, passions, aspirations, skills, talents and lived experiences",
    "classrooms, grades, courses and applicable learning cycles",
    "plan interests, passions, aspirations, skills and talents, its evidence and review cycle",
    "Students connect a specific task, product or investigation to their interests, passions, strengths, skills, talents, cultural knowledge, lived experiences or aspirations. They explain how that connection shaped their work and identify a further learning or career possibility to explore",
    "use evidence to refine interests, passions, aspirations, skills and talents, then check whether the intended learner experience and learning improve"
  ],
  "voice-4": [
    "generate questions, investigate possibilities, revise ideas and pursue further inquiry",
    "classrooms, grades, courses and applicable learning cycles",
    "plan exploration and discovery, its evidence and review cycle",
    "Students generate questions, investigate ideas and test possibilities using appropriate sources, tools or experiences. They examine evidence, revise an explanation or approach, and describe what they discovered and what they want to investigate next. Teachers provide time and guidance for this inquiry",
    "use evidence to refine exploration and discovery, then check whether the intended learner experience and learning improve"
  ],
  "work-1": [
    "write to explain reasoning or communicate subject knowledge weekly in every course",
    "every instructional week in every course",
    "plan writing across the content, its evidence and review cycle",
    "Students write weekly in every course to explain reasoning, interpret evidence or communicate subject knowledge. Teachers give feedback on thinking and relevant writing criteria; dated samples show student-generated ideas",
    "use evidence to refine writing across the content, then check whether the intended learner experience and learning improve"
  ],
  "work-2": [
    "apply learning in individual performances assessed with criteria shared in advance",
    "classrooms, grades, courses and applicable learning cycles",
    "plan performance-based assessments, its evidence and review cycle",
    "Students apply standards through products, performances or explanations. Teachers share criteria in advance, assess each student's demonstrated learning and give feedback. Completion alone does not establish proficiency",
    "use evidence to refine performance-based assessments, then check whether the intended learner experience and learning improve"
  ],
  "work-3": [
    "use BPI portfolio evidence in Presentations of Learning to justify progress, capabilities and next steps",
    "scheduled grade 3-12 portfolio and presentation cycles",
    "plan bpi portfolios and presentations of learning, its evidence and review cycle",
    "In grades 3-12, students use selected portfolio evidence to explain growth, mastery, readiness and BPI development. They justify claims, answer audience questions and identify next steps. Teachers provide preparation, accessible participation and feedback that students use to refine goals. Students select relevant BPI portfolio artifacts and explain what each demonstrates; record the district's presentation schedule",
    "use evidence to refine bpi portfolios and presentations of learning, then check whether the intended learner experience and learning improve"
  ],
  "work-4": [
    "learn through sustained inquiry, decisions, critique, revision and purposeful products",
    "classrooms, grades, courses and applicable learning cycles",
    "plan project-based learning, its evidence and review cycle",
    "Students learn through sustained inquiry into a meaningful question or challenge. They apply standards, make decisions, use feedback and revision, and share a product or response with an audience connected to its purpose. Teachers check individual learning at project milestones",
    "use evidence to refine project-based learning, then check whether the intended learner experience and learning improve"
  ],
  "work-5": [
    "use explicitly taught BPI criteria to assess and improve their performance",
    "classrooms, grades, courses and applicable learning cycles",
    "plan bpi integration, its evidence and review cycle",
    "Teachers plan, teach and assess BRIDGE Performance Indicators (BPIs) alongside academic standards. Students explain the BPI, use its criteria to assess and improve work, and show how their performance changed",
    "use evidence to refine bpi integration, then check whether the intended learner experience and learning improve"
  ],
  "work-6": [
    "maintain and explain BPI portfolio websites with dated, indicator-linked evidence and reflection",
    "scheduled grade 3-12 website review cycles",
    "plan bpi website usage, its evidence and review cycle",
    "In grades 3-12, students maintain BPI portfolio websites with dated, indicator-linked evidence and reflection. They navigate their sites, explain what artifacts demonstrate and identify next steps. Teachers schedule updates and review; links work, access is supported and privacy is protected",
    "use evidence to refine bpi website usage, then check whether the intended learner experience and learning improve"
  ],
  "work-7": [
    "demonstrate their own learning and explain their contribution within collaborative work",
    "classrooms, grades, courses and applicable learning cycles",
    "plan individual learning in collaborative work, its evidence and review cycle",
    "For collaborative work, teachers collect individual explanations, demonstrations or work samples. Each student explains their contribution and independently demonstrates the targeted learning, with required accommodations and supports",
    "use evidence to refine individual learning in collaborative work, then check whether the intended learner experience and learning improve"
  ],
  "scales-self-check": [
    "use aligned scales to check their own unfinished work and act on a specific next step",
    "classrooms, grades, courses and applicable learning cycles",
    "plan proficiency scales: check work in progress, its evidence and review cycle",
    "Teachers provide aligned Proficiency Scales for Priority Standards. At least once during instruction on each Priority Standard, students use the scale to check their own unfinished work, cite evidence, identify a next step and act on it while time remains. Example analysis before first demonstration is reported separately under Learning with Purpose",
    "use evidence to refine proficiency scales: check work in progress, then check whether the intended learner experience and learning improve"
  ],
  "feedback-3": [
    "receive specific, timely feedback against the standard or scale and explain their next step",
    "classrooms, grades, courses and applicable learning cycles",
    "plan timely feedback aligned to mastery, its evidence and review cycle",
    "Teachers and peers provide specific feedback tied to the standard or scale while there is time to use it. Feedback identifies a feature of the work, what meets the expectation and what needs improvement. Students explain what they will do next",
    "use evidence to refine timely feedback aligned to mastery, then check whether the intended learner experience and learning improve"
  ],
  "feedback-4": [
    "improve work in response to feedback and demonstrate the learning again",
    "classrooms, grades, courses and applicable learning cycles",
    "plan revision based on feedback, its evidence and review cycle",
    "Students revise an explanation, solution, draft or performance in response to feedback and explain how the change better meets the criteria. Teachers provide time to act on feedback and reassess the targeted learning using revised work or a new demonstration. Before-and-after work and reassessment show how the targeted learning improved",
    "use evidence to refine revision based on feedback, then check whether the intended learner experience and learning improve"
  ],
  "feedback-5": [
    "receive assessment judgments checked through independent common scoring and resolution of differences",
    "classrooms, grades, courses and applicable learning cycles",
    "plan consistent assessment and scoring, its evidence and review cycle",
    "Teacher teams independently score common student work with shared criteria, compare judgments and resolve differences using evidence. They refine examples and scoring guidance, then check agreement again so that the same quality of work receives a consistent judgment across classrooms",
    "use evidence to refine consistent assessment and scoring, then check whether the intended learner experience and learning improve"
  ],
  "support-1": [
    "receive responsive teaching or extension based on current evidence of their learning",
    "classrooms, grades, courses and applicable learning cycles",
    "plan timely support and extension, its evidence and review cycle",
    "Teachers use current checks of understanding to identify specific learning needs and respond during instruction. They provide targeted teaching, scaffolds or extension for students who already demonstrate mastery, while maintaining access to challenging grade-level learning",
    "use evidence to refine timely support and extension, then check whether the intended learner experience and learning improve"
  ],
  "support-2": [
    "contribute reasoning, respond to peers and explain how collaboration improves understanding",
    "classrooms, grades, courses and applicable learning cycles",
    "plan student collaboration, its evidence and review cycle",
    "Students contribute ideas, explain reasoning, listen and build on or question peer thinking toward a shared learning purpose. Each student explains their contribution, what they learned and how a peer's thinking improved their understanding or work. Teachers ensure equitable participation",
    "use evidence to refine student collaboration, then check whether the intended learner experience and learning improve"
  ],
  "support-3": [
    "set goals from patterns in work and feedback, then check progress in the next task or unit",
    "classrooms, grades, courses and applicable learning cycles",
    "plan reflection and next steps, its evidence and review cycle",
    "Students review earlier work and feedback to identify a pattern in strengths or learning needs. They set a specific goal, name a strategy or support, and check progress during the next task or unit, adjusting their approach when needed",
    "use evidence to refine reflection and next steps, then check whether the intended learner experience and learning improve"
  ],
  "support-4": [
    "regularly access targeted tutoring with a provider, schedule, family communication and progress monitoring",
    "classrooms, grades, courses and applicable learning cycles",
    "plan strategic and systematic interventions, its evidence and review cycle",
    "Teams identify who needs tutoring, the learning target, provider and schedule. Before-, during-, or after-school tutoring is available and attended regularly by identified students. Parents are notified and encouraged to support attendance. Staff address access barriers, monitor attendance and learning, and adjust support",
    "use evidence to refine strategic and systematic interventions, then check whether the intended learner experience and learning improve"
  ],
  "support-5": [
    "experience focused teaching, protected application, responsive conferences or groups, and reflection",
    "classrooms, grades, courses and applicable learning cycles",
    "plan workshop model, its evidence and review cycle",
    "Instruction includes a focused mini-lesson or model, protected practice or application, responsive conferring or small groups, and reflection or sharing. Teachers use formative evidence to select the teaching focus and support. Students explain their learning goal and apply learning with increasing independence",
    "use evidence to refine workshop model, then check whether the intended learner experience and learning improve"
  ],
  "support-6": [
    "show follow-up learning evidence that informs whether intervention continues, changes, intensifies or concludes",
    "classrooms, grades, courses and applicable learning cycles",
    "plan intervention effectiveness and follow-up, its evidence and review cycle",
    "Staff compare follow-up work with the specific learning need that prompted support. They document whether understanding, accuracy or independence improved and decide to continue, change, intensify or conclude support. Attendance alone does not demonstrate the intervention's effectiveness",
    "use evidence to refine intervention effectiveness and follow-up, then check whether the intended learner experience and learning improve"
  ],
  "thriving-1": [
    "show growth toward individual learning goals through comparable earlier and later evidence in every grade and content area",
    "all grade levels and content areas, with coverage and findings recorded separately by grade and content area",
    "plan growth across all grades and content areas, its evidence and review cycle",
    "Growth is evaluated in all grade levels and all subjects and content areas, including and extending beyond reading and mathematics. Students and teachers compare earlier and later evidence against the same learning expectation and criteria. Students explain what improved and what helped. Teachers monitor individual learning goals, including for students already above expectations, and respond when progress is insufficient. Report separately the proportion with comparable evidence and the proportion demonstrating growth toward the documented goal; missing evidence does not establish no growth",
    "use evidence to refine growth across all grades and content areas, then check whether the intended learner experience and learning improve"
  ],
  "thriving-2": [
    "demonstrate standards-aligned mastery through individual evidence in every grade and content area",
    "all grade levels and content areas, with coverage and findings recorded separately by grade and content area",
    "plan mastery across all grades and content areas, its evidence and review cycle",
    "Mastery is expected and evaluated in all grade levels and all content areas. Students demonstrate the standard's expected knowledge, skills and thinking through aligned individual evidence and required accommodations. Teachers use shared criteria and sufficient evidence for the claim; 3.0 represents expected learning where scales apply. Effort, completion and group performance are reported separately from mastery",
    "use evidence to refine mastery across all grades and content areas, then check whether the intended learner experience and learning improve"
  ],
  "thriving-3": [
    "demonstrate identified next-step demands in aligned tasks in every grade and content area",
    "all grade levels and content areas, with coverage and findings recorded separately by grade and content area",
    "plan readiness across all grades and content areas, its evidence and review cycle",
    "Readiness is expected and evaluated in all grade levels and all content areas. Teachers identify the demands of the next grade, course, pathway or opportunity. Students demonstrate the relevant knowledge, skills and independence in aligned tasks, explain their evidence and identify gaps. Teachers provide targeted preparation and opportunities to apply learning in a new context",
    "use evidence to refine readiness across all grades and content areas, then check whether the intended learner experience and learning improve"
  ],
  "thriving-agency": [
    "set goals, make learning decisions, monitor and adjust their approach in every grade and content area",
    "all grade levels and content areas, with coverage and findings recorded separately by grade and content area",
    "plan student agency across all grades and content areas, its evidence and review cycle",
    "Student agency is expected and evaluated in all grade levels and all content areas. Students use interests, passions, aspirations, skills and talents to set goals and shape learning decisions. They select strategies, seek support, monitor evidence and adjust their approach. Across experiences, students explain how their decisions affected learning and take increasing responsibility for next steps",
    "use evidence to refine student agency across all grades and content areas, then check whether the intended learner experience and learning improve"
  ],
  "thriving-4": [
    "experience safety and belonging, identify a trusted adult and access help that is followed up",
    "classrooms, grades, courses and applicable learning cycles",
    "plan student well-being, its evidence and review cycle",
    "Students experience safety, belonging and supportive relationships, identify a trusted adult and know how to obtain help. Leaders use student feedback, attendance and participation to identify barriers and unmet social, emotional or physical needs, respond promptly and check whether support helped",
    "use evidence to refine student well-being, then check whether the intended learner experience and learning improve"
  ]
};
 const focusDescriptions={
  "curriculum": "Maturity reflects how consistently students receive the shared required curriculum with sufficient instruction, practice, review and support across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "standards": "Maturity reflects how consistently students explain WHAT they are learning, WHY it matters and a meaningful use in their own words across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "scales": "Maturity reflects how consistently students use aligned scales to compare examples before their first demonstration of proficiency and explain features of quality across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "expectations": "Maturity reflects how consistently students do the standard's grade-level thinking with accessible materials and appropriate supports across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "thinking-1": "Maturity reflects how consistently students apply learning to authentic problems and justify decisions with evidence across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "thinking-2": "Maturity reflects how consistently students use learning from two or more disciplines in one coherent task and explain each contribution across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "thinking-3": "Maturity reflects how consistently students experience learning tasks shaped by documented family, community and workforce contributions across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "voice-1": "Maturity reflects how consistently students identify an actual learning decision changed by their input across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "voice-2": "Maturity reflects how consistently students make consequential choices that meet shared learning expectations across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "voice-3": "Maturity reflects how consistently students connect work to interests, passions, aspirations, skills, talents and lived experiences across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "voice-4": "Maturity reflects how consistently students generate questions, investigate possibilities, revise ideas and pursue further inquiry across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "work-1": "Maturity reflects how consistently students write to explain reasoning or communicate subject knowledge weekly in every course across the applicable every instructional week in every course reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "work-2": "Maturity reflects how consistently students apply learning in individual performances assessed with criteria shared in advance across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "work-3": "Maturity reflects how consistently students use BPI portfolio evidence during scheduled Presentations of Learning to justify progress, capabilities and next steps across the applicable scheduled grade 3-12 portfolio and presentation cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "work-4": "Maturity reflects how consistently students learn through sustained inquiry, decisions, critique, revision and purposeful products across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "work-5": "Maturity reflects how consistently students use explicitly taught BPI criteria to assess and improve their performance across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "work-6": "Maturity reflects how consistently students maintain and explain BPI portfolio websites with dated, indicator-linked evidence and reflection across the applicable scheduled grade 3-12 website review cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "work-7": "Maturity reflects how consistently students demonstrate their own learning and explain their contribution within collaborative work across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "scales-self-check": "Maturity reflects how consistently students use aligned scales to check their own unfinished work at least once during instruction on each Priority Standard and act on a specific next step across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "feedback-3": "Maturity reflects how consistently students receive specific, timely feedback against the standard or scale and explain their next step across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "feedback-4": "Maturity reflects how consistently students improve work in response to feedback and demonstrate the learning again across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and before-and-after work and follow-up evidence separately from participation percentages or student attainment.",
  "feedback-5": "Maturity reflects how consistently students receive assessment judgments checked through independent common scoring and resolution of differences across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "support-1": "Maturity reflects how consistently students receive responsive teaching or extension based on current evidence of their learning across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "support-2": "Maturity reflects how consistently students contribute reasoning, respond to peers and explain how collaboration improves understanding across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "support-3": "Maturity reflects how consistently students set goals from patterns in work and feedback, then check progress in the next task or unit across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "support-4": "Maturity reflects how consistently students regularly access targeted tutoring with a provider, schedule, family communication and progress monitoring across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "support-5": "Maturity reflects how consistently students experience focused teaching, protected application, responsive conferences or groups, and reflection across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "support-6": "Maturity reflects how consistently students show follow-up learning evidence that informs whether intervention continues, changes, intensifies or concludes across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "thriving-1": "Maturity reflects how consistently students show growth toward individual learning goals through comparable earlier and later evidence in every grade and content area across the applicable all grade levels and content areas, with coverage and findings recorded separately by grade and content area reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "thriving-2": "Maturity reflects how consistently students demonstrate standards-aligned mastery through individual evidence in every grade and content area across the applicable all grade levels and content areas, with coverage and findings recorded separately by grade and content area reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "thriving-3": "Maturity reflects how consistently students demonstrate identified next-step demands in aligned tasks in every grade and content area across the applicable all grade levels and content areas, with coverage and findings recorded separately by grade and content area reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "thriving-agency": "Maturity reflects how consistently students set goals, make learning decisions, monitor and adjust their approach in every grade and content area across the applicable all grade levels and content areas, with coverage and findings recorded separately by grade and content area reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment.",
  "thriving-4": "Maturity reflects how consistently students experience safety and belonging, identify a trusted adult and access help that is followed up across the applicable classrooms, grades, courses and applicable learning cycles reviewed. Verify the intended experience and follow-up evidence separately from participation percentages or student attainment."
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
 const notRatedDescription='Evidence is **insufficient to assign a stage**, or a review has yet to be completed.';
 const pathwayLabels=['Not<br>Started','Estab&shy;lishing','Devel&shy;oping','Imple&shy;menting','Sus&shy;taining and Ad&shy;vancing'];
 function details(row,data){
  const r=assess(row,data),id='maturity-description-'+[row.experience_id,row.id,row.reporting_window].map(value=>encodeURIComponent(value||'current')).join('-');
  const currentDescription=r.stage<0?notRatedDescription:r.rubric.stages[r.stage];
  const currentHeading=esc(r.label)+(r.stage<0?'':' · Current stage')+(r.stage===3?' · Expectation':'');
  const currentContent=`<h5>${currentHeading}</h5><p>${rich(currentDescription)}</p>`;
  return `<section class="accountability-maturity" aria-label="Accountability Maturity" data-current-stage="${r.stage}"><div class="maturity-footer-heading">${accountabilityMedallion}<h4>Accountability Maturity</h4></div><p class="maturity-indicator-focus">${esc(focusDescriptions[r.id]||'Maturity describes how consistently this indicator’s practice is used and verified in students’ experiences across the settings and opportunities reviewed.')}</p><ol class="maturity-pathway" aria-label="Five maturity stages; hover, focus, or tap a step to preview its description">${stages.map((label,i)=>`<li><button type="button" class="maturity-path-step${i===3?' maturity-expectation':''}" data-maturity-step="${i}" data-stage-name="${esc(label)}" data-stage-description="${esc(rich(r.rubric?.stages[i]||'Indicator-specific descriptions are awaiting district review.'))}" aria-controls="${id}"${r.stage===i?' aria-current="step"':''}><span class="maturity-path-current" aria-hidden="true"${r.stage===i||(r.stage<0&&i===0)?'':' hidden'}>▼</span><span class="maturity-path-dot maturity-${i}" aria-hidden="true">${i+1}</span><span class="maturity-path-label">${pathwayLabels[i]}</span></button></li>`).join('')}</ol><div class="maturity-path-legend"><p class="maturity-current-note"><span aria-hidden="true">▼</span> Current rating</p><p class="maturity-expectation-note">Expectation · Level 4: Implementing</p></div><div id="${id}" class="maturity-current-description" aria-label="Maturity stage description" aria-live="polite" aria-atomic="true">${currentContent}</div><template class="maturity-default-description">${currentContent}</template></section>`;
 }
 const bound=new WeakSet(),handled=new WeakSet();
 function bind(scope){
  if(bound.has(scope))return;bound.add(scope);
  const stepFor=event=>event.composedPath().find(el=>el?.matches?.('[data-maturity-step]'));
  function show(button){const section=button.closest('.accountability-maturity'),index=Number(button.dataset.maturityStep),target=section.querySelector('.maturity-current-description');target.querySelector('h5').textContent=button.dataset.stageName+(Number(section.dataset.currentStage)===index?' · Current stage':'')+(index===3?' · Expectation':'');target.querySelector('p').innerHTML=button.dataset.stageDescription;}
  function restore(button){const section=button.closest('.accountability-maturity'),active=button.getRootNode().activeElement;if(active?.matches?.('[data-maturity-step]')&&active.closest('.accountability-maturity')===section){show(active);return;}section.querySelector('.maturity-current-description').replaceChildren(section.querySelector('.maturity-default-description').content.cloneNode(true));}
  for(const type of ['pointerover','pointerout','focusin','focusout','click','keydown'])scope.addEventListener(type,event=>{
   if(handled.has(event))return;const button=stepFor(event);if(!button)return;handled.add(event);
   if(type==='keydown'){if(['Enter',' '].includes(event.key))event.stopPropagation();return;}
   if(type==='click'){event.preventDefault();event.stopPropagation();show(button);return;}
   if(type==='pointerover'){if(event.pointerType!=='touch'&&!button.contains(event.relatedTarget))show(button);return;}
   if(type==='focusin'){show(button);return;}
   if(button.contains(event.relatedTarget))return;
   const next=event.relatedTarget?.closest?.('[data-maturity-step]');
   if(next?.closest('.accountability-maturity')===button.closest('.accountability-maturity'))return;
   if(type==='focusout'){const section=button.closest('.accountability-maturity');section.querySelector('.maturity-current-description').replaceChildren(section.querySelector('.maturity-default-description').content.cloneNode(true));}
   else restore(button);
  },true);
 }
 if(root.document)bind(root.document);
 const api={stages,rubrics,reviews,focusDescriptions,assess,details,bind};root.VibrancyMaturity=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
