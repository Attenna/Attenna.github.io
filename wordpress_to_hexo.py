#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
WordPress XML to Hexo Markdown Converter
将 WordPress 导出的 XML 文件转换为 Hexo 可用的 Markdown 文件
"""

import xml.etree.ElementTree as ET
import os
import re
import html2text
from datetime import datetime
import urllib.parse

def clean_filename(title):
    """清理文件名，移除不合法字符"""
    # 移除HTML标签
    title = re.sub(r'<[^>]+>', '', title)
    # 移除特殊字符，保留中文、英文、数字、连字符
    title = re.sub(r'[^\w\u4e00-\u9fa5\s-]', '', title)
    # 替换空格为连字符
    title = re.sub(r'\s+', '-', title.strip())
    # 移除多余的连字符
    title = re.sub(r'-+', '-', title)
    return title.strip('-')

def html_to_markdown(html_content):
    """将HTML内容转换为Markdown"""
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.ignore_images = False
    h.ignore_emphasis = False
    h.body_width = 0
    
    # 清理WordPress特有的注释
    html_content = re.sub(r'<!-- wp:.*? -->', '', html_content)
    html_content = re.sub(r'<!-- /wp:.*? -->', '', html_content)
    
    return h.handle(html_content).strip()

def extract_categories_and_tags(item):
    """提取分类和标签"""
    categories = []
    tags = []
    
    for category in item.findall('.//category'):
        domain = category.get('domain', '')
        nicename = category.get('nicename', '')
        text = category.text or ''
        
        if domain == 'category':
            categories.append(text)
        elif domain == 'post_tag':
            tags.append(text)
    
    return categories, tags

def convert_wordpress_to_hexo(xml_file_path, output_dir):
    """转换WordPress XML到Hexo Markdown文件"""
    
    # 解析XML文件
    try:
        tree = ET.parse(xml_file_path)
        root = tree.getroot()
    except ET.ParseError as e:
        print(f"XML解析错误: {e}")
        return
    
    # 创建输出目录
    posts_dir = os.path.join(output_dir, 'source', '_posts')
    pages_dir = os.path.join(output_dir, 'source')
    
    os.makedirs(posts_dir, exist_ok=True)
    os.makedirs(pages_dir, exist_ok=True)
    
    # 命名空间映射
    namespaces = {
        'wp': 'http://wordpress.org/export/1.2/',
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
        'dc': 'http://purl.org/dc/elements/1.1/'
    }
    
    # 查找所有文章项目
    items = root.findall('.//item')
    
    post_count = 0
    page_count = 0
    
    for item in items:
        # 获取文章信息
        title_elem = item.find('title')
        title = title_elem.text if title_elem is not None else '无标题'
        
        # 获取发布日期
        pub_date_elem = item.find('pubDate')
        if pub_date_elem is not None and pub_date_elem.text:
            try:
                pub_date = datetime.strptime(pub_date_elem.text, '%a, %d %b %Y %H:%M:%S %z')
            except ValueError:
                pub_date = datetime.now()
        else:
            pub_date = datetime.now()
        
        # 获取内容
        content_elem = item.find('.//content:encoded', namespaces)
        content = content_elem.text if content_elem is not None else ''
        
        # 获取摘要
        excerpt_elem = item.find('.//excerpt:encoded', namespaces)
        excerpt = excerpt_elem.text if excerpt_elem is not None else ''
        
        # 获取文章类型
        post_type_elem = item.find('.//wp:post_type', namespaces)
        post_type = post_type_elem.text if post_type_elem is not None else 'post'
        
        # 获取文章状态
        status_elem = item.find('.//wp:status', namespaces)
        status = status_elem.text if status_elem is not None else 'publish'
        
        # 只处理已发布的文章和页面
        if status != 'publish':
            continue
            
        # 跳过附件和其他类型
        if post_type in ['attachment', 'revision', 'nav_menu_item']:
            continue
        
        # 获取分类和标签
        categories, tags = extract_categories_and_tags(item)
        
        # 转换HTML到Markdown
        markdown_content = html_to_markdown(content) if content else ''
        
        # 生成文件名
        clean_title = clean_filename(title)
        if not clean_title:
            clean_title = f"post-{post_count + page_count + 1}"
        
        # 创建Front Matter
        front_matter = f"""---
title: "{title}"
date: {pub_date.strftime('%Y-%m-%d %H:%M:%S')}
"""
        
        if categories:
            if len(categories) == 1:
                front_matter += f"categories: {categories[0]}\n"
            else:
                front_matter += f"categories:\n"
                for cat in categories:
                    front_matter += f"  - {cat}\n"
        
        if tags:
            front_matter += f"tags:\n"
            for tag in tags:
                front_matter += f"  - {tag}\n"
        
        if excerpt:
            excerpt_md = html_to_markdown(excerpt)
            if excerpt_md:
                front_matter += f"excerpt: |\n  {excerpt_md.replace(chr(10), chr(10) + '  ')}\n"
        
        front_matter += "---\n\n"
        
        # 完整的文章内容
        full_content = front_matter + markdown_content
        
        # 确定保存路径
        if post_type == 'page':
            # 页面保存到特殊目录
            if clean_title.lower() == 'about' or 'about' in title.lower():
                file_path = os.path.join(pages_dir, 'about', 'index.md')
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
            else:
                file_path = os.path.join(pages_dir, clean_title, 'index.md')
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
            page_count += 1
        else:
            # 文章保存到_posts目录
            filename = f"{pub_date.strftime('%Y-%m-%d')}-{clean_title}.md"
            file_path = os.path.join(posts_dir, filename)
            post_count += 1
        
        # 写入文件
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(full_content)
            print(f"已转换: {title} -> {os.path.basename(file_path)}")
        except Exception as e:
            print(f"写入文件失败 {title}: {e}")
    
    print(f"\n转换完成！")
    print(f"共转换 {post_count} 篇文章")
    print(f"共转换 {page_count} 个页面")

if __name__ == "__main__":
    xml_file = "attenna.WordPress.2025-08-03.xml"
    output_directory = "."
    
    if not os.path.exists(xml_file):
        print(f"错误: 找不到文件 {xml_file}")
        exit(1)
    
    print("开始转换 WordPress XML 到 Hexo Markdown...")
    convert_wordpress_to_hexo(xml_file, output_directory)
