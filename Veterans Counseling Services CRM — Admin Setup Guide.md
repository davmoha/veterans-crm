# Veterans Counseling Services CRM — Admin Setup Guide

**Complete Setup Instructions for Your Organization's Administrator**

---

## 🎯 Your Role as Admin

As the primary administrator, you will:
- Create and manage user accounts
- Add new team members
- Control access levels
- Manage all constituent data
- Configure system settings

This guide walks you through the first-time setup.

---

## ✅ Pre-Deployment Checklist

Before you start, make sure you have:

- [ ] Render account created (render.com)
- [ ] GitHub account created (github.com)
- [ ] Email address for your admin account
- [ ] List of team members to invite
- [ ] Any existing constituent data in CSV format (optional)
- [ ] 10-15 minutes of uninterrupted time

---

## 🚀 Step-by-Step Setup

### Phase 1: Deployment (5 minutes)

**1. Deploy to Render**
- You will receive a "Deploy to Render" button
- Click it and follow the prompts
- Authorize GitHub access
- Select "Create New" for the database
- Click "Deploy"

**2. Wait for Deployment**
- Render will build and deploy your CRM
- This takes 2-3 minutes
- You'll see a green checkmark when complete

**3. Access Your CRM**
- Render will provide a URL (e.g., `veterans-crm.onrender.com`)
- Bookmark this URL
- Open it in your browser

---

### Phase 2: Initial Setup (5 minutes)

**1. Create Your Admin Account**
- Click "Sign In" on the login page
- Click "Sign Up" or "Create Account"
- Enter your email address
- Follow the authentication flow
- You are now logged in as the first admin

**2. Verify Your Admin Status**
- Go to the **Users** page (visible in sidebar)
- You should see your name with "Admin" role
- If not, contact your organization's technical lead

---

### Phase 3: Add Your Team (5 minutes)

**1. Invite Team Members**
- Go to **Users** page
- Scroll to "Invite New User"
- Enter a team member's email
- Click "Generate Invite Link"
- Copy the link
- Send it to them via email

**2. Team Member Joins**
- They receive your email with the invite link
- They click the link
- They create their account
- They are added as a regular user

**3. Promote to Admin (if needed)**
- Go to **Users** page
- Find the team member
- Click "Promote" button
- They are now an admin

---

### Phase 4: Import Data (Optional, 5-10 minutes)

**1. Prepare Your CSV File**
- Download the CSV template from **CSV Import** page
- Fill in your existing constituent data
- Save as `.csv` file

**2. Upload the File**
- Go to **CSV Import** page
- Click "Choose File"
- Select your CSV
- Click "Upload"
- Review the preview
- Click "Import"

**3. Verify the Import**
- Go to **Constituents** page
- You should see all imported records
- Check a few records to ensure accuracy

---

## 🎓 Training Your Team

### For All Users

Have your team review these sections:
1. **Dashboard** — Overview of the CRM
2. **Constituents** — How to view and search records
3. **Mass Email** — How to send emails to groups
4. **Field Reference** — What each field means

### For Admins Only

Have admins review:
1. **Users** — How to manage team members
2. **CSV Import** — How to bulk upload data
3. **Inline Editing** — How to update records

---

## 🔑 Key Workflows

### Adding a Single Constituent

1. Go to **Constituents** page
2. Click **"Add Constituent"** button
3. Fill in the form:
   - First Name (required)
   - Last Name (required)
   - Email (required)
   - Phone
   - Address
   - Contact Type (Volunteer, Board, Member, Donor)
   - Communication preferences
4. Click **Save**
5. Record appears in the list

### Searching for Constituents

1. Go to **Constituents** page
2. Click **"Advanced Filters"**
3. Choose your filters:
   - **State** — Enter "FL" or "Florida"
   - **ZIP Code** — Enter partial or full ZIP
   - **Area Code** — Enter first 3 digits of phone
   - **Contact Type** — Select from dropdown
   - **Email Opt-In** — Choose opted in/out
4. Results update automatically
5. Select constituents with checkboxes
6. Click **"Send Email"** to compose message

### Inviting a New Team Member

1. Go to **Users** page
2. Scroll to **"Invite New User"**
3. Enter their email address
4. Click **"Generate Invite Link"**
5. Link is copied to clipboard
6. Send via email, Slack, or messaging app
7. They click link and create account
8. They appear in Users list as "user" role

### Promoting an Admin

1. Go to **Users** page
2. Find the user in the list
3. Click **"Promote"** button
4. They now have admin access
5. They can manage other users

---

## 🔐 Security Best Practices

### Passwords
- Use strong, unique passwords (12+ characters, mix of upper/lower/numbers/symbols)
- Never share your admin password
- Change password every 90 days

### Admin Accounts
- Limit admin access to trusted team members
- Review admin list monthly
- Remove admins who leave the organization

### Data Privacy
- Only invite people who need access
- Don't share constituent data outside the CRM
- Remind team members about privacy policies

### Backups
- Render automatically backs up your database daily
- You don't need to do anything
- Contact Render support if you need to restore data

---

## 📞 Troubleshooting

### "I can't log in"
- Check that you're using the correct email
- Clear browser cookies and try again
- If you forgot your password, use the "Sign In" page recovery option

### "A team member can't see their invite link"
- Check their spam/junk folder
- Resend the invite link
- Verify their email address is correct

### "The CSV import failed"
- Check that all required columns are present
- Ensure email addresses are valid
- Try uploading a smaller file first
- See the CSV template for correct format

### "I accidentally deleted a user"
- Contact your organization's technical lead
- They can restore from database backups
- Render keeps backups for 30 days

### "The CRM is loading slowly"
- First request to Render can take 30 seconds
- Refresh the page
- Clear browser cache
- Try a different browser

---

## 📋 Monthly Admin Tasks

### Week 1
- [ ] Review user list for inactive accounts
- [ ] Check constituent count and recent additions
- [ ] Verify email opt-in status is current

### Week 2
- [ ] Review and approve any pending invites
- [ ] Check for data quality issues
- [ ] Test CSV import with sample data

### Week 3
- [ ] Backup constituent data (export to CSV)
- [ ] Review admin access list
- [ ] Update team members on new features

### Week 4
- [ ] Monitor system performance
- [ ] Plan for next month's data imports
- [ ] Address any outstanding issues

---

## 🎯 Success Metrics

Track these metrics to measure CRM adoption:

| Metric | Target | How to Check |
|---|---|---|
| Active Users | 80%+ of team | Users page |
| Constituents Added | +50/month | Dashboard stats |
| Mass Emails Sent | 2+ per week | Constituents page |
| Data Quality | 95%+ complete | Constituent detail pages |
| System Uptime | 99.9% | Render dashboard |

---

## 📚 Additional Resources

- **QUICKSTART.md** — Quick reference for common tasks
- **README.md** — Technical architecture overview
- **RENDER_DEPLOYMENT.md** — Detailed deployment steps
- **Render Support** — render.com/support

---

## ✨ Tips for Success

1. **Start with a small pilot** — Add 10-20 test constituents first
2. **Get feedback early** — Ask team members what's working/not working
3. **Document your processes** — Create team guidelines for data entry
4. **Regular training** — Schedule monthly training sessions for new features
5. **Keep it simple** — Don't over-complicate your workflows

---

## 🙏 Thank You

Thank you for taking on this admin role. Your work helps Veterans Counseling Services focus on what matters most — supporting seniors and veterans with memory care challenges.

If you have questions or need support, reach out to your organization's technical lead.

**You've got this! 💪**
