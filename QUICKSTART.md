# Quick Start — Veterans Counseling Services CRM

Welcome! This guide gets you up and running in 10 minutes.

## What You Have

A complete, ready-to-use CRM for managing:
- **Volunteers** — Track skills, availability, emergency contacts, background checks
- **Sponsors/Donors** — Manage giving targets and personal giving progress
- **Members** — Track membership tiers, renewal dates, annual dues
- **Board Members** — Manage roles, committees, term dates

## Before You Start

You need:
1. **A Render account** (free at [render.com](https://render.com))
2. **A GitHub account** (free at [github.com](https://github.com))
3. **Your Manus OAuth credentials** (provided by your admin)

## 5-Minute Setup

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Veterans Counseling Services CRM"
git remote add origin https://github.com/YOUR_USERNAME/veterans-crm.git
git push -u origin main
```

### 2. Deploy to Render
Follow the **RENDER_DEPLOYMENT.md** guide (takes ~10 minutes)

### 3. First Login
1. Go to your Render URL
2. Click **"Sign In"**
3. Authenticate with your Manus account
4. You're in!

## Using the CRM

### Dashboard
See live stats: Total Constituents, Volunteers, Board Members, Members

### Manage Constituents
1. Click **"Constituents"** in the sidebar
2. **Add** — Click "Add Constituent" to manually enter someone
3. **Search** — Use filters to find by state, ZIP, area code, contact type
4. **Edit** — Click any constituent to view/edit their profile
5. **Email** — Select constituents and click "Send Email" to open your email client with all recipients

### CSV Import
1. Click **"CSV Import"** in the sidebar
2. Download the template
3. Fill in your constituent data
4. Upload the CSV
5. All records import instantly

### Manage Users
1. Click **"Users"** in the sidebar (admin only)
2. **Invite** — Enter an email and generate an invite link
3. **Promote** — Make someone an admin
4. **Remove** — Delete a user

### Field Reference
Click **"Field Reference"** to see all 35 fields with full specs and validation rules

## Common Tasks

### Import Conference Attendees
1. Export attendee list as CSV
2. Go to CSV Import
3. Upload the file
4. Done! All attendees are now in your CRM

### Send Email to All Volunteers in Florida
1. Go to Constituents
2. Filter: State = "Florida", Contact Type = "Volunteer"
3. Click "Select All"
4. Click "Send Email"
5. Your email client opens with all Florida volunteers

### Add a New Admin
1. Go to Users
2. Enter their email in "Invite New User"
3. Generate invite link
4. Send them the link
5. Once they sign in, click "Promote" to make them admin

### Edit a Constituent
1. Go to Constituents
2. Click on their name
3. Click the pencil icon next to any field
4. Edit and save
5. Changes are instant

## Pricing

- **Render Web Service**: ~$7/month
- **Render PostgreSQL**: ~$15/month
- **Total**: ~$22/month ($264/year)

Free tier available for testing (with limitations)

## Need Help?

**CRM Questions:**
- Check the Field Reference for field definitions
- Read the README.md for detailed documentation

**Render Questions:**
- Visit [render.com/docs](https://render.com/docs)
- Check the RENDER_DEPLOYMENT.md guide

**Technical Issues:**
- Check the Render logs in your dashboard
- Verify all environment variables are set correctly

## Next Steps

1. ✅ Deploy to Render
2. ✅ Invite your team
3. ✅ Import your first batch of constituents
4. ✅ Send your first mass email
5. ✅ Celebrate! 🎉

You're saving thousands of dollars compared to commercial CRM solutions. Use that money to help veterans.

---

**Questions?** Contact your CRM administrator or check the main README.md for detailed documentation.
