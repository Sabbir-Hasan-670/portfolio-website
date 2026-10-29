const fs = require('fs');
const esbuild = require('esbuild');

const fontsCss = fs.readFileSync('public/fonts/fonts.css', 'utf8');
const styleCss = fs.readFileSync('public/style.css', 'utf8');
const homeCss = fs.readFileSync('public/home-v5.css', 'utf8');

// Target < 15 KiB:
// We need @font-face, :root variables, reset, navbar, and hero chassis styles.
let leanCss = fontsCss + '\n';

// Extract :root and base reset from style.css
const rootMatch = styleCss.match(/:root\s*\{[\s\S]*?\}\s*\*, \*::before, \*::after[\s\S]*?body\s*\{[\s\S]*?\}/);
if (rootMatch) leanCss += rootMatch[0] + '\n';

// Extract skip-link and focus-visible
const skipMatch = styleCss.match(/(\.skip-link[\s\S]*?\.skip-link:focus\s*\{[\s\S]*?\})/);
if (skipMatch) leanCss += skipMatch[0] + '\n';

// Extract navbar from style.css
const navMatch = styleCss.match(/\/\* =+ NAVBAR =+ \*\/[\s\S]*?(?=\/\* =+ HERO =+ \*\/|\.hero|\/\* =+)/);
if (navMatch) leanCss += navMatch[0] + '\n';

// Extract hero from home-v5.css: :root tokens from home-v5 and Section 01 HERO
const homeRootMatch = homeCss.match(/:root\s*\{[\s\S]*?\}\s*/);
if (homeRootMatch) leanCss += homeRootMatch[0] + '\n';

// Grab lines of home-v5 from /* 01 - HERO to /* 02 -
const heroIdx = homeCss.indexOf('01 - HERO');
const expIdx = homeCss.indexOf('02 - HARDWARE EXPERTISE');
if (heroIdx !== -1 && expIdx !== -1) {
    leanCss += homeCss.substring(heroIdx, expIdx) + '\n';
}

const minLean = esbuild.transformSync(leanCss, { loader: 'css', minify: true }).code;
console.log('Lean Critical CSS size:', minLean.length, 'bytes (~' + (minLean.length / 1024).toFixed(1) + ' KiB)');

fs.writeFileSync('public/dist/critical-lean.min.css', minLean, 'utf8');

