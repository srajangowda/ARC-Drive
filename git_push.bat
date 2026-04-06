@echo off
echo ================================
echo Git Push - ARC Drive Project
echo ================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if we're in a git repository
git status >nul 2>&1
if errorlevel 1 (
    echo ERROR: Not in a git repository
    echo Run: git init
    pause
    exit /b 1
)

echo Checking git status...
git status

echo.
echo Adding all files to staging...
git add .

echo.
echo Current staged files:
git status --short

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg="Add EC2 deployment scripts and update project files"

echo.
echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo Pushing to remote repository...
git push

if errorlevel 1 (
    echo.
    echo Push failed. Trying to set upstream branch...
    git push --set-upstream origin main
    
    if errorlevel 1 (
        echo.
        echo Still failed. Trying with master branch...
        git push --set-upstream origin master
    )
)

echo.
echo ================================
echo Git operations completed!
echo ================================
echo.
echo Recent commits:
git log --oneline -5

echo.
pause