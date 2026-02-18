---
icon: pen-to-square
date: 1980-01-01
---

<!-- more -->
# 自动提交代码
```bat
@echo off
setlocal enabledelayedexpansion

rem 从文件读取当前版本号
set /p ver=<ver.txt

rem 添加所有更改并提交，提交信息为版本号
git add .
git commit -m "%ver%"
if errorlevel 1 (
    echo 提交失败（可能无变更），脚本退出。
    pause
    exit /b 1
)

rem 执行强制推送，将输出重定向到临时文件
git push -f origin main > push_output.txt 2>&1
set push_result=%errorlevel%

rem 显示推送输出（可选）
type push_output.txt

rem 检查输出是否包含 "Everything up-to-date"
findstr /C:"Everything up-to-date" push_output.txt >nul
if errorlevel 1 (
    rem 未找到该字符串，说明可能有推送或出错
    if !push_result! equ 0 (
        rem 推送成功且有更新，版本号加1
        set /a ver=ver+1
        echo !ver!>ver.txt
        echo 版本已增加至 !ver!
    ) else (
        rem 推送失败，版本不变
        echo 推送失败，版本未增加。
    )
) else (
    rem 找到 "Everything up-to-date"，无新提交，版本不变
    echo 无新提交，版本未增加。
)

rem 清理临时文件
del push_output.txt
pause
```


