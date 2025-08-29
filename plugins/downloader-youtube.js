import fetch from 'node-fetch'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'

/**
 * @type {import('@adiwajshing/baileys').WASocket} conn
 * @type {import('@adiwajshing/baileys').WAMessage} m
 */
let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) {
    // Mensaje de uso para ambos comandos
    return m.reply({
      text: `
⟩ ⚠️ *Uso correcto del comando:*
» ${usedPrefix + command} <enlace o nombre de canción/video>

✦ Ejemplos:
• ${usedPrefix + command} https://youtu.be/abcd1234
• ${usedPrefix + command} nombre de la canción/video
      `.trim()
    })
  }

  try {
    await m.react('🕓')

    // Lógica para el comando 'ytmp3' o 'play'
    if (['play', 'ytmp3'].includes(command)) {
      // Si no es URL, buscamos en YouTube para MP3
      let url = args[0]
      if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        const search = await yts(args.join(' '))
        if (!search.videos?.length) {
          return m.reply({ text: '⚠️ No se encontraron resultados en YouTube.' })
        }
        url = search.videos[0].url
      }

      // Llamamos a la API para MP3
      const apiUrl = `https://myapiadonix.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`
      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error('Error al conectar con la API de MP3.')
      const json = await res.json()
      if (!json.status || !json.downloadUrl) {
        throw new Error('No se pudo obtener la información o URL de descarga del MP3.')
      }

      const { filename, downloadUrl } = json

      // Enviamos el audio
      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: filename.endsWith('.mp3') ? filename : `${filename}.mp3`,
        ptt: true
      })

      await m.react('✅')

    } else if (['play2', 'ytmp4'].includes(command)) {
      // Lógica para el comando 'ytmp4' o 'play2'
      let query = args.join(' ')

      // Llamamos a la API que solo acepta el parámetro 'play' para MP4
      const apiUrl = `https://myapiadonix.vercel.app/download/ytdl?play=${encodeURIComponent(query)}`
      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error('Error al conectar con la API de MP4.')
      const json = await res.json()
      if (!json.status || !json.result || !json.result.mp4) {
        throw new Error('No se pudo obtener la información o URL de descarga del MP4.')
      }

      const { title, mp4: downloadUrl } = json.result

      // Enviamos el video
      await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
      })

      await m.react('✅')
    }

  } catch (error) {
    console.error(`Error en comando ${command}:`, error)
    await m.react('❌')
    m.reply({
      text: `
⟩ ❌ *Ocurrió un error procesando tu solicitud*
» Verifica que el enlace o nombre sea válido o inténtalo más tarde.
      `.trim()
    })
  }
}

handler.help = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.tags = ['downloader']
handler.command = ['play', 'ytmp3', 'play2', 'ytmp4']

export default handler

