import fs from "fs"

let handler = async (m, { conn }) => {
  let fkontak = {
    key: { 
      remoteJid: "120363402280020652@g.us", 
      fromMe: false, 
      id: "MichiBot-MD", 
      participant: "0@s.whatsapp.net" 
    },
    message: { conversation: "⭐ MichiBot-MD ⭐" }
  }

  const listMessage = {
    text: "✨ *Menú de Comandos* ✨",
    footer: namebot,   // ← usa tu variable
    title: "📖 Selecciona una categoría:",
    buttonText: "Menu Lista",
    sections: [
      {
        title: "📌 Información",
        rows: [
          { title: "🤖 Velocidad del Bot", rowId: ".p" },
        ]
      },
      {
        title: "👑 Creador y Colaboradores",
        rows: [
          { title: "👑 Contacto de los Creadores", rowId: ".owner" },
        ]
      },
      {
        title: "🎉 Extras",
        rows: [
          { title: "🎵 Audios de YT", rowId: ".play" },
          { title: "🔧 Menu Lista", rowId: ".menulist" }
        ]
      }
    ]
  }

  await conn.sendMessage(m.chat, { react: { text: '📂', key: m.key } })
  await conn.sendMessage(m.chat, listMessage, { quoted: fkontak })
}

handler.command = /^t6$/i
export default handler