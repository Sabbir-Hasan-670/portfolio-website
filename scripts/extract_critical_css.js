const fs = require('fs');
const esbuild = require('esbuild');

const styleCss = fs.readFileSync('public/style.css', 'utf8');
const homeCss = fs.readFileSync('public/home-v5.css', 'utf8');
const fontsCss = fs.readFileSync('public/fonts/fonts.css', 'utf8');

// Combine everything for full bundle
const fullCss = fontsCss + '\n' + styleCss + '\n' + homeCss;
const minFullCss = esbuild.transformSync(fullCss, { loader: 'css', minify: true }).code;

if (!fs.existsSync('public/dist')) {
    fs.mkdirSync('public/dist', { recursive: true });
}

fs.writeFileSync('public/dist/home.min.css', minFullCss, 'utf8');
console.log('✅ Full minified bundle written: public/dist/home.min.css, size:', minFullCss.length, 'bytes');

// Now extract above-the-fold critical CSS:
// Variables, reset, body, navbar, hero section, portrait, skip-link
let criticalCss = '';

// Include fonts.css
criticalCss += fontsCss + '\n';

// Include style.css up to navbar and buttons
const styleLines = styleCss.split('\n');
// Grab :root, resets, navbar, buttons, typography
const criticalStyleParts = styleLines.slice(0, 350).join('\n');
criticalCss += criticalStyleParts + '\n';

// Include home-v5.css hero section (from start up to end of section 01 HERO, around line 1250)
const homeLines = homeCss.split('\n');
// find where Section 02 EXPERTISE begins
let heroEndIdx = homeLines.findIndex(l => l.includes('02 - HARDWARE EXPERTISE') || l.includes('/* 02 -') || l.includes('expertise-section'));
if (heroEndIdx === -1) heroEndIdx = 1200;
const criticalHomeParts = homeLines.slice(0, heroEndIdx).join('\n');
criticalCss += criticalHomeParts + '\n';

const minCritical = esbuild.transformSync(criticalCss, { loader: 'css', minify: true }).code;
fs.writeFileSync('public/dist/critical.min.css', minCritical, 'utf8');
console.log('✅ Critical minified CSS written: public/dist/critical.min.css, size:', minCritical.length, 'bytes');

