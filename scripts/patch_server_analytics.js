const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, '../server.js');
let code = fs.readFileSync(serverFile, 'utf8');

// 1. Add tracking and analytics imports at top
if (!code.includes("require('./trackingService')")) {
    const importTarget = "const { renderBlogListingHtml, renderArticleHtml, stripHtml } = require('./blogRenderer');";
    const newImports = `${importTarget}
const {
    initTrackingSettings,
    getTrackingSettings,
    updateTrackingSettings,
    injectTrackingIntoHtml
} = require('./trackingService');
const {
    recordBlogView,
    getBlogAnalytics,
    getBlogDetailAnalytics,
    generateAnalyticsCsv,
    getBlogViewCounts,
    getOverviewAnalyticsWidget
} = require('./analyticsService');`;
    code = code.replace(importTarget, newImports);
    console.log("✅ Added tracking & analytics imports to server.js");
}

// 2. Add sendHtmlWithTracking helper before public routes
if (!code.includes("function sendHtmlWithTracking")) {
    const helperCode = `
// ==========================================
// 🔍 DYNAMIC TRACKING INJECTION HELPER
// ==========================================
function sendHtmlWithTracking(req, res, filePath) {
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
}
`;
    code = code.replace("// Dedicated Clean Pages", helperCode + "\n// Dedicated Clean Pages");
    console.log("✅ Added sendHtmlWithTracking helper to server.js");
}

// 3. Update public HTML routes to use sendHtmlWithTracking
const publicPages = [
    { target: "res.sendFile(path.join(__dirname, 'public/resume.html'));", file: "public/resume.html" },
    { target: "res.sendFile(path.join(__dirname, 'public/about.html'));", file: "public/about.html" },
    { target: "res.sendFile(path.join(__dirname, 'public/projects.html'));", file: "public/projects.html" },
    { target: "res.sendFile(path.join(__dirname, 'public/project.html'));", file: "public/project.html" },
    { target: "res.sendFile(path.join(__dirname, 'public/contact.html'));", file: "public/contact.html" },
    { target: "res.sendFile(path.join(__dirname, 'public/tools.html'));", file: "public/tools.html" },
    { target: "res.sendFile(path.join(__dirname, 'public/tools/subnet-calculator.html'));", file: "public/tools/subnet-calculator.html" },
    { target: "res.sendFile(path.join(__dirname, 'public/tools/dev-utilities.html'));", file: "public/tools/dev-utilities.html" },
    { target: "res.sendFile(path.join(__dirname, 'public/streams.html'));", file: "public/streams.html" },
    { target: "res.sendFile(path.join(__dirname, 'public/sitemap.html'));", file: "public/sitemap.html" },
    { target: "res.sendFile(path.join(__dirname, 'public', 'index.html'));", file: "public/index.html" }
];

publicPages.forEach(p => {
    if (code.includes(p.target)) {
        code = code.replace(p.target, `sendHtmlWithTracking(req, res, path.join(__dirname, '${p.file}'));`);
    }
});
console.log("✅ Updated public HTML routes to inject tracking automatically");

// 4. Update handleBlogListing and /blog/:slug to inject tracking into SSR HTML and filter deleted_at
if (!code.includes("injectTrackingIntoHtml(html, req)")) {
    code = code.replace(
        "res.send(html);\r\n    } catch (err) {",
        "res.send(injectTrackingIntoHtml(html, req));\r\n    } catch (err) {"
    );
    code = code.replace(
        "res.send(html);\n    } catch (err) {",
        "res.send(injectTrackingIntoHtml(html, req));\n    } catch (err) {"
    );
    console.log("✅ Injected tracking into handleBlogListing & article routes");
}

// 5. Update sitemap and blog queries to filter deleted_at IS NULL
code = code.replace(
    'SELECT slug, id, updated_at, created_at FROM blog_posts WHERE status="published" ORDER BY created_at DESC',
    'SELECT slug, id, updated_at, created_at FROM blog_posts WHERE status="published" AND deleted_at IS NULL ORDER BY created_at DESC'
);
code = code.replace(
    'SELECT DISTINCT category FROM blog_posts WHERE status="published" AND category IS NOT NULL AND category != ""',
    'SELECT DISTINCT category FROM blog_posts WHERE status="published" AND deleted_at IS NULL AND category IS NOT NULL AND category != ""'
);
code = code.replace(
    "let countQuery = 'SELECT COUNT(*) as total FROM blog_posts WHERE status = \"published\"';",
    "let countQuery = 'SELECT COUNT(*) as total FROM blog_posts WHERE status = \"published\" AND deleted_at IS NULL';"
);
code = code.replace(
    "let postsQuery = 'SELECT id, title, slug, category, excerpt, content, image_path, reading_time, created_at, updated_at FROM blog_posts WHERE status = \"published\"';",
    "let postsQuery = 'SELECT id, title, slug, category, excerpt, content, image_path, reading_time, created_at, updated_at FROM blog_posts WHERE status = \"published\" AND deleted_at IS NULL';"
);
code = code.replace(
    "SELECT category, COUNT(*) as count FROM blog_posts WHERE status = \"published\" AND category IS NOT NULL AND category != \"\" GROUP BY category ORDER BY count DESC",
    "SELECT category, COUNT(*) as count FROM blog_posts WHERE status = \"published\" AND deleted_at IS NULL AND category IS NOT NULL AND category != \"\" GROUP BY category ORDER BY count DESC"
);
code = code.replace(
    "SELECT id, title, slug, category, excerpt, content, image_path, reading_time FROM blog_posts WHERE category = ? AND id != ? AND status = \"published\" ORDER BY created_at DESC LIMIT 3",
    "SELECT id, title, slug, category, excerpt, content, image_path, reading_time FROM blog_posts WHERE category = ? AND id != ? AND status = \"published\" AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 3"
);
code = code.replace(
    "SELECT id, title, slug FROM blog_posts WHERE id < ? AND status = \"published\" ORDER BY id DESC LIMIT 1",
    "SELECT id, title, slug FROM blog_posts WHERE id < ? AND status = \"published\" AND deleted_at IS NULL ORDER BY id DESC LIMIT 1"
);
code = code.replace(
    "SELECT id, title, slug FROM blog_posts WHERE id > ? AND status = \"published\" ORDER BY id ASC LIMIT 1",
    "SELECT id, title, slug FROM blog_posts WHERE id > ? AND status = \"published\" AND deleted_at IS NULL ORDER BY id ASC LIMIT 1"
);
code = code.replace(
    "WHERE status = \"published\" AND (title LIKE ? OR category LIKE ? OR excerpt LIKE ? OR content LIKE ?)",
    "WHERE status = \"published\" AND deleted_at IS NULL AND (title LIKE ? OR category LIKE ? OR excerpt LIKE ? OR content LIKE ?)"
);

// 6. Check soft-deleted article in /blog/:slug
if (!code.includes("post.deleted_at")) {
    const postCheckTarget = "const post = rows[0];";
    const postCheckReplacement = `const post = rows[0];
        if (post.deleted_at) {
            return res.status(404).send('<!DOCTYPE html><html><head><title>Article Not Found | Sabbir Hasan</title><link rel="stylesheet" href="/style.css"></head><body style="text-align:center; padding:5rem 1rem; font-family:sans-serif; background:#060913; color:#fff;"><h1>404 — Article Not Available</h1><p style="color:#94a3b8;">This article has been moved to trash or is no longer published.</p><a href="/blog" style="display:inline-block; margin-top:1.5rem; color:#c8ff00; text-decoration:none; font-weight:700;">← Back to Blog</a></body></html>');
        }`;
    code = code.replace(postCheckTarget, postCheckReplacement);
    console.log("✅ Added 404/deleted_at check to /blog/:slug");
}

// 7. Add Direct admin routes for tracking & blog-analytics
if (!code.includes("app.get('/admin/tracking'")) {
    const adminRoutes = `
// Direct Admin Navigation Shortcuts
app.get('/admin/tracking', requireAuth, (req, res) => {
    res.redirect('/admin/dashboard/dashboard.html#tab-tracking');
});
app.get('/admin/blog-analytics', requireAuth, (req, res) => {
    res.redirect('/admin/dashboard/dashboard.html#tab-blog-analytics');
});
`;
    code = code.replace("app.get('/admin', (req, res) => {", adminRoutes + "\napp.get('/admin', (req, res) => {");
    console.log("✅ Added admin route shortcuts for /admin/tracking and /admin/blog-analytics");
}

// 8. Replace /api/admin/blog and add Tracking & Analytics APIs
if (!code.includes("/api/admin/tracking-settings")) {
    const newAdminApis = `
// ==========================================
// 🎯 TRACKING & ANALYTICS SETTINGS APIS
// ==========================================
app.get('/api/admin/tracking-settings', requireAuth, (req, res) => {
    res.json(getTrackingSettings());
});

app.put('/api/admin/tracking-settings', requireAuth, express.json(), async (req, res) => {
    try {
        const result = await updateTrackingSettings(db, req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.errors?.join('; ') || 'Invalid tracking settings' });
        }
        res.json({
            success: true,
            message: 'Tracking & Analytics settings updated successfully!',
            settings: result.settings
        });
    } catch (err) {
        console.error("Error updating tracking settings:", err);
        res.status(500).json({ error: 'Failed to update tracking settings: ' + err.message });
    }
});

// ==========================================
// 📊 BUILT-IN FIRST-PARTY BLOG ANALYTICS APIS
// ==========================================
app.post('/api/track/blog-view', express.json({ type: ['application/json', 'text/plain'] }), async (req, res) => {
    // Exclude logged in admins from tracking
    if (req.session && req.session.isAuthenticated) {
        return res.json({ ok: true, ignored: 'admin_session' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const { blogId, duration, scrollDepth, isLeave, referrer, isDnt } = body || {};
        const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
        const userAgent = req.headers['user-agent'] || '';
        const country = req.headers['cf-ipcountry'] || 'UNKNOWN';
        const clientDnt = isDnt || req.headers['dnt'] === '1';

        await recordBlogView(db, {
            blogId,
            ip,
            userAgent,
            referrer: referrer || req.headers['referer'] || '',
            country,
            duration,
            scrollDepth,
            isLeave: !!isLeave,
            isDnt: clientDnt
        });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: 'Tracking error' });
    }
});

app.get('/api/admin/blog-analytics', requireAuth, async (req, res) => {
    try {
        const { period = '30d', startDate, endDate, blogId } = req.query;
        const data = await getBlogAnalytics(db, {
            period,
            customStart: startDate,
            customEnd: endDate,
            blogId
        });
        res.json(data);
    } catch (err) {
        console.error("Blog analytics API error:", err);
        res.status(500).json({ error: 'Failed to fetch blog analytics: ' + err.message });
    }
});

app.get('/api/admin/blog-analytics/detail/:id', requireAuth, async (req, res) => {
    try {
        const data = await getBlogDetailAnalytics(db, req.params.id, req.query.period || '30d');
        if (!data) return res.status(404).json({ error: 'Article not found' });
        res.json(data);
    } catch (err) {
        console.error("Blog detail analytics API error:", err);
        res.status(500).json({ error: 'Failed to fetch article detail analytics' });
    }
});

app.get('/api/admin/blog-analytics/export', requireAuth, async (req, res) => {
    try {
        const period = req.query.period || '30d';
        const data = await getBlogAnalytics(db, {
            period,
            customStart: req.query.startDate,
            customEnd: req.query.endDate
        });
        const csv = generateAnalyticsCsv(data.blogs, period);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', \`attachment; filename="blog-analytics-\${period}.csv"\`);
        res.send(csv);
    } catch (err) {
        console.error("CSV Export error:", err);
        res.status(500).send('Error generating CSV export');
    }
});

app.get('/api/admin/blog-analytics/overview-widget', requireAuth, async (req, res) => {
    try {
        const widget = await getOverviewAnalyticsWidget(db);
        res.json(widget);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch overview analytics' });
    }
});

// ==========================================
// 📝 ENHANCED BLOG ADMIN & BULK ACTIONS
// ==========================================
app.post('/api/admin/blogs/bulk', requireAuth, express.json(), async (req, res) => {
    const { action, ids } = req.body || {};
    if (!action || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Invalid request: action and non-empty ids array required.' });
    }

    const validIds = ids.map(id => parseInt(id, 10)).filter(id => !isNaN(id) && id > 0);
    if (validIds.length === 0) {
        return res.status(400).json({ error: 'No valid blog IDs provided.' });
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        if (action === 'trash') {
            await conn.query(\`UPDATE blog_posts SET deleted_at = NOW() WHERE id IN (?) AND deleted_at IS NULL\`, [validIds]);
        } else if (action === 'restore') {
            await conn.query(\`UPDATE blog_posts SET deleted_at = NULL WHERE id IN (?) AND deleted_at IS NOT NULL\`, [validIds]);
        } else if (action === 'delete') {
            // Permanent delete: unlink images and delete records
            const [imgRows] = await conn.query(\`SELECT image_path FROM blog_posts WHERE id IN (?)\`, [validIds]);
            imgRows.forEach(r => {
                if (r.image_path) {
                    fs.unlink(path.join(__dirname, 'public', r.image_path), () => {});
                }
            });
            await conn.query(\`DELETE FROM blog_views WHERE blog_id IN (?)\`, [validIds]);
            await conn.query(\`DELETE FROM blog_posts WHERE id IN (?)\`, [validIds]);
        } else if (action === 'publish') {
            await conn.query(\`UPDATE blog_posts SET status = 'published' WHERE id IN (?) AND deleted_at IS NULL\`, [validIds]);
        } else if (action === 'draft') {
            await conn.query(\`UPDATE blog_posts SET status = 'draft' WHERE id IN (?) AND deleted_at IS NULL\`, [validIds]);
        } else {
            await conn.rollback();
            conn.release();
            return res.status(400).json({ error: \`Unsupported bulk action: \${action}\` });
        }

        await conn.commit();
        conn.release();

        delete apiCache['blog'];
        invalidateApiCache('blog');

        res.json({
            success: true,
            message: \`Successfully executed bulk \${action} on \${validIds.length} article(s).\`,
            affectedCount: validIds.length
        });
    } catch (err) {
        await conn.rollback();
        conn.release();
        console.error('Bulk blogs action error:', err);
        res.status(500).json({ error: 'Bulk action failed: ' + err.message });
    }
});

app.post('/api/admin/blog/:id/restore', requireAuth, async (req, res) => {
    try {
        await db.query('UPDATE blog_posts SET deleted_at = NULL WHERE id = ?', [req.params.id]);
        delete apiCache['blog'];
        invalidateApiCache('blog');
        res.json({ success: true, message: 'Article restored successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to restore article' });
    }
});
`;

    // Replace old app.get('/api/admin/blog') with enhanced version including view counts and trash filter
    const oldBlogGet = `app.get('/api/admin/blog', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch admin blogs' });
    }
});`;

    const newBlogGet = `app.get('/api/admin/blog', requireAuth, async (req, res) => {
    try {
        const isTrash = req.query.trash === '1' || req.query.status === 'trash';
        const query = isTrash
            ? 'SELECT * FROM blog_posts WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC'
            : 'SELECT * FROM blog_posts WHERE deleted_at IS NULL ORDER BY created_at DESC';
        const [rows] = await db.query(query);

        let trashCount = 0;
        try {
            const [tCount] = await db.query('SELECT COUNT(*) as cnt FROM blog_posts WHERE deleted_at IS NOT NULL');
            trashCount = tCount[0]?.cnt || 0;
        } catch(e) {}

        const viewMap = await getBlogViewCounts(db);
        rows.forEach(r => {
            r.views = viewMap[r.id] || 0;
            r.trash_count = trashCount;
        });

        res.setHeader('X-Trash-Count', trashCount);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch admin blogs: ' + err.message });
    }
});

${newAdminApis}`;

    code = code.replace(oldBlogGet, newBlogGet);
    console.log("✅ Replaced /api/admin/blog and added new Analytics & Tracking APIs");
}

// 9. Update app.delete('/api/admin/blog/:id') to support soft delete vs permanent
const oldBlogDelete = `app.delete('/api/admin/blog/:id', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image_path FROM blog_posts WHERE id = ?', [req.params.id]);
        if (rows[0]?.image_path) fs.unlink(path.join(__dirname, 'public', rows[0].image_path), () => {});
        await db.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]); res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});`;

const newBlogDelete = `app.delete('/api/admin/blog/:id', requireAuth, async (req, res) => {
    try {
        const isPermanent = req.query.permanent === 'true' || req.query.permanent === '1';
        if (isPermanent) {
            const [rows] = await db.query('SELECT image_path FROM blog_posts WHERE id = ?', [req.params.id]);
            if (rows[0]?.image_path) fs.unlink(path.join(__dirname, 'public', rows[0].image_path), () => {});
            try { await db.query('DELETE FROM blog_views WHERE blog_id = ?', [req.params.id]); } catch(e) {}
            await db.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
            delete apiCache['blog'];
            invalidateApiCache('blog');
            res.json({ message: 'Permanently deleted' });
        } else {
            await db.query('UPDATE blog_posts SET deleted_at = NOW() WHERE id = ?', [req.params.id]);
            delete apiCache['blog'];
            invalidateApiCache('blog');
            res.json({ message: 'Moved to trash' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete article' });
    }
});`;

code = code.replace(oldBlogDelete, newBlogDelete);

// 10. Auto-create/verify tracking & analytics tables in app.listen
if (!code.includes("initTrackingSettings(db)")) {
    const dbInitTarget = 'console.log("✅ github_images table ready.");';
    const trackingDbInit = `${dbInitTarget}
        // Auto-create/verify site_settings and blog_views tables
        try {
            await db.query(\`
                CREATE TABLE IF NOT EXISTS site_settings (
                    setting_key VARCHAR(100) PRIMARY KEY,
                    setting_value LONGTEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            \`);
            await db.query(\`
                CREATE TABLE IF NOT EXISTS blog_views (
                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                    blog_id INT NOT NULL,
                    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    visitor_hash VARCHAR(64) NOT NULL,
                    referrer_domain VARCHAR(255) DEFAULT '',
                    device_type VARCHAR(20) DEFAULT 'desktop',
                    country VARCHAR(10) DEFAULT 'UNKNOWN',
                    duration_seconds INT DEFAULT 0,
                    scroll_depth INT DEFAULT 0,
                    is_bot TINYINT(1) DEFAULT 0,
                    INDEX idx_blog_visited (blog_id, visited_at),
                    INDEX idx_visited_at (visited_at)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            \`);
            try { await db.query(\`ALTER TABLE blog_posts ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL\`); } catch(e) {}
            try { await db.query(\`CREATE INDEX idx_deleted_at ON blog_posts (deleted_at)\`); } catch(e) {}
            await initTrackingSettings(db);
            console.log("✅ site_settings & blog_views tables ready.");
        } catch (e) {
            console.log("Tracking tables init notice:", e.message);
        }`;
    code = code.replace(dbInitTarget, trackingDbInit);
    console.log("✅ Added tracking & analytics tables auto-check to app.listen");
}

fs.writeFileSync(serverFile, code, 'utf8');
console.log("🎉 Successfully patched server.js!");

