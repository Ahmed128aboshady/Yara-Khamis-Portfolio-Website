with open('dist/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

extra_css = """
/* --- Dynamic High Impression Features --- */
/* 1. Reading Progress Bar */
#reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, var(--brand-accent, var(--gold)), #ffffff);
  z-index: 99999;
  transition: width 0.05s linear;
  box-shadow: 0 0 10px var(--brand-accent, var(--gold));
  pointer-events: none;
}

/* 2. Custom Magnetic Fluid Cursor */
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(212, 179, 106, 0.45);
  background: rgba(212, 179, 106, 0.05);
  backdrop-filter: blur(2px);
  pointer-events: none;
  z-index: 99998;
  margin-top: -16px;
  margin-left: -16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.25s cubic-bezier(0.2, 1, 0.3, 1), height 0.25s cubic-bezier(0.2, 1, 0.3, 1), background 0.25s ease, border-color 0.25s ease, opacity 0.2s ease;
}
.custom-cursor #cursor-text {
  font-size: 8px;
  letter-spacing: 1.2px;
  font-weight: 700;
  color: #0b0c10;
  opacity: 0;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}
.custom-cursor.cursor-link {
  width: 50px;
  height: 50px;
  margin-top: -25px;
  margin-left: -25px;
  background: rgba(212, 179, 106, 0.15);
  border-color: var(--brand-accent, var(--gold));
}
.custom-cursor.cursor-image {
  width: 76px;
  height: 76px;
  margin-top: -38px;
  margin-left: -38px;
  background: var(--brand-accent, var(--gold));
  border-color: transparent;
  box-shadow: 0 0 25px rgba(212, 179, 106, 0.4);
}
.custom-cursor.cursor-image #cursor-text {
  opacity: 1;
}
.custom-cursor.cursor-video {
  width: 80px;
  height: 80px;
  margin-top: -40px;
  margin-left: -40px;
  background: var(--brand-accent, var(--gold));
  border-color: transparent;
  box-shadow: 0 0 30px rgba(212, 179, 106, 0.5);
}
.custom-cursor.cursor-video #cursor-text {
  opacity: 1;
}
@media (pointer: coarse), (max-width: 1024px) {
  .custom-cursor { display: none !important; }
}

/* 3. Ambient Glow Layer */
.ambient-glow-wrapper {
  position: relative;
  width: 100%;
}
.ambient-glow {
  position: absolute;
  inset: -12% -8%;
  filter: blur(65px);
  opacity: 0.65;
  z-index: 0;
  pointer-events: none;
  border-radius: 50%;
  transition: opacity 0.5s ease;
}
.ambient-glow-wrapper:hover .ambient-glow,
.case-video-wrapper:hover .ambient-glow {
  opacity: 0.95;
  filter: blur(75px);
}
.case-hero .image-open {
  position: relative;
  z-index: 1;
}

/* 4. Design System & Specs Section */
.case-specs-section {
  padding-top: 50px;
  padding-bottom: 50px;
  border-top: 1px solid var(--line);
}
.specs-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 32px;
  margin-top: 28px;
}
.specs-card {
  background: var(--card);
  border: 1px solid var(--line);
  padding: 32px;
  border-radius: 10px;
}
.specs-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 16px;
}
.specs-icon {
  color: var(--brand-accent, var(--gold));
  font-size: 18px;
}
.specs-header h3 {
  font-size: 20px;
  margin: 0;
  color: var(--ink);
}
.copy-hint {
  margin-left: auto;
  font-size: 9px;
  letter-spacing: 1px;
  color: var(--muted);
  text-transform: uppercase;
}
.palette-swatches {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.swatch-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px 14px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.swatch-item:hover {
  transform: translateY(-2px);
  border-color: var(--brand-accent, var(--gold));
  background: #1d1e26;
}
.swatch-color {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
  flex-shrink: 0;
}
.swatch-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}
.swatch-name {
  font-size: 12px;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.swatch-hex {
  font-size: 10px;
  font-family: monospace;
  color: var(--brand-accent, var(--gold));
  letter-spacing: 0.5px;
}
.swatch-note {
  font-size: 9px;
  color: var(--muted);
  line-height: 1.2;
}

/* Finishes & Typography Content */
.finishes-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.spec-label {
  display: block;
  font-size: 8.5px;
  letter-spacing: 1.4px;
  color: var(--brand-accent, var(--gold));
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 10px;
}
.type-spec-value {
  font-family: var(--serif, Georgia, serif);
  font-size: 17px;
  color: var(--ink);
  line-height: 1.5;
  margin: 0;
  background: var(--panel);
  padding: 14px 18px;
  border-radius: 6px;
  border: 1px solid var(--line);
}
.finishes-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.finish-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--panel);
  border: 1px solid var(--line);
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 11px;
  color: #dfdeda;
}
.finish-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 6px var(--brand-accent, var(--gold));
}

@media (max-width: 900px) {
  .specs-grid { grid-template-columns: 1fr; }
  .palette-swatches { grid-template-columns: 1fr; }
}
"""

if "/* --- Dynamic High Impression Features --- */" not in css:
    with open('dist/style.css', 'w', encoding='utf-8') as f:
        f.write(css + "\n" + extra_css)
    print("Appended dynamic impression styles to dist/style.css")
else:
    print("Styles already present.")
