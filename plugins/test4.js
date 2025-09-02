import { performance } from "perf_hooks";

const handler = async (m, { conn, usedPrefix }) => {
  try {
    const _uptime = process.uptime() * 1000;
    const uptime = clockString(_uptime);
    const totalreg = Object.keys(global.db.data.users).length;

    const chats = Object.entries(conn.chats).filter(
      ([id, data]) => id && data.isChats,
    );
    const groups = chats.filter(([id]) => id.endsWith("@g.us"));

    const { restrict, antiCall, antiprivado, modejadibot } =
      global.db.data.settings[conn.user.jid] || {};
    const { autoread, gconly, pconly, self } = global.opts || {};

    // Calcular velocidad (latencia)
    const old = performance.now();
    await conn.sendPresenceUpdate("composing", m.chat);
    const neww = performance.now();
    const speed = (neww - old).toFixed(2);

    const info = `
╠═〘 𝐈𝐍𝐅𝐎 𝐃𝐄𝐋 𝐁𝐎𝐓 〙 ═
╠
╠➥ [🤴🏻] Creador: ${author}
╠➥ [#️⃣] Numero: *+52 1 999 209 5479*
╠➥ [🌐] Navegador: *${browser}*
╠➥ [🎳] Prefijo: *${usedPrefix}*
╠➥ [🔐] Chats Privados: *${chats.length - groups.length}*
╠➥ [🦜] Chats de Grupo: *${groups.length}* 
╠➥ [💡] Chats Totales: *${chats.length}* 
╠➥ [🚀] Tiempo Activo: *${uptime}*
╠➥ [🎩] Usuarios: *${totalreg} números*
╠➥ [🔋] Bateria: *${conn.battery
      ? (conn.battery.live ? '🔌 𝙲𝚊𝚛𝚐𝚊𝚗𝚍𝚘...' : '⚡ 𝙳𝚎𝚜𝚌𝚘𝚗𝚎𝚌𝚝𝚊𝚍𝚘')
      : '𝙳𝚎𝚜𝚌𝚘𝚗𝚘𝚒𝚍𝚘'}*
╠➥ [☑️] Autoread: ${autoread ? "*activado*" : "*desactivado*"}
╠➥ [❗] Restrict: ${restrict ? "*activado*" : "*desactivado*"} 
╠➥ [💬] Pconly: ${pconly ? "*𝚊𝚌𝚝𝚒𝚟𝚊𝚍𝚘*" : "*𝚍𝚎𝚜𝚊𝚌𝚝𝚊𝚍𝚘*"}
╠➥ [🏢] Gconly: ${gconly ? "*𝚊𝚌𝚝𝚒𝚟𝚊𝚍𝚘*" : "*𝚍𝚎𝚜𝚊𝚌𝚝𝚊𝚍𝚘*"}
╠➥ [🌎] Modo: ${self ? "*𝚙𝚛𝚒𝚟𝚊𝚍𝚘*" : "*𝚙𝚞𝚋𝚕𝚒𝚌𝚘*"}
╠➥ [💬] Antiprivado: ${antiprivado ? "*𝚊𝚌𝚝𝚒𝚟𝚊𝚍𝚘*" : "*𝚍𝚎𝚜𝚊𝚌𝚝𝚊𝚍𝚘*"}
╠➥ [🤖] ModeJadibot: ${modejadibot ? "*𝚊𝚌𝚝𝚒𝚟𝚊𝚍𝚘*" : "*𝚍𝚎𝚜𝚊𝚌𝚝𝚊𝚍𝚘*"}
╠➥ [📵] Antillamada: ${antiCall ? "*𝚊𝚌𝚝𝚒𝚟𝚊𝚍𝚘*" : "*𝚍𝚎𝚜𝚊𝚌𝚝𝚊𝚍𝚘*"}
╠➥ [🪀] Versión de WhatsApp: *${vs}*
╠➥ [🤖] Bots activos: *${users?.length || '0'}*
╠➥ [👨‍🦯] 𝚅𝙴𝙻𝙾𝙲𝙸𝙳𝙰𝙳: *${speed} ms*
╠
╠═〘 ${namebot} 〙 ═
`.trim();

    const doc = [
      "pdf",
      "zip",
      "vnd.openxmlformats-officedocument.presentationml.presentation",
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const document = doc[Math.floor(Math.random() * doc.length)];

    const Message = {
      document: { url: `https://github.com/Ado-rgb/Michi-WaBot` },
      mimetype: `application/${document}`,
      fileName: `「  𝑯𝒆𝒍𝒍𝒐 𝑾𝒐𝒓𝒍𝒅 」`,
      fileLength: 10000000,
      pageCount: 200,
      contextInfo: {
        forwardingScore: 200,
        isForwarded: true,
        externalAdReply: {
          mediaUrl: "https://github.com/Ado926",
          mediaType: 2,
          previewType: "pdf",
          title: "ᴇʟ ᴍᴇᴊᴏʀ ʙᴏᴛ ᴅᴇ ᴡʜᴀᴛsᴀᴘᴘ",
          body: namebot,
          thumbnail: imagen1,
          sourceUrl: "https://github.com/GianPoolS",
        },
      },
      caption: info,
      footer: namebot,
      headerType: 6,
    };

    await conn.sendMessage(m.chat, Message, { quoted: m });
  } catch (e) {
    console.error("❌ Error en infobot.js:", e);
    await conn.sendMessage(m.chat, { text: "⚠️ Error en infobot: " + e.message }, { quoted: m });
  }
};

handler.help = [""];
handler.tags = [""];
handler.command = ["infobot","t4"];
export default handler;

function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}