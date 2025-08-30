// Creado por Ado
import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) {
    return m.reply(
      '🎶 *Descarga rápido tu audio o video*\n' +
      '📌 Uso: `' + usedPrefix + command + ' <nombre o enlace>`\n' +
      'Ej: `' + usedPrefix + command + ' vida de barrio`',
      { quoted: m, ...global.rcanal }
    )
  }

  const isAudio = ['play', 'ytmp3'].includes(command)
  const isVideo = ['play2', 'ytmp4'].includes(command)

  if (!isAudio && !isVideo) {
    return m.reply(
      '⚠️ Usa *play* para audio o *play2* para video.',
      { quoted: m, ...global.rcanal }
    )
  }

  try {
    let url = args[0]
    let videoInfo = null

    if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/i.test(url)) {
      const search = await yts(args.join(' '))
      if (!search.videos?.length) throw new Error('No encontrado')
      videoInfo = search.videos[0]
      url = videoInfo.url
    } else {
      const id = url.match(/(?:v=|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/)?.[1]
      if (!id) throw new Error('URL inválida')
      const search = await yts({ videoId: id })
      videoInfo = search || null
      url = 'https://youtu.be/' + id
    }

    if (videoInfo.seconds > 3780) {
      return conn.reply(m.chat, `@${m.sender.split('@')[0]}, ⛔ El video no puede superar los 63 minutos.`, m, {
        mentions: [m.sender],
        ...global.rcanal
      })
    }

    const apiURL = isAudio
      ? `https://myapiadonix.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`
      : `https://myapiadonix.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`

    const res = await fetch(apiURL)
    const json = await res.json()

    if (isAudio && (!json.status || !json.data)) throw new Error('Audio no disponible')
    if (isVideo && (!json.status || !json.result)) throw new Error('Video no disponible')

    const title = isAudio ? json.data.title : json.result.title
    const thumbnail = isAudio ? json.data.thumbnail : json.result.thumbnail
    const downloadUrl = isAudio ? json.data.download : json.result.download
    const quality = isAudio ? '128' : (json.result.quality || '360')

    const dur = new Date(videoInfo.seconds * 1000).toISOString().substr(11, 8)
    const senderName = m.sender.split('@')[0]

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `📌 *${title.length > 50 ? title.substring(0, 50) + '...' : title}*
⏱ ${dur} | 🔊 ${isAudio ? quality + 'kbps' : quality + 'p'}
👤 ${videoInfo.author?.name || 'Desconocido'}
👁️ ${videoInfo.views?.toLocaleString()} | 📅 ${videoInfo.ago}\n> Se está procesando su pedido @${senderName}
`.trim(),
      mentions: [m.sender],
      quoted: m,
      ...global.rcanal
    })

    await conn.sendMessage(m.chat, {
      [isAudio ? 'audio' : 'video']: { url: downloadUrl },
      mimetype: isAudio ? 'audio/mpeg' : 'video/mp4',
      fileName: `${title.substring(0, 30)}.${isAudio ? 'mp3' : 'mp4'}`,
      ptt: false,
      quoted: m,
      ...global.rcanal
    })

  } catch {
    await conn.reply(m.chat, `@${m.sender.split('@')[0]}, ❌ Ocurrió un error al procesar tu solicitud.`, m, {
      mentions: [m.sender],
      ...global.rcanal
    })
  }
}

handler.help = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.tags = ['downloader']
handler.command = ['play', 'ytmp3', 'play2', 'ytmp4']

export default handler