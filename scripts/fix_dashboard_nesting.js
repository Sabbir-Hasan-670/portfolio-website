const fs = require('fs');

let js = fs.readFileSync('public/admin/dashboard/dashboard.js', 'utf8');

const target1 = `    window.toggleChannelLive = async function(id) {
        try {
            const res = await fetch(\`/api/admin/media-channels/\${id}/toggle-live\`, { method: 'POST' });
            if (res.ok) {
                window.showToast('Channel live status updated!');
                fetchMediaChannelsAdmin();`;

const replacement1 = `    window.toggleChannelLive = async function(id) {
        try {
            const res = await fetch(\`/api/admin/media-channels/\${id}/toggle-live\`, { method: 'POST' });
            if (res.ok) {
                window.showToast('Channel live status updated!');
                fetchMediaChannelsAdmin();
            } else {
                window.showToast('Failed to update live status.', 'error');
            }
        } catch(e) {
            window.showToast('Network error.', 'error');
        }
    };`;

const target2 = `            } else {
                window.showToast('Failed to update live status.', 'error');
            }
        } catch(e) {
            window.showToast('Network error.', 'error');
        }
    };`;

// Check CRLF or LF
const isCrlf = js.includes('\r\n');
const normalize = str => isCrlf ? str.replace(/\r?\n/g, '\r\n') : str.replace(/\r\n/g, '\n');

const t1 = normalize(target1);
const r1 = normalize(replacement1);
const t2 = normalize(target2);

if (!js.includes(t1)) {
    console.error('❌ target1 not found in dashboard.js');
    process.exit(1);
}

if (!js.includes(t2)) {
    console.error('❌ target2 not found in dashboard.js');
    process.exit(1);
}

// 1. Replace target1 with properly closed function
js = js.replace(t1, r1);
console.log('✅ Closed window.toggleChannelLive at line 1702');

// 2. Remove orphaned target2 at line 2708
js = js.replace(t2, '');
console.log('✅ Removed orphaned closing half at line 2708');

fs.writeFileSync('public/admin/dashboard/dashboard.js', js, 'utf8');
console.log('✅ public/admin/dashboard/dashboard.js fixed and saved!');

// 3. Syntax verification
try {
    new Function(js);
    console.log('✅ Syntax verification PASSED!');
} catch (e) {
    console.error('❌ Syntax error after patch:', e.message);
}
