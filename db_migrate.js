require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log("Checking admin_profile table...");
        const [columns] = await db.query("SHOW COLUMNS FROM admin_profile LIKE 'two_factor_enabled'");
        if (columns.length === 0) {
            console.log("Adding two_factor_enabled column...");
            await db.query("ALTER TABLE admin_profile ADD COLUMN two_factor_enabled TINYINT(1) DEFAULT 0");
        } else {
            console.log("two_factor_enabled already exists.");
        }

        const [columns2] = await db.query("SHOW COLUMNS FROM admin_profile LIKE 'two_factor_secret'");
        if (columns2.length === 0) {
            console.log("Adding two_factor_secret column...");
            await db.query("ALTER TABLE admin_profile ADD COLUMN two_factor_secret VARCHAR(255) DEFAULT NULL");
        } else {
            console.log("two_factor_secret already exists.");
        }

        console.log("Migration successful!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await db.end();
    }
}

migrate();
