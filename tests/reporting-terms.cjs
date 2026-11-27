const {test}=require('node:test'),assert=require('node:assert/strict');
require('../evidence-viewer.js');const D=require('../purpose-dashboard.js');const s=require('../data/learning-purpose.json');const data=D.records([s.headers,...s.rows]);
test('each indicator has three distinct term dials without a reporting dropdown',()=>{
 const html=D.markup(data,'current','purpose');assert.ok(!html.includes('id="purpose-window"'));assert.ok(!html.includes('class="purpose-meter"'));
 assert.equal((html.match(/class="purpose-terms"/g)||[]).length,4);
 for(const id of ['standards','scales']){const card=html.split(`data-indicator-id="${id}"`)[1].split('</article>')[0];for(const term of [1,2,3])assert.ok(card.includes(`Reporting Term ${term}`));assert.equal((card.match(/class="purpose-dial"/g)||[]).length,3);}
});
test('term percentages are independent, zero is real, and legacy current values remain unassigned',()=>{
 const def=data.find(r=>r.id==='standards'&&r.type==='kpi');const rows=[{...def,percent:'87',reporting_window:'current'},...[[1,'0'],[2,'50'],[3,'100']].map(([term,percent])=>({...def,reporting_window:'term-'+term,percent,status:''}))];
 const html=D.markup([...data.filter(r=>r.id!=='standards'||r.type!=='kpi'),...rows],'current','purpose');const card=html.split('data-indicator-id="standards"')[1].split('</article>')[0];assert.ok(!card.includes('87%'));for(const n of [0,50,100])assert.ok(card.includes(`aria-valuenow="${n}"`));assert.equal((card.match(/Target 100%/g)||[]).length,3);
 assert.equal(D.reportingTerm({reporting_window:'current'}),null);assert.equal(D.reportingTerm({reporting_window:'custom'},[{type:'window',id:'custom',title:'Reporting Term 2'}]),2);
});
test('pending results never show numeric completion; feedback does not duplicate commitments',()=>{
 const pending=D.termDial({percent:'75',status:'Awaiting Evidence'},1,'Test');assert.ok(pending.includes('Awaiting Evidence'));assert.ok(!pending.includes('aria-valuenow'));assert.ok(!pending.includes('75%'));
 const feedback=D.markup(data,'current','feedback');assert.equal((feedback.match(/class="purpose-dial"/g)||[]).length,3);assert.ok(feedback.includes('One 100% commitment'));
});
test('evidence links retain their reporting term identity',()=>{
 const row={...data.find(r=>r.type==='kpi'&&r.id==='scales'),reporting_window:'term-2',percent:'50',status:'',evidence_1_label:'Term 2 draft',evidence_1_url:'https://drive.google.com/file/d/term2/view'};
 const html=D.markup([...data,row],'current','purpose');assert.ok(html.includes('data-evidence-window="term-2"'));const card=html.split('data-indicator-id="scales"')[1].split('</article>')[0];const term2=card.split('<h4>Reporting Term 2</h4>')[1].split('<section class="purpose-term"')[0];assert.ok(term2.includes('Term 2 draft'));assert.ok(term2.includes('Evidence of Practice'));
});
test('zero displays as zero and clearing a result keeps its notes and evidence visible',()=>{
 for(const term of [1,2,3])for(const value of ['0','']){
  const record={id:'learning:purpose:standards',[`term_${term}_percent`]:value,[`term_${term}_notes`]:'Retained term note',[`term_${term}_evidence_1_label`]:'Retained student work',[`term_${term}_evidence_1_url`]:'https://example.org/student-work'};
  const row=D.applyTermResults(data,[record]).find(r=>r.id==='standards'&&r.reporting_window===`term-${term}`);
  const html=D.termDial(row,term,'Test');
  assert.ok(html.includes('Retained term note'));assert.ok(html.includes('Retained student work'));assert.ok(html.includes('href="https://example.org/student-work"'));
  if(value==='0'){assert.ok(html.includes('class="dial-number" x="100" y="99" text-anchor="middle">0%</text>'));assert.ok(html.includes('aria-valuenow="0"'));}
  else {assert.ok(html.includes(`Reporting Term ${term}: Awaiting Evidence`));assert.ok(!html.includes('class="dial-number"'));assert.ok(!html.includes('aria-valuenow'));}
 }
});
