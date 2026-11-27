'use strict';
// Apply shared branding to every page, including pages and components added later.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const template=fs.readFileSync(path.join(root,'shared/footer.html'),'utf8').trim();
const headerMark=fs.readFileSync(path.join(root,'shared/header-mark.html'),'utf8').trim();
const header=fs.readFileSync(path.join(root,'shared/header.html'),'utf8').trim().replace('{{HEADER_MARK}}',headerMark);
const skip=new Set(['.git','node_modules','assets','data','tests','shared','scripts','.vercel']);
let count=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 if(skip.has(entry.name)||entry.name.startsWith('.'))continue;
 const file=path.join(dir,entry.name);if(entry.isDirectory()){walk(file);continue;}
 if(!entry.name.endsWith('.html')||path.relative(root,file)==='admin/preview.html')continue;
 let html=fs.readFileSync(file,'utf8');
 if(!/<\/body>/i.test(html))continue;
 const oldHeader=html.match(/<header\b[\s\S]*?<\/header>/i)?.[0];
 let sharedHeader=header;
 if(path.relative(root,file)==='admin/index.html'){
  const logout=oldHeader?.match(/<button\b[^>]*id=["']logout["'][\s\S]*?<\/button>/i)?.[0]||'';
  sharedHeader=header.replace('<a class="site-header-home" href="/home.html">Vibrancy Home</a>',`<div class="site-header-tools"><span>PRIVATE CONTROL BOARD</span>${logout}</div>`);
 }
 html=oldHeader?html.replace(oldHeader,sharedHeader):html.replace(/<body\b[^>]*>/i,match=>match+'\n'+sharedHeader);
 if(!html.includes('/shared/loading.js'))html=html.replace(/<head>/i,'<head><link rel="stylesheet" href="/shared/loading.css?v=20261127-reading-time"><script src="/shared/loading.js?v=20261127-reading-time" defer></script>');
 if(!html.includes('/shared/medallions.css'))html=html.replace(/<\/head>/i,'<link rel="stylesheet" href="/shared/medallions.css?v=20261127-icon-replacements">\n</head>');
 if(!html.includes('/shared/header.css'))html=html.replace(/<\/head>/i,'<link rel="stylesheet" href="/shared/header.css">\n</head>');
 const old=html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0]||'';
 const review=old.match(/<button\b[^>]*id=["']review["'][\s\S]*?<\/button>/i)?.[0];
 const footer=review?template.replace('</footer>',`  <div class="site-footer-extra">${review}</div>\n</footer>`):template;
 html=old?html.replace(old,footer):html.replace(/<\/body>/i,footer+'\n</body>');
 if(!html.includes('/shared/footer.css'))html=html.replace(/<\/head>/i,'<link rel="stylesheet" href="/shared/footer.css">\n</head>');
 fs.writeFileSync(file,html);count++;
}}
walk(root);
// The dashboard renderer is shared by all current and future area indicators.
const dashboardPath=path.join(root,'purpose-dashboard.js');
if(fs.existsSync(dashboardPath)){
 let js=fs.readFileSync(dashboardPath,'utf8');
 js=js.replace(/(<header class="purpose-brand">)<svg[\s\S]*?<\/svg>/,(_,prefix)=>prefix+headerMark);
 fs.writeFileSync(dashboardPath,js);
}
console.log(`Shared header and footer applied to ${count} pages.`);
