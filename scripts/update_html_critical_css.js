const fs = require('fs');

const manifest = JSON.parse(fs.readFileSync('public/dist/manifest.json', 'utf8'));
const criticalCss = fs.readFileSync('public/dist/critical.min.css', 'utf8');

let html = fs.readFileSync('public/index.html', 'utf8');

// Replace critical-css style tag
const criticalStyleRegex = /<style id="critical-css">[\s\S]*?<\/style>/;
html = html.replace(criticalStyleRegex, `<style id="critical-css">\n${criticalCss}\n    </style>`);

// Replace home.*.min.css preload and noscript
html = html.replace(/<link rel="preload" href="\/dist\/home\.[a-z0-9]+\.min\.css" as="style"/,
    `<link rel="preload" href="${manifest['home.css']}" as="style"`);
html = html.replace(/<noscript><link rel="stylesheet" href="\/dist\/home\.[a-z0-9]+\.min\.css"><\/noscript>/,
    `<noscript><link rel="stylesheet" href="${manifest['home.css']}"></noscript>`);

// Replace home.*.min.js script tag
html = html.replace(/<script src="\/dist\/home\.[a-z0-9]+\.min\.js" defer><\/script>/,
    `<script src="${manifest['home.js']}" defer></script>`);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ public/index.html updated with latest CSS and JS bundles:');
console.log('  CSS:', manifest['home.css']);
console.log('  JS: ', manifest['home.js']);
