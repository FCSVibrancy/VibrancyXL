'use strict';
// Apply the common footer to every HTML page, including pages added later.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const template=fs.readFileSync(path.join(root,'shared/footer.html'),'utf8').trim();
const headerMark=fs.readFileSync(path.join(root,'shared/header-mark.html'),'utf8').trim();
const skip=new Set(['.git','node_modules','assets','data','tests','shared','scripts','.vercel']);
let count=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 if(skip.has(entry.name)||entry.name.startsWith('.'))continue;
 const file=path.join(dir,entry.name);if(entry.isDirectory()){walk(file);continue;}
 if(!entry.name.endsWith('.html')||path.relative(root,file)==='admin/preview.html')continue;
 let html=fs.readFileSync(file,'utf8');
 if(!/<\/body>/i.test(html))continue;
 html=html.replace(/(<header\b[^>]*class=["'][^"']*\bbrand\b[^"']*["'][^>]*>[\s\S]*?)<svg\b[^>]*(?:class=["'](?:tree|header-mark)["']|viewBox=["']53 4 120 88["'])[^>]*>[\s\S]*?<\/svg>/i,(_,prefix)=>prefix+headerMark);
 const old=html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0]||'';
 const review=old.match(/<button\b[^>]*id=["']review["'][\s\S]*?<\/button>/i)?.[0];
 const footer=review?template.replace('</footer>',`  <div class="site-footer-extra">${review}</div>\n</footer>`):template;
 html=old?html.replace(old,footer):html.replace(/<\/body>/i,footer+'\n</body>');
 if(!html.includes('/shared/footer.css'))html=html.replace(/<\/head>/i,'<link rel="stylesheet" href="/shared/footer.css">\n</head>');
 fs.writeFileSync(file,html);count++;
}}
walk(root);console.log(`Shared footer applied to ${count} pages.`);
