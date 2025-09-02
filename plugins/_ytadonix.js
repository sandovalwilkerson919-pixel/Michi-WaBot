import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('✐ Pon un nombre de canción o enlace de YouTube wey')

    const query = args.join(' ')
    let url

    if (query.startsWith('http')) {
        url = query
    } else {
        const yts = (await import('yt-search')).default
        let search = await yts(query)
        if (!search || !search.videos || !search.videos.length) return m.reply('✐ No encontré la canción wey')
        url = search.videos[0].url
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const response = await axios.post('https://api.savetube.su/api/convert', { url })
        if (response.data.status !== 'success') throw new Error('No se pudo generar el MP3')

        const downloadUrl = response.data.download_url
        const title = url.split('v=')[1] || `audio_${Date.now()}`
        const inputPath = path.join(__dirname, `yt_${Date.now()}.mp3`)

        const mp3Data = await axios.get(downloadUrl, { responseType: 'arraybuffer' })
        fs.writeFileSync(inputPath, mp3Data.data)

        const finalBuffer = fs.readFileSync(inputPath)
        await conn.sendMessage(m.chat, {
            audio: finalBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        fs.unlinkSync(inputPath)

    } catch (e) {
        console.error(e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        m.reply('✐ Ocurrió un error wey, intenta otra vez')
    }
}

handler.command = ['ytadonix']
export default handler