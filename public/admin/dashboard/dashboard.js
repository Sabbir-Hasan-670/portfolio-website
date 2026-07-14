
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
            const res = await fetch('/api/experience');
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
            const res = await fetch('/api/projects');
            const data = await res.json();
            window.cachedProjects = data.filter(p => !String(p.id).startsWith('gh-'));
            window.allProjectsData = data; // Keep all for rendering
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
                    <button class="action-btn" style="padding: 4px 12px; font-size: 0.8rem; background: ${linkBtnColor};" onclick="setGithubLiveUrl('${proj.id}', '${proj.live_url || ''}')">${linkBtnText}</button>`}
                    
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
            const res = await fetch('/api/education');
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
            const res = await fetch('/api/certificates');
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
            <div class="input-group"><input type="text" id="uni-role" value="${exp.role || ''}" required><label style="top:-20px; font-size:0.8rem; color:#38bdf8;">Role</label></div>
            <div class="input-group"><input type="text" id="uni-company" value="${exp.company_or_project || ''}" required><label style="top:-20px; font-size:0.8rem; color:#38bdf8;">Company / Project</label></div>
            <div class="input-group"><input type="text" id="uni-duration" value="${exp.duration || ''}"><label style="top:-20px; font-size:0.8rem; color:#38bdf8;">Duration</label></div>
            <div class="input-group"><textarea id="uni-desc" rows="4" placeholder="Responsibilities...">${exp.description || ''}</textarea></div>
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
            <div class="input-group"><input type="text" id="uni-title" value="${proj.title || ''}" required><label style="top:-20px; font-size:0.8rem; color:#38bdf8;">Project Title</label></div>
            <div class="input-group"><input type="text" id="uni-github" value="${proj.github_url || ''}"><label style="top:-20px; font-size:0.8rem; color:#38bdf8;">GitHub URL</label></div>
            <div class="input-group"><input type="text" id="uni-live" value="${proj.live_url || ''}"><label style="top:-20px; font-size:0.8rem; color:#38bdf8;">Live Link</label></div>
            <div class="input-group"><textarea id="uni-desc" rows="4" placeholder="Project Description...">${proj.description || ''}</textarea></div>
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
            <div class="input-group"><input type="text" id="uni-degree" value="${edu.degree || ''}" required><label style="top:-20px; font-size:0.8rem; color:#38bdf8;">Degree / Title</label></div>
            <div class="input-group"><input type="text" id="uni-institution" value="${edu.institution || ''}" required><label style="top:-20px; font-size:0.8rem; color:#38bdf8;">Institution</label></div>
            <div class="input-group"><input type="text" id="uni-duration" value="${edu.duration || ''}"><label style="top:-20px; font-size:0.8rem; color:#38bdf8;">Duration / Years</label></div>
            <div class="input-group"><textarea id="uni-desc" rows="3" placeholder="Additional Details...">${edu.description || ''}</textarea></div>
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
            <div class="input-group"><input type="text" id="uni-title" value="${cert.title || ''}" required><label style="top:-20px; font-size:0.8rem; color:#38bdf8;">Certification Title</label></div>
            <div class="input-group"><input type="text" id="uni-issuer" value="${cert.issuer || ''}" required><label style="top:-20px; font-size:0.8rem; color:#38bdf8;">Issuing Organization</label></div>
            <div class="input-group"><input type="url" id="uni-link" value="${cert.link || ''}"><label style="top:-20px; font-size:0.8rem; color:#38bdf8;">Verification URL</label></div>
        `;
        uniModal.classList.remove('hidden');
    };

    uniForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('universal-item-id').value;
        const type = document.getElementById('universal-item-type').value;

        let url = `/api/admin/${type}/${id}`;
        let options = { method: 'PUT' };
        let callback;

        if (type === 'experience') {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify({
                role: document.getElementById('uni-role').value,
                company_or_project: document.getElementById('uni-company').value,
                duration: document.getElementById('uni-duration').value,
                description: document.getElementById('uni-desc').value
            });
            callback = fetchExperience;
        } 
        else if (type === 'project') {
            const formData = new FormData();
            formData.append('title', document.getElementById('uni-title').value);
            formData.append('github_url', document.getElementById('uni-github').value);
            formData.append('live_url', document.getElementById('uni-live').value);
            formData.append('description', document.getElementById('uni-desc').value);
            options.body = formData;
            callback = fetchProjects;
        } 
        else if (type === 'education') {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify({
                degree: document.getElementById('uni-degree').value,
                institution: document.getElementById('uni-institution').value,
                duration: document.getElementById('uni-duration').value,
                description: document.getElementById('uni-desc').value
            });
            callback = fetchEducation;
        } 
        else if (type === 'certificate') {
            const formData = new FormData();
            formData.append('title', document.getElementById('uni-title').value);
            formData.append('issuer', document.getElementById('uni-issuer').value);
            formData.append('link', document.getElementById('uni-link').value);
            options.body = formData;
            callback = fetchCertificates;
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
                uniModal.classList.add('hidden');
                alert(data.message || 'Updated successfully! 🎉');
                if (callback) callback();
            } else { alert('Error: ' + data.error); }
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
            }
        } catch (e) { console.error("Failed to fetch profile"); }
    }
    window.fetchSocialLinks = fetchSocialLinks;

    // Call all fetch functions on load
    fetchExperience(); 
    fetchProjects(); 
    fetchEducation(); 
    fetchCertificates(); 
    fetchInbox();
    fetchSocialLinks(); 

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
            if (response.ok) { alert(data.message); if(callback) callback(); }
            else { alert('Error: ' + data.error); }
        } catch (e) { window.showToast('An error occurred.', 'error'); }
    }

    // Submit Project
    document.getElementById('project-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!croppedBlob || currentUploadType !== 'project') return alert("Please crop an image first!");
        const formData = new FormData();
        formData.append('title', document.getElementById('proj-title').value);
        formData.append('description', document.getElementById('proj-desc').value);
        formData.append('github_url', document.getElementById('proj-github').value);
        formData.append('live_url', document.getElementById('proj-live').value);
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
        submitForm('/api/admin/upload-pic', { method: 'POST', body: formData }, e.target, () => {
            e.target.reset();
            croppedBlob = null;
        });
    });

    // Submit Social Links
    document.getElementById('socials-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
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
        const payload = {
            role: document.getElementById('role').value,
            company_or_project: document.getElementById('company').value,
            duration: document.getElementById('duration').value,
            description: document.getElementById('desc').value
        };
        submitForm('/api/admin/experience', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }, e.target, () => {
            e.target.reset(); fetchExperience();
        });
    });

    // Submit Education
    document.getElementById('admin-education-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = {
            degree: document.getElementById('edu-degree').value,
            institution: document.getElementById('edu-institution').value,
            duration: document.getElementById('edu-duration').value,
            description: document.getElementById('edu-description').value
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
        const fileInput = document.getElementById('cert-image');
        if (fileInput.files.length === 0) return alert("Please select a certificate image/badge.");
        
        const formData = new FormData();
        formData.append('title', document.getElementById('cert-title').value);
        formData.append('issuer', document.getElementById('cert-issuer').value);
        formData.append('link', document.getElementById('cert-link').value);
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
            const res = await fetch('/api/blog'); 
            const data = await res.json();
            const list = document.getElementById('blog-list'); 
            if (!list) return;
            list.innerHTML = data.length ? '' : '<p>No articles published yet.</p>';
            window.cachedBlogs = data; 
            window.currentBlogLimit = 10;
            renderAdminBlogs();
        } catch (e) { console.log(e); }
    }
    
    window.renderAdminBlogs = () => {
        const list = document.getElementById('blog-list');
        if (!list || !window.cachedBlogs) return;
        list.innerHTML = '';
        const toShow = window.cachedBlogs.slice(0, window.currentBlogLimit);
        
        toShow.forEach(blog => {
            list.innerHTML += `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 8px; background: rgba(255,255,255,0.02); border-radius: 6px;">
                    <span><strong>${blog.title}</strong> <span style="color:#6366f1;">(${blog.category || 'General'})</span></span>
                    <div style="display: flex; gap: 8px;">
                        <button class="action-btn" style="padding: 4px 12px; font-size: 0.8rem; background: #38bdf8;" onclick="openEditBlogModal(${blog.id})">Edit</button>
                        <button class="delete-btn" style="padding: 4px 12px; font-size: 0.8rem;" onclick="deleteItem('/api/admin/blog', ${blog.id}, window.fetchAdminBlogs)">Delete</button>
                    </div>
                </li>`;
        });

        if (window.cachedBlogs.length > window.currentBlogLimit) {
            list.innerHTML += `
                <li style="display: flex; justify-content: center; margin-top: 15px;">
                    <button class="action-btn" style="padding: 6px 15px; font-size: 0.85rem;" onclick="window.currentBlogLimit += 10; window.renderAdminBlogs();">Show More</button>
                </li>
            `;
        }
    };
    window.fetchAdminBlogs = fetchAdminBlogs;
    fetchAdminBlogs();

    document.getElementById('blog-form')?.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const formData = new FormData();
        formData.append('title', document.getElementById('blog-title').value); 
        formData.append('category', document.getElementById('blog-category').value);
        formData.append('content', document.getElementById('blog-content').value); 
        formData.append('custom_slug', document.getElementById('blog-slug').value);
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
        editBlogModal.classList.remove('hidden');
    }
    document.getElementById('edit-blog-cancel')?.addEventListener('click', () => editBlogModal.classList.add('hidden'));

    document.getElementById('edit-blog-form')?.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const id = document.getElementById('edit-blog-id').value;
        const formData = new FormData();
        formData.append('title', document.getElementById('edit-blog-title').value); 
        formData.append('custom_slug', document.getElementById('edit-blog-slug').value);
        formData.append('category', document.getElementById('edit-blog-category').value); 
        formData.append('content', document.getElementById('edit-blog-content').value);
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
        document.getElementById('link-modal-url').value = currentUrl && currentUrl !== 'undefined' ? currentUrl : '';
        document.getElementById('link-modal').classList.remove('hidden');
    };

    window.submitGithubLiveUrl = async () => {
        const repoId = document.getElementById('link-modal-repo-id').value;
        const url = document.getElementById('link-modal-url').value.trim();
        
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

