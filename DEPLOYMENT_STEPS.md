# 🚀 Complete AWS EC2 Deployment Steps

**After fixing SSH authentication issues, follow these steps to deploy your app to AWS.**

---

## 📋 Pre-Deployment Checklist

Before you begin, verify:

- [ ] SSH key extracted and public key added to EC2
- [ ] GitHub secrets set: `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`
- [ ] EC2 instance running with Nginx installed
- [ ] `/var/www/html` directory created on EC2
- [ ] Manual SSH connection test passed: `ssh -i "src/arc-drive.pem" ec2-user@<IP> "echo OK"`
- [ ] Latest code committed to GitHub

---

## 🔄 DEPLOYMENT WORKFLOW

### **Phase 1: Code Preparation (Local Machine)**

#### **Step 1.1: Verify your code is ready**
```bash
cd c:\Users\cool\Desktop\DSU\ARC-Drive

# Check git status
git status

# Expected: All files committed or staged
```

#### **Step 1.2: Ensure build works locally**
```bash
# Install dependencies
npm install

# Build the project
npm run build

# You should see: ✓ built in X.XXs
```

#### **Step 1.3: Test the build locally (optional)**
```bash
# Start preview server
npm run preview

# Visit: http://localhost:4173/app.html
# Verify app loads correctly
# Press Ctrl+C to stop
```

#### **Step 1.4: Commit and push to GitHub**
```bash
# Stage all changes
git add .

# Commit with a message
git commit -m "Prepare for EC2 deployment"

# Push to main branch (this triggers GitHub Actions)
git push origin main

# Expected: Pushing to github.com/samrudh04oct/a_r_c...
```

---

### **Phase 2: Automated Build & Deploy (GitHub Actions)**

#### **Step 2.1: Monitor the GitHub Actions workflow**

1. **Open GitHub**:
   - Go to: https://github.com/samrudh04oct/a_r_c
   - Click: **Actions** tab

2. **Watch the workflow run**:
   ```
   Deploy Frontend to EC2 → 
     ├── build (2-3 min)
     │   ├── Checkout code ✓
     │   ├── Setup Node.js ✓
     │   ├── Install dependencies ✓
     │   ├── Build project ✓
     │   └── Upload artifact ✓
     └── deploy (1 min)
         ├── Download artifact ✓
         ├── Setup SSH Agent ✓
         ├── Deploy files to EC2 via rsync ✓
         ├── Reload Nginx ✓
         └── Deployment Success ✓
   ```

#### **Step 2.2: Check for errors**

**If all green (✓)**: Skip to Phase 3

**If any red (✗)**:
1. Click the failed step to expand
2. Look at the error message
3. Common issues:
   - `Permission denied (publickey)` → Check EC2_SSH_KEY secret
   - `Connection refused` → Check EC2_HOST is correct
   - `rsync: command not found` → rsync should be installed on GitHub runner (already is)

---

### **Phase 3: Verify EC2 Deployment**

#### **Step 3.1: Check files on EC2**
```bash
# SSH into EC2
ssh -i "src/arc-drive.pem" ec2-user@<YOUR_EC2_IP>

# Navigate to web directory
cd /var/www/html

# List files (should see: app.html, etc.)
ls -la

# Expected output:
# total 450
# drwxr-xr-x  5 ec2-user ec2-user   4096 Apr  6 10:30 .
# -rw-r--r--  1 ec2-user ec2-user   1025 Apr  6 10:30 app.html
# -rw-r--r--  1 ec2-user ec2-user    315 Apr  6 10:30 main-*.js
# -rw-r--r--  1 ec2-user ec2-user     29 Apr  6 10:30 main-*.css
# drwxr-xr-x  2 ec2-user ec2-user   4096 Apr  6 10:30 assets/

# Exit EC2
exit
```

#### **Step 3.2: Verify Nginx is running**
```bash
# Check Nginx status
ssh -i "src/arc-drive.pem" ec2-user@<YOUR_EC2_IP> "sudo systemctl status nginx"

# Expected: active (running) ✓
```

#### **Step 3.3: Test from your browser**

Open: `http://<YOUR_EC2_IP>/app.html`

Expected:
- ✅ Page loads
- ✅ No 404 errors
- ✅ CSS and JavaScript work
- ✅ Content visible

---

### **Phase 4: Production Verification**

#### **Step 4.1: HTTP Health Check**
```bash
# From your local machine
curl http://<YOUR_EC2_IP>/app.html

# Expected: HTML content returned with 200 status
```

#### **Step 4.2: Check for common issues**

**Issue: Shows directory listing instead of app.html**
```bash
# SSH into EC2
ssh -i "src/arc-drive.pem" ec2-user@<YOUR_EC2_IP>

# Edit nginx config
sudo nano /etc/nginx/nginx.conf

# Find the server block and add/update:
server {
    root /var/www/html;
    index app.html index.html;
    
    location / {
        try_files $uri $uri/ /app.html;  # Important for SPA!
    }
}

# Save: Ctrl+X, then Y, then Enter
# Reload Nginx
sudo systemctl reload nginx

exit
```

**Issue: CSS/JS files not loading (404)**
```bash
# SSH into EC2 and check file ownership
ssh -i "src/arc-drive.pem" ec2-user@<YOUR_EC2_IP> "ls -la /var/www/html/"

# Files should be owned by ec2-user
# If not, fix permissions:
ssh -i "src/arc-drive.pem" ec2-user@<YOUR_EC2_IP> \
  "sudo chown -R ec2-user:ec2-user /var/www/html && \
   sudo chmod -R 755 /var/www/html"

exit
```

---

## 📊 Step-by-Step Example Deployment

### **Example: Your first deployment**

**Time: ~10 minutes total**

#### **1:00 - Make a change locally** (1 min)
```bash
# Edit a file (e.g., src/App.jsx)
# Change something visible

# Build and test
npm run build
npm run preview
# Verify changes in http://localhost:4173/app.html
# Stop with Ctrl+C
```

#### **1:02 - Commit and push to GitHub** (1 min)
```bash
git add .
git commit -m "Update app title"
git push origin main
```

#### **1:03 - Monitor GitHub Actions** (4-5 min)
```
GitHub → Actions → Click latest workflow
Watch the build complete (~2-3 min)
Watch deploy complete (~1 min)
```

#### **1:08 - Verify on EC2** (1 min)
```bash
# Check files on EC2
ssh -i "src/arc-drive.pem" ec2-user@<IP> "ls -la /var/www/html/"

# Should show your latest files with timestamp ~1:07
```

#### **1:09 - Test in browser** (1 min)
```
http://<YOUR_EC2_IP>/app.html
Refresh: Ctrl+F5 (hard refresh)
See your changes live! ✅
```

---

## 🔄 Ongoing Deployments (After First Success)

For every update:

```bash
# 1. Make changes
# 2. Test locally
npm run build
npm run preview

# 3. Commit and push
git add .
git commit -m "Your message"
git push origin main

# 4. Wait 5-10 minutes for automated deployment
# 5. Verify on EC2: http://<IP>/app.html
```

**That's it!** No manual SSH commands needed after first setup.

---

## 🔍 Monitoring Deployments

### **Real-time logs from GitHub Actions**

1. Go to: https://github.com/samrudh04oct/a_r_c/actions
2. Click the latest workflow
3. Expand each step to see logs
4. Look for:
   - ✅ `✓ built in X.XXs` = Build successful
   - ✅ `✅ Files uploaded successfully` = rsync successful
   - ✅ `✅ Nginx reloaded successfully` = Deployment complete

### **Check EC2 logs**

```bash
# SSH into EC2
ssh -i "src/arc-drive.pem" ec2-user@<YOUR_EC2_IP>

# View Nginx error logs
sudo tail -20 /var/log/nginx/error.log

# View Nginx access logs
sudo tail -20 /var/log/nginx/access.log

# Exit
exit
```

---

## ⚠️ Troubleshooting Deployment Issues

### **Scenario 1: GitHub Actions fails at "Deploy files to EC2 via rsync"**

**Error**: `Permission denied (publickey)`

**Steps**:
1. Verify EC2_SSH_KEY secret is set with full private key content
2. Check the key format (should start with `-----BEGIN RSA PRIVATE KEY-----`)
3. Re-add public key to EC2: `ssh-keygen -y -f src/arc-drive.pem >> ~/.ssh/authorized_keys`

### **Scenario 2: Files uploaded but page shows 404**

**Steps**:
1. SSH into EC2: `ssh -i "src/arc-drive.pem" ec2-user@<IP>`
2. Check files exist: `ls /var/www/html/`
3. Update Nginx config to use `app.html` as fallback:
   ```bash
   sudo nano /etc/nginx/nginx.conf
   # Add: try_files $uri $uri/ /app.html;
   sudo systemctl reload nginx
   ```

### **Scenario 3: Page loads but CSS/JS broken (white page)**

**Steps**:
1. Right-click on page → Inspect → Network tab
2. Check if .css and .js files return 200 status
3. If 404: Check file permissions on EC2
   ```bash
   ssh -i "src/arc-drive.pem" ec2-user@<IP> "sudo chmod -R 755 /var/www/html"
   ```
4. If assets folder missing: Check rsync ran correctly in GitHub Actions logs

### **Scenario 4: Taking too long or stuck**

**Steps**:
1. Check EC2 instance status in AWS Console
2. Check if Nginx is running: `sudo systemctl status nginx`
3. Restart services:
   ```bash
   ssh -i "src/arc-drive.pem" ec2-user@<IP>
   sudo systemctl restart nginx
   exit
   ```

---

## ✅ Deployment Verification Checklist

After each deployment, verify:

- [ ] GitHub Actions workflow completed (all green ✓)
- [ ] SSH command successful (no permission errors)
- [ ] Files present on EC2: `ls /var/www/html/`
- [ ] Nginx running: `systemctl status nginx`
- [ ] Page loads: `curl http://<IP>/app.html`
- [ ] No 404 errors in browser Network tab
- [ ] CSS and JS loaded correctly
- [ ] Content visible and interactive

---

## 📈 What Happens Behind the Scenes

```
Your Code Push
    ↓
GitHub Webhook Triggered
    ↓
GitHub Actions Workflow starts
    ├─ Job 1: Build
    │  ├─ Checkout your code
    │  ├─ Install npm dependencies
    │  ├─ Run: npm run build
    │  └─ Upload dist/ folder
    │
    └─ Job 2: Deploy
       ├─ Download build artifacts
       ├─ Setup SSH with your private key
       ├─ Run rsync to upload dist/ → EC2 /var/www/html/
       ├─ SSH reload nginx
       └─ Done! ✅

App Now Live at: http://<YOUR_EC2_IP>/app.html
```

---

## 🎯 Quick Reference Commands

### **Local Development**
```bash
npm install          # Install dependencies
npm run build        # Build for production
npm run preview      # Test production build locally
npm run dev          # Development mode
```

### **Git Operations**
```bash
git status           # Check changes
git add .            # Stage all changes
git commit -m "msg"  # Commit
git push origin main # Push to GitHub (triggers deploy)
```

### **EC2 Verification**
```bash
# SSH into EC2
ssh -i "src/arc-drive.pem" ec2-user@<IP>

# Check files
ls -la /var/www/html

# Check Nginx
sudo systemctl status nginx

# View logs
sudo tail -20 /var/log/nginx/error.log

# Exit
exit
```

### **Test Deployment**
```bash
# From local machine
curl http://<YOUR_EC2_IP>/app.html
curl -I http://<YOUR_EC2_IP>/app.html  # Headers only
```

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ GitHub Actions shows all green checkmarks
✅ No errors in GitHub Actions logs
✅ Files visible on EC2: `ls /var/www/html/`
✅ Nginx shows "active (running)"
✅ Browser loads: `http://<IP>/app.html`
✅ No errors in browser console (F12)
✅ App is interactive and responsive

---

## 📞 Common Questions

**Q: How often can I deploy?**
A: As often as you want. Just push to main branch.

**Q: Do I need to SSH into EC2 for each deploy?**
A: No! GitHub Actions does it automatically. SSH only needed for setup/troubleshooting.

**Q: What if I need to roll back?**
A: Push previous version to main → GitHub Actions deploys automatically.

**Q: Can I deploy to different environments?**
A: Yes! Create `staging` branch for staging deploys. Edit workflow to support it.

**Q: How do I check deployment history?**
A: GitHub Actions → Actions tab → See all deployment runs with timestamps.

---

## 🚀 Next Steps

1. **Make a small test change** to your code
2. **Commit and push** to main
3. **Watch GitHub Actions** complete the deploy
4. **Visit your app** at `http://<YOUR_EC2_IP>/app.html`
5. **Celebrate!** 🎉

**Estimated time: 10 minutes**

