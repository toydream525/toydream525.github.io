/* Progressive enhancement: all product links remain usable without JavaScript. */
(() => {
 'use strict';
 const $ = (s) => document.querySelector(s);
 const search = $('#app-search');
 const cards = [...document.querySelectorAll('.app-card')];
 const filters = [...document.querySelectorAll('.filter-button')];
 const more = $('#load-more');
 let category = 'all', limit = 6;
 function render() {
   const term = search.value.trim().toLocaleLowerCase();
   let total = 0, visible = 0;
   for (const card of cards) {
     const matches = (category === 'all' || card.dataset.category === category) && card.dataset.search.includes(term);
     if (matches) total++;
     card.hidden = !matches || total > limit;
     if (!card.hidden) visible++;
   }
   $('#empty-state').hidden = total > 0;
   more.hidden = total <= limit;
   $('#catalog-status').textContent = `找到 ${total} 个应用，当前显示 ${visible} 个。`;
 }
 filters.forEach(button => button.addEventListener('click', () => {
   category = button.dataset.filter; limit = 6;
   filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
   render();
 }));
 search.addEventListener('input', () => { limit = 6; render(); });
 more.addEventListener('click', () => { limit += 6; render(); });
 $('#reset-search').addEventListener('click', () => {
   search.value = ''; filters[0].click(); search.focus();
 });
 const menu = $('#mobile-nav'), toggle = $('#menu-toggle');
 function closeMenu() { menu.hidden = true; toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','打开导航菜单'); }
 toggle.addEventListener('click', () => {
   const open = toggle.getAttribute('aria-expanded') !== 'true';
   menu.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
 });
 menu.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
 document.addEventListener('click',event=>{if(!menu.hidden&&!event.target.closest('.site-header'))closeMenu();});
 window.matchMedia('(min-width:651px)').addEventListener('change', event => { if(event.matches) closeMenu(); });
 function focusSearch() {
   closeMenu(); $('#apps').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
   search.focus({preventScroll:true});
 }
 $('.search-trigger').addEventListener('click',focusSearch);
 document.addEventListener('keydown', event => {
   const editing = event.target.matches('input,textarea,select,[contenteditable="true"]');
   if (event.key === '/' && !editing && !event.ctrlKey && !event.metaKey && !event.altKey) {event.preventDefault();focusSearch();}
   if (event.key === 'Escape') {closeMenu(); if(document.activeElement===search){search.value='';limit=6;render();search.blur();}}
 });
 $('#year').textContent = String(new Date().getFullYear());
 render();
})();
