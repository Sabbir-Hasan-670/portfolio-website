
// Global Loader Logic
window.showLoader = function() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.style.display = 'flex';
};
window.hideLoader = function() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.style.display = 'none';
};

// Intercept fetch for global loader (only for non-GET requests to show upload progress)
const originalFetch = window.fetch;
window.fetch = async function(...args) {
    const options = args[1];
    let isUploading = false;
    if (options && options.method && options.method !== 'GET') {
        isUploading = true;
        showLoader();
    }
    try {
        const response = await originalFetch(...args);
        return response;
    } finally {
        if (isUploading) hideLoader();
    }
};


document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. ADMIN LIVE CLOCK
    // ==========================================
    function updateAdminClock() {
        const clockEl = document.getElementById('admin-clock');
        if (!clockEl) return;

        const now = new Date();
        const timeOptions = { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true };
        const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };

        clockEl.textContent = `${now.toLocaleDateString(undefined, dateOptions)} | ${now.toLocaleTimeString(undefined, timeOptions)}`;
    }
    
    updateAdminClock();
    setInterval(updateAdminClock, 1000);

    // ==========================================
    // . THEME TOGGLE LOGIC
    // ==========================================
    const themeBtn = document.getElementById('theme-btn');
    const body = document.getElementById('main-body');

    if (localStorage.getItem('admin-theme') === 'light') {
        body.classList.add('light-theme');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            if (body.classList.contains('light-theme')) {
                localStorage.setItem('admin-theme', 'light');
            } else {
                localStorage.setItem('admin-theme', 'dark');
            }
        });
    }

    // --- Tab Navigation ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-target')).classList.add('active');
        });
    });

    // --- Data Fetching & Deletion ---
    async function deleteItem(url, id, fetchFunction) {
        const confirmed = await window.customConfirm('Delete this item?');
        if (!confirmed) return;
        try {
            const res = await fetch(`${url}/${id}`, { method: 'DELETE' });
            if (res.status === 403) return window.location.href = '/admin/login';
            if (res.ok) fetchFunction();
        } catch (e) { window.showToast('An error occurred.', 'error'); }
    }

    window.deleteItem = deleteItem;

    // ==========================================
    // 💼 EXPERIENCE CMS MANAGER
    // ==========================================
    async function fetchExperience() {
        const list = document.getElementById('experience-list-admin');
        if (!list) return;
        try {
            const res = await fetch('/api/admin/experience');
            if (res.status === 401 || res.status === 403) return window.location.href = '/admin/login';
            if (!res.ok) throw new Error('experience unavailable');
            const data = await res.json();
            list.innerHTML = '';
            window.cachedExperience = data;
            data.forEach(exp => {
                list.innerHTML += `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 8px; background: rgba(255,255,255,0.02); border-radius: 6px;">
                    <div class="info"><h4>${exp.role}</h4><p>${exp.company_or_project}</p></div>
                    <div style="display: flex; gap: 8px;">
                        <button class="action-btn" style="padding: 4px 12px; font-size: 0.8rem; background: #2ecc71;" onclick="editExperience(${exp.id})">Edit</button>
                        <button class="delete-btn" style="padding: 4px 12px; font-size: 0.8rem;" onclick="deleteItem('/api/admin/experience', ${exp.id}, window.fetchExperience)">Delete</button>
                    </div>
                </li>`;
            });
        } catch (e) { list.innerHTML = 'Error loading.'; }
    }
    window.fetchExperience = fetchExperience;

    // ==========================================
    // 🚀 PROJECTS CMS MANAGER
    // ==========================================
    async function fetchProjects() {
        const list = document.getElementById('projects-list-admin');
        if (!list) return;
        try {
            const [projectRes, githubRes] = await Promise.all([fetch('/api/admin/projects'), fetch('/api/admin/github-projects')]);
            if (projectRes.status === 401 || projectRes.status === 403 || githubRes.status === 401 || githubRes.status === 403) return window.location.href = '/admin/login';
            if (!projectRes.ok || !githubRes.ok) throw new Error('projects unavailable');
            const [projects, githubProjects] = await Promise.all([projectRes.json(), githubRes.json()]);
            window.cachedProjects = projects;
            window.allProjectsData = [...projects, ...githubProjects]; // Includes hidden/unpublished management records.
            window.currentProjectLimit = 10;
            renderAdminProjects();
        } catch (e) { list.innerHTML = 'Error loading.'; }
    }
    window.fetchProjects = fetchProjects;

    window.renderAdminProjects = () => {
        const list = document.getElementById('projects-list-admin');
        if (!list || !window.allProjectsData) return;
        list.innerHTML = '';
        
        const toShow = window.allProjectsData.slice(0, window.currentProjectLimit);
        
        toShow.forEach((proj) => {
            const isGithub = String(proj.id).startsWith('gh-');
            const pinBtnText = proj.is_pinned ? 'Unpin' : 'Pin';
            const pinBtnColor = proj.is_pinned ? '#f39c12' : '#7f8c8d';
            const hasCustomImage = isGithub && proj.image_path && !proj.image_path.startsWith('https://');
            const hasLink = proj.live_url && proj.live_url.trim() !== '';
            const linkBtnColor = hasLink ? '#2ecc71' : '#00d2ff';
            const linkBtnText = hasLink ? 'Link ✓' : 'Link';

            list.innerHTML += `
            <li style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 8px; background: rgba(255,255,255,0.02); border-radius: 6px;">
                <div class="info"><h4>${proj.title} ${isGithub ? '<span style="color:#6366f1;font-size:0.7rem;">(GitHub)</span>' : ''} ${proj.is_pinned ? '📌' : ''}</h4></div>
                <div style="display: flex; gap: 8px;">
                    <button class="action-btn" style="padding: 4px 12px; font-size: 0.8rem; background: ${pinBtnColor};" onclick="togglePin('${proj.id}', ${isGithub}, ${proj.is_pinned})">${pinBtnText}</button>
                    
                    ${!isGithub ? `<button class="action-btn" style="padding: 4px 12px; font-size: 0.8rem; background: #2ecc71;" onclick="editProject(${proj.id})">Edit</button>` : `<button class="action-btn" style="padding: 4px 12px; font-size: 0.8rem; background: #9f5bff;" onclick="document.getElementById('gh-repo-id').value='${proj.id}'; document.getElementById('gh-image-input').click();">Img</button>
                    <button class="action-btn" style="padding: 4px 12px; font-size: 0.8rem; background: ${linkBtnColor};" onclick="setGithubLiveUrl('${proj.id}', '${proj.live_url || ''}')">${linkBtnText}</button>
                    <button class="action-btn" style="padding: 4px 12px; font-size: 0.8rem; background: #38bdf8;" onclick="editGithubProjectSettings('${proj.id}')">Settings</button>`}
                    
                    ${hasCustomImage ? `<button class="delete-btn" style="padding: 4px 12px; font-size: 0.8rem;" onclick="removeGithubImage('${proj.id}')">Remove Image</button>` : ''}

                    ${!isGithub ? `<button class="delete-btn" style="padding: 4px 12px; font-size: 0.8rem;" onclick="deleteItem('/api/admin/projects', ${proj.id}, window.fetchProjects)">Delete</button>` : ''}
                </div>
            </li>`;
        });
        
        if (window.allProjectsData.length > window.currentProjectLimit) {
            list.innerHTML += `
            <div id="projects-see-more-container" style="text-align: center; margin-top: 15px;">
                <button class="action-btn" style="background: rgba(255,255,255,0.1);" onclick="window.currentProjectLimit += 10; window.renderAdminProjects();">See More 👇</button>
            </div>
            `;
        }
    };

    window.togglePin = async (id, isGithub, currentPinStatus) => {
        const type = isGithub ? 'gh' : 'db';
        const newPinStatus = currentPinStatus ? 0 : 1;
        
        try {
            const res = await fetch('/api/admin/projects/pin', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type, is_pinned: newPinStatus })
            });
            if (res.ok) {
                window.showToast('Success!', 'success'); // Will replace with toast later
                fetchProjects();
            } else window.showToast('Success!', 'success');
        } catch(e) { window.showToast('Success!', 'success'); }
    };

    window.removeGithubImage = async (repo_id) => {
        const confirmed = await window.customConfirm('Are you sure you want to remove this custom image?');
        if (!confirmed) return;
        try {
            const res = await fetch('/api/admin/github-image/remove', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json' },
                body: JSON.stringify({ repo_id })
            });
            if (res.ok) {
                window.showToast('Success!', 'success');
                fetchProjects();
            } else window.showToast('Success!', 'success');
        } catch(e) { window.showToast('Success!', 'success'); }
    };

    // ==========================================
    // 🎓 EDUCATION CMS MANAGER
    // ==========================================
    async function fetchEducation() {
        const list = document.getElementById('admin-education-list');
        if (!list) return;
        try {
            const res = await fetch('/api/admin/education');
            if (res.status === 401 || res.status === 403) return window.location.href = '/admin/login';
            if (!res.ok) throw new Error('education unavailable');
            const data = await res.json();
            list.innerHTML = '';
            window.cachedEducation = data;
            data.forEach(edu => {
                list.innerHTML += `
                <div class="dash-card" style="padding: 1.5rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2);">
                    <div><h4>${edu.degree}</h4><p style="margin: 0; opacity: 0.7;">${edu.institution}</p></div>
                    <div style="display: flex; gap: 8px;">
                        <button class="action-btn" style="padding: 4px 12px; font-size: 0.8rem; background: #2ecc71;" onclick="editEducation(${edu.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteItem('/api/admin/education', ${edu.id}, window.fetchEducation)">Delete</button>
                    </div>
                </div>`;
            });
        } catch (e) { list.innerHTML = 'Error loading.'; }
    }
    window.fetchEducation = fetchEducation;

    // ==========================================
    // 📜 CERTIFICATES CMS MANAGER
    // ==========================================
    async function fetchCertificates() {
        const list = document.getElementById('admin-certificates-list');
        if (!list) return;
        try {
            const res = await fetch('/api/admin/certificates');
            if (res.status === 401 || res.status === 403) return window.location.href = '/admin/login';
            if (!res.ok) throw new Error('certificates unavailable');
            const data = await res.json();
            list.innerHTML = '';
            window.cachedCertificates = data;
            data.forEach(cert => {
                list.innerHTML += `
                <div class="dash-card" style="padding: 1rem; text-align: center; background: rgba(0,0,0,0.2);">
                    <img src="${cert.image_path}" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 0.5rem;">
                    <h4>${cert.title}</h4>
                    <p style="opacity: 0.7; font-size: 0.9rem;">${cert.issuer}</p>
                    <div style="display: flex; gap: 6px; margin-top: 10px;">
                        <button class="action-btn" style="flex: 1; padding: 4px; font-size: 0.8rem; background: #2ecc71;" onclick="editCertificate(${cert.id})">Edit</button>
                        <button class="delete-btn" style="flex: 1; padding: 4px; font-size: 0.8rem;" onclick="deleteItem('/api/admin/certificates', ${cert.id}, window.fetchCertificates)">Delete</button>
                    </div>
                </div>`;
            });
        } catch (e) { list.innerHTML = 'Error loading.'; }
    }
    window.fetchCertificates = fetchCertificates;

    // ==========================================
    // 🎛️ UNIVERSAL CUSTOM MODAL ENGINE (🔴 POPUP BUG FIXED)
    // ==========================================
    const uniModal = document.getElementById('universal-edit-modal');
    const uniForm = document.getElementById('universal-edit-form');
    const uniContainer = document.getElementById('dynamic-inputs-container');
    const uniTitle = document.getElementById('universal-modal-title');

    document.getElementById('universal-edit-cancel')?.addEventListener('click', () => {
        uniModal.classList.add('hidden');
    });

    window.editExperience = function(id) {
        if (!window.cachedExperience) return;
        const exp = window.cachedExperience.find(item => item.id === id);
        if (!exp) return;

        uniTitle.textContent = "💼 Edit Experience Entry";
        document.getElementById('universal-item-id').value = id;
        document.getElementById('universal-item-type').value = 'experience';

        uniContainer.innerHTML = `
            <div class="admin-field"><label>Role</label><input type="text" id="uni-role" value="${exp.role || ''}" required></div>
            <div class="admin-field"><label>Company / Project</label><input type="text" id="uni-company" value="${exp.company_or_project || ''}" required></div>
            <div class="admin-field"><label>Duration</label><input type="text" id="uni-duration" value="${exp.duration || ''}"></div>
            <div class="admin-field"><label>Responsibilities</label><textarea id="uni-desc" rows="4" placeholder="Responsibilities...">${exp.description || ''}</textarea></div>
            ${orderingFields(exp)}
        `;
        uniModal.classList.remove('hidden');
    };

    window.editProject = function(id) {
        if (!window.cachedProjects) return;
        const proj = window.cachedProjects.find(item => item.id === id);
        if (!proj) return;

        uniTitle.textContent = "🚀 Edit Project Details";
        document.getElementById('universal-item-id').value = id;
        document.getElementById('universal-item-type').value = 'project';

        uniContainer.innerHTML = `
            <div class="admin-field"><label>Project Title</label><input type="text" id="uni-title" value="${proj.title || ''}" required></div>
            <div class="admin-field"><label>GitHub URL</label><input type="text" id="uni-github" value="${proj.github_url || ''}"></div>
            <div class="admin-field"><label>Live Link</label><input type="text" id="uni-live" value="${proj.live_url || ''}"></div>
            <div class="admin-field"><label>Project Description</label><textarea id="uni-desc" rows="4" placeholder="Project Description...">${proj.description || ''}</textarea></div>
            <div class="admin-field"><label>Technology Stack</label><input type="text" id="uni-technologies" value="${proj.technologies || ''}"></div>
            <div class="admin-field"><label>Key Features</label><textarea id="uni-features" rows="3" placeholder="Key features">${proj.features || ''}</textarea></div>
            <div class="admin-field"><label>Challenge</label><textarea id="uni-challenge" rows="3" placeholder="Challenge">${proj.challenge || ''}</textarea></div>
            <div class="admin-field"><label>Solution</label><textarea id="uni-solution" rows="3" placeholder="Solution">${proj.solution || ''}</textarea></div>
            <div class="admin-field"><label>Architecture</label><textarea id="uni-architecture" rows="3" placeholder="Architecture">${proj.architecture || ''}</textarea></div>
            <div class="admin-field"><label>Security Details</label><textarea id="uni-security" rows="3" placeholder="Security details">${proj.security_details || ''}</textarea></div>
            <div class="admin-field"><label>Database & Backend</label><textarea id="uni-database" rows="3" placeholder="Database and backend details">${proj.database_details || ''}</textarea></div>
            <div class="admin-field"><label>Screenshot URLs</label><textarea id="uni-screenshots" rows="3" placeholder="Screenshot URLs">${proj.screenshots || ''}</textarea></div>
            ${orderingFields(proj, { featured: true, status: true })}
        `;
        uniModal.classList.remove('hidden');
    };

    window.editEducation = function(id) {
        if (!window.cachedEducation) return;
        const edu = window.cachedEducation.find(item => item.id === id);
        if (!edu) return;

        uniTitle.textContent = "🎓 Edit Education Details";
        document.getElementById('universal-item-id').value = id;
        document.getElementById('universal-item-type').value = 'education';

        uniContainer.innerHTML = `
            <div class="admin-field"><label>Degree / Title</label><input type="text" id="uni-degree" value="${edu.degree || ''}" required></div>
            <div class="admin-field"><label>Institution</label><input type="text" id="uni-institution" value="${edu.institution || ''}" required></div>
            <div class="admin-field"><label>Duration / Years</label><input type="text" id="uni-duration" value="${edu.duration || ''}"></div>
            <div class="admin-field"><label>Additional Details</label><textarea id="uni-desc" rows="3" placeholder="Additional Details...">${edu.description || ''}</textarea></div>
            ${orderingFields(edu)}
        `;
        uniModal.classList.remove('hidden');
    };

    window.editCertificate = function(id) {
        if (!window.cachedCertificates) return;
        const cert = window.cachedCertificates.find(item => item.id === id);
        if (!cert) return;

        uniTitle.textContent = "📜 Edit Certificate Entry";
        document.getElementById('universal-item-id').value = id;
        document.getElementById('universal-item-type').value = 'certificate';

        uniContainer.innerHTML = `
            <div class="admin-field"><label>Certification Title</label><input type="text" id="uni-title" value="${cert.title || ''}" required></div>
            <div class="admin-field"><label>Issuing Organization</label><input type="text" id="uni-issuer" value="${cert.issuer || ''}" required></div>
            <div class="admin-field"><label>Verification URL</label><input type="url" id="uni-link" value="${cert.link || ''}"></div>
            ${orderingFields(cert)}
        `;
        uniModal.classList.remove('hidden');
    };

    window.editService = function(id) {
        const service = window.cachedServices?.find(item => Number(item.id) === Number(id));
        if (!service) return;
        uniTitle.textContent = '🧩 Edit Service';
        document.getElementById('universal-item-id').value = id;
        document.getElementById('universal-item-type').value = 'service';
        uniContainer.innerHTML = `
            <div class="admin-field"><label>Service Title</label><input type="text" id="uni-title" value="${escapeHtml(service.title)}" required></div>
            <div class="admin-field"><label>Description</label><textarea id="uni-desc" rows="3" required>${escapeHtml(service.description || '')}</textarea></div>
            <div class="admin-field"><label>Icon</label><input type="text" id="uni-icon" value="${escapeHtml(service.icon || '💻')}"></div>
            <div class="admin-field"><label>Tags</label><input type="text" id="uni-tags" value="${escapeHtml(service.tags || '')}"></div>
            <div class="admin-field"><label>Category</label><select id="uni-category">${categoryOptions(service.category_key)}</select></div>
            ${orderingFields(service)}`;
        uniModal.classList.remove('hidden');
    };

    window.editGithubProjectSettings = function(id) {
        const project = window.allProjectsData?.find(item => String(item.id) === String(id));
        if (!project) return;
        uniTitle.textContent = 'GitHub Project Display Settings';
        document.getElementById('universal-item-id').value = id;
        document.getElementById('universal-item-type').value = 'github-project';
        uniContainer.innerHTML = `<p style="opacity:.75;">${escapeHtml(project.title || id)} — pinning remains separate from featured status.</p>${orderingFields(project, { featured: true })}`;
        uniModal.classList.remove('hidden');
    };

    uniForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('universal-item-id').value;
        const type = document.getElementById('universal-item-type').value;

        let url = `/api/admin/${type}/${id}`;
        let options = { method: 'PUT' };
        let callback;
        const sortOrder = document.getElementById('uni-sort-order') ? asNonNegativeInteger(document.getElementById('uni-sort-order').value) : undefined;
        const isVisible = document.getElementById('uni-visible') ? document.getElementById('uni-visible').checked : undefined;
        if (sortOrder === null) return window.showToast('Order must be a non-negative integer.', 'error');

        if (type === 'experience') {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify({
                role: document.getElementById('uni-role').value,
                company_or_project: document.getElementById('uni-company').value,
                duration: document.getElementById('uni-duration').value,
                description: document.getElementById('uni-desc').value,
                sort_order: sortOrder, is_visible: isVisible
            });
            callback = fetchExperience;
        } 
        else if (type === 'project') {
            const formData = new FormData();
            formData.append('title', document.getElementById('uni-title').value);
            formData.append('github_url', document.getElementById('uni-github').value);
            formData.append('live_url', document.getElementById('uni-live').value);
            formData.append('description', document.getElementById('uni-desc').value);
            formData.append('technologies', document.getElementById('uni-technologies').value);
            formData.append('features', document.getElementById('uni-features').value);
            formData.append('challenge', document.getElementById('uni-challenge').value);
            formData.append('solution', document.getElementById('uni-solution').value);
            formData.append('architecture', document.getElementById('uni-architecture').value);
            formData.append('security_details', document.getElementById('uni-security').value);
            formData.append('database_details', document.getElementById('uni-database').value);
            formData.append('screenshots', document.getElementById('uni-screenshots').value);
            formData.append('sort_order', sortOrder);
            formData.append('is_visible', isVisible);
            formData.append('is_featured', document.getElementById('uni-featured').checked);
            formData.append('status', document.getElementById('uni-status').value);
            options.body = formData;
            callback = fetchProjects;
        } 
        else if (type === 'education') {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify({
                degree: document.getElementById('uni-degree').value,
                institution: document.getElementById('uni-institution').value,
                duration: document.getElementById('uni-duration').value,
                description: document.getElementById('uni-desc').value,
                sort_order: sortOrder, is_visible: isVisible
            });
            callback = fetchEducation;
        } 
        else if (type === 'certificate') {
            const formData = new FormData();
            formData.append('title', document.getElementById('uni-title').value);
            formData.append('issuer', document.getElementById('uni-issuer').value);
            formData.append('link', document.getElementById('uni-link').value);
            formData.append('sort_order', sortOrder);
            formData.append('is_visible', isVisible);
            options.body = formData;
            callback = fetchCertificates;
        } else if (type === 'service') {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify({
                title: document.getElementById('uni-title').value,
                description: document.getElementById('uni-desc').value,
                icon: document.getElementById('uni-icon').value,
                tags: document.getElementById('uni-tags').value,
                category_key: document.getElementById('uni-category').value,
                sort_order: sortOrder, is_visible: isVisible
            });
            callback = fetchServices;
        } else if (type === 'github-project') {
            url = `/api/admin/github-projects/${encodeURIComponent(id)}`;
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify({ sort_order: sortOrder, is_visible: isVisible, is_featured: document.getElementById('uni-featured').checked });
            callback = fetchProjects;
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
                uniModal.classList.add('hidden');
                window.showToast(data.message || 'Updated successfully!', 'success');
                if (callback) callback();
            } else if (response.status === 409) { window.showToast(migrationMessage, 'error'); }
            else { window.showToast(data.error || 'Unable to save changes.', 'error'); }
        } catch (e) { window.showToast('An error occurred.', 'error'); }
    });

    // ==========================================
    // 📬 INBOX MESSAGES & PROFILE SOCIALS
    // ==========================================
    async function fetchInbox() {
        const container = document.getElementById('messages-container');
        if (!container) return;
        try {
            const res = await fetch('/api/admin/messages');
            const data = await res.json();
            container.innerHTML = '';
            if(data.length === 0) container.innerHTML = '<p>Inbox empty.</p>';
            data.forEach(msg => {
                const replyBtn = msg.sender_email ? `<button class="action-btn" style="margin-top:10px; margin-right:8px; background:#f1c40f;" onclick="openReplyModal('${msg.sender_email}')">Reply</button>` : '';
                container.innerHTML += `<div style="background:rgba(0,0,0,0.2); padding:15px; margin-bottom:10px; border-radius:8px;">
                    <h4>From: ${msg.sender_name} ${msg.sender_email ? `(${msg.sender_email})` : ''}</h4>
                    <p>${msg.message}</p>
                    <div style="display:flex;">
                        ${replyBtn}
                        <button class="delete-btn" style="margin-top:10px;" onclick="deleteItem('/api/admin/messages', ${msg.id}, window.fetchInbox)">Trash</button>
                    </div>
                </div>`;
            });
        } catch (e) { container.innerHTML = 'Error loading.'; }
    }
    window.fetchInbox = fetchInbox;

    window.openReplyModal = (email) => {
        document.getElementById('reply-to-email').value = email;
        document.getElementById('reply-subject').value = 'Reply to your inquiry';
        document.getElementById('reply-message').value = '';
        document.getElementById('reply-modal').classList.remove('hidden');
    };

    window.sendEmailReply = async () => {
        const to = document.getElementById('reply-to-email').value;
        const subject = document.getElementById('reply-subject').value;
        const message = document.getElementById('reply-message').value;

        if (!to || !message) return alert("Missing recipient or message.");

        try {
            const res = await fetch('/api/admin/inbox/reply', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, subject, message })
            });
            if (res.ok) {
                window.showToast('Success!', 'success');
                document.getElementById('reply-modal').classList.add('hidden');
            } else {
                window.showToast('Success!', 'success');
            }
        } catch(e) {
            window.showToast('Success!', 'success');
        }
    };

    async function fetchSocialLinks() {
        try {
            const res = await fetch('/api/profile');
            const data = await res.json();
            if (data) {
                document.getElementById('social-github').value = data.github_link || '';
                document.getElementById('social-linkedin').value = data.linkedin_link || '';
                document.getElementById('social-facebook').value = data.facebook_link || '';
                document.getElementById('social-fiverr').value = data.fiverr_link || '';
                document.getElementById('social-pinterest').value = data.pinterest_link || '';
                document.getElementById('social-adobe').value = data.adobe_stock_link || '';
                document.getElementById('stat-ccna-title').value = data.stat_ccna_title || '';
                document.getElementById('stat-ccna').value = data.stat_ccna || '';
                document.getElementById('stat-ceh-title').value = data.stat_ceh_title || '';
                document.getElementById('stat-ceh').value = data.stat_ceh || '';
                document.getElementById('stat-years').value = data.stat_years || '';
                document.getElementById('stat-projects').value = data.stat_projects || '';

                document.getElementById('hero-roles').value = data.hero_roles || '';
                document.getElementById('hero-desc').value = data.hero_description || '';

                document.getElementById('about-title').value = data.about_title || '';
                document.getElementById('about-desc').value = data.about_desc || '';

                document.getElementById('contact-email').value = data.contact_email || '';
                document.getElementById('contact-location').value = data.contact_location || '';
                document.getElementById('contact-map').value = data.contact_map_url || '';
                if (document.getElementById('station-location')) {
                    document.getElementById('station-location').value = data.station_location || '';
                }
                if (document.getElementById('station-timezone')) {
                    document.getElementById('station-timezone').value = data.station_timezone || 'Asia/Dhaka';
                }
                if (document.getElementById('station-status')) {
                    document.getElementById('station-status').value = data.station_status || '';
                }
                document.getElementById('hero-primary-cta-label').value = data.hero_primary_cta_label || '';
                document.getElementById('hero-primary-cta-url').value = data.hero_primary_cta_url || '';
                document.getElementById('hero-secondary-cta-label').value = data.hero_secondary_cta_label || '';
                document.getElementById('hero-secondary-cta-url').value = data.hero_secondary_cta_url || '';
                document.getElementById('hero-availability-text').value = data.hero_availability_text || '';
                document.getElementById('contact-phone').value = data.contact_phone || '';
                document.getElementById('footer-text').value = data.footer_text || '';
                document.getElementById('default-seo-title').value = data.default_seo_title || '';
                document.getElementById('default-seo-description').value = data.default_seo_description || '';
                document.getElementById('default-og-image').value = data.default_og_image || '';
            }
        } catch (e) { console.error("Failed to fetch profile"); }
    }
    window.fetchSocialLinks = fetchSocialLinks;

    const sectionDisplayNames = {
        hero: 'Hero', expertise: 'Expertise', projects: 'Projects', technology: 'Technology', network: 'Network',
        cybersecurity: 'Cybersecurity', about: 'About', experience: 'Experience', education: 'Education',
        certificates: 'Certificates', learning: 'Learning', blog: 'Blog', tools: 'Tools', development: 'Development', contact: 'Contact'
    };
    const expertiseCategories = ['network', 'cybersecurity', 'fullstack', 'seo', 'server', 'other'];
    const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
    const asNonNegativeInteger = value => /^\d+$/.test(String(value)) ? Number(value) : null;
    const migrationMessage = 'Database migration is required before this setting can be saved.';

    function categoryOptions(current) {
        const normalized = String(current || 'other').toLowerCase();
        const values = expertiseCategories.includes(normalized) ? expertiseCategories : [...expertiseCategories, normalized];
        return values.map(value => `<option value="${escapeHtml(value)}" ${value === normalized ? 'selected' : ''}>${escapeHtml(value)}</option>`).join('');
    }

    function orderingFields(item, options = {}) {
        const order = Number(item?.sort_order) || 0;
        const visible = item?.is_visible !== 0;
        const featured = Number(item?.is_featured || 0) === 1;
        return `
            <div class="admin-field"><label>Display Order</label><input type="number" id="uni-sort-order" min="0" step="1" value="${order}"></div>
            <div class="admin-checkbox-group"><label><input type="checkbox" id="uni-visible" ${visible ? 'checked' : ''}> Visible on public site</label></div>
            ${options.featured ? `<div class="admin-checkbox-group"><label><input type="checkbox" id="uni-featured" ${featured ? 'checked' : ''}> Featured</label></div>` : ''}
            ${options.status ? `<div class="admin-field"><label>Publishing Status</label><input type="text" id="uni-status" maxlength="20" value="${escapeHtml(item?.status || 'published')}"></div>` : ''}`;
    }

    async function fetchHomepageSections() {
        const list = document.getElementById('homepage-sections-list');
        if (!list) return;
        try {
            const response = await fetch('/api/admin/site-sections');
            if (response.status === 401 || response.status === 403) return window.location.href = '/admin/login';
            if (!response.ok) throw new Error('sections unavailable');
            const sections = await response.json();
            list.innerHTML = sections.map(section => `
                <article class="dash-card admin-section-card" style="padding: 20px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 16px; font-size: 1.15rem; color: #38bdf8;">${escapeHtml(sectionDisplayNames[section.section_key] || section.section_key)}</h3>
                    <input type="hidden" data-section-key value="${escapeHtml(section.section_key)}">
                    <div class="admin-checkbox-group" style="margin-bottom: 14px;">
                        <label><input type="checkbox" data-section-visible ${section.is_visible ? 'checked' : ''}> Visible on public site</label>
                    </div>
                    <div class="admin-field">
                        <label>Display Order</label>
                        <input type="number" data-section-order min="0" step="1" value="${Number(section.sort_order) || 0}">
                    </div>
                    <div class="admin-field">
                        <label>Eyebrow</label>
                        <input type="text" data-section-eyebrow maxlength="160" value="${escapeHtml(section.eyebrow || '')}" placeholder="Optional eyebrow">
                    </div>
                    <div class="admin-field">
                        <label>Title</label>
                        <input type="text" data-section-title maxlength="255" value="${escapeHtml(section.title || '')}" placeholder="Section title">
                    </div>
                    <div class="admin-field">
                        <label>Description</label>
                        <textarea data-section-description maxlength="5000" rows="3" placeholder="Optional description">${escapeHtml(section.description || '')}</textarea>
                    </div>
                </article>`).join('');
        } catch (error) {
            document.getElementById('sections-migration-note').style.display = 'block';
            list.innerHTML = '<p>Section settings are unavailable right now.</p>';
        }
    }

    async function fetchServices() {
        const list = document.getElementById('services-list-admin');
        if (!list) return;
        try {
            const response = await fetch('/api/admin/services');
            if (response.status === 401 || response.status === 403) return window.location.href = '/admin/login';
            if (!response.ok) throw new Error('services unavailable');
            const services = await response.json();
            window.cachedServices = services;
            list.innerHTML = services.length ? services.map(service => `
                <li style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px; margin-bottom:8px; background:rgba(255,255,255,0.02); border-radius:6px;">
                    <div><h4 style="margin:0;">${escapeHtml(service.title)}</h4><p style="margin:4px 0 0; opacity:.7;">${escapeHtml(service.category_key || 'other')} · order ${Number(service.sort_order) || 0}</p></div>
                    <div style="display:flex; gap:8px;"><button type="button" class="action-btn" style="padding:4px 12px; font-size:.8rem; background:#2ecc71;" onclick="editService(${Number(service.id)})">Edit</button><button type="button" class="delete-btn" style="padding:4px 12px; font-size:.8rem;" onclick="deleteItem('/api/admin/services', ${Number(service.id)}, window.fetchServices)">Delete</button></div>
                </li>`).join('') : '<li>No services yet.</li>';
        } catch (error) {
            document.getElementById('services-migration-note').style.display = 'block';
            document.getElementById('services-migration-note').textContent = 'Services are unavailable right now. Existing data was not changed.';
        }
    }
    window.fetchServices = fetchServices;

    // Call all fetch functions on load
    fetchExperience(); 
    fetchProjects(); 
    fetchEducation(); 
    fetchCertificates(); 
    fetchInbox();
    fetchSocialLinks();
    fetchHomepageSections();
    fetchServices();

    document.getElementById('homepage-sections-form')?.addEventListener('submit', async event => {
        event.preventDefault();
        const cards = [...document.querySelectorAll('#homepage-sections-list .dash-card')];
        const sections = cards.map(card => ({
            section_key: card.querySelector('[data-section-key]').value,
            is_visible: card.querySelector('[data-section-visible]').checked,
            sort_order: asNonNegativeInteger(card.querySelector('[data-section-order]').value),
            eyebrow: card.querySelector('[data-section-eyebrow]').value.trim(),
            title: card.querySelector('[data-section-title]').value.trim(),
            description: card.querySelector('[data-section-description]').value.trim()
        }));
        if (!sections.length || sections.some(section => section.sort_order === null)) return window.showToast('Order must be a non-negative integer.', 'error');
        try {
            const response = await fetch('/api/admin/site-sections', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sections }) });
            if (response.status === 401 || response.status === 403) return window.location.href = '/admin/login';
            if (response.status === 409) {
                const note = document.getElementById('sections-migration-note');
                note.textContent = migrationMessage;
                note.style.display = 'block';
                return;
            }
            if (!response.ok) throw new Error('save failed');
            window.showToast('Homepage sections saved.', 'success');
            fetchHomepageSections();
        } catch (error) {
            window.showToast('Unable to save homepage sections.', 'error');
        }
    });

    document.getElementById('service-form')?.addEventListener('submit', async event => {
        event.preventDefault();
        const sortOrder = asNonNegativeInteger(document.getElementById('service-sort-order').value);
        if (sortOrder === null) return window.showToast('Order must be a non-negative integer.', 'error');
        const payload = {
            title: document.getElementById('service-title').value.trim(), description: document.getElementById('service-description').value.trim(),
            icon: document.getElementById('service-icon').value.trim(), tags: document.getElementById('service-tags').value.trim(),
            category_key: document.getElementById('service-category').value, sort_order: sortOrder,
            is_visible: document.getElementById('service-visible').checked
        };
        try {
            const response = await fetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (response.status === 401 || response.status === 403) return window.location.href = '/admin/login';
            if (!response.ok) throw new Error('save failed');
            event.target.reset();
            document.getElementById('service-visible').checked = true;
            document.getElementById('service-sort-order').value = 0;
            window.showToast('Service saved.', 'success');
            fetchServices();
        } catch (error) {
            window.showToast('Unable to save service. The migration may be required for new fields.', 'error');
        }
    });

    // --- UNIVERSAL CROPPER LOGIC (Fixed Sizes) ---
    let cropper;
    let croppedBlob = null;
    let currentUploadType = ''; 
    const modal = document.getElementById('cropper-modal');
    
    function handleImageSelect(e, type, ratio) {
        const files = e.target.files;
        if (files && files.length > 0) {
            currentUploadType = type;
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('cropper-image').src = event.target.result;
                modal.classList.remove('hidden');
                if (cropper) cropper.destroy();
                cropper = new Cropper(document.getElementById('cropper-image'), { aspectRatio: ratio, viewMode: 2 });
            };
            reader.readAsDataURL(files[0]);
        }
    }

    document.getElementById('proj-image')?.addEventListener('change', (e) => handleImageSelect(e, 'project', 16 / 9));
    document.getElementById('profile_image')?.addEventListener('change', (e) => handleImageSelect(e, 'profile', 1 / 1));

    document.getElementById('crop-confirm')?.addEventListener('click', () => {
        if (!cropper) return;
        const dims = currentUploadType === 'project' ? { width: 800, height: 450 } : { width: 400, height: 400 };
        cropper.getCroppedCanvas(dims).toBlob((blob) => {
            croppedBlob = blob;
            modal.classList.add('hidden');
            cropper.destroy(); cropper = null;
            alert("Image cropped perfectly! You can now submit the form.");
        }, 'image/jpeg');
    });

    document.getElementById('crop-cancel')?.addEventListener('click', () => {
        modal.classList.add('hidden');
        if (cropper) { cropper.destroy(); cropper = null; }
        document.getElementById('proj-image').value = "";
        document.getElementById('profile_image').value = "";
        croppedBlob = null;
    });

    // --- Form Submissions (No Refreshing!) ---
    async function submitForm(url, options, formElement, callback) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.status === 403) return window.location.href = '/admin/login';
            if (response.ok) { alert(data.message); if(callback) callback(data); }
            else { alert('Error: ' + data.error); }
        } catch (e) { window.showToast('An error occurred.', 'error'); }
    }

    // Submit Project
    document.getElementById('project-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!croppedBlob || currentUploadType !== 'project') return alert("Please crop an image first!");
        if (asNonNegativeInteger(document.getElementById('proj-sort-order').value) === null) return window.showToast('Project order must be a non-negative integer.', 'error');
        const formData = new FormData();
        formData.append('title', document.getElementById('proj-title').value);
        formData.append('description', document.getElementById('proj-desc').value);
        formData.append('github_url', document.getElementById('proj-github').value);
        formData.append('live_url', document.getElementById('proj-live').value);
        formData.append('technologies', document.getElementById('proj-technologies').value);
        formData.append('features', document.getElementById('proj-features').value);
        formData.append('challenge', document.getElementById('proj-challenge').value);
        formData.append('solution', document.getElementById('proj-solution').value);
        formData.append('architecture', document.getElementById('proj-architecture').value);
        formData.append('security_details', document.getElementById('proj-security').value);
        formData.append('database_details', document.getElementById('proj-database').value);
        formData.append('screenshots', document.getElementById('proj-screenshots').value);
        formData.append('sort_order', document.getElementById('proj-sort-order').value);
        formData.append('is_featured', document.getElementById('proj-featured').checked);
        formData.append('is_visible', document.getElementById('proj-visible').checked);
        formData.append('status', document.getElementById('proj-status').value.trim());
        formData.append('project_image', croppedBlob, 'project.jpg');
        submitForm('/api/admin/projects', { method: 'POST', body: formData }, e.target, () => {
            e.target.reset(); 
            croppedBlob = null; fetchProjects();
        });
    });

    // Submit Profile Picture
    document.getElementById('pic-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!croppedBlob || currentUploadType !== 'profile') return alert("Please crop an image first!");
        const formData = new FormData();
        formData.append('profile_image', croppedBlob, 'avatar.jpg');
        submitForm('/api/admin/upload-pic', { method: 'POST', body: formData }, e.target, (data) => {
            e.target.reset();
            croppedBlob = null;
            if (data && data.profile_pic_path) {
                try {
                    localStorage.setItem('sh_profile_pic', data.profile_pic_path);
                } catch (err) {}
                const preview = document.getElementById('avatar-preview');
                if (preview) {
                    preview.src = data.profile_pic_path;
                    preview.style.display = 'block';
                }
            }
            checkUploadStatus();
        });
    });

    // Submit Social Links
    document.getElementById('socials-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const heroUrls = ['hero-primary-cta-url', 'hero-secondary-cta-url', 'default-og-image'].map(id => document.getElementById(id).value.trim());
        if (heroUrls.some(url => url && !/^(https?:\/\/|\/)/i.test(url))) return window.showToast('CTA and OG image URLs must be absolute URLs or start with /.', 'error');
        const payload = {
            github_link: document.getElementById('social-github').value,
            linkedin_link: document.getElementById('social-linkedin').value,
            facebook_link: document.getElementById('social-facebook').value,
            fiverr_link: document.getElementById('social-fiverr').value,
            pinterest_link: document.getElementById('social-pinterest').value,
            adobe_stock_link: document.getElementById('social-adobe').value,
            stat_ccna_title: document.getElementById('stat-ccna-title').value,
            stat_ccna: document.getElementById('stat-ccna').value,
            stat_ceh_title: document.getElementById('stat-ceh-title').value,
            stat_ceh: document.getElementById('stat-ceh').value,
            stat_years: document.getElementById('stat-years').value,
            stat_projects: document.getElementById('stat-projects').value,
            about_title: document.getElementById('about-title').value,
            about_desc: document.getElementById('about-desc').value,
            contact_email: document.getElementById('contact-email').value,
            contact_location: document.getElementById('contact-location').value,
            contact_map_url: document.getElementById('contact-map').value,
            station_location: document.getElementById('station-location')?.value.trim() || '',
            station_timezone: document.getElementById('station-timezone')?.value.trim() || 'Asia/Dhaka',
            station_status: document.getElementById('station-status')?.value.trim() || '',
            hero_roles: document.getElementById('hero-roles').value,
            hero_description: document.getElementById('hero-desc').value,
            hero_primary_cta_label: document.getElementById('hero-primary-cta-label').value.trim(),
            hero_primary_cta_url: document.getElementById('hero-primary-cta-url').value.trim(),
            hero_secondary_cta_label: document.getElementById('hero-secondary-cta-label').value.trim(),
            hero_secondary_cta_url: document.getElementById('hero-secondary-cta-url').value.trim(),
            hero_availability_text: document.getElementById('hero-availability-text').value.trim(),
            contact_phone: document.getElementById('contact-phone').value.trim(),
            footer_text: document.getElementById('footer-text').value.trim(),
            default_seo_title: document.getElementById('default-seo-title').value.trim(),
            default_seo_description: document.getElementById('default-seo-description').value.trim(),
            default_og_image: document.getElementById('default-og-image').value.trim(),
        };
        const formData = new FormData();
        Object.entries(payload).forEach(([k, v]) => formData.append(k, v));
        submitForm('/api/admin/socials', { method: 'POST', body: formData }, e.target, fetchSocialLinks);
    });

    // GitHub Project Image Auto-Upload
    document.getElementById('gh-image-input')?.addEventListener('change', async (e) => {
        if (!e.target.files.length) return;
        const repo_id = document.getElementById('gh-repo-id').value;
        const formData = new FormData();
        formData.append('repo_id', repo_id);
        formData.append('gh_image', e.target.files[0]);
        
        try {
            const res = await fetch('/api/admin/github-image', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                window.showToast('Success!', 'success');
                e.target.value = ''; // clear input
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            window.showToast('Success!', 'success');
        }
    });

    // Submit Experience
    document.getElementById('exp-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (asNonNegativeInteger(document.getElementById('exp-sort-order').value) === null) return window.showToast('Experience order must be a non-negative integer.', 'error');
        const payload = {
            role: document.getElementById('role').value,
            company_or_project: document.getElementById('company').value,
            duration: document.getElementById('duration').value,
            description: document.getElementById('desc').value,
            sort_order: asNonNegativeInteger(document.getElementById('exp-sort-order').value),
            is_visible: document.getElementById('exp-visible').checked
        };
        submitForm('/api/admin/experience', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }, e.target, () => {
            e.target.reset(); fetchExperience();
        });
    });

    // Submit Education
    document.getElementById('admin-education-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (asNonNegativeInteger(document.getElementById('edu-sort-order').value) === null) return window.showToast('Education order must be a non-negative integer.', 'error');
        const payload = {
            degree: document.getElementById('edu-degree').value,
            institution: document.getElementById('edu-institution').value,
            duration: document.getElementById('edu-duration').value,
            description: document.getElementById('edu-description').value,
            sort_order: asNonNegativeInteger(document.getElementById('edu-sort-order').value),
            is_visible: document.getElementById('edu-visible').checked
        };
        submitForm('/api/admin/education', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload) 
        }, e.target, () => {
            e.target.reset(); fetchEducation();
        });
    });

    // Submit Certificates
    document.getElementById('admin-certificates-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (asNonNegativeInteger(document.getElementById('cert-sort-order').value) === null) return window.showToast('Certificate order must be a non-negative integer.', 'error');
        const fileInput = document.getElementById('cert-image');
        if (fileInput.files.length === 0) return alert("Please select a certificate image/badge.");
        
        const formData = new FormData();
        formData.append('title', document.getElementById('cert-title').value);
        formData.append('issuer', document.getElementById('cert-issuer').value);
        formData.append('link', document.getElementById('cert-link').value);
        formData.append('sort_order', document.getElementById('cert-sort-order').value);
        formData.append('is_visible', document.getElementById('cert-visible').checked);
        formData.append('cert_image', fileInput.files[0]); 
        
        submitForm('/api/admin/certificates', { method: 'POST', body: formData }, e.target, () => {
            e.target.reset(); fetchCertificates();
        });
    });

    // Submit CV Document
    const cvForm = document.getElementById('cv-form');
    if (cvForm) {
        cvForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const fileInput = document.getElementById('cv_document');
            if (fileInput.files.length === 0) return alert("Please select a PDF file first.");
            const formData = new FormData();
            formData.append('cv_document', fileInput.files[0]);
            submitForm('/api/admin/upload-cv', { method: 'POST', body: formData }, e.target, () => e.target.reset());
        });
    }

    // ==========================================
    // 📝 SECURE BLOG MANAGER (WITH POPUP EDIT)
    // ==========================================
    async function fetchAdminBlogs() {
        try {
            const res = await fetch('/api/admin/blog');
            if (res.status === 401 || res.status === 403) return window.location.href = '/admin/login';
            if (!res.ok) throw new Error('blog unavailable');
            const data = await res.json();
            window.cachedBlogs = Array.isArray(data) ? data : [];
            window.currentBlogLimit = 15;
            if (!window.currentBlogFilter) window.currentBlogFilter = 'all';
            updateBlogFilterBadges();
            renderAdminBlogs();
        } catch (e) { console.log(e); }
    }

    function updateBlogFilterBadges() {
        if (!window.cachedBlogs) return;
        const countAll = window.cachedBlogs.length;
        const countReview = window.cachedBlogs.filter(b => b.status === 'review').length;
        const countPublished = window.cachedBlogs.filter(b => b.status === 'published').length;

        const elAll = document.getElementById('count-blog-all');
        const elReview = document.getElementById('count-blog-review');
        const elPublished = document.getElementById('count-blog-published');
        const btnApproveAll = document.getElementById('btn-approve-all');

        if (elAll) elAll.textContent = countAll;
        if (elReview) elReview.textContent = countReview;
        if (elPublished) elPublished.textContent = countPublished;
        if (btnApproveAll) {
            btnApproveAll.style.display = countReview > 0 ? 'inline-block' : 'none';
        }
    }

    window.filterAdminBlogs = (filter) => {
        window.currentBlogFilter = filter;
        window.currentBlogLimit = 15;
        ['all', 'review', 'published'].forEach(f => {
            const btn = document.getElementById(`filter-btn-${f}`);
            if (btn) {
                if (f === filter) {
                    btn.style.background = '#3b82f6';
                    btn.style.color = '#ffffff';
                } else {
                    btn.style.background = '#1e293b';
                    btn.style.color = '#94a3b8';
                }
            }
        });
        renderAdminBlogs();
    };

    window.approveAllReviewBlogs = async function() {
        const reviewCount = window.cachedBlogs?.filter(b => b.status === 'review').length || 0;
        if (reviewCount === 0) {
            return window.showToast('No articles currently in review status.', 'info');
        }
        const confirmed = await window.customConfirm(`Auto-approve and publish all ${reviewCount} review articles directly to live site?`);
        if (!confirmed) return;

        try {
            const response = await fetch('/api/admin/blog/approve-all', { method: 'POST' });
            if (response.status === 401 || response.status === 403) return window.location.href = '/admin/login';
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to approve articles');
            window.showToast(data.message || 'All pending articles auto-approved & published!', 'success');
            await fetchAdminBlogs();
        } catch (err) {
            window.showToast(err.message || 'Error auto-approving articles', 'error');
        }
    };
    
    window.renderAdminBlogs = () => {
        const list = document.getElementById('blog-list');
        if (!list || !window.cachedBlogs) return;
        updateBlogFilterBadges();
        list.innerHTML = '';

        const filter = window.currentBlogFilter || 'all';
        const filtered = filter === 'all' 
            ? window.cachedBlogs 
            : window.cachedBlogs.filter(b => b.status === filter);

        if (!filtered.length) {
            list.innerHTML = `<p style="color:#94a3b8; padding:15px; text-align:center;">No articles found ${filter !== 'all' ? `with status "${filter}"` : ''}.</p>`;
            return;
        }

        const toShow = filtered.slice(0, window.currentBlogLimit);
        
        toShow.forEach(blog => {
            const isReview = blog.status === 'review';
            const statusBadgeStyle = 
                blog.status === 'draft' ? 'background:rgba(148,163,184,0.15); color:#94a3b8; border:1px solid #94a3b8;' :
                isReview ? 'background:rgba(245,158,11,0.2); color:#f59e0b; border:1px solid #f59e0b;' :
                'background:rgba(16,185,129,0.15); color:#10b981; border:1px solid #10b981;';

            list.innerHTML += `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: ${isReview ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.02)'}; border: 1px solid ${isReview ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)'}; border-radius: 6px;">
                    <span style="flex: 1; min-width: 0; padding-right: 15px;">
                        <strong style="display: block; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${blog.title}</strong> 
                        <span style="color:#818cf8; font-size: 0.8rem;">📁 ${blog.category || 'General'}</span>
                        <span style="display:inline-block; margin-left:8px; padding:2px 8px; border-radius:4px; font-size:0.72rem; font-weight:700; ${statusBadgeStyle}">
                            ${(blog.status || 'published').toUpperCase()}
                        </span>
                    </span>
                    <div style="display: flex; gap: 8px; flex-shrink: 0;">
                        ${isReview ? `<button class="action-btn" style="padding: 5px 14px; font-size: 0.8rem; background: #10b981; font-weight: 600;" onclick="approveAndPublishBlog(${blog.id})">Approve &amp; Publish</button>` : ''}
                        <button class="action-btn" style="padding: 5px 12px; font-size: 0.8rem; background: #38bdf8;" onclick="openEditBlogModal(${blog.id})">Edit</button>
                        <button class="delete-btn" style="padding: 5px 12px; font-size: 0.8rem;" onclick="deleteItem('/api/admin/blog', ${blog.id}, window.fetchAdminBlogs)">Delete</button>
                    </div>
                </li>`;
        });

        if (filtered.length > window.currentBlogLimit) {
            list.innerHTML += `
                <li style="display: flex; justify-content: center; margin-top: 15px;">
                    <button class="action-btn" style="padding: 8px 20px; font-size: 0.85rem;" onclick="window.currentBlogLimit += 15; window.renderAdminBlogs();">Show More (${filtered.length - window.currentBlogLimit} remaining)</button>
                </li>
            `;
        }
    };
    window.fetchAdminBlogs = fetchAdminBlogs;

    window.approveAndPublishBlog = async function(id) {
        const blog = window.cachedBlogs?.find((item) => Number(item.id) === Number(id));
        if (!blog) return;

        const formData = new FormData();
        formData.append('title', blog.title || 'Untitled article');
        formData.append('custom_slug', blog.slug || '');
        formData.append('category', blog.category || 'General');
        formData.append('content', blog.content || '');
        formData.append('status', 'published');
        formData.append('excerpt', blog.excerpt || '');
        formData.append('meta_title', blog.meta_title || '');
        formData.append('meta_description', blog.meta_description || '');
        formData.append('tags', blog.tags || '');
        formData.append('is_featured', Number(blog.is_featured || 0) === 1);
        formData.append('featured_order', blog.featured_order || 0);

        try {
            const response = await fetch(`/api/admin/blog/${id}`, { method: 'PUT', body: formData });
            if (response.status === 401 || response.status === 403) {
                window.location.href = '/admin/login';
                return;
            }
            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.error || 'Unable to publish article.');
            }
            await fetchAdminBlogs();
            window.showToast('Article published!', 'success');
        } catch (error) {
            window.showToast(error.message || 'Unable to publish article.', 'error');
        }
    };
    fetchAdminBlogs();

    document.getElementById('blog-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (asNonNegativeInteger(document.getElementById('blog-featured-order').value) === null) return window.showToast('Featured order must be a non-negative integer.', 'error');
        const formData = new FormData();
        formData.append('title', document.getElementById('blog-title').value); 
        formData.append('category', document.getElementById('blog-category').value);
        formData.append('content', document.getElementById('blog-content').value); 
        formData.append('custom_slug', document.getElementById('blog-slug').value);
        formData.append('status', document.getElementById('blog-status')?.value || 'published');
        formData.append('excerpt', document.getElementById('blog-excerpt')?.value || '');
        formData.append('meta_title', document.getElementById('blog-meta-title')?.value || '');
        formData.append('meta_description', document.getElementById('blog-meta-desc')?.value || '');
        formData.append('tags', document.getElementById('blog-tags')?.value || '');
        formData.append('is_featured', document.getElementById('blog-featured').checked);
        formData.append('featured_order', document.getElementById('blog-featured-order').value);
        const fileInput = document.getElementById('blog-image'); 
        if (fileInput.files.length > 0) formData.append('blog_image', fileInput.files[0]);
        try {
            const response = await fetch('/api/admin/blog', { method: 'POST', body: formData });
            if (response.ok) { blogForm.reset(); fetchAdminBlogs(); window.showToast('Success!', 'success'); }
        } catch (err) { alert("Network error."); }
    });

    const editBlogModal = document.getElementById('edit-blog-modal');
    window.openEditBlogModal = function(id) {
        if (!window.cachedBlogs) return; 
        const blog = window.cachedBlogs.find(b => b.id === id); 
        if (!blog) return;
        document.getElementById('edit-blog-id').value = blog.id; 
        document.getElementById('edit-blog-title').value = blog.title || '';
        document.getElementById('edit-blog-slug').value = blog.slug || ''; 
        document.getElementById('edit-blog-category').value = blog.category || '';
        document.getElementById('edit-blog-content').value = blog.content || ''; 
        if (document.getElementById('edit-blog-status')) document.getElementById('edit-blog-status').value = blog.status || 'published';
        if (document.getElementById('edit-blog-excerpt')) document.getElementById('edit-blog-excerpt').value = blog.excerpt || '';
        if (document.getElementById('edit-blog-meta-title')) document.getElementById('edit-blog-meta-title').value = blog.meta_title || '';
        if (document.getElementById('edit-blog-meta-desc')) document.getElementById('edit-blog-meta-desc').value = blog.meta_description || '';
        if (document.getElementById('edit-blog-tags')) document.getElementById('edit-blog-tags').value = blog.tags || '';
        document.getElementById('edit-blog-featured').checked = Number(blog.is_featured || 0) === 1;
        document.getElementById('edit-blog-featured-order').value = Number(blog.featured_order) || 0;
        editBlogModal.classList.remove('hidden');
    }
    document.getElementById('edit-blog-cancel')?.addEventListener('click', () => editBlogModal.classList.add('hidden'));

    document.getElementById('edit-blog-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (asNonNegativeInteger(document.getElementById('edit-blog-featured-order').value) === null) return window.showToast('Featured order must be a non-negative integer.', 'error');
        const id = document.getElementById('edit-blog-id').value;
        const formData = new FormData();
        formData.append('title', document.getElementById('edit-blog-title').value); 
        formData.append('custom_slug', document.getElementById('edit-blog-slug').value);
        formData.append('category', document.getElementById('edit-blog-category').value);
        formData.append('content', document.getElementById('edit-blog-content').value);
        formData.append('status', document.getElementById('edit-blog-status')?.value || 'published');
        formData.append('excerpt', document.getElementById('edit-blog-excerpt')?.value || '');
        formData.append('meta_title', document.getElementById('edit-blog-meta-title')?.value || '');
        formData.append('meta_description', document.getElementById('edit-blog-meta-desc')?.value || '');
        formData.append('tags', document.getElementById('edit-blog-tags')?.value || '');
        formData.append('is_featured', document.getElementById('edit-blog-featured').checked);
        formData.append('featured_order', document.getElementById('edit-blog-featured-order').value);
        const fileInput = document.getElementById('edit-blog-image');
        if (fileInput.files.length > 0) formData.append('blog_image', fileInput.files[0]);
        try {
            const response = await fetch(`/api/admin/blog/${id}`, { method: 'PUT', body: formData });
            if (response.ok) { editBlogModal.classList.add('hidden'); fetchAdminBlogs(); window.showToast('Success!', 'success'); }
        } catch (e) { window.showToast('An error occurred.', 'error'); }
    });

    // ==========================================
    // REAL-TIME SYSTEM STATS
    // ==========================================
    let statsTimer;
    async function fetchSystemStats() {
        const overviewTab = document.getElementById('tab-overview'); 
        if (!overviewTab) return;
        try {
            const res = await fetch('/api/admin/system-status');
            if (res.status === 403) { clearInterval(statsTimer); window.location.href = '/admin/login'; return; }
            if (!res.ok) return; 
            const data = await res.json();
            document.getElementById('sys-ram-percent').textContent = `${data.ramPercentage}%`;
            document.getElementById('sys-ram-bar').style.width = `${data.ramPercentage}%`;
            document.getElementById('sys-ram-text').textContent = `${data.usedRam} GB / ${data.totalRam} GB Used`;
            document.getElementById('sys-cpu-cores').textContent = `${data.cpuCores} Threads`;
            document.getElementById('sys-cpu-model').textContent = data.cpuModel;
            document.getElementById('sys-uptime').textContent = data.uptime;
            document.getElementById('sys-os').textContent = `OS: ${data.osPlatform}`;
            const cpuEl = document.getElementById('sys-cpu-percent'); if (cpuEl) { cpuEl.textContent = `${data.cpuPercentage}%`; cpuEl.style.color = data.cpuPercentage > 85 ? '#e74c3c' : '#2ecc71'; }
            const diskEl = document.getElementById('sys-disk-percent'); if (diskEl) { diskEl.textContent = `${data.diskPercentage}%`; document.getElementById('sys-disk-bar').style.width = `${data.diskPercentage}%`; document.getElementById('sys-disk-text').textContent = `${data.usedDisk} GB / ${data.totalDisk} GB Used`; }
            const netDownEl = document.getElementById('sys-net-down'); if (netDownEl) { netDownEl.textContent = data.networkDownload || "0.00"; document.getElementById('sys-net-up').textContent = data.networkUpload || "0.00"; }
        } catch (e) { console.log("Stats skipped."); }
    }
    fetchSystemStats(); 
    statsTimer = setInterval(fetchSystemStats, 5000);

    // Logout Trigger
    document.getElementById('logout-btn')?.addEventListener('click', async () => { 
        await fetch('/api/logout', { method: 'POST' }); 
        window.location.href = '/admin/login'; 
    });
});

    
    window.setGithubLiveUrl = async (repoId, currentUrl) => {
        document.getElementById('link-modal-repo-id').value = repoId;
        const hasUrl = currentUrl && currentUrl !== 'undefined' && currentUrl.trim() !== '';
        document.getElementById('link-modal-url').value = hasUrl ? currentUrl : '';
        
        const removeBtn = document.getElementById('remove-link-btn');
        if (removeBtn) {
            if (hasUrl) removeBtn.classList.remove('hidden');
            else removeBtn.classList.add('hidden');
        }
        
        document.getElementById('link-modal').classList.remove('hidden');
    };

    window.submitGithubLiveUrl = async (isRemove = false) => {
        const repoId = document.getElementById('link-modal-repo-id').value;
        const url = isRemove ? '' : document.getElementById('link-modal-url').value.trim();
        
        try {
            const res = await fetch('/api/admin/github/live-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repo_id: repoId, live_url: url })
            });
            const data = await res.json();
            if (res.ok) {
                showToast(data.message, 'success');
                document.getElementById('link-modal').classList.add('hidden');
                fetchProjects();
            } else {
                showToast(data.error || 'Failed to update', 'error');
            }
        } catch (e) {
            showToast('Network error', 'error');
        }
    };




// ==================== AUTO LOGOUT (1 min idle) ====================
let idleTimeout;
function resetIdleTimeout() {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
        // Idle for 1 minute (60,000ms)
        fetch('/api/logout', { method: 'POST' })
            .then(() => {
                alert('You have been logged out due to inactivity for security reasons.');
                window.location.href = '/admin/login.html';
            })
            .catch(err => {
                console.error(err);
                window.location.href = '/admin/login.html';
            });
    }, 60000);
}
['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, resetIdleTimeout, true);
});
resetIdleTimeout(); // Init

// (Consolidated in DOMContentLoaded listener below)


// ==========================================
// 2FA MANAGEMENT
// ==========================================
async function check2FAStatus() {
    try {
        const res = await fetch('/api/admin/2fa/status');
        const data = await res.json();
        
        const badge = document.getElementById('2fa-badge');
        const enableBtn = document.getElementById('btn-enable-2fa');
        const disableBtn = document.getElementById('btn-disable-2fa');
        
        if (!badge) return; // Not on the security tab
        
        if (data.enabled) {
            badge.textContent = 'Enabled ✅';
            badge.style.background = 'rgba(74, 222, 128, 0.2)';
            badge.style.color = '#4ade80';
            enableBtn.style.display = 'none';
            disableBtn.style.display = 'inline-block';
        } else {
            badge.textContent = 'Disabled ❌';
            badge.style.background = 'rgba(248, 113, 113, 0.2)';
            badge.style.color = '#f87171';
            enableBtn.style.display = 'inline-block';
            disableBtn.style.display = 'none';
        }
    } catch (e) {
        console.error("Failed to check 2FA status");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    check2FAStatus();
    
    const enableBtn = document.getElementById('btn-enable-2fa');
    const disableBtn = document.getElementById('btn-disable-2fa');
    const modal = document.getElementById('modal-2fa');
    const closeBtn = document.getElementById('close-2fa-modal');
    const verifyBtn = document.getElementById('btn-verify-2fa');
    
    if (enableBtn) {
        enableBtn.addEventListener('click', async () => {
            try {
                const res = await fetch('/api/admin/2fa/generate', { method: 'POST' });
                const data = await res.json();
                if (data.qrCodeUrl) {
                    document.getElementById('qr-code-img').src = data.qrCodeUrl;
                    document.getElementById('verify-totp-input').value = '';
                    document.getElementById('verify-2fa-msg').textContent = '';
                    modal.style.display = 'flex';
                }
            } catch (e) {
                showToast("Failed to generate 2FA");
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (verifyBtn) {
        verifyBtn.addEventListener('click', async () => {
            const token = document.getElementById('verify-totp-input').value;
            if (!token) return;
            
            verifyBtn.innerHTML = 'Verifying...';
            
            try {
                const formData = new FormData();
                formData.append('token', token);
                
                const res = await fetch('/api/admin/2fa/verify', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await res.json();
                if (res.ok) {
                    document.getElementById('verify-2fa-msg').style.color = '#4ade80';
                    document.getElementById('verify-2fa-msg').textContent = '2FA Enabled!';
                    setTimeout(() => {
                        modal.style.display = 'none';
                        check2FAStatus();
                        showToast('Google Authenticator Enabled');
                    }, 1000);
                } else {
                    document.getElementById('verify-2fa-msg').style.color = '#f87171';
                    document.getElementById('verify-2fa-msg').textContent = data.error || 'Invalid code';
                }
            } catch (e) {
                document.getElementById('verify-2fa-msg').textContent = 'Server error';
            } finally {
                verifyBtn.innerHTML = 'Verify & Enable';
            }
        });
    }
    
    if (disableBtn) {
        disableBtn.addEventListener('click', async () => {
            const confirmed = await customConfirm("Are you sure you want to disable 2FA?");
            if (!confirmed) return;
            
            try {
                const res = await fetch('/api/admin/2fa/disable', { method: 'POST' });
                if (res.ok) {
                    showToast("2FA Disabled Successfully");
                    check2FAStatus();
                } else {
                    showToast("Failed to disable 2FA");
                }
            } catch (e) {
                showToast("Server error");
            }
        });
    }
});


// ==========================================
// AVATAR AND CV STATUS MANAGEMENT
// ==========================================
async function checkUploadStatus() {
    try {
        const res = await fetch('/api/profile', { cache: 'no-cache' });
        const data = await res.json();
        
        const avatarStatus = document.getElementById('avatar-status');
        const cvStatus = document.getElementById('cv-status');
        const removeAvatarBtn = document.getElementById('remove-avatar-btn');
        const removeCvBtn = document.getElementById('remove-cv-btn');
        const avatarPreview = document.getElementById('avatar-preview');
        
        if (avatarStatus && data.profile_pic_path) {
            avatarStatus.textContent = '✅ Uploaded';
            avatarStatus.style.background = 'rgba(74, 222, 128, 0.2)';
            avatarStatus.style.color = '#4ade80';
            if (removeAvatarBtn) removeAvatarBtn.style.display = 'flex';
            if (avatarPreview) {
                avatarPreview.src = data.profile_pic_path;
                avatarPreview.style.display = 'block';
            }
        } else if (avatarStatus) {
            avatarStatus.textContent = '❌ Not Uploaded';
            avatarStatus.style.background = 'rgba(248, 113, 113, 0.2)';
            avatarStatus.style.color = '#f87171';
            if (removeAvatarBtn) removeAvatarBtn.style.display = 'none';
            if (avatarPreview) {
                avatarPreview.src = '';
                avatarPreview.style.display = 'none';
            }
        }
        
        if (cvStatus && data.cv_file_path) {
            cvStatus.textContent = '✅ Uploaded';
            cvStatus.style.background = 'rgba(74, 222, 128, 0.2)';
            cvStatus.style.color = '#4ade80';
            if (removeCvBtn) removeCvBtn.style.display = 'flex';
        } else if (cvStatus) {
            cvStatus.textContent = '❌ Not Uploaded';
            cvStatus.style.background = 'rgba(248, 113, 113, 0.2)';
            cvStatus.style.color = '#f87171';
            if (removeCvBtn) removeCvBtn.style.display = 'none';
        }
    } catch (e) {
        console.error('Failed to fetch profile data for upload status');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkUploadStatus();
    
    const removeAvatarBtn = document.getElementById('remove-avatar-btn');
    if (removeAvatarBtn) {
        removeAvatarBtn.addEventListener('click', async () => {
            const confirmed = await customConfirm("Remove avatar image?");
            if (confirmed) {
                try {
                    const res = await fetch('/api/admin/remove-avatar', { method: 'POST' });
                    if (res.ok) {
                        try {
                            localStorage.removeItem('sh_profile_pic');
                        } catch (err) {}
                        showToast("Avatar removed");
                        checkUploadStatus();
                    } else {
                        showToast("Failed to remove avatar");
                    }
                } catch (e) {
                    showToast("Error removing avatar");
                }
            }
        });
    }
    
    const removeCvBtn = document.getElementById('remove-cv-btn');
    if (removeCvBtn) {
        removeCvBtn.addEventListener('click', async () => {
            const confirmed = await customConfirm("Remove CV document?");
            if (confirmed) {
                try {
                    const res = await fetch('/api/admin/remove-cv', { method: 'POST' });
                    if (res.ok) {
                        showToast("CV removed");
                        checkUploadStatus();
                    } else {
                        showToast("Failed to remove CV");
                    }
                } catch (e) {
                    showToast("Error removing CV");
                }
            }
        });
    }

    // ==========================================
    // 🎥 MEDIA CHANNELS & STREAMS CMS MANAGER
    // ==========================================
    let cachedAdminChannels = [];
    let cachedAdminVideos = [];

    async function fetchMediaChannelsAdmin() {
        const channelsList = document.getElementById('admin-channels-list');
        const videosList = document.getElementById('admin-videos-list');
        const channelSelect = document.getElementById('video-channel-id');
        const channelsCount = document.getElementById('admin-channels-count');
        const videosCount = document.getElementById('admin-videos-count');

        if (!channelsList || !videosList) return;

        try {
            const res = await fetch('/api/admin/media-channels');
            if (res.status === 401 || res.status === 403) return window.location.href = '/admin/login';
            if (!res.ok) throw new Error('Failed to load media channels');
            const data = await res.json();
            
            cachedAdminChannels = data.channels || [];
            cachedAdminVideos = data.videos || [];

            if (channelsCount) channelsCount.textContent = cachedAdminChannels.length;
            if (videosCount) videosCount.textContent = cachedAdminVideos.length;

            // Populate Channel Select dropdown for video form
            if (channelSelect) {
                const currentVal = channelSelect.value;
                channelSelect.innerHTML = '<option value="">-- Linked Channel (Optional) --</option>';
                cachedAdminChannels.forEach(ch => {
                    const opt = document.createElement('option');
                    opt.value = ch.id;
                    opt.textContent = `${ch.platform.toUpperCase()}: ${ch.channel_name}`;
                    channelSelect.appendChild(opt);
                });
                channelSelect.value = currentVal;
            }

            // Render Channels List
            channelsList.innerHTML = '';
            if (cachedAdminChannels.length === 0) {
                channelsList.innerHTML = '<p style="color: #94a3b8;">No channels added yet. Add YouTube, Twitch, or Kick above.</p>';
            } else {
                cachedAdminChannels.forEach(ch => {
                    const platformBadgeColor = ch.platform === 'youtube' ? '#ef4444' : (ch.platform === 'twitch' ? '#a855f7' : '#22c55e');
                    const platformIcon = ch.platform === 'youtube' ? '🔴 YouTube' : (ch.platform === 'twitch' ? '🟣 Twitch' : '🟢 Kick');
                    const isLiveBadge = ch.is_live ? '<span style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; padding: 2px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 700;">🔴 LIVE NOW</span>' : '<span style="background: rgba(255,255,255,0.06); color: #94a3b8; padding: 2px 8px; border-radius: 999px; font-size: 0.72rem;">OFFLINE</span>';

                    channelsList.innerHTML += `
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <span style="color: ${platformBadgeColor}; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.5px;">${platformIcon}</span>
                                ${isLiveBadge}
                            </div>
                            <div style="display: flex; gap: 12px; align-items: center;">
                                ${ch.avatar_url ? `<img src="${ch.avatar_url}" alt="${ch.channel_name}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid ${platformBadgeColor};">` : `<div style="width: 44px; height: 44px; border-radius: 50%; background: ${platformBadgeColor}22; border: 1px solid ${platformBadgeColor}; display: grid; place-items: center; font-weight: 700; color: ${platformBadgeColor};">${ch.channel_name.charAt(0)}</div>`}
                                <div>
                                    <h4 style="margin: 0; font-size: 1rem; color: #fff;">${ch.channel_name}</h4>
                                    <p style="margin: 2px 0 0; font-size: 0.8rem; color: #94a3b8;">${ch.channel_handle || ch.subscribers_count || ''}</p>
                                </div>
                            </div>
                            ${ch.description ? `<p style="margin: 10px 0 0; font-size: 0.82rem; color: #cbd5e1; line-height: 1.4;">${ch.description}</p>` : ''}
                        </div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;">
                            <a href="${ch.channel_url}" target="_blank" rel="noopener" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 4px; background: rgba(255,255,255,0.08); color: #fff; text-decoration: none;">Visit ↗</a>
                            ${ch.platform === 'youtube' ? `<button type="button" class="action-btn" style="padding: 4px 10px; font-size: 0.75rem; background: #6366f1;" onclick="window.syncChannelVideos(${ch.id})">🔄 Sync Feed</button>` : ''}
                            <button type="button" class="action-btn" style="padding: 4px 10px; font-size: 0.75rem; background: ${ch.is_live ? '#eab308' : '#38bdf8'};" onclick="window.toggleChannelLive(${ch.id})">${ch.is_live ? 'Set Offline' : 'Set Live'}</button>
                            <button type="button" class="action-btn" style="padding: 4px 10px; font-size: 0.75rem; background: #2ecc71;" onclick="window.editChannel(${ch.id})">Edit</button>
                            <button type="button" class="delete-btn" style="padding: 4px 10px; font-size: 0.75rem;" onclick="window.deleteChannel(${ch.id})">Delete</button>
                        </div>
                    </div>`;
                });
            }

            // Render Videos List
            videosList.innerHTML = '';
            if (cachedAdminVideos.length === 0) {
                videosList.innerHTML = '<p style="color: #94a3b8;">No video highlights added yet. Add a video link above.</p>';
            } else {
                cachedAdminVideos.forEach(v => {
                    const platformBadgeColor = v.platform === 'youtube' ? '#ef4444' : (v.platform === 'twitch' ? '#a855f7' : '#22c55e');
                    videosList.innerHTML += `
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
                        <div style="position: relative; height: 130px; background: #0b0f13; overflow: hidden;">
                            ${v.thumbnail_url ? `<img src="${v.thumbnail_url}" alt="${v.title}" style="width: 100%; height: 100%; object-fit: cover;">` : `<div style="width: 100%; height: 100%; display: grid; place-items: center; color: #94a3b8; font-size: 0.85rem;">No Thumbnail</div>`}
                            <span style="position: absolute; top: 8px; left: 8px; background: ${platformBadgeColor}; color: #fff; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 3px; text-transform: uppercase;">${v.platform}</span>
                            ${v.duration ? `<span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: #fff; font-size: 0.7rem; padding: 2px 6px; border-radius: 3px;">${v.duration}</span>` : ''}
                        </div>
                        <div style="padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <h4 style="margin: 0 0 6px; font-size: 0.9rem; color: #fff; line-height: 1.3;">${v.title}</h4>
                                <p style="margin: 0; font-size: 0.75rem; color: #94a3b8;">${v.views_count || 'Featured Highlight'}</p>
                            </div>
                            <div style="display: flex; gap: 8px; margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
                                <a href="${v.video_url}" target="_blank" rel="noopener" style="padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; background: rgba(255,255,255,0.08); color: #fff; text-decoration: none;">Watch ↗</a>
                                <button type="button" class="action-btn" style="padding: 4px 8px; font-size: 0.75rem; background: #2ecc71;" onclick="window.editVideo(${v.id})">Edit</button>
                                <button type="button" class="delete-btn" style="padding: 4px 8px; font-size: 0.75rem;" onclick="window.deleteVideo(${v.id})">Delete</button>
                            </div>
                        </div>
                    </div>`;
                });
            }

        } catch (e) {
            console.error('Error in fetchMediaChannelsAdmin:', e);
            if (channelsList) channelsList.innerHTML = '<p style="color: #ef4444;">Error loading media channels.</p>';
            if (videosList) videosList.innerHTML = '<p style="color: #ef4444;">Error loading videos.</p>';
        }
    }
    window.fetchMediaChannelsAdmin = fetchMediaChannelsAdmin;

    window.toggleChannelLive = async function(id) {
        try {
            const res = await fetch(`/api/admin/media-channels/${id}/toggle-live`, { method: 'POST' });
            if (res.ok) {
                window.showToast('Channel live status updated!');
                fetchMediaChannelsAdmin();
            } else {
                window.showToast('Failed to update live status.', 'error');
            }
        } catch(e) {
            window.showToast('Network error.', 'error');
        }
    };

    window.syncChannelVideos = async function(id) {
        window.showToast('Syncing channel videos from YouTube feed...', 'info');
        try {
            const res = await fetch(`/api/admin/media-channels/${id}/sync`, { method: 'POST' });
            const data = await res.json();
            if (res.ok && data.success) {
                window.showToast(data.message || 'Channel synced!');
                fetchMediaChannelsAdmin();
            } else {
                window.showToast(data.error || 'Failed to sync channel feed.', 'error');
            }
        } catch(e) {
            window.showToast('Sync request error: ' + e.message, 'error');
        }
    };

    window.syncAllChannels = async function() {
        window.showToast('Syncing all channel feeds...', 'info');
        try {
            const res = await fetch('/api/admin/media-channels/sync-all', { method: 'POST' });
            const data = await res.json();
            if (res.ok && data.success) {
                window.showToast(data.message || 'All channels synced!');
                fetchMediaChannelsAdmin();
            } else {
                window.showToast(data.error || 'Failed to sync feeds.', 'error');
            }
        } catch(e) {
            window.showToast('Sync-all error: ' + e.message, 'error');
        }
    };

    window.editChannel = function(id) {
        const ch = cachedAdminChannels.find(c => c.id === id);
        if (!ch) return;
        document.getElementById('channel-id').value = ch.id;
        document.getElementById('channel-platform').value = ch.platform;
        document.getElementById('channel-name').value = ch.channel_name;
        document.getElementById('channel-handle').value = ch.channel_handle || '';
        document.getElementById('channel-url').value = ch.channel_url;
        document.getElementById('channel-subscribers').value = ch.subscribers_count || '';
        document.getElementById('channel-badge').value = ch.badge_text || 'OFFICIAL';
        document.getElementById('channel-sort').value = ch.sort_order || 0;
        document.getElementById('channel-desc').value = ch.description || '';
        document.getElementById('channel-avatar-url').value = ch.avatar_url || '';
        document.getElementById('channel-is-live').checked = !!ch.is_live;
        document.getElementById('channel-is-visible').checked = !!ch.is_visible;

        document.getElementById('channel-submit-btn').textContent = 'Update Channel ✨';
        document.getElementById('channel-cancel-btn').style.display = 'inline-block';
        document.getElementById('admin-channel-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.deleteChannel = async function(id) {
        const confirmed = await window.customConfirm('Delete this channel and its associated video highlights?');
        if (!confirmed) return;
        try {
            const res = await fetch(`/api/admin/media-channels/${id}`, { method: 'DELETE' });
            if (res.ok) {
                window.showToast('Channel deleted!');
                fetchMediaChannelsAdmin();
            } else {
                window.showToast('Failed to delete channel.', 'error');
            }
        } catch(e) {
            window.showToast('Network error.', 'error');
        }
    };

    window.editVideo = function(id) {
        const v = cachedAdminVideos.find(item => item.id === id);
        if (!v) return;
        document.getElementById('video-id').value = v.id;
        document.getElementById('video-platform').value = v.platform;
        document.getElementById('video-channel-id').value = v.channel_id || '';
        document.getElementById('video-title').value = v.title;
        document.getElementById('video-url').value = v.video_url;
        document.getElementById('video-duration').value = v.duration || '';
        document.getElementById('video-views').value = v.views_count || '';
        document.getElementById('video-thumb-url').value = v.thumbnail_url || '';
        document.getElementById('video-is-featured').checked = !!v.is_featured;

        document.getElementById('video-submit-btn').textContent = 'Update Video ✨';
        document.getElementById('video-cancel-btn').style.display = 'inline-block';
        document.getElementById('admin-video-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.deleteVideo = async function(id) {
        const confirmed = await window.customConfirm('Delete this video highlight?');
        if (!confirmed) return;
        try {
            const res = await fetch(`/api/admin/media-videos/${id}`, { method: 'DELETE' });
            if (res.ok) {
                window.showToast('Video highlight deleted!');
                fetchMediaChannelsAdmin();
            } else {
                window.showToast('Failed to delete video.', 'error');
            }
        } catch(e) {
            window.showToast('Network error.', 'error');
        }
    };

    // Forms Setup
    const channelForm = document.getElementById('admin-channel-form');
    if (channelForm) {
        channelForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(channelForm);
            try {
                const res = await fetch('/api/admin/media-channels', {
                    method: 'POST',
                    body: formData
                });
                const result = await res.json();
                if (res.ok) {
                    window.showToast(result.message || 'Channel saved!');
                    channelForm.reset();
                    document.getElementById('channel-id').value = '';
                    document.getElementById('channel-submit-btn').textContent = 'Add Channel 🚀';
                    document.getElementById('channel-cancel-btn').style.display = 'none';
                    fetchMediaChannelsAdmin();
                } else {
                    window.showToast(result.error || 'Failed to save channel', 'error');
                }
            } catch(err) {
                window.showToast('Network error saving channel', 'error');
            }
        });

        const cancelChBtn = document.getElementById('channel-cancel-btn');
        if (cancelChBtn) {
            cancelChBtn.addEventListener('click', () => {
                channelForm.reset();
                document.getElementById('channel-id').value = '';
                document.getElementById('channel-submit-btn').textContent = 'Add Channel 🚀';
                cancelChBtn.style.display = 'none';
            });
        }
    }

    const videoForm = document.getElementById('admin-video-form');
    if (videoForm) {
        videoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(videoForm);
            try {
                const res = await fetch('/api/admin/media-videos', {
                    method: 'POST',
                    body: formData
                });
                const result = await res.json();
                if (res.ok) {
                    window.showToast(result.message || 'Video saved!');
                    videoForm.reset();
                    document.getElementById('video-id').value = '';
                    document.getElementById('video-submit-btn').textContent = 'Add Video Highlight 🎬';
                    document.getElementById('video-cancel-btn').style.display = 'none';
                    fetchMediaChannelsAdmin();
                } else {
                    window.showToast(result.error || 'Failed to save video', 'error');
                }
            } catch(err) {
                window.showToast('Network error saving video', 'error');
            }
        });

        const cancelVidBtn = document.getElementById('video-cancel-btn');
        if (cancelVidBtn) {
            cancelVidBtn.addEventListener('click', () => {
                videoForm.reset();
                document.getElementById('video-id').value = '';
                document.getElementById('video-submit-btn').textContent = 'Add Video Highlight 🎬';
                cancelVidBtn.style.display = 'none';
            });
        }
    }

    // Call on load
    fetchMediaChannelsAdmin();
});
