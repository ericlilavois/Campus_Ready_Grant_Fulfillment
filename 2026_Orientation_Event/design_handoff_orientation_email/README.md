# Handoff: Orientation Reminder Email

## Overview
A redesigned HTML reminder email for Campus Ready Foundation's Orientation & Celebration event (July 15, 2026). This is sent to students who have already received an initial invitation and a kit-customization email. The goal is to surface the one real ask — downloading Lyft and DoorDash — with clear hierarchy, while providing a quick event snapshot and a warm sign-off.

## About the Design Files
The file `Orientation Reminder Email.html` is a **high-fidelity design reference** built in HTML. It shows the exact intended look, copy, layout, and hierarchy. Your task is to **convert this into a Google Apps Script (GAS) `MailApp.sendEmail()` call** using an inline HTML string safe for Gmail.

Do not ship the HTML file as-is — it uses a DC runtime wrapper (`<x-dc>`, `support.js`) that is a design-tool artifact, not email-safe markup. Extract the content inside the `<x-dc>` body and inline all styles for Gmail compatibility.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and structure are final. Recreate pixel-faithfully within Gmail's constraints (inline styles, table-based layout, no external CSS, no JS).

---

## Email Structure

### 1. Header
- White background, 1px `#e2e8f0` bottom border
- Centered CRF logo: `CRF web header_GRN.png`, height 40px
- Padding: 28px top/bottom, 32px sides
- **Logo note:** Host this image publicly (e.g. Google Drive public link or CDN) and reference by URL — Gmail strips local `src` paths. Minimum width: 144px. Do not recolor or distort.

### 2. Body container
- Max width: 600px, centered
- Background: white `#ffffff`
- Border-radius: 12px (cosmetic only — Gmail clips this; fine as fallback)
- Body padding: 40px sides, 40px top, 32px bottom
- Font family: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### 3. Eyebrow + Headline
- **Eyebrow:** `Orientation & Celebration`
  - Font: Inter, 11px, weight 700, uppercase, letter-spacing 0.15em, color `#14b8a6`
  - Margin bottom: 10px
- **Headline:** `We're less than a week away.`
  - Font: Georgia (web-safe serif fallback for Playfair Display), 30px, weight 700, color `#0f172a`, letter-spacing -0.01em, line-height 1.2
  - Margin bottom: 28px

### 4. Event Snapshot Card
- Background: `#f8fafc`, border: `1px solid #e2e8f0`, border-radius: 12px
- Padding: 20px 24px, margin bottom: 28px
- Two rows (use `<table>` for email safety):

**Row 1 — Date/Time**
- Icon: Feather-style calendar SVG, 16×16, stroke `#14b8a6`, stroke-width 1.75
- Primary text: `Wednesday, July 15` — 13px, weight 500, color `#0f172a`
- Secondary text: `Doors open 6:00 PM for food and beverage · Program begins 6:30 PM` — 13px, color `#64748b`
- Row padding-bottom: 14px

**Row 2 — Location**
- Icon: Feather-style map pin SVG, 16×16, stroke `#14b8a6`
- Primary text: `Napa Valley Community Foundation` — 13px, weight 500, color `#0f172a`
- Secondary text: `3299 Claremont Way, Suite 4, Napa, CA` — 13px, color `#64748b`

### 5. App Download Card
- Background: `#f0fdfa`, border: `1px solid #99f6e4`, border-radius: 12px
- Padding: 24px, margin bottom: 28px
- **Eyebrow:** `Before Wednesday` — Inter, 11px, weight 700, uppercase, letter-spacing 0.15em, color `#0d9488`
- **Subhead:** `Download the Lyft and DoorDash apps.` — 16px, weight 600, color `#0f172a`, margin bottom: 12px
- **Body:** `We're going to walk you through activating your credits. Having the apps installed means we can get that done quickly.` — 14px, line-height 1.7, color `#374151`, margin bottom: 20px
- **Two side-by-side buttons** (50% width each, use table columns):
  - White background, border: `1.5px solid #e2e8f0`, border-radius: 8px, padding: 12px 16px, centered
  - Logo image (height 22px, centered), below it: label text 12px, weight 600, color `#475569`
  - Left: Lyft logo → `Lyft_Logo_Pink_RGB.png`, label "Download Lyft", href = App Store Lyft URL
  - Right: DoorDash logo → `DoorDash.png`, label "Download DoorDash", href = App Store DoorDash URL
  - **Both logos must be hosted publicly by URL**

### 6. School Colors Card
- Background: `#fefce8`, border: `1px solid #fde68a`, border-radius: 12px
- Padding: 20px 24px, margin bottom: 28px, text-align: center
- Emoji: 📣 (megaphone), font-size 22px, margin bottom: 4px
- Line 1: `Wear your school colors or bring some swag.` — 15px, weight 600, color `#0f172a`
- Line 2: `Let's see some college pride in the room!` — 15px, weight 400, color `#374151`

### 7. Sign-off
- `See you soon.` — 15px, color `#374151`, line-height 1.7, margin bottom: 4px
- `Team Campus Ready` — 15px, weight 600, color `#0f172a`, margin bottom: 32px

### 8. Footer
- Top border: `1px solid #e2e8f0`, padding top: 20px
- Text: `Questions?` followed by:
  - Email link: `hello@campusready.org` — color `#14b8a6`, no underline, weight 500
  - Separator: ` · `
  - Phone link: `(707) 595-8281` — same style

---

## Personalization
- The GAS script should replace `[First Name]` with the student's first name from the spreadsheet row.
- The current design does not include a `[First Name]` salutation in the body (it was intentionally removed — the email leads directly with the headline). No token substitution needed unless you want to add a salutation.

---

## Gmail / GAS Implementation Notes

1. **Inline all styles.** Gmail strips `<style>` blocks. Every CSS property must be on a `style=""` attribute.
2. **Use `<table>` for multi-column layout.** The app download buttons and event snapshot rows must use `<table cellpadding="0" cellspacing="0">` — flexbox/grid don't render in Gmail.
3. **Host images externally.** Logo and partner logos must be served from a public URL (Google Drive, CDN, or Apps Script web app). Gmail will block `cid:` or relative paths.
4. **No JavaScript.** Strip all `<script>` tags and the `support.js` reference — they're design-tool artifacts.
5. **Border-radius** renders in most modern email clients but degrades gracefully in Outlook.
6. **`MailApp.sendEmail()`** signature:
   ```javascript
   MailApp.sendEmail({
     to: studentEmail,
     subject: "See you Wednesday — Orientation & Celebration",
     htmlBody: htmlString,
     name: "Campus Ready Foundation"
   });
   ```

---

## Design Tokens (reference)

| Token | Value |
|---|---|
| Primary teal | `#14b8a6` |
| Teal dark (hover) | `#0d9488` |
| Headline / primary | `#0f172a` |
| Body | `#374151` |
| Secondary body | `#475569` |
| Muted | `#64748b` |
| Border | `#e2e8f0` |
| Card bg (light) | `#f8fafc` |
| Teal card bg | `#f0fdfa` |
| Teal card border | `#99f6e4` |
| Yellow card bg | `#fefce8` |
| Yellow card border | `#fde68a` |
| Serif headline font | Georgia (email) / Playfair Display (web) |
| Body font | Inter, -apple-system, sans-serif |

---

## Assets

| File | Usage | Notes |
|---|---|---|
| `assets/img/brand/CRF web header_GRN.png` | Header logo | Must be hosted publicly by URL for Gmail |
| `assets/Partners/Lyft_Logo_Pink_RGB.png` | Lyft download button | Must be hosted publicly |
| `assets/Partners/DoorDash.png` | DoorDash download button | Must be hosted publicly |

---

## Files in This Package
- `Orientation Reminder Email.html` — high-fidelity design reference (open in a browser to inspect)
- `assets/` — logo and partner image assets
- `README.md` — this file
