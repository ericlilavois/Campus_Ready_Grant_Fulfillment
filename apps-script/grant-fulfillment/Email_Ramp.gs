// ============================================
// CAMPUS READY — RAMP VIRTUAL CARD EXPLAINER EMAIL
// ============================================
// Sent to students before their Ramp invite arrives.
// Explains what the card is, what it covers, and what to do next.
// Personalized by spend program: 'flight' or 'gas_hotel'.
// Gated on docs approval (Housing + Acceptance = Approved).
// Tracks sends in Grant_Recipients "Ramp Email Sent" column.
//
// IMPORTANT: Minors (Amara, Arianna, Gabrielle, Osvaldo) are commented out.
// Uncomment ONLY after guardian authorization mechanism is resolved (DEC-027).
// Arianna corrected from flight to gas_hotel (DEC-041).
// ============================================

const ER_LOGO_URL    = 'https://campusready.org/assets/img/brand/CRF_logo.lockup.GRN.png';
const ER_SUBJECT     = 'Your Campus Ready travel card — here\'s what to expect.';
const ER_SENDER_NAME = 'Campus Ready Foundation';
const ER_TEST_EMAIL  = 'elilavois@gmail.com';

// ============================================
// STUDENT ROSTER
// ============================================
// spendProgram: 'flight' | 'gas_hotel'
// Flight fields: departure (airport code), destination (city name)
// Gas/Hotel fields: driveFrom (city, state), driveTo (city, state)

const RAMP_ROSTER = [
  // ── Flight students (non-minor) ──
  { firstName: 'Elizabeth', email: 'ecmcarmichael7@gmail.com',      college: 'Denison University',        spendProgram: 'flight',    departure: 'SFO', destination: 'Columbus, OH'          },
  { firstName: 'Jimena',    email: 'jimena.inbox@gmail.com',         college: 'University of Chicago',     spendProgram: 'flight',    departure: 'SFO', destination: 'Chicago'               },
  { firstName: 'Journey',   email: 'journeypenterman@gmail.com',     college: 'Cal Poly SLO',              spendProgram: 'flight',    departure: 'SFO', destination: 'San Luis Obispo'       },
  { firstName: 'Michelle',  email: 'villafana.michelle08@gmail.com', college: 'UC San Diego',              spendProgram: 'flight',    departure: 'SFO', destination: 'San Diego'             },
  { firstName: 'Nicholas',  email: 'cjoy1407@gmail.com',             college: 'Boston University',         spendProgram: 'flight',    departure: 'SFO', destination: 'Boston'                },
  { firstName: 'Reese',     email: 'reeseoo888@gmail.com',           college: 'UCLA',                      spendProgram: 'flight',    departure: 'OAK', destination: 'Los Angeles'           },
  { firstName: 'Lilian',    email: 'barrientoslilian367@gmail.com',  college: 'University of Chicago',     spendProgram: 'flight',    departure: 'SFO', destination: 'Chicago'               },
  // ── Gas / Hotel students (non-minor) ──
  { firstName: 'Henry',     email: 'henryray2026@gmail.com',         college: 'Oregon State – Cascades',   spendProgram: 'gas_hotel', driveFrom: 'St. Helena, CA',  driveTo: 'Bend, OR'            },
  { firstName: 'Melanie',   email: 'melanieavila1515@gmail.com',     college: 'Cal Poly SLO',              spendProgram: 'gas_hotel', driveFrom: 'Sonoma, CA',      driveTo: 'San Luis Obispo, CA' },
  { firstName: 'Anastasia', email: 'guerrieranastasia511@gmail.com', college: 'College of Saint Benedict', spendProgram: 'gas_hotel', driveFrom: 'Miami, FL',       driveTo: 'Saint Joseph, MN'    },
  // ── Minors — hold until guardian authorization mechanism resolved (DEC-027) ──
  // Uncomment each line when authorized to send:
  // { firstName: 'Gabrielle', email: 'gabriellemonteiro938@gmail.com', college: 'Whittier College',   spendProgram: 'flight',    departure: 'BOS', destination: 'Los Angeles'    },
  // { firstName: 'Amara',     email: 'amaraboerner5@gmail.com',        college: 'CSU San Marcos',     spendProgram: 'gas_hotel', driveFrom: 'Santa Rosa, CA',  driveTo: 'San Marcos, CA'     },
  // { firstName: 'Arianna',   email: 'deibertarianna@gmail.com',       college: 'San Diego State',    spendProgram: 'gas_hotel', driveFrom: 'Napa, CA',        driveTo: 'San Diego, CA'      },
  // { firstName: 'Osvaldo',   email: 'osvaldor123@icloud.com',         college: 'CSU San Marcos',     spendProgram: 'flight',    departure: 'SFO', destination: 'San Diego'      },
];

// ============================================
// GRANT_RECIPIENTS LOOKUP
// ============================================

function _getERGrantData() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Grant_Recipients');
  if (!sheet) throw new Error('Grant_Recipients sheet not found');

  var data    = sheet.getDataRange().getValues();
  var headers = data[0];

  var emailCol      = headers.indexOf('Email Address');
  var housingCol    = headers.indexOf('Housing Status');
  var acceptanceCol = headers.indexOf('Acceptance Status');

  var sentColName = 'Ramp Email Sent';
  var sentCol     = headers.indexOf(sentColName);
  if (sentCol === -1) {
    sentCol = headers.length;
    sheet.getRange(1, sentCol + 1).setValue(sentColName);
  }

  var lookup = {};
  for (var i = 1; i < data.length; i++) {
    var email = data[i][emailCol];
    if (email) {
      lookup[email.toLowerCase().trim()] = {
        rowIndex:      i + 1,
        housingStatus: data[i][housingCol],
        acceptStatus:  data[i][acceptanceCol],
        alreadySent:   data[i][sentCol]
      };
    }
  }

  return { sheet: sheet, sentCol: sentCol, lookup: lookup };
}

// ============================================
// TEST — sends all roster variants to test address
// ============================================

function testRampEmails() {
  RAMP_ROSTER.forEach(function(student) {
    var testStudent = Object.assign({}, student, { email: ER_TEST_EMAIL });
    _sendEREmail(testStudent);
    Logger.log('Test sent to ' + ER_TEST_EMAIL + ' for ' + student.firstName + ' (' + student.spendProgram + ')');
    Utilities.sleep(300);
  });
  Logger.log('Done — ' + RAMP_ROSTER.length + ' test variants sent to ' + ER_TEST_EMAIL);
}

// ============================================
// MAIN SEND
// ============================================

function sendRampEmails() {
  var ui        = SpreadsheetApp.getUi();
  var grantData = _getERGrantData();
  var lookup    = grantData.lookup;
  var sheet     = grantData.sheet;
  var sentCol   = grantData.sentCol;

  var eligible = RAMP_ROSTER.filter(function(student) {
    var record = lookup[student.email.toLowerCase()];
    if (!record) {
      Logger.log('Not found in Grant_Recipients: ' + student.email);
      return false;
    }
    if (record.housingStatus !== 'Approved' || record.acceptStatus !== 'Approved') {
      Logger.log('Docs not approved — skipping: ' + student.firstName +
        ' (Housing: ' + record.housingStatus + ', Acceptance: ' + record.acceptStatus + ')');
      return false;
    }
    if (record.alreadySent === 'Yes') {
      Logger.log('Already sent — skipping: ' + student.firstName);
      return false;
    }
    return true;
  });

  if (eligible.length === 0) {
    ui.alert('No Eligible Recipients',
      'No students are ready to receive this email.\n\nEither their documents are not yet approved or they have already been sent this email.',
      ui.ButtonSet.OK);
    return;
  }

  var skipped  = RAMP_ROSTER.length - eligible.length;
  var skipNote = skipped > 0 ? '\n\n' + skipped + ' student(s) skipped — docs not approved or already sent.' : '';

  var confirm = ui.alert(
    'Send ' + eligible.length + ' Ramp Card Email(s)?',
    'Ready to send to:\n\n' +
    eligible.map(function(s) { return s.firstName + ' (' + s.spendProgram + ') — ' + s.email; }).join('\n') +
    skipNote + '\n\nThis cannot be undone. Continue?',
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;

  var successCount = 0;
  var errors       = [];

  eligible.forEach(function(student) {
    try {
      _sendEREmail(student);
      var record = lookup[student.email.toLowerCase()];
      sheet.getRange(record.rowIndex, sentCol + 1).setValue('Yes');
      successCount++;
      Logger.log('Sent: ' + student.email);
      Utilities.sleep(200);
    } catch (e) {
      errors.push(student.firstName + ' (' + student.email + '): ' + e.message);
      Logger.log('Failed: ' + student.email + ' — ' + e.message);
    }
  });

  var summary = successCount + ' email(s) sent.';
  if (errors.length > 0) summary += '\n\nErrors:\n' + errors.join('\n');
  ui.alert('Done', summary, ui.ButtonSet.OK);
}

// ============================================
// INTERNAL SENDER
// ============================================

function _sendEREmail(student) {
  GmailApp.sendEmail(student.email, ER_SUBJECT, _buildERText(student), {
    htmlBody: _buildERHtml(student),
    name:     ER_SENDER_NAME,
    from:     'hello@campusready.org',
    replyTo:  'hello@campusready.org'
  });
}

// ============================================
// HTML BUILDER
// ============================================

function _buildERHtml(student) {
  var isFlight = student.spendProgram === 'flight';

  var coversEyebrow = isFlight
    ? '&#x2708;&#xFE0F; Flight to ' + student.college
    : '&#x1F697; Drive to ' + student.college;

  var coversBody = isFlight
    ? 'Your card is loaded with funds to cover your flight from <strong>' + student.departure +
      '</strong> to <strong>' + student.destination + '</strong>. Use it to book your ticket directly through the airline\'s website or app — it\'s configured to work for airline purchases only.' +
      '<br><br>Once your card is active, book directly with the airline and use your Ramp card number at checkout. You\'ll get your card number after you accept your invite and we issue the card.'
    : 'Your card is set up for two things: <strong>gas</strong> during your drive from ' +
      student.driveFrom + ' to ' + student.driveTo +
      ', and <strong>one hotel night</strong> if you need a stop along the way. The card is configured to work at gas stations and hotels only.' +
      '<br><br>No advance booking needed for gas. If you plan to use the hotel night, let us know in advance so we can confirm your card limit covers it.';

  return '<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>\n' +
'<body style="margin:0;padding:0;background:#f1f5f9;">\n' +
'<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">\n' +
'  <tr><td align="center">\n' +
'    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">\n' +
'      <tr><td align="center" style="background:#ffffff;padding:28px 32px 24px;border-bottom:1px solid #e2e8f0;">\n' +
'        <img src="' + ER_LOGO_URL + '" alt="Campus Ready Foundation" style="height:110px;width:auto;display:block;margin:0 auto;">\n' +
'      </td></tr>\n' +
'      <tr><td style="padding:40px 40px 32px;font-family:\'Inter\',-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;">\n' +
'\n' +
'        <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#0f172a;">Hi ' + student.firstName + ',</p>\n' +
'        <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#374151;">We\'re getting your travel card ready. Before the invite arrives in your inbox, here\'s what it is, what it covers, and what to do when you see it.</p>\n' +
'\n' +
'        <!-- Card 1: What is a virtual card -->\n' +
'        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;margin:0 0 16px;">\n' +
'          <tr><td style="padding:24px;">\n' +
'            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#0d9488;">What is a virtual card?</p>\n' +
'            <p style="margin:0;font-size:14px;line-height:1.7;color:#374151;">A virtual card is a digital payment card that\'s connected to funds allocated to you by Campus Ready Foundation. Rather than using a physical card, you\'ll receive a secure card number that can be used for your approved travel purchases. The card draws from the funds we\'ve assigned to it and is subject to spending limits we\'ve configured — so it only works for what it\'s set up to cover.</p>\n' +
'          </td></tr>\n' +
'        </table>\n' +
'\n' +
'        <!-- Card 2: What your card covers -->\n' +
'        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin:0 0 16px;">\n' +
'          <tr><td style="padding:24px;">\n' +
'            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#14b8a6;">' + coversEyebrow + '</p>\n' +
'            <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#0f172a;">What your card covers</p>\n' +
'            <p style="margin:0;font-size:14px;line-height:1.7;color:#374151;">' + coversBody + '</p>\n' +
'          </td></tr>\n' +
'        </table>\n' +
'\n' +
'        <!-- Card 3: What to expect next -->\n' +
'        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;margin:0 0 28px;">\n' +
'          <tr><td style="padding:24px;">\n' +
'            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#b45309;">What to expect next</p>\n' +
'            <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#0f172a;">Three steps when your invite arrives</p>\n' +
'            <table width="100%" cellpadding="0" cellspacing="0">\n' +
'              <tr>\n' +
'                <td style="vertical-align:top;padding-right:14px;width:32px;">\n' +
'                  <div style="width:26px;height:26px;background:#f59e0b;border-radius:50%;text-align:center;line-height:26px;font-size:12px;font-weight:700;color:#ffffff;">1</div>\n' +
'                </td>\n' +
'                <td style="vertical-align:top;padding-bottom:14px;">\n' +
'                  <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;">Watch for an email from Ramp</p>\n' +
'                  <p style="margin:4px 0 0;font-size:13px;line-height:1.6;color:#374151;">You\'ll receive an invitation to create a Ramp account. It comes from Ramp, not from us — check your spam folder if you don\'t see it within a day of when we say it\'s going out.</p>\n' +
'                </td>\n' +
'              </tr>\n' +
'              <tr>\n' +
'                <td style="vertical-align:top;padding-right:14px;">\n' +
'                  <div style="width:26px;height:26px;background:#f59e0b;border-radius:50%;text-align:center;line-height:26px;font-size:12px;font-weight:700;color:#ffffff;">2</div>\n' +
'                </td>\n' +
'                <td style="vertical-align:top;padding-bottom:14px;">\n' +
'                  <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;">Accept and set up your account</p>\n' +
'                  <p style="margin:4px 0 0;font-size:13px;line-height:1.6;color:#374151;">Follow the link in the invite to create your Ramp account. You\'ll set a password and verify your identity. This step must be completed before your card is issued.</p>\n' +
'                </td>\n' +
'              </tr>\n' +
'              <tr>\n' +
'                <td style="vertical-align:top;padding-right:14px;">\n' +
'                  <div style="width:26px;height:26px;background:#f59e0b;border-radius:50%;text-align:center;line-height:26px;font-size:12px;font-weight:700;color:#ffffff;">3</div>\n' +
'                </td>\n' +
'                <td style="vertical-align:top;">\n' +
'                  <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;">We\'ll issue your card</p>\n' +
'                  <p style="margin:4px 0 0;font-size:13px;line-height:1.6;color:#374151;">Once you\'ve accepted, we\'ll issue your virtual card separately — acceptance and card issuance are two distinct steps. You\'ll receive a follow-up from us with your card number and any final instructions before your travel date.</p>\n' +
'                </td>\n' +
'              </tr>\n' +
'            </table>\n' +
'          </td></tr>\n' +
'        </table>\n' +
'\n' +
'        <p style="margin:0 0 4px;font-size:15px;line-height:1.7;color:#374151;">Questions before your invite arrives? Reach out anytime.</p>\n' +
'        <p style="margin:0 0 32px;font-size:15px;font-weight:600;color:#0f172a;">Team Campus Ready</p>\n' +
'\n' +
'        <table width="100%" cellpadding="0" cellspacing="0"><tr>\n' +
'          <td style="border-top:1px solid #e2e8f0;padding-top:20px;">\n' +
'            <p style="margin:0;font-size:14px;color:#64748b;">\n' +
'              Questions? <a href="mailto:hello@campusready.org" style="color:#14b8a6;text-decoration:none;font-weight:500;">hello@campusready.org</a>\n' +
'              &nbsp;&middot;&nbsp;\n' +
'              <a href="tel:+17075958281" style="color:#14b8a6;text-decoration:none;font-weight:500;">(707) 595-8281</a>\n' +
'            </p>\n' +
'          </td>\n' +
'        </tr></table>\n' +
'\n' +
'      </td></tr>\n' +
'    </table>\n' +
'  </td></tr>\n' +
'</table>\n' +
'</body>\n' +
'</html>';
}

// ============================================
// PLAIN TEXT FALLBACK
// ============================================

function _buildERText(student) {
  var isFlight = student.spendProgram === 'flight';

  var coversSection = isFlight
    ? 'FLIGHT TO ' + student.college.toUpperCase() + '\n\n' +
      'Your card covers your flight from ' + student.departure + ' to ' + student.destination + '. ' +
      "Use it to book directly through the airline's website or app. The card is restricted to airline purchases only.\n\n" +
      "You'll get your card number after you accept the invite and we issue the card."
    : 'DRIVE TO ' + student.college.toUpperCase() + '\n\n' +
      'Your card covers gas from ' + student.driveFrom + ' to ' + student.driveTo +
      ', and one hotel night if you need a stop along the way. ' +
      'The card is restricted to gas stations and hotels only.\n\n' +
      "No advance booking needed for gas. If you plan to use the hotel night, let us know so we can confirm your limit.";

  return 'Hi ' + student.firstName + ',\n\n' +
    "We're getting your travel card ready. Before the invite arrives, here's what it is, what it covers, and what to do when you see it.\n\n" +
    'WHAT IS A VIRTUAL CARD?\n\n' +
    "A virtual card is a digital payment card connected to funds Campus Ready Foundation has allocated to you. You'll receive a secure card number — no physical card — that works only for your approved travel purchases. It's subject to spending limits we've configured.\n\n" +
    coversSection + '\n\n' +
    'WHAT TO EXPECT NEXT\n\n' +
    '1. Watch for an invite email from Ramp. Check your spam if you don\'t see it.\n' +
    '2. Accept and set up your Ramp account by following the link in the invite.\n' +
    "3. Once you've accepted, we'll issue your virtual card separately and send final instructions.\n\n" +
    "Questions? Reach out anytime.\n" +
    'Team Campus Ready\n\n' +
    'hello@campusready.org | (707) 595-8281';
}
