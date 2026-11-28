require('../purpose-dashboard.js');require('../area-indicators.js');require('../experiences.js');
const R=require('../learning-report.js');
const INK='#1c292b',MUTED='#51605e',GOLD='#ad9440',RULE='#dce1db';
const COLORS={purpose:'#f8f4e4',thinking:'#e9eef2',voice:'#eaf2ec',work:'#efedf5',feedback:'#f5ece6',support:'#edf0e5',thriving:'#f4eaf0'};
const clean=s=>String(s??'').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/[\u2010-\u2015]/g,'-').replace(/[\u2018\u2019]/g,"'");
async function generate(sections,{date=new Date(),resultsAvailable=true,contentScales=null}={}){
 const {PDFDocument}=await import('pdfkit');
 const doc=new PDFDocument({size:'LETTER',margin:0,bufferPages:true,autoFirstPage:false,info:{Title:'Vibrant Learning Report',Author:'Fleming County Schools',Subject:'Community overview of published learning indicators, reporting-term results, and accountability maturity'}});
 const chunks=[],done=new Promise((resolve,reject)=>{doc.on('data',c=>chunks.push(c));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);});
 const day=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'America/New_York'}).format(date),count=sections.reduce((n,s)=>n+s.indicators.length,0);
 const left=32,right=318,width=262;
 const text=(value,x,y,w,size=9,bold=false,color=INK,opts={})=>{doc.font(bold?'Helvetica-Bold':'Helvetica').fontSize(size).fillColor(color);const options={width:w,lineGap:1.2,height:10000,...opts};const h=doc.heightOfString(clean(value),options);doc.text(clean(value),x,y,options);return y+h;};
 const line=(x,y,w,color=RULE,weight=.6)=>doc.save().strokeColor(color).lineWidth(weight).moveTo(x,y).lineTo(x+w,y).stroke().restore();
 const header=(page,title)=>{doc.addPage();doc.save().rect(left,21,48,48).clip();const scale=48/2355;doc.image(require('path').join(__dirname,'../assets/fcs-district-report-logo.png'),left-1770*scale,21-510*scale,{width:6000*scale});doc.restore();text('VIBRANCY',92,26,280,20,true);text('FLEMING COUNTY SCHOOLS',92,51,280,9);text(`Published dashboard snapshot\n${day}\n7 experiences | ${count} indicators`,390,28,190,8,false,MUTED,{align:'right'});line(left,71,548,GOLD,2);
  if(page===1){text('Vibrant Learning Report',left,84,548,25,true);text('What students experience, what they can demonstrate, and where evidence is still being gathered.',left,116,548,9.5);doc.save().fillColor('#faf8f0').rect(left,140,548,34).fill().restore();doc.save().strokeColor(GOLD).lineWidth(3).moveTo(left,140).lineTo(left,174).stroke().restore();text('Reading the results: Each bar shows the latest reported term; all three term values appear below. Results are dashboard findings, not student grades. Awaiting Evidence means no reported result; 0% is a reported result.',left+9,147,528,8.4);return 180;}
  text(title,left,84,548,17,true);return 115;
 };
 const indicator=(r,home,x,y)=>{y=text(r.title,x,y,width,10,true,INK,{link:`https://vibrancyxl.vercel.app/learning.html?experience=${home}`})+2;y=text(r.summary,x,y,width,9.5)+3;
  const latest=R.latestResult(r,resultsAvailable);
  doc.save().fillColor('#e1e5e3').rect(x,y,width,4).fill();if(latest.percent!==null&&latest.percent>0)doc.fillColor(GOLD).rect(x,y,width*latest.percent/100,4).fill();doc.restore();
  for(const ratio of [0,.5,1])line(x+width*ratio,y,0,'#697571',4);
  text('0%',x,y+6,50,6.3,false,MUTED);text('50%',x+width/2-15,y+6,30,6.3,false,MUTED,{align:'center'});text('100% expectation',x+width-92,y+6,92,6.3,false,MUTED,{align:'right'});
  const cell=width/3;for(let i=0;i<3;i++)text('T'+(i+1)+': '+R.result(r.terms[i],resultsAvailable),x+i*cell,y+15,cell,7.3,latest.term===i+1,INK);
  y+=27;
  const maturity=R.maturity(r),palette={ '-1':['#f4f2e9','#30382d'],'0':['#242424','#ffffff'],'1':['#646464','#ffffff'],'2':['#929292','#10120f'],'3':['#bca745','#10120f'],'4':['#edda7e','#10120f'] },colors=palette[maturity.stage]||palette[-1];
  const label='Accountability Maturity:';doc.font('Helvetica-Bold').fontSize(7.3);const badgeX=x+doc.widthOfString(label)+6,badgeWidth=doc.widthOfString(clean(R.maturityLabel(r)))+11;
  text(label,x,y,width,7.3,true,MUTED);doc.save().fillColor(colors[0]).roundedRect(badgeX,y-1,badgeWidth,12,3).fill();if(maturity.stage<0)doc.strokeColor('#b9b7a6').lineWidth(.5).roundedRect(badgeX,y-1,badgeWidth,12,3).stroke();doc.restore();text(R.maturityLabel(r),badgeX+5,y,badgeWidth-10,7.3,true,colors[1]);
  y+=14;line(x,y,width);return y+4;
 };
 const section=(id,x,y)=>{const s=sections.find(s=>s.id===id);if(!s)return y;doc.save().fillColor(COLORS[id]||COLORS.purpose).rect(x,y-3,width,21).fill().restore();y=text(s.title,x+5,y,width-10,12,true);line(x,y+3,width,GOLD,.8);y=text(s.question,x,y+8,width,8.5,false,MUTED)+5;
  if(id==='purpose')y=text('Two 100% commitments: explain the learning and its purpose; analyze examples with scales.',x,y,width,8,true,'#67571e')+5;
  if(id==='feedback')y=text('One 100% commitment: check work in progress with scales.',x,y,width,8,true,'#67571e')+5;
  for(const r of s.indicators)y=indicator(r,id,x,y);return y+4;
 };
 const footer=(page,total)=>{line(left,741,548,'#aab5aa');text('Full dashboards, term notes, and evidence: vibrancyxl.vercel.app/learning.html',left,748,490,7,false,MUTED,{link:'https://vibrancyxl.vercel.app/learning.html'});text(`${page} of ${total}`,540,748,40,7,false,MUTED,{align:'right'});doc.font('Helvetica-Bold').fontSize(7);const brandWidth=doc.widthOfString('Vibrancy');doc.font('Helvetica');const rest=' | Fleming County Schools | A Member of the Learner Success Network',restWidth=doc.widthOfString(rest),start=(612-brandWidth-restWidth)/2;text('Vibrancy',start,761,brandWidth+1,7,true,MUTED);text(rest,start+brandWidth,761,restWidth+1,7,false,MUTED);text('One Vision. One System. Every Learner Thriving!',left,773,548,7,true,MUTED,{align:'center'});};
 const beginContent=(page,top)=>{const scale=contentScales?.[page-1]||1;doc.save().translate(306,top).scale(scale).translate(-306,-top);};
 const limits=[],reportPages=R.pages(sections);
 const maturityKey=(x,y)=>{
  y=text('Understanding Accountability Maturity',x,y+8,width,11,true)+7;
  y=text('Maturity describes consistent practice and the intended learner experience within the settings reviewed. It is separate from term percentages.',x,y,width,8.5,false,MUTED)+8;
  for(const [i,label] of ['Not Started','Establishing','Developing','Implementing - expectation','Sustaining and Advancing'].entries())y=text(`${i+1}. ${label}`,x+4,y,width-4,8.5,i===3,i===3?'#67571e':INK)+4;
  return text('Not Yet Rated is outside these five stages: evidence is insufficient or a completed review has not been published. It does not mean Not Started.',x,y+4,width,8.5,false,MUTED)+8;
 };
 for(const [index,page] of reportPages.entries()){
  const top=header(index+1,page.title);beginContent(index+1,top);let a=top,b=top;
  for(const s of page.columns[0])a=section(s.id,left,a);
  for(const s of page.columns[1])b=section(s.id,right,b);
  if(index===1)b=maturityKey(right,b);
  if(index===0){
   a=text('Three different kinds of findings',left,a+8,width,11,true)+7;
   for(const paragraph of ['Priority Standards identify essential learning. Proficiency Scales describe successful learning. BRIDGE connects learning to authentic problems and demonstrations.','Accountability Maturity describes implementation and the intended learner experience verified in the settings reviewed.','Learner experience: what students experience in the first six areas.','Learner outcomes: growth, mastery, readiness, agency, and well-being under Thriving Learner.'])a=text(paragraph,left,a,width,8.5,false,MUTED)+7;
  }
  if(index===2){
   b=text('One student work sample can support several findings when each review identifies the distinct evidence and criteria used. Participation, quality of work, and growth are different claims.',right,b+8,width,8.5,false,MUTED)+12;
   b=text('Explore the full dashboards for FCS Belief Statements, reporting-term notes, and Evidence of Practice links. This report summarizes the published indicators; it does not replace the evidence review.',right,b,width,8.5,false,MUTED);
  }
  limits.push(Math.max(a,b));doc.restore();
 }
 if(!contentScales&&limits.some(y=>y>731)){doc.destroy();return generate(sections,{date,resultsAvailable,contentScales:limits.map((bottom,i)=>Math.min(1,(731-(i===0?180:115))/(bottom-(i===0?180:115))))});}
 const range=doc.bufferedPageRange();for(let i=0;i<range.count;i++){doc.switchToPage(i);footer(i+1,range.count);}doc.end();return done;
}
module.exports={generate};
