const {test}=require('node:test'),assert=require('node:assert/strict');
const vision=require('../data/vision-expectations.json'),map=require('../data/learning-accountability-alignment.json');
require('../evidence-viewer.js');const D=require('../purpose-dashboard.js'),M=require('../maturity-rubrics.js'),snapshot=require('../data/learning-purpose.json');
const rows=D.records([snapshot.headers,...snapshot.rows]);
test('every learning expectation has an observable accountability measure and reviewed scope',()=>{
 assert.equal(map.length,33);
 for(const [,experience,items] of vision.filter(([,key])=>key!=='leadership'))for(const [title] of items){assert.ok(map.some(m=>m.home===experience&&m.toolTitle===title),title);}
 for(const m of map){const row=rows.find(r=>r.type==='kpi'&&r.id===m.id);assert.ok(row);assert.equal(row.description,m.description);assert.match(row.description,/Accountability measure: percentage of reviewed/);assert.ok(row.evidence_expectation);assert.ok(M.rubrics[row.id]);assert.equal(M.assess(row,rows).label,'Not Yet Rated');}
});
test('new measures start without results or evidence; all-grade outcomes retain explicit content-area scope',()=>{
 const added=map.filter(m=>m.isNew);assert.equal(added.length,9);
 for(const m of added){const row=rows.find(r=>r.type==='kpi'&&r.id===m.id);assert.equal(row.percent,'');assert.equal(row.status,'Awaiting Evidence');for(let n=1;n<=6;n++)assert.equal(row[`evidence_${n}_url`],'');}
 for(const id of ['thriving-1','thriving-2','thriving-3','thriving-agency']){const row=rows.find(r=>r.id===id);assert.match(row.description,/all grade levels/);assert.match(row.description,/all (?:subjects and )?content areas/);assert.match(row.evidence_expectation,/report coverage and findings by grade\/content area/);}
 const html=D.markup(rows,'current','support');for(const id of ['support-4','support-5','support-6'])assert.ok(html.includes(`data-indicator-id="${id}"`));assert.ok(!html.includes('**'));
});
