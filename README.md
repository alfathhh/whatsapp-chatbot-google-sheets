# WhatsApp Chatbot dengan Google Sheets Integration

Chatbot WhatsApp yang dapat menangani pesan otomatis dan mencatat log chat ke Google Spreadsheet.

## Fitur

- Menu layanan dalam bentuk tombol/pilihan nomor
- Integrasi dengan Google Spreadsheet untuk log chat
- Opsi untuk chat dengan Customer Service
- Timeout otomatis setelah 5 menit tidak aktif
- Penawaran layanan kembali setelah selesai

## Persyaratan

- Node.js v14 atau lebih baru
- Google Cloud Platform account dengan Sheets API yang aktif
- WhatsApp yang terpasang di smartphone

## Instalasi

1. Clone repository ini
2. Install dependensi:
```bash
npm install
```

3. Buat file `.env` dari `.env.example` dan isi dengan kredensial Anda:
```bash
cp .env.example .env
```

4. Isi kredensial Google Sheets di file `.env`:
```
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_CLIENT_EMAIL=your_service_account_email_here
GOOGLE_PRIVATE_KEY="your_private_key_here"
```

## Pengaturan Google Sheets

1. Buat project baru di [Google Cloud Console](https://console.cloud.google.com)
2. Aktifkan Google Sheets API
3. Buat Service Account dan download kredensialnya
4. Buat spreadsheet baru dan bagikan dengan email service account
5. Copy Spreadsheet ID dari URL dan masukkan ke `.env`

## Menjalankan Aplikasi

1. Jalankan server:
```bash
npm start
```

2. Scan QR Code yang muncul di terminal dengan WhatsApp di smartphone Anda
3. Chatbot siap digunakan!

## Penggunaan

- Kirim pesan apa saja untuk memulai
- Bot akan menampilkan menu layanan yang tersedia
- Pilih menu dengan mengetik nomor (1-4)
- Untuk chat dengan CS, pilih menu 4
- Ketik "menu" untuk melihat menu kembali
- Bot akan timeout setelah 5 menit tidak ada interaksi

## Struktur Log Chat

Google Spreadsheet akan mencatat:
- Timestamp
- ID Pengirim
- Pesan User
- Respons Bot

## Troubleshooting

1. Jika QR Code tidak muncul:
   - Pastikan terminal mendukung tampilan QR Code
   - Coba jalankan ulang aplikasi

2. Jika gagal koneksi ke Google Sheets:
   - Periksa format GOOGLE_PRIVATE_KEY di .env
   - Pastikan service account memiliki akses ke spreadsheet

3. Jika WhatsApp terputus:
   - Aplikasi akan mencoba reconnect otomatis
   - Jika gagal, scan ulang QR Code

## Pengembangan

Untuk memodifikasi perilaku bot:
- Edit pesan di `config.js`
- Tambah/ubah menu di `index.js`
- Sesuaikan timeout di `config.js`

## Keamanan

- Jangan share kredensial Google Sheets
- Simpan file .env dengan aman
- Jangan commit file session WhatsApp ke repository
