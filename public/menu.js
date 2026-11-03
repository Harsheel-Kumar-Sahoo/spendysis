/* Spendysis: menu, profile and daily spending limit.
   Loaded after the main script in index.html, which exposes window.SP. */
(function () {
  var S = window.SP; if (!S) return;
  var $ = function (id) { return document.getElementById(id); };
  var MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var BELL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>';
  var X = '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  function ini(u) { return ((u && (u.name || u.email)) || '?').trim().charAt(0).toUpperCase(); }
  function lim() { var u = S.getUser(); return u && u.limit && u.limit.on && u.limit.amt > 0 ? u.limit.amt : 0; }
  function todayTotal() { var t = S.today(); return S.getItems().reduce(function (s, i) { return i.date === t ? s + i.amt : s; }, 0); }
  function say(el, text, ok) { el.style.color = ok ? 'var(--accent)' : 'var(--danger)'; el.textContent = text; }
  function standalone() { return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }

  /* ---------- inject sheets, banner and today's-limit card ---------- */
  var box = document.createElement('div');
  box.innerHTML =
    '<div class="sheet-bg" id="prof"><div class="sheet" role="dialog" aria-label="Profile">' +
    '<div class="pf-top"><div class="av big" id="p-av"></div><div><h2 id="p-name"></h2><p class="note" id="p-mail"></p><p class="note" id="p-since"></p></div></div>' +
    '<div class="pf-stats"><div><b id="p-n">0</b><small>Entries</small></div><div><b id="p-t">₹0</b><small>Total spent</small></div><div><b id="p-d">0</b><small>Days tracked</small></div></div>' +
    '<label for="p-in">Name</label><input class="in" id="p-in" maxlength="40" autocomplete="name">' +
    '<button class="ghost" id="p-save-name" type="button">Update name</button>' +
    '<details class="pw" id="p-pw"><summary>Change password</summary>' +
    '<label for="p-cur">Current password</label><input class="in" id="p-cur" type="password" autocomplete="current-password">' +
    '<label for="p-new">New password (8+ characters)</label><input class="in" id="p-new" type="password" autocomplete="new-password">' +
    '<button class="ghost" id="p-save-pw" type="button">Change password</button></details>' +
    '<div class="err" id="p-msg"></div>' +
    '<button class="ghost" id="p-close" type="button">Close</button></div></div>' +

    '<div class="sheet-bg" id="lim-sheet"><div class="sheet" role="dialog" aria-label="Daily spending limit">' +
    '<h2>Daily spending limit</h2>' +
    '<p class="note" style="margin:0 0 8px">Optional. Get an alert when your spending for a day goes past this amount.</p>' +
    '<div class="sw-row"><span>Enable daily limit</span><button class="sw" id="l-on" type="button" role="switch" aria-checked="false" aria-label="Enable daily limit"><i></i></button></div>' +
    '<div id="l-wrap" hidden><label for="l-amt">Limit per day (₹)</label>' +
    '<input class="in amtin" id="l-amt" type="number" inputmode="decimal" min="1" step="1" placeholder="e.g. 500">' +
    '<div class="nrow"><div><b>Phone notifications</b><small id="l-nstat"></small></div><button class="ghost sm" id="l-notify" type="button">Allow</button></div>' +
    '<p class="note" id="l-ios" hidden>On iPhone, install the app to your home screen first, then allow notifications.</p>' +
    '<p class="note">An alert appears when an expense you add pushes the day past your limit. It always shows inside the app, and as a phone notification if you allow them. Notifications are not sent while the app is closed.</p></div>' +
    '<div class="err" id="l-msg"></div>' +
    '<button class="save" id="l-save" type="button">Save</button>' +
    '<button class="ghost" id="l-close" type="button">Close</button></div></div>' +

    '<div class="toast" id="toast" role="alert" hidden>' + BELL + '<div class="tt"><b id="t-title"></b><span id="t-msg"></span></div><button id="t-x" type="button" aria-label="Dismiss">' + X + '</button></div>';
  while (box.firstChild) document.body.appendChild(box.firstChild);

  var hero = document.querySelector('#v-home .hero');
  var card = document.createElement('div');
  card.className = 'limcard'; card.id = 'limcard'; card.hidden = true;
  card.innerHTML = '<div class="lr"><span>Today’s limit</span><b id="lc-txt"></b></div><div class="lbar"><i id="lc-bar"></i></div><small id="lc-sub"></small>';
  if (hero) hero.parentNode.insertBefore(card, hero.nextSibling);

  /* ---------- menu drawer ---------- */
  var mbg = $('menu-bg'), dr = $('drawer');
  function refreshMenu() {
    var u = S.getUser() || {};
    $('m-av').textContent = ini(u);
    $('m-name').textContent = u.name || 'Your account';
    $('m-mail').textContent = u.email || '';
    $('m-lim-sub').textContent = lim() ? S.fmt.format(lim()) + ' per day' : 'Off';
  }
  function openMenu() { refreshMenu(); mbg.classList.add('open'); dr.classList.add('open'); $('menu-x').focus(); }
  function closeMenu() { mbg.classList.remove('open'); dr.classList.remove('open'); }
  $('menu-btn').onclick = openMenu;
  $('menu-x').onclick = closeMenu;
  mbg.onclick = closeMenu;
  ['install', 'export', 'logout'].forEach(function (id) { $(id).addEventListener('click', closeMenu); });

  /* ---------- profile ---------- */
  function fillProfileHead() {
    var u = S.getUser() || {}, d = u.createdAt ? new Date(u.createdAt) : null;
    $('p-av').textContent = ini(u);
    $('p-name').textContent = u.name || 'Your account';
    $('p-mail').textContent = u.email || '';
    $('p-since').textContent = d && !isNaN(d) ? 'Member since ' + MN[d.getMonth()] + ' ' + d.getFullYear() : '';
  }
  function openProfile() {
    closeMenu();
    var its = S.getItems(), tot = 0, days = {};
    its.forEach(function (i) { tot += i.amt; days[i.date] = 1; });
    fillProfileHead();
    $('p-n').textContent = its.length;
    $('p-t').textContent = S.fmt.format(tot);
    $('p-d').textContent = Object.keys(days).length;
    $('p-in').value = (S.getUser() || {}).name || '';
    $('p-cur').value = ''; $('p-new').value = ''; $('p-msg').textContent = ''; $('p-pw').open = false;
    $('prof').classList.add('open');
  }
  $('m-profile').onclick = openProfile;
  $('p-close').onclick = function () { $('prof').classList.remove('open'); };
  $('prof').onclick = function (e) { if (e.target === $('prof')) $('prof').classList.remove('open'); };
  $('p-save-name').onclick = function () {
    var n = $('p-in').value.trim(), b = this;
    if (!n) return say($('p-msg'), 'Enter your name.');
    b.disabled = true;
    S.api('/auth/me', { method: 'PUT', body: JSON.stringify({ name: n }) })
      .then(function (u) { S.setUser(u); fillProfileHead(); say($('p-msg'), 'Name updated ✓', true); })
      .catch(function (e) { say($('p-msg'), e.message); })
      .then(function () { b.disabled = false; });
  };
  $('p-save-pw').onclick = function () {
    var c = $('p-cur').value, n = $('p-new').value, b = this;
    if (!c || n.length < 8) return say($('p-msg'), 'Enter your current password and a new one with 8+ characters.');
    b.disabled = true;
    S.api('/auth/password', { method: 'PUT', body: JSON.stringify({ current: c, next: n }) })
      .then(function () { $('p-cur').value = ''; $('p-new').value = ''; say($('p-msg'), 'Password changed ✓', true); })
      .catch(function (e) { say($('p-msg'), e.message); })
      .then(function () { b.disabled = false; });
  };

  /* ---------- daily limit ---------- */
  function setSwitch(on) { $('l-on').setAttribute('aria-checked', String(on)); $('l-wrap').hidden = !on; }
  function notifStat() {
    var st = $('l-nstat'), b = $('l-notify');
    if (!('Notification' in window)) { st.textContent = 'Not supported on this browser'; b.hidden = true; return; }
    var p = Notification.permission;
    b.hidden = p === 'granted' || p === 'denied';
    st.textContent = p === 'granted' ? 'Allowed' : p === 'denied' ? 'Blocked. Turn them on in your browser or phone settings.' : 'Not allowed yet';
    $('l-ios').hidden = !(/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone());
  }
  function openLimit() {
    closeMenu();
    var L = (S.getUser() || {}).limit || {};
    setSwitch(!!L.on); $('l-amt').value = L.amt || ''; $('l-msg').textContent = '';
    notifStat(); $('lim-sheet').classList.add('open');
  }
  $('m-limit').onclick = openLimit;
  $('l-close').onclick = function () { $('lim-sheet').classList.remove('open'); };
  $('lim-sheet').onclick = function (e) { if (e.target === $('lim-sheet')) $('lim-sheet').classList.remove('open'); };
  $('l-on').onclick = function () {
    var on = $('l-on').getAttribute('aria-checked') !== 'true';
    setSwitch(on); if (on) $('l-amt').focus();
  };
  $('l-notify').onclick = function () {
    try { Promise.resolve(Notification.requestPermission()).then(notifStat); } catch (e) { notifStat(); }
  };
  $('l-save').onclick = function () {
    var on = $('l-on').getAttribute('aria-checked') === 'true', amt = parseFloat($('l-amt').value) || 0, b = this;
    if (on && !(amt > 0)) return say($('l-msg'), 'Enter a limit greater than 0.');
    if (on && 'Notification' in window && Notification.permission === 'default') {
      try { Promise.resolve(Notification.requestPermission()).then(notifStat); } catch (e) {}
    }
    b.disabled = true;
    S.api('/auth/limit', { method: 'PUT', body: JSON.stringify({ on: on, amt: amt }) })
      .then(function (u) {
        S.setUser(u); renderLimit(); refreshMenu();
        say($('l-msg'), on ? 'Daily limit set to ' + S.fmt.format(amt) + ' ✓' : 'Daily limit turned off ✓', true);
      })
      .catch(function (e) { say($('l-msg'), e.message); })
      .then(function () { b.disabled = false; });
  };

  /* ---------- today's limit card ---------- */
  function renderLimit() {
    var L = lim();
    if (!L) { card.hidden = true; return; }
    var t = todayTotal(), over = Math.round(t * 100) > Math.round(L * 100);
    card.hidden = false;
    card.className = 'limcard' + (over ? ' over' : t >= L * 0.8 ? ' warn' : '');
    $('lc-txt').textContent = S.fmt.format(t) + ' / ' + S.fmt.format(L);
    $('lc-bar').style.width = Math.min(100, t / L * 100) + '%';
    $('lc-sub').textContent = over ? 'Over today’s limit by ' + S.fmt.format(t - L) : S.fmt.format(L - t) + ' left today';
  }

  /* ---------- alerts ---------- */
  var tt;
  function showToast(title, msg) {
    $('t-title').textContent = title; $('t-msg').textContent = msg; $('toast').hidden = false;
    clearTimeout(tt); tt = setTimeout(function () { $('toast').hidden = true; }, 9000);
  }
  $('t-x').onclick = function () { $('toast').hidden = true; };
  function sysNotify(title, body) {
    try {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      var o = { body: body, icon: '/icon-192.png', badge: '/icon-192.png', tag: 'spendysis-limit', renotify: true };
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(function (r) { return r.showNotification(title, o); })
          .catch(function () { try { new Notification(title, o); } catch (e) {} });
      } else new Notification(title, o);
    } catch (e) {}
  }
  function alertLimit(total, L) {
    var msg = 'You have spent ' + S.fmt.format(total) + ' today. Your daily limit is ' + S.fmt.format(L) + '.';
    showToast('Daily limit crossed', msg); sysNotify('Daily limit crossed', msg);
  }

  S.hooks.render = renderLimit;
  S.hooks.saved = function (before) {
    var L = lim(); if (!L) return;
    var a = Math.round(todayTotal() * 100), b = Math.round(before * 100), l = Math.round(L * 100);
    if (b <= l && a > l) alertLimit(a / 100, L);
  };

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeMenu(); $('prof').classList.remove('open'); $('lim-sheet').classList.remove('open');
  });
  renderLimit();
})();
