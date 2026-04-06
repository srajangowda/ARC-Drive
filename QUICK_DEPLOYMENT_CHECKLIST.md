# ⚡ QUICK DEPLOYMENT CHECKLIST

Use this when deploying your ARC Drive app to AWS EC2.

---

## 🔧 Initial Setup Only (One Time)

- [ ] SSH key extracted: `ssh-keygen -y -f src/arc-drive.pem > public_key.pub`
- [ ] Public key added to EC2: `echo "ssh-rsa..." >> ~/.ssh/authorized_keys`
- [ ] EC2_HOST secret added to GitHub (your EC2 IP)
- [ ] EC2_USER secret added to GitHub (ec2-user or ubuntu)
- [ ] EC2_SSH_KEY secret added to GitHub (full private key content)
- [ ] Nginx installed and running on EC2
- [ ] `/var/www/html` directory created and owned by your user
- [ ] Manual SSH test passed: `ssh -i "src/arc-drive.pem" ec2-user@<IP> "echo OK"`

---

## 📦 Every Deployment (Repeat These Steps)

### **1️⃣ Code Preparation** (~2 min)

```bash
# Navigate to project
cd c:\Users\cool\Desktop\DSU\ARC-Drive

# Check status
git status

# Build locally
npm install
npm run build

# ✓ You should see: "built in X.XXs"
```

### **2️⃣ Commit & Push** (~1 min)

```bash
# Stage changes
git add .

# Commit
git commit -m "Your descriptive message"

# Push (triggers automated deployment)
git push origin main

# ✓ Expected output: "Pushing to github.com/..."
```

### **3️⃣ Monitor Deployment** (~5-10 min)

```
🌐 Open: https://github.com/samrudh04oct/a_r_c
📋 Click: Actions tab
👀 Watch the workflow:
   ✓ Build job (2-3 min)
   ✓ Deploy job (1 min)
   ✓ All checks pass (green ✓)
```

| Step | Status | Time |
|------|--------|------|
| Checkout | ✓ | 5s |
| Setup Node.js | ✓ | 10s |
| Install deps | ✓ | 45s |
| Build project | ✓ | 2m |
| Upload artifact | ✓ | 5s |
| Download artifact | ✓ | 5s |
| Setup SSH Agent | ✓ | 2s |
| Deploy with rsync | ✓ | 30s |
| Reload Nginx | ✓ | 5s |
| **Total** | **✓** | **~5-10 min** |

### **4️⃣ Verify Deployment** (~2 min)

#### **Option A: Quick browser test**
```
🌐 Open browser: http://<YOUR_EC2_IP>/app.html
✅ Page loads
✅ No error messages
✅ CSS styling visible
✅ JavaScript works
```

#### **Option B: Command line test**
```bash
# Check files on EC2
ssh -i "src/arc-drive.pem" ec2-user@<YOUR_EC2_IP> "ls /var/www/html/"

# ✓ Should show: app.html, main-*.js, main-*.css, assets/
```

---

## ⏱️ Total Time Per Deployment

| Phase | Time |
|-------|------|
| Code prep | 2 min |
| Commit & Push | 1 min |
| GitHub Actions | 5-10 min |
| Verification | 2 min |
| **Total** | **10-15 min** |

---

## 🔍 If Something Goes Wrong

| Error | Quick Fix |
|-------|-----------|
| ❌ GitHub Actions fails | Check step failed, read error message, verify secrets |
| ❌ SSH Permission denied | Verify EC2_SSH_KEY secret contains full private key |
| ❌ Files not on EC2 | Check rsync step in GitHub logs, verify EC2_HOST is correct |
| ❌ Page shows 404 | Check nginx config has `try_files $uri $uri/ /app.html;` |
| ❌ CSS/JS broken | Check Network tab in F12, files should return 200 status |

---

## 📋 Pre-Deployment Checklist

Before pushing code, ensure:

- [ ] Code changes tested locally
- [ ] No build errors: `npm run build` completes successfully
- [ ] No linting errors (if using linter)
- [ ] All files committed: `git status` shows clean working directory
- [ ] Ready to deploy: `git log --oneline -5` shows your commits

---

## 🚀 Deployment Cycle

```
Write Code
    ↓
Test Locally (npm run build)
    ↓
Commit (git add . && git commit -m "msg")
    ↓
Push to GitHub (git push origin main)
    ↓
GitHub Actions Auto-Deploys
    ↓
Verify in Browser (http://<IP>/app.html)
    ↓
Done! ✅
```

---

## 💡 Pro Tips

✅ **Make small, frequent deployments** - easier to debug
✅ **Write clear commit messages** - helps track changes
✅ **Test locally first** - catch issues before GitHub Actions
✅ **Keep terminal window open** - monitor git output
✅ **Use Ctrl+F5** in browser - forces refresh of cached assets
✅ **Check F12 console** - see JavaScript errors immediately

---

## 📊 Success Indicators

After deployment, verify:

- [ ] GitHub Actions workflow shows all ✓ (green)
- [ ] No errors in GitHub Actions logs
- [ ] `curl http://<IP>/app.html` returns HTML (status 200)
- [ ] Browser loads without errors
- [ ] F12 Console tab shows no red errors
- [ ] Page displays correctly with all styling
- [ ] Interactive features work

---

## 🔧 Troubleshooting Commands

```bash
# Test SSH connection
ssh -i "src/arc-drive.pem" ec2-user@<IP> "echo OK"

# Check files on EC2
ssh -i "src/arc-drive.pem" ec2-user@<IP> "ls -la /var/www/html/"

# Check Nginx status
ssh -i "src/arc-drive.pem" ec2-user@<IP> "sudo systemctl status nginx"

# View Nginx errors
ssh -i "src/arc-drive.pem" ec2-user@<IP> "sudo tail -20 /var/log/nginx/error.log"

# Reload Nginx manually
ssh -i "src/arc-drive.pem" ec2-user@<IP> "sudo systemctl reload nginx"
```

---

## 📸 Expected GitHub Actions Output

**Build Phase:**
```
✓ Checkout code
✓ Setup Node.js 18
✓ Install dependencies (npm ci)
✓ Build project (npm run build)
✓ Upload artifact
```

**Deploy Phase:**
```
✓ Download artifact
✓ Setup SSH Agent
✓ Deploy files to EC2 via rsync
  📤 Uploading files to EC2...
  ✅ Files uploaded successfully
✓ Reload Nginx
  🔄 Reloading Nginx on EC2...
  ✅ Nginx reloaded successfully
✓ Deployment Success
  ✅ ARC Drive deployed successfully to EC2!
```

---

## 🎯 One-Line Deployment

Once setup is complete, deploying is simple:

```bash
git add . && git commit -m "Update" && git push origin main
# Then wait 10 minutes and check http://<IP>/app.html ✅
```

---

## 📞 Help

Unable to deploy?
1. Read [AWS_EC2_SETUP_GUIDE.md](AWS_EC2_SETUP_GUIDE.md) for setup troubleshooting
2. Read [DEPLOYMENT_STEPS.md](DEPLOYMENT_STEPS.md) for detailed steps
3. Check GitHub Actions logs for specific error messages

