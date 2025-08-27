import fs from 'fs'
import path from 'path'

let handler = async (m, { text }) => {
  let number = (m.mentionedJid && m.mentionedJid[0]?.replace('@s.whatsapp.net', '')) || text?.replace(/[^0-9]/g, '')

  if (!number) {
    return m.reply('Debes etiquetar al bot que quieres hacer principal en este grupo.')
  }

  let botJid = number + '@s.whatsapp.net'

  let isMainBot = global.conn.user && global.conn.user.jid === botJid

  let subbotPath = path.join('./JadiBots', number, 'creds.json')
  let isSubbot = fs.existsSync(subbotPath)

  if (!isSubbot && !isMainBot) {
    return m.reply(`El número *${number}* no corresponde ni al bot principal ni a un Subbot válido.`)
  }

  let isInConns = isMainBot || global.conns.some(conn => conn.user && conn.user.jid === botJid)
  if (!isInConns) {
    return m.reply(`❌ El bot *${botJid}* no está conectado actualmente y no se puede poner como primario.`)
  }

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  global.db.data.chats[m.chat].primaryBot = botJid

  if (global.db.write) await global.db.write()

  m.reply(`✅ El bot principal para este grupo ahora es:\n*${botJid}*`)
}

handler.help = ['setprimary @bot']
handler.tags = ['serbot']
handler.command = ['setprimary']
handler.admin = true

export default handler