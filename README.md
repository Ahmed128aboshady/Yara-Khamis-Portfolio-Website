# Yara Khamis portfolio

English responsive portfolio, built from the supplied UI concepts, logo and portfolio archive.

## Run locally

On Windows, double-click `start.cmd`, then open http://127.0.0.1:4174/.
Alternatively, with Node.js installed: `node server.cjs`.
Keep the server running while viewing. Opening index.html directly is not supported.

## Included

- Home, Work, About, Services, Contact and 86 individual project routes.
- 841 portfolio images with optimized previews; 28 motion clips converted to MP4.
- Search, categories, sorting, gallery modes, lightbox and project sharing.
- Desktop and mobile layouts, reduced-motion support and page transitions.
- Interactive Al-Amir packaging study with rotation, zoom, opening and separated layers.
- Three-step project brief, downloadable brief/contact card and WhatsApp handoff to +20 12 29610096. Visitors review and send in WhatsApp themselves.

The 3D packaging is a conceptual reconstruction using supplied artwork; it is not a production-accurate CAD model. Other projects display their supplied images and motion assets. There is no backend, CMS, email delivery or analytics.

## Edit

- `dist/config.js`: contact and identity settings.
- `dist/data.json`: project text, categories and assets.
- `dist/app.js`: page templates and interaction logic.
- `dist/style.css`: responsive visual styling.
- `template.html`: shared page shell. Run `node build.mjs` after modifying it or adding project routes.
- `dist/lab/`: interactive Three.js packaging scene.

Deploy the contents of `dist` at the root of a static HTTPS host with directory index support. The included local server is for preview. Hosting was not completed in this session because approval policy blocked the source upload step.

## Validation

All 91 route responses and 1,710 referenced image/video files passed the automated check (see verification.json). Browser checks covered desktop/home, mobile layout, filtering/search, project navigation and contact form validation/review. No WhatsApp message was sent. Mobile review used a simulated viewport, not a physical device.

## Dependencies and attribution

Three.js 0.180.0 and GSAP 3.13.0 are bundled locally. Preserve their distributed license notices. Three.js: https://threejs.org/ ; GSAP: https://gsap.com/standard-license/ . Portfolio artwork and YTS logo remain attributable to their original creators; existing project team credits were retained.
