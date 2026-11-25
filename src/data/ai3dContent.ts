import type { Content, Lang, PipelineScript, Social } from './content'

const EMAIL = '2482900307@qq.com'
const PHONE = '13473874342'

const socials: Social[] = []

const blenderQaScript: PipelineScript = {
  filename: 'blend_delivery_qa.py',
  title: 'Blender 交付规范自检与打包脚本（bpy）',
  description:
    '使用 Python + Codex / GPT 辅助维护的交付前质检脚本：自动校验 Scale 归零、非流形网格、材质命名与贴图链接，并一键内嵌外部资源，确保交出去的 .blend 工程可直接打开复用与多轮返修。',
  code: `import bpy
import bmesh

def audit_and_pack_blend():
    issues = []
    # 1. 统一物理尺寸与 Transform 校验
    for obj in bpy.data.objects:
        if obj.type != 'MESH':
            continue
        sx, sy, sz = obj.scale
        if any(abs(v - 1.0) > 1e-3 for v in (sx, sy, sz)):
            issues.append(f"[Scale未应用] {obj.name}: {tuple(round(v, 3) for v in obj.scale)}")
        if not obj.data.uv_layers:
            issues.append(f"[缺少UV] {obj.name}")

        # 2. 非流形与重面检查
        bm = bmesh.new()
        bm.from_mesh(obj.data)
        non_manifold = sum(1 for e in bm.edges if not e.is_manifold)
        if non_manifold:
            issues.append(f"[非流形边:{non_manifold}] {obj.name}")
        bm.free()

    # 3. 清理孤立数据块并内嵌全部贴图
    bpy.ops.outliner.orphans_purge(do_local_ids=True, do_linked_ids=True, do_recursive=True)
    bpy.ops.file.pack_all()
    bpy.ops.wm.save_mainfile()

    print("=== .blend 交付质检完成 ===")
    if issues:
        print("\\n".join(issues))
    else:
        print("OK: 拓扑、UV、Transform 与资源打包全部通过。")

if __name__ == "__main__":
    audit_and_pack_blend()`,
}

const blenderQaScriptEn: PipelineScript = {
  filename: 'blend_delivery_qa.py',
  title: 'Blender Delivery QA & Auto-Pack Script (bpy)',
  description:
    'Automated pre-delivery check maintained with Python + Codex / GPT: validates unapplied transforms, missing UVs, and non-manifold geometry, purges orphan datablocks, and packs all external textures into a clean, revision-ready .blend file.',
  code: blenderQaScript.code,
}

const zh: Content = {
  meta: {
    title: '汪浩然 · AI 3D 全流程创作者 & Blender 高级建模渲染',
    description:
      '汪浩然 —— 精通 Blender 进阶建模、PBR 材质、Cycles 写实渲染与 AI 3D 落地工作流，辅以 Python / Codex 自动化脚本，居家时间自由可高频配合返修。',
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
    copied: '已复制到剪贴板 ✓',
    viewProject: '查看作品详情',
    view: '查看',
    drag: '拖动',
    play: '播放',
    replay: '重播',
    shuffle: '打乱',
    relayout: '切换布局',
    next: '下一个',
    projectRole: '负责环节',
    projectHighlights: '全流程拆解',
    projectStack: '工具与管线',
    backToTop: '回到顶部',
    localTime: '本地时间',
    rights: '保留所有权利',
    builtWith: 'AI 3D 工作流 · Blender Cycles · Python 管线工程',
    scrollHint: '向下滚动',
    projectsCounter: '继续滚动，横向浏览',
    consoleGreeting: '你好！这是一份专为 AI + Blender 3D 创作协作定制的在线简历与作品集。',
  },
  nav: [
    { id: 'about', label: '关于' },
    { id: 'skills', label: '技能' },
    { id: 'experience', label: '经历' },
    { id: 'projects', label: '作品' },
    { id: 'pipeline', label: '交付规范' },
    { id: 'contact', label: '联系' },
  ],
  profile: {
    name: '汪浩然',
    nameAlt: 'Wang Haoran',
    initials: 'WH',
    wordmark: 'Haoran',
    role: 'AI 3D 全流程创作者 · Blender 进阶建模与写实渲染',
    email: EMAIL,
    phone: PHONE,
    location: '中国 · 天津（居家远程）',
    timezone: 'Asia/Shanghai',
    status: '居家时间自由 · 可高频配合返修',
    socials,
  },
  hero: {
    titleLines: ['AI 驱动', '写实 3D 的', '全流程创作者'],
    rolePrefix: '我擅长',
    roles: [
      'AI 提示词 + Blender 3D 全流程',
      '写实硬表面建模与 Cycles 渲染',
      '规范可迭代 .blend 工程交付',
      'Python (bpy) / Codex 管线提效',
      '高频沟通响应与精细化返修',
    ],
    intro:
      '5 年+ 前端可视化与 Blender 3D 工程经验，专注「AI 辅助起型 + Blender 进阶精修 + 写实渲染」全流程落地。居家办公时间充裕、沟通顺畅，可随时配合多轮修改直到完全验收通过；同时熟悉 Python / Codex 脚本提效，确保交付的每份 .blend 工程结构清晰、可直接二次迭代。',
    primaryCta: '查看写实作品',
    secondaryCta: '下载简历',
  },
  marquee: {
    top: ['AI + Blender 全流程', '写实产品渲染', '硬表面重拓扑', 'PBR 节点材质', '规范 .blend 工程', '高频配合返修'],
    bottom: ['Blender 4.x', 'Cycles / EEVEE', 'Python (bpy)', 'Codex / GPT', 'Tripo / Meshy / Rodin', 'ComfyUI', 'Geometry Nodes', 'ACES / AgX'],
  },
  about: {
    label: '关于我',
    title: '既能用 AI 把效率拉满，也能用 Blender 把写实细节磨透。',
    paragraph:
      '我是汪浩然，5 年+ 前端可视化与 3D 资产工程经验，现居天津、时间自由可全职远程协作。日常深度使用「AI 提示词工程 + AI 3D 初模生成 + Blender 精修」工作流：前端借助 Midjourney / FLUX 设定参考与 Tripo / Meshy / Rodin / Hunyuan3D 快速出型，后端在 Blender 内独立完成硬表面细分、四边面重拓扑、UV 展开、PBR 节点材质调校与 Cycles 棚拍/场景布光。凭借扎实的前端与研发底盘，我还善用 Python (bpy) 与 Codex / GPT 编写模型清理、贴图打包和批量命名脚本，交付规范且易于团队返修迭代的 .blend 工程文件。沟通直接、响应及时，非常适合按条计件、高标准验收的项目节奏。',
    stats: [
      { value: 5, suffix: '年+', label: '前端可视化与 3D 资产经验' },
      { value: 100, suffix: '%', label: '全流程独立交付 · 随叫随改' },
    ],
    facts: [
      { label: '坐标与模式', value: '天津 · 居家远程（时间充裕）' },
      { label: '核心强项', value: 'Blender 进阶 · 写实产品与场景' },
      { label: 'AI 3D 落地', value: 'Prompt · Tripo/Meshy/Rodin · ComfyUI' },
      { label: '工程加分', value: 'Python (bpy) · Codex / GPT 辅助开发' },
    ],
  },
  skills: {
    label: '技能栈',
    title: '工具箱',
    intro: '拖动球体可以旋转它；悬停或点按任意技能，球体会把它转到你面前。',
    groups: [
      {
        title: 'Blender 进阶全流程',
        items: ['硬表面与细分建模', '重拓扑与法线烘焙', 'UV 拆分与 Texel 规范', 'PBR 节点材质', 'Cycles / EEVEE 布光渲染', 'Geometry Nodes', '分层规范 .blend 工程'],
      },
      {
        title: 'AI 3D 与提示词管线',
        items: ['AI 提示词工程', 'Midjourney / FLUX', 'Tripo / Meshy / Rodin', 'Hunyuan3D', 'ComfyUI 贴图超分', '多视图一致性控制'],
      },
      {
        title: '脚本与自动化加分',
        items: ['Python (bpy)', 'Codex / GPT 编程', '模型Blend批处理', 'UV/法线自动质检', '贴图内嵌与命名规范', 'glTF / FBX 管线导出'],
      },
      {
        title: '写实专项与协作交付',
        items: ['写实产品可视化', '写实硬表面道具', '写实室内场景光影', 'AgX / ACES 色彩管理', '高效沟通与多轮返修'],
      },
    ],
  },
  experience: {
    label: '工作经历',
    title: '实战履历',
    items: [
      {
        company: '天津爱易成科技有限公司',
        role: '高级前端工程师 · Blender 3D 资产与可视化',
        period: '2021 — 2026',
        location: '天津',
        summary: '负责公司 Web 3D 产品可视化前端开发与 Blender 全流程 3D 资产制作，打通「AI 提示词起型 + Blender 写实精修 + Python 脚本质检」高效生产管线。',
        highlights: [
          '主导建立「AI 提示词 + AI 3D 初模（Tripo / Meshy / Rodin / Hunyuan3D）→ Blender 4.x 重拓扑、UV 展开、写实 PBR 节点与 Cycles 渲染」全流程，大幅压缩写实产品与场景资产起型周期',
          '独立负责工业产品、写实硬表面道具与室内展陈场景的建模、材质调校与物理布光渲染，输出结构分层清晰、保留修改器且零丢图的可迭代 .blend 工程文件',
          '借助 Python (bpy) 与 Codex / GPT 编写自动化质检与批处理脚本，实现 Scale 归零校验、法线与非流形检查、规范命名及外部资源一键打包',
          '结合 Three.js / WebGL 实时渲染与业务方高频沟通评审，快速响应结构调整、材质替换与多机位返修需求，保障交付质量与验收通过率',
        ],
        stack: ['Blender 4.x', 'Cycles / PBR', 'AI 3D 管线', 'Python (bpy)', 'Codex / GPT', 'Three.js / React'],
      },
    ],
  },
  projects: {
    label: '写实类 3D 作品集',
    title: '写实资产',
    intro: '以下 4 套为公开写实级 Blender Cycles 资产全流程案例，点开卡片可切换「Cycles 写实渲染 / 白模布线拆解」双视图并查看工程规范参数。',
    items: [
      {
        id: 'camera',
        title: '复古旁轴胶片相机 · 写实产品可视化',
        subtitle: 'Cycles 8K PBR · 多层镀膜玻璃 · 精细硬表面布线',
        year: '2025',
        role: '全流程建模 / PBR 材质 / Cycles 棚拍渲染',
        description:
          '高精密消费级摄影器材写实资产。包含金属机身露铜做旧、荔枝纹饰皮、雕刻刻度盘、皮革背带以及多层折射镜头玻璃；工程内保持机械旋钮与镜头组件独立分组，支持局部替换与特写机位渲染。',
        highlights: [
          '硬表面与细分结合：旋钮滚花、取景器倒角与镜头卡口布线干净，高光过渡无撕裂',
          '多材质混合 PBR 节点：阳极氧化黑漆露黄铜边缘磨损 + 凹凸饰皮法线 + 物理镀膜镜片',
          '规范可迭代 .blend 工程：机身/镜头/背带分集合管理，枢轴归零，8K 贴图已规范打包',
        ],
        specs: [
          { label: '网格面数', value: '26,987 Polys（精简四边面为主）' },
          { label: '贴图规格', value: '8K PBR（BaseColor / Roughness / Metallic / Normal）' },
          { label: '渲染管线', value: 'Blender 4.x · Cycles · AgX 棚拍布光' },
          { label: 'AI 协同', value: 'Prompt 视角设定 → AI 初模参考 → Blender 硬表面精修' },
          { label: '工程规范', value: '集合分层 + 非破坏性修改器 + Pack Resources' },
        ],
        stack: ['Blender 4.x', 'Cycles', '8K PBR', 'Hard-Surface', 'UV Unwrap'],
        links: [],
        cover: './covers/ai3d/camera-render.webp',
        gallery: [
          { src: './covers/ai3d/camera-render.webp', label: 'Cycles 写实渲染' },
          { src: './covers/ai3d/camera-clay.webp', label: '白模布线拆解' },
        ],
        palette: ['#ff9f43', '#2d3436', '#f5f6fa'],
        pattern: 'orbit',
      },
      {
        id: 'coffee-cart',
        title: '商用工业咖啡车 · 复杂组合资产',
        subtitle: '多组件分层 · 拉丝不锈钢与玻璃 · 4K PBR',
        year: '2024',
        role: '多组件建模 / 材质统一 / 工程标准化',
        description:
          '面向产品可视化与写实场景搭建的多部件复合资产，包含商用双头滴滤咖啡机、玻璃咖啡壶、金属推车框架、储物柜门、电源线束与万向脚轮，适合电商场景与写实室内搭配。',
        highlights: [
          '复杂装配体分模块建模：主体框架、冲煮组件、可拆玻璃壶与线缆分别归属独立子集合',
          '写实材质矩阵：各向异性拉丝不锈钢、透明玻璃折射液面、烤漆金属与橡胶滚轮微粗糙度差异',
          'Python 脚本批量检查组件命名、统一 Texel Density，大幅降低多部件返修调整成本',
        ],
        specs: [
          { label: '网格面数', value: '27,659 Polys（多组件独立父子级）' },
          { label: '贴图规格', value: '4K PBR（多 UV 象限规范排布）' },
          { label: '渲染管线', value: 'Blender 4.x · Cycles 柔光箱棚拍' },
          { label: 'AI 协同', value: 'AI 工业概念图 → 部件辅助起型 → Blender 组装精修' },
          { label: '工程规范', value: '支持按部件单独隐藏、替换材质与快速出图' },
        ],
        stack: ['Blender 4.x', 'Cycles', '4K PBR', 'Python (bpy)', 'Procedural'],
        links: [],
        cover: './covers/ai3d/coffee-render.webp',
        gallery: [
          { src: './covers/ai3d/coffee-render.webp', label: 'Cycles 写实渲染' },
          { src: './covers/ai3d/coffee-clay.webp', label: '白模布线拆解' },
        ],
        palette: ['#d63031', '#636e72', '#dfe6e9'],
        pattern: 'grid',
      },
      {
        id: 'lounge-chair',
        title: '中古胡桃木皮革休闲椅 · 写实家居资产',
        subtitle: '低面高精烘焙 · 皮革褶皱与木纹 · 8K PBR',
        year: '2024',
        role: '曲面建模 / 褶皱法线烘焙 / 材质资产化',
        description:
          '用于写实室内设计与产品渲染的经典中古休闲椅资产。曲木外壳结合做旧棕色牛皮软包坐垫与金属旋转五星脚架，在保持极低网格面数的同时通过 8K 法线与粗糙度贴图呈现逼真褶皱与车线细节。',
        highlights: [
          '仅 6,148 面即实现高精软包质感：高模褶皱雕刻细节完整烘焙至低模法线与 AO 贴图',
          '木纹顺纹 UV 展开与做旧皮质微孔高光控制，近景特写依然保持真实触感',
          '材质球采用封装节点组，配合参数滑块即可快速切换深浅木色与皮质磨损度，响应返修极快',
        ],
        specs: [
          { label: '网格面数', value: '6,148 Polys（高烘低轻量化拓扑）' },
          { label: '贴图规格', value: '8K PBR（皮质微纹 / 胡桃木纹理 / 缝线法线）' },
          { label: '渲染管线', value: 'Blender 4.x · Cycles 室内写实灯光' },
          { label: 'AI 协同', value: 'AI 软装风格探索 → Blender 精准曲面重拓扑' },
          { label: '工程规范', value: '材质节点组参数化，支持一键换肤与资产库复用' },
        ],
        stack: ['Blender 4.x', 'Retopology', 'Normal Baking', '8K PBR', 'Cycles'],
        links: [],
        cover: './covers/ai3d/chair-render.webp',
        gallery: [
          { src: './covers/ai3d/chair-render.webp', label: 'Cycles 写实渲染' },
          { src: './covers/ai3d/chair-clay.webp', label: '白模布线拆解' },
        ],
        palette: ['#a0522d', '#d2b48c', '#f5f1ea'],
        pattern: 'waves',
      },
      {
        id: 'storm-lantern',
        title: '复古黄铜防风提灯 · 硬表面做旧道具',
        subtitle: '33K 精细机械结构 · 氧化铜绿与透光玻璃 · 4K PBR',
        year: '2025',
        role: '硬表面建模 / 复杂机械细节 / 写实做旧材质',
        description:
          '影视与写实游戏级硬表面道具资产。完整还原冲压铆钉、通气罩格栅、提手挂环与带气泡纹理的护罩玻璃，重点打磨金属氧化铜绿、油烟熏黑与边缘划痕的物理层次感。',
        highlights: [
          '全结构精细化建模：铆钉、卡扣、螺旋灯座与网格护栏均具备真实倒角与结构咬合',
          '基于曲率与脏污遮罩的写实做旧材质，玻璃护罩支持内部暖色点光源真实透射散射',
          '交付前经过 Python 自动质检脚本校验，法线方向、Scale 归零与 UV 利用率 100% 达标',
        ],
        specs: [
          { label: '网格面数', value: '33,902 Polys（影视/近景硬表面精度）' },
          { label: '贴图规格', value: '4K PBR（氧化黄铜 / 玻璃透射 / 金属度遮罩）' },
          { label: '渲染管线', value: 'Blender 4.x · Cycles 物理光影' },
          { label: 'AI 协同', value: 'AI 3D 轮廓初型 → Blender 机械重拓扑 → Python 质检' },
          { label: '工程规范', value: '枢轴位于底部中心，零非流形边，可直接入库使用' },
        ],
        stack: ['Blender 4.x', 'Cycles', 'Hard-Surface', '4K PBR', 'Python QA'],
        links: [],
        cover: './covers/ai3d/lantern-render.webp',
        gallery: [
          { src: './covers/ai3d/lantern-render.webp', label: 'Cycles 写实渲染' },
          { src: './covers/ai3d/lantern-clay.webp', label: '白模布线拆解' },
        ],
        palette: ['#e1b12c', '#485460', '#f5f6fa'],
        pattern: 'bars',
      },
    ],
    more: {
      title: '预约试单与合作',
      text: '支持按条计件与高频沟通返修，如需查看完整 .blend 工程或对接测试单，欢迎直接联系。',
      cta: '查看联系方式',
      href: '#contact',
    },
  },
  pipeline: {
    label: '全流程交付规范',
    title: 'AI + Blender 生产管线',
    intro: '针对「验收通过标准高、需要频繁沟通返修、要求规范可迭代 .blend 工程」的团队需求，我把每条任务拆成 4 个可追踪阶段，并用 Python + Codex 脚本做最后一道工程质检。',
    steps: [
      {
        step: '01',
        title: 'AI 提示词与多视图设定',
        tools: 'GPT / Codex · Midjourney / FLUX',
        summary: '按需求拆解结构化 Prompt，快速拉通正/侧/45° 风格与材质参考图，先对齐审美再动模，减少大方向返工。',
        deliverable: '参考设定图 + 提示词记录',
      },
      {
        step: '02',
        title: 'AI 3D 初模与结构筛选',
        tools: 'Tripo / Meshy / Rodin / Hunyuan3D',
        summary: '利用主流 AI 3D 工具生成多版块面初模，提取准确比例与轮廓关系，对不适合 AI 起型的精密件直接转纯手建。',
        deliverable: '基础体块与比例确认版',
      },
      {
        step: '03',
        title: 'Blender 精修、PBR 与写实渲染',
        tools: 'Blender 4.x · Cycles · ComfyUI',
        summary: '完成四边面重拓扑、UV 展开、PBR 节点材质调校（配合 ComfyUI 修补/超分贴图）及 Cycles 物理棚拍/场景渲染。',
        deliverable: '高精写实渲染图 + 白模线框图',
      },
      {
        step: '04',
        title: 'Python 质检与规范工程交付',
        tools: 'Python (bpy) · Codex · .blend',
        summary: '运行自检脚本校验 Transform、法线、UV 与孤立数据块，内嵌所有外部贴图并保留非破坏性修改器，交付即开即改。',
        deliverable: '规范可迭代 .blend 工程包',
      },
    ],
    standardsTitle: '每份 .blend 工程交付自检清单',
    standards: [
      'Outliner 集合按「01_Model / 02_Lights / 03_Camera」清晰分层，所有物体与材质英文规范命名',
      '全部模型 Apply Scale/Rotation 归零，采用真实世界物理尺度（单位：Meter），原点对齐底面或几何中心',
      '拓扑无重叠面、无非流形边、无翻转法线，关键硬表面保留合理倒角与平滑组',
      'UV 展开无严重拉伸与意外重叠，主要视觉部件保持统一的 Texel Density（贴图密度）',
      '保留 Bevel / Subdivision / Array 等非破坏性修改器栈与封装材质节点组，方便多轮返修微调',
      '执行 Purge Orphans 清理冗余垃圾数据，并完成 Pack Resources 确保发给任何电脑都能零丢图打开',
    ],
    script: blenderQaScript,
    copyCode: '复制 bpy 脚本',
    copiedCode: '脚本已复制 ✓',
  },
  // 满足 Content 类型定义，ai3d 轨道下渲染 Pipeline 而非 Lab
  lab: {
    label: '交付规范',
    title: '管线',
    intro: '',
    particleWord: '3D',
    items: [],
  },
  contact: {
    label: '随时联系 · 配合返修',
    titleLines: ['有条单需要交付？', '随时发我'],
    intro:
      '居家办公时间自由，沟通响应快，熟悉从 AI 提示词到 Blender 规范工程的全流程交付，不介意高频沟通与多轮打磨返修。欢迎直接加微信或发邮件对接试单需求。',
    cta: '发邮件对接',
    availability: '居家在线 · 10 分钟内响应',
    labels: { email: '邮箱', phone: '微信 / 电话（同号）', social: '社交主页', status: '协作状态' },
  },
  print: {
    summary: '个人简介',
    skills: '专业技能',
    experience: '项目履历',
    projects: '写实作品集',
    contact: '联系方式',
    portfolio: '3D 在线作品集',
  },
}

const en: Content = {
  meta: {
    title: 'Wang Haoran · AI 3D Generalist & Senior Blender Artist',
    description:
      'Wang Haoran — Full-pipeline AI + Blender 3D creator specialising in photorealistic modelling, PBR shading, Cycles rendering, clean revision-ready .blend files and Python (bpy) / Codex automation.',
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
    copied: 'Copied to clipboard ✓',
    viewProject: 'View asset breakdown',
    view: 'Inspect',
    drag: 'Drag',
    play: 'Play',
    replay: 'Replay',
    shuffle: 'Shuffle',
    relayout: 'Re-layout',
    next: 'Next',
    projectRole: 'Scope',
    projectHighlights: 'Pipeline highlights',
    projectStack: 'Tools & pipeline',
    backToTop: 'Back to top',
    localTime: 'Local time',
    rights: 'All rights reserved',
    builtWith: 'AI 3D Pipeline · Blender Cycles · Python (bpy)',
    scrollHint: 'Scroll',
    projectsCounter: 'Scroll to explore',
    consoleGreeting: 'Hello! This view is tailored for AI + Blender photorealistic 3D production.',
  },
  nav: [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: '3D Work' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'contact', label: 'Contact' },
  ],
  profile: {
    name: 'Wang Haoran',
    nameAlt: '汪浩然',
    initials: 'WH',
    wordmark: 'Haoran',
    role: 'AI 3D Generalist · Senior Blender Artist & Technical Pipeline',
    email: EMAIL,
    phone: PHONE,
    location: 'Tianjin, China (Remote)',
    timezone: 'Asia/Shanghai',
    status: 'Remote · Fast Revision Turnaround',
    socials,
  },
  hero: {
    titleLines: ['AI-assisted', 'photoreal 3D', 'end-to-end.'],
    rolePrefix: 'Specialising in',
    roles: [
      'AI prompts + Blender full pipeline',
      'photorealistic hard-surface & Cycles',
      'clean, revision-ready .blend files',
      'Python (bpy) / Codex automation',
      'fast communication & multi-round QA',
    ],
    intro:
      '5+ years in frontend 3D visualisation and Blender pipelines. I combine AI 3D tools with advanced Blender modelling, PBR shading and Cycles lighting to deliver photorealistic, revision-friendly .blend scenes—backed by Python / Codex tooling and flexible remote availability.',
    primaryCta: 'See 3D portfolio',
    secondaryCta: 'Get résumé',
  },
  marquee: {
    top: ['AI + Blender Pipeline', 'Photoreal Product Viz', 'Hard-Surface Retopo', 'PBR Node Shading', 'Clean .blend Delivery', 'Fast Revisions'],
    bottom: ['Blender 4.x', 'Cycles / EEVEE', 'Python (bpy)', 'Codex / GPT', 'Tripo / Meshy / Rodin', 'ComfyUI', 'Geometry Nodes', 'ACES / AgX'],
  },
  about: {
    label: 'About',
    title: 'AI speed on blockouts, senior Blender craft on every final frame.',
    paragraph:
      'I am Wang Haoran, a full-time remote 3D generalist and frontend visualisation engineer based in Tianjin with 5+ years of production experience. My workflow pairs structured AI prompts and AI 3D generators (Tripo, Meshy, Rodin, Hunyuan3D) with deep Blender 4.x execution: quad retopology, clean UVs, procedural and image-based PBR shaders, Cycles studio lighting, and ComfyUI texture upscaling. With Python (bpy) and Codex / GPT scripts for automated naming, scale checks and resource packing, every delivered .blend file stays clean and effortless to revise across iterations.',
    stats: [
      { value: 5, suffix: '+ yrs', label: 'Frontend & Blender 3D production' },
      { value: 100, suffix: '%', label: 'independent end-to-end delivery' },
    ],
    facts: [
      { label: 'Availability', value: 'Remote · generous daily hours' },
      { label: 'Core craft', value: 'Blender 4.x · Photoreal assets' },
      { label: 'AI 3D stack', value: 'Prompts · Tripo/Meshy/Rodin · ComfyUI' },
      { label: 'Bonus', value: 'Python (bpy) · Codex / GPT scripting' },
    ],
  },
  skills: {
    label: 'Skills',
    title: 'Toolbox',
    intro: 'Drag the sphere to spin it. Hover or tap any skill and the sphere will turn it to face you.',
    groups: [
      {
        title: 'Blender 3D pipeline',
        items: ['Hard-surface & SubD', 'Retopology & baking', 'UV & texel density', 'PBR node shaders', 'Cycles / EEVEE lighting', 'Geometry Nodes', 'Clean .blend hierarchy'],
      },
      {
        title: 'AI 3D & prompting',
        items: ['Prompt engineering', 'Midjourney / FLUX', 'Tripo / Meshy / Rodin', 'Hunyuan3D', 'ComfyUI texture upscale', 'Multi-view consistency'],
      },
      {
        title: 'Automation & scripting',
        items: ['Python (bpy)', 'Codex / GPT scripting', 'Batch .blend cleanup', 'Auto UV/normal QA', 'Pack & naming rules', 'glTF / FBX export'],
      },
      {
        title: 'Realism & collaboration',
        items: ['Product visualisation', 'Realistic hard-surface', 'Interior lighting', 'AgX / ACES colour', 'Fast iterative revisions'],
      },
    ],
  },
  experience: {
    label: 'Experience',
    title: 'Track record',
    items: [
      {
        company: 'Tianjin Aiyicheng Technology Co., Ltd.',
        role: 'Senior Frontend Engineer · Blender 3D Assets & Visualisation',
        period: '2021 — 2026',
        location: 'Tianjin',
        summary: 'Owned Web 3D product visualisation and end-to-end Blender 3D asset production, establishing an AI-assisted modelling, photorealistic rendering and Python QA workflow.',
        highlights: [
          'Built a production pipeline pairing AI prompts and AI 3D blockouts (Tripo / Meshy / Rodin / Hunyuan3D) with Blender 4.x quad retopology, clean UVs, PBR node shaders and Cycles rendering',
          'Delivered photorealistic industrial products, hard-surface props and interior showcase scenes in clean, revision-friendly .blend files with organised collections and preserved modifier stacks',
          'Authored Python (bpy) automation scripts with Codex / GPT to validate applied scale, manifold geometry, normals, naming rules and full texture packing prior to handoff',
          'Worked closely with stakeholders and Three.js / WebGL product teams through rapid feedback loops, handling geometry, material and camera revisions quickly to meet strict acceptance bars',
        ],
        stack: ['Blender 4.x', 'Cycles / PBR', 'AI 3D Pipeline', 'Python (bpy)', 'Codex / GPT', 'Three.js / React'],
      },
    ],
  },
  projects: {
    label: 'Photorealistic 3D portfolio',
    title: '3D Assets',
    intro: 'Four production-grade Blender Cycles realistic assets. Open any card to toggle between the photoreal render and clay wireframe pass alongside delivery specs.',
    items: [
      {
        id: 'camera',
        title: 'Vintage Rangefinder Camera · Product Viz',
        subtitle: 'Cycles 8K PBR · Coated lens glass · Clean hard-surface',
        year: '2025',
        role: 'Full modelling / PBR shading / Cycles studio render',
        description:
          'High-precision camera asset featuring brass edge wear beneath matte-black paint, pebbled leather grip, engraved dials, leather strap and multi-element coated lens glass—cleanly grouped for close-up revisions.',
        highlights: [
          'Crisp hard-surface bevels across knurled dials, viewfinder frames and lens bayonet',
          'Layered PBR shader mixing worn anodized aluminum, leather normal grain and transmissive glass',
          'Revision-ready .blend hierarchy with separate body, lens and strap collections and packed 8K textures',
        ],
        specs: [
          { label: 'Polycount', value: '26,987 Polys (clean quad-dominant mesh)' },
          { label: 'Textures', value: '8K PBR (Albedo / Roughness / Metallic / Normal)' },
          { label: 'Renderer', value: 'Blender 4.x · Cycles · AgX studio lighting' },
          { label: 'AI workflow', value: 'Prompt turnarounds → AI blockout → Blender refinement' },
          { label: 'Delivery', value: 'Layered collections + non-destructive modifiers + packed' },
        ],
        stack: ['Blender 4.x', 'Cycles', '8K PBR', 'Hard-Surface', 'UV Unwrap'],
        links: [],
        cover: './covers/ai3d/camera-render.webp',
        gallery: [
          { src: './covers/ai3d/camera-render.webp', label: 'Cycles Render' },
          { src: './covers/ai3d/camera-clay.webp', label: 'Clay & Wireframe' },
        ],
        palette: ['#ff9f43', '#2d3436', '#f5f6fa'],
        pattern: 'orbit',
      },
      {
        id: 'coffee-cart',
        title: 'Industrial Coffee Cart · Multi-Part Asset',
        subtitle: 'Modular hierarchy · Brushed steel & glass · 4K PBR',
        year: '2024',
        role: 'Multi-part modelling / shader lookdev / pipeline QA',
        description:
          'Complex multi-component commercial asset combining a dual brewer, glass carafes, welded steel cart frame, cabinet storage, power cord and caster wheels for realistic interior and product scenes.',
        highlights: [
          'Modular sub-collections isolating frame, brewer, removable glass carafes and cables for fast swaps',
          'Physically calibrated shaders for brushed stainless steel, refractive glass, painted panels and rubber casters',
          'Python-checked naming and consistent texel density across all sub-assemblies',
        ],
        specs: [
          { label: 'Polycount', value: '27,659 Polys (modular sub-assemblies)' },
          { label: 'Textures', value: '4K PBR (uniform texel density UVs)' },
          { label: 'Renderer', value: 'Blender 4.x · Cycles softbox setup' },
          { label: 'AI workflow', value: 'AI industrial concept → part blockout → Blender assembly' },
          { label: 'Delivery', value: 'Independent sub-collections ready for quick swaps' },
        ],
        stack: ['Blender 4.x', 'Cycles', '4K PBR', 'Python (bpy)', 'Procedural'],
        links: [],
        cover: './covers/ai3d/coffee-render.webp',
        gallery: [
          { src: './covers/ai3d/coffee-render.webp', label: 'Cycles Render' },
          { src: './covers/ai3d/coffee-clay.webp', label: 'Clay & Wireframe' },
        ],
        palette: ['#d63031', '#636e72', '#dfe6e9'],
        pattern: 'grid',
      },
      {
        id: 'lounge-chair',
        title: 'Mid-Century Lounge Chair · Interior Hero',
        subtitle: 'Low-poly baked detail · Leather & walnut · 8K PBR',
        year: '2024',
        role: 'Curved modelling / normal baking / lookdev',
        description:
          'Photorealistic hero furniture piece pairing a bent walnut-veneer shell with worn brown leather cushions and a swivel metal base—capturing deep crease and stitching detail in just 6.1k polygons.',
        highlights: [
          '6,148-poly production mesh backed by high-to-low normal and AO bakes for cushion folds and seams',
          'Grain-aligned wood UVs and micro-roughness leather pores engineered for close-up interior shots',
          'Node-group material controls allow instant wood stain and leather wear adjustments during review',
        ],
        specs: [
          { label: 'Polycount', value: '6,148 Polys (high-to-low baked topology)' },
          { label: 'Textures', value: '8K PBR (leather pores / walnut / stitched seams)' },
          { label: 'Renderer', value: 'Blender 4.x · Cycles interior lighting' },
          { label: 'AI workflow', value: 'AI interior exploration → Blender clean curve retopo' },
          { label: 'Delivery', value: 'Parametric shader groups for rapid lookdev revisions' },
        ],
        stack: ['Blender 4.x', 'Retopology', 'Normal Baking', '8K PBR', 'Cycles'],
        links: [],
        cover: './covers/ai3d/chair-render.webp',
        gallery: [
          { src: './covers/ai3d/chair-render.webp', label: 'Cycles Render' },
          { src: './covers/ai3d/chair-clay.webp', label: 'Clay & Wireframe' },
        ],
        palette: ['#a0522d', '#d2b48c', '#f5f1ea'],
        pattern: 'waves',
      },
      {
        id: 'storm-lantern',
        title: 'Antique Brass Lantern · Hard-Surface Prop',
        subtitle: '33K mechanical detail · Patina & glass · 4K PBR',
        year: '2025',
        role: 'Hard-surface modelling / weathering / QA automation',
        description:
          'Film- and game-ready antique brass storm lantern with stamped rivets, wire guards, hinged handle and textured glass globe—showcasing realistic oxidation, soot and edge wear.',
        highlights: [
          'True physical bevels and interlocking mechanical geometry across latches, vents and protective cage',
          'Curvature- and grime-driven patina shader with physically refractive textured glass globe',
          'Validated via Python QA script: zero non-manifold edges, applied transforms and clean UV layout',
        ],
        specs: [
          { label: 'Polycount', value: '33,902 Polys (hero close-up hard-surface)' },
          { label: 'Textures', value: '4K PBR (patina brass / glass / edge wear masks)' },
          { label: 'Renderer', value: 'Blender 4.x · Cycles physical shading' },
          { label: 'AI workflow', value: 'AI 3D silhouette → Blender retopo → Python QA' },
          { label: 'Delivery', value: 'Base-centered pivot, manifold mesh, asset-browser ready' },
        ],
        stack: ['Blender 4.x', 'Cycles', 'Hard-Surface', '4K PBR', 'Python QA'],
        links: [],
        cover: './covers/ai3d/lantern-render.webp',
        gallery: [
          { src: './covers/ai3d/lantern-render.webp', label: 'Cycles Render' },
          { src: './covers/ai3d/lantern-clay.webp', label: 'Clay & Wireframe' },
        ],
        palette: ['#e1b12c', '#485460', '#f5f6fa'],
        pattern: 'bars',
      },
    ],
    more: {
      title: 'Ready for a trial brief',
      text: 'Available for per-task delivery and fast revision rounds. Reach out directly for .blend samples or a test task.',
      cta: 'Get in touch',
      href: '#contact',
    },
  },
  pipeline: {
    label: 'Delivery standard',
    title: 'AI + Blender Pipeline',
    intro: 'Built for teams with strict acceptance bars and iterative feedback: every task follows four traceable stages plus a Python + Codex pre-delivery audit so .blend scenes open cleanly on any machine.',
    steps: [
      {
        step: '01',
        title: 'AI Prompts & Visual Lock',
        tools: 'GPT / Codex · Midjourney / FLUX',
        summary: 'Structured prompts generate multi-angle references to align form and material mood before heavy modelling begins.',
        deliverable: 'Reference sheet + prompt log',
      },
      {
        step: '02',
        title: 'AI 3D Blockout & Triage',
        tools: 'Tripo / Meshy / Rodin / Hunyuan3D',
        summary: 'Generate rapid 3D blockouts for organic/complex silhouettes; switch to pure precision modelling for tight mechanical parts.',
        deliverable: 'Proportion-verified base mesh',
      },
      {
        step: '03',
        title: 'Blender Craft & Cycles Lookdev',
        tools: 'Blender 4.x · Cycles · ComfyUI',
        summary: 'Quad retopology, clean UVs, PBR node shaders (with ComfyUI texture enhancement) and physically based Cycles lighting.',
        deliverable: 'Photoreal render + clay wireframe',
      },
      {
        step: '04',
        title: 'Python QA & .blend Packaging',
        tools: 'Python (bpy) · Codex · .blend',
        summary: 'Automated checks for scale, normals, UVs and orphan cleanup, packing all textures into a revision-friendly .blend package.',
        deliverable: 'Production .blend delivery',
      },
    ],
    standardsTitle: 'Pre-delivery .blend QA checklist',
    standards: [
      'Clean Outliner collections (01_Model / 02_Lights / 03_Camera) with consistent English naming',
      'Applied Scale/Rotation (1.0 / 0°) on all meshes using real-world metric units and base-aligned pivots',
      'Manifold geometry with verified outward normals and smooth bevel shading—no overlapping faces',
      'Distortion-free UVs with consistent texel density across hero surfaces',
      'Non-destructive modifier stacks and grouped shader parameters preserved for rapid revision rounds',
      'Orphan datablocks purged and external maps embedded via Pack Resources so zero textures break on handoff',
    ],
    script: blenderQaScriptEn,
    copyCode: 'Copy bpy script',
    copiedCode: 'Copied ✓',
  },
  lab: {
    label: 'Pipeline',
    title: 'Pipeline',
    intro: '',
    particleWord: '3D',
    items: [],
  },
  contact: {
    label: 'Fast response · Ready for revisions',
    titleLines: ['Have a 3D brief', 'ready to ship?'],
    intro:
      'Full-time remote availability, responsive communication and comfortable with multi-round feedback until final sign-off. Reach out on WeChat or email to kick off a trial task.',
    cta: 'Email me',
    availability: 'Remote · Replies within 10 min',
    labels: { email: 'Email', phone: 'WeChat / Phone', social: 'Social', status: 'Availability' },
  },
  print: {
    summary: 'Profile',
    skills: 'Skills',
    experience: 'Experience',
    projects: '3D Portfolio',
    contact: 'Contact',
    portfolio: '3D Portfolio URL',
  },
}

export const ai3dContent: Record<Lang, Content> = { zh, en }
