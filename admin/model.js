(function(root){
 const names={purpose:'Learning with Purpose',thinking:'Big Thinking, Real Problems',voice:'My Voice, My Choices',work:'Show What You Can Do',feedback:'Feedback That Moves Me Forward',support:'Support to Take the Next Step',thriving:'Thriving Learner'};
 const code=v=>String(v||'').match(/\b[A-G]\d+\b/)?.[0];
 const records=table=>(table||[]).slice(1).map((r,i)=>Object.fromEntries([...(table[0]||[]).map((h,c)=>[h,String(r[c]??'')]),['_row',i+1]]));
 const experience=name=>Object.keys(names).find(id=>names[id]===name)||'purpose';
 function alignmentRow(table,kpi){return (table||[]).findIndex((r,i)=>i>0&&experience(r[0])===kpi.experience_id&&code(r[3])===code(kpi.walkthrough_alignment)&&code(r[3]));}
 function numeric(v){const s=String(v??'').trim();const n=Number(s.replace(/%$/,''));return s&&Number.isFinite(n)&&n>=0&&n<=100?n:null;}
 const api={names,code,records,experience,alignmentRow,numeric};root.VibrancyEditorModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
