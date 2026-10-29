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

// 2. JAVASCRIPT BUNDLING & MINIFICATION
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

// 3. WRITE MANIFEST
const manifest = {
    'home.css': `/dist/${cssFileName}`,
    'home.js': `/dist/${jsFileName}`,
    timestamp: new Date().toISOString()
};

fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log('✅ Asset manifest generated:', manifest);

// 4. UPDATE INDEX.HTML (DIRECT SYNCHRONOUS CSS TO PREVENT FOUC / SLOW STYLING DELAY)
const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// Replace any critical-css style block + preload link with direct stylesheet
const cssPattern = /(?:<style id="critical-css">[\s\S]*?<\/style>\s*)?(?:<link rel="preload" href="\/dist\/home\.[a-z0-9]+\.min\.css"[^>]*>\s*<noscript><link rel="stylesheet" href="\/dist\/home\.[a-z0-9]+\.min\.css"><\/noscript>|<link rel="stylesheet" href="\/dist\/home\.[a-z0-9]+\.min\.css">)/;

const directCssTag = `<link rel="stylesheet" href="${manifest['home.css']}">`;

if (cssPattern.test(html)) {
    html = html.replace(cssPattern, directCssTag);
    console.log('✅ Replaced async CSS preload with direct synchronous stylesheet to eliminate FOUC');
}

// Remove redundant synchronous global-profile.js from <head> (already bundled in home.js)
html = html.replace(/<script src="\/global-profile\.js\?v=3"><\/script>\s*/g, '');

// Replace script bundle tag
html = html.replace(
    /<script src="\/dist\/home\.[a-z0-9]+\.min\.js" defer><\/script>/g,
    `<script src="${manifest['home.js']}" defer></script>`
);

fs.writeFileSync(indexHtmlPath, html, 'utf8');
console.log('✅ Updated public/index.html with current bundle tags');
