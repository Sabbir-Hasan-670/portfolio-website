const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '..', 'public', 'main.js');
let js = fs.readFileSync(mainJsPath, 'utf8');

const oldTarget = `window.typingTitles = ['Network Engineer & Cybersecurity', 'Cisco Infrastructure (CCNA)', 'Full-Stack Developer & Systems Architect'];`;
const newReplacement = `window.typingTitles = [
    'Network Engineer & Cybersecurity',
    'Cisco Infrastructure (CCNA)',
    'Full-Stack Developer & Systems Architect',
    'Digital Marketing, SEO & Social Media',
    'Graphic Design & Brand Identity'
];`;

if (js.includes(oldTarget)) {
    js = js.replace(oldTarget, newReplacement);
    fs.writeFileSync(mainJsPath, js, 'utf8');
    console.log('✅ Updated window.typingTitles in public/main.js');
} else {
    console.error('❌ Could not find oldTarget in public/main.js');
}

