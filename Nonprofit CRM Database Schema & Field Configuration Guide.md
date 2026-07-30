# Nonprofit CRM Database Schema & Field Configuration Guide

This document outlines a comprehensive CRM database schema designed specifically for a nonprofit organization managing Volunteers, Board Members, and general Members. It serves as a technical blueprint for CRM implementation, detailing the data dictionary and field configurations across four core modules.

## MODULE 1: CORE CONSTITUENT PROFILE (Applies to all individuals)

This module establishes the foundational data structure for every individual interacting with the organization, ensuring unified contact management.

| Field Name | Data Type | Functionality & Validation Rules |
| :--- | :--- | :--- |
| **First Name** | Text | **Functionality:** Captures the constituent's given name.<br>**Validation:** Required field. Maximum 50 characters. Must not contain numbers. |
| **Last Name** | Text | **Functionality:** Captures the constituent's family name/surname.<br>**Validation:** Required field. Maximum 80 characters. Used in standard duplicate matching rules. |
| **Primary Email** | Email | **Functionality:** Main email address for communication.<br>**Validation:** Must follow standard email format (e.g., name@domain.com). Checked against existing records to prevent duplicates. |
| **Primary Phone** | Phone | **Functionality:** Main contact number.<br>**Validation:** Must be formatted as a valid phone number based on localization (e.g., (XXX) XXX-XXXX for US). |
| **Mailing Address** | Address (Compound Field) | **Functionality:** Stores physical address components (Street, City, State/Province, Zip/Postal Code, Country).<br>**Validation:** Zip/Postal Code must match the selected Country format. |
| **Account/Household ID** | Lookup Relationship | **Functionality:** Links the individual to a Household or Organization Account to aggregate family or corporate giving/activity.<br>**Validation:** Must link to an existing Account record. |
| **Employer Name** | Text | **Functionality:** Name of the company where the constituent is employed.<br>**Validation:** Optional. Can be converted to a Lookup to an Organization Account if B2B tracking is required. |
| **Job Title** | Text | **Functionality:** Professional title at the listed employer.<br>**Validation:** Maximum 100 characters. |
| **Contact Type** | Multi-select Picklist | **Functionality:** Categorizes the constituent's relationship(s) with the nonprofit.<br>**Validation:** Values: `Volunteer`, `Board`, `Member`, `Donor`. A constituent can hold multiple types simultaneously. |
| **Contact Notes** | Rich Text | **Functionality:** Free-form area for staff to log qualitative interactions or context.<br>**Validation:** No strict character limit; supports formatting (bold, links, lists). |
| **Creation Date** | Date/Time (System) | **Functionality:** Automatically stamps the exact date and time the record was created.<br>**Validation:** Read-only system field. Cannot be manually edited. |
| **Opt-In Email** | Checkbox | **Functionality:** Indicates consent to receive mass email communications.<br>**Validation:** Default is unchecked (or checked based on regional privacy laws like GDPR/CCPA). Triggers inclusion/exclusion in marketing lists. |
| **Opt-In SMS** | Checkbox | **Functionality:** Indicates consent to receive text messages.<br>**Validation:** Default is unchecked. Required to be `True` before automated SMS workflows can execute. |
| **Opt-In Physical Mail** | Checkbox | **Functionality:** Indicates consent to receive direct mail (e.g., newsletters, appeals).<br>**Validation:** Default is checked (opt-out model typically used for direct mail). |

## MODULE 2: VOLUNTEER MANAGEMENT

This module tracks volunteer skills, availability, compliance, and impact, linking directly to the Core Constituent Profile.

| Field Name | Data Type | Functionality & Validation Rules |
| :--- | :--- | :--- |
| **Skills & Interests** | Multi-select Picklist | **Functionality:** Captures areas where the volunteer can contribute.<br>**Validation:** Values (e.g., `Event Support`, `Tutoring`, `Graphic Design`, `Data Entry`). Used to filter volunteers for specific opportunities. |
| **Availability** | Multi-select Picklist (or Matrix) | **Functionality:** Indicates preferred times to volunteer.<br>**Validation:** Values: `Weekday Mornings`, `Weekday Afternoons`, `Weekday Evenings`, `Weekends`. |
| **Emergency Contact Name** | Text | **Functionality:** Name of the person to contact in an emergency.<br>**Validation:** Required if Contact Type includes `Volunteer`. |
| **Emergency Contact Phone** | Phone | **Functionality:** Phone number for the emergency contact.<br>**Validation:** Required if Emergency Contact Name is populated. Must follow valid phone formatting. |
| **Background Check Status** | Picklist | **Functionality:** Tracks the clearance level of the volunteer for sensitive roles.<br>**Validation:** Values: `Pending`, `Passed`, `Failed`. Default is `Pending`. |
| **Background Check Expiration Date** | Date | **Functionality:** The date the current background check expires.<br>**Validation:** Required if Status is `Passed`. Triggers an automated email alert to the volunteer and coordinator 30 days prior to expiration. |
| **Total Hours Worked** | Roll-up Summary | **Functionality:** Calculates the total lifetime volunteer hours.<br>**Validation:** Read-only. Sums the 'Hours Completed' numeric field on all related 'Volunteer Shift' child records where Status = 'Completed'. |
| **Preferred Volunteer Locations** | Multi-select Picklist | **Functionality:** Preferred physical sites for volunteering.<br>**Validation:** Values map to organizational facilities or regions (e.g., `Downtown Center`, `Northside Clinic`, `Remote`). |

## MODULE 3: BOARD OF DIRECTORS GOVERNANCE

This module manages board leadership roles, term limits, and fiduciary responsibilities.

| Field Name | Data Type | Functionality & Validation Rules |
| :--- | :--- | :--- |
| **Board Role/Title** | Picklist | **Functionality:** Designates the specific leadership position on the board.<br>**Validation:** Values: `President`, `Vice President`, `Treasurer`, `Secretary`, `Member-at-Large`. Only one active President allowed at a time. |
| **Committee Assignment** | Multi-select Picklist | **Functionality:** Tracks sub-committee memberships.<br>**Validation:** Values: `Finance`, `Governance`, `Fundraising`, `Marketing`, `Executive`. |
| **Current Term Start Date** | Date | **Functionality:** The date the current board term began.<br>**Validation:** Required if Contact Type includes `Board`. Must be in the past or today. |
| **Current Term End Date** | Date | **Functionality:** The scheduled end date of the current term.<br>**Validation:** Must be strictly greater than the Current Term Start Date. Triggers review workflow 90 days before expiration. |
| **Term Number** | Number | **Functionality:** Indicates which consecutive term the member is serving.<br>**Validation:** Integer only. Minimum value: 1. Used to enforce organizational term limits (e.g., max 3 terms). |
| **Personal Giving Target** | Currency | **Functionality:** The financial "Give-or-Get" goal agreed upon for the fiscal year.<br>**Validation:** Supports two decimal places. Required for all active Board Members. |
| **Give-or-Get Progress** | Formula (Currency) | **Functionality:** Tracks progress toward the Personal Giving Target.<br>**Validation:** Read-only. Formula: `[Roll-up of Won Donations linked to Contact for Current Fiscal Year] + [Roll-up of Soft Credits/Solicited Donations for Current Fiscal Year]`. Can be used to calculate a percentage-to-goal formula field. |

## MODULE 4: MEMBERSHIP MANAGEMENT

This module handles the lifecycle of formal memberships, including tiers, statuses, and financial dues.

| Field Name | Data Type | Functionality & Validation Rules |
| :--- | :--- | :--- |
| **Member Tier** | Picklist | **Functionality:** Defines the level of membership and associated benefits.<br>**Validation:** Values: `Student`, `Individual`, `Family`, `Corporate`, `VIP`. Determines the expected Annual Dues Amount. |
| **Membership Status** | Formula (Text) | **Functionality:** Dynamically calculates current standing based on dates.<br>**Validation:** Read-only. Logic: IF(Membership Expiration Date >= TODAY(), "Active", IF(Membership Expiration Date >= TODAY() - 30, "Grace Period", IF(ISBLANK(Membership Expiration Date), "Pending", "Lapsed"))). |
| **Join Date** | Date | **Functionality:** The original date the constituent became a member.<br>**Validation:** Static field once populated. Never updates upon renewal. |
| **Last Renewal Date** | Date | **Functionality:** The date the most recent membership payment was processed.<br>**Validation:** Automatically updated via workflow when a new membership payment opportunity is marked 'Closed Won'. |
| **Membership Expiration Date** | Date | **Functionality:** The date the current membership privileges expire.<br>**Validation:** Automatically calculated via workflow (e.g., `Last Renewal Date + 365 days` or fixed calendar year end). Triggers automated renewal reminder emails at 60, 30, and 5 days prior. |
| **Unique Member ID** | Auto-Number | **Functionality:** A system-generated unique identifier for membership cards and portals.<br>**Validation:** Read-only. Format: `MEM-{000000}`. Generated upon creation of the membership record. |
| **Annual Dues Amount** | Currency | **Functionality:** The required financial contribution for the selected tier.<br>**Validation:** Can be auto-populated based on Member Tier selection, but allows manual override for discounts/prorations. |
| **Payment History Link** | Related List (or Lookup) | **Functionality:** Connects the constituent to their transactional history.<br>**Validation:** A one-to-many relationship linking the Contact to 'Transaction' or 'Opportunity' records representing dues payments. |
