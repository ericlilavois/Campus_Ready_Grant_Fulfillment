# Campus Ready Documentation Process - Quick Reference

**Last Updated:** November 17, 2025  
**Purpose:** Your offline guide to maintaining project documentation

---

## The 5 Core Documents

| Document | Purpose | Update When | Time Required |
|----------|---------|-------------|---------------|
| **START_HERE_New_Agent.md** | Agent entry point | Complete a phase | 5 min |
| **SYSTEM_STATE.md** | What's built & working | Complete a phase | 10 min |
| **DECISION_LOG.md** | Decision history | Make a decision | 5 min |
| **TROUBLESHOOTING.md** | Common fixes | Solve a bug | 3 min |
| **Brand_Guidelines.md** | Voice, colors, messaging | Brand changes | Rarely |

---

## When You Complete a Phase

**Update 2 documents (15 minutes total):**

### 1. SYSTEM_STATE.md (10 min)
Find the relevant section and update:
- **What's Working** - Add completed feature
- **Deployment Info** - Add new URLs if applicable
- **Known Issues** - Remove fixed issues, add new ones
- **Testing Results** - Add test outcomes

### 2. START_HERE_New_Agent.md (5 min)
Update top section:
- **Current Phase** - Mark old complete, identify new current
- **What's Next** - Brief description of next phase
- **Last Updated** - Today's date

---

## When You Make a Decision

**Update 1 document (5 minutes):**

### DECISION_LOG.md
Add new entry at bottom using template:
```markdown
### Decision #X: [Title]
**Date:** [Today]
**Status:** Approved

**Context:** [What problem you're solving]

**Decision:** [What you decided]

**Rationale:** [Why you chose it]

**Implementation:** [How it works]
```

---

## When You Fix a Bug

**Update 1 document (3 minutes):**

### TROUBLESHOOTING.md
Add entry under appropriate section:
```markdown
**Error:** [Error message or symptom]
**Cause:** [What was wrong]
**Fix:** [How to resolve it]
```

---

## New Agent Onboarding (Your Script)

**When introducing a new agent:**

1. **Point them to START_HERE_New_Agent.md**
   - Say: "Please read START_HERE_New_Agent.md first"
   - Don't point to multiple documents

2. **Let START_HERE guide them**
   - It will direct them to relevant docs based on task
   - They'll read 1-3 documents max, not 5+

3. **Confirm they've read your working principles**
   - Ask: "Have you reviewed my working principles in START_HERE?"
   - Ensures they know your expectations

---

## What NOT to Do

âŒ **Don't create new handoff documents** - Update SYSTEM_STATE instead  
âŒ **Don't duplicate information** - One fact, one location  
âŒ **Don't keep old versions** - Archive superseded docs  
âŒ **Don't update all docs** - Only update what changed  
âŒ **Don't write novels** - Brief updates are better

---

## The Update Rules

### SYSTEM_STATE.md
- **Add to it** - When you build something new
- **Update it** - When something changes
- **Remove from it** - When you fully deprecate a feature
- **Never delete history** - Mark as deprecated, don't erase

### DECISION_LOG.md
- **Add to it** - When you make decisions
- **Never delete** - Decisions are permanent history
- **Update status** - If you reverse a decision, add new entry explaining why

### TROUBLESHOOTING.md
- **Add to it** - When you solve problems
- **Update it** - When solutions change
- **Organize it** - Group related issues together

### START_HERE
- **Update status** - After each phase
- **Keep brief** - 3 pages maximum
- **Point, don't duplicate** - Link to other docs, don't copy content

---

## Monthly Maintenance (Optional)

**Once per month (15 minutes):**
1. Review SYSTEM_STATE - Archive completed phases if needed
2. Review TROUBLESHOOTING - Remove obsolete fixes
3. Review START_HERE - Ensure "What's Next" is accurate

---

## Archive Process

**When documents become outdated:**

1. Create `/archive` folder in project (if not exists)
2. Move old document there
3. Add date prefix: `ARCHIVE_20251117_filename.md`
4. Update any references in active docs
5. Don't delete - keep for historical reference

---

## Emergency Agent Transition

**If you need to hand off mid-phase:**

1. Update SYSTEM_STATE with current work-in-progress
2. Add "INCOMPLETE" flag to What's Next in START_HERE
3. Note what's half-done in SYSTEM_STATE Known Issues
4. New agent reads START_HERE and knows exact state

**Takes 10 minutes. Saves hours of confusion.**

---

## Quality Checklist

**After any update, verify:**
- [ ] Date updated at top of file
- [ ] No duplicate information across files
- [ ] Links between docs still work
- [ ] Information is scannable (bullets, tables, headers)
- [ ] No jargon or unexplained acronyms

---

## Time Investment

**Setup (one-time):** Done  
**Per phase completion:** 15 minutes  
**Per decision:** 5 minutes  
**Per bug fix:** 3 minutes  
**Monthly review:** 15 minutes  

**ROI:** New agents onboard in 15 minutes instead of 60+ minutes

---

## Your Working Principles Location

**Preserved in:** START_HERE_New_Agent.md (Section 2)

All agents see your working principles before doing any work. They're required reading.

---

## Questions to Ask Yourself

**Before updating docs:**
- "Which document owns this information?" (avoid duplication)
- "Will this help the next agent?" (avoid noise)
- "Is this brief enough?" (respect their time)

**Before introducing a new agent:**
- "Is SYSTEM_STATE current?" (last phase complete?)
- "Is START_HERE updated?" (what's next clear?)
- "Are my expectations clear?" (working principles visible?)

---

## This Process Evolves

If you find:
- A document is never used â†’ Archive it
- Information is duplicated â†’ Consolidate it
- Updates take too long â†’ Simplify the template
- Agents still confused â†’ Add clarity to START_HERE

**This process serves you. Adjust it as needed.**

---

**Keep this file. Reference it offline. Update it if the process changes.**

---

End of Process Guide
