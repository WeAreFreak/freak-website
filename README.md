# Freak website: hosting notes

**Delivered as two zips.** Unzip both in the same place: `freak-website-1-site.zip` has everything except the full-length case study films, and `freak-website-2-films.zip` adds those films to `freak-website/vid/`. The site needs both.

This folder is the complete Freak website: one page (`index.html`) with a 3D world for each section, plus its images, films and 3D assets. It is a static site, with no build step, no server code and no database. Upload the contents of this folder to the web root so that `index.html` sits at the top level.

## What's in the folder

| Path | What it is |
| --- | --- |
| `index.html` | The whole site: layout, styles, case study content and all the 3D and sound code |
| `img/` | Case study images (`img/cs/`), the desert panorama, the wordmark, the world map data and the F logo model |
| `vid/` | Case study films and the short hover previews |
| `w/` | The three page worlds: Studio (Capabilities), City (Contact) and Orbit (About) |
| `vendor/three/` | three.js 0.160.0 and the add-ons the site uses, so nothing loads from a JavaScript CDN |

The 3D models are stored as base64 text (`.txt`) rather than `.glb`. The page decodes them itself, so no special MIME type is needed.

## Hosting requirements

- **Serve over HTTP(S), not from the file system.** Opening `index.html` by double-clicking won't work, because the page uses ES modules and `fetch`. To test locally, run `npx serve .` or `python3 -m http.server` in this folder.
- **Use HTTPS on the live domain.**
- **MIME types:** `.js` must be served as `text/javascript`, because browsers refuse module scripts with any other type. Also check `.webp` (`image/webp`), `.mp4` (`video/mp4`), `.json` (`application/json`) and `.txt` (`text/plain`). Any standard host gets these right.
- **Byte-range requests** for the `.mp4` files, so the films can be scrubbed. This is standard on every major host.
- **Compression:** turn on gzip or Brotli for `.html`, `.js`, `.json` and `.txt`. The images and films are already compressed.
- **Caching:**
  - `index.html`: no-cache or a short cache, so updates show straight away.
  - `img/`, `vid/` and `w/`: about a week. The file names aren't fingerprinted, so replacing a file keeps its name.
  - `vendor/`: a year.
- **No rewrites needed.** Sections and case studies use hash URLs (`/#work`, `/#work-hoover`, `/#capabilities`, `/#contact`, `/#about`), so every route is the same `index.html`.
- **External requests:** only Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`). If you set a Content Security Policy, allow those two, plus `blob:` in `img-src` and `connect-src` (the page caches the world files as blob URLs).

Any static host works: Netlify, Vercel, Cloudflare Pages, AWS S3 with CloudFront, or Freak's existing web server.

## DNS and go-live

1. Deploy the folder, then check it on the host's preview URL. Check the four sections, a case study, the films, and the sound button (bottom right).
2. A day or so before, lower the TTL on the domain's current records (for example to 300 seconds) so the switch takes effect quickly.
3. Add the custom domain in the host's dashboard. Then, at the DNS provider:
   - Point the apex (`wearefreak.com`) at the host with the A, ALIAS or ANAME record the host gives you.
   - Point `www` at the host with a CNAME.
4. Turn on the host's SSL certificate. Pick one canonical address and redirect the other to it (for example `www` to the apex).
5. **Leave the email records alone.** Don't change or remove the MX, SPF, DKIM or DMARC records, so `studio@wearefreak.com` and the rest of Freak's email keep working.

## How it loads

- **First view:** about 1.5MB with compression on. That's the page, three.js, the desert panorama and the F model.
- **The other three worlds:** download quietly in the background once the opening shot has landed. That's about 6MB on desktop and under 3MB on phones, which get lighter 2K images. Each world is built the first time its page is opened, behind the page.
- **Case study films:** load only when they're played or previewed.
- **Older devices:** if WebGL is turned off, a still image of the desert shows instead. If the visitor has asked their device to reduce motion, the site respects it.

## Changing content

- **Case study text, numbers, quotes and image lists:** these are in `index.html`, in the `WORK` list near the top of the main script. The images go in `img/` and `img/cs/`, and the films in `vid/`.
- **The worlds:** the files in `w/` are rendered panoramas and generated models. Ask Freak to regenerate them rather than editing them by hand.

## To settle before go-live

These are content decisions for Freak, not hosting tasks:

- **Favicon and app icons:** there aren't any yet.
- **Social sharing:** a share image and Open Graph tags (`og:title`, `og:description`, `og:image`).
- **Analytics:** add it if wanted, and add cookie consent if it uses cookies.
- **Footer links:** Terms, Privacy and Cookies are plain text in the footer, so they need pages and links.
- **Client quotes:** confirm the quotes on the Hoover and RNIB case studies are approved for public use.
- **Earth textures:** the day and night maps are NASA Blue Marble and Black Marble imagery. The cloud and ocean masks come from the three.js example textures. Check the licence on those two, or swap them for NASA originals at the same size.
- **Fonts and libraries:** three.js is MIT-licensed (`vendor/three/LICENSE`). The fonts are Google Fonts under the SIL Open Font License.
