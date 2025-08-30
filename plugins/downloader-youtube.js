import fetch from 'node-fetch'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) {
    return m.reply({
      text: `
⟩ ⚠️ *Uso correcto del comando:*  
» ${usedPrefix + command} <enlace o nombre de canción/video>  

✦ Ejemplos:  
• ${usedPrefix + command} https://youtu.be/abcd1234  
• ${usedPrefix + command} nombre de la canción
      `.trim(),
      ...global.rcanal
    })
  }

  try {
    await m.react('🕓')

    const botId = conn.user?.jid?.split('@')[0].replace(/\D/g, '') || ''
    const configPath = path.join('./JadiBots', botId, 'config.json')

    let nombreBot = global.namebot || '⎯⎯⎯⎯⎯⎯ Bot Principal ⎯⎯⎯⎯⎯⎯'

    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        if (config.name) nombreBot = config.name
      } catch {}
    }

    let url = args[0]
    let videoInfo = null

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      const search = await yts(args.join(' '))
      if (!search.videos?.length) {
        return m.reply({ text: '⚠️ No se encontraron resultados en YouTube.', ...global.rcanal })
      }
      videoInfo = search.videos[0]
      url = videoInfo.url
    } else {
      const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop()
      const search = await yts({ videoId: id })
      if (search?.title) videoInfo = search
    }

    if (videoInfo.seconds > 3780) {
      return m.reply({ text: '⛔ El video supera el límite permitido de *63 minutos*.', ...global.rcanal })
    }

    let apiUrl = ''
    let isAudio = false

    if (command === 'play' || command === 'ytmp3') {
      apiUrl = `https://myapiadonix.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`
      isAudio = true
    } else if (command === 'play2' || command === 'ytmp4') {
      apiUrl = `https://myapiadonix.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`
    } else {
      return m.reply({ text: '❌ Comando no reconocido.', ...global.rcanal })
    }

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error('Error al conectar con la API.')
    const json = await res.json()
    if (!json.success) throw new Error('No se pudo obtener información del video.')

    const { title, thumbnail, download, quality } = json.data

    const dur = videoInfo.seconds || 0
    const h = Math.floor(dur / 3600)
    const m_ = Math.floor((dur % 3600) / 60)
    const s = dur % 60
    const duration = [h, m_, s].map(v => v.toString().padStart(2, '0')).join(':')

    const views = videoInfo.views.toLocaleString()
    const ago = videoInfo.ago || "N/D"
    const author = videoInfo.author?.name || "Desconocido"

    const caption = `*${title}* 
⏱️ *Duración:* ${duration}  
👤 *Canal:* ${author}  
👁️ *Vistas:* ${views}  
📅 *Publicado:* ${ago}  
📌 *Calidad:* ${quality || "Auto"}`

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption,
      contextInfo: { mentionedJid: [m.sender] },
      ...global.rcanal
    })

    if (isAudio) {
      await conn.sendMessage(m.chat, {
        audio: { url: download },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        ptt: false
      })
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: download },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        ...global.rcanal
      })
    }

    await m.react('✅')

  } catch (error) {
    console.error('Error en comando play/ytmp3/ytmp4:', error)
    await m.react('❌')
    m.reply({
      text: `
⟩ ❌ *Ocurrió un error procesando tu solicitud*  
» Verifica que el enlace sea válido o inténtalo más tarde.
      `.trim(),
      ...global.rcanal
    })
  }
}

handler.help = ['play', 'ytmp3', 'play2']
handler.tags = ['downloader']
handler.command = ['play', 'play2', 'ytmp3']

export default handler