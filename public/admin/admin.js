document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById('admin-username').value;
            const passwordInput = document.getElementById('admin-password').value;
            const totpInput = document.getElementById('admin-totp') ? document.getElementById('admin-totp').value : '';
            
            const msgElement = document.getElementById('login-msg');
            const btn = document.querySelector('.login-btn');
            const card = document.querySelector('.login-card');
            
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = 'Authenticating...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';
            msgElement.classList.remove('show');

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        username: usernameInput, 
                        password: passwordInput,
                        totp_token: totpInput
                    })
                });

                const result = await response.json();
                msgElement.classList.add('show');

                if (result.require_2fa) {
                    msgElement.textContent = result.message;
                    msgElement.style.color = "#38bdf8"; // Info Blue
                    document.getElementById('password-group').style.display = 'none';
                    document.getElementById('totp-group').style.display = 'block';
                    document.getElementById('admin-totp').focus();
                    
                    btn.innerHTML = 'Verify 2FA';
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                    return;
                }

                if (response.ok) {
                    msgElement.textContent = "Access Granted. Initializing Dashboard...";
                    msgElement.style.color = "#4ade80"; 
                    
                    btn.innerHTML = 'Unlocked ✔️';
                    btn.style.background = '#4ade80';
                    btn.style.borderColor = '#4ade80';
                    btn.style.color = '#0f172a';
                    
                    setTimeout(() => {
                        window.location.href = '/admin/dashboard/dashboard';
                    }, 1500);

                } else {
                    msgElement.textContent = result.error || "Authentication Failed.";
                    msgElement.style.color = "#f87171"; 
                    
                    btn.innerHTML = originalBtnText;
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                    
                    card.style.animation = 'shake 0.4s';
                    
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 400);
                }
            } catch (error) {
                msgElement.textContent = "Server connection lost.";
                msgElement.style.color = "#f87171";
                msgElement.classList.add('show');
                
                btn.innerHTML = originalBtnText;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }
        });
    }

// ==========================================
// ADMIN EDUCATION MANAGEMENT
// ==========================================
const eduForm = document.getElementById('admin-education-form');
const eduList = document.getElementById('admin-education-list');

async function loadAdminEducation() {
    if (!eduList) return;
    const res = await fetch('/api/education');
    const data = await res.json();
    eduList.innerHTML = '';
    data.forEach(edu => {
        eduList.innerHTML += `
            <div class="modern-card" style="padding: 1.5rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4>${edu.degree}</h4>
                    <p style="margin: 0; color: #7f8c8d;">${edu.institution} | ${edu.duration}</p>
                </div>
                <button onclick="deleteEducation(${edu.id})" class="card-btn btn-secondary" style="background:#e74c3c; color:white; max-width:80px;">Delete</button>
            </div>
        `;
    });
}

if (eduForm) {
    eduForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            degree: document.getElementById('edu-degree').value,
            institution: document.getElementById('edu-institution').value,
            duration: document.getElementById('edu-duration').value,
            description: document.getElementById('edu-description').value
        };

        const res = await fetch('/api/admin/education', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            eduForm.reset();
            loadAdminEducation();
        }
    });
}

window.deleteEducation = async (id) => {
    const confirmed = await window.customConfirm('Delete this entry?');
    if (confirmed) {
        await fetch(`/api/admin/education/${id}`, { method: 'DELETE' });
        loadAdminEducation();
    }
};

// ==========================================
// ADMIN CERTIFICATES MANAGEMENT
// ==========================================
const certForm = document.getElementById('admin-certificates-form');
const certList = document.getElementById('admin-certificates-list');

async function loadAdminCertificates() {
    if (!certList) return;
    const res = await fetch('/api/certificates');
    const data = await res.json();
    certList.innerHTML = '';
    data.forEach(cert => {
        certList.innerHTML += `
            <div class="modern-card" style="padding: 1rem; text-align: center;">
                <img src="${cert.image_path}" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 0.5rem;">
                <h4>${cert.title}</h4>
                <p style="color: #7f8c8d; font-size: 0.9rem;">${cert.issuer}</p>
                <button onclick="deleteCertificate(${cert.id})" class="card-btn" style="background:#e74c3c; color:white; width:100%; margin-top:0.5rem;">Delete</button>
            </div>
        `;
    });
}

if (certForm) {
    certForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', document.getElementById('cert-title').value);
        formData.append('issuer', document.getElementById('cert-issuer').value);
        formData.append('link', document.getElementById('cert-link').value);
        formData.append('cert_image', document.getElementById('cert-image').files[0]);

        const res = await fetch('/api/admin/certificates', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            certForm.reset();
            loadAdminCertificates();
        }
    });
}

window.deleteCertificate = async (id) => {
    const confirmed = await window.customConfirm('Delete this certificate?');
    if (confirmed) {
        await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' });
        loadAdminCertificates();
    }
};

loadAdminEducation();
loadAdminCertificates();
});