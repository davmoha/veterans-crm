# Nonprofit CRM — Project TODO

## Core CRM Features
- [x] Field Reference Guide (static documentation site)
- [x] Upgrade to full-stack (database, backend, user auth)
- [x] Database schema: constituents, volunteerProfiles, volunteerShifts, boardProfiles, membershipProfiles, webhookLogs
- [x] Dashboard page with stats and getting-started guide
- [x] Constituents list page with search and Add Constituent dialog
- [x] Constituent detail page with tabbed module profiles (Volunteer, Board, Member)
- [x] Wix Integration page with webhook URL, field mapping table, example payload, and logs
- [x] Field Reference page embedded in dashboard layout
- [x] tRPC routers for all CRM modules
- [x] db.ts query helpers for all tables
- [x] Wix webhook receiver endpoint (POST /api/webhook/wix)
- [x] Webhook deduplication by email and Wix submission ID
- [x] Auto-creates Volunteer/Board/Member sub-records based on contactTypes in payload
- [x] Webhook logging to webhookLogs table

## Completed Features
- [x] Inline editing for constituent core profile (with validation)
- [x] Inline editing for volunteer profile
- [x] Inline editing for board profile
- [x] Inline editing for membership profile
- [x] WIX_WEBHOOK_SECRET environment variable setup for production security
- [x] Vitest unit tests for webhook handler and db helpers (16 tests passing)

## Completed: User Invites
- [x] Invite link generation on Users page
- [x] Email input for new team members
- [x] Shareable invite links with copy-to-clipboard
- [x] Non-technical admin workflow

## Future Enhancements (Post-Launch)
- [ ] Add volunteer shift from detail page UI
- [ ] Export constituents to CSV
- [ ] Bulk import from CSV
- [ ] Advanced filtering and segmentation
- [ ] Reporting dashboard with analytics

## Completed: Mass Email Feature
- [x] Advanced search filters (state, zip, area code, contact type, opt-in status)
- [x] Multi-select checkboxes on constituent list
- [x] "Send Email" button that generates mailto: link
- [x] Email composition with selected contacts in To: field
