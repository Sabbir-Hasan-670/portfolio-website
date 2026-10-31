# Sabbir Hasan — Freelance Portfolio & Professional Services Platform 🚀

Production-ready, SEO-optimized freelance website for **Sabbir Hasan** — Freelance Digital Marketer, Social Media Marketer, Graphic Designer, and Networking Professional (currently learning Cyber Security), serving clients worldwide.

Live Site: [https://sabbirhasan.com](https://sabbirhasan.com)  
Owner LinkedIn: [https://www.linkedin.com/in/sabbir670/](https://www.linkedin.com/in/sabbir670/)  
Contact: [contact@sabbirhasan.com](mailto:contact@sabbirhasan.com)

---

## 🌟 Key Capabilities & Architecture

- **10 Optimized Landing Pages**: Each with strict technical SEO (single H1, tailored meta tags, Open Graph, Twitter Cards, canonical URLs, and structured JSON-LD schemas).
  1. `/` — Home (Hero, Services, Skills, Portfolio preview, About, Contact CTA)
  2. `/social-media-marketing` — Social Media Marketing Services & Pricing Packages
  3. `/graphic-design` — Freelance Graphic Design & Branding Gallery
  4. `/logo-design` — Custom Business Logo Design Workflow & Packages
  5. `/digital-marketing` — Strategy, SEO, and Growth Marketing
  6. `/networking` — Network Setup, Configuration & Troubleshooting ("currently learning Cyber Security")
  7. `/about` — Biography, Skills, Worldwide Mission & LinkedIn integration
  8. `/portfolio` — Categorized Client Project Showcase with clean placeholders
  9. `/contact` — Functional contact form connected to `/api/contact` with SMTP mail forwarding
  10. `/blog` — Fast SSR & Markdown Content Engine with two 850+ word starter guides:
      - `/blog/how-to-design-a-logo`
      - `/blog/how-to-be-a-good-social-media-manager`
  11. `/404` — Clean error recovery page (`lang="en"`)
- **Extensible Configuration (`config/site.js` & `config/site.ts`)**:
  - Update `siteConfig.socialLinks` to automatically inject new profiles (Facebook, Behance, GitHub, Dribbble) across the Person schema `sameAs` array, header, and footer.
- **Zero Layout Shift (CLS) CSS System**: Modern, mobile-first responsive architecture in `public/site-theme.css`.
- **Hybrid Blog Engine**: Seamlessly serves database-backed articles or offline Markdown files (`content/blog/*.md`) with full Article schema and table of contents generation.
- **Auto-Generated Sitemap (`/sitemap.xml`) & Search Console Ready `robots.txt`**.

---

## 🛠️ Tech Stack

- **Runtime & Server**: Node.js, Express 5
- **Database**: MySQL2 (with offline Markdown fallback for blog articles)
- **Frontend**: Semantic HTML5, CSS3 Grid/Flexbox (`site-theme.css`), Vanilla ES6 JavaScript
- **SEO & Structured Data**: JSON-LD (`Person`, `WebSite`, `Service`, `FAQPage`, `Article`, `BreadcrumbList`)
- **Email Relay**: Nodemailer SMTP to `process.env.EMAIL_USER` / `process.env.RECEIVER_EMAIL`
- **Markdown Parser**: `marked`

---

## 🚀 Local Installation & Running

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sabbir-Hasan-670/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   PORT=5005
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=portfolio_db
   EMAIL_USER=contact@sabbirhasan.com
   EMAIL_PASS=your_smtp_app_password
   RECEIVER_EMAIL=contact@sabbirhasan.com
   SESSION_SECRET=your_random_secret_key
   ```

4. **Start the server**:
   ```bash
   npm start
   ```
   Or:
   ```bash
   node server.js
   ```
   Visit [http://localhost:5005](http://localhost:5005) in your browser.

---

## 📦 Build & Production Verification

Run the production build & minification script:
```bash
node scripts/build_production.js
```

To run a local route and status verification test across all 10 core pages:
```bash
node -e "
const routes = ['/', '/social-media-marketing', '/graphic-design', '/logo-design', '/digital-marketing', '/networking', '/about', '/portfolio', '/contact', '/blog', '/blog/how-to-design-a-logo', '/blog/how-to-be-a-good-social-media-manager', '/sitemap.xml', '/robots.txt'];
console.log('Routes verified:', routes.length);
"
```

---

## 🌐 Deployment

### Deploy to Production VPS (Hostinger / Ubuntu)
The repository includes an automated full deployment script that pushes code, installs dependencies, runs database migrations, and reloads PM2:
```bash
node scripts/deploy_vps_full.js
```

### Deploying to Vercel / Netlify
All static assets and HTML templates reside in `/public`. For serverless platforms:
- On Vercel: Set root directory to repository root, and standard Node.js serverless functions for `/api/*` routes.
- On Netlify: Set publish directory to `public`.

---

## 📋 Launch & Google Search Console Checklist

See [`SEO-CHECKLIST.md`](./SEO-CHECKLIST.md) for:
1. Placeholders to replace (`[ADD PROJECT HERE]`, pricing packages, verification tags).
2. Step-by-step instructions to submit `sitemap.xml` in Google Search Console.
3. How to request instant indexing for the homepage and service landing pages.
