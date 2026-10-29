const fs = require('fs');

let code = fs.readFileSync('blogRenderer.js', 'utf8');

const startMarker = '    <!-- Built-in First-Party Blog Engagement & Analytics Beacon -->';
const endMarker = '    </script>';

const firstStart = code.indexOf(startMarker);
if (firstStart === -1) {
    console.error('startMarker not found');
    process.exit(1);
}

const firstEnd = code.indexOf(endMarker, firstStart) + endMarker.length;
const beaconCode = code.slice(firstStart, firstEnd);

// Check if firstStart is before renderArticleHtml
const articleIdx = code.indexOf('function renderArticleHtml(');
if (firstStart < articleIdx) {
    // Cut from listing
    code = code.slice(0, firstStart) + code.slice(firstEnd);
    console.log('✅ Removed beacon from renderBlogListingHtml');
}

// Now insert beacon into renderArticleHtml before the closing </body>
const bodyEnd = code.lastIndexOf('</body>\n</html>`;');
if (bodyEnd !== -1) {
    code = code.slice(0, bodyEnd) + beaconCode + '\n' + code.slice(bodyEnd);
    console.log('✅ Inserted beacon into renderArticleHtml');
} else {
    // try with \r\n
    const bodyEndCrlf = code.lastIndexOf('</body>\r\n</html>`;');
    if (bodyEndCrlf !== -1) {
        code = code.slice(0, bodyEndCrlf) + beaconCode + '\r\n' + code.slice(bodyEndCrlf);
        console.log('✅ Inserted beacon into renderArticleHtml (CRLF)');
    } else {
        console.error('Could not find </body> before end of renderArticleHtml');
    }
}

fs.writeFileSync('blogRenderer.js', code, 'utf8');
console.log('✅ blogRenderer.js successfully fixed!');
