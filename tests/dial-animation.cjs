const {test}=require('node:test'),assert=require('node:assert/strict');
require('../evidence-viewer.js');const D=require('../purpose-dashboard.js');
test('gauge sweeps to full, back to empty, then the actual result including zero',()=>{
 for(const n of [0,37.5,100]){const frames=D.dialSweepFrames(String(n));assert.equal(frames[1].strokeDasharray,'100 100');assert.equal(frames[2].strokeDasharray,'0 100');assert.equal(frames.at(-1).strokeDasharray,`${n} 100`);assert.equal(frames.at(-1).opacity,n===0?0:1);}
 assert.deepEqual(D.dialSweepFrames(''),[]);assert.deepEqual(D.dialSweepFrames('invalid'),[]);
 assert.ok(D.termDial({percent:'0'},1,'Zero').includes('class="dial-value"'));assert.ok(!D.termDial({percent:''},1,'Pending').includes('class="dial-value"'));
});
test('sweeps begin on visibility, run once, clean up, and respect reduced motion',()=>{
 const prior={matchMedia:global.matchMedia,IntersectionObserver:global.IntersectionObserver};let observer,plays=0,cancels=0,disconnects=0;
 const arc={animate(frames,options){plays++;assert.equal(options.duration,2100);return {cancel(){cancels++;}};}};
 const dial={querySelector:()=>arc,getAttribute:()=> '40'};
 const container={querySelectorAll(selector){assert.equal(selector,'.purpose-dial');return [dial];}};
 try{
  global.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
  global.IntersectionObserver=class{constructor(fn){this.fn=fn;observer=this;}observe(){}unobserve(){}disconnect(){disconnects++;}};
  const cleanup=D.animateDials(container);assert.equal(plays,0);observer.fn([{isIntersecting:false,target:dial}]);assert.equal(plays,0);observer.fn([{isIntersecting:true,target:dial}]);assert.equal(plays,1);observer.fn([{isIntersecting:true,target:dial}]);assert.equal(plays,1);cleanup();assert.equal(cancels,1);assert.equal(disconnects,1);
  global.matchMedia=()=>({matches:true});D.animateDials(container)();assert.equal(plays,1);
 }finally{Object.assign(global,prior);}
});
test('existing learning indicators and new indicators in every component share the scored gauge markup',()=>{
 const s=require('../data/learning-purpose.json'),A=require('../area-indicators.js');
 const saved=D.records([s.headers,...s.rows]),ids=saved.filter(r=>r.type==='kpi'&&!['feedback-1','feedback-2'].includes(r.id));
 const terms=ids.map(r=>({id:`learning:${r.id==='scales-self-check'?'purpose':r.experience_id||'purpose'}:${r.id}`,term_1_percent:'0',term_2_percent:'47',term_3_percent:'100'}));
 const data=D.applyTermResults(saved,terms);
 const htmls=Object.keys(require('../admin/model.js').names).map(home=>D.markup(data,'current',home));
 for(const area of Object.keys(A.areas)){
  const row={id:'indicator-new-gauge',area_id:area,title:'New indicator',description:'New learning evidence',visible:'TRUE'};
  htmls.push(D.markup(A.dashboardData([row],area,'',[{id:`area:${area}:${row.id}`,term_1_percent:'0',term_2_percent:'47',term_3_percent:'100'}]),'current',area));
 }
 for(const html of htmls){
  const scored=(html.match(/class="purpose-dial" role="progressbar"/g)||[]).length;
  assert.ok(scored>0);assert.equal((html.match(/class="dial-value"/g)||[]).length,scored);
  assert.equal((html.match(/class="dial-marker"/g)||[]).length,scored*3);
  for(const n of [0,47,100])assert.ok(html.includes(`aria-valuenow="${n}"`));
 }
});
test('pending demonstration ends empty while pending and zero keep their actual labels and values',()=>{
 const pending=Object.freeze({id:'fixture',percent:'',status:'Awaiting Evidence',note:'Existing note',evidence_1_url:'https://example.org/evidence'});
 const zero=Object.freeze({...pending,percent:'0',status:''});
 const before=JSON.stringify([pending,zero]),p=D.termDial(pending,1,'Pending'),z=D.termDial(zero,1,'Zero');
 assert.ok(p.includes('class="dial-demo"'));assert.ok(p.includes('data-dial-state="pending"'));assert.ok(p.includes('Reporting Term 1: Awaiting Evidence'));assert.ok(!p.includes('aria-valuenow'));assert.ok(!p.includes('class="dial-number"'));
 assert.ok(z.includes('aria-valuenow="0"'));assert.ok(z.includes('>0%</text>'));assert.ok(!z.includes('data-dial-state="pending"'));assert.ok(!z.includes('class="dial-demo"'));
 const frames=D.dialSweepFrames(null,true);assert.equal(frames[1].strokeDasharray,'100 100');assert.equal(frames[2].strokeDasharray,'0 100');assert.equal(frames.at(-1).strokeDasharray,'0 100');assert.equal(frames.at(-1).opacity,0);
 assert.equal(JSON.stringify([pending,zero]),before);
});
test('animation changes only the visual arc for both pending and zero',()=>{
 const prior={matchMedia:global.matchMedia,IntersectionObserver:global.IntersectionObserver};const calls=[];
 const dials=[null,'0'].map(value=>Object.freeze({getAttribute:name=>name==='aria-valuenow'?value:name==='data-dial-state'&&value===null?'pending':null,querySelector:selector=>({animate(frames,options){calls.push({value,selector,frames,options});return {cancel(){}};}})}));
 try{global.matchMedia=()=>({matches:false});global.IntersectionObserver=undefined;D.animateDials({querySelectorAll:()=>dials})();assert.equal(calls.length,2);assert.equal(calls[0].selector,'.dial-demo');assert.equal(calls[1].selector,'.dial-value');for(const c of calls){assert.equal(c.options.fill,'none');assert.equal(c.frames.at(-1).strokeDasharray,'0 100');}assert.equal(dials[0].getAttribute('aria-valuenow'),null);assert.equal(dials[1].getAttribute('aria-valuenow'),'0');}
 finally{Object.assign(global,prior);}
});
test('pending gauges animate for existing and new indicators across every component without changing input records',()=>{
 const s=require('../data/learning-purpose.json'),A=require('../area-indicators.js'),M=require('../admin/model.js');
 const source=D.records([s.headers,...s.rows]),before=JSON.stringify(source);
 const terms=source.filter(r=>r.type==='kpi'&&!['feedback-1','feedback-2'].includes(r.id)).map(r=>({id:`learning:${r.id==='scales-self-check'?'purpose':r.experience_id||'purpose'}:${r.id}`,term_1_percent:'',term_2_percent:'',term_3_percent:''}));
 const termBefore=JSON.stringify(terms),data=D.applyTermResults(source,terms),htmls=Object.keys(M.names).map(home=>D.markup(data,'current',home));
 for(const area of Object.keys(A.areas)){
  const draft={...M.newAreaIndicator(area,'indicator-pending-new',1),title:'New pending indicator',description:'Evidence has not been collected.'};
  const table=[A.headers,A.headers.map(h=>draft[h]||'')],published=A.published(table);
  const previewHtml=D.markup(A.dashboardData(A.records(table),area),'current',area),publicHtml=D.markup(A.dashboardData(published,area),'current',area);
  assert.equal(previewHtml,publicHtml);htmls.push(publicHtml);
 }
 const prior={matchMedia:global.matchMedia,IntersectionObserver:global.IntersectionObserver};let animations=0,expected=0;
 try{
  global.matchMedia=()=>({matches:false});global.IntersectionObserver=undefined;
  for(const html of htmls){
   const count=(html.match(/class="purpose-dial"/g)||[]).length;assert.ok(count>0);
   assert.equal((html.match(/class="dial-demo"/g)||[]).length,count);assert.equal((html.match(/data-dial-state="pending"/g)||[]).length,count);assert.ok(!html.includes('aria-valuenow'));
   expected+=count;const dials=Array.from({length:count},()=>Object.freeze({getAttribute:k=>k==='data-dial-state'?'pending':null,querySelector:selector=>{assert.equal(selector,'.dial-demo');return {animate(frames){animations++;assert.equal(frames[1].strokeDasharray,'100 100');assert.equal(frames.at(-1).opacity,0);return {cancel(){}};}};}}));
   D.animateDials({querySelectorAll:()=>dials})();
  }
  assert.equal(animations,expected);assert.equal(JSON.stringify(source),before);assert.equal(JSON.stringify(terms),termBefore);
 }finally{Object.assign(global,prior);}
});
test('reopening the same dashboard replays every gauge and cancels the previous session without changing values',()=>{
 const prior={matchMedia:global.matchMedia,IntersectionObserver:global.IntersectionObserver},observers=[];let plays=0,cancels=0,disconnects=0;
 const values=Object.freeze([null,'0','47']);
 const dials=values.map(value=>Object.freeze({getAttribute:k=>k==='aria-valuenow'?value:k==='data-dial-state'&&value===null?'pending':null,querySelector:()=>({animate(){plays++;return {cancel(){cancels++;}};}})}));
 const container={querySelectorAll:()=>dials};
 try{
  global.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
  global.IntersectionObserver=class{constructor(fn){this.fn=fn;observers.push(this);}observe(){}unobserve(){}disconnect(){disconnects++;}};
  D.animateDials(container);observers[0].fn(dials.map(target=>({target,isIntersecting:true})));assert.equal(plays,3);
  const stop=D.animateDials(container);assert.equal(cancels,3);assert.equal(disconnects,1);
  observers[0].fn(dials.map(target=>({target,isIntersecting:true})));assert.equal(plays,3);
  observers[1].fn(dials.map(target=>({target,isIntersecting:true})));assert.equal(plays,6);
  stop();assert.equal(cancels,6);assert.deepEqual(dials.map(d=>d.getAttribute('aria-valuenow')),[null,'0','47']);
 }finally{Object.assign(global,prior);}
});
