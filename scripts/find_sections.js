const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const lines = html.split('\n');

const targets = ['projects', 'experience', 'education', 'certificates', 'explore-more', 'development'];
lines.forEach((l, i) => {
    targets.forEach(t => {
        if (l.includes(`id="${t}`) || l.includes(`class="${t}`)) {
            console.log(`Line ${i+1}: ${l.trim().slice(0, 100)}`);
        }
    });
});

