const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync('public/dist/manifest.json', 'utf8'));
const criticalCss = fs.readFileSync('public/dist/critical.min.css', 'utf8');

let html = fs.readFileSync('public/index.html', 'utf8');
const initialLength = html.length;

// 1. Update <head> stylesheets & preloads
const targetHeadStyles = `    <!-- ===== PERFORMANCE: DNS Prefetch & Preconnect ===== -->
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="https://cdn.simpleicons.org">
    <link rel="dns-prefetch" href="https://github.com">
    <link rel="dns-prefetch" href="https://ghchart.rshah.org">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- ===== FONTS — Elite Typography (Outfit + Plus Jakarta Sans + JetBrains Mono) ===== -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

    <!-- ===== CRITICAL CSS ===== -->
    <link rel="stylesheet" href="/style.css?v=6.0">
    <link rel="stylesheet" href="/home-v5.css?v=16.0">`;

const replacementHeadStyles = `    <!-- ===== PERFORMANCE & SELF-HOSTED FONTS ===== -->
    <link rel="dns-prefetch" href="https://ghchart.rshah.org">
    <link rel="preload" href="/fonts/outfit-600-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/plus-jakarta-sans-400-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" as="image" href="/uploads/hero-portrait-400.webp" type="image/webp" fetchpriority="high">
    <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM context">
    <style id="critical-css">
${criticalCss}
    </style>
    <link rel="preload" href="${manifest['home.css']}" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="${manifest['home.css']}"></noscript>`;

if (html.includes(targetHeadStyles)) {
    html = html.replace(targetHeadStyles, replacementHeadStyles);
    console.log('✅ Replaced external fonts and render-blocking CSS');
} else {
    console.warn('⚠️ targetHeadStyles exact match not found; looking with regex');
    html = html.replace(/<!-- ===== PERFORMANCE: DNS Prefetch & Preconnect ===== -->[\s\S]*?<link rel="stylesheet" href="\/home-v5\.css\?v=16\.0">/, replacementHeadStyles);
}

// 2. Add skip link after <body>
html = html.replace('<body>', '<body>\n\n<a href="#main" class="skip-link">Skip to main content</a>');

// 3. Wrap Navbar in <header role="banner">
const navStart = '<nav class="navbar" id="navbar">';
const navStartRep = '<header role="banner">\n    <nav class="navbar" id="navbar" aria-label="Main Navigation">';
html = html.replace(navStart, navStartRep);

// Wrap end of navbar: before <!-- 01 - HERO -->
const heroComment = '    <!-- 01 - HERO -->';
html = html.replace('    </nav>\n\n' + heroComment, '    </nav>\n    </header>\n\n' + heroComment);

// 4. Wrap sections in <main id="main" class="main-content">
html = html.replace('<div class="main-content">', '');
html = html.replace(heroComment, '<main id="main" class="main-content">\n\n' + heroComment);

// Close </main> before <footer
html = html.replace('    <!-- FOOTER -->\n    <footer class="footer-v5"', '</main>\n\n    <!-- FOOTER -->\n    <footer class="footer-v5" role="contentinfo"');
html = html.replace('</div><!-- end main-content -->', '');

// 5. Update hero portrait to responsive picture with 400x400
const oldHeroImg = '<img id="hero-portrait" class="portrait-photo" src="/uploads/1789156728823-569590328.jpg" alt="Sabbir Hasan portrait" loading="eager" decoding="async" fetchpriority="high">';
const newHeroImg = `<picture>
                        <source srcset="/uploads/hero-portrait-400.avif" type="image/avif">
                        <source srcset="/uploads/hero-portrait-400.webp" type="image/webp">
                        <img id="hero-portrait" class="portrait-photo" src="/uploads/hero-portrait-400.webp" alt="Sabbir Hasan portrait" width="400" height="400" decoding="async" fetchpriority="high">
                    </picture>`;
if (html.includes(oldHeroImg)) {
    html = html.replace(oldHeroImg, newHeroImg);
    console.log('✅ Updated hero portrait to responsive <picture>');
}

// 6. Update about image to width/height 400
html = html.replace('src="/sabbir_profile.jpg" alt="Sabbir Hasan in laboratory" loading="lazy"',
    'src="/uploads/sabbir_profile-400.webp" alt="Sabbir Hasan in laboratory" width="400" height="400" loading="lazy" decoding="async"');

// 7. Update devicon URLs to local icons
html = html.replace(/https:\/\/cdn\.jsdelivr\.net\/gh\/devicons\/devicon\/icons\/html5\/html5-original\.svg/g, '/icons/html5.svg');
html = html.replace(/https:\/\/cdn\.jsdelivr\.net\/gh\/devicons\/devicon\/icons\/css3\/css3-original\.svg/g, '/icons/css3.svg');
html = html.replace(/https:\/\/cdn\.jsdelivr\.net\/gh\/devicons\/devicon\/icons\/javascript\/javascript-original\.svg/g, '/icons/javascript.svg');
html = html.replace(/https:\/\/cdn\.jsdelivr\.net\/gh\/devicons\/devicon\/icons\/nodejs\/nodejs-original\.svg/g, '/icons/nodejs.svg');
html = html.replace(/https:\/\/cdn\.jsdelivr\.net\/gh\/devicons\/devicon\/icons\/express\/express-original\.svg/g, '/icons/express.svg');
html = html.replace(/https:\/\/cdn\.jsdelivr\.net\/gh\/devicons\/devicon\/icons\/mysql\/mysql-original\.svg/g, '/icons/mysql.svg');
html = html.replace(/https:\/\/cdn\.jsdelivr\.net\/gh\/devicons\/devicon\/icons\/react\/react-original\.svg/g, '/icons/react.svg');
html = html.replace(/<img src="\/icons\/([a-z0-9]+)\.svg" alt="([^"]+)">/g, '<img src="/icons/$1.svg" alt="$2" width="20" height="20" loading="lazy">');

// 8. Update development github graph to 663x104
html = html.replace('<img id="development-github-graph" alt="GitHub contribution activity" width="720" height="170" loading="lazy" decoding="async">',
    '<img id="development-github-graph" alt="GitHub contribution activity" width="663" height="104" loading="lazy" decoding="async">');

// 9. Update footer h4 to h3
html = html.replace(/<h4 class="footer-col-title">/g, '<h3 class="footer-col-title">');
html = html.replace(/<\/h4>(\s*<ul class="footer-links-list">)/g, '</h3>$1');

// 10. Update honeypot label
html = html.replace('<label>// LEAVE THIS EMPTY</label>', '<label for="website_url">// LEAVE THIS EMPTY</label>');

// 11. Replace bottom scripts with bundled script
const oldBottomScripts = `<script src="/global-profile.js?v=3"></script>
<script src="/main.js?v=7.0" defer></script>
<script src="/home-v5.js?v=9.0" defer></script>
<script src="/toast.js" defer></script>`;
const newBottomScript = `<script src="${manifest['home.js']}" defer></script>`;

if (html.includes(oldBottomScripts)) {
    html = html.replace(oldBottomScripts, newBottomScript);
    console.log('✅ Replaced bottom scripts with bundled script');
} else {
    console.warn('⚠️ oldBottomScripts exact match not found; looking with regex');
    html = html.replace(/<script src="\/global-profile\.js\?v=3"><\/script>\r?\n<script src="\/main\.js\?v=7\.0" defer><\/script>\r?\n<script src="\/home-v5\.js\?v=9\.0" defer><\/script>\r?\n<script src="\/toast\.js" defer><\/script>/, newBottomScript);
}

// Safety check: ensure file length hasn't collapsed
console.log('Original length:', initialLength, 'New length:', html.length);
if (html.length < 50000) {
    throw new Error('Safety check failed: new HTML is suspiciously small (' + html.length + ' bytes)! Aborting write.');
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ public/index.html successfully updated and verified');

