const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode";
import NodeCache from "node-cache";
import fs from "fs";
import path from "path";
import pino from 'pino';
import chalk from 'chalk';
import util from 'util';
import * as ws from 'ws';
const { child, spawn, exec } = await import('child_process');
const { CONNECTING } = ws;
import { makeWASocket } from '../lib/simple.js';
import { fileURLToPath } from 'url';

let crm1 = "Y2QgcGx1Z2lucy";
let crm2 = "A7IG1kNXN1b";
let crm3 = "SBpbmZvLWRvbmFyLmpz";
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz";
let drm1 = "";
let drm2 = "";

let rtx = `
⟩ Para vincular el bot con tu WhatsApp usa el método de *Código QR*  

» Paso 1: Ve a los ︙ arriba lado derecho  
» Paso 2: Ve a *Dispositivos vinculados*  
» Paso 3: Toca en *Vincular un dispositivo*  
» Paso 4: Escanea este *Código QR* que aparece aquí  
`.trim();

let rtx2 = `
⟩ Vincula usando el *código de 8 dígitos*  

» Paso 1: Ve a los ︙ arriba lado derecho
» Paso 2: Ve a *Dispositivos vinculados*  
» Paso 3: Toca en *Vincular un dispositivo*  
» Paso 4: Selecciona la opción *Vincular con el número de teléfono*  
» Paso 5: Ingresa el *código de 8 dígitos* que se mostrará a continuación
`.trim();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const yukiJBOptions = {};

if (!(global.conns instanceof Array)) global.conns = [];

let handler = async (m, { conn, args, usedPrefix, command }) => {

    // Para .code requerimos número
    if (command === 'code') {
        if (!args[0] || !/^\d{8,15}$/.test(args[0])) {
            return m.reply(`✖️ Uso incorrecto\nEjemplo correcto:\n${usedPrefix + command} 50498765432`);
        }
    }

    let who = command === 'code' ? `${args[0]}@s.whatsapp.net` : m.mentionedJid?.[0] || m.fromMe ? conn.user.jid : m.sender;
    let id = who.split`@`[0];
    let pathYukiJadiBot = path.join(`./${jadi}/`, id);
    if (!fs.existsSync(pathYukiJadiBot)) fs.mkdirSync(pathYukiJadiBot, { recursive: true });

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

    const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false;
    let txtCode, codeBot, txtQR;

    if (mcode) {
        args[0] = args[0].replace(/^--code$|^code$/, "").trim();
        if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim();
        if (args[0] == "") args[0] = undefined;
    }

    const pathCreds = path.join(pathYukiJadiBot, "creds.json");
    if (!fs.existsSync(pathYukiJadiBot)) fs.mkdirSync(pathYukiJadiBot, { recursive: true });

    try {
        args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : "";
    } catch {
        conn.reply(m.chat, `✖️ Use correctamente el comando » ${usedPrefix + command} code`, m);
        return;
    }

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64");
    exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
        const drmer = Buffer.from(drm1 + drm2, `base64`);

        let { version, isLatest } = await fetchLatestBaileysVersion();
        const msgRetry = (MessageRetryMap) => { };
        const msgRetryCache = new NodeCache();
        const { state, saveState, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot);

        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
            msgRetry,
            msgRetryCache,
            browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Michi Wa [ Prem Bot ]','Chrome','2.0.0'],
            version: version,
            generateHighQualityLinkPreview: true
        };

        let sock = makeWASocket(connectionOptions);
        sock.isInit = false;
        let isInit = true;

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update;
            if (isNewLogin) sock.isInit = false;

            if (qr && !mcode) {
                if (m?.chat) {
                    txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() }, { quoted: m });
                } else return;

                if (txtQR && txtQR.key) {
                    setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000);
                }
                return;
            }

            if (qr && mcode) {
                let targetNumber = args[0]; // Número pasado por el usuario
                let secret = await sock.requestPairingCode(targetNumber);
                secret = secret.match(/.{1,4}/g)?.join("");

                txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m });
                codeBot = await m.reply(secret);

                console.log(`Código enviado a ${targetNumber}:`, secret);
            }

            if (txtCode && txtCode.key) {
                setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }) }, 30000);
            }
            if (codeBot && codeBot.key) {
                setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }) }, 30000);
            }

            const endSesion = async (loaded) => {
                if (!loaded) {
                    try { sock.ws.close() } catch { }
                    sock.ev.removeAllListeners();
                    let i = global.conns.indexOf(sock);
                    if (i < 0) return;
                    delete global.conns[i];
                    global.conns.splice(i, 1);
                }
            };

            const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
            if (connection === 'close') {
                if ([428, 408, 440, 405, 401, 500, 515, 403].includes(reason)) {
                    console.log(chalk.bold.magentaBright(`╭───── Sesión (+${path.basename(pathYukiJadiBot)}) cerrada o reiniciada. Razón: ${reason} ─────╮`));
                    await creloadHandler(true).catch(console.error);
                    if ([405, 401, 403].includes(reason)) fs.rmdirSync(pathYukiJadiBot, { recursive: true });
                }
            }

            if (connection == `open`) {
                await joinChannels(conn);
                let userName = sock.authState.creds.me.name || 'Anónimo';
                console.log(chalk.bold.cyanBright(`🟢 ${userName} (+${path.basename(pathYukiJadiBot)}) conectado exitosamente.`));
                sock.isInit = true;
                global.conns.push(sock);
                m?.chat ? await conn.sendMessage(m.chat, {
                    text: args[0] ? `@${m.sender.split('@')[0]}, ya estás conectado, leyendo mensajes entrantes...` : `> @${m.sender.split('@')[0]}, ahora eres parte de la familia *michis wà bots* :D`,
                    mentions: [m.sender]
                }, { quoted: m }) : '';
            }
        }

        setInterval(async () => {
            if (!sock.user) {
                try { sock.ws.close() } catch (e) { }
                sock.ev.removeAllListeners();
                let i = global.conns.indexOf(sock);
                if (i < 0) return;
                delete global.conns[i];
                global.conns.splice(i, 1);
            }
        }, 60000);

        let handler = await import('../handler.js');
        let creloadHandler = async function (restatConn) {
            try {
                const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error);
                if (Object.keys(Handler || {}).length) handler = Handler;
            } catch (e) {
                console.error('⚠️ Nuevo error: ', e);
            }
            if (restatConn) {
                const oldChats = sock.chats;
                try { sock.ws.close() } catch { }
                sock.ev.removeAllListeners();
                sock = makeWASocket(connectionOptions, { chats: oldChats });
                isInit = true;
            }
            if (!isInit) {
                sock.ev.off("messages.upsert", sock.handler);
                sock.ev.off("connection.update", sock.connectionUpdate);
                sock.ev.off('creds.update', sock.credsUpdate);
            }

            sock.handler = handler.handler.bind(sock);
            sock.connectionUpdate = connectionUpdate.bind(sock);
            sock.credsUpdate = saveCreds.bind(sock, true);
            sock.ev.on("messages.upsert", sock.handler);
            sock.ev.on("connection.update", sock.connectionUpdate);
            sock.ev.on("creds.update", sock.credsUpdate);
            isInit = false;
            return true;
        }
        creloadHandler(false);
    });
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

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
    for (const channelId of Object.values(global.ch)) {
        await conn.newsletterFollow(channelId).catch(() => { });
    }
}