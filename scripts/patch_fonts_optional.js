const fs = require('fs');

// 1. Update font-display: optional in fonts.css
let fontsCss = fs.readFileSync('public/fonts/fonts.css', 'utf8');
fontsCss = fontsCss.replace(/font-display:\s*swap;/g, 'font-display: optional;');
fs.writeFileSync('public/fonts/fonts.css', fontsCss, 'utf8');
console.log('✅ Updated fonts.css with font-display: optional');

// 2. Add all critical font preloads in index.html
let html = fs.readFileSync('public/index.html', 'utf8');
const targetPreloadBlock = `<link rel="dns-prefetch" href="https://ghchart.rshah.org">
    <link rel="preload" href="/fonts/outfit-600-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/plus-jakarta-sans-400-normal.woff2" as="font" type="font/woff2" crossorigin>`;

const newPreloadBlock = `<link rel="dns-prefetch" href="https://ghchart.rshah.org">
    <link rel="preload" href="/fonts/jetbrains-mono-400-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/jetbrains-mono-600-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/outfit-600-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/plus-jakarta-sans-400-normal.woff2" as="font" type="font/woff2" crossorigin>`;

if (html.includes(targetPreloadBlock)) {
    html = html.replace(targetPreloadBlock, newPreloadBlock);
    console.log('✅ Replaced font preload block in index.html');
} else {
    console.warn('⚠️ targetPreloadBlock not matched exactly; checking with regex');
    html = html.replace(/<link rel="dns-prefetch" href="https:\/\/ghchart\.rshah\.org">[\s\S]*?<link rel="preload" href="\/fonts\/plus-jakarta-sans-400-normal\.woff2" as="font" type="font\/woff2" crossorigin>/, newPreloadBlock);
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ public/index.html updated with complete font preloads');

