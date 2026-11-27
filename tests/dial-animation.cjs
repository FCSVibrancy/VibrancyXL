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
 const container={querySelectorAll(selector){assert.equal(selector,'.purpose-dial[aria-valuenow]');return [dial];}};
 try{
  global.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
  global.IntersectionObserver=class{constructor(fn){this.fn=fn;observer=this;}observe(){}unobserve(){}disconnect(){disconnects++;}};
  const cleanup=D.animateDials(container);assert.equal(plays,0);observer.fn([{isIntersecting:false,target:dial}]);assert.equal(plays,0);observer.fn([{isIntersecting:true,target:dial}]);assert.equal(plays,1);observer.fn([{isIntersecting:true,target:dial}]);assert.equal(plays,1);cleanup();assert.equal(cancels,1);assert.equal(disconnects,1);
  global.matchMedia=()=>({matches:true});D.animateDials(container)();assert.equal(plays,1);
 }finally{Object.assign(global,prior);}
});
