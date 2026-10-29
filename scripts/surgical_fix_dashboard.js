const fs = require('fs');

let js = fs.readFileSync('public/admin/dashboard/dashboard.js', 'utf8');
let lines = js.split('\n');

const liveIdx = lines.findIndex(l => l.includes('window.toggleChannelLive = async function'));
console.log('toggleChannelLive line:', liveIdx + 1);

const fetchMediaIdx = lines.findIndex((l, i) => i > liveIdx && l.includes('fetchMediaChannelsAdmin();'));
console.log('fetchMediaChannelsAdmin line:', fetchMediaIdx + 1);

const failedStatusIdx = lines.findIndex(l => l.includes("Failed to update live status."));
console.log('Failed to update live status line:', failedStatusIdx + 1);

// Closing block to insert right after fetchMediaChannelsAdmin();
const closingLines = [
    "            } else {",
    "                window.showToast('Failed to update live status.', 'error');",
    "            }",
    "        } catch(e) {",
    "            window.showToast('Network error.', 'error');",
    "        }",
    "    };"
];

// Insert closing lines right after fetchMediaChannelsAdmin()
lines.splice(fetchMediaIdx + 1, 0, ...closingLines);

// Now re-find the orphan block (it shifted by closingLines.length)
const orphanIdx = lines.findIndex((l, i) => i > fetchMediaIdx + closingLines.length + 500 && l.includes("Failed to update live status."));
console.log('Orphan line is now at:', orphanIdx + 1);

if (orphanIdx !== -1) {
    // The orphan block is from (orphanIdx - 1) to (orphanIdx + 5)
    // line orphanIdx - 1: "} else {"
    // line orphanIdx: "window.showToast('Failed to update live status.', 'error');"
    // line orphanIdx + 1: "}"
    // line orphanIdx + 2: "} catch(e) {"
    // line orphanIdx + 3: "window.showToast('Network error.', 'error');"
    // line orphanIdx + 4: "}"
    // line orphanIdx + 5: "};"
    let startDelete = orphanIdx - 1;
    let countDelete = 7;
    console.log('Deleting lines:', lines.slice(startDelete, startDelete + countDelete).join('\n'));
    lines.splice(startDelete, countDelete);
    console.log('✅ Orphan lines deleted!');
}

const newJs = lines.join('\n');
try {
    new Function(newJs);
    console.log('✅ Syntax verification PASSED!');
    fs.writeFileSync('public/admin/dashboard/dashboard.js', newJs, 'utf8');
    console.log('✅ File written successfully!');
} catch (e) {
    console.error('❌ Syntax check failed:', e.message);
    process.exit(1);
}
