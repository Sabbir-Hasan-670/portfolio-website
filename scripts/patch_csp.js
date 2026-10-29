const fs = require('fs');

let s = fs.readFileSync('server.js', 'utf8');

const target = `res.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://ghchart.rshah.org; frame-ancestors 'self'; base-uri 'self'; form-action 'self'");`;

const replacement = `// Allow admin CDN dependencies (cropper.js, google fonts, clarity)
    if (req.path.startsWith('/admin')) {
        res.set('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; img-src 'self' data: https: blob:; font-src 'self' data: https:; frame-ancestors 'self';");
    } else {
        res.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://ghchart.rshah.org; frame-ancestors 'self'; base-uri 'self'; form-action 'self'");
    }`;

if (s.includes(target)) {
    s = s.replace(target, replacement);
    fs.writeFileSync('server.js', s, 'utf8');
    console.log('✅ Successfully updated CSP in server.js');
} else {
    console.error('Target CSP not found');
}
