# CI/CD Pipeline Setup for ARC Drive

This document outlines multiple CI/CD pipeline options for deploying your ARC Drive application.

## Option 1: GitHub Actions + Vercel (Recommended)

### Setup Steps:
1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com) and sign up
2. **Import Project**: Connect your GitHub repository to Vercel
3. **Get Tokens**: 
   - Go to Vercel Dashboard → Settings → Tokens → Create Token
   - Note your Organization ID and Project ID from project settings
4. **Add GitHub Secrets**:
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `ORG_ID`: Your Vercel organization ID
     - `PROJECT_ID`: Your Vercel project ID

### Features:
- ✅ Automatic deployments on push to master
- ✅ Preview deployments for pull requests
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Free tier available

---

## Option 2: GitHub Actions + Netlify

### Setup Steps:
1. **Create Netlify Account**: Go to [netlify.com](https://netlify.com)
2. **Get Tokens**:
   - Go to User Settings → Applications → Personal Access Tokens
   - Create new token
   - Get Site ID from Site Settings → General
3. **Add GitHub Secrets**:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify token
   - `NETLIFY_SITE_ID`: Your site ID

### Features:
- ✅ Form handling
- ✅ Serverless functions
- ✅ Split testing
- ✅ Analytics
- ✅ Free tier available

---

## Option 3: GitHub Pages (Free)

### Setup Steps:
1. **Enable GitHub Pages**:
   - Go to repo Settings → Pages
   - Source: GitHub Actions
2. **Update vite.config.js**:
   ```javascript
   export default defineConfig({
     base: '/ARC-Drive/', // Your repo name
     // ... other config
   })
   ```

### Features:
- ✅ Completely free
- ✅ Custom domains supported
- ✅ Automatic HTTPS
- ❌ Static sites only
- ❌ No server-side functionality

---

## Option 4: Docker + Cloud Providers

### For AWS ECS/Fargate:
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker build -t arc-drive .
docker tag arc-drive:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/arc-drive:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/arc-drive:latest
```

### For Google Cloud Run:
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/arc-drive
gcloud run deploy --image gcr.io/PROJECT-ID/arc-drive --platform managed
```

### For Azure Container Instances:
```bash
# Build and push to ACR
az acr build --registry myregistry --image arc-drive .
az container create --resource-group myResourceGroup --name arc-drive --image myregistry.azurecr.io/arc-drive:latest
```

---

## Option 5: Traditional VPS/Server

### Using PM2 (Process Manager):
```bash
# On your server
npm install -g pm2
git clone https://github.com/srajangowda/ARC-Drive.git
cd ARC-Drive
npm install
npm run build
pm2 serve dist 3000 --name "arc-drive"
pm2 startup
pm2 save
```

### Using Nginx:
```bash
# Build locally or on server
npm run build

# Copy dist folder to /var/www/arc-drive
sudo cp -r dist/* /var/www/arc-drive/

# Configure nginx (already provided in nginx.conf)
sudo ln -s /path/to/nginx.conf /etc/nginx/sites-available/arc-drive
sudo ln -s /etc/nginx/sites-available/arc-drive /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Recommended Workflow

### For Development:
1. **Feature Branch**: Create feature branches from master
2. **Pull Request**: Open PR when ready
3. **Review**: Code review and automated checks
4. **Merge**: Merge to master triggers deployment

### Environment Strategy:
- **Development**: Local development server
- **Staging**: Preview deployments (Vercel/Netlify)
- **Production**: Master branch auto-deployment

### Monitoring:
- **Vercel**: Built-in analytics and monitoring
- **Netlify**: Analytics and form submissions
- **Custom**: Add Google Analytics, Sentry for error tracking

---

## Security Considerations

### Environment Variables:
```bash
# Add to your deployment platform
VITE_API_URL=https://api.yourdomain.com
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

### Secrets Management:
- Never commit API keys or secrets
- Use platform-specific secret management
- Rotate tokens regularly

### HTTPS:
- All platforms provide automatic HTTPS
- Redirect HTTP to HTTPS
- Use HSTS headers (included in nginx.conf)

---

## Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| Vercel | 100GB bandwidth | $20/month | React apps, global CDN |
| Netlify | 100GB bandwidth | $19/month | JAMstack, forms |
| GitHub Pages | Unlimited public repos | N/A | Open source projects |
| AWS | 12 months free tier | Pay per use | Enterprise, scalability |
| DigitalOcean | $5/month droplet | $5+/month | Full control, learning |

---

## Quick Start Commands

```bash
# Choose one workflow file and delete others
rm .github/workflows/netlify.yml
rm .github/workflows/github-pages.yml

# Commit and push
git add .
git commit -m "Add CI/CD pipeline"
git push origin master
```

The pipeline will automatically trigger on your next push to master!