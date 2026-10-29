@echo off
setlocal
cd /d "C:\Users\dch69\Downloads\dinesh-portfolio"

echo ========================================================
echo    CONNECTING TO https://github.com/dinesh-ch3/portfolio-site
echo ========================================================
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/dinesh-ch3/portfolio-site.git
git branch -M main
git add .
git commit -m "Deploy executive data analyst portfolio website" 2>nul

echo.
echo Pushing files to GitHub...
echo If a GitHub browser popup appears, click "Authorize GitCredentialManager".
echo.

git push -u origin main --force

echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo [SUCCESS] Push completed successfully to dinesh-ch3!
    echo Your site will be live at:
    echo     https://dinesh-ch3.github.io/portfolio-site/
) else (
    echo [NOTICE] If prompted to log in, please complete the browser sign-in.
)
echo ========================================================
echo.
pause
