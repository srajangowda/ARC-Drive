@echo off
echo ================================
echo Pushing ARC Drive CI/CD Pipeline
echo ================================
echo.

REM Add all files
echo Adding files to git...
git add .

REM Commit changes
echo Committing changes...
git commit -m "Setup CI/CD pipeline: GitHub -> Jenkins -> Docker -> EC2"

REM Push to GitHub
echo Pushing to GitHub...
git push origin main

echo.
echo ✅ Successfully pushed to GitHub!
echo Your CI/CD pipeline is now ready.
echo.
pause