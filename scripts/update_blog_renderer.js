const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../blogRenderer.js');
let code = fs.readFileSync(filePath, 'utf8');

const beaconScript = `    <!-- Built-in First-Party Blog Engagement & Analytics Beacon -->
    <script>
    (function() {
        var blogId = \${parseInt(post.id, 10) || 0};
        if (!blogId) return;

        var startTime = Date.now();
        var maxScroll = 0;
        var fired75 = false;
        var isDnt = (navigator.doNotTrack === '1' || window.doNotTrack === '1');

        function calculateScroll() {
            var doc = document.documentElement;
            var total = doc.scrollHeight - window.innerHeight;
            if (total > 0) {
                var pct = Math.round((window.scrollY / total) * 100);
                if (pct > maxScroll) maxScroll = Math.min(pct, 100);
                if (maxScroll >= 75 && !fired75) {
                    fired75 = true;
                    if (window.pushTrackingEvent) {
                        window.pushTrackingEvent('blog_read_75', {
                            event_category: 'engagement',
                            event_label: '\${escapeHtml(post.title || "").replace(/\'/g, "\\\\\'")}',
                            blog_id: blogId
                        });
                    }
                }
            }
        }

        window.addEventListener('scroll', calculateScroll, { passive: true });

        // Initial view beacon
        try {
            fetch('/api/track/blog-view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blogId: blogId,
                    referrer: document.referrer || '',
                    isDnt: isDnt
                }),
                keepalive: true
            }).catch(function() {});
        } catch(e) {}

        // Leave beacon capturing reading duration and maximum scroll depth
        function sendLeaveBeacon() {
            var duration = Math.round((Date.now() - startTime) / 1000);
            calculateScroll();
            var payload = JSON.stringify({
                blogId: blogId,
                duration: duration,
                scrollDepth: maxScroll,
                isLeave: true,
                isDnt: isDnt
            });
            if (navigator.sendBeacon) {
                var blob = new Blob([payload], { type: 'application/json' });
                navigator.sendBeacon('/api/track/blog-view', blob);
            } else {
                fetch('/api/track/blog-view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload,
                    keepalive: true
                }).catch(function() {});
            }
        }

        window.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') {
                sendLeaveBeacon();
            }
        });
        window.addEventListener('pagehide', sendLeaveBeacon);
    })();
    </script>
`;

if (!code.includes('Built-in First-Party Blog Engagement & Analytics Beacon')) {
    if (code.includes('</body>\r\n</html>')) {
        code = code.replace('</body>\r\n</html>', beaconScript + '</body>\r\n</html>');
    } else if (code.includes('</body>\n</html>')) {
        code = code.replace('</body>\n</html>', beaconScript + '</body>\n</html>');
    } else {
        console.error('Closing tags </body></html> not found');
        process.exit(1);
    }
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('✅ Injected first-party beacon script into blogRenderer.js');
} else {
    console.log('ℹ️ Beacon script already present in blogRenderer.js');
}

