(function(root){
 const names={purpose:'Learning with Purpose',thinking:'Big Thinking, Real Problems',voice:'My Voice, My Choices',work:'Show What You Can Do',feedback:'Feedback That Moves Me Forward',support:'Support to Take the Next Step',thriving:'Thriving Learner'};
 const areas={learning:'Vibrant Learning',ecosystem:'Vibrant Ecosystem',logistics:'Vibrant Logistics of Learning',accountability:'Vibrant Accountability','culture-community':'Vibrant Culture and Community',journey:'The Journey to Local Accountability'};
 function newAreaIndicator(area,id,order){if(!Object.hasOwn(areas,area))throw Error('Choose an area.');return {id,area_id:area,title:'',description:'',percent:'',status:'',evidence_url:'',visible:'TRUE',sort_order:String(order),icon:'target',reporting_window:'current'};}
 const code=v=>String(v||'').match(/\b[A-G]\d+\b/)?.[0];
 const records=table=>(table||[]).slice(1).map((r,i)=>Object.fromEntries([...(table[0]||[]).map((h,c)=>[h,String(r[c]??'')]),['_row',i+1]]));
 const experience=name=>Object.keys(names).find(id=>names[id]===name)||'purpose';
 function alignmentRow(table,kpi){return (table||[]).findIndex((r,i)=>i>0&&experience(r[0])===kpi.experience_id&&code(r[3])===code(kpi.walkthrough_alignment)&&code(r[3]));}
 function numeric(v){const s=String(v??'').trim();const n=Number(s.replace(/%$/,''));return s&&Number.isFinite(n)&&n>=0&&n<=100?n:null;}
 function tileList(table,tab,page){const rows=records(table);if(tab==='Homepage')return rows.filter(r=>r.type==='tile').map((r,i)=>({key:r.id,row:r._row,title:r.title,visible:! /^(false|no|0)$/i.test(r.visible),order:Number(r.sort_order)||999,index:i})).sort((a,b)=>a.order-b.order||a.index-b.index);
 if(tab!=='SiteContent')return [];const local=rows.filter(r=>r.page===page),list=[];
 if(page==='learning')for(const [id,title] of Object.entries(names)){const r=local.find(r=>r.selector===`.card-${id} h2`);list.push({key:id,row:r?._row,title:r?.value||title});}
 for(const r of local.filter(r=>r.selector.startsWith('@tile:')))list.push({key:r.selector.slice(6),row:r._row,title:r.value});
 return list.map((r,i)=>{const visibility=local.find(x=>x.selector==='@visibility:'+r.key),order=local.find(x=>x.selector==='@order:'+r.key),tile=local.find(x=>x._row===r.row);return {...r,visible:! /^(false|no|0)$/i.test(visibility?.visible||tile?.visible||''),order:order&&order.value.trim()&&Number.isFinite(Number(order.value))?Number(order.value):i+1,index:i};}).sort((a,b)=>a.order-b.order||a.index-b.index);
 }
 const api={tileList,names,areas,newAreaIndicator,code,records,experience,alignmentRow,numeric};root.VibrancyEditorModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
