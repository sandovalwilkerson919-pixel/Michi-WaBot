let handler = async (m, { conn, text, isRowner, isSubowner }) => {
  const emojip = '⚙️'

  if (!isSubowner && !isRowner) 
    return m.reply(`${emojip} Solo los *SubBots* o el *Dueño del Bot* pueden cambiar el prefijo.`)

  if (!text) 
    return m.reply(`${emojip} Por favor, proporciona un prefijo o lista de prefijos.\n
> Ejemplo: #setprefix !
> También puedes poner varios: #setprefix 🍉`)

  if (text.toLowerCase() === 'multi') {
    global.prefix = new RegExp('^[#$@*&?,;:+×!_\\-¿.]')
    return m.reply(`${emojip} Prefijos activados en modo *MULTI-PREFIX*:  
    > # $ @ * & ? , ; : + × ! _ - ¿ .`)
  }

  let safe = [...text].map(c => c.replace(/([.*+?^${}()|\[\]\\])/g, '\\$1'))

  global.prefix = new RegExp('^(' + safe.join('|') + ')')

  m.reply(`${emojip} El prefijo del bot ha sido cambiado a: *${text}*`)
}

handler.help = ['setprefix']
handler.tags = ['tools']
handler.command = ['setprefix']
handler.subowner = true
handler.rowner = true

export default handler