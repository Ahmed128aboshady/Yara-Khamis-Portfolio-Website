import {config} from './config.js';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const arrow='<span aria-hidden="true">↗</span>';

const bPath = (config.basePath || '/').replace(/\/?$/, '/');
const toUrl = p => (bPath + (p.replace(/^\//, ''))).replace(/\/\/+/g, '/');
const fromUrl = p => {
  if (p.startsWith(bPath)) p = p.slice(bPath.length - 1);
  return p.replace(/\/?$/, '/') || '/';
};

const url=p=>toUrl(`project/${p.id}/`);
let projects=[],currentPath='',revealObserver,lightboxItems=[],lightboxIndex=0,opener,filterLimit=12,routeVersion=0,transitionProject=null,inTransition=false;
const main=$('#main');
const wa=text=>`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
const pnum=n=>projects.find(p=>p.order===n)||projects[0];
const img=(p,cls='',large=false)=>p?.cover?`<img class="${cls}" src="${esc(large?p.cover.src:p.cover.thumb)}" alt="${esc(p.title)}" width="${p.cover.width}" height="${p.cover.height}" loading="${large?'eager':'lazy'}" decoding="async">`:'';
const button=(label,href,secondary=false)=>`<a class="button ${secondary?'button-outline':''}" href="${toUrl(href)}">${label} ${arrow}</a>`;
function card(p,i=0){return `<article class="project-card reveal" data-project="${p.id}" style="--i:${i%6}"><a class="project-visual" href="${url(p)}" data-project="${p.id}">${img(p)}<div class="project-overlay"><span>Explore project</span>${arrow}</div>${p.images.some(x=>x.motion)?'<span class="motion-tag">▷ Motion</span>':''}</a><div class="project-caption"><div><a href="${url(p)}" data-project="${p.id}"><h3>${esc(p.title)}</h3></a><p>${esc(p.category)} <span>·</span> ${esc(p.year)}</p></div><a class="circle-link" href="${url(p)}" data-project="${p.id}" aria-label="Explore ${esc(p.title)}">↗</a></div></article>`;}
function cta(){return `<section class="collab reveal"><div class="collab-orbit" aria-hidden="true"></div><div><span class="eyebrow">YOUR NEXT CHAPTER</span><h2>Let’s create<br><em>something lasting.</em></h2></div>${button('Start a conversation','contact/')}</section>`;}
function home(){const featured=[5,8,2,50,1,7].map(pnum);return `<section class="hero"><div class="hero-copy"><span class="eyebrow">PACKAGING & SPATIAL GRAPHIC DESIGNER</span><h1>Crafting<br>visual <em>legacies.</em></h1><p>Packaging. Spaces. Brand identities.<br>Thoughtful design, made tangible.</p><div class="hero-actions">${button(`Explore ${projects.length} projects`,'work/')}<a class="quiet-link" href="${toUrl('about/')}">Meet Yara ↗</a></div><div class="hero-note"><span class="fine-rule"></span>OBJECTS THAT TELL STORIES.<br>SPACES THAT LEAVE AN IMPRESSION.</div></div><div class="hero-art"><div class="hero-orbit" aria-hidden="true"></div><iframe src="${toUrl('lab/?embed=hero')}" title="Interactive Al-Amir Dates packaging by Yara Khamis" loading="eager"></iframe><div class="hero-art-caption"><span>AL-AMIR DATES / INTERACTIVE STUDY</span><a href="${url(pnum(1))}">Explore the project ↗</a></div></div><div class="hero-bottom"><span>SCROLL TO DISCOVER</span><span>↓</span><span>YTS PRODUCTION / YARA KHAMIS</span></div></section>
<section class="disciplines"><a href="${toUrl('work/?category=Packaging')}"><span>01</span><h2>Packaging</h2><p>Objects that tell<br>bigger stories.</p>${img(pnum(5))}${arrow}</a><a href="${toUrl('work/?category=Spaces')}"><span>02</span><h2>Spaces</h2><p>Immersive environments.<br>Lasting impressions.</p>${img(pnum(8))}${arrow}</a><a href="${toUrl('work/?category=Branding')}"><span>03</span><h2>Brand identities</h2><p>Distinctive worlds.<br>Built to connect.</p>${img(pnum(50))}${arrow}</a></section>
<section class="selected section"><div class="section-heading"><div><span class="eyebrow">A SELECTION OF THE WORK</span><h2>Considered details.<br><em>Distinctive outcomes.</em></h2></div><a class="text-link" href="${toUrl('work/')}">View all work ↗</a></div><div class="project-grid">${featured.map(card).join('')}</div></section>
<div class="work-strip"><span>PACKAGING</span><b>✧</b><span>EXHIBITION SPACES</span><b>✧</b><span>BRAND IDENTITIES</span><b>✧</b><span>ART DIRECTION</span></div>${cta()}`;}
function work(){const q=new URLSearchParams(location.search),category=q.get('category')||'All',search=q.get('q')||'',view=q.get('view')||'grid',sort=q.get('sort')||'curated';return `<section class="page-head section"><span class="eyebrow">THE PORTFOLIO / ${projects.length} PROJECTS</span><h1>Selected <em>work.</em></h1><p>Packaging, spaces and identities.<br>A collection of ideas brought into the world.</p></section><section class="work-section section"><div class="work-toolbar"><div class="filter-chips" role="group" aria-label="Filter projects">${['All','Packaging','Spaces','Branding','Artworks'].map(c=>`<button data-filter="${c}" aria-pressed="${c===category}">${c} <span>${c==='All'?projects.length:projects.filter(p=>p.categories.includes(c)).length}</span></button>`).join('')}</div><div class="work-options"><label class="search-box"><span>⌕</span><input id="search" type="search" placeholder="Search projects…" aria-label="Search projects" value="${esc(search)}"></label><select id="sort" aria-label="Sort projects"><option value="curated" ${sort==='curated'?'selected':''}>Curated order</option><option value="newest" ${sort==='newest'?'selected':''}>Newest first</option><option value="title" ${sort==='title'?'selected':''}>A–Z</option></select><div class="view-switch" role="group" aria-label="Gallery layout"><button data-view="grid" aria-label="Grid view" aria-pressed="${view==='grid'}">▦</button><button data-view="focus" aria-label="Large gallery view" aria-pressed="${view==='focus'}">▤</button></div></div></div><div class="results-line"><p id="results-status" role="status"></p><span>SELECT A PROJECT TO EXPLORE</span></div><div id="work-grid" class="project-grid ${view==='focus'?'focus-grid':''}"></div><div class="load-more-wrap"><button id="load-more" class="button button-outline">Discover more ↓</button><span id="loaded-count"></span></div></section>${cta()}`;}
function updateWork(reset=false){if(reset)filterLimit=12;const q=new URLSearchParams(location.search),cat=q.get('category')||'All',s=(q.get('q')||'').toLowerCase(),sort=q.get('sort')||'curated';let list=projects.filter(p=>(cat==='All'||p.categories.includes(cat))&&[p.title,p.category,...p.tags].join(' ').toLowerCase().includes(s));if(sort==='newest')list.sort((a,b)=>b.year.localeCompare(a.year)||a.order-b.order);if(sort==='title')list.sort((a,b)=>a.title.localeCompare(b.title));$('#results-status').textContent=`${list.length} ${list.length===1?'project':'projects'}${cat!=='All'?' / '+cat:''}`;$('#work-grid').innerHTML=list.length?list.slice(0,filterLimit).map(card).join(''):`<div class="empty-state"><span>⌕</span><h2>No projects found.</h2><p>Try a different name or reset your filters.</p><button id="clear-filters" class="button button-outline">Reset filters</button></div>`;$('#load-more').hidden=list.length<=filterLimit;$('#loaded-count').textContent=list.length?`Showing ${Math.min(filterLimit,list.length)} of ${list.length}`:'';$('#clear-filters')?.addEventListener('click',()=>navigate(toUrl('work/')));startReveal();}
function projectPage(p){
  const i=projects.indexOf(p),next=projects[(i+1)%projects.length];
  const cs=p.caseStudy||{};
  const featVid=cs.featuredVideo;
  return `<article class="case-study-page">
<section class="case-head section">
  <div class="case-breadcrumb">
    <a class="back-link" href="${toUrl('work/')}" data-back-work>← Back to work</a>
    <span class="breadcrumb-sep">/</span>
    <span class="case-badge">${esc(p.category)}</span>
    <span class="case-num">Case Study ${String(p.order).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}</span>
  </div>
  <div class="case-heading">
    <div>
      <span class="eyebrow">${esc(cs.discipline||p.category.toUpperCase())} · ${esc(p.year)}</span>
      <h1>${esc(cs.client||p.title)}</h1>
      ${cs.client&&cs.client!==p.title?`<p class="case-subtitle">${esc(p.title)}</p>`:''}
    </div>
    <div class="case-actions">
      <button class="circle-link" id="share-project" aria-label="Share this project">↗</button>
      <a class="button button-outline" href="${esc(p.behance)}" target="_blank" rel="noopener">Behance ↗</a>
      <a class="button" href="${toUrl('contact/?project='+encodeURIComponent(p.title))}">Inquire ↗</a>
    </div>
  </div>
  <div class="case-meta-grid">
    <div class="meta-item">
      <span class="meta-label">CLIENT / BRAND</span>
      <span class="meta-value">${esc(cs.client||p.title)}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">DISCIPLINE</span>
      <span class="meta-value">${esc(cs.discipline||p.category)}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">SECTOR</span>
      <span class="meta-value">${esc(cs.sector||'Design & FMCG')}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">YEAR</span>
      <span class="meta-value">${esc(p.year)}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">ROLE</span>
      <span class="meta-value">${esc(cs.role||'Lead Designer')}</span>
    </div>
    <div class="meta-item tools-item">
      <span class="meta-label">TOOLS & TECH</span>
      <div class="meta-tags">${(p.tools||[]).map(t=>`<span class="tool-tag">${esc(t)}</span>`).join('')}</div>
    </div>
  </div>
</section>

<section class="case-hero section">
  <div class="ambient-glow-wrapper">
    <div class="ambient-glow" style="background: radial-gradient(circle, ${cs.accent||'#d4b36a'}44 0%, transparent 70%);"></div>
    <button class="image-open cover-open" data-image="${p.coverIndex}" aria-label="Enlarge ${esc(p.title)}">
      ${img(p,'',true)}
      <span>VIEW FULL IMAGE ⤢</span>
    </button>
  </div>
</section>

${featVid?`<section class="case-video-section section">
  <div class="section-heading">
    <div>
      <span class="eyebrow">${esc(featVid.badge||'PRODUCT IN MOTION')}</span>
      <h2>${esc(featVid.title||'Cinematic Showcase')}</h2>
    </div>
    <p class="video-caption-lead">${esc(featVid.caption||'')}</p>
  </div>
  <div class="case-video-wrapper">
    <div class="ambient-glow" style="background: radial-gradient(circle, ${cs.accent||'#d4b36a'}66 0%, transparent 70%);"></div>
    <div class="video-badge-pill">● 4K 3D SHOWCASE</div>
    <video class="case-showcase-video" src="${featVid.src}" controls playsinline preload="metadata" poster="${p.cover?.src||''}">
      Your browser does not support the video tag.
    </video>
  </div>
</section>`:''}

<section class="case-narrative-section section">
  <div class="narrative-grid">
    <div class="narrative-block challenge-block">
      <div class="block-header">
        <span class="block-num">01</span>
        <div>
          <span class="eyebrow">THE BRIEF & OBJECTIVE</span>
          <h3>The Challenge</h3>
        </div>
      </div>
      <p>${esc(cs.challenge||p.description)}</p>
    </div>
    <div class="narrative-block solution-block">
      <div class="block-header">
        <span class="block-num">02</span>
        <div>
          <span class="eyebrow">DESIGN EXECUTION</span>
          <h3>The Creative Solution</h3>
        </div>
      </div>
      <p>${esc(cs.solution||p.description)}</p>
      ${cs.team?`<div class="team-credit"><strong>Team Collaboration:</strong> ${esc(cs.team)}</div>`:''}
    </div>
  </div>
</section>

${cs.highlights&&cs.highlights.length?`<section class="case-highlights-section section">
  <div class="section-heading">
    <div>
      <span class="eyebrow">SCOPE & DELIVERABLES</span>
      <h2>Craftsmanship &amp; Details</h2>
    </div>
    <p>Key strategic and production outputs realized for this project.</p>
  </div>
  <div class="highlights-grid">
    ${cs.highlights.map((h,idx)=>`<div class="highlight-card"><span class="highlight-idx">0${idx+1}</span><p>${esc(h)}</p></div>`).join('')}
  </div>
</section>`:''}

<section class="case-specs-section section">
  <div class="section-heading">
    <div>
      <span class="eyebrow">DESIGN SYSTEM &amp; CRAFTSMANSHIP</span>
      <h2>Palette &amp; <em>production specs.</em></h2>
    </div>
    <p>Curated brand color harmony and material finishing specifications.</p>
  </div>
  <div class="specs-grid">
    <div class="specs-card palette-card">
      <div class="specs-header">
        <span class="specs-icon">◐</span>
        <h3>Brand Color Harmony</h3>
        <span class="copy-hint">Click color to copy HEX</span>
      </div>
      <div class="palette-swatches">
        ${(cs.palette||[]).map(c=>`
          <button class="swatch-item" data-hex="${c.hex}" title="Click to copy ${c.hex}">
            <span class="swatch-color" style="background-color: ${c.hex};"></span>
            <span class="swatch-info">
              <strong class="swatch-name">${esc(c.name)}</strong>
              <code class="swatch-hex">${c.hex}</code>
              <small class="swatch-note">${esc(c.note)}</small>
            </span>
          </button>
        `).join('')}
      </div>
    </div>
    <div class="specs-card finishes-card">
      <div class="specs-header">
        <span class="specs-icon">✦</span>
        <h3>Material Finishes &amp; Type</h3>
      </div>
      <div class="finishes-content">
        <div class="type-spec-box">
          <span class="spec-label">TYPOGRAPHIC SYSTEM</span>
          <p class="type-spec-value">${esc(cs.typography||'Custom Editorial & Display Type')}</p>
        </div>
        <div class="finishes-list-box">
          <span class="spec-label">PRINT &amp; FABRICATION SPECIFICATIONS</span>
          <div class="finishes-tags">
            ${(cs.printSpecs||[]).map(spec=>`
              <span class="finish-pill">
                <span class="finish-dot" style="background-color: ${cs.accent||'var(--gold)'};"></span>
                ${esc(spec)}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

${p.order===1?`<section class="case-interactive section">
  <div class="section-heading">
    <div>
      <span class="eyebrow">INTERACTIVE LAB</span>
      <h2>Explore 3D Packaging <em>in WebGL.</em></h2>
    </div>
    <p>Rotate the structure, lift the lid, and inspect the layered construction in real time.</p>
  </div>
  <iframe src="${toUrl('lab/?embed=project')}" title="Interactive 3D dates packaging" loading="lazy"></iframe>
  <p class="small-note">Interactive WebGL conceptual study developed to examine form, volume, and material feel.</p>
</section>`:''}

<section class="case-gallery-section section" aria-label="Project images">
  <div class="section-heading">
    <div>
      <span class="eyebrow">VISUAL REPERTOIRE · ${p.images.length} ASSETS</span>
      <h2>Visual <em>breakdown.</em></h2>
    </div>
    <p>Detailed packaging artwork, dielines, and high-resolution renders.</p>
  </div>
  <div class="case-gallery">
    ${p.images.map((im,j)=>`<figure class="reveal ${im.width/im.height>1.4||im.width/im.height<.65?'wide':''}">
      <button class="image-open" data-image="${j}" aria-label="Enlarge image ${j+1} of ${esc(p.title)}">
        <img src="${im.src}" alt="${esc(p.title)} — visual ${j+1}" width="${im.width}" height="${im.height}" loading="lazy" decoding="async">
        <span>${im.motion?'PLAY ORIGINAL MOTION ▷':'VIEW FULL IMAGE ⤢'}</span>
      </button>
      <figcaption>
        <span>${String(j+1).padStart(2,'0')} / ${String(p.images.length).padStart(2,'0')}</span>
        ${im.motion?'<span class="motion-tag">▷ Animated Motion</span>':''}
      </figcaption>
    </figure>`).join('')}
  </div>
</section>

<section class="case-end section">
  <p>Interested in a similar creative collaboration?</p>
  ${button('Discuss your project','contact/?project='+encodeURIComponent(p.title))}
</section>

<a class="next-project" href="${url(next)}" data-project="${next.id}">
  <div>
    <span class="eyebrow">NEXT CASE STUDY</span>
    <h2>${esc(next.title)}</h2>
    <span>${esc(next.category)} ${arrow}</span>
  </div>
  ${img(next)}
</a>

<div class="case-mobile-actions">
  <button id="share-mobile">Share ↗</button>
  <a href="${toUrl('contact/?project='+encodeURIComponent(p.title))}">Request similar ↗</a>
</div>
</article>`;
}
function about(){return `<section class="about-hero section"><div><span class="eyebrow">ABOUT YARA KHAMIS</span><h1>Tactile<br>meets <em>spatial.</em></h1><p class="lead">Graphic design that moves<br>from the page into the world.</p><p>From packaging on a shelf to graphics in an exhibition space, my work explores how brands are seen, experienced and remembered.</p>${button('Explore my work','work/')}</div><div class="about-art" id="about-art-scene"><div class="orbit-layer orbit-behind" aria-hidden="true"><div class="orbit-ring ring-1"><div class="orbit-bead bead-1"></div></div><div class="orbit-ring ring-2"><div class="orbit-bead bead-2"></div></div><div class="orbit-ring ring-3"></div></div><div class="logo-plaque-container" id="plaque-container"><div class="logo-plaque" id="interactive-plaque" tabindex="0" role="button" aria-label="3D Studio Card — Yara Khamis"><div class="plaque-face plaque-front"><div class="plaque-corner tl"></div><div class="plaque-corner br"></div><img src="${toUrl('assets/logo.png')}" alt="YTS Production — Yara Khamis"><span class="plaque-caption">YTS PRODUCTION</span></div><div class="plaque-face plaque-back"><div class="plaque-corner tr"></div><div class="plaque-corner bl"></div><div class="plaque-back-body"><img src="${toUrl('assets/logo.png')}" alt="YTS Production — Yara Khamis" class="plaque-back-logo"><h3>YARA KHAMIS</h3><p>Packaging &amp; Spatial Graphic Design</p><div class="plaque-rule"></div><span class="plaque-tagline">OBJECTS · SPACES · BRANDS</span><div class="plaque-stamp">EST. 2020 · CAIRO / GLOBAL</div></div></div></div></div><div class="orbit-layer orbit-infront" aria-hidden="true"><div class="orbit-ring ring-1"><div class="orbit-bead bead-1"></div></div><div class="orbit-ring ring-2"><div class="orbit-bead bead-2"></div></div><div class="orbit-ring ring-3"></div></div><span class="art-caption">IDENTITY / FORM / EXPERIENCE</span></div></section><section class="about-story section"><div><span class="eyebrow">A PRACTICE ACROSS DISCIPLINES</span><h2>Small details.<br><em>A wider perspective.</em></h2></div><div><p>My portfolio brings together food and product packaging, brand identities, exhibition environments, printed communication and illustration.</p><p>Across these different scales, the focus stays on a clear visual idea, thoughtful detail and a design that belongs to its context.</p></div></section><section class="practice section">${[{n:'01',t:'Packaging design',d:'From food and beverage to cosmetics and gifting.',p:pnum(2),c:'Packaging'},{n:'02',t:'Exhibition experiences',d:'Graphic worlds for pavilions, booths and events.',p:pnum(8),c:'Spaces'},{n:'03',t:'Brand direction',d:'Identities that connect across touchpoints.',p:pnum(50),c:'Branding'}].map(x=>`<a class="practice-item reveal" href="${toUrl('work/?category='+x.c)}"><span class="eyebrow">${x.n}</span>${img(x.p)}<h3>${x.t}</h3><p>${x.d}</p>${arrow}</a>`).join('')}</section><section class="skills section"><div class="section-heading"><div><span class="eyebrow">Craft & Tools</span><h2>Ideas, made <em>visible.</em></h2></div><p>Tools represented across the portfolio.</p></div><div class="skill-grid">${[['Ps','Photoshop','Composition & visual development'],['Ai','Illustrator','Illustration & graphic systems'],['3D','3ds Max','Spatial visualization'],['B','Blender','3D form & presentation']].map(x=>`<div><b>${x[0]}</b><span><h3>${x[1]}</h3><p>${x[2]}</p></span></div>`).join('')}</div></section><section class="about-stats section"><div><strong>${projects.length}</strong><span>PROJECTS IN THE PORTFOLIO</span></div><div><strong>${Math.min(...projects.map(p=>+p.year).filter(Boolean))}–${Math.max(...projects.map(p=>+p.year).filter(Boolean))}</strong><span>PUBLISHED WORK</span></div><div><strong>04</strong><span>CREATIVE DISCIPLINES</span></div></section>${cta()}`;}
const services=[{title:'Packaging design',cat:'Packaging',text:'Distinctive packaging for food, beverages, cosmetics and gifting.',details:'Packaging graphics · Product ranges · Label design · Presentation mockups',n:5},{title:'Exhibition spaces',cat:'Spaces',text:'Visual experiences for exhibition booths, events and environments.',details:'Booth concepts · Spatial graphics · Event environments · Visual presentations',n:8},{title:'Brand identities',cat:'Branding',text:'Considered visual identities across print and digital touchpoints.',details:'Visual identity · Art direction · Catalogues · Brand applications',n:50}];
function servicesPage(){return `<section class="page-head service-head section"><div><span class="eyebrow">SERVICES & PROCESS</span><h1>From first idea<br>to <em>final form.</em></h1><p>Thoughtful design. Tangible impact.</p></div><div class="service-hero-image">${img(pnum(5),'',true)}</div></section><section class="service-cards section">${services.map((s,i)=>`<article class="service-card reveal">${img(pnum(s.n))}<div><span class="eyebrow">0${i+1} / ${s.cat.toUpperCase()}</span><h2>${s.title}</h2><p>${s.text}</p><p class="service-deliverables">${s.details}</p><a class="text-link" href="${toUrl('contact/?service='+s.cat)}">Inquire about this service ↗</a></div></article>`).join('')}</section><section class="workflow section"><div class="section-heading"><div><span class="eyebrow">A COLLABORATIVE PROCESS</span><h2>How we <em>work.</em></h2></div><p>A clear path from understanding the brief<br>to delivering the design.</p></div><div class="workflow-grid">${[['Discover','Understand the brand, audience, scope and creative direction.','wire'],['Explore','Develop visual routes and the form of the experience.','clay'],['Refine','Bring graphics, materials and details into a coherent whole.','colour'],['Deliver','Prepare the agreed final files and project handover.','finish']].map((s,i)=>`<div class="workflow-item reveal"><span class="eyebrow">0${i+1}</span><div class="process-object ${s[2]}" aria-hidden="true"><i></i><b></b></div><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div></section><section class="engagement section"><div><span class="eyebrow">WAYS TO COLLABORATE</span><h2>Built around<br><em>your brief.</em></h2></div><div><h3>Single project</h3><p>A focused collaboration around a defined design brief.</p><h3>Ongoing collaboration</h3><p>Creative support across a series of connected projects.</p>${button('Discuss your project','contact/')}</div></section><section class="faq section"><span class="eyebrow">A FEW USEFUL DETAILS</span><h2>Before we <em>begin.</em></h2>${[['What do you need to get started?','Share your business context, the service you need, intended deliverables, timing and any existing brand assets. The contact form helps you outline the essentials.'],['How is a project quoted?','Scope, deliverables and timing are discussed before a quote is agreed. Send a brief to start the conversation.'],['What files will I receive?','Final formats and source-file requirements are agreed for each project. Include production specifications and supplier requirements in your brief.'],['Can we work on a full product range?','Use the packaging inquiry to describe the number of products, sizes and variants, along with any existing brand guidelines.']].map(x=>`<details><summary>${x[0]}<span>+</span></summary><p>${x[1]}</p></details>`).join('')}</section>${cta()}`;}
function contact(){const q=new URLSearchParams(location.search),project=q.get('project')||'',service=q.get('service')||'Packaging';return `<section class="contact-layout section"><div class="contact-copy"><span class="eyebrow">CONTACT & COLLABORATION</span><h1>Have a vision?<br><em>Let’s shape it.</em></h1><p>Tell me what you have in mind.<br>Let’s find the right form for your next idea.</p><a class="button button-outline" href="${wa('Hi Yara, I’d like to discuss a design project.')}" target="_blank" rel="noopener">Chat on WhatsApp ↗</a><a class="contact-number" href="${wa('Hi Yara!')}" target="_blank" rel="noopener">${config.whatsappDisplay}</a><div class="contact-art"><div class="letter"><img src="${toUrl('assets/logo.png')}" alt="YTS Production"><span>IDEAS<br>BRANDS<br>SPACES<br>PEOPLE</span></div><div class="envelope"></div><span class="contact-art-caption">GOOD IDEAS TRAVEL WELL.</span></div><a class="text-link" href="${config.behance}" target="_blank" rel="noopener">Explore the portfolio on Behance ↗</a></div><div class="brief-panel"><span class="eyebrow">START A CONVERSATION</span><h2>A little about<br><em>your project.</em></h2><div class="form-progress" aria-label="Form progress"><span data-step-marker="1" class="active">01 <b>You</b></span><i></i><span data-step-marker="2">02 <b>Project</b></span><i></i><span data-step-marker="3">03 <b>Review</b></span></div><form id="brief-form"><fieldset data-step="1"><legend>Your details</legend><label>Your name <span>*</span><input name="name" autocomplete="name" required maxlength="100" placeholder="Your full name"></label><label>Email <span>*</span><input name="email" type="email" autocomplete="email" required maxlength="160" placeholder="you@company.com"></label><label>Company <input name="company" autocomplete="organization" maxlength="120" placeholder="Company or brand name"></label><button class="button form-next" type="button" data-next="2">Continue →</button></fieldset><fieldset data-step="2" hidden><legend>Project details</legend><label>What are you looking for?<select name="service">${['Packaging','Spaces','Branding','Other'].map(c=>`<option ${c===service?'selected':''}>${c}</option>`).join('')}</select></label><label>Project budget<input name="budget" maxlength="100" placeholder="Amount and currency, or let’s discuss"></label><label>Ideal timing<input name="timing" maxlength="100" placeholder="Your target date or timeframe"></label><label>Tell me about the project <span>*</span><textarea name="brief" required rows="5" minlength="15" maxlength="4000" placeholder="What are you creating, and what do you need?">${project?esc('I’m interested in a project similar to '+project+'. '):''}</textarea></label><div class="form-actions"><button type="button" class="text-button" data-prev="1">← Back</button><button class="button form-next" type="button" data-next="3">Review brief →</button></div></fieldset><fieldset data-step="3" hidden><legend>Review your brief</legend><div id="brief-review"></div><p class="form-note">WhatsApp will open with your brief ready to review. Tap Send there to share it with Yara.</p><div class="form-actions"><button type="button" class="text-button" data-prev="2">← Edit</button><button class="button" type="submit">Open WhatsApp ↗</button></div><button class="text-button download-brief" type="button" id="download-brief">Download a copy ↓</button></fieldset></form><p class="privacy-note">Your draft stays in this browser tab until you choose to share it.</p></div></section><section class="contact-bottom section"><div class="business-card"><img src="${toUrl('assets/logo.png')}" alt="YTS Production"><div><h3>Yara Khamis</h3><p>Packaging & Spatial Graphic Design</p><span>${config.whatsappDisplay}</span></div></div><button class="button button-outline" id="save-contact">Save contact ↓</button></section>`;}

function startReveal(){revealObserver?.disconnect();const els=$$('.reveal');if(reduced()){els.forEach(e=>e.classList.add('visible'));return;}revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.035});els.forEach(el=>revealObserver.observe(el));}
function toast(s){$('.toast').textContent=s;$('.toast').classList.add('show');setTimeout(()=>$('.toast').classList.remove('show'),3500);}
function setNav(path){$$('.desktop-nav a,.mobile-dock a').forEach(a=>{const target=fromUrl(a.getAttribute('href')||'');const yes=path===target||(path.startsWith('/project/')&&target==='/work/');if(yes)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
function toggleMenu(open){$('#mobile-menu').hidden=!open;$('.menu-toggle').setAttribute('aria-expanded',String(open));$('.menu-toggle').setAttribute('aria-label',open?'Close menu':'Open menu');document.body.classList.toggle('menu-open',open);}
$('.menu-toggle').addEventListener('click',()=>toggleMenu($('#mobile-menu').hidden));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#mobile-menu').hidden)toggleMenu(false);});
function animateEntrance(isCase){
  if(!window.gsap||reduced())return;
  if(isCase){
    const tl=gsap.timeline({defaults:{ease:'power3.out'}});
    tl.fromTo('.case-breadcrumb',{opacity:0,y:-12},{opacity:1,y:0,duration:0.45})
      .fromTo('.case-heading h1, .case-heading .eyebrow, .case-subtitle',{opacity:0,y:26},{opacity:1,y:0,duration:0.65,stagger:0.07},'-=0.3')
      .fromTo('.case-actions > *',{opacity:0,scale:0.92},{opacity:1,scale:1,duration:0.4,stagger:0.05},'-=0.35')
      .fromTo('.meta-item',{opacity:0,y:14},{opacity:1,y:0,duration:0.45,stagger:0.03},'-=0.3')
      .fromTo('.narrative-block',{opacity:0,y:20},{opacity:1,y:0,duration:0.55,stagger:0.08},'-=0.25')
      .fromTo('.specs-card',{opacity:0,y:20},{opacity:1,y:0,duration:0.55,stagger:0.08},'-=0.25')
      .fromTo('.case-hero .ambient-glow',{opacity:0,scale:0.85},{opacity:0.65,scale:1,duration:0.8,ease:'sine.out'},'-=0.4');
  }else{
    gsap.fromTo(main,{opacity:0,y:12},{opacity:1,y:0,duration:0.45,ease:'power2.out',clearProps:'all'});
  }
}
function saveScroll(){history.replaceState({...history.state,scroll:scrollY},'',location.href);}
async function navigate(href,{pop=false,targetScroll=null}={}){
  const u=new URL(href,location.origin);
  if(!pop){saveScroll();history.pushState({scroll:targetScroll??0},'',u.pathname+u.search);}
  toggleMenu(false);
  document.body.classList.add('nav-transitioning');
  const prog=$('#reading-progress');
  if(prog){prog.style.width='50%';prog.style.opacity='1';}
  const change=async()=>{
    await render();
    if(transitionProject&&fromUrl(u.pathname).startsWith('/project/')){
      const heroCover=$('.cover-open img')||$('.cover-open');
      if(heroCover)heroCover.style.setProperty('view-transition-name','selected-project');
    }
    const targetY=targetScroll!==null?targetScroll:(pop?(history.state?.scroll||0):0);
    window.scrollTo({top:targetY,behavior:'instant'});
    if(!pop)main.focus({preventScroll:true});
  };
  const isCase=fromUrl(u.pathname).startsWith('/project/');
  if(document.startViewTransition&&!reduced()&&!inTransition){
    inTransition=true;
    const t=document.startViewTransition(change);
    try{await t.finished;}
    catch{}
    finally{
      inTransition=false;
      transitionProject=null;
      document.body.classList.remove('nav-transitioning');
      if(prog){
        prog.style.width='100%';
        setTimeout(()=>{if(!document.body.classList.contains('case-page'))prog.style.width='0%';},260);
      }
      $$('[style*="view-transition-name"]').forEach(el=>el.style.removeProperty('view-transition-name'));
      animateEntrance(isCase);
    }
  }else{
    await change();
    document.body.classList.remove('nav-transitioning');
    if(prog){
      prog.style.width='100%';
      setTimeout(()=>{if(!document.body.classList.contains('case-page'))prog.style.width='0%';},260);
    }
    animateEntrance(isCase);
  }
}
window.addEventListener('popstate',()=>navigate(location.href,{pop:true}));history.scrollRestoration='manual';
document.addEventListener('click',e=>{
  const a=e.target.closest('a');
  if(!a||a.target||a.hasAttribute('download')||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;
  const u=new URL(a.href,location.href);
  if(u.origin!==location.origin||u.pathname.includes('/lab/'))return;
  if(a.id==='back-top'){e.preventDefault();window.scrollTo({top:0,behavior:reduced()?'instant':'smooth'});return;}
  if(u.hash)return;
  e.preventDefault();
  if(a.hasAttribute('data-back-work')&&sessionStorage.getItem('work-url')){
    navigate(sessionStorage.getItem('work-url'),{targetScroll:Number(sessionStorage.getItem('work-scroll')||0)});
    return;
  }
  if(fromUrl(location.pathname)==='/work/'){
    sessionStorage.setItem('work-url',location.pathname+location.search);
    sessionStorage.setItem('work-scroll',String(scrollY));
    sessionStorage.setItem('work-limit',String(filterLimit));
  }
  const projectParent=a.closest('[data-project]');
  const pId=a.dataset.project||projectParent?.dataset?.project;
  if(pId){
    transitionProject=pId;
    const projectImg=(projectParent||a).querySelector('img');
    if(projectImg){
      projectImg.style.viewTransitionName='selected-project';
    }else{
      a.style.viewTransitionName='selected-project';
    }
  }
  navigate(u.href);
});
function workParam(key,val){const u=new URL(location.href);if(val&&val!=='All'&&val!=='grid'&&val!=='curated')u.searchParams.set(key,val);else u.searchParams.delete(key);history.replaceState(history.state,'',u.pathname+u.search);}
let plaqueRafId=null;
let plaqueAngle=0;
let orbit1Angle=0;
let orbit2Angle=0;
let orbit3Angle=0;
let lastPlaqueTime=0;
function bindAboutCard(){
  const scene=$('#about-art-scene');
  const plaque=$('#interactive-plaque');
  if(!scene||!plaque)return;
  if(plaqueRafId){
    cancelAnimationFrame(plaqueRafId);
    plaqueRafId=null;
  }
  plaque.style.transformStyle='preserve-3d';
  plaque.style.willChange='transform';
  lastPlaqueTime=performance.now();
  function spinLoop(now){
    const el=$('#interactive-plaque');
    const sc=$('#about-art-scene');
    if(!el||!sc){
      plaqueRafId=null;
      return;
    }
    const dt=Math.min((now-(lastPlaqueTime||now))/1000,0.1);
    lastPlaqueTime=now;
    plaqueAngle=(plaqueAngle+(dt*22.5))%360;
    orbit1Angle=(orbit1Angle+(dt*26))%360;
    orbit2Angle=(orbit2Angle-(dt*16))%360;
    orbit3Angle=(orbit3Angle+(dt*10))%360;
    el.style.transform=`rotateX(6deg) rotateY(${plaqueAngle.toFixed(2)}deg)`;
    sc.style.setProperty('--orbit-1',`${orbit1Angle.toFixed(2)}deg`);
    sc.style.setProperty('--orbit-2',`${orbit2Angle.toFixed(2)}deg`);
    sc.style.setProperty('--orbit-3',`${orbit3Angle.toFixed(2)}deg`);
    plaqueRafId=requestAnimationFrame(spinLoop);
  }
  plaqueRafId=requestAnimationFrame(spinLoop);
}
async function render(){const ver=++routeVersion;currentPath=fromUrl(location.pathname);let p;if(currentPath==='/')main.innerHTML=home();else if(currentPath==='/work/'){filterLimit=Number(sessionStorage.getItem('work-limit')||12);main.innerHTML=work();updateWork();$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{workParam('category',b.dataset.filter);$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));updateWork(true);}));let timer;$('#search').addEventListener('input',e=>{const value=e.target.value;clearTimeout(timer);timer=setTimeout(()=>{if(ver!==routeVersion)return;workParam('q',value);updateWork(true);},160);});$('#sort').addEventListener('change',e=>{workParam('sort',e.target.value);updateWork(true);});$$('[data-view]').forEach(b=>b.addEventListener('click',()=>{workParam('view',b.dataset.view);$$('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#work-grid').classList.toggle('focus-grid',b.dataset.view==='focus');}));$('#load-more').addEventListener('click',()=>{filterLimit+=12;const top=scrollY;updateWork();window.scrollTo({top,behavior:'instant'});});  }else if(currentPath.startsWith('/project/')){p=projects.find(p=>p.id===currentPath.split('/')[2]);main.innerHTML=p?projectPage(p):notFound();if(p){$$('[data-image]').forEach(b=>b.addEventListener('click',()=>openImages(p.images,Number(b.dataset.image),p.title,b)));$$('.swatch-item').forEach(b=>b.addEventListener('click',async()=>{const hex=b.dataset.hex;try{await navigator.clipboard.writeText(hex);toast(`Copied ${hex} to clipboard!`);}catch{toast(hex);}}));const share=async()=>{const data={title:p.title+' — Yara Khamis',url:location.href};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(data.url);toast('Project link copied.');}}catch(e){if(e.name!=='AbortError')toast('Copy the address from your browser to share this project.');}};$('#share-project')?.addEventListener('click',share);$('#share-mobile')?.addEventListener('click',share);}}else if(currentPath==='/about/'){main.innerHTML=about();bindAboutCard();}else if(currentPath==='/services/')main.innerHTML=servicesPage();else if(currentPath==='/contact/'){main.innerHTML=contact();bindContact();}else main.innerHTML=notFound();document.body.classList.toggle('case-page',!!p);if(p)document.documentElement.style.setProperty('--brand-accent',p.caseStudy?.accent||'var(--gold)');else document.documentElement.style.removeProperty('--brand-accent');setNav(currentPath);document.title=p?`${p.title} — Yara Khamis`:currentPath==='/'?'Yara Khamis — Packaging, Spaces & Brand Identity':`${currentPath.split('/')[1].replace(/^./,c=>c.toUpperCase())} — Yara Khamis`;startReveal();}
function notFound(){return `<section class="section empty-state"><span class="eyebrow">404 / A DIFFERENT DIRECTION</span><h1>Let’s find<br><em>your way back.</em></h1>${button('Explore the portfolio','work/')}</section>`;}
function download(name,text,type='text/plain'){const blob=new Blob([text],{type}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function bindContact(){const f=$('#brief-form');f.noValidate=true;function fields(){return Object.fromEntries(new FormData(f));}function brief(){const v=fields();return `Hi Yara, I’d like to discuss a design project.\n\nName: ${v.name}\nEmail: ${v.email}\nCompany: ${v.company||'—'}\nService: ${v.service}\nBudget: ${v.budget||'Let’s discuss'}\nTiming: ${v.timing||'Flexible'}\n\n${v.brief}`;}function step(n){$$('[data-step]',f).forEach(el=>el.hidden=el.dataset.step!==String(n));$$('[data-step-marker]').forEach(el=>el.classList.toggle('active',Number(el.dataset.stepMarker)<=n));if(n===3)$('#brief-review').textContent=brief();const active=$(`[data-step="${n}"]`,f);$('input,select,button',active)?.focus({preventScroll:true});}$$('[data-next]',f).forEach(b=>b.addEventListener('click',()=>{const visible=$('[data-step]:not([hidden])',f);for(const field of $$('input,textarea,select',visible)){if(!field.checkValidity()){field.reportValidity();return;}}step(Number(b.dataset.next));}));$$('[data-prev]',f).forEach(b=>b.addEventListener('click',()=>step(Number(b.dataset.prev))));f.addEventListener('submit',e=>{e.preventDefault();const active=$('[data-step]:not([hidden])',f);if(active.dataset.step!=='3'){$('.form-next',active)?.click();return;}for(const field of $$('input,textarea,select',f)){if(!field.checkValidity()){step(Number(field.closest('[data-step]').dataset.step));field.reportValidity();return;}}const tab=window.open(wa(brief()),'_blank','noopener,noreferrer');toast('Continue in WhatsApp to review and send your brief.');});$('#download-brief').addEventListener('click',()=>download('Project-brief-for-Yara-Khamis.txt',brief()));$('#save-contact').addEventListener('click',()=>download('Yara-Khamis.vcf',`BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Yara Khamis\r\nORG:YTS Production\r\nTEL;TYPE=CELL:+${config.whatsapp}\r\nURL:${config.behance}\r\nEND:VCARD\r\n`,'text/vcard'));}
function openImages(items,index,title,button){lightboxItems=items;lightboxIndex=index;opener=button;$('#lightbox-title').textContent=title;showImage();$('#lightbox').showModal();}
function showImage(){resetMotion();const im=lightboxItems[lightboxIndex];$('#lightbox-image').src=im.src;$('#lightbox-image').alt=$('#lightbox-title').textContent+` — image ${lightboxIndex+1}`;$('#lightbox-count').textContent=`${lightboxIndex+1} / ${lightboxItems.length}`;$('#play-motion').hidden=!im.motion;$('#play-motion').textContent='Play original animation ▷';}
$('#lightbox-close').addEventListener('click',()=>$('#lightbox').close());$('#lightbox-prev').addEventListener('click',()=>{lightboxIndex=(lightboxIndex-1+lightboxItems.length)%lightboxItems.length;showImage();});$('#lightbox-next').addEventListener('click',()=>{lightboxIndex=(lightboxIndex+1)%lightboxItems.length;showImage();});$('#play-motion').addEventListener('click',()=>{const im=lightboxItems[lightboxIndex],playing=$('#play-motion').dataset.playing==='yes';$('#lightbox-image').src=playing?im.src:im.motion;$('#play-motion').dataset.playing=playing?'no':'yes';$('#play-motion').textContent=playing?'Play original animation ▷':'Show still image Ⅱ';});$('#lightbox').addEventListener('close',()=>{$('#lightbox-image').src='';$('#play-motion').dataset.playing='no';opener?.focus();});$('#lightbox').addEventListener('keydown',e=>{if(e.key==='ArrowRight')$('#lightbox-next').click();if(e.key==='ArrowLeft')$('#lightbox-prev').click();});$('#lightbox').addEventListener('click',e=>{if(e.target===$('#lightbox'))$('#lightbox').close();});
document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||reduced())return;const visual=e.target.closest('.project-visual');if(!visual)return;const r=visual.getBoundingClientRect();visual.style.setProperty('--rx',`${-(e.clientY-r.top-r.height/2)/r.height*3}deg`);visual.style.setProperty('--ry',`${(e.clientX-r.left-r.width/2)/r.width*3}deg`);});document.addEventListener('pointerout',e=>{const visual=e.target.closest('.project-visual');if(visual&&!visual.contains(e.relatedTarget)){visual.style.setProperty('--rx','0deg');visual.style.setProperty('--ry','0deg');}});
$('#year').textContent=new Date().getFullYear();
const motionVideo=document.createElement('video');motionVideo.id='lightbox-video';motionVideo.controls=true;motionVideo.playsInline=true;motionVideo.loop=true;motionVideo.hidden=true;$('.lightbox-stage').insertBefore(motionVideo,$('#lightbox-next'));
function resetMotion(){motionVideo.pause();motionVideo.removeAttribute('src');motionVideo.load();motionVideo.hidden=true;$('#lightbox-image').hidden=false;$('#play-motion').dataset.playing='no';}
$('#lightbox').addEventListener('close',resetMotion);
$('#play-motion').addEventListener('click',e=>{const im=lightboxItems[lightboxIndex];if(im?.motionType!=='video')return;e.stopImmediatePropagation();const playing=!motionVideo.hidden;if(playing){resetMotion();$('#play-motion').textContent='Play original animation ▷';}else{$('#lightbox-image').hidden=true;motionVideo.hidden=false;motionVideo.src=im.motion;motionVideo.play().catch(()=>toast('Press play in the video player.'));$('#play-motion').textContent='Show still image Ⅱ';}},true);
window.addEventListener('scroll',()=>{const prog=$('#reading-progress');if(!prog)return;const max=document.documentElement.scrollHeight-window.innerHeight;const pct=max>0?(window.scrollY/max)*100:0;prog.style.width=pct+'%';},{passive:true});
const cursor=$('#custom-cursor');const cursorText=$('#cursor-text');
if(cursor&&window.matchMedia('(pointer: fine)').matches){let mx=-100,my=-100,cx=-100,cy=-100;window.addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;});function loopCursor(){cx+=(mx-cx)*0.22;cy+=(my-cy)*0.22;cursor.style.transform=`translate3d(${cx}px,${cy}px,0)`;requestAnimationFrame(loopCursor);}requestAnimationFrame(loopCursor);document.addEventListener('mouseover',e=>{const plaqueCard=e.target.closest('#interactive-plaque');const vid=e.target.closest('.case-video-wrapper');const imgBtn=e.target.closest('.image-open');const link=e.target.closest('a, button, .swatch-item');if(plaqueCard){cursor.className='custom-cursor cursor-active cursor-image';cursorText.textContent='3D ✦';}else if(vid){cursor.className='custom-cursor cursor-active cursor-video';cursorText.textContent='PLAY ▷';}else if(imgBtn){cursor.className='custom-cursor cursor-active cursor-image';cursorText.textContent='EXPAND ⤢';}else if(link){cursor.className='custom-cursor cursor-active cursor-link';cursorText.textContent='';}else{cursor.className='custom-cursor';cursorText.textContent='';}});document.addEventListener('mouseleave',()=>{cursor.style.opacity='0';});document.addEventListener('mouseenter',()=>{cursor.style.opacity='1';});}
let heroFrame=false;window.addEventListener('scroll',()=>{if(heroFrame||reduced())return;heroFrame=true;requestAnimationFrame(()=>{heroFrame=false;const hero=$('.hero'),frame=$('.hero-art iframe');if(hero&&frame){const progress=Math.max(0,Math.min(1,-hero.getBoundingClientRect().top/(hero.offsetHeight*.85)));frame.contentWindow?.postMessage({type:'hero-progress',value:progress},location.origin);}});},{passive:true});
try{
  const r=await fetch(toUrl('data.json'));
  if(!r.ok)throw Error('Project data unavailable');
  const raw=await r.json();
  projects=raw.map(p=>{
    const copy={...p};
    if(copy.cover){
      copy.cover={
        ...copy.cover,
        src:toUrl(copy.cover.src),
        thumb:toUrl(copy.cover.thumb),
        motion:copy.cover.motion?toUrl(copy.cover.motion):undefined
      };
    }
    if(Array.isArray(copy.images)){
      copy.images=copy.images.map(im=>({
        ...im,
        src:toUrl(im.src),
        thumb:toUrl(im.thumb),
        motion:im.motion?toUrl(im.motion):undefined
      }));
    }
    if(copy.caseStudy?.featuredVideo){
      copy.caseStudy.featuredVideo={
        ...copy.caseStudy.featuredVideo,
        src:toUrl(copy.caseStudy.featuredVideo.src)
      };
    }
    return copy;
  });
  await render();
  animateEntrance(currentPath.startsWith('/project/'));
  if(history.state?.scroll)window.scrollTo(0,history.state.scroll);
}catch(e){
  console.error(e);
  main.innerHTML=`<section class="section empty-state"><h1>The portfolio is<br><em>taking a moment.</em></h1><p>Please reload, or view the original portfolio.</p><a class="button" href="${config.behance}">View Behance ↗</a></section>`;
}
