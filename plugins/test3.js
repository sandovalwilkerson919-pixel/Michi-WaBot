import fetch from 'node-fetch'

let handler = async (m, { conn, command }) => {
  try {
    const res = await fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/blackpink.txt')
    const body = await res.text()
    const randomkpop = body.split('\n').filter(v => v && v.startsWith('http'))
    const randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]

    const frases = [
      "✨ Disfruta de BlackPink en acción 💖",
      "🌸 Una imagen más de BlackPink 💟",
      "🔥 BlackPink nunca decepciona 🤩",
      "💌 BlackPink siempre brilla 🌟",
      "🎶 BlackPink en tu área 💎",
      "💞 Un regalo visual de BlackPink 🌷"
    ]
    const frase = frases[Math.floor(Math.random() * frases.length)]

    conn.sendMessage(m.chat, { react: { text: '🤩', key: m.key } })
    await conn.sendButton(
      m.chat,
      frase,
      wm, // tu watermark
      randomkpopx,
      [['🔄 SIGUIENTE 🔄', `/${command}`]],
      m
    )
  } catch (e) {
    m.reply('❌ Hubo un error al cargar la imagen.')
    console.error(e)
  }
}

handler.help = ['blackpink']
handler.tags = ['kpop']
handler.command = ['blackpink']

export default handler