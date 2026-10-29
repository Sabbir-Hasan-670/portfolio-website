const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '..', 'public', 'main.js');
let s = fs.readFileSync(mainJsPath, 'utf8');

const regex = /if\s*\(has\('contact_phone'\)\s*&&\s*hasText\(data\.contact_phone\)\)\s*\{[\s\S]*?if\s*\(phoneItem\)\s*phoneItem\.hidden\s*=\s*false;\s*\}/;

const replacement = `const phoneItem = document.getElementById('contact-phone-item');
        const phoneEl = document.getElementById('contact-phone-display');
        if (has('contact_phone') && hasText(data.contact_phone)) {
            if (phoneEl) phoneEl.textContent = data.contact_phone.trim();
            if (phoneItem) {
                phoneItem.hidden = false;
                phoneItem.style.display = '';
            }
        } else if (phoneItem) {
            phoneItem.hidden = true;
            phoneItem.style.display = 'none';
        }`;

s = s.replace(regex, replacement);
fs.writeFileSync(mainJsPath, s, 'utf8');
console.log('Phone logic replaced successfully');

