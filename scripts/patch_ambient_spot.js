const fs = require('fs');

let css = fs.readFileSync('public/home-v5.css', 'utf8');

const oldSpot = `.ambient-spot {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    will-change: transform;
}`;

const newSpot = `.ambient-spot {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    contain: strict;
    will-change: transform;
}`;

if (css.includes('.ambient-spot {')) {
    css = css.replace(oldSpot, newSpot);
    fs.writeFileSync('public/home-v5.css', css, 'utf8');
    console.log('✅ Added contain: strict to .ambient-spot in home-v5.css');
}

