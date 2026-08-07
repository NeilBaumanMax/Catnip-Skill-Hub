# 服务器部署与运维

本文件记录目标服务器的只读评估、暂停历史、首次部署事实、回滚入口与剩余运维门禁。2026-08-07 已完成 Catnip Skill Hub 的直接 IP HTTP 部署；历史“尚未部署”段只作为当时证据，不代表当前状态。

## 当前生产状态（2026-08-07）

- 公共入口：`http://118.195.247.102`。宿主 nginx 监听 80，回源到只监听 `127.0.0.1:18080` 的 Catnip Caddy。
- 发布代码：`50bd53b`；发布目录 `/opt/catnip-skill-hub/releases/50bd53b`，`/opt/catnip-skill-hub/current` 指向该目录。生产镜像均为 `linux/amd64`；前一发布 `a578bca` 与 app 回滚镜像保留。
- 服务：PostgreSQL 18.4、SeaweedFS 4.29、迁移、Next.js 16.3.0 app 与 Caddy 2.11.4 由 Docker Compose 管理；迁移退出 0，其余长期服务 healthy。
- 网络：宿主只监听 SSH 22、nginx 80 和回环 18080；数据库、S3 与 app 不暴露宿主端口，旧 3000/4000 进程已按 Neil Bauman 明确授权停止。
- 资源：2 vCPU、3.6 GiB RAM、2 GiB `/swapfile`、系统盘约 36 GiB 可用。UFW 仍 inactive，腾讯云安全组未在本轮变更。
- 秘密：`/etc/catnip-skill-hub/env` 为 `root:root 0600`，不在发布目录和 Git 中。随机管理员密码只存 Neil 的 macOS 钥匙串 `Catnip Skill Hub Admin`，服务器只存 scrypt 哈希；Compose env 文件把哈希中的字面 `$` 写为 `$$`。
- 管理入口：公网 nginx 对 `/admin` 与 `/api/admin` 的精确路径及子路径全部返回 404；Neil 的 Mac 当前把 `127.0.0.1:18443` 经 SSH 转发到服务器 `127.0.0.1:18080`，从 `http://localhost:18443/admin/login` 登录。隧道中断后公网不会自动开放管理入口。
- 备份：首份有效且完成隔离恢复的备份为 `/var/backups/catnip-skill-hub/20260807-030544`；三个真实 Skill 发布前恢复点为 `/var/backups/catnip-skill-hub/20260807-184127-pre-three-skills`，其 PostgreSQL/SeaweedFS 归档和 SHA-256 已验证。`20260807-030452` 带 `FAILED.txt`，不可用于恢复。
- nginx 回滚文件：`/var/backups/catnip-skill-hub/nginx-catnip-pre-cutover-20260807-0305.conf`；施工前腾讯云系统盘快照由 Neil Bauman 确认完成。
- 旧 `/home/ubuntu/catnip-intro` 工作区及其未提交资产仍保留，没有删除、reset 或 clean；只有旧运行进程停止。
- 未完成：域名、DNS、HTTPS、MFA、登录审计/告警、UFW/安全组复核、122 个系统更新、异机备份、自动备份和监控。当前 SSH 隧道只适合 Neil 的单机管理，不替代长期身份代理。

## 首次部署决定（2026-08-07）

- Neil Bauman 确认系统盘快照完成并授权淘汰旧站后，服务器写门禁开放；新站先在 loopback 验收，再切换 nginx 80，最后停止旧进程。
- 暂不使用域名；由于旧站可淘汰，最终直接复用公网 80，而非准备阶段预留的 8080 共存入口。
- 管理员保持禁用；本轮不修改 SSH、腾讯云安全组、UFW、DNS 或 HTTPS。

## 2026-08-07 本地部署准备状态

- SeaweedFS 4.29 构建已支持 BuildKit 的 `linux/amd64` 与 `linux/arm64`，两个上游归档分别使用官方 Release API 返回的 SHA-256 固定校验。
- `linux/amd64` SeaweedFS 镜像已经在本地实际构建并运行 `weed version`，报告 `4.29`、`linux amd64`；首次构建因 Docker Hub 元数据读取超时失败，显式拉取固定摘要的 Alpine 3.23 后复测成功。
- Compose 入口支持 `CATNIP_BIND_PORT`；服务器模板固定 `CATNIP_BIND_ADDRESS=127.0.0.1`、`CATNIP_BIND_PORT=18080`，避免容器直接公开或占用旧站端口。
- `scripts/server-preflight.sh` 只读取系统、容量、Swap、磁盘、Docker、systemd、TCP 监听和旧站 Git 状态，不安装软件、不读取环境秘密、不修改主机。
- `deploy/nginx/catnip-skill-hub-8080.conf.example` 是未来独立 8080 入口候选配置；只有备份现有 nginx、`nginx -t` 通过并准备好恢复命令后才可安装和 reload。

## 部署前已核验服务器事实（历史基线）

- 主机：`118.195.247.102`，腾讯云 CVM，Ubuntu 22.04.5 LTS，Linux 5.15，x86_64。
- 登录：`ubuntu` 公钥登录成功，具备无密码 sudo；`root` SSH 登录被拒绝。不得修改 SSH 配置或复制私钥。
- 资源：2 vCPU、约 3.6 GiB RAM、约 2.7 GiB 可用、无 Swap；50 GB 系统盘约 40 GB 可用。
- Docker：尚未安装。只完成 `apt` dry-run；没有安装任何包。
- 系统更新：约 120 个包可升级，其中约 105 个带安全标记；unattended-upgrades 已启用，当前没有待重启标记。
- 网络：nginx 监听 80；22、80、3000、4000 当时可从公网访问，443 和 8080 未监听。UFW 未启用，主机 INPUT 默认接受并带腾讯云黑名单链。
- 域名：`catnipent.com` 当时解析到其他 IP，不指向本主机；目标服务器没有已核验 HTTPS/certbot 配置。

## 旧独立站保护边界（部署前历史）

- nginx 1.18 已启用，`/etc/nginx/sites-available/catnip` 通过 `server_name _` 占用 80。
- `/` 代理到既有 Next.js `127.0.0.1:3000`；`/api/`、`/uploads/` 和轮播接口代理到 Go 服务 `127.0.0.1:4000`。
- 既有工作区为 `/home/ubuntu/catnip-intro`，仓库存在已修改图片、`frontend/package-lock.json` 及多个未跟踪二进制/素材。这些均视为用户资产，禁止 reset、clean、checkout、restore、暂存或覆盖。
- Next.js 与 Go 进程没有发现完整可靠的 systemd 服务闭环；服务器重启或 OOM 后不能假设自动恢复。
- 现有数据与上传量不大，但没有发现可替代云快照的整机/异机恢复点。`/var/backups` 中的系统包记录不构成应用备份。

## 部署前已识别风险与处理结果

1. 云快照：Neil Bauman 已在写施工前创建系统盘快照，整机恢复门禁已满足。
2. 旧站恢复链：旧工作区继续保留，nginx 原配置另有备份；旧进程已在新站公网验证通过后停止。
3. 内存风险：已创建 2 GiB Swap；构建转移到本地干净 worktree，服务器只导入镜像，不在 4 GiB 主机做高峰构建。
4. 架构：六个生产目标均完成 `linux/amd64` 构建与导入，长期服务健康，持久化重启通过。
5. 生产依赖：Next.js/ESLint 升级到 16.3.0，`npm audit --omit=dev` 为 0 vulnerabilities。
6. 公网面：3000/4000 已无监听；仅 22/80 公网监听，Docker 入口 18080 仅在 loopback。
7. 仍需治理：UFW inactive、122 个系统更新、无 HTTPS/域名、无异机自动备份与监控。

## 准备阶段的直接 IP 共存拓扑（历史方案）

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

实际执行时 Neil Bauman 已授权淘汰旧站，因此没有开放 8080；当前使用 `80 -> nginx -> 127.0.0.1:18080 -> Catnip Caddy`，旧 3000/4000 不再监听。

## 已完成的首次部署门禁

1. 系统盘快照由 Neil Bauman 确认完成；开发前 Git 备份 `backup/pre-first-server-deployment-20260807-0241` 已远端核验。
2. 受控 Swap、官方 Docker Engine/Buildx/Compose 安装完成；服务器无法访问 Docker Hub 时改用本地 amd64 构建和离线导入。
3. loopback 完整栈、迁移、公开路由、反代同源安全、nginx 配置测试与公网 80 切换完成。
4. 数据库和对象卷首份备份通过 SHA-256、隔离恢复与整栈停机重启验证。
5. 57/57 测试、lint 0 error/3 warning、typecheck、db:check、Webpack production build、amd64 Docker production build、audit 0 vulnerabilities 和 16 张公网截图通过。
6. 首次部署完成不等于域名、HTTPS、管理员入口、异机灾备、系统补丁、主机防火墙或监控完成。

## 常用只读复核

从本地通过已核验的 `ubuntu` 公钥连接执行，不复制私钥，不把输出写入仓库：

```sh
ssh ubuntu@118.195.247.102 'sh -s' < scripts/server-preflight.sh
```

复核输出现在应确认：Ubuntu 22.04、x86_64/amd64、磁盘余量、2 GiB Swap、Docker 已安装、22/80 与回环 18080 监听、3000/4000 未监听，以及旧 `/home/ubuntu/catnip-intro` 仍保留。任何漂移先记录并判断是否需要回滚。

服务器环境文件从 `deploy/server.env.template` 复制到仓库外或服务器受限目录，权限必须为 `0600`，填入随机秘密后不得回传或提交。直接 IP 的 HTTP 预览保持管理员邮箱和密码哈希为空。

## 回滚原则

- Git 代码回滚优先 `git revert`；不得 force push 或 reset 既有站点。
- nginx 只恢复施工前备份文件，执行 `nginx -t` 后 reload，不覆盖其他站点配置。
- Catnip 新服务异常时先停止当前 Compose 栈；需要恢复旧站时，从施工前 nginx 备份恢复配置，`nginx -t` 后 reload，再按历史命令启动旧进程或使用系统盘快照。
- Docker/系统包卸载不是默认回滚动作；应先停止新服务并恢复网络/代理状态，避免二次扰动。
- 所有服务器变更、验证和回滚命令必须在新的 Phase 7 施工日志中逐步记录。
