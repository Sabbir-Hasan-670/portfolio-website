<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
    xmlns:html="http://www.w3.org/TR/REC-html40"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
            <head>
                <title>XML Sitemap | Sabbir Hasan</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style type="text/css">
                    * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                        background: #060913;
                        color: #e2e8f0;
                        padding: 2.5rem 1.5rem;
                        line-height: 1.6;
                    }
                    .sitemap-wrapper {
                        max-width: 1100px;
                        margin: 0 auto;
                    }
                    .header-box {
                        background: rgba(13, 20, 36, 0.7);
                        border: 1px solid rgba(125, 185, 198, 0.25);
                        border-radius: 12px;
                        padding: 2rem;
                        margin-bottom: 2rem;
                        backdrop-filter: blur(10px);
                    }
                    h1 {
                        font-size: 1.85rem;
                        color: #ffffff;
                        margin-bottom: 0.5rem;
                        font-weight: 700;
                    }
                    h1 span {
                        color: #d8a745;
                    }
                    .desc {
                        color: #8b9bb4;
                        font-size: 0.95rem;
                        margin-bottom: 1rem;
                    }
                    .badge {
                        display: inline-block;
                        background: rgba(39, 201, 63, 0.15);
                        color: #27c93f;
                        border: 1px solid rgba(39, 201, 63, 0.35);
                        padding: 0.3rem 0.75rem;
                        border-radius: 999px;
                        font-size: 0.8rem;
                        font-family: monospace;
                        font-weight: 600;
                    }
                    .badge-gold {
                        background: rgba(216, 167, 69, 0.15);
                        color: #d8a745;
                        border-color: rgba(216, 167, 69, 0.35);
                        margin-left: 0.5rem;
                    }
                    table {
                        width: 100%;
                        border-collapse: separate;
                        border-spacing: 0;
                        background: rgba(13, 20, 36, 0.6);
                        border: 1px solid rgba(125, 185, 198, 0.18);
                        border-radius: 12px;
                        overflow: hidden;
                    }
                    th {
                        background: rgba(20, 30, 50, 0.9);
                        color: #7db9c6;
                        text-align: left;
                        padding: 1rem 1.25rem;
                        font-size: 0.82rem;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        border-bottom: 1px solid rgba(125, 185, 198, 0.25);
                        font-family: monospace;
                    }
                    td {
                        padding: 0.85rem 1.25rem;
                        font-size: 0.88rem;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
                    }
                    tr:last-child td {
                        border-bottom: none;
                    }
                    tr:hover td {
                        background: rgba(125, 185, 198, 0.06);
                    }
                    a {
                        color: #7db9c6;
                        text-decoration: none;
                        word-break: break-all;
                        transition: color 0.2s;
                    }
                    a:hover {
                        color: #d8a745;
                        text-decoration: underline;
                    }
                    .priority-pill {
                        font-family: monospace;
                        font-size: 0.78rem;
                        padding: 0.15rem 0.5rem;
                        border-radius: 4px;
                        background: rgba(216, 167, 69, 0.12);
                        color: #d8a745;
                        display: inline-block;
                    }
                    .date-text {
                        color: #8b9bb4;
                        font-family: monospace;
                        font-size: 0.82rem;
                    }
                </style>
            </head>
            <body>
                <div class="sitemap-wrapper">
                    <div class="header-box">
                        <h1>XML <span>Sitemap</span> Index</h1>
                        <p class="desc">
                            Generated dynamically by Sabbir Hasan's Portfolio Engine for Google, Bing, and search indexing crawlers.
                        </p>
                        <div>
                            <span class="badge">● VALID SITEMAP PROTOCOL 0.9</span>
                            <span class="badge badge-gold">
                                TOTAL URLS: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
                            </span>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="width: 55%;">URL Location</th>
                                <th style="width: 15%;">Priority</th>
                                <th style="width: 15%;">Change Frequency</th>
                                <th style="width: 15%;">Last Modified</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="sitemap:urlset/sitemap:url">
                                <tr>
                                    <td>
                                        <xsl:variable name="itemURL">
                                            <xsl:value-of select="sitemap:loc"/>
                                        </xsl:variable>
                                        <a href="{$itemURL}">
                                            <xsl:value-of select="sitemap:loc"/>
                                        </a>
                                    </td>
                                    <td>
                                        <span class="priority-pill">
                                            <xsl:value-of select="sitemap:priority"/>
                                        </span>
                                    </td>
                                    <td>
                                        <span style="color:#e2e8f0; font-size:0.85rem; text-transform:capitalize;">
                                            <xsl:value-of select="sitemap:changefreq"/>
                                        </span>
                                    </td>
                                    <td>
                                        <span class="date-text">
                                            <xsl:value-of select="sitemap:lastmod"/>
                                        </span>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
