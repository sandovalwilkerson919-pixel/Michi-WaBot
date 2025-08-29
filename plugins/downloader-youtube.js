import fetch from 'node-fetch'
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

    // URL de tu nueva API
    const apiUrl = `https://myapiadonix.vercel.app/download/ytdl?play=${encodeURIComponent(args.join(' '))}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error('Error al conectar con la API.')
    const json = await res.json()
    if (!json.status) throw new Error('No se pudo obtener información del video.')

    const { title, thumbnail, duration, views, ago, author, mp3, mp4 } = json.result

    const caption = `⟩ ✦ *Información del video* ✦

» 🎬 *Título:* ${title}  
» ⏱️ *Duración:* ${duration}  
» 👤 *Canal:* ${author}  
» 👁️ *Vistas:* ${views.toLocaleString()}  
» 📅 *Publicado:* ${ago}
`

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption,
      contextInfo: { mentionedJid: [m.sender] },
      ...global.rcanal
    })

    if (command === 'play' || command === 'ytmp3') {
      await conn.sendMessage(m.chat, {
        audio: { url: mp3 },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        ptt: true
      })
    } else if (command === 'play2' || command === 'ytmp4') {
      await conn.sendMessage(m.chat, {
        video: { url: mp4 },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        ...global.rcanal
      })
    } else {
      return m.reply({ text: '❌ Comando no reconocido.', ...global.rcanal })
    }

    await m.react('✅')

  } catch (error) {
    console.error('Error en comando play/ytmp3/ytmp4:', error)
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
handler.command = ['play', 'play2', 'ytmp3', 'ytmp4']

export default handler