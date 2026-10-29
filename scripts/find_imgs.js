const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const imgMatches = [...html.matchAll(/<img[^>]+>/gi)];
console.log(`Found ${imgMatches.length} <img> tags:`);
imgMatches.forEach((m, idx) => {
    console.log(`\n[${idx + 1}] ${m[0]}`);
});

