const {test}=require('node:test'),assert=require('node:assert/strict');
require('../evidence-viewer.js');const D=require('../purpose-dashboard.js'),M=require('../maturity-rubrics.js'),s=require('../data/learning-purpose.json');
const data=()=>D.records([s.headers,...s.rows]);
function fixture(stage='Developing',extra={}){return {type:'kpi',id:'scales',experience_id:'purpose',reporting_window:'term-1',title:'Illustrative fixture',description:'Fixture',sort_order:'1',percent:'',maturity_review:{approved:true,reviewer:'Illustrative test reviewer',period:'term-1',date:'2026-11-20',scope:'Illustrative classrooms A and B; two Priority Standards',finding:'Students **repeatedly analyzed examples** in fixture classrooms A and B; timing varied.',evidence:[{label:'Illustrative walkthrough and student explanations',reference:'Fixture A, observations 1–4'}],samplingApproved:true,sampling:'Illustrative sample: both fixture classrooms, two standards each.',criteria:{[stage]:true},...extra}};}
test('all 24 reporting indicators have five distinct specific observable stages and safe emphasis',()=>{
 const rows=data().filter(r=>r.type==='kpi'&&!['feedback-1','feedback-2'].includes(r.id));assert.equal(rows.length,24);
 for(const r of rows){const rubric=M.rubrics[r.id];assert.ok(rubric,r.id);assert.equal(rubric.stages.length,5);assert.equal(new Set(rubric.stages).size,5);assert.ok(rubric.stages.every(x=>x.includes('**')));assert.ok(rubric.settings&&rubric.cycle&&rubric.sampling);assert.equal(M.assess(r,data()).label,'Not Yet Rated');const h=M.details(r,data());assert.ok(h.includes('<strong>'));assert.ok(!h.includes('**'));assert.ok(!h.includes('<details open'));}
 assert.match(M.rubrics['work-1'].cycle,/every instructional week in every course/);assert.match(M.rubrics['work-3'].cycle,/scheduled cycle/);assert.match(M.rubrics.scales.stages[3],/before their first demonstration/);assert.match(M.rubrics['scales-self-check'].stages[3],/own unfinished work/);assert.match(M.rubrics['feedback-4'].stages[3],/Before-and-after/);
});
test('unreviewed legacy labels and incomplete reviews cannot become public ratings',()=>{
 for(const maturity of M.stages){assert.equal(M.assess({id:'scales',maturity}).label,'Not Yet Rated');}
 for(const field of ['approved','reviewer','date','scope','finding','evidence','samplingApproved','sampling']){const row=fixture();delete row.maturity_review[field];assert.equal(M.assess(row,[row]).label,'Not Yet Rated',field);}
});
test('completed Not Started is distinct from Not Yet Rated; highest supported full stage is selected',()=>{
 const row=fixture('Not Started',{finding:'Completed fixture review confirms students have **yet to begin** analyzing examples.'});assert.equal(M.assess(row,[row]).label,'Not Started');assert.ok(M.details(row,[row]).includes('<strong>yet to begin</strong>'));
 row.maturity_review.criteria.Establishing=true;assert.equal(M.assess(row,[row]).label,'Establishing');row.maturity_review.criteria.Developing=true;assert.equal(M.assess(row,[row]).label,'Developing');
});
test('reviewed Developing and Awaiting Evidence are independently visible in one collapsed card',()=>{
 const rows=data().filter(r=>r.id!=='scales');rows.push(fixture());const html=D.markup(rows,'current','purpose');const card=html.split('data-indicator-id="scales"')[1].split('</article>')[0];assert.match(card,/Implementation maturity/);assert.match(card,/>Developing<\/strong>/);assert.match(card,/Awaiting/);assert.match(card,/<details class="maturity-details"><summary>View maturity details/);assert.match(card,/Why we assigned this stage/);assert.match(card,/Fixture A, observations 1–4/);assert.match(card,/Reporting period/);assert.match(card,/Review date/);assert.match(card,/What the next stage looks like/);assert.match(card,/Full maturity rubric/);assert.ok(!card.includes('purpose-term-maturity'));
});
test('confirmed zero keeps counts and scope; a conflicting high stage is withheld',()=>{
 const row={...fixture('Implementing'),percent:'0',numerator:'0',denominator:'12',coverage:'Fixture classrooms A and B'};const dial=D.termDial(row,1,row.title);assert.match(dial,/aria-valuenow="0"/);assert.match(dial,/0 \/ 12/);assert.match(dial,/Fixture classrooms A and B/);assert.equal(M.assess(row,[row]).label,'Not Yet Rated');assert.match(M.details(row,[row]),/0% may conflict/);
 row.maturity_review.distinctProgressMeasures={'term-1':{reason:'Illustrative zero covers a separate student action; district reviewer reconciled the definitions.'}};assert.equal(M.assess(row,[row]).label,'Implementing');
 row.maturity_review.criteria={Developing:true};assert.equal(M.assess(row,[row]).label,'Developing');
});
test('sustaining requires cross-period evidence, a specific improvement, and follow-up',()=>{
 const row=fixture('Sustaining and Advancing');assert.equal(M.assess(row,[row]).label,'Not Yet Rated');Object.assign(row.maturity_review,{priorPeriods:['term-previous'],improvement:'Refined example prompts',followUp:'Student explanations connected features to the scale independently'});assert.equal(M.assess(row,[row]).label,'Sustaining and Advancing');assert.match(M.details(row,[row]),/What Fleming will continue/);
});
test('review text is escaped, input is preserved, and production has no illustrative ratings',()=>{
 const row=fixture('Developing',{finding:'Students **explain <script>bad</script>**.'}),before=JSON.stringify(row);const h=M.details(row,[row]);assert.ok(!h.includes('<script>'));assert.ok(h.includes('&lt;script&gt;'));assert.equal(JSON.stringify(row),before);assert.deepEqual(M.reviews,{});
});
