const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const esbuild = require('esbuild');

const distDir = path.join(__dirname, '..', 'public', 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

console.log('🚀 Starting Production Asset Build...');

// 1. CSS BUNDLING & MINIFICATION
const fontsCss = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'fonts.css'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'public', 'style.css'), 'utf8');
const homeCss = fs.readFileSync(path.join(__dirname, '..', 'public', 'home-v5.css'), 'utf8');

const combinedCss = `${fontsCss}\n${styleCss}\n${homeCss}`;
const minCss = esbuild.transformSync(combinedCss, { loader: 'css', minify: true }).code;
const cssHash = crypto.createHash('md5').update(minCss).digest('hex').slice(0, 8);

const cssFileName = `home.${cssHash}.min.css`;
fs.writeFileSync(path.join(distDir, cssFileName), minCss, 'utf8');
fs.writeFileSync(path.join(distDir, 'home.min.css'), minCss, 'utf8');
console.log(`✅ CSS Bundle created: ${cssFileName} (${(minCss.length / 1024).toFixed(1)} KiB)`);

// 2. CRITICAL CSS EXTRACTION (Target < 15 KiB)
let criticalCss = fontsCss + '\n';
const rootMatch = styleCss.match(/:root\s*\{[\s\S]*?\}\s*\*, \*::before, \*::after[\s\S]*?body\s*\{[\s\S]*?\}/);
if (rootMatch) criticalCss += rootMatch[0] + '\n';

const skipMatch = styleCss.match(/(\.skip-link[\s\S]*?\.skip-link:focus\s*\{[\s\S]*?\})/);
if (skipMatch) criticalCss += skipMatch[0] + '\n';

const navMatch = styleCss.match(/\/\* =+ NAVBAR =+ \*\/[\s\S]*?(?=\/\* =+ HERO =+ \*\/|\.hero|\/\* =+)/);
if (navMatch) criticalCss += navMatch[0] + '\n';

const homeRootMatch = homeCss.match(/:root\s*\{[\s\S]*?\}\s*/);
if (homeRootMatch) criticalCss += homeRootMatch[0] + '\n';

const heroIdx = homeCss.indexOf('01 - HERO');
const expIdx = homeCss.indexOf('02 - HARDWARE EXPERTISE');
if (heroIdx !== -1 && expIdx !== -1) {
    criticalCss += homeCss.substring(heroIdx, expIdx) + '\n';
}

const minCritical = esbuild.transformSync(criticalCss, { loader: 'css', minify: true }).code;
fs.writeFileSync(path.join(distDir, 'critical.min.css'), minCritical, 'utf8');
console.log(`✅ Critical CSS extracted: critical.min.css (${(minCritical.length / 1024).toFixed(1)} KiB)`);

// 3. JAVASCRIPT BUNDLING & MINIFICATION
const jsFiles = [
    path.join(__dirname, '..', 'public', 'global-profile.js'),
    path.join(__dirname, '..', 'public', 'toast.js'),
    path.join(__dirname, '..', 'public', 'main.js'),
    path.join(__dirname, '..', 'public', 'home-v5.js')
];

let combinedJs = '';
jsFiles.forEach(f => {
    combinedJs += `/* === ${path.basename(f)} === */\n` + fs.readFileSync(f, 'utf8') + '\n;;\n';
});

const minJs = esbuild.transformSync(combinedJs, { minify: true }).code;
const jsHash = crypto.createHash('md5').update(minJs).digest('hex').slice(0, 8);

const jsFileName = `home.${jsHash}.min.js`;
fs.writeFileSync(path.join(distDir, jsFileName), minJs, 'utf8');
fs.writeFileSync(path.join(distDir, 'home.min.js'), minJs, 'utf8');
console.log(`✅ JS Bundle created: ${jsFileName} (${(minJs.length / 1024).toFixed(1)} KiB)`);

// 4. WRITE MANIFEST
const manifest = {
    'home.css': `/dist/${cssFileName}`,
    'home.js': `/dist/${jsFileName}`,
    'critical.css': '/dist/critical.min.css',
    timestamp: new Date().toISOString()
};

fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log('✅ Asset manifest generated:', manifest);

// 5. UPDATE INDEX.HTML WITH LATEST BUNDLES
const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// Replace CSS preload and noscript
html = html.replace(
    /<link rel="preload" href="\/dist\/home\.[a-z0-9]+\.min\.css" as="style" onload="this\.onload=null;this\.rel='stylesheet'">/g,
    `<link rel="preload" href="${manifest['home.css']}" as="style" onload="this.onload=null;this.rel='stylesheet'">`
);
html = html.replace(
    /<noscript><link rel="stylesheet" href="\/dist\/home\.[a-z0-9]+\.min\.css"><\/noscript>/g,
    `<noscript><link rel="stylesheet" href="${manifest['home.css']}"></noscript>`
);

// Replace critical CSS content
const critRegex = /<style id="critical-css">[\s\S]*?<\/style>/;
if (critRegex.test(html)) {
    html = html.replace(critRegex, `<style id="critical-css">\n${minCritical}\n    </style>`);
}

// Replace script bundle tag
html = html.replace(
    /<script src="\/dist\/home\.[a-z0-9]+\.min\.js" defer><\/script>/g,
    `<script src="${manifest['home.js']}" defer></script>`
);

fs.writeFileSync(indexHtmlPath, html, 'utf8');
console.log('✅ Updated public/index.html with current bundle tags');
