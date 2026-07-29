# 本地部署

本地部署用于在单机 Docker Desktop 中验证接近生产的完整链路，不代表公网服务器已经部署。入口缺省为 `http://127.0.0.1:8080`，可以显式切换到单个 RFC1918 私网 IPv4；PostgreSQL 与 S3 兼容对象存储只存在于内部 Docker 网络，不向宿主机开放端口。

## 组成

- Next.js standalone 应用：非 root 用户运行。
- PostgreSQL 18：保存 Skill、推荐线索、统计和对象元数据。
- Drizzle 版本化迁移：应用启动前一次性执行，失败时阻止应用启动。
- SeaweedFS S3：保存 ZIP 与图片原始字节。
- Caddy：缺省只监听本机回环地址，局域网模式只监听显式私网地址；提供压缩、安全响应头、上传体积限制、健康检查和反向代理。

镜像和 npm 依赖均在仓库配置中固定版本。当前 Apple Silicon 本地栈以 Alpine 3.23 为共同基础，在仓库 Dockerfile 中安装固定版本的 PostgreSQL、Node.js、Caddy，并用已核验 SHA-256 的上游 arm64 产物构建 SeaweedFS。部署不依赖仓库目录 bind mount，避免 Docker Desktop 对 `Documents` 目录文件共享的运行时阻塞。不要在未审阅的情况下改为 `latest`。

## 首次启动

1. 确认 Docker Desktop 已启动：

   ```sh
   docker version
   docker compose version
   ```

2. 生成仅本机使用的随机秘密文件：

   ```sh
   npm run deploy:local:env
   ```

   命令只在 `.env.local` 不存在时创建文件，并将权限设为 `0600`。脚本不会打印秘密；`.env.local` 已被 Git 忽略。

3. 可选启用管理员登录：使用 `npm run admin:hash-password` 生成哈希，再手动填写 `.env.local` 的 `CATNIP_ADMIN_EMAIL` 与 `CATNIP_ADMIN_PASSWORD_HASH`。不得填写明文密码，不得提交该文件。

4. 校验并启动：

   ```sh
   docker compose --env-file .env.local config
   docker compose --env-file .env.local up --build -d
   docker compose --env-file .env.local ps
   curl --fail http://127.0.0.1:8080/api/health
   ```

健康响应中的 `persistence` 应为 `postgres-s3`。管理员变量为空时，公开站点仍可使用，但管理员登录会安全拒绝。

## 同一局域网访问

默认入口只绑定 `127.0.0.1`。需要让同一局域网设备访问时，先用 `ifconfig` 确认 Mac 当前活动网卡的 RFC1918 私网 IPv4，再执行：

```sh
npm run deploy:local:bind -- 192.168.120.107
docker compose --env-file .env.local up -d --force-recreate --wait caddy
```

其他设备使用 `http://192.168.120.107:8080`。地址随网络变化时必须重新确认和设置；工具只接受 `127.0.0.1`、`10.0.0.0/8`、`172.16.0.0/12` 或 `192.168.0.0/16` 内的 IPv4，拒绝 `0.0.0.0`、公网、链路本地、组播、IPv6和无效输入，并且不会输出 `.env.local` 中的其他值。

局域网入口使用明文 HTTP，只用于受信任的本地网络和公开浏览。管理员 Cookie 在 production 模式要求 HTTPS，因此不要在局域网 HTTP 上启用或测试真实管理员登录，也不要在公共 Wi-Fi、访客网络或路由器端口转发下开放该入口。macOS 防火墙策略由设备管理员控制；本工具不会擅自修改系统防火墙。

恢复仅本机访问：

```sh
npm run deploy:local:bind -- 127.0.0.1
docker compose --env-file .env.local up -d --force-recreate --wait caddy
```

恢复后确认 `127.0.0.1:8080` 可访问且私网地址不再监听。

## 前端热更新预览

容器入口 `8080` 是稳定生产式构建，不会随源码自动更新。前端视觉施工时，在专用前端分支使用独立端口和进程内数据启动 Next.js 开发服务器：

```sh
CATNIP_PERSISTENCE_MODE=memory \
CATNIP_ADMIN_EMAIL= \
CATNIP_ADMIN_PASSWORD_HASH= \
CATNIP_SESSION_SECRET= \
npm run dev -- --hostname 192.168.120.107 --port 3001
```

同一局域网设备打开 `http://192.168.120.107:3001`，保存前端源码后可看到热更新。健康接口的 `persistence` 应为 `process-memory`；该入口不读取容器 PostgreSQL/S3 的持久数据，不能用于持久化或生产验收。必须使用当前实际 RFC1918 地址，不能改成 `0.0.0.0`。管理员变量显式清空，禁止在明文开发入口使用真实管理员秘密。

稳定完整栈继续保留在 `http://192.168.120.107:8080`；如热更新进程停止，可按上述命令重新启动，不需要重建 Docker 服务。

## 验证与维护

运行数据库和对象存储集成测试：

```sh
docker compose --env-file .env.local --profile test run --rm integration
```

查看日志：

```sh
docker compose --env-file .env.local logs --tail=200 app migrate postgres seaweedfs caddy
```

停止服务但保留数据：

```sh
docker compose --env-file .env.local stop
```

重新启动：

```sh
docker compose --env-file .env.local up -d
```

不要使用 `docker compose down -v`，它会删除持久卷。

## 备份与恢复

创建数据库和对象卷备份：

```sh
scripts/backup-local.sh
```

备份写入被 Git 忽略的 `backups/<timestamp>/`，包含 PostgreSQL custom dump、SeaweedFS 数据归档和不含秘密的 manifest。应把有效备份复制到另一块磁盘或受控备份系统；同盘备份不能抵御磁盘故障。

恢复会覆盖当前本地数据，必须显式指定目录和精确确认值：

```sh
CATNIP_RESTORE_CONFIRM=restore-catnip-local \
  scripts/restore-local.sh backups/<timestamp>
```

恢复后必须重新执行健康检查、集成测试和关键页面验收。日常回滚代码优先使用 Git revert；数据库回滚优先通过向前修复迁移，不应随意删除迁移历史。

## Docker 镜像下载故障

本机默认 containerd image store 曾在拉取较大远端镜像时遇到 CloudFront `httpReadSeeker ... EOF`。排障期间试过 classic image store，但 Docker Desktop 重启后出现无效虚拟机存储附件，因此该方案已撤销并恢复默认 containerd；最终通过本地 Alpine 构建、固定发行包版本和已校验上游产物规避大镜像拉取，`hello-world` 与完整 Compose 栈均复测成功。若未来升级 Docker 后问题复现，应先记录版本与错误，再检查 Docker Desktop 状态和镜像来源，不切换未经复测的存储后端，也不删除项目卷作为排障手段。
