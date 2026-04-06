# 🚀 AWS EC2 Deployment Setup Guide

## ❌ Current Error Analysis

```
@***: Permission denied (publickey).
rsync: connection unexpectedly closed (0 bytes received so far)
rsync error: unexplained error (code 255)
```

**Root Cause**: SSH key authentication failed - the EC2 instance is rejecting the public key.

---

## ✅ STEP-BY-STEP FIX

### **Step 1: Prepare Your SSH Key**

The PEM file you have (`src/arc-drive.pem`) is your private key. Extract the public key:

#### On Windows (Git Bash or WSL):
```bash
# Extract public key from your private key
ssh-keygen -y -f src/arc-drive.pem > public_key.pub
cat public_key.pub
```

#### On Linux/Mac:
```bash
ssh-keygen -y -f src/arc-drive.pem > public_key.pub
cat public_key.pub
```

You'll see output like:
```
ssh-rsa AAAAB3NzaC1yc2E... (long key)
```

**💾 SAVE THIS OUTPUT** - You'll need it in the next step.

---

### **Step 2: Configure Your EC2 Instance**

#### **Option A: If you already have EC2 running**

1. **SSH into your EC2 instance** (using existing method):
   ```bash
   ssh -i "arc-drive.pem" ec2-user@YOUR_EC2_IP
   ```

2. **Add your public key to authorized_keys**:
   ```bash
   # Create .ssh directory if it doesn't exist
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   
   # Add public key (paste the entire ssh-rsa key from Step 1)
   echo "ssh-rsa AAAAB3NzaC1y..." >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   
   # Verify
   cat ~/.ssh/authorized_keys
   ```

3. **Verify SSH connectivity**:
   ```bash
   exit  # Leave the EC2 instance
   ssh -i "arc-drive.pem" ec2-user@YOUR_EC2_IP "echo 'SSH works!'"
   ```

#### **Option B: If launching new EC2 instance**

1. **Create your key pair in AWS Console**:
   - AWS → EC2 → Key Pairs → Create
   - Download the .pem file
   - **Replace** your `src/arc-drive.pem` with the new one

2. **Launch EC2 with this key pair** (select it during launch)

3. **Verify you can connect**:
   ```bash
   ssh -i "arc-drive.pem" ec2-user@YOUR_NEW_EC2_IP
   exit
   ```

---

### **Step 3: Set Up GitHub Secrets**

Go to: **GitHub → Your Repo → Settings → Secrets and variables → Actions**

#### Add these 3 secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| **EC2_HOST** | Your EC2 IP or Domain | `54.123.45.67` |
| **EC2_USER** | SSH username | `ec2-user` (Amazon Linux)<br>`ubuntu` (Ubuntu)<br>`admin` (Debian) |
| **EC2_SSH_KEY** | Your private key content | Paste entire contents of `arc-drive.pem` |

**How to add EC2_SSH_KEY**:
```bash
# Windows PowerShell
cat src/arc-drive.pem | clip

# Windows Git Bash
cat src/arc-drive.pem | xclip -selection clipboard

# Linux/Mac
cat src/arc-drive.pem | pbcopy
```

Then paste into GitHub secret field.

---

### **Step 4: Configure EC2 for Web Hosting**

SSH into your EC2 instance and run:

```bash
# For Amazon Linux 2
sudo yum update -y
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create web directory
sudo mkdir -p /var/www/html
sudo chown ec2-user:ec2-user /var/www/html
sudo chmod 755 /var/www/html

# For Ubuntu
sudo apt update
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create web directory
sudo mkdir -p /var/www/html
sudo chown ubuntu:ubuntu /var/www/html
sudo chmod 755 /var/www/html
```

#### **Configure Nginx** (for all)

```bash
# Edit nginx config
sudo nano /etc/nginx/nginx.conf
```

Find the `server` block and update:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/html;
    index app.html index.html index.htm;
    
    server_name _;  # Accept all domains
    
    location / {
        try_files $uri $uri/ /app.html;  # For SPA routing
    }
}
```

Save and reload:
```bash
sudo systemctl reload nginx
```

---

### **Step 5: Update Workflow File** ✅ (DONE)

Your workflow file at `.github/workflows/deploy.yml` has been updated with:
- ✅ Better error messages
- ✅ SSH connection verification
- ✅ Timeout configurations
- ✅ Debug output

---

## 🧪 Test Your Setup

### **Test 1: Manual SSH Connection**
```bash
ssh -i "src/arc-drive.pem" ec2-user@YOUR_EC2_IP "echo 'SSH works!'"
```

Expected: `SSH works!`

### **Test 2: Manual rsync**
```bash
rsync -avz -e "ssh -i src/arc-drive.pem" \
  dist/ \
  ec2-user@YOUR_EC2_IP:/var/www/html/
```

Expected: Files uploaded successfully

### **Test 3: Check Nginx**
```bash
curl http://YOUR_EC2_IP/app.html
```

Expected: HTML content returned

---

## 🐛 Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `Permission denied (publickey)` | Public key not in authorized_keys | Run Step 2 again |
| `Connection refused` | SSH not running or EC2 not started | Verify EC2 instance is running |
| `rsync: connection unexpectedly closed` | SSH key path wrong in GitHub | Verify EC2_SSH_KEY secret is set |
| `SSH timeout` | Security group blocking port 22 | Check EC2 Security Group → Inbound Rules → Allow SSH (22) |
| `Nginx returns 404` | Files not uploaded or wrong path | Check `/var/www/html` has files: `ssh ... ls -la /var/www/html/` |

---

## 📋 Checklist

- [ ] Extracted public key from `arc-drive.pem`
- [ ] Added public key to EC2 `~/.ssh/authorized_keys`
- [ ] EC2_HOST secret added to GitHub
- [ ] EC2_USER secret added to GitHub
- [ ] EC2_SSH_KEY secret added to GitHub
- [ ] Nginx installed and running on EC2
- [ ] `/var/www/html` directory created and accessible
- [ ] Manual SSH connection test passed
- [ ] Manual rsync test passed
- [ ] Pushed code to main/master to trigger GitHub Actions

---

## 🚀 After Setup

1. **Commit & push your code**:
   ```bash
   git add .
   git commit -m "Fix AWS deployment configuration"
   git push origin main
   ```

2. **GitHub Actions will automatically**:
   - Build your app
   - Upload to EC2
   - Reload Nginx
   - Deploy goes live! 🎉

3. **Access your app**:
   ```
   http://YOUR_EC2_IP/app.html
   ```

---

## 📞 Need Help?

Check GitHub Actions logs:
1. Go to your repo → Actions tab
2. Click the failed/latest workflow
3. Expand "Deploy files to EC2 via rsync" step
4. Look for error messages

Post the error and I'll help fix it!
