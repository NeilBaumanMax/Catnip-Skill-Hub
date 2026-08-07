# 07 Deployment 进度

本文件按时间追加部署层记录，不覆盖历史。

## 2026-08-07 16:42 CST / 无域名管理员私网入口 / 开工计划

- 域名 DNS 暂不可改，不启用公网 HTTP 管理登录；采用 SSH local forwarding 让 Neil 的本机 `localhost` 访问服务器 loopback Caddy。
- 公网 nginx 明确隐藏 `/admin`、`/api/admin`；随机密码只存 macOS 钥匙串，服务器只接收哈希，管理员环境文件保持仓库外 `0600`。
- 先建立远端 Git 备份和 nginx 配置备份，再配置、测试、reload；最终同时验证公网公共站、管理路径不可达、隧道登录/授权/退出和现有数据健康。

## 2026-08-07 03:20 CST / 首次腾讯云服务器部署 / 完成记录

- 部署收尾文档提交 `16c2b0d` 已成功 push；本条最终 Git 状态回写后再次 push，生产代码继续为 `9793173`。

- 公网 `http://118.195.247.102` 已上线：宿主 nginx 80 回源 `127.0.0.1:18080` 的 Compose Caddy；PostgreSQL、SeaweedFS 与 app 无宿主端口，旧 3000/4000 已停止。
- Docker Engine 29.7.2、Buildx 0.36.1、Compose 5.4.0 与 2 GiB Swap 已安装；生产代码发布 `9793173`，环境文件在仓库外且为 `0600`，管理员保持禁用。
- 服务器无法访问 Docker Hub 时使用本地干净 worktree 构建并离线导入六个 amd64 目标；Node Alpine pin 与代理同源判断的中间问题均有提交和复测。
- 有效备份 `20260807-030544` 通过校验和、隔离恢复（5 张表、120 个对象文件）与整栈停机重启；失败备份 `20260807-030452` 已明确标记不可用。
- 57/57、lint 0 error、typecheck、db:check、生产构建、audit 0、公共路由、同源边界与 16 张公网截图通过。截图验收：通过（自动验收）。
- 当前仍缺域名、HTTPS、管理员生产入口、异机/自动备份、监控；UFW inactive，122 个更新待独立维护。旧 `catnip-intro` 工作区保留，不做删除清理。

## 2026-08-07 02:41 CST / 首次腾讯云服务器部署 / 开工计划

- Neil Bauman 已确认系统盘快照完成并授权淘汰旧站；先保留旧工作区，只在新站 loopback 验收和 nginx 80 切换成功后停止旧进程。
- 开工基线 `58ad0e30247a2bad50275de093c0f79042f4a8c5`；计划远端备份 `backup/pre-first-server-deployment-20260807-0241`。
- 施工包括受控 Swap、Docker 官方仓库、提交归档发布、受限秘密、amd64 Compose 构建、持久化/健康验证、nginx 可回滚切换和首份服务器备份。
- 管理员保持禁用；不开放 PostgreSQL、S3、app 或 Caddy 18080 公网端口，不修改 SSH、域名、DNS 或 HTTPS。

## 2026-08-07 CST / 服务器部署恢复准备 / Git 回写

- 实现提交 `e12dd64` 已成功 push 到 `origin/deployment/tencent-cloud-ubuntu-22-04-prep`；备份 `backup/pre-server-deployment-readiness-20260807` 已保留。
- 当前停在快照门禁前，服务器未发生写操作。

## 2026-08-07 CST / 服务器部署恢复准备 / 完成记录

- 多架构 SeaweedFS 已落地，amd64 4.29 镜像完成 checksum、镜像架构和容器版本实测。
- 服务器 Compose 候选入口固定为 `127.0.0.1:18080`；未来宿主 nginx 独立 8080 回源示例已提供，数据库/S3/app 无宿主端口。
- Next.js/ESLint 配套升级至 16.3.0；production audit 0 vulnerabilities；57/57、lint 0 error、typecheck、db:check、build、Compose 和 shell 门禁通过。
- 服务器只读复核成功：Ubuntu 22.04.5、x86_64、2 CPU、3.6 GiB、无 Swap、40 GiB 可用、Docker 未安装、nginx 配置有效、UFW inactive、121 个升级、无待重启；80/3000/4000 与旧站未提交资产保持原状。
- 本轮服务器零写操作。下一硬门禁是 Neil Bauman 在腾讯云控制台创建并确认系统盘快照；完成前不安装 Docker、不修改 nginx/安全组/防火墙。

## 2026-08-07 CST / 服务器部署恢复准备 / 开工计划

- Neil Bauman 已明确表示准备开始服务器部署；本轮先完成本地可交付准备和只读预检，不执行服务器写操作。
- 目标为 Ubuntu 22.04 x86_64、2 vCPU、约 4 GiB 内存的腾讯云实例；既有 nginx/80、Next.js/3000、Go/4000 与 `/home/ubuntu/catnip-intro` 保持不变。
- 计划消除 SeaweedFS arm64 硬编码，验证 amd64 构建；建立只读主机预检；把未来 Catnip 容器入口固定为 `127.0.0.1:18080`，由宿主 nginx 独立 8080 配置回源。
- 开工前提交为 `05200bc7e5d5f3d1c1536ef375c41fabf52e6371`；计划远端备份为 `backup/pre-server-deployment-readiness-20260807`。
- 未创建系统盘快照或经确认的异机恢复点前，不安装 Docker、不修改 nginx/安全组/防火墙、不启用生产管理员、不触碰旧站。

## 2026-08-03 21:02 CST / 腾讯云 Ubuntu 22.04 部署准备分支 / 最终 Git 回写

- `801ced3ff208ff9c713eac014742883f2dc978eb` 已 push 到同名 origin 分支；本条状态回写提交后再次 push。

## 2026-08-03 21:00 CST / 腾讯云 Ubuntu 22.04 部署准备分支 / 完成记录

- 当前分支：`deployment/tencent-cloud-ubuntu-22-04-prep`，已跟踪 `origin/deployment/tencent-cloud-ubuntu-22-04-prep`。
- 开工计划基线：`e608d0f`；远端备份：`backup/pre-tencent-ubuntu22-deployment-prep-20260803-2057`。
- 本轮只建立 Git 准备入口，未连接或修改腾讯云 Ubuntu 22.04 服务器，不代表部署已开始。
- 后续第一步应重新读取 `docs/deployment/SERVER_DEPLOYMENT.md`，执行只读系统、架构、资源、端口、进程、旧站、备份与回滚核验；写施工必须另获明确授权。

## 2026-08-03 20:57 CST / 腾讯云 Ubuntu 22.04 部署准备分支 / 开工计划

### 本轮目标

- 从 `main` 创建 `deployment/tencent-cloud-ubuntu-22-04-prep`，为腾讯云 Ubuntu 22.04 后续部署准备建立独立、可回滚、远端可见的施工入口。
- 本轮只做 Git 与文档准备；不把“创建分支”写成服务器环境已验收或部署已开始。

### 安全边界

- 开发前基线：`cde94fe98111cd71ed6ed4bb341a2bf83423bbf9`。
- 计划备份：`backup/pre-tencent-ubuntu22-deployment-prep-20260803-2057`。
- 历史 `backend-server-deployment`、`main` 和全部旧备份保留。
- 禁止连接后直接写服务器，禁止触碰既有 `catnip-intro`；Docker、nginx、端口、DNS、HTTPS、防火墙、生产秘密和数据迁移均不在本轮范围。

### 验证计划

- 核验目标分支和备份远端引用、upstream、HEAD、分歧与工作区保护状态。
- 本轮没有代码或运行配置修改，因此不执行也不虚报 unit、lint、typecheck、build、Compose 或服务器验收。

## 2026-07-27 / 基线

- 状态：未开始。
- 对应路线：Phase 7。
- 边界：数据库、迁移、容器、对象存储、代理、HTTPS、备份与安全验收。

## 2026-07-29 09:13 CST / Phase 7 / 本地部署开工计划

### 当前目标

完成可重复、可回滚、可测试的本地生产式部署：Docker Desktop 验收、PostgreSQL/Drizzle 持久化、S3 兼容存储、Compose、迁移、本地反向代理、备份恢复和安全检查。真实服务器、域名与公网 HTTPS 等目标信息明确后再继续同一 Phase。

### 计划改动

- 以现有 Repository/Storage 端口为边界增加 PostgreSQL 与 S3 兼容适配器。
- 增加版本化 schema/迁移、运行时配置、生产镜像和 Compose 编排。
- 增加本地反向代理、健康检查、持久卷、非 root 运行及秘密占位。
- 增加数据库/对象存储备份恢复与本地部署运行手册。
- 不把真实秘密写入仓库，不在缺少服务器目标时执行公网部署或声称 HTTPS 已完成。

### 验收指标

- Docker Engine、Compose 和官方测试容器可用；首次 CDN EOF 及修复复测有记录。
- 既有单元测试、lint、typecheck、生产构建全部通过。
- 数据库迁移可从空库执行，Repository/统计持久化有集成测试。
- 对象文件可写、读、列、删并在服务重启后保留。
- Compose 配置有效，所有服务健康，本地反向代理可访问应用。
- 数据库和对象数据完成一次真实备份与恢复演练；不删除持久卷作为测试捷径。

## 2026-07-29 11:12 CST / Phase 7 / 本地部署完成记录

### 实际改动

- PostgreSQL/Drizzle 持久化、版本化迁移、S3 兼容存储和运行时适配已经落地。
- Compose 建立数据库、对象存储、一次性迁移、应用、集成测试和 Caddy 服务；数据网络内部隔离，仅 Caddy 绑定本机回环端口。
- 构建使用本地 Alpine 3.23 与固定包/校验产物，保留 Docker 默认 containerd；所有部署文件均进入镜像，不使用项目目录 bind mount。
- 本地秘密生成、健康检查、备份、显式恢复和两份部署手册已经建立。

### 验收结果

- 42/42 单元测试和 1/1 Compose 持久化集成测试通过。
- 数据库迁移成功；PostgreSQL、SeaweedFS 与 app 健康检查通过，Caddy 正常运行且代理首页与健康接口返回 200，健康接口报告 `postgres-s3`。
- 数据服务无宿主端口；应用、代理、对象存储和数据库均以非 root 身份运行。
- `backups/20260729-105916/` 完整备份成功；数据库与对象卷均在隔离目标完成恢复验证；重启后十条 Skill 保留。

### 未完成与停点

- 服务器地址、域名、DNS、证书、防火墙、生产秘密、异机备份和监控尚未提供或实施。
- 当前停止在 Phase 7 本地与服务器里程碑之间，等待 Neil Bauman 明确继续。

## 2026-07-29 14:00 CST / Phase 7 / 局域网访问开工计划

### 当前目标

将已验收的本地栈安全开放到本机当前私网地址 `192.168.120.107:8080`，让同一局域网设备访问公开站点；管理员保持禁用，公网服务器部署不开始。

### 计划改动

- 默认继续绑定 `127.0.0.1`，通过受验证的显式配置选择一个 RFC1918 IPv4，不监听 `0.0.0.0`。
- 增加绑定地址切换/回退工具，不读取输出或提交 `.env.local` 中的秘密。
- 补充局域网运行手册、安全边界、门禁和交接记录。

### 验收指标

- Caddy 只监听 `192.168.120.107:8080`，其他数据服务仍无宿主端口。
- 私网 URL 的健康接口返回 `postgres-s3`，首页 200 且安全响应头正常。
- 非私网、组播、全网卡、IPv6 和恶意输入被配置工具拒绝；回环恢复路径实测。
- 既有单元、lint、typecheck、build、db:check、Compose 与持久化基线不回归。

## 2026-07-29 14:09 CST / Phase 7 / 局域网访问完成记录

### 实际改动

- Compose 端口绑定支持显式 `CATNIP_BIND_ADDRESS`，缺省保持回环。
- 新增安全绑定工具、3项自动化测试、Caddy 健康检查、`--wait` 切换流程和局域网运行说明。
- 当前本机 `.env.local` 已安全设置为 `192.168.120.107`，文件仍为 `0600` 且被 Git 忽略。

### 验收结果

- `0.0.0.0` 实际调用被拒绝；管理员邮箱/哈希配置保持为空。
- 回环模式与局域网模式双向切换实测成功；Caddy healthy 后再验收，两个地址不会同时监听。
- 当前只监听 `192.168.120.107:8080`；私网健康接口返回 `postgres-s3`，首页和安全头正常。
- 45/45 单元测试、lint、typecheck、db:check、生产 build、Compose config 和 1/1 持久化集成测试通过。

### 未完成与停点

- macOS 应用防火墙当前关闭；没有擅自修改系统防火墙。该入口只应在受信任局域网使用，不得设置路由器端口转发。
- 尚未从另一台物理设备完成浏览器人工验收；Neil Bauman 可在同一局域网访问 `http://192.168.120.107:8080`。
- 服务器、域名、HTTPS、异机备份、管理员生产秘密、监控和依赖精确审计仍待后续施工。

## 2026-07-29 22:33 CST / Phase 7 / 服务器部署暂缓与前端分支准备开工计划

### 当前目标

- 将服务器只读评估结果转化为可接力、可回滚的部署文档。
- 明确服务器部署暂停，不安装 Docker、不修改 nginx、不触碰现有独立站。
- 保持本地局域网预览可用，并在 main 文档收尾后建立独立前端优化分支。

### 计划改动

- 更新服务器部署手册、当前 Phase、架构事实、施工计划、日志、进度和交接。
- 记录直接 IP 的未来隔离端口方案、无快照风险、现有服务脆弱点、依赖漏洞与 amd64 镜像门禁。
- 完成 main 文档基线后创建并推送 `frontend/visual-optimization`；本轮不修改前端页面和样式。

### 验收指标

- 文档明确服务器部署已暂缓且无任何服务器写操作。
- 未来施工必须重新开工、备份并满足快照或经确认的替代回滚条件。
- unit、lint、typecheck、build、db:check、Compose 配置与局域网健康检查成功。
- main 文档提交成功 push，前端分支从该提交创建并成功 push，工作区干净。

## 2026-07-29 22:43 CST / Phase 7 / 服务器部署暂缓与前端分支准备完成记录

### 实际改动

- 服务器部署手册已记录目标主机、既有站点、无快照、依赖、架构、网络、恢复和直接 IP 共存方案。
- 当前规范明确暂停一切服务器写操作；未来恢复必须重新开工并满足独立回滚门禁。
- 测试指标增加专用前端分支及局域网可见修改验收边界。

### 验收结果

- 45/45 单元测试、lint、typecheck、db:check、获准生产 build 和带本机环境文件的 Compose config 成功。
- 全部长期 Compose 服务 healthy；局域网健康接口和首页继续成功。
- 首次构建、Compose 环境文件和 Docker socket 失败均已保留，并以正确权限/命令复测。

### 停点

- 服务器部署暂停；没有服务器写操作或配置漂移。
- main 文档提交与 push 后建立 `frontend/visual-optimization`，不在本轮先行设计或修改视觉。

## 2026-07-31 13:40 CST / 后端与服务器部署专用分支 / 开工计划

### 当前目标

建立 `backend-server-deployment` 专用分支，将未来后端完善和服务器部署准备与当前前端视觉分支隔离。

### 计划改动

- 从 `SKill-hub-ui` 当前已提交基线创建远端备份。
- 创建、推送并切换到 `backend-server-deployment`。
- 保留现有 Claude 浏览器工具未提交改动，不纳入分支基线提交。
- 不连接或修改服务器，不安装 Docker，不改 nginx、端口、防火墙、DNS 或 HTTPS。

### 验收指标

- 备份分支和新开发分支均成功 push。
- 新分支 upstream 指向 `origin/backend-server-deployment`，本地与远端一致。
- 既有前端分支、旧站服务器与用户未提交文件不受影响。
- 后续恢复服务器施工仍需满足 `SERVER_DEPLOYMENT.md` 全部门禁。

## 2026-07-31 13:45 CST / backend-server-deployment / 分支基线验收

### 实际完成

- 备份分支与专用开发分支均从 `b1664b02f0dcee96d2452a37c7613c12c64dea3f` 创建并成功 push。
- 当前分支为 `backend-server-deployment`，跟踪 `origin/backend-server-deployment`。
- Claude 浏览器工具的未提交改动保持原样，没有进入分支基线提交。

### 验收结果

- 远端引用核验成功，本地与远端分歧 `0 0`。
- `git diff --check` 成功。
- 未连接目标服务器，未执行 Docker、nginx、端口、防火墙、DNS、HTTPS 或生产秘密修改。

### 下一状态

分支边界已建立。下一轮先做后端与服务器门禁评估，再根据 Neil Bauman 明确指令决定施工范围。
