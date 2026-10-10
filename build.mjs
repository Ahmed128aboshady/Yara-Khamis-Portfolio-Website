import fs from 'node:fs';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1')); 
const dist=path.resolve('dist');
const data=JSON.parse(fs.readFileSync(path.join(dist,'data.json'),'utf8'));
const template=fs.readFileSync('template.html','utf8');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const pages=[['','Yara Khamis — Packaging, Spaces & Brand Identity'],['work','Selected Work — Yara Khamis'],['about','About Yara Khamis'],['services','Design Services — Yara Khamis'],['contact','Let’s Collaborate — Yara Khamis'],...data.map(p=>['project/'+p.id,p.title+' — Yara Khamis'])];
for(const [route,title] of pages){const dir=path.join(dist,route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),template.replace(/<title>.*?<\/title>/,`<title>${esc(title)}</title>`).replace('content="Yara Khamis — Design that takes shape"',`content="${esc(title)}"`));}
fs.writeFileSync(path.join(dist,'404.html'),template);
console.log(`Built ${pages.length} static routes for ${data.length} projects.`);
