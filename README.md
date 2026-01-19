<p align="center">
  <img src="public/logo.svg" width="100" height="100" alt="Cola-Cover Logo">
</p>

<h1 align="center">Cola-Cover</h1>

<p align="center">基于 Mini-Cover 改造的高效博客封面制作工具</p>
<p align="center">更智能的配色、更丝滑的体验、更高效的创作</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/evanfu0110/Cola-Cover">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  <a href="https://app.netlify.com/start/deploy?repository=https://github.com/evanfu0110/Cola-Cover">
    <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />
  </a>
</p>

<p align="center">🎮 在线演示：
  <a href="https://cover.fitanyu.cn" target="_blank">
  https://cover.fitanyu.cn
  </a>
</p>
<p align="center">👨‍💻 作者博客：
  <a href="https://ftianyu.cn" target="_blank">
  https://ftianyu.cn
  </a>
</p>

## 📖 简介

**Cola-Cover** 是在 [JLinMr/Mini-Cover](https://github.com/JLinMr/Mini-Cover) 基础上深度改造的现代化封面生成工具。它继承了原版的简洁易用，并针对创作者的痛点进行了大量功能增强和体验优化。

## ✨ Cola 版核心特性

### 1. 🧠 智能配色 (Smart Color)
告别配色困难症！只需上传你的 Logo 或图标：
- **自动分析**：系统自动提取 Logo 主色调。
- **智能推荐**：基于分析结果，自动生成协调的 **纯色** 和 **渐变色** 方案。
- **文字适配**：文字颜色也会根据背景自动推荐高对比度配色（如黑/白/金/银），确保清晰易读。

### 2. 💧 高级高斯模糊 (Gaussian Blur)
重构了背景模糊引擎，提供纯净的 **高斯模糊** 能力：
- **极致平滑**：支持 0-100px 的超大范围模糊调节。
- **叠加色调**：支持自定义叠加颜色和不透明度，轻松制作各种毛玻璃或氛围感背景。

### 3. 👁️ 粘连预览 (Sticky Preview)
- **实时跟随**：右侧预览窗口会自动吸附在屏幕顶部，无论你如何滚动左侧的设置面板，预览图始终可见，所见即所得。

### 4. 🌙 完美暗黑模式
- **持久化体验**：支持系统自动切换或手动切换深色模式，设置自动保存。
- **智能适配**：背景色和文字颜色会根据深色/浅色模式智能反转（仅在默认颜色下），既贴心又护眼。

### 5. 🎨 更多细节优化
- **字体分离**：UI 界面使用优雅的 `LXGW Bright` 字体，画布使用标准的 `Microsoft YaHei`，互不干扰。
- **图标氛围**：支持上传图标自动生成背景氛围，让封面更有层次感。
- **文字渐变**：支持文字渐变色填充，不再局限于纯色。

## ⚙️ 快速部署

本项目基于 Vite + Vue 3 开发，支持一键部署到 Vercel、Netlify 等平台。

### 本地运行

```bash
# 克隆项目
git clone https://github.com/evanfu0110/Cola-Cover.git

# 进入目录
cd Cola-Cover

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 📝 致谢

感谢 [JLinMr/Mini-Cover](https://github.com/JLinMr/Mini-Cover) 提供的优秀基础项目。

## 📄 开源协议

[MIT License](LICENSE)
