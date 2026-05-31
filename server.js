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

dotenv.config();

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Sessions (The Lock)
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));

// Mailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
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

// ==========================================
// HYBRID PROJECTS API (DB + GitHub + Languages)
// ==========================================
app.get('/api/projects', async (req, res) => {
    try {
        const [dbProjects] = await db.query('SELECT * FROM projects ORDER BY id DESC');

        let githubProjects = [];
        if (process.env.GITHUB_USERNAME) {
            try {
                const headers = process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {};
                const ghRes = await fetch(`https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos?sort=updated&per_page=6`, { headers });
                
                if (ghRes.ok) {
                    const repos = await ghRes.json();
                    const activeRepos = repos.filter(repo => !repo.fork);
                    
                    for (const repo of activeRepos) {
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
                                        languageHTML += `<span style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); color: #818cf8; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; letter-spacing: 0.5px;">${lang} ${percentage}%</span>`;
                                    }
                                    languageHTML += '</div>';
                                }
                            }
                        } catch(e) {}

                        githubProjects.push({
                            id: 'gh-' + repo.id,
                            title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
                            description: repo.description || 'A project hosted on GitHub.',
                            github_url: repo.html_url,
                            live_url: repo.homepage || '',
                            image_path: '', 
                            languages: languageHTML
                        });
                    }
                }
            } catch (ghErr) {
                console.log("GitHub fetch failed.");
            }
        }

        res.json([...dbProjects, ...githubProjects]);
        
    } catch (err) { 
        res.status(500).json({ error: 'Failed to fetch projects' }); 
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

app.post('/api/contact', upload.none(), async (req, res) => {
    const { sender_name, sender_email, sender_phone, message } = req.body;
    if (!sender_name || !sender_email || !message) return res.status(400).json({ error: 'Fill all required fields.' });
    
    try {
        await db.query('INSERT INTO messages (sender_name, sender_email, sender_phone, message) VALUES (?, ?, ?, ?)', 
        [sender_name, sender_email, sender_phone || '', message]);
        
        res.json({ success: true, message: 'Message sent securely!' });

        const mailToAdmin = {
            from: process.env.EMAIL_USER, 
            to: process.env.RECEIVER_EMAIL,
            subject: `New Portfolio Message from ${sender_name}`,
            text: `Name: ${sender_name}\nEmail: ${sender_email}\nPhone: ${sender_phone || 'Not provided'}\n\nMessage:\n${message}`
        };
        transporter.sendMail(mailToAdmin).catch(err => console.error("Admin email failed:", err));

        const mailToUser = {
            from: process.env.EMAIL_USER, 
            to: sender_email,
            subject: `Thank you for reaching out, ${sender_name}!`,
            text: `Hi ${sender_name},\n\nThank you for visiting my portfolio and reaching out! \n\nI have received your message and will get back to you as soon as possible.\n\nBest regards,\nSabbir Hasan\nIT & Web Specialist`
        };
        transporter.sendMail(mailToUser).catch(err => console.error("Auto-reply failed:", err));

    } catch (err) { 
        res.status(500).json({ error: 'Database failed to save message.' }); 
    }
});

// ==========================================
// BLOG API ROUTES (PUBLIC)
// ==========================================
app.get('/api/blog', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch blogs' }); }
});

app.get('/api/blog/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        const [nextRow] = await db.query('SELECT id, title FROM blog_posts WHERE id < ? ORDER BY id DESC LIMIT 1', [req.params.id]);
        res.json({ post: rows[0], nextPost: nextRow[0] || null });
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
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

// ==========================================
// SECURE ADMIN ROUTES
// ==========================================
const requireAuth = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) next();
    else res.status(403).json({ error: 'Access denied.' });
};

// --- CREATE & UPDATE ROUTES ---
app.post('/api/admin/experience', requireAuth, upload.none(), async (req, res) => {
    const { role, company_or_project, duration, description } = req.body;
    try {
        await db.query('INSERT INTO experience (role, company_or_project, duration, description) VALUES (?, ?, ?, ?)', [role, company_or_project, duration, description]);
        res.json({ message: 'Experience added!' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
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

app.post('/api/admin/socials', requireAuth, upload.none(), async (req, res) => {
    const { github_link, linkedin_link, facebook_link, fiverr_link, pinterest_link, adobe_stock_link } = req.body;
    try {
        await db.query(
            'UPDATE admin_profile SET github_link=?, linkedin_link=?, facebook_link=?, fiverr_link=?, pinterest_link=?, adobe_stock_link=? WHERE id=1', 
            [github_link, linkedin_link, facebook_link, fiverr_link, pinterest_link, adobe_stock_link]
        );
        res.json({ message: 'Socials updated!' });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/admin/education', requireAuth, upload.none(), async (req, res) => {
    const { degree, institution, duration, description } = req.body;
    const sql = "INSERT INTO education (degree, institution, duration, description, image_path) VALUES (?, ?, ?, ?, '')"; 
    try {
        await db.query(sql, [degree, institution, duration, description]);
        res.json({ message: 'Education added successfully' });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: 'Database error' });
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

app.post('/api/admin/blog', requireAuth, upload.single('blog_image'), async (req, res) => {
    const { title, category, content } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : '';
    try {
        await db.query('INSERT INTO blog_posts (title, category, content, image_path) VALUES (?, ?, ?, ?)', [title, category, content, imagePath]);
        res.json({ message: 'Blog added successfully!' });
    } catch (err) { res.status(500).json({ error: 'Failed to save blog' }); }
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
    try { 
        await db.query('DELETE FROM experience WHERE id = ?', [req.params.id]); 
        res.json({ message: 'Deleted' }); 
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/admin/messages/:id', requireAuth, async (req, res) => {
    try { 
        await db.query('DELETE FROM messages WHERE id = ?', [req.params.id]); 
        res.json({ message: 'Deleted' }); 
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/admin/projects/:id', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image_path FROM projects WHERE id = ?', [req.params.id]);
        if (rows[0]?.image_path) {
            fs.unlink(path.join(__dirname, 'public', rows[0].image_path), (err) => { if(err) console.log("File missing."); });
        }
        await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]); 
        res.json({ message: 'Project deleted' }); 
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/admin/education/:id', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image_path FROM education WHERE id = ?', [req.params.id]);
        if (rows[0]?.image_path && rows[0].image_path !== '') {
            fs.unlink(path.join(__dirname, 'public', rows[0].image_path), (err) => { if(err) console.log("File missing."); });
        }
        await db.query('DELETE FROM education WHERE id = ?', [req.params.id]); 
        res.json({ message: 'Education deleted' }); 
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/admin/certificates/:id', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image_path FROM certificates WHERE id = ?', [req.params.id]);
        if (rows[0]?.image_path) {
            fs.unlink(path.join(__dirname, 'public', rows[0].image_path), (err) => { if(err) console.log("File missing."); });
        }
        await db.query('DELETE FROM certificates WHERE id = ?', [req.params.id]); 
        res.json({ message: 'Certificate deleted' }); 
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.delete('/api/admin/blog/:id', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image_path FROM blog_posts WHERE id = ?', [req.params.id]);
        if (rows[0]?.image_path) {
            fs.unlink(path.join(__dirname, 'public', rows[0].image_path), (err) => { if(err) console.log("File missing."); });
        }
        await db.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]); 
        res.json({ message: 'Blog deleted' }); 
    } catch (err) { res.status(500).json({ error: 'Failed to delete blog' }); }
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));