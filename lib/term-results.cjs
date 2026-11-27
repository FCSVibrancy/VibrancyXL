'use strict';
const D=require('../purpose-dashboard.js'),A=require('../area-indicators.js');
const snapshot=require('../data/learning-purpose.json');
const defaults=snapshot.rows.map(row=>Object.fromEntries(snapshot.headers.map((h,i)=>[h,String(row[i]??'')])));
const detailFields=[1,2,3].flatMap(t=>[`term_${t}_notes`,...Array.from({length:6},(_,i)=>[`term_${t}_evidence_${i+1}_label`,`term_${t}_evidence_${i+1}_url`]).flat()]);
const headers=['id','context_id','title','term_1_percent','term_2_percent','term_3_percent',...detailFields];
const resultFields=headers.slice(3);
const records=values=>(values||[]).slice(1).map(row=>Object.fromEntries(values[0].map((h,i)=>[h,String(row[i]??'')])));
function fail(message){const e=Error(message);e.status=400;throw e;}
function key(scope,context,id){return `${scope}:${context}:${id}`;}
function parseKey(id){const match=String(id).match(/^(learning|area):([a-z0-9-]+):([a-z0-9-]+)$/);return match?{scope:match[1],context:match[2],indicator_id:match[3]}:null;}
function percent(raw){if(String(raw??'').trim()==='')return '';const n=D.percentage(raw);if(n===null)fail('Enter a percentage from 0 to 100, or leave blank for Awaiting Evidence.');return String(n);}
function clean(field,value){
 if(typeof value!=='string')fail('Enter text for term evidence and notes.');
 if(/_percent$/.test(field))return percent(value);
 if(/_url$/.test(field)){if(!value.trim())return '';try{const url=new URL(value.trim());if(url.protocol!=='https:'||url.username||url.password||value.length>2048)throw Error();return url.href;}catch{fail('Use an HTTPS Evidence of Practice URL without embedded credentials.');}}
 const limit=/_notes$/.test(field)?5000:200;if(value.length>limit)fail(`Keep term notes under 5,000 characters and evidence labels under 200 characters.`);
 return value;
}
function savedRecords(site){const rows=records(site);return rows.filter(r=>r.page==='learning'&&r.selector.startsWith('@terms:')).flatMap(r=>{const id=r.selector.slice(7),identity=parseKey(id);if(!identity)return [];try{const parsed=JSON.parse(r.value);const values=Object.fromEntries(resultFields.filter(h=>/_percent$/.test(h)||Object.hasOwn(parsed,h)).map(h=>[h,clean(h,String(parsed[h]??''))]));return [{id,...identity,...values}];}catch{return [];}});}
function catalog(sheet,area){
 const sheetRows=records(sheet);
 const learning=D.mergeDefinitions(sheetRows,defaults).filter(r=>r.type==='kpi'&&!['feedback-1','feedback-2'].includes(r.id));
 const all=[...learning.map(r=>({...r,scope:'learning',context:r.id==='scales-self-check'?'purpose':r.experience_id||'purpose'})),...records(area).filter(r=>r.id&&r.title&&Object.hasOwn(A.areas,r.area_id)).map(r=>({...r,scope:'area',context:r.area_id}))];
 return [...new Set(all.map(r=>key(r.scope,r.context,r.id)))].map(id=>{const identity=parseKey(id);const rows=all.filter(r=>key(r.scope,r.context,r.id)===id);const base=rows.find(r=>!r.reporting_window||r.reporting_window==='current')||rows[0];return {id,context_id:identity.scope==='area'?'area-'+identity.context:D.reportingHome(identity.indicator_id,identity.context),title:base.title,...Object.fromEntries([1,2,3].map(t=>{const row=rows.find(r=>D.reportingTerm(r,sheetRows)===t);return [`term_${t}_percent`,row&&!/^(awaiting|pending)/i.test(row.status||'')?percent(row.percent):''];})),...Object.fromEntries(detailFields.map(field=>{const [,term,suffix]=field.match(/^term_([123])_(.+)$/);const row=rows.find(r=>D.reportingTerm(r,sheetRows)===Number(term));const value=suffix==='notes'?row?.note:row?.[suffix]||(suffix==='evidence_1_url'?row?.evidence_url||row?.external_evidence_url:'');return [field,value||''];}))};});
}
function project(site,sheet,area){const saved=savedRecords(site);return [headers,...catalog(sheet,area).map(r=>{const live=saved.find(s=>s.id===r.id);return headers.map(h=>live&&Object.hasOwn(live,h)?live[h]:r[h]||'');})];}
function validate(changes,table,additions=[]){if(additions.length||!Array.isArray(changes)||!changes.length||changes.length>150)fail('Choose reporting-term results to publish.');const seen=new Set();for(const c of changes){if(!Number.isInteger(c.row)||c.row<1||c.row>=table.length||!Number.isInteger(c.col)||c.col<3||c.col>=headers.length||typeof c.value!=='string'||seen.has(c.row+':'+c.col))fail('Only existing indicator term results, evidence, and notes can be changed.');seen.add(c.row+':'+c.col);clean(headers[c.col],c.value);}}
function writes(site,table,changes){const next=table.map(r=>[...r]);for(const c of changes)next[c.row][c.col]=clean(headers[c.col],c.value);let append=site.length;const h=site[0]||[];if(!['page','selector','value'].every(k=>h.includes(k)))fail('Invalid page content headers.');return [...new Set(changes.map(c=>c.row))].map(index=>{const row=next[index],selector='@terms:'+row[0];const existing=site.findIndex((r,i)=>i>0&&r[h.indexOf('page')]==='learning'&&r[h.indexOf('selector')]===selector);const value=JSON.stringify(Object.fromEntries(resultFields.map(h=>[h,row[headers.indexOf(h)]??''])));if(value.length>45000)fail('Reduce the evidence or notes for this indicator to fit the publishing limit.');if(existing>=0){if(String(site[existing][h.indexOf('value')]||'').startsWith('='))fail('Formulas are protected.');return {range:`'SiteContent'!C${existing+1}`,values:[[value]]};}if(append>=200)fail('Page content is full.');return {range:`'SiteContent'!A${++append}`,values:[h.map(k=>({page:'learning',selector,value,description:row[2],url:'',visible:'TRUE'}[k]||''))]};});}
module.exports={headers,resultFields,detailFields,clean,records,parseKey,percent,savedRecords,catalog,project,validate,writes};
