---
icon: pen-to-square
date: 1980-01-01
---

<!-- more -->
# Automatically submit code
::: warning Warning
This submission is mandatory!
:::

```bat
@echo off
setlocal enabledelayedexpansion
set /p ver=<ver.txt
git add .
git commit -m "%ver%"
if errorlevel 1 (
    echo Submission failed (possibly no changes), script exiting.
    pause
    exit /b 1
)
git push -f origin main > push_output.txt 2>&1
set push_result=%errorlevel%
type push_output.txt
findstr /C:"Everything up-to-date" push_output.txt >nul
if errorlevel 1 (
    rem The string was not found, which may indicate a push or an error.
    if !push_result! equ 0 (
        rem Push successful
        set /a ver=ver+1
        echo !ver!>ver.txt
        echo The version has been updated to !ver!
    ) else (
        echo Push failed, version not incremented
    )
) else (
    echo No new submissions, version not increased.
)
del push_output.txt
pause
```


