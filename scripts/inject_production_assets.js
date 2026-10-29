const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync('public/dist/manifest.json', 'utf8'));
const criticalCss = fs.readFileSync('public/dist/critical.min.css', 'utf8');

let html = fs.readFileSync('public/index.html', 'utf8');

// Replace CSS links
const oldCssLinksRegex = /<link rel="stylesheet" href="\/fonts\/fonts\.css">[\s\S]*?<link rel="stylesheet" href="\/home-v5\.css\?v=16\.0">/;
const newCssBlock = `<style id="critical-css">\n${criticalCss}\n</style>\n    <link rel="preload" href="${manifest['home.css']}" as="style" onload="this.onload=null;this.rel='stylesheet'">\n    <noscript><link rel="stylesheet" href="${manifest['home.css']}"></noscript>`;

if (oldCssLinksRegex.test(html)) {
    html = html.replace(oldCssLinksRegex, newCssBlock);
    console.log('✅ Replaced render-blocking CSS links with Critical CSS + Async preload');
} else {
    // If exact regex did not match, let's locate the stylesheets
    const startStr = '<link rel="stylesheet" href="/fonts/fonts.css">';
    const endStr = '<link rel="stylesheet" href="/home-v5.css?v=16.0">';
    const startIdx = html.indexOf(startStr);
    const endIdx = html.indexOf(endStr);
    if (startIdx !== -1 && endIdx !== -1) {
        html = html.slice(0, startIdx) + newCssBlock + html.slice(endIdx + endStr.length);
        console.log('✅ Replaced render-blocking CSS links with slice substitution');
    } else {
        console.warn('⚠️ CSS links block not found');
    }
}

// Replace scripts at the end
const oldScriptsRegex = /<script src="\/global-profile\.js\?v=3"><\/script>[\s\S]*?<script src="\/toast\.js" defer><\/script>/;
const newScriptTag = `<script src="${manifest['home.js']}" defer></script>`;

if (oldScriptsRegex.test(html)) {
    html = html.replace(oldScriptsRegex, newScriptTag);
    console.log('✅ Replaced individual script tags with single minified bundle:', manifest['home.js']);
} else {
    // Alternatively look for global-profile.js to toast.js
    const sIdx = html.indexOf('<script src="/global-profile.js?v=3"></script>');
    const tIdx = html.indexOf('<script src="/toast.js" defer></script>');
    if (sIdx !== -1 && tIdx !== -1) {
        html = html.slice(0, sIdx) + newScriptTag + html.slice(tIdx + '<script src="/toast.js" defer></script>'.length);
        console.log('✅ Replaced script tags with slice substitution');
    } else {
        console.warn('⚠️ Script tags block not found');
    }
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ public/index.html successfully updated with production assets');

