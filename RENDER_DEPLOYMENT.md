# Deploying to Render — Veterans Counseling Services CRM

This guide walks you through deploying the Veterans Counseling Services CRM to **Render**, a fully managed hosting platform that handles both your application and database.

## Why Render?

- **All-in-one solution** — App + PostgreSQL database in one place
- **Affordable** — ~$22-30/month for 10 users
- **No DevOps required** — Automatic deployments, scaling, and backups
- **Free tier available** — For testing before going live

## Prerequisites

1. **GitHub Account** — Render deploys directly from GitHub
2. **GitHub Repository** — Push your CRM code to a GitHub repo
3. **Render Account** — Sign up at [render.com](https://render.com)

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial Veterans Counseling Services CRM"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/veterans-crm.git
git branch -M main
git push -u origin main
```

## Step 2: Create a PostgreSQL Database on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in the details:
   - **Name**: `veterans-crm-db`
   - **Database**: `veterans_crm`
   - **User**: `postgres`
   - **Region**: Choose closest to your location
   - **Plan**: **Free tier** (or Starter if you want better performance)
4. Click **"Create Database"**
5. Wait 2-3 minutes for the database to be created
6. Copy the **Internal Database URL** (you'll need this in Step 4)

## Step 3: Create a Web Service on Render

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - Click **"Connect a repository"**
   - Authorize Render to access your GitHub
   - Select your `veterans-crm` repository
3. Fill in the deployment details:
   - **Name**: `veterans-crm`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `node dist/index.js`
   - **Plan**: **Free tier** (or Starter for production)
4. Click **"Create Web Service"**

## Step 4: Set Environment Variables

1. In the Render dashboard, go to your web service
2. Click **"Environment"** in the left sidebar
3. Add these environment variables:

```
DATABASE_URL=<paste the Internal Database URL from Step 2>
JWT_SECRET=<generate a random 32-character string>
VITE_APP_ID=veterans-crm
VITE_APP_TITLE=Veterans Counseling Services CRM
VITE_APP_LOGO=https://example.com/logo.png
OWNER_NAME=Your Name
OWNER_OPEN_ID=your-manus-open-id
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=<your-forge-api-key>
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=<your-forge-api-key>
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=<your-analytics-id>
NODE_ENV=production
```

**How to generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

4. Click **"Save"**

## Step 5: Deploy

1. Render automatically deploys when you push to GitHub
2. Go to the **"Deploys"** tab to watch the deployment progress
3. Once complete, your app will be live at `https://veterans-crm.onrender.com` (or your custom domain)

## Step 6: Run Database Migrations

1. SSH into your Render service (or use the shell from the dashboard)
2. Run the database migration:
   ```bash
   pnpm db:push
   ```
3. This creates all the CRM tables

## Step 7: Access Your CRM

1. Go to `https://veterans-crm.onrender.com`
2. Click **"Sign In"** and authenticate
3. You're now live!

## Monitoring & Maintenance

### View Logs
- Click **"Logs"** in the Render dashboard to see real-time application logs

### Database Backups
- Render automatically backs up your PostgreSQL database daily
- Access backups from the database dashboard

### Scaling
- If you exceed the free tier limits, upgrade to a paid plan
- Render handles scaling automatically

## Custom Domain

To use your own domain (e.g., `crm.veteranscounseling.org`):

1. In Render, go to your web service
2. Click **"Settings"** → **"Custom Domain"**
3. Enter your domain and follow the DNS setup instructions
4. Point your domain registrar to Render's nameservers

## Troubleshooting

### "Database connection failed"
- Verify the `DATABASE_URL` is correct
- Check that the database is running in the Render dashboard

### "Build failed"
- Check the deployment logs in Render
- Ensure `pnpm install` completes successfully
- Verify all environment variables are set

### "App keeps crashing"
- Check the logs for error messages
- Ensure the database migrations ran successfully
- Verify all required environment variables are set

## Support

For Render-specific issues, visit [render.com/docs](https://render.com/docs)

For CRM issues, refer to the main README.md or contact your CRM administrator.
