import ytdl from 'ytdl-core'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('✐ Pon un nombre de canción o enlace de YouTube wey')

    let url
    const query = args.join(' ')

    if (query.startsWith('http')) {
        url = query
    } else {
        let search = await yts(query)
        if (!search || !search.videos || !search.videos.length) return m.reply('✐ No encontré la canción wey')
        url = search.videos[0].url
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const info = await ytdl.getInfo(url)
        const title = info.videoDetails.title

        // Rutas temporales
        const inputPath = path.join(__dirname, `yt_${Date.now()}.mp3`)

        // Descargar el audio con ytdl-core
        await new Promise((resolve, reject) => {
            const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
                .pipe(fs.createWriteStream(inputPath))
            stream.on('finish', resolve)
            stream.on('error', reject)
        })

        const finalBuffer = fs.readFileSync(inputPath)

        await conn.sendMessage(m.chat, {
            audio: finalBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        // Limpiar archivo temporal
        fs.unlinkSync(inputPath)

    } catch (e) {
        console.error(e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        m.reply('✐ Ocurrió un error wey, intenta otra vez')
    }
}

handler.command = ['ytmp3', 'play']
export default handler