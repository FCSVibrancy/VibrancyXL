const {test}=require('node:test'),assert=require('node:assert/strict');
require('../purpose-dashboard.js');const A=require('../area-indicators.js');require('../experiences.js');
const R=require('../learning-report.js'),P=require('../lib/learning-report-pdf.cjs'),s=require('../data/learning-purpose.json');
test('community report generates a two-page Letter PDF without changing source results',async()=>{
 const terms=[{id:'learning:purpose:standards',term_1_percent:'0',term_2_percent:'52',term_3_percent:''}],before=JSON.stringify({s,terms});
 const buffer=await P.generate(R.assemble(s,[],terms),{date:new Date('2026-11-27T15:00:00Z')});assert.ok(buffer.subarray(0,5).equals(Buffer.from('%PDF-')));
 assert.equal((buffer.toString('latin1').match(/\/Type \/Page\b/g)||[]).length,2);assert.ok(buffer.toString('latin1').includes('/MediaBox [0 0 612 792]'));assert.equal(JSON.stringify({s,terms}),before);
});
test('direct download returns a dated PDF attachment using read-only published sources',async()=>{
 const C=require('../lib/control.cjs'),entry=require.cache[require.resolve('../lib/control.cjs')],prior=entry.exports;
 const tables={Sheet1:[s.headers,...s.rows],Alignment:[['Dashboard tile','KPI card title','Description','Walkthrough alignment']],SiteContent:[['page','selector','value','description','url','visible']],AreaIndicators:[A.headers]};let reads=0;
 entry.exports={...C,sheets:async(path,options)=>{assert.equal(options,undefined);assert.ok(path.startsWith('/values/'));reads++;return {values:structuredClone(tables[decodeURIComponent(path).match(/'([^']+)'!/)[1]])};}};
 delete require.cache[require.resolve('../api/learning-report.js')];const handler=require('../api/learning-report.js');
 const res={headers:{},code:200,setHeader(k,v){this.headers[k]=v;return this;},status(n){this.code=n;return this;},json(b){this.body=b;return this;},end(b){this.body=b;return this;}};
 try{await handler({method:'GET'},res);assert.equal(reads,4);assert.equal(res.code,200);assert.equal(res.headers['Content-Type'],'application/pdf');assert.equal(res.headers['Cache-Control'],'no-store');assert.match(res.headers['Content-Disposition'],/^attachment; filename="Vibrant-Learning-Report-\d{4}-\d{2}-\d{2}\.pdf"$/);assert.ok(Buffer.isBuffer(res.body));assert.equal(res.headers['Content-Length'],res.body.length);}
 finally{entry.exports=prior;}
});
test('single bar chooses the latest scored term, preserves zero, and skips pending evidence',()=>{
 const indicator={terms:[{percent:'35'},{percent:'0'},{percent:''}]},before=JSON.stringify(indicator);
 assert.deepEqual(R.latestResult(indicator),{term:2,percent:0,label:'0%'});
 assert.equal(JSON.stringify(indicator),before);
 assert.equal(R.latestResult({terms:[{percent:'35'},{percent:'80',status:'pending'},{}]}).term,1);
 assert.deepEqual(R.latestResult({terms:[{},{},{}]}),{term:null,percent:null,label:'Awaiting Evidence'});
 assert.equal(R.latestResult(indicator,false).label,'Results unavailable');
});
