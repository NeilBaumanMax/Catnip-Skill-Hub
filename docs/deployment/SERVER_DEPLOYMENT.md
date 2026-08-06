# 服务器部署准备

本文件记录目标服务器只读评估、暂停历史和 2026-08-07 恢复部署准备后的施工门禁。当前仍没有在服务器上安装 Docker、修改 nginx、改变防火墙、重启服务或部署 Catnip Skill Hub，不得写成服务器已部署。

## 当前决定（2026-08-07）

- Neil Bauman 已明确表示准备开始服务器部署，历史暂停不再是当前停点；先完成本地可交付准备和服务器只读复核，再单独进入服务器写施工。
- 暂不使用域名；未来首轮服务器预览计划直接使用独立端口 `http://118.195.247.102:8080`。
- 2026-07-29 评估时没有腾讯云系统盘快照。实际写施工前必须重新核验并优先创建系统盘快照；若 Neil Bauman 选择替代方案，必须先完成经验证的异机备份和恢复路径。
- 当前只授权准备工作，不把“准备开始”扩大为安装 Docker、修改 nginx/安全组或启用生产秘密；这些动作必须在恢复点和只读复核通过后逐项执行。

## 2026-08-07 本地部署准备状态

- SeaweedFS 4.29 构建已支持 BuildKit 的 `linux/amd64` 与 `linux/arm64`，两个上游归档分别使用官方 Release API 返回的 SHA-256 固定校验。
- `linux/amd64` SeaweedFS 镜像已经在本地实际构建并运行 `weed version`，报告 `4.29`、`linux amd64`；首次构建因 Docker Hub 元数据读取超时失败，显式拉取固定摘要的 Alpine 3.23 后复测成功。
- Compose 入口支持 `CATNIP_BIND_PORT`；服务器模板固定 `CATNIP_BIND_ADDRESS=127.0.0.1`、`CATNIP_BIND_PORT=18080`，避免容器直接公开或占用旧站端口。
- `scripts/server-preflight.sh` 只读取系统、容量、Swap、磁盘、Docker、systemd、TCP 监听和旧站 Git 状态，不安装软件、不读取环境秘密、不修改主机。
- `deploy/nginx/catnip-skill-hub-8080.conf.example` 是未来独立 8080 入口候选配置；只有备份现有 nginx、`nginx -t` 通过并准备好恢复命令后才可安装和 reload。

## 已核验服务器事实

- 主机：`118.195.247.102`，腾讯云 CVM，Ubuntu 22.04.5 LTS，Linux 5.15，x86_64。
- 登录：`ubuntu` 公钥登录成功，具备无密码 sudo；`root` SSH 登录被拒绝。不得修改 SSH 配置或复制私钥。
- 资源：2 vCPU、约 3.6 GiB RAM、约 2.7 GiB 可用、无 Swap；50 GB 系统盘约 40 GB 可用。
- Docker：尚未安装。只完成 `apt` dry-run；没有安装任何包。
- 系统更新：约 120 个包可升级，其中约 105 个带安全标记；unattended-upgrades 已启用，当前没有待重启标记。
- 网络：nginx 监听 80；22、80、3000、4000 当时可从公网访问，443 和 8080 未监听。UFW 未启用，主机 INPUT 默认接受并带腾讯云黑名单链。
- 域名：`catnipent.com` 当时解析到其他 IP，不指向本主机；目标服务器没有已核验 HTTPS/certbot 配置。

## 现有独立站保护边界

- nginx 1.18 已启用，`/etc/nginx/sites-available/catnip` 通过 `server_name _` 占用 80。
- `/` 代理到既有 Next.js `127.0.0.1:3000`；`/api/`、`/uploads/` 和轮播接口代理到 Go 服务 `127.0.0.1:4000`。
- 既有工作区为 `/home/ubuntu/catnip-intro`，仓库存在已修改图片、`frontend/package-lock.json` 及多个未跟踪二进制/素材。这些均视为用户资产，禁止 reset、clean、checkout、restore、暂存或覆盖。
- Next.js 与 Go 进程没有发现完整可靠的 systemd 服务闭环；服务器重启或 OOM 后不能假设自动恢复。
- 现有数据与上传量不大，但没有发现可替代云快照的整机/异机恢复点。`/var/backups` 中的系统包记录不构成应用备份。

## 已识别阻塞风险

1. 没有云快照：Docker 安装会调整系统服务、网络和 iptables；nginx reload 与系统更新也共享旧站运行环境，失败时无法一键回到部署前整机状态。
2. 旧站恢复链脆弱：运行进程缺少稳定服务托管，仓库又有未提交资产，不能靠重新 clone 完整恢复。
3. 内存风险：约 4 GiB 且无 Swap，构建或启动多容器可能触发 OOM 并杀死现有服务。
4. 架构阻塞已在本地解除，但完整栈仍需在目标 amd64 主机或等价 Linux amd64 环境完成 Compose 构建、启动和持久化复测。
5. 生产依赖风险：`npm audit --omit=dev` 发现 3 个 high、0 critical，涉及 Next.js 间接依赖的 PostCSS 和 Sharp。npm 建议的 Next.js 大版本降级不适用，禁止直接运行 `npm audit fix`。
6. 公网面过大：3000/4000 绕过 nginx 可直接访问。未来应由腾讯云安全组关闭公网入口，只允许 nginx 从 loopback 回源。

## 未来直接 IP 共存拓扑

首轮不使用域名，也不改写旧站 80 路由。建议拓扑：

```text
公网 http://118.195.247.102:8080
  -> 宿主 nginx 独立 listen 8080
  -> 127.0.0.1:18080
  -> Catnip Docker Caddy
  -> Next.js / PostgreSQL / S3 私有容器网络

公网 http://118.195.247.102:80
  -> 现有 nginx 配置
  -> 现有 Next.js :3000 / Go :4000（保持不变）
```

- Catnip 容器入口只能绑定 `127.0.0.1:18080`，不得直接绑定公网或抢占 80。
- 不采用 `/catnip` 路径前缀，因为 Next.js 资源、路由和旧站代理规则可能冲突。
- 腾讯云安全组未来只新增必要的 TCP 8080；3000/4000 收口必须单独验证旧站通过 80 仍正常。
- 无域名阶段只作为 HTTP 预览，不启用真实管理员凭据或敏感管理操作；正式管理与公网生产验收等待域名和 HTTPS。

## 恢复施工前门禁

1. 本地先修复生产依赖风险，禁止无审阅的自动降级；全量通过 test、lint、typecheck、build 和 audit 复核。
2. 建立并验证 amd64/多架构 SeaweedFS 镜像和 checksum；本地或 CI 完成目标架构 Compose 构建验证。
3. 优先创建腾讯云系统盘快照。若 Neil Bauman 明确选择替代方案，必须先把 nginx、旧站目录、上传和数据备份到服务器之外，并记录恢复演练；同盘 tar 不等同快照。
4. 记录旧站精确启动方式并建立可验证的重启恢复方案；任何重启前先验证。
5. 评估并增加受控 Swap、容器内存限制和磁盘余量，避免在服务器直接进行高峰内存构建。
6. 每一步后回归旧站 80、3000/4000 回源、nginx 配置和进程状态；异常即停止，不继续部署。
7. 先备份再修改 nginx；新增独立配置，运行 `nginx -t` 成功后才 reload，保留显式恢复命令。
8. 部署成功后建立异机备份、恢复演练、日志/容量/健康监控，再讨论域名、443 和 HTTPS。

## 下一步只读复核

从本地通过已核验的 `ubuntu` 公钥连接执行，不复制私钥，不把输出写入仓库：

```sh
ssh ubuntu@118.195.247.102 'sh -s' < scripts/server-preflight.sh
```

复核输出必须确认：Ubuntu 22.04、x86_64/amd64、磁盘余量、Swap 状态、Docker 是否安装、80/3000/4000 旧站监听、18080/8080 可用性及 `/home/ubuntu/catnip-intro` 未提交状态。任何事实与 2026-07-29 记录不一致时停止，不继续写施工。

服务器环境文件从 `deploy/server.env.template` 复制到仓库外或服务器受限目录，权限必须为 `0600`，填入随机秘密后不得回传或提交。直接 IP 的 HTTP 预览保持管理员邮箱和密码哈希为空。

## 回滚原则

- Git 代码回滚优先 `git revert`；不得 force push 或 reset 既有站点。
- nginx 只恢复施工前备份文件，执行 `nginx -t` 后 reload，不覆盖其他站点配置。
- Catnip 新服务异常时先停止其独立容器和 8080 server block，不改旧站 80 路由。
- Docker/系统包卸载不是默认回滚动作；应先停止新服务并恢复网络/代理状态，避免二次扰动。
- 所有服务器变更、验证和回滚命令必须在新的 Phase 7 施工日志中逐步记录。
