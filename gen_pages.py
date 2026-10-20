# -*- coding: utf-8 -*-
"""生成 B / C 成员负责的四个模块接入页（保持与首页、科研成果页同一套骨架）"""
import os, io

OUT = r"C:\Users\zyj\WorkBuddy\2026-10-19-10-16-04\ganpo-agri\pages"


def head(page, title, desc, extra_css=""):
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · 赣鄱农韵</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#FAF7F0">
<link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/layout.css">
{extra_css}</head>
<body data-page="{page}" data-root="../">

<div class="scroll-progress" aria-hidden="true"></div>

<header class="site-header">
  <div class="container site-header__inner">
    <a class="brand" href="../index.html" aria-label="赣鄱农韵 首页">
      <span class="brand__seal" aria-hidden="true">赣</span>
      <span class="brand__text">
        <span class="brand__name">赣鄱农韵</span>
        <span class="brand__sub">江西农业大学 · 农业宣传平台</span>
      </span>
    </a>

    <nav class="nav" aria-label="主导航">
      <a class="nav__link" data-nav="home" href="../index.html">首页</a>
      <a class="nav__link" data-nav="research" href="research.html">江农科研成果</a>
      <a class="nav__link" data-nav="map" href="map.html">赣鄱农业地图</a>
      <a class="nav__link" data-nav="science" href="science.html">农业科普</a>
      <a class="nav__link" data-nav="message" href="message.html">助农心愿</a>
      <a class="nav__link" data-nav="admin" href="admin.html">后台管理</a>
    </nav>

    <div class="header-actions">
      <button class="icon-btn icon-btn--desktop" data-search-open type="button" aria-label="全站搜索">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>
      </button>
      <button class="burger" type="button" aria-label="展开菜单" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<div class="mobile-nav">
  <a data-nav="home" href="../index.html">首页 <span class="text-xs text-muted">门户</span></a>
  <a data-nav="research" href="research.html">江农科研成果 <span class="text-xs text-muted">时间轴</span></a>
  <a data-nav="map" href="map.html">赣鄱农业地图 <span class="text-xs text-muted">核心亮点</span></a>
  <a data-nav="science" href="science.html">农业科普 <span class="text-xs text-muted">闯关答题</span></a>
  <a data-nav="message" href="message.html">助农心愿 <span class="text-xs text-muted">留言板</span></a>
  <a data-nav="admin" href="admin.html">后台管理 <span class="text-xs text-muted">数据统计</span></a>
  <a href="#" data-search-open>全站搜索 <span class="text-xs text-muted">/</span></a>
</div>

<div class="search-layer" aria-hidden="true" role="dialog" aria-label="全站搜索">
  <div class="search-panel">
    <div class="search-field">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>
      <input type="search" placeholder="搜特产、科研成果、科普文章……" aria-label="搜索关键词">
      <kbd>ESC</kbd>
    </div>
    <div class="search-results"></div>
  </div>
</div>
"""


def hero(crumb, owner, title, desc, tags, eyebrow):
    tag_html = "".join(f'<span class="tag{cls}">{t}</span>' for t, cls in tags)
    return f"""
<main>
  <section class="page-hero">
    <div class="container page-hero__inner">
      <nav class="crumbs" aria-label="面包屑">
        <a href="../index.html">首页</a><span>/</span><span>{crumb}</span>
      </nav>
      <span class="eyebrow">{eyebrow}</span>
      <h1 class="page-hero__title">{title}</h1>
      <p class="page-hero__desc">{desc}</p>
      <div class="page-hero__meta">
        <span class="tag tag--owner">负责人 {owner}</span>{tag_html}
      </div>
    </div>
  </section>
"""


def scaffold(done, todo, tech):
    done_li = "".join(f"<li>{x}</li>" for x in done)
    todo_li = "".join(f"<li>{x}</li>" for x in todo)
    tech_span = "".join(f'<span class="tag">{t}</span>' for t in tech)
    return f"""
  <section class="section section--tight">
    <div class="container">
      <div class="scaffold reveal">
        <div class="scaffold__head">
          <h2 class="scaffold__title">模块接入骨架</h2>
          <span class="tag tag--gold">待实现</span>
        </div>
        <p class="section-desc" style="margin-top:0;margin-bottom:22px">
          本页已接入全站统一的导航、页脚、搜索与响应式栅格。下方为需求文档中约定的功能清单，
          按顺序实现即可直接并入站点，无需改动公共样式。
        </p>

        <div class="grid grid--2">
          <div>
            <h3 class="text-serif" style="font-size:16px;margin-bottom:10px">已完成（骨架部分）</h3>
            <ul class="checklist">{done_li}</ul>
          </div>
          <div>
            <h3 class="text-serif" style="font-size:16px;margin-bottom:10px">待开发（本模块核心）</h3>
            <ul class="checklist">{todo_li}</ul>
          </div>
        </div>

        <div class="tech-strip">{tech_span}</div>
      </div>
    </div>
  </section>
"""


def rules(items):
    li = "".join(
        f"""<div class="next-step reveal" style="--reveal-delay:{i*70}ms">
          <span class="next-step__no">{i+1}</span>
          <div><h4>{t}</h4><p>{d}</p></div>
        </div>""" for i, (t, d) in enumerate(items)
    )
    return f"""
  <section class="section section--tight">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">协作约定</span>
        <h2 class="section-title">接口与<em>开发规范</em></h2>
      </div>
      <div class="next-steps">{li}</div>
    </div>
  </section>
"""


def tail(cta_title, cta_text, cta_href, cta_label):
    return f"""
  <section class="section section--tight">
    <div class="container">
      <div class="cta-band reveal">
        <div class="cta-band__inner">
          <div>
            <h2>{cta_title}</h2>
            <p>{cta_text}</p>
          </div>
          <a class="btn" href="{cta_href}">{cta_label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="brand" href="../index.html">
          <span class="brand__seal" aria-hidden="true">赣</span>
          <span class="brand__text">
            <span class="brand__name">赣鄱农韵</span>
            <span class="brand__sub">江西农业大学 · 农业宣传平台</span>
          </span>
        </a>
        <p class="footer__slogan">展示 + 科普 + 互动，三位一体的农业宣传网站。<br>网页设计大赛参赛作品。</p>
      </div>

      <div>
        <h3 class="footer__title">功能模块</h3>
        <ul class="footer__list">
          <li><a href="../index.html">首页门户</a></li>
          <li><a href="research.html">江农科研成果</a></li>
          <li><a href="map.html">赣鄱农业地图</a></li>
          <li><a href="science.html">农业科普课堂</a></li>
        </ul>
      </div>

      <div>
        <h3 class="footer__title">参与协作</h3>
        <ul class="footer__list">
          <li><a href="message.html">助农心愿留言</a></li>
          <li><a href="admin.html">后台管理</a></li>
          <li><a href="map.html">特产对比与收藏</a></li>
          <li><a href="science.html#quiz">答题闯关</a></li>
        </ul>
      </div>

      <div>
        <h3 class="footer__title">项目说明</h3>
        <p class="footer__note">
          技术架构：Vue 3 + Express + MySQL（前端静态版为先导原型）<br>
          数据口径：公开资料整理
        </p>
      </div>
    </div>

    <div class="footer__bottom">
      <span>© <span data-year>2026</span> 赣鄱农韵 · 江西农业大学　|　网页设计大赛参赛作品</span>
      <span class="footer__badge">周怡洁 陈柳蓉 张朝曦 刘可可 祁靖琳</span>
    </div>
  </div>
</footer>

<button class="to-top" type="button" aria-label="回到顶部">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
</button>

<script src="../assets/js/common.js"></script>
</body>
</html>
"""


PAGES = {}

# ---------------- 地图 ----------------
PAGES["map"] = dict(
    title="赣鄱农业地图",
    desc="以江西省十一个设区市为主线的交互式农业特产地图，一图览赣鄱。",
    crumb="赣鄱农业地图",
    eyebrow="核心亮点 · 模块 03",
    page_title="一图览赣鄱",
    hero_desc="往下滚动，地图逐市点亮；点开一座城，看到的不只是特产，还有江农在这里做过的事。"
              "这是全站最难、也最值得讲清楚的一个模块。",
    tags=[("滚动叙事", ""), ("特产对比", " tag--earth"), ("SVG 交互", " tag--gold")],
    done=[
        "全站导航、搜索、页脚已接入",
        "模块页面容器与页头信息位已就绪",
        "公共配色、卡片、按钮组件可直接复用",
        "移动端断点（980 / 680）已统一",
    ],
    todo=[
        "使用 <code>SVG</code> 绘制江西省 11 个设区市轮廓，悬停高亮并显示地市名",
        "滚动叙事：随页面滚动依次点亮地市，带出特产与江农帮扶案例",
        "数据由 <code>assets/data/cities.json</code> 驱动，一条数据对应一市",
        "特产对比：可同时选 2 至 3 个地市，生成对比卡片",
        "收藏与分享：收藏特产，生成含图片与简介的分享海报",
        "降级方案：滚动叙事开发受阻时，退回点击地图 + 静态图文切换",
    ],
    tech=["SVG", "JSON 数据驱动", "IntersectionObserver", "前端路由", "响应式"],
    rules=[
        ("地图底图必须合规", "省界轮廓不得自行手绘。请使用自然资源部标准地图服务（bzdt.ch.mnr.gov.cn）下载的江西省标准地图作为底图，保留审图号，并在页脚注明“地图来源：自然资源部标准地图服务”。"),
        ("数据结构先定，页面后写", "每市一条 JSON：name /特产数组 / 产量 / 特点 / 适宜区域 / 江农帮扶故事 / 图片来源。前端只读 JSON，不改结构，便于 D 随时补文案。"),
        ("与科研成果页互相引用", "每个地市的帮扶故事，链接回 research.html 对应时间轴节点（如 #tl-fruit），让两个模块互相导流，也强化“高校助农”的叙事。"),
        ("性能兜底", "地图 SVG 精简路径、去除冗余节点；特产图片统一懒加载，移动端首屏不超过 3 张图。"),
    ],
    cta_title="地图之前，先看时间轴",
    cta_text="帮扶故事不是凭空写的。每一条都能在科研成果的时间线上找到对应的年份与团队。",
    cta_href="research.html",
    cta_label="回到科研成果",
)

# ---------------- 科普 ----------------
PAGES["science"] = dict(
    title="农业科普课堂",
    desc="以图文、视频与闯关答题普及江西本地农业知识，题库绑定江农科研成果。",
    crumb="农业科普课堂",
    eyebrow="科普 · 模块 04",
    page_title="把课堂<br>搬到田埂上",
    hero_desc="不一样的农业科普：题目全部绑定江西本地农事与江农成果，"
              "让答题不再是随便找一套通用题库的演示。",
    tags=[("闯关模式", ""), ("定制题库", " tag--earth"), ("排行榜", " tag--gold")],
    done=[
        "页头、导航、页脚与全站一致",
        "搜索索引已收录科普与答题入口",
        "公共卡片 / 标签 / 按钮组件可直接复用",
        "响应式栅格与骨架屏工具类已具备",
    ],
    todo=[
        "科普文章瀑布流：<code>CSS columns</code> 或等高列布局，支持标签筛选",
        "视频播放：嵌入本地 <code>&lt;video&gt;</code>，支持播放 / 暂停 / 进度控制",
        "闯关答题：随机抽题、即时判分，答对一定数量解锁下一关",
        "排行榜：记录得分并生成全站榜单（先 localStorage，后端就绪后切接口）",
        "题库绑定江西本地：如“山下长黑猪由哪所院校培育”",
        "完成后补充无障碍支持：键盘可操作、题目区 <code>aria-live</code>",
    ],
    tech=["瀑布流", "标签筛选", "Video", "localStorage", "游戏化"],
    rules=[
        ("题库必须原创", "每题一个对象：题干 / 四个选项 / 正确答案 / 解析 / 关联成果。解析里必须写清依据，这也是答辩时最能讲出内容的地方。"),
        ("难度曲线", "每关 5 题，前两题送分、后三题拉开差距；答错给解析而不是直接判死，降低挫败感。"),
        ("成绩先本地后接口", "未接后端前用 localStorage 存成绩，数据结构提前与 C 对齐，切换时只改一层数据适配函数。"),
    ],
    cta_title="想先看看题库的出处？",
    cta_text="每一道题的答案，几乎都能在科研成果时间轴里找到依据。",
    cta_href="research.html",
    cta_label="查看科研成果",
)

# ---------------- 留言 ----------------
PAGES["message"] = dict(
    title="助农心愿留言",
    desc="面向乡村振兴的寄语留言墙，支持注册登录、审核展示与举报处理。",
    crumb="助农心愿留言",
    eyebrow="互动 · 模块 05",
    page_title="写下你对<br>这片田野的话",
    hero_desc="不做普通灌水留言板。这里收到的是寄语、建议和愿望，"
              "经管理员审核后展示在墙上——内容质量本身就是这个模块的设计。",
    tags=[("注册登录", ""), ("审核机制", " tag--earth"), ("JWT 鉴权", " tag--gold")],
    done=[
        "页头与全站导航已接入",
        "留言、心愿入口已进入全站搜索索引",
        "表单基础样式（输入框 / 按钮 / 提示）可复用",
        "移动端布局断点已统一",
    ],
    todo=[
        "注册 / 登录：密码加密存储（<code>bcrypt</code>），前端做实时校验",
        "心愿留言：富文本编辑（加粗、插图），提交后进入待审核状态",
        "审核展示：仅通过审核的留言上墙，支持分页或滚动加载",
        "举报与回复：用户可举报不当内容，管理员后台处理",
        "接口：<code>POST /api/messages</code>、<code>GET /api/messages?status=approved</code>",
        "数据持久化：MySQL <code>messages</code> 表 + 用户表外键关联",
    ],
    tech=["RESTful API", "MySQL", "JWT", "bcrypt", "富文本"],
    rules=[
        ("接口先定契约", "与 C 成员先敲定字段：id / userId / content / status / createdAt / likes。前端按契约写 mock，后端按契约实现，联调只对字段不对人。"),
        ("审核是产品逻辑", "默认 status = pending，只有 approved 才渲染。管理员操作记录保留操作人与时间，便于答辩时讲“内容治理”。"),
        ("降级方案", "后端未就绪时，留言先落 localStorage 并标注“本地演示”，保证答辩现场可完整走通流程。"),
    ],
    cta_title="留言之外，也欢迎看看地图",
    cta_text="很多心愿其实指向具体的地方：一座城，一种物产，一群人。",
    cta_href="map.html",
    cta_label="翻开赣鄱地图",
)

# ---------------- 后台 ----------------
PAGES["admin"] = dict(
    title="后台管理",
    desc="精简版内容管理后台：成果内容、题库、心愿留言与运营数据统计。",
    crumb="后台管理",
    eyebrow="管理 · 模块 06",
    page_title="后台只做<br>三件事",
    hero_desc="按需求文档要求，后台保留但做精简：管理科普题库、心愿留言、成果内容，"
              "再用一个数据面板说明运营情况。不做多余功能。",
    tags=[("JWT 登录", ""), ("内容管理", " tag--earth"), ("数据统计", " tag--gold")],
    done=[
        "独立页面骨架与全站导航已就绪",
        "表格 / 表单基础样式可复用",
        "图表模块（charts.js）可直接调用",
        "搜索索引已收录后台入口",
    ],
    todo=[
        "管理员登录：JWT 鉴权，token 存 <code>sessionStorage</code>，路由守卫拦截",
        "内容管理：科研成果、特产、科普文章的增删改查与批量操作",
        "心愿留言审核：查看、通过、删除，保留举报记录",
        "数据统计面板：访问量、留言数、答题参与人数，用图表呈现",
        "权限：区分超级管理员与内容管理员（可选）",
        "接口统一前缀 <code>/api/admin/*</code>，与前台接口隔离",
    ],
    tech=["Express", "JWT", "CRUD", "ECharts", "权限"],
    rules=[
        ("安全优先", "所有写操作必须校验 token 与角色；删除走软删除（deleted_at），避免误操作导致数据不可恢复。"),
        ("统计口径写清楚", "访问量按 PV 计、留言数含待审核、答题人数按去重用户计。口径写在面板角落，答辩被追问时不慌。"),
        ("只做三件事", "不要为了“功能多”堆模块。后台的每一屏都要能回答一个问题：内容是否正常、用户说了什么、站点运行得怎么样。"),
    ],
    cta_title="回到前台看看效果",
    cta_text="后台是给管理员用的，评委看到的主要还是前台。",
    cta_href="../index.html",
    cta_label="返回首页",
)


for key, p in PAGES.items():
    html = (
        head(key, p["title"], p["desc"])
        + hero(p["crumb"], "B" if key in ("map", "science") else "C",
               p["page_title"], p["hero_desc"], p["tags"], p["eyebrow"])
        + scaffold(p["done"], p["todo"], p["tech"])
        + rules(p["rules"])
        + tail(p["cta_title"], p["cta_text"], p["cta_href"], p["cta_label"])
    )
    path = os.path.join(OUT, key + ".html")
    with io.open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print("written", path, len(html))
