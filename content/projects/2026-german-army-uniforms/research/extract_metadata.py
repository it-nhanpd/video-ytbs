#!/usr/bin/env python3
import urllib.parse, urllib.request, json, csv, sys, time, re, html, subprocess

files = [
    ("Pickelhaube Infanterie Preußen 1915, item 1.jpg", "ch01_pickelhaube_prussia_1915_item1.jpg"),
    ("GM.018374 German WW1 military steel helmet Stahlhelm M1916 (tysk soldathjelm) Anno Glomdalsmuseet Norway Digitaltmuseum CC BY-SA 4.0.jpg", "ch03_stahlhelm_m1916_gm018374.jpg"),
    ("Askari aus Deutsch-Ostafrika (Askari from German East Africa).jpg", "ch02_askari_postcard.jpg"),
    ("Bundesarchiv Bild 105-DOA6369, Deutsch-Ostafrika, Askari.jpg", "ch02_bundesarchiv_askari.jpg"),
    ("Flecktarn.jpg", "ch07_flecktarn.jpg"),
    ("1943 Handbook On German Military Forces Page 068 TM-E 30-451 Army (Wehrmacht ) tropical uniforms officers and enlisted men - no known copyright.jpg", "ch05_tme30_page68.jpg"),
]

def strip_html(s):
    if not s:
        return ''
    s = html.unescape(s)
    # remove tags
    s = re.sub(r'<[^>]+>', '', s)
    # collapse whitespace
    return ' '.join(s.split())

out = 'images/metadata.csv'
with open(out, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["filename","ObjectName","ArtistOrCredit","DateTimeOriginal","License","UsageTerms","SourceURL","notes"])
    for title, local in files:
        q = urllib.parse.urlencode({
            'action': 'query',
            'format': 'json',
            'prop': 'imageinfo',
            'iiprop': 'extmetadata|url',
            'titles': 'File:' + title
        })
        url = 'https://commons.wikimedia.org/w/api.php?' + q
        try:
            # use curl to ensure proper query escaping for complex titles
            cmd = [
                'curl', '-s', '--get', '--data-urlencode', f'titles=File:{title}',
                '--data', 'action=query&format=json&prop=imageinfo&iiprop=extmetadata|url',
                'https://commons.wikimedia.org/w/api.php'
            ]
            p = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            if p.returncode != 0 or not p.stdout:
                raise RuntimeError(f'curl failed rc={p.returncode}')
            data = json.loads(p.stdout)
        except Exception as e:
            writer.writerow([local, title, '', '', '', '', '', 'api-error:' + str(e)])
            time.sleep(0.3)
            continue
        pages = data.get('query', {}).get('pages', {})
        if not pages:
            writer.writerow([local, title, '', '', '', '', '', 'no-page'])
            time.sleep(0.3)
            continue
        page = next(iter(pages.values()))
        info = page.get('imageinfo', [{}])[0]
        ext = info.get('extmetadata', {}) or {}

        # try several keys for each value
        def pick(keys):
            for k in keys:
                v = ext.get(k, {}).get('value')
                if v:
                    return strip_html(v)
            return ''

        obj = pick(['ObjectName','ImageName','Title'])
        artist = pick(['Artist','Author','Credit','Attribution','Creator'])
        date = pick(['DateTimeOriginal','DateTime','Date','ImageDate'])
        lic = pick(['LicenseShortName','License','LicenseUrl'])
        usage = pick(['UsageTerms','Restrictions','Copyrighted'])

        # source URL: prefer the descriptionurl returned by the API
        source = info.get('descriptionurl') or ('https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(title))

        notes = []
        if not artist:
            notes.append('no-artist')
        if not date:
            notes.append('no-date')
        if not lic:
            notes.append('no-license')

        writer.writerow([local, obj, artist, date, lic, usage, source, ';'.join(notes)])
        time.sleep(0.3)

print('Wrote', out)
