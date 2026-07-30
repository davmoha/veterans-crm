# Veterans CRM — Render Deployment Guide

**Deploy your CRM in 5 minutes for just $22/month**

---

## Why Render?

Render is the most cost-effective platform for this CRM:

| Platform | Cost/Month | Setup Time | Best For |
|---|---|---|---|
| **Render** | $22 | 5 min | ✓ Recommended |
| Railway | $25 | 5 min | Alternative |
| Vercel + Database | $50+ | 10 min | Not recommended |
| Heroku | $50+ | 10 min | Expensive |
| AWS | $100+ | 30 min | Complex |

**Render is the winner:** Cheapest, fastest, and easiest.

---

## Prerequisites

Before you start, make sure you have:

- [ ] A **Render account** (free) — [render.com](https://render.com)
- [ ] A **GitHub account** (free) — [github.com](https://github.com)
- [ ] The **Veterans CRM code** (provided to you)
- [ ] **10 minutes** of setup time
- [ ] A web browser

---

## Step 1: Create a Render Account

1. Go to [render.com](https://render.com)
2. Click **"Sign Up"** in the top right
3. Choose **"Sign up with GitHub"** (easiest)
4. Authorize Render to access your GitHub account
5. Verify your email address
6. You're done! You now have a free Render account

---

## Step 2: Fork the Veterans CRM Code to GitHub

You need to get the CRM code into your GitHub account so Render can deploy it.

### Option A: Fork from Existing Repository (If Available)

1. Go to the GitHub repository provided
2. Click the **"Fork"** button (top right)
3. Choose your personal account as the destination
4. Wait for the fork to complete
5. You now have your own copy of the code

### Option B: Create a New Repository

If you don't have a link to fork:

1. Go to [github.com/new](https://github.com/new)
2. Name it: `veterans-crm`
3. Set it to **Public**
4. Click **"Create repository"**
5. Upload the CRM code files to this repository
6. (Or ask your technical contact to push the code)

---

## Step 3: Deploy to Render

### 3a. Connect Your GitHub Repository

1. Log in to [render.com](https://render.com)
2. Click **"New +"** button (top right)
3. Select **"Web Service"**
4. Click **"Connect a repository"**
5. Search for `veterans-crm` (or your repo name)
6. Click **"Connect"** next to your repository

### 3b. Configure the Deployment

Fill in the deployment settings:

| Setting | Value |
|---|---|
| **Name** | `veterans-crm` |
| **Environment** | `Node` |
| **Region** | `Oregon (US West)` |
| **Branch** | `main` |
| **Build Command** | `pnpm install && pnpm build` |
| **Start Command** | `node dist/index.js` |

### 3c: Set Environment Variables

Click **"Advanced"** and add these environment variables:

```
DATABASE_URL=<will be provided by Render>
JWT_SECRET=<will be provided by Render>
VITE_APP_ID=<ask your admin>
OAUTH_SERVER_URL=<ask your admin>
VITE_OAUTH_PORTAL_URL=<ask your admin>
OWNER_OPEN_ID=<ask your admin>
OWNER_NAME=<ask your admin>
BUILT_IN_FORGE_API_URL=<ask your admin>
BUILT_IN_FORGE_API_KEY=<ask your admin>
VITE_FRONTEND_FORGE_API_KEY=<ask your admin>
VITE_FRONTEND_FORGE_API_URL=<ask your admin>
```

**Note:** Ask your organization's technical contact for the values marked `<ask your admin>`.

### 3d: Create the Database

1. Still in the deployment form, scroll down
2. Click **"Create a new PostgreSQL database"**
3. Name it: `veterans-crm-db`
4. Render will automatically add `DATABASE_URL` to your environment

### 3e: Deploy!

1. Click the **"Create Web Service"** button
2. Render will start deploying (takes 2-3 minutes)
3. Watch the build logs in real-time
4. When you see "✓ Build succeeded", you're almost done
5. Render will provide a URL like: `veterans-crm.onrender.com`

---

## Step 4: Access Your CRM

1. Wait for the deployment to complete (green checkmark)
2. Click the URL provided by Render (e.g., `veterans-crm.onrender.com`)
3. Your CRM opens in your browser
4. Click **"Sign In"** to create your first admin account
5. Enter your email and create a password
6. You're now logged in as the admin!

---

## Step 5: Verify Everything Works

### Test Checklist

- [ ] You can log in
- [ ] You can see the Dashboard
- [ ] You can go to Constituents page
- [ ] You can add a test constituent
- [ ] You can search for constituents
- [ ] You can go to Users page (admin only)
- [ ] You can invite a new user

If all checks pass, **congratulations!** Your CRM is live. 🎉

---

## Step 6: Invite Your Team

1. Go to the **Users** page (admin only)
2. Click **"Invite New User"**
3. Enter a team member's email address
4. Click **"Generate Invite Link"**
5. Copy the link and send it to them
6. They can click the link to create their account

---

## Troubleshooting

### "Deployment Failed"

**Check the logs:**
1. Go to Render dashboard
2. Click on your service
3. Look at the **"Logs"** tab
4. Find the error message
5. Common fixes:
   - Missing environment variables
   - Wrong Node version
   - Build command failed

**Common Solutions:**
- Make sure all environment variables are set
- Check that the GitHub repository is public
- Verify the build command is correct

### "CRM is Very Slow"

This is normal! Render's free tier "spins down" when inactive. First request takes 30 seconds.

**Solution:** Upgrade to a paid plan ($22/month) to keep it running 24/7.

### "Can't Log In"

- Make sure you created an account first
- Check that your email is correct
- Try clearing your browser cache
- Try a different browser

### "Database Connection Error"

- Make sure the database was created
- Check that `DATABASE_URL` environment variable is set
- Verify the database is running in Render dashboard

---

## Monitoring Your CRM

### Check Status in Render Dashboard

1. Log in to [render.com](https://render.com)
2. Click on your `veterans-crm` service
3. You can see:
   - **Status** — Is it running?
   - **Logs** — What's happening?
   - **Metrics** — CPU, memory, requests
   - **Events** — Deployment history

### Uptime Monitoring

Render provides 99.9% uptime SLA. Your CRM will be available almost all the time.

---

## Upgrading to Paid Plan (Optional)

The free tier is great for testing, but it "spins down" after 15 minutes of inactivity.

To keep your CRM running 24/7:

1. Go to Render dashboard
2. Click on your service
3. Go to **"Settings"**
4. Click **"Change Plan"**
5. Select **"Standard"** ($22/month)
6. Click **"Update"**

That's it! Your CRM now runs 24/7 without spinning down.

---

## Cost Breakdown

### First Year (Sponsored)
- Render Hosting: $264 ($22/month)
- Development: $0 (Donated)
- Setup: $0 (Donated)
- **Total: $264**

### Year 2+ (Self-Funded)
- Render Hosting: $264/year
- **Total: $264/year**

### Compared to Commercial CRM
- Commercial CRM: $500-1,000/month ($6,000-12,000/year)
- Your CRM: $264/year
- **Savings: $5,736-11,736/year**

---

## Next Steps

1. ✓ Deploy to Render (you just did this!)
2. → Read **VETERANS_CRM_ADMIN_SETUP.md** to set up as admin
3. → Read **VETERANS_CRM_QUICKSTART.md** to train your team
4. → Use **VETERANS_CRM_CSV_TEMPLATE.md** to import data

---

## Support

### Render Support
- Render dashboard: [render.com/dashboard](https://render.com/dashboard)
- Render docs: [render.com/docs](https://render.com/docs)
- Render support: [render.com/support](https://render.com/support)

### CRM Support
- See **VETERANS_CRM_QUICKSTART.md** for CRM help
- See **VETERANS_CRM_ADMIN_SETUP.md** for admin help
- Contact your organization's CRM administrator

---

## FAQ

### Q: Will my data be safe?
**A:** Yes! Render encrypts data at rest and in transit. They perform daily backups.

### Q: Can I upgrade to a faster plan?
**A:** Yes! Go to Render dashboard → Settings → Change Plan. Standard plan is $22/month.

### Q: Can I switch to a different hosting provider later?
**A:** Yes! The code is yours. You can deploy to Railway, Heroku, AWS, or self-host anytime.

### Q: What if I need more storage?
**A:** Render automatically scales. You won't run out of space for thousands of constituents.

### Q: Can I use a custom domain?
**A:** Yes! Go to Render dashboard → Settings → Custom Domains. Add your domain there.

### Q: How do I back up my data?
**A:** Render automatically backs up daily. You can also export constituents as CSV anytime.

---

## You're Done! 🎉

Your CRM is now live on Render.

**Next:** Read **VETERANS_CRM_ADMIN_SETUP.md** to set up your admin account and invite your team.

---

**Thank you for supporting Veterans Counseling Services!** 🇺🇸
