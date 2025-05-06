# WhatsApp Chatbot dengan Log Spreadsheet

Sebuah chatbot WhatsApp yang dibuat menggunakan Node.js dan Baileys, dengan fitur logging pesan ke Google Spreadsheet.

## Fitur

- Koneksi otomatis ke WhatsApp Web
- Autentikasi menggunakan QR Code
- Penyimpanan sesi otomatis
- Penanganan pesan dasar
- Sistem menu sederhana
- Logging pesan ke Google Spreadsheet
- Logging untuk debugging

## Persyaratan

- Node.js versi 14 atau lebih baru
- NPM (Node Package Manager)
- Koneksi internet yang stabil
- Smartphone dengan WhatsApp terinstall
- Akun Google dan akses ke Google Cloud Console

## Instalasi

1. Clone repository ini atau download source code
2. Buka terminal dan masuk ke direktori project:
   ```bash
   cd whatsapp-chatbot
   ```
3. Install dependencies yang diperlukan:
   ```bash
   npm install
   ```

## Setup Google Sheets

### 1. Buat Google Spreadsheet
1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru
3. Catat ID spreadsheet dari URL (bagian antara /d/ dan /edit)
4. Update file `config.js` dengan ID spreadsheet Anda

### 2. Setup Google Cloud Project
1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru atau pilih project yang sudah ada
3. Aktifkan Google Sheets API:
   - Buka "APIs & Services" > "Library"
   - Cari "Google Sheets API"
   - Klik "Enable"

### 3. Buat Service Account
1. Di Google Cloud Console:
   - Buka "APIs & Services" > "Credentials"
   - Klik "Create Credentials" > "Service Account"
   - Isi informasi yang diperlukan
   - Klik "Create and Continue"
   - Pilih role "Editor"
   - Klik "Done"

2. Buat dan download key:
   - Klik service account yang baru dibuat
   - Buka tab "Keys"
   - Klik "Add Key" > "Create new key"
   - Pilih "JSON"
   - Klik "Create"
   - File credentials akan terdownload

3. Setup credentials:
   - Rename file credentials yang didownload menjadi `credentials.json`
   - Pindahkan ke folder project (root directory)
   - Share Google Spreadsheet dengan email service account dari credentials

### 4. Update Konfigurasi
1. Buka file `config.js`
2. Update `SPREADSHEET_ID` dengan ID dari spreadsheet Anda

## Menjalankan Bot

1. Pastikan semua setup sudah selesai:
   - Dependencies terinstall (`npm install`)
   - credentials.json ada di root directory
   - config.js sudah diupdate dengan Spreadsheet ID
   - Spreadsheet sudah di-share dengan service account

2. Jalankan bot:
   ```bash
   npm start
   ```

3. Scan QR Code yang muncul dengan WhatsApp di smartphone Anda:
   - Buka WhatsApp
   - Tap Menu atau Settings
   - Pilih WhatsApp Web
   - Scan QR Code yang muncul di terminal

## Format Log Spreadsheet

Bot akan mencatat setiap interaksi di spreadsheet dengan format:
1. Timestamp - Waktu pesan diterima
2. Sender - Nomor WhatsApp pengirim
3. Message Type - Tipe pesan (text, image, dll)
4. Message Content - Isi pesan
5. Response - Balasan yang diberikan bot

## Perintah yang Tersedia

Bot akan merespon perintah berikut:
1. "menu" - Menampilkan daftar menu
2. "info" - Menampilkan informasi bot
3. "bantuan" - Menampilkan bantuan

## Troubleshooting

### Masalah Koneksi WhatsApp
- Pastikan smartphone terhubung internet
- Coba scan ulang QR Code
- Pastikan WhatsApp di smartphone aktif

### Masalah Google Sheets
- Periksa credentials.json ada di root directory
- Pastikan format credentials.json valid
- Verifikasi Spreadsheet ID di config.js
- Pastikan spreadsheet sudah di-share dengan service account

### Error Umum
- Periksa log di terminal untuk detail error
- Pastikan semua dependencies terinstall
- Verifikasi Node.js versi 14 atau lebih baru

## Keamanan

- Jangan share credentials.json
- Jangan share QR Code WhatsApp
- Batasi akses ke Google Spreadsheet
- Jaga kerahasiaan service account
- Logout dari WhatsApp Web jika sudah selesai
