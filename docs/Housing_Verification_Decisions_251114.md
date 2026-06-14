# Housing Verification System - Decision Record
**Date:** November 14, 2025  
**Session:** Campus Ready Grant Fulfillment - Housing Verification Integration  
**Participants:** Eric Lilavois, Claude (AI Assistant)

---

## Context

During implementation planning for the email validation system, we discovered that housing verification was being used incorrectly as an Application Review filter rather than a Grant Fulfillment gate. This session addressed that fundamental design flaw and redesigned the workflow.

---

## Critical Decisions Made

### Decision 1: Housing Verification as Fulfillment Gate (Not Selection Filter)
**Date:** November 14, 2025  
**Status:** âœ… Approved

**Problem Identified:**
- 2026 Final Review tab filtered applicants by `Housing Verified = Yes`
- This meant Board could only see applicants who had submitted housing documentation
- Housing verification was treated as an application requirement, not a fulfillment requirement
- Many students apply before receiving housing assignments

**Decision:**
Housing verification is a GRANT FULFILLMENT requirement, not an APPLICATION SELECTION requirement.

**Rationale:**
1. Board needs to see ALL qualified applicants to make informed award decisions
2. Housing verification confirms ability to RECEIVE products, not eligibility for selection
3. Students often apply before housing contracts are available
4. Verification should happen AFTER award decision, BEFORE product fulfillment

**Implementation:**
- Remove Housing Verified filter from 2026 Final Review
- Add housing verification to Grant Fulfillment workflow
- Board sees all applicants with complete scoring, regardless of housing status

---

### Decision 2: Award Status Column Location
**Date:** November 14, 2025  
**Status:** âœ… Approved

**Options Considered:**
A) Add "Award Status" column to Board_Essays tab (Board works in one place)
B) Use existing "Status" column in 2026 Review tab (data centralization)
C) Add "Award Status" column to 2026 Final Review tab (Board decision-making view)

**Decision:** Option C - Add Award Status to 2026 Final Review tab

**Rationale:**
- Final Review is where Board makes award decisions (their primary working view)
- Board sees ranked, scored applicants in Final Review
- Simpler workflow: Board enters decisions where they work
- No need to switch between tabs during review meeting
- Award Status lives with the ranked list it applies to

**Implementation:**
- Add new column in 2026 Final Review: "Award Status" (Column 12, after Need Band)
- Values: "Awarded", "Denied", "Waitlist", (blank = not yet decided)
- Transfer Winners button reads from Final Review sheet (not 2026 Review)

**Entry Process:**
- Board reviews ranked applicants in 2026 Final Review during decision meeting
- Board/Admin enters Award Status directly in Final Review as decisions are made
- Transfer Winners button filters Final Review tab for Award Status = "Awarded"

**Why Not 2026 Review:**
- 2026 Review is comprehensive data/calculation tab, not Board working view
- Board doesn't interact with 2026 Review during meetings
- Better UX to enter decisions where you're already looking

---

### Decision 3: 2026 Final Review Filter Criteria
**Date:** November 14, 2025  
**Status:** âœ… Approved

**Decision:** Final Review shows ALL applicants with complete scoring

**Current Filter:**
```
QUERY('2026 Review'!A2:Q50500,
  "where I = 'Yes'")  â† Housing Verified
```

**New Filter:**
```
QUERY('2026 Review'!A2:Q50500,
  "where O is not null")  â† Total Score exists
```

**Additional Change:**
Add "Award Status" column (Column 12) after Need Band for Board to enter decisions

**Rationale:**
- Board needs complete visibility to make strategic decisions
- Housing verification is irrelevant to selection process
- Showing all scored applicants ensures fair consideration
- Board can see full pool and make informed choices about grant count
- Award Status column in Final Review keeps decision-making in Board's working view

---

### Decision 4: Document Upload Timing in Form
**Date:** November 14, 2025  
**Status:** âœ… Approved

**Options Considered:**
A) Upload documents BEFORE selecting kit items (verification gate)
B) Upload documents AFTER selecting kit items (more engagement)

**Decision:** Option A - Upload BEFORE item selection

**Rationale:**
1. No point customizing kit if student can't receive it
2. Forces documentation readiness early
3. Students can pause and return when ready
4. Prevents wasted effort if verification fails
5. Cleaner workflow with clear gates
6. Honest approach (non-negotiable requirement up front)

**Student Flow:**
```
Step 1: Email Validation
   â†“
Step 2: Document Upload (both required)
   â†“ (stays locked until admin verifies)
Step 3: Item Selection (unlocks after verification)
   â†“
Step 4: Final Submit
```

**Messaging Approach:**
- Frame as "so we can deliver to you" (benefit-focused)
- Offer easy pause/return path
- Campus Ready warm, supportive voice
- No bureaucratic tone

---

### Decision 5: Document Review Process
**Date:** November 14, 2025  
**Status:** âœ… Approved

**Decision:** Manual admin/Board review required before unlocking item selection

**Process:**
1. Student uploads both documents (housing contract + acceptance letter)
2. System stores files in Google Drive
3. Grant_Recipients updated: Housing Status = "Uploaded", Acceptance Status = "Uploaded"
4. Conditional formatting highlights row in yellow (review needed)
5. Admin or Board member clicks doc URL to view document
6. Admin/Board changes status dropdown: "Uploaded" â†’ "Approved" or "Rejected"
7. If both "Approved": Item selection section unlocks automatically
8. If either "Rejected": Automated warm email sent to student requesting resubmission

**Notification Method:**
- No email notifications to admin/Board (visual check during active season)
- Conditional formatting provides clear visual status
- Admin/Board checks Grant_Recipients tab regularly during grant season

**Board Access:**
- Board members have full edit access to status dropdowns
- Multiple reviewers can approve/reject documents
- Any Board member or admin can change status

**Status Dropdown Values:**
- **"Not Uploaded"** - Default when student transferred to Grant_Recipients
- **"Uploaded"** - Student has submitted document via form
- **"Approved"** - Admin/Board verified document is legitimate and sufficient
- **"Rejected"** - Document is insufficient, student needs to resubmit

**Rationale:**
- Visual status more efficient than email notifications during active season
- Conditional formatting provides at-a-glance status for all students
- Board collaboration on document review distributes workload
- Dropdown simplicity ensures consistent status tracking
- Automated rejection email maintains Campus Ready's warm, supportive tone

---

### Decision 6: Document Storage Location
**Date:** November 14, 2025  
**Status:** âœ… Approved

**Location:** Campus Ready Shared Drive

**Path:** `Operations/Grant Fulfillment/Housing_Verification_&_College_Acceptance_PDFs`

**Folder Structure:**
```
Housing_Verification_&_College_Acceptance_PDFs/
  â”œâ”€â”€ 2026/
  â”‚   â”œâ”€â”€ CR_1758657496058_8l0scy_Housing.pdf
  â”‚   â”œâ”€â”€ CR_1758657496058_8l0scy_Acceptance.pdf
  â”‚   â””â”€â”€ ...
  â””â”€â”€ 2027/
```

**Naming Convention:**
- Format: `{ApplicationID}_{DocType}.pdf`
- Examples: 
  - `CR_1758657496058_8l0scy_Housing.pdf`
  - `CR_1758657496058_8l0scy_Acceptance.pdf`

**Permissions:**
- Admin: Full access
- Students: No direct access (upload via form only)
- Board: Read access for verification purposes

---

### Decision 7: Form Return Access Policy
**Date:** November 14, 2025  
**Status:** âœ… Approved

**Old Policy:** Student locked out after first form submission

**New Policy:** Student can return until final item submission

**Access Rules:**
| Form Section | Can Return? | Notes |
|--------------|-------------|-------|
| Email Validation | âœ… Always | Must re-validate each visit |
| Document Upload | âœ… Until verified | Can replace before admin review |
| Item Selection | âœ… Until final submit | Can change choices until locked |
| After Final Submit | âŒ Locked | Changes via hello@campusready.com |

**Rationale:**
1. Documents required creates legitimate need to pause/return
2. Students may need to wait for housing contracts
3. Students should be able to update choices before final commitment
4. Final submit lock prevents duplicate orders
5. Support burden manageable at current scale

**Validation Each Visit:**
- Email must re-validate against Grant_Recipients
- System checks document verification status
- Form shows appropriate section based on progress
- Clear visual indicators of what's complete/pending

---

### Decision 8: Waitlist Activation Process
**Date:** November 14, 2025  
**Status:** âœ… Approved

**Decision:** Manual waitlist process (not automated)

**Scenario:** Awarded student doesn't upload housing verification documents

**Process:**
1. Admin monitors Grant_Recipients for stalled verifications
2. Admin follows up with student via email
3. If student unresponsive after X days (TBD), admin makes manual decision
4. Admin updates next waitlist student: Award Status â†’ "Awarded" in 2026 Review
5. Admin runs Transfer Winners button again (safe, prevents duplicates)
6. Waitlist student receives notification email
7. Process repeats with new student

**Rationale:**
- Small scale makes manual oversight feasible
- Each situation may have unique circumstances
- Flexibility to extend deadlines case-by-case
- Can add automation later if scale demands it
- Human judgment appropriate for edge cases

**Future Consideration:**
- After 2026 cohort, evaluate if automated waitlist triggers make sense
- Consider: "If no upload after 14 days â†’ auto-email, auto-offer to waitlist"

---

### Decision 9: Grant_Recipients Tab Structure Expansion
**Date:** November 14, 2025  
**Status:** âœ… Approved & Implemented

**Original Structure:**
| Application ID | Student Name | Email Address | cohort_year | Transfer Date | Form Submitted | Submission Timestamp |

**Final Structure (11 columns):**
| Application ID | Student Name | Email Address | Cohort Year | Transfer Date | Housing Status | Housing Doc URL | Acceptance Status | Acceptance Doc URL | Items Selected | Submission Timestamp |

**New Columns:**
- **Housing Status:** Dropdown (Pending, Uploaded, Approved, Rejected) - Default: "Pending"
- **Housing Doc URL:** Google Drive link to uploaded housing document
- **Acceptance Status:** Dropdown (Pending, Uploaded, Approved, Rejected) - Default: "Pending"
- **Acceptance Doc URL:** Google Drive link to uploaded acceptance letter
- **Items Selected:** Yes/No (renamed from "Form Submitted" for clarity)
- **Submission Timestamp:** Records when student completes document upload + item selection

**Column Changes:**
- **cohort_year â†’ Cohort Year:** Renamed for header consistency (capitalization)
- **Submission Date:** Removed - redundant with Submission Timestamp

**Conditional Formatting (Visual Workflow):**
- ðŸŸ¢ **Green row:** Housing Status = "Approved" AND Acceptance Status = "Approved"
  - Meaning: Student completed everything, ready for fulfillment
- ðŸŸ¡ **Yellow row:** Either status = "Uploaded"
  - Meaning: Admin/Board review needed
- ðŸ”´ **Red row:** Either status = "Rejected"  
  - Meaning: Student needs to resubmit documents
- âšª **Gray row:** Contains "Pending"
  - Meaning: Waiting on student action

**Rationale for "Pending" (not "Not Uploaded"):**
- More positive, professional framing
- Clearer workflow intent (everyone starts in pending state)
- Better UX - focuses on what's next, not what's missing

**Why Remove Submission Date:**
- Redundant with Submission Timestamp column
- Timestamp can be formatted to display as date when needed
- Reduces column count without losing any functionality
- Maintains full precision for edge cases

**Why "Items Selected" vs "Form Submitted":**
- "Form Submitted" was ambiguous (which form? documents or items?)
- "Items Selected" clearly indicates kit customization complete
- Separates document submission from item submission
- More intuitive for admin tracking

**Access & Permissions:**
- Admin: Full edit access to all columns
- Board members: Full edit access to status dropdowns
- Students: No direct access (upload via form only)

**Implementation Status:** âœ… Tested November 14, 2025 - All 11 columns populate correctly via Transfer Winners

---

### Decision 11: Document Rejection Email Copy
**Date:** November 14, 2025  
**Status:** âœ… Approved

**Trigger:** When admin/Board changes either Housing Status OR Acceptance Status to "Rejected"

**Email Template:**

**Subject:** Campus Ready Grant - Quick Document Update Needed

**Body:**
```
Hi [Student Name],

We've reviewed the documents you submitted for your Campus Ready grant, and we need just a bit more from you to move forward.

[IF Housing document rejected:]
We need a clearer copy of your housing contract or dorm assignment. This could be:
â€¢ Official housing assignment letter from your college
â€¢ Signed housing contract
â€¢ Dorm assignment confirmation email

[IF Acceptance document rejected:]
We need a clearer copy of your college acceptance letter. This could be:
â€¢ Official acceptance letter from the admissions office
â€¢ Enrollment confirmation letter
â€¢ Official email confirming your admission

What we need:
â€¢ A clear, readable PDF or photo
â€¢ Shows your name and the college name
â€¢ Confirms you'll be living on campus [for housing doc]
â€¢ Confirms your acceptance and enrollment [for acceptance doc]

No worries if you don't have the perfect document yet - many students are still waiting on official paperwork. You can come back to the form anytime with updated documents.

Your grant is still reserved for you. We just need this verification to move forward with customizing and delivering your kit.

Ready to resubmit? Use the same link: [Form URL]

Questions or need help? We're here:
hello@campusready.com

You've got this!

The Campus Ready Team
```

**Tone Guidelines:**
- âœ… Warm, encouraging, supportive
- âœ… Specific about what's needed
- âœ… Reassure grant is still theirs
- âœ… No shame or blame
- âŒ Avoid "unfortunately," "rejected," "insufficient"
- âŒ No bureaucratic language
- âŒ No urgency/pressure

**Technical Implementation:**
- Apps Script monitors Grant_Recipients tab for status changes
- When any status changes to "Rejected", trigger email
- Email sends within 1 minute of status change
- Log email sent in system (optional tracking column)

---

### Decision 10: Shopping List Generation Filter
**Date:** November 14, 2025  
**Status:** âœ… Approved

**Current Filter:**
```javascript
data_type = "Live" 
AND cohort_year = currentYear 
AND shopping_list_generated = FALSE
```

**New Filter:**
```javascript
data_type = "Live" 
AND cohort_year = currentYear 
AND shopping_list_generated = FALSE
AND housing_status = "Approved"
AND acceptance_status = "Approved"
```

**Rationale:**
- Only generate shopping lists for fully verified students
- Prevents ordering products for students who can't receive them
- Resolver still processes everyone (generates product matches for all submissions)
- Verification check happens at shopping list generation time
- Admin has clear visibility into who's ready for fulfillment via green rows

**What Stays Unchanged:**
- Resolver logic (still processes all submitted forms)
- Product matching rules
- Archive process
- Shopping list structure

---

## Implementation Dependencies

### Blocking (Must be done first)
1. **Phase 1:** Application_Reviews changes (Award Status, Final Review filter, Transfer button)
   - Enables proper award decisions
   - Blocks: Transfer Winners testing

2. **Phase 2:** Grant_Recipients structure expansion
   - Adds verification tracking columns
   - Blocks: Document upload system

3. **Phase 3:** Document upload system
   - HTML form updates
   - Apps Script upload handler
   - Drive folder creation
   - Blocks: Admin review process

### Sequential (Order matters)
4. **Phase 4:** Admin review process
   - Grant_Recipients admin view
   - Approve/reject workflow
   - Blocks: End-to-end testing

5. **Phase 5:** Shopping list filter
   - Verification status check
   - Testing with verified students only

---

## What Stays Unchanged

### Application_Reviews.xlsx
- âœ… Master tab structure and data
- âœ… Board_Essays tab structure
- âœ… All scoring formulas (objective + essay)
- âœ… Dashboard tab
- âœ… Config tab
- âœ… All existing Apps Scripts for application submission

### Grant_Fulfillment_Database.xlsx
- âœ… Student_Selections tab structure
- âœ… Resolver tab and product matching logic
- âœ… Product_Logic tab
- âœ… All research tabs and PL_* tabs
- âœ… Shopping_List tab structure
- âœ… Archive process (just includes new Grant_Recipients columns)

---

## Open Questions / Future Decisions

### Short-term (Before 2026 Launch)
- [ ] Document upload deadline (how many days after award notification?)
- [ ] Admin notification method (email? Slack? Dashboard?)
- [ ] Student re-upload limit (how many attempts if rejected?)
- [ ] Messaging for document rejection (template needed)

### Long-term (After 2026 Cohort)
- [ ] Automate waitlist activation after X days?
- [ ] Auto-approve common document types (e.g., standard university housing forms)?
- [ ] Integration with college housing systems for auto-verification?
- [ ] Analytics dashboard for tracking verification completion rates?

---

## Communication Plan

**Board Notification:**
- Inform Board of housing verification process change
- Explain that Final Review now shows ALL applicants
- Clarify that Award Status column is where decisions are recorded
- Timeline: Before next Board meeting

**Student Communication:**
- Update award notification email to mention document requirements
- Create FAQ about housing verification process
- Provide clear timeline expectations
- Timeline: Before first 2026 awards

**Documentation:**
- Update Application_Review_System_Overview.md
- Update Grant_Fulfillment_System_Overview_v2.md
- Update Grant_Fulfillment_Decision_Log_v2.md
- Create Housing_Verification_Workflow.md

---

## Testing Plan

### Phase 1 Testing (Application_Reviews)
- [ ] Verify Award Status column accepts valid values
- [ ] Verify Final Review shows all applicants with scores
- [ ] Test Transfer Winners filters by Award Status = "Awarded"
- [ ] Verify duplicate prevention still works

### Phase 2 Testing (Grant_Recipients)
- [ ] Verify new columns appear in Grant_Recipients
- [ ] Test Transfer Winners populates new columns correctly
- [ ] Verify default values (No, blank, etc.)

### Phase 3 Testing (Document Upload)
- [ ] Test file upload (PDF, JPG, PNG)
- [ ] Test file size limits (max 10MB)
- [ ] Verify files save to correct Drive folder
- [ ] Test file naming convention
- [ ] Verify URLs stored in Grant_Recipients

### Phase 4 Testing (Admin Review)
- [ ] Test admin can view pending documents
- [ ] Test approve/reject workflow
- [ ] Verify item selection unlocks after approval
- [ ] Test student notification emails

### End-to-End Testing
- [ ] Complete student journey: award â†’ email â†’ validate â†’ upload â†’ verify â†’ select â†’ submit
- [ ] Test return-to-form scenarios at each step
- [ ] Verify shopping list only generates for verified students
- [ ] Test waitlist activation workflow

---

## Risk Assessment

### High Risk (Must Monitor)
**Risk:** Students abandon process at document upload  
**Mitigation:** Clear messaging, easy pause/return, proactive admin follow-up

**Risk:** Document quality varies (photos, illegible scans)  
**Mitigation:** Clear upload instructions, example documents, admin review process

**Risk:** Housing contracts delayed (students can't get documents on time)  
**Mitigation:** Flexible deadlines, waitlist backup, clear communication

### Medium Risk
**Risk:** Admin review bottleneck (one person reviewing all docs)  
**Mitigation:** Multiple admin access, clear review criteria, mobile-friendly review interface

**Risk:** Drive folder permissions misconfigured  
**Mitigation:** Test with sample uploads, verify student can't see other students' docs

### Low Risk
**Risk:** File storage costs (many PDFs)  
**Mitigation:** Monitor storage, compress files if needed, archive old cohorts

---

## Success Metrics

### Process Efficiency
- Time from award to document upload: Target <7 days
- Document verification turnaround: Target <2 business days
- Form completion rate: Target >90%

### Quality
- Document rejection rate: Target <10%
- Waitlist activation rate: Target <5%
- Support tickets re: verification: Target <3 per cohort

### Student Experience
- Form abandonment rate at upload: Monitor, no target yet
- Time to complete full process: Target <14 days from award

---

**Decision Authority:** Eric Lilavois (Founder/ED)  
**Implementation Owner:** Eric Lilavois + Claude AI  
**Review Date:** After Phase 1 completion  
**Version:** 1.0
