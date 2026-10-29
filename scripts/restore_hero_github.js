const fs = require('fs');

// 1. Restore github-mini-card in public/index.html
let html = fs.readFileSync('public/index.html', 'utf8');

const targetComment = '<!-- GitHub telemetry displayed in dedicated Development Pulse section below -->';
const miniCardHtml = `<!-- Docked Real-Time GitHub Telemetry Activity Card -->
                <div class="github-mini-card">
                    <div class="github-card-head">
                        <span class="gh-live-beacon" aria-hidden="true"></span>
                        <span>GITHUB TELEMETRY // REAL-TIME DISPATCH</span>
                        <b>ACTIVE</b>
                    </div>
                    <img id="github-graph-mini" class="github-graph-img" src="/api/github-graph?color=38bdf8" alt="GitHub Contributions Graph" width="663" height="104" loading="eager" decoding="async">
                    <p id="github-loading" class="github-loading-text">Connecting to GitHub...</p>
                </div>`;

if (html.includes(targetComment)) {
    html = html.replace(targetComment, miniCardHtml);
    console.log('✅ Added github-mini-card under hero portrait in public/index.html');
} else if (!html.includes('id="github-graph-mini"')) {
    // If comment was removed, insert after hero-portrait-wings
    html = html.replace('</div>\n\n                <!-- Tech Stack Marquee', miniCardHtml + '\n            </div>\n\n        <!-- Tech Stack Marquee');
    console.log('✅ Inserted github-mini-card after hero-portrait-wings');
}

fs.writeFileSync('public/index.html', html, 'utf8');

// 2. Update server.js to support color parameter for /api/github-graph
let serverCode = fs.readFileSync('server.js', 'utf8');
const oldGhRoute = `// Cached GitHub Contribution Graph Proxy
let cachedGhSvg = null;
let cachedGhSvgTime = 0;
app.get('/api/github-graph', async (req, res) => {
    res.set('Content-Type', 'image/svg+xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    const now = Date.now();
    if (cachedGhSvg && (now - cachedGhSvgTime < 3600000)) {
        return res.send(cachedGhSvg);
    }
    try {
        const fetchFn = globalThis.fetch || require('node-fetch');
        const ghRes = await fetchFn('https://ghchart.rshah.org/d5a34a/Sabbir-Hasan-670');
        if (ghRes.ok) {
            cachedGhSvg = await ghRes.text();
            cachedGhSvgTime = now;
            return res.send(cachedGhSvg);
        }
    } catch(e) {}
    if (cachedGhSvg) return res.send(cachedGhSvg);
    res.send('<svg xmlns="http://www.w3.org/2000/svg" width="663" height="104" viewBox="0 0 663 104"></svg>');
});`;

const newGhRoute = `// Cached GitHub Contribution Graph Proxy (Supports Cyan and Amber)
const ghSvgCache = {};
app.get('/api/github-graph', async (req, res) => {
    res.set('Content-Type', 'image/svg+xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    const color = (req.query.color === 'cyan' || req.query.color === '38bdf8') ? '38bdf8' : 'd5a34a';
    const now = Date.now();
    if (ghSvgCache[color] && (now - ghSvgCache[color].time < 3600000)) {
        return res.send(ghSvgCache[color].svg);
    }
    try {
        const fetchFn = globalThis.fetch || require('node-fetch');
        const ghRes = await fetchFn(\`https://ghchart.rshah.org/\${color}/Sabbir-Hasan-670\`);
        if (ghRes.ok) {
            const svg = await ghRes.text();
            ghSvgCache[color] = { svg, time: now };
            return res.send(svg);
        }
    } catch(e) {}
    if (ghSvgCache[color]) return res.send(ghSvgCache[color].svg);
    res.send('<svg xmlns="http://www.w3.org/2000/svg" width="663" height="104" viewBox="0 0 663 104"></svg>');
});`;

if (serverCode.includes('// Cached GitHub Contribution Graph Proxy')) {
    serverCode = serverCode.replace(oldGhRoute, newGhRoute);
    fs.writeFileSync('server.js', serverCode, 'utf8');
    console.log('✅ server.js updated with color-supported github-graph route');
}

// 3. Update main.js to use /api/github-graph?color=38bdf8 for github-graph-mini
let mainJs = fs.readFileSync('public/main.js', 'utf8');
mainJs = mainJs.replace(
    'loadGraphWithTimeout(graphImg, graphLoading, `https://ghchart.rshah.org/38bdf8/${username}`);',
    "loadGraphWithTimeout(graphImg, graphLoading, '/api/github-graph?color=38bdf8');"
);
fs.writeFileSync('public/main.js', mainJs, 'utf8');
console.log('✅ public/main.js updated to load /api/github-graph?color=38bdf8');

