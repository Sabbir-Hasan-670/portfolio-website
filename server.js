const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const session = require('express-session');
const fs = require('fs');
const os = require('os');
const si = require('systeminformation');
const cron = require('node-cron'); 

dotenv.config();

const app = express();
app.use(express.json());

// Remove .html from URLs
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

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public'), { 
  extensions: ['html'],
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
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
    database: process.env.DB_NAME
});

function createSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '') 
        .replace(/\s+/g, '-')        
        .replace(/-+/g, '-');        
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
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/api/profile', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM admin_profile LIMIT 1');
        res.json(rows[0] || {});
    } catch (err) { res.status(500).json({ error: 'Failed to fetch profile' }); }
});

app.get('/api/experience', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM experience ORDER BY id DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch experience' }); }
});

app.get('/api/projects', async (req, res) => {
    try {
        const [dbProjects] = await db.query('SELECT * FROM projects ORDER BY id DESC');
        
        // Inject github_images and is_pinned into cachedGithubProjects
        const [images] = await db.query('SELECT * FROM github_images');
        const imageMap = {};
        const pinMap = {};
        const pinnedAtMap = {};
        images.forEach(img => {
            imageMap[img.repo_id] = img.image_path;
            pinMap[img.repo_id] = img.is_pinned;
            pinnedAtMap[img.repo_id] = img.pinned_at;
        });
        
        const ghProjectsWithImages = cachedGithubProjects.map(proj => {
            return {
                ...proj,
                image_path: imageMap[proj.id] || proj.image_path,
                is_pinned: pinMap[proj.id] ? 1 : 0,
                pinned_at: pinnedAtMap[proj.id] || null
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
        
        res.json(allProjects);
    } catch (err) { 
        res.status(500).json({ error: 'Failed to fetch projects' }); 
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

app.get('/api/education', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM education ORDER BY id DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch education' }); }
});

app.get('/api/certificates', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM certificates ORDER BY id DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch certificates' }); }
});

app.get('/api/services', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM services ORDER BY id DESC');
        res.json(rows || []);
    } catch (err) { 
        console.error("Database services layer notice:", err.message);
        res.json([]); 
    }
});

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
app.get('/api/blog', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM blog_posts ORDER BY id DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch blogs' }); }
});

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
app.post('/api/login', upload.none(), (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        req.session.isAuthenticated = true;
        res.json({ success: true, message: 'Logged in!' });
    } else res.status(401).json({ error: 'Incorrect credentials.' });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out.' });
});



// 💼 --- EXPERIENCE ROUTES ---
app.post('/api/admin/experience', requireAuth, upload.none(), async (req, res) => {
    const { role, company_or_project, duration, description } = req.body;
    try {
        await db.query('INSERT INTO experience (role, company_or_project, duration, description) VALUES (?, ?, ?, ?)', [role, company_or_project, duration, description]);
        res.json({ message: 'Experience added!' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/experience/:id', requireAuth, upload.none(), async (req, res) => {
    const { role, company_or_project, duration, description } = req.body;
    try {
        await db.query('UPDATE experience SET role=?, company_or_project=?, duration=?, description=? WHERE id=?', [role, company_or_project, duration, description, req.params.id]);
        res.json({ message: 'Experience updated successfully! 💼' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// 🚀 --- PROJECTS ROUTES ---
app.post('/api/admin/projects', requireAuth, upload.single('project_image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    const { title, description, github_url, live_url } = req.body;
    const imagePath = '/uploads/' + req.file.filename;
    try {
        await db.query('INSERT INTO projects (title, description, image_path, github_url, live_url) VALUES (?, ?, ?, ?, ?)', [title, description, imagePath, github_url, live_url]);
        res.json({ message: 'Project added!' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/projects/:id', requireAuth, upload.single('project_image'), async (req, res) => {
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

app.put('/api/admin/education/:id', requireAuth, upload.none(), async (req, res) => {
    const { degree, institution, duration, description } = req.body;
    try {
        await db.query('UPDATE education SET degree=?, institution=?, duration=?, description=? WHERE id=?', [degree, institution, duration, description, req.params.id]);
        res.json({ message: 'Education entry updated successfully! 🎓' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// 📜 --- CERTIFICATES ROUTES ---


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
        // So let's just nullify image_path so is_pinned stays.
        await db.query('UPDATE github_images SET image_path = NULL WHERE repo_id = ?', [repo_id]);
        
        // If image_path is NULL and is_pinned is FALSE, we can optionally delete the row to keep db clean.
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

app.put('/api/admin/certificates/:id', requireAuth, upload.single('cert_image'), async (req, res) => {
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

// 🛠js --- SERVICES ADMIN ROUTES ---
app.post('/api/admin/services', requireAuth, upload.none(), async (req, res) => {
    const { title, description, icon, tags } = req.body;
    try {
        await db.query('INSERT INTO services (title, description, icon, tags) VALUES (?, ?, ?, ?)', 
        [title, description, icon || '💻', tags || '']);
        res.json({ message: 'Service added successfully!' });
    } catch (err) { res.status(500).json({ error: 'Server error adding service' }); }
});

app.delete('/api/admin/services/:id', requireAuth, async (req, res) => {
    try { 
        await db.query('DELETE FROM services WHERE id = ?', [req.params.id]); 
        res.json({ message: 'Service deleted successfully!' }); 
    } catch (err) { res.status(500).json({ error: 'Failed to delete service' }); }
});

// 👤 --- SOCIALS & STATS ROUTE ---
app.post('/api/admin/socials', requireAuth, upload.none(), async (req, res) => {
    const { 
        github_link, linkedin_link, facebook_link, fiverr_link, pinterest_link, adobe_stock_link,
        stat_ccna_title, stat_ceh_title,
        stat_ccna, stat_ceh, stat_years, stat_projects,
        about_title, about_desc,
        contact_location, contact_map_url, contact_email,
        hero_roles, hero_description
    } = req.body;
    try {
        await db.query(
            `UPDATE admin_profile SET 
            github_link=?, linkedin_link=?, facebook_link=?, fiverr_link=?, pinterest_link=?, adobe_stock_link=?,
            stat_ccna_title=?, stat_ceh_title=?,
            stat_ccna=?, stat_ceh=?, stat_years=?, stat_projects=?,
            about_title=?, about_desc=?, contact_location=?, contact_map_url=?, contact_email=?, hero_roles=?, hero_description=? 
            WHERE id=1`,
            [
                github_link, linkedin_link, facebook_link, fiverr_link, pinterest_link, adobe_stock_link,
                stat_ccna_title, stat_ceh_title,
                stat_ccna, stat_ceh, stat_years, stat_projects,
                about_title, about_desc, contact_location, contact_map_url, contact_email, hero_roles, hero_description
            ]
        );
        res.json({ message: 'Profile data updated!' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
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

// 📝 --- BLOG ROUTES ---
app.post('/api/admin/blog', requireAuth, upload.single('blog_image'), async (req, res) => {
    const { title, category, content, custom_slug } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : '';
    
    let finalSlug = '';
    if (custom_slug && custom_slug.trim() !== '') {
        finalSlug = createSlug(custom_slug);
    } else {
        finalSlug = createSlug(title || 'untitled');
    }

    try {
        await db.query('INSERT INTO blog_posts (title, slug, category, content, image_path) VALUES (?, ?, ?, ?, ?)', [title, finalSlug, category, content, imagePath]);
        res.json({ message: 'Blog added successfully!' });
    } catch (err) { res.status(500).json({ error: 'Failed to save blog' }); }
});

app.put('/api/admin/blog/:id', requireAuth, upload.single('blog_image'), async (req, res) => {
    const { title, category, content, custom_slug } = req.body;
    const blogId = req.params.id;
    let slug = createSlug(custom_slug && custom_slug.trim() !== '' ? custom_slug : title || 'untitled');
    try {
        if (req.file) {
            const newImagePath = '/uploads/' + req.file.filename;
            const [rows] = await db.query('SELECT image_path FROM blog_posts WHERE id = ?', [blogId]);
            if (rows[0]?.image_path) {
                const oldPath = path.join(__dirname, 'public', rows[0].image_path);
                fs.unlink(oldPath, (err) => { if (err) console.log("Old file already missing."); });
            }
            await db.query('UPDATE blog_posts SET title=?, slug=?, category=?, content=?, image_path=? WHERE id=?', [title, slug, category, content, newImagePath, blogId]);
        } else {
            await db.query('UPDATE blog_posts SET title=?, slug=?, category=?, content=? WHERE id=?', [title, slug, category, content, blogId]);
        }
        res.json({ message: 'Article updated successfully! 🚀' });
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// --- UPLOAD ROUTES (WITH AUTO-DELETE) ---
app.post('/api/admin/upload-pic', requireAuth, upload.single('profile_image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const newImagePath = '/uploads/' + req.file.filename;
    try {
        const [rows] = await db.query('SELECT profile_pic_path FROM admin_profile WHERE id = 1');
        const oldImagePath = rows[0]?.profile_pic_path;
        if (oldImagePath) {
            const absoluteOldPath = path.join(__dirname, 'public', oldImagePath);
            fs.unlink(absoluteOldPath, (err) => { if (err) console.log("Note: Old profile picture already missing."); });
        }
        await db.query('UPDATE admin_profile SET profile_pic_path = ? WHERE id = 1', [newImagePath]);
        res.json({ message: 'Profile picture updated!' });
    } catch (err) { res.status(500).json({ error: 'Server error updating picture.' }); }
});

app.post('/api/admin/upload-cv', requireAuth, upload.single('cv_document'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const newCvPath = '/uploads/' + req.file.filename;
    try {
        const [rows] = await db.query('SELECT cv_file_path FROM admin_profile WHERE id = 1');
        const oldCvPath = rows[0]?.cv_file_path;
        if (oldCvPath) {
            const absoluteOldPath = path.join(__dirname, 'public', oldCvPath);
            fs.unlink(absoluteOldPath, (err) => { if (err) console.log("Note: Old CV document already missing."); });
        }
        await db.query('UPDATE admin_profile SET cv_file_path = ? WHERE id = 1', [newCvPath]);
        res.json({ message: 'CV updated!' });
    } catch (err) { res.status(500).json({ error: 'Server error updating CV.' }); }
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
// N8N AUTOMATION ROUTE
// ==========================================
app.post('/api/n8n/blog', async (req, res) => {
    try {
        const { secret, title, category, content, imageUrl } = req.body;
        const expectedSecret = process.env.N8N_SECRET_KEY || 'S.abbir@670#613';
        
        if (secret !== expectedSecret) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        res.json({ success: true, message: 'Processing in background.' });
        
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

                const slug = createSlug(title || 'untitled-ai-post');

                try {
                    await db.query(
                        'INSERT INTO blog_posts (title, slug, category, content, image_path) VALUES (?, ?, ?, ?, ?)', 
                        [title || 'Untitled AI Post', slug, category || 'Cybersecurity', content || 'No Content Provided', imagePath || '']
                    );
                    console.log(`✅ [BG SUCCESS]: "${title}" uploaded successfully in background!`);
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
                pinned_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log("✅ github_images table ready.");
        try { await db.query(`ALTER TABLE github_images ADD COLUMN pinned_at DATETIME DEFAULT CURRENT_TIMESTAMP`); } catch(e) {}
        
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