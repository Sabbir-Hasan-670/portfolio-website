// =======================================================
// 03 — TECHNOLOGY ECOSYSTEM: PLANETARY CONSTELLATION & RADAR
// =======================================================
(() => {
    const ecosystem = document.getElementById('technology-ecosystem');
    if (!ecosystem) return;

    const innerContainer = document.getElementById('orbit-satellites-inner');
    const middleContainer = document.getElementById('orbit-satellites-middle');
    const outerContainer = document.getElementById('orbit-satellites-outer');
    if (!innerContainer || !middleContainer || !outerContainer) return;

    const CURATED_TECH_CONSTELLATION = [
        // --- INNER ORBIT (6 core foundation pillars - 60° spacing) ---
        {
            name: 'Linux / Ubuntu',
            category: 'systems',
            glyph: '⚙',
            tag: 'SYS',
            domain: 'Server & Kernel Administration',
            metric: 'Debian / Ubuntu Bare-Metal & KVM Infrastructure',
            ring: 'inner',
            angle: 0
        },
        {
            name: 'Cisco IOS-XE',
            category: 'network',
            glyph: '▲',
            tag: 'NET',
            domain: 'Enterprise Routing & Switching',
            metric: 'L2/L3 Architecture, VLAN Trunking & ACL Hardening',
            ring: 'inner',
            angle: 60
        },
        {
            name: 'Node.js',
            category: 'backend',
            glyph: '⚡',
            tag: 'DEV',
            domain: 'Asynchronous Event-Driven Engine',
            metric: 'High-Concurrency Microservices & WebSockets',
            ring: 'inner',
            angle: 120
        },
        {
            name: 'Python',
            category: 'backend',
            glyph: '⚡',
            tag: 'DEV',
            domain: 'Systems Automation & Tooling',
            metric: 'Custom MCP Protocols, AI Tools & Network Scripts',
            ring: 'inner',
            angle: 180
        },
        {
            name: 'Docker',
            category: 'systems',
            glyph: '⚙',
            tag: 'SYS',
            domain: 'Containerization & Compose',
            metric: 'Multi-Service Orchestration & CI/CD Pipelines',
            ring: 'inner',
            angle: 240
        },
        {
            name: 'Zero-Trust',
            category: 'security',
            glyph: '🔒',
            tag: 'SEC',
            domain: 'Identity & Access Control',
            metric: 'Least-Privilege Network Access (ZTNA) Architecture',
            ring: 'inner',
            angle: 300
        },

        // --- MIDDLE ORBIT (9 distributed systems & services - 40° spacing) ---
        {
            name: 'BGP / OSPF',
            category: 'network',
            glyph: '▲',
            tag: 'NET',
            domain: 'Dynamic Routing Protocols',
            metric: 'Autonomous Systems (AS) & Resilient Path Peering',
            ring: 'middle',
            angle: 10
        },
        {
            name: 'WireGuard VPN',
            category: 'network',
            glyph: '▲',
            tag: 'NET',
            domain: 'High-Performance Encrypted Mesh',
            metric: 'Modern Cryptographic Tunnels with Zero Overhead',
            ring: 'middle',
            angle: 50
        },
        {
            name: 'MySQL',
            category: 'backend',
            glyph: '⚡',
            tag: 'DATA',
            domain: 'Relational Database Engine',
            metric: 'ACID Transactions, Relational Integrity & Indexing',
            ring: 'middle',
            angle: 90
        },
        {
            name: 'Redis',
            category: 'backend',
            glyph: '⚡',
            tag: 'DATA',
            domain: 'In-Memory Cache & Broker',
            metric: 'Sub-Millisecond Key-Value Store & Rate Limiting',
            ring: 'middle',
            angle: 130
        },
        {
            name: 'Express.js',
            category: 'backend',
            glyph: '⚡',
            tag: 'DEV',
            domain: 'Production Web Framework',
            metric: 'Middleware Pipelines, REST APIs & Auth Guards',
            ring: 'middle',
            angle: 170
        },
        {
            name: 'Custom MCP',
            category: 'systems',
            glyph: '⚙',
            tag: 'SYS',
            domain: 'Model Context Protocol',
            metric: 'Production MCP Server with Persistent Memory',
            ring: 'middle',
            angle: 210
        },
        {
            name: 'Nginx',
            category: 'systems',
            glyph: '⚙',
            tag: 'SYS',
            domain: 'Reverse Proxy & TLS Engine',
            metric: 'HTTP/2 Gateway, Rate-Limiting & SSL Termination',
            ring: 'middle',
            angle: 250
        },
        {
            name: 'SSH Hardening',
            category: 'security',
            glyph: '🔒',
            tag: 'SEC',
            domain: 'Host Defense & Key Management',
            metric: 'Ed25519 Keys, Fail2ban & Automated Port Defense',
            ring: 'middle',
            angle: 290
        },
        {
            name: 'JavaScript (ES6+)',
            category: 'frontend',
            glyph: '⬡',
            tag: 'UI',
            domain: 'Modern Browser Engineering',
            metric: 'Asynchronous Event Loop & Vanilla Architecture',
            ring: 'middle',
            angle: 330
        },

        // --- OUTER ORBIT (9 client, protocol & edge nodes - 40° spacing offset by 20°) ---
        {
            name: 'Next.js / React',
            category: 'frontend',
            glyph: '⬡',
            tag: 'UI',
            domain: 'Client & SSR Framework',
            metric: 'Server Component Hydration & Dynamic Web Apps',
            ring: 'outer',
            angle: 30
        },
        {
            name: 'CSS3 & Motion',
            category: 'frontend',
            glyph: '⬡',
            tag: 'UI',
            domain: 'Fluid Glassmorphism & UI Physics',
            metric: 'GPU-Accelerated Keyframes & Responsive Grids',
            ring: 'outer',
            angle: 70
        },
        {
            name: 'HTML5 & Canvas',
            category: 'frontend',
            glyph: '⬡',
            tag: 'UI',
            domain: 'Semantic Structure & Graphics',
            metric: 'Accessible DOM Architecture & Visual Particle Loops',
            ring: 'outer',
            angle: 110
        },
        {
            name: 'EJS Templates',
            category: 'frontend',
            glyph: '⬡',
            tag: 'UI',
            domain: 'Server-Side View Templating',
            metric: 'Dynamic SSR Views & Reusable Partial Components',
            ring: 'outer',
            angle: 150
        },
        {
            name: 'RESTful APIs',
            category: 'backend',
            glyph: '⚡',
            tag: 'DEV',
            domain: 'Microservice Interface Architecture',
            metric: 'Stateless JSON Interfaces & Webhook Pipelines',
            ring: 'outer',
            angle: 190
        },
        {
            name: 'Bash / Shell',
            category: 'systems',
            glyph: '⚙',
            tag: 'SYS',
            domain: 'Automated POSIX Scripting',
            metric: 'Cron Automation, Server Health & Diagnostics',
            ring: 'outer',
            angle: 230
        },
        {
            name: 'VLAN 802.1Q',
            category: 'network',
            glyph: '▲',
            tag: 'NET',
            domain: 'Virtual LAN Segmentation',
            metric: 'Traffic Isolation, Inter-VLAN Routing & Trunking',
            ring: 'outer',
            angle: 270
        },
        {
            name: 'Wireshark',
            category: 'network',
            glyph: '▲',
            tag: 'NET',
            domain: 'Deep Packet Inspection',
            metric: 'Packet Telemetry, TCP/IP Debugging & Forensics',
            ring: 'outer',
            angle: 310
        },
        {
            name: 'OWASP & WAF',
            category: 'security',
            glyph: '🔒',
            tag: 'SEC',
            domain: 'Web Application Defense Shield',
            metric: 'XSS, SQLi Mitigation & Perimeter Firewalls',
            ring: 'outer',
            angle: 350
        }
    ];

    const containers = {
        inner: innerContainer,
        middle: middleContainer,
        outer: outerContainer
    };

    function cleanTech(str) {
        if (!str) return '';
        return String(str).replace(/\s*\d+(\.\d+)?%/g, '').replace(/^[•\-\*\s]+/, '').trim();
    }

    const render = (verifiedTechs = new Set()) => {
        innerContainer.replaceChildren();
        middleContainer.replaceChildren();
        outerContainer.replaceChildren();

        const counts = { all: CURATED_TECH_CONSTELLATION.length, network: 0, systems: 0, backend: 0, frontend: 0, security: 0 };

        CURATED_TECH_CONSTELLATION.forEach(item => {
            if (counts[item.category] !== undefined) counts[item.category]++;

            const inProject = Array.from(verifiedTechs).some(p => {
                const lowerItem = item.name.toLowerCase();
                return lowerItem.includes(p) || p.includes(lowerItem.split(' ')[0]);
            });

            const slot = document.createElement('div');
            slot.className = 'satellite-slot';
            slot.style.setProperty('--angle', `${item.angle}deg`);

            const carrier = document.createElement('div');
            carrier.className = 'satellite-carrier';

            const rotator = document.createElement('div');
            rotator.className = 'satellite-rotator';

            const node = document.createElement('div');
            node.className = 'technology-node';
            node.dataset.category = item.category;
            node.dataset.name = item.name;
            if (inProject) node.dataset.inProject = 'true';
            node.setAttribute('role', 'button');
            node.setAttribute('tabindex', '0');
            node.setAttribute('aria-label', `${item.name} (${item.category}): ${item.domain}`);

            node.innerHTML = `
                <span class="node-glyph" aria-hidden="true">${item.glyph}</span>
                <span class="node-label">${item.name}</span>
                <span class="node-tag">${item.tag}</span>
            `;

            // Telemetry updates
            const focusTech = document.getElementById('hud-focus-tech');
            const focusDomain = document.getElementById('hud-focus-domain');
            const focusMetric = document.getElementById('hud-focus-metric');

            const onEnter = () => {
                if (focusTech) focusTech.innerHTML = `<b>[${item.name}]</b> ${inProject ? '• VERIFIED IN PROJECT' : ''}`;
                if (focusDomain) focusDomain.textContent = item.domain;
                if (focusMetric) focusMetric.textContent = item.metric;
                node.classList.add('is-active');
            };

            const onLeave = () => {
                if (focusTech) focusTech.textContent = 'SYSTEM ORBIT ACTIVE';
                if (focusDomain) focusDomain.textContent = 'Autonomous Cosmic Constellation';
                if (focusMetric) focusMetric.textContent = '24 Synchronized Nodes // 0 Packet Loss';
                node.classList.remove('is-active');
            };

            node.addEventListener('pointerenter', onEnter);
            node.addEventListener('pointerleave', onLeave);
            node.addEventListener('focus', onEnter);
            node.addEventListener('blur', onLeave);

            rotator.appendChild(node);
            carrier.appendChild(rotator);
            slot.appendChild(carrier);

            const targetRing = containers[item.ring] || outerContainer;
            targetRing.appendChild(slot);
        });

        // Update counts
        const countMap = {
            'tech-count-all': counts.all,
            'tech-count-net': counts.network,
            'tech-count-sys': counts.systems,
            'tech-count-back': counts.backend,
            'tech-count-front': counts.frontend,
            'tech-count-sec': counts.security
        };
        Object.entries(countMap).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        });
    };

    // Render immediate constellation
    render();

    // Wire filter buttons
    const filterBtns = document.querySelectorAll('.tech-filter-btn');
    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            const allNodes = ecosystem.querySelectorAll('.technology-node');
            const statusBadge = document.getElementById('tech-telemetry-status');

            if (filter === 'all') {
                allNodes.forEach(n => {
                    n.classList.remove('tech-node-dimmed', 'tech-node-highlighted');
                });
                if (statusBadge) statusBadge.textContent = 'CORE GRAVITATIONAL SYNCHRONIZED';
            } else {
                allNodes.forEach(n => {
                    if (n.dataset.category === filter) {
                        n.classList.remove('tech-node-dimmed');
                        n.classList.add('tech-node-highlighted');
                    } else {
                        n.classList.add('tech-node-dimmed');
                        n.classList.remove('tech-node-highlighted');
                    }
                });
                if (statusBadge) statusBadge.textContent = `${filter.toUpperCase()} SUBSYSTEM ACTIVE`;
            }
        };
    });

    // Wire Orbit Pause/Play Toggle
    const toggleBtn = document.getElementById('tech-orbit-toggle');
    if (toggleBtn) {
        toggleBtn.onclick = () => {
            const isPaused = ecosystem.classList.toggle('orbit-paused');
            const iconPause = toggleBtn.querySelector('.icon-pause');
            const iconPlay = toggleBtn.querySelector('.icon-play');
            const label = document.getElementById('tech-toggle-label');

            if (iconPause && iconPlay) {
                iconPause.style.display = isPaused ? 'none' : 'block';
                iconPlay.style.display = isPaused ? 'block' : 'none';
            }
            if (label) {
                label.textContent = isPaused ? 'Resume Orbit' : 'Pause Orbit';
            }
            const statusBadge = document.getElementById('tech-telemetry-status');
            if (statusBadge) {
                statusBadge.textContent = isPaused ? 'ORBIT PAUSED // TELEMETRY FROZEN' : 'CORE GRAVITATIONAL SYNCHRONIZED';
            }
        };
    }

    // Core pulse interaction
    const coreEl = document.getElementById('ecosystem-core');
    if (coreEl) {
        coreEl.onclick = () => {
            const allBtn = document.querySelector('.tech-filter-btn[data-filter="all"]');
            if (allBtn) allBtn.click();
            const statusBadge = document.getElementById('tech-telemetry-status');
            if (statusBadge) {
                statusBadge.textContent = 'SYSTEM CORE // 100% OPERATIONAL';
            }
        };
    }

    // Fetch verified project stacks in background
    fetch('/api/projects?featured=1')
        .then(r => r.json())
        .then(projects => {
            if (!Array.isArray(projects)) return;
            const verified = new Set();
            projects.forEach(p => {
                const raw = String(p.languages || p.technologies || '');
                if (raw.includes('<') && raw.includes('>')) {
                    const temp = document.createElement('div');
                    temp.innerHTML = raw;
                    temp.querySelectorAll('span, b, a').forEach(el => {
                        const name = cleanTech(el.textContent).toLowerCase();
                        if (name && name !== 'batchfile' && !/^\d+$/.test(name)) verified.add(name);
                    });
                } else {
                    raw.split(/[\n,|•]/).forEach(item => {
                        const name = cleanTech(item).toLowerCase();
                        if (name && name !== 'batchfile' && !/^\d+$/.test(name)) verified.add(name);
                    });
                }
            });
            render(verified);
        })
        .catch(() => {});
})();
