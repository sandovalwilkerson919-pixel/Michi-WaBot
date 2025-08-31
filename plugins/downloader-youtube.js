import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const fkontak = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "120363421487163905@g.us"
    },
    message: {
      extendedTextMessage: {
        text: `📌 Usando Adonix API\n🌾 myapiadonix.vercel.app`,
        title: 'Michi Wa'
      }
    }
  }

  if (!args[0]) {
    return conn.sendMessage(m.chat, {
      text: '🎶 *Descarga rápido tu audio o video*\n' +
            '📌 Uso: `' + usedPrefix + command + ' <nombre o enlace>`\n' +
            'Ej: `' + usedPrefix + command + ' vida de barrio`'
    }, { quoted: fkontak })
  }

  const isAudio = ['play', 'ytmp3'].includes(command)
  const isVideo = ['play2', 'ytmp4'].includes(command)

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
      return conn.sendMessage(m.chat, {
        text: `@${m.sender.split('@')[0]}, ⛔ El video no puede superar los 63 minutos.`,
        mentions: [m.sender]
      }, { quoted: fkontak })
    }

    const apiURL = isAudio
      ? `https://myapiadonix.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`
      : `https://myapiadonix.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`

    const title = videoInfo.title || "Desconocido"
    const thumbnail = videoInfo.thumbnail
    const dur = new Date(videoInfo.seconds * 1000).toISOString().substr(11, 8)
    const senderName = m.sender.split('@')[0]

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `📌 *${title.length > 50 ? title.substring(0, 50) + '...' : title}*
⏱ ${dur}
👤 ${videoInfo.author?.name || 'Desconocido'}
👁️ ${videoInfo.views?.toLocaleString()} | 📅 ${videoInfo.ago}
*Pedido listo* @${senderName}`,
      mentions: [m.sender]
    }, { quoted: fkontak })

    await conn.sendMessage(m.chat, {
      [isAudio ? 'audio' : 'video']: { url: apiURL },
      mimetype: isAudio ? 'audio/mpeg' : 'video/mp4',
      fileName: `${title.substring(0, 30)}.${isAudio ? 'mp3' : 'mp4'}`,
      ptt: false
    }, { quoted: fkontak })

  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: `❌ Ocurrió un error al procesar tu solicitud.`,
      mentions: [m.sender]
    }, { quoted: fkontak })
    console.error(e)
  }
}

handler.help = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.tags = ['downloader']
handler.command = ['play', 'ytmp3', 'play2', 'ytmp4']

export default handler