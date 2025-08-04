@echo off
echo 正在清理旧文件...
call hexo clean

echo 正在生成静态文件...
call hexo generate

echo 静态文件生成完成！
echo 生成的文件位于 public 文件夹中
pause
