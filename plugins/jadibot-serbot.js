import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Browsers, generateWAMessageFromContent, proto } from "@whiskeysockets/baileys";
import qrcode from "qrcode";
import NodeCache from "node-cache";
import fs from "fs";
import path from "path";
import pino from 'pino';
import chalk from 'chalk';
import util from 'util';
import * as ws from 'ws';
const { exec } = await import('child_process');
import { makeWASocket } from '../lib/simple.js';
import { fileURLToPath } from 'url';


let crm1 = "Y2QgcGx1Z2lucy";
let crm2 = "A7IG1kNXN1b";
let crm3 = "SBpbmZvLWRvbmFyLmpz";
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz";
let drm1 = "";
let drm2 = "";


let rtx = `🎋 𝗩𝗶𝗻𝗰𝘂𝗹𝗮𝗰𝗶𝗼́𝗻 𝗽𝗼𝗿 𝗖𝗼́𝗱𝗶𝗴𝗼 𝗤𝗥

📌 𝗣𝗮𝘀𝗼𝘀 𝗽𝗮𝗿𝗮 𝘃𝗶𝗻𝗰𝘂𝗹𝗮𝗿 𝘁𝘂 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:
1️⃣ Abre 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 en tu teléfono  
2️⃣ Pulsa ⋮ *Más opciones* → *Dispositivos vinculados* 3️⃣ Presiona *"Vincular un dispositivo"* 4️⃣ Escanea el código QR que se mostrará aquí`.trim();

let rtx2 = `🍁 𝗩𝗶𝗻𝗰𝘂𝗹𝗮𝗰𝗶𝗼́𝗻 𝗽𝗼𝗿 𝗖𝗼́𝗱𝗶𝗴𝗼 𝗠𝗮𝗻𝘂𝗮𝗹 (8 dígitos)

📌 𝗣𝗮𝘀𝗼𝘀 𝗽𝗮𝗿𝗮 𝗵𝗮𝗰𝗲𝗿𝗹𝗼:
1️⃣ Abre 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 en tu teléfono  
2️⃣ Pulsa ⋮ *Más opciones* → *Dispositivos vinculados* 3️⃣ Presiona *"Vincular un dispositivo"* 4️⃣ Selecciona *"Vincular con el número de teléfono"* e introduce el código mostrado  

⚠️ 𝗜𝗺𝗽𝗼𝗿𝘁𝗮𝗻𝘁𝗲:  
- Algunos grupos pueden fallar al generar el código.  
- Recomendado: Solicítalo por privado al bot.  
⏳ El código es válido solo para este número y expira en pocos segundos.`.trim();

const yukiJBOptions = {};

if (!global.conns) global.conns = [];

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) {
        return m.reply(`♡ El Comando *${command}* está desactivado temporalmente.`);
    }

    const subBots = global.conns.filter(c => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED);
    if (subBots.length >= 20) {
        return m.reply(`No se han encontrado espacios para *Sub-Bots* disponibles.`);
    }

    let time = global.db.data.users[m.sender].Subs + 120000;
    if (new Date() - global.db.data.users[m.sender].Subs < 120000) {
        return conn.reply(m.chat, `Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot*.`, m);
    }

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    // --- SYNTAX CORRECTION ---
    // Corrected the way the user ID is extracted for clarity and safety.
    let id = who.split('@')[0];
    
    let pathYukiJadiBot = path.join(`./${global.authFile}/`, id);
    if (!fs.existsSync(pathYukiJadiBot)) {
        fs.mkdirSync(pathYukiJadiBot, { recursive: true });
    }

    yukiJBOptions.pathYukiJadiBot = pathYukiJadiBot;
    yukiJBOptions.m = m;
    yukiJBOptions.conn = conn;
    yukiJBOptions.args = args;
    yukiJBOptions.usedPrefix = usedPrefix;
    yukiJBOptions.command = command;
    yukiJBOptions.fromCommand = true;
    
    yukiJadiBot(yukiJBOptions);
    global.db.data.users[m.sender].Subs = Date.now();
};
handler.help = ['qr', 'code'];
handler.tags = ['serbot'];
handler.command = ['qr', 'code'];
export default handler;

export async function yukiJadiBot(options) {
    let { pathYukiJadiBot, m, conn, args, usedPrefix, command } = options;

    if (command === 'code') {
        command = 'qr';
        args.unshift('code');
    }

    const mcode = args.some(arg => /(--code|code)/.test(arg.trim()));
    if (mcode) {
        args = args.filter(arg => !/(--code|code)/.test(arg.trim()));
    }

    const pathCreds = path.join(pathYukiJadiBot, "creds.json");
    if (!fs.existsSync(pathYukiJadiBot)) {
        fs.mkdirSync(pathYukiJadiBot, { recursive: true });
    }

    try {
        if (args[0]) {
            const credsData = JSON.parse(Buffer.from(args[0], "base64").toString("utf-8"));
            fs.writeFileSync(pathCreds, JSON.stringify(credsData, null, '\t'));
        }
    } catch (e) {
        return conn.reply(m.chat, `Use correctamente el comando » ${usedPrefix + command} code`, m);
    }

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64").toString("utf-8");
    exec(comb, async (err, stdout, stderr) => {
        if (err) {
            console.error(chalk.red('Error executing initial command:'), err);
            // Optionally, handle the error, e.g., by notifying the user.
        }

        let { version } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot);

        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
            browser: mcode ? Browsers.macOS("Chrome") : Browsers.macOS("Desktop"),
            version,
            generateHighQualityLinkPreview: true
        };

        let sock = makeWASocket(connectionOptions);
        let isInit = false;

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update;

            if (qr && !mcode) {
                if (m?.chat) {
                    let txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx }, { quoted: m });
                    setTimeout(() => { conn.sendMessage(m.chat, { delete: txtQR.key }); }, 45000);
                }
                return;
            }

            if (qr && mcode) {
                let secret = await sock.requestPairingCode(m.sender.split('@')[0]);
                const caption = `${rtx2}\n\n*👇 Toca el botón para copiar el código 👇*`;

                const buttonMsg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [{
                                        name: 'cta_copy',
                                        buttonParamsJson: JSON.stringify({ display_text: '🧃 Copiar', copy_code: secret })
                                    }]
                                })
                            })
                        }
                    }
                }, { userJid: m.sender, quoted: m });

                await conn.relayMessage(m.chat, buttonMsg.message, { messageId: buttonMsg.key.id });
                setTimeout(() => { conn.sendMessage(m.chat, { delete: buttonMsg.key }); }, 45000);
            }

            if (connection === 'close') {
                const reason = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = [DisconnectReason.connectionClosed, DisconnectReason.connectionLost, DisconnectReason.restartRequired, DisconnectReason.timedOut].includes(reason);
                
                console.log(chalk.yellow(`Connection closed for +${path.basename(pathYukiJadiBot)}, reason: ${DisconnectReason[reason] || reason}`));

                if (shouldReconnect) {
                    // This logic can be expanded to attempt reconnections.
                    fs.rmSync(pathYukiJadiBot, { recursive: true, force: true });
                } else {
                    fs.rmSync(pathYukiJadiBot, { recursive: true, force: true });
                }
            }

            if (connection === 'open') {
                let userName = sock.authState.creds.me.name || 'Anónimo';
                let userJid = sock.authState.creds.me.id.split(':')[0] || path.basename(pathYukiJadiBot);
                console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${userJid}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`));
                sock.isInit = true;
                global.conns.push(sock);
                await joinChannels(sock);
                if (m?.chat) {
                    await conn.sendMessage(m.chat, { text: `@${m.sender.split('@')[0]}, genial ya eres parte de nuestra familia de Sub-Bots.`, mentions: [m.sender] }, { quoted: m });
                }
            }
        }

        sock.ev.on("connection.update", connectionUpdate);
        sock.ev.on("creds.update", saveCreds);
    });
}

function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    return `${minutes} m y ${seconds} s`;
}

async function joinChannels(conn) {
    if (global.ch && typeof global.ch === 'object') {
        for (const channelId of Object.values(global.ch)) {
            await conn.newsletterFollow(channelId).catch((err) => {
                console.log(`Failed to follow channel ${channelId}:`, err);
            });
        }
    }
}
