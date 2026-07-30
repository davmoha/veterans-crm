# Veterans Counseling Services CRM — CSV Import Template

**How to Prepare and Import Your Constituent Data**

---

## 📋 CSV Template

Use this template to bulk import constituents into your CRM. Download it, fill in your data, and upload it back.

### Required Columns

These columns MUST be present in your CSV file:

```
firstName,lastName,email,phone,state,zipCode,city,address,employer,jobTitle,contactTypes,emailOptIn,smsOptIn,physicalMailOptIn,notes
```

### Column Descriptions

| Column | Required? | Format | Example | Notes |
|---|---|---|---|---|
| `firstName` | Yes | Text | John | First name of constituent |
| `lastName` | Yes | Text | Smith | Last name of constituent |
| `email` | Yes | Email | john@example.com | Must be valid email address |
| `phone` | No | Text | 813-555-1234 | Can be any format (will be normalized) |
| `state` | No | Text | FL or Florida | State abbreviation or full name |
| `zipCode` | No | Text | 33602 | 5-digit ZIP code |
| `city` | No | Text | Tampa | City name |
| `address` | No | Text | 123 Main St | Street address |
| `employer` | No | Text | ABC Corp | Company name |
| `jobTitle` | No | Text | Manager | Job title or position |
| `contactTypes` | No | Text | Volunteer;Board;Member | Semicolon-separated list (see options below) |
| `emailOptIn` | No | Text | true or false | true = opted in, false = opted out |
| `smsOptIn` | No | Text | true or false | true = opted in, false = opted out |
| `physicalMailOptIn` | No | Text | true or false | true = opted in, false = opted out |
| `notes` | No | Text | Any notes | Free-form notes about constituent |

---

## 🏷️ Contact Types

Use these exact values in the `contactTypes` column. Separate multiple types with semicolons (`;`):

- `Volunteer` — Person who volunteers time
- `Board` — Board member
- `Member` — Regular member
- `Donor` — Financial supporter

**Examples:**
- `Volunteer` — Just a volunteer
- `Volunteer;Member` — Both volunteer and member
- `Board;Donor` — Board member who also donates
- `Volunteer;Board;Member` — All three roles

---

## ✅ Sample CSV Data

Here's a complete example with 3 constituents:

```csv
firstName,lastName,email,phone,state,zipCode,city,address,employer,jobTitle,contactTypes,emailOptIn,smsOptIn,physicalMailOptIn,notes
John,Smith,john.smith@email.com,813-555-1234,FL,33602,Tampa,123 Main St,ABC Corp,Manager,Volunteer;Member,true,false,true,Met at conference
Sarah,Johnson,sarah.j@email.com,305-555-5678,FL,33101,Miami,456 Oak Ave,XYZ Inc,Director,Board;Donor,true,true,true,Board member since 2020
Michael,Davis,m.davis@email.com,727-555-9999,FL,34711,Lakeland,789 Pine Rd,123 Services,Coordinator,Volunteer,true,false,false,Interested in memory care programs
```

---

## 🔧 How to Create Your CSV File

### Option 1: Using Excel or Google Sheets

1. **Create a new spreadsheet**
2. **Add the header row** — Copy the column names from above
3. **Add your data** — One constituent per row
4. **Export as CSV**:
   - **Excel**: File → Save As → CSV (Comma delimited)
   - **Google Sheets**: File → Download → CSV

### Option 2: Using a Text Editor

1. **Open Notepad or similar**
2. **Copy the template** from above
3. **Add your data** — One line per constituent
4. **Save as** `constituents.csv`

### Option 3: Converting from Existing Data

If you have data in another system:

1. **Export to CSV** from the original system
2. **Open in Excel or Google Sheets**
3. **Rename columns** to match our template
4. **Add missing columns** (leave blank if not applicable)
5. **Save as CSV**

---

## 📝 Data Entry Tips

### Email Addresses
- **Must be valid** — The system validates email format
- **Must be unique** — No duplicate emails allowed
- **Case-insensitive** — john@example.com = JOHN@EXAMPLE.COM

### Phone Numbers
- **Any format accepted** — (813) 555-1234 or 813-555-1234 or 8135551234
- **Will be normalized** — Stored consistently in the system
- **Area code extracted** — Used for filtering and searching

### State Names
- **Abbreviations OK** — FL, TX, CA, etc.
- **Full names OK** — Florida, Texas, California, etc.
- **Will be normalized** — Stored consistently

### Contact Types
- **Semicolon-separated** — Use `;` to separate multiple types
- **Case-sensitive** — Must be exactly: Volunteer, Board, Member, Donor
- **No extra spaces** — `Volunteer;Member` not `Volunteer ; Member`

### Opt-In Status
- **Use true/false** — Not yes/no or 1/0
- **Lowercase** — true or false (not True or False)
- **Default is true** — If left blank, assumed opted in

---

## ⚠️ Common Mistakes to Avoid

### ❌ Missing Required Columns
```csv
firstName,lastName,phone,address
John,Smith,813-555-1234,123 Main St
```
**Problem:** Missing `email` column (required)
**Fix:** Add `email` column with valid email addresses

### ❌ Invalid Email Format
```csv
firstName,lastName,email
John,Smith,john.smith
```
**Problem:** `john.smith` is not a valid email
**Fix:** Use `john.smith@example.com`

### ❌ Incorrect Contact Type
```csv
firstName,lastName,email,contactTypes
John,Smith,john@example.com,volunteer
```
**Problem:** Should be `Volunteer` (capital V)
**Fix:** Use exact spelling: `Volunteer`, `Board`, `Member`, or `Donor`

### ❌ Multiple Values Without Separator
```csv
firstName,lastName,email,contactTypes
John,Smith,john@example.com,VolunteerMember
```
**Problem:** No separator between types
**Fix:** Use semicolon: `Volunteer;Member`

### ❌ Extra Spaces
```csv
firstName,lastName,email,contactTypes
John,Smith,john@example.com, Volunteer ; Member
```
**Problem:** Extra spaces around values
**Fix:** Remove spaces: `Volunteer;Member`

---

## 🚀 How to Upload Your CSV

1. **Go to CSV Import page** in the CRM
2. **Click "Choose File"**
3. **Select your CSV file**
4. **Click "Upload"**
5. **Review the preview** — Check that data looks correct
6. **Click "Import"** — Constituents are added to the system

---

## ✨ After Import

### Verify the Import
1. Go to **Constituents** page
2. Use search to find imported records
3. Click on a constituent to verify details
4. Check that contact types are correct

### Fix Any Issues
- Click the edit pencil icon on any field
- Correct the data
- Click Save
- Changes are saved immediately

### Next Steps
1. Add more constituents manually or via CSV
2. Invite team members to help manage data
3. Start using search and mass email features

---

## 📊 Import Limits

- **Maximum file size:** 10 MB
- **Maximum constituents per import:** 10,000
- **Maximum imports per day:** 100

For larger imports, contact your organization's technical lead.

---

## 🆘 Troubleshooting

### "CSV upload failed"
- Check that file is in `.csv` format (not `.xlsx` or `.xls`)
- Verify all required columns are present
- Look for invalid characters or encoding issues
- Try uploading a smaller test file first

### "Some rows were skipped"
- Check the error message for which rows failed
- Look for missing required fields (firstName, lastName, email)
- Verify email addresses are valid
- Check for duplicate emails

### "Email addresses are invalid"
- Ensure email format is correct: `name@domain.com`
- Check for extra spaces
- Verify no special characters except @ and .

### "Contact types aren't being recognized"
- Check spelling: `Volunteer`, `Board`, `Member`, `Donor` (capital first letter)
- Use semicolon to separate multiple types: `Volunteer;Member`
- No extra spaces around values

---

## 📞 Need Help?

- **Check the sample data** above for correct format
- **Review the data entry tips** section
- **Contact your CRM administrator** for support

---

## 🎯 Quick Reference

**Required columns:**
- firstName
- lastName
- email

**Optional columns:**
- phone, state, zipCode, city, address, employer, jobTitle, contactTypes, emailOptIn, smsOptIn, physicalMailOptIn, notes

**Contact type values:**
- Volunteer
- Board
- Member
- Donor

**Separators:**
- Semicolon (`;`) for multiple contact types
- Comma (`,`) for column separator

**Boolean values:**
- true (opted in)
- false (opted out)

---

**Ready to import? Download the template and get started!** 📥
