# GitHub Pages 设置指南

本项目已配置为支持GitHub Pages自动部署。

## 🚀 快速开始

### 1. 启用GitHub Pages

1. 进入你的GitHub仓库
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 下拉菜单中选择 **GitHub Actions**

### 2. 自动部署

一旦启用GitHub Pages，每次推送到 `main` 分支时都会：

1. 自动生成README文件（中英文）
2. 从YAML文件中提取案例数据生成JSON
3. 构建并部署到GitHub Pages

### 3. 访问网站

部署完成后，你可以通过以下URL访问网站：
```
https://[你的用户名].github.io/[仓库名]/
```

## 📁 文件结构

```
/ (根目录)
├── index.html          # 主页
├── styles.css          # 样式文件
├── script.js           # JavaScript功能
├── cases-data.json     # 案例数据（自动生成）
├── generate-cases.js   # 数据生成脚本
├── .nojekyll          # 禁用Jekyll处理
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions工作流
```

## 🔧 本地开发

### 安装依赖

```bash
# 安装gen-tool依赖
cd gen-tool
npm install
```

### 本地预览

由于GitHub Pages的限制，建议使用本地服务器进行开发预览：

```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx serve .

# 访问 http://localhost:8000
```

### 生成测试数据

```bash
# 生成案例数据JSON
node generate-cases.js
```

## 🎨 自定义配置

### 修改网站标题和描述

编辑 `index.html` 文件中的：
- `<title>` 标签
- meta description
- 网站名称和标语

### 自定义样式

编辑 `styles.css` 文件来：
- 修改颜色主题
- 调整布局
- 自定义动画效果

### 添加新功能

编辑 `script.js` 文件来：
- 添加新的过滤器
- 修改排序逻辑
- 增强用户交互

## 🔍 故障排除

### 常见问题

1. **网站无法访问**
   - 确认GitHub Pages已启用
   - 检查Actions工作流是否成功运行
   - 等待几分钟让CDN更新

2. **案例数据不显示**
   - 确认 `cases-data.json` 文件存在
   - 检查YAML文件格式是否正确
   - 查看Actions日志中的错误信息

3. **样式问题**
   - 检查CSS文件是否正确加载
   - 确认文件路径正确
   - 清除浏览器缓存

### 调试技巧

1. 打开浏览器开发者工具
2. 查看Console中的错误信息
3. 检查Network标签页中的文件加载状态
4. 使用浏览器的响应式设计模式测试移动端

## 📊 性能优化

### 图片优化
- 案例图片会自动进行懒加载
- 建议将大图片压缩到1MB以下
- 使用WebP格式获得更好的压缩效果

### 代码优化
- JavaScript使用防抖函数优化搜索性能
- CSS使用现代布局技术（Grid/Flexbox）
- 响应式设计确保在所有设备上良好显示

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进网站！

### 贡献步骤
1. Fork本仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -m 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建Pull Request

## 📝 更新日志

### v1.0.0
- ✨ 初始版本发布
- 🎨 现代响应式设计
- 🔍 强大的搜索和过滤功能
- 📱 移动端优化
- ⚡ 自动部署到GitHub Pages

## 📞 支持

如果你遇到问题或有建议，请：

1. 查看 [Issues](../../issues) 页面
2. 提交新的Issue
3. 加入我们的讨论

感谢你对 Awesome Nano Banana 的支持！ 🍌✨
