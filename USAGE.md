# Hexo 博客使用指南

## 项目结构

```
myBlog/
├── _config.yml          # 网站配置文件
├── package.json         # 项目依赖配置
├── scaffolds/           # 文章模板
│   ├── draft.md         # 草稿模板
│   ├── page.md          # 页面模板
│   └── post.md          # 文章模板
├── source/              # 源文件目录
│   ├── _posts/          # 文章目录
│   └── about/           # 关于页面
├── themes/              # 主题目录
└── public/              # 生成的静态文件（自动生成）
```

## 常用命令

### 基本操作
```bash
# 安装依赖
npm install

# 启动本地服务器（http://localhost:4000）
npm run server
# 或者
hexo server

# 生成静态文件
npm run build
# 或者
hexo generate

# 清理生成的文件
npm run clean
# 或者
hexo clean
```

### 内容管理
```bash
# 创建新文章
hexo new "文章标题"

# 创建新页面
hexo new page "页面名称"

# 创建草稿
hexo new draft "草稿标题"

# 发布草稿
hexo publish "草稿标题"
```

## 文章编写

### 文章头部信息（Front Matter）
```yaml
---
title: 文章标题
date: 2025-08-04 10:00:00
tags: [标签1, 标签2]
categories: 分类名称
---
```

### 支持的格式
- Markdown 语法
- HTML 标签
- 代码高亮
- 数学公式（需要插件）

## 部署配置

### GitHub Pages 部署
1. 修改 `_config.yml` 中的部署配置：
```yaml
deploy:
  type: git
  repo: https://github.com/username/username.github.io.git
  branch: main
```

2. 安装部署插件：
```bash
npm install hexo-deployer-git --save
```

3. 部署：
```bash
hexo deploy
```

## 主题配置

默认使用 landscape 主题，可以：
1. 下载其他主题到 `themes/` 目录
2. 修改 `_config.yml` 中的 `theme` 配置
3. 根据主题文档进行个性化配置

## 常见问题

### 1. 服务器启动失败
- 检查端口是否被占用
- 确保依赖已正确安装

### 2. 文章不显示
- 检查文章的 Front Matter 格式
- 确认文章放在 `source/_posts/` 目录下

### 3. 样式异常
- 清理缓存：`hexo clean`
- 重新生成：`hexo generate`

## 扩展功能

### 安装插件
```bash
npm install <插件名> --save
```

### 常用插件
- `hexo-generator-sitemap`: 生成网站地图
- `hexo-generator-feed`: 生成 RSS 订阅
- `hexo-deployer-git`: Git 部署
- `hexo-renderer-markdown-it`: 增强 Markdown 渲染

## 更多资源

- [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
- [Hexo 主题列表](https://hexo.io/themes/)
- [Hexo 插件列表](https://hexo.io/plugins/)
