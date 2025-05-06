const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('./googleSheets');
const config = require('./config');

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Inisialisasi WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

// Map untuk menyimpan status interaksi pengguna
const userLastInteraction = new Map();
const userInService = new Map();

// Event saat QR code tersedia untuk scan
client.on('qr', (qr) => {
    console.log('QR Code tersedia untuk di scan:');
    qrcode.generate(qr, { small: true });
});

// Event saat client siap
client.on('ready', () => {
    console.log('Client WhatsApp siap!');
});

// Event saat menerima pesan
client.on('message', async msg => {
    const chat = await msg.getChat();
    const sender = msg.from;
    const messageContent = msg.body;

    // Update waktu interaksi terakhir
    userLastInteraction.set(sender, Date.now());

    // Log pesan ke Google Sheets
    await googleSheets.logChat(new Date().toISOString(), sender, messageContent, '');

    // Cek jika user sedang dalam mode CS
    if (userInService.get(sender) === 'cs') {
        await msg.reply('Pesan Anda telah diteruskan ke Customer Service. Mohon tunggu.');
        return;
    }

    // Handle pesan pertama atau command 'menu'
    if (messageContent.toLowerCase() === 'menu' || !userLastInteraction.has(sender)) {
        await sendMenu(chat);
        return;
    }

    // Handle pilihan menu
    let botResponse = '';
    switch (messageContent.trim()) {
        case '1':
            botResponse = 'Info Produk: Kami menyediakan berbagai produk berkualitas dengan harga terbaik.';
            break;
        case '2':
            botResponse = 'Harga: Harga produk kami bervariasi sesuai jenis dan jumlah pembelian. Silakan tanyakan produk spesifik yang Anda minati.';
            break;
        case '3':
            botResponse = 'Jam Operasional: Senin - Jumat, 08.00 - 17.00 WIB.';
            break;
        case '4':
            userInService.set(sender, 'cs');
            botResponse = 'Anda akan terhubung dengan Customer Service kami. Mohon tunggu sebentar.';
            break;
        default:
            botResponse = 'Maaf, pilihan tidak dikenali. Ketik "menu" untuk melihat pilihan layanan yang tersedia.';
    }

    // Kirim respons
    await chat.sendMessage(botResponse);

    // Log respons bot ke Google Sheets
    await googleSheets.logChat(new Date().toISOString(), sender, '', botResponse);

    // Tanyakan apakah ada yang bisa dibantu lagi
    if (!userInService.get(sender)) {
        setTimeout(async () => {
            await chat.sendMessage('Apakah ada yang bisa kami bantu lagi? Ketik "menu" untuk melihat layanan kami, atau ketik "selesai" jika sudah selesai.');
        }, 2000);
    }
});

// Fungsi untuk mengirim menu
async function sendMenu(chat) {
    await chat.sendMessage(config.messages.welcome);
}

// Cek inaktivitas pengguna setiap menit
setInterval(() => {
    const now = Date.now();
    for (const [user, lastTime] of userLastInteraction.entries()) {
        if (now - lastTime > config.chatTimeout) {
            client.sendMessage(user, config.messages.closing);
            userLastInteraction.delete(user);
            userInService.delete(user);
        }
    }
}, 60000);

// Inisialisasi client WhatsApp
client.initialize();

// Start server Express
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});

// Handle error
client.on('auth_failure', () => {
    console.error('Autentikasi gagal! Pastikan WhatsApp Web tersambung dengan benar.');
});

client.on('disconnected', (reason) => {
    console.log('Client terputus:', reason);
    client.destroy();
    client.initialize();
});

// Tangani proses shutdown dengan baik
process.on('SIGINT', async () => {
    console.log('Menutup aplikasi...');
    await client.destroy();
    process.exit(0);
});
