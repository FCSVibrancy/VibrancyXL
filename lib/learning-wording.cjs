const D=require('../purpose-dashboard.js'),snapshot=require('../data/learning-purpose.json');
function project(sheet,alignment){
 let data=D.mergeDefinitions(D.records(sheet),D.records([snapshot.headers,...snapshot.rows]));
 if(alignment.slice(1).some(row=>row[1]?.trim()))data=D.applyAlignment(data,alignment);
 return data.filter(r=>['kpi','overview'].includes(r.type)).map(r=>Object.fromEntries(['type','id','experience_id','reporting_window','title','description','why_it_matters','icon'].map(k=>[k,r[k]||''])));
}
module.exports={project};
