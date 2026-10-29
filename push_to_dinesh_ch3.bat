@echo off
setlocal
cd /d "C:\Users\dch69\Downloads\dinesh-portfolio"

echo ========================================================
echo    UPDATING https://github.com/dinesh-ch3/portfolio-site
echo ========================================================
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/dinesh-ch3/portfolio-site.git
git branch -M main
git add .
git commit -m "Fix LinkedIn profile URL and update resume PDF" 2>nul

echo.
echo Pushing updates to GitHub...
echo If a GitHub browser popup appears, click "Authorize GitCredentialManager".
echo.

git push -u origin main --force

echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo [SUCCESS] Updates pushed successfully to GitHub!
    echo Your updated website is live at:
    echo     https://dinesh-ch3.github.io/portfolio-site/
) else (
    echo [NOTICE] If prompted to log in, please complete the browser sign-in.
)
echo ========================================================
echo.
pause
