import fs from 'node:fs';
import path from 'node:path';

// Get target base path from environment or CLI arg, default to empty (root '/')
const rawBase = process.env.BASE_PATH || process.argv[2] || '';
const basePath = rawBase ? (rawBase.endsWith('/') ? rawBase : rawBase + '/') : '/';

const dist = path.resolve('dist');
const data = JSON.parse(fs.readFileSync(path.join(dist, 'data.json'), 'utf8'));
const templateRaw = fs.readFileSync('template.html', 'utf8');

// Replace %%BASE_PATH%% in template.html with the active basePath
const template = templateRaw.replaceAll('%%BASE_PATH%%', basePath);

const esc = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const pages = [
  ['', 'Yara Khamis Packaging, Spaces & Brand Identity'],
  ['work', 'Selected Work — Yara Khamis'],
  ['about', 'About Yara Khamis'],
  ['services', 'Design Services — Yara Khamis'],
  ['contact', 'Let’s Collaborate — Yara Khamis'],
  ...data.map(p => ['project/' + p.id, `${p.caseStudy?.client || p.title} — Case Study | Yara Khamis`])
];

for (const [route, title] of pages) {
  const dir = path.join(dist, route);
  fs.mkdirSync(dir, { recursive: true });
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace('content="Yara Khamis Design that takes shape"', `content="${esc(title)}"`);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// 404.html serves as the fallback shell for SPA deep linking on GitHub Pages
fs.writeFileSync(path.join(dist, '404.html'), template);

console.log(`Built ${pages.length} static routes for ${data.length} projects with basePath: "${basePath}".`);
