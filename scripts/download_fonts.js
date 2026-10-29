const fs = require('fs');
const path = require('path');
const https = require('https');

const fontsDir = path.join(__dirname, '../public/fonts');
if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
}

function fetchUrl(url, headers = {}) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchUrl(res.headers.location, headers).then(resolve).catch(reject);
            }
            const data = [];
            res.on('data', chunk => data.push(chunk));
            res.on('end', () => resolve({ body: Buffer.concat(data), headers: res.headers }));
        }).on('error', reject);
    });
}

async function downloadAndGenerateFonts() {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const fontUrl = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;600&display=swap';

    const { body } = await fetchUrl(fontUrl, { 'User-Agent': ua });
    const cssText = body.toString('utf8');

    // Split on sections
    const sections = cssText.split(/\/\*\s*([a-z0-9-]+)\s*\*\//i);
    const localCssRules = [];
    let count = 0;

    for (let i = 1; i < sections.length; i += 2) {
        const subset = sections[i].toLowerCase();
        const block = sections[i + 1] || '';

        // Prioritize latin subset
        if (subset === 'latin') {
            const familyMatch = block.match(/font-family:\s*['"]?([^'";]+)['"]?/i);
            const weightMatch = block.match(/font-weight:\s*([0-9]+)/i);
            const styleMatch = block.match(/font-style:\s*([^;]+)/i);
            const urlMatch = block.match(/url\((https:\/\/[^)]+\.woff2)\)/i);

            if (familyMatch && weightMatch && urlMatch) {
                const family = familyMatch[1].trim();
                const weight = weightMatch[1].trim();
                const style = styleMatch ? styleMatch[1].trim() : 'normal';
                const remoteUrl = urlMatch[1].trim();

                const cleanFamily = family.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const fileName = `${cleanFamily}-${weight}-${style}.woff2`;
                const destPath = path.join(fontsDir, fileName);

                if (!fs.existsSync(destPath)) {
                    console.log(`Downloading ${fileName}...`);
                    const fontRes = await fetchUrl(remoteUrl);
                    fs.writeFileSync(destPath, fontRes.body);
                }

                localCssRules.push(`@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('/fonts/${fileName}') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`);
                count++;
            }
        }
    }

    const outputCssPath = path.join(__dirname, '../public/fonts/fonts.css');
    fs.writeFileSync(outputCssPath, localCssRules.join('\n\n'), 'utf8');
    console.log(`✅ Downloaded and generated ${count} self-hosted font definitions in /fonts/fonts.css`);
}

downloadAndGenerateFonts().catch(console.error);
