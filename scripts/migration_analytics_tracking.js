require('dotenv').config();
const mysql = require('mysql2/promise');

async function runMigration() {
    console.log("🚀 Running Analytics & Tracking Database Migration...");
    
    let db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'portfolio_db',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
        });
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
        console.log("ℹ️ Ensure your MySQL server is running and .env credentials are correct.");
        return;
    }

    try {
        // 1. site_settings table
        await db.query(`
            CREATE TABLE IF NOT EXISTS site_settings (
                setting_key VARCHAR(100) PRIMARY KEY,
                setting_value LONGTEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log("✅ Table 'site_settings' verified/created.");

        // 2. Default settings initialization
        const defaultSettings = [
            ['ga4_enabled', '0'],
            ['ga4_measurement_id', ''],
            ['gtm_enabled', '0'],
            ['gtm_container_id', ''],
            ['pixel_enabled', '0'],
            ['pixel_id', ''],
            ['clarity_enabled', '0'],
            ['clarity_id', ''],
            ['gsc_verification_tag', ''],
            ['custom_head_script', ''],
            ['custom_body_script', ''],
            ['cookie_consent_required', '0'],
            ['ga4_property_id', ''],
            ['ga4_service_account_json', '']
        ];

        for (const [key, val] of defaultSettings) {
            await db.query(
                `INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)`,
                [key, val]
            );
        }
        console.log("✅ Default tracking settings verified/inserted.");

        // 3. blog_views table
        await db.query(`
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
        `);
        console.log("✅ Table 'blog_views' verified/created.");

        // 4. blog_posts soft delete column (deleted_at)
        const [delCol] = await db.query(`SHOW COLUMNS FROM blog_posts LIKE 'deleted_at'`);
        if (delCol.length === 0) {
            await db.query(`ALTER TABLE blog_posts ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL`);
            console.log("✅ Added column 'deleted_at' to blog_posts.");
        } else {
            console.log("ℹ️ Column 'deleted_at' already exists on blog_posts.");
        }

        const [indexes] = await db.query(`SHOW INDEX FROM blog_posts`);
        const indexNames = indexes.map(i => i.Key_name);
        if (!indexNames.includes('idx_deleted_at')) {
            try {
                await db.query(`CREATE INDEX idx_deleted_at ON blog_posts (deleted_at)`);
                console.log("✅ Created index idx_deleted_at on blog_posts.");
            } catch (e) {
                console.log("Index notice:", e.message);
            }
        }

        console.log("\n🎉 Analytics & Tracking Migration completed successfully!");
    } catch (err) {
        console.error("❌ Migration error:", err.message);
    } finally {
        if (db) await db.end();
    }
}

if (require.main === module) {
    runMigration();
}

module.exports = { runMigration };

