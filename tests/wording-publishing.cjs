const {test}=require('node:test'),assert=require('node:assert/strict');
require('../evidence-viewer.js');const D=require('../purpose-dashboard.js'),snapshot=require('../data/learning-purpose.json');
test('editable scales overview precedes two separately measured commitments',()=>{
 const saved=D.records([snapshot.headers,...snapshot.rows]),overview=saved.find(r=>r.type==='overview');
 const edited={...overview,title:'Edited scales overview',description:'Use scales throughout learning.',_row:77};
 for(const rows of [D.mergeDefinitions([edited],saved),D.applyPublishedWording(saved,[edited])]){
  const html=D.markup(rows,'current','purpose');
  assert.ok(html.includes('Use scales throughout learning.'));assert.ok(html.includes('Two separate 100% commitments'));
  assert.ok(html.indexOf('Edited scales overview')<html.indexOf('data-indicator-id="scales"'));
  for(const id of ['scales','scales-self-check']){const card=html.split(`data-indicator-id="${id}"`)[1].split('</article>')[0];assert.equal((card.match(/class="purpose-dial"/g)||[]).length,3);}
 }
});
test('published and draft wording overrides saved definitions without changing term evidence',()=>{
 const saved=D.records([snapshot.headers,...snapshot.rows]);
 for(const def of saved.filter(r=>r.type==='kpi')){
  const edited={...def,title:'Edited '+def.id,description:'Updated student experience',_row:42};
  const preview=D.mergeDefinitions([edited],saved),published=D.applyPublishedWording(saved,[edited]);
  for(const rows of [preview,published]){
   const actual=rows.find(r=>r.type==='kpi'&&r.id===def.id&&r.reporting_window===def.reporting_window);
   assert.equal(actual.title,edited.title);assert.equal(actual.description,edited.description);assert.equal(actual.note,def.note);
   assert.ok(D.markup(rows,'current',def.experience_id||'purpose').includes('Edited '+def.id));
  }
  assert.equal(preview.find(r=>r.id===def.id&&r.type==='kpi')._row,42);
 }
 const blank={...saved.find(r=>r.id==='curriculum'),description:''};assert.equal(D.mergeDefinitions([blank],saved).find(r=>r.id==='curriculum').description,'');
});
test('fresh public wording endpoint uses published sheet and Alignment with no private data',async()=>{
 const control=require('../lib/control.cjs'),entry=require.cache[require.resolve('../lib/control.cjs')],prior=entry.exports;
 const sheet=[snapshot.headers,...structuredClone(snapshot.rows)],row=sheet.find(r=>r[1]==='standards');row[3]='Published title';row[4]='Published description';
 const alignment=[['Dashboard tile','KPI card title','What we expect students to experience','Walkthrough alignment'],['Big Thinking, Real Problems','Aligned title','Aligned description','B1']];
 entry.exports={...control,sheets:async path=>({values:decodeURIComponent(path).includes('Alignment')?alignment:sheet})};
 delete require.cache[require.resolve('../api/learning-wording.js')];const handler=require('../api/learning-wording.js');
 const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(body){this.body=body;return this;}};
 try{await handler({method:'GET'},res);assert.equal(res.headers['Cache-Control'],'no-store');const rows=res.body.indicators;assert.equal(rows.find(r=>r.id==='standards').title,'Published title');assert.equal(rows.find(r=>r.id==='thinking-1').description,'Aligned description');assert.ok(rows.every(r=>!Object.hasOwn(r,'percent')&&!Object.hasOwn(r,'note')));}
 finally{entry.exports=prior;}
});
