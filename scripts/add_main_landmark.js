const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

const heroRegex = /<!-- HERO[—\s-]+dynamic profile content is hydrated from the existing profile API -->/;
const footerRegex = /<!-- ===== ARCHITECTURAL SYSTEM FOOTER ===== -->/;

if (heroRegex.test(html) && footerRegex.test(html)) {
    html = html.replace(heroRegex, '<main id="main" class="main-content">\n\n$&');
    html = html.replace(footerRegex, '</main>\n\n    $&');
    fs.writeFileSync('public/index.html', html, 'utf8');
    console.log('✅ Added <main id="main"> and </main>');
} else {
    console.log('Hero regex test:', heroRegex.test(html), 'Footer regex test:', footerRegex.test(html));
}
