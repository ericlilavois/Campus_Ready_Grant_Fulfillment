// ============================================
// CAMPUS READY — ORIENTATION REMINDER EMAIL
// ============================================
// Event: Orientation & Celebration — Wednesday, July 15, 2026
// Sends to: RSVP_Responses rows with status attending or attending_with_guest
// Last updated: 2026-07-09

// ============================================
// CONFIGURATION
// ============================================

const RSVP_SHEET_NAME = 'RSVP_Responses';
const TEST_EMAIL = 'elilavois@gmail.com';

const LOGO_URL = 'https://award.campusready.org/logo-image-1200x630.png';
const LYFT_LOGO_URL = 'https://award.campusready.org/2026_Orientation_Event/design_handoff_orientation_email/assets/Partners/Lyft_Logo_Pink_RGB.png';
const DOORDASH_LOGO_URL = 'https://award.campusready.org/2026_Orientation_Event/design_handoff_orientation_email/assets/Partners/DoorDash.png';

const LYFT_APP_STORE_URL = 'https://apps.apple.com/us/app/lyft/id529379082';
const DOORDASH_APP_STORE_URL = 'https://apps.apple.com/us/app/doordash-food-delivery/id719972451';

const EMAIL_SUBJECT = 'To do before Wednesday.';
const SENDER_NAME = 'Campus Ready Foundation';

// ============================================
// TEST EMAIL
// ============================================

function testOrientationEmail() {
  const html = buildEmailHtml('Eric');
  GmailApp.sendEmail(TEST_EMAIL, '[TEST] ' + EMAIL_SUBJECT, '', {
    htmlBody: html,
    name: SENDER_NAME
  });
  SpreadsheetApp.getUi().alert('Test email sent to ' + TEST_EMAIL);
  Logger.log('Test email sent to ' + TEST_EMAIL);
}

// ============================================
// MAIN SEND FUNCTION
// ============================================

function sendOrientationEmails() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(RSVP_SHEET_NAME);

  if (!sheet) {
    ui.alert('Sheet Not Found', 'Could not find a tab named "' + RSVP_SHEET_NAME + '".', ui.ButtonSet.OK);
    return;
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const nameCol = headers.indexOf('Name');
  const emailCol = headers.indexOf('Email');
  const statusCol = headers.indexOf('Status');
  const sentCol = findOrCreateSentColumn(sheet, headers);

  if (nameCol === -1 || emailCol === -1 || statusCol === -1) {
    ui.alert('Missing Columns', 'Could not find Name, Email, or Status columns.', ui.ButtonSet.OK);
    return;
  }

  // Collect eligible recipients
  const recipients = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const name = row[nameCol];
    const email = row[emailCol];
    const status = row[statusCol];
    const alreadySent = row[sentCol];

    if (!email || !name) continue;
    if (status !== 'attending' && status !== 'attending_with_guest') continue;
    if (alreadySent === 'Yes') continue;

    recipients.push({ name: name, email: email, rowIndex: i + 1 });
  }

  if (recipients.length === 0) {
    ui.alert('No Recipients', 'No eligible recipients found (attending and not yet emailed).', ui.ButtonSet.OK);
    return;
  }

  const confirm = ui.alert(
    'Send ' + recipients.length + ' Emails?',
    'Ready to send the orientation reminder to ' + recipients.length + ' attending students.\n\nContinue?',
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  let sent = 0;
  let errors = [];

  recipients.forEach(function(r) {
    try {
      const firstName = r.name.split(' ')[0];
      const html = buildEmailHtml(firstName);
      GmailApp.sendEmail(r.email, EMAIL_SUBJECT, '', {
        htmlBody: html,
        name: SENDER_NAME
      });
      // Mark as sent
      sheet.getRange(r.rowIndex, sentCol + 1).setValue('Yes');
      sent++;
      Utilities.sleep(200); // stay well under Gmail quota
    } catch (e) {
      errors.push(r.name + ' (' + r.email + '): ' + e.message);
      Logger.log('Error sending to ' + r.email + ': ' + e.message);
    }
  });

  let summary = sent + ' emails sent successfully.';
  if (errors.length > 0) {
    summary += '\n\nErrors (' + errors.length + '):\n' + errors.join('\n');
  }
  ui.alert('Send Complete', summary, ui.ButtonSet.OK);
  Logger.log('Orientation reminder send complete. Sent: ' + sent + ', Errors: ' + errors.length);
}

// ============================================
// HELPER: find or create "Email Sent" column
// ============================================

function findOrCreateSentColumn(sheet, headers) {
  let col = headers.indexOf('Email Sent');
  if (col === -1) {
    col = headers.length;
    sheet.getRange(1, col + 1).setValue('Email Sent');
  }
  return col;
}

// ============================================
// EMAIL HTML BUILDER
// ============================================

function buildEmailHtml(firstName) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">

        <!-- HEADER -->
        <tr>
          <td align="center" style="background:#ffffff;padding:28px 32px 24px;border-bottom:1px solid #e2e8f0;">
            <img src="${LOGO_URL}" alt="Campus Ready Foundation" style="height:64px;width:auto;display:block;margin:0 auto;">
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:40px 40px 32px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

            <!-- Greeting -->
            <p style="margin:0 0 24px;font-size:16px;color:#374151;">Hi ${firstName},</p>

            <!-- Eyebrow + Headline -->
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#14b8a6;">Orientation &amp; Celebration</p>
            <p style="margin:0 0 28px;font-family:Georgia,serif;font-size:30px;font-weight:700;color:#0f172a;letter-spacing:-0.01em;line-height:1.2;">We're less than a week away.</p>

            <!-- Event Snapshot Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin:0 0 28px;">
              <tr>
                <td style="padding:20px 24px;">

                  <!-- Date row -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:14px;vertical-align:top;">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="vertical-align:top;padding-top:2px;padding-right:12px;">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </td>
                            <td>
                              <p style="margin:0;font-size:13px;font-weight:500;color:#0f172a;line-height:1.4;">Wednesday, July 15</p>
                              <p style="margin:2px 0 0;font-size:13px;color:#64748b;">Doors open 6:00 PM for food and beverage &middot; Program begins 6:30 PM</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Location row -->
                    <tr>
                      <td style="vertical-align:top;">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="vertical-align:top;padding-top:2px;padding-right:12px;">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </td>
                            <td>
                              <p style="margin:0;font-size:13px;font-weight:500;color:#0f172a;line-height:1.4;">Napa Valley Community Foundation</p>
                              <p style="margin:2px 0 0;font-size:13px;color:#64748b;">3299 Claremont Way, Suite 4, Napa, CA</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>

            <!-- App Download Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;margin:0 0 28px;">
              <tr>
                <td style="padding:24px;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#0d9488;">Before Wednesday</p>
                  <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#0f172a;line-height:1.4;">Download the Lyft and DoorDash apps.</p>
                  <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#374151;">We're going to walk you through activating your credits. Having the apps installed means we can get that done quickly.</p>

                  <!-- App buttons -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="width:50%;padding-right:8px;">
                        <a href="${LYFT_APP_STORE_URL}" style="display:block;background:#ffffff;border:1.5px solid #e2e8f0;border-radius:8px;padding:12px 16px;text-decoration:none;text-align:center;">
                          <img src="${LYFT_LOGO_URL}" alt="Lyft" style="height:22px;width:auto;display:block;margin:0 auto 6px;">
                          <span style="font-size:12px;font-weight:600;color:#475569;font-family:'Inter',sans-serif;">Download Lyft</span>
                        </a>
                      </td>
                      <td style="width:50%;padding-left:8px;">
                        <a href="${DOORDASH_APP_STORE_URL}" style="display:block;background:#ffffff;border:1.5px solid #e2e8f0;border-radius:8px;padding:12px 16px;text-decoration:none;text-align:center;">
                          <img src="${DOORDASH_LOGO_URL}" alt="DoorDash" style="height:22px;width:auto;display:block;margin:0 auto 6px;">
                          <span style="font-size:12px;font-weight:600;color:#475569;font-family:'Inter',sans-serif;">Download DoorDash</span>
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- School Colors Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;margin:0 0 28px;">
              <tr>
                <td style="padding:20px 24px;text-align:center;">
                  <p style="margin:0 0 4px;font-size:22px;">&#x1F4E3;</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;line-height:1.6;">Wear your school colors or bring some swag.<br><span style="font-weight:400;color:#374151;">Let's see some college pride in the room!</span></p>
                </td>
              </tr>
            </table>

            <!-- Sign-off -->
            <p style="margin:0 0 4px;font-size:15px;line-height:1.7;color:#374151;">See you soon.</p>
            <p style="margin:0 0 32px;font-size:15px;font-weight:600;color:#0f172a;">Team Campus Ready</p>

            <!-- Footer -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-top:1px solid #e2e8f0;padding-top:20px;">
                  <p style="margin:0;font-size:14px;color:#64748b;">
                    Questions? <a href="mailto:hello@campusready.org" style="color:#14b8a6;text-decoration:none;font-weight:500;">hello@campusready.org</a>
                    &nbsp;&middot;&nbsp;
                    <a href="tel:+17075958281" style="color:#14b8a6;text-decoration:none;font-weight:500;">(707) 595-8281</a>
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}
