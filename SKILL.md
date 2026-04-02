# VinceMedia 站点维护技能

## 身份与用途

本技能用于维护 VinceMedia 独立站（GitHub Pages）的日常运营与更新。

**站点类型**：Amazon 联盟客 Landing Page 矩阵
**平台**：GitHub Pages（静态托管）
**核心流程**：用户在 Kickbooster 维护 `landingpages.txt` → 告知 AI 更新 → AI 完成全站同步

---

## 站点架构

```
affiliate-vince.github.io/
├── index.html           ← 唯一页面（纯视图，引用外部数据）
├── brands.js            ← 品牌数据（分类/描述/logo/背景），可手动编辑
├── affiliate-links.js   ← 联盟链接（UUID→URL + slug→UUID）
├── manifest.json        ← 品牌元数据备份
├── landingpages.txt     ← 联盟链接源（用户维护）
├── sitemap.xml          ← 搜索引擎索引
└── robots.txt           ← 爬虫规则
```

**关键原则**：
- 所有联盟链接来自 `landingpages.txt`，不可硬编码
- `manifest.json` 是 `landingpages.txt` 的结构化映射，用于识别变更
- `index.html` 是纯静态页面，不依赖后端或构建脚本
- 不提供图片/视频资源，图片从 Amazon CDN 动态获取

---

## 触发条件

用户说以下内容时应触发本技能：

- "更新网站" / "需要更新" / "链接变了" / "网站需要更新"
- "landingpages.txt 更新了"
- "帮我看看哪些链接变了"
- 任何涉及新增/删除联盟链接的情况

---

## 维护流程（4步）

### Step 1 — 检测变更

对比 `landingpages.txt`（当前）与 `manifest.json` 中的 UUID 列表：

```
当前 landingpages.txt 中的所有 UUID（从链接中提取）
vs.
manifest.json → brands[].affiliateLinks[] 中的所有 UUID
```

**识别结果**：
- `manifest` 有、当前无 → 该链接已删除（品牌应保留，信息降级）
- `当前有、manifest` 无 → 新增链接（需要抓取品牌信息）
- 两者一致 → 无变更，检查描述或分类是否需要更新

### Step 2 — 处理新增链接

对每个新增 UUID：
1. 提取完整 URL（含追踪参数）
2. 访问 Amazon Store 页面，抓取品牌名称、分类、描述、Logo 图片 URL
3. 在 `manifest.json` 的 `brands[]` 中添加条目
4. 在 `index.html` 的 `BRANDS[]` 和 `BRAND_UUIDS` 中添加对应条目

### Step 3 — 处理删除链接

对每个被删除的 UUID：
1. 保留 `manifest.json` 中的品牌条目（标记状态为 `inactive: true`）
2. 在 `index.html` 中过滤掉该品牌（不展示，但数据保留便于恢复）
3. 说明：已从首页移除，品牌数据保留

### Step 4 — 更新时间戳

完成变更后：
1. 更新 `manifest.json` 的 `updated` 字段为当前 UTC 时间
2. 更新 `sitemap.xml`（如有新增品牌）
3. 告知用户变更摘要（新增 X 个、删除 X 个）

---

## manifest.json 结构说明

```json
{
  "version": "YYYY-MM-DD",
  "updated": "ISO8601时间戳",
  "description": "VinceMedia brand-to-affiliate-link mapping",
  "brands": [
    {
      "slug": "brand-slug",
      "brand": "Brand Full Name",
      "category": "Category",
      "description": "Brand description (English only)",
      "affiliateLinks": ["UUID1", "UUID2"],
      "storeUrl": "https://www.amazon.com/stores/SLUG",
      "favicon": "Amazon CDN logo URL or null",
      "bg": "Amazon CDN product/hero image URL or null",
      "gradient": "CSS gradient fallback when no bg image",
      "inactive": false
    }
  ]
}
```

**关键字段**：
- `favicon`: Amazon CDN 品牌 Logo（仅在有值时显示，无则不占位）
- `bg`: Banner/卡片背景产品图（Amazon CDN URL，有则优先使用，无则用 gradient）
- `gradient`: CSS 渐变备选背景（品牌特色色调，无图片时使用）

---

## index.html 中的对应数据结构

index.html 中**不再内联数据**，通过外部文件引入：

```html
<script src="brands.js"></script>
<script src="affiliate-links.js"></script>
<script>
  // 应用逻辑...
</script>
```

**brands.js** — 品牌信息，可手动编辑：
```javascript
const BRANDS = [
  { slug, brand, category, description, favicon, bg, gradient }
];
```

**affiliate-links.js** — 联盟链接：
```javascript
const AFFILIATE_URLS = { "UUID": "https://...&tag=maas&..." };
const BRAND_UUIDS = { "renpho": "E2A21CE0-..." };
```

**手动填写 favicon 方法**：
在 `brands.js` 中找到对应品牌的 `favicon` 字段，填入 Amazon Store 页面中 `<a title="brand-logo">` → `<img>` 的 `src` URL。

**URL 构建规则**：
- 从 `landingpages.txt` 提取链接时，取 `?` 前的路径部分
- 若 UUID 在 `BRAND_UUIDS` 中有映射，优先用 `AFFILIATE_URLS[UUID]`
- 若无映射，回退到 `https://www.amazon.com/stores/page/{UUID}`

---

## Banner 轮播逻辑

- 从 `BRANDS[]` 随机抽取 5 个品牌作为 Banner
- 每 2 秒自动翻页（`setInterval(nextSlide, 2000)`）
- 用户可点击左右箭头或底部圆点手动切换
- 每次翻页重置自动计时器

---

## SEO 注意事项

- 每个联盟链接使用 `rel="noopener noreferrer nofollow"`
- 首页有完整 `WebSite` 结构化数据（Schema.org）
- `robots.txt` 禁止抓取 `manifest.json` 和 `landingpages.txt`
- 定期检查 Amazon CDN 图片 URL 是否失效（图片 404 → 回退到 placehold.co 占位图）

---

## 维护日志格式

每次完成更新后，向 `MEMORY.md` 追加记录：

```markdown
## YYYY-MM-DD — 站点更新
- 新增品牌：[列表]
- 删除品牌：[列表]
- manifest.json updated: YYYY-MM-DDTHH:MM:SSZ
- 备注：[用户特殊要求]
```

---

## 禁止事项

- ❌ 不可硬编码联盟链接到代码中（必须从 `landingpages.txt` 读取）
- ❌ 不可在页面中放测试数据或 Demo 内容
- ❌ 不可删除 `manifest.json` 中的已删除品牌（保留以便恢复）
- ❌ 不可使用外部图床图片（统一从 Amazon CDN 拉取）

---

## 本地预览

```bash
cd affiliate-vince.github.io
python -m http.server 8765
# 访问 http://localhost:8765
```
