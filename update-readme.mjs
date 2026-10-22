import { readFileSync, writeFileSync } from 'node:fs';

const LINKS_URL = 'https://pget.vercel.app/';
const AUTHOR_START = '<!-- AUTHOR:START -->';
const AUTHOR_END = '<!-- AUTHOR:END -->';
const FALLBACK_NAME = 'Kaushik Verma';

function emailHref(email) {
  if (!email) return '';
  return email.startsWith('mailto:') ? email : `mailto:${email}`;
}

function badge(href, label, color, logo) {
  if (!href) return '';
  const src = `https://img.shields.io/badge/${encodeURIComponent(label)}-${color}?style=for-the-badge&logo=${logo}&logoColor=white`;
  return `  <a href="${href}" target="_blank" rel="noopener noreferrer"><img src="${src}" alt="${label}" /></a>`;
}

function renderAuthor(data) {
  const name = data.name?.trim() || FALLBACK_NAME;
  const badges = [
    badge(data.portfolio, 'Portfolio', '114B5F', 'googlechrome'),
    badge(data.github, 'GitHub', '181717', 'github'),
    badge(data.linkedin, 'LinkedIn', '0A66C2', 'linkedin'),
    badge(data.twitter ?? data.x, 'X', '111111', 'x'),
    badge(data.instagram, 'Instagram', 'E4405F', 'instagram'),
    badge(emailHref(data.email), 'Email', 'EA4335', 'gmail'),
  ]
    .filter(Boolean)
    .join('&nbsp;&nbsp;\n');

  return `${AUTHOR_START}
## 👨‍💻 Author

**${name}**

<p align="left">
${badges}
</p>
${AUTHOR_END}`;
}

function upsertAuthor(readme, section) {
  if (readme.includes(AUTHOR_START) && readme.includes(AUTHOR_END)) {
    return readme.replace(new RegExp(`${AUTHOR_START}[\\s\\S]*?${AUTHOR_END}`), section);
  }

  const introBreak = readme.indexOf('\n---\n');
  if (introBreak !== -1) {
    const insertAt = introBreak + '\n---\n'.length;
    return `${readme.slice(0, insertAt)}\n${section}\n${readme.slice(insertAt)}`;
  }

  return `${section}\n\n${readme}`;
}

async function main() {
  try {
    const response = await fetch(LINKS_URL);
    if (!response.ok) throw new Error(`Could not load links (${response.status})`);

    const data = await response.json();
    if (!data || typeof data !== 'object') throw new Error('Unexpected links payload');

    const readme = readFileSync('README.md', 'utf-8');
    writeFileSync('README.md', upsertAuthor(readme, renderAuthor(data)));
    console.log('Updated README author section with:', data);
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 1;
  }
}

void main();
