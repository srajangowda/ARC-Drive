# 🎯 ARC Drive Deployment Architecture & Flow

## 📊 Complete Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR LOCAL MACHINE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Edit Code (App.jsx, styles, etc.)                           │
│  2. npm run build  → Creates dist/ folder                       │
│  3. Test locally   → npm run preview                            │
│  4. git add .                                                   │
│  5. git commit -m "message"                                     │
│  6. git push origin main                                        │
│                                                                  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ PUSH EVENT
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                            │
├─────────────────────────────────────────────────────────────────┤
│  samrudh04oct/a_r_c                                             │
│  ├── src/                                                       │
│  ├── dist/                                                      │
│  ├── .github/workflows/deploy.yml  ← USES THIS FILE            │
│  ├── Jenkinsfile                                               │
│  └── ...                                                        │
│                                                                  │
│  📌 Webhook Triggered →                                         │
│                                                                  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ GITHUB ACTIONS TRIGGERED
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│               GITHUB ACTIONS WORKFLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  JOB: BUILD                                                     │
│  │                                                              │
│  ├─ Checkout your code                                         │
│  ├─ Setup Node.js 18                                           │
│  ├─ Run: npm ci (clean install)                               │
│  ├─ Run: npm run build                                        │
│  │  └─> Creates optimized dist/ folder                        │
│  └─ Upload dist/ as artifact                                  │
│                                                                  │
│  JOB: DEPLOY (after BUILD completes)                           │
│  │                                                              │
│  ├─ Download dist/ artifact                                   │
│  ├─ Setup SSH with EC2_SSH_KEY secret                         │
│  ├─ Verify SSH connection to EC2                              │
│  ├─ Run rsync to upload dist/ → EC2:/var/www/html/           │
│  ├─ SSH into EC2 and reload Nginx                             │
│  └─ Log success/failure                                        │
│                                                                  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ RSYNC & SSH COMMANDS
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AWS EC2 INSTANCE                             │
├─────────────────────────────────────────────────────────────────┤
│  IP: 54.123.45.67 (YOUR_EC2_IP)                                │
│                                                                  │
│  File System:                                                   │
│  /var/www/html/                                                │
│  ├── app.html                                                  │
│  ├── main-xxx.js    ← React bundled code                       │
│  ├── main-xxx.css   ← Compiled styles                          │
│  ├── logo.jpeg      ← Assets                                   │
│  └── assets/                                                    │
│      ├── bundle files                                          │
│      └── dependencies                                          │
│                                                                  │
│  Services Running:                                              │
│  ├─ Nginx Web Server (port 80)                                │
│  │  └─ Serving /var/www/html/                                │
│  └─ SSH Server (port 22)                                      │
│     └─ For GitHub Actions deployment                         │
│                                                                  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTP REQUEST
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                   END USER BROWSER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  http://54.123.45.67/app.html                                  │
│                                                                  │
│  Browser loads:                                                 │
│  ├─ app.html (1 KB)                                            │
│  ├─ main-xxx.js (315 KB) - React App Code                     │
│  ├─ main-xxx.css (29 KB) - Styles                             │
│  └─ assets/ - Images, icons, etc.                             │
│                                                                  │
│  Result: ✅ Your app is LIVE!                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Deployment Timeline

```
00:00 - You run: git push origin main
        └─> GitHub receives your code push

00:05 - GitHub Actions starts BUILD job
        ├─> Checkout code (5s)
        ├─> Setup Node.js (10s)
        ├─> Install dependencies (45s)
        ├─> Build with Vite (2 min)
        │   └─> Creates optimized dist/ folder
        └─> Upload artifacts (5s)

03:00 - GitHub Actions starts DEPLOY job
        ├─> Download artifacts (5s)
        ├─> Setup SSH agent (2s)
        ├─> Connect SSH to EC2 (2s)
        ├─> Upload via rsync (30s)
        │   dist/ → EC2:/var/www/html/
        ├─> Reload Nginx (5s)
        │   └─> Nginx starts serving your new files
        └─> Log success (2s)

05:00 - ✅ DEPLOYMENT COMPLETE
        Your app is live at: http://YOUR_EC2_IP/app.html

05:00+ - User loads http://YOUR_EC2_IP/app.html
        ├─> Nginx serves app.html
        ├─> Browser loads React (315 KB JS)
        ├─> Browser loads CSS (29 KB)
        ├─> App renders                                          
        └─> User sees your updated app! 🎉
```

---

## 📦 File Flow During Deployment

```
Your Code                GitHub Actions           EC2
──────────               ──────────────           ───

src/
├── App.jsx     ────┐
├── index.css   ────┼──> BUILD ──────┐
└── main.jsx    ────┘               │
                              npm run build
                                    │
                              dist/ ├──> UPLOAD ──┐
                              ├── app.html  │
                              ├── main-*js  │
                              ├── main-*css │
                              └── assets/   │
                                    │       │
                                   rsync   │
                                    │       │
                                    └───────┤──────> /var/www/html/
                                           │
                                      Nginx
                                      Reloaded
                                           │
                                      User Browser
                                           │
                                    ✅ LIVE APP
```

---

## 🔐 Security Flow

```
GitHub Secrets Vault
├── EC2_HOST         (Your EC2 IP)
├── EC2_USER         (ec2-user or ubuntu)
└── EC2_SSH_KEY      (Your private key)
    │
    └─> GitHub Actions (encrypted environment)
        │
        └─> SSH Agent Setup
            │
            └─> SSH Connection to EC2
                │
                └─> Private key authenticated
                    │
                    └─> rsync files securely
                        │
                        └─> Nginx serves your app
```

**Key Point**: Your private key is NEVER visible in logs, NEVER written to disk, NEVER exposed to users.

---

## 📊 Branch & Environment Strategy

```
Local Development
├── Feature Branch
│   └─> git checkout -b feature/new-feature
│       └─> Make changes
│       └─> npm run build (verify locally)
│       └─> git commit & push
│
└── Main Branch (PRODUCTION)
    ├─ Protected Branch
    ├─ Requires PR review (optional)
    ├─ Triggers workflow: deploy.yml
    ├─ Auto-deploys to EC2
    └─> Users get latest version

Current Setup:
- Only main/master branches trigger deployment
- Other branches: Build only, no deploy
- Can be changed in .github/workflows/deploy.yml
```

---

## 🎯 Workflow Decision Tree

```
                    ┌─ MADE CHANGES? ─┐
                    │                  │
                   YES                NO
                    │                  │
                    ↓                  └─> Nothing to do
            ┌─ npm run build ─┐
            │                 │
          PASS              FAIL
            │                 │
            ↓                 ├─> Fix errors
        ┌─ npm run preview ─┐ │  Retry
        │                   │ │
      WORKS              BROKEN
        │                   │
        ↓                   └─> Don't push!
    ┌─ Tests OK? ─┐
    │             │
   YES           NO
    │             │
    ↓             └─> Fix tests
┌─ git push ────┐    Retry
│               │
SUCCESS       FAIL
│             │
↓             └─> Check error message
          GitHub Actions
              Triggered
              │
          ┌─ Build Phase ─┐
          │       │       │
        PASS    FAIL    ...
          │       │
          ↓       └─> Check logs, fix code
      ┌─ Deploy Phase ─┐
      │       │        │
    PASS    FAIL      ...
      │       │
      ↓       └─> Check secrets, SSH key
    ┌─ Verify in Browser ─┐
    │          │          │
   SUCCESS   FAIL       ...
    │          │
    ↓          └─> Check Nginx, permissions
✅ LIVE        Fix and redeploy
```

---

## 📈 Performance Metrics

After each deployment, these are typical values:

```
Build Time:        2-3 minutes
  ├─ Node setup:   10s
  ├─ npm install:  45s
  └─ npm build:    1m 50s

Deploy Time:       30-60 seconds
  ├─ SSH setup:    2s
  ├─ rsync:        20s
  └─ Nginx reload: 5s

Total:             5-10 minutes

Output Size:
  ├─ Minified JS:  315 KB
  ├─ Minified CSS: 29 KB
  ├─ Assets:       ~50 KB
  └─ Total:        ~394 KB (gzipped: ~114 KB)

Browser Load:      1-2 seconds
  ├─ First paint:  300ms
  ├─ Interactive:  1s
  └─ Complete:     2s
```

---

## 🔄 Workflow File Overview

Your `.github/workflows/deploy.yml` handles:

```yaml
name: Deploy Frontend to EC2

on:
  push:                    ← Triggered when you push
    branches:
      - main               ← Only deploy main/master
      - master

jobs:
  build:                   ← Job 1: Build your app
    runs-on: ubuntu-latest ← GitHub Actions runner
    steps:
      - checkout           ← Get your code
      - setup-node         ← Install Node.js
      - npm ci              ← Install deps
      - npm run build       ← Build optimized dist/
      - upload-artifact    ← Save dist/ for deploy job

  deploy:                  ← Job 2: Deploy to EC2
    needs: build           ← Wait for build to complete
    if: github.event_name == 'push'  ← Only on push
    steps:
      - download-artifact  ← Get dist/
      - setup-ssh-agent    ← Load your private key
      - rsync              ← Upload to EC2
      - ssh reload nginx   ← Restart web server
      - log success        ← Report status
```

---

## 🚀 Continuous Deployment Model

```
       Code Push
           ↓
    Build & Test (automated)
           ├─ Success → Deploy to EC2
           └─ Fail    → Notify developer
           
Users Always Get Latest Version ✅
```

This is **Continuous Deployment (CD)** - every push goes live automatically!

---

## 📋 Files Involved in Deployment

```
Your Workspace:
├── src/                          ← Your React code
├── .github/
│   └── workflows/
│       └── deploy.yml            ← DEPLOYMENT CONFIG (UPDATED!)
├── dist/                         ← Output of npm run build
├── vite.config.js               ← Build configuration
├── package.json                 ← Dependencies
└── AWS_EC2_SETUP_GUIDE.md       ← Setup guide
└── DEPLOYMENT_STEPS.md          ← This guide
└── QUICK_DEPLOYMENT_CHECKLIST.md ← Quick reference

GitHub Secrets:
├── EC2_HOST       ← Your EC2 IP
├── EC2_USER       ← SSH username
└── EC2_SSH_KEY    ← Private key (never shown)

EC2 Instance:
└── /var/www/html/
    ├── app.html
    ├── main-*.js
    ├── main-*.css
    └── assets/
```

---

## ✅ Complete Deployment Checklist Summary

**One-Time Setup:**
- [ ] EC2 instance running
- [ ] Nginx installed
- [ ] SSH key configured
- [ ] GitHub secrets set (3 secrets)
- [ ] Workflow file updated

**Every Deployment:**
- [ ] Code pushed to main branch
- [ ] GitHub Actions completes (all green)
- [ ] Files on EC2: `ls /var/www/html`
- [ ] Browser loads: `http://YOUR_EC2_IP/app.html`
- [ ] No console errors (F12)

