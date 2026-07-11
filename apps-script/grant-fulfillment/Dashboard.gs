// ============================================
// CAMPUS READY — DASHBOARD BUILDER
// ============================================
// Builds or refreshes the Dashboard tab with one row per student.
// Pulls from: Grant_Recipients, RSVP_Responses, Travel_Detail.
//
// New columns auto-added to Grant_Recipients on first run:
//   - Codes Texted
//   - Apps Downloaded
//   - Ramp Invite Sent
//
// Run from Fulfillment Tools menu or directly from Apps Script editor.
// ============================================

function buildDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  _ensureGrantRecipientColumns(ss);

  var recipientData = _readGrantRecipients(ss);
  var rsvpData      = _readRsvpByEmail(ss);
  var travelData    = _readTravelByName(ss);

  var dashboard = ss.getSheetByName('Dashboard');
  if (!dashboard) {
    dashboard = ss.insertSheet('Dashboard');
  }

  dashboard.clearContents();
  dashboard.clearFormats();
  dashboard.clearConditionalFormatRules();

  var headers = [
    'Name', 'College', 'RSVP Status', 'Travel Mode',
    'Housing Docs', 'Acceptance Docs', 'Kit Email Sent',
    'Non-Attendee Email Sent', 'Codes Texted', 'Apps Downloaded', 'Ramp Invite Sent'
  ];

  var rows = [headers];

  recipientData.forEach(function(r) {
    var rsvpKey = r.email || r.name;
    var rsvp    = rsvpData[rsvpKey] || rsvpData[r.name] || '—';
    var travel  = travelData[r.name] || '—';
    rows.push([
      r.name,
      r.college,
      rsvp,
      travel,
      r.housingStatus,
      r.acceptanceStatus,
      r.kitEmailSent,
      r.nonAttendeeEmailSent,
      r.codesTexted,
      r.appsDownloaded,
      r.rampInviteSent
    ]);
  });

  dashboard.getRange(1, 1, rows.length, headers.length).setValues(rows);

  // ── Header row ──
  var headerRange = dashboard.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#469E92');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  headerRange.setFontFamily('Inter');

  // ── Column widths ──
  dashboard.setColumnWidth(1,  200); // Name
  dashboard.setColumnWidth(2,  200); // College
  dashboard.setColumnWidth(3,  150); // RSVP Status
  dashboard.setColumnWidth(4,  170); // Travel Mode
  dashboard.setColumnWidth(5,  130); // Housing Docs
  dashboard.setColumnWidth(6,  140); // Acceptance Docs
  dashboard.setColumnWidth(7,  120); // Kit Email Sent
  dashboard.setColumnWidth(8,  175); // Non-Attendee Email Sent
  dashboard.setColumnWidth(9,  120); // Codes Texted
  dashboard.setColumnWidth(10, 130); // Apps Downloaded
  dashboard.setColumnWidth(11, 130); // Ramp Invite Sent

  dashboard.setFrozenRows(1);

  // ── Alternating row backgrounds ──
  for (var i = 2; i <= rows.length; i++) {
    if (i % 2 === 0) {
      dashboard.getRange(i, 1, 1, headers.length).setBackground('#F9FAFB');
    }
  }

  // ── Conditional formatting: RSVP column (col 3) ──
  var rsvpRange   = dashboard.getRange(2, 3, rows.length - 1, 1);
  var docsRange   = dashboard.getRange(2, 5, rows.length - 1, 2); // Housing + Acceptance
  var formatRules = [];

  formatRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('attending')
      .setBackground('#DCFCE7').setFontColor('#166534')
      .setRanges([rsvpRange]).build()
  );
  formatRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('attending_with_guest')
      .setBackground('#DCFCE7').setFontColor('#166534')
      .setRanges([rsvpRange]).build()
  );
  formatRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('not_attending')
      .setBackground('#FEE2E2').setFontColor('#991B1B')
      .setRanges([rsvpRange]).build()
  );
  formatRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Approved')
      .setBackground('#DCFCE7').setFontColor('#166534')
      .setRanges([docsRange]).build()
  );
  formatRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Pending')
      .setBackground('#FEF3C7').setFontColor('#92400E')
      .setRanges([docsRange]).build()
  );
  formatRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Uploaded')
      .setBackground('#DBEAFE').setFontColor('#1E40AF')
      .setRanges([docsRange]).build()
  );

  dashboard.setConditionalFormatRules(formatRules);

  SpreadsheetApp.getUi().alert(
    'Dashboard updated',
    (rows.length - 1) + ' students. Last refreshed: ' + new Date().toLocaleString(),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ============================================
// ENSURE TRACKING COLUMNS IN GRANT_RECIPIENTS
// ============================================

function _ensureGrantRecipientColumns(ss) {
  var sheet = ss.getSheetByName('Grant_Recipients');
  if (!sheet) return;
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  ['Codes Texted', 'Apps Downloaded', 'Ramp Invite Sent'].forEach(function(colName) {
    if (headers.indexOf(colName) === -1) {
      var nextCol = sheet.getLastColumn() + 1;
      sheet.getRange(1, nextCol).setValue(colName);
      headers.push(colName);
    }
  });
}

// ============================================
// READ GRANT_RECIPIENTS
// ============================================

function _readGrantRecipients(ss) {
  var sheet = ss.getSheetByName('Grant_Recipients');
  if (!sheet) return [];

  var data    = sheet.getDataRange().getValues();
  var headers = data[0];

  var nameCol       = headers.indexOf('Student Name');
  var emailCol      = headers.indexOf('Email Address');
  var collegeCol    = headers.indexOf('College Name');
  var housingCol    = headers.indexOf('Housing Status');
  var acceptCol     = headers.indexOf('Acceptance Status');
  var kitCol        = headers.indexOf('Kit Email Sent');
  var nonAttCol     = headers.indexOf('Non-Attendee Email Sent');
  var codesCol      = headers.indexOf('Codes Texted');
  var appsCol       = headers.indexOf('Apps Downloaded');
  var rampInviteCol = headers.indexOf('Ramp Invite Sent');

  var results = [];
  for (var i = 1; i < data.length; i++) {
    var name = (data[i][nameCol] || '').trim();
    if (!name) continue;
    results.push({
      name:                 name,
      email:                (data[i][emailCol]      || '').toLowerCase().trim(),
      college:              (data[i][collegeCol]     || ''),
      housingStatus:        (data[i][housingCol]     || 'Pending'),
      acceptanceStatus:     (data[i][acceptCol]      || 'Pending'),
      kitEmailSent:         (data[i][kitCol]         || ''),
      nonAttendeeEmailSent: nonAttCol     >= 0 ? (data[i][nonAttCol]     || '') : '',
      codesTexted:          codesCol      >= 0 ? (data[i][codesCol]      || '') : '',
      appsDownloaded:       appsCol       >= 0 ? (data[i][appsCol]       || '') : '',
      rampInviteSent:       rampInviteCol >= 0 ? (data[i][rampInviteCol] || '') : ''
    });
  }
  return results;
}

// ============================================
// READ RSVP_RESPONSES (keyed by lowercase email, fallback by name)
// Most-recent-wins for duplicate entries — matches DEC-035 rule.
// ============================================

function _readRsvpByEmail(ss) {
  var sheet = ss.getSheetByName('RSVP_Responses');
  if (!sheet) return {};

  var data    = sheet.getDataRange().getValues();
  var headers = data[0];

  var emailCol  = headers.indexOf('Email');
  var nameCol   = headers.indexOf('Name');
  var statusCol = headers.indexOf('Status');
  var tsCol     = headers.indexOf('Time Stamp');

  var lookup     = {};
  var timestamps = {};

  for (var i = 1; i < data.length; i++) {
    var email  = (data[i][emailCol] || '').toLowerCase().trim();
    var name   = (data[i][nameCol]  || '').trim();
    var status = (data[i][statusCol] || '').trim();
    var ts     = data[i][tsCol] ? String(data[i][tsCol]) : '';

    if (!status) continue;

    // Most-recent timestamp wins when the same key appears twice
    if (email) {
      if (!timestamps[email] || ts > timestamps[email]) {
        lookup[email]     = status;
        timestamps[email] = ts;
      }
    }
    if (name) {
      if (!timestamps[name] || ts > timestamps[name]) {
        lookup[name]     = status;
        timestamps[name] = ts;
      }
    }
  }
  return lookup;
}

// ============================================
// READ TRAVEL_DETAIL (keyed by student name)
// ============================================

function _readTravelByName(ss) {
  var sheet = ss.getSheetByName('Travel_Detail');
  if (!sheet) return {};

  var data    = sheet.getDataRange().getValues();
  var headers = null;

  // Find the header row (some exports have notes rows above headers)
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase().indexOf('student name') !== -1 ||
        String(data[i][0]).trim() === 'Student Name') {
      headers = data[i];
      data    = data.slice(i + 1);
      break;
    }
  }
  if (!headers) return {};

  var nameCol = -1;
  var modeCol = -1;
  headers.forEach(function(h, idx) {
    var s = String(h).trim().toLowerCase();
    if (s === 'student name')    nameCol = idx;
    if (s === 'transport mode')  modeCol = idx;
  });
  if (nameCol === -1 || modeCol === -1) return {};

  var lookup = {};
  data.forEach(function(row) {
    var name = (row[nameCol] || '').trim();
    var mode = (row[modeCol] || '').trim();
    if (name && mode) lookup[name] = mode;
  });
  return lookup;
}
