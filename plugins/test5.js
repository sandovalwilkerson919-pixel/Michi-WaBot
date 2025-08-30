//[##] Creado por GianPoolS
//[##] No quites los créditos

import fetch from 'node-fetch'

let handler = async(m, { conn, args, usedPrefix, command }) => {

fetch('https://raw.githubusercontent.com/GianPoolS/Mis-Archivos/refs/heads/main/doraemon.txt?token=GHSAT0AAAAAADKFZKB3FQPPLUSRTCRD24DC2FTCFAA').then(res => res.text()).then(body => {

let randomkpop = body.split('\n')

let randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
conn.sendMessage(m.chat, { react: { text: '😁', key: m.key }})
conn.sendButton(m.chat, `💟 Doraemon 💌`, namebot, randomkpopx, [['🔄 Next 🔄', `/${command}`]], m)

})}

handler.help = ['']

handler.tags = ['']

handler.command = ['t5']

export default handler

