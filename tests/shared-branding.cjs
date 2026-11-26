const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {execFileSync}=require('node:child_process');
test('new nested pages inherit shared branding and repeated builds preserve controls',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'vibrancy-branding-'));
 try{
  for(const file of ['scripts/prepare-site.cjs','shared/footer.html','shared/header.html','shared/header-mark.html']){
   fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.copyFileSync(path.join(__dirname,'..',file),path.join(root,file));
  }
  const page=path.join(root,'new-component','new-indicator.html');fs.mkdirSync(path.dirname(page));fs.writeFileSync(page,'<html><head></head><body><main>New indicator</main><footer><button id="review">Review evidence</button></footer></body></html>');
  const admin=path.join(root,'admin','index.html');fs.mkdirSync(path.dirname(admin));fs.writeFileSync(admin,'<html><head></head><body><header><a>Old brand</a><button id="logout" hidden>Sign out</button></header><main></main></body></html>');
  const run=()=>execFileSync(process.execPath,[path.join(root,'scripts/prepare-site.cjs')]);run();const html=fs.readFileSync(page,'utf8');
  assert.ok(html.includes('/assets/fcs-measures-of-quality-header.jpg'));
  assert.ok(html.includes('/shared/header.css'));
  assert.ok(html.includes('VIBRANCY 5.0'));
  assert.ok(html.includes('id="review"'));
  assert.ok(fs.readFileSync(admin,'utf8').includes('id="logout" hidden'));
  run();assert.equal(fs.readFileSync(page,'utf8'),html);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
