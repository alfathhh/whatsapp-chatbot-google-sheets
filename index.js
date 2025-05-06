const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, delay } = require('@adiwajshing/baileys');
const P = require('pino');
const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('./googleSheets');
const config = require('./config');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

const authFile = './auth_info.json';
const { state, saveState } = useSingleFileAuthState(authFile);

let sock;
let userLastInteraction = new Map(); // Map to track last interaction time per user
let userInService = new Map(); // Track if user is chatting with CS

const WELCOME_MESSAGE = `Halo! Selamat datang di layanan chatbot kami. Silakan pilih menu layanan yang tersedia:
1. Info Produk
2. Harga
3. Jam Operasional
4. Chat dengan Customer Service
Ketik nomor menu untuk memilih.`;

const CLOSING_MESSAGE = 'Terima kasih telah menggunakan layanan kami. Jika ada pertanyaan lain, silakan hubungi kami kembali. Selamat hari!';

async function startSock() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`Using WA version v${version.join('.')}, isLatest: ${isLatest}`);

  sock = makeWASocket({
    version,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if(connection === 'close') {
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
      if(shouldReconnect) {
        startSock();
      }
    } else if(connection === 'open') {
      console.log('opened connection');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if(type !== 'notify') return;
    const msg = messages[0];
    if(!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    // Update last interaction time
    userLastInteraction.set(sender, Date.now());

    // Log chat user message
    await googleSheets.logChat(new Date().toISOString(), sender, messageContent, '');

    // Check if user is in CS chat mode
    if(userInService.get(sender) === 'cs') {
      // Here you can implement forwarding message to CS or other logic
      await sock.sendMessage(sender, { text: 'Pesan Anda telah diteruskan ke Customer Service. Mohon tunggu.' });
      return;
    }

    // If first message or user sends 'menu', send welcome message with buttons
    if(messageContent.toLowerCase() === 'menu' || messageContent.trim() === '') {
      await sendMenu(sender);
      return;
    }

    // Handle menu options
    switch(messageContent.trim()) {
      case '1':
        await sendReply(sender, 'Info Produk: Kami menyediakan produk berkualitas dengan harga terbaik.');
        break;
      case '2':
        await sendReply(sender, 'Harga: Harga produk kami bervariasi sesuai jenis dan jumlah pembelian.');
        break;
      case '3':
        await sendReply(sender, 'Jam Operasional: Senin - Jumat, 08.00 - 17.00 WIB.');
        break;
      case '4':
        userInService.set(sender, 'cs');
        await sendReply(sender, 'Anda akan terhubung dengan Customer Service. Silakan tunggu.');
        break;
      default:
        await sendReply(sender, 'Maaf, pilihan tidak dikenali. Silakan ketik "menu" untuk melihat pilihan layanan.');
    }

    // Log bot response
    await googleSheets.logChat(new Date().toISOString(), sender, '', 'Bot response sent');
  });

  // Periodic check for inactivity
  setInterval(() => {
    const now = Date.now();
    for(const [user, lastTime] of userLastInteraction.entries()) {
      if(now - lastTime > 5 * 60 * 1000) { // 5 minutes
        sock.sendMessage(user, { text: CLOSING_MESSAGE });
        userLastInteraction.delete(user);
        userInService.delete(user);
      }
    }
  }, 60 * 1000); // check every 1 minute
}

async function sendMenu(jid) {
  const buttons = [
    { buttonId: '1', buttonText: { displayText: 'Info Produk' }, type: 1 },
    { buttonId: '2', buttonText: { displayText: 'Harga' }, type: 1 },
    { buttonId: '3', buttonText: { displayText: 'Jam Operasional' }, type: 1 },
    { buttonId: '4', buttonText: { displayText: 'Chat dengan CS' }, type: 1 }
  ];
  const buttonMessage = {
    text: 'Halo! Silakan pilih menu layanan yang tersedia:',
    buttons: buttons,
    headerType: 1
  };
  await sock.sendMessage(jid, buttonMessage);
}

async function sendReply(jid, text) {
  await sock.sendMessage(jid, { text });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startSock();
});
