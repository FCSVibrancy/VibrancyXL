const {test}=require('node:test'),assert=require('node:assert/strict');
require('../evidence-viewer.js');const D=require('../purpose-dashboard.js'),T=require('../lib/term-results.cjs'),A=require('../area-indicators.js'),s=require('../data/learning-purpose.json');
test('moved self-check keeps its original term key and all term evidence in one reporting home',()=>{
 const sheet=[s.headers,...structuredClone(s.rows)],row=sheet.find(r=>r[1]==='scales-self-check');row[s.headers.indexOf('experience_id')]='purpose';
 const values={};for(const n of [1,2,3]){values[`term_${n}_percent`]=['0','63',''][n-1];values[`term_${n}_notes`]=`Term ${n}: distinct draft annotations, scale criteria 3.0`;
  for(let slot=1;slot<=6;slot++){values[`term_${n}_evidence_${slot}_label`]=`Term ${n} source ${slot}`;values[`term_${n}_evidence_${slot}_url`]=`https://example.org/bridge/${slot}`;}}
 const site=[['page','selector','value','description','url','visible'],['learning','@terms:learning:purpose:scales-self-check',JSON.stringify(values),'Original self-check','','TRUE']];
 const table=T.project(site,sheet,[A.headers]),i=table.findIndex(r=>r[0]==='learning:purpose:scales-self-check');assert.ok(i>0);assert.equal(table[i][1],'feedback');
 for(const [field,value] of Object.entries(values))assert.equal(table[i][T.headers.indexOf(field)],value);
 const change={row:i,col:T.headers.indexOf('term_2_notes'),value:'Updated criteria-specific finding'};T.validate([change],table);const writes=T.writes(site,table,[change]);assert.equal(writes.length,1);assert.equal(writes[0].range,"'SiteContent'!C2");const next=JSON.parse(writes[0].values[0][0]);assert.deepEqual(next,{...values,term_2_notes:change.value});
 const data=D.applyTermResults(D.mergeDefinitions(D.records(sheet),D.records([s.headers,...s.rows])),T.savedRecords(site));
 const purpose=D.markup(data,'current','purpose'),feedback=D.markup(data,'current','feedback');
 assert.ok(!purpose.includes('data-indicator-id="scales-self-check"'));assert.equal((feedback.match(/data-indicator-id="scales-self-check"/g)||[]).length,1);
 assert.equal((purpose.match(/class="purpose-dial"/g)||[]).length,12);assert.equal((feedback.match(/class="purpose-dial"/g)||[]).length,9);
 assert.ok(purpose.includes('Two 100% commitments'));assert.ok(feedback.includes('One 100% commitment'));
 for(const n of [1,2,3])assert.ok(feedback.includes(values[`term_${n}_notes`]));
 for(let slot=1;slot<=6;slot++)assert.ok(feedback.includes(`https://example.org/bridge/${slot}`));
 assert.ok(purpose.includes('Proficiency Scales: Check Work in Progress'));assert.ok(feedback.includes('Proficiency Scales: Analyze Examples'));
 assert.ok(feedback.includes('data-reference-indicator-id="feedback-1"'));assert.ok(feedback.includes('data-reference-indicator-id="feedback-2"'));
});
test('BRIDGE criteria and three reporting dimensions are explicit without conflating scores',()=>{
 const data=D.records([s.headers,...s.rows]);const thinking=D.markup(data,'current','thinking'),thriving=D.markup(data,'current','thriving');
 assert.ok(thinking.includes('distinct evidence within the artifact'));assert.ok(thinking.includes('Learner experience'));assert.ok(thriving.includes('Learner outcomes'));
 const dial=D.termDial({percent:'50',maturity:'Developing'},1,'Fixture');assert.ok(dial.includes('Implementation maturity:</strong> Developing'));assert.ok(dial.includes('aria-valuenow="50"'));
});
