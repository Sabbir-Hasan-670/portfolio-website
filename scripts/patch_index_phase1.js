const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../public/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update font and preloads in <head>
const oldFontLinks = `    <!-- ===== PERFORMANCE: DNS Prefetch & Preconnect ===== -->
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="https://cdn.simpleicons.org">
    <link rel="dns-prefetch" href="https://github.com">
    <link rel="dns-prefetch" href="https://ghchart.rshah.org">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- ===== FONTS — Elite Typography (Outfit + Plus Jakarta Sans + JetBrains Mono) ===== -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">`;

const newFontLinks = `    <!-- ===== PERFORMANCE & SELF-HOSTED FONTS ===== -->
    <link rel="dns-prefetch" href="https://ghchart.rshah.org">
    <link rel="preload" href="/fonts/outfit-600-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/plus-jakarta-sans-400-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" as="image" href="/uploads/hero-portrait-400.webp" type="image/webp" fetchpriority="high">
    <link rel="stylesheet" href="/fonts/fonts.css">`;

if (html.includes(oldFontLinks)) {
    html = html.replace(oldFontLinks, newFontLinks);
    console.log('✅ Replaced external Google Fonts with self-hosted WOFF2 and preloads');
} else {
    // If exact block doesn't match, replace the link rel to google fonts
    html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]+rel="stylesheet">/, 
        `<link rel="preload" href="/fonts/outfit-600-normal.woff2" as="font" type="font/woff2" crossorigin>\n    <link rel="preload" href="/fonts/plus-jakarta-sans-400-normal.woff2" as="font" type="font/woff2" crossorigin>\n    <link rel="preload" as="image" href="/uploads/hero-portrait-400.webp" type="image/webp" fetchpriority="high">\n    <link rel="stylesheet" href="/fonts/fonts.css">`);
    html = html.replace('<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">', '');
    console.log('✅ Replaced Google Fonts and added font preloads');
}

// 2. Update Hero Portrait Image
const oldHeroPortrait = `<img id="hero-portrait" src="/uploads/1789156728823-569590328.jpg" alt="Sabbir Hasan, Network Engineer, Cybersecurity specialist and Full-Stack Developer" width="1194" height="1600" fetchpriority="high" decoding="async">`;
const newHeroPortrait = `<picture>
                                <source type="image/avif" srcset="/uploads/hero-portrait-400.avif">
                                <source type="image/webp" srcset="/uploads/hero-portrait-400.webp">
                                <img id="hero-portrait" src="/uploads/hero-portrait-400.webp" alt="Sabbir Hasan, Network Engineer, Cybersecurity specialist and Full-Stack Developer" width="400" height="400" fetchpriority="high" decoding="sync">
                            </picture>`;

if (html.includes(oldHeroPortrait)) {
    html = html.replace(oldHeroPortrait, newHeroPortrait);
    console.log('✅ Updated hero portrait to responsive WebP/AVIF with 400x400 intrinsic dimensions');
} else {
    html = html.replace(/<img id="hero-portrait"[^>]+>/, newHeroPortrait);
    console.log('✅ Replaced hero-portrait with regex');
}

// 3. Update About Section Portrait Image
const oldAboutPortrait = `<img src="/uploads/1789156728823-569590328.jpg" alt="Sabbir Hasan — Network Engineer & Full-Stack Developer" width="800" height="1188" loading="lazy" decoding="async">`;
const newAboutPortrait = `<img src="/uploads/hero-portrait-400.webp" alt="Sabbir Hasan — Network Engineer & Full-Stack Developer" width="400" height="400" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit:cover;">`;

if (html.includes(oldAboutPortrait)) {
    html = html.replace(oldAboutPortrait, newAboutPortrait);
    console.log('✅ Updated about section portrait image');
} else {
    html = html.replace(/<img src="\/uploads\/1789156728823-569590328\.jpg"[^>]+>/, newAboutPortrait);
    console.log('✅ Replaced about portrait by regex');
}

// 4. Update Tech Marquee icons to self-hosted SVGs with explicit 20x20 dimensions
const iconReplacements = [
    { target: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', local: '/icons/html5.svg' },
    { target: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', local: '/icons/css3.svg' },
    { target: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', local: '/icons/javascript.svg' },
    { target: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', local: '/icons/nodejs.svg' },
    { target: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', local: '/icons/express.svg' },
    { target: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', local: '/icons/mysql.svg' },
    { target: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', local: '/icons/react.svg' }
];

iconReplacements.forEach(ic => {
    while (html.includes(ic.target)) {
        html = html.replace(ic.target, ic.local);
    }
});

// Replace width="17" height="17" with width="20" height="20"
html = html.replace(/width="17"\s+height="17"/g, 'width="20" height="20"');
console.log('✅ Replaced devicon CDN URLs with local self-hosted /icons/*.svg');

// 5. Update GitHub graph loading attribute
html = html.replace('id="development-github-graph" alt="GitHub contribution activity" width="720" height="170" loading="eager"',
    'id="development-github-graph" alt="GitHub contribution activity" width="720" height="170" loading="lazy"');
console.log('✅ Set GitHub graph to loading="lazy"');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('🎉 Successfully patched public/index.html!');

