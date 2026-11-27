const {tabs,revision,validate,validateAdditions,validateAreaTable,authorize,sheets}=require('../lib/control.cjs');
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 try{
 if(!['GET','POST'].includes(req.method))return res.status(405).json({error:'Method not allowed'});
 if(!process.env.GOOGLE_CLIENT_ID)return res.status(503).json({error:'Google sign-in has not been configured on this deployment.'});
 if(req.method==='GET'&&req.query.config==='1')return res.json({clientId:process.env.GOOGLE_CLIENT_ID});
 await authorize(req);
 const tab=req.method==='GET'?req.query.tab:req.body?.tab;
 if(!Object.hasOwn(tabs,tab))return res.status(400).json({error:'Unknown content area'});
 const range=`'${['Loading','Beliefs','TermResults'].includes(tab)?'SiteContent':tab}'!${tabs[tab]}`;const current=await sheets('/values/'+encodeURIComponent(range)+'?valueRenderOption=FORMULA');const values=current.values||[];
 let termSources;
 if(tab==='TermResults')termSources=await Promise.all(['Sheet1','AreaIndicators'].map(async name=>(await sheets('/values/'+encodeURIComponent(`'${name}'!${tabs[name]}`)+'?valueRenderOption=FORMULA')).values||[]));
 const versionValues=tab==='TermResults'?[values,...termSources]:values;
 if(tab==='TermResults'){
  const T=require('../lib/term-results.cjs');const table=T.project(values,...termSources);
  if(req.method==='GET')return res.json({values:table,revision:revision(versionValues)});
  if(req.body.revision!==revision(versionValues))return res.status(409).json({error:'The indicators or term results changed. Reload before publishing.'});
  T.validate(req.body.changes,table,req.body.additions||[]);const data=T.writes(values,table,req.body.changes);
  await sheets('/values:batchUpdate',{method:'POST',data:{valueInputOption:'RAW',data}});
  const saved=(await sheets('/values/'+encodeURIComponent(range)+'?valueRenderOption=FORMULA')).values||[];
  return res.json({values:T.project(saved,...termSources),revision:revision([saved,...termSources])});
 }
 if(tab==='Loading'){const L=require('../lib/loading.cjs');if(req.method==='GET')return res.json({values:L.project(values),revision:revision(values)});if(req.body.revision!==revision(values))return res.status(409).json({error:'Content changed. Reload before publishing.'});L.validate(req.body.changes,req.body.additions||[]);await sheets('/values:batchUpdate',{method:'POST',data:{valueInputOption:'RAW',data:L.writes(values,req.body.changes)}});const saved=(await sheets('/values/'+encodeURIComponent(range)+'?valueRenderOption=FORMULA')).values||[];return res.json({values:L.project(saved),revision:revision(saved)});}
 if(req.method==='GET')return res.json({values:tab==='Beliefs'?require('../lib/beliefs.cjs').project(values):values,revision:revision(values)});
 if(req.body.revision!==revision(values))return res.status(409).json({error:'The sheet changed. Reload this area before publishing.'});
 const additions=req.body.additions||[];
 if(tab==='Beliefs'){
  const beliefs=require('../lib/beliefs.cjs');beliefs.validate(req.body.changes,beliefs.project(values),additions);
  const data=beliefs.writes(values,req.body.changes);
  await sheets('/values:batchUpdate',{method:'POST',data:{valueInputOption:'RAW',data}});
  const saved=await sheets('/values/'+encodeURIComponent(range)+'?valueRenderOption=FORMULA');
  return res.json({values:beliefs.project(saved.values||[]),revision:revision(saved.values||[])});
 }

 validateAdditions(additions,tab,values);
 if(req.body.changes?.length)validate(req.body.changes,values);
 else if(!additions.length)throw Error('No changes.');
 if(tab==='AreaIndicators'){const next=values.map(row=>[...row]);for(const c of req.body.changes||[])next[c.row][c.col]=c.value;validateAreaTable([...next,...additions]);}
 const offset=tab==='Alignment'?4:1;
 const data=(req.body.changes||[]).map(c=>({range:`'${tab}'!${String.fromCharCode(65+c.col)}${c.row+offset}`,values:[[c.value]]}));
 additions.forEach((row,i)=>data.push({range:`'${tab}'!A${values.length+i+offset}`,values:[row]}));
 await sheets('/values:batchUpdate',{method:'POST',data:{valueInputOption:'RAW',data}});
 const saved=await sheets('/values/'+encodeURIComponent(range)+'?valueRenderOption=FORMULA');
 return res.json({values:saved.values||[],revision:revision(saved.values||[])});
 }catch(e){res.status(e.status||400).json({error:e.status?e.message:'Unable to read or publish. Check sign-in, sheet access, and server configuration.'});}
};
