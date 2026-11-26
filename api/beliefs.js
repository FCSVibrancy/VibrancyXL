const {sheets}=require('../lib/control.cjs');
const beliefs=require('../lib/beliefs.cjs');
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 try{const data=await sheets('/values/'+encodeURIComponent("'SiteContent'!A1:F200")+'?valueRenderOption=UNFORMATTED_VALUE');return res.json({beliefs:beliefs.publicRecords(data.values||[])});}
 catch{return res.status(503).json({error:'Published belief statements are temporarily unavailable.'});}
};
