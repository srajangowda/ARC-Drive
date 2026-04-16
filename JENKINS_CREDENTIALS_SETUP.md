# Jenkins Credentials Setup Guide

## 🔧 **Fix the Pipeline Error**

The pipeline failed because Jenkins credentials are not configured. Follow these steps:

## 1. **Add EC2 Credentials in Jenkins**

### Step 1: Access Jenkins Credentials
1. Go to Jenkins Dashboard
2. Click **"Manage Jenkins"**
3. Click **"Manage Credentials"**
4. Click **"System"** → **"Global credentials"**

### Step 2: Add EC2 Host IP
1. Click **"Add Credentials"**
2. **Kind**: `Secret text`
3. **Secret**: `YOUR_EC2_PUBLIC_IP` (e.g., `54.123.45.67`)
4. **ID**: `ec2-host`
5. **Description**: `EC2 Instance Public IP`
6. Click **"OK"**

### Step 3: Add SSH Private Key
1. Click **"Add Credentials"** again
2. **Kind**: `SSH Username with private key`
3. **Username**: `ubuntu`
4. **Private Key**: Click **"Enter directly"**
5. Paste your EC2 private key content (the .pem file content)
6. **ID**: `ec2-ssh-key`
7. **Description**: `EC2 SSH Private Key`
8. Click **"OK"**

## 2. **Required Jenkins Plugins**

Install these plugins if not already installed:
- **SSH Agent Plugin**
- **GitHub Integration Plugin**
- **Docker Pipeline Plugin**

## 3. **Test the Pipeline**

After adding credentials:
1. Go to your Jenkins job
2. Click **"Build Now"**
3. The pipeline should now deploy to EC2 successfully

## 4. **If You Don't Have EC2 Yet**

The updated pipeline will run a **local test deployment** on `http://localhost:8080` if EC2 credentials are missing.

## 🚀 **Pipeline Flow After Fix**
✅ GitHub Push → Jenkins Trigger → Docker Build → EC2 Deploy → Live Website