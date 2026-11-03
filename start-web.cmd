@echo off
set TEMP=D:\temp
set TMP=D:\temp
cd /d D:\beyond-beauty-saloon
call pnpm.cmd --filter @beyond/web start
pause
