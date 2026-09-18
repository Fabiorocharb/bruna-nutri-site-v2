const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const names = ['calendar-days','arrow-up-right','arrow-right','arrow-down','chevron-up','brain','puzzle','apple','pill','users-round','heart','heart-handshake','video','chart-no-axes-combined','leaf','map-pin','phone','mail','star','menu','x','play'];
let symbols = '';
for (const name of names) {
  const svg = fs.readFileSync(path.join(root, 'node_modules/lucide-static/icons', name+'.svg'), 'utf8');
  const body = svg.slice(svg.indexOf('>',svg.indexOf('<svg'))+1,svg.lastIndexOf('</svg>'));
  symbols += `<symbol id="icon-${name}" viewBox="0 0 24 24">${body}</symbol>\n`;
}
for(const name of ['Instagram', 'Whatsapp']) {
  const {icon} = require('@fortawesome/free-brands-svg-icons/fa'+name).definition;
  symbols += `<symbol id="icon-${name.toLowerCase()}" viewBox="0 0 ${icon[0]} ${icon[1]}"><path fill="currentColor" stroke="none" d="${icon[4]}"/></symbol>\n`;
}
const sprite = '<!-- SVG-SPRITE-START -->\n<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute;overflow:hidden" aria-hidden="true"><defs>'+symbols+'</defs></svg>\n<!-- SVG-SPRITE-END -->';
const target = path.join(root, 'index.html');
let html = fs.readFileSync(target, 'utf8');
html = html.replace(/<!-- SVG-SPRITE-START -->[\s\S]*?<!-- SVG-SPRITE-END -->|<!-- SVG-SPRITE -->/,sprite);
fs.writeFileSync(target, html);
fs.copyFileSync(path.join(root,'node_modules/lucide-static/LICENSE'), path.join(root,'assets/icons/LICENSE-lucide.txt'));
fs.copyFileSync(path.join(root,'node_modules/@fortawesome/free-brands-svg-icons/LICENSE.txt'),path.join(root,'assets/icons/LICENSE-fontawesome.txt'));
fs.writeFileSync(path.join(root,'assets/icons/favicon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#f5e3df"/><path d="M22 13v37m-5-37h14c16 0 16 18 0 18h-9m9 0c18 0 18 19 0 19H17m19-27v34m-5-34h9c16 0 16 18 0 18h-4" fill="none" stroke="#b93e60" stroke-width="1.7"/></svg>');
console.log('Ícones vetoriais incorporados no HTML.');
