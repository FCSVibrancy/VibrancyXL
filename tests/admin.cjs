const {test}=require('node:test');const assert=require('node:assert/strict');
// Validation is independent of Google credentials; load it with a stub for the SDK.
let payload={email:'brian.creasman@fleming.kyschools.us',email_verified:true,sub:'111629863080092056219'};
const Module=require('node:module');const original=Module._load;Module._load=function(id,...args){if(id==='google-auth-library')return {OAuth2Client:class{async verifyIdToken(){return {getPayload:()=>payload};}}};return original.call(this,id,...args);};
const {validate,revision,OWNER,authorize}=require('../lib/control.cjs');Module._load=original;
const values=[['type','id','percent','url','description'],['kpi','purpose-1','50','','Example']];
test('only the verified owner is configured',()=>assert.equal(OWNER,'brian.creasman@fleming.kyschools.us'));
test('accepts blanks and numeric percentages',()=>{for(const value of ['','0','100','50%'])assert.doesNotThrow(()=>validate([{row:1,col:2,value}],values));});
test('rejects invalid percentages, protected IDs, out of bounds and duplicate writes',()=>{for(const changes of [[{row:1,col:2,value:'101'}],[{row:1,col:1,value:'other'}],[{row:0,col:4,value:'oops'}],[{row:1,col:3,value:'javascript:alert(1)'}],[{row:1,col:4,value:'a'},{row:1,col:4,value:'b'}]])assert.throws(()=>validate(changes,values));});
test('revision detects external edits',()=>assert.notEqual(revision(values),revision([...values,['new']])));

test('requires a bearer token on every request',async()=>{await assert.rejects(authorize({headers:{}}),{status:401});});
test('accepts only verified owner identity',async()=>{const owner={...payload};await authorize({headers:{authorization:'Bearer test'}});for(const changed of [{email:'staff@fleming.kyschools.us'},{email_verified:false},{sub:'different-account'}]){payload={...owner,...changed};await assert.rejects(authorize({headers:{authorization:'Bearer test'}}),{status:403});}payload=owner;});
test('protects formulas',()=>assert.throws(()=>validate([{row:1,col:1,value:'replacement'}],[['title','description'],['value','=A1']])));
const model=require('../admin/model.js');
test('preview maps aligned indicators by stable code instead of row order',()=>{const table=[['Dashboard tile','KPI card title','Description','Walkthrough alignment'],['Big Thinking, Real Problems','Context','Updated context','B3'],['Big Thinking, Real Problems','Reasoning','Updated reasoning','B1']];assert.equal(model.alignmentRow(table,{experience_id:'thinking',walkthrough_alignment:'B1, B2'}),2);assert.equal(model.alignmentRow(table,{experience_id:'thinking',walkthrough_alignment:'B3'}),1);});
test('draft row identity survives duplicate indicator IDs across reporting windows',()=>{const rows=model.records([['id','reporting_window','title'],['voice-1','current','Current voice'],['voice-1','next','Next voice']]);assert.deepEqual(rows.map(r=>r._row),[1,2]);assert.equal(rows[1].reporting_window,'next');});
test('blank preview percentages remain unknown and values stay in range',()=>{assert.equal(model.numeric(''),null);assert.equal(model.numeric('  '),null);assert.equal(model.numeric('0'),0);assert.equal(model.numeric('50%'),50);assert.equal(model.numeric('101'),null);});
