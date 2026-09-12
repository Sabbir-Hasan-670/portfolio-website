const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const { renderBlogListingHtml, renderArticleHtml, stripHtml } = require('./blogRenderer');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const session = require('express-session');
const fs = require('fs');
const os = require('os');
const si = require('systeminformation');
const cron = require('node-cron');
const compression = require('compression');

dotenv.config();

const app = express();
app.set('trust proxy', 1);

// ==========================================
// ⚡ GZIP COMPRESSION (Speed Boost)
// ==========================================
app.use(compression({
    level: 6,
    threshold: 1024, // Only compress responses > 1kb
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    }
}));

// ==========================================
// 🔒 SECURITY & PERFORMANCE HEADERS
// ==========================================
app.use((req, res, next) => {
    // Security headers
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
});

app.use(express.json());

// Remove .html from URLs (301 Permanent Redirect)
app.use((req, res, next) => {
    if (req.path.endsWith('.html') && req.path.length > 5) {
        const newPath = req.path.slice(0, -5);
        const query = req.url.slice(req.path.length);
        return res.redirect(301, newPath + query);
    }
    next();
});

// Redirect /admin to /admin/login
app.get('/admin', (req, res) => {
    res.redirect(301, '/admin/login');
});

// ==========================================
// 📦 SMART STATIC FILE SERVING WITH CACHING
// ==========================================

// Uploaded images — cache 30 days
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
    maxAge: '30d',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        res.set('Cache-Control', 'public, max-age=2592000, immutable');
    }
}));

// llms.txt — for AI search engines & LLMs (GEO)
app.get('/llms.txt', (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=86400');
    res.sendFile(path.join(__dirname, 'public/llms.txt'));
});

// robots.txt
app.get('/robots.txt', (req, res) => {
    const host = 'https://sabbirhasan.com';
    res.set('Content-Type', 'text/plain');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /login
Disallow: /dashboard
Disallow: /api
Disallow: /api/

# AI & LLM Search Assistants (GEO)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${host}/sitemap.xml
`);
});

// sitemap.xml — dynamic & comprehensive
app.get('/sitemap.xml', async (req, res) => {
    const host = 'https://sabbirhasan.com';
    const now = new Date().toISOString().split('T')[0];
    let urls = [
        { loc: `${host}/`,                         priority: '1.0', changefreq: 'weekly'  },
        { loc: `${host}/about`,                    priority: '0.8', changefreq: 'monthly' },
        { loc: `${host}/resume`,                   priority: '0.8', changefreq: 'monthly' },
        { loc: `${host}/blog`,                     priority: '0.9', changefreq: 'daily'   },
        { loc: `${host}/tools`,                    priority: '0.8', changefreq: 'monthly' },
        { loc: `${host}/tools/subnet-calculator`,  priority: '0.8', changefreq: 'monthly' },
        { loc: `${host}/tools/dev-utilities`,      priority: '0.7', changefreq: 'monthly' },
        { loc: `${host}/contact`,                  priority: '0.6', changefreq: 'monthly' },
        { loc: `${host}/sitemap`,                  priority: '0.8', changefreq: 'weekly'  },
        { loc: `${host}/streams`,                  priority: '0.9', changefreq: 'weekly'  },
        { loc: `${host}/Learn/Learn-CCNA/learn-ccna`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${host}/Learn/Learn-JS/learn-js`,  priority: '0.7', changefreq: 'monthly' },
        { loc: `${host}/Learn/Learn-MySQL/learn-mysql`, priority: '0.7', changefreq: 'monthly' },
        { loc: `${host}/Learn/Learn-English/learn-english`, priority: '0.6', changefreq: 'monthly' }
    ];
    try {
        const [posts] = await db.query('SELECT slug, id, updated_at, created_at FROM blog_posts WHERE status="published" ORDER BY created_at DESC');
        posts.forEach(post => {
            const slug = post.slug || post.id;
            const dateToUse = post.updated_at || post.created_at;
            const lastmod = dateToUse ? new Date(dateToUse).toISOString().split('T')[0] : now;
            urls.push({ loc: `${host}/blog/${slug}`, priority: '0.7', changefreq: 'monthly', lastmod });
        });

        const [cats] = await db.query('SELECT DISTINCT category FROM blog_posts WHERE status="published" AND category IS NOT NULL AND category != ""');
        cats.forEach(c => {
            urls.push({ loc: `${host}/blog/category/${encodeURIComponent(c.category.toLowerCase())}`, priority: '0.6', changefreq: 'weekly', lastmod: now });
        });
    } catch (e) { /* DB not available, fallback */ }

    const urlEntries = urls.map(u => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('');

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`);
});

// sitemap.xsl — human styling for XML sitemap
app.get('/sitemap.xsl', (req, res) => {
    res.set('Content-Type', 'text/xsl; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=86400');
    res.sendFile(path.join(__dirname, 'public/sitemap.xsl'));
});


// ==========================================
// 🚀 SERVER-SIDE CRAWLABLE BLOG ROUTES (SSR)
// ==========================================

// Helper to fetch and render blog listing
async function handleBlogListing(req, res, pageParam, categoryParam) {
    const siteUrl = 'https://sabbirhasan.com';
    const limit = 12;
    const page = Math.max(1, parseInt(pageParam || req.query.page || '1', 10));
    const offset = (page - 1) * limit;

    try {
        let countQuery = 'SELECT COUNT(*) as total FROM blog_posts WHERE status = "published"';
        let postsQuery = 'SELECT id, title, slug, category, excerpt, content, image_path, reading_time, created_at, updated_at FROM blog_posts WHERE status = "published"';
        let queryParams = [];

        if (categoryParam) {
            countQuery += ' AND LOWER(category) = LOWER(?)';
            postsQuery += ' AND LOWER(category) = LOWER(?)';
            queryParams.push(categoryParam);
        }

        postsQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

        const [countRes] = await db.query(countQuery, queryParams);
        const totalPosts = countRes[0]?.total || 0;
        const totalPages = Math.max(1, Math.ceil(totalPosts / limit));

        const [posts] = await db.query(postsQuery, [...queryParams, limit, offset]);
        const [categories] = await db.query('SELECT category, COUNT(*) as count FROM blog_posts WHERE status = "published" AND category IS NOT NULL AND category != "" GROUP BY category ORDER BY count DESC');

        const html = renderBlogListingHtml({
            posts,
            totalPosts,
            currentPage: page,
            totalPages,
            currentCategory: categoryParam || null,
            categories,
            siteUrl
        });

        res.set('Content-Type', 'text/html; charset=utf-8');
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.send(html);
    } catch (err) {
        console.error("Blog Listing SSR Error:", err.message);
        try {
            const fallbackHtml = renderBlogListingHtml({
                posts: [],
                totalPosts: 0,
                currentPage: 1,
                totalPages: 1,
                currentCategory: categoryParam || null,
                categories: [],
                siteUrl
            });
            res.set('Content-Type', 'text/html; charset=utf-8');
            res.send(fallbackHtml);
        } catch (renderErr) {
            res.status(500).send("<h1>Error loading blog</h1><p>Please try again later.</p>");
        }
    }
}

// Listing Routes
app.get('/blog', (req, res) => handleBlogListing(req, res, req.query.page, null));
app.get('/blog/page/:page', (req, res) => handleBlogListing(req, res, req.params.page, null));
app.get('/blog/category/:category', (req, res) => handleBlogListing(req, res, 1, req.params.category));
app.get('/blog/category/:category/page/:page', (req, res) => handleBlogListing(req, res, req.params.page, req.params.category));

// Backward compatibility: 301 Redirect old /article?slug=... to /blog/:slug
app.get('/article', async (req, res) => {
    const { slug, id } = req.query;
    if (slug) {
        return res.redirect(301, '/blog/' + encodeURIComponent(slug));
    }
    if (id) {
        try {
            const [rows] = await db.query('SELECT slug FROM blog_posts WHERE id = ?', [id]);
            if (rows.length > 0 && rows[0].slug) {
                return res.redirect(301, '/blog/' + encodeURIComponent(rows[0].slug));
            }
        } catch(e) {}
    }
    return res.redirect(301, '/blog');
});

// Single Article SSR Route
app.get('/blog/:slug', async (req, res) => {
    const siteUrl = 'https://sabbirhasan.com';
    const slug = req.params.slug;

    try {
        const [rows] = await db.query(
            'SELECT * FROM blog_posts WHERE (slug = ? OR id = ?) LIMIT 1',
            [slug, isNaN(slug) ? 0 : parseInt(slug, 10)]
        );

        if (rows.length === 0) {
            return res.status(404).send('<!DOCTYPE html><html><head><title>Article Not Found | Sabbir Hasan</title><link rel="stylesheet" href="/style.css"></head><body style="text-align:center; padding:5rem 1rem; font-family:sans-serif; background:#060913; color:#fff;"><h1>404 — Article Not Found</h1><p style="color:#94a3b8;">The article you are looking for does not exist or has been relocated.</p><a href="/blog" style="display:inline-block; margin-top:1.5rem; color:#c8ff00; text-decoration:none; font-weight:700;">← Back to Blog</a></body></html>');
        }

        const post = rows[0];

        // Fetch related posts from same category
        let relatedPosts = [];
        try {
            const [rel] = await db.query(
                'SELECT id, title, slug, category, excerpt, content, image_path, reading_time FROM blog_posts WHERE category = ? AND id != ? AND status = "published" ORDER BY created_at DESC LIMIT 3',
                [post.category || '', post.id]
            );
            relatedPosts = rel;
        } catch(e) {}

        // Fetch previous and next articles for bottom navigation
        let previousPost = null;
        let nextPost = null;
        try {
            const [prevRows] = await db.query(
                'SELECT id, title, slug FROM blog_posts WHERE id < ? AND status = "published" ORDER BY id DESC LIMIT 1',
                [post.id]
            );
            if (prevRows.length > 0) previousPost = prevRows[0];

            const [nextRows] = await db.query(
                'SELECT id, title, slug FROM blog_posts WHERE id > ? AND status = "published" ORDER BY id ASC LIMIT 1',
                [post.id]
            );
            if (nextRows.length > 0) nextPost = nextRows[0];
        } catch(e) {}

        // Fetch author avatar from profile table
        let authorImage = '/uploads/sabbir-secondary-blue.webp';
        try {
            const [profileRows] = await db.query('SELECT profile_pic_path FROM admin_profile WHERE id = 1');
            if (profileRows[0]?.profile_pic_path) {
                authorImage = profileRows[0].profile_pic_path;
            }
        } catch(e) {}

        const html = renderArticleHtml({ post, relatedPosts, previousPost, nextPost, siteUrl, authorImage });
        res.set('Content-Type', 'text/html; charset=utf-8');
        res.set('Cache-Control', 'public, max-age=3600, must-revalidate');
        res.send(html);
    } catch (err) {
        console.error("Single Blog SSR Error:", err.message);
        res.status(500).send("<h1>Error loading article</h1>");
    }
});

// Fast Parameterized Live Search
app.get('/api/blog/search', async (req, res) => {
    const q = req.query.q ? req.query.q.trim() : '';
    if (!q || q.length < 2) return res.json([]);

    try {
        const wild = '%' + q + '%';
        const [rows] = await db.query(
            'SELECT id, title, slug, category, excerpt, image_path, created_at FROM blog_posts WHERE status = "published" AND (title LIKE ? OR category LIKE ? OR excerpt LIKE ? OR content LIKE ?) ORDER BY created_at DESC LIMIT 15',
            [wild, wild, wild, wild]
        );
        res.json(rows);
    } catch (err) {
        console.error("Search API Error:", err.message);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Dedicated Clean Pages
app.get('/resume', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/resume.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/about.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/projects.html'));
});

app.get('/project/:slug', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/project.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/contact.html'));
});

app.get('/tools', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/tools.html'));
});

app.get('/tools/subnet-calculator', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/tools/subnet-calculator.html'));
});

app.get('/tools/dev-utilities', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/tools/dev-utilities.html'));
});

app.get('/streams', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/streams.html'));
});

app.get('/sitemap', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/sitemap.html'));
});

// Static files with smart caching per file type
app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html'],
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        // CSS, JS, HTML — no-cache to ensure immediate update delivery
        if (filePath.endsWith('.css') || filePath.endsWith('.js') || filePath.endsWith('.html')) {
            res.set('Cache-Control', 'no-cache, must-revalidate');
        }
        // Default — no cache for unknown types
        else {
            res.set('Cache-Control', 'no-cache');
        }
    }
}));

// Sessions (The Lock)
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));

const requireAuth = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) next();
    else res.status(403).json({ error: 'Access denied.' });
};

// ==========================================
// 🛡️ SECURE SMTP TRANSPORTER CONFIGURATION
// ==========================================
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Nodemailer SMTP Handshake Failed:", error.message);
    } else {
        console.log("⚡ Nodemailer SMTP Relay is fully active and authenticated!");
    }
});

// Multer (File Uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// Database
const db = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    connectionLimit: 100,
    queueLimit: 0,
    waitForConnections: true
});


// ==========================================
// 🛡️ SECURITY & SLUG HELPERS
// ==========================================
const loginAttempts = new Map();
function rateLimit(windowMs, maxRequests) {
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();
        const record = loginAttempts.get(ip) || { count: 0, resetTime: now + windowMs };

        if (now > record.resetTime) {
            record.count = 1;
            record.resetTime = now + windowMs;
        } else {
            record.count++;
        }

        loginAttempts.set(ip, record);

        if (record.count > maxRequests) {
            return res.status(429).json({ error: 'Too many requests. Please try again later.' });
        }
        next();
    };
}

async function ensureUniqueSlug(baseSlug, currentId = null) {
    let slug = createSlug(baseSlug || 'post');
    if (!slug) slug = 'article';
    let counter = 1;
    while (true) {
        const checkSlug = counter === 1 ? slug : `${slug}-${counter}`;
        let query = 'SELECT id FROM blog_posts WHERE slug = ?';
        let params = [checkSlug];
        if (currentId) {
            query += ' AND id != ?';
            params.push(currentId);
        }
        const [existing] = await db.query(query, params);
        if (existing.length === 0) {
            return checkSlug;
        }
        counter++;
    }
}

function calculateReadingTime(content) {
    const text = (content || '').replace(/<[^>]*>?/gm, '').trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function generateExcerpt(content, maxLength = 160) {
    const text = (content || '').replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function createSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '') 
        .replace(/\s+/g, '-')        
        .replace(/-+/g, '-');        
}

function extractYouTubeId(url) {
    if (!url) return null;
    const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/);
    return match ? match[1] : null;
}

// ==========================================
// 🚀 GITHUB CACHE SYSTEM & AUTOMATIC CRON JOB
// ==========================================
let cachedGithubProjects = []; 

async function updateGithubCache() {
    if (!process.env.GITHUB_USERNAME) return;
    console.log("⏳ Fetching fresh data from GitHub API...");
    try {
        const headers = process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {};
        // If we have a token, use /user/repos to get ALL (including private), else fallback to public only
        const endpoint = process.env.GITHUB_TOKEN 
            ? `https://api.github.com/user/repos?sort=updated&per_page=10&visibility=all` 
            : `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos?sort=updated&per_page=10`;
            
        const ghRes = await fetch(endpoint, { headers });
        
        if (ghRes.ok) {
            const repos = await ghRes.json();
            const activeRepos = repos.filter(repo => !repo.fork);
            
            cachedGithubProjects = await Promise.all(activeRepos.map(async (repo) => {
                let languageHTML = '';
                try {
                    const langRes = await fetch(repo.languages_url, { headers });
                    if (langRes.ok) {
                        const languages = await langRes.json();
                        const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
                        
                        if (totalBytes > 0) {
                            languageHTML = '<div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; margin-bottom: 15px;">';
                            for (const [lang, bytes] of Object.entries(languages)) {
                                const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                                languageHTML += `<span style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.1); color: #818cf8; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; letter-spacing: 0.5px;">${lang} ${percentage}%</span>`;
                            }
                            languageHTML += '</div>';
                        }
                    }
                } catch(e) {}

                return {
                    id: 'gh-' + repo.id,
                    title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
                    description: repo.description || (repo.private ? 'A private project hosted on GitHub.' : 'A project hosted on GitHub.'),
                    github_url: repo.private ? '' : repo.html_url,
                    live_url: repo.homepage || '',
                    image_path: '', 
                    languages: languageHTML
                };
            }));
            console.log("✅ GitHub Cache updated successfully!");
        }
    } catch (ghErr) {
        console.error("❌ GitHub cron fetch failed:", ghErr.message);
    }
}

cron.schedule('0 0,6,12,18 * * *', () => {
    updateGithubCache();
});

updateGithubCache();

// ==========================================
// PUBLIC API ROUTES
// ==========================================
app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simple in-memory cache to prevent DB connection pool exhaustion on heavy public traffic
const apiCache = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache

function invalidateApiCache(key) {
    if (key) {
        delete apiCache[key];
    } else {
        Object.keys(apiCache).forEach(k => delete apiCache[k]);
    }
}

function deleteOldUpload(filePath) {
    if (!filePath || typeof filePath !== 'string') return;
    const cleanPath = filePath.trim();
    if (!cleanPath) return;

    // Never delete static base template assets
    const defaultAssets = [
        'sabbir-secondary-blue.webp',
        'sabbir-hero-orange.jpeg',
        'sabbir-hero-portrait.jpeg',
        'hero-portrait-3d.png',
        'default-avatar.webp',
        'default-avatar.jpg'
    ];
    const filename = path.basename(cleanPath);
    if (defaultAssets.includes(filename)) {
        return;
    }

    const relativeClean = cleanPath.replace(/^\/+/, '');
    const absolutePath = path.join(__dirname, 'public', relativeClean);

    try {
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            console.log("🗑️ Successfully deleted old upload:", filename);
        }
        const ext = path.extname(absolutePath);
        if (ext && ext.toLowerCase() !== '.webp') {
            const webpPath = absolutePath.slice(0, -ext.length) + '.webp';
            if (fs.existsSync(webpPath)) {
                fs.unlinkSync(webpPath);
                console.log("🗑️ Successfully deleted old upload counterpart:", path.basename(webpPath));
            }
        }
    } catch (err) {
        console.error("⚠️ Failed to delete old upload " + absolutePath + ":", err.message);
    }
}

function withCache(key, fn) {
    return async (req, res) => {
        const now = Date.now();
        if (apiCache[key] && apiCache[key].expiry > now) {
            return res.json(apiCache[key].data);
        }
        try {
            const data = await fn(req, res);
            apiCache[key] = { expiry: now + CACHE_TTL, data };
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch' });
        }
    };
}

app.get('/api/profile', withCache('profile', async () => {
    const [rows] = await db.query('SELECT * FROM admin_profile LIMIT 1');
    return rows[0] || {};
}));

app.get('/api/experience', withCache('experience', async () => {
    try {
        const [rows] = await db.query('SELECT * FROM experience ORDER BY id DESC');
        return rows || [];
    } catch (e) {
        return [];
    }
}));

app.get('/api/projects', withCache('projects', async () => {
    const [dbProjects] = await db.query('SELECT * FROM projects ORDER BY id DESC');
    
    // Inject github_images and is_pinned into cachedGithubProjects
    const [images] = await db.query('SELECT * FROM github_images');
    const imageMap = {};
    const pinMap = {};
    const pinnedAtMap = {};
    const liveUrlMap = {};
    images.forEach(img => {
        imageMap[img.repo_id] = img.image_path;
        pinMap[img.repo_id] = img.is_pinned;
        pinnedAtMap[img.repo_id] = img.pinned_at;
        liveUrlMap[img.repo_id] = img.live_url;
    });
    
    const ghProjectsWithImages = cachedGithubProjects.map(proj => {
        return {
            ...proj,
            image_path: imageMap[proj.id] || proj.image_path,
            is_pinned: pinMap[proj.id] ? 1 : 0,
            pinned_at: pinnedAtMap[proj.id] || null,
            live_url: liveUrlMap[proj.id] || proj.live_url
        };
    });
    
    const allProjects = [...dbProjects, ...ghProjectsWithImages];
    
    // Sort: Pinned first (sorted by pinned_at DESC so recently pinned goes to top), then by date (created_at) descending
    allProjects.sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        
        if (a.is_pinned && b.is_pinned) {
            const pinA = new Date(a.pinned_at || 0).getTime();
            const pinB = new Date(b.pinned_at || 0).getTime();
            return pinA - pinB; // Oldest pins at the top
        }
        
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
    });
    
    return allProjects;
}));

app.get(['/api/projects/:identifier', '/api/projects/slug/:identifier'], async (req, res) => {
    try {
        const idParam = String(req.params.identifier || '').trim().toLowerCase();
        const [dbProjects] = await db.query('SELECT * FROM projects');
        const [images] = await db.query('SELECT * FROM github_images');
        const imageMap = {};
        images.forEach(img => { imageMap[img.repo_id] = img.image_path; });
        const all = [
            ...dbProjects,
            ...cachedGithubProjects.map(p => ({ ...p, image_path: imageMap[p.id] || p.image_path }))
        ];
        const match = all.find(p => {
            const pSlug = String(p.repo_slug || p.title || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            return String(p.id).toLowerCase() === idParam || pSlug === idParam;
        });
        if (match) return res.json(match);
        res.status(404).json({ error: 'Project not found' });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/admin/projects/pin', upload.none(), requireAuth, async (req, res) => {
    try {
        const { id, type, is_pinned } = req.body;
        const pinnedVal = (is_pinned === 'true' || is_pinned === true || is_pinned === 1 || is_pinned === '1') ? 1 : 0;
        
        if (type === 'gh') {
            // Upsert into github_images
            await db.query(`
                INSERT INTO github_images (repo_id, is_pinned, pinned_at) 
                VALUES (?, ?, CURRENT_TIMESTAMP) 
                ON DUPLICATE KEY UPDATE is_pinned = ?, pinned_at = CURRENT_TIMESTAMP
            `, [id, pinnedVal, pinnedVal]);
        } else {
            await db.query('UPDATE projects SET is_pinned=?, pinned_at=CURRENT_TIMESTAMP WHERE id=?', [pinnedVal, id]);
        }
        res.json({ message: 'Pin status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update pin status' });
    }
});

app.post('/api/admin/inbox/reply', express.json(), requireAuth, async (req, res) => {
    try {
        const { to, subject, message } = req.body;
        if (!to || !message) return res.status(400).json({ error: 'Missing to or message' });

        const mailOptions = {
            from: `"${process.env.ADMIN_USER}" <${process.env.EMAIL_USER}>`,
            to,
            subject: subject || 'Reply to your inquiry',
            text: message,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 0; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.05); overflow: hidden;">
                    <div style="background-color: #bdf235; padding: 30px; text-align: center;">
                        <h1 style="color: #111; margin: 0; font-size: 24px; font-weight: 800;">New Message from Sabbir Hasan</h1>
                    </div>
                    <div style="padding: 40px; font-size: 16px; line-height: 1.6; color: #444;">
                        ${message.replace(/\n/g, '<br>')}
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="font-size: 16px; margin: 0; color: #333;">Best regards,</p>
                        <p style="font-size: 18px; font-weight: bold; color: #bdf235; margin: 5px 0; text-shadow: 0px 0px 1px #000;">Sabbir Hasan</p>
                        <p style="font-size: 14px; color: #888; margin: 0;">IT & Web Specialist</p>
                    </div>
                </div>
            </div>`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Reply sent successfully' });
    } catch (err) {
        console.error("Reply sending failed:", err);
        res.status(500).json({ error: 'Failed to send reply' });
    }
});

app.get('/api/education', withCache('education', async () => {
    try {
        const [rows] = await db.query('SELECT * FROM education ORDER BY id DESC');
        return rows || [];
    } catch (e) {
        return [];
    }
}));

app.get('/api/certificates', withCache('certificates', async () => {
    try {
        const [rows] = await db.query('SELECT * FROM certificates ORDER BY id DESC');
        return rows || [];
    } catch (e) {
        return [];
    }
}));

app.get('/api/services', withCache('services', async () => {
    try {
        const [rows] = await db.query('SELECT * FROM services ORDER BY id DESC');
        return rows;
    } catch (err) {
        console.error("Database services layer notice:", err.message);
        return [];
    }
}));

// 🎥 --- YOUTUBE & MEDIA FEED ENGINE ---
function extractYouTubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i);
    return match ? match[1] : null;
}

async function resolveYouTubeMeta(urlOrHandle) {
    if (!urlOrHandle) return { channelId: null, title: null, avatar: null, description: null };
    let clean = urlOrHandle.trim();
    let channelId = null;

    if (clean.includes('/channel/')) {
        const m = clean.match(/\/channel\/(UC[\w-]+)/i);
        if (m) channelId = m[1];
    }

    let target = clean;
    if (!target.startsWith('http')) {
        if (target.startsWith('@')) target = 'https://www.youtube.com/' + target;
        else target = 'https://www.youtube.com/@' + target;
    }

    try {
        const res = await fetch(target, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        if (res.ok) {
            const html = await res.text();
            if (!channelId) {
                const idMatch = html.match(/"channelId":"(UC[\w-]+)"/) || 
                                html.match(/itemprop="channelId" content="(UC[\w-]+)"/) ||
                                html.match(/"externalId":"(UC[\w-]+)"/);
                if (idMatch) channelId = idMatch[1];
            }
            const titleMatch = html.match(/<meta property="og:title" content="([^"]+)">/) || html.match(/<title>([^<]+)<\/title>/);
            const avatarMatch = html.match(/<meta property="og:image" content="([^"]+)">/);
            const descMatch = html.match(/<meta property="og:description" content="([^"]+)">/);

            return {
                channelId,
                title: titleMatch ? titleMatch[1].replace(' - YouTube', '').trim() : null,
                avatar: avatarMatch ? avatarMatch[1] : null,
                description: descMatch ? descMatch[1].trim() : null
            };
        }
    } catch (err) {
        console.error("resolveYouTubeMeta error:", err.message);
    }
    return { channelId, title: null, avatar: null, description: null };
}

async function fetchYouTubeChannelVideos(channelId) {
    if (!channelId) return [];
    try {
        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const res = await fetch(feedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        if (!res.ok) return [];
        const xml = await res.text();
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
        const entries = [];
        let match;
        while ((match = entryRegex.exec(xml)) !== null) {
            const chunk = match[1];
            const videoId = chunk.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
            const title = chunk.match(/<title>([^<]+)<\/title>/)?.[1];
            const published = chunk.match(/<published>([^<]+)<\/published>/)?.[1];
            const views = chunk.match(/<media:statistics views="([^"]+)"/)?.[1];

            if (videoId && title) {
                entries.push({
                    videoId,
                    title: title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim(),
                    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
                    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                    viewsCount: views ? Number(views).toLocaleString() + ' views' : '',
                    publishedAt: published ? new Date(published) : new Date()
                });
            }
        }
        return entries;
    } catch (err) {
        console.error("fetchYouTubeChannelVideos error:", err.message);
        return [];
    }
}

async function syncChannelVideos(channelId) {
    try {
        const [channels] = await db.query('SELECT * FROM media_channels WHERE id = ?', [channelId]);
        if (!channels || channels.length === 0) return { success: false, error: 'Channel not found' };
        const channel = channels[0];

        if (channel.platform !== 'youtube') {
            return { success: true, message: 'Platform not YouTube, no RSS feed sync needed', count: 0 };
        }

        let ytId = channel.yt_channel_id;
        if (!ytId) {
            const resolved = await resolveYouTubeMeta(channel.channel_url || channel.channel_handle);
            if (resolved.channelId) {
                ytId = resolved.channelId;
                await db.query('UPDATE media_channels SET yt_channel_id = ?, avatar_url = COALESCE(NULLIF(avatar_url, ""), ?) WHERE id = ?', [ytId, resolved.avatar || '', channel.id]);
            }
        }

        if (!ytId) {
            return { success: false, error: 'Could not resolve YouTube Channel ID. Please provide a valid YouTube URL or @handle.' };
        }

        const videos = await fetchYouTubeChannelVideos(ytId);
        let addedCount = 0;

        for (const vid of videos) {
            const [existing] = await db.query('SELECT id FROM media_videos WHERE video_url = ?', [vid.videoUrl]);
            if (existing.length === 0) {
                await db.query(`
                    INSERT INTO media_videos 
                    (channel_id, platform, title, video_url, thumbnail_url, duration, views_count, is_featured, is_auto_feed, published_at)
                    VALUES (?, 'youtube', ?, ?, ?, '', ?, 1, 1, ?)
                `, [channel.id, vid.title, vid.videoUrl, vid.thumbnailUrl, vid.viewsCount, vid.publishedAt]);
                addedCount++;
            }
        }

        await db.query('UPDATE media_channels SET last_synced_at = NOW() WHERE id = ?', [channel.id]);
        delete apiCache['media_channels'];
        return { success: true, count: addedCount, totalFound: videos.length };
    } catch (err) {
        console.error("syncChannelVideos error:", err.message);
        return { success: false, error: err.message };
    }
}

async function syncAllActiveChannels() {
    try {
        const [channels] = await db.query('SELECT id FROM media_channels WHERE platform = "youtube" AND auto_sync = 1');
        let totalAdded = 0;
        for (const ch of channels) {
            const res = await syncChannelVideos(ch.id);
            if (res && res.count) totalAdded += res.count;
        }
        return { success: true, added: totalAdded };
    } catch (err) {
        console.error("syncAllActiveChannels error:", err.message);
        return { success: false, error: err.message };
    }
}

// 🎥 PUBLIC MEDIA & STREAMS CHANNELS (Auto-feeds latest videos from channels)
app.get('/api/media-channels', withCache('media_channels', async () => {
    try {
        const [channels] = await db.query('SELECT * FROM media_channels WHERE is_visible = 1 ORDER BY sort_order ASC, id ASC');
        const [videos] = await db.query('SELECT * FROM media_videos WHERE is_featured = 1 ORDER BY sort_order ASC, id DESC');
        
        // Background check: auto sync if YouTube channels haven't synced in > 30 minutes
        const now = Date.now();
        const needsSync = channels.some(c => c.platform === 'youtube' && (!c.last_synced_at || (now - new Date(c.last_synced_at).getTime()) > 30 * 60 * 1000));
        if (needsSync) {
            setImmediate(() => { syncAllActiveChannels().catch(() => {}); });
        }

        return {
            channels: channels || [],
            videos: videos || []
        };
    } catch (err) {
        console.error("Failed to fetch media channels:", err.message);
        return { channels: [], videos: [] };
    }
}));

// ✉️ BACKEND SMTP MAIL ROUTE
app.post('/api/contact', upload.none(), async (req, res) => {
    const { sender_name, sender_email, sender_phone, message, website_url } = req.body;
    
    // SPAM FILTER 1: Honeypot field (bots will fill this invisible field, humans will not)
    if (website_url) {
        // Silently return success so the bot thinks it worked
        return res.json({ success: true, message: 'Message sent securely!' });
    }

    if (!sender_name || !sender_email || !message) return res.status(400).json({ error: 'Fill all required fields.' });
    
    // SPAM FILTER 2: Basic pattern matching (e.g. massive strings with no spaces, HTML tags in names)
    const isSpamName = sender_name.length > 30 && !sender_name.includes(' ');
    const hasHttpInName = sender_name.toLowerCase().includes('http');
    const isSpamMessage = message.length > 50 && !message.includes(' ');

    if (isSpamName || hasHttpInName || isSpamMessage) {
        return res.json({ success: true, message: 'Message sent securely!' });
    }
    
    try {
        await db.query('INSERT INTO messages (sender_name, sender_email, sender_phone, message) VALUES (?, ?, ?, ?)', 
        [sender_name, sender_email, sender_phone || '', message]);
        
        res.json({ success: true, message: 'Message sent securely!' });

        const mailToAdmin = {
            from: `"Portfolio Portal" <${process.env.EMAIL_USER}>`, 
            to: process.env.RECEIVER_EMAIL,
            replyTo: sender_email,
            subject: `New Portfolio Message from ${sender_name}`,
            text: `Name: ${sender_name}\nEmail: ${sender_email}\nPhone: ${sender_phone || 'Not provided'}\n\nMessage:\n${message}`
        };
        transporter.sendMail(mailToAdmin).catch(err => console.error("Admin email failed:", err.message));

        const mailToUser = {
            from: `"Sabbir Hasan" <${process.env.EMAIL_USER}>`, 
            to: sender_email,
            subject: `Thank you for reaching out, ${sender_name}!`,
            text: `Hi ${sender_name},\n\nThank you for visiting my portfolio and reaching out! \n\nI have received your message and will get back to you as soon as possible.\n\nBest regards,\nSabbir Hasan\nIT & Web Specialist`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 0; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.05); overflow: hidden;">
                    <div style="background-color: #bdf235; padding: 30px; text-align: center;">
                        <h1 style="color: #111; margin: 0; font-size: 28px; font-weight: 800;">Message Received! 🚀</h1>
                    </div>
                    <div style="padding: 40px;">
                        <p style="font-size: 18px; margin-top: 0; color: #111;">Hi <strong>${sender_name}</strong>,</p>
                        <p style="font-size: 16px; line-height: 1.6; color: #555;">
                            Thank you for visiting my portfolio and reaching out. I'm excited to connect with you!
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #555;">
                            This is an automated confirmation that your message has been received securely. I will review it and get back to you as soon as possible.
                        </p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="font-size: 16px; margin: 0; color: #333;">Best regards,</p>
                        <p style="font-size: 18px; font-weight: bold; color: #bdf235; margin: 5px 0; text-shadow: 0px 0px 1px #000;">Sabbir Hasan</p>
                        <p style="font-size: 14px; color: #888; margin: 0;">IT & Web Specialist</p>
                    </div>
                </div>
            </div>`
        };
        transporter.sendMail(mailToUser).catch(err => console.error("Auto-reply failed:", err.message));

    } catch (err) { 
        console.error("Database Save Failure:", err.message);
        res.status(500).json({ error: 'Database failed to save message.' }); 
    }
});

// ==========================================
// BLOG API ROUTES (PUBLIC)
// ==========================================
app.get('/api/blog', withCache('blog', async () => {
    try {
        const [rows] = await db.query('SELECT * FROM blog_posts WHERE status = "published" ORDER BY created_at DESC');
        return rows || [];
    } catch (e) {
        return [];
    }
}));

app.get('/api/blog/:identifier', async (req, res) => {
    try {
        const param = req.params.identifier;
        const isNumber = /^\d+$/.test(param); 
        
        let querySql = 'SELECT * FROM blog_posts WHERE slug = ?';
        if (isNumber) {
            querySql = 'SELECT * FROM blog_posts WHERE id = ?';
        }

        const [rows] = await db.query(querySql, [param]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        
        res.json(rows[0]);
    } catch (err) { 
        console.error("Database Single Blog Error:", err);
        res.status(500).json({ error: 'Failed to fetch article details' }); 
    }
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
app.post('/api/login', upload.none(), async (req, res) => {
    const { username, password, totp_token } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        try {
            const [rows] = await db.query('SELECT two_factor_enabled, two_factor_secret FROM admin_profile WHERE id = 1');
            const admin = rows[0] || {};
            
            if (admin.two_factor_enabled) {
                if (!totp_token) {
                    return res.json({ require_2fa: true, message: 'Please enter your 2FA code.' });
                }
                
                const isValid = speakeasy.totp.verify({ secret: admin.two_factor_secret, encoding: 'base32', token: totp_token, window: 1 });
                if (!isValid) {
                    return res.status(401).json({ error: 'Invalid 2FA code.' });
                }
            }
            
            req.session.isAuthenticated = true;
            res.json({ success: true, message: 'Logged in!' });
        } catch (err) {
            console.error("Login Error:", err);
            res.status(500).json({ error: 'Server error during authentication.' });
        }
    } else res.status(401).json({ error: 'Incorrect credentials.' });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out.' });
});



// 💼 --- EXPERIENCE ROUTES ---
app.get(['/api/admin/experience', '/api/admin/experiences'], requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM experience ORDER BY id DESC');
        res.json(rows || []);
    } catch (err) {
        console.error("Admin experience fetch error:", err);
        res.status(500).json({ error: 'Failed to fetch experience' });
    }
});

app.post('/api/admin/experience', requireAuth, upload.none(), async (req, res) => {
    const { role, company_or_project, duration, description } = req.body;
    try {
        await db.query('INSERT INTO experience (role, company_or_project, duration, description) VALUES (?, ?, ?, ?)', [role, company_or_project, duration, description]);
        res.json({ message: 'Experience added!' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.put(['/api/admin/experience/:id', '/api/admin/experiences/:id'], requireAuth, upload.none(), async (req, res) => {
    const { role, company_or_project, duration, description } = req.body;
    try {
        await db.query('UPDATE experience SET role=?, company_or_project=?, duration=?, description=? WHERE id=?', [role, company_or_project, duration, description, req.params.id]);
        res.json({ message: 'Experience updated successfully! 💼' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// 🚀 --- PROJECTS ROUTES ---
app.get(['/api/admin/projects', '/api/admin/project'], requireAuth, async (req, res) => {
    try {
        let rows;
        try {
            [rows] = await db.query('SELECT * FROM projects ORDER BY is_pinned DESC, id DESC');
        } catch (colErr) {
            [rows] = await db.query('SELECT * FROM projects ORDER BY id DESC');
        }
        const normalized = (rows || []).map(r => ({
            ...r,
            is_pinned: r.is_pinned ? 1 : 0
        }));
        res.json(normalized);
    } catch (err) {
        console.error("Admin projects fetch error:", err);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.get(['/api/admin/github-projects', '/api/admin/github-project'], requireAuth, async (req, res) => {
    try {
        const [images] = await db.query('SELECT * FROM github_images');
        const imageMap = {};
        const pinMap = {};
        const pinnedAtMap = {};
        const liveUrlMap = {};
        const sortMap = {};
        const visibleMap = {};
        const featuredMap = {};
        images.forEach(img => {
            imageMap[img.repo_id] = img.image_path;
            pinMap[img.repo_id] = img.is_pinned;
            pinnedAtMap[img.repo_id] = img.pinned_at;
            liveUrlMap[img.repo_id] = img.live_url;
            sortMap[img.repo_id] = img.sort_order;
            visibleMap[img.repo_id] = img.is_visible;
            featuredMap[img.repo_id] = img.is_featured;
        });

        const ghProjectsWithImages = cachedGithubProjects.map(proj => ({
            ...proj,
            image_path: imageMap[proj.id] || proj.image_path,
            is_pinned: pinMap[proj.id] ? 1 : 0,
            pinned_at: pinnedAtMap[proj.id] || null,
            live_url: liveUrlMap[proj.id] || proj.live_url,
            sort_order: sortMap[proj.id] !== undefined ? sortMap[proj.id] : 0,
            is_visible: visibleMap[proj.id] !== undefined ? visibleMap[proj.id] : 1,
            is_featured: featuredMap[proj.id] ? 1 : 0
        }));
        res.json(ghProjectsWithImages);
    } catch (err) {
        console.error("Admin github projects fetch error:", err);
        res.status(500).json({ error: 'Failed to fetch github projects' });
    }
});

app.put('/api/admin/github-projects/:id', requireAuth, express.json(), async (req, res) => {
    try {
        const repo_id = req.params.id;
        const { sort_order, is_visible, is_featured } = req.body;
        await db.query(`
            INSERT INTO github_images (repo_id, sort_order, is_visible, is_featured)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            sort_order = VALUES(sort_order),
            is_visible = VALUES(is_visible),
            is_featured = VALUES(is_featured)
        `, [repo_id, Number(sort_order) || 0, is_visible === false || is_visible === 0 || is_visible === 'false' ? 0 : 1, is_featured ? 1 : 0]);
        res.json({ message: 'GitHub project display settings updated!' });
    } catch (err) {
        console.error("Admin update github-project error:", err);
        res.status(500).json({ error: 'Failed to update GitHub project' });
    }
});

app.post('/api/admin/projects', requireAuth, upload.single('project_image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    const { title, description, github_url, live_url } = req.body;
    const imagePath = '/uploads/' + req.file.filename;
    try {
        await db.query('INSERT INTO projects (title, description, image_path, github_url, live_url) VALUES (?, ?, ?, ?, ?)', [title, description, imagePath, github_url, live_url]);
        res.json({ message: 'Project added!' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.put(['/api/admin/projects/:id', '/api/admin/project/:id'], requireAuth, upload.single('project_image'), async (req, res) => {
    const { title, description, github_url, live_url } = req.body;
    try {
        if (req.file) {
            const newPath = '/uploads/' + req.file.filename;
            const [rows] = await db.query('SELECT image_path FROM projects WHERE id = ?', [req.params.id]);
            if (rows[0]?.image_path) fs.unlink(path.join(__dirname, 'public', rows[0].image_path), () => {});
            await db.query('UPDATE projects SET title=?, description=?, image_path=?, github_url=?, live_url=? WHERE id=?', [title, description, newPath, github_url, live_url, req.params.id]);
        } else {
            await db.query('UPDATE projects SET title=?, description=?, github_url=?, live_url=? WHERE id=?', [title, description, github_url, live_url, req.params.id]);
        }
        res.json({ message: 'Project updated successfully! 🚀' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// 🎓 --- EDUCATION ROUTES ---
app.get(['/api/admin/education', '/api/admin/educations'], requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM education ORDER BY id DESC');
        res.json(rows || []);
    } catch (err) {
        console.error("Admin education fetch error:", err);
        res.status(500).json({ error: 'Failed to fetch education' });
    }
});

app.post('/api/admin/education', requireAuth, upload.none(), async (req, res) => {
    const { degree, institution, duration, description } = req.body;
    try {
        await db.query("INSERT INTO education (degree, institution, duration, description, image_path) VALUES (?, ?, ?, ?, '')", [degree, institution, duration, description]);
        res.json({ message: 'Education added successfully' });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put(['/api/admin/education/:id', '/api/admin/educations/:id'], requireAuth, upload.none(), async (req, res) => {
    const { degree, institution, duration, description } = req.body;
    try {
        await db.query('UPDATE education SET degree=?, institution=?, duration=?, description=? WHERE id=?', [degree, institution, duration, description, req.params.id]);
        res.json({ message: 'Education entry updated successfully! 🎓' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/admin/github/live-url', express.json(), requireAuth, async (req, res) => {
    try {
        const { repo_id, live_url } = req.body;
        if (!repo_id) return res.status(400).json({ error: 'Missing repo_id' });
        
        await db.query(`
            INSERT INTO github_images (repo_id, live_url) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE live_url = ?
        `, [repo_id, live_url || '', live_url || '']);
        
        res.json({ message: 'Live URL updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update live URL' });
    }
});

// 📜 --- CERTIFICATES ROUTES ---
app.get(['/api/admin/certificates', '/api/admin/certificate'], requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM certificates ORDER BY id DESC');
        res.json(rows || []);
    } catch (err) {
        console.error("Admin certificates fetch error:", err);
        res.status(500).json({ error: 'Failed to fetch certificates' });
    }
});

app.post('/api/admin/github-image/remove', express.json(), requireAuth, async (req, res) => {
    try {
        const { repo_id } = req.body;
        if (!repo_id) return res.status(400).json({ error: 'Missing repo_id' });
        
        // Find existing image
        const [rows] = await db.query('SELECT image_path FROM github_images WHERE repo_id = ?', [repo_id]);
        if (rows.length > 0) {
            const imgPath = rows[0].image_path;
            // Delete from disk if it's a local upload
            if (imgPath && !imgPath.startsWith('http')) {
                const fs = require('fs');
                const path = require('path');
                const fullPath = path.join(__dirname, 'public', imgPath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }
        }
        
        // Either remove row completely, or just nullify image_path (but we have is_pinned to keep!)
        await db.query('UPDATE github_images SET image_path = NULL WHERE repo_id = ?', [repo_id]);
        await db.query('DELETE FROM github_images WHERE image_path IS NULL AND (is_pinned = 0 OR is_pinned IS NULL)');
        
        res.json({ message: 'Image removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove GitHub image' });
    }
});

app.post('/api/admin/certificates', requireAuth, upload.single('cert_image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Certificate image is required' });
    const { title, issuer, link } = req.body;
    const imagePath = '/uploads/' + req.file.filename;
    try {
        await db.query('INSERT INTO certificates (title, issuer, image_path, link) VALUES (?, ?, ?, ?)', [title, issuer, imagePath, link]);
        res.json({ message: 'Certificate added successfully!' });
    } catch (err) { res.status(500).json({ error: 'Server error adding certificate.' }); }
});

app.put(['/api/admin/certificates/:id', '/api/admin/certificate/:id'], requireAuth, upload.single('cert_image'), async (req, res) => {
    const { title, issuer, link } = req.body;
    try {
        if (req.file) {
            const newPath = '/uploads/' + req.file.filename;
            const [rows] = await db.query('SELECT image_path FROM certificates WHERE id = ?', [req.params.id]);
            if (rows[0]?.image_path) fs.unlink(path.join(__dirname, 'public', rows[0].image_path), () => {});
            await db.query('UPDATE certificates SET title=?, issuer=?, image_path=?, link=? WHERE id=?', [title, issuer, newPath, link, req.params.id]);
        } else {
            await db.query('UPDATE certificates SET title=?, issuer=?, link=? WHERE id=?', [title, issuer, link, req.params.id]);
        }
        res.json({ message: 'Certificate updated successfully! 📜' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// 🛠️ --- SERVICES & SITE SECTIONS ADMIN ROUTES ---
app.get(['/api/admin/services', '/api/admin/service'], requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM services ORDER BY sort_order ASC, id DESC');
        res.json(rows || []);
    } catch (err) {
        res.json([]);
    }
});

app.post('/api/admin/services', requireAuth, upload.none(), async (req, res) => {
    const { title, description, icon, tags, category_key, sort_order, is_visible } = req.body;
    try {
        await db.query(
            'INSERT INTO services (title, description, icon, tags, category_key, sort_order, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [title, description, icon || '💻', tags || '', category_key || 'other', Number(sort_order) || 0, is_visible === false ? 0 : 1]
        );
        res.json({ message: 'Service added successfully!' });
    } catch (err) {
        try {
            await db.query('INSERT INTO services (title, description, icon, tags) VALUES (?, ?, ?, ?)', [title, description, icon || '💻', tags || '']);
            res.json({ message: 'Service added successfully!' });
        } catch (innerErr) {
            console.error("Admin add service error:", innerErr);
            res.status(500).json({ error: 'Server error adding service' });
        }
    }
});

app.put(['/api/admin/services/:id', '/api/admin/service/:id'], requireAuth, async (req, res) => {
    try {
        const { title, description, icon, tags, category_key, sort_order, is_visible } = req.body;
        await db.query(
            'UPDATE services SET title=?, description=?, icon=?, tags=?, category_key=?, sort_order=?, is_visible=? WHERE id=?',
            [title, description, icon || '💻', tags || '', category_key || 'other', Number(sort_order) || 0, is_visible === false ? 0 : 1, req.params.id]
        );
        res.json({ message: 'Service updated successfully!' });
    } catch (err) {
        try {
            await db.query(
                'UPDATE services SET title=?, description=?, icon=?, tags=? WHERE id=?',
                [title, description, icon || '💻', tags || '', req.params.id]
            );
            res.json({ message: 'Service updated successfully!' });
        } catch (innerErr) {
            console.error("Admin update service error:", innerErr);
            res.status(500).json({ error: 'Failed to update service' });
        }
    }
});

app.delete(['/api/admin/services/:id', '/api/admin/service/:id'], requireAuth, async (req, res) => {
    try { 
        await db.query('DELETE FROM services WHERE id = ?', [req.params.id]); 
        res.json({ message: 'Service deleted successfully!' }); 
    } catch (err) { res.status(500).json({ error: 'Failed to delete service' }); }
});

app.get('/api/admin/site-sections', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM site_sections ORDER BY sort_order ASC');
        res.json(rows || []);
    } catch (err) {
        res.json([]);
    }
});

app.put('/api/admin/site-sections', requireAuth, express.json(), async (req, res) => {
    try {
        const { sections } = req.body;
        if (!Array.isArray(sections)) return res.status(400).json({ error: 'Invalid sections payload' });
        for (const sec of sections) {
            await db.query(
                `INSERT INTO site_sections (section_key, is_visible, sort_order, eyebrow, title, description) 
                 VALUES (?, ?, ?, ?, ?, ?) 
                 ON DUPLICATE KEY UPDATE 
                 is_visible = VALUES(is_visible), 
                 sort_order = VALUES(sort_order), 
                 eyebrow = VALUES(eyebrow), 
                 title = VALUES(title), 
                 description = VALUES(description)`,
                [sec.section_key, sec.is_visible ? 1 : 0, Number(sec.sort_order) || 0, sec.eyebrow || '', sec.title || '', sec.description || '']
            );
        }
        res.json({ message: 'Site sections updated successfully' });
    } catch (err) {
        console.error("Failed to update site sections:", err);
        res.status(500).json({ error: 'Failed to update site sections' });
    }
});

// 🎥 --- MEDIA & STREAM CHANNELS ADMIN ROUTES ---
app.get('/api/admin/media-channels', requireAuth, async (req, res) => {
    try {
        const [channels] = await db.query('SELECT * FROM media_channels ORDER BY sort_order ASC, id ASC');
        const [videos] = await db.query('SELECT * FROM media_videos ORDER BY sort_order ASC, id DESC');
        res.json({ channels: channels || [], videos: videos || [] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch media channels' });
    }
});

app.post('/api/admin/media-channels', requireAuth, upload.single('avatar_file'), async (req, res) => {
    try {
        let { id, platform, channel_name, channel_handle, channel_url, subscribers_count, description, badge_text, is_live, sort_order, is_visible } = req.body;
        let avatar_url = req.body.avatar_url || '';
        if (req.file) {
            avatar_url = '/uploads/' + req.file.filename;
        }

        if (!platform || !channel_url) {
            return res.status(400).json({ error: 'Platform and channel URL/Handle are required.' });
        }

        platform = platform.toLowerCase();
        let ytChannelId = '';

        // Auto-detect YouTube metadata if platform is YouTube
        if (platform === 'youtube') {
            const ytMeta = await resolveYouTubeMeta(channel_url || channel_handle);
            if (ytMeta.channelId) ytChannelId = ytMeta.channelId;
            if (!avatar_url && ytMeta.avatar) avatar_url = ytMeta.avatar;
            if (!channel_name && ytMeta.title) channel_name = ytMeta.title;
            if (!description && ytMeta.description) description = ytMeta.description.slice(0, 300);
        }

        if (!channel_name) {
            channel_name = channel_handle ? channel_handle.replace(/^@/, '') : 'Channel';
        }

        let savedChannelId = id;

        if (id) {
            await db.query(`
                UPDATE media_channels SET 
                    platform = ?, channel_name = ?, channel_handle = ?, channel_url = ?, 
                    avatar_url = COALESCE(NULLIF(?, ''), avatar_url), subscribers_count = ?, 
                    description = ?, badge_text = ?, is_live = ?, sort_order = ?, is_visible = ?,
                    yt_channel_id = COALESCE(NULLIF(?, ''), yt_channel_id)
                WHERE id = ?
            `, [platform, channel_name, channel_handle || '', channel_url, avatar_url, subscribers_count || '', description || '', badge_text || 'CREATOR', is_live === '1' || is_live === true || is_live === 1 ? 1 : 0, Number(sort_order) || 0, is_visible === '0' || is_visible === false ? 0 : 1, ytChannelId, id]);
        } else {
            const [insertRes] = await db.query(`
                INSERT INTO media_channels 
                (platform, channel_name, channel_handle, channel_url, avatar_url, subscribers_count, description, badge_text, is_live, sort_order, is_visible, yt_channel_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [platform, channel_name, channel_handle || '', channel_url, avatar_url, subscribers_count || '', description || '', badge_text || 'CREATOR', is_live === '1' || is_live === true || is_live === 1 ? 1 : 0, Number(sort_order) || 0, 1, ytChannelId]);
            savedChannelId = insertRes.insertId;
        }

        delete apiCache['media_channels'];

        // Automatically trigger video feed sync for this channel in the background
        let syncResult = null;
        if (platform === 'youtube' && savedChannelId) {
            try {
                syncResult = await syncChannelVideos(savedChannelId);
            } catch(e) { console.error("Auto sync on save error:", e.message); }
        }

        const msg = syncResult && syncResult.count > 0 
            ? `Channel saved! Auto-fed ${syncResult.count} latest videos from YouTube.` 
            : 'Channel saved successfully!';

        res.json({ success: true, message: msg, channelId: savedChannelId, syncResult });
    } catch (err) {
        console.error("Save channel error:", err);
        res.status(500).json({ error: 'Failed to save channel' });
    }
});

// Sync videos for a specific channel
app.post('/api/admin/media-channels/:id/sync', requireAuth, async (req, res) => {
    try {
        const result = await syncChannelVideos(req.params.id);
        if (result.success) {
            delete apiCache['media_channels'];
            res.json({ success: true, message: `Sync completed! Added ${result.count} new videos.`, result });
        } else {
            res.status(400).json({ error: result.error || 'Sync failed' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Sync failed: ' + err.message });
    }
});

// Sync videos for all active channels
app.post('/api/admin/media-channels/sync-all', requireAuth, async (req, res) => {
    try {
        const result = await syncAllActiveChannels();
        delete apiCache['media_channels'];
        res.json({ success: true, message: `All channels synced! Added ${result.added} new videos.` });
    } catch (err) {
        res.status(500).json({ error: 'Sync-all failed: ' + err.message });
    }
});

app.delete('/api/admin/media-channels/:id', requireAuth, async (req, res) => {
    try {
        await db.query('DELETE FROM media_videos WHERE channel_id = ?', [req.params.id]);
        await db.query('DELETE FROM media_channels WHERE id = ?', [req.params.id]);
        delete apiCache['media_channels'];
        res.json({ success: true, message: 'Channel deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete channel' });
    }
});

app.post('/api/admin/media-channels/:id/toggle-live', requireAuth, async (req, res) => {
    try {
        await db.query('UPDATE media_channels SET is_live = IF(is_live=1, 0, 1) WHERE id = ?', [req.params.id]);
        delete apiCache['media_channels'];
        res.json({ success: true, message: 'Live status updated!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update live status' });
    }
});

app.post('/api/admin/media-videos', requireAuth, upload.single('thumbnail_file'), async (req, res) => {
    try {
        const { id, channel_id, platform, title, video_url, duration, views_count, sort_order, is_featured } = req.body;
        let thumbnail_url = req.body.thumbnail_url || '';
        if (req.file) {
            thumbnail_url = '/uploads/' + req.file.filename;
        } else if (!thumbnail_url && video_url) {
            const ytId = extractYouTubeId(video_url);
            if (ytId) {
                thumbnail_url = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
            }
        }

        if (!title || !video_url) {
            return res.status(400).json({ error: 'Video title and URL are required.' });
        }

        if (id) {
            await db.query(`
                UPDATE media_videos SET 
                    channel_id = ?, platform = ?, title = ?, video_url = ?, 
                    thumbnail_url = COALESCE(NULLIF(?, ''), thumbnail_url), 
                    duration = ?, views_count = ?, sort_order = ?, is_featured = ?
                WHERE id = ?
            `, [channel_id || null, (platform || 'youtube').toLowerCase(), title, video_url, thumbnail_url, duration || '', views_count || '', Number(sort_order) || 0, is_featured === '0' || is_featured === false ? 0 : 1, id]);
        } else {
            await db.query(`
                INSERT INTO media_videos 
                (channel_id, platform, title, video_url, thumbnail_url, duration, views_count, sort_order, is_featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [channel_id || null, (platform || 'youtube').toLowerCase(), title, video_url, thumbnail_url, duration || '', views_count || '', Number(sort_order) || 0, 1]);
        }
        delete apiCache['media_channels'];
        res.json({ success: true, message: 'Video saved successfully!' });
    } catch (err) {
        console.error("Save video error:", err);
        res.status(500).json({ error: 'Failed to save video' });
    }
});

app.delete('/api/admin/media-videos/:id', requireAuth, async (req, res) => {
    try {
        await db.query('DELETE FROM media_videos WHERE id = ?', [req.params.id]);
        delete apiCache['media_channels'];
        res.json({ success: true, message: 'Video deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete video' });
    }
});

// 👤 --- SOCIALS & STATS ROUTE ---
app.post('/api/admin/socials', requireAuth, upload.none(), async (req, res) => {
    const { 
        github_link, linkedin_link, facebook_link, fiverr_link, pinterest_link, adobe_stock_link,
        stat_ccna_title, stat_ceh_title,
        stat_ccna, stat_ceh, stat_years, stat_projects,
        about_title, about_desc,
        contact_location, contact_map_url, contact_email,
        hero_roles, hero_description,
        station_location, station_timezone, station_status,
        hero_primary_cta_label, hero_primary_cta_url, hero_secondary_cta_label, hero_secondary_cta_url,
        hero_availability_text, contact_phone, footer_text, default_seo_title, default_seo_description, default_og_image
    } = req.body;
    try {
        await db.query(
            `UPDATE admin_profile SET 
            github_link=?, linkedin_link=?, facebook_link=?, fiverr_link=?, pinterest_link=?, adobe_stock_link=?,
            stat_ccna_title=?, stat_ceh_title=?,
            stat_ccna=?, stat_ceh=?, stat_years=?, stat_projects=?,
            about_title=?, about_desc=?, contact_location=?, contact_map_url=?, contact_email=?, hero_roles=?, hero_description=?,
            station_location=COALESCE(?, station_location), station_timezone=COALESCE(?, station_timezone), station_status=COALESCE(?, station_status),
            hero_primary_cta_label=COALESCE(?, hero_primary_cta_label), hero_primary_cta_url=COALESCE(?, hero_primary_cta_url),
            hero_secondary_cta_label=COALESCE(?, hero_secondary_cta_label), hero_secondary_cta_url=COALESCE(?, hero_secondary_cta_url),
            hero_availability_text=COALESCE(?, hero_availability_text), contact_phone=COALESCE(?, contact_phone),
            footer_text=COALESCE(?, footer_text), default_seo_title=COALESCE(?, default_seo_title),
            default_seo_description=COALESCE(?, default_seo_description), default_og_image=COALESCE(?, default_og_image)
            WHERE id=1`,
            [
                github_link, linkedin_link, facebook_link, fiverr_link, pinterest_link, adobe_stock_link,
                stat_ccna_title, stat_ceh_title,
                stat_ccna, stat_ceh, stat_years, stat_projects,
                about_title, about_desc, contact_location, contact_map_url, contact_email, hero_roles, hero_description,
                station_location, station_timezone, station_status,
                hero_primary_cta_label, hero_primary_cta_url, hero_secondary_cta_label, hero_secondary_cta_url,
                hero_availability_text, contact_phone, footer_text, default_seo_title, default_seo_description, default_og_image
            ]
        );
        invalidateApiCache('profile');
        res.json({ message: 'Profile data updated!' });
    } catch (err) { 
        console.error('Error updating profile data:', err);
        res.status(500).json({ error: 'Server error' }); 
    }
});

// 🚀 --- GITHUB IMAGES ROUTE ---
app.post('/api/admin/github-image', requireAuth, upload.single('gh_image'), async (req, res) => {
    const repo_id = req.body.repo_id;
    if (!req.file || !repo_id) return res.status(400).json({ error: 'Image and repo_id are required' });
    
    const newPath = '/uploads/' + req.file.filename;
    try {
        // Delete old if exists
        const [rows] = await db.query('SELECT image_path FROM github_images WHERE repo_id = ?', [repo_id]);
        if (rows[0]?.image_path) fs.unlink(path.join(__dirname, 'public', rows[0].image_path), () => {});
        
        await db.query('REPLACE INTO github_images (repo_id, image_path) VALUES (?, ?)', [repo_id, newPath]);
        res.json({ message: 'GitHub Project Image updated!' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// 📝 --- BLOG ADMIN ROUTES ---
app.get('/api/admin/blog', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch admin blogs' });
    }
});

app.post('/api/admin/blog/approve-all', requireAuth, async (req, res) => {
    try {
        const targetStatus = req.body?.status || 'review';
        const [result] = await db.query('UPDATE blog_posts SET status = "published" WHERE status = ?', [targetStatus]);
        delete apiCache['blog'];
        invalidateApiCache('blog');
        console.log(`✅ [BLOG APPROVE-ALL]: Approved and published ${result.affectedRows || 0} articles with status '${targetStatus}'`);
        res.json({
            success: true,
            message: `Successfully approved and published ${result.affectedRows || 0} articles!`,
            count: result.affectedRows || 0
        });
    } catch (err) {
        console.error("Auto-Approve All Error:", err);
        res.status(500).json({ error: 'Failed to auto-approve articles' });
    }
});

app.post('/api/admin/blog', requireAuth, upload.single('blog_image'), async (req, res) => {
    const { title, category, content, custom_slug, status, excerpt, meta_title, meta_description, tags } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : '';
    
    try {
        const finalSlug = await ensureUniqueSlug(custom_slug || title);
        const finalExcerpt = excerpt && excerpt.trim() ? excerpt.trim() : generateExcerpt(content);
        const readingTime = calculateReadingTime(content);
        const finalStatus = status || 'published';
        const finalMetaTitle = meta_title && meta_title.trim() ? meta_title.trim() : `${title} | Sabbir Hasan`;
        const finalMetaDesc = meta_description && meta_description.trim() ? meta_description.trim() : finalExcerpt;

        await db.query(
            `INSERT INTO blog_posts (title, slug, category, content, image_path, status, excerpt, meta_title, meta_description, tags, reading_time)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, finalSlug, category || 'Tech', content, imagePath, finalStatus, finalExcerpt, finalMetaTitle, finalMetaDesc, tags || '', readingTime]
        );
        delete apiCache['blog'];
        res.json({ message: 'Blog added successfully!', slug: finalSlug });
    } catch (err) {
        console.error("Admin Blog Add Error:", err.message);
        res.status(500).json({ error: 'Failed to save blog' });
    }
});

app.put('/api/admin/blog/:id', requireAuth, upload.single('blog_image'), async (req, res) => {
    const { title, category, content, custom_slug, status, excerpt, meta_title, meta_description, tags } = req.body;
    const blogId = req.params.id;

    try {
        const finalSlug = await ensureUniqueSlug(custom_slug || title, blogId);
        const finalExcerpt = excerpt && excerpt.trim() ? excerpt.trim() : generateExcerpt(content);
        const readingTime = calculateReadingTime(content);
        const finalStatus = status || 'published';
        const finalMetaTitle = meta_title && meta_title.trim() ? meta_title.trim() : `${title} | Sabbir Hasan`;
        const finalMetaDesc = meta_description && meta_description.trim() ? meta_description.trim() : finalExcerpt;

        if (req.file) {
            const newImagePath = '/uploads/' + req.file.filename;
            const [rows] = await db.query('SELECT image_path FROM blog_posts WHERE id = ?', [blogId]);
            if (rows[0]?.image_path) {
                const oldPath = path.join(__dirname, 'public', rows[0].image_path);
                fs.unlink(oldPath, (err) => { if (err) console.log("Old file missing."); });
            }
            await db.query(
                `UPDATE blog_posts SET title=?, slug=?, category=?, content=?, image_path=?, status=?, excerpt=?, meta_title=?, meta_description=?, tags=?, reading_time=? WHERE id=?`,
                [title, finalSlug, category, content, newImagePath, finalStatus, finalExcerpt, finalMetaTitle, finalMetaDesc, tags || '', readingTime, blogId]
            );
        } else {
            await db.query(
                `UPDATE blog_posts SET title=?, slug=?, category=?, content=?, status=?, excerpt=?, meta_title=?, meta_description=?, tags=?, reading_time=? WHERE id=?`,
                [title, finalSlug, category, content, finalStatus, finalExcerpt, finalMetaTitle, finalMetaDesc, tags || '', readingTime, blogId]
            );
        }
        delete apiCache['blog'];
        res.json({ message: 'Article updated successfully! 🚀', slug: finalSlug });
    } catch (err) {
        console.error("Admin Blog Update Error:", err.message);
        res.status(500).json({ error: 'Failed to update article' });
    }
});

// --- UPLOAD ROUTES (WITH AUTO-DELETE & CACHE INVALIDATION) ---
app.post('/api/admin/upload-pic', requireAuth, upload.single('profile_image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const newImagePath = '/uploads/' + req.file.filename;
    try {
        const [rows] = await db.query('SELECT profile_pic_path FROM admin_profile WHERE id = 1');
        const oldImagePath = rows[0]?.profile_pic_path;
        if (oldImagePath && oldImagePath !== newImagePath) {
            deleteOldUpload(oldImagePath);
        }
        await db.query('UPDATE admin_profile SET profile_pic_path = ? WHERE id = 1', [newImagePath]);
        invalidateApiCache('profile');
        res.json({ success: true, message: 'Profile picture updated!', profile_pic_path: newImagePath });
    } catch (err) {
        console.error("Upload Pic Error:", err.message);
        res.status(500).json({ error: 'Server error updating picture.' });
    }
});


// ==================== REMOVE AVATAR & CV ====================
app.post('/api/admin/remove-avatar', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT profile_pic_path FROM admin_profile WHERE id = 1');
        const oldImagePath = rows[0]?.profile_pic_path;
        if (oldImagePath) {
            deleteOldUpload(oldImagePath);
        }
        await db.query('UPDATE admin_profile SET profile_pic_path = NULL WHERE id = 1');
        invalidateApiCache('profile');
        res.json({ success: true, message: 'Avatar removed' });
    } catch (error) {
        console.error("Remove Avatar Error:", error);
        res.status(500).json({ error: 'Failed to remove avatar' });
    }
});

app.post('/api/admin/remove-cv', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT cv_file_path FROM admin_profile WHERE id = 1');
        const oldCvPath = rows[0]?.cv_file_path;
        if (oldCvPath) {
            deleteOldUpload(oldCvPath);
        }
        await db.query('UPDATE admin_profile SET cv_file_path = NULL WHERE id = 1');
        invalidateApiCache('profile');
        res.json({ success: true, message: 'CV removed' });
    } catch (error) {
        console.error("Remove CV Error:", error);
        res.status(500).json({ error: 'Failed to remove CV' });
    }
});

app.post('/api/admin/upload-cv', requireAuth, upload.single('cv_document'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const newCvPath = '/uploads/' + req.file.filename;
    try {
        const [rows] = await db.query('SELECT cv_file_path FROM admin_profile WHERE id = 1');
        const oldCvPath = rows[0]?.cv_file_path;
        if (oldCvPath && oldCvPath !== newCvPath) {
            deleteOldUpload(oldCvPath);
        }
        await db.query('UPDATE admin_profile SET cv_file_path = ? WHERE id = 1', [newCvPath]);
        invalidateApiCache('profile');
        res.json({ success: true, message: 'CV updated!', cv_file_path: newCvPath });
    } catch (err) {
        console.error("Upload CV Error:", err.message);
        res.status(500).json({ error: 'Server error updating CV.' });
    }
});

// --- READ ROUTES ---
app.get('/api/admin/messages', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch messages' }); }
});

app.get('/api/admin/system-status', requireAuth, async (req, res) => {
    try {
        const cpu = await si.currentLoad();
        const mem = await si.mem();
        const disk = await si.fsSize();
        const network = await si.networkStats();
        const time = await si.time();

        let hours = Math.floor(time.uptime / 3600);
        let minutes = Math.floor((time.uptime % 3600) / 60);
        let rxSpeed = network.length > 0 ? (network[0].rx_sec / 1024 / 1024).toFixed(2) : 0.00;
        let txSpeed = network.length > 0 ? (network[0].tx_sec / 1024 / 1024).toFixed(2) : 0.00;

        res.json({
            cpuModel: os.cpus()[0].model,
            cpuCores: os.cpus().length,
            cpuPercentage: cpu.currentLoad.toFixed(1),
            ramPercentage: ((mem.active / mem.total) * 100).toFixed(1),
            usedRam: (mem.active / 1024 / 1024 / 1024).toFixed(2),
            totalRam: (mem.total / 1024 / 1024 / 1024).toFixed(2),
            diskPercentage: disk[0].use.toFixed(1),
            usedDisk: (disk[0].used / 1024 / 1024 / 1024).toFixed(2),
            totalDisk: (disk[0].size / 1024 / 1024 / 1024).toFixed(2),
            networkDownload: rxSpeed,
            networkUpload: txSpeed,
            uptime: `${hours}h ${minutes}m`,
            osPlatform: os.platform() === 'win32' ? 'Windows' : os.platform()
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to read advanced system status' });
    }
});

// ==========================================
// DELETE ROUTES (AUTO-DELETE FILES)
// ==========================================
app.delete('/api/admin/experience/:id', requireAuth, async (req, res) => {
    try { await db.query('DELETE FROM experience WHERE id = ?', [req.params.id]); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/admin/messages/:id', requireAuth, async (req, res) => {
    try { await db.query('DELETE FROM messages WHERE id = ?', [req.params.id]); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/admin/projects/:id', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image_path FROM projects WHERE id = ?', [req.params.id]);
        if (rows[0]?.image_path) fs.unlink(path.join(__dirname, 'public', rows[0].image_path), () => {});
        await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]); res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/admin/education/:id', requireAuth, async (req, res) => {
    try { await db.query('DELETE FROM education WHERE id = ?', [req.params.id]); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/admin/certificates/:id', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image_path FROM certificates WHERE id = ?', [req.params.id]);
        if (rows[0]?.image_path) fs.unlink(path.join(__dirname, 'public', rows[0].image_path), () => {});
        await db.query('DELETE FROM certificates WHERE id = ?', [req.params.id]); res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/admin/blog/:id', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image_path FROM blog_posts WHERE id = ?', [req.params.id]);
        if (rows[0]?.image_path) fs.unlink(path.join(__dirname, 'public', rows[0].image_path), () => {});
        await db.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]); res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// ==========================================
// N8N AUTOMATION ROUTE (With Review Workflow)
// ==========================================
app.post('/api/n8n/blog', rateLimit(60000, 30), async (req, res) => {
    try {
        const { secret, title, category, content, imageUrl, status, meta_title, meta_description, excerpt, tags } = req.body;
        const expectedSecret = process.env.N8N_SECRET_KEY;
        
        if (!expectedSecret || secret !== expectedSecret) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        res.json({ success: true, message: 'Processing in background with quality control.' });
        
        setImmediate(async () => {
            try {
                let imagePath = '';
                
                if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
                    const imageName = 'blog_' + Date.now() + '.png';
                    const absolutePath = path.join(__dirname, 'public/uploads', imageName);
                    
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 10000);
                        const response = await fetch(imageUrl, { signal: controller.signal });
                        clearTimeout(timeoutId);

                        if (response.ok) {
                            const buffer = await response.arrayBuffer();
                            fs.writeFileSync(absolutePath, Buffer.from(buffer));
                            imagePath = '/uploads/' + imageName;
                        }
                    } catch (imgErr) { 
                        console.error("Background Image Fetch Error:", imgErr.message); 
                    }
                }

                const postTitle = title || 'Untitled AI Post';
                const finalSlug = await ensureUniqueSlug(postTitle);
                const finalExcerpt = excerpt || generateExcerpt(content);
                const readingTime = calculateReadingTime(content);
                const postStatus = status || 'review'; // Defaults to review for human QA
                const finalMetaTitle = meta_title || `${postTitle} | Sabbir Hasan`;
                const finalMetaDesc = meta_description || finalExcerpt;

                try {
                    await db.query(
                        `INSERT INTO blog_posts (title, slug, category, content, image_path, status, excerpt, meta_title, meta_description, tags, reading_time)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [postTitle, finalSlug, category || 'Cybersecurity', content || 'No Content Provided', imagePath || '', postStatus, finalExcerpt, finalMetaTitle, finalMetaDesc, tags || '', readingTime]
                    );
                    delete apiCache['blog'];
                    console.log(`✅ [N8N SUCCESS]: "${postTitle}" saved in status "${postStatus}" with slug "${finalSlug}"`);
                } catch (dbErr) { 
                    console.error("Background DB Insert Error:", dbErr.message); 
                }

            } catch (bgErr) {
                console.error("Background Core Thread Error:", bgErr.message);
            }
        });

    } catch (err) { 
        console.error("N8N Route Main Error:", err.message); 
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, async () => {
    console.log("🚀 Server running on http://localhost:" + PORT);
    
    // Auto-create missing tables if they don't exist
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS github_images (
                repo_id VARCHAR(255) PRIMARY KEY,
                image_path VARCHAR(255) DEFAULT '',
                is_pinned BOOLEAN DEFAULT FALSE,
                pinned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                live_url VARCHAR(500) DEFAULT ''
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log("✅ github_images table ready.");
        try { await db.query(`ALTER TABLE github_images ADD COLUMN pinned_at DATETIME DEFAULT CURRENT_TIMESTAMP`); } catch(e) {}
        try { await db.query(`ALTER TABLE github_images ADD COLUMN live_url VARCHAR(500) DEFAULT ''`); } catch(e) {}
        try { await db.query(`ALTER TABLE projects ADD COLUMN is_pinned TINYINT(1) DEFAULT 0`); } catch(e) {}
        try { await db.query(`ALTER TABLE projects ADD COLUMN pinned_at DATETIME DEFAULT CURRENT_TIMESTAMP`); } catch(e) {}

        try {
            await db.query(`
                CREATE TABLE IF NOT EXISTS admin_profile (
                    id INT PRIMARY KEY DEFAULT 1,
                    github_link VARCHAR(255) DEFAULT '',
                    linkedin_link VARCHAR(255) DEFAULT '',
                    facebook_link VARCHAR(255) DEFAULT '',
                    fiverr_link VARCHAR(255) DEFAULT '',
                    pinterest_link VARCHAR(255) DEFAULT '',
                    adobe_stock_link VARCHAR(255) DEFAULT '',
                    stat_ccna_title VARCHAR(255) DEFAULT '',
                    stat_ceh_title VARCHAR(255) DEFAULT '',
                    stat_ccna VARCHAR(255) DEFAULT '',
                    stat_ceh VARCHAR(255) DEFAULT '',
                    stat_years VARCHAR(255) DEFAULT '',
                    stat_projects VARCHAR(255) DEFAULT '',
                    about_title VARCHAR(255) DEFAULT '',
                    about_desc TEXT,
                    contact_location VARCHAR(255) DEFAULT '',
                    contact_map_url VARCHAR(500) DEFAULT '',
                    contact_email VARCHAR(255) DEFAULT '',
                    hero_roles VARCHAR(500) DEFAULT '',
                    hero_description TEXT,
                    profile_pic_path VARCHAR(255) DEFAULT '',
                    cv_file_path VARCHAR(255) DEFAULT ''
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `);

        try { await db.query('ALTER TABLE admin_profile ADD COLUMN hero_roles VARCHAR(500) DEFAULT ""'); } catch(e) {}
        try { await db.query('ALTER TABLE admin_profile ADD COLUMN hero_description TEXT'); } catch(e) {}
        try { await db.query('ALTER TABLE admin_profile ADD COLUMN stat_ccna_title VARCHAR(255) DEFAULT ""'); } catch(e) {}
        try { await db.query('ALTER TABLE admin_profile ADD COLUMN stat_ceh_title VARCHAR(255) DEFAULT ""'); } catch(e) {}
        try { await db.query('ALTER TABLE admin_profile ADD COLUMN stat_ccna VARCHAR(255) DEFAULT ""'); } catch(e) {}
        try { await db.query('ALTER TABLE admin_profile ADD COLUMN stat_ceh VARCHAR(255) DEFAULT ""'); } catch(e) {}
        try { await db.query('ALTER TABLE admin_profile ADD COLUMN stat_years VARCHAR(255) DEFAULT ""'); } catch(e) {}
        try { await db.query('ALTER TABLE admin_profile ADD COLUMN stat_projects VARCHAR(255) DEFAULT ""'); } catch(e) {}
        try { await db.query('ALTER TABLE admin_profile ADD COLUMN about_title VARCHAR(255) DEFAULT ""'); } catch(e) {}
        try { await db.query('ALTER TABLE admin_profile ADD COLUMN about_desc TEXT'); } catch(e) {}
        try { await db.query('ALTER TABLE admin_profile ADD COLUMN contact_location VARCHAR(255) DEFAULT ""'); } catch(e) {}
        try { await db.query('ALTER TABLE admin_profile ADD COLUMN contact_map_url VARCHAR(500) DEFAULT ""'); } catch(e) {}
        try { await db.query('ALTER TABLE admin_profile ADD COLUMN contact_email VARCHAR(255) DEFAULT ""'); } catch(e) {}

            
            await db.query(`
                INSERT IGNORE INTO admin_profile (
                    id, hero_roles, hero_description, 
                    stat_ccna_title, stat_ccna, 
                    stat_ceh_title, stat_ceh, 
                    stat_years, stat_projects, 
                    about_title, about_desc
                ) VALUES (
                    1, 
                    'Network Engineer, Full-Stack Developer, Cybersecurity Specialist, Linux Server Administrator, Technical SEO Specialist', 
                    'CCNA-trained Network Engineer · Full-Stack Developer · Cybersecurity Enthusiast. Building secure and scalable digital experiences from Bangladesh.', 
                    'CCNA', '200-301 TRAINED', 
                    'Cyber', 'Security Labs', 
                    '3+', '20+', 
                    'CS Graduate · CCNA Trained · IT Professional',
                    'Write your about text here...'
                )
            `);
            console.log("✅ admin_profile table ready & default row ensured.");

        try {
            await db.query(`
                UPDATE admin_profile SET 
                    about_desc = 'Computer Science graduate and CCNA‑trained professional bridging the gap between secure network engineering and full‑stack development. From configuring robust network topologies to building dynamic software solutions, I thrive on solving complex technical problems.\n\nCertified in Digital Marketing & Technical SEO by Google, with hands-on coursework and lab training from Cisco Networking Academy, TCM Security, and Udemy in Network Engineering, Ethical Hacking, and Malware Analysis. Fluent in English, Bangla, and Hindi.'
                WHERE id = 1 AND (about_desc = 'Write your about text here...' OR about_desc IS NULL OR about_desc = '');
            `);
            await db.query(`
                UPDATE admin_profile SET contact_location = 'Faridpur, Bangladesh' WHERE id = 1 AND (contact_location IS NULL OR contact_location = '');
            `);
            await db.query(`
                UPDATE admin_profile SET contact_email = 'sabbirhasan800@gmail.com' WHERE id = 1 AND (contact_email IS NULL OR contact_email = '');
            `);
            console.log("✅ admin_profile row updated with missing defaults if it was empty.");
        } catch(e) { console.error("Admin Profile Update Error:", e); }

        } catch(e) { console.error("Admin Profile Init Error:", e); }

        
        await db.query(`
            CREATE TABLE IF NOT EXISTS exam_scores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                session_id VARCHAR(64) NOT NULL,
                exam_level VARCHAR(20) NOT NULL,
                score INT NOT NULL,
                total INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log("✅ exam_scores table ready.");

        // Media Channels and Featured Streams/Videos
        await db.query(`
            CREATE TABLE IF NOT EXISTS media_channels (
                id INT AUTO_INCREMENT PRIMARY KEY,
                platform VARCHAR(30) NOT NULL,
                channel_name VARCHAR(255) NOT NULL,
                channel_handle VARCHAR(100) DEFAULT '',
                channel_url VARCHAR(500) NOT NULL,
                avatar_url VARCHAR(500) DEFAULT '',
                subscribers_count VARCHAR(100) DEFAULT '',
                description TEXT,
                badge_text VARCHAR(100) DEFAULT 'CREATOR',
                is_live TINYINT(1) DEFAULT 0,
                sort_order INT DEFAULT 0,
                is_visible TINYINT(1) DEFAULT 1,
                yt_channel_id VARCHAR(100) DEFAULT '',
                last_synced_at TIMESTAMP NULL DEFAULT NULL,
                auto_sync TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        try { await db.query('ALTER TABLE media_channels ADD COLUMN yt_channel_id VARCHAR(100) DEFAULT ""'); } catch(e) {}
        try { await db.query('ALTER TABLE media_channels ADD COLUMN last_synced_at TIMESTAMP NULL DEFAULT NULL'); } catch(e) {}
        try { await db.query('ALTER TABLE media_channels ADD COLUMN auto_sync TINYINT(1) DEFAULT 1'); } catch(e) {}

        await db.query(`
            CREATE TABLE IF NOT EXISTS media_videos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                channel_id INT DEFAULT NULL,
                platform VARCHAR(30) NOT NULL,
                title VARCHAR(255) NOT NULL,
                video_url VARCHAR(500) NOT NULL,
                thumbnail_url VARCHAR(500) DEFAULT '',
                duration VARCHAR(50) DEFAULT '',
                views_count VARCHAR(50) DEFAULT '',
                is_featured TINYINT(1) DEFAULT 1,
                is_auto_feed TINYINT(1) DEFAULT 0,
                published_at TIMESTAMP NULL DEFAULT NULL,
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        try { await db.query('ALTER TABLE media_videos ADD COLUMN is_auto_feed TINYINT(1) DEFAULT 0'); } catch(e) {}
        try { await db.query('ALTER TABLE media_videos ADD COLUMN published_at TIMESTAMP NULL DEFAULT NULL'); } catch(e) {}
        console.log("✅ media_channels & media_videos tables ready with auto-feed support.");
    } catch (e) { console.error("Database table initialization error:", e.message); }
});

// ==========================================
// 📚 LEARN ENGLISH - EXAM SCORE ROUTES
// ==========================================
app.post('/api/learn/exam-score', async (req, res) => {
    try {
        const { session_id, exam_level, score, total } = req.body;
        if (!session_id || !exam_level || score == null || !total) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        await db.query(
            'INSERT INTO exam_scores (session_id, exam_level, score, total) VALUES (?, ?, ?, ?)',
            [session_id, exam_level, score, total]
        );
        res.json({ success: true, message: 'Score saved!' });
    } catch (err) {
        console.error("Exam score save error:", err.message);
        res.status(500).json({ error: 'Failed to save score' });
    }
});

app.get('/api/learn/exam-scores/:session_id', async (req, res) => {
    try {
        const { session_id } = req.params;
        const [rows] = await db.query(
            'SELECT * FROM exam_scores WHERE session_id = ? ORDER BY created_at DESC LIMIT 20',
            [session_id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
});

// ==========================================
// 2FA MANAGEMENT ROUTES
// ==========================================

app.get('/api/admin/2fa/status', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT two_factor_enabled FROM admin_profile WHERE id = 1');
        res.json({ enabled: rows[0]?.two_factor_enabled === 1 });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch 2FA status' });
    }
});

app.post('/api/admin/2fa/generate', requireAuth, async (req, res) => {
    try {
        const secretObj = speakeasy.generateSecret({ name: 'Portfolio Admin (' + process.env.ADMIN_USERNAME + ')' });
        const secret = secretObj.base32;
        const otpauthUrl = secretObj.otpauth_url;
        // otpauthUrl generated above
        
        await db.query('UPDATE admin_profile SET two_factor_secret = ? WHERE id = 1', [secret]);
        
        const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);
        res.json({ secret, qrCodeUrl });
    } catch (err) {
        console.error("2FA Generate Error:", err);
        res.status(500).json({ error: 'Failed to generate 2FA secret' });
    }
});

app.post('/api/admin/2fa/verify', requireAuth, upload.none(), async (req, res) => {
    const { token } = req.body;
    try {
        const [rows] = await db.query('SELECT two_factor_secret FROM admin_profile WHERE id = 1');
        const secret = rows[0]?.two_factor_secret;
        
        if (!secret) return res.status(400).json({ error: '2FA not initialized' });
        
        const isValid = speakeasy.totp.verify({ secret: secret, encoding: 'base32', token: token, window: 1 });
        if (isValid) {
            await db.query('UPDATE admin_profile SET two_factor_enabled = 1 WHERE id = 1');
            res.json({ success: true, message: '2FA enabled successfully!' });
        } else {
            res.status(400).json({ error: 'Invalid verification code' });
        }
    } catch (err) {
        console.error("2FA Verify Error:", err);
        res.status(500).json({ error: 'Failed to verify 2FA code' });
    }
});

app.post('/api/admin/2fa/disable', requireAuth, async (req, res) => {
    try {
        await db.query('UPDATE admin_profile SET two_factor_enabled = 0, two_factor_secret = NULL WHERE id = 1');
        res.json({ success: true, message: '2FA disabled successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to disable 2FA' });
    }
});
