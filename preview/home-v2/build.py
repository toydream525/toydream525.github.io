#!/usr/bin/env python3
"""Build only this preview's app cards and filters from catalog.json (stdlib only)."""
from pathlib import Path
from html import escape
from urllib.parse import urlparse
import json, re
BASE = Path(__file__).resolve().parent

def esc(value): return escape(str(value), quote=True)
def safe_url(value):
    if not isinstance(value,str) or not value or value.startswith('//'):
        raise ValueError('A nonempty relative path or HTTPS URL is required')
    if urlparse(value).scheme not in ('','https'):
        raise ValueError('Only local paths and HTTPS links are allowed')
    return esc(value)
def icon(name):
    if name not in ('camera','flower','star','arrow','external','github'): raise ValueError('Unknown icon')
    return f'<svg class="icon" aria-hidden="true"><use href="#i-{name}"/></svg>'

def build():
    apps=json.loads((BASE/'catalog.json').read_text())
    ids=set(); cards=[]; categories=[]
    for app in apps:
        aid=app['id']
        if not re.fullmatch(r'[a-z][a-z0-9-]*',aid) or aid in ids: raise ValueError('App IDs must be unique slugs')
        ids.add(aid)
        if app['category'] not in categories: categories.append(app['category'])
        if app['tone'] not in ('blue','pink','navy'): raise ValueError('Unsupported card tone')
        mark=f'<img src="{safe_url(app["iconImage"])}" width="47" height="47" alt="" loading="lazy">' if app.get('iconImage') else icon(app['icon'])
        terms=' '.join([app['name'],app['subtitle'],app['category'],app['description'],*app['platforms']]).lower()
        tags=''.join(f'<span class="platform-tag">{esc(x)}</span>' for x in app['platforms'])
        cards.append(f"""<article class="app-card" data-id="{esc(aid)}" data-category="{esc(app['category'])}" data-search="{esc(terms)}" aria-labelledby="title-{esc(aid)}">
 <div class="app-cover"><img src="{safe_url(app['cover'])}" alt="{esc(app['coverAlt'])}" width="960" height="600" loading="lazy"><span class="app-category">{esc(app['category'])}</span></div>
 <div class="app-body"><div class="app-title-row"><span class="app-mark {esc(app['tone'])}" aria-hidden="true">{mark}</span><div><h3 id="title-{esc(aid)}">{esc(app['name'])}</h3><p class="app-subtitle">{esc(app['subtitle'])}</p></div></div>
 <p class="app-description">{esc(app['description'])}</p><div class="app-platforms">{tags}<span class="app-status">{esc(app['status'])}</span></div><p class="app-note">{esc(app['note'])}</p>
 <div class="app-actions"><a class="app-link" href="{safe_url(app['url'])}" aria-label="{esc(app['action'])}：{esc(app['name'])}">{esc(app['action'])}{icon('arrow')}</a><a class="source-link" href="{safe_url(app['source'])}" target="_blank" rel="noopener noreferrer" aria-label="{esc(app['name'])} 的源代码">{icon('github')}源代码{icon('external')}</a></div></div></article>""")
    filters='<button class="filter-button" type="button" data-filter="all" aria-pressed="true">全部应用</button>'
    for c in categories: filters+=f'<button class="filter-button" type="button" data-filter="{esc(c)}" aria-pressed="false">{esc(c)}</button>'
    path=BASE/'index.html'; text=path.read_text()
    for name,value in [('APPS','\n'.join(cards)),('FILTERS',filters)]:
        pattern=rf'<!-- {name}:START -->.*?<!-- {name}:END -->'
        text,count=re.subn(pattern,lambda m:f'<!-- {name}:START -->\n{value}\n<!-- {name}:END -->',text,flags=re.S)
        if count!=1: raise ValueError(f'Expected exactly one {name} marker pair')
    path.write_text(text)
    print(f'Built {len(apps)} apps in {path}; no files outside the preview changed.')
if __name__=='__main__': build()
