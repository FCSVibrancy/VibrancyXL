'use strict';
(function(root){
 const areas=new Set(['learning','ecosystem','logistics','accountability','culture-community','journey']);
 const learning=new Set(['purpose','thinking','voice','work','feedback','support','thriving']);
 const visible=row=>!['false','no','0'].includes(String(row.visible??'').trim().toLowerCase());
 function populatedAreas(table){
  const [headers,...rows]=table;
  if(!['type','id','title','description','experience_id'].every(key=>headers?.includes(key)))return new Set();
  const records=rows.map(row=>Object.fromEntries(headers.map((key,i)=>[key,String(row[i]??'').trim()])));
  const pages=new Map(records.filter(row=>row.type==='page'&&visible(row)).map(row=>[row.id,row]));
  const ready=new Set();
  for(const row of records){
   if(row.type!=='kpi'||!row.id||!row.title||!row.description||!visible(row))continue;
   const experience=row.experience_id||'purpose',page=pages.get(experience);
   // Existing Learning records predate area_id. Unknown experiences never inherit Learning.
   const area=row.area_id||page?.area_id||(learning.has(experience)?'learning':'');
   if(areas.has(area)&&page&&page.title&&page.description)ready.add(area);
  }
  return ready;
 }
 root.VibrancyAvailability={populatedAreas};
 if(typeof module==='object'&&module.exports)module.exports=root.VibrancyAvailability;
})(typeof window==='object'?window:globalThis);
