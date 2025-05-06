require('dotenv').config();

module.exports = {
  whatsapp: {
    // Contoh: nomor WhatsApp bisnis, API key, dll
    // Sesuaikan dengan provider WhatsApp yang digunakan
    // Misal untuk Baileys, tidak perlu API key, tapi untuk Twilio perlu SID dan token
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_WHATSAPP_NUMBER
  },
  google: {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null
  }
};
