const {test}=require('node:test'),assert=require('node:assert/strict');
require('../evidence-viewer.js');const D=require('../purpose-dashboard.js'),A=require('../area-indicators.js'),s=require('../data/learning-purpose.json');
test('indicator icon changes retain the dimensional wrapper in drafts and published wording',()=>{
 const saved=D.records([s.headers,...s.rows]),base=saved.find(r=>r.id==='standards'&&r.type==='kpi');
 for(const icon of ['target','★','https://example.org/district-logo.png','data:image/png;base64,aGVsbG8=']){
  const edit={...base,icon},before=JSON.stringify(edit);
  for(const rows of [D.mergeDefinitions([edit],saved),D.applyPublishedWording(saved,[edit])]){
   const actual=rows.find(r=>r.id===base.id&&r.type==='kpi');assert.equal(actual.icon,icon);assert.equal(actual.id,base.id);assert.equal(actual.note,base.note);
   const html=D.markup(rows,'current','purpose'),card=html.split('data-indicator-id="standards"')[1].split('</article>')[0];assert.ok(card.includes('class="purpose-icon"'));
   if(icon.startsWith('https:')||icon.startsWith('data:')){assert.ok(card.includes('class="purpose-icon-image"'));assert.ok(card.includes(`src="${icon}"`));}
  }
  assert.equal(JSON.stringify(edit),before);
 }
});
test('new image icons in every component use the same frame and safe media renderer publicly and privately',()=>{
 for(const area of Object.keys(A.areas)){
  const row={id:'indicator-image',area_id:area,title:'Image indicator',description:'Uses a replacement icon',icon:'/assets/fcs-measures-of-quality-header.jpg',visible:'TRUE'};
  const table=[A.headers,A.headers.map(h=>row[h]||'')],preview=D.markup(A.dashboardData(A.records(table),area),'current',area),published=D.markup(A.dashboardData(A.published(table),area),'current',area);
  assert.equal(preview,published);assert.ok(preview.includes('<div class="purpose-icon"><img class="purpose-icon-image"'));assert.ok(preview.includes(row.icon));
 }
 const data=D.records([s.headers,...s.rows]).map(r=>r.type==='kpi'?{...r,icon:'javascript:alert(1)'}:r);assert.ok(!D.markup(data,'current','purpose').includes('src="javascript:'));
});
