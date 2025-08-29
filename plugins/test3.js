import fetch from 'node-fetch'
import fs from 'fs'
import { proto } from '@whiskeysockets/baileys'

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

    const estilos = [
      "💕 SIGUIENTE 💕","💞 SIGUIENTE 💞","🩷 SIGUIENTE 🩷","💌 SIGUIENTE 💌",
      "🧡 SIGUIENTE 🧡","❤️ SIGUIENTE ❤️","💛 SIGUIENTE 💛","💚 SIGUIENTE 💚",
      "🩵 SIGUIENTE 🩵","💙 SIGUIENTE 💙","💜 SIGUIENTE 💜","🤍 SIGUIENTE 🤍",
      "❤️‍🔥 SIGUIENTE ❤️‍🔥","❣️ SIGUIENTE ❣️","💓 SIGUIENTE 💓",
      "💗 SIGUIENTE 💗","💝 SIGUIENTE 💝","💖 SIGUIENTE 💖"
    ]
    const estilo = estilos[Math.floor(Math.random() * estilos.length)]

    // fake product como quoted
    const gp = proto.Message.fromObject({
      key: { fromMe: false, participant: '0@s.whatsapp.net' },
      message: {
        productMessage: {
          product: {
            productImage: {
              mimetype: 'image/jpeg',
              jpegThumbnail: fs.readFileSync('./storage/img/menu2.jpg')
            },
            title: 'BlackPink',
            description: 'by GP',
            currencyCode: 'USD',
            priceAmount1000: '1000000000',
            retailerId: 'Ghost',
            productImageCount: 1
          },
          businessOwnerJid: '0@s.whatsapp.net'
        }
      }
    })

    // preparar imagen como media para interactiveMessage
    const mediaMsg = await conn.prepareMessageMedia({ image: { url: randomkpopx } }, { upload: conn.waUploadToServer })

    await conn.sendMessage(
      m.chat,
      {
        interactiveMessage: {
          body: { text: frase },
          footer: { text: namebot },
          header: { hasMediaAttachment: true, imageMessage: mediaMsg.imageMessage },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                  display_text: estilo,
                  id: `/${command}`
                })
              }
            ]
          }
        }
      },
      { quoted: gp }
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