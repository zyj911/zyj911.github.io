/* =============================================================
   赣鄱农韵 · 数据图表模块 (charts.js)
   策略：优先使用 ECharts（CDN 可用时）渲染；
        离线 / CDN 被拦截时自动降级为内置 SVG 渲染，
        保证断网答辩现场也有图表可看。
   用法：GanpoCharts.line(el, cfg) / GanpoCharts.bar(el, cfg)
   ============================================================= */
(function (global) {
  'use strict';

  var C = {
    tea: '#5C6F53',
    teaDeep: '#3B4836',
    earth: '#A0714C',
    earthLight: '#C79C78',
    grid: '#EDE7D8',
    axis: '#DDD5C2',
    label: '#8C8578',
    ink: '#4A463E'
  };

  var hasECharts = function () {
    return typeof global.echarts !== 'undefined' && global.echarts && global.echarts.init;
  };

  /* ---------------- 悬浮提示 ---------------- */
  function makeTip(host) {
    var tip = host.querySelector('.chart-tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'chart-tip';
      host.appendChild(tip);
    }
    return tip;
  }

  function showTip(host, tip, x, y, html) {
    tip.innerHTML = html;
    var w = host.clientWidth;
    tip.style.left = Math.max(60, Math.min(w - 60, x)) + 'px';
    tip.style.top = y + 'px';
    tip.classList.add('is-show');
  }

  function hideTip(tip) { tip.classList.remove('is-show'); }

  /* ---------------- 通用：提示内容 ---------------- */
  function tipHTML(cfg, i) {
    var extra = (cfg.info && cfg.info[i]) ? '<span>' + cfg.info[i] + '</span>' : '';
    return '<b>' + cfg.labels[i] + '</b>' + cfg.values[i] + (cfg.unit || '') + extra;
  }

  /* ---------------- 折线（面积）图 ---------------- */
  function line(el, cfg) {
    if (!el) return;

    if (hasECharts()) {
      var chart = global.echarts.init(el, null, { renderer: 'svg' });
      chart.setOption({
        animationDuration: 1100,
        grid: { left: 48, right: 18, top: 24, bottom: 30 },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(38,36,31,.94)',
          borderWidth: 0,
          padding: [9, 12],
          textStyle: { color: '#F7F3E6', fontSize: 12.5 },
          formatter: function (p) {
            var i = p[0].dataIndex;
            return tipHTML(cfg, i);
          }
        },
        xAxis: {
          type: 'category',
          data: cfg.labels,
          boundaryGap: false,
          axisLine: { lineStyle: { color: C.axis } },
          axisTick: { show: false },
          axisLabel: { color: C.label, fontSize: 11, interval: 0 }
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: C.grid, type: 'dashed' } },
          axisLabel: { color: C.label, fontSize: 11 }
        },
        series: [{
          type: 'line',
          smooth: 0.35,
          symbol: 'circle',
          symbolSize: 7,
          showSymbol: false,
          data: cfg.values,
          lineStyle: { width: 2.4, color: C.tea },
          itemStyle: { color: '#fff', borderColor: C.tea, borderWidth: 2 },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(116,136,106,.34)' },
                { offset: 1, color: 'rgba(116,136,106,.02)' }
              ]
            }
          }
        }]
      });
      global.addEventListener('resize', function () { chart.resize(); });
      return;
    }

    renderLineSVG(el, cfg);
  }

  function renderLineSVG(el, cfg) {
    var host = el.closest('.chart-box') || el;
    var tip = makeTip(host);
    var W = el.clientWidth || 520;
    var H = el.clientHeight || 240;
    var pad = { l: 44, r: 16, t: 18, b: 28 };
    var iw = W - pad.l - pad.r;
    var ih = H - pad.t - pad.b;

    var max = Math.max.apply(null, cfg.values);
    var step = Math.pow(10, Math.floor(Math.log10(max))) / 2;
    var top = Math.ceil(max / step) * step;
    var n = cfg.values.length;
    var xs = cfg.values.map(function (_, i) { return pad.l + (iw * i) / (n - 1); });
    var ys = cfg.values.map(function (v) { return pad.t + ih - (v / top) * ih; });

    var linePts = xs.map(function (x, i) { return x.toFixed(1) + ',' + ys[i].toFixed(1); }).join(' ');
    var areaPts = linePts + ' ' + xs[n - 1].toFixed(1) + ',' + (pad.t + ih) + ' ' + pad.l + ',' + (pad.t + ih);

    var g = '';
    // 网格 + y 轴刻度
    for (var k = 0; k <= 4; k++) {
      var gy = pad.t + (ih * k) / 4;
      var val = Math.round(top - (top * k) / 4);
      g += '<line class="cf-grid" x1="' + pad.l + '" y1="' + gy + '" x2="' + (W - pad.r) + '" y2="' + gy + '"/>';
      g += '<text class="cf-label" x="' + (pad.l - 8) + '" y="' + (gy + 3.5) + '" text-anchor="end">' + val + '</text>';
    }
    // x 轴标签（窄屏隔一个显示）
    var skip = W < 380 ? 2 : 1;
    cfg.labels.forEach(function (lb, i) {
      if (i % skip !== 0 && i !== n - 1) return;
      g += '<text class="cf-label" x="' + xs[i] + '" y="' + (H - 10) + '" text-anchor="middle">' + lb + '</text>';
    });

    g += '<defs><linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="rgba(116,136,106,.34)"/>' +
      '<stop offset="1" stop-color="rgba(116,136,106,.02)"/></linearGradient></defs>';
    g += '<polygon class="cf-area" points="' + areaPts + '"/>';

    // 线条绘制动画
    g += '<polyline class="cf-line" points="' + linePts + '" stroke-dasharray="2000" stroke-dashoffset="2000">' +
      '<animate attributeName="stroke-dashoffset" from="2000" to="0" dur="1.4s" fill="freeze"/></polyline>';

    xs.forEach(function (x, i) {
      g += '<circle class="cf-dot" data-i="' + i + '" cx="' + x + '" cy="' + ys[i] + '" r="4"/>';
      var half = iw / (n - 1) / 2;
      g += '<rect class="cf-hit" data-i="' + i + '" x="' + (x - half) + '" y="' + pad.t + '" width="' + (half * 2) + '" height="' + ih + '"/>';
    });

    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" role="img" aria-label="' + (cfg.name || '数据折线图') + '">' + g + '</svg>';

    var dots = el.querySelectorAll('.cf-dot');
    el.querySelectorAll('.cf-hit').forEach(function (hit) {
      hit.addEventListener('mouseenter', function () {
        var i = +hit.dataset.i;
        dots.forEach(function (d) { d.style.opacity = (+d.dataset.i === i) ? 1 : 0; });
        showTip(host, tip, xs[i], ys[i] - 6, tipHTML(cfg, i));
      });
      hit.addEventListener('mouseleave', function () {
        dots.forEach(function (d) { d.style.opacity = 0; });
        hideTip(tip);
      });
    });

    bindResize(el, function () {
      if (!hasECharts()) renderLineSVG(el, cfg);
    });
  }

  /* ---------------- 横向条形图 ---------------- */
  function bar(el, cfg) {
    if (!el) return;

    if (hasECharts()) {
      var chart = global.echarts.init(el, null, { renderer: 'svg' });
      chart.setOption({
        animationDuration: 900,
        grid: { left: 56, right: 34, top: 10, bottom: 10 },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(38,36,31,.94)',
          borderWidth: 0,
          padding: [9, 12],
          textStyle: { color: '#F7F3E6', fontSize: 12.5 },
          formatter: function (p) { return tipHTML(cfg, p.dataIndex); }
        },
        xAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: C.grid, type: 'dashed' } },
          axisLabel: { show: false }
        },
        yAxis: {
          type: 'category',
          data: cfg.labels,
          inverse: true,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: C.ink, fontSize: 11.5 }
        },
        series: [{
          type: 'bar',
          data: cfg.values,
          barWidth: '52%',
          itemStyle: { color: C.earthLight, borderRadius: [0, 4, 4, 0] },
          emphasis: { itemStyle: { color: C.earth } },
          label: { show: true, position: 'right', color: C.label, fontSize: 11 }
        }]
      });
      global.addEventListener('resize', function () { chart.resize(); });
      return;
    }

    renderBarSVG(el, cfg);
  }

  function renderBarSVG(el, cfg) {
    var host = el.closest('.chart-box') || el;
    var tip = makeTip(host);
    var W = el.clientWidth || 380;
    var H = el.clientHeight || 240;
    var labelW = 58;
    var pad = { l: labelW, r: 34, t: 8, b: 8 };
    var iw = W - pad.l - pad.r;
    var n = cfg.values.length;
    var rowH = (H - pad.t - pad.b) / n;
    var max = Math.max.apply(null, cfg.values);

    var g = '';
    for (var k = 0; k <= 2; k++) {
      var gx = pad.l + (iw * k) / 2;
      g += '<line class="cf-grid" x1="' + gx + '" y1="' + pad.t + '" x2="' + gx + '" y2="' + (H - pad.b) + '"/>';
    }

    cfg.values.forEach(function (v, i) {
      var y = pad.t + rowH * i + rowH * 0.16;
      var h = rowH * 0.68;
      var w = Math.max(3, (v / max) * iw);
      g += '<g class="cf-bar-row" data-i="' + i + '">';
      g += '<text class="cf-bar-label" x="' + (pad.l - 10) + '" y="' + (y + h / 2 + 4) + '" text-anchor="end">' + cfg.labels[i] + '</text>';
      g += '<rect class="cf-bar" data-i="' + i + '" x="' + pad.l + '" y="' + y + '" width="0" height="' + h + '" rx="4">' +
        '<animate attributeName="width" from="0" to="' + w + '" dur="' + (0.6 + i * 0.06) + 's" fill="freeze"/></rect>';
      g += '<text class="cf-label" x="' + (pad.l + w + 7) + '" y="' + (y + h / 2 + 4) + '">' + v + '</text>';
      g += '</g>';
    });

    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" role="img" aria-label="' + (cfg.name || '条形图') + '">' + g + '</svg>';

    el.querySelectorAll('.cf-bar').forEach(function (r) {
      var i = +r.dataset.i;
      r.addEventListener('mouseenter', function () {
        var y = pad.t + rowH * i + rowH * 0.16;
        var w = Math.max(3, (cfg.values[i] / max) * iw);
        showTip(host, tip, pad.l + w, y, tipHTML(cfg, i));
      });
      r.addEventListener('mouseleave', function () { hideTip(tip); });
    });

    bindResize(el, function () {
      if (!hasECharts()) renderBarSVG(el, cfg);
    });
  }

  /* ---------------- 尺寸变化重绘 ---------------- */
  var resizeBound = new WeakMap();
  function bindResize(el, fn) {
    if (resizeBound.has(el)) return;
    resizeBound.set(el, true);
    var t;
    var ro;
    if ('ResizeObserver' in global) {
      ro = new ResizeObserver(function () {
        clearTimeout(t);
        t = setTimeout(fn, 160);
      });
      ro.observe(el);
    } else {
      global.addEventListener('resize', function () {
        clearTimeout(t);
        t = setTimeout(fn, 160);
      });
    }
  }

  global.GanpoCharts = { line: line, bar: bar, hasECharts: hasECharts };
})(window);
