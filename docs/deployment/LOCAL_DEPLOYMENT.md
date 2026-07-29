# 本地部署

本地部署用于在单机 Docker Desktop 中验证接近生产的完整链路，不代表公网服务器已经部署。入口固定为 `http://127.0.0.1:8080`；PostgreSQL 与 S3 兼容对象存储只存在于内部 Docker 网络，不向宿主机开放端口。

## 组成

- Next.js standalone 应用：非 root 用户运行。
- PostgreSQL 18：保存 Skill、推荐线索、统计和对象元数据。
- Drizzle 版本化迁移：应用启动前一次性执行，失败时阻止应用启动。
- SeaweedFS S3：保存 ZIP 与图片原始字节。
- Caddy：只监听本机回环地址，提供压缩、安全响应头、上传体积限制和反向代理。

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
