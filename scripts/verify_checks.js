const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');

const checks = [
    { name: 'Single H1', pass: (html.match(/<h1[\s>]/gi) || []).length === 1 },
    { name: 'No /admin/login link', pass: !html.includes('/admin/login') },
    { name: 'No fake 1,842', pass: !html.includes('1,842') },
    { name: 'No fake 340%', pass: !html.includes('340%') },
    { name: 'No fake 100 / 100', pass: !html.includes('100 / 100') },
    { name: 'No fake 52.8 kpps', pass: !html.includes('52.8 kpps') },
    { name: 'No fake 1.1 ms', pass: !html.includes('1.1 ms') },
    { name: 'No OPERATIONAL badge', pass: !html.includes('OPERATIONAL') },
    { name: 'No TLS 1.3 SECURE badge', pass: !html.includes('TLS 1.3 SECURE') },
    { name: 'No VERIFIED ACTIVE badge', pass: !html.includes('VERIFIED ACTIVE') },
    { name: 'Has Explore More section', pass: html.includes('id="explore-more"') },
    { name: 'Has Repositories link', pass: html.includes('https://github.com/Sabbir-Hasan-670?tab=repositories') },
    { name: 'Has Facebook link', pass: html.includes('https://www.facebook.com/sabbirhasan800') },
    { name: 'Has Fiverr TODO', pass: html.includes("TODO: Set Sabbir Hasan's actual Fiverr profile URL") },
    { name: 'Phone item hidden initially', pass: html.includes('id="contact-phone-item" hidden style="display: none;"') },
    { name: 'Location is Dhaka, Bangladesh · Remote', pass: html.includes('Dhaka, Bangladesh · Remote') && !html.includes('Faridpur') },
    { name: 'Primary title is Network Engineer & Cybersecurity', pass: html.includes('Network Engineer &amp; Cybersecurity') },
    { name: 'Has global-profile.js', pass: fs.existsSync(path.join(__dirname, '..', 'public', 'global-profile.js')) },
    { name: 'Has _removed backups', pass: fs.existsSync(path.join(__dirname, '..', '_removed', 'section-04-network.html')) && fs.existsSync(path.join(__dirname, '..', '_removed', 'section-05-cybersecurity.html')) }
];

let allPassed = true;
checks.forEach(c => {
    console.log((c.pass ? '✅' : '❌') + ' ' + c.name);
    if (!c.pass) allPassed = false;
});

if (allPassed) {
    console.log('\n🚀 ALL 19 VERIFICATION CHECKS PASSED PERFECTLY!');
} else {
    process.exit(1);
}

