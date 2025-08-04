# 博客部署指南

## 已完成的工作

✅ 从 WordPress XML 成功导入了所有文章和页面
✅ 创建了完整的 Hexo 博客结构  
✅ 配置了部署到 https://attenna.github.io 的设置
✅ 生成了静态网站文件
✅ 创建了自动部署的 GitHub Actions 配置

## 需要手动完成的步骤

### 1. 创建 GitHub 仓库

1. 访问 GitHub：https://github.com
2. 创建一个新仓库，仓库名必须是：`attenna.github.io`
3. 设置为公开仓库（Public）
4. 不要初始化 README、.gitignore 或 license

### 2. 推送代码到 GitHub

在当前目录执行以下命令：

```bash
git remote add origin https://github.com/Attenna/attenna.github.io.git
git branch -M main
git push -u origin main
```

### 3. 配置 GitHub Pages

1. 在 GitHub 仓库页面，点击 Settings 标签
2. 在左侧菜单找到 "Pages"
3. 在 "Source" 下选择 "GitHub Actions"
4. 这样会自动使用我们创建的 Actions 配置

### 4. 等待部署完成

- 推送代码后，GitHub Actions 会自动运行
- 你可以在仓库的 "Actions" 标签页查看部署进度
- 首次部署大约需要 2-5 分钟

### 5. 访问你的博客

部署完成后，你可以通过以下地址访问博客：
**https://attenna.github.io**

## 本地开发和更新

### 启动本地服务器
```bash
npm run server
```
然后访问 http://localhost:4000

### 创建新文章
```bash
hexo new "文章标题"
```

### 发布更新
```bash
git add .
git commit -m "更新内容"
git push
```

GitHub Actions 会自动部署更新。

## 已导入的内容

从 WordPress 成功导入了：
- 23 篇文章
- 2 个页面（About 和 Biography）
- 所有的分类和标签
- 发布日期和内容格式

## 文件结构

```
myBlog/
├── source/
│   ├── _posts/           # 所有文章
│   ├── about/            # 关于页面
│   └── Biography-关于我这个人/ # 个人简介页面
├── _config.yml           # 网站配置
├── deploy.bat           # Windows 部署脚本
└── .github/workflows/   # 自动部署配置
```

## 故障排除

如果遇到问题，请检查：
1. GitHub 仓库名是否正确（必须是 `attenna.github.io`）
2. 仓库是否设置为公开
3. GitHub Pages 是否启用了 GitHub Actions
4. 在 Actions 页面查看部署日志

祝你使用愉快！🎉
