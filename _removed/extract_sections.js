const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');

function extractSection(id) {
    const target = 'id="' + id + '"';
    const startIdx = content.indexOf(target);
    if (startIdx === -1) {
        console.error('Section not found: ' + id);
        return '';
    }
    const secStart = content.lastIndexOf('<section', startIdx);
    const secEnd = content.indexOf('</section>', startIdx) + '</section>'.length;
    return content.substring(secStart, secEnd);
}

const sections = [
    { id: 'technology', file: 'section-03-technology-ecosystem.html' },
    { id: 'network-showcase', file: 'section-04-network.html' },
    { id: 'cybersecurity-showcase', file: 'section-05-cybersecurity.html' },
    { id: 'learning', file: 'section-10-learning.html' },
    { id: 'insights', file: 'section-11-insights.html' },
    { id: 'tools-preview', file: 'section-12-tools.html' },
    { id: 'streams', file: 'section-14-streams.html' }
];

sections.forEach(s => {
    const html = extractSection(s.id);
    if (html) {
        fs.writeFileSync(path.join(__dirname, s.file), html, 'utf8');
        console.log('Saved ' + s.file + ' (' + html.length + ' bytes)');
    }
});

