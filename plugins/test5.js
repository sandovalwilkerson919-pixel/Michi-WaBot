const TicTacToe = require('../lib/tictactoe')

let handler = async (m, { conn, usedPrefix, command, text }) => {
  conn.game = conn.game ? conn.game : {}
  if (!text) throw `✳️ Escribe un nombre para la sala.\n\nEjemplo:\n${usedPrefix + command} sala1`
  
  if (Object.values(conn.game).find(room => room.id === text)) {
    throw `⚠️ Ya existe una sala con el nombre *${text}*.`
  }
  
  let room = {
    id: text,
    x: m.sender,
    o: '',
    game: new TicTacToe(m.sender, 'o'),
    state: 'WAITING',
    timeout: setTimeout(() => {
      if (conn.game[room.id]) {
        conn.sendMessage(m.chat, { text: `⏳ La sala *${room.id}* fue eliminada por inactividad.` })
        delete conn.game[room.id]
      }
    }, 1800000) // 30 min
  }

  conn.game[room.id] = room

  conn.sendMessage(m.chat, { 
    text: `✅ Sala creada.\nEspera a un oponente para jugar.\n\nUsa: *${usedPrefix}ttt ${text}* para unirte.\n\nEscribe *salir* respondiendo a este mensaje para cancelar.`
  }, { quoted: m })
}

handler.before = async (m, { conn }) => {
  conn.game = conn.game ? conn.game : {}

  if (!m.text) return !1
  let isSalir = m.text?.toLowerCase() === 'salir'

  for (let room of Object.values(conn.game)) {
    // 🚪 salir cuando está esperando o durante la partida
    if (
      isSalir && 
      room.game.playerX === m.sender && 
      room.state === 'WAITING' &&
      m.quoted && /Sala creada/i.test(m.quoted.text)
    ) {
      conn.sendMessage(m.chat, { 
        text: `🚪 @${m.sender.split('@')[0]} canceló la sala de *TicTacToe*.`, 
        mentions: [m.sender] 
      })
      clearTimeout(room.timeout)
      delete conn.game[room.id]
      return !0
    }

    if (
      isSalir && 
      [room.game.playerX, room.game.playerO].includes(m.sender)
    ) {
      conn.sendMessage(m.chat, { 
        text: `🚪 @${m.sender.split('@')[0]} salió del juego de *TicTacToe*.`, 
        mentions: [m.sender] 
      })
      clearTimeout(room.timeout)
      delete conn.game[room.id]
      return !0
    }
  }
}

handler.help = ['tictactoe <nombre>']
handler.tags = ['game']
handler.command = /^t(?:ictactoe|ttt)$/i

module.exports = handler