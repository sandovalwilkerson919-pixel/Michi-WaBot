import { adonixytdl } from 'adonix-scraper'
import yts from 'yt-search'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
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

        const result = await adonixytdl(url)

        
        const audioRes = await fetch(result.mp3)
        const audioBuffer = await audioRes.buffer()

      
        const inputPath = path.join(__dirname, `temp_${Date.now()}.mp3`)
        const outputPath = path.join(__dirname, `bass_${Date.now()}.mp3`)

        fs.writeFileSync(inputPath, audioBuffer)

        
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .audioFilter('bass=g=10') 
                .save(outputPath)
                .on('end', resolve)
                .on('error', reject)
        })

        const finalBuffer = fs.readFileSync(outputPath)

        await conn.sendMessage(m.chat, {
            audio: finalBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${result.title}.mp3`
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        
        fs.unlinkSync(inputPath)
        fs.unlinkSync(outputPath)

    } catch (e) {
        console.log(e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        m.reply('✐ Ocurrió un error wey, intenta otra vez')
    }
}

handler.command = ['ytadonix']
export default handler