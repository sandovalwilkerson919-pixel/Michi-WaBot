import pkg from 'adonix-scraper'
import fetch from 'node-fetch'

const { ytmp4 } = pkg

const handler = async (msg, { conn, args }) => {
  const chatId = msg.key.remoteJid

  if (!args[0]) {
    return conn.sendMessage(chatId, {
      text: '👉 Pásame un link de YouTube we'
    }, { quoted: msg })
  }

  await conn.sendMessage(chatId, {
    react: { text: '📥', key: msg.key }
  })

  try {
    const url = args[0]
    const result = await ytmp4(url)
    const response = await fetch(result.url)
    const buffer = await response.arrayBuffer()

    await conn.sendMessage(chatId, {
      video: Buffer.from(buffer),
      caption: `🎬 ${result.title}`
    }, { quoted: msg })

  } catch (err) {
    await conn.sendMessage(chatId, {
      text: `❌ Error: ${err.message}`
    }, { quoted: msg })
  }
}

handler.command = ['ytadonix']
handler.group = true
handler.private = false

export default handler
