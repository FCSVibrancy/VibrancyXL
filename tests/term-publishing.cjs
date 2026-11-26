const {test}=require('node:test'),assert=require('node:assert/strict');
require('../evidence-viewer.js');const D=require('../purpose-dashboard.js'),T=require('../lib/term-results.cjs'),A=require('../area-indicators.js');
const snapshot=require('../data/learning-purpose.json');const sheet=[snapshot.headers,...snapshot.rows];
const site=[['page','selector','value','description','url','visible'],['learning','h1','Keep heading','','','TRUE']];
const area=[A.headers,...['ecosystem','logistics'].map(group=>A.headers.map(h=>({id:'indicator-shared',area_id:group,title:'Shared fixture indicator',description:'Test fixture',visible:'TRUE',reporting_window:'current'}[h]||'')))];
test('separate term edits publish through real handlers to the correct learning and area dials',async()=>{
 const control=require('../lib/control.cjs'),entry=require.cache[require.resolve('../lib/control.cjs')],prior=entry.exports;
 const tables={SiteContent:structuredClone(site),Sheet1:structuredClone(sheet),AreaIndicators:structuredClone(area)};
 const sheets=async(path,options)=>{if(path==='/values:batchUpdate'){assert.equal(options.data.valueInputOption,'RAW');for(const update of options.data.data){const [,name,col,row]=update.range.match(/^'([^']+)'!([A-Z])(\d+)$/);const index=Number(row)-1;tables[name][index]??=[];update.values[0].forEach((v,i)=>tables[name][index][col.charCodeAt(0)-65+i]=v);}return {};}
 const name=decodeURIComponent(path).match(/'([^']+)'!/)[1];return {values:structuredClone(tables[name])};};
 entry.exports={...control,authorize:async()=>{},sheets};delete require.cache[require.resolve('../api/control.js')];delete require.cache[require.resolve('../api/term-results.js')];const handler=require('../api/control.js'),publicHandler=require('../api/term-results.js');const old=process.env.GOOGLE_CLIENT_ID;process.env.GOOGLE_CLIENT_ID='test-only';
 const response=()=>({code:200,setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}});
 const read=async()=>{const res=response();await handler({method:'GET',query:{tab:'TermResults'}},res);assert.equal(res.code,200);return res.body;};
 const save=async(base,changes)=>{const res=response();await handler({method:'POST',body:{tab:'TermResults',revision:base.revision,changes}},res);return res;};
 try{
  const before=await read(),row=before.values.findIndex(r=>r[0]==='learning:purpose:standards');assert.deepEqual(before.values[row].slice(3,6),['','','']);
  const draft=structuredClone(before.values);draft[row][3]='0';draft[row][4]='55';draft[row][5]='100';
  let pub=response();await publicHandler({method:'GET'},pub);assert.equal(pub.body.results.length,0);
  const saved=await save(before,[{row,col:3,value:'0'},{row,col:4,value:'55'},{row,col:5,value:'100'}]);assert.equal(saved.code,200);assert.deepEqual(saved.body.values[row].slice(3,6),['0','55','100']);
  pub=response();await publicHandler({method:'GET'},pub);let data=D.applyTermResults(D.records(sheet),pub.body.results);const html=D.markup(data,'current','purpose');const card=html.split('data-indicator-id="standards"')[1].split('</article>')[0];for(const n of [0,55,100])assert.ok(card.includes(`aria-valuenow="${n}"`));
  assert.ok(!html.split('data-indicator-id="scales"')[1].split('</article>')[0].includes('aria-valuenow'));
  const evidenceBase=await read(),column=name=>evidenceBase.values[0].indexOf(name);
  const evidenceSaved=await save(evidenceBase,[{row,col:column('term_1_notes'),value:'Term 1 observation'},{row,col:column('term_1_evidence_1_label'),value:'Term 1 student work'},{row,col:column('term_1_evidence_1_url'),value:'https://drive.google.com/file/d/term-one/view'},{row,col:column('term_2_notes'),value:'Term 2 revision <script>unsafe</script>'},{row,col:column('term_2_evidence_1_label'),value:'Term 2 evidence brief'},{row,col:column('term_2_evidence_1_url'),value:'https://example.org/term-two'}]);assert.equal(evidenceSaved.code,200);
  pub=response();await publicHandler({method:'GET'},pub);const evidenceHtml=D.markup(D.applyTermResults(D.records(sheet),pub.body.results),'current','purpose');const evidenceCard=evidenceHtml.split('data-indicator-id="standards"')[1].split('</article>')[0];
  const term1=evidenceCard.split('<h4>Reporting Term 1</h4>')[1].split('<section class="purpose-term"')[0],term2=evidenceCard.split('<h4>Reporting Term 2</h4>')[1].split('<section class="purpose-term"')[0];
  assert.ok(term1.includes('Term 1 observation'));assert.ok(term1.includes('Term 1 student work'));assert.ok(!term1.includes('Term 2 evidence brief'));assert.ok(term2.includes('href="https://example.org/term-two"'));assert.ok(term2.includes('&lt;script&gt;'));assert.ok(!term2.includes('<script>'));
  const metadataBase=await read();const clearedEvidence=await save(metadataBase,[{row,col:column('term_2_evidence_1_url'),value:''},{row,col:column('term_2_notes'),value:''}]);assert.equal(clearedEvidence.code,200);assert.equal(clearedEvidence.body.values[row][column('term_1_notes')],'Term 1 observation');assert.deepEqual(clearedEvidence.body.values[row].slice(3,6),['0','55','100']);

  let latest=await read();const ecosystem=latest.values.findIndex(r=>r[0]==='area:ecosystem:indicator-shared');const areaSaved=await save(latest,[{row:ecosystem,col:4,value:'72'},{row:ecosystem,col:column('term_2_notes'),value:'Area-specific term note'},{row:ecosystem,col:column('term_2_evidence_6_label'),value:'Area-specific source'},{row:ecosystem,col:column('term_2_evidence_6_url'),value:'https://example.org/area-evidence'}]);assert.equal(areaSaved.code,200);
  pub=response();await publicHandler({method:'GET'},pub);const ahtml=D.markup(A.dashboardData(A.records(area).filter(r=>r.area_id==='ecosystem'),'ecosystem','',pub.body.results),'current','ecosystem');assert.ok(ahtml.includes('aria-valuenow="72"'));assert.ok(ahtml.includes('Area-specific term note'));assert.ok(ahtml.includes('href="https://example.org/area-evidence"'));
  const other=D.markup(A.dashboardData(A.records(area).filter(r=>r.area_id==='logistics'),'logistics','',pub.body.results),'current','logistics');assert.ok(!other.includes('aria-valuenow="72"'));assert.ok(!other.includes('Area-specific term note'));
  latest=await read();const cleared=await save(latest,[{row,col:4,value:''}]);assert.equal(cleared.code,200);assert.deepEqual(cleared.body.values[row].slice(3,6),['0','','100']);
  pub=response();await publicHandler({method:'GET'},pub);data=D.applyTermResults(D.records(sheet),pub.body.results);assert.equal(data.find(r=>r.id==='standards'&&r.reporting_window==='term-2').percent,'');assert.equal(data.find(r=>r.id==='standards'&&r.reporting_window==='term-1').percent,'0');
  const stale=await save(before,[{row,col:3,value:'99'}]);assert.equal(stale.code,409);assert.equal(tables.SiteContent[1][2],'Keep heading');assert.deepEqual(tables.Sheet1,sheet);
 }finally{entry.exports=prior;if(old===undefined)delete process.env.GOOGLE_CLIENT_ID;else process.env.GOOGLE_CLIENT_ID=old;}
});
test('term validation protects identity and rejects invalid results',()=>{const table=T.project(site,sheet,area);for(const change of [{row:1,col:0,value:'other'},{row:1,col:3,value:'101'},{row:1,col:4,value:'-1'},{row:1,col:5,value:'not a number'},{row:999,col:3,value:'50'}])assert.throws(()=>T.validate([change],table));assert.doesNotThrow(()=>T.validate([{row:1,col:3,value:''},{row:1,col:4,value:'0'},{row:1,col:5,value:'100'}],table));});
test('unassigned legacy values are never copied into terms and new indicators appear automatically',()=>{const changed=structuredClone(sheet);const r=changed.find(r=>r[0]==='kpi'&&r[1]==='curriculum');r[snapshot.headers.indexOf('percent')]='87';const table=T.project(site,changed,area);assert.deepEqual(table.find(r=>r[0]==='learning:purpose:curriculum').slice(3,6),['','','']);const added=[...area,A.headers.map(h=>({id:'indicator-new',area_id:'ecosystem',title:'New indicator'}[h]||''))];assert.ok(T.project(site,sheet,added).some(r=>r[0]==='area:ecosystem:indicator-new'));assert.ok(!table.some(r=>r[0]==='learning:feedback:feedback-1'));});

test('term evidence validates HTTPS links and preserves old percentage-only records',()=>{
 const table=T.project(site,sheet,area),col=name=>T.headers.indexOf(name);
 for(const value of ['javascript:alert(1)','http://example.org','https://user:password@example.org'])assert.throws(()=>T.validate([{row:1,col:col('term_1_evidence_1_url'),value}],table));
 assert.throws(()=>T.validate([{row:1,col:col('term_1_notes'),value:'x'.repeat(5001)}],table));
 const old=[...site,['learning','@terms:learning:purpose:standards',JSON.stringify({term_1_percent:'10',term_2_percent:'20',term_3_percent:'30'}),'','','TRUE']];
 const projected=T.project(old,sheet,area);assert.deepEqual(projected.find(r=>r[0]==='learning:purpose:standards').slice(3,6),['10','20','30']);assert.equal(T.savedRecords(old)[0].term_2_notes,undefined);
});
