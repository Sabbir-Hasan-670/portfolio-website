const fs = require('fs');

// 1. fonts.css: font-display: swap
let fontsCss = fs.readFileSync('public/fonts/fonts.css', 'utf8');
fontsCss = fontsCss.replace(/font-display:\s*optional;/g, 'font-display: swap;');
fs.writeFileSync('public/fonts/fonts.css', fontsCss, 'utf8');
console.log('✅ fonts.css restored to font-display: swap');

// 2. home-v5.css: fix terminal deck in the main declaration
let homeCss = fs.readFileSync('public/home-v5.css', 'utf8');

homeCss = homeCss.replace(
`.hero-terminal-deck {
    width: 100%;
    max-width: 550px;
    background: rgba(10, 15, 26, 0.92) !important;`,
`.hero-terminal-deck {
    width: 100%;
    max-width: 550px;
    min-height: 80px;
    contain: layout style;
    background: rgba(10, 15, 26, 0.92) !important;`
);

homeCss = homeCss.replace(
`.terminal-deck-content {
    display: flex !important;
    align-items: center !important;
    flex-wrap: nowrap !important;
    gap: 8px !important;
    padding: 10px 14px !important;
    font: 600 clamp(0.85rem, 1.2vw, 0.98rem) var(--font-mono) !important;
    color: #f8fafc !important;
    min-height: 2.6rem !important;`,
`.terminal-deck-content {
    display: flex !important;
    align-items: center !important;
    flex-wrap: nowrap !important;
    gap: 8px !important;
    padding: 10px 14px !important;
    font: 600 clamp(0.85rem, 1.2vw, 0.98rem) var(--font-mono) !important;
    color: #f8fafc !important;
    min-height: 38px !important;
    contain: layout style;`
);

fs.writeFileSync('public/home-v5.css', homeCss, 'utf8');
console.log('✅ home-v5.css updated with layout containment and reserved dimensions');

