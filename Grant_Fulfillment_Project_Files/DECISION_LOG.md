# Campus Ready Grant Fulfillment - Decision Log

**Last Updated:** November 17, 2025  
**Purpose:** Record of all key decisions with rationale and implementation notes

---

## How to Use This Log

**When making a decision:**
1. Add new entry at bottom of relevant section
2. Include: Date, Context, Options, Decision, Rationale
3. Update status as implementation progresses
4. Never delete old decisions - they're historical record

**Decision Status Key:**
- âœ… Approved & Implemented
- â³ Approved but Pending Implementation  
- ðŸ”„ Under Discussion
- âŒ Rejected

---

## Authentication & Access Control

### Decision 1: Email Validation Over Token-Based Access
**Date:** November 13, 2025  
**Status:** âœ… Implemented (Phase 3 Step 1)

**Options Considered:**
1. Token-based system with unique URLs per student
2. Email validation against approved recipient list
3. Google Forms with Apps Script validation

**Decision:** Email validation approach

**Rationale:**
- Simpler to build and maintain (75% less code)
- Better user experience with self-service recovery
- Scales just as well (proven at larger scale)
- Can add tokens later if needed
- Token doesn't solve spam filter issues anyway

**Implementation:**
- Form validates email against Grant_Recipients tab
- Backend function: `checkStudentStatus(email)`
- Client-side typo detection (.con â†’ .com suggestions)
- Warm error messaging for not found/already submitted

---

### Decision 2: Submission Lock Policy
**Date:** November 13, 2025  
**Status:** âœ… Approved

**Decision:** Submissions lock permanently after final submit. No edits through form.

**Rationale:**
- Prevents duplicate orders
- Clear audit trail
- Maintains inventory control
- Manageable support burden at scale (25-50 students)

**Exception Process:**
- Students email hello@campusready.com for changes
- Manual review and update by admin
- Documented in submission notes

---

### Decision 9: Disposable Email Handling
**Date:** November 14, 2025  
**Status:** âœ… Approved

**Decision:** Do NOT block any email domains (including disposable/temporary services)

**Rationale:**
- Small cohort size (25-50 students) makes this manageable
- Board has already vetted recipients
- Risk of false positives outweighs benefit
- Students on approved list are legitimate regardless of domain

---

### Decision 10: DNS Domain Validation
**Date:** November 14, 2025  
**Status:** âœ… Approved

**Decision:** Do NOT implement DNS/MX record validation

**Rationale:**
- Typo detection catches 95%+ of common errors
- DNS validation adds complexity and latency
- Overkill for current scale
- Can be added later if needed

---

## Housing Verification System

### Decision 11: Housing Verification as Fulfillment Gate (Not Selection Filter)
**Date:** November 14, 2025  
**Status:** âœ… Implemented (Phase 3)

**Problem Identified:**
- Housing verification was being used to filter Application Review
- Prevented Board from seeing qualified applicants without housing yet
- Students often apply before housing assignments available

**Decision:** Housing verification is a GRANT FULFILLMENT requirement, not APPLICATION SELECTION requirement

**Rationale:**
- Board needs to see ALL qualified applicants
- Verification confirms ability to RECEIVE products, not eligibility
- Students apply before housing contracts available
- Verification happens AFTER award, BEFORE fulfillment

**Implementation:**
- Removed Housing Verified filter from Final Review
- Added document upload to Grant Fulfillment workflow
- Board sees all scored applicants regardless of housing status

---

### Decision 12: Document Upload Timing in Form
**Date:** November 14, 2025  
**Status:** âœ… Implemented (Phase 3 Step 2)

**Options Considered:**
A) Upload documents BEFORE selecting kit items (verification gate)
B) Upload documents AFTER selecting kit items (more engagement)

**Decision:** Option A - Upload BEFORE item selection

**Rationale:**
- No point customizing kit if student can't receive it
- Forces documentation readiness early
- Students can pause and return when ready
- Prevents wasted effort if verification fails
- Honest approach (non-negotiable requirement up front)

**Student Flow:**
```
Email Validation â†’ Document Upload â†’ [Admin Review] â†’ Kit Selection â†’ Final Submit
```

---

### Decision 13: Document Review Process
**Date:** November 14, 2025  
**Status:** â³ Approved (Phase 4 - Not Built Yet)

**Decision:** Manual admin/Board review required before unlocking item selection

**Process:**
1. Student uploads both documents
2. System stores in Google Drive
3. Grant_Recipients updated: Status = "Uploaded"
4. Conditional formatting highlights row (yellow = needs review)
5. Admin/Board clicks doc URL to view
6. Admin changes dropdown: Uploaded â†’ Approved/Rejected
7. If both Approved: Item selection unlocks
8. If either Rejected: Automated email sent to student

**Status Dropdown Values:**
- **Pending** - Default when transferred to Grant_Recipients
- **Uploaded** - Student submitted via form
- **Approved** - Admin verified document is sufficient
- **Rejected** - Document insufficient, needs resubmission

---

### Decision 14: Document Storage Location
**Date:** November 14, 2025  
**Status:** âœ… Implemented (Phase 3 Step 2)

**Location:** Campus Ready Shared Drive  
**Folder:** "Housing_Verification_&_College_Acceptance_PDFs"  
**Folder ID:** `1ccJ8lg40PTgMFIXdNoXyHU12ySgSnurf`

**File Naming Convention:**
- Format: `{ApplicationID}_{DocType}.pdf`
- Examples: `CR_1758657496058_8l0scy_Housing.pdf`

**Permissions:**
- Admin: Full access
- Board: Read access for verification
- Students: Upload via form only, no direct access

---

### Decision 15: Document Rejection Messaging
**Date:** November 14, 2025  
**Status:** â³ Approved (Phase 4 - Not Built Yet)

**Decision:** Warm, supportive email when documents rejected

**Tone Guidelines:**
- Frame as "we need a bit more information" (not "rejected")
- Reassure grant is still theirs
- Specific about what's needed
- No shame or blame language
- Avoid: "unfortunately," "rejected," "insufficient"

**Implementation:** Automated email triggered by status change to "Rejected"

---

## Error Messages & User Experience

### Decision 5: Error Message Approach
**Date:** November 13, 2025  
**Status:** âœ… Implemented (Phase 3)

**Decision:** Use warm, supportive error messages aligned with Campus Ready brand voice

**Examples:**

**Email Not Found:**
"Please Check Your Email Address - We don't have this email address in our current grant recipients list. A few things to double-check: [helpful tips]. Questions? hello@campusready.com"

**Already Submitted:**
"We've Already Received Your Submission - Thanks for completing your kit customization! We received your choices on [date]. Need to update? Just reach out: hello@campusready.com"

**Tone:**
- Collaborative rather than corrective
- Warm and encouraging
- Clear next steps
- Support always offered

---

### Decision 8: Email Validation Protection
**Date:** November 14, 2025  
**Status:** âœ… Implemented (Phase 3 Step 1)

**Decision:** Multi-layer email validation with typo detection

**Validation Layers:**
1. **Format validation** - Catches basic errors (missing @, spaces)
2. **Typo detection** - Catches common mistakes (.con, .ner, gmail.con)
3. **Backend validation** - Checks against Grant_Recipients tab
4. **Submission re-validation** - Security layer prevents tampering

**Key Features:**
- Red error messages for invalid input
- Typo suggestions ("Did you mean gmail.com?")
- Rate limiting (5 attempts per hour per IP)
- Case-insensitive matching
- Automatic whitespace trimming

---

### Decision 11: Rate Limiting Parameters
**Date:** November 14, 2025  
**Status:** â³ Approved (Not Yet Implemented)

**Decision:** 5 email validation attempts per hour per IP address

**Rationale:**
- Prevents abuse and brute force
- Generous enough for legitimate typos
- Simple to implement
- Low support burden at current scale

**Implementation:** Track attempts by IP in Apps Script properties or lightweight cache

---

## Data Structure & Architecture

### Decision 6: Winner Transfer Workflow
**Date:** November 14, 2025  
**Status:** âœ… Implemented (Phase 1)

**Decision:** "Transfer Winners" button in Application_Reviews populates Grant_Recipients tab

**Workflow:**
1. Board completes all application reviews
2. Board clicks: Grant Fulfillment â†’ Transfer Winners
3. System transfers approved recipients to Grant_Fulfillment_Database
4. Populates Grant_Recipients with essential data
5. Marks as transferred in Application_Reviews
6. Prevents duplicate transfers automatically

**Why This Works:**
- Single source of truth (Grant_Fulfillment_Database)
- Clear approval gate (deliberate Board action)
- No ongoing sync issues
- Can safely run again for late additions

---

### Decision 7: Grant_Recipients Tab Structure
**Date:** November 14, 2025  
**Updated:** November 16, 2025 (Phase 3)  
**Status:** âœ… Implemented

**Final Column Structure:**
1. Application ID
2. Student Name
3. Email Address
4. Cohort Year
5. Transfer Date
6. Housing Status (Pending/Uploaded/Approved/Rejected)
7. Housing Doc URL (Google Drive link)
8. Acceptance Status (Pending/Uploaded/Approved/Rejected)
9. Acceptance Doc URL (Google Drive link)
10. Items Selected
11. Submission Timestamp

**Explicitly Excluded:**
- data_type (not needed for this tab)
- Grant Status (implied by presence in tab)

**Rationale:**
- Focused on validation and tracking
- All necessary data for email validation
- Foundation for future admin dashboard
- Clean, simple structure

---

### Decision 16: Separate Vercel Proxies
**Date:** November 16, 2025  
**Status:** âœ… Implemented (Phase 3)

**Decision:** Create separate Vercel proxy for Grant Fulfillment

**Rationale:**
- Maintains system independence
- No risk of breaking Application form during Grant Fulfillment updates
- Cleaner separation of concerns
- Each system can evolve independently

**Implementation:**
- **Application Proxy:** `https://nodejs-serverless-function-express-xi-ruby.vercel.app/api/proxy` (untouched)
- **Grant Fulfillment Proxy:** `https://grant-fulfillment-proxy.vercel.app/api/proxy` (new)

---

### Decision 17: Apps Script Parameter Validation
**Date:** November 16, 2025  
**Status:** âœ… Implemented (Version 18)

**Decision:** Comprehensive parameter validation in uploadDocuments() function

**Implementation:**
- Check for null/undefined before processing
- Validate data types (string, not empty)
- Validate file structure (name, data properties exist)
- Detailed logging for debugging
- Try-catch for sharing permissions
- Graceful error handling

**Why:**
- Prevents cryptic "Invalid argument" errors
- Makes debugging much easier
- Provides clear error messages to client
- Handles organization policy restrictions

---

## Shopping List & Fulfillment

### Decision 18: Shopping List Generation Filter
**Date:** November 14, 2025  
**Status:** â³ Approved (Phase 5 - Not Built Yet)

**Current Filter:**
```
data_type = "Live" 
AND cohort_year = currentYear 
AND shopping_list_generated = FALSE
```

**New Filter:**
```
data_type = "Live" 
AND cohort_year = currentYear 
AND shopping_list_generated = FALSE
AND housing_status = "Approved"
AND acceptance_status = "Approved"
```

**Rationale:**
- Only generate shopping lists for fully verified students
- Prevents ordering products for students who can't receive them
- Resolver still processes everyone (generates matches for all)
- Verification check happens at fulfillment time

### Decision #15: Use readonly Instead of disabled for Auto-Populated Fields
**Date:** November 17, 2025  
**Status:** âœ… Implemented

**Context:** When name and email fields were set to `disabled = true`, they didn't submit with FormData, causing "null" values on the review page.

**Decision:** Use `readOnly = true` instead of `disabled = true`

**Rationale:** 
- Readonly fields ARE included in FormData
- Readonly fields can't be edited by users (security requirement met)
- Readonly fields can still be styled to look disabled (grey background)

**Implementation:** Changed lines in both upload success handler and already-approved handler from `nameField.disabled = true` to `nameField.readOnly = true`

---

### Decision #16: Manual Button Advancement After Document Upload
**Date:** November 17, 2025  
**Status:** âœ… Implemented

**Context:** Form was automatically advancing after 2.5 seconds, giving students no time to review success message.

**Decision:** Replace automatic setTimeout with manual button click

**Rationale:**
- Gives students control over pacing
- Ensures fields are fully rendered before population
- Better user experience (no rushing)
- Allows students to review success message

**Implementation:** 
- Removed 2.5 second setTimeout
- Added "Continue to Personalize Your Kit" button
- Button triggers section display and field population
- Hides original "Continue to Kit Selection" button to avoid confusion
- Uses 100ms delay only for DOM rendering, not user control
---

## Future Work & Deferred Decisions

### Admin Dashboard (Future)
**Date:** November 13, 2025  
**Status:** â³ Future Work

**Planned Functionality:**
- List of all approved recipients
- Submission status tracking
- Shipping preference indicators
- Quick filters for pending submissions
- Export capability

**Current State:** Grant_Recipients tab tracks all necessary data manually

---

### Application_Reviews Enhancement (Future)
**Date:** November 14, 2025  
**Status:** â³ Future Work

**Proposed:**
1. **Archive Tab** - Students who received grants (moved after transfer)
2. **Denied Tab** - Non-selected applicants (privacy maintained)

**Open Questions:**
- Automatic with transfer button or separate process?
- What data moves to each tab?
- How long to retain denied applicant data?
- Privacy considerations?

---

### Impact Analysis Tab (Future)
**Purpose:** Track and visualize grant impact metrics for donor reporting

**Required Metrics:**
- Students served per cohort
- Total grant value distributed
- Kits delivered on time
- Geographic distribution
- Cost per student analysis

**Timeline:** TBD after Phase 5 completion

---

## Implementation Timeline

**Completed:**
- âœ… Phase 0: Transfer Winners button (Nov 14)
- âœ… Phase 1 & 2: Grant_Recipients structure (Nov 14)
- âœ… Phase 3 Step 1: Email validation (Nov 15)
- âœ… Phase 3 Step 2: Document upload (Nov 16)

**Next:**
- â³ Phase 4: Admin review interface
- â³ Phase 5: Shopping list filter

**Future:**
- Application_Reviews enhancement
- Impact analysis tab
- Admin dashboard

---

## Decision Template (Copy for New Decisions)

```markdown
### Decision #XX: [Title]
**Date:** [Date]
**Status:** [Status]

**Context:** [What problem are you solving?]

**Options Considered:**
1. Option A - [pros/cons]
2. Option B - [pros/cons]

**Decision:** [What you chose]

**Rationale:**
- [Why you chose it]
- [Key factors]
- [Trade-offs accepted]

**Implementation:** [How it works or will work]
```

---

## Document Change History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Nov 14, 2025 | Initial decision log | Claude |
| 2.0 | Nov 14, 2025 | Grant_Recipients final structure, Application_Reviews future work | Claude |
| 3.0 | Nov 17, 2025 | Streamlined format, added Phase 3 decisions, updated status | Claude |

---

**This log preserves decision history. Never delete entries - they show how we got here.**

---

---

## Infrastructure Decisions — June 14, 2026

### DEC-024: Apps Script Modularization — Monolithic File Deleted

**Context:** `Grant_Fulfillment_Script.gs` (3,893 lines) coexisted with a modular `modules/` directory. Both had overlapping function names, creating risk of conflicts on push.

**Decision:** Deleted `Grant_Fulfillment_Script.gs`. The `modules/` directory is the live, canonical version (v2.4). Confirmed live script working before deletion.

**Status:** Complete.

---

### DEC-025: Apps Script Deployment via clasp

**Context:** Apps Script changes required manual copy-paste into the Google Apps Script editor — slow and error-prone.

**Decision:** Installed clasp (v3.3.0). Set up `push-scripts` terminal command. Two Google accounts managed via credential files (`~/.clasprc-crf.json` for Campus Ready Foundation, `~/.clasprc-ds.json` for DormShopper). Run `push-scripts gf` to deploy Grant Fulfillment, `push-scripts app` for Application system.

**Status:** Complete. All four Apps Script projects (GF, Application, DormShopper, STEM) wired up.

---

### DEC-026: Branch Strategy Clarified

**Context:** Needed clarity on what goes to staging vs main.

**Decision:** Staging branch is for app HTML only (`Customize_Your_Kit.html` and related form files). Project files, docs, and Apps Script files commit directly to main.

**Status:** Active going forward.

---

### DEC-027: Ramp Guest User Model for Student Virtual Cards
**Date:** July 10, 2026
**Status:** ⏳ In Progress — Stage 1 complete, Stages 2–4 not started

**Context:** Ramp's card issuance model is built around employees. Grant recipients are external, non-employee individuals. Ramp support confirmed the correct model on July 10, 2026.

**Decision:** Students are added as Guest Users (available on Ramp Plus), not employees. All current guest users are assigned to a "Student" department under a single shared manager. Card issuance runs in four distinct stages, each requiring a separate admin action:

1. **Draft user created** — student exists in Ramp, cannot log in, no email sent.
2. **Invite published** — admin publishes from People > Invites; triggers invitation email.
3. **Student accepts** — student sets up their own Ramp account.
4. **Admin issues virtual card** — only after acceptance, by explicit admin action. Guest users cannot request their own cards or funds, and cannot receive physical cards — virtual only.

**Rationale:** The Guest User model is the correct fit for issuing one-time, restricted-purpose funds to non-employees. It keeps card issuance a deliberate, per-student decision rather than something that happens automatically at invite-acceptance. "Student has a Ramp identity" and "student can spend money" are two distinct, deliberate steps.

**Current Roster (14 draft guest users, as of July 10, 2026):**

| # | Name | Purpose | Minor? |
|---|------|---------|--------|
| 1 | Elizabeth Carmichael | Flight | |
| 2 | Gabrielle Pina | Flight | Yes |
| 3 | Jimena Reynaga-Castro | Flight | |
| 4 | Lilian Barrientos Aceituno | Flight | |
| 5 | Nicholas Avery Joy | Flight | |
| 6 | Amara Boerner | Flight | Yes |
| 7 | Arianna Deibert | Flight | Yes |
| 8 | Michelle Villafana | Flight | |
| 9 | Osvaldo Ramirez Hernandez | Flight | Yes |
| 10 | Henry Ray | Flight | |
| 11 | Journey Penterman | Flight | |
| 12 | Melanie Avila | Flight | |
| 13 | Reese Oo | Flight | |
| 14 | Anastasia Guerrier | Gas card (driving to school) | |

**Not yet in Ramp:** Marisol Navarro — previously marked ineligible, now confirmed eligible. Travel mode and card type not yet confirmed. Do not add to Ramp until confirmed.

**Open Items:**
- **Minors authorization unresolved.** Four students (Gabrielle Pina, Amara Boerner, Arianna Deibert, Osvaldo Ramirez Hernandez) are minors. Who accepts the invite and uses the card on their behalf needs a decision before invitations are published for these four.
- **Per-student dollar amounts not independently verified.** Cross-country/short-haul ceilings ($200 / $135) come from the pro forma. Whether individual fare figures are live quotes, historical averages, or estimates has not been confirmed.
- **Anastasia's gas card needs a separate Spend Program.** The existing Spend Program has airline-MCC restrictions. A second Spend Program with fuel/gas-station MCC restrictions is needed — do not issue her card under the flight-restricted program.

**Status:** Stage 1 complete. No invitations sent. No cards issued.

---

---

## Student Communications — July 2026

### DEC-028: Six-Audience Segmentation for 2026 Cohort Comms
**Date:** July 10, 2026
**Status:** ✅ Active framework — use for all cohort communications

**Decision:** The 35-student cohort is not one audience. All communications must be segmented across six distinct groups, each requiring different content, channel, and timing:

1. **Attending, no travel involvement** — event info only
2. **Attending, travel-involved** — event info + travel confirmation
3. **Non-attending, no travel** — full orientation content replacement + any applicable program info
4. **Non-attending, travel-involved** — full orientation replacement + travel confirmation question
5. **Minors attending without an on-site guardian** — above as applicable, but no outreach until guardian/release mechanism is resolved (see Open Items)
6. **Never RSVP'd** — status unknown; handle separately before segmenting further

**Rationale:** Sending one message to all recipients either overloads students who need less, or shortchanges those who need more — particularly non-attendees who get nothing in person and need a full replacement for orientation content.

**Important:** Re-verify RSVP data against Travel Detail before every send. The Yadira catch (text confirmation not reflected in RSVP sheet) proved the sheet is not reliably current.

---

### DEC-029: Travel-Confirmation Message Template
**Date:** July 10, 2026
**Status:** ✅ Approved — use for all individual travel outreach

**Decision:** Travel-confirmation messages state the assumption as a fact and ask only whether that arrangement is being used — not whether the terms are negotiable.

**Correct framing:** State the plan ("We have you flying from [airport] on [date]..."), then ask a contained yes/no question ("Does that still work, or has something changed?").

**Incorrect framing:**
- "Is this still the plan?" — implies a conversation that never happened
- Open-ended questions about dates, companions, or preferences — invites scope negotiation the program isn't built to grant case by case

**Why:** This approach was arrived at through several editing rounds. The right balance is responsive enough to catch real changes (like Cole's stale travel plan) without opening the door to requests for different dates or additional companions.

**Worked example:** The Cole (Nicholas Avery Joy) reply is the canonical reference — note the correction from "Yesterday" to "You mentioned" since his email's actual send-time relative to "today" was unconfirmed.

---

### DEC-030: Codes Sent by Text Only — Never Email
**Date:** July 10, 2026
**Status:** ✅ Active rule

**Decision:** Any redeemable code (Ramp card codes, gift card codes, etc.) goes to students by text only. Never by email.

**Rationale:** A redeemable code sitting in an email inbox is a real security exposure — forwarded, screenshotted, or accessed on a shared device.

---

### DEC-031: Companion Policy — Uniform Terms
**Date:** July 10, 2026
**Status:** ✅ Active — apply uniformly regardless of when need surfaces

**Decision:** One parent or guardian may accompany a student. One hotel night covered at the standard rate for that student's distance tier. This applies whether the need was stated on the application, raised in a text reply, or mentioned in an unprompted email.

**Rationale:** Established in response to the Cole situation. Uniform application regardless of timing prevents case-by-case negotiation and gives a consistent answer to any similar request going forward.

---

### DEC-032: Travel Detail as Authoritative Data Source
**Date:** July 10, 2026
**Status:** ✅ Active rule

**Decision:** Travel Detail sheet (not Grant_Recipients) is the authoritative source for travel mode, route, and companion status. Even so, Travel Detail should be treated as a starting assumption to confirm — not a fact to build on without verification.

**Rationale:** Three data errors surfaced mid-session: Osvaldo's Travel Helper field didn't match the Ramp roster, Yadira's RSVP status didn't reflect her text confirmation, and Cole's travel plan was stale by the time outreach happened. Any comms plan built on unverified data propagates errors to real students.

---

### DEC-033: Kit Email Sent Flag Added to Grant_Recipients
**Date:** July 10, 2026
**Status:** ✅ Implemented

**Context:** Valeria Alexa Hernandez Correa (valeriahernandezcorrea96@gmail.com) reported never receiving her kit form email despite being in Grant_Recipients. The original `sendKitFormEmails()` had no "already sent" tracking — it would blast every student in the sheet every time it ran, with no record of prior sends.

**Decision:** Add `Kit Email Sent` (col Z) and `Kit Email Sent At` (col AA) columns to Grant_Recipients. `sendKitFormEmails()` now skips any row where `Kit Email Sent = Yes` and stamps both columns after each successful send.

**Resend path:** `resendKitFormEmailToOne(targetEmail)` bypasses the flag intentionally — use it when a student claims they never received the email. It also updates the flag after sending.

**Backfill:** All 2026 cohort rows were manually set to `Yes` in col Z after the initial send was confirmed complete. Valeria's row was included in the backfill after her resend was confirmed sent on July 10, 2026.

**Rationale:** Without a sent flag, a future accidental re-run would blast all students again. The flag also creates an audit trail for support cases like Valeria's.

---

---

## Student Communications — July 11, 2026

### DEC-034: Non-Attendee Lyft-Only Email Segment
**Date:** July 11, 2026
**Status:** ✅ Built — `Email_NonAttendee_Lyft.gs` pushed to Campus_Ready_GitHub main

**Context:** Five students are not attending the July 15 event and have no flight or drive travel support. Their only travel benefit is a Lyft credit to reach campus or the airport. A separate email file was needed — distinct from `Email_NonAttendee_Travel.gs` — because there is no travel card section and no Ramp virtual card for this group.

**Students:** Alice Baxter (UC Santa Cruz), Cristian Fonseca Nunez (UC Davis), Diego Perez Herrera (San Jose State), Fernanda Contreras Alcaraz (UC Davis), Xadani Ramirez Herrera (USF).

**Decision:** Build a standalone `Email_NonAttendee_Lyft.gs` matching the design of `Email_NonAttendee_Travel.gs`. Two cards only: teal (Lyft $150 + DoorDash $100, text to claim), yellow (Target $100 gift card, conditional on docs). No travel card. `docsApproved` flag per student controls gift card copy.

**Docs-pending students:** Alice Baxter and Xadani Ramirez Herrera have `docsApproved: false` as of July 11. Cristian, Diego, and Fernanda are assumed approved (not in docs-pending list) — verify before send.

**Rationale:** Docs-pending status does not block sending — the email already handles it gracefully ("once your documents are approved"). Waiting is worse than sending for non-attendees who are getting nothing in person.

---

### DEC-035: RSVP Data Hierarchy and Arianna Deibert Conflict
**Date:** July 11, 2026
**Status:** ⏳ Open — Arianna's status needs confirmation before Email_NonAttendee_Travel.gs is sent

**Context:** The RSVP CSV contains two entries for Arianna Deibert with the same Application ID (CR_1774546309268_wqskn8): one from June 26 (`not_attending`) and one from July 10 (`attending`). The July 10 entry's columns appear shifted, suggesting a late entry or data anomaly. The non-attendee travel email has her hardcoded as a recipient.

**Decision:** Do not send Email_NonAttendee_Travel.gs to Arianna until her RSVP status is confirmed directly. If she is now attending, remove her from the non-attendee email roster and handle at the event. If she is still not attending, her current email entry (flight SFO → San Diego, `docsApproved: false`) is correct.

**Rule going forward (reinforces DEC-032):** When an RSVP CSV contains duplicate entries for the same student, the most recent timestamp wins — but verify with the student before acting on it when the change affects what they receive.

---

## Apps Script Infrastructure — July 11, 2026

### DEC-036: Orientation_Reminder.gs Naming Conflict Resolved
**Date:** July 11, 2026
**Status:** ✅ Resolved

**Context:** Running `testOrientationEmail()` from the Apps Script editor was sending the reminder email instead of the invitation with RSVP buttons. Root cause: `Orientation_Reminder.gs` had been manually copy-pasted into the Apps Script editor directly (not via clasp), giving it identical function names to `Email_Orientation.gs` — specifically `testOrientationEmail()` and `sendOrientationEmails()`. Apps Script's behavior with duplicate function names is unpredictable and was silently running the wrong function.

A secondary issue: Menu.gs had the reminder menu items pointing to the wrong functions (the invitation functions), compounding the confusion.

**Decision:** 
1. Create `Orientation_Reminder.gs` in the clasp-managed folder (`Campus_Ready_GitHub/apps-script/grant-fulfillment/`) with all conflicting names resolved:
   - `testOrientationEmail()` → `testOrientationReminderEmail()`
   - `sendOrientationEmails()` → `sendOrientationReminderEmails()`
   - `buildEmailHtml()` → `buildReminderEmailHtml()`
2. Fix Menu.gs reminder entries to point to the renamed functions.
3. Reorder menu so Test always appears before Send for every email group.

**Rule going forward:** All Apps Script files must live in the clasp-managed folder. Never copy-paste directly into the Apps Script editor outside of clasp. Files pasted directly into the editor are invisible to clasp and will be overwritten or orphaned on the next push.

---

### DEC-037: Non-Attendee Emails Gated on Docs Approval
**Date:** July 11, 2026
**Status:** ✅ Implemented

**Context:** Both non-attendee email scripts (`Email_NonAttendee_No_Travel.gs` and `Email_NonAttendee_Travel.gs`) originally used a hardcoded `docsApproved` flag per student. This required manual updates before each send and created risk of sending grant benefit information to students who had not yet qualified.

**Decision:** Remove the hardcoded `docsApproved` flag from both rosters. Both scripts now read `Housing Status` and `Acceptance Status` directly from Grant_Recipients at send time. A student is only eligible to receive an email if both fields equal `Approved`. Students with `Pending` or `Uploaded` status are skipped automatically.

**Effect for July 11 send:**
- No-Travel email: Cristian, Diego, Fernanda sent. Alice Baxter and Xadani Ramirez Herrera skipped (docs pending).
- Travel email: Gabrielle Pina, Lilian Barrientos Aceituno, Anastasia Guerrier sent. Arianna Deibert removed from roster entirely (confirmed attending July 15 event).

**Re-run behavior:** If Alice or Xadani upload and get approved after July 11, re-running the send function will reach them automatically — no code changes needed.

---

### DEC-038: Non-Attendee Email Sent Tracking Column
**Date:** July 11, 2026
**Status:** ✅ Implemented

**Decision:** Both non-attendee email scripts auto-create a `Non-Attendee Email Sent` column in Grant_Recipients on first run if it doesn't exist. After a successful send, the script writes `Yes` to that student's row. On any subsequent run, students marked `Yes` are skipped.

**Rationale:** Mirrors the `Kit Email Sent` pattern (DEC-033). Prevents duplicate sends if the script is re-run for new doc approvals. Creates an audit trail of who was contacted and when.

---

## Student Communications — July 11, 2026 (continued)

### DEC-039: File Renamed — Email_NonAttendee_Lyft → Email_NonAttendee_No_Travel
**Date:** July 11, 2026
**Status:** ✅ Implemented

**Decision:** Renamed `Email_NonAttendee_Lyft.gs` to `Email_NonAttendee_No_Travel.gs` locally and in Apps Script editor. All internal function names updated from `Lyft` to `NoTravel` (`testNonAttendeeNoTravelEmails`, `sendNonAttendeeNoTravelEmails`). Menu.gs updated to match.

**Rationale:** "Lyft" described one component of the email, not the audience. "No Travel" is the correct descriptor — this group has no flight or drive travel support, only a Lyft credit for local transport. Naming consistency with `Email_NonAttendee_Travel.gs` makes the system easier to navigate.

---

### DEC-040: Arianna Deibert — Confirmed Attending, Travel Text Sent
**Date:** July 11, 2026
**Status:** ✅ Resolved

**Context:** Arianna's July 10 RSVP (attending) superseded her June 26 entry (not_attending), per DEC-035 rule. She was removed from the non-attendee travel email roster. She had not received a travel confirmation text with the other flight students on July 10.

**Decision:** Sent Arianna a travel confirmation text on July 11 covering her SFO → SAN flight to San Diego State. She will receive Lyft/DoorDash info in person at the July 15 event. Her stale June 26 RSVP row to be deleted from RSVP_Responses.

---

End of Decision Log
