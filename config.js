require('dotenv').config();

module.exports = {
  google: {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null
  },
  // Pengaturan untuk session WhatsApp Web
  sessionPath: './whatsapp-session.json',
  // Pengaturan untuk timeout chat (dalam milidetik)
  chatTimeout: 5 * 60 * 1000, // 5 menit
  // Pesan default
  messages: {
    welcome: `Halo! Selamat datang di layanan chatbot kami.
Silakan pilih menu layanan yang tersedia:
1️⃣ Info Produk
2️⃣ Harga
3️⃣ Jam Operasional
4️⃣ Chat dengan Customer Service

Ketik nomor menu untuk memilih.`,
    closing: 'Terima kasih telah menggunakan layanan kami. Jika ada pertanyaan lain, silakan hubungi kami kembali. Selamat hari!'
  }
};
