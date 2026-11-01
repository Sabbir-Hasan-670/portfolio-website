document.addEventListener("DOMContentLoaded",()=>{const o=document.getElementById("blogSearchInput"),t=document.getElementById("liveSearchResults"),n=document.getElementById("blogGrid"),l=document.getElementById("paginationWrapper"),a=document.getElementById("searchSpinner");let r;o&&o.addEventListener("input",c=>{clearTimeout(r);const i=c.target.value.trim();if(i.length<2){t&&(t.style.display="none",t.innerHTML=""),n&&(n.style.display="grid"),l&&(l.style.display="flex"),a&&(a.style.display="none");return}a&&(a.style.display="inline-block"),r=setTimeout(async()=>{try{const s=await(await fetch("/api/blog/search?q="+encodeURIComponent(i))).json();a&&(a.style.display="none"),s&&s.length>0?(t.innerHTML='<h3>Search Results for "'+i+'" ('+s.length+')</h3><div class="blog-grid">'+s.map(e=>`
                            <article class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
                                <a href="/blog/${e.slug}" class="blog-card-img-link" tabindex="-1" aria-hidden="true">
                                    <img src="${e.image_path||"/og-image.png"}" alt="${e.title}" class="blog-img" loading="lazy">
                                </a>
                                <div class="blog-body">
                                    <div class="blog-meta-bar">
                                        <span class="blog-category">${e.category||"Tech"}</span>
                                        <span class="blog-reading-time">\u23F1\uFE0F ${e.reading_time||"4 min read"}</span>
                                    </div>
                                    <h3 class="blog-title"><a href="/blog/${e.slug}">${e.title}</a></h3>
                                    <p class="blog-excerpt">${e.excerpt||""}</p>
                                    <div class="blog-footer-row">
                                        <span class="blog-date">\u{1F4C5} ${e.created_at?new Date(e.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"Recent"}</span>
                                        <a href="/blog/${e.slug}" class="read-more">Read Article <span>\u2192</span></a>
                                    </div>
                                </div>
                            </article>
                        `).join("")+"</div>",t.style.display="block",n&&(n.style.display="none"),l&&(l.style.display="none")):(t.innerHTML='<div class="empty-state"><p>No articles matching "<strong>'+i+'</strong>".</p></div>',t.style.display="block",n&&(n.style.display="none"),l&&(l.style.display="none"))}catch(d){a&&(a.style.display="none")}},300)})});
