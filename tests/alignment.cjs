const assert=require('node:assert/strict'),fs=require('node:fs');
require('../evidence-viewer.js');
const {records,markup,applyAlignment}=require('../purpose-dashboard.js');
const snapshot=JSON.parse(fs.readFileSync('data/learning-purpose.json'));
const data=records([snapshot.headers,...snapshot.rows]);
const expected={purpose:4,thinking:2,voice:3,work:3,feedback:1,support:3,thriving:5};
for(const [id,count] of Object.entries(expected)){
 const html=markup(data,'current',id);
 assert.equal((html.match(/<article /g)||[]).length,count,id);
 assert.ok((html.match(/data-purpose-nav=/g)||[]).length>=7);
 assert.ok(html.includes(`data-purpose-nav="${id}" aria-current="page"`));
 if(id!=='purpose')assert.ok(!html.includes('aria-valuenow="50"'));
}
const edited=applyAlignment(data,[['Dashboard tile','KPI card title','What we expect students to experience','Walkthrough alignment'],['Big Thinking, Real Problems','Edited live title','Edited live description','B1'],['My Voice, My Choices','Student Voice updated','New voice definition','C1']]);
assert.equal(edited.find(r=>r.id==='thinking-1').title,'Edited live title');
assert.equal(edited.find(r=>r.id==='voice-1').description,'New voice definition');
assert.equal(edited.find(r=>r.id==='curriculum').title,data.find(r=>r.id==='curriculum').title);
assert.equal(edited.find(r=>r.id==='thriving-1').title,'Growth');
assert.throws(()=>applyAlignment(data,[['wrong headers']]));
assert.throws(()=>applyAlignment(data,[['Dashboard tile','KPI card title']]));
const future=[...data,{...data.find(r=>r.id==='voice-1'),reporting_window:'future',title:'Future voice only'}];
assert.ok(!markup(future,'current','voice').includes('Future voice only'));
assert.ok(markup(future,'future','voice').includes('Future voice only'));
console.log('Seven-dashboard tests passed: KPI groups, active navigation, rating isolation, live Alignment edits, and reporting windows.');
const reordered=applyAlignment(data,[['Dashboard tile','KPI card title'],['Big Thinking, Real Problems','Context comes first','Context definition','B3'],['Big Thinking, Real Problems','Reasoning comes second','Reasoning definition','B1']]);
assert.equal(reordered.find(r=>r.id==='thinking-1').title,'Reasoning comes second');
assert.equal(reordered.find(r=>r.id==='thinking-2').title,'Context comes first');
