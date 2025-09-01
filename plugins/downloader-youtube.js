import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('✐ Pon un nombre de canción o enlace de YouTube wey')

    let query = args.join(' ')
    let url

    if (query.startsWith('http')) {
        url = query
    } else {
        let search = await yts(query)
        if (!search || !search.videos || !search.videos.length) return m.reply('✐ No encontré la canción wey')
        url = search.videos[0].url
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } })

        let apiUrl = `https://myapiadonix.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (!json.status) return m.reply('✐ No se pudo descargar el audio wey')

        let { title, url: downloadUrl } = json

        // Descarga el buffer del audio
        let audioRes = await fetch(downloadUrl)
        if (!audioRes.ok) throw new Error(`Error al descargar el audio: ${audioRes.statusText}`)
        let buffer = await audioRes.buffer()

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        await conn.sendMessage(m.chat, {
            audio: buffer,
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply('✐ Ocurrió un error wey, intenta otra vez')
    }
}

handler.command = ['play', 'ytmp3']
export default handler