require('dotenv').config();
const mysql = require('mysql2/promise');

function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

function calculateReadingTime(content) {
    const text = stripHtml(content);
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
}

function generateExcerpt(content, maxLength = 160) {
    const text = stripHtml(content);
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

async function runMigration() {
    console.log("🚀 Starting database upgrade for SabbirHasan.com...");
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'sabbir',
        password: process.env.DB_PASSWORD || 'sabbir',
        database: process.env.DB_NAME || 'portfolio_db'
    });

    try {
        // Older installations used an ENUM that did not allow the CMS "review" state.
        // Keep article workflow consistent across fresh and existing databases.
        const [statusColumn] = await db.query(`SHOW COLUMNS FROM blog_posts LIKE 'status'`);
        if (statusColumn.length && !String(statusColumn[0].Type).includes('review')) {
            console.log('Updating blog status column to support draft, review, and published states...');
            await db.query(`ALTER TABLE blog_posts MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'draft'`);
        }

        const columnsToAdd = [
            { name: 'excerpt', def: 'TEXT' },
            { name: 'meta_title', def: 'VARCHAR(255) DEFAULT ""' },
            { name: 'meta_description', def: 'TEXT' },
            { name: 'canonical_url', def: 'VARCHAR(500) DEFAULT ""' },
            { name: 'og_title', def: 'VARCHAR(255) DEFAULT ""' },
            { name: 'og_description', def: 'TEXT' },
            { name: 'og_image', def: 'VARCHAR(500) DEFAULT ""' },
            { name: 'tags', def: 'VARCHAR(255) DEFAULT ""' },
            { name: 'reading_time', def: 'VARCHAR(50) DEFAULT "3 min read"' },
            { name: 'focus_keyword', def: 'VARCHAR(100) DEFAULT ""' },
            { name: 'updated_at', def: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
            { name: 'is_featured', def: 'BOOLEAN DEFAULT FALSE' },
            { name: 'author_id', def: 'INT DEFAULT 1' }
        ];

        for (const col of columnsToAdd) {
            const [rows] = await db.query(`SHOW COLUMNS FROM blog_posts LIKE ?`, [col.name]);
            if (rows.length === 0) {
                console.log(`Adding column: ${col.name} ...`);
                await db.query(`ALTER TABLE blog_posts ADD COLUMN ${col.name} ${col.def}`);
            } else {
                console.log(`Column ${col.name} already exists.`);
            }
        }

        // Indexes
        const [indexes] = await db.query(`SHOW INDEX FROM blog_posts`);
        const indexNames = indexes.map(idx => idx.Key_name);

        if (!indexNames.includes('idx_slug')) {
            console.log("Adding index on slug...");
            try { await db.query("CREATE INDEX idx_slug ON blog_posts (slug)"); } catch(e) { console.log(e.message); }
        }
        if (!indexNames.includes('idx_status_created')) {
            console.log("Adding index on status, created_at...");
            try { await db.query("CREATE INDEX idx_status_created ON blog_posts (status, created_at)"); } catch(e) { console.log(e.message); }
        }
        if (!indexNames.includes('idx_category')) {
            console.log("Adding index on category...");
            try { await db.query("CREATE INDEX idx_category ON blog_posts (category)"); } catch(e) { console.log(e.message); }
        }

        // Backfill existing posts
        console.log("Backfilling missing excerpts, reading times, and meta for existing articles...");
        const [posts] = await db.query(`SELECT id, title, content, image_path, excerpt, reading_time, meta_title, meta_description, status FROM blog_posts`);
        
        for (const post of posts) {
            const excerpt = post.excerpt || generateExcerpt(post.content);
            const readingTime = post.reading_time || calculateReadingTime(post.content);
            const metaTitle = post.meta_title || `${post.title} | Sabbir Hasan`;
            const metaDesc = post.meta_description || excerpt;
            const status = post.status || 'published';

            await db.query(
                `UPDATE blog_posts SET excerpt = ?, reading_time = ?, meta_title = ?, meta_description = ?, status = ? WHERE id = ?`,
                [excerpt, readingTime, metaTitle, metaDesc, status, post.id]
            );
        }

        console.log(`✅ Database upgrade completed successfully! Updated ${posts.length} articles.`);
    } catch (err) {
        console.error("❌ Migration failed:", err);
    } finally {
        await db.end();
    }
}

runMigration();
