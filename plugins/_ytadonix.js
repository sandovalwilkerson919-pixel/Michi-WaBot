import { adonixytdl } from 'adonix-scraper'
import yts from 'yt-search'

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

        await conn.sendMessage(m.chat, {
            audio: { url: result.mp3 },
            mimetype: 'audio/mpeg',
            fileName: `${result.title}.mp3`
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.log(e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        m.reply('✐ Ocurrió un error wey, intenta otra vez')
    }
}

handler.command = ['ytadonix']
export default handler
