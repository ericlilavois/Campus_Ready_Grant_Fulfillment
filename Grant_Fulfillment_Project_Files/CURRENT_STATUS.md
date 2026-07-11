# Campus Ready Grant Fulfillment — Current Status

**Last Updated:** July 11, 2026  
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
- `Grant_Recipients` — master list of approved students (columns: Application ID, Name, Email, Cohort Year, Housing Status, Acceptance Status, Items Selected, etc.; col Z = Kit Email Sent, col AA = Kit Email Sent At — added July 10, 2026)
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

## Current Phase

**Status as of July 11, 2026:** Ramp guest user setup in progress. 14 draft users created. No invitations sent, no cards issued.

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

**July 11, 2026 changes:**
- `Orientation_Reminder.gs` moved into clasp-managed folder; conflicting function names resolved (`testOrientationReminderEmail`, `sendOrientationReminderEmails`)
- `Menu.gs` fixed: reminder items now point to correct functions; Test appears before Send for every email group; No-Travel email entries added
- `Email_NonAttendee_Lyft.gs` renamed to `Email_NonAttendee_No_Travel.gs`; all internal functions renamed from `Lyft` to `NoTravel`
- Both non-attendee scripts refactored to read docs status from Grant_Recipients and track sends via `Non-Attendee Email Sent` column (auto-created on first run)
- Arianna Deibert removed from non-attendee travel roster — confirmed attending July 15

**June 15, 2026 changes:**
- `Email_Orientation.gs` updated to pull from both `Grant_Recipients` and `Orientation_Guests` tab
- `Orientation_Guests` tab added to Grant Fulfillment Google Sheet (Name / Email columns; 7 guests added)
- `previewOrientationRecipients()` dry-run function added — runs from Apps Script editor, outputs full recipient list to Execution Log with no emails sent
- Resolved `push-scripts gf` auth failure: stale `~/.clasprc-crf.json` fixed by re-running `clasp login` then `cp ~/.clasprc.json ~/.clasprc-crf.json`
- All changes committed and pushed to `ericlilavois/Campus_Ready_GitHub` main

---

## Student Communications Status (as of July 11, 2026)

### Sent / Complete
- July 15 event reminder → 24 attending students (apps, colors, photographer notice)
- Document upload nudge → Lizbeth Pérez Solano (sent 7/9, no reply yet)
- Kit form email resend → Valeria Alexa Hernandez Correa (sent 7/10)
- Travel-confirmation texts → sent 7/10 to attending flight students; Arianna Deibert text sent 7/11 (missed on 7/10 due to RSVP conflict)
- Manual sheet backfill complete (July 11): Z1/AA1 headers added, Z2:Z37 set to Yes in Grant_Recipients
- **Non-attendee No-Travel email** (`Email_NonAttendee_No_Travel.gs`) — sent July 11 to Cristian Fonseca Nunez, Diego Perez Herrera, Fernanda Contreras Alcaraz. Alice Baxter and Xadani Ramirez Herrera skipped — docs pending. Grant_Recipients `Non-Attendee Email Sent` column written.
- **Non-attendee Travel email** (`Email_NonAttendee_Travel.gs`) — sent July 11 to Gabrielle Pina, Lilian Barrientos Aceituno, Anastasia Guerrier. Arianna Deibert removed — confirmed attending July 15. Grant_Recipients `Non-Attendee Email Sent` column written.

### Not Yet Sent
| Audience | What's Needed | Status |
|----------|---------------|--------|
| All students | "Here's what to expect from Ramp" email | Held until travel confirmations land |
| Alice Baxter, Xadani Ramirez Herrera | Non-attendee No-Travel email | Blocked — docs pending. Re-run `sendNonAttendeeNoTravelEmails()` once docs approved — script will send automatically |

### Docs-Pending Students — Status as of July 11, 2026

| Student | RSVP | Impact |
|---------|------|--------|
| Alice Lilliane Baxter | Not attending | Non-attendee email held — re-run script when docs approved |
| Andrea Elia Suarez | Attending w/guest | Handle at event |
| Antonio Rivera | Attending w/guest | Handle at event |
| Jimena Reynaga-Castro | Attending | Handle at event |
| Lizbeth Pérez Solano | Unknown | Follow up — no RSVP on file |
| Marisol Navarro | Attending w/guest | Handle at event; Lyft credit held until docs clear |
| Osvaldo Jr. Ramirez Hernandez | Attending (minor) | Handle at event |
| Wlises Ramirez Santos | Attending | Handle at event |
| Xadani Irais Ramirez Herrera | Not attending | Non-attendee email held — re-run script when docs approved |

### Open Items
- **Alice & Xadani docs:** When approved, re-run `sendNonAttendeeNoTravelEmails()` — script auto-sends and tracks.
- **Arianna stale RSVP row:** Delete her June 26 `not_attending` row from RSVP_Responses (approved July 11).
- **Amara Boerner & Melanie Avila — driving, not flying:** Travel Detail and Ramp show both as Flying. Must be corrected. Set up under gas/hotel Spend Program (same as Anastasia), not flight-restricted program.
- **Daniel Sanchez & Sofia Alvarez (minors, no on-site guardian):** No outreach until release/signature mechanism resolved.
- **Ramp invitations:** 14 draft guest users created, no invites sent. Minor authorization mechanism unresolved before invites can go out.
- **Flight cost estimates:** $135/$200 caps are unverified estimates. Confirm before setting Ramp card limits.
- **Lizbeth Pérez Solano RSVP:** No RSVP on file — follow up directly.

### Comms Framework (Reference)
Six-audience segmentation and travel-confirmation template are documented in DECISION_LOG.md (DEC-028, DEC-029). Re-verify RSVP data against Travel Detail before every send — the Yadira catch proved the RSVP sheet alone is not reliable.

---

## Known Issues / Pending Items

- `START_HERE_New_Agent.md` and `SYSTEM_STATE.md` were lost when Claude project files were not yet version-controlled. This file (`CURRENT_STATUS.md`) replaces those as the agent entry point.
- `TROUBLESHOOTING.md` also lost — should be recreated as issues are encountered and resolved.
- Apps Script files are managed manually (copy-paste to Google Apps Script editor). Step 4 of the automation plan will replace this with direct API push.

---

## Notes for Next Year (2027 Cohort Planning)

These are lessons from the 2026 cycle that should shape how the program is set up before outreach begins — not discovered mid-session.

- **Lock audience segmentation before any outreach starts.** The six-audience breakdown (see DEC-028) was discovered during a drafting session. Next year, map who needs what before writing a single message.
- **Lock companion policy before outreach starts.** The one-guardian / one-night / distance-tier-rate rule (DEC-031) was established reactively in response to Cole. Set it in advance and include it in planning documentation.
- **Data audit before comms planning.** Three data errors surfaced during the July 10 session (Osvaldo's Travel Helper, Yadira's RSVP, Cole's stale travel plan). Run a reconciliation pass — Travel Detail vs. RSVP sheet vs. Ramp roster — before drafting begins. Any comms plan built on dirty data propagates errors to real students.
- **Verify flight cost estimates with live fares before setting card amounts.** The $135/$200 caps were still unverified estimates as of July 10. This should be done before Ramp card limits are configured, not after.
- **Resolve the minors mechanism before invite season.** The Daniel/Sofia situation (minors attending without an on-site guardian) was unresolved going into the event. This needs a decision — release form, designated point of contact, or similar — before any minor is invited or issued a card.
- **Ramp limit increase conversation.** $5K credit limit looks adequate for 2026's estimated $2–3K exposure, but this assumption uses unverified fare inputs. Raise the limit discussion with Ramp before 2027 cohort numbers are set, not under deadline pressure.
- **The travel-confirmation message template (DEC-029) is proven.** Use it as the starting point next year, not something to arrive at after several rounds of editing.

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
