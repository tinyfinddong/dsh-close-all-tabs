# dsh-close-all-tabs

DeepSeek Harness（DSH）右侧栏增强插件：在右侧栏 tab 的上下文菜单中增加「关闭全部标签」，一键关闭当前会话右侧栏的所有内容标签。

## ✨ 功能

- 在右侧栏任意 tab 的**右键菜单末尾**增加「关闭全部标签」项
- 一键关闭当前会话的所有内容标签（文件、浏览器、终端、文档预览等）
- 保留唯一的 docked 引导页（遵循 DSH 右侧栏自身的关闭语义）
- 样式随 DSH 主题：主题 token 文字色、hover 圆角背景、紧凑 padding

## 📦 安装

### 方式一：从 npm 安装（推荐）

```bash
dsh plugin add dsh-close-all-tabs
```

> npm 包自带构建产物，安装后无需构建。重启 DSH 后生效。

### 方式二：从 GitHub clone + link

```bash
git clone https://github.com/tinyfinddong/dsh-close-all-tabs.git
cd dsh-close-all-tabs
pnpm install
pnpm build
# 将插件 link 到 DSH profile（示例：desktop profile）
pnpm --dir ~/.dsh/profiles/desktop add link:/path/to/dsh-close-all-tabs
```

然后在 profile 的 `package.json` 中把 `dsh-close-all-tabs` 加入 `dsh.profile.bundles`，重启 DSH。

> 仓库已提交 `lib/` 构建产物，clone 后跳过 `pnpm build` 也可直接 link 使用。

## 🖱️ 使用

1. 打开右侧栏（快捷键或会话 header 角落按钮）
2. 在任意 tab 的 chip 上**右键**打开上下文菜单
3. 点击菜单末尾的「关闭全部标签」

## ⚙️ 兼容性

| 要求 | 版本 |
|---|---|
| Node.js | `>=22.19` |
| DeepSeek Harness | `>=0.2.0-rc.2 <0.3.0-0` |

依赖的 DSH 运行时包（由 DSH 提供，非本包安装）：
- `@deepseek-ai/dsh-client-ui-sidebar-right`
- `@deepseek-ai/dsh-client-ui-slots`
- `@deepseek-ai/dsh-client-locale`

## 🛠️ 开发

```bash
pnpm install
pnpm build   # 构建 host 半部 + client 半部 + types
pnpm typecheck
```

- **host 半部**（`src/index.ts`）：占位入口，保证 bundle 层正常加载并服务 client bundle
- **client 半部**（`src/client/`）：通过 `sidebar.right.tab.menu.item` slot 注册菜单项，自注入 CSS
- **构建产物**：`lib/index.js`（host，ESM）+ `lib/client.js`（client，ModuleLoader 格式）

## 📄 License

[MIT](LICENSE)
