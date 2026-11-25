const {test}=require('node:test');
const assert=require('node:assert/strict');
const {populatedAreas}=require('../area-availability.js');
const headers=['type','id','title','description','experience_id','area_id','visible'];
const page=['page','ecosystem-health','Ecosystem health','Connected systems','','ecosystem','TRUE'];
const kpi=['kpi','partnerships','Community partnerships','Students work with community partners','ecosystem-health','ecosystem','TRUE'];
const ready=(...rows)=>[...populatedAreas([headers,...rows])];
test('content tiles, headings, and links cannot activate an area',()=>{
 assert.deepEqual(ready(['tile','ecosystem','Title','Description','','ecosystem','TRUE'],page),[]);
 assert.deepEqual([...populatedAreas([['page','selector','value','description','url','visible'],['ecosystem','@tile:custom-1','Title','Description','ecosystem.html','TRUE']])],[]);
});
test('one populated indicator activates only its own area',()=>assert.deepEqual(ready(page,kpi),['ecosystem']));
test('blank, hidden, and orphan indicators do not activate an area',()=>{
 for(const col of [1,2,3]){const blank=[...kpi];blank[col]=' ';assert.deepEqual(ready(page,blank),[]);}
 assert.deepEqual(ready(page,[...kpi.slice(0,6),'FALSE']),[]);
 assert.deepEqual(ready(kpi),[]);
 assert.deepEqual(ready([...page.slice(0,6),'FALSE'],kpi),[]);
});
test('area can come from the parent dashboard; unknown experiences stay unavailable',()=>{
 const inherited=[...kpi];inherited[5]='';assert.deepEqual(ready(page,inherited),['ecosystem']);
 const unknown=[...inherited];unknown[4]='unknown';assert.deepEqual(ready(page,unknown),[]);
});
test('existing Learning indicators activate only Learning',()=>{
 const snapshot=require('../data/learning-purpose.json');assert.deepEqual([...populatedAreas([snapshot.headers,...snapshot.rows])],['learning']);
});
