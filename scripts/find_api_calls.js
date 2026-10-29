const fs = require('fs');
['public/main.js', 'public/home-v5.js'].forEach(f => {
    if (!fs.existsSync(f)) return;
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    console.log(`=== ${f} ===`);
    lines.forEach((l, i) => {
        if (l.includes('fetch(') || l.includes('/api/')) {
            console.log(`${i+1}: ${l.trim()}`);
        }
    });
});

