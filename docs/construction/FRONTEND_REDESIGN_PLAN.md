# Public Web Apple UI 重设计施工计划

## 1. 状态与授权边界

本文是 `frontend/visual-optimization` 分支的公共前台替换式重设计契约。Neil Bauman 已授权推翻旧前端方案并改为 Apple 风格 UI，但最新指令要求先写文档、汇报、再等待明确继续。因此：

- 当前状态：设计与施工计划已确定，真实 UI 施工尚未开始。
- 开工口令：Neil Bauman 后续明确要求继续施工。
- 本轮禁止：修改 `src/app`、安装依赖、生成正式品牌资产、重启预览、改变后端或服务器。
- 后续每个可交付阶段均执行独立的开工计划、远端备份、实现、测试、漂移检查、LOG、DEV_PROGRESS、层进度、HANDOFF、提交和 push 闭环，并在阶段结束后停下汇报。

## 2. Design Read

Reading this as: a replacement redesign of a Chinese Skill discovery marketplace for design-conscious Agent users, with Apple's editorial product-catalog language and fluid spatial behavior, leaning toward a native CSS token system, system Chinese UI type, restrained translucent chrome, and authored Skill artwork.

- `DESIGN_VARIANCE: 7`：允许编辑式非对称、不同卡片比例和更强的首屏构图，但保持严格网格和可预测阅读顺序。
- `MOTION_INTENSITY: 5`：保留空间连续性和物理反馈，避免目录浏览、键盘操作和高频控制被动画拖慢。
- `VISUAL_DENSITY: 5`：首屏快速出现 Skill 内容，信息完整但不堆成后台表格。

选定方向为 **Spatial Skill Gallery**。这是 Apple 的设计原则与网页能力的翻译，不是对 Apple 网站、App Store 或 visionOS 的像素复刻。

## 3. 现状审计

### 已检查的实现

- `src/app/page.tsx`
- `src/app/skills/[slug]/page.tsx`
- `src/app/recommend/page.tsx`
- `src/app/_components/skill-actions.tsx`
- `src/app/_components/analytics-events.tsx`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `package.json`

### 尚未完成的视觉证据

浏览器控制运行时没有可用浏览器实例，因此本轮未取得渲染截图、计算样式或真实断点证据。下面的审计来自源代码，不冒充截图审计。正式实现前必须先恢复浏览器能力，至少捕获首页、一个 Skill 详情和推荐表单的桌面与移动基线。

### 保留

- Skill 主导的产品信息架构：首页发现、详情解释、下载/安装双操作、推荐线索。
- 五个固定主分类、搜索与标签筛选、整卡可点击、首页无直接下载。
- 详情页信息顺序和来源透明度。
- 现有领域、安装、下载、分析、Repository、认证和 API 边界。
- 文字品牌及未来品牌资产可替换约定。
- 现有服务端数据读取、事件上报和安全门禁。

### 退役

- 暖米色纸张、Georgia/宋体混排作为“精品感”的主要手段。
- CSS blob、竖排装饰文字、序号和假封面构图。
- 重复 eyebrow、机械全大写标签和大量装饰性元信息。
- 每张卡片同一种边框、圆角、悬浮阴影和向上位移。
- 三等分案例卡片、泛化胶囊、无差别玻璃效果和纯装饰渐变。
- 详情页将图片集模拟成文字块而非可信视觉素材的做法。

### 不改变

- URL、slug、查询参数、下载和安装行为。
- 管理员后台视觉与管理流程，本轮不设计后台。
- 数据库 schema、对象存储、部署、服务器、认证、统计定义和普通用户权限。
- 正式 Logo、吉祥物和社交分享图仍由团队后续提供。

## 4. 页面策略

### 首页 `/`：Experience

- 采用紧凑公共导航和编辑式首屏，不使用大型搜索 Hero。
- 首屏由一条简短价值主张、一个主推 Skill 视觉区和紧随其后的目录内容构成。
- 大屏使用非对称 Skill 版面，避免三张等宽卡；中小屏按语义顺序收束。
- 分类与筛选保持为紧凑控制，不把技术标签变成主要视觉装饰。
- 目录卡片由真实或明确来源的 Skill 封面、中文标题、解释、作者和轻量分类信息组成；阅读量降级显示。

### Skill 详情 `/skills/[slug]`：Read + Operate

- 中文标题和原始名称形成一个清晰标题组，来源和兼容信息保持可见但不压过封面。
- 主封面和真实效果图承担视觉叙事；不再使用 CSS 伪效果图。
- 下载与安装形成稳定操作区，在桌面可保持可达，在移动端收敛为不遮挡内容的底部操作面或顺序操作块。
- 长文内容使用更好的行宽、节奏、分组和渐进披露；案例仍是辅助证明。
- 来源信息不是装饰边栏，而是明确的信任模块。

### 推荐页 `/recommend`：Operate

- 单一任务、单一表单、清晰提交后状态。
- 去除宣传式大标题和重复装饰标签，保留“只收线索、不自动发布”的关键信任说明。
- 字段、错误、禁用、成功和键盘顺序必须可见且稳定。

### 共享公共外壳

- 轻量、可回退的材质导航；文字品牌不伪装成正式 Logo。
- 搜索扩展必须从触发器起点展开，关闭时空间对称返回。
- 移动导航使用可达的 sheet 或紧凑布局，不仅隐藏桌面导航。
- 页脚保持品牌、来源和服务边界，不扩展为站点地图堆栈。

## 5. 视觉系统实施规则

- 根设计契约：`DESIGN.md`；当前为 seed，真实实现后必须重跑扫描式设计系统提取并补充规范 token。
- UI 强调色只有 Catnip mint；内容图片可有独立色彩，但不变成控件主题。
- 使用系统 UI 与中文无衬线字体栈，不下载或伪装 Apple 专有字体。
- 统一页面背景、文本、次级文本、分隔和交互状态；提供系统浅色和深色方案，单页不做主题拼贴。
- 只在导航、展开搜索、移动 sheet 或详情操作 dock 使用有限材质；普通卡片以内容和图像构成深度。
- 建立可解释的间距、圆角、层级和内容宽度 token；嵌套半径逐级缩小。
- 正式 Skill 封面必须是有来源的图像或由管理员确认的创作资产。设计探索可生成非品牌 Skill artwork，不得生成正式 Logo 或吉祥物。
- 图标应使用一致的线性或填充体系。引入图标库前必须经过 `pick-ui-library` 审核，不手写不一致 SVG。

## 6. 动效语法

### 原则

1. 先判断频率和目的，再决定是否动画。
2. 直接操作需要 pointer-down 即时反馈；可拖拽对象保持一比一跟随并可中断。
3. 进入从触发器或目的关系出发，退出反向返回；不从任意方向飞入。
4. 预定微交互优先 CSS 或 WAAPI；只有手势、速度传递或可中断弹簧确有价值时才评估动效库。
5. transform 和 opacity 是主要动画属性；避免布局抖动和主线程重绘。

### 计划动作

- 卡片：精细 hover 高亮，pointer-down 轻微缩放，键盘 focus 无位移动画。
- 筛选：选择状态和结果重排用短 ease-out；快速连续切换可被打断。
- 搜索：从入口扩大并回到入口，焦点管理与 Esc 关闭同步。
- 详情：在浏览器和 Next.js 路由能力验证通过后，尝试渐进增强的封面连续过渡；无支持时直接导航或短交叉淡化。
- 操作区：复制成功、下载状态和 Agent/范围切换提供局部反馈，不播放整页庆祝动画。
- 移动 sheet：若允许拖拽，使用速度交接、投影和受约束 rubber-banding；否则使用短 CSS 进入退出。

### 时间与降级

- 高频 UI 反馈目标小于约 300ms；进入退出使用快起慢停的 ease-out。
- 不使用 `scale(0)`、长弹跳、非中断序列、整页 blur 动画或每个文字元素的入场动画。
- `prefers-reduced-motion` 下移除空间位移和弹簧，保留必要的即时状态或短交叉淡化。
- `prefers-reduced-transparency` 或不支持 blur 时改用足够不透明的实体表面。

## 7. 实施阶段与停点

### Stage A：视觉基线与资产清单

- 恢复可用浏览器，捕获桌面、平板、移动首页/详情/推荐页截图。
- 记录内容溢出、布局、焦点、对比度、实际封面资产和当前性能基线。
- 清点哪些 Demo 封面只能作为占位，哪些可获得合法来源的真实图像。
- 输出证据后停止汇报，不改生产 UI。

### Stage B：视觉世界原型

- 在隔离原型路由或静态构图中表达 Spatial Skill Gallery 的首页首屏、卡片、详情头部和操作区。
- 使用真实现有文案和尽可能真实的 Skill 图片，不使用假 dashboard 或通用 blob。
- 由 Neil Bauman 在局域网桌面与移动设备确认方向后，才进入生产路由。

### Stage C：设计 token 与公共外壳

- 落地主题、字体、颜色、间距、形状、focus、reduced-motion 和 reduced-transparency 基线。
- 重做文字品牌、导航、搜索入口、移动导航和页脚。
- 不触碰首页目录和详情内容结构之外的领域逻辑。

### Stage D：首页

- 实现编辑式首屏、分类筛选、Skill 目录、空结果和响应式。
- 保持 query 参数、搜索与推荐逻辑，删除旧 CSS 假封面和装饰序号。
- 阶段完成后停下让 Neil Bauman 在局域网确认。

### Stage E：详情与动作

- 实现真实图像层级、阅读排版、来源模块、相关 Skill 和操作区。
- 保持安装命令、ZIP、事件与权限行为原样；只调整呈现和交互外壳。
- 阶段完成后停下让 Neil Bauman 在局域网确认。

### Stage F：推荐表单与公共一致性

- 完成表单状态、错误、成功、移动键盘和公共外壳一致性。
- 统一所有公共路由，不修改管理员后台。

### Stage G：动效、无障碍、性能与设计系统固化

- 使用 `find-animation-opportunities` 只读审计应动画与不应动画处，再按需实现。
- 使用 `review-animations` 复核动作；记录 exact motion values 和 reduced-motion 对应关系。
- 在真实代码落地后以扫描模式更新 `DESIGN.md`，写入已实现 token；如适用再生成 `.impeccable/design.json`。
- 完成全量回归和局域网真机验收后停止汇报。

## 8. 依赖策略

- 默认不新增 UI 或动效依赖。CSS、原生 View Transitions 和 WAAPI 能完成的交互保持原生。
- 若共享布局、手势弹簧或可中断动画无法用原生能力可靠实现，先调用 `pick-ui-library` 比较方案、包体、React 19/Next.js 16 兼容性、维护状态和 reduced-motion 支持。
- 不引入 GSAP、Three.js、完整组件套件或复杂状态库来完成装饰性需求。
- 所有依赖变更必须单独记录、测试和说明移除路径。

## 9. 测试与验收

### 自动回归

- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run db:check`
- `git diff --check`

### 浏览器视觉门禁

- 至少 1440px 桌面、768px 平板和 390px 移动视口。
- 首页、一个单项 Skill、一个 Skill Pack、推荐表单、搜索/筛选空结果。
- 浅色、深色、200% 缩放、长中文标题、长英文原名和图片加载失败。
- 键盘 Tab 顺序、focus-visible、Esc、Enter/Space、表单错误和成功反馈。
- `prefers-reduced-motion`、减少透明度降级、hover 不可用的触摸设备。
- 不出现横向滚动、内容遮挡、布局跳动、闪烁、不可读玻璃、错误 DOM 顺序或只能 hover 才显示的信息。

### 性能门禁

- 首屏图片使用真实尺寸、响应式来源和懒加载策略；首要封面避免被错误延迟。
- 动画只改变 transform/opacity 或经过证明的低成本属性。
- 限制同时 backdrop-filter 层数；低端设备和不支持环境有实体背景。
- 记录改造前后 Core Web Vitals 或等价浏览器性能证据；不得用主观“更顺滑”代替测量。

### 产品与漂移门禁

- Skill 仍是主角，案例不提升为首页主线。
- 首页尽快显示内容，无大型搜索 Hero，无直接下载按钮。
- 下载、安装、来源、权限、事件和 URL 行为不变。
- 管理员始终是 Neil Bauman；品牌始终是 Catnip 薄荷猫；Remote 不变。
- 无正式 Logo、吉祥物、网络猫图、真实秘密或服务器写操作。
- 计划与实际若不一致，先修正文档并复测，再提交。

## 10. Git 与回滚

- 每个 Stage 从当时干净的 `frontend/visual-optimization` 基线创建唯一 `backup/pre-apple-ui-<stage>-<yyyymmdd-hhmm>` 并成功 push。
- 明确暂存本阶段文件，不使用 `git add .`，不纳入用户未跟踪的 `.agents/`、`.codex/` 或 `skills-lock.json`。
- 阶段提交应保持可独立 revert；优先 `git revert <bad-commit>` 回滚。
- 发生失败测试且短期无法修复时，停止扩展，不 push 可用标签；若必须保留现场，使用明确标记的 `wip/failing-...` 分支。
- 回滚后至少复测 unit、lint、typecheck、build、db:check 和受影响公共路由的浏览器门禁。

## 11. 当前真实风险

- 当前没有渲染截图基线，源代码审计不能证明真实视觉与响应式表现。
- 十条目录数据主要是演示内容，真实封面和来源资产不足会直接限制图片驱动设计的可信度。
- View Transitions、blur 材质和手势方案需要验证浏览器支持、Next.js 路由行为和低性能设备表现。
- 现有 `globals.css` 同时承载公共页与管理员页；直接整体重写可能误伤后台，施工时必须拆分或严格限定公共作用域。
- 热更新入口使用进程内数据，稳定容器入口使用 PostgreSQL/S3；视觉验收必须标明使用哪个入口，不能把两者状态混为一谈。
- 局域网预览为明文 HTTP，管理员真实凭据继续禁止启用。
- 服务器部署风险尚未解决且与本重设计无关，不能借前端施工恢复服务器写操作。
