import pkg from 'adonix-scraper'
const { ytmp4 } = pkg

const handler = async (msg, { conn, args }) => {
  const chatId = msg.key.remoteJid

  if (!args[0]) {
    await conn.sendMessage(chatId, {
      text: '⚠️ Pasa el link de YouTube\n\nEjemplo: *.ytadonix https://youtu.be/dQw4w9WgXcQ*'
    }, { quoted: msg })
    return
  }

  const url = args[0]

  try {
    
    await conn.sendMessage(chatId, {
      react: { text: '⏳', key: msg.key }
    })

    const result = await ytmp4(url)

    await conn.sendMessage(chatId, {
      video: { url: result.url },
      caption: `🎥 *${result.title}*`
    }, { quoted: msg })

    
    await conn.sendMessage(chatId, {
      react: { text: '✅', key: msg.key }
    })
  } catch (e) {
    await conn.sendMessage(chatId, {
      text: '❌ Error al procesar el video: ' + e.message
    }, { quoted: msg })

    
    await conn.sendMessage(chatId, {
      react: { text: '❌', key: msg.key }
    })
  }
}

handler.command = ['ytadonix']
handler.group = true
handler.private = false

export default handler
