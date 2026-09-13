/* Яндекс.Метрика. Номер счётчика и цели живут в одном файле, а не в копиях
   по страницам. Пока METRIKA_ID = 0, счётчик не подключается и ничего не шлёт —
   вписать номер из кабинета metrika.yandex.ru, и все цели заработают. */

var METRIKA_ID = 0;

(function () {
  if (!METRIKA_ID) { return; }
  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) { return; }
    }
    k = e.createElement(t); a = e.getElementsByTagName(t)[0];
    k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + METRIKA_ID, 'ym');

  ym(METRIKA_ID, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true
  });
})();

/* Единая точка отправки цели. Если Метрику заблокировал браузер или счётчик
   ещё не вписан — вызов просто ничего не делает. */
window.goal = function (name, params) {
  try { if (METRIKA_ID && typeof ym === 'function') { ym(METRIKA_ID, 'reachGoal', name, params || {}); } }
  catch (e) {}
};

/* Цели по кликам. Ничего не нужно размечать в HTML: смотрим, куда ведёт ссылка.
   Названия целей — их же завести в кабинете Метрики (тип «JavaScript-событие»):
     contact_whatsapp  клик по WhatsApp
     contact_telegram  клик по Telegram
     contact_phone     клик по телефону
     contact_email     клик по почте
     brief_open        переход к брифу
     brief_send        бриф отправлен (кнопки на brief.html)
     calc_open         переход к расчёту стоимости
     calc_contact      из расчёта написали в мессенджер
     pamyatka_open     открыта памятка к статье
     article_open      открыта статья из раздела «Советы» */
document.addEventListener('click', function (e) {
  var a = e.target.closest('a, button');
  if (!a) { return; }
  var href = a.getAttribute('href') || '';
  var id = a.id || '';
  var page = location.pathname;

  if (href.indexOf('wa.me') > -1) { goal('contact_whatsapp', { page: page }); }
  else if (href.indexOf('t.me') > -1) { goal('contact_telegram', { page: page }); }
  else if (href.indexOf('tel:') === 0) { goal('contact_phone', { page: page }); }
  else if (href.indexOf('mailto:') === 0) { goal('contact_email', { page: page }); }
  else if (/brief\.html/.test(href)) { goal('brief_open', { page: page }); }
  else if (/raschet\.html/.test(href)) { goal('calc_open', { page: page }); }
  else if (/-pamyatka\.html/.test(href)) { goal('pamyatka_open', { page: page }); }
  else if (/sovety\/[a-z-]+\.html/.test(href) && !/index\.html/.test(href)) { goal('article_open', { article: href }); }

  if (id === 'sendWa' || id === 'sendTg' || id === 'sendMail' || id === 'sendCopy') {
    goal('brief_send', { via: id.replace('send', '').toLowerCase() });
  }
}, true);
