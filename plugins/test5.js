const TicTacToe = require('../lib/tictactoe')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.game = conn.game ? conn.game : {}

  if (/^(salir)$/i.test(text)) return // lo maneja handler.before

  let id = m.chat

  if (id in conn.game) {
    m.reply('⚠️ Ya hay una sala activa en este chat, espera a que termine o escribe *salir* respondiendo al mensaje del juego.')
    return
  }

  // crear sala
  let room = {
    id,
    x: m.sender,
    o: '',
    game: new TicTacToe(m.sender, 'o'),
    state: 'WAITING',
    timeout: setTimeout(() => {
      conn.sendMessage(m.chat, { text: '⌛ La sala se cerró automáticamente por inactividad.' })
      delete conn.game[id]
    }, 30 * 60 * 1000) // 30 minutos
  }

  conn.game[id] = room

  conn.sendMessage(m.chat, {
    text: `✅ Sala creada.\nEspera a un oponente para jugar.\n\nUsa: *${usedPrefix + command}* para unirte.`
  })
}

handler.before = async (m, { conn }) => {
  conn.game = conn.game ? conn.game : {}
  if (!m.text) return !1

  let isSalir = m.text.toLowerCase() === 'salir'

  for (let room of Object.values(conn.game)) {
    // cancelar sala (WAITING)
    if (
      isSalir &&
      m.quoted &&
      /sala creada/i.test(m.quoted.text) &&
      room.state === 'WAITING' &&
      room.x === m.sender
    ) {
      conn.sendMessage(m.chat, {
        text: `🚪 @${m.sender.split('@')[0]} canceló la sala de *TicTacToe*.`,
        mentions: [m.sender]
      })
      clearTimeout(room.timeout)
      delete conn.game[room.id]
      return !0
    }

    // salir estando en partida
    if (
      isSalir &&
      m.quoted &&
      /ya estás en una sala/i.test(m.quoted.text) &&
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

handler.help = ['tictactoe', 'ttt']
handler.tags = ['game']
handler.command = /^t(ic)?tactoe|ttt$/i
handler.game = true

module.exports = handler