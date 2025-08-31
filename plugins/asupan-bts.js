import fetch from 'node-fetch'

let bts = []
fetch('https://raw.githubusercontent.com/arivpn/dbase/master/kpop/batues.txt')
    .then(res => res.text())
    .then(txt => bts = txt.split('\n'))

let handler = async (m, { conn, usedPrefix = '/' }) => {
    await m.reply('🍉 Cargando imagen de BTS...')
    
    try {
        let img = bts[Math.floor(Math.random() * bts.length)]
        if (!img) throw new Error('No se encontró la imagen')
        
        await conn.sendMessage(
            m.chat,
            {
                image: { url: img },
                caption: '✨ BTS - Kpop',
                footer: 'Pulsa el botón para ver otra imagen',
                buttons: [
                    {
                        buttonId: `${usedPrefix}bts`,
                        buttonText: { displayText: '🍉 Siguiente' },
                        type: 1
                    },
                    {
                        buttonId: `${usedPrefix}menu`,
                        buttonText: { displayText: '🎈 Menú' },
                        type: 1
                    }
                ],
                headerType: 4
            },
            { quoted: m }
        )
    } catch (e) {
        console.error(e)
        await m.reply('⚠️ Ocurrió un error al obtener la imagen de BTS.')
    }
}

handler.help = ['bts']
handler.tags = ['random']
handler.limit = true
handler.command = /^(bts)$/i

export default handler