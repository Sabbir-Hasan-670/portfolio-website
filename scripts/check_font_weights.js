const fs = require('fs');

['public/style.css', 'public/home-v5.css'].forEach(file => {
    const css = fs.readFileSync(file, 'utf8');
    const outfitWeights = new Set([...css.matchAll(/font-weight:\s*([0-9]+)/g)].map(m => m[1]));
    console.log(`${file} font-weights:`, Array.from(outfitWeights).sort());
});

