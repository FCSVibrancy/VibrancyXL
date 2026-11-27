const {sheets}=require('../lib/control.cjs'),W=require('../lib/learning-wording.cjs');
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 try{const [sheet,alignment]=await Promise.all(["'Sheet1'!A1:Z250","'Alignment'!A4:D100"].map(range=>sheets('/values/'+encodeURIComponent(range)+'?valueRenderOption=UNFORMATTED_VALUE')));return res.json({indicators:W.project(sheet.values||[],alignment.values||[])});}
 catch{return res.status(503).json({error:'Published indicator wording is temporarily unavailable.'});}
};
