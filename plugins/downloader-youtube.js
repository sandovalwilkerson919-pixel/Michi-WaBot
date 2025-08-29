import fetch from 'node-fetch'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'

const sanitize = (s) => (s || 'file').replace(/[\\\/:*?"<>|]/g, '').trim()

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

    // Si no es URL de YouTube, buscamos en YouTube
    let url = args[0]
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      const search = await yts(args.join(' '))
      if (!search.videos?.length) {
        return m.reply({ text: '⚠️ No se encontraron resultados en YouTube.', ...global.rcanal })
      }
      url = search.videos[0].url
    }

    // Usamos solo la API indicada
    const apiUrl = `https://myapiadonix.vercel.app/download/ytdl?play=${encodeURIComponent(url)}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error('Error al conectar con la API.')
    const json = await res.json()
    if (!json?.status || !json?.result) throw new Error('No se pudo obtener información del video.')

    const { title, mp3, mp4, duration, views, author, thumbnail } = json.result
    const safeTitle = sanitize(title)

    if ((command || '').toLowerCase() === 'play' || (command || '').toLowerCase() === 'ytmp3') {
      if (!mp3) throw new Error('La API no devolvió enlace MP3.')

      await conn.sendMessage(m.chat, {
        audio: { url: mp3 },
        mimetype: 'audio/mpeg',
        fileName: `${safeTitle}.mp3`,
        ptt: true // pon false si no quieres que sea nota de voz
      })

    } else if ((command || '').toLowerCase() === 'play2') {
      if (!mp4) throw new Error('La API no devolvió enlace MP4.')

      // Enviar video con metadata en el caption
      const caption = [
        `Título: ${title}`,
        `Duración: ${duration || 'N/A'}`,
        `Autor: ${author || 'N/A'}`,
        `Vistas: ${views ?? 'N/A'}`,
        `Enviado por: ${nombreBot}`
      ].join('\n')

      await conn.sendMessage(m.chat, {
        video: { url: mp4 },
        mimetype: 'video/mp4',
        fileName: `${safeTitle}.mp4`,
        caption
      })
    } else {
      // comando no reconocido (seguridad)
      return m.reply({ text: 'Comando no reconocido.', ...global.rcanal })
    }

    await m.react('✅')

  } catch (error) {
    console.error('Error en comando play/ytmp3/play2:', error)
    await m.react('❌')
    m.reply({
      text: `
⟩ ❌ *Ocurrió un error procesando tu solicitud*  
» Verifica que el enlace o nombre sea válido o inténtalo más tarde.
      `.trim(),
      ...global.rcanal
    })
  }
}

handler.help = ['play', 'ytmp3', 'play2']
handler.tags = ['downloader']
handler.command = ['play', 'ytmp3', 'play2']

export default handler