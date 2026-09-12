// ============================================================================
// Awwwards-Tier Interactive Cyber Neural Constellation Canvas (Zero-Lag 120fps)
// ============================================================================
(() => {
    const canvas = document.getElementById('heroCanvas');
    const hero = document.getElementById('home');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    let width = 0;
    let height = 0;
    let animId = null;
    let inView = true;

    const mouse = { x: -1000, y: -1000, active: false };

    const resize = () => {
        const rect = hero.getBoundingClientRect();
        width = canvas.width = Math.floor(rect.width);
        height = canvas.height = Math.floor(rect.height);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const PARTICLE_COUNT = window.innerWidth < 768 ? 20 : 40;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * (width || 800),
            y: Math.random() * (height || 600),
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5 + 0.8,
            color: Math.random() > 0.35 ? 'rgba(56, 189, 248, ' : 'rgba(245, 158, 11, ',
            baseAlpha: Math.random() * 0.35 + 0.25
        });
    }

    const onMouseMove = (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    };

    const onMouseLeave = () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
    };

    hero.addEventListener('mousemove', onMouseMove, { passive: true });
    hero.addEventListener('mouseleave', onMouseLeave, { passive: true });

    const maxDist = 115;
    const maxDistSq = maxDist * maxDist;
    const mouseDist = 130;
    const mouseDistSq = mouseDist * mouseDist;

    const render = () => {
        if (!inView) {
            animId = null;
            return;
        }

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) { p.x = 0; p.vx *= -1; }
            else if (p.x > width) { p.x = width; p.vx *= -1; }
            if (p.y < 0) { p.y = 0; p.vy *= -1; }
            else if (p.y > height) { p.y = height; p.vy *= -1; }

            if (mouse.active) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dSq = dx * dx + dy * dy;
                if (dSq < mouseDistSq && dSq > 0) {
                    const d = Math.sqrt(dSq);
                    const force = (mouseDist - d) / mouseDist * 0.6;
                    p.x += (dx / d) * force;
                    p.y += (dy / d) * force;
                }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.baseAlpha + ')';
            ctx.fill();

            for (let j = i + 1; j < PARTICLE_COUNT; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dSq = dx * dx + dy * dy;

                if (dSq < maxDistSq) {
                    const distRatio = 1 - Math.sqrt(dSq) / maxDist;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${(distRatio * 0.16).toFixed(3)})`;
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(render);
    };

    const obs = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !animId) {
            animId = requestAnimationFrame(render);
        }
    }, { threshold: 0.05 });

    obs.observe(hero);
})();

// Zero-Lag 120fps Hardware-Accelerated Spatial Motion for Hero Chassis
(() => {
    const scene = document.getElementById('heroScene');
    const shell = document.getElementById('heroVisualStage') || document.getElementById('portraitShell');
    const hero = document.getElementById('home');

    if (!scene || !shell || !hero) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    let sceneInView = true;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let animId = null;
    let isMoving = false;

    const updateTilt = () => {
        if (!sceneInView || reducedMotion.matches) {
            animId = null;
            return;
        }

        // Smooth spring lerp for physical weighted glass feel
        currentRotX += (targetRotX - currentRotX) * 0.12;
        currentRotY += (targetRotY - currentRotY) * 0.12;

        shell.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translate3d(0, -2px, 0)`;

        const diffX = Math.abs(targetRotX - currentRotX);
        const diffY = Math.abs(targetRotY - currentRotY);

        if (diffX > 0.01 || diffY > 0.01 || isMoving) {
            animId = window.requestAnimationFrame(updateTilt);
        } else {
            animId = null;
            if (!isMoving) {
                shell.style.transform = '';
            }
        }
    };

    const requestTiltLoop = () => {
        if (!animId && sceneInView && !reducedMotion.matches) {
            animId = window.requestAnimationFrame(updateTilt);
        }
    };

    const onPointerMove = (event) => {
        if (reducedMotion.matches || !precisePointer.matches || !sceneInView) return;

        const rect = shell.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        // Subtle, elegant rotation limits (max 4.5 degrees)
        targetRotX = Math.max(-4.5, Math.min(4.5, y * -9));
        targetRotY = Math.max(-4.5, Math.min(4.5, x * 9));
        isMoving = true;

        requestTiltLoop();
    };

    const onPointerLeave = () => {
        targetRotX = 0;
        targetRotY = 0;
        isMoving = false;
        requestTiltLoop();
    };

    const observer = new IntersectionObserver(([entry]) => {
        sceneInView = entry.isIntersecting;
        if (!sceneInView) {
            targetRotX = 0;
            targetRotY = 0;
            isMoving = false;
            shell.style.transform = '';
        }
    }, { threshold: 0.1 });

    observer.observe(hero);

    scene.addEventListener('pointermove', onPointerMove, { passive: true });
    scene.addEventListener('pointerleave', onPointerLeave, { passive: true });

    hero.classList.add('hero-ready');
})();

// Network and Cybersecurity showcase labels remain tied to existing services.
(() => {
    const targets = {
        network: document.getElementById('network-showcase-data'),
        security: document.getElementById('cyber-showcase-data')
    };
    if (!targets.network && !targets.security) return;

    const terms = {
        network: ['network', 'ccna', 'vlan', 'router', 'switch', 'routing', 'subnet', 'server'],
        security: ['security', 'cyber', 'ethical', 'firewall', 'ssl', 'vulnerability', 'defense', 'penetration', 'secure']
    };

    const categoryKeys = { network: ['network', 'server'], security: ['cybersecurity'] };

    const render = (services) => {
        Object.entries(targets).forEach(([domain, target]) => {
            if (!target) return;
            const matches = services.filter(service => {
                const category = String(service.category_key || '').trim().toLowerCase();
                if (categoryKeys[domain].includes(category)) return true;
                const source = `${service.title || ''} ${service.description || ''} ${service.tags || ''}`.toLowerCase();
                return terms[domain].some(term => source.includes(term));
            });
            target.replaceChildren();
            if (!matches.length) {
                const note = document.createElement('p');
                note.textContent = 'Relevant service details will appear when available from the admin system.';
                target.append(note);
                return;
            }
            matches.slice(0, 4).forEach(service => {
                const item = document.createElement('span');
                item.className = 'showcase-service';
                item.textContent = service.title || 'Untitled service';
                target.append(item);
            });
        });
    };

    window.addEventListener('expertise-services-ready', event => {
        if (Array.isArray(event.detail)) render(event.detail);
    });
    if (Array.isArray(window.__expertiseServices)) render(window.__expertiseServices);
})();

// Expertise is a single interactive technical system. Service copy/tags are
// supplied by the existing services API through the event below.
(() => {
    const system = document.getElementById('public-services-grid');
    if (!system || !system.classList.contains('expertise-system')) return;

    const tabs = [...system.querySelectorAll('.expertise-tab')];
    const stage = document.getElementById('expertise-stage');
    const list = document.getElementById('expertise-managed-list');
    const streamCounter = document.getElementById('hud-stream-counter');
    const latencyCounter = document.getElementById('hud-latency-counter');

    const modeMeta = {
        network: ['01 / SYSTEM MAP', 'LIVE TOPOLOGY'],
        security: ['02 / SECURITY MAP', 'VERIFIED PATH'],
        development: ['03 / REQUEST MAP', 'SERVICE CHAIN'],
        design: ['04 / VISUAL MAP', 'DESIGN SYSTEM'],
        marketing: ['05 / GROWTH MAP', 'CAMPAIGN FLOW'],
        database: ['06 / DATA MAP', 'RELATIONAL CORE']
    };

    const domainCapabilities = {
        network: [
            'Cisco CCNA 200-301',
            'BGP / OSPF Dynamic Routing',
            '802.1Q VLAN & Trunking',
            'WireGuard & IPSec VPN Mesh',
            'pfSense Firewall Segmentation',
            'Zero-Packet Loss Telemetry'
        ],
        security: [
            'Zero Trust Network Access (ZTNA)',
            'OWASP Top 10 Hardening',
            'WAF & DDoS Edge Mitigation',
            'Penetration Testing & Auditing',
            'TLS 1.3 & Encrypted SNI',
            'Role-Based Access Control (RBAC)'
        ],
        development: [
            'Vanilla ES6+ & TypeScript',
            'Node.js & Express Architecture',
            'RESTful & WebSocket APIs',
            'Full-Stack Architecture',
            'High-Concurrency Caching Layers',
            'Automated CI/CD Workflows'
        ],
        design: [
            'Brand Identity & Logo Systems',
            'Dark-Tech Luxury UI/UX',
            'Figma & Adobe Illustrator',
            'Fluid Typography & 12-Col Grid',
            'Micro-Interactions & Physics',
            'Component Design Tokens'
        ],
        marketing: [
            'Technical SEO & Schema JSON-LD',
            'Core Web Vitals 100/100',
            'Search Console & Indexation',
            'Conversion Rate Optimization',
            'Performance Telemetry',
            'Content Growth Funnels'
        ],
        database: [
            'MySQL 8.0 Relational Architecture',
            'Query Profiling & Index Tuning',
            'ACID Transaction Integrity',
            'Automated Replication & Backups',
            'Redis In-Memory Caching',
            'Normalized Schema Design'
        ]
    };

    let services = [];

    const classify = (service, domain) => {
        const category = String(service.category_key || '').trim().toLowerCase();
        const categoryDomains = {
            network: ['network', 'server'],
            security: ['cybersecurity'],
            development: ['fullstack'],
            marketing: ['seo']
        };
        if (categoryDomains[domain]?.includes(category)) return true;
        const source = `${service.title || ''} ${service.description || ''} ${service.tags || ''}`.toLowerCase();
        const terms = {
            network: ['network', 'ccna', 'vlan', 'router', 'switch', 'routing', 'subnet'],
            security: ['security', 'cyber', 'ethical', 'firewall', 'ssl', 'vulnerability', 'defense', 'penetration'],
            development: ['full-stack', 'full stack', 'web', 'node', 'express', 'javascript', 'application', 'development'],
            design: ['graphic', 'design', 'branding', 'photoshop', 'illustrator', 'ui', 'ux', 'canva'],
            marketing: ['marketing', 'seo', 'digital', 'content', 'analytics', 'campaign', 'social media'],
            database: ['database', 'mysql', 'sql', 'postgres', 'mongo', 'schema', 'query']
        };
        return terms[domain].some(term => source.includes(term));
    };

    const renderServices = () => {
        const domain = system.dataset.activeDomain || 'network';
        const related = services.filter(service => classify(service, domain));
        const caps = domainCapabilities[domain] || domainCapabilities.network;

        list.replaceChildren();

        // 1. Render CMS custom services if present in database
        related.slice(0, 3).forEach(service => {
            const item = document.createElement('span');
            item.className = 'expertise-service';
            item.textContent = service.title || 'Untitled service';
            list.append(item);
        });

        // 2. Render Core Enterprise Capabilities for selected discipline
        caps.forEach(cap => {
            const item = document.createElement('span');
            item.className = 'expertise-service';
            item.textContent = cap;
            list.append(item);
        });
    };

    const activate = (domain) => {
        const meta = modeMeta[domain];
        if (!meta) return;

        system.dataset.activeDomain = domain;
        tabs.forEach(tab => {
            const active = tab.dataset.domain === domain;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', String(active));
            if (active && stage) stage.setAttribute('aria-labelledby', tab.id);
        });
        const indexEl = system.querySelector('.expertise-stage-index');
        const statusEl = system.querySelector('.expertise-stage-status');
        if (indexEl) indexEl.textContent = meta[0];
        if (statusEl) statusEl.textContent = meta[1];
        renderServices();
    };

    tabs.forEach(tab => tab.addEventListener('click', () => activate(tab.dataset.domain)));
    window.addEventListener('expertise-services-ready', event => {
        services = Array.isArray(event.detail) ? event.detail : [];
        renderServices();
    });

    if (Array.isArray(window.__expertiseServices)) {
        services = window.__expertiseServices;
        renderServices();
    } else {
        renderServices();
    }

    // Dynamic Live Telemetry Fluctuator (Subtle 2.5s jitter)
    setInterval(() => {
        if (document.hidden || system.classList.contains('expertise-paused')) return;
        if (streamCounter) {
            const jitterVal = (51.8 + Math.random() * 2.4).toFixed(1);
            streamCounter.textContent = `${jitterVal} kpps`;
        }
        if (latencyCounter) {
            const latVal = (0.9 + Math.random() * 0.4).toFixed(1);
            latencyCounter.textContent = `${latVal} ms`;
        }
    }, 2500);

    // Interactive Node Inspection on SVG (Clean Telemetry without SVG coordinate corruption)
    const topoStatus = system.querySelector('.hud-val-green');
    const NODE_DESCRIPTIONS = {
        'edge': 'EDGE GATEWAY (FW / NAT)',
        'router': 'CORE ROUTER (CISCO C8300)',
        'switch': 'VLAN TRUNK (10/20/30)',
        'client-a': 'CLIENT A (PROD 10.10.10.25)',
        'client-b': 'CLIENT B (MGMT 10.20.20.14)'
    };

    system.querySelectorAll('.node-interactive').forEach(node => {
        node.addEventListener('mouseenter', () => {
            node.classList.add('node-active');
            const nodeKey = node.getAttribute('data-node');
            if (topoStatus && NODE_DESCRIPTIONS[nodeKey]) {
                topoStatus.textContent = NODE_DESCRIPTIONS[nodeKey];
                topoStatus.style.fill = '#d8a745';
                topoStatus.style.color = '#d8a745';
            }
        });
        node.addEventListener('mouseleave', () => {
            node.classList.remove('node-active');
            if (topoStatus) {
                topoStatus.textContent = 'OPTIMAL';
                topoStatus.style.fill = '';
                topoStatus.style.color = '';
            }
        });
    });

    const observer = new IntersectionObserver(([entry]) => {
        system.classList.toggle('expertise-paused', !entry.isIntersecting || document.hidden);
    }, { threshold: 0.08 });
    observer.observe(system);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) system.classList.add('expertise-paused');
    }, { passive: true });
})();

// Section settings move/hide existing DOM nodes. Recalculate scroll-based layout
// without recreating visual systems or attaching another set of listeners.
window.addEventListener('portfolio-sections-applied', () => {
    window.requestAnimationFrame(() => {
        if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
            window.ScrollTrigger.refresh();
        }
    });
});

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
