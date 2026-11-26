const {test}=require('node:test');const assert=require('node:assert/strict');
const B=require('../lib/beliefs.cjs');
require('../evidence-viewer.js');const D=require('../purpose-dashboard.js');
const snapshot=require('../data/learning-purpose.json');const data=D.records([snapshot.headers,...snapshot.rows]);
test('belief publishing reads back through public API and rejects a stale revision',async()=>{
 const control=require('../lib/control.cjs');const prior=require.cache[require.resolve('../lib/control.cjs')].exports;
 let values=[['page','selector','value','description','url','visible'],['learning','h1','Keep this heading','','','TRUE']];
 const sheets=async(path,options)=>{if(path==='/values:batchUpdate'){assert.equal(options.data.valueInputOption,'RAW');for(const update of options.data.data){const [,col,row]=update.range.match(/!([A-Z])(\d+)$/);const index=Number(row)-1;values[index]??=[];update.values[0].forEach((v,i)=>values[index][col.charCodeAt(0)-65+i]=v);}return {};}return {values:structuredClone(values)};};
 require.cache[require.resolve('../lib/control.cjs')].exports={...control,authorize:async()=>{},sheets};delete require.cache[require.resolve('../api/control.js')];delete require.cache[require.resolve('../api/beliefs.js')];
 const handler=require('../api/control.js'),publicHandler=require('../api/beliefs.js');const old=process.env.GOOGLE_CLIENT_ID;process.env.GOOGLE_CLIENT_ID='test-only';
 const response=()=>({code:200,setHeader(){},status(n){this.code=n;return this;},json(v){this.body=v;return this;}});
 try{
  const read=response();await handler({method:'GET',query:{tab:'Beliefs'}},read);assert.equal(read.body.values.length,8);
  const draft='In Fleming County Schools, we believe an edited statement should publish exactly once.';
  let pub=response();await publicHandler({method:'GET'},pub);assert.notEqual(pub.body.beliefs[0].belief_statement,draft);
  const save=response();await handler({method:'POST',body:{tab:'Beliefs',revision:read.body.revision,changes:[{row:1,col:2,value:draft}]}},save);assert.equal(save.code,200);assert.equal(save.body.values[1][2],draft);
  pub=response();await publicHandler({method:'GET'},pub);assert.equal(pub.body.beliefs[0].belief_statement,draft);
  assert.equal(values[1][2],'Keep this heading');assert.equal(values.length,3);
  const html=D.markup(D.applyBeliefs(data,pub.body.beliefs),'current','purpose');assert.ok(html.includes(draft));assert.ok(html.includes('purpose-belief'));
  const stale=response();await handler({method:'POST',body:{tab:'Beliefs',revision:read.body.revision,changes:[{row:1,col:2,value:'Stale edit'}]}},stale);assert.equal(stale.code,409);
 }finally{require.cache[require.resolve('../lib/control.cjs')].exports=prior;if(old===undefined)delete process.env.GOOGLE_CLIENT_ID;else process.env.GOOGLE_CLIENT_ID=old;}
});
test('belief validation protects identity, nonempty statements, formulas, and existing content',()=>{
 const raw=[['page','selector','value','description','url','visible'],['learning','@belief:purpose','=FORMULA()','','','TRUE']];const table=B.project(raw);
 for(const changes of [[{row:1,col:0,value:'other'}],[{row:1,col:2,value:' '}],[{row:8,col:2,value:'Other'}],[{row:1,col:2,value:'a'},{row:1,col:2,value:'b'}]])assert.throws(()=>B.validate(changes,table));
 assert.throws(()=>B.writes(raw,[{row:1,col:2,value:'Changed'}]));
});
test('published belief text is escaped and private draft tables use the same renderer',()=>{
 const table=[B.headers,...B.defaults.map(r=>[r.id,r.title,r.belief_statement])];table[1][2]='<img src=x onerror=alert(1)> & learning';
 const applied=D.applyBeliefs(data,table);assert.equal(applied.find(r=>r.type==='page'&&r.id==='purpose')._beliefRow,1);
 const html=D.markup(applied,'current','purpose');assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img src=x'));assert.ok(html.includes('FCS Belief Statement'));
});
