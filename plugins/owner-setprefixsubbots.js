import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text, isRowner }) => {
  const emojip = '⚙️'

  if (!text) 
    return m.reply(`${emojip} Por favor, proporciona un prefijo o lista de prefijos.\n
> Ejemplo: #setprefix !
> También puedes poner varios: #setprefix 🍉`)

  const senderNumber = m.sender.replace(/[^0-9]/g, '')
  const botPath = path.join('./JadiBots', senderNumber)
  const configPath = path.join(botPath, 'config.json')

  
  if (!fs.existsSync(botPath) && !isRowner) {
    return m.reply(`${emojip} Este comando es sólo para los *SubBots* o el *Dueño del Bot*.`)
  }

  let config = {}

  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath))
    } catch (e) {
      return m.reply('⚠️ Error al leer el config.json.')
    }
  }

  if (text.toLowerCase() === 'multi') {
    config.prefix = 'multi'
    global.prefix = new RegExp('^[#$@*&?,;:+×!_\\-¿.]')
    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    } catch (err) {
      console.error(err)
      return m.reply('❌ Ocurrió un error al guardar el prefijo.')
    }
    return m.reply(`${emojip} Prefijos activados en modo *MULTI-PREFIX*:  
> # $ @ * & ? , ; : + × ! _ - ¿ .`)
  }

  // Guardar prefijo normal
  let safe = [...text].map(c => c.replace(/([.*+?^${}()|\[\]\\])/g, '\\$1'))
  config.prefix = text

  global.prefix = new RegExp('^(' + safe.join('|') + ')')

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    m.reply(`${emojip} El prefijo del bot ha sido cambiado a: *${text}*`)
  } catch (err) {
    console.error(err)
    m.reply('❌ Ocurrió un error al guardar el prefijo.')
  }
}

handler.help = ['setprefix']
handler.tags = ['tools']
handler.command = ['setprefix']


export default handler