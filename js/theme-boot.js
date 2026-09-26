/* theme-boot.js — тема до загрузки стилей, чтобы не было мигания.
   Вынесен из index.html: встроенные скрипты запрещены политикой CSP. */
(function () {
  try {
    var s = JSON.parse(localStorage.getItem('eg.settings') || '{}');
    var t = s.theme || 'auto';
    if (t === 'auto') t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) { document.documentElement.setAttribute('data-theme', 'light'); }
})();
