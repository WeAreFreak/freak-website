"""Build the Freak website from src/ into the repository root.

    python3 src/build.py

The site is one app: the 3D worlds, the sound and every page, loaded once and never reloaded.
Each page also has its own address (/work, /work/hoover, /capabilities ...) and its own small
HTML file, so search engines, AI tools and shared links get that page's title, description,
share image and readable content straight away. The app code lives in one shared, cached file.

Writes, next to img/, vid/, w/ and vendor/:
  index.html, work.html, work/<case>.html, capabilities.html, contact.html, about.html,
  terms.html, privacy.html, cookies.html, 404.html, assets/app.<hash>.js,
  ai.html, capabilities/<specialism>.html, resources.html, resources/<article>.html,
  f/<address>.html (just the page body, which the app fetches when you move between pages),
  img/share/p/<page>.jpg, sitemap.xml, robots.txt, llms.txt, the IndexNow key file
Content pages (the capability specialisms, AI and the Resource Centre) are HTML files in
src/content/pages, each starting with a JSON block of its details: title, description, FAQs,
related pages, and for articles the date, author and sources. The page furniture (breadcrumbs,
header, FAQs, related links, the call to action) and its structured data are built from those.
Every page also carries structured data (schema.org JSON-LD) describing Freak, its offices, its
services and, on case studies, the work. All of it is generated from src/content, so a new case
study or capability appears everywhere it should on the next build.
Settings that aren't content (verification codes, the IndexNow key, profile links) live in
src/content/site.json. src/content/lastmod.json records when each page last changed, for the sitemap.
Nothing under src/ is published (see .vercelignore).
"""
import datetime, hashlib, html, json, os, re, shutil, sys

S = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(S)
W = os.path.join(S, 'worlds')
C = os.path.join(S, 'content')
rd = lambda p: open(p, encoding='utf-8').read()

SITE = 'https://www.wearefreak.com'   # the address Vercel serves; the plain domain redirects here
DESC = ('Freak is an independent creative, data and AI agency. '
        'Head office in London, with global hubs in Barcelona and Abu Dhabi.')
SHEETS = ['capabilities', 'contact', 'about', 'terms', 'privacy', 'cookies']
LEGAL = [('terms', 'Terms of use'), ('privacy', 'Privacy policy'), ('cookies', 'Cookie policy')]
WORK = json.load(open(os.path.join(C, 'work.json'), encoding='utf-8'))
SET = json.load(open(os.path.join(C, 'site.json'), encoding='utf-8'))   # verification codes, IndexNow key, profiles
TODAY = datetime.date.today().isoformat()
PG = os.path.join(C, 'pages')
# Crawlers named in robots.txt so it's explicit that search and AI tools may read the site
CRAWLERS = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
            'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'DuckAssistBot', 'CCBot']

esc = lambda s: str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
ARROW_L = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 8H3M7 4 3 8l4 4"/></svg>'
ARROW_R = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>'


# ---------------------------------------------------------------- content pages
def load_content():
    """src/content/pages/<address>.html: a <!--meta {json} --> block, then the page body."""
    out = {}
    for root, _, files in os.walk(PG):
        for f in sorted(files):
            if not f.endswith('.html'):
                continue
            route = os.path.relpath(os.path.join(root, f), PG)[:-5].replace(os.sep, '/')
            raw = rd(os.path.join(root, f))
            m = re.match(r'\s*<!--meta\s*(\{.*?\})\s*-->\s*', raw, re.S)
            assert m, f'{route}: missing the <!--meta {{...}} --> block'
            meta = json.loads(m.group(1))
            meta['route'], meta['body'] = route, raw[m.end():].strip()
            out[route] = meta
    return out


CONTENT = load_content()
ARTICLES = sorted((m for r, m in CONTENT.items() if m.get('kind') == 'article'), key=lambda m: (m['date'], m.get('order', 0)), reverse=True)
SPOKES = sorted((m for r, m in CONTENT.items() if m.get('kind') in ('spoke', 'ai')), key=lambda m: m.get('order', 99))


# ---------------------------------------------------------------- page details
def summary(text, limit=158):
    """First sentences of a paragraph, kept under a search snippet's length."""
    out = ''
    for sent in re.split(r'(?<=[.!?])\s+', text.strip()):
        if len(out) + len(sent) + 1 > limit:
            break
        out = (out + ' ' + sent).strip()
    if not out:
        out = text[:limit].rsplit(' ', 1)[0].rstrip(',;') + '…'
    return out


def pages():
    p = {
        '': {'title': 'Freak | Independent creative, data and AI agency', 'desc': DESC},
        'work': {'title': 'Work | Freak', 'desc': 'Campaigns, ecommerce, film and interactive work for clients across food, health, culture and tech, from Freak.'},
        'capabilities': {'title': 'Capabilities | Freak', 'desc': 'Creative, data and AI under one roof. Amazon, content and live production, influencer campaigns and our own AI tools, from Freak in London, Barcelona and Abu Dhabi.'},
        'about': {'title': 'About | Freak', 'desc': 'A multidisciplinary agency for bold brands with stories worth telling. Meet Freak, with a head office in London and hubs in Barcelona and Abu Dhabi.'},
        'contact': {'title': 'Contact | Freak', 'desc': 'Talk to Freak about a new project. Email sales@wearefreak.com or visit the studio at 22 Ash Ave, London SE17 1HS.'},
        'terms': {'title': 'Terms of use | Freak', 'desc': 'The terms that apply to using wearefreak.com.'},
        'privacy': {'title': 'Privacy policy | Freak', 'desc': 'How Freak collects and uses personal information and what your rights are.'},
        'cookies': {'title': 'Cookie policy | Freak', 'desc': 'How wearefreak.com uses cookies and what it stores on your device.'},
    }
    for w in WORK:
        first = w.get('challenge') or (w.get('text') or [''])[0]
        p['work-' + w['id']] = {'title': f"{w['title']} | {w['client']} case study | Freak", 'desc': summary(first)}
    for r, m in CONTENT.items():
        p[r] = {'title': m['title'], 'desc': m['desc'], 'page': 1}
    return p


def path_of(name):
    return '/' if not name else '/work/' + name[5:] if name.startswith('work-') else '/' + name


def file_of(name):
    return 'index.html' if not name else f'work/{name[5:]}.html' if name.startswith('work-') else f'{name}.html'


def share_slug(name):
    return name.replace('/', '-')


def share_image(name):
    if name.startswith('work-') and os.path.exists(os.path.join(R, 'img', 'share', name[5:] + '.jpg')):
        return f'{SITE}/img/share/{name[5:]}.jpg'
    if name in CONTENT:
        return f'{SITE}/img/share/p/{share_slug(name)}.jpg'
    return f'{SITE}/img/share/freak.jpg'


def make_share(name):
    """A 1200 x 630 share card cropped from the page's hero image."""
    from PIL import Image
    src = CONTENT[name].get('share') or (CONTENT[name].get('hero') or {}).get('img') or CONTENT[name].get('card')
    out = os.path.join(R, 'img', 'share', 'p', share_slug(name) + '.jpg')
    if not src:
        shutil.copy(os.path.join(R, 'img', 'share', 'freak.jpg'), out); return
    im = Image.open(os.path.join(R, src)).convert('RGB')
    w, h = im.size; r = 1200 / 630
    if w / h > r:
        nw = int(h * r); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / r); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im.resize((1200, 630), Image.LANCZOS).save(out, quality=84, optimize=True, progressive=True)


# ---------------------------------------------------------------- the app
def assemble():
    """Template + sound kit + worlds + content, as one HTML document's worth of text."""
    kit = rd(os.path.join(W, 'soundkit_base.js'))
    a = kit.index('  // ---- moods ----'); kit = kit[:a] + rd(os.path.join(W, 'sound_extra.js')) + kit[a:]
    b = kit.rindex('  };\n  return { MOODS, bus, CHORDS };'); kit = kit[:b] + rd(os.path.join(W, 'sound_moods.js')) + kit[b:]
    t = rd(os.path.join(S, 'template.html'))
    k0 = t.index('const SoundKit = (() => {'); k1 = t.index('})();', k0) + 5
    t = t[:k0] + kit + t[k1:]
    worlds = "const WDIR = 'w/', LOGO_URL = 'img/freak-logo.txt';\n" + '\n'.join(
        rd(os.path.join(W, n)) for n in ('helpers.js', 'studio.js', 'city.js', 'orbit.js', 'site_manager.js'))
    for key, val in (('/*@@WORLDS@@*/', worlds),
                     ('/*@@WORK@@*/[]', json.dumps(WORK, ensure_ascii=False, separators=(',', ':'))),
                     ('/*@@PAGES@@*/{}', json.dumps(pages(), ensure_ascii=False, separators=(',', ':'))),
                     ('__TINYPANO__', rd(os.path.join(S, 'tiny.txt')).strip()),
                     ('__FSHAPE__', json.dumps(json.load(open(os.path.join(S, 'fshape.json'))), separators=(',', ':')))):
        assert key in t, key
        t = t.replace(key, val)
    # the policy sheets share the other sheets' bar and footer
    bar = re.search(r'(<section class="sheet" id="sheet-about"[^>]*>\n  <div class="sheet-bar">.*?</div>\n)', t, re.S).group(1)
    bar = bar.split('\n', 1)[1].replace(' aria-current="true"', '')
    foot = re.search(r'<footer class="foot">.*?</footer>', t, re.S).group(0)
    sheets = '\n'.join(f'<section class="sheet" id="sheet-{n}" role="dialog" aria-modal="true" aria-labelledby="{n}Title" hidden>\n'
                       f'{bar}  <div class="wrap">\n{rd(os.path.join(C, n + ".html")).strip()}\n  </div>\n  {foot}\n</section>\n'
                       for n, _ in LEGAL)
    t = t.replace('<!--@@LEGAL@@-->', sheets)
    # the Capabilities page shows the three newest Resource Centre articles
    t = t.replace('<!--@@CAP_READING@@-->', wire(''.join(res_card(a) for a in ARTICLES[:3])))
    # the world view's Resource Centre panel shows the newest article
    t = t.replace('<!--@@LATEST@@-->', wire(latest_html(ARTICLES[0])))
    t = t.replace('"three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"', '"three": "/vendor/three/build/three.module.min.js"')
    t = t.replace('"three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"', '"three/addons/": "/vendor/three/examples/jsm/"')
    return t


def split(app):
    """head (fonts + styles), body markup, import map, app script."""
    h_end = app.index('</style>\n') + len('</style>\n')
    head = app[:h_end].replace('<title>Freak 3D Homepage</title>\n', '')
    im0 = app.index('<script type="importmap">'); im1 = app.index('</script>', im0) + len('</script>')
    m0 = app.index('<script type="module">', im1); m1 = app.rindex('</script>')
    body = app[h_end:im0].strip('\n')
    js = app[m0 + len('<script type="module">'):m1].strip('\n') + '\n'
    return head, body, app[im0:im1], js


# ---------------------------------------------------------------- readable content for each page
def tile(w):
    return (f'\n  <a class="tile" href="/work/{w["id"]}" data-case="{w["id"]}" data-cursor="View" data-preview="{w.get("preview") or "vid/" + w["id"] + "-preview.mp4"}">\n'
            f'    <div class="tile-img"><img src="{w["img"]}" alt="{esc(w["client"])}, {esc(w["title"])}" loading="lazy" width="960" height="503"></div>\n'
            f'    <div class="tile-meta"><strong>{esc(w["client"])}</strong><span>{esc(w["title"])}</span></div>\n  </a>')


def case_html(w):
    """The same markup the app renders for a case study, so the hand-over is invisible."""
    i = WORK.index(w); prev = WORK[i - 1]; nxt = WORK[(i + 1) % len(WORK)]
    d = lambda ms: f' style="transition-delay:{ms}ms"'
    m = [f'<div class="cs-hero rv"><img src="{w["img"]}" alt="{esc(w["client"])}, {esc(w["title"])}" width="960" height="503"></div>',
         f'<header class="cs-head up"{d(150)}><span class="client">{esc(w["client"])}</span><h1 id="csTitle">{esc(w["title"])}</h1>'
         f'<div class="tags">{"".join(f"<span>{esc(t)}</span>" for t in w["tags"])}</div></header>']
    v = w.get('video')
    if v:
        m.append(f'<section class="mod mod-video{" portrait" if v.get("portrait") else ""} rv"><video src="{v["src"]}" poster="{v["poster"]}" controls playsinline preload="none" aria-label="{esc(w["client"])} film"></video></section>')
    paras = list(w.get('text') or [])
    challenge = w.get('challenge') or (paras[0] if paras else '')
    idea = paras if w.get('challenge') else paras[1:]
    if challenge:
        m.append(f'<section class="mod mod-story"><span class="label up">The challenge</span><div class="story"><p class="lead up"{d(90)}>{esc(challenge)}</p></div></section>')
    if idea:
        m.append('<section class="mod mod-story"><span class="label up">The idea</span><div class="story">' + ''.join(f'<p class="up"{d(k * 90)}>{esc(t)}</p>' for k, t in enumerate(idea)) + '</div></section>')
    if w.get('numbers'):
        m.append('<section class="mod mod-results"><span class="label up">The results</span><div class="numbers">' + ''.join(
            f'<div class="up"{d(k * 120)}><b data-count="{esc(n)}">{esc(n)}</b><span>{esc(l)}</span></div>' for k, (n, l) in enumerate(w['numbers'])) + '</div></section>')
    if w.get('quote'):
        m.append(f'<section class="mod mod-quote"><blockquote><q data-lines>“{esc(w["quote"][0])}”</q><cite class="up"{d(450)}>{esc(w["quote"][1])}</cite></blockquote></section>')
    if w.get('carousel'):
        m.append(f'<section class="mod"><div class="carousel" tabindex="0" aria-label="{esc(w["client"])} gallery">' + ''.join(
            f'<div class="cimg rv"{d(k * 120)}><img src="img/cs/{n}.webp" alt="{esc(w["client"])} work, image {k + 1}" loading="lazy"></div>' for k, n in enumerate(w['carousel'])) +
            f'</div>\n      <div class="carousel-nav"><button data-slide="-1" aria-label="Previous images">{ARROW_L}</button><button data-slide="1" aria-label="More images">{ARROW_R}</button></div></section>')
    m.append(f'<section class="mod mod-cta"><h2 class="up">Got a brief like this?</h2><a class="cta" href="/contact" data-open="contact">Start a project{ARROW_R}</a></section>')
    m.append(f'<nav class="cs-nav slim" aria-label="Case studies">\n        <a class="prev" href="/work/{prev["id"]}" data-case="{prev["id"]}">{ARROW_L}{esc(prev["client"])}</a>\n'
             f'        <a class="back" href="/work" data-back>Back to case studies</a></nav>')
    m.append(f'<a class="cs-next" href="/work/{nxt["id"]}" data-case="{nxt["id"]}" data-cursor="Next" aria-label="Next project, {esc(nxt["client"])}, {esc(nxt["title"])}">\n'
             f'        <div class="cs-next-frame rv"><img src="{nxt["img"]}" alt="" loading="lazy">\n'
             f'          <div class="cs-next-meta"><span class="label" style="color:#fff;opacity:.85">Next project</span><h2>{esc(nxt["client"])}</h2><p>{esc(nxt["title"])}</p></div></div>\n'
             f'        <div class="cs-next-bar" aria-hidden="true"><i></i><span>Keep scrolling, or click</span></div></a>')
    return ''.join(m)


# ---------------------------------------------------------------- content pages: the furniture around each body
MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split()
BROKEN = set()   # links to pages that don't exist; the build stops on these unless run with --draft


def nice_date(iso):
    """2026-10-14 -> 14th Oct 2026, the house style for dates."""
    y, mo, d = (int(x) for x in iso.split('-'))
    suf = 'th' if 11 <= d <= 13 else {1: 'st', 2: 'nd', 3: 'rd'}.get(d % 10, 'th')
    return f'{d}{suf} {MONTHS[mo - 1]} {y}'


def text_of(h):
    return html.unescape(re.sub(r'<[^>]+>', '', h)).strip()


def read_minutes(m):
    return max(2, round(len(text_of(m['body']).split()) / 230))


def route_of_href(href):
    path = href.split('#')[0].split('?')[0].rstrip('/') or '/'
    if path == '/':
        return ''
    w = re.fullmatch(r'/work/([\w-]+)', path)
    return 'work-' + w.group(1) if w else path[1:]


def wire(h):
    """Links to our own pages open inside the app; links to other sites open in a new tab."""
    known = set(pages())
    def fix(mt):
        tag, href = mt.group(0), mt.group(1)
        if 'data-open' in tag or 'data-close' in tag or 'target=' in tag:
            return tag
        if href.startswith('/') and not href.startswith('//'):
            r = route_of_href(href)
            if r not in known:
                BROKEN.add(href); return tag
            return tag[:-1] + (' data-close>' if r == '' else f' data-open="{r}">')
        if href.startswith('http'):
            return tag[:-1] + ' target="_blank" rel="noopener">'
        return tag
    return re.sub(r'<a\s[^>]*?href="([^"]+)"[^>]*>', fix, h)


def name_of(r):
    if r.startswith('work-'):
        w = next(x for x in WORK if x['id'] == r[5:])
        return w['client']
    if r in CONTENT:
        return CONTENT[r].get('crumb') or text_of(CONTENT[r]['h1'])
    return {'capabilities': 'All capabilities', 'work': 'All work', 'contact': 'Contact', 'about': 'About'}.get(r, r)


def crumbs(m):
    parts = m['route'].split('/')
    out = [('Freak', '/')]
    if parts[0] == 'capabilities':
        out.append(('Capabilities', '/capabilities'))
    if parts[0] == 'resources' and len(parts) > 1:
        out.append(('Resource Centre', '/resources'))
    out.append((m.get('crumb') or text_of(m['h1']), '/' + m['route']))
    return out


def page_head(m):
    c = crumbs(m)
    trail = ' <i>/</i> '.join(f'<a href="{u}">{esc(n)}</a>' for n, u in c[:-1]) + f' <i>/</i> <span aria-current="page">{esc(c[-1][0])}</span>'
    h = [f'<nav class="crumbs" aria-label="Breadcrumb">{trail}</nav>', f'<header class="pg-head{" long" if m["kind"] == "article" else ""}">',
         f'<span class="label">{esc(m["label"])}</span>', f'<h1 id="pageTitle">{m["h1"]}</h1>']
    if m.get('lede'):
        h.append(f'<p class="pg-lede">{m["lede"]}</p>')
    if m['kind'] == 'article':
        a = m['author']
        h.append(f'<div class="pg-byline"><span>By <b>{esc(a["name"])}</b>{", " + esc(a["role"]) if a.get("role") else ""}</span><i>·</i>'
                 f'<time datetime="{m["date"]}">{nice_date(m["date"])}</time><i>·</i><span>{read_minutes(m)} min read</span></div>')
    if m.get('actions'):
        btns = []
        for k, (label, href) in enumerate(m['actions']):
            btns.append(f'<a class="{"cta" if k == 0 else "ghost"}" href="{href}">{esc(label)}{ARROW_R if k == 0 else ""}</a>')
        h.append('<div class="pg-actions">' + ''.join(btns) + '</div>')
    h.append('</header>')
    return '\n'.join(h)


def hero_html(m):
    hd = m.get('hero')
    if not hd:
        return ''
    if hd.get('video'):
        media = f'<video src="{hd["video"]}" poster="{hd["img"]}" controls playsinline preload="none" aria-label="{esc(hd["alt"])}"></video>'
    else:
        media = f'<img src="{hd["img"]}" alt="{esc(hd["alt"])}" width="{hd.get("w", 1600)}" height="{hd.get("h", 760)}" fetchpriority="high">'
    cap = f'<figcaption>{hd["caption"]}</figcaption>' if hd.get('caption') else ''
    return f'<figure class="pg-hero"><div class="frame">{media}</div>{cap}</figure>'


def case_card(cid, stat, label):
    w = next(x for x in WORK if x['id'] == cid)
    return (f'<a class="tile" href="/work/{cid}" data-cursor="View"><div class="tile-img"><img src="{w["img"]}" alt="{esc(w["client"])}, {esc(w["title"])}" loading="lazy" width="960" height="503"></div>'
            f'<div class="tile-meta"><strong>{esc(w["client"])}</strong><span>{esc(w["title"])}</span>'
            f'<div class="res">{esc(stat)}<small>{esc(label)}</small></div></div></a>')


def cases_html(m):
    if not m.get('cases'):
        return ''
    title, sub = m.get('cases_title') or ['The work', 'Case studies that show it working.']
    return (f'<section class="pg-sec" id="work"><header><span class="label">{esc(title)}</span><h2>{sub}</h2></header>'
            f'<div class="pg-cases">{"".join(case_card(*c) for c in m["cases"])}</div></section>')


def res_card(a, eager=False):
    return (f'<a class="res-card" href="/resources/{a["route"].split("/", 1)[1]}" data-cat="{esc(a["category"])}">'
            f'<div class="frame"><img src="{a["card"]}" alt="{esc(a.get("card_alt", text_of(a["h1"])))}"{"" if eager else " loading=\"lazy\""} width="960" height="600"></div>'
            f'<div class="res-meta"><b>{esc(a["category"])}</b><span>{nice_date(a["date"])}</span><span>{read_minutes(a)} min read</span></div>'
            f'<h3>{text_of(a["h1"])}</h3><p>{esc(a["summary"])}</p></a>')


def latest_html(a):
    d = nice_date(a['date']).rsplit(' ', 1)[0]
    return (f'<a class="latest-item" href="/resources/{a["route"].split("/", 1)[1]}" data-cursor="Read">'
            f'<span class="latest-kicker"><b>Resource Centre</b><span>{esc(a["label"])}</span></span>'
            f'<span class="latest-title">{text_of(a["h1"]).rstrip(".")}</span></a>'
            f'<div class="latest-foot"><span>{d}, {read_minutes(a)} min read</span>'
            f'<a class="latest-all" href="/resources">All guides<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg></a></div>')


def reading_html(m, title='Further reading', sub='From the Resource Centre.'):
    missing = [r for r in m.get('reading', []) if r not in CONTENT]
    if missing:
        print(f"warning: {m['route']} links to articles that don't exist yet: {', '.join(missing)}")
    rs = [CONTENT[r] for r in m.get('reading', []) if r in CONTENT]
    if not rs:
        return ''
    return (f'<section class="pg-sec" id="reading"><header><span class="label">{esc(title)}</span><h2>{sub}</h2></header>'
            f'<div class="res-grid">{"".join(res_card(a) for a in rs)}</div></section>')


def faq_html(m):
    if not m.get('faq'):
        return ''
    items = ''.join(f'<details><summary>{esc(q)}</summary><p>{a}</p></details>' for q, a in m['faq'])
    return (f'<section class="pg-sec" id="faq"><header><span class="label">FAQs</span><h2>{m.get("faq_title", "Questions clients ask us.")}</h2></header>'
            f'<div class="pg-faq">{items}</div></section>')


def related_html(m):
    if not m.get('related'):
        return ''
    chips = ''.join(f'<a href="{path_of(r)}">{esc(name_of(r))}{ARROW_R}</a>' for r in m['related'])
    return f'<section class="pg-sec" id="related"><header><span class="label">Keep exploring</span></header><div class="chips">{chips}</div></section>'


def cta_html(m):
    h2, p = m.get('cta') or ['Got a brief like this?', "Tell us where you want to grow, and we'll show you how we'd get there."]
    return (f'<section class="pg-band"><div class="pgw pg-cta"><div><span class="label">Start a project</span><h2>{h2}</h2><p>{p}</p></div>'
            f'<a class="cta" href="/contact">Start a project{ARROW_R}</a></div></section>')


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', text_of(s).lower()).strip('-')[:60]


def article_html(m):
    toc = []
    def add_id(mt):
        attrs, inner = mt.group(1), mt.group(2)
        hid = re.search(r'id="([^"]+)"', attrs)
        hid = hid.group(1) if hid else slug(inner)
        toc.append((hid, text_of(inner)))
        return f'<h2 id="{hid}">{inner}</h2>' if 'id=' not in attrs else mt.group(0)
    body = re.sub(r'<h2([^>]*)>(.*?)</h2>', add_id, m['body'], flags=re.S)
    if m.get('sources'):
        body += ('<h2 id="sources">Sources</h2><ol class="sources">' +
                 ''.join(f'<li><a href="{u}">{esc(n)}</a>, {esc(pub)}</li>' for n, u, pub in m['sources']) + '</ol>')
        toc.append(('sources', 'Sources'))
    nav = ''.join(f'<a href="#{i}">{esc(n)}</a>' for i, n in toc)
    box = m.get('aside')
    boxh = (f'<div class="box"><span class="label">{esc(box["label"])}</span><b>{esc(box["title"])}</b><p>{box["text"]}</p>'
            f'<a class="stage-link" href="{box["href"]}">{esc(box["link"])}{ARROW_R}</a></div>') if box else ''
    return (f'<div class="pg-article"><div class="prose">{body}</div>'
            f'<aside class="pg-aside"><nav aria-label="In this article"><span class="label">In this article</span>{nav}</nav>{boxh}</aside></div>')


def resources_html(m):
    feat, rest = ARTICLES[0], ARTICLES[1:]
    cats = []
    for a in ARTICLES:
        if a['category'] not in cats:
            cats.append(a['category'])
    filt = '<div class="res-filter" role="group" aria-label="Filter by topic"><button data-cat="all" aria-pressed="true">All</button>' + ''.join(
        f'<button data-cat="{esc(c)}" aria-pressed="false">{esc(c)}</button>' for c in cats) + '</div>'
    f = feat
    feature = (f'<a class="res-feature" href="/{f["route"]}"><div class="frame"><img src="{f["card"]}" alt="{esc(f.get("card_alt", text_of(f["h1"])))}" width="960" height="600"></div>'
               f'<div><div class="res-meta"><b>{esc(f["category"])}</b><span>{nice_date(f["date"])}</span><span>{read_minutes(f)} min read</span></div>'
               f'<h2>{text_of(f["h1"])}</h2><p>{esc(f["summary"])}</p></div></a>')
    press = ''.join(f'<li><a href="{u}"><span class="outlet">{esc(o)}</span><div><h3>{esc(ti)}</h3><p>{esc(note)}</p></div><time datetime="{d}">{nice_date(d)}</time></a></li>'
                    for o, ti, u, d, note in m.get('press', []))
    return (f'<section class="pg-sec" id="latest" style="padding-top:8px">{feature}</section>'
            f'<section class="pg-sec" id="articles"><header><span class="label">Articles and guides</span><h2>Everything we have published.</h2></header>{filt}'
            f'<div class="res-grid">{"".join(res_card(a) for a in rest)}</div></section>'
            f'{m["body"]}'
            + (f'<section class="pg-sec" id="press"><header><span class="label">In the press</span><h2>Freak in the trade press.</h2>'
               f'<p>Interviews, features and the stories other people have written about our work.</p></header><ul class="press">{press}</ul></section>' if press else ''))


def render(name):
    m = CONTENT[name]
    if m['kind'] == 'article':
        parts = [page_head(m), hero_html(m), article_html(m), faq_html(m), reading_html(m, 'Keep reading', 'More from the Resource Centre.'), related_html(m), cta_html(m)]
    elif m['kind'] == 'resources':
        parts = [page_head(m), resources_html(m), faq_html(m), cta_html(m)]
    else:
        parts = [page_head(m), hero_html(m), m['body'], cases_html(m), reading_html(m), faq_html(m), related_html(m), cta_html(m)]
    return wire('\n'.join(x for x in parts if x))


def open_sheet(body, sid):
    a = f'<section class="sheet" id="sheet-{sid}"'
    i = body.index(a); j = body.index('>', i)
    tag = body[i:j + 1]
    assert ' hidden' in tag, sid
    return body[:i] + tag.replace('class="sheet"', 'class="sheet open"').replace(' hidden', '') + body[j + 1:]


def body_for(body, name):
    b = body.replace('<div class="grid" id="tiles"></div>', '<div class="grid" id="tiles">' + ''.join(tile(w) for w in WORK) + '\n</div>')
    if not name:
        return b
    if name in CONTENT:
        b = open_sheet(b, 'page')
        b = b.replace('<article class="pg" id="pageBody"></article>', f'<article class="pg" id="pageBody" data-route="{name}">\n{render(name)}\n</article>')
        i = b.index('id="sheet-page"'); j = b.index('</nav>', i)
        top = name.split('/')[0]
        b = b[:i] + b[i:j].replace(f'data-open="{top}">', f'data-open="{top}" aria-current="true">', 1) + b[j:]
        return b
    if name == 'work' or name.startswith('work-'):
        b = open_sheet(b, 'work')
        if name.startswith('work-'):
            w = next(x for x in WORK if 'work-' + x['id'] == name)
            b = b.replace('<div class="wrap" id="workGrid">', '<div class="wrap" id="workGrid" hidden>')
            b = b.replace('<article class="wrap" id="caseStudy" hidden></article>',
                          f'<article class="wrap" id="caseStudy" aria-labelledby="csTitle">{case_html(w)}</article>')
        return b
    return open_sheet(b, name)


# ---------- structured data ----------
def services():
    """The capability pillars and their services, read from the Capabilities page itself."""
    t = rd(os.path.join(S, 'template.html'))
    out = []
    for m in re.finditer(r'<li class="pillar"[^>]*>.*?<h2>(.*?)</h2><p>(.*?)</p>\s*<ul>(.*?)</ul>', t, re.S):
        items = [html.unescape(re.sub(r'<[^>]+>', '', i)).strip() for i in re.findall(r'<li>(.*?)</li>', m.group(3), re.S)]
        out.append({'name': html.unescape(m.group(1)), 'desc': html.unescape(m.group(2)), 'items': items})
    return out


ADDRESS = {'@type': 'PostalAddress', 'streetAddress': '22 Ash Avenue', 'addressLocality': 'London', 'postalCode': 'SE17 1HS', 'addressCountry': 'GB'}


def org(full=True):
    if not full:   # the other pages point at the full description by @id, which keeps them small
        return {'@type': ['Organization', 'ProfessionalService'], '@id': SITE + '/#org', 'name': 'Freak', 'legalName': 'WeAreFreak Ltd',
                'url': SITE + '/', 'logo': SITE + '/img/icons/icon-512.png', 'description': DESC, 'address': ADDRESS,
                **({'sameAs': SET['same_as']} if SET.get('same_as') else {})}
    caps = services()
    return {
        '@type': ['Organization', 'ProfessionalService'], '@id': SITE + '/#org',
        'name': 'Freak', 'alternateName': ['WeAreFreak', 'We Are Freak'], 'legalName': 'WeAreFreak Ltd',
        'url': SITE + '/', 'logo': SITE + '/img/icons/icon-512.png', 'image': SITE + '/img/share/freak.jpg',
        'description': DESC, 'slogan': 'Independent creative, data and AI agency', 'email': 'studio@wearefreak.com',
        'identifier': {'@type': 'PropertyValue', 'propertyID': 'UK Companies House number', 'value': '09308352'},
        'address': ADDRESS,
        'location': [{'@type': 'Place', 'name': f'Freak {c}', 'address': {'@type': 'PostalAddress', 'addressLocality': c, 'addressCountry': cc}}
                     for c, cc in (('London', 'GB'), ('Barcelona', 'ES'), ('Abu Dhabi', 'AE'))],
        'areaServed': 'Worldwide',
        'knowsAbout': [c['name'] for c in caps] + [i for c in caps for i in c['items']],
        'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': 'Capabilities', 'itemListElement': [
            {'@type': 'OfferCatalog', 'name': c['name'], 'description': c['desc'], 'itemListElement': [
                {'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': i, 'provider': {'@id': SITE + '/#org'}}} for i in c['items']]}
            for c in caps]},
        **({'sameAs': SET['same_as']} if SET.get('same_as') else {}),
    }


def faq_node(url, faq):
    return {'@type': 'FAQPage', '@id': url + '#faq', 'mainEntity': [
        {'@type': 'Question', 'name': text_of(q), 'acceptedAnswer': {'@type': 'Answer', 'text': text_of(a)}} for q, a in faq]}


def hub_faq():
    """The questions on the Capabilities page, read from its markup."""
    t = rd(os.path.join(S, 'template.html'))
    box = re.search(r'<div class="pg-faq" id="capFaq">(.*?)</div>\s*</section>', t, re.S)
    return re.findall(r'<summary>(.*?)</summary><p>(.*?)</p>', box.group(1), re.S) if box else []


def content_graph(name, page):
    """Structured data for a content page: the page, its breadcrumb, and what it is about."""
    m, url = CONTENT[name], SITE + path_of(name)
    img = share_image(name)
    kind = {'resources': 'CollectionPage'}.get(m['kind'], 'WebPage')
    crumb = crumbs(m)
    pg = {'@type': kind, '@id': url + '#page', 'url': url, 'name': page['title'], 'description': page['desc'], 'inLanguage': 'en-GB',
          'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@id': SITE + '/#org'}, 'primaryImageOfPage': img, 'breadcrumb': {'@id': url + '#crumbs'}}
    if m.get('date'):
        pg['datePublished'] = m['date']; pg['dateModified'] = m.get('updated', m['date'])
    graph = [org(full=False),
             {'@type': 'WebSite', '@id': SITE + '/#website', 'url': SITE + '/', 'name': 'Freak', 'inLanguage': 'en-GB', 'publisher': {'@id': SITE + '/#org'}},
             pg,
             {'@type': 'BreadcrumbList', '@id': url + '#crumbs', 'itemListElement': [
                 {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': SITE + u.rstrip('/') if u != '/' else SITE + '/'} for i, (n, u) in enumerate(crumb)]}]
    vids = []
    for k, v in enumerate(m.get('videos', [])):
        vids.append({'@type': 'VideoObject', '@id': f'{url}#video{k + 1}', 'name': v['name'], 'description': v['desc'],
                     'thumbnailUrl': SITE + '/' + v['poster'], 'contentUrl': SITE + '/' + v['src'], 'uploadDate': m.get('date', '2026-10-14'),
                     'inLanguage': 'en-GB', 'publisher': {'@id': SITE + '/#org'}})
    if m['kind'] in ('spoke', 'ai'):
        s = m['service']
        graph.append({'@type': 'Service', '@id': url + '#service', 'name': s['name'], 'serviceType': s.get('type', s['name']),
                      'description': page['desc'], 'url': url, 'provider': {'@id': SITE + '/#org'}, 'areaServed': s.get('area', 'Worldwide'),
                      'image': img, **({'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': s['name'], 'itemListElement': [
                          {'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': i}} for i in s['offers']]}} if s.get('offers') else {})})
        pg['mainEntity'] = {'@id': url + '#service'}
    if m['kind'] == 'article':
        a = m['author']
        author = ({'@type': 'Person', 'name': a['name'], 'jobTitle': a.get('role'), 'worksFor': {'@id': SITE + '/#org'}}
                  if a.get('type', 'Person') == 'Person' else {'@id': SITE + '/#org'})
        art = {'@type': 'Article', '@id': url + '#article', 'headline': text_of(m['h1']).rstrip('.')[:110], 'description': page['desc'], 'image': [img],
               'datePublished': m['date'], 'dateModified': m.get('updated', m['date']), 'author': author, 'publisher': {'@id': SITE + '/#org'},
               'mainEntityOfPage': {'@id': url + '#page'}, 'inLanguage': 'en-GB', 'articleSection': m['category'],
               'wordCount': len(text_of(m['body']).split()), 'isPartOf': {'@id': SITE + '/resources#page'}}
        if m.get('keywords'):
            art['keywords'] = ', '.join(m['keywords'])
        if m.get('sources'):
            art['citation'] = [{'@type': 'CreativeWork', 'name': n, 'url': u, 'publisher': {'@type': 'Organization', 'name': pub}} for n, u, pub in m['sources']]
        if vids:
            art['video'] = [{'@id': v['@id']} for v in vids]
        graph.append(art)
        pg['mainEntity'] = {'@id': url + '#article'}
    if m['kind'] == 'resources':
        graph.append({'@type': 'ItemList', '@id': url + '#list', 'name': 'Freak Resource Centre', 'itemListElement': [
            {'@type': 'ListItem', 'position': i + 1, 'url': SITE + '/' + a['route'], 'name': text_of(a['h1']).rstrip('.')} for i, a in enumerate(ARTICLES)]})
        pg['mainEntity'] = {'@id': url + '#list'}
    graph += vids
    if m.get('faq'):
        graph.append(faq_node(url, m['faq']))
    return graph


def jsonld(name, page):
    url = SITE + path_of(name)
    if name in CONTENT:
        data = json.dumps({'@context': 'https://schema.org', '@graph': content_graph(name, page)}, ensure_ascii=False, separators=(',', ':'))
        return '<script type="application/ld+json">' + data.replace('</', '<\\/') + '</script>'
    kind = {'': 'WebPage', 'work': 'CollectionPage', 'about': 'AboutPage', 'contact': 'ContactPage'}.get(name, 'WebPage')
    crumbs = [('Freak', SITE + '/')]
    if name == 'work' or name.startswith('work-'):
        crumbs.append(('Work', SITE + '/work'))
    elif name:
        crumbs.append((page['title'].split(' | ')[0], url))
    w = next((x for x in WORK if 'work-' + x['id'] == name), None)
    if w:
        crumbs.append((w['client'], url))
    graph = [
        org(full=name in ('', 'capabilities', 'about', 'contact')),
        {'@type': 'WebSite', '@id': SITE + '/#website', 'url': SITE + '/', 'name': 'Freak', 'inLanguage': 'en-GB', 'publisher': {'@id': SITE + '/#org'}},
        {'@type': kind, '@id': url + '#page', 'url': url, 'name': page['title'], 'description': page['desc'], 'inLanguage': 'en-GB',
         'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@id': SITE + '/#org'}, 'primaryImageOfPage': share_image(name),
         **({'breadcrumb': {'@id': url + '#crumbs'}} if len(crumbs) > 1 else {}),
         **({'mainEntity': {'@id': url + '#work'}} if w else {})},
    ]
    if len(crumbs) > 1:
        graph.append({'@type': 'BreadcrumbList', '@id': url + '#crumbs', 'itemListElement': [
            {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': u} for i, (n, u) in enumerate(crumbs)]})
    if w:
        graph.append({'@type': 'CreativeWork', '@id': url + '#work', 'name': w['title'], 'headline': f"{w['title']}, {w['client']}",
                      'description': page['desc'], 'url': url, 'image': share_image(name), 'inLanguage': 'en-GB',
                      'creator': {'@id': SITE + '/#org'}, 'sourceOrganization': {'@id': SITE + '/#org'},
                      'about': {'@type': 'Brand', 'name': w['client']}, 'keywords': ', '.join(w.get('tags', []))})
    if name == 'capabilities' and hub_faq():
        graph.append(faq_node(url, hub_faq()))
    if name == 'work':
        graph.append({'@type': 'ItemList', 'name': 'Freak case studies', 'itemListElement': [
            {'@type': 'ListItem', 'position': i + 1, 'url': SITE + '/work/' + x['id'], 'name': f"{x['client']}, {x['title']}"} for i, x in enumerate(WORK)]})
    data = json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, separators=(',', ':'))
    return '<script type="application/ld+json">' + data.replace('</', '<\\/') + '</script>'


def head_for(name, page, fonts_and_style, noindex=False):
    url = SITE + path_of(name)
    img = share_image(name)
    t, dsc = esc(page['title']), esc(page['desc'])
    lines = [
        '<!doctype html>', '<html lang="en-GB">', '<head>',
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
        '<base href="/">',
        f'<title>{t}</title>',
        f'<meta name="description" content="{dsc}">',
        '<meta name="robots" content="noindex">' if noindex else f'<link rel="canonical" href="{url}">',
        '<meta name="theme-color" content="#232323">',
        '<link rel="icon" href="/favicon.ico" sizes="32x32">',
        '<link rel="icon" href="/img/icons/favicon.svg" type="image/svg+xml">',
        '<link rel="apple-touch-icon" href="/img/icons/apple-touch-icon.png">',
        '<meta property="og:site_name" content="Freak">',
        f'<meta property="og:type" content="{"article" if name.startswith("work-") or CONTENT.get(name, {}).get("kind") == "article" else "website"}">',
        f'<meta property="og:title" content="{t}">',
        f'<meta property="og:description" content="{dsc}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:image" content="{img}">',
        '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">',
        '<meta property="og:locale" content="en_GB">',
        '<meta name="twitter:card" content="summary_large_image">',
    ]
    if not name and not noindex:   # site ownership checks for Google Search Console and Bing Webmaster Tools
        if SET.get('google_site_verification'):
            lines.append(f'<meta name="google-site-verification" content="{esc(SET["google_site_verification"])}">')
        if SET.get('bing_site_verification'):
            lines.append(f'<meta name="msvalidate.01" content="{esc(SET["bing_site_verification"])}">')
    if not noindex:
        lines.append(jsonld(name, page))
    return '\n'.join(lines) + '\n' + fonts_and_style


def build():
    app = assemble()
    head, body, importmap, js = split(app)
    js_hash = hashlib.sha256(js.encode()).hexdigest()[:10]
    assets = os.path.join(R, 'assets')
    if os.path.isdir(assets):
        shutil.rmtree(assets)
    os.makedirs(assets)
    js_name = f'assets/app.{js_hash}.js'
    open(os.path.join(R, js_name), 'w', encoding='utf-8').write(js)
    tail = f'{importmap}\n<script type="module" src="/{js_name}"></script>\n</body>\n</html>\n'
    P = pages()
    os.makedirs(os.path.join(R, 'work'), exist_ok=True)
    for old in os.listdir(os.path.join(R, 'work')):
        if old.endswith('.html'):
            os.remove(os.path.join(R, 'work', old))
    for d in ('capabilities', 'resources', 'f', os.path.join('img', 'share', 'p')):   # rebuilt from src/content/pages every time
        if os.path.isdir(os.path.join(R, d)):
            shutil.rmtree(os.path.join(R, d))
    caps = [m['route'] for m in SPOKES if m['route'].startswith('capabilities/')]
    extra = [m['route'] for m in SPOKES if not m['route'].startswith('capabilities/')]
    names = ([''] + ['work'] + ['work-' + w['id'] for w in WORK] + ['capabilities'] + caps + extra +
             (['resources'] if 'resources' in CONTENT else []) + [a['route'] for a in ARTICLES] + [s for s in SHEETS if s != 'capabilities'])
    assert set(names) >= set(CONTENT), set(CONTENT) - set(names)
    for n in CONTENT:
        for d in (os.path.dirname(file_of(n)), os.path.join('f', os.path.dirname(file_of(n)))):
            os.makedirs(os.path.join(R, d), exist_ok=True)
        open(os.path.join(R, 'f', file_of(n)), 'w', encoding='utf-8').write(render(n) + '\n')
    os.makedirs(os.path.join(R, 'img', 'share', 'p'), exist_ok=True)
    for n in CONTENT:
        make_share(n)
    sizes = {}
    for n in names:
        doc = head_for(n, P[n], head) + '</head>\n<body>\n' + body_for(body, n) + '\n\n' + tail
        open(os.path.join(R, file_of(n)), 'w', encoding='utf-8').write(doc)
        sizes[file_of(n)] = len(doc)
    # unknown addresses land on the home page (the app tidies the address), and are never indexed
    open(os.path.join(R, '404.html'), 'w', encoding='utf-8').write(
        head_for('', P[''], head, noindex=True) + '</head>\n<body>\n' + body_for(body, '') + '\n\n' + tail)
    # the sitemap's last-changed date moves only when a page's own content changes, not on every build
    lm_path = os.path.join(C, 'lastmod.json')
    lm = json.load(open(lm_path)) if os.path.exists(lm_path) else {}
    for n in names:
        page_text = re.sub(r'app\.[0-9a-f]{10}\.js', 'app.js', open(os.path.join(R, file_of(n)), encoding='utf-8').read())
        h = hashlib.sha256(page_text.encode()).hexdigest()[:16]
        if lm.get(n, {}).get('hash') != h:
            lm[n] = {'hash': h, 'date': TODAY}
    open(lm_path, 'w').write(json.dumps({n: lm[n] for n in names}, indent=1) + '\n')
    urls = ''.join(f'  <url><loc>{SITE}{path_of(n)}</loc><lastmod>{lm[n]["date"]}</lastmod></url>\n' for n in names)
    open(os.path.join(R, 'sitemap.xml'), 'w').write(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')
    bots = ''.join(f'User-agent: {b}\n' for b in CRAWLERS)
    open(os.path.join(R, 'robots.txt'), 'w').write(
        '# Search engines and AI assistants are welcome to read and cite this site.\n'
        f'{bots}Allow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n')
    open(os.path.join(R, 'llms.txt'), 'w', encoding='utf-8').write(llms(P, names))
    if SET.get('indexnow_key'):   # proves to Bing and other IndexNow engines that pings for this site are ours
        k = SET['indexnow_key']
        for old in os.listdir(R):
            if re.fullmatch(r'[0-9a-f]{32}\.txt', old) and old != k + '.txt':
                os.remove(os.path.join(R, old))
        open(os.path.join(R, k + '.txt'), 'w').write(k)
    print(f'{len(names)} pages, app {len(js) // 1024} KB ({js_name}), largest page {max(sizes.values()) // 1024} KB')
    if BROKEN:
        print('links to pages that do not exist: ' + ', '.join(sorted(BROKEN)))
        if '--draft' not in sys.argv:
            sys.exit(1)


def llms(P, names):
    """A plain summary of Freak for AI assistants, with a link to every page (llmstxt.org)."""
    caps = services()
    out = ['# Freak', '', f'> {DESC}', '',
           'Freak (WeAreFreak Ltd, company 09308352) is an independent creative, data and AI agency. '
           'Head office at 22 Ash Avenue, London SE17 1HS, with hubs in Barcelona and Abu Dhabi, working for clients in over 100 countries. '
           'Contact studio@wearefreak.com.', '', '## Capabilities', '']
    for c in caps:
        out += [f"- {c['name']}. {c['desc']}"] + [f"  - {i}" for i in c['items']]
    out += ['', '## Pages', '']
    out += [f"- [{P[n]['title'].split(' | ')[0] if n else 'Home'}]({SITE}{path_of(n)}): {P[n]['desc']}" for n in names if not n.startswith('work-') and n not in CONTENT]
    out += ['', '## Specialisms', '']
    out += [f"- [{name_of(m['route'])}]({SITE}/{m['route']}): {m['desc']}" for m in SPOKES]
    if ARTICLES:
        out += ['', '## Resource Centre', '', f"- [Resource Centre]({SITE}/resources): {CONTENT['resources']['desc']}"]
        out += [f"- [{text_of(a['h1']).rstrip('.')}]({SITE}/{a['route']}): {a['desc']}" for a in ARTICLES]
    out += ['', '## Case studies', '']
    out += [f"- [{w['client']}, {w['title']}]({SITE}/work/{w['id']}): {P['work-' + w['id']]['desc']}" for w in WORK]
    return '\n'.join(out) + '\n'


if __name__ == '__main__':
    build()
