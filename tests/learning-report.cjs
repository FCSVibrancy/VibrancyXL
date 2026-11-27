const {test}=require('node:test'),assert=require('node:assert/strict');
require('../purpose-dashboard.js');require('../area-indicators.js');require('../experiences.js');const R=require('../learning-report.js'),s=require('../data/learning-purpose.json');
test('two report pages include seven experiences and every scored indicator exactly once',()=>{
 const sections=R.assemble(s,[],[]),html=R.markup(sections,{date:new Date('2026-11-27T15:00:00Z')});
 assert.equal(sections.length,7);assert.equal(sections.reduce((n,r)=>n+r.indicators.length,0),21);assert.equal((html.match(/class="report-sheet"/g)||[]).length,2);
 for(const section of sections)for(const row of section.indicators)assert.equal(html.split(`data-report-indicator="${row.id}"`).length-1,1);
 assert.ok(html.includes('Two 100% commitments'));assert.ok(html.includes('One 100% commitment'));assert.ok(!html.includes('data-report-indicator="feedback-1"'));assert.ok(!html.includes('data-report-indicator="feedback-2"'));
});
test('report uses published wording and assigned terms without turning blank into zero or changing data',()=>{
 const wording=[{type:'kpi',id:'standards',experience_id:'purpose',reporting_window:'current',title:'Updated public title',description:'Students explain a new purpose.'}],terms=[{id:'learning:purpose:standards',term_1_percent:'0',term_2_percent:'76',term_3_percent:''},{id:'learning:purpose:scales-self-check',term_1_percent:'43',term_2_percent:'',term_3_percent:''}];
 const before=JSON.stringify({wording,terms,s});const sections=R.assemble(s,wording,terms),html=R.markup(sections);
 const row=sections.find(x=>x.id==='purpose').indicators.find(x=>x.id==='standards');assert.equal(row.title,wording[0].title);assert.equal(row.summary,wording[0].description);assert.deepEqual(row.terms.map(r=>R.result(r)),['0%','76%','Awaiting Evidence']);
 assert.equal(R.result(row.terms[0],false),'Results unavailable');assert.ok(html.includes('43%'));assert.equal(JSON.stringify({wording,terms,s}),before);
});
test('new published learning indicators and component indicators are included automatically',()=>{
 const wording=[{type:'kpi',id:'new-purpose',experience_id:'purpose',reporting_window:'current',title:'New learning measure',description:'A new published finding.'}],area=[{id:'indicator-report-new',area_id:'learning',title:'Additional learning indicator',description:'New evidence.',percent:'',visible:'TRUE'}];
 const sections=R.assemble(s,wording,[],area),html=R.markup(sections);assert.equal(sections.reduce((n,r)=>n+r.indicators.length,0),23);assert.ok(html.includes('New learning measure'));assert.ok(html.includes('Additional learning indicator'));assert.equal((html.match(/class="report-sheet"/g)||[]).length,2);
});
