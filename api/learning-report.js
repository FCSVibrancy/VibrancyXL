const {sheets}=require('../lib/control.cjs'),W=require('../lib/learning-wording.cjs'),T=require('../lib/term-results.cjs'),A=require('../area-indicators.js');
require('../experiences.js');const R=require('../learning-report.js'),PDF=require('../lib/learning-report-pdf.cjs'),snapshot=require('../data/learning-purpose.json');
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 try{
  const tables=await Promise.all(["'Sheet1'!A:Z","'Alignment'!A4:D","'SiteContent'!A:F","'AreaIndicators'!A:Z"].map(range=>sheets('/values/'+encodeURIComponent(range)+'?valueRenderOption=UNFORMATTED_VALUE')));
  const sections=R.assemble(snapshot,W.project(tables[0].values||[],tables[1].values||[]),T.savedRecords(tables[2].values||[]),A.published(tables[3].values||[]));
  const date=new Date(),buffer=await PDF.generate(sections,{date});const stamp=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
  res.setHeader('Content-Type','application/pdf');res.setHeader('Content-Disposition',`attachment; filename="Vibrant-Learning-Report-${stamp}.pdf"`);res.setHeader('Content-Length',buffer.length);return res.end(buffer);
 }catch{res.status(503);res.setHeader('Content-Type','text/html; charset=utf-8');return res.end('<!doctype html><html lang="en"><meta charset="utf-8"><title>Learning report unavailable</title><main style="font:18px/1.6 Arial;max-width:650px;margin:60px auto;padding:24px"><h1>The PDF could not be prepared.</h1><p>Please try again, or open the accessible report to review all indicators.</p><p><a href="/vibrant-learning-report.pdf">Try the PDF again</a> · <a href="/learning-report.html">Open the accessible report</a> · <a href="/learning.html">Vibrant Learning</a></p></main></html>');}
};
