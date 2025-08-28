// Codigo echo por @xrljose

import Jimp from 'jimp'

let handler = async (m, { conn, args }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''
  if (!mime.startsWith('image/')) return m.reply('*☂️ ¿Dónde está la imagen?')
  
  let pixelSize = parseInt(args[0]) || 32
  if (pixelSize < 8) pixelSize = 8
  if (pixelSize > 1024) pixelSize = 1024
  
  m.react("🕓")
  const media = await q.download()
  
  try {
    const image = await Jimp.read(media)
    const small = image.clone().resize(pixelSize, pixelSize, Jimp.RESIZE_NEAREST_NEIGHBOR)
    const pixelated = small.resize(image.bitmap.width, image.bitmap.height, Jimp.RESIZE_NEAREST_NEIGHBOR)
    const buffer = await pixelated.getBufferAsync(Jimp.MIME_JPEG)
    
    await conn.sendMessage(m.chat, { 
      image: buffer, 
      caption: `Imagen pixelada (tamaño: ${pixelSize})` 
    }, { quoted: m })
    
  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['topixel']
handler.command = ['topixel']
handler.tags = ['tools']

export default handler