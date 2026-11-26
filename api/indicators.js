const {sheets,tabs}=require('../lib/control.cjs');
const {published}=require('../area-indicators.js');
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 try{const data=await sheets('/values/'+encodeURIComponent("'AreaIndicators'!"+tabs.AreaIndicators)+'?valueRenderOption=UNFORMATTED_VALUE');return res.json({indicators:published(data.values||[])});}
 catch{return res.status(503).json({error:'Indicators are temporarily unavailable.'});}
};
