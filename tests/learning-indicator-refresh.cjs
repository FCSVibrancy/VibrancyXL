require('../evidence-viewer.js');
const {test}=require('node:test'),assert=require('node:assert/strict'),D=require('../purpose-dashboard.js'),W=require('../lib/learning-wording.cjs'),s=require('../data/learning-purpose.json');
test('published Why It Matters edits reach dashboards and private previews with stable identities',()=>{
 const saved=D.records([s.headers,...s.rows]),live=structuredClone(saved);const row=live.find(r=>r.id==='standards'&&r.type==='kpi');row.why_it_matters='An independently published reason for families.';
 const table=[s.headers,...live.map(r=>s.headers.map(h=>r[h]||''))],wording=W.project(table,[]);assert.equal(wording.find(r=>r.id==='standards').why_it_matters,row.why_it_matters);
 const data=D.applyPublishedWording(D.mergeDefinitions(saved,saved),wording);assert.ok(D.markup(data,'current','purpose').includes(row.why_it_matters));assert.equal(D.mergeDefinitions(live,saved).find(r=>r.id==='standards').why_it_matters,row.why_it_matters);
});
test('24 reporting indicators include three new findings with no invented result or history',()=>{
 const rows=D.records([s.headers,...s.rows]);assert.equal(['purpose','thinking','voice','work','feedback','support','thriving'].reduce((n,id)=>n+D.indicatorRows(rows,id).length,0),24);
 for(const id of ['thinking-3','feedback-3','feedback-4']){const r=rows.find(r=>r.id===id);assert.equal(r.percent,'');assert.equal(r.status,'Awaiting Evidence');assert.ok(r.why_it_matters);assert.equal(r.evidence_1_url,'');}
 assert.equal(D.reportingHome('scales-self-check','purpose'),'feedback');assert.ok(rows.find(r=>r.id==='feedback-1'));assert.ok(rows.find(r=>r.id==='feedback-2'));
});
