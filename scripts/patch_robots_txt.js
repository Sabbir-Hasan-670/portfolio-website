const fs = require('fs');

const robotsText = `# ==============================================================
# robots.txt for sabbirhasan.com
# Generative Engine Optimization (GEO) & AI Search Enabled
# ==============================================================

# W3C / TDM Content Signals for AI & Search
Content-Signal: search=yes,ai-input=yes,ai-train=yes,use=reference

# Standard Crawlers
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /login
Disallow: /dashboard
Disallow: /api
Disallow: /api/

# --------------------------------------------------------------
# Major Traditional Search Engines
# --------------------------------------------------------------
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: Yandex
Allow: /

# --------------------------------------------------------------
# Generative Search Engines & AI Assistants (GEO)
# --------------------------------------------------------------
# OpenAI (ChatGPT Browsing, SearchGPT, Retrieval)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# Anthropic (Claude Search, Retrieval & Citations)
User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

# Perplexity AI Search Engine
User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-Search
Allow: /

# Google Gemini, AI Overviews & Grounding
User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Google-CloudVertexBot
Allow: /

# Apple Intelligence & Web Answers
User-agent: Applebot-Extended
Allow: /

# Meta AI & Llama Web Search
User-agent: FacebookBot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: meta-externalagent
Allow: /

# Microsoft Copilot & Bing AI
User-agent: BingPreview
Allow: /

User-agent: msnbot
Allow: /

# Cohere, Mistral & Next-Gen AI Engines
User-agent: cohere-ai
Allow: /

User-agent: MistralAI-User
Allow: /

User-agent: MistralAI-Training
Allow: /

User-agent: YouBot
Allow: /

User-agent: PhindBot
Allow: /

User-agent: KagiBot
Allow: /

User-agent: Bravebot
Allow: /

# --------------------------------------------------------------
# Sitemaps & Machine-Readable LLM Context
# --------------------------------------------------------------
Sitemap: https://sabbirhasan.com/sitemap.xml
`;

// 1. Write public/robots.txt
fs.writeFileSync('public/robots.txt', robotsText, 'utf8');
console.log('✅ Created public/robots.txt');

// 2. Patch server.js route
let serverCode = fs.readFileSync('server.js', 'utf8');
const routeStart = serverCode.indexOf("app.get('/robots.txt',");
const routeEnd = serverCode.indexOf("});", routeStart) + 3;

if (routeStart !== -1 && routeEnd !== -1) {
    const newRoute = `app.get('/robots.txt', (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.sendFile(path.join(__dirname, 'public/robots.txt'));
});`;

    serverCode = serverCode.slice(0, routeStart) + newRoute + serverCode.slice(routeEnd);
    fs.writeFileSync('server.js', serverCode, 'utf8');
    console.log('✅ Patched /robots.txt route in server.js to serve public/robots.txt');
} else {
    console.error('Could not find /robots.txt route in server.js');
}
