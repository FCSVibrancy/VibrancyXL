const {test}=require('node:test'),assert=require('node:assert/strict');
require('../evidence-viewer.js');const T=require('../lib/term-results.cjs'),A=require('../area-indicators.js');
const snapshot=require('../data/learning-purpose.json');
test('editing or clearing every term metadata field stays isolated for existing and new indicators',()=>{
 const sheet=[snapshot.headers,...snapshot.rows];sheet.push(snapshot.headers.map(h=>({type:'kpi',id:'indicator-new-learning',experience_id:'thinking',title:'New learning indicator',reporting_window:'current'}[h]||'')));
 const area=[A.headers,...['indicator-existing','indicator-new'].map(id=>A.headers.map(h=>({id,area_id:'ecosystem',title:id,description:'Fixture indicator',reporting_window:'current',visible:'TRUE'}[h]||'')))];
 const site=[['page','selector','value','description','url','visible']];
 const keys=['learning:purpose:standards','learning:thinking:indicator-new-learning','area:ecosystem:indicator-existing','area:ecosystem:indicator-new'];
 const apply=changes=>{const table=T.project(site,sheet,area);T.validate(changes,table);for(const update of T.writes(site,table,changes)){const [,col,row]=update.range.match(/!([A-Z])(\d+)$/);const i=Number(row)-1;site[i]??=[];update.values[0].forEach((v,j)=>site[i][col.charCodeAt(0)-65+j]=v);}};
 for(const key of keys){const table=T.project(site,sheet,area),row=table.findIndex(r=>r[0]===key);const changes=T.resultFields.map(field=>({row,col:T.headers.indexOf(field),value:field.endsWith('_percent')?'50':field.endsWith('_url')?'https://example.org/'+key+'/'+field:key+' '+field}));apply(changes);}
 for(const key of keys)for(const field of T.detailFields){
  const before=T.project(site,sheet,area),row=before.findIndex(r=>r[0]===key),col=T.headers.indexOf(field);
  for(const value of [field.endsWith('_url')?'https://example.org/edited/'+field:'Edited '+field,'']){
   const baseline=T.project(site,sheet,area);apply([{row,col,value}]);const next=T.project(site,sheet,area);
   assert.equal(next[row][col],value,key+' '+field);
   for(let r=1;r<baseline.length;r++)for(let c=0;c<T.headers.length;c++)if(r!==row||c!==col)assert.equal(next[r][c],baseline[r][c],`Cross-field change: ${key} ${field} changed ${r}:${c}`);
  }
 }
});
