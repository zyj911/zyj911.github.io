/* =============================================================
   赣鄱农韵 · 全站公共脚本 (common.js)
   功能：吸顶导航 / 移动端抽屉 / 滚动进度 / 滚动揭示 /
        图片懒加载 / 全局搜索 / 回到顶部 / 行为推荐
   ============================================================= */
(function () {
  'use strict';

  var body = document.body;
  var ROOT = body.dataset.root || './';

  /* ---------------- 1. 吸顶导航 ---------------- */
  var header = document.querySelector('.site-header');
  var progressBar = document.querySelector('.scroll-progress');
  var toTop = document.querySelector('.to-top');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 12);
    if (toTop) toTop.classList.toggle('is-show', y > 560);

    if (progressBar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? Math.min(100, (y / h) * 100) : 0;
      progressBar.style.setProperty('--progress', pct.toFixed(2) + '%');
    }

    // 首页浏览过半后，给「赣鄱农业地图」加推荐小红点
    if (body.dataset.page === 'home' && h > 0 && y / h > 0.35) {
      var mapLink = document.querySelector('[data-recommend="map"]');
      if (mapLink && !mapLink.querySelector('.nav__hint')) {
        var dot = document.createElement('span');
        dot.className = 'nav__hint';
        dot.setAttribute('aria-label', '推荐浏览');
        mapLink.appendChild(dot);
      }
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });

  /* ---------------- 2. 移动端抽屉 ---------------- */
  var burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }
  document.querySelectorAll('.mobile-nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      body.classList.remove('nav-open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- 3. 当前页高亮 ---------------- */
  var current = body.dataset.page;
  if (current) {
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      if (link.dataset.nav === current) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------------- 4. 滚动揭示 ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- 5. 图片懒加载 + 骨架屏 ---------------- */
  var lazyImgs = document.querySelectorAll('img[data-src]');
  function loadImg(img) {
    var src = img.dataset.src;
    if (!src) return;
    var probe = new Image();
    probe.onload = function () {
      img.src = src;
      img.classList.add('is-loaded');
      var host = img.closest('.skeleton');
      if (host) host.classList.remove('skeleton');
    };
    probe.onerror = function () {
      var host = img.closest('.skeleton');
      if (host) host.classList.remove('skeleton');
      img.style.display = 'none';
    };
    probe.src = src;
    img.removeAttribute('data-src');
  }

  if ('IntersectionObserver' in window && lazyImgs.length) {
    var imgIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadImg(entry.target);
          imgIO.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });
    lazyImgs.forEach(function (img) { imgIO.observe(img); });
  } else {
    lazyImgs.forEach(loadImg);
  }

  /* ---------------- 6. 回到顶部 ---------------- */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- 7. 全局搜索 ---------------- */
  var INDEX = [
    { g: '科研成果', t: '超级稻育种', d: '穗大粒饱的超级稻品种选育与推广', p: 'pages/research.html#tl-super-rice', k: '超级稻 水稻 育种 品种 推广' },
    { g: '科研成果', t: '“山下长黑”猪新品种', d: '地方猪种资源保护与新品种培育', p: 'pages/research.html#tl-pig', k: '山下长黑 猪 畜牧 品种' },
    { g: '科研成果', t: '脐橙育种与栽培技术', d: '赣南脐橙品质提升与栽培配套技术', p: 'pages/research.html#tl-fruit', k: '脐橙 赣州 园艺 果树' },
    { g: '科研成果', t: '猕猴桃种质创新', d: '猕猴桃种质资源收集与新品种选育', p: 'pages/research.html#tl-kiwi', k: '猕猴桃 种质 果树' },
    { g: '科研成果', t: '科技小院', d: '研究生驻扎生产一线，技术直达田间', p: 'pages/research.html#tl-xiaoyuan', k: '科技小院 驻村 技术推广' },
    { g: '科研成果', t: '学科特色与科研平台', d: '作物学、园艺学、畜牧学等优势学科', p: 'pages/research.html#disciplines', k: '学科 平台 作物学 园艺学 畜牧学' },
    { g: '特产', t: '赣州脐橙', d: '赣南丘陵的甜，果大皮薄、酸甜适口', p: 'pages/map.html', k: '脐橙 赣州 水果' },
    { g: '特产', t: '南丰蜜桔', d: '抚州南丰，千年桔乡的贡品柑桔', p: 'pages/map.html', k: '蜜桔 南丰 抚州 柑橘' },
    { g: '特产', t: '婺源绿茶', d: '上饶婺源，云雾山间的醇厚回甘', p: 'pages/map.html', k: '绿茶 婺源 上饶 茶叶' },
    { g: '特产', t: '广昌白莲', d: '抚州广昌，通心白莲的清香软糯', p: 'pages/map.html', k: '白莲 广昌 抚州' },
    { g: '特产', t: '万年贡米', d: '上饶万年，稻作文化源头的优质稻米', p: 'pages/map.html', k: '贡米 万年 上饶 水稻' },
    { g: '特产', t: '南康甜柚', d: '赣州南康，果肉细嫩、蜜香浓郁', p: 'pages/map.html', k: '甜柚 南康 赣州' },
    { g: '科普', t: '水稻育秧的三个关键期', d: '从浸种到移栽，秧苗最怕什么', p: 'pages/science.html', k: '育秧 水稻 种植技术 科普' },
    { g: '科普', t: '稻飞虱防治要点', d: '看清虫情再用药，别打“保险药”', p: 'pages/science.html', k: '稻飞虱 病虫害 防治 农药' },
    { g: '科普', t: '稻田油菜轮作', d: '冬闲田不闲，养地又增收', p: 'pages/science.html', k: '油菜 轮作 土壤 冬闲田' },
    { g: '科普', t: '农业知识闯关', d: '江西本地农业与江农成果定制题库', p: 'pages/science.html#quiz', k: '答题 闯关 题库 排行榜' },
    { g: '互动', t: '助农心愿留言板', d: '写下你对江西农业、乡村振兴的寄语', p: 'pages/message.html', k: '留言 心愿 寄语 互动' },
    { g: '站点', t: '首页门户', d: '动态数据看板与全站导航', p: 'index.html', k: '首页 看板 数据' },
    { g: '站点', t: '后台管理', d: '内容、题库、留言与数据统计', p: 'pages/admin.html', k: '后台 管理 统计' }
  ];

  var layer = document.querySelector('.search-layer');
  var input = layer ? layer.querySelector('input') : null;
  var results = layer ? layer.querySelector('.search-results') : null;
  var cursor = -1;
  var flatResults = [];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function hl(text, kw) {
    if (!kw) return esc(text);
    var i = text.toLowerCase().indexOf(kw.toLowerCase());
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + kw.length)) + '</mark>' + esc(text.slice(i + kw.length));
  }

  function render(q) {
    if (!results) return;
    var kw = q.trim().toLowerCase();
    flatResults = [];
    cursor = -1;

    if (!kw) {
      var picks = INDEX.filter(function (x) { return x.g === '科研成果' || x.g === '特产'; }).slice(0, 6);
      results.innerHTML = '<div class="search-group__label">试试搜索</div>' + picks.map(function (x) {
        return itemHTML(x, kw, '热门');
      }).join('');
      flatResults = picks;
      return;
    }

    var matched = INDEX.filter(function (x) {
      return (x.t + x.d + x.k + x.g).toLowerCase().indexOf(kw) > -1;
    }).slice(0, 12);

    if (!matched.length) {
      results.innerHTML = '<div class="search-empty">没有找到「' + esc(q) + '」<br><span class="text-xs">试试：超级稻 / 脐橙 / 育秧 / 留言</span></div>';
      return;
    }

    var groups = {};
    matched.forEach(function (x) {
      (groups[x.g] = groups[x.g] || []).push(x);
    });

    results.innerHTML = Object.keys(groups).map(function (g) {
      return '<div class="search-group__label">' + esc(g) + '</div>' + groups[g].map(function (x) {
        return itemHTML(x, kw, g);
      }).join('');
    }).join('');

    flatResults = matched;
  }

  function itemHTML(x, kw, meta) {
    return '<a class="search-item" href="' + ROOT + x.p + '">' +
      '<span class="search-item__dot"></span>' +
      '<span class="search-item__title">' + hl(x.t, kw) + ' <span class="text-xs text-muted">' + hl(x.d, '') + '</span></span>' +
      '<span class="search-item__meta">' + esc(meta) + '</span>' +
      '</a>';
  }

  function openSearch(prefill) {
    if (!layer) return;
    layer.classList.add('is-open');
    layer.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    if (input) {
      input.value = prefill || '';
      render(input.value);
      setTimeout(function () { input.focus(); }, 60);
    }
  }

  function closeSearch() {
    if (!layer) return;
    layer.classList.remove('is-open');
    layer.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  }

  if (layer) {
    document.querySelectorAll('[data-search-open]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openSearch('');
      });
    });

    layer.addEventListener('click', function (e) {
      if (e.target === layer) closeSearch();
    });

    if (input) {
      input.addEventListener('input', function () { render(input.value); });
      input.addEventListener('keydown', function (e) {
        var items = results.querySelectorAll('.search-item');
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (!items.length) return;
          cursor = e.key === 'ArrowDown' ? (cursor + 1) % items.length : (cursor - 1 + items.length) % items.length;
          items.forEach(function (it, i) { it.classList.toggle('is-cursor', i === cursor); });
          items[cursor].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
          var target = items[cursor] || items[0];
          if (target) window.location.href = target.getAttribute('href');
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (e.key === 'Escape') closeSearch();
      if (e.key === '/' && ['INPUT', 'TEXTAREA'].indexOf(tag) === -1) {
        e.preventDefault();
        openSearch('');
      }
    });
  }

  // 首页中部搜索框
  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = form.querySelector('input').value.trim();
      openSearch(q || '');
    });
  });

  document.querySelectorAll('[data-hot-word]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openSearch(btn.dataset.hotWord);
    });
  });

  /* ---------------- 8. 年份 ---------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  onScroll();
})();
