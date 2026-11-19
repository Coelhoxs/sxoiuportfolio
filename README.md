# Sxoiu Coelho — Portfolio website

Static HTML + CSS + JS built from the Figma file **Website** (desktop + phone frames).
No build step, no dependencies. Fonts (Exo, Courier Prime, Inter — SIL OFL) are self-hosted in `assets/fonts`.

## Pages
| Page | File | Figma frames |
|---|---|---|
| Home | `index.html` | Homescreen · Home – Phone (new) |
| UX Case Studies | `ux.html` | UX v2 · UX – Phone |
| Case study: Where is My Break? | `case-study-wimb.html` | CaseStudy/WIMB · Case Study WIMB – Phone |
| Case study: Home-Finder App | `case-study-home-finder.html` | CaseStudy/Homefinder · Case Study Home-Finder – Phone |
| UI Showcase | `ui.html` | UI · UI – Phone |
| Illustrations | `illustrations.html` | Artgallery · Art Gallery – Phone |
| Fanzine | `fanzine.html` | Fanzine v2 · Fanzine – Phone |
| Contact | `contact.html` | Contact v2 · Contact – Phone |

Navigation: the menu bar's **Work** tab goes to the UX page; the pills on the home page lead to UI, UX, Illustrations and Fanzine.

## Files
| File | What it is |
|---|---|
| `styles.css` | Shared tokens (colors, radii, spacing), menu bar, buttons, phone carousel, home page layout |
| `pages.css` | Layout of all inner pages |
| `animations.css` | Animations exported from Figma's motion timeline |
| `script.js` | All interactions: carousel, gallery, fanzine page turner, videos, menu, contact form |
| `assets/case/` | The case studies, rendered from Figma section by section (desktop `-d-`, phone `-m-`) |

## Things to fill in
1. **Screen recordings (UI page)** — Figma can't export video, so the page shows a still frame. Save the videos as
   `assets/video/that-socks.mp4` and `assets/video/motion-carousel.mp4` (MP4/H.264, ideally under 10 MB each); they then play automatically.
2. **Fanzine pages** — in Figma only the cover is filled in. Save page images to `assets/fanzine/` and list them in
   `FANZINE.pages` at the top of `script.js` (e.g. `2: "assets/fanzine/page-02.webp"`). Spreads appear once both pages exist; pages 6–7 are one A4 image.
3. **Contact page** — LinkedIn and "Download CV" are hidden until you add them: put your URL into `contact.html`
   (search for `YOUR-PROFILE`) and/or your CV at `assets/cv.pdf`, then remove the `hidden` attribute.
4. **Live prototype links** — the "Try the live prototype" / "Prototype Link" buttons inside the case-study images aren't clickable.
   In each `case-study-*.html` paste the URL into the `<p class="study__proto" data-proto hidden>` link and remove `hidden`; a real button appears under the menu.

## Updating a case study after changing it in Figma
The case studies are images of the Figma sections. After editing in Figma, ask Claude to re-export them, or export each
`Section / …` frame yourself (PNG, 1×, desktop; 1×–2× phone), convert to WebP and replace the matching file in `assets/case/`.

## Preview locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Publish on GitHub Pages
1. Create a public repo on GitHub, e.g. `portfolio` (or `<your-username>.github.io` for a root URL).
2. From this folder run `./deploy.sh https://github.com/<your-username>/<repo>.git`
   (or upload all files via GitHub → *Add file → Upload files*).
3. On GitHub: **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.
4. After ~1 minute the site is live at `https://<your-username>.github.io/<repo>/`.

## Other settings
- **Contact form email (home page):** `CONTACT_EMAIL` at the top of `script.js`. It opens the visitor's email app; for direct delivery, use a free Formspree form.
- **Mobile breakpoint:** 820 px.
