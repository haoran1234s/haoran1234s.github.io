/**
 * All copy for the site lives here, in both languages.
 * Replace the placeholder persona (name, contacts, experience, projects) with your own —
 * every section reads from this file, including the printable resume.
 */

export type Lang = 'zh' | 'en'

export interface NavItem {
  id: string
  label: string
}

export interface Social {
  label: string
  handle: string
  href: string
}

export interface Stat {
  value: number
  suffix: string
  label: string
}

export interface Fact {
  label: string
  value: string
}

export interface SkillGroup {
  title: string
  items: string[]
}

export interface ExperienceItem {
  company: string
  role: string
  period: string
  location: string
  summary: string
  highlights: string[]
  stack: string[]
}

export type CoverPattern = 'waves' | 'grid' | 'orbit' | 'bars'

export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  id: string
  title: string
  subtitle: string
  year: string
  role: string
  description: string
  highlights: string[]
  stack: string[]
  links: ProjectLink[]
  palette: [string, string, string]
  pattern: CoverPattern
  /** Optional screenshot (put the file in /public and reference it like "./covers/aurora.jpg"). */
  cover?: string
}

export interface LabItem {
  id: 'particles' | 'flow' | 'dots' | 'goo' | 'morph' | 'flip'
  title: string
  tech: string
  hint: string
}

export interface Content {
  meta: { title: string; description: string }
  ui: {
    skip: string
    loading: string
    menu: string
    close: string
    themeToDark: string
    themeToLight: string
    langSwitch: string
    langSwitchLabel: string
    downloadResume: string
    copyEmail: string
    copied: string
    viewProject: string
    view: string
    drag: string
    play: string
    replay: string
    shuffle: string
    relayout: string
    next: string
    projectRole: string
    projectHighlights: string
    projectStack: string
    backToTop: string
    localTime: string
    rights: string
    builtWith: string
    scrollHint: string
    projectsCounter: string
    consoleGreeting: string
  }
  nav: NavItem[]
  profile: {
    name: string
    nameAlt: string
    initials: string
    wordmark: string
    role: string
    email: string
    phone?: string
    location: string
    timezone: string
    status: string
    avatar?: string
    socials: Social[]
  }
  hero: {
    titleLines: string[]
    rolePrefix: string
    roles: string[]
    intro: string
    primaryCta: string
    secondaryCta: string
  }
  marquee: { top: string[]; bottom: string[] }
  about: {
    label: string
    title: string
    paragraph: string
    stats: Stat[]
    facts: Fact[]
  }
  skills: {
    label: string
    title: string
    intro: string
    groups: SkillGroup[]
  }
  experience: {
    label: string
    title: string
    items: ExperienceItem[]
  }
  projects: {
    label: string
    title: string
    intro: string
    items: Project[]
    more: { title: string; text: string; cta: string; href: string }
  }
  lab: {
    label: string
    title: string
    intro: string
    items: LabItem[]
    particleWord: string
  }
  contact: {
    label: string
    titleLines: string[]
    intro: string
    cta: string
    availability: string
    labels: { email: string; phone: string; social: string; status: string }
  }
  print: {
    summary: string
    skills: string
    experience: string
    projects: string
    contact: string
    portfolio: string
  }
}

const GITHUB = 'https://github.com/haoran1234s'

const socials: Social[] = [{ label: 'GitHub', handle: '@haoran1234s', href: GITHUB }]

const projectMeta: Record<'aurora' | 'pulse' | 'orbit' | 'ledger', Pick<Project, 'palette' | 'pattern'>> = {
  aurora: { palette: ['#7b61ff', '#34d5ff', '#c8ff4d'], pattern: 'waves' },
  pulse: { palette: ['#ff6b3d', '#ffb703', '#fff1d6'], pattern: 'grid' },
  orbit: { palette: ['#0f766e', '#34d5ff', '#e0fbfc'], pattern: 'orbit' },
  ledger: { palette: ['#c8ff4d', '#3ddc84', '#0b0b0e'], pattern: 'bars' },
}

const zh: Content = {
  meta: {
    title: '汪浩然 · AI 应用与可视化前端工程师',
    description: '汪浩然 —— 常驻天津、6 年经验的前端工程师，关注 AI 应用、交互动效与 3D 可视化。在线作品集与可打印简历。',
  },
  ui: {
    skip: '跳到主要内容',
    loading: '正在加载',
    menu: '菜单',
    close: '关闭',
    themeToDark: '切换到深色主题',
    themeToLight: '切换到浅色主题',
    langSwitch: 'EN',
    langSwitchLabel: 'Switch to English',
    downloadResume: '下载简历 PDF',
    copyEmail: '复制邮箱',
    copied: '邮箱已复制到剪贴板 ✓',
    viewProject: '查看项目详情',
    view: '查看',
    drag: '拖动',
    play: '播放',
    replay: '重播',
    shuffle: '打乱',
    relayout: '切换布局',
    next: '下一个',
    projectRole: '角色',
    projectHighlights: '项目亮点',
    projectStack: '技术栈',
    backToTop: '回到顶部',
    localTime: '本地时间',
    rights: '保留所有权利',
    builtWith: '使用 React · GSAP · Three.js · Lenis 手工打造',
    scrollHint: '向下滚动',
    projectsCounter: '继续滚动，横向浏览',
    consoleGreeting: '你好，同行！欢迎查看源码 —— 这个站点由 React + GSAP + Three.js 手工打造。',
  },
  nav: [
    { id: 'about', label: '关于' },
    { id: 'skills', label: '技能' },
    { id: 'experience', label: '经历' },
    { id: 'projects', label: '项目' },
    { id: 'lab', label: '实验室' },
    { id: 'contact', label: '联系' },
  ],
  profile: {
    name: '汪浩然',
    nameAlt: 'Wang Haoran',
    initials: 'WH',
    wordmark: 'Haoran',
    role: '高级前端工程师 · AI 应用与可视化方向',
    email: '2482900307@qq.com',
    location: '中国 · 天津',
    timezone: 'Asia/Shanghai',
    status: '正在看新机会',
    socials,
  },
  hero: {
    titleLines: ['让界面', '拥有呼吸感的', '前端工程师'],
    rolePrefix: '我擅长',
    roles: ['AI 应用与智能交互', 'WebGL / Three.js 3D 可视化', '交互动效设计与实现', '数据可视化', '工程化与性能优化'],
    intro:
      '6 年前端经验，爱折腾 AI 与各种新技术，把设计稿里的「感觉」翻译成 60fps 的代码。我相信好的动效不是装饰，而是让用户读懂界面的语言。',
    primaryCta: '查看作品',
    secondaryCta: '下载简历',
  },
  marquee: {
    top: ['AI 应用', '交互动效', 'WebGL', '3D 可视化', '创意编程', '性能优化'],
    bottom: ['React', 'TypeScript', 'GSAP', 'Three.js', 'GLSL', 'Vue', 'Node.js', 'Canvas', 'SVG', 'Vite'],
  },
  about: {
    label: '关于我',
    title: '把复杂留给自己，把流畅留给用户。',
    paragraph:
      '我是汪浩然，一名有 6 年经验的前端工程师，目前在天津。我喜欢把复杂的交互做得自然、流畅，也对 AI 等新技术充满好奇 —— 大模型应用、AI 辅助编程、Web 3D 与可视化，新东西一出来我总会第一时间上手试一试，再琢磨怎样把它落到真实的产品体验里。工作之外我热爱运动，它让我保持充沛的精力和积极的心态，也让我习惯了坚持与复盘。',
    stats: [
      { value: 6, suffix: '年', label: '前端开发经验' },
      { value: 60, suffix: 'fps', label: '每一帧动效的流畅底线' },
    ],
    facts: [
      { label: '现居', value: '天津' },
      { label: '经验', value: '6 年前端开发' },
      { label: '方向', value: 'AI 应用 · 可视化前端' },
      { label: '爱好', value: '运动 · 研究 AI 新技术' },
    ],
  },
  skills: {
    label: '技能栈',
    title: '工具箱',
    intro: '拖动球体可以旋转它；悬停或点按任意技能，球体会把它转到你面前。',
    groups: [
      { title: '核心语言与框架', items: ['TypeScript', 'JavaScript', 'React', 'Vue 3', 'Next.js', 'Node.js'] },
      { title: 'AI 应用开发', items: ['大模型 API', 'SSE 流式输出', 'Agent 交互', 'RAG', 'Prompt 工程', 'AI 辅助编程'] },
      { title: '动效与可视化', items: ['GSAP', 'Three.js', 'WebGL', 'GLSL', 'Canvas 2D', 'SVG', 'ECharts'] },
      { title: '工程化与性能', items: ['Vite', 'Webpack', 'Monorepo', 'Vitest', 'Web Vitals', 'CI/CD'] },
    ],
  },
  experience: {
    label: '工作经历',
    title: '一路走来',
    items: [
      {
        company: '某头部内容社区',
        role: '高级前端工程师 · 互动技术负责人',
        period: '2022 — 至今',
        location: '上海',
        summary: '负责社区品牌活动与创作工具的互动体验，带领 4 人小组搭建内部动效平台。',
        highlights: [
          '主导「年度报告」H5，WebGL 粒子转场 + 滚动叙事，上线 3 天 PV 破 2000 万',
          '设计并落地动效 Token 与时间轴编排库，活动页开发周期从 2 周缩短到 4 天',
          '低端机自适应降级方案，让核心交互在千元机上也稳定 55fps 以上',
        ],
        stack: ['React', 'TypeScript', 'GSAP', 'Three.js', 'GLSL'],
      },
      {
        company: '某跨境电商平台',
        role: '前端工程师 · 设计系统方向',
        period: '2019 — 2022',
        location: '杭州',
        summary: '参与从 0 到 1 搭建公司级设计系统，覆盖 30+ 业务线与 3 套品牌主题。',
        highlights: [
          '实现主题引擎与 Design Tokens 管线，Figma 变量一键同步到代码',
          '组件库沉淀 60+ 组件，单测覆盖率 90%，全量支持键盘与读屏操作',
          '首页 LCP 从 3.8s 优化到 1.6s，转化率提升 6.4%',
        ],
        stack: ['Vue 3', 'React', 'Storybook', 'Vite', 'Web Vitals'],
      },
      {
        company: '某创意数字工作室',
        role: '前端开发工程师',
        period: '2017 — 2019',
        location: '上海',
        summary: '为汽车、美妆和运动品牌制作 Campaign 网站与互动装置。',
        highlights: [
          '交付 20+ 品牌 Campaign 站点，其中 2 个获 Awwwards Honorable Mention',
          '用 Canvas + WebAudio 制作音乐可视化互动装置，用于线下快闪店',
        ],
        stack: ['JavaScript', 'Canvas', 'WebAudio', 'PixiJS', 'SVG'],
      },
    ],
  },
  projects: {
    label: '精选项目',
    title: '作品',
    intro: '点开任意卡片查看项目详情。每个项目都在讲一个关于「体验」的故事。',
    items: [
      {
        id: 'aurora',
        title: 'Aurora 品牌官网',
        subtitle: 'WebGL 首屏 · 滚动叙事 · 品牌动效规范',
        year: '2025',
        role: '技术负责人 / 创意开发',
        description:
          '为一个新能源品牌重做官网。首屏是用自定义着色器渲染的「极光」流体，跟随滚动和鼠标实时变化；下方用 ScrollTrigger 编排了 6 段产品故事，所有动效参数沉淀为可复用的 Motion Tokens。',
        highlights: ['自研 GLSL 流体着色器，移动端自动降级', '滚动叙事编排 120+ 段动画，零掉帧', 'Lighthouse 性能 96 分，CLS 为 0'],
        stack: ['Next.js', 'Three.js', 'GLSL', 'GSAP', 'Lenis'],
        links: [
          { label: '在线访问', href: 'https://example.com' },
          { label: '案例拆解', href: 'https://example.com' },
        ],
        ...projectMeta.aurora,
      },
      {
        id: 'pulse',
        title: 'Pulse 设计系统',
        subtitle: '60+ 组件 · 多品牌主题 · Figma 变量同步',
        year: '2023',
        role: '核心开发者',
        description:
          '公司级设计系统，从 Design Tokens、主题引擎到组件与文档站全链路建设。动效层提供统一的缓动曲线、时长与编排原语，让 30 多条业务线拥有一致的「手感」。',
        highlights: ['Tokens 管线：Figma → JSON → CSS 变量 / TS 类型', '组件全量 A11y，支持键盘与读屏', '文档站内嵌可交互的动效 Playground'],
        stack: ['React', 'TypeScript', 'Storybook', 'Style Dictionary', 'Vitest'],
        links: [
          { label: '文档站', href: 'https://example.com' },
          { label: 'GitHub', href: 'https://github.com/' },
        ],
        ...projectMeta.pulse,
      },
      {
        id: 'orbit',
        title: 'Orbit 3D 产品配置器',
        subtitle: '实时 3D · PBR 材质 · 截图分享',
        year: '2024',
        role: '前端 / 3D 开发',
        description:
          '让用户在浏览器里实时配置一台智能硬件：切换材质、颜色和配件，镜头随选项平滑运镜，并可一键生成分享海报。',
        highlights: ['glTF 模型压缩 + 按需加载，首屏资源减少 68%', '基于状态机的相机运镜系统', '离屏渲染生成 2K 分享海报'],
        stack: ['React Three Fiber', 'Three.js', 'Zustand', 'Web Worker'],
        links: [{ label: '在线体验', href: 'https://example.com' }],
        ...projectMeta.orbit,
      },
      {
        id: 'ledger',
        title: 'Ledger 实时数据大屏',
        subtitle: '万级数据点 · Canvas 渲染 · 60fps',
        year: '2022',
        role: '前端负责人',
        description:
          '面向运营团队的实时交易监控大屏。用 Canvas 自绘图表承载每秒上万数据点，配合数字滚动、轨迹流光等动效把关键变化「推」到运营眼前。',
        highlights: ['自研 Canvas 图表层，万级数据点稳定 60fps', 'WebSocket 增量更新 + 时间切片渲染', '异常告警动效分级，误报响应时间降低 40%'],
        stack: ['Vue 3', 'Canvas', 'WebSocket', 'ECharts', 'Web Worker'],
        links: [{ label: '项目介绍', href: 'https://example.com' }],
        ...projectMeta.ledger,
      },
    ],
    more: {
      title: '还有更多',
      text: '更多实验和代码都放在 GitHub 上，欢迎来逛逛。',
      cta: '去 GitHub 看看',
      href: GITHUB,
    },
  },
  lab: {
    label: '动效实验室',
    title: '实验室',
    intro: '六个小实验，每一个都可以直接上手玩。它们都用原生 Canvas / SVG / GSAP 实现，没有借助任何图表或特效库。',
    particleWord: '你好',
    items: [
      { id: 'particles', title: '粒子文字', tech: 'Canvas 2D · 弹簧物理', hint: '把鼠标移进来打散文字' },
      { id: 'flow', title: '噪声流场', tech: 'Simplex Noise · 拖尾', hint: '按住鼠标制造漩涡' },
      { id: 'dots', title: '弹性点阵', tech: 'Canvas 2D · 涟漪', hint: '移动鼠标或点击产生波纹' },
      { id: 'goo', title: '黏性追踪', tech: 'SVG Filter · 缓动跟随', hint: '鼠标进来，它会追着你' },
      { id: 'morph', title: '形状变形', tech: 'GSAP MorphSVG · DrawSVG', hint: '点击切换到下一个形状' },
      { id: 'flip', title: '布局补间', tech: 'GSAP Flip · FLIP 技术', hint: '状态变化，补间自动生成' },
    ],
  },
  contact: {
    label: '联系方式',
    titleLines: ['一起做点', '有意思的东西'],
    intro: '正在寻找 AI 应用前端、3D 可视化与创意交互方向的岗位。如果你的团队在意体验细节，也在认真把 AI 用进产品，我们应该聊聊。',
    cta: '发邮件给我',
    availability: '通常 24 小时内回复',
    labels: { email: '邮箱', phone: '电话 / 微信', social: '社交主页', status: '当前状态' },
  },
  print: {
    summary: '个人简介',
    skills: '专业技能',
    experience: '工作经历',
    projects: '项目经历',
    contact: '联系方式',
    portfolio: '在线作品集',
  },
}

const en: Content = {
  meta: {
    title: 'Wang Haoran · Frontend Engineer, AI & Visualisation',
    description:
      'Wang Haoran — a Tianjin-based frontend engineer with six years of experience, focused on AI products, interaction & motion and 3D visualisation. Portfolio & printable resume.',
  },
  ui: {
    skip: 'Skip to content',
    loading: 'Loading',
    menu: 'Menu',
    close: 'Close',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
    langSwitch: '中',
    langSwitchLabel: '切换到中文',
    downloadResume: 'Download PDF resume',
    copyEmail: 'Copy email',
    copied: 'Email copied to clipboard ✓',
    viewProject: 'View project details',
    view: 'View',
    drag: 'Drag',
    play: 'Play',
    replay: 'Replay',
    shuffle: 'Shuffle',
    relayout: 'Re-layout',
    next: 'Next',
    projectRole: 'Role',
    projectHighlights: 'Highlights',
    projectStack: 'Stack',
    backToTop: 'Back to top',
    localTime: 'Local time',
    rights: 'All rights reserved',
    builtWith: 'Hand-built with React · GSAP · Three.js · Lenis',
    scrollHint: 'Scroll',
    projectsCounter: 'Scroll to explore',
    consoleGreeting: 'Hello, fellow dev! Thanks for peeking under the hood — hand-built with React + GSAP + Three.js.',
  },
  nav: [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Work' },
    { id: 'lab', label: 'Lab' },
    { id: 'contact', label: 'Contact' },
  ],
  profile: {
    name: 'Wang Haoran',
    nameAlt: '汪浩然',
    initials: 'WH',
    wordmark: 'Haoran',
    role: 'Senior Frontend Engineer · AI Products & Visualisation',
    email: '2482900307@qq.com',
    location: 'Tianjin, China',
    timezone: 'Asia/Shanghai',
    status: 'Open to new roles',
    socials,
  },
  hero: {
    titleLines: ['Making', 'interfaces', 'breathe.'],
    rolePrefix: 'Frontend engineer, specialising in',
    roles: ['AI-powered product UIs', 'WebGL & 3D visualisation', 'interaction & motion design', 'data visualisation', 'tooling & web performance'],
    intro:
      'Six years in frontend, always tinkering with AI and new tech. I turn the “feel” of a design into 60fps code, because great motion is not decoration — it is the language that helps people understand an interface.',
    primaryCta: 'See my work',
    secondaryCta: 'Get résumé',
  },
  marquee: {
    top: ['AI products', 'Interaction', 'Motion', 'WebGL', '3D & data viz', 'Performance'],
    bottom: ['React', 'TypeScript', 'GSAP', 'Three.js', 'GLSL', 'Vue', 'Node.js', 'Canvas', 'SVG', 'Vite'],
  },
  about: {
    label: 'About',
    title: 'I take on the complexity so users only feel the flow.',
    paragraph:
      'I am Wang Haoran, a frontend engineer based in Tianjin with six years of experience. I love making complex interactions feel natural and smooth, and I am endlessly curious about AI and other new tech — LLM-powered apps, AI-assisted coding, Web 3D and data visualisation. When something new comes out I try it right away, then work out how it could make a real product experience better. Outside work I am into sports: they keep me energetic and positive, and have taught me persistence and the habit of reflecting on what to improve.',
    stats: [
      { value: 6, suffix: '', label: 'years of frontend experience' },
      { value: 60, suffix: 'fps', label: 'the bar for every animation' },
    ],
    facts: [
      { label: 'Based in', value: 'Tianjin, China' },
      { label: 'Experience', value: '6 years in frontend' },
      { label: 'Focus', value: 'AI products · visual frontend' },
      { label: 'Interests', value: 'Sports · exploring AI & new tech' },
    ],
  },
  skills: {
    label: 'Skills',
    title: 'Toolbox',
    intro: 'Drag the sphere to spin it. Hover or tap any skill and the sphere will turn it to face you.',
    groups: [
      { title: 'Languages & frameworks', items: ['TypeScript', 'JavaScript', 'React', 'Vue 3', 'Next.js', 'Node.js'] },
      { title: 'AI engineering', items: ['LLM APIs', 'SSE streaming', 'Agent UIs', 'RAG', 'Prompt engineering', 'AI-assisted coding'] },
      { title: 'Motion & visualisation', items: ['GSAP', 'Three.js', 'WebGL', 'GLSL', 'Canvas 2D', 'SVG', 'ECharts'] },
      { title: 'Tooling & performance', items: ['Vite', 'Webpack', 'Monorepo', 'Vitest', 'Web Vitals', 'CI/CD'] },
    ],
  },
  experience: {
    label: 'Experience',
    title: 'The journey',
    items: [
      {
        company: 'Leading content community',
        role: 'Senior Frontend Engineer · Interactive Tech Lead',
        period: '2022 — Now',
        location: 'Shanghai',
        summary: 'Own the interactive experience of brand campaigns and creator tools; lead a 4-person team building an internal motion platform.',
        highlights: [
          'Led the “Year in Review” campaign: WebGL particle transitions + scroll storytelling, 20M+ page views in 3 days',
          'Designed motion tokens and a timeline orchestration library, cutting campaign build time from 2 weeks to 4 days',
          'Adaptive degradation for low-end devices keeps core interactions above 55fps on budget phones',
        ],
        stack: ['React', 'TypeScript', 'GSAP', 'Three.js', 'GLSL'],
      },
      {
        company: 'Cross-border e-commerce platform',
        role: 'Frontend Engineer · Design Systems',
        period: '2019 — 2022',
        location: 'Hangzhou',
        summary: 'Helped build the company-wide design system from scratch, serving 30+ product lines and 3 brand themes.',
        highlights: [
          'Built the theme engine and design-token pipeline — Figma variables sync to code in one command',
          '60+ components with 90% unit-test coverage, fully keyboard and screen-reader accessible',
          'Improved home page LCP from 3.8s to 1.6s, lifting conversion by 6.4%',
        ],
        stack: ['Vue 3', 'React', 'Storybook', 'Vite', 'Web Vitals'],
      },
      {
        company: 'Creative digital studio',
        role: 'Frontend Developer',
        period: '2017 — 2019',
        location: 'Shanghai',
        summary: 'Built campaign sites and interactive installations for automotive, beauty and sports brands.',
        highlights: [
          'Shipped 20+ brand campaign sites, two of them awarded Awwwards Honorable Mention',
          'Created a Canvas + WebAudio music visualiser installation for pop-up stores',
        ],
        stack: ['JavaScript', 'Canvas', 'WebAudio', 'PixiJS', 'SVG'],
      },
    ],
  },
  projects: {
    label: 'Selected work',
    title: 'Work',
    intro: 'Open any card for the details. Every project here is a story about experience.',
    items: [
      {
        id: 'aurora',
        title: 'Aurora brand site',
        subtitle: 'WebGL hero · scroll storytelling · motion guidelines',
        year: '2025',
        role: 'Tech lead / creative developer',
        description:
          'A full redesign for an EV brand. The hero is an “aurora” fluid rendered with a custom shader that reacts to scroll and pointer; below it, ScrollTrigger choreographs six product stories, with every motion parameter captured as reusable motion tokens.',
        highlights: ['Custom GLSL fluid shader with automatic mobile fallback', '120+ scroll-driven animations, zero dropped frames', 'Lighthouse performance 96, CLS of 0'],
        stack: ['Next.js', 'Three.js', 'GLSL', 'GSAP', 'Lenis'],
        links: [
          { label: 'Live site', href: 'https://example.com' },
          { label: 'Case study', href: 'https://example.com' },
        ],
        ...projectMeta.aurora,
      },
      {
        id: 'pulse',
        title: 'Pulse design system',
        subtitle: '60+ components · multi-brand theming · Figma sync',
        year: '2023',
        role: 'Core developer',
        description:
          'A company-wide design system covering tokens, theming, components and docs. Its motion layer ships shared easings, durations and choreography primitives, so 30+ product lines share the same “feel”.',
        highlights: ['Token pipeline: Figma → JSON → CSS variables / TS types', 'Fully accessible components (keyboard & screen readers)', 'Docs site with an interactive motion playground'],
        stack: ['React', 'TypeScript', 'Storybook', 'Style Dictionary', 'Vitest'],
        links: [
          { label: 'Docs', href: 'https://example.com' },
          { label: 'GitHub', href: 'https://github.com/' },
        ],
        ...projectMeta.pulse,
      },
      {
        id: 'orbit',
        title: 'Orbit 3D configurator',
        subtitle: 'Real-time 3D · PBR materials · shareable renders',
        year: '2024',
        role: 'Frontend / 3D developer',
        description:
          'Configure a smart device in real time in the browser: swap materials, colours and accessories while the camera glides between viewpoints, then export a share-ready poster.',
        highlights: ['glTF compression + lazy loading cut initial payload by 68%', 'State-machine driven camera choreography', 'Off-screen rendering for 2K share posters'],
        stack: ['React Three Fiber', 'Three.js', 'Zustand', 'Web Worker'],
        links: [{ label: 'Try it', href: 'https://example.com' }],
        ...projectMeta.orbit,
      },
      {
        id: 'ledger',
        title: 'Ledger live dashboard',
        subtitle: '10k+ data points · Canvas rendering · 60fps',
        year: '2022',
        role: 'Frontend lead',
        description:
          'A real-time trading monitor for operations teams. A custom Canvas chart layer handles tens of thousands of points per second, while counters, light trails and alert motion push the important changes right in front of the operators.',
        highlights: ['Custom Canvas chart layer holding 60fps with 10k+ points', 'Incremental WebSocket updates + time-sliced rendering', 'Tiered alert motion cut incident response time by 40%'],
        stack: ['Vue 3', 'Canvas', 'WebSocket', 'ECharts', 'Web Worker'],
        links: [{ label: 'Overview', href: 'https://example.com' }],
        ...projectMeta.ledger,
      },
    ],
    more: {
      title: 'There is more',
      text: 'More experiments and code live on GitHub — come and have a look.',
      cta: 'Visit GitHub',
      href: GITHUB,
    },
  },
  lab: {
    label: 'Motion lab',
    title: 'Lab',
    intro: 'Six small experiments you can play with right here — all written with plain Canvas, SVG and GSAP, no effect or chart libraries.',
    particleWord: 'Hello',
    items: [
      { id: 'particles', title: 'Particle type', tech: 'Canvas 2D · spring physics', hint: 'Move inside to scatter the letters' },
      { id: 'flow', title: 'Noise flow field', tech: 'Simplex noise · trails', hint: 'Press and hold to create a vortex' },
      { id: 'dots', title: 'Elastic dot grid', tech: 'Canvas 2D · ripples', hint: 'Move around or click for ripples' },
      { id: 'goo', title: 'Gooey follower', tech: 'SVG filter · eased follow', hint: 'Step inside and it chases you' },
      { id: 'morph', title: 'Shape morphing', tech: 'GSAP MorphSVG · DrawSVG', hint: 'Click for the next shape' },
      { id: 'flip', title: 'Layout tweening', tech: 'GSAP Flip · FLIP technique', hint: 'State changes, tweens for free' },
    ],
  },
  contact: {
    label: 'Contact',
    titleLines: ["Let's build", 'something fun'],
    intro:
      'I am looking for frontend roles around AI products, 3D / data visualisation and creative interaction. If your team cares about the details of experience and is serious about bringing AI into the product, we should talk.',
    cta: 'Email me',
    availability: 'Usually replies within 24h',
    labels: { email: 'Email', phone: 'Phone / WeChat', social: 'Elsewhere', status: 'Status' },
  },
  print: {
    summary: 'Profile',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    contact: 'Contact',
    portfolio: 'Portfolio',
  },
}

export const content: Record<Lang, Content> = { zh, en }
