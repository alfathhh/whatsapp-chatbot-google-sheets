const { google } = require('googleapis');
const config = require('./config');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

class GoogleSheets {
  constructor() {
    this.auth = new google.auth.JWT(
      config.google.clientEmail,
      null,
      config.google.privateKey,
      SCOPES
    );
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    this.spreadsheetId = config.google.spreadsheetId;
  }

  async logChat(timestamp, userId, userMessage, botResponse) {
    const values = [
      [timestamp, userId, userMessage, botResponse]
    ];
    const resource = {
      values,
    };
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A:D',
        valueInputOption: 'RAW',
        resource,
      });
    } catch (error) {
      console.error('Error logging chat to Google Sheets:', error);
    }
  }
}

module.exports = new GoogleSheets();
