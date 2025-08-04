@echo off
echo 准备强制更新 GitHub 仓库...
echo.

echo 1. 删除现有的远程连接
git remote remove origin

echo 2. 重新添加远程仓库
git remote add origin https://github.com/Attenna/attenna.github.io.git

echo 3. 强制推送 (这将覆盖远程仓库的所有内容)
git push --force origin main

echo.
echo 如果出现认证问题，请按照提示输入 GitHub 用户名和密码/令牌
echo 或者在 GitHub 中设置 Personal Access Token
echo.
pause
