import fetch from 'node-fetch'

let handler = async(m, { conn, args, usedPrefix, command }) => {

fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/blackpink.txt').then(res => res.text()).then(body => {

let randomkpop = body.split('\n')

let randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
conn.sendMessage(m.chat, { react: { text: '🤩', key: m.key }})
conn.sendButton(m.chat, `💟 Muchas veces viste a BlackPink 💌`, namebot, randomkpopx, [['🔄 SIGUIENTE 🔄', `/${command}`]], m)

})}

handler.help = ['blackpink']

handler.tags = ['']

handler.command = ['blackpink']

export default handler

