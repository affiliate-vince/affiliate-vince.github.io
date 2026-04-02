# VinceMedia – Long-Term Memory

## 项目概述（v3，2026-04-02）

- **Repo**: affiliate-vince.github.io (GitHub Pages)
- **类型**: Amazon Store 联盟客 Landing Page 矩阵（已完全重构，不再是 Kickstarter/Indiegogo）
- **平台**: GitHub Pages（纯静态，无需后端）

## 站点架构（v3）

```
affiliate-vince.github.io/
├── index.html          ← 唯一页面（banner轮播 + 品牌卡片网格）
├── manifest.json       ← 品牌映射表（UUID → 品牌信息 → 联盟链接）
├── landingpages.txt    ← 联盟链接源（用户维护，每行一个 Amazon Store URL）
├── sitemap.xml         ← 搜索引擎索引
├── robots.txt          ← 爬虫规则（禁止抓取 manifest.json / landingpages.txt）
└── SKILL.md            ← 站点维护指南（SKILL格式）
```

## 品牌信息（18个，2026-04-02）

| Slug | Brand | Category | Platform |
|------|-------|----------|----------|
| renpho | RENPHO | Health & Wellness | Amazon |
| reolink | REOLINK | Smart Home & Security | Amazon |
| halova | HaloVa | Baby & Mother Care | Amazon |
| grownsy | GROWNSY | Baby Care | Amazon |
| it-cosmetics | IT Cosmetics | Beauty & Cosmetics | Amazon |
| horow | HOROW | Home & Bathroom | Amazon |
| yitamotor | YITAMOTOR | Automotive | Amazon |
| aiper | AIPER | Smart Cleaning | Amazon |
| plaud | Plaud | AI Devices | Amazon |
| cute-stone | CUTE STONE | Kids & Toys | Amazon |
| running-girl | RUNNING GIRL | Athletic Apparel | Amazon |
| mescomb | MESCOMB | Beauty & Hair | Amazon |
| hittiona | HITTIONA | Beauty & Home | Amazon |
| aurzen | Aurzen | Consumer Electronics | Amazon |
| prudiut | Prudiut | Craft & Kitchen | Amazon |
| livebox | LIVEBOX | Home Decor | Amazon |
| imarku | imarku | Kitchen | Amazon |
| olight | OLIGHT | Lighting & Tools | Amazon |

## 核心机制（v3）

### 数据流向
```
landingpages.txt（用户维护）
    ↓ UUID 提取
manifest.json（结构化映射：UUID → 品牌 → 链接）
    ↓ 读取
index.html（BRANDS[] + AFFILIATE_URLS{} + BRAND_UUIDS{}）
    ↓ 渲染
浏览器（用户点击 → 直接跳转联盟链接）
```

### Banner 轮播
- 随机抽取 5 个品牌
- 每 2 秒自动翻页（`setInterval(nextSlide, 2000)`）
- 支持手动箭头/圆点切换

### 变更检测（维护时使用）
- 新增链接：UUID 在 landingpages.txt 中有、manifest.json 中无 → 抓取信息 → 添加
- 删除链接：UUID 在 manifest.json 中有、landingpages.txt 中无 → 标记 `inactive: true` → 页面过滤掉
- 参考 SKILL.md 中的完整流程

## 用户偏好
- 中文用户，Amazon 联盟客
- 图片从 Amazon CDN 动态抓取，不提供本地资源
- 页面要简洁、不像 AI 生成的
- 联盟链接用 `rel="noopener noreferrer nofollow"`
- 定期维护 landingpages.txt，告知 AI 更新

## 设计规范
- 深色主题：背景 #0f0f0f，accent 黄绿 #E8FF47
- 字体：DM Sans + Cormorant Garamond（Google Fonts）
- 品牌卡片有 hover 下划线动画
- 响应式：PC 4列 / 平板 2列 / 手机 1列

## 技术说明
- Python 3.13.7 可用，Node.js 不可用
- 本地预览：`python -m http.server 8765`（项目根目录运行）
- 无构建脚本，纯静态 HTML + 内联 JS
- favicon 使用 SVG data URI
