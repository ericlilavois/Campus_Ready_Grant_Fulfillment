# Grant Fulfillment System — Technical Reference

**Last Updated:** July 13, 2026
**Script Version:** v2.4 (last updated Jun 7, 2026)

> **For current operational status, open items, and what's happening right now:**
> Read `CURRENT_STATUS.md` in `Campus_Ready_Project_Files/` in the `ericlilavois/Campus_Ready_GitHub` repo.
> This file contains technical reference only — Sheets structure, Apps Script functions, product matching logic, and version history.

---

## What This System Does

Campus Ready Foundation provides move-in support grants to first-generation, low-income college students. The Grant Fulfillment System manages collecting student preferences, verifying eligibility documents, and generating shopping lists for fulfillment.

**Student flow:**
1. Student receives a personalized email with a kit customization link (`?id=CR_XXXX`)
2. Student fills out `Customize_Your_Kit.html` — selecting preferences for bedding, towels, slides, personal care, and shipping
3. Student uploads housing verification and college acceptance letter
4. Documents are reviewed and marked Approved or Rejected
5. Rejected documents trigger an automated rejection email with resubmission instructions
6. Once both documents are approved, student is included in shopping list generation
7. Shopping list is generated for the current cohort and used for fulfillment

---

## Infrastructure

| Component | Location / Details |
|-----------|-------------------|
| Student form | `Customize_Your_Kit.html` (hosted on GitHub Pages) |
| API proxy | Vercel (`grant-fulfillment-proxy`) — routes HTML form requests to Apps Script |
| Apps Script | `apps-script/grant-fulfillment/modules/*.gs` in `Campus_Ready_GitHub` repo |
| Apps Script deploy | Run `push-scripts gf` in Terminal — requires Campus Ready Foundation Google account |
| Database | Google Sheets (tabs listed below) |
| Document storage | Google Drive folder ID: `1ccJ8lg40PTgMFIXdNoXyHU12ySgSnurf` |
| GitHub repo | `ericlilavois/Campus_Ready_Grant_Fulfillment` |
| Project files (operational) | `Campus_Ready_Project_Files/` in `ericlilavois/Campus_Ready_GitHub` repo |

**Google Sheets tabs:**
- `Grant_Recipients` — master list of approved students (Application ID, Name, Email, Cohort Year, Housing Status, Acceptance Status, Items Selected, etc.; col Z = Kit Email Sent, col AA = Kit Email Sent At; Non-Attendee Email Sent column auto-created on first non-attendee send)
- `Student_Selections` — raw kit customization submissions
- `Product_Logic` — product catalog with matching criteria (built from PL_* source tabs)
- `Resolver` — matched products per student (auto-populated on form submit)
- `Shopping_List` — generated fulfillment list
- `Errors` — processing error log
- Source tabs: `Bedding`, `Pillows`, `Towels`, `Accessories`, `Universal Products`, `Personal_Care`

---

## Apps Script Functions (Fulfillment Tools Menu)

| Menu Item | Function | What It Does |
|-----------|----------|--------------|
| 1 — Send Kit Form Emails | `sendKitFormEmails()` | Sends personalized kit links to Grant_Recipients; skips rows where Kit Email Sent = Yes; stamps col Z + AA after each send |
| 2 — Send Rejection Emails | `sendRejectionEmails()` | Emails students with rejected documents; shows confirmation dialog first |
| 3 — Generate Shopping List | `generateShoppingList()` | Builds Shopping_List from Resolver (approved students only, current cohort) |
| 4 — Send Testimonial Invites | `sendTestimonialInvites()` | Invites fulfilled students to provide testimonials |
| 5 — Preview/Archive Cohort | `previewArchiveCohort()` / `archiveCohort()` | Archives completed cohort data |
| Admin — Rebuild Product Logic | `rebuildProductLogic()` | Consolidates PL_* source tabs into Product_Logic |
| Admin — Install Triggers | `installTriggers()` | Sets up edit trigger and daily 7am digest |

**Key background functions:**
- `resendKitFormEmailToOne(targetEmail)` — resends kit form email to a single student by email; bypasses the sent flag; use for support cases
- `checkStudentStatus(email)` — validates student by email for the kit form
- `checkStudentStatusById(applicationId)` — validates by Application ID (personalized links)
- `uploadDocuments()` — receives document uploads from the form, saves to Drive, updates Grant_Recipients
- `processLatestSubmission()` — auto-runs resolver on each new form submission
- `sendKitConfirmationEmail()` — sends confirmation email after form submit
- `onGrantRecipientsEdit()` — clears rejection tracking when both docs approved

---

## Product Matching Logic

Students choose: Gender, Scent, Bedding Color, Comforter Cover Color, Pillow Firmness, Towel Color, Style Preference, Slides Size, Slides Color, Deodorant Type, Shipping Preference.

Products are matched by three criteria in `Product_Logic`:
- **GENDER** — Men / Women / Unisex (PNS students get Unisex personal care)
- **SCENT** — matched for hair care products
- **CHOICE FIELD** — matched per product type (e.g., Sheet Set → Bedding Color; Pillow → Firmness; Slides → Size)
- **COLOR_CRIT** — secondary color match (used for Slides color variant)

---

## Version History (Recent)

| Version | Date | Key Changes |
|---------|------|-------------|
| v2.4 | Jun 7, 2026 | Auto-tagging, Resolver inheritance, Filtered Shopping List, Archive Cohort, Personalized kit links (?id=), `rebuildProductLogic()`, `checkStudentStatusById()`, COLOR_CRIT for slide matching, from: alias fix |
| v2.3 | May 2026 | New kit form fields: College Name, College Unit ID, Comforter Cover Color, Slides Color |
| v2.2 | Nov 17, 2025 | Pull cohort_year from Grant_Recipients; update Grant_Recipients on form submit |
| v2.1 | Nov 3, 2025 | Resolver tag inheritance |

---

## Known Issues / Notes

- Apps Script files are managed via clasp (`push-scripts gf`). Never copy-paste directly into the Apps Script editor outside of clasp — files pasted directly are invisible to clasp and will be overwritten or orphaned on the next push (see DEC-036).
- `rebuildProductLogic()` must not run between student submissions and Shopping List generation — would reassign Product IDs and break the Resolver → Shopping List join.
- Kit Confirmation Email: Razor Refills and Toothpaste have no entries in `KIT_EMAIL_IMGS_` — render with blank placeholder. Cosmetic, non-blocking.
- `school_color` and `school_nickname` are not persisted to Student_Selections — a manual re-send would default to CRF teal.
