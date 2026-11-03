(function () {
  var COL = { UPI: '#6D5BD0', Cash: '#1F9D6B', Card: '#E08A00', Other: '#7A8794' };
  var BG = { UPI: '#EFEDFB', Cash: '#E3F5EC', Card: '#FCF0DC', Other: '#EDF0F3' };
  var MODES = ['UPI', 'Cash', 'Card', 'Other'];
  var inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2, minimumFractionDigits: 0 });
  var ROWS = 22;

  var CSS = '.rp{width:794px;height:1123px;background:#fff;color:#14212B;font-family:"Plus Jakarta Sans",system-ui,sans-serif;position:relative;overflow:hidden;font-size:13px;line-height:1.4}' +
    '.rp *{box-sizing:border-box;margin:0;padding:0}' +
    '.rp .hd{background:linear-gradient(135deg,#0B6E66,#12968A);color:#fff;padding:34px 40px 28px;display:flex;justify-content:space-between;align-items:flex-end}' +
    '.rp .hd.s{padding:24px 40px 20px}' +
    '.rp .lg{display:flex;align-items:center;gap:12px}' +
    '.rp .mark{width:40px;height:40px;border-radius:11px;background:rgba(255,255,255,.18);display:flex;align-items:flex-end;justify-content:center;gap:4px;padding:9px 0}' +
    '.rp .mark i{display:block;width:6px;border-radius:2px;background:#fff}' +
    '.rp .bn{font-size:22px;font-weight:800;letter-spacing:-.02em}.rp .sub{font-size:12px;opacity:.8}' +
    '.rp .per{text-align:right;font-size:12px;opacity:.9}.rp .per b{display:block;font-size:19px;font-weight:700;opacity:1}' +
    '.rp .bd{padding:22px 40px 0}' +
    '.rp .acct{display:flex;align-items:center;gap:14px;border:1px solid #E3E9EE;border-radius:14px;padding:14px 16px;margin-bottom:16px}' +
    '.rp .av{width:44px;height:44px;border-radius:50%;background:#0B6E66;color:#fff;font-weight:800;font-size:18px;display:flex;align-items:center;justify-content:center}' +
    '.rp .acct .w{flex:1}.rp .acct b{display:block;font-size:15px}.rp .acct span{color:#667684;font-size:12px}' +
    '.rp .meta{text-align:right;color:#667684;font-size:11px}.rp .meta b{font-size:12px;color:#14212B}' +
    '.rp .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}' +
    '.rp .st{background:#F3F7F9;border-radius:14px;padding:14px 16px}.rp .st.h{background:#0B6E66;color:#fff}' +
    '.rp .st small{display:block;font-size:11px;color:#667684;font-weight:600}.rp .st.h small{color:rgba(255,255,255,.8)}' +
    '.rp .st b{display:block;font-size:21px;font-weight:800;letter-spacing:-.02em;margin-top:2px}.rp .st em{font-style:normal;font-size:11px;color:#667684}.rp .st.h em{color:rgba(255,255,255,.8)}' +
    '.rp .two{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}' +
    '.rp .cd{border:1px solid #E3E9EE;border-radius:14px;padding:16px}' +
    '.rp h3{font-size:13px;font-weight:700;margin-bottom:12px}' +
    '.rp .sb{display:flex;height:12px;border-radius:99px;overflow:hidden;background:#E8EEF2;margin-bottom:12px}.rp .sb i{display:block;height:100%}' +
    '.rp .mr{display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid #EEF2F5}.rp .mr:first-of-type{border-top:0}' +
    '.rp .mr i{width:10px;height:10px;border-radius:50%;flex:none}.rp .mr span{font-weight:600;width:44px}.rp .mr em{font-style:normal;color:#667684;font-size:11px;flex:1}' +
    '.rp .mr b{font-size:12px}.rp .mr u{text-decoration:none;color:#667684;font-size:11px;width:34px;text-align:right}' +
    '.rp .tr{display:flex;align-items:flex-end;gap:6px;height:150px}.rp .tc{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;min-width:0}' +
    '.rp .tv{font-size:9px;color:#667684;font-weight:600;height:14px}.rp .tb{width:100%;max-width:34px;background:#0B6E66;border-radius:6px 6px 2px 2px}' +
    '.rp .tl{font-size:10px;font-weight:600;margin-top:5px}.rp .ts{font-size:9px;color:#8FA0AD}' +
    '.rp .tp{display:flex;align-items:center;gap:12px;padding:8px 0;border-top:1px solid #EEF2F5}.rp .tp:first-of-type{border-top:0}' +
    '.rp .rk{width:24px;height:24px;border-radius:8px;background:#E3F1EF;color:#0B6E66;font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;flex:none}' +
    '.rp .tp .w{flex:1;min-width:0}.rp .tp b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rp .tp span{color:#667684;font-size:11px}.rp .tp .a{font-weight:800}' +
    '.rp .th,.rp .tx{display:grid;grid-template-columns:96px 1fr 130px 110px;gap:10px;align-items:center;padding:0 12px}' +
    '.rp .th{height:34px;font-size:11px;font-weight:700;color:#667684;text-transform:uppercase;letter-spacing:.04em;border-bottom:2px solid #0B6E66}' +
    '.rp .tx{height:36px;border-bottom:1px solid #EEF2F5}.rp .tx:nth-child(even){background:#F8FAFB}' +
    '.rp .tx .n{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600}.rp .tx .d{color:#667684;font-size:12px}' +
    '.rp .chip{display:inline-block;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;max-width:130px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.rp .r{text-align:right;font-weight:700}' +
    '.rp .tt{display:flex;justify-content:space-between;margin-top:14px;padding:12px 14px;background:#0B6E66;color:#fff;border-radius:12px;font-weight:800;font-size:14px}' +
    '.rp .ft{position:absolute;left:40px;right:40px;bottom:22px;display:flex;justify-content:space-between;font-size:10px;color:#8FA0AD;border-top:1px solid #EEF2F5;padding-top:10px}';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function dt(iso, o) { return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', o); }
  function short(n) { return '₹' + (n >= 100000 ? (n / 100000).toFixed(1) + 'L' : n >= 1000 ? (n / 1000).toFixed(1) + 'k' : Math.round(n)); }
  function what(i) { return i.what || i.note || i.cat || 'Expense'; }
  function method(i) { return i.mode === 'Other' && i.other ? i.other : i.mode; }
  function mk() { return '<div class="mark"><i style="height:9px"></i><i style="height:15px"></i><i style="height:22px"></i></div>'; }

  function analyse(list, scope, month) {
    var by = {}, total = 0, now = new Date();
    MODES.forEach(function (m) { by[m] = { a: 0, n: 0 }; });
    list.forEach(function (i) { var m = by[i.mode] ? i.mode : 'Other'; by[m].a += i.amt; by[m].n++; total += i.amt; });
    var n = list.length, max = null;
    list.forEach(function (i) { if (!max || i.amt > max.amt) max = i; });
    var days = 1, tr = [], dim = 30;
    if (scope === 'month') {
      var p = month.split('-'); dim = new Date(+p[0], +p[1], 0).getDate();
      var cur = now.getFullYear() === +p[0] && now.getMonth() === +p[1] - 1;
      days = cur ? now.getDate() : dim;
      var wk = Math.ceil(dim / 7);
      for (var w = 1; w <= wk; w++) tr.push({ l: 'Week ' + w, s: ((w - 1) * 7 + 1) + '–' + Math.min(w * 7, dim), a: 0 });
      list.forEach(function (i) { tr[Math.min(wk, Math.ceil(+i.date.slice(8, 10) / 7)) - 1].a += i.amt; });
    } else if (n) {
      var mn = list[0].date; list.forEach(function (i) { if (i.date < mn) mn = i.date; });
      days = Math.max(1, Math.round((now - new Date(mn + 'T00:00:00')) / 864e5) + 1);
      var map = {}; list.forEach(function (i) { var k = i.date.slice(0, 7); map[k] = (map[k] || 0) + i.amt; });
      tr = Object.keys(map).sort().slice(-12).map(function (k) { return { l: dt(k + '-01', { month: 'short' }), s: k.slice(0, 4), a: map[k] }; });
    }
    var top = MODES.slice().sort(function (a, b) { return by[b].a - by[a].a; })[0];
    return { by: by, total: total, n: n, max: max, days: days, tr: tr, top: by[top].a > 0 ? top : null };
  }

  function build(o) {
    var scope = o.scope, user = o.user || {}, items = o.items || [];
    var list = (scope === 'month' ? items.filter(function (i) { return i.date.slice(0, 7) === o.month; }) : items.slice())
      .sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : (a.id < b.id ? -1 : 1); });
    var A = analyse(list, scope, o.month);
    var period;
    if (scope === 'month') { var p = o.month.split('-'); period = new Date(+p[0], +p[1] - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }); }
    else period = list.length ? dt(list[0].date, { day: 'numeric', month: 'short', year: 'numeric' }) + ' – ' + dt(list[list.length - 1].date, { day: 'numeric', month: 'short', year: 'numeric' }) : 'All time';
    var label = scope === 'month' ? period : 'All time';
    var chunks = []; for (var k = 0; k < list.length; k += ROWS) chunks.push(list.slice(k, k + ROWS));
    var total = 1 + chunks.length, gen = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    var ft = function (n) { return '<div class="ft"><span>Spendora · Expense report</span><span>Page ' + n + ' of ' + total + '</span></div>'; };
    var nm = (user.name || user.email || '?').trim();

    var sum = '<div class="rp"><div class="hd"><div class="lg">' + mk() + '<div><div class="bn">Spendora</div><div class="sub">Expense report</div></div></div>' +
      '<div class="per">' + (scope === 'month' ? 'Month' : 'Period') + '<b>' + esc(period) + '</b></div></div><div class="bd">' +
      '<div class="acct"><div class="av">' + esc(nm.charAt(0).toUpperCase()) + '</div><div class="w"><b>' + esc(user.name || '—') + '</b><span>' + esc(user.email || '') + '</span></div>' +
      '<div class="meta">Generated on<br><b>' + gen + '</b></div></div>';
    if (!A.n) {
      sum += '<div class="cd" style="text-align:center;padding:60px 20px;color:#667684">No expenses recorded for this period.</div></div>' + ft(1) + '</div>';
      return [sum];
    }
    var cards = [
      ['h', 'Total spent', inr.format(A.total), A.n + ' transactions'],
      ['', 'Average per transaction', inr.format(A.total / A.n), 'across ' + A.n + ' entries'],
      ['', 'Daily average', inr.format(A.total / A.days), 'over ' + A.days + (A.days === 1 ? ' day' : ' days')],
      ['', 'Highest expense', inr.format(A.max.amt), esc(what(A.max)).slice(0, 28)],
      ['', 'Most used method', A.top || '—', A.top ? A.by[A.top].n + ' transactions' : ''],
      ['', 'Largest method share', A.top ? Math.round(A.by[A.top].a / A.total * 100) + '%' : '—', A.top ? 'of total spending' : '']
    ];
    sum += '<div class="grid">' + cards.map(function (c) { return '<div class="st ' + c[0] + '"><small>' + c[1] + '</small><b>' + c[2] + '</b><em>' + c[3] + '</em></div>'; }).join('') + '</div>';
    var bar = MODES.map(function (m) { return A.by[m].a ? '<i style="width:' + (A.by[m].a / A.total * 100) + '%;background:' + COL[m] + '"></i>' : ''; }).join('');
    var rows = MODES.map(function (m) { var b = A.by[m]; return '<div class="mr"><i style="background:' + COL[m] + '"></i><span>' + m + '</span><em>' + b.n + ' txns</em><b>' + inr.format(b.a) + '</b><u>' + Math.round(b.a / A.total * 100) + '%</u></div>'; }).join('');
    var mx = Math.max.apply(null, A.tr.map(function (t) { return t.a; })) || 1;
    var trend = A.tr.map(function (t) { return '<div class="tc"><div class="tv">' + (t.a ? short(t.a) : '') + '</div><div class="tb" style="height:' + Math.max(t.a ? 4 : 1, t.a / mx * 100) + 'px"></div><div class="tl">' + t.l + '</div><div class="ts">' + t.s + '</div></div>'; }).join('');
    sum += '<div class="two"><div class="cd"><h3>Payment methods</h3><div class="sb">' + bar + '</div>' + rows + '</div><div class="cd"><h3>' + (scope === 'month' ? 'Weekly spending' : 'Monthly spending') + '</h3><div class="tr">' + trend + '</div></div></div>';
    var top5 = list.slice().sort(function (a, b) { return b.amt - a.amt; }).slice(0, 5);
    sum += '<div class="cd"><h3>Top 5 expenses</h3>' + top5.map(function (i, x) {
      return '<div class="tp"><div class="rk">' + (x + 1) + '</div><div class="w"><b>' + esc(what(i)) + '</b><span>' + dt(i.date, { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + esc(method(i)) + '</span></div><div class="a">' + inr.format(i.amt) + '</div></div>';
    }).join('') + '</div></div>' + ft(1) + '</div>';

    var pages = [sum];
    chunks.forEach(function (ch, ci) {
      var h = '<div class="rp"><div class="hd s"><div class="lg">' + mk() + '<div><div class="bn">Transactions</div><div class="sub">' + esc(label) + ' · ' + list.length + ' entries</div></div></div><div class="per">' + esc(user.name || '') + '</div></div><div class="bd">' +
        '<div class="th"><span>Date</span><span>Spent on</span><span>Method</span><span class="r">Amount</span></div>';
      h += ch.map(function (i) {
        return '<div class="tx"><span class="d">' + dt(i.date, scope === 'month' ? { day: '2-digit', month: 'short' } : { day: '2-digit', month: 'short', year: 'numeric' }) + '</span><span class="n">' + esc(what(i)) + '</span>' +
          '<span><span class="chip" style="background:' + BG[i.mode] + ';color:' + COL[i.mode] + '">' + esc(method(i)) + '</span></span><span class="r">' + inr.format(i.amt) + '</span></div>';
      }).join('');
      if (ci === chunks.length - 1) h += '<div class="tt"><span>Total</span><span>' + inr.format(A.total) + '</span></div>';
      pages.push(h + '</div>' + ft(ci + 2) + '</div>');
    });
    return pages;
  }

  function generate(o) {
    var ready = (document.fonts && document.fonts.ready) || Promise.resolve();
    return ready.then(function () {
      var pages = build(o);
      var root = document.createElement('div');
      root.style.cssText = 'position:absolute;left:-10000px;top:0;width:794px';
      root.innerHTML = '<style>' + CSS + '</style>' + pages.join('');
      document.body.appendChild(root);
      window.scrollTo(0, 0);
      var els = root.querySelectorAll('.rp'), pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), i = 0;
      function next() {
        if (i >= els.length) return Promise.resolve();
        return window.html2canvas(els[i], { scale: 2, backgroundColor: '#ffffff', logging: false }).then(function (c) {
          if (i > 0) pdf.addPage();
          pdf.addImage(c.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
          i++; return next();
        });
      }
      return next().then(function () {
        var name = o.scope === 'month' ? 'Spendora-Report-' + o.month + '.pdf' : 'Spendora-Report-All-Time.pdf';
        pdf.save(name); root.remove(); return name;
      }).catch(function (e) { root.remove(); throw e; });
    });
  }
  window.SpendoraReport = { generate: generate, _build: build, _css: CSS };
})();
