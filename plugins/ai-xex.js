let handler = async (m, { conn, args, usedPrefix, command, multiConn }) => {
  if (!args[0]) return m.reply(`✦ Uso correcto:\n${usedPrefix + command} <ID del canal>`)

  let jid = args[0] // Aquí ya pasas directamente el jid del canal

  try {
    // Todos los bots siguen el canal
    let bots = multiConn && Array.isArray(multiConn) ? multiConn.concat(conn) : [conn]
    for (let bot of bots) {
      try {
        await bot.newsletterFollow(jid)
      } catch (e) {
        console.log('Error en un bot', e)
      }
    }

    m.reply(`✅ Todos los bots ahora siguen el canal: ${jid}`)
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al seguir el canal')
  }
}

handler.command = /^scanal$/i
export default handler