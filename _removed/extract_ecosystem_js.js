const fs = require('fs');
const path = require('path');

const homeJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'home-v5.js'), 'utf8');
const ecoMarker = '// 03 \u2014 TECHNOLOGY ECOSYSTEM: PLANETARY CONSTELLATION & RADAR';
const altMarker = '// 03';

let idx = homeJs.indexOf('03 \u2014 TECHNOLOGY ECOSYSTEM');
if (idx === -1) idx = homeJs.indexOf('TECHNOLOGY ECOSYSTEM');
if (idx !== -1) {
    const commentStart = homeJs.lastIndexOf('// ==', idx);
    const ecoCode = homeJs.substring(commentStart);
    fs.writeFileSync(path.join(__dirname, 'home-v5-technology-ecosystem.js'), ecoCode, 'utf8');
    console.log('Saved home-v5-technology-ecosystem.js (' + ecoCode.length + ' bytes)');
} else {
    console.error('Marker not found in home-v5.js');
}
