# Campus Ready Grant Fulfillment — Current Status

**Last Updated:** June 14, 2026  
**Script Version:** v2.4 (last updated Jun 7, 2026)  
**Maintained by:** Eric Lilavois  

---

## What This System Does

Campus Ready Foundation provides move-in support grants to first-generation, low-income college students. The Grant Fulfillment System manages the end-to-end process of collecting student preferences, verifying eligibility documents, and generating shopping lists for fulfillment.

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
| Project files | `Grant_Fulfillment_Project_Files/` folder in this repo — auto-updated by Claude Code Stop hook |

**Google Sheets tabs:**
- `Grant_Recipients` — master list of approved students (columns: Application ID, Name, Email, Cohort Year, Housing Status, Acceptance Status, Items Selected, etc.)
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
| 1 — Send Kit Form Emails | `sendKitFormEmails()` | Sends personalized kit links to Grant_Recipients |
| 2 — Send Rejection Emails | `sendRejectionEmails()` | Emails students with rejected documents; shows confirmation dialog first |
| 3 — Generate Shopping List | `generateShoppingList()` | Builds Shopping_List from Resolver (approved students only, current cohort) |
| 4 — Send Testimonial Invites | `sendTestimonialInvites()` | Invites fulfilled students to provide testimonials |
| 5 — Preview/Archive Cohort | `previewArchiveCohort()` / `archiveCohort()` | Archives completed cohort data |
| Admin — Rebuild Product Logic | `rebuildProductLogic()` | Consolidates PL_* source tabs into Product_Logic |
| Admin — Install Triggers | `installTriggers()` | Sets up edit trigger and daily 7am digest |

**Key background functions:**
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

## Current Phase

**Status as of July 10, 2026:** Ramp guest user setup in progress. 14 draft users created. No invitations sent, no cards issued.

The 2026 cohort is in active fulfillment. Kit form is live. Orientation & Celebration event is July 15 at Napa Valley Community Foundation.

**Ramp virtual card status (as of July 10, 2026):**
- 14 students created as draft guest users in Ramp (Stage 1 complete)
- Invitations not yet published (Stage 2 not started)
- No student has accepted or set up a Ramp account (Stage 3 not started)
- No cards have been issued (Stage 4 not started)
- Marisol Navarro confirmed eligible but not yet added to Ramp — travel mode TBD
- 4 students are minors (Gabrielle Pina, Amara Boerner, Arianna Deibert, Osvaldo Ramirez Hernandez) — authorization mechanism for minors unresolved before invitations can be sent
- Anastasia Guerrier (gas card) needs a separate Ramp Spend Program with fuel/gas MCC restrictions — do not issue under the flight-restricted program

See DEC-027 in DECISION_LOG.md for full detail on the Guest User model and open items.

**Approved student-facing language for explaining virtual cards (from Ramp support):**
> "A virtual card is a digital payment card that's connected to funds allocated to them by your organization's finance team. Rather than using a physical card, they'll receive a secure card number that can be used for approved purchases, such as their college travel expenses. The virtual card draws from the funds your organization has assigned to it and is subject to any spending limits or controls your team has configured."

**June 15, 2026 changes:**
- `Email_Orientation.gs` updated to pull from both `Grant_Recipients` and `Orientation_Guests` tab
- `Orientation_Guests` tab added to Grant Fulfillment Google Sheet (Name / Email columns; 7 guests added)
- `previewOrientationRecipients()` dry-run function added — runs from Apps Script editor, outputs full recipient list to Execution Log with no emails sent
- Resolved `push-scripts gf` auth failure: stale `~/.clasprc-crf.json` fixed by re-running `clasp login` then `cp ~/.clasprc.json ~/.clasprc-crf.json`
- All changes committed and pushed to `ericlilavois/Campus_Ready_GitHub` main

---

## Known Issues / Pending Items

- `START_HERE_New_Agent.md` and `SYSTEM_STATE.md` were lost when Claude project files were not yet version-controlled. This file (`CURRENT_STATUS.md`) replaces those as the agent entry point.
- `TROUBLESHOOTING.md` also lost — should be recreated as issues are encountered and resolved.
- Apps Script files are managed manually (copy-paste to Google Apps Script editor). Step 4 of the automation plan will replace this with direct API push.

---

## How to Orient a New Agent

Tell any new agent: "Read `Grant_Fulfillment_Project_Files/CURRENT_STATUS.md` first, then `Grant_Fulfillment_Project_Files/DECISION_LOG.md` for key decisions, and `Grant_Fulfillment_Project_Files/Brand_Guidelines.md` for tone and design standards. The `Grant_Fulfillment_Project_Files/Application_Rubric.docx` is the rubric used to evaluate grant applications."

**GitHub integration:** This claude.ai project is synced from `ericlilavois/Campus_Ready_Grant_Fulfillment`. All files in `Grant_Fulfillment_Project_Files/` are available via `project_knowledge_search`. To prompt an agent to use them: "Check the GitHub repo for [filename]" or "Use project_knowledge_search to find [topic]."

**Apps Script:** Grant Fulfillment scripts live in `apps-script/grant-fulfillment/modules/` in the `ericlilavois/Campus_Ready_GitHub` repo (not this repo). Deploy with `push-scripts gf` in Terminal — requires Campus Ready Foundation Google account.

---

## Working Principles (Eric's Requirements for All Agents)

- **Read first, act second.** Never assume. Read all relevant files before doing anything.
- **No assumptions.** If something is unclear, ask. Don't guess.
- **Challenge my thinking.** Push back if something doesn't make sense.
- **Show your work.** Explain what you're doing and why.
- **Be direct and candid.** Don't soften bad news or bury concerns.
