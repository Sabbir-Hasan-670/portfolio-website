const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../public/admin/dashboard/dashboard.css');
let css = fs.readFileSync(cssPath, 'utf8');

const analyticsCss = `
/* ================================================= */
/* 🎯 TRACKING & ANALYTICS STYLES                    */
/* ================================================= */

/* Toggle Switch */
.tracking-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
}

.tracking-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.tracking-switch .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #334155;
    transition: 0.3s;
    border-radius: 24px;
}

.tracking-switch .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
}

.tracking-switch input:checked + .slider {
    background-color: #10b981;
}

.tracking-switch input:checked + .slider:before {
    transform: translateX(20px);
}

/* Checklist Items */
.checklist-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.8rem;
    color: #94a3b8;
}

.checklist-item.active {
    color: #f8fafc;
    border-color: rgba(16, 185, 129, 0.3);
    background: rgba(16, 185, 129, 0.08);
}

/* ================================================= */
/* 📈 BLOG ANALYTICS DASHBOARD STYLES               */
/* ================================================= */

/* Period Pills */
.analytics-period-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    padding: 5px 12px;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.analytics-period-btn:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
}

.analytics-period-btn.active {
    background: #38bdf8;
    color: #0f172a;
    font-weight: 700;
}

/* Metric Cards */
.analytics-metric-card {
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
}

.metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.metric-label {
    font-size: 0.76rem;
    font-weight: 700;
    color: #94a3b8;
    letter-spacing: 0.5px;
}

.metric-value {
    font-size: 2.1rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 4px;
}

.metric-subtext {
    font-size: 0.74rem;
    color: #64748b;
}

.metric-badge {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
}

.metric-badge.positive {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.metric-badge.negative {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.metric-badge.neutral {
    background: rgba(148, 163, 184, 0.15);
    color: #94a3b8;
    border: 1px solid rgba(148, 163, 184, 0.3);
}

/* Analytics Table */
.analytics-table tbody tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    cursor: pointer;
    transition: background 0.15s ease;
}

.analytics-table tbody tr:hover {
    background: rgba(56, 189, 248, 0.06);
}

.analytics-table td {
    padding: 12px;
}

.perf-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
}

.perf-badge.top {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
    border: 1px solid #10b981;
}

.perf-badge.low {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
    border: 1px solid #f59e0b;
}

.perf-badge.normal {
    background: rgba(148, 163, 184, 0.1);
    color: #94a3b8;
}

/* Progress Bars */
.analytics-progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 4px;
}

.analytics-progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.6s ease;
}

/* ================================================= */
/* ⚡ STICKY BULK ACTION BAR                         */
/* ================================================= */
.blog-bulk-bar {
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(56, 189, 248, 0.35);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border-radius: 12px;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    z-index: 999;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translate(-50%, 20px);
    }
    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}

.bulk-action-btn {
    border: none;
    padding: 7px 14px;
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.bulk-trash-btn {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid #ef4444;
}

.bulk-trash-btn:hover {
    background: #ef4444;
    color: #ffffff;
}

.bulk-pub-btn {
    background: #10b981;
    color: #ffffff;
}

.bulk-pub-btn:hover {
    background: #059669;
}

.bulk-draft-btn {
    background: #475569;
    color: #ffffff;
}

.bulk-draft-btn:hover {
    background: #334155;
}

.bulk-restore-btn {
    background: #10b981;
    color: #ffffff;
}

.bulk-restore-btn:hover {
    background: #059669;
}

.bulk-delete-btn {
    background: #dc2626;
    color: #ffffff;
}

.bulk-delete-btn:hover {
    background: #b91c1c;
}

.bulk-cancel-btn {
    background: transparent;
    color: #94a3b8;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.bulk-cancel-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
}

/* Light Theme overrides for new components */
body.light-theme .tracking-switch .slider {
    background-color: #cbd5e1;
}

body.light-theme .checklist-item {
    background: #f1f5f9;
    color: #475569;
    border-color: #e2e8f0;
}

body.light-theme .analytics-metric-card,
body.light-theme #tab-tracking .dash-card,
body.light-theme #tab-blog-analytics .dash-card {
    background: #ffffff;
    border-color: #e2e8f0;
}

body.light-theme .blog-bulk-bar {
    background: rgba(255, 255, 255, 0.95);
    color: #1e293b;
    border-color: #cbd5e1;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
`;

if (!css.includes('TRACKING & ANALYTICS STYLES')) {
    css += '\n' + analyticsCss;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log("✅ Appended tracking & analytics styles to dashboard.css");
} else {
    console.log("ℹ️ Tracking & analytics styles already present in dashboard.css");
}

