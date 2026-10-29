const fs = require('fs');

let code = fs.readFileSync('db_upgrade.js', 'utf8');

const target = `console.log(\`✅ Database upgrade completed successfully! Updated \${posts.length} articles.\`);`;
const addition = `console.log(\`✅ Database upgrade completed successfully! Updated \${posts.length} articles.\`);

        // Ensure site_sections table has explore-more with proper sort_order
        try {
            await db.query(\`
                CREATE TABLE IF NOT EXISTS site_sections (
                    section_key VARCHAR(50) PRIMARY KEY,
                    is_visible TINYINT(1) DEFAULT 1,
                    sort_order INT DEFAULT 0,
                    eyebrow VARCHAR(100) DEFAULT '',
                    title VARCHAR(255) DEFAULT '',
                    description TEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            \`);
            await db.query(\`
                INSERT INTO site_sections (section_key, is_visible, sort_order, eyebrow, title, description)
                VALUES ('explore-more', 1, 105, '07 — EXPLORE HUBS', 'Specialized Portals & Tools', '')
                ON DUPLICATE KEY UPDATE sort_order = 105, is_visible = 1
            \`);
            console.log("✅ site_sections updated with explore-more sort_order = 105.");
        } catch(e) {
            console.log("Notice on site_sections:", e.message);
        }`;

if (code.includes(target)) {
    code = code.replace(target, addition);
    fs.writeFileSync('db_upgrade.js', code, 'utf8');
    console.log('✅ db_upgrade.js updated with site_sections logic');
} else {
    console.error('Target not found in db_upgrade.js');
}
