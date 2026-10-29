/**
 * Built-in Privacy-Friendly Blog Analytics Service
 * Sabbir Hasan Portfolio (sabbirhasan.com)
 * 
 * Features:
 * - Zero raw IP storage: 32-char SHA-256 rotating daily hash (IP + User-Agent + Daily Salt)
 * - 30-minute deduplication window per visitor per blog post
 * - Respects Do Not Track (DNT) header & Cookie Consent preferences
 * - Tracks total views, unique visitors, read duration, scroll depth
 * - Categorizes referrers (Direct, Google, LinkedIn, Twitter/X, GitHub, etc.)
 * - Categorizes devices (Desktop, Mobile, Tablet)
 * - Performance metrics, trends, top/low percentile badges, zero-views alert
 * - CSV export & optional GA4 Data API fallback
 */

const crypto = require('crypto');
const https = require('https');

const BOT_REGEX = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|googlebot|bingbot|yandex|duckduckbot|baiduspider|twitterbot|slackbot|discordbot|applebot|curl|wget|python|httpclient|postman/i;
const MOBILE_REGEX = /Mobile|Android|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer/i;
const TABLET_REGEX = /Tablet|iPad|PlayBook|Silk/i;

const SALT = process.env.SESSION_SECRET || 'sabbirhasan-analytics-salt-xyz';

// Get rotating daily visitor hash (anonymized, irreversible after day rolls over)
function generateVisitorHash(ip, userAgent, isDnt = false) {
    if (isDnt) {
        // High-privacy anonymous hash without IP/UA
        return crypto.randomBytes(16).toString('hex');
    }
    const today = new Date().toISOString().slice(0, 10);
    const raw = `${today}::${ip || '0.0.0.0'}::${userAgent || 'none'}::${SALT}`;
    return crypto.createHash('sha256').update(raw).digest('hex').substring(0, 32);
}

// Detect device category
function detectDeviceType(userAgent) {
    if (!userAgent) return 'desktop';
    if (TABLET_REGEX.test(userAgent)) return 'tablet';
    if (MOBILE_REGEX.test(userAgent)) return 'mobile';
    return 'desktop';
}

// Clean and categorize referrer
function categorizeReferrer(referrerUrl) {
    if (!referrerUrl) return 'Direct';
    try {
        const url = new URL(referrerUrl);
        const host = url.hostname.toLowerCase().replace(/^www\./, '');
        if (!host || host.includes('sabbirhasan.com') || host.includes('localhost') || host.includes('127.0.0.1')) {
            return 'Direct';
        }
        if (host.includes('google.')) return 'Google';
        if (host.includes('linkedin.')) return 'LinkedIn';
        if (host.includes('t.co') || host.includes('twitter.') || host.includes('x.com')) return 'Twitter/X';
        if (host.includes('github.')) return 'GitHub';
        if (host.includes('facebook.') || host.includes('fb.me')) return 'Facebook';
        if (host.includes('reddit.')) return 'Reddit';
        if (host.includes('youtube.')) return 'YouTube';
        if (host.includes('bing.')) return 'Bing';
        if (host.includes('duckduckgo.')) return 'DuckDuckGo';
        return host;
    } catch (e) {
        return 'Direct';
    }
}

// Record a blog view or update engagement duration/scroll depth
async function recordBlogView(db, {
    blogId,
    ip = '127.0.0.1',
    userAgent = '',
    referrer = '',
    country = 'UNKNOWN',
    duration = 0,
    scrollDepth = 0,
    isLeave = false,
    isDnt = false
}) {
    if (!db || !blogId) return { status: 'ignored', reason: 'missing_params' };

    const parsedBlogId = parseInt(blogId, 10);
    if (isNaN(parsedBlogId) || parsedBlogId <= 0) {
        return { status: 'ignored', reason: 'invalid_blog_id' };
    }

    const isBot = BOT_REGEX.test(userAgent || '') ? 1 : 0;
    const visitorHash = generateVisitorHash(ip, userAgent, isDnt);
    const deviceType = detectDeviceType(userAgent);
    const referrerCat = categorizeReferrer(referrer);
    const clampedDuration = Math.min(Math.max(parseInt(duration, 10) || 0, 0), 7200); // Max 2 hours
    const clampedScroll = Math.min(Math.max(parseInt(scrollDepth, 10) || 0, 0), 100);

    try {
        // Check for an existing view from this visitor for this blog in the past 30 minutes
        const [recent] = await db.query(
            `SELECT id, duration_seconds, scroll_depth 
             FROM blog_views 
             WHERE blog_id = ? AND visitor_hash = ? AND visited_at >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
             ORDER BY id DESC LIMIT 1`,
            [parsedBlogId, visitorHash]
        );

        if (recent && recent.length > 0) {
            const row = recent[0];
            // If it's a beacon update or leave beacon, update engagement metrics if higher
            const newDuration = Math.max(row.duration_seconds || 0, clampedDuration);
            const newScroll = Math.max(row.scroll_depth || 0, clampedScroll);

            await db.query(
                `UPDATE blog_views SET duration_seconds = ?, scroll_depth = ? WHERE id = ?`,
                [newDuration, newScroll, row.id]
            );
            return { status: 'updated', id: row.id };
        }

        // New visit
        const [result] = await db.query(
            `INSERT INTO blog_views 
             (blog_id, visitor_hash, referrer_domain, device_type, country, duration_seconds, scroll_depth, is_bot)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                parsedBlogId,
                visitorHash,
                referrerCat,
                deviceType,
                String(country || 'UNKNOWN').substring(0, 10),
                clampedDuration,
                clampedScroll,
                isBot
            ]
        );

        return { status: 'created', id: result.insertId };
    } catch (err) {
        console.error('Error in recordBlogView:', err.message);
        return { status: 'error', error: err.message };
    }
}

// Compute date ranges based on period
function getDateRange(period = '30d', customStart = null, customEnd = null) {
    const now = new Date();
    let startDate, endDate, prevStartDate, prevEndDate;

    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (period === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth(), prevEndDate.getDate(), 0, 0, 0, 0);
    } else if (period === '7d') {
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        prevStartDate.setHours(0, 0, 0, 0);
    } else if (period === '90d') {
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        prevStartDate.setHours(0, 0, 0, 0);
    } else if (period === 'custom' && customStart && customEnd) {
        startDate = new Date(customStart);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(customEnd);
        endDate.setHours(23, 59, 59, 999);
        const durationMs = endDate.getTime() - startDate.getTime();
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getTime() - durationMs);
    } else {
        // default 30d
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        prevStartDate.setHours(0, 0, 0, 0);
    }

    return {
        startDate: startDate.toISOString().slice(0, 19).replace('T', ' '),
        endDate: endDate.toISOString().slice(0, 19).replace('T', ' '),
        prevStartDate: prevStartDate.toISOString().slice(0, 19).replace('T', ' '),
        prevEndDate: prevEndDate.toISOString().slice(0, 19).replace('T', ' ')
    };
}

// Calculate percentage change
function calcPctChange(current, previous) {
    if (!previous || previous === 0) {
        return current > 0 ? 100 : 0;
    }
    const diff = current - previous;
    return Math.round((diff / previous) * 100);
}

// Fetch complete blog analytics dashboard metrics
async function getBlogAnalytics(db, { period = '30d', customStart = null, customEnd = null, blogId = null }) {
    if (!db) return null;

    const { startDate, endDate, prevStartDate, prevEndDate } = getDateRange(period, customStart, customEnd);

    let blogFilter = '';
    const paramsCurrent = [startDate, endDate];
    const paramsPrev = [prevStartDate, prevEndDate];

    if (blogId) {
        const idInt = parseInt(blogId, 10);
        if (!isNaN(idInt)) {
            blogFilter = ' AND v.blog_id = ?';
            paramsCurrent.push(idInt);
            paramsPrev.push(idInt);
        }
    }

    try {
        // 1. Current Period Summary
        const [currSummary] = await db.query(
            `SELECT 
                COUNT(*) as total_views,
                COUNT(DISTINCT visitor_hash) as unique_visitors,
                COALESCE(AVG(CASE WHEN duration_seconds > 0 THEN duration_seconds END), 0) as avg_duration,
                COALESCE(AVG(CASE WHEN scroll_depth > 0 THEN scroll_depth END), 0) as avg_scroll
             FROM blog_views v
             WHERE v.is_bot = 0 AND v.visited_at >= ? AND v.visited_at <= ? ${blogFilter}`,
            paramsCurrent
        );

        // 2. Previous Period Summary (for comparison)
        const [prevSummary] = await db.query(
            `SELECT 
                COUNT(*) as total_views,
                COUNT(DISTINCT visitor_hash) as unique_visitors,
                COALESCE(AVG(CASE WHEN duration_seconds > 0 THEN duration_seconds END), 0) as avg_duration,
                COALESCE(AVG(CASE WHEN scroll_depth > 0 THEN scroll_depth END), 0) as avg_scroll
             FROM blog_views v
             WHERE v.is_bot = 0 AND v.visited_at >= ? AND v.visited_at <= ? ${blogFilter}`,
            paramsPrev
        );

        const current = currSummary[0] || {};
        const previous = prevSummary[0] || {};

        const totalViews = parseInt(current.total_views, 10) || 0;
        const prevTotalViews = parseInt(previous.total_views, 10) || 0;

        const uniqueVisitors = parseInt(current.unique_visitors, 10) || 0;
        const prevUniqueVisitors = parseInt(previous.unique_visitors, 10) || 0;

        const avgDuration = Math.round(parseFloat(current.avg_duration) || 0);
        const prevAvgDuration = Math.round(parseFloat(previous.avg_duration) || 0);

        const avgScroll = Math.round(parseFloat(current.avg_scroll) || 0);
        const prevAvgScroll = Math.round(parseFloat(previous.avg_scroll) || 0);

        // 3. Daily Trend Chart Data
        const [trendRows] = await db.query(
            `SELECT 
                DATE_FORMAT(visited_at, '%Y-%m-%d') as date,
                COUNT(*) as views,
                COUNT(DISTINCT visitor_hash) as uniques
             FROM blog_views v
             WHERE v.is_bot = 0 AND v.visited_at >= ? AND v.visited_at <= ? ${blogFilter}
             GROUP BY DATE_FORMAT(visited_at, '%Y-%m-%d')
             ORDER BY date ASC`,
            paramsCurrent
        );

        // 4. Referrer Breakdown
        const [referrers] = await db.query(
            `SELECT 
                referrer_domain as source,
                COUNT(*) as count
             FROM blog_views v
             WHERE v.is_bot = 0 AND v.visited_at >= ? AND v.visited_at <= ? ${blogFilter}
             GROUP BY referrer_domain
             ORDER BY count DESC
             LIMIT 10`,
            paramsCurrent
        );

        // 5. Device Breakdown
        const [devices] = await db.query(
            `SELECT 
                device_type,
                COUNT(*) as count
             FROM blog_views v
             WHERE v.is_bot = 0 AND v.visited_at >= ? AND v.visited_at <= ? ${blogFilter}
             GROUP BY device_type
             ORDER BY count DESC`,
            paramsCurrent
        );

        // 6. Per-Blog Performance Table
        const [blogRows] = await db.query(
            `SELECT 
                b.id,
                b.title,
                b.slug,
                b.status,
                b.created_at,
                COUNT(v.id) as views,
                COUNT(DISTINCT v.visitor_hash) as unique_visitors,
                COALESCE(AVG(CASE WHEN v.duration_seconds > 0 THEN v.duration_seconds END), 0) as avg_duration,
                COALESCE(AVG(CASE WHEN v.scroll_depth > 0 THEN v.scroll_depth END), 0) as avg_scroll
             FROM blog_posts b
             LEFT JOIN blog_views v 
                ON b.id = v.blog_id 
                AND v.is_bot = 0 
                AND v.visited_at >= ? 
                AND v.visited_at <= ?
             WHERE b.deleted_at IS NULL
             GROUP BY b.id, b.title, b.slug, b.status, b.created_at
             ORDER BY views DESC, b.created_at DESC`,
            [startDate, endDate]
        );

        // Calculate percentiles for Top 10% and Low 10%
        const viewCounts = blogRows.map(b => parseInt(b.views, 10) || 0).sort((a, b) => a - b);
        let topThreshold = 0;
        let lowThreshold = 0;
        if (viewCounts.length >= 5) {
            const topIndex = Math.floor(viewCounts.length * 0.9);
            const lowIndex = Math.floor(viewCounts.length * 0.1);
            topThreshold = viewCounts[topIndex];
            lowThreshold = viewCounts[lowIndex];
        }

        const formattedBlogRows = blogRows.map(b => {
            const vCount = parseInt(b.views, 10) || 0;
            let badge = 'normal';
            if (viewCounts.length >= 5 && vCount > 0) {
                if (vCount >= topThreshold) badge = 'top';
                else if (vCount <= lowThreshold) badge = 'low';
            }
            return {
                id: b.id,
                title: b.title,
                slug: b.slug,
                status: b.status,
                created_at: b.created_at,
                views: vCount,
                unique_visitors: parseInt(b.unique_visitors, 10) || 0,
                avg_duration: Math.round(parseFloat(b.avg_duration) || 0),
                avg_scroll: Math.round(parseFloat(b.avg_scroll) || 0),
                performance_badge: badge
            };
        });

        // 7. Zero Views in 30 Days Alert List
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
        const [zeroViewBlogs] = await db.query(
            `SELECT b.id, b.title, b.slug, b.created_at
             FROM blog_posts b
             LEFT JOIN blog_views v 
                ON b.id = v.blog_id 
                AND v.is_bot = 0 
                AND v.visited_at >= ?
             WHERE b.deleted_at IS NULL
             GROUP BY b.id, b.title, b.slug, b.created_at
             HAVING COUNT(v.id) = 0
             ORDER BY b.created_at DESC`,
            [thirtyDaysAgo]
        );

        return {
            period,
            dateRange: { startDate, endDate },
            summary: {
                total_views: totalViews,
                views_change: calcPctChange(totalViews, prevTotalViews),
                unique_visitors: uniqueVisitors,
                uniques_change: calcPctChange(uniqueVisitors, prevUniqueVisitors),
                avg_duration: avgDuration,
                duration_change: calcPctChange(avgDuration, prevAvgDuration),
                avg_scroll: avgScroll,
                scroll_change: calcPctChange(avgScroll, prevAvgScroll)
            },
            trend: trendRows,
            referrers,
            devices,
            blogs: formattedBlogRows,
            zeroViewBlogs
        };
    } catch (err) {
        console.error('getBlogAnalytics error:', err.message);
        throw err;
    }
}

// Fetch single blog detail for drill-down drawer/modal
async function getBlogDetailAnalytics(db, blogId, period = '30d') {
    if (!db || !blogId) return null;
    const { startDate, endDate } = getDateRange(period);
    const idInt = parseInt(blogId, 10);

    const [post] = await db.query(
        `SELECT id, title, slug, status, created_at FROM blog_posts WHERE id = ? AND deleted_at IS NULL`,
        [idInt]
    );
    if (!post || post.length === 0) return null;

    const [summary] = await db.query(
        `SELECT 
            COUNT(*) as total_views,
            COUNT(DISTINCT visitor_hash) as unique_visitors,
            COALESCE(AVG(CASE WHEN duration_seconds > 0 THEN duration_seconds END), 0) as avg_duration,
            COALESCE(AVG(CASE WHEN scroll_depth > 0 THEN scroll_depth END), 0) as avg_scroll
         FROM blog_views 
         WHERE blog_id = ? AND is_bot = 0 AND visited_at >= ? AND visited_at <= ?`,
        [idInt, startDate, endDate]
    );

    const [trend] = await db.query(
        `SELECT 
            DATE_FORMAT(visited_at, '%Y-%m-%d') as date,
            COUNT(*) as views,
            COUNT(DISTINCT visitor_hash) as uniques
         FROM blog_views 
         WHERE blog_id = ? AND is_bot = 0 AND visited_at >= ? AND visited_at <= ?
         GROUP BY DATE_FORMAT(visited_at, '%Y-%m-%d')
         ORDER BY date ASC`,
        [idInt, startDate, endDate]
    );

    const [referrers] = await db.query(
        `SELECT referrer_domain as source, COUNT(*) as count 
         FROM blog_views 
         WHERE blog_id = ? AND is_bot = 0 AND visited_at >= ? AND visited_at <= ?
         GROUP BY referrer_domain 
         ORDER BY count DESC 
         LIMIT 6`,
        [idInt, startDate, endDate]
    );

    const [devices] = await db.query(
        `SELECT device_type, COUNT(*) as count 
         FROM blog_views 
         WHERE blog_id = ? AND is_bot = 0 AND visited_at >= ? AND visited_at <= ?
         GROUP BY device_type 
         ORDER BY count DESC`,
        [idInt, startDate, endDate]
    );

    const s = summary[0] || {};
    return {
        blog: post[0],
        period,
        summary: {
            total_views: parseInt(s.total_views, 10) || 0,
            unique_visitors: parseInt(s.unique_visitors, 10) || 0,
            avg_duration: Math.round(parseFloat(s.avg_duration) || 0),
            avg_scroll: Math.round(parseFloat(s.avg_scroll) || 0)
        },
        trend,
        referrers,
        devices
    };
}

// Generate CSV export string for blog analytics
function generateAnalyticsCsv(blogs, periodName = '30d') {
    const headers = ['ID', 'Title', 'Slug', 'Status', 'Published Date', 'Views', 'Unique Visitors', 'Avg Read Time (s)', 'Avg Scroll (%)'];
    const rows = [headers.join(',')];

    blogs.forEach(b => {
        const cleanTitle = `"${String(b.title || '').replace(/"/g, '""')}"`;
        const dateStr = b.created_at ? new Date(b.created_at).toISOString().slice(0, 10) : '';
        rows.push([
            b.id,
            cleanTitle,
            b.slug || '',
            b.status || '',
            dateStr,
            b.views || 0,
            b.unique_visitors || 0,
            b.avg_duration || 0,
            b.avg_scroll || 0
        ].join(','));
    });

    return rows.join('\r\n');
}

// Fetch all-time view counts mapped by blog_id (for the main blog management table)
async function getBlogViewCounts(db) {
    if (!db) return {};
    try {
        const [rows] = await db.query(
            `SELECT blog_id, COUNT(*) as view_count 
             FROM blog_views 
             WHERE is_bot = 0 
             GROUP BY blog_id`
        );
        const map = {};
        rows.forEach(r => {
            map[r.blog_id] = parseInt(r.view_count, 10) || 0;
        });
        return map;
    } catch (e) {
        console.error('getBlogViewCounts error:', e.message);
        return {};
    }
}

// Overview widget data for the Admin Dashboard Overview tab
async function getOverviewAnalyticsWidget(db) {
    if (!db) return { totalViews: 0, topPosts: [] };
    try {
        const [totalRow] = await db.query(
            `SELECT COUNT(*) as total_views FROM blog_views WHERE is_bot = 0`
        );
        const [topPosts] = await db.query(
            `SELECT b.id, b.title, b.slug, COUNT(v.id) as views
             FROM blog_posts b
             JOIN blog_views v ON b.id = v.blog_id AND v.is_bot = 0
             WHERE b.deleted_at IS NULL
             GROUP BY b.id, b.title, b.slug
             ORDER BY views DESC
             LIMIT 3`
        );
        return {
            totalViews: totalRow[0]?.total_views || 0,
            topPosts: topPosts || []
        };
    } catch (e) {
        return { totalViews: 0, topPosts: [] };
    }
}

module.exports = {
    recordBlogView,
    getBlogAnalytics,
    getBlogDetailAnalytics,
    generateAnalyticsCsv,
    getBlogViewCounts,
    getOverviewAnalyticsWidget,
    generateVisitorHash,
    detectDeviceType,
    categorizeReferrer
};

