const fs = require('fs');
const path = require('path');
const https = require('https');

const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const icons = [
    { name: 'html5', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
    { name: 'css3', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
    { name: 'javascript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
    { name: 'nodejs', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
    { name: 'express', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg' },
    { name: 'mysql', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
    { name: 'react', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' }
];

async function downloadIcons() {
    for (const icon of icons) {
        const dest = path.join(iconsDir, `${icon.name}.svg`);
        if (!fs.existsSync(dest)) {
            console.log(`Downloading ${icon.name}.svg...`);
            await new Promise((resolve, reject) => {
                https.get(icon.url, res => {
                    const data = [];
                    res.on('data', c => data.push(c));
                    res.on('end', () => {
                        fs.writeFileSync(dest, Buffer.concat(data));
                        resolve();
                    });
                }).on('error', reject);
            });
        }
    }
    console.log('✅ Self-hosted all devicon SVGs into public/icons/');
}

downloadIcons().catch(console.error);

