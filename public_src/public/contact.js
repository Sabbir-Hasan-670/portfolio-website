/**
 * contact.js - Interactive Dispatch Controller for Contact Page
 * Features: Multi-Domain Scope Selector, Async SMTP Dispatch,
 * 1-Click Clipboard Copy, and Dynamic Profile Hydration.
 */

(function () {
    'use strict';

    // DOM Elements
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const feedbackBox = document.getElementById('formFeedback');
    const messageInput = document.getElementById('contact-message');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const mobileMenu = document.getElementById('contactMobileMenu');
    const hamburger = document.getElementById('contactHamburger');
    const scopeChips = document.querySelectorAll('.scope-chip-btn');

    let selectedScope = '';

    // Scope Selector Interaction
    scopeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const scopeVal = chip.getAttribute('data-scope');
            if (chip.classList.contains('selected')) {
                chip.classList.remove('selected');
                selectedScope = '';
            } else {
                scopeChips.forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
                selectedScope = scopeVal;
            }
        });
    });

    // 1-Click Email Copy Handler
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const emailEl = document.getElementById('contact-email-text');
            const email = emailEl ? emailEl.textContent.trim() : 'contact@sabbirhasan.com';
            try {
                await navigator.clipboard.writeText(email);
                const originalText = copyEmailBtn.innerText;
                copyEmailBtn.innerText = 'Copied! ✓';
                copyEmailBtn.style.color = 'var(--ct-lime)';
                if (window.showToast) {
                    window.showToast('Email address copied to clipboard!', 'success');
                }
                setTimeout(() => {
                    copyEmailBtn.innerText = originalText;
                    copyEmailBtn.style.color = '';
                }, 2500);
            } catch (err) {
                // Fallback prompt
                window.prompt('Copy email address:', email);
            }
        });
    }

    // Mobile Hamburger
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    // Form Submission Handler
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Encrypting &amp; Sending...</span> <span class="btn-icon-orb">⏳</span>`;
            }

            if (feedbackBox) {
                feedbackBox.className = 'form-feedback-alert';
                feedbackBox.style.display = 'none';
                feedbackBox.textContent = '';
            }

            // Append Scope to Message if selected
            let finalMessage = messageInput ? messageInput.value.trim() : '';
            if (selectedScope && !finalMessage.startsWith('[Scope:')) {
                finalMessage = `[Scope: ${selectedScope}]\n\n${finalMessage}`;
            }

            const formData = new FormData(form);
            formData.set('message', finalMessage);

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    if (feedbackBox) {
                        feedbackBox.className = 'form-feedback-alert success';
                        feedbackBox.innerHTML = `<span>✓ Message dispatched successfully! Sabbir has received your inquiry and will reply shortly.</span>`;
                        feedbackBox.style.display = 'flex';
                    }
                    if (window.showToast) {
                        window.showToast('Message sent successfully! 🚀', 'success');
                    }
                    form.reset();
                    scopeChips.forEach(c => c.classList.remove('selected'));
                    selectedScope = '';
                } else {
                    const errMsg = data.error || 'Unable to deliver message. Please check all fields.';
                    if (feedbackBox) {
                        feedbackBox.className = 'form-feedback-alert error';
                        feedbackBox.innerHTML = `<span>⚠️ ${errMsg}</span>`;
                        feedbackBox.style.display = 'flex';
                    }
                    if (window.showToast) {
                        window.showToast(errMsg, 'error');
                    }
                }
            } catch (err) {
                console.error('Contact submission error:', err);
                if (feedbackBox) {
                    feedbackBox.className = 'form-feedback-alert error';
                    feedbackBox.innerHTML = `<span>⚠️ Connection failed. Please email contact@sabbirhasan.com directly.</span>`;
                    feedbackBox.style.display = 'flex';
                }
                if (window.showToast) {
                    window.showToast('Network error. Please try again or email directly.', 'error');
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Send Dispatch Message</span> <span class="btn-icon-orb">🚀</span>`;
                }
            }
        });
    }

    // Hydrate Dynamic Profile Data
    async function hydrateContactProfile() {
        try {
            const res = await fetch('/api/profile', { cache: 'no-cache' });
            if (!res.ok) return;
            const data = await res.json();
            if (!data) return;

            // Name
            if (data.name) {
                document.querySelectorAll('[data-name]').forEach(el => el.textContent = data.name);
            }

            // Location
            if (data.contact_location) {
                const locEl = document.getElementById('contact-location-text');
                if (locEl) locEl.textContent = data.contact_location;
            }

            // Email
            if (data.contact_email) {
                const emailEl = document.getElementById('contact-email-text');
                if (emailEl) emailEl.textContent = data.contact_email;
                const emailLink = document.getElementById('contact-email-link');
                if (emailLink) emailLink.href = 'mailto:' + data.contact_email;
            }

            // CV Download Link
            if (data.cv_file_path) {
                document.querySelectorAll('[data-cv]').forEach(el => el.href = data.cv_file_path);
            }

            // Socials
            if (data.github_link) {
                document.querySelectorAll('[data-github]').forEach(el => el.href = data.github_link);
            }
            if (data.linkedin_link) {
                document.querySelectorAll('[data-linkedin]').forEach(el => el.href = data.linkedin_link);
            }
        } catch (e) {
            console.warn('Profile hydration error:', e);
        }
    }

    // DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hydrateContactProfile);
    } else {
        hydrateContactProfile();
    }

})();
