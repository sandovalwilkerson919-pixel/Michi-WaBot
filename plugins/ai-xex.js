let handler = async (m, { conn, args, usedPrefix, command, multiConn }) => {
  if (!args[0]) return m.reply(`✦ Uso correcto:\n${usedPrefix + command} <enlace del canal>`)

  // Regex para detectar el enlace del canal
  let linkRegex = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i
  let match = args[0].match(linkRegex)
  if (!match) return m.reply('⚠️ Enlace inválido')

  let inviteCode = match[1]

  try {
    // Obtenemos JID del canal
    let res = await conn.query({
      tag: 'iq',
      attrs: { type: 'get', xmlns: 'w:g2', to: '@g.us' },
      content: [{ tag: 'invite', attrs: { code: inviteCode } }]
    })

    let jid = res?.content?.[0]?.attrs?.jid
    if (!jid) return m.reply('❌ No se pudo obtener el canal')

    // Todos los bots siguen el canal
    let bots = multiConn && Array.isArray(multiConn) ? multiConn.concat(conn) : [conn]
    for (let bot of bots) {
      try {
        await bot.newsletterFollow(jid)
      } catch (e) {
        console.log('Error en un bot', e)
      }
    }

    m.reply(`✅ Todos los bots ahora siguen el canal: ${args[0]}`)
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al seguir el canal')
  }
}

handler.command = /^scanal$/i
export default handler
