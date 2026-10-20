/* =============================================================
   赣鄱农韵 · 科研成果页交互 (research.js)
   负责人：周怡洁（队长）
   包含：时间轴滚动点亮 / 进度线 / 翻转卡片（移动端点击）/
        素材墙骨架屏
   ============================================================= */
(function () {
  'use strict';

  /* ---------------- 1. 时间轴：滚动点亮 + 进度线 ---------------- */
  var timeline = document.querySelector('.timeline');
  if (timeline) {
    var rail = timeline.querySelector('.timeline__rail');
    var items = Array.prototype.slice.call(timeline.querySelectorAll('.tl-item'));
    var ticking = false;

    function update() {
      var vh = window.innerHeight;
      var lineY = vh * 0.56;

      // 进度线：计算视口中线相对轨道的高度
      if (rail) {
        var r = rail.getBoundingClientRect();
        var pct = ((lineY - r.top) / r.height) * 100;
        rail.style.setProperty('--tl-progress', Math.max(0, Math.min(100, pct)).toFixed(1) + '%');
      }

      items.forEach(function (item) {
        var rect = item.getBoundingClientRect();
        var mid = rect.top + rect.height * 0.42;
        item.classList.toggle('is-active', mid < lineY && rect.bottom > vh * 0.12);
      });
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }, { passive: true });

    window.addEventListener('resize', update);
    update();
  }

  /* ---------------- 2. 翻转卡片：移动端点击翻转 ---------------- */
  var isTouch = window.matchMedia('(hover: none)').matches;
  document.querySelectorAll('.flip').forEach(function (card) {
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    function toggle() {
      var on = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(on));
    }

    card.addEventListener('click', function () {
      if (isTouch) toggle();
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ---------------- 3. 学科筛选 ---------------- */
  var filters = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-cat]');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var f = btn.dataset.filter;
      cards.forEach(function (c) {
        var show = f === 'all' || c.dataset.cat === f;
        c.style.display = show ? '' : 'none';
      });
    });
  });
})();
