// Creado por Ado
import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args || args.length === 0) {
    return m.reply(
      '⚠️ *Uso:* `' + usedPrefix + command + ' <búsqueda o enlace>`\n' +
      '📌 Ej: `' + usedPrefix + command + ' vida de barrio`'
    )
  }

  const query = args.join(' ')
  const isAudio = ['play', 'ytmp3'].includes(command)
  const isVideo = ['play2', 'ytmp4'].includes(command)

  if (!isAudio && !isVideo) {
    return m.reply('❌ Usa *play* (audio) o *play2* (video).')
  }

  try {
    await m.react('🕓')

    let url = query
    let videoInfo = null

    if (!/https?:\/\/(www\.)?(youtube\.com|youtu\.be)/i.test(url)) {
      const search = await yts(query)
      if (!search.videos?.length) throw new Error('No results')
      videoInfo = search.videos[0]
      url = videoInfo.url
    } else {
      const idMatch = url.match(/(?:v=|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/)
      const videoId = idMatch ? idMatch[1] : null
      if (!videoId) throw new Error('Invalid URL')
      const search = await yts({ videoId })
      videoInfo = search || null
      url = 'https://youtu.be/' + videoId
    }

    if (videoInfo.seconds > 3780) {
      return m.reply('⛔ *Máx: 63 minutos.*')
    }

    const apiURL = isAudio
      ? `https://myapiadonix.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`
      : `https://myapiadonix.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`

    const res = await fetch(apiURL)
    const json = await res.json()
    if (!json.status || !json.result) throw new Error('No data')

    const { title, thumbnail, quality, download } = json.result
    const duration = new Date(videoInfo.seconds * 1000).toISOString().substr(11, 8)

    const caption = `
📌 *${title.substring(0, 60)}...*
⏱ ${duration} | 🎵 ${quality}p
👤 ${videoInfo.author?.name || 'Desconocido'}
👁️ ${videoInfo.views?.toLocaleString()} | 📅 ${videoInfo.ago}
    `.trim()

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption })

    await conn.sendMessage(m.chat, {
      [isAudio ? 'audio' : 'video']: { url: download },
      mimetype: isAudio ? 'audio/mpeg' : 'video/mp4',
      fileName: `${title.substring(0, 30)}.${isAudio ? 'mp3' : 'mp4'}`,
      ptt: false,
      quoted: m,
      ...global.rcanal
    })

    await m.react('✅')

  } catch {
    await m.react('❌')
    m.reply('⚠️ Error al descargar. Revisa el enlace o intenta más tarde.')
  }
}

handler.help = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.tags = ['downloader']
handler.command = ['play', 'ytmp3', 'play2', 'ytmp4']

export default handler