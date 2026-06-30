const fs = require('fs');
let html = fs.readFileSync('public/admin/dashboard/dashboard.html', 'utf8');

// 1. CSS fix
html = html.replace(/<h4 style="margin-top: 15px;">/g, '<h4 style="margin-top: 30px; margin-bottom: 20px;">');

// 6. Reply Modal
const replyModalHTML = \
    <!-- Email Reply Modal -->
    <div id="reply-modal" class="modal hidden">
        <div class="modal-content" style="max-width: 500px;">
            <h3>Reply to Email</h3>
            <form id="reply-form" onsubmit="event.preventDefault(); sendEmailReply();">
                <input type="hidden" id="reply-to-email">
                <div class="input-group">
                    <input type="text" id="reply-subject" autocomplete="off" required value="Reply to your inquiry">
                    <label>Subject</label>
                </div>
                <div class="input-group">
                    <textarea id="reply-message" rows="5" required placeholder="Type your reply here..."></textarea>
                </div>
                <button type="submit" class="action-btn" style="width: 100%;">Send Reply ??</button>
                <button type="button" class="action-btn" style="background:#e74c3c; width: 100%; margin-top: 10px;" onclick="document.getElementById('reply-modal').classList.add('hidden')">Cancel</button>
            </form>
        </div>
    </div>
\;
html = html.replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>', replyModalHTML + '\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>');

// 8. Toast script
html = html.replace('</body>', '<script src="/toast.js"></script></body>');

// 10. Task 10 Hero fields and splitting layout to two columns, and adding contact email.
// I'll do this using a clean regex or replace. Let's do it using multi_replace_file_content afterwards.

fs.writeFileSync('public/admin/dashboard/dashboard.html', html);
console.log("Restored previous edits!");
