/* =============================================================
   赣鄱农韵 · 首页交互 (home.js)
   负责人：周怡洁（队长）
   包含：数字滚动动画 / 数据看板图表 / 图表数据（可替换为接口）
   ============================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     数据源：目前为前端静态示例，接入后端后换成
     fetch('/api/dashboard').then(r => r.json())
     注意：答辩前必须用学院 / 科研处提供的口径替换本段数值。
     --------------------------------------------------------- */
  var DATA = {
    // 顶部四个关键数字
    stats: [
      { value: 1.5, unit: '亿亩', label: '超级稻累计推广面积', delta: '覆盖长江中下游稻区', fixed: 1 },
      { value: 210, unit: '个', label: '审定农作物新品种', delta: '水稻 · 油菜 · 果蔬', fixed: 0 },
      { value: 46, unit: '个', label: '科技小院与示范基地', delta: '研究生常驻生产一线', fixed: 0 },
      { value: 11, unit: '个', label: '科技服务覆盖地市', delta: '江西全省设区市', fixed: 0 }
    ],

    // 折线：水稻新品种累计推广面积（万亩）
    trend: {
      name: '水稻新品种累计推广面积',
      unit: ' 万亩',
      labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      values: [860, 1040, 1230, 1460, 1700, 1980, 2260, 2540],
      info: [
        '双季稻高产攻关启动，新品种进入区域试验',
        '优质稻米产业化示范落地 12 个县',
        '耐盐碱水稻材料筛选取得阶段进展',
        '超级稻百亩片平均亩产刷新省内纪录',
        '水稻机械化直播技术配套成型',
        '赣中稻区绿色高产高效模式大面积推广',
        '种粮一体化订单覆盖 30 余个乡镇',
        '累计推广面积突破 2500 万亩'
      ]
    },

    // 条形：各地市江农科技帮扶项目数（个）
    city: {
      name: '各地市江农科技帮扶项目数',
      unit: ' 个项目',
      labels: ['赣州', '吉安', '宜春', '上饶', '抚州', '九江', '南昌', '萍乡', '新余', '景德镇', '鹰潭'],
      values: [42, 33, 28, 26, 22, 19, 18, 14, 11, 10, 9],
      info: [
        '脐橙品质提升与丘陵机械化栽培示范',
        '井冈山区域双季稻绿色高产模式',
        '富硒水稻与油菜轮作技术推广',
        '婺源绿茶生态茶园管理技术',
        '广昌白莲品种提纯与绿色防控',
        '鄱阳湖流域稻田面源污染监测',
        '城郊设施蔬菜与都市农业示范',
        '水稻病虫害绿色防控示范',
        '新余蜜桔品质提升与产后保鲜',
        '浮梁茶产业科技特派员服务',
        '稻渔综合种养模式试验'
      ]
    }
  };

  /* ---------------- 1. 数字滚动 ---------------- */
  function animateNumber(el) {
    var target = parseFloat(el.dataset.count);
    var fixed = parseInt(el.dataset.fixed || '0', 10);
    var dur = 1400;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      // easeOutCubic
      var e = 1 - Math.pow(1 - p, 3);
      var val = target * e;
      el.textContent = fixed > 0 ? val.toFixed(fixed) : Math.round(val).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fixed > 0 ? target.toFixed(fixed) : target.toLocaleString('en-US');
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = parseFloat(c.dataset.count).toLocaleString('en-US');
    });
  }

  /* ---------------- 2. 图表 ---------------- */
  // 优先加载 ECharts（CDN），失败或超时则使用 charts.js 内置 SVG 渲染
  function loadECharts(done) {
    if (window.echarts) return done();
    var s = document.createElement('script');
    var settled = false;
    var timer = setTimeout(finish, 2500);
    function finish() {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      done();
    }
    s.src = 'https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js';
    s.async = true;
    s.onload = finish;
    s.onerror = finish;
    document.head.appendChild(s);
  }

  function initCharts() {
    if (!window.GanpoCharts) return;
    var trendEl = document.getElementById('trendChart');
    var cityEl = document.getElementById('cityChart');
    if (trendEl) window.GanpoCharts.line(trendEl, DATA.trend);
    if (cityEl) window.GanpoCharts.bar(cityEl, DATA.city);
  }

  // 图表在首屏下方，进入视口再初始化，避免无谓开销
  var board = document.querySelector('.board');
  if (board && 'IntersectionObserver' in window) {
    var chartIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          loadECharts(initCharts);
          chartIO.disconnect();
        }
      });
    }, { rootMargin: '120px' });
    chartIO.observe(board);
  } else {
    loadECharts(initCharts);
  }

  /* ---------------- 3. 图表切换（面积 / 城市） ---------------- */
  document.querySelectorAll('[data-chart-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-chart-tab]').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
    });
  });
})();
