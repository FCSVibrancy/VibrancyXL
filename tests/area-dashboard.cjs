const {test}=require('node:test'),assert=require('node:assert/strict');
require('../evidence-viewer.js');const {markup}=require('../purpose-dashboard.js');
const A=require('../area-indicators.js');
test('every area renders through the Learning dashboard with its own data',()=>{
 for(const area of Object.keys(A.areas)){
  const rows=[{id:'indicator-one',area_id:area,title:'First indicator',description:'Area-specific indicator description',percent:'0',status:'',evidence_url:'https://example.org/evidence',visible:'TRUE'}];
  const data=A.dashboardData(rows,area,'Area introduction'),html=markup(data,'current',area);
  assert.equal(data.filter(row=>row.type==='kpi').length,1);assert.match(html,/class="purpose-brand"/);assert.match(html,/class="purpose-kpis"/);assert.match(html,/class="purpose-kpi purpose-tone-0"/);assert.match(html,/aria-valuenow="0"/);assert.ok(html.includes(A.areas[area]));assert.ok(html.includes('Area-specific indicator description'));assert.ok(html.includes('href="https://example.org/evidence"'));assert.ok(!html.includes('class="purpose-examples"'));assert.ok(!html.includes('class="purpose-why"'));
 }
});
test('area dashboards preserve Drive preview buttons, missing data, and escaping',()=>{
 const row={id:'indicator-test',area_id:'ecosystem',title:'<img src=x onerror=alert(1)>',description:'Actual indicator',percent:'',status:'',evidence_url:'https://drive.google.com/file/d/abc123/view'};
 const html=markup(A.dashboardData([row],'ecosystem'),'current','ecosystem');assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img src=x'));assert.ok(html.includes('data-evidence-id="indicator-test"'));assert.ok(html.includes('Awaiting data'));assert.ok(!html.includes('role="progressbar"'));
 row.evidence_url='javascript:alert(1)';assert.ok(!markup(A.dashboardData([row],'ecosystem'),'current','ecosystem').includes('javascript:'));
});

test('reporting windows show only their own indicators and retain all evidence slots',()=>{
 const items=[{id:'indicator-current',title:'Current indicator',description:'Current',reporting_window:'current',percent:'0'},{id:'indicator-next',title:'Future indicator',description:'Future',reporting_window:'next',percent:'50',evidence_6_label:'Sixth source',evidence_6_url:'https://drive.google.com/file/d/slot6/view'}];const data=A.dashboardData(items,'ecosystem');const current=markup(data,'current','ecosystem'),next=markup(data,'next','ecosystem');assert.ok(current.includes('Current indicator'));assert.ok(!current.includes('Future indicator'));assert.ok(next.includes('Future indicator'));assert.ok(!next.includes('Current indicator'));assert.ok(next.includes('data-evidence-slot="6"'));assert.ok(next.includes('Sixth source'));
});
