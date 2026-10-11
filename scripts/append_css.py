with open('dist/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

extra_css = """
/* --- Case Study Redesign Styles --- */
.case-study-page { display: block; width: 100%; }
.case-breadcrumb { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; font-size: 11px; color: var(--muted); letter-spacing: 0.5px; }
.breadcrumb-sep { opacity: 0.4; }
.case-badge { background: rgba(212, 179, 106, 0.12); color: var(--gold); border: 1px solid rgba(212, 179, 106, 0.3); padding: 3px 10px; border-radius: 999px; font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; font-weight: 600; }
.case-num { margin-left: auto; font-size: 10px; letter-spacing: 1.5px; color: var(--gold); text-transform: uppercase; }
.case-subtitle { font-family: var(--serif, Georgia, serif); font-style: italic; font-size: 22px; color: var(--muted); margin-top: 8px; font-weight: 400; }
.case-meta-grid { display: grid; grid-template-columns: repeat(5, 1fr) 1.5fr; gap: 16px; margin-top: 36px; padding: 24px; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; }
.meta-item { display: flex; flex-direction: column; gap: 6px; }
.meta-label { font-size: 8.5px; letter-spacing: 1.4px; color: var(--gold); text-transform: uppercase; font-weight: 600; }
.meta-value { font-size: 13px; color: var(--ink); line-height: 1.4; }
.meta-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tool-tag { background: #191b22; color: #c9c7c5; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 4px; padding: 3px 8px; font-size: 10.5px; letter-spacing: 0.2px; }

/* Video Showcase */
.case-video-section { padding-top: 40px; padding-bottom: 40px; }
.video-caption-lead { max-width: 650px; color: var(--muted); font-size: 13px; line-height: 1.8; }
.case-video-wrapper { position: relative; background: #000; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6); margin-top: 24px; }
.video-badge-pill { position: absolute; top: 18px; left: 20px; z-index: 4; background: rgba(11, 12, 16, 0.85); backdrop-filter: blur(8px); color: var(--gold); border: 1px solid rgba(212, 179, 106, 0.4); padding: 5px 12px; border-radius: 999px; font-size: 10px; letter-spacing: 1.5px; font-weight: 600; pointer-events: none; }
.case-showcase-video { width: 100%; max-height: 720px; aspect-ratio: 16 / 9; display: block; object-fit: cover; background: #050608; }

/* Narrative Grid */
.case-narrative-section { padding-top: 50px; padding-bottom: 50px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.narrative-grid { display: grid; grid-template-columns: 1fr 1.25fr; gap: 36px; }
.narrative-block { background: var(--card); border: 1px solid var(--line); padding: 36px 32px; border-radius: 10px; display: flex; flex-direction: column; }
.block-header { display: flex; align-items: baseline; gap: 16px; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); padding-bottom: 16px; }
.block-num { font-family: var(--serif, Georgia, serif); font-size: 32px; color: var(--gold); line-height: 1; font-weight: 300; }
.block-header h3 { font-size: 22px; letter-spacing: -0.5px; margin: 4px 0 0; color: var(--ink); }
.block-header .eyebrow { margin-bottom: 0; }
.narrative-block p { line-height: 1.9; color: #c4c2be; font-size: 13.5px; white-space: pre-line; }
.team-credit { margin-top: 24px; padding: 14px 18px; background: var(--panel); border-left: 2px solid var(--gold); border-radius: 0 6px 6px 0; font-size: 12px; color: var(--muted); line-height: 1.6; }

/* Highlights Grid */
.case-highlights-section { padding-top: 50px; padding-bottom: 40px; }
.highlights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin-top: 28px; }
.highlight-card { background: var(--panel); border: 1px solid var(--line); padding: 24px; border-radius: 8px; transition: transform 0.3s ease, border-color 0.3s ease; display: flex; flex-direction: column; gap: 12px; }
.highlight-card:hover { transform: translateY(-3px); border-color: rgba(212, 179, 106, 0.35); }
.highlight-idx { font-size: 11px; letter-spacing: 1.5px; color: var(--gold); font-weight: 600; }
.highlight-card p { margin: 0; font-size: 13px; line-height: 1.7; color: #dfdeda; }

/* Gallery Intro & Grid */
.gallery-intro { margin-bottom: 30px; }
.gallery-intro h2 { font-size: 32px; margin-top: 6px; }
.gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px 24px; }
.gallery-grid figure.wide { grid-column: 1 / -1; }

@media (max-width: 1024px) {
  .case-meta-grid { grid-template-columns: 1fr 1fr; }
  .narrative-grid { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .case-breadcrumb { flex-wrap: wrap; gap: 8px; }
  .case-num { margin-left: 0; width: 100%; }
  .case-meta-grid { grid-template-columns: 1fr; padding: 18px; }
  .gallery-grid { grid-template-columns: 1fr; }
  .case-video-wrapper { border-radius: 8px; }
  .narrative-block { padding: 24px 20px; }
}
"""

if "/* --- Case Study Redesign Styles --- */" not in css:
    with open('dist/style.css', 'w', encoding='utf-8') as f:
        f.write(css + "\n" + extra_css)
    print("Appended case study styles to dist/style.css successfully.")
else:
    print("Styles already present.")
