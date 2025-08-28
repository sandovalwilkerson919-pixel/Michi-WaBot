import fetch from 'node-fetch'

let handler = async (m, { conn, command }) => {
  try {
    // Emojis de corazones para los botones
    const hearts = [
      "💕", "💞", "🩷", "💌", "🧡", "❤️", "💛", 
      "💚", "🩵", "💙", "💜", "🤍", "❤️‍🔥", 
      "❣️", "💓", "💗", "💝", "💖"
    ]
    const randomHeart = hearts[Math.floor(Math.random() * hearts.length)]

    // Obtiene el txt de imágenes
    let res = await fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/leserafim.txt')
    let txt = await res.text()
    let urls = txt.split('\n').filter(v => v.trim())

    // Elige una al azar
    let randomUrl = urls[Math.floor(Math.random() * urls.length)]

    // Reacciona con un emoji
    conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })

    // Envía la imagen con botones
    await conn.sendButton(
      m.chat,
      `🌸 Le Sserafim llegó al bot 🌸\nDisfruta imágenes y frases random 💕`,
      "byGP",
      randomUrl,
      [[`${randomHeart} SIGUIENTE ${randomHeart}`, `/${command}`]],
      m
    )
  } catch (e) {
    console.error(e)
    m.reply("❌ Hubo un error al cargar la imagen.")
  }
}

handler.help = ['leserafim']
handler.tags = ['kpop']
handler.command = /^leserafim$/i

export default handler