import { readFileSync, writeFileSync } from 'node:fs';

const LINKS_URL = 'https://pget.vercel.app/';
const AUTHOR_START = '<!-- AUTHOR:START -->';
const AUTHOR_END = '<!-- AUTHOR:END -->';
const FALLBACK_NAME = 'Kaushik Verma';

function emailHref(email) {
  if (!email) return '';
  return email.startsWith('mailto:') ? email : `mailto:${email}`;
}

const TAGLINE = 'Building AI tools that turn long documents into clear decisions.';
const STARS_REPO = 'itskaushikverma/Waypoint-Shipment-Tracker';

function githubLogin(url) {
  if (!url) return 'itskaushikverma';
  try {
    return new URL(url).pathname.split('/').filter(Boolean)[0] || 'itskaushikverma';
  } catch {
    return 'itskaushikverma';
  }
}

function valueBadge(alt, label, message, color, logo, href) {
  if (!href || !message) return '';
  return `<a href="${href}"><img src="https://img.shields.io/badge/${label}-${message}-${color}?style=flat-square&logo=${logo}" alt="${alt}" /></a>`;
}

function renderAuthor(data) {
  const name = data.name?.trim() || FALLBACK_NAME;
  const login = githubLogin(data.github);
  const email = emailHref(data.email).replace(/^mailto:/, '');
  const badges = [
    valueBadge('Email', 'Email', email, 'EA4335', 'gmail', emailHref(data.email)),
    valueBadge('Portfolio', 'Website', data.portfolio, '000000', 'vercel', data.portfolio),
    valueBadge('GitHub', 'GitHub', login, '181717', 'github', data.github),
    valueBadge('LinkedIn', 'LinkedIn', data.linkedin, '0077B5', 'linkedin', data.linkedin),
    valueBadge('Twitter', 'Twitter', data.twitter ?? data.x, '1DA1F2', 'twitter', data.twitter ?? data.x),
  ]
    .filter(Boolean)
    .join('\n    ');

  return `${AUTHOR_START}
<h2 id="contact" style="margin: 12px 0 8px">👤 Author</h2>
<div align="center" style="margin: 0">
  <img src="https://github.com/${login}.png" alt="Developer" width="100" height="100" style="border-radius:50%; width:100px; height:100px; object-fit:cover; display:block; margin:0 auto"/>
  <h3 style="margin: 8px 0 4px">${name}</h3>
  <p style="margin: 0 0 8px"><em>${TAGLINE}</em></p>
  <p style="margin: 0 0 8px">
    ${badges}
  </p>
  <p style="margin: 0">Open to product feedback, collaboration, and thoughtful conversation.</p>
</div>
<div align="center" style="margin: 8px 0 0">
  <p style="margin: 0 0 4px">If you found this project helpful, please consider giving it a ⭐️</p>
  <a href="https://github.com/${STARS_REPO}"><img src="https://img.shields.io/github/stars/${STARS_REPO}?style=social" alt="GitHub stars" /></a>
</div>
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
