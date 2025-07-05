# Ali-NFC2QR - 支付宝 NFC 链接解码器

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![GitHub Repository](https://img.shields.io/badge/GitHub-Ali--NFC2QR-blue?style=for-the-badge&logo=github)](https://github.com/14790897/Ali-NFC2QR)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/14790897s-projects/v0-alipay-qr-code-generator)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/6avC6N4GAIS)

## Overview

Ali-NFC2QR 是一个支付宝 NFC 链接解码器，可以将支付宝的 NFC 链接解码并生成对应的二维码。

### 功能特性

- 📱 **NFC 读取**：直接通过手机 NFC 读取支付宝标签（Chrome for Android 89+）
- ✏️ **NFC 写入**：将读取的数据写入到其他 NFC 标签，实现标签复制
- 🔗 **链接解码**：解码支付宝 NFC 链接
- 📱 **二维码生成**：生成带有支付宝图标的精美二维码
- 📋 **一键复制**：复制解码结果到剪贴板
- 💾 **图片下载**：下载二维码图片到本地
- 🎨 **现代界面**：响应式设计，支持移动端和桌面端
- 🔒 **安全可靠**：纯前端处理，数据不上传服务器
- 🚀 **SEO 优化**：完整的搜索引擎优化，支持结构化数据
- 📱 **PWA 支持**：可安装的渐进式网页应用

### GitHub 仓库

项目源码托管在 GitHub：[https://github.com/14790897/Ali-NFC2QR](https://github.com/14790897/Ali-NFC2QR)

### 使用方法

#### 方法一：NFC 读取与写入（推荐）

1. 使用支持 Web NFC 的设备（Android 设备上的 Chrome 89+）
2. 点击"开始扫描 NFC"按钮
3. 将手机靠近支付宝 NFC 标签（距离 2-4 厘米）
4. 系统自动读取并解码，生成二维码
5. **可选**：点击"写入到新标签"将数据复制到其他 NFC 标签

#### 方法二：手动输入

1. 复制支付宝 NFC 链接
2. 粘贴到输入框中
3. 点击"开始解码"按钮
4. 查看解码结果和生成的二维码

### 浏览器支持

- **NFC 功能**：Chrome for Android 89+ （需要设备支持 NFC）
- **基础功能**：所有现代浏览器（Chrome、Firefox、Safari、Edge）

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## 快速开始

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install
```

### 本地开发

```bash
# 启动开发服务器
pnpm dev

```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建部署

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 技术栈

- **框架**: Next.js 14 (React 18)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: Radix UI + shadcn/ui
- **二维码**: QRCode.js
- **NFC**: Web NFC API
- **图标**: Lucide React
- **SEO**: 结构化数据 + Open Graph + Twitter Cards
- **PWA**: Web App Manifest + Service Worker

## 项目结构

```text
Ali-NFC2QR/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   ├── nfc-reader.tsx    # NFC 读取器组件
│   └── structured-data.tsx # SEO 结构化数据
├── lib/                  # 工具函数
│   └── version.ts        # 版本管理
├── docs/                 # 项目文档
│   ├── NFC-FEATURES.md   # NFC 功能说明
│   ├── NFC-TROUBLESHOOTING.md # 故障排除指南
│   └── SEO-CHECKLIST.md  # SEO 检查清单
├── public/               # 静态资源
│   ├── alipay-logo.svg   # 支付宝图标
│   ├── favicon.svg       # 网站图标
│   └── nfc-test.html     # NFC 测试页面
├── CHANGELOG.md          # 更新日志
└── README.md
```

## Deployment

Your project is live at:

**[https://vercel.com/14790897s-projects/v0-alipay-qr-code-generator](https://vercel.com/14790897s-projects/v0-alipay-qr-code-generator)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/6avC6N4GAIS](https://v0.dev/chat/projects/6avC6N4GAIS)**

## 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 问题反馈

如果您遇到问题或有建议，请在 [GitHub Issues](https://github.com/14790897/Ali-NFC2QR/issues) 中提交。

## 版本信息

当前版本：**v1.2.0**

### 最新更新 (v1.2.0)

- 🔧 修复 NFC 停止扫描功能
- 🐛 解决 "ongoing scan" 错误
- ✨ 添加智能重试机制
- 🔄 新增重置功能
- 📊 完善 SEO 优化
- 📱 添加版本号显示

查看完整的 [更新日志](CHANGELOG.md) 了解所有版本的详细变更。

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Radix UI](https://www.radix-ui.com/) - 无障碍 UI 组件
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) - 二维码生成
- [Lucide](https://lucide.dev/) - 图标库
- [v0.dev](https://v0.dev) - AI 辅助开发

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
