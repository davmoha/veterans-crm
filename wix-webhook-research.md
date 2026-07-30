# Wix Webhook Integration Research

## Source
- https://support.wix.com/en/article/the-new-automation-builder-sending-data-via-webhook
- https://sleekflow.io/en-us/blog/integration-guideline-wix-webhooks

## How Wix Sends Webhooks

### Setup Path
Wix Dashboard → Automations → + Create Automation → Start from Scratch → Select trigger (e.g. "Form submitted") → + Add Step → Action → "Send HTTP Request"

### HTTP Request Configuration
- **Method**: POST (for creating records), GET, PUT, DELETE, PATCH, OPTIONS
- **Webhook URL**: The target URL of our CRM backend endpoint
- **Body params options**:
  - "Entire payload" — sends ALL form fields as JSON
  - "Customize structure" — map specific key-value pairs (key = our field name, value = Wix form variable)
- Can preview the structure before activating

### Retry Policy
- Wix expects a 200 status code within 1250ms
- If timeout or non-200: up to 12 retry attempts
- Retry schedule: 1min, 10min, 1hr, 2hr, 2hr, 4hr, 4hr, 4hr, 4hr, 8hr, 8hr, 12hr
- Duplicate events possible — our endpoint must handle deduplication

### Key Notes
- Wix sends form field data as JSON in the POST body
- Field names in Wix payload use Wix's internal field IDs (e.g. "field_firstName", "field_email")
- We need to map these to our CRM schema fields
- Our endpoint must return HTTP 200 quickly to avoid retries

## Our CRM Webhook Endpoint Design

### Endpoint
POST /api/webhook/wix

### Authentication
- Secret token in header: X-Wix-Webhook-Secret: <token>
- Token stored as environment variable WIX_WEBHOOK_SECRET

### Field Mapping (Wix → CRM)
The user will configure in Wix Automations "Customize structure" to send:
- firstName → First Name
- lastName → Last Name  
- email → Primary Email
- phone → Primary Phone
- contactType → Contact Type (Volunteer/Board/Member/Donor)
- memberTier → Member Tier (for membership)
- etc.

### Processing Logic
1. Validate webhook secret
2. Parse JSON body
3. Check for duplicate by email (deduplication)
4. Create or update constituent record
5. Based on contactType, populate module-specific fields
6. Return 200 immediately

## Wix Automation Steps for User
1. Go to Wix Dashboard → Automations → + Create Automation
2. Trigger: "Form submitted" → select your specific form
3. Action: "Send HTTP request"
4. Method: POST
5. URL: https://your-crm-domain.com/api/webhook/wix
6. Add header: X-Wix-Webhook-Secret = [your secret token]
7. Body: "Customize structure" → map each form field to CRM field names
8. Activate
