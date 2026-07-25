import fs from 'fs';

const content = fs.readFileSync('reference/ClaudeArtifact.jsx', 'utf8');
const start = content.indexOf('const STYLE = `') + 'const STYLE = `'.length;
const end = content.indexOf('`;', start);
const css = content.slice(start, end);

fs.mkdirSync('src/styles', { recursive: true });
fs.writeFileSync('src/styles/qualiguide.css', css);
console.log('Wrote', css.length, 'bytes');
