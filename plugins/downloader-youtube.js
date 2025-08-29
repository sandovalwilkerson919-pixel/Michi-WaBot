import fetch from 'node-fetch'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) return m.reply({
    text: `
⟩ ⚠️ *Uso correcto del comando:*  
» ${usedPrefix + command} <enlace o nombre de canción/video>  

✦ Ejemplos:  
• ${usedPrefix + command} https://youtu.be/abcd1234  
• ${usedPrefix + command} nombre de la canción
    `.trim(),
    ...global.rcanal
  })

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
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      const search = await yts(args.join(' '))
      if (!search.videos?.length) return m.reply({ text: '⚠️ No se encontraron resultados en YouTube.', ...global.rcanal })
      url = search.videos[0].url
    }

    const apiUrl = `https://myapiadonix.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error('Error al conectar con la API.')
    const json = await res.json()
    if (!json.status) throw new Error('No se pudo obtener información del video.')

    const { filename, downloadUrl } = json

    await conn.sendMessage(m.chat, {
      audio: { url: downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: filename.endsWith('.mp3') ? filename : `${filename}.mp3`,
      ptt: true
    })

    await m.react('✅')
  } catch (error) {
    console.error('Error en comando ytmp3:', error)
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

handler.help = ['play', 'ytmp3']
handler.tags = ['downloader']
handler.command = ['play', 'ytmp3']

export default handler