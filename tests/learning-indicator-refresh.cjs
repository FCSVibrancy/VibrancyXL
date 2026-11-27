require('../evidence-viewer.js');
const {test}=require('node:test'),assert=require('node:assert/strict'),D=require('../purpose-dashboard.js'),W=require('../lib/learning-wording.cjs'),s=require('../data/learning-purpose.json');
test('published Why It Matters edits reach dashboards and private previews with stable identities',()=>{
 const saved=D.records([s.headers,...s.rows]),live=structuredClone(saved);const row=live.find(r=>r.id==='standards'&&r.type==='kpi');row.why_it_matters='An independently published reason for families.';
 const table=[s.headers,...live.map(r=>s.headers.map(h=>r[h]||''))],wording=W.project(table,[]);assert.equal(wording.find(r=>r.id==='standards').why_it_matters,row.why_it_matters);
 const data=D.applyPublishedWording(D.mergeDefinitions(saved,saved),wording);assert.ok(D.markup(data,'current','purpose').includes(row.why_it_matters));assert.equal(D.mergeDefinitions(live,saved).find(r=>r.id==='standards').why_it_matters,row.why_it_matters);
});
test('24 reporting indicators include three new findings with no invented result or history',()=>{
 const rows=D.records([s.headers,...s.rows]);assert.equal(['purpose','thinking','voice','work','feedback','support','thriving'].reduce((n,id)=>n+D.indicatorRows(rows,id).length,0),24);
 for(const id of ['thinking-3','feedback-3','feedback-4']){const r=rows.find(r=>r.id===id);assert.equal(r.percent,'');assert.equal(r.status,'Awaiting Evidence');assert.ok(r.why_it_matters);assert.equal(r.evidence_1_url,'');}
 assert.equal(D.reportingHome('scales-self-check','purpose'),'feedback');assert.ok(rows.find(r=>r.id==='feedback-1'));assert.ok(rows.find(r=>r.id==='feedback-2'));
});
test('descriptions and reasons use selective safe emphasis without rewriting community language',()=>{
 const rows=D.records([s.headers,...s.rows]);for(const row of rows.filter(r=>r.type==='kpi'&&!['feedback-1','feedback-2'].includes(r.id)))for(const field of ['description','why_it_matters']){const html=D.emphasize(row[field],row.id,field);assert.ok(html.includes('<strong>'),row.id+' '+field);assert.equal(html.replace(/<\/?strong>/g,'').replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/&quot;/g,'"'),row[field]);}
 assert.equal(D.emphasize('Use **a new phrase** safely <img onerror=bad>','new-indicator'),'Use <strong>a new phrase</strong> safely &lt;img onerror=bad&gt;');assert.ok(!D.emphasize('**<script>bad</script>**','new').includes('<script>'));
 const html=D.markup(rows,'current','purpose');assert.ok(html.includes('<strong>enough time to learn, practice, and demonstrate</strong>'));assert.ok(html.includes('<strong>consistent learning expectations across schools</strong>'));
});
test('Why It Matters is a separate labelled callout, with wrapping emphasis instead of highlight pills',()=>{
 const html=D.markup(D.records([s.headers,...s.rows]),'current','purpose');assert.equal((html.match(/class="purpose-why-label"/g)||[]).length,4);assert.ok(html.includes('<section class="purpose-why" aria-label="Why It Matters"><h4'));assert.ok(!html.includes('<p class="purpose-why"><strong>'));
 const css=require('fs').readFileSync(require('path').join(__dirname,'../styles.css'),'utf8');assert.ok(css.includes('white-space:normal;background:none'));assert.ok(!/\.purpose-why strong\{[^}]*white-space:nowrap/.test(css));
});
test('new indicators in every component inherit the same labelled callout and safe bold formatting',()=>{
 const A=require('../area-indicators.js');for(const area of Object.keys(A.areas)){
  const item={id:'future-'+area,area_id:area,title:'New indicator',description:'Students **explain their thinking** in familiar language.',why_it_matters:'Families see **what students can do** with their learning.',visible:'TRUE'};
  for(const preview of [false,true]){const html=D.markup(A.dashboardData([item],area,'',[]),'current',area,{preview});assert.ok(html.includes('<section class="purpose-why" aria-label="Why It Matters"><h4 class="purpose-why-label">'));assert.ok(html.includes('<strong>explain their thinking</strong>'));assert.ok(html.includes('<strong>what students can do</strong>'));assert.ok(!html.includes('**'));}
 }
 const source=require('fs').readFileSync(require('path').join(__dirname,'../area-indicators.js'),'utf8');assert.ok(source.includes('/styles.css?v=20261127-why-callout'));
});
