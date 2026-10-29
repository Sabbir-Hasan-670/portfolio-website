const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '..', 'public', 'main.js');
let s = fs.readFileSync(mainJsPath, 'utf8');

// 1. Update typing titles
s = s.replace(
    "window.typingTitles = ['Network Engineer', 'Full-Stack Developer', 'Cybersecurity Specialist', 'Linux Server Administrator', 'Technical SEO Specialist'];",
    "window.typingTitles = ['Network Engineer & Cybersecurity', 'Cisco Infrastructure (CCNA)', 'Full-Stack Developer & Systems Architect'];"
);

// 2. Consistent Location default
s = s.replace(
    "const loc = hasText(data.station_location) ? data.station_location.trim() : (hasText(data.contact_location) ? data.contact_location.trim() : 'Faridpur, BD');",
    "const loc = hasText(data.station_location) ? data.station_location.trim() : (hasText(data.contact_location) ? data.contact_location.trim() : 'Dhaka, Bangladesh · Remote');"
);

// 3. Location display default
s = s.replace(
    "if (locEl) locEl.innerText = data.contact_location || '';",
    "if (locEl) locEl.innerText = hasText(data.contact_location) ? data.contact_location.trim() : 'Dhaka, Bangladesh · Remote';"
);

// 4. Contact Phone hide when empty
const oldPhone = `        if (has('contact_phone') && hasText(data.contact_phone)) {
            const phoneEl = document.getElementById('contact-phone-display');
            if (phoneEl) phoneEl.textContent = data.contact_phone.trim();
            const phoneItem = document.getElementById('contact-phone-item');
            if (phoneItem) phoneItem.hidden = false;
        }`;

const newPhone = `        const phoneItem = document.getElementById('contact-phone-item');
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

if (s.includes("if (has('contact_phone') && hasText(data.contact_phone))")) {
    s = s.replace(oldPhone, newPhone);
}

// 5. GitHub Graph 8s timeout and fallback link
const oldGraphLoader = `        const fallbackGithubText = 'GitHub activity available via Projects';
        const loadGraphWithTimeout = (imgEl, loadingEl, url) => {
            if (!imgEl || !loadingEl) return;
            let finished = false;
            const timer = setTimeout(() => {
                if (!finished) {
                    finished = true;
                    imgEl.onload = null;
                    imgEl.onerror = null;
                    loadingEl.textContent = fallbackGithubText;
                    loadingEl.style.display = 'block';
                }
            }, 4000);

            imgEl.onload = () => {
                if (!finished) {
                    finished = true;
                    clearTimeout(timer);
                    imgEl.style.display = 'block';
                    loadingEl.style.display = 'none';
                }
            };
            imgEl.onerror = () => {
                if (!finished) {
                    finished = true;
                    clearTimeout(timer);
                    loadingEl.textContent = fallbackGithubText;
                    loadingEl.style.display = 'block';
                }
            };
            imgEl.src = url;
            if (imgEl.complete && imgEl.naturalWidth > 0) {
                finished = true;
                clearTimeout(timer);
                imgEl.style.display = 'block';
                loadingEl.style.display = 'none';
            }
        };`;

const newGraphLoader = `        const fallbackGithubMarkup = '<div class="dev-graph-fallback"><p>GitHub activity telemetry is currently offline.</p><a href="https://github.com/Sabbir-Hasan-670" target="_blank" rel="noopener" class="dev-fallback-link">View profile directly on GitHub ↗</a></div>';
        const loadGraphWithTimeout = (imgEl, loadingEl, url) => {
            if (!imgEl || !loadingEl) return;
            let finished = false;
            const timer = setTimeout(() => {
                if (!finished) {
                    finished = true;
                    imgEl.onload = null;
                    imgEl.onerror = null;
                    imgEl.style.display = 'none';
                    loadingEl.innerHTML = fallbackGithubMarkup;
                    loadingEl.style.display = 'block';
                }
            }, 8000); // 8-second timeout

            imgEl.onload = () => {
                if (!finished) {
                    finished = true;
                    clearTimeout(timer);
                    imgEl.style.display = 'block';
                    loadingEl.style.display = 'none';
                }
            };
            imgEl.onerror = () => {
                if (!finished) {
                    finished = true;
                    clearTimeout(timer);
                    imgEl.style.display = 'none';
                    loadingEl.innerHTML = fallbackGithubMarkup;
                    loadingEl.style.display = 'block';
                }
            };
            imgEl.src = url;
            if (imgEl.complete && imgEl.naturalWidth > 0) {
                finished = true;
                clearTimeout(timer);
                imgEl.style.display = 'block';
                loadingEl.style.display = 'none';
            }
        };`;

s = s.replace(oldGraphLoader, newGraphLoader);

// 6. Ensure development Link points to repositories tab by default
s = s.replace(
    "if (developmentLink) developmentLink.href = data.github_link;",
    "if (developmentLink) developmentLink.href = 'https://github.com/Sabbir-Hasan-670?tab=repositories';"
);

// 7. Fallback when github_link is absent
s = s.replace(
    "const fallback = 'GitHub activity available via Projects';",
    "const fallback = '<div class=\"dev-graph-fallback\"><p>GitHub activity telemetry is currently offline.</p><a href=\"https://github.com/Sabbir-Hasan-670\" target=\"_blank\" rel=\"noopener\" class=\"dev-fallback-link\">View profile directly on GitHub ↗</a></div>';"
);
s = s.replace(
    "if (devLoading && devLoading.style.display !== 'none') devLoading.textContent = fallback;",
    "if (devLoading) { devLoading.innerHTML = fallback; devLoading.style.display = 'block'; }"
);

// 8. Projects fallback on error or empty
s = s.replace(
    "const res = await fetch('/api/projects?featured=1');\n        const projects = await res.json();\n        if (!Array.isArray(projects)) return;",
    "const res = await fetch('/api/projects?featured=1');\n        if (!res.ok) throw new Error('Projects fetch failed: ' + res.status);\n        const projects = await res.json();\n        if (!Array.isArray(projects)) return;"
);
s = s.replace(
    "const res = await fetch('/api/projects?featured=1');\r\n        const projects = await res.json();\r\n        if (!Array.isArray(projects)) return;",
    "const res = await fetch('/api/projects?featured=1');\r\n        if (!res.ok) throw new Error('Projects fetch failed: ' + res.status);\r\n        const projects = await res.json();\r\n        if (!Array.isArray(projects)) return;"
);
s = s.replace(
    "message.className = 'project-archive-state';\n            message.textContent = 'No projects are currently published from the admin system.';\n            grid.append(message);",
    "grid.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p><a href=\"/projects\" class=\"section-fallback-btn\">Explore Projects Archive ↗</a></div>';"
);
s = s.replace(
    "message.className = 'project-archive-state';\r\n            message.textContent = 'No projects are currently published from the admin system.';\r\n            grid.append(message);",
    "grid.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p><a href=\"/projects\" class=\"section-fallback-btn\">Explore Projects Archive ↗</a></div>';"
);
s = s.replace(
    "} catch (e) { console.log(e); }\n}",
    "} catch (e) {\n        console.log('Projects load error:', e);\n        if (grid) grid.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p><a href=\"/projects\" class=\"section-fallback-btn\">Explore Projects Archive ↗</a></div>';\n    }\n}"
);
s = s.replace(
    "} catch (e) { console.log(e); }\r\n}",
    "} catch (e) {\r\n        console.log('Projects load error:', e);\r\n        if (grid) grid.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p><a href=\"/projects\" class=\"section-fallback-btn\">Explore Projects Archive ↗</a></div>';\r\n    }\r\n}"
);

// 9. Experience fallback
s = s.replace(
    "const res = await fetch('/api/experience');\n        if (!res.ok) return;",
    "const res = await fetch('/api/experience');\n        if (!res.ok) throw new Error('Experience fetch failed');"
);
s = s.replace(
    "const res = await fetch('/api/experience');\r\n        if (!res.ok) return;",
    "const res = await fetch('/api/experience');\r\n        if (!res.ok) throw new Error('Experience fetch failed');"
);
s = s.replace(
    "const empty = document.createElement('p');\n            empty.className = 'section-empty';\n            empty.textContent = 'No experience records have been added yet.';\n            timeline.append(empty);",
    "timeline.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p><a href=\"/resume\" class=\"section-fallback-btn\">View Executive Resume ↗</a></div>';"
);
s = s.replace(
    "const empty = document.createElement('p');\r\n            empty.className = 'section-empty';\r\n            empty.textContent = 'No experience records have been added yet.';\r\n            timeline.append(empty);",
    "timeline.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p><a href=\"/resume\" class=\"section-fallback-btn\">View Executive Resume ↗</a></div>';"
);
s = s.replace(
    "} catch (e) { console.log(e); }\n}\n\nasync function fetchEducation",
    "} catch (e) {\n        console.log('Experience load error:', e);\n        if (timeline) timeline.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p><a href=\"/resume\" class=\"section-fallback-btn\">View Executive Resume ↗</a></div>';\n    }\n}\n\nasync function fetchEducation"
);
s = s.replace(
    "} catch (e) { console.log(e); }\r\n}\r\n\r\nasync function fetchEducation",
    "} catch (e) {\r\n        console.log('Experience load error:', e);\r\n        if (timeline) timeline.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p><a href=\"/resume\" class=\"section-fallback-btn\">View Executive Resume ↗</a></div>';\r\n    }\r\n}\r\n\r\nasync function fetchEducation"
);

// 10. Education fallback
s = s.replace(
    "const res = await fetch('/api/education');\n        if (!res.ok) return;",
    "const res = await fetch('/api/education');\n        if (!res.ok) throw new Error('Education fetch failed');"
);
s = s.replace(
    "const res = await fetch('/api/education');\r\n        if (!res.ok) return;",
    "const res = await fetch('/api/education');\r\n        if (!res.ok) throw new Error('Education fetch failed');"
);
s = s.replace(
    "const empty = document.createElement('p');\n            empty.className = 'section-empty';\n            empty.textContent = 'No education records have been added yet.';\n            timeline.append(empty);",
    "timeline.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p></div>';"
);
s = s.replace(
    "const empty = document.createElement('p');\r\n            empty.className = 'section-empty';\r\n            empty.textContent = 'No education records have been added yet.';\r\n            timeline.append(empty);",
    "timeline.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p></div>';"
);
s = s.replace(
    "} catch (e) { console.log(e); }\n}\n\n// Services Grid",
    "} catch (e) {\n        console.log('Education load error:', e);\n        if (timeline) timeline.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p></div>';\n    }\n}\n\n// Services Grid"
);
s = s.replace(
    "} catch (e) { console.log(e); }\r\n}\r\n\r\n// Services Grid",
    "} catch (e) {\r\n        console.log('Education load error:', e);\r\n        if (timeline) timeline.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p></div>';\r\n    }\r\n}\r\n\r\n// Services Grid"
);

// 11. Certificates fallback
s = s.replace(
    "empty.className = 'section-empty';\n            empty.textContent = 'No credentials have been added yet.';\n            grid.replaceChildren(empty);",
    "grid.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p></div>';"
);
s = s.replace(
    "empty.className = 'section-empty';\r\n            empty.textContent = 'No credentials have been added yet.';\r\n            grid.replaceChildren(empty);",
    "grid.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p></div>';"
);
s = s.replace(
    "} catch (e) { console.log(e); }\n}\n\n// ==========================================\n// BLOG ENGINE",
    "} catch (e) {\n        console.log('Certificates load error:', e);\n        if (grid) grid.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p></div>';\n    }\n}\n\n// ==========================================\n// BLOG ENGINE"
);
s = s.replace(
    "} catch (e) { console.log(e); }\r\n}\r\n\r\n// ==========================================\r\n// BLOG ENGINE",
    "} catch (e) {\r\n        console.log('Certificates load error:', e);\r\n        if (grid) grid.innerHTML = '<div class=\"section-fallback-box\"><p class=\"section-fallback-msg\">Content is temporarily unavailable</p></div>';\r\n    }\r\n}\r\n\r\n// ==========================================\r\n// BLOG ENGINE"
);

fs.writeFileSync(mainJsPath, s, 'utf8');
console.log('Updated public/main.js successfully');
