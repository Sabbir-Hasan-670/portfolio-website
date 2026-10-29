const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

const targetBlock = `// Direct Admin Navigation Shortcuts
app.get('/admin/tracking', requireAuth, (req, res) => {
    res.redirect('/admin/dashboard/dashboard.html#tab-tracking');
});
app.get('/admin/blog-analytics', requireAuth, (req, res) => {
    res.redirect('/admin/dashboard/dashboard.html#tab-blog-analytics');
});`;

if (code.includes(targetBlock)) {
    code = code.replace(targetBlock + '\n\n', '');
    const insertionPoint = `const requireAuth = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) next();
    else res.status(403).json({ error: 'Access denied.' });
};`;
    code = code.replace(insertionPoint, insertionPoint + '\n\n' + targetBlock);
    fs.writeFileSync('server.js', code, 'utf8');
    console.log('✅ Moved admin shortcut routes after requireAuth definition');
} else {
    console.log('Target block not found');
}

