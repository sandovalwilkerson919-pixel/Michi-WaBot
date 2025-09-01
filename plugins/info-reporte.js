import { promises as fs } from 'fs';
import path from 'path';

var handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, `⚠️ *Uso correcto:* /report <mensaje del error>`, m);
  }

  try {
    const creador = '+50493732693@s.whatsapp.net'; 
    const remitente = m.sender.split('@')[0];

    const mensaje = `
📣 *📌 NUEVO REPORTE DE ERROR*

👤 *De:* @${remitente}
💬 *Chat:* ${m.chat}
📝 *Mensaje enviado:* 
${text}

🕒 *Fecha:* ${new Date().toLocaleString()}

🔥 *Atención:* Revisar y solucionar lo más pronto posible.
`;

    await conn.sendMessage(creador, { text: mensaje, mentions: [m.sender] });
    await conn.reply(m.chat, `> 🌾 *Reporte enviado con éxito* Gracias por ayudar a mejorar el bot.`, m);
  } catch (err) {
    console.error('Error enviando reporte:', err);
    await conn.reply(m.chat, `❌ Ocurrió un error al enviar el reporte.`, m);
  }
};

handler.help = ['reportar'];
handler.tags = ['info'];
handler.command = ['report', 'reporte', 'reportar'];


export default handler;