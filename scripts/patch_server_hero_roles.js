const fs = require('fs');
let s = fs.readFileSync('server.js', 'utf8');

const oldTarget = `'Network Engineer, Full-Stack Developer, Cybersecurity Specialist, Linux Server Administrator, Technical SEO Specialist',`;
const newTarget = `'Network Engineer & Cybersecurity, Cisco Infrastructure (CCNA), Full-Stack Developer & Systems Architect, Digital Marketing, SEO & Social Media, Graphic Design & Brand Identity',`;

if (s.includes(oldTarget)) {
    s = s.replace(oldTarget, newTarget);
    fs.writeFileSync('server.js', s, 'utf8');
    console.log('✅ Updated default hero_roles seed in server.js');
} else {
    console.log('Target not found in server.js');
}

