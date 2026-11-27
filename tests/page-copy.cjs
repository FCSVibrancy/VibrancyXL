const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),P=require('../shared/page-copy.js');
test('page descriptions preserve paragraphs and emphasis while escaping supplied markup',()=>{
 assert.equal(P.markup('**First sentence.** More words.\n\n**Second paragraph.** <img src=x onerror=bad>'),'<p><strong>First sentence.</strong> More words.</p><p><strong>Second paragraph.</strong> &lt;img src=x onerror=bad&gt;</p>');
 assert.equal(P.markup('A "quoted" phrase & an apostrophe\'s use.'),'<p>A &quot;quoted&quot; phrase &amp; an apostrophe&#39;s use.</p>');
});
test('the approved learning description has three paragraphs and three bold opening statements in fallback and editable source',()=>{
 const data=require('../data/site-content.json'),copy=data.find(r=>r[0]==='learning'&&r[1]==='.subtitle')[2],html=P.markup(copy);assert.equal(copy.split('\n\n').length,3);assert.equal((html.match(/<strong>/g)||[]).length,3);assert.ok(html.includes('<strong>Vibrant Learning is &quot;Learning that Matters to Me.&quot;</strong>'));assert.ok(html.includes('<strong>Our community helps make that learning possible.</strong>'));assert.ok(html.includes('<strong>Great learning should leave behind compelling evidence.</strong>'));
 const page=fs.readFileSync(path.join(__dirname,'../learning.html'),'utf8');assert.ok(page.includes('<div class="subtitle learning-description">'+html+'</div>'));
});
