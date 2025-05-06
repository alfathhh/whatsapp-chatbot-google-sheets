
Built by https://www.blackbox.ai

---

# WhatsApp Chatbot

Chatbot WhatsApp dengan integrasi Google Spreadsheet. Proyek ini memungkinkan pengguna untuk berinteraksi dengan chatbot melalui WhatsApp dan mencatat percakapan ke Google Spreadsheet.

## Project Overview

WhatsApp Chatbot ini menggunakan API WhatsApp untuk memberikan informasi produk, harga, dan jam operasional kepada pengguna. Dengan kemampuan untuk mengarahkan pertanyaan ke Customer Service dan mencatat semua interaksi dalam Google Sheets, chatbot ini bertujuan untuk meningkatkan pengalaman pengguna.

## Installation

Untuk menjalankan proyek ini, pastikan Anda memiliki [Node.js](https://nodejs.org/) terinstal di komputer Anda. Setelah itu, ikuti langkah-langkah berikut:

1. Clone repositori ini:
   ```bash
   git clone https://github.com/username/whatsapp-chatbot.git
   cd whatsapp-chatbot
   ```

2. Instal dependensi yang diperlukan:
   ```bash
   npm install
   ```

3. Buat file `.env` di direktori proyek untuk menyimpan variabel lingkungan Anda. Berikut adalah contoh variabel yang harus Anda tambahkan:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=your_whatsapp_number
   GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
   GOOGLE_CLIENT_EMAIL=your_service_account_email
   GOOGLE_PRIVATE_KEY=your_service_account_private_key
   PORT=3000
   ```

## Usage

Setelah mengikuti langkah pemasangan, Anda dapat memulai server dengan perintah berikut:
```bash
npm start
```

Bot akan terhubung ke WhatsApp dan Anda dapat mulai mengirim pesan ke nomor WhatsApp yang telah Anda tentukan.

## Features

- Menyediakan informasi produk, harga, dan jam operasional.
- Menyambungkan pengguna ke Customer Service.
- Mencatat semua interaksi pengguna ke Google Sheets.
- Mengirim pesan otomatis berdasarkan pilihan menu pengguna.

## Dependencies

Proyek ini bergantung pada beberapa paket NPM yang dapat ditemukan di `package.json`:

- `express`: Web framework untuk Node.js
- `googleapis`: Paket untuk berinteraksi dengan Google APIs
- `baileys`: Library untuk berinteraksi dengan WhatsApp
- `body-parser`: Middleware untuk menguraikan badan permintaan
- `dotenv`: Memuat variabel lingkungan dari file `.env`

## Project Structure

Berikut adalah struktur dasar dari proyek ini:

```
whatsapp-chatbot/
│
├── .env                # File konfigurasi untuk variabel lingkungan
├── index.js            # Titik masuk aplikasi
├── googleSheets.js     # Kelas untuk berinteraksi dengan Google Sheets
├── config.js           # File konfigurasi untuk WhatsApp dan Google
└── package.json        # File yang berisi metadata proyek dan dependensi
```

Dengan mengikuti instruksi di atas, Anda dapat menjalankan dan mengembangkan chatbot WhatsApp ini sesuai kebutuhan. Jika ada pertanyaan atau masalah, jangan ragu untuk membuka masalah di repositori ini.