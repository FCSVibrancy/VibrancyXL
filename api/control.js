const {tabs,revision,validate,authorize,sheets}=require('../lib/control.cjs');
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 try{
 if(!['GET','POST'].includes(req.method))return res.status(405).json({error:'Method not allowed'});
 if(!process.env.GOOGLE_CLIENT_ID)return res.status(503).json({error:'Google sign-in has not been configured on this deployment.'});
 if(req.method==='GET'&&req.query.config==='1')return res.json({clientId:process.env.GOOGLE_CLIENT_ID});
 await authorize(req);
 const tab=req.method==='GET'?req.query.tab:req.body?.tab;
 if(!Object.hasOwn(tabs,tab))return res.status(400).json({error:'Unknown content area'});
 const range=`'${tab}'!${tabs[tab]}`;const current=await sheets('/values/'+encodeURIComponent(range)+'?valueRenderOption=FORMULA');const values=current.values||[];
 if(req.method==='GET')return res.json({values,revision:revision(values)});
 if(req.body.revision!==revision(values))return res.status(409).json({error:'The sheet changed. Reload this area before publishing.'});
 validate(req.body.changes,values);
 const offset=tab==='Alignment'?4:1;
 const data=req.body.changes.map(c=>({range:`'${tab}'!${String.fromCharCode(65+c.col)}${c.row+offset}`,values:[[c.value]]}));
 await sheets('/values:batchUpdate',{method:'POST',data:{valueInputOption:'RAW',data}});
 const saved=await sheets('/values/'+encodeURIComponent(range)+'?valueRenderOption=FORMULA');
 return res.json({values:saved.values||[],revision:revision(saved.values||[])});
 }catch(e){res.status(e.status||400).json({error:e.status?e.message:'Unable to read or publish. Check sign-in, sheet access, and server configuration.'});}
};
