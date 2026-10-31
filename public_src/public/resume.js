(function () {
    'use strict';

    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);

    async function fetchJson(url) {
        try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (!res.ok) return null;
            return await res.json();
        } catch (e) {
            return null;
        }
    }

    // 1. Sync Profile Data (CV, Contact, Location, Socials)
    async function syncProfile() {
        const profile = await fetchJson('/api/profile');
        if (!profile) return;

        // Dynamic CV file
        if (profile.cv_file_path) {
            $$('[data-cv]').forEach(el => {
                el.href = profile.cv_file_path;
                el.setAttribute('download', '');
            });
        }

        // Contact details
        if (profile.contact_email) {
            $$('[data-email]').forEach(el => {
                el.textContent = profile.contact_email;
                el.href = `mailto:${profile.contact_email}`;
            });
        }

        if (profile.contact_location) {
            $$('[data-location]').forEach(el => {
                el.textContent = profile.contact_location;
            });
        }

        if (profile.github_link) {
            $$('[data-github]').forEach(el => {
                el.href = profile.github_link;
            });
        }

        if (profile.linkedin_link) {
            $$('[data-linkedin]').forEach(el => {
                el.href = profile.linkedin_link;
            });
        }

        if (profile.name) {
            $$('[data-name]').forEach(el => {
                el.textContent = profile.name;
            });
        }
    }

    // 2. Sync Dynamic Experience (if modified in admin)
    async function syncExperience() {
        const experience = await fetchJson('/api/experience');
        const container = $('#dynamic-experience-list');
        if (!container || !Array.isArray(experience) || !experience.length) return;

        container.innerHTML = experience.map(item => {
            const role = item.role || 'Role';
            const company = item.company_or_project || '';
            const duration = item.duration || '';
            const descLines = String(item.description || '')
                .split('\n')
                .map(l => l.replace(/^•\s*/, '').trim())
                .filter(Boolean);

            const bulletsHtml = descLines.length
                ? `<ul>${descLines.map(line => `<li>${line}</li>`).join('')}</ul>`
                : `<p>${item.description || ''}</p>`;

            return `
            <article class="res-exp-card">
                <div class="res-exp-top">
                    <div>
                        <h3 class="res-exp-role">${role}</h3>
                        <div class="res-exp-company">${company}</div>
                    </div>
                    ${duration ? `<span class="res-exp-badge">${duration}</span>` : ''}
                </div>
                <div class="res-exp-body">
                    ${bulletsHtml}
                </div>
            </article>`;
        }).join('');
    }

    // 3. Sync Dynamic Education
    async function syncEducation() {
        const education = await fetchJson('/api/education');
        const container = $('#dynamic-education-list');
        if (!container || !Array.isArray(education) || !education.length) return;

        container.innerHTML = education.map(item => {
            const degree = item.degree || 'Degree';
            const institution = item.institution || '';
            const duration = item.duration || '';
            const desc = item.description || '';

            return `
            <article class="res-edu-card">
                <h4 class="res-edu-degree">${degree}</h4>
                <div class="res-edu-inst">${institution}</div>
                <div class="res-edu-meta">
                    <span>${duration}</span>
                    <span>${desc.replace(/\n/g, ' · ')}</span>
                </div>
            </article>`;
        }).join('');
    }

    // 4. Print / PDF Handler
    function setupPrintButtons() {
        $$('[data-action="print"]').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                window.print();
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const yearEl = $('#year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
        syncProfile();
        syncExperience();
        syncEducation();
        setupPrintButtons();
    });
})();
