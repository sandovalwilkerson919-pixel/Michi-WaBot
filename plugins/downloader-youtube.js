import fetch from 'node-fetch'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) {
    return conn.sendMessage(m.chat, {
      text: '🎶 *Descarga rápido tu audio o video*\n' +
            '📌 Uso: `' + usedPrefix + command + ' <nombre o enlace>`\n' +
            'Ej: `' + usedPrefix + command + ' vida de barrio`'
    }, { quoted: fkontak })
  }

  const isAudio = ['play', 'ytmp3'].includes(command)
  const isVideo = ['play2'].includes(command)

  if (!isAudio && !isVideo) {
    return conn.sendMessage(m.chat, { text: '⚠️ Usa *play* para audio o *play2* para video.' }, { quoted: fkontak })
  }

  let nombreBot = global.namebot || 'Bot'
  const botId = conn.user?.jid?.split('@')[0]
  if (botId) {
    const configPath = path.join('./JadiBots', botId, 'config.json')
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        if (config.name) nombreBot = config.name
      } catch (e) {
        console.error('Error al leer config.json:', e)
      }
    }
  }

  
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
      ? `https://myapiadonix.vercel.app/download/yt?url=${encodeURIComponent(url)}&format=mp3`
      : `https://myapiadonix.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`

    const res = await fetch(apiURL)
    const json = await res.json()

    if (!json.status || !json.result?.download) throw new Error(isAudio ? 'Audio no disponible' : 'Video no disponible')

    const title = json.result.title
    const thumbnail = json.result.thumbnail
    const downloadUrl = json.result.download
    const quality = isAudio ? '128' : (json.result.quality || '360')
    const dur = new Date(videoInfo.seconds * 1000).toISOString().substr(11, 8)
    const senderName = m.sender.split('@')[0]

    
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `📌 *${title.length > 50 ? title.substring(0, 50) + '...' : title}*
⏱ ${dur} | 🔊 ${isAudio ? quality + 'kbps' : quality + 'p'}
👤 ${videoInfo.author?.name || 'Desconocido'}
👁️ ${videoInfo.views?.toLocaleString()} | 📅 ${videoInfo.ago}
*Pedido listo* @${senderName}`,
      mentions: [m.sender]
    }, { quoted: fkontak })

    // Enviar audio o video
    await conn.sendMessage(m.chat, {
      [isAudio ? 'audio' : 'video']: { url: downloadUrl },
      mimetype: isAudio ? 'audio/mpeg' : 'video/mp4',
      fileName: `${title.substring(0, 30)}.${isAudio ? 'mp3' : 'mp4'}`,
      ptt: false
    }, { quoted: fkontak })

  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: `@${m.sender.split('@')[0]}, ❌ Ocurrió un error al procesar tu solicitud.`,
      mentions: [m.sender]
    }, { quoted: fkontak })
    console.error(e)
  }
}

handler.help = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.tags = ['downloader']
handler.command = ['play', 'ytmp3', 'play2']

export default handler