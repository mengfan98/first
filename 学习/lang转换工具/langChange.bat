@echo off  
chcp 65001
COLOR 0A
set /p input=请输入文件路径: 
set /p input2=是否直接替换原文件(输入1则替换): 
set LangPath=E:\pro\cq1.0\client\Dev\project\src\game\core\Lang\LangId.ts
if /i "%input%" NEQ "" (  
   node langChange.js  %input% %LangPath% %input2%
REM exit /b  
pause
) else (  
    echo 无效路径
)  
pause