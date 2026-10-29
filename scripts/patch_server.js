const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

// 1. Lower compression threshold to 512
code = code.replace(/threshold:\s*1024,/, 'threshold: 512,');

// 2. Add COOP and CSP security headers if not present
if (!code.includes('Cross-Origin-Opener-Policy')) {
    const target = "res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');";
    const addition = `res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');\n    res.set('Cross-Origin-Opener-Policy', 'same-origin');\n    res.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://ghchart.rshah.org; frame-ancestors 'self'; base-uri 'self'; form-action 'self'");`;
    code = code.replace(target, addition);
}

// 3. Add static caching routes for /dist, /fonts, /icons
if (!code.includes("app.use('/dist'")) {
    const distStatic = `
// Static fingerprinted bundles — cache 1 year immutable
app.use('/dist', express.static(path.join(__dirname, 'public/dist'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res) => {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
}));

// Self-hosted fonts — cache 1 year immutable
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res) => {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
}));

// Local tech icons — cache 1 year immutable
app.use('/icons', express.static(path.join(__dirname, 'public/icons'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res) => {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
}));
`;
    code = code.replace("app.use('/uploads',", distStatic + "\napp.use('/uploads',");
}

// 4. Add cached GitHub graph proxy & public site-sections route
if (!code.includes("app.get('/api/github-graph'")) {
    const ghGraphRoute = `
// Cached GitHub Contribution Graph Proxy
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
});

// Public Site Sections API
app.get('/api/site-sections', withCache('site_sections', async () => {
    try {
        const [rows] = await db.query('SELECT * FROM site_sections ORDER BY sort_order ASC');
        return rows || [];
    } catch (err) {
        return [];
    }
}));
`;
    code = code.replace("app.get('/api/profile',", ghGraphRoute + "\napp.get('/api/profile',");
}

// 5. Inlining initial data in sendHtmlWithTracking
if (!code.includes('getHomepageInitialData')) {
    const initialDataHelper = `
async function getHomepageInitialData() {
    try {
        if (!db) return null;
        let profile = apiCache['profile']?.data;
        if (!profile) {
            const [pRows] = await db.query('SELECT * FROM admin_profile LIMIT 1');
            profile = pRows[0] || {};
        }

        let projects = apiCache['projects']?.data;
        if (!projects) {
            const [pList] = await db.query('SELECT * FROM projects ORDER BY id DESC LIMIT 6');
            projects = pList || [];
        }

        let experience = apiCache['experience']?.data;
        if (!experience) {
            const [expRows] = await db.query('SELECT * FROM experience ORDER BY id DESC');
            experience = expRows || [];
        }

        let education = apiCache['education']?.data;
        if (!education) {
            const [eduRows] = await db.query('SELECT * FROM education ORDER BY id DESC');
            education = eduRows || [];
        }

        let certificates = apiCache['certificates']?.data;
        if (!certificates) {
            const [certRows] = await db.query('SELECT * FROM certificates ORDER BY id DESC');
            certificates = certRows || [];
        }

        let site_sections = apiCache['site_sections']?.data;
        if (!site_sections) {
            try {
                const [secRows] = await db.query('SELECT * FROM site_sections ORDER BY sort_order ASC');
                site_sections = secRows || [];
            } catch(e) {
                site_sections = [];
            }
        }

        return {
            profile,
            projects: Array.isArray(projects) ? projects.slice(0, 6) : [],
            experience,
            education,
            certificates,
            site_sections
        };
    } catch (e) {
        return null;
    }
}
`;
    code = code.replace("function sendHtmlWithTracking(req, res, filePath) {", initialDataHelper + "\nfunction sendHtmlWithTracking(req, res, filePath) {");

    // Replace body of sendHtmlWithTracking to inject initialData on index.html
    const oldFnBody = `function sendHtmlWithTracking(req, res, filePath) {
    fs.readFile(filePath, 'utf8', (err, html) => {
        if (err) {
            console.error("Error reading HTML file:", filePath, err.message);
            return res.status(500).send("Error loading page");
        }
        try {
            const finalHtml = injectTrackingIntoHtml(html, req);
            res.set('Content-Type', 'text/html; charset=utf-8');
            res.send(finalHtml);
        } catch (e) {
            res.set('Content-Type', 'text/html; charset=utf-8');
            res.send(html);
        }
    });
}`;
    const newFnBody = `function sendHtmlWithTracking(req, res, filePath) {
    fs.readFile(filePath, 'utf8', async (err, html) => {
        if (err) {
            console.error("Error reading HTML file:", filePath, err.message);
            return res.status(500).send("Error loading page");
        }
        try {
            let finalHtml = injectTrackingIntoHtml(html, req);
            if (filePath.endsWith('index.html')) {
                const initialData = await getHomepageInitialData();
                if (initialData) {
                    const safeJson = JSON.stringify(initialData).replace(/</g, '\\\\u003c');
                    finalHtml = finalHtml.replace('</head>', \`<script id="__INITIAL_DATA__">window.__INITIAL_DATA__ = \${safeJson};</script>\\n</head>\`);
                }
            }
            res.set('Content-Type', 'text/html; charset=utf-8');
            res.send(finalHtml);
        } catch (e) {
            res.set('Content-Type', 'text/html; charset=utf-8');
            res.send(html);
        }
    });
}`;
    code = code.replace(oldFnBody, newFnBody);
}

fs.writeFileSync('server.js', code, 'utf8');
console.log('✅ server.js patched successfully');

