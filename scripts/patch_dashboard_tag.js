const fs = require('fs');

let html = fs.readFileSync('public/admin/dashboard/dashboard.html', 'utf8');
const oldTag = '<script src="dashboard.js?v=autopub1"></script>';
const newTag = '<script src="/admin/dashboard/dashboard.js?v=track2"></script>';

if (html.includes(oldTag)) {
    html = html.replace(oldTag, newTag);
    fs.writeFileSync('public/admin/dashboard/dashboard.html', html, 'utf8');
    console.log('✅ Updated dashboard.js script tag in dashboard.html');
} else {
    console.error('oldTag not found in dashboard.html');
}
