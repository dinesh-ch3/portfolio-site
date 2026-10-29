@echo off
setlocal
echo ========================================================
echo   CHITTINEDI DINESH - 1-CLICK FREE GITHUB PAGES DEPLOY
echo ========================================================
echo.
echo Make sure you have created the public repo on GitHub:
echo     dinesh-ch3.github.io
echo.
echo Attempting to push to https://github.com/dinesh-ch3/dinesh-ch3.github.io.git ...
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/dinesh-ch3/dinesh-ch3.github.io.git
git branch -M main
git add .
git commit -m "Deploy latest professional portfolio" 2>nul

echo Pushing code to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo [SUCCESS] Your portfolio is deploying to GitHub Pages!
    echo It will be live in 60 seconds at:
    echo     https://dinesh-ch3.github.io
    echo ========================================================
) else (
    echo.
    echo [NOTE] If you got a permission or login prompt, sign in to your GitHub account.
    echo Or you can upload these files directly to https://github.com/dinesh-ch3/dinesh-ch3.github.io
)
echo.
pause
