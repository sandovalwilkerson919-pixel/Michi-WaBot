//--> Hecho por Ado-rgb (github.com/Ado-rgb)
// •|• No quites créditos..
import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  const text = args.join(' ')
  if (!text) return m.reply('✐ Debes escribir el texto para convertir en audio.')

  try {
    const res = await fetch(`https://myapiadonix.vercel.app/tools/tts?text=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.status || !Array.isArray(json.result)) {
      return m.reply('✿ Error al obtener datos de la API.')
    }

    
    const mickeyData = json.result.find(v => v.voice_name?.toLowerCase().includes('mickey'))
    if (!mickeyData || !mickeyData.mickey_mouse) {
      return m.reply('✐ No se encontró la voz de Mickey Mouse en la respuesta.')
    }

    const audioRes = await fetch(mickeyData.mickey_mouse)
    const audioBuffer = await audioRes.arrayBuffer()

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('✐ Ocurrió un error al generar el audio con Mickey Mouse.')
  }
}

handler.command = /^tts$/
handler.help = ['tts']
handler.tags = ['tools']
export default handler