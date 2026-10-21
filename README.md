# Motion Portfolio · 动效简历作品集

一个面向**前端 / 创意开发 / 交互动效**岗位求职的个人作品集网站：既是一份「可以交互的简历」，也是一块展示动效功底的作品本身。
中英双语、深浅双主题、移动端适配，并且一键导出 A4 PDF 简历。

在线预览：https://haoran1234s.github.io/

> 站内所有文案集中在 `src/data/content.ts`。基础信息（姓名、联系方式、简介、技能）已是本人信息；工作经历和项目目前仍是示例数据，待替换。

## 亮点

### 全站体验

- **Lenis 平滑滚动 + GSAP ScrollTrigger**：由 `gsap.ticker` 统一驱动，滚动、动画同一帧更新，不抖不撕裂
- **加载动画**：数字计数 + 幕布退场，衔接首屏标题入场
- **自定义光标**：精确圆点 + 延迟跟随的圆环，悬停项目卡片 / 拖拽区域时变形并显示文字（仅在鼠标设备启用）
- **磁吸按钮**、顶部滚动进度条、胶片颗粒质感叠层
- **主题切换**：View Transitions API 以点击位置为圆心「扩散」切换深 / 浅色
- **语言切换**：中 / 英切换后保持在当前阅读位置不跳动；首次访问跟随浏览器语言，选择会被记住
- **导航**：向下滚动自动隐藏、向上滚动出现，滚动后毛玻璃背景，当前板块高亮；移动端全屏菜单

### 各板块

| 板块 | 动效 / 技术点 |
| --- | --- |
| Hero 首屏 | three.js 自定义着色器「液态球体」，随鼠标鼓起、随滚动变形，主题切换时颜色平滑过渡（按需懒加载，不阻塞首屏）；SplitText 逐字入场；职位文字乱码解码轮播；本地时间 |
| 跑马灯 | 两条倾斜飘带无缝循环，滚动越快跑得越快，并随滚动方向反向、倾斜 |
| 关于我 | 段落随滚动逐词（中文逐字）点亮；数字滚动计数；头像卡片视差 |
| 技能栈 | 纯 DOM + transform 实现的 3D 标签球：可拖拽带惯性，悬停 / 点按任意技能，球体会把它转到正前方 |
| 工作经历 | 时间轴随滚动「生长」，条目依次入场 |
| 作品 | 桌面端：区块固定 + 横向滚动，带进度计数与视差封面；点击卡片用 GSAP Flip 共享元素过渡展开详情弹窗（支持「下一个」、Esc、焦点管理）；移动端自动改为纵向列表 |
| 动效实验室 | 6 个可直接上手玩的小实验（见下表） |
| 联系方式 | 环形文字徽章旋转、一键复制邮箱、社交链接上下翻滚显示账号 |
| 页脚 | 渐变超大字标自动撑满宽度、回到顶部 |

### 动效实验室

| Demo | 技术 |
| --- | --- |
| 粒子文字 | Canvas 2D 采样文字像素 + 弹簧物理，鼠标靠近即散开 |
| 噪声流场 | Simplex Noise 驱动粒子拖尾，按住鼠标制造漩涡 |
| 弹性点阵 | Canvas 2D 点阵 + 点击涟漪 |
| 黏性追踪 | SVG Filter「goo」融合一串缓动跟随的圆 |
| 形状变形 | GSAP MorphSVG 形变 + DrawSVG 描边重绘 |
| 布局补间 | GSAP Flip（FLIP 技术）在布局变化间自动补间 |

### 工程与细节

- **可访问性**：尊重系统「减少动态效果」设置（所有动效降级为静态，内容完整可见）；键盘可操作、跳转到主内容链接、弹窗打开时背景 `inert`
- **性能**：three.js 单独分包并动态 `import()`；React / GSAP 独立 vendor chunk；动画以 transform / opacity 为主；离屏 Canvas 自动暂停
- **打印简历**：独立的 ATS 友好版式（不是网页截图），中英文都控制在 2 页 A4，邮箱 / 作品集 / 社交链接在 PDF 中可点击
- **TypeScript 严格模式 + oxlint**，构建零警告

## 技术栈

React 19 · TypeScript · Vite 8 · GSAP 3（ScrollTrigger / SplitText / Flip / MorphSVG / DrawSVG，GSAP 3.13 起全部插件免费）· Lenis · three.js · 原生 Canvas / SVG / CSS（无 UI 库）

## 快速开始

需要 Node.js **20.19+ 或 22.12+**。

```bash
npm install
npm run dev        # 开发：http://localhost:5173
npm run build      # 类型检查 + 生产构建，输出到 dist/
npm run preview    # 本地预览构建结果：http://localhost:4173
npm run lint       # oxlint
npm run typecheck  # 仅类型检查
```

## 改成你自己的

1. **文案**：`src/data/content.ts` 里 `zh` 和 `en` 两份内容——姓名、职位、经历、项目、技能、联系方式全部在这里，网页和 PDF 简历共用同一份数据。只想要中文的话，英文那份也建议同步修改（语言切换按钮会用到）。
2. **头像**：把照片放进 `public/`（如 `public/avatar.jpg`），在 `profile` 里加上 `avatar: './avatar.jpg'`；不设置时显示姓名首字母的渐变卡片。
3. **项目封面**：默认是程序生成的 SVG 封面（每个项目一种图案和配色，`projectMeta` 里可改）。有真实截图时放到 `public/covers/`，在项目里加 `cover: './covers/xxx.jpg'`。
4. **配色 / 字体**：`src/styles/global.css` 顶部的 CSS 变量（`--accent`、`--accent-2`、`--blob-*` 等），深浅主题各一套。
5. **板块顺序**：在 `src/App.tsx` 里调整或删除 `<Section />`。
6. **页面标题 / SEO**：`index.html` 里的 `<title>` 和 meta 描述。

## 导出 PDF 简历

点击首屏或导航里的「下载简历」，浏览器会打开打印对话框：目标选「另存为 PDF」、纸张 A4 即可。
打印时会自动切换成专门排版的纸质简历（白底、无动效），与当前所选语言一致。

## 部署

仓库自带 GitHub Actions 工作流 `.github/workflows/deploy.yml`：每次推送到 `main` 分支，都会自动执行 `npm ci` → `npm run lint` → `npm run build`，再把 `dist/` 发布到 GitHub Pages。也可以在仓库的 Actions 页面手动 Run workflow 重新部署。

首次使用只需在 GitHub 上设置一次：仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。

- 仓库名是 `用户名.github.io` 时，网址为 `https://用户名.github.io/`
- 其他仓库名（例如 `motion-portfolio`）时，网址为 `https://用户名.github.io/motion-portfolio/`

`vite.config.ts` 里设置了 `base: './'`，所以两种网址都不用改配置。也可以 `npm run build` 后把 `dist/` 上传到任意静态托管：Vercel、Netlify、Cloudflare Pages、阿里云 OSS / 腾讯云 COS 等。

## 目录结构

```
motion-portfolio/
├─ .github/workflows/      GitHub Pages 自动部署
├─ index.html              入口 HTML（首屏主题脚本、SEO meta）
├─ public/                 静态资源（favicon、头像、项目截图放这里）
├─ src/
│  ├─ main.tsx · App.tsx   挂载与板块编排
│  ├─ data/content.ts      ★ 全部文案（中 / 英），改这里就是你的简历
│  ├─ context/             主题、语言、加载状态
│  ├─ sections/            Hero / Marquee / About / Skills / Experience / Projects / Lab / Contact
│  ├─ components/          Header、Footer、Cursor、Preloader、ProjectModal、TagSphere、PrintResume 等
│  ├─ lab/                 6 个动效实验
│  ├─ hooks/               useReveal / useMagnetic / useInView
│  ├─ lib/                 GSAP 注册、Lenis 平滑滚动、three.js 场景、噪声与工具函数
│  └─ styles/              全局样式与主题变量、打印样式
├─ vite.config.ts
└─ package.json
```

## 面试时可以展开讲的点

- 为什么用 `gsap.ticker` 驱动 Lenis：让平滑滚动和所有 ScrollTrigger 在同一个 rAF 里计算，避免两套时钟导致的抖动
- 横向滚动作品区：`pin` + `containerAnimation` 让卡片内的视差在「横向」时间轴上触发；移动端用 `gsap.matchMedia` 自动切换到纵向
- 弹窗的共享元素过渡：`Flip.getState` 记录卡片封面，弹窗挂载后 `Flip.from` 补间；关闭时 `Flip.fit` 飞回原卡片
- 3D 标签球没有用 WebGL：斐波那契球面分布 + 旋转矩阵 + 透视缩放，全部是 DOM transform，因此文字清晰锐利；球体本身对读屏隐藏，旁边的技能按钮列表才是可访问的版本
- 语言切换不跳动：切换前记录视口内的锚点元素与偏移，`flushSync` 同步渲染新语言并刷新 ScrollTrigger 后立即复原
- 动效降级策略：`prefers-reduced-motion`、触屏设备不启用自定义光标、three.js 懒加载与离屏暂停

## 灵感与参考项目

**获奖 / 知名个人站**（看创意与节奏）

- [Bruno Simon](https://bruno-simon.com)：开着小车探索的 3D 游戏化作品集（Three.js）
- [Brittany Chiang v4](https://v4.brittanychiang.com) · [源码](https://github.com/bchiang7/v4)：简洁的开发者作品集标杆，光标光晕、滚动联动导航
- [Hamish Williams](https://hamishw.com) · [源码](https://github.com/hamishmw/portfolio)：React + Three.js，动效与排版都很讲究
- [Julien Renau](https://julienrenau.com/)：Creative Technologist，多个 Awwwards SOTD 作品
- [Valentin Gassend](https://valentingassend.com/en/)：WebGL / Three.js / GSAP 自由创意开发者
- [ITom](https://itomdev.com/)：获奖创意开发者的交互式个人站
- [Cerebrium（Awwwards SOTD）](https://www.awwwards.com/sites/cerebrium)：WebGL 地球 + 滚动驱动场景
- [Abhishek Jha — Folio '25（Awwwards SOTD）](https://www.awwwards.com/sites/abhishek-jha-folio-25)

**开源模板 / 代码参考**（看实现）

- [zickrian/motionfolio](https://github.com/zickrian/motionfolio)：React + Vite + GSAP 动效作品集起步模板（MIT）
- [dnuzi/Portfolio-Site](https://github.com/dnuzi/Portfolio-Site)：Lenis + ScrollTrigger + 横向固定作品区（MIT）
- [creativoma/lenis-gsap-lab](https://github.com/creativoma/lenis-gsap-lab)：Lenis 与 GSAP 配合的各种实验
- [adrianhajdin/project_3D_developer_portfolio](https://github.com/adrianhajdin/project_3D_developer_portfolio)：最热门的 React + Three.js 3D 作品集教程
- [mohitvirli/mohitvirli.github.io](https://github.com/mohitvirli/mohitvirli.github.io)：React Three Fiber + Drei + GSAP 的 3D 个人站
- [VaibhavKhushalani/cinematic-portfolio](https://github.com/VaibhavKhushalani/cinematic-portfolio)：Next.js + GSAP + Three.js 电影感作品集

> 参考别人的作品时请留意各自的许可证：有些仓库明确禁止复制或商用。本项目的代码全部为原创实现。
