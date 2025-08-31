import axios from 'axios'
import yts from 'yt-search'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "120363421487163905@g.us" },
    message: { extendedTextMessage: { text: `📌 Usando Adonix API\n🌾 myapiadonix.vercel.app`, title: 'Michi Wa' } }
  }

  if (!args[0]) {
    return conn.sendMessage(m.chat, {
      text: '🎶 *Descarga rápido tu audio o video*\n' +
            '📌 Uso: `' + usedPrefix + command + ' <nombre o enlace>`\n' +
            'Ej: `' + usedPrefix + command + ' vida de barrio`'
    }, { quoted: fkontak })
  }

  const isAudio = ['play','ytmp3'].includes(command)
  const isVideo = ['play2','ytmp4'].includes(command)

  try {
    let url = args[0]
    let videoInfo = null

    if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
      const s = await yts(args.join(' '))
      if (!s.videos?.length) throw new Error('No encontrado')
      videoInfo = s.videos[0]
      url = videoInfo.url
    } else {
      const id = url.match(/(?:v=|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/)?.[1]
      if (!id) throw new Error('URL inválida')
      videoInfo = await yts({ videoId: id })
      url = 'https://youtu.be/' + id
    }

    if (videoInfo?.seconds > 3780) {
      return conn.sendMessage(m.chat, {
        text: `@${m.sender.split('@')[0]}, ⛔ El video no puede superar los 63 minutos.`,
        mentions: [m.sender]
      }, { quoted: fkontak })
    }

    const apiURL = isAudio
      ? `https://myapiadonix.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`
      : `https://myapiadonix.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`

    const title = (videoInfo?.title || 'Desconocido').trim()
    const safeTitle = (title.replace(/[^\w\s\-.,()+\[\]&]/g, '').trim() || 'file').substring(0, 60)
    const thumbnail = videoInfo?.thumbnail
    const dur = videoInfo ? new Date(videoInfo.seconds * 1000).toISOString().substr(11, 8) : '00:00:00'
    const senderName = m.sender.split('@')[0]

    if (thumbnail) {
      await conn.sendMessage(m.chat, {
        image: { url: thumbnail },
        caption: `📌 *${title.length > 50 ? title.substring(0, 50) + '...' : title}*
⏱ ${dur}
👤 ${videoInfo?.author?.name || 'Desconocido'}
👁️ ${videoInfo?.views?.toLocaleString() || '0'} | 📅 ${videoInfo?.ago || '-'}
*Pedido listo* @${senderName}`,
        mentions: [m.sender]
      }, { quoted: fkontak })
    }

    const { data } = await axios.get(apiURL, {
      responseType: 'arraybuffer',
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: { 'Accept': '*/*', 'User-Agent': 'Mozilla/5.0' }
    })

    const fileBuffer = Buffer.from(data)
    const mimetype = isAudio ? 'audio/mpeg' : 'video/mp4'
    const filename = `${safeTitle}.${isAudio ? 'mp3' : 'mp4'}`

    await conn.sendMessage(m.chat, {
      [isAudio ? 'audio' : 'video']: fileBuffer,
      mimetype,
      fileName: filename,
      ptt: false
    }, { quoted: fkontak })

  } catch (e) {
    try {
      let url = args[0]
      const apiURL = `https://myapiadonix.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`
      if (['play2','ytmp4'].includes(command)) {
        const { data } = await axios.get(apiURL, {
          responseType: 'arraybuffer',
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          headers: { 'Accept': '*/*', 'User-Agent': 'Mozilla/5.0' }
        })
        await conn.sendMessage(m.chat, {
          document: Buffer.from(data),
          mimetype: 'video/mp4',
          fileName: 'video.mp4'
        }, { quoted: fkontak })
        return
      }
    } catch {}
    await conn.sendMessage(m.chat, {
      text: `❌ Ocurrió un error al procesar tu solicitud.`,
      mentions: [m.sender]
    }, { quoted: fkontak })
    console.error(e)
  }
}

handler.help = ['play','ytmp3','play2','ytmp4']
handler.tags = ['downloader']
handler.command = ['play','ytmp3','play2','ytmp4']

export default handler