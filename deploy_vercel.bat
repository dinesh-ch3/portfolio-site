@echo off
setlocal
echo ========================================================
echo        DEPLOY CHITTINEDI DINESH PORTFOLIO TO VERCEL
echo ========================================================
echo.
echo Launching Vercel deployment...
echo (If prompted, log in with your GitHub or Email in the browser)
echo.
cd /d "%~dp0"
call npx --yes vercel --prod --yes
echo.
echo ========================================================
echo If finished, your live website link is displayed above!
echo ========================================================
pause
