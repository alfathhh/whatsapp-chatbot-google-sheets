const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const googleSheets = require('./googleSheets');
const fs = require('fs');
const path = require('path');

// Initialize logger
const logger = pino();

// Auth folder
const AUTH_FOLDER = './auth';
if (!fs.existsSync(AUTH_FOLDER)) {
    fs.mkdirSync(AUTH_FOLDER);
}

// Track greeted users
const greetedUsers = new Set();

async function handleMessage(sock, message) {
    try {
        const { remoteJid, fromMe } = message.key;
        const messageText = message?.message?.conversation || 
                          message?.message?.extendedTextMessage?.text || '';

        if (fromMe) return;

        logger.info(`Received message: ${messageText} from ${remoteJid}`);

        // Log user message to Google Sheets
        await googleSheets.logChat(new Date().toISOString(), remoteJid, messageText, '');

        if (!greetedUsers.has(remoteJid)) {
            const welcomeMessage = 'Selamat datang! Terima kasih telah menghubungi chatbot ini.\n\n';
            const menuMessage = '📋 Menu:\n1. Produk\n2. Layanan\n3. Kontak\n\nSilakan ketik salah satu menu di atas untuk memulai.';
            await sock.sendMessage(remoteJid, { text: welcomeMessage + menuMessage });
            greetedUsers.add(remoteJid);
            logger.info(`Sent welcome message to ${remoteJid}`);
            return;
        }

        let response = 'Hai! Terima kasih telah menghubungi chatbot ini.\n\n';
        response += 'Saya adalah bot sederhana yang dapat membantu Anda.\n';
        response += 'Silakan ketik:\n';
        response += '1. "menu" untuk melihat menu\n';
        response += '2. "info" untuk informasi\n';
        response += '3. "bantuan" untuk bantuan';

        if (messageText.toLowerCase() === 'menu') {
            response = '📋 Menu:\n1. Produk\n2. Layanan\n3. Kontak\n\nApakah Anda membutuhkan bantuan lain? Jika ya, silakan ketik menu yang diinginkan. Jika tidak, ketik "tidak".';
        } else if (messageText.toLowerCase() === 'info') {
            response = 'ℹ️ Info:\nIni adalah chatbot WhatsApp sederhana yang dibuat menggunakan Baileys.\n\nApakah Anda membutuhkan bantuan lain? Jika ya, silakan ketik menu yang diinginkan. Jika tidak, ketik "tidak".';
        } else if (messageText.toLowerCase() === 'bantuan') {
            response = '🆘 Bantuan:\nUntuk berbicara dengan admin, silakan ketik "admin".\n\nApakah Anda membutuhkan bantuan lain? Jika ya, silakan ketik menu yang diinginkan. Jika tidak, ketik "tidak".';
        } else if (messageText.toLowerCase() === 'tidak') {
            response = 'Terima kasih telah menghubungi kami. Semoga hari Anda menyenangkan!';
        } else if (messageText.toLowerCase() === 'admin') {
            response = 'Anda dapat menghubungi admin di nomor +62xxxxxxxxxxx.\n\nApakah Anda membutuhkan bantuan lain? Jika ya, silakan ketik menu yang diinginkan. Jika tidak, ketik "tidak".';
        } else if (
            messageText.toLowerCase() !== 'menu' &&
            messageText.toLowerCase() !== 'info' &&
            messageText.toLowerCase() !== 'bantuan' &&
            messageText.toLowerCase() !== 'tidak' &&
            messageText.toLowerCase() !== 'admin'
        ) {
            response = 'Maaf, pilihan Anda tidak ada dalam menu. Anda dapat berbicara dengan orang asli dengan mengetik "admin".\n\nApakah Anda membutuhkan bantuan lain? Jika ya, silakan ketik menu yang diinginkan. Jika tidak, ketik "tidak".';
        } else {
            response = '📋 Menu:\n1. Produk\n2. Layanan\n3. Kontak\n\nApakah Anda membutuhkan bantuan lain? Jika ya, silakan ketik menu yang diinginkan. Jika tidak, ketik "tidak".';
        }

        await sock.sendMessage(remoteJid, { text: response }, { quoted: message });
        logger.info(`Sent response to ${remoteJid}`);

        // Log bot response to Google Sheets
        await googleSheets.logChat(new Date().toISOString(), remoteJid, '', response);

    } catch (error) {
        logger.error('Error handling message:', error);
    }
}

async function connectToWhatsApp() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);

        const sock = makeWASocket({
            printQRInTerminal: true,
            auth: state,
            logger: pino({ level: 'silent' })
        });

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                logger.info('Connection closed due to:', lastDisconnect.error);
                if (shouldReconnect) {
                    connectToWhatsApp();
                }
            } else if (connection === 'open') {
                logger.info('WhatsApp connection established!');
            }

            if (qr) {
                qrcode.generate(qr, { small: true });
            }
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('messages.upsert', async ({ messages }) => {
            for (const message of messages) {
                await handleMessage(sock, message);
            }
        });

    } catch (error) {
        logger.error('Error in WhatsApp connection:', error);
        setTimeout(connectToWhatsApp, 5000);
    }
}

connectToWhatsApp();
