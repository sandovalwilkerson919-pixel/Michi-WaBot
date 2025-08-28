import { readdirSync, statSync, unlinkSync, existsSync, promises as fsPromises } from "fs"
const fs = { ...fsPromises, existsSync }
import path from 'path'
import ws from 'ws'

let handler = async (m, { conn, command, usedPrefix, args, text, isOwner }) => {
  const isCommandDelete = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command)
  const isCommandStop = /^(stop|pausarai|pausarbot)$/i.test(command)
  const isCommandList = /^(bots|sockets|socket)$/i.test(command)

  async function reportError(e) {
    await conn.sendMessage(m.chat, { text: `⟩ ❌ *Ocurrió un error inesperado*  
» Contacta con el creador para resolverlo.`, ...global.rcanal }, { quoted: m })
    console.error(e)
  }

  switch (true) {
    case isCommandDelete: {
      let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
      let uniqid = `${who.split`@`[0]}`
      const sessionPath = path.join(process.cwd(), `${jadi}`, uniqid)

      if (!fs.existsSync(sessionPath)) {
        await conn.sendMessage(
          m.chat,
          {
            text: `
⟩ ⚠️ *No tienes sesión activa.*  

✦ Puedes crear una nueva sesión con:  
• ${usedPrefix + command}  

✦ O usar tu ID para saltarte este paso:  
• ${usedPrefix + command} \`${uniqid}\`
`,
            ...global.rcanal
          },
          { quoted: m }
        )
        return
      }

      if (global.conn.user.jid !== conn.user.jid) {
        return conn.sendMessage(
          m.chat,
          {
            text: `
⟩ ⚠️ Este comando debe ejecutarse desde el *Bot Principal*.  

✦ Contacta al principal aquí:  
• [Clic para enviar mensaje](https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0)
`,
            ...global.rcanal
          },
          { quoted: m }
        )
      }

      try {
        await fs.rm(sessionPath, { recursive: true, force: true })
        await conn.sendMessage(
          m.chat,
          { text: `⟩ ✅ *Tu sesión como Sub-Bot fue eliminada correctamente.*  
✦ Todo rastro ha sido borrado exitosamente.`, ...global.rcanal },
          { quoted: m }
        )
      } catch (e) {
        reportError(e)
      }
    } break

    case isCommandStop: {
      if (global.conn.user.jid === conn.user.jid) {
        await conn.sendMessage(
          m.chat,
          { text: `⟩ ⚠️ *No eres un Sub-Bot activo.*  
✦ Contacta al número principal si deseas activarte.`, ...global.rcanal },
          { quoted: m }
        )
      } else {
        await conn.sendMessage(
          m.chat,
          { text: `⟩ 🛑 *${botname || 'Sub-Bot'} se pausó correctamente.*  
✦ Se cerró la conexión de este Sub-Bot.`, ...global.rcanal },
          { quoted: m }
        )
        conn.ws.close()
      }
    } break

    case isCommandList: {
      const users = [...new Set([...global.conns.filter(c => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)])]

      function msToTime(ms) {
        let segundos = Math.floor(ms / 1000)
        let minutos = Math.floor(segundos / 60)
        let horas = Math.floor(minutos / 60)
        let dias = Math.floor(horas / 24)
        segundos %= 60
        minutos %= 60
        horas %= 24
        return `${dias ? dias + " días, " : ""}${horas ? horas + " horas, " : ""}${minutos ? minutos + " minutos, " : ""}${segundos ? segundos + " segundos" : ""}`
      }

      const message = users
        .map((v, i) => `
• ✦ 「 ${i + 1} 」  
⟩ 🧃 Usuario: ${v.user.name || 'Sub-Bot'}  
⟩ 💎 Enlace: https://wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}speed  
⟩ 🕑 Activo por: ${v.uptime ? msToTime(Date.now() - v.uptime) : 'Desconocido'}
        `.trim())
        .join('\n\n')

      const replyMessage = message.length ? message : `⟩ ❌ *No hay Sub-Bots disponibles en este momento.*`

      const responseMessage = `
✦ *LISTA DE SUBBOTS ACTIVOS*  ✦ 
» 📌 *Total Subbots:* ${users.length || '0'}  

${replyMessage.trim()}
`

      await conn.sendMessage(m.chat, { text: responseMessage, mentions: conn.parseMention(responseMessage), ...global.rcanal }, { quoted: m })
    } break
  }
}

handler.tags = ['serbot']
handler.help = ['sockets', 'deletesesion', 'pausarai']
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket']

export default handler