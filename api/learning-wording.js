const {sheets}=require('../lib/control.cjs');
const D=require('../purpose-dashboard.js');
const snapshot=require('../data/learning-purpose.json');
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 try{
  const [sheet,alignment]=await Promise.all(["'Sheet1'!A1:Z250","'Alignment'!A4:D100"].map(range=>sheets('/values/'+encodeURIComponent(range)+'?valueRenderOption=UNFORMATTED_VALUE')));
  let data=D.mergeDefinitions(D.records(sheet.values||[]),D.records([snapshot.headers,...snapshot.rows]));
  const table=alignment.values||[];
  if(table.slice(1).some(row=>row[1]?.trim()))data=D.applyAlignment(data,table);
  return res.json({indicators:data.filter(r=>['kpi','overview'].includes(r.type)).map(r=>Object.fromEntries(['type','id','experience_id','reporting_window','title','description'].map(k=>[k,r[k]||''])))});
 }catch{return res.status(503).json({error:'Published indicator wording is temporarily unavailable.'});}
};
