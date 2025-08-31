import axios from 'axios'
import yts from 'yt-search'

let handler = async (m, { conn, args, command, usedPrefix }) => {
    if (!args || !args.join(" ")) return m.reply(`📌 ${usedPrefix + command} <link o nombre>`)

    const query = args.join(" ")

    
    await conn.sendPresenceUpdate('recording', m.chat) 

    let url = query
    if (!query.match(/https?:\/\//)) {
        const search = await yts(query)
        if (!search || !search.videos.length) {
            await conn.sendPresenceUpdate('available', m.chat)
            return m.reply('❌ No encontré nada :v')
        }
        url = search.videos[0].url
    }

    try {
        if (command === 'ytmp3' || command === 'play') {
            const res = await axios.get(`https://myapiadonix.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`)
            if (!res.data?.result?.url) return m.reply('❌ Error al descargar audio')
            await conn.sendMessage(m.chat, { audio: { url: res.data.result.url }, mimetype: 'audio/mpeg', fileName: res.data.result.title + '.mp3' }, { quoted: m })
        } else if (command === 'play2') {
            const res = await axios.get(`https://myapiadonix.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`)
            if (!res.data?.result?.url) return m.reply('❌ Error al descargar video')
            await conn.sendMessage(m.chat, { video: { url: res.data.result.url }, mimetype: 'video/mp4', fileName: res.data.result.title + '.mp4' }, { quoted: m })
        }
    } catch (e) {
        console.log(e)
        m.reply('❌ Ocurrió un error al descargar el archivo')
    }

    
    await conn.sendPresenceUpdate('available', m.chat)
}

handler.command = /^(play|ytmp3|play2)$/i
export default handler