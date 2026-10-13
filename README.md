# Freak website

The live site at wearefreak.com is hosted on Vercel and deploys from the `main` branch of this repository. Other branches get a Vercel preview link. It is a static site, with no server code and no database.

The site is one app: the 3D worlds, the sound and every page load once, and moving between pages never reloads. Each page also has its own address and its own small HTML file. That way search engines, AI tools and shared links get that page's title, description, share image and readable content straight away.

## Addresses

| Address | Page |
| --- | --- |
| `/` | The desert world and the card |
| `/work` | All case studies |
| `/work/<case>` | One case study, for example `/work/hoover` |
| `/capabilities`, `/contact`, `/about` | The other sections |
| `/terms`, `/privacy`, `/cookies` | Policies |

Old links in the form `/#work-hoover` still work: the app moves them to `/work/hoover`. Anything unknown gets `404.html`, which shows the home page, isn't indexed, and tidies the address.

## What's in the repository

| Path | What it is |
| --- | --- |
| `src/` | The editable source. It isn't published (see `.vercelignore`) |
| `src/template.html` | Layout, styles and the app script |
| `src/content/work.json` | Case study text, numbers, quotes, films and image lists |
| `src/content/*.html` | The Terms, Privacy and Cookies text |
| `src/worlds/` | The three page worlds and the extra music |
| `src/build.py` | Builds everything below from `src/` |
| `index.html`, `work.html`, `work/*.html`, `capabilities.html` and so on | One page per address, built |
| `assets/app.<hash>.js` | The shared app script, built. Its name changes whenever it changes, so it can be cached for a year |
| `img/`, `vid/`, `w/` | Images, films and the world files |
| `img/icons/`, `favicon.ico` | Favicon and home screen icons |
| `img/share/` | Share images, one for the site and one per case study |
| `vendor/three/` | three.js 0.160.0 and its add-ons |
| `sitemap.xml`, `robots.txt` | Built with the pages |
| `vercel.json` | Clean addresses (`/work` serves `work.html`) and caching |

## Making a change

1. Edit the files in `src/`. Case study copy is in `src/content/work.json`.
2. Run `python3 src/build.py` (Python 3, no packages needed).
3. Commit the rebuilt files with the source and push to a branch. Check the Vercel preview, then merge to `main`.

## Hosting notes

- `vercel.json` sets clean addresses and caching: `assets/` and `vendor/` for a year, and `img/`, `vid/` and `w/` for a week. Page HTML is always revalidated, so updates show straight away.
- The pages use `<base href="/">`, so every asset path resolves from the site root, whatever the address.
- **External requests:** only Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`). If you set a Content Security Policy, allow those two, plus `blob:` in `img-src` and `connect-src` (the page caches the world files as blob URLs).
- **Leave the email records alone.** Don't change or remove the MX, SPF, DKIM or DMARC records at the DNS provider.

## Still to settle

- **Analytics:** add it if wanted, and a cookie banner if it uses cookies. The cookie policy will need updating too.
- **Policies:** the Terms, Privacy and Cookies text is a draft for Freak to check.
- **Client quotes:** confirm the Hoover and RNIB quotes are approved for public use.
- **Earth textures:** the cloud and ocean masks in the Orbit world come from the three.js example textures. Check their licence, or swap them for NASA originals at the same size.
- **Licences:** three.js is MIT-licensed (`vendor/three/LICENSE`). The fonts are Google Fonts under the SIL Open Font License.
