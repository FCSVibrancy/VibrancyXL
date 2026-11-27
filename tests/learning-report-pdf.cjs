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
test('successive PDF downloads read newly published titles, descriptions, additions and separate term results',async()=>{
 const control=require.cache[require.resolve('../lib/control.cjs')],pdf=require.cache[require.resolve('../lib/learning-report-pdf.cjs')],oldControl=control.exports,oldPdf=pdf.exports;
 const sheet=[s.headers,...s.rows.map(r=>[...r])],site=[['page','selector','value','description','url','visible']],area=[A.headers];let captured,reads=0;
 const tables={Sheet1:sheet,Alignment:[['Dashboard tile','KPI card title','Description','Walkthrough alignment']],SiteContent:site,AreaIndicators:area};
 control.exports={...oldControl,sheets:async path=>{reads++;assert.ok(!/\d+$/.test(decodeURIComponent(path).split('?')[0]));return {values:structuredClone(tables[decodeURIComponent(path).match(/'([^']+)'!/)[1]])};}};
 pdf.exports={generate:async sections=>{captured=sections;return Buffer.from('%PDF-live-test');}};
 delete require.cache[require.resolve('../api/learning-report.js')];const handler=require('../api/learning-report.js');
 const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},end(b){this.body=b;return this;}});
 try{
  await handler({method:'GET'},response());
  for(const row of sheet.slice(1))if(row[s.headers.indexOf('id')]==='standards'){row[s.headers.indexOf('title')]='Published revised title';row[s.headers.indexOf('description')]='Published revised description.';}
  const newRow=Object.fromEntries(s.headers.map(h=>[h,'']));Object.assign(newRow,{type:'kpi',id:'future-report',experience_id:'purpose',reporting_window:'current',title:'Newly published indicator',description:'Students explain their new finding.'});sheet.push(s.headers.map(h=>newRow[h]));
  site.push(['learning','@terms:learning:purpose:standards',JSON.stringify({term_1_percent:'0',term_2_percent:'83',term_3_percent:''})]);
  site.push(['learning','@terms:learning:purpose:future-report',JSON.stringify({term_1_percent:'',term_2_percent:'',term_3_percent:'61'})]);
  const res=response();await handler({method:'GET'},res);assert.equal(reads,8);assert.equal(res.headers['Cache-Control'],'no-store');
  const rows=captured.find(s=>s.id==='purpose').indicators,existing=rows.find(r=>r.id==='standards'),added=rows.find(r=>r.id==='future-report');
  assert.equal(existing.title,'Published revised title');assert.equal(existing.summary,'Published revised description.');assert.deepEqual(existing.terms.map(r=>R.result(r)),['0%','83%','Awaiting Evidence']);assert.equal(R.latestResult(added).percent,61);
  const actual=await oldPdf.generate(captured);assert.equal((actual.toString('latin1').match(/\/Type \/Page\b/g)||[]).length,2);assert.ok(actual.toString('latin1').includes('/Subtype /Image'));
 }finally{control.exports=oldControl;pdf.exports=oldPdf;delete require.cache[require.resolve('../api/learning-report.js')];}
});
