"""Build the Freak website from src/ into the repository root.

    python3 src/build.py

Assembles the template, the sound kit and the three page worlds into one app,
then writes the published files next to img/, vid/, w/ and vendor/.
Nothing under src/ is published (see .vercelignore).
"""
import json, os

S = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(S)
W = os.path.join(S, 'worlds')
rd = lambda p: open(p, encoding='utf-8').read()

SITE = 'https://wearefreak.com'
DESC = ('Freak is an independent, full-service creative and data agency. '
        'Head office in London, with global hubs in Barcelona and Abu Dhabi.')


def assemble():
    """Template + extended sound kit + worlds, exactly as the site has always been built."""
    kit = rd(os.path.join(W, 'soundkit_base.js'))
    a = kit.index('  // ---- moods ----'); kit = kit[:a] + rd(os.path.join(W, 'sound_extra.js')) + kit[a:]
    b = kit.rindex('  };\n  return { MOODS, bus, CHORDS };'); kit = kit[:b] + rd(os.path.join(W, 'sound_moods.js')) + kit[b:]
    t = rd(os.path.join(S, 'template.html'))
    k0 = t.index('const SoundKit = (() => {'); k1 = t.index('})();', k0) + 5
    t = t[:k0] + kit + t[k1:]
    worlds = "const WDIR = 'w/', LOGO_URL = 'img/freak-logo.txt';\n" + '\n'.join(
        rd(os.path.join(W, n)) for n in ('helpers.js', 'studio.js', 'city.js', 'orbit.js', 'site_manager.js'))
    assert '/*@@WORLDS@@*/' in t
    t = t.replace('/*@@WORLDS@@*/', worlds)
    t = t.replace('__TINYPANO__', rd(os.path.join(S, 'tiny.txt')).strip())
    t = t.replace('__FSHAPE__', json.dumps(json.load(open(os.path.join(S, 'fshape.json'))), separators=(',', ':')))
    t = t.replace('"three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"', '"three": "./vendor/three/build/three.module.min.js"')
    t = t.replace('"three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"', '"three/addons/": "./vendor/three/examples/jsm/"')
    return t


def document(app):
    head_end = app.index('</style>\n') + len('</style>\n')
    head, body = app[:head_end], app[head_end:]
    head = head.replace('<title>Freak 3D Homepage</title>\n', '', 1)
    meta = ('<!doctype html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            f'<meta name="description" content="{DESC}">\n'
            '<meta name="theme-color" content="#232323">\n'
            '<title>Freak | Creative and data agency</title>\n')
    return meta + head + '</head>\n<body>\n' + body.lstrip('\n') + '</body>\n</html>\n'


if __name__ == '__main__':
    out = document(assemble())
    open(os.path.join(R, 'index.html'), 'w', encoding='utf-8').write(out)
    print('index.html', len(out) // 1024, 'KB')
