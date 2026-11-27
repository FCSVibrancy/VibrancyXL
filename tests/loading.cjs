const {test}=require('node:test'),assert=require('node:assert/strict'),L=require('../lib/loading.cjs'),UI=require('../shared/loading.js');
const site=[['page','selector','value','description','url','visible'],['learning','@terms:learning:purpose:standards','{"term_1_percent":"0"}']];
test('loading quote is editable without changing indicator evidence or term history',()=>{const before=JSON.stringify(site),changes=[{row:1,col:2,value:'A new published horizon.'}];L.validate(changes);const writes=L.writes(site,changes);assert.equal(writes[0].values[0][0],'shared');assert.equal(writes[0].values[0][1],'@loading:quote');const saved=[...site,writes[0].values[0]];assert.equal(L.project(saved)[1][2],changes[0].value);assert.equal(JSON.stringify(site),before);assert.equal(L.writes(saved,[{row:1,col:2,value:'Next quote'}])[0].range,"'SiteContent'!C3");});
test('loader uses a shared default, escapes quote text, and protects its settings',()=>{assert.equal(L.project(site)[1][2],UI.defaultQuote);assert.ok(UI.markup('<script>bad</script>').includes('&lt;script&gt;'));assert.equal((UI.markup().match(/data-loading-step=/g)||[]).length,5);assert.throws(()=>L.validate([{row:1,col:0,value:'bad'}]));assert.throws(()=>L.validate([{row:1,col:2,value:''}]));assert.throws(()=>L.validate([{row:1,col:2,value:'x'.repeat(2001)}]));});
test('public quote changes only after authenticated publication, with term evidence preserved',async()=>{
 const C=require('../lib/control.cjs'),entry=require.cache[require.resolve('../lib/control.cjs')],prior=entry.exports,env=process.env.GOOGLE_CLIENT_ID;let saved=structuredClone(site),writes=0;
 process.env.GOOGLE_CLIENT_ID='test';entry.exports={...C,authorize:async req=>{assert.equal(req.headers.authorization,'Bearer local-test');},sheets:async(path,options)=>{if(options){writes++;for(const write of options.data.data){const index=Number(write.range.match(/\d+$/)[0])-1;if(write.range.includes('!C'))saved[index][2]=write.values[0][0];else saved[index]=write.values[0];}return {};}return {values:structuredClone(saved)};}};
 for(const name of ['../api/control.js','../api/loading.js'])delete require.cache[require.resolve(name)];const control=require('../api/control.js'),publicQuote=require('../api/loading.js');
 const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(body){this.body=body;return this;}});
 try{const editor=response();await control({method:'GET',query:{tab:'Loading'},headers:{authorization:'Bearer local-test'}},editor);const draft=structuredClone(editor.body.values);draft[1][2]='A private draft becomes our shared horizon.';
 const before=response();await publicQuote({method:'GET'},before);assert.equal(before.body.quote,UI.defaultQuote);assert.equal(writes,0);
 const published=response();await control({method:'POST',headers:{authorization:'Bearer local-test'},body:{tab:'Loading',revision:editor.body.revision,changes:[{row:1,col:2,value:draft[1][2]}],additions:[]}},published);
 assert.equal(writes,1);assert.equal(published.body.values[1][2],draft[1][2]);const after=response();await publicQuote({method:'GET'},after);assert.equal(after.body.quote,draft[1][2]);assert.equal(after.headers['Cache-Control'],'no-store');assert.deepEqual(saved[1],site[1]);
 }finally{entry.exports=prior;if(env===undefined)delete process.env.GOOGLE_CLIENT_ID;else process.env.GOOGLE_CLIENT_ID=env;for(const name of ['../api/control.js','../api/loading.js'])delete require.cache[require.resolve(name)];}
});
test('shared loaders allow reading time for both short and longer quotes',()=>{assert.equal(UI.readingDuration('A short quote.'),12000);assert.ok(UI.readingDuration('A longer quote '.repeat(15))>9000);assert.ok(UI.readingDuration('word '.repeat(2000))>900000);assert.ok(UI.readingDuration(UI.experienceQuotes.work)>=21000);assert.ok(UI.readingDuration(UI.experienceQuotes.thriving)>=27000);});
test('private previews use the full shared reading-time animation before completion',async t=>{
 t.mock.timers.enable({apis:['Date','setInterval']});const cells=Array.from({length:5},()=>({classList:{toggle(){}},querySelector(){return this.fill;},fill:{style:{}}})),attrs={};const bar={setAttribute(k,v){attrs[k]=v;},querySelectorAll(){return cells;}};const host={isConnected:true,innerHTML:'',contains(el){return el===bar;},querySelector(){return bar;}};
 const loader=UI.show(host,{quote:'Read this short quote.',preview:true});let ready=false;loader.ready.then(()=>ready=true);
 t.mock.timers.tick(4000);await Promise.resolve();assert.equal(ready,false);assert.ok(Number(attrs['aria-valuenow'])>0&&Number(attrs['aria-valuenow'])<100);
 t.mock.timers.tick(8000);await loader.ready;assert.equal(attrs['aria-valuenow'],'100');loader.stop();
});

test('the homepage entry can pin the requested quote without replacing it from the published quote endpoint',async t=>{
 t.mock.timers.enable({apis:['Date','setInterval']});let requests=0;const oldFetch=global.fetch;global.fetch=async()=>{requests++;return {ok:true,json:async()=>({quote:'A different published quote.'})};};
 const cells=Array.from({length:5},()=>({classList:{toggle(){}},querySelector(){return this.fill;},fill:{style:{}}})),attrs={};const bar={setAttribute(k,v){attrs[k]=v;},querySelectorAll(){return cells;}};const host={isConnected:true,innerHTML:'',contains(el){return el===bar;},querySelector(){return bar;}};
 try{const loader=UI.show(host,{quote:UI.defaultQuote,usePublishedQuote:false,titleId:'learning-entry-title'});loader.update(5);assert.ok(host.innerHTML.includes(UI.defaultQuote));assert.ok(host.innerHTML.includes('id="learning-entry-title"'));assert.equal(requests,0);let ready=false;loader.ready.then(()=>ready=true);t.mock.timers.tick(1000);await Promise.resolve();assert.equal(ready,false);t.mock.timers.tick(UI.readingDuration(UI.defaultQuote));await loader.ready;assert.equal(attrs['aria-valuenow'],'100');assert.equal(requests,0);loader.stop();}finally{global.fetch=oldFetch;}
});

test('all seven learning experiences use the exact approved quote alignment, separate from the homepage horizon quote',()=>{
 const expected={
  "purpose": "In Fleming County Schools, we believe every student should be able to say what they are learning, why it matters, and where they can use it.",
  "thinking": "In Fleming County Schools, we believe real problems bring out big thinking when students ask their own questions, draw on what they know across subjects, and test solutions that could make a difference.",
  "voice": "In Fleming County Schools, we believe students take ownership of their learning when their ideas shape what they explore, how they work, and what they create.",
  "work": "In Fleming County Schools, we believe great learning should leave behind compelling evidence. Students should have the chance to show what they know, use it in a new situation, and explain the thinking behind their work.",
  "feedback": "In Fleming County Schools, we believe feedback moves learning forward when students can see what is working, decide what to improve, and put that advice to use.",
  "support": "In Fleming County Schools, we believe every student deserves someone who sees what they are capable of and gives them the support to take on the next challenge with confidence.",
  "thriving": "In Fleming County Schools, we believe students thrive when they are healthy, feel supported, and can say with confidence, 'I can see how I have grown. I know what I can do. I am ready for what comes next, and I have a say in where I go.'"
};
 assert.deepEqual(UI.experienceQuotes,expected);assert.equal(new Set(Object.values(UI.experienceQuotes)).size,7);
 for(const [id,quote] of Object.entries(expected)){assert.equal(UI.quoteForExperience(id),quote);assert.ok(UI.markup(quote).includes(quote));assert.notEqual(quote,UI.defaultQuote);}
 assert.equal(UI.quoteForExperience('unknown'),UI.defaultQuote);assert.equal(UI.quoteForExperience('toString'),UI.defaultQuote);assert.match(UI.defaultQuote,/lose sight of the shoreline/);
});

test('Enter Indicators releases only the reading delay and progress still follows data readiness',async t=>{
 t.mock.timers.enable({apis:['Date','setInterval']});let click;const button={disabled:false,textContent:'Enter Indicators',addEventListener(type,handler){assert.equal(type,'click');click=handler;},setAttribute(){}};
 const cells=Array.from({length:5},()=>({classList:{toggle(){}},querySelector(){return this.fill;},fill:{style:{}}})),attrs={};const bar={setAttribute(k,v){attrs[k]=v;},querySelectorAll(){return cells;}};const host={isConnected:true,innerHTML:'',contains(el){return el===bar;},querySelector(selector){return selector==='[role=progressbar]'?bar:button;}};
 const loader=UI.show(host,{quote:UI.experienceQuotes.thriving,usePublishedQuote:false,allowContinue:true});assert.ok(host.innerHTML.includes('Enter Indicators'));loader.update(2);t.mock.timers.tick(1000);click();await loader.ready;assert.equal(button.disabled,true);assert.equal(button.textContent,'Opening…');assert.equal(attrs['aria-valuenow'],'40');loader.update(5);assert.equal(attrs['aria-valuenow'],'100');loader.stop();
});
test('long experience quotes retain their full reading time unless the reader continues',async t=>{
 t.mock.timers.enable({apis:['Date','setInterval']});const cells=Array.from({length:5},()=>({classList:{toggle(){}},querySelector(){return this.fill;},fill:{style:{}}}));const bar={setAttribute(){},querySelectorAll(){return cells;}};const host={isConnected:true,innerHTML:'',contains(el){return el===bar;},querySelector(){return bar;}};
 const duration=UI.readingDuration(UI.experienceQuotes.thriving),loader=UI.show(host,{quote:UI.experienceQuotes.thriving,usePublishedQuote:false});loader.update(5);let ready=false;loader.ready.then(()=>ready=true);t.mock.timers.tick(20000);await Promise.resolve();await Promise.resolve();assert.equal(ready,false);t.mock.timers.tick(duration-20000);await loader.ready;assert.equal(ready,true);loader.stop();
});
