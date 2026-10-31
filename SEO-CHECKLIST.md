# SEO & Launch Checklist: sabbirhasan.com

This document serves as your operational checklist for deploying, verifying, and indexing **sabbirhasan.com** as a freelance digital marketing, graphic design, and networking business targeting clients worldwide.

---

## 1. Placeholders You Must Replace / Update

| Location / File | Placeholder | What to Replace With |
| :--- | :--- | :--- |
| `public/portfolio.html`, `public/index.html`, `public/graphic-design.html` | `[ADD PROJECT HERE]` | Replace with your real client case studies, screenshots, live links, and deliverables. |
| `public/social-media-marketing.html` | Starter Pricing Tiers (`$199`, `$399`, `$749`) | Adjust according to your custom monthly retainer rates and deliverables. |
| `public/logo-design.html` | Starter Packages (`$99`, `$199`, `$349`) | Adjust according to your custom logo deliverables and vector revisions. |
| All HTML `<head>` tags | `<meta name="google-site-verification" content="..." />` | Insert your unique Google Search Console verification code. |
| All HTML `<head>` tags | Google Analytics tag (`G-XXXXXXXXXX`) | Replace with your verified GA4 Measurement ID in `public/main.js` and HTML templates. |
| `.env` file on server | `EMAIL_USER`, `EMAIL_PASS`, `RECEIVER_EMAIL` | Ensure Gmail App Password or SMTP credentials are active so the contact form forwards directly to your inbox. |
| `config/site.js` & `config/site.ts` | Social media profiles | When you create Facebook, Behance, Dribbble, or GitHub profiles, add them to `siteConfig.socialLinks` — they will automatically propagate to Person schema and footer links. |

---

## 2. Google Search Console Sitemap Submission

1. **Sign In**: Navigate to [Google Search Console](https://search.google.com/search-console).
2. **Add / Select Property**: Verify ownership of `https://sabbirhasan.com` (via DNS TXT record or HTML verification tag).
3. **Open Sitemaps Tool**: In the left sidebar under the **Indexing** section, click **Sitemaps**.
4. **Enter Sitemap URL**: In the **Add a new sitemap** input field, type:
   ```text
   sitemap.xml
   ```
5. **Submit**: Click **SUBMIT**.
6. **Verify Status**:
   - Refresh after a few seconds. The status should display a green **"Success"**.
   - Google will now crawl all 10 main pages and your starter blog articles automatically.

---

## 3. How to Request Indexing for Homepage & Key Pages

To expedite search indexing rather than waiting for normal crawler cycles:

1. In Search Console, locate the top search box with the placeholder **"Inspect any URL in 'https://sabbirhasan.com'"**.
2. Type or paste your homepage URL:
   ```text
   https://sabbirhasan.com/
   ```
3. Press **Enter**. Search Console will fetch data from the Google index.
4. Click the button **TEST LIVE URL** (top right) to confirm Googlebot encounters no blocking errors, receives HTTP 200, and parses all structured schemas.
5. Click **REQUEST INDEXING**. A dialog will confirm: *"Indexing requested. URL was added to a priority crawl queue."*
6. Repeat step 2–5 for your high-priority service landing pages:
   - `https://sabbirhasan.com/social-media-marketing`
   - `https://sabbirhasan.com/graphic-design`
   - `https://sabbirhasan.com/logo-design`
   - `https://sabbirhasan.com/digital-marketing`
   - `https://sabbirhasan.com/networking`
   - `https://sabbirhasan.com/about`
   - `https://sabbirhasan.com/portfolio`
   - `https://sabbirhasan.com/blog/how-to-design-a-logo`
   - `https://sabbirhasan.com/blog/how-to-be-a-good-social-media-manager`

> **Note**: Google limits live test/indexing requests to roughly 10–20 per day. Request the homepage and core service pages first.

---

## 4. Master On-Page Technical SEO Matrix

Every page is strictly structured with **exactly one H1**, unique meta tags, canonical link, and JSON-LD structured schemas:

| Route | Page Title | Meta Description | Single H1 | Schema Types |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `Sabbir Hasan \| Freelance Digital Marketer & Graphic Designer` | Sabbir Hasan is a freelance digital marketer and graphic designer offering social media marketing, logo design and networking services to clients worldwide. | `Sabbir Hasan – Freelance Digital Marketer & Graphic Designer` | `Person`, `WebSite` |
| `/social-media-marketing` | `Social Media Marketing Services \| Sabbir Hasan` | Affordable social media marketing services and packages for small businesses, including content creation and management. Hire freelancer Sabbir Hasan. | `Social Media Marketing Services for Small Businesses` | `Service`, `FAQPage`, `BreadcrumbList` |
| `/graphic-design` | `Freelance Graphic Design & Social Media Design \| Sabbir Hasan` | Professional graphic design services including social media design, branding and graphics for businesses worldwide. Hire freelance designer Sabbir Hasan. | `Freelance Graphic Design Services` | `Service`, `FAQPage`, `BreadcrumbList` |
| `/logo-design` | `Custom Business Logo Design Services \| Sabbir Hasan` | Get a unique, professional logo for your company. Custom logo design and branding by freelance graphic designer Sabbir Hasan. | `Custom Logo Design for Your Business` | `Service`, `FAQPage`, `BreadcrumbList` |
| `/digital-marketing` | `Freelance Digital Marketer for Hire \| Sabbir Hasan` | Hire freelance digital marketer Sabbir Hasan for social media marketing, SEO and online growth strategy for your business. | `Freelance Digital Marketer` | `Service`, `FAQPage`, `BreadcrumbList` |
| `/networking` | `Networking Services & Support \| Sabbir Hasan` | Network setup, configuration and troubleshooting services by Sabbir Hasan. Available for remote work worldwide. | `Networking Services` | `Service`, `FAQPage`, `BreadcrumbList` |
| `/about` | `About Sabbir Hasan \| Digital Marketer, Designer & Networking Professional` | Learn about Sabbir Hasan, a freelance digital marketer, graphic designer and networking professional working with clients worldwide. | `About Sabbir Hasan` | `Person`, `BreadcrumbList` |
| `/portfolio` | `Client Work & Portfolio Showcase \| Sabbir Hasan` | Explore client projects, branding designs, social media campaigns, and networking setups delivered by freelance specialist Sabbir Hasan. | `Client Work &amp; Portfolio Showcase` | `BreadcrumbList` |
| `/contact` | `Contact Sabbir Hasan \| Hire a Freelance Marketer & Designer` | Get in touch with freelance digital marketer and graphic designer Sabbir Hasan. Request a quote or schedule a consultation for your business. | `Let's Build Something Exceptional Together` | `ContactPage`, `BreadcrumbList` |
| `/blog` | `Blog & Resources \| Sabbir Hasan` | Practical guides, tutorials, and insights on digital marketing, social media marketing, logo design, graphic design, and networking by Sabbir Hasan. | `Insights, Guides & Practical Resources` | `BreadcrumbList` |
| `/blog/how-to-design-a-logo` | `How to Design a Logo: A Step-by-Step Guide for Beginners \| Sabbir Hasan` | Learn how to design a logo from scratch with this comprehensive beginner guide. Step-by-step process covering concept sketching, typography, colors, and file delivery. | `How to Design a Logo: A Step-by-Step Guide for Beginners` | `Article`, `BreadcrumbList` |
| `/blog/how-to-be-a-good-social-media-manager` | `How to Be a Good Social Media Manager: Practical Tips \| Sabbir Hasan` | Master how to be a good social media manager with practical, actionable tips on content strategy, community engagement, analytics, and workflow systems. | `How to Be a Good Social Media Manager: Practical Tips` | `Article`, `BreadcrumbList` |
| `/404` | `404 - Page Not Found \| Sabbir Hasan` | The requested page could not be found. Explore services, portfolio, or contact Sabbir Hasan. | `404 — Page Not Found` | Standard error recovery |

---

## 5. Ongoing Rank Tracking & Brand SEO

1. Monitor brand queries:
   - `"Sabbir Hasan"`
   - `"Sabbir Hasan digital marketer"`
   - `"Sabbir Hasan graphic designer"`
2. Verify that your LinkedIn profile (`https://www.linkedin.com/in/sabbir670/`) appears associated with `sabbirhasan.com` in Google Knowledge Graph via the Person schema `sameAs` array.
3. Keep writing original, helpful articles under `/blog` targeting high-intent long-tail keywords.
