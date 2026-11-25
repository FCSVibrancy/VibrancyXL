const {test}=require('node:test');const assert=require('node:assert/strict');
const A=require('../area-indicators.js'),M=require('../admin/model.js');
const C=require('../lib/control.cjs');
const row=(area,id='one')=>A.headers.map(key=>({id:'indicator-'+id,area_id:area,title:'Student growth',description:'Students explain growth using evidence.',percent:'0',visible:'TRUE',sort_order:'1'}[key]||''));
test('every area accepts its first real indicator, including zero percent',()=>{for(const area of Object.keys(A.areas)){const values=[A.headers,row(area)];C.validateAdditions([row(area)],'AreaIndicators',[A.headers]);assert.equal(A.published(values)[0].area_id,area);assert.equal(A.percentage(A.published(values)[0].percent),0);}});
test('new control-board drafts are incomplete and cannot activate tiles',()=>{for(const area of Object.keys(A.areas)){const draft=M.newAreaIndicator(area,'indicator-new',1);assert.equal(draft.area_id,area);assert.equal(A.populated(draft),false);}});
test('incomplete and hidden indicators never become public',()=>{for(const area of Object.keys(A.areas)){for(const field of ['title','description']){const incomplete=row(area);incomplete[A.headers.indexOf(field)]=' ';assert.deepEqual(A.published([A.headers,incomplete]),[]);}const hidden=row(area);hidden[7]='FALSE';assert.deepEqual(A.published([A.headers,hidden]),[]);}});
test('invalid areas, duplicate IDs, unsafe evidence and invalid percentages are rejected',()=>{for(const [field,value] of [['area_id','unknown'],['percent','101'],['evidence_url','javascript:alert(1)'],['evidence_url','https://user:secret@example.com'],['visible','maybe']]){const invalid=row('ecosystem');invalid[A.headers.indexOf(field)]=value;assert.throws(()=>C.validateAreaTable([A.headers,invalid]));}assert.throws(()=>C.validateAdditions([row('ecosystem')],'AreaIndicators',[A.headers,row('ecosystem')]));assert.throws(()=>C.validate([{row:1,col:1,value:'learning'}],[A.headers,row('ecosystem')]));});
test('public projection excludes private metadata and filters invalid records',()=>{const hidden=row('ecosystem','hidden');hidden[7]='FALSE';const published=A.published([A.headers,row('ecosystem'),hidden]);assert.equal(published.length,1);assert.deepEqual(Object.keys(published[0]),A.headers);assert.equal('_row' in published[0],false);assert.throws(()=>A.published([['page','selector','value'],['ecosystem','@tile:custom-1','Heading']]));});

// Exercise real API handlers against a local in-memory Sheets transport.
const Module=require('node:module'),load=Module._load;let stored=[A.headers],authorized=true;
async function sheets(path,options){if(path==='/values:batchUpdate'){for(const entry of options.data.data){const match=entry.range.match(/!([A-Z]+)(\d+)$/);const ri=Number(match[2])-1,ci=match[1].charCodeAt(0)-65;stored[ri]||=Array(9).fill('');entry.values[0].forEach((v,i)=>stored[ri][ci+i]=v);}return {};}return {values:structuredClone(stored)};}
Module._load=function(id,...args){if(id==='../lib/control.cjs')return {...C,sheets,authorize:async()=>{if(!authorized){const e=Error('Sign in');e.status=401;throw e;}}};return load.call(this,id,...args);};
const control=require('../api/control.js'),publicAPI=require('../api/indicators.js');Module._load=load;
async function call(handler,req){const res={code:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};await handler(req,res);return res;}
test('publish, reload, activate, edit, hide, and stale-write checks work through real handlers for all areas',async()=>{
 process.env.GOOGLE_CLIENT_ID='local-test';
 for(const area of Object.keys(A.areas)){
  stored=[A.headers];let current=await call(control,{method:'GET',query:{tab:'AreaIndicators'},headers:{}});assert.equal(current.code,200);
  let result=await call(control,{method:'POST',body:{tab:'AreaIndicators',revision:current.body.revision,additions:[row(area)],changes:[]},headers:{}});assert.equal(result.code,200);
  let live=await call(publicAPI,{method:'GET'});assert.equal(live.body.indicators.length,1);assert.equal(live.body.indicators[0].area_id,area);assert.equal(live.headers['Cache-Control'],'no-store');
  const stale=await call(control,{method:'POST',body:{tab:'AreaIndicators',revision:current.body.revision,changes:[{row:1,col:7,value:'FALSE'}]},headers:{}});assert.equal(stale.code,409);
  const edited=await call(control,{method:'POST',body:{tab:'AreaIndicators',revision:result.body.revision,changes:[{row:1,col:2,value:'Updated indicator'}]},headers:{}});assert.equal(edited.code,200);assert.equal((await call(publicAPI,{method:'GET'})).body.indicators[0].title,'Updated indicator');
  const hidden=await call(control,{method:'POST',body:{tab:'AreaIndicators',revision:edited.body.revision,changes:[{row:1,col:7,value:'FALSE'}]},headers:{}});assert.equal(hidden.code,200);assert.deepEqual((await call(publicAPI,{method:'GET'})).body.indicators,[]);
 }
 authorized=false;assert.equal((await call(control,{method:'GET',query:{tab:'AreaIndicators'},headers:{}})).code,401);authorized=true;
 assert.equal((await call(publicAPI,{method:'POST'})).code,405);
});
