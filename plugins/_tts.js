import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('✐ Pon el enlace de YouTube que quieres descargar en audio wey')

    try {
        
        let url = `https://myapiadonix.vercel.app/download/yt?url=${encodeURIComponent(args[0])}&format=mp3`
        
        
        let res = await fetch(url)
        let json = await res.json()

        if (!json.status) return m.reply('✐ No se pudo descargar el audio wey')

        let { title, download } = json.result

        
        await conn.sendMessage(m.chat, {
            audio: { url: download },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        m.reply('✐ Ocurrió un error wey, intenta otra vez')
    }
}

handler.command = ['audio'] 
export default handler