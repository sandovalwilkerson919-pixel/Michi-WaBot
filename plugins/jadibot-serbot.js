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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const yukiJBOptions = {};

if (!global.conns) global.conns = [];

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) {
        return m.reply(`♡ El Comando *${command}* está desactivado temporalmente.`);
    }
    let time = global.db.data.users[m.sender].Subs + 120000;
    if (new Date() - global.db.data.users[m.sender].Subs < 120000) {
        return conn.reply(m.chat, `Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot*.`, m);
    }
    const subBots = global.conns.filter(c => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED);
    if (subBots.length >= 20) {
        return m.reply(`No se han encontrado espacios para *Sub-Bots* disponibles.`);
    }
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let id = who.split('@')[0];
    let pathYukiJadiBot = path.join(`./${global.jadi}/`, id);
    if (!fs.existsSync(pathYukiJadiBot)){
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
    if (!fs.existsSync(pathYukiJadiBot)){
        fs.mkdirSync(pathYukiJadiBot, { recursive: true });
    }
    try {
        if (args[0]) {
            const credsData = JSON.parse(Buffer.from(args[0], "base64").toString("utf-8"));
            fs.writeFileSync(pathCreds, JSON.stringify(credsData, null, '\t'));
        }
    } catch {
        return conn.reply(m.chat, `Use correctamente el comando » ${usedPrefix + command} code`, m);
    }

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64");
    exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
        
        let { version } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot);

        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
            browser: mcode ? Browsers.macOS("Chrome") : Browsers.macOS("Desktop"),
            version: version,
            generateHighQualityLinkPreview: true
        };

        let sock = makeWASocket(connectionOptions);
        
        // Esta variable controlará que el mensaje se envíe una sola vez.
        let qrSent = false;

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update;

            if (qr && !mcode) {
                // Se verifica si el QR ya fue enviado antes de mandar el mensaje.
                if (!qrSent && m?.chat) {
                    let txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim()}, { quoted: m});
                    qrSent = true; // Se marca como enviado
                    setTimeout(() => { conn.sendMessage(m.chat, { delete: txtQR.key }); }, 45000);
                }
                return;
            } 

            if (qr && mcode) {
                // Se aplica la misma verificación para el código con botón.
                if (!qrSent) {
                    let secret = await sock.requestPairingCode(m.sender.split('@')[0]);
                    const caption = `${rtx2}\n\n*👇 Toca el botón para copiar el código 👇*`;

                    const buttonMsg = generateWAMessageFromContent(m.chat, {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadata: {},
                                    deviceListMetadataVersion: 2
                                },
                                interactiveMessage: proto.Message.InteractiveMessage.create({
                                    body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                        buttons: [{
                                            name: 'cta_copy',
                                            buttonParamsJson: JSON.stringify({
                                                display_text: '🧃 Copiar',
                                                copy_code: secret
                                            })
                                        }]
                                    })
                                })
                            }
                        }
                    }, { userJid: m.sender, quoted: m });
                    
                    await conn.relayMessage(m.chat, buttonMsg.message, { messageId: buttonMsg.key.id });
                    qrSent = true; // Se marca como enviado
                    
                    if (buttonMsg.key) {
                        setTimeout(() => {
                            conn.sendMessage(m.chat, { delete: buttonMsg.key });
                        }, 45000);
                    }
                }
            }

            const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
            if (connection === 'close') {
                if (reason === DisconnectReason.badSession) {
                    console.log(chalk.bold.redBright(`Sesión corrupta para (+${path.basename(pathYukiJadiBot)}), borrando y re-escaneando...`));
                    fs.rmSync(pathYukiJadiBot, { recursive: true, force: true });
                } else if (reason === DisconnectReason.connectionClosed || reason === DisconnectReason.connectionLost || reason === DisconnectReason.connectionReplaced || reason === DisconnectReason.loggedOut || reason === DisconnectReason.restartRequired || reason === DisconnectReason.timedOut) {
                    console.log(chalk.bold.redBright(`Conexión cerrada para (+${path.basename(pathYukiJadiBot)}), Razón: ${DisconnectReason[reason] || reason}`));
                    fs.rmSync(pathYukiJadiBot, { recursive: true, force: true });
                }
            }

            if (global.db.data == null) loadDatabase();
            if (connection === 'open') {
                if (!global.db.data?.users) loadDatabase();
                let userName = sock.authState.creds.me.name || 'Anónimo';
                let userJid = sock.authState.creds.me.id.split(':')[0] || `${path.basename(pathYukiJadiBot)}`;
                console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${userJid}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`));
                sock.isInit = true;
                global.conns.push(sock);
                await joinChannels(sock);
                if (m?.chat) {
                    await conn.sendMessage(m.chat, {text: `@${m.sender.split('@')[0]}, genial ya eres parte de nuestra familia de Sub-Bots.`, mentions: [m.sender]}, { quoted: m });
                }
            }
        }
        
        sock.ev.on("connection.update", connectionUpdate);
        sock.ev.on("creds.update", saveCreds);
    });
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    return minutes + ' m y ' + seconds + ' s ';
}

async function joinChannels(conn) {
    if (global.ch && typeof global.ch === 'object') {
        for (const channelId of Object.values(global.ch)) {
            await conn.newsletterFollow(channelId).catch(() => {});
        }
    }
}
