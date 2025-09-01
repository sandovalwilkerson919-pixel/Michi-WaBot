// Importamos el nombre del bot desde config.js
import { namebot } from '../config.js'

let handler = async (m, { conn }) => {
  // Mensaje falso de contacto (opcional, para citar)
  let fkontak = {
    key: { 
      remoteJid: "120363402280020652@g.us", 
      fromMe: false, 
      id: "MichiBot-MD", 
      participant: "0@s.whatsapp.net" 
    },
    message: { conversation: namebot }
  }

  try {
    // Definimos el mensaje interactivo
    const interactiveMsg = {
      message: {
        interactiveMessage: {
          header: { 
            title: "📖 Selecciona una categoría:" 
          },
          body: { 
            text: "✨ *Menú de Comandos* ✨" 
          },
          footer: { 
            text: namebot 
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                  title: "📌 Información",
                  sections: [
                    {
                      title: "Información",
                      rows: [
                        { header: "Velocidad", title: "🤖 Velocidad del Bot", id: ".p" }
                      ]
                    },
                    {
                      title: "Creador y Colaboradores",
                      rows: [
                        { header: "Creadores", title: "👑 Contacto de los Creadores", id: ".owner" }
                      ]
                    },
                    {
                      title: "Extras",
                      rows: [
                        { header: "YT", title: "🎵 Audios de YT", id: ".play" },
                        { header: "Menu", title: "🔧 Menu Lista", id: ".menulist" }
                      ]
                    }
                  ]
                })
              }
            ]
          }
        }
      }
    }

    // Reacción rápida
    await conn.sendMessage(m.chat, { react: { text: '📂', key: m.key } })

    // Enviamos el menú como viewOnceMessage
    await conn.sendMessage(m.chat, {
      viewOnceMessage: interactiveMsg
    }, { quoted: fkontak })

  } catch (e) {
    await conn.sendMessage(m.chat, { text: "❌ Error: " + e.message })
  }
}

handler.command = /^t6$/i
export default handler