@echo off  
chcp 65001
set /p input=请输入文件路径: 
if /i "%input%" NEQ "" (  
    echo 正在执行
    node 1.js  %input%
REM exit /b  
pause
) else (  
    echo 无效路径
)  
pause