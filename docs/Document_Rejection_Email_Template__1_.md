# Document Rejection Email Template
**Campus Ready Foundation**  
**Date:** November 14, 2025  
**Purpose:** Automated email when housing or acceptance document is rejected

---

## When to Send

**Trigger:** Admin or Board member changes either Housing Status OR Acceptance Status to "Rejected" in Grant_Recipients tab

**Timing:** Within 1 minute of status change (automated via Apps Script)

---

## Email Template

**To:** [Student Email from Grant_Recipients]  
**From:** hello@campusready.com  
**Subject:** Campus Ready Grant - Quick Document Update Needed

**Body:**

```
Hi [Student Name],

We've reviewed the documents you submitted for your Campus Ready grant, and we need just a bit more from you to move forward.

[IF Housing Status = "Rejected":]
We need a clearer copy of your housing contract or dorm assignment. This could be:
â€¢ Official housing assignment letter from your college
â€¢ Signed housing contract
â€¢ Dorm assignment confirmation email

[IF Acceptance Status = "Rejected":]
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

Ready to resubmit? Use the same link: https://campusready.foundation/customize-kit

Questions or need help? We're here:
hello@campusready.com

You've got this!

The Campus Ready Team
```

---

## Variable Substitutions

**Required:**
- `[Student Name]` â†’ Pull from Grant_Recipients tab, Student Name column
- `[Form URL]` â†’ Standard form link (same for all students)

**Conditional Content:**
- Show housing rejection section ONLY if Housing Status = "Rejected"
- Show acceptance rejection section ONLY if Acceptance Status = "Rejected"
- If BOTH rejected, show both sections

---

## Tone Guidelines

### âœ… DO Use These Approaches
- Warm and encouraging
- Specific about what documents are acceptable
- Reassure the grant is still theirs
- Frame as "we need a bit more" not "you failed"
- Offer examples of acceptable documents
- Acknowledge waiting on official paperwork is normal
- End on encouraging note

### âŒ DON'T Use These Phrases
- "Unfortunately"
- "Rejected"
- "Insufficient"
- "Does not meet requirements"
- "Failed to provide"
- "Must" or "required" (use "we need" instead)
- Any urgent/pressure language
- Bureaucratic or clinical tone

---

## Campus Ready Voice Characteristics

**Reference:** Based on campusready.foundation voice

- **Warm and personal:** Like talking to a supportive mentor
- **Dignified:** Avoid language that could feel pitying or condescending
- **Empowering:** Focused on what the student CAN do, not what they lack
- **Grounded in lived experience:** Acknowledge reality of waiting for documents

**Key phrases that work:**
- "We're here" (not "contact us if you have questions")
- "You've got this!" (encouraging close)
- "No worries" (casual, friendly)
- "Your grant is still reserved for you" (reassuring ownership)

---

## Technical Implementation Notes

### Apps Script Logic
```javascript
// Watch for changes to Grant_Recipients tab
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== 'Grant_Recipients') return;
  
  const row = e.range.getRow();
  const col = e.range.getColumn();
  
  // Column numbers for Housing Status and Acceptance Status
  const housingStatusCol = 6;  // Adjust based on actual column
  const acceptanceStatusCol = 8;  // Adjust based on actual column
  
  // If either status changed to "Rejected"
  if ((col === housingStatusCol || col === acceptanceStatusCol) && 
      e.value === 'Rejected') {
    sendRejectionEmail(row);
  }
}

function sendRejectionEmail(rowNumber) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Grant_Recipients');
  const studentName = sheet.getRange(rowNumber, 2).getValue();
  const email = sheet.getRange(rowNumber, 3).getValue();
  const housingStatus = sheet.getRange(rowNumber, 6).getValue();
  const acceptanceStatus = sheet.getRange(rowNumber, 8).getValue();
  
  // Build email body based on which doc(s) rejected
  let body = buildRejectionEmail(studentName, housingStatus, acceptanceStatus);
  
  MailApp.sendEmail({
    to: email,
    subject: 'Campus Ready Grant - Quick Document Update Needed',
    body: body
  });
}
```

---

## Testing Checklist

- [ ] Email sends when Housing Status â†’ "Rejected"
- [ ] Email sends when Acceptance Status â†’ "Rejected"  
- [ ] Email sends when BOTH â†’ "Rejected" (with both sections)
- [ ] Email does NOT send when status â†’ "Approved"
- [ ] Email does NOT send when status â†’ "Uploaded"
- [ ] Student name substitutes correctly
- [ ] Form URL is correct
- [ ] Conditional sections show/hide appropriately
- [ ] Email tone matches Campus Ready brand
- [ ] Mobile-friendly formatting

---

## Future Enhancements (Post-2026)

**Possible Additions:**
- Track rejection reason (dropdown: "Unclear", "Wrong document", "Missing information")
- Include specific feedback in email based on reason
- Track number of rejections per student (flag if >3 attempts)
- Add deadline reminder if student doesn't resubmit within 7 days
- Dashboard showing rejection rate and common issues

---

**Version:** 1.0  
**Last Updated:** November 14, 2025  
**Owner:** Eric Lilavois
