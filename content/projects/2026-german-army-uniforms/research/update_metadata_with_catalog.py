#!/usr/bin/env python3
import csv, subprocess, json, urllib.parse, re, html

infile = 'images/metadata.csv'
outfile = 'images/metadata.csv.tmp'

def strip_html(s):
    if not s:
        return ''
    s = html.unescape(s)
    s = re.sub(r'<[^>]+>', '', s)
    return ' '.join(s.split())

with open(infile, newline='', encoding='utf-8') as inf:
    reader = list(csv.DictReader(inf))
    fieldnames = reader[0].keys()
    # add columns if missing
    extra_cols = ['Catalog', 'AttributionFull']
    new_fieldnames = list(fieldnames) + [c for c in extra_cols if c not in fieldnames]

    outrows = []
    for row in reader:
        src = row.get('SourceURL','')
        catalog = ''
        attrfull = ''
        if src:
            # extract title after /wiki/File:
            try:
                parsed = urllib.parse.urlparse(src)
                if parsed.path.startswith('/wiki/File:'):
                    title = urllib.parse.unquote(parsed.path.split('/wiki/File:')[1])
                else:
                    title = ''
            except Exception:
                title = ''
            if title:
                # call commons API via curl to avoid encoding issues
                cmd = [
                    'curl','-s','--get','--data-urlencode',f'titles=File:{title}',
                    '--data','action=query&format=json&prop=imageinfo&iiprop=extmetadata|url',
                    'https://commons.wikimedia.org/w/api.php'
                ]
                try:
                    p = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
                    data = json.loads(p.stdout)
                    pages = data.get('query',{}).get('pages',{})
                    page = next(iter(pages.values()))
                    info = page.get('imageinfo',[{}])[0]
                    ext = info.get('extmetadata',{}) or {}
                    # Prefer Attribution, then Credit, then ObjectName
                    catalog = strip_html(ext.get('Attribution',{}).get('value','')) or strip_html(ext.get('Credit',{}).get('value','')) or strip_html(ext.get('ObjectName',{}).get('value',''))
                    attrfull = strip_html(ext.get('Credit',{}).get('value','')) or strip_html(ext.get('Attribution',{}).get('value',''))
                except Exception as e:
                    catalog = ''
                    attrfull = ''
        row['Catalog'] = catalog
        row['AttributionFull'] = attrfull
        outrows.append(row)

with open(outfile, 'w', newline='', encoding='utf-8') as outf:
    writer = csv.DictWriter(outf, fieldnames=new_fieldnames)
    writer.writeheader()
    for r in outrows:
        writer.writerow(r)

# replace original
import os
os.replace(outfile, infile)
print('Updated', infile)
