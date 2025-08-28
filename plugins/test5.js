const TicTacToe = require('../lib/tictactoe')

let handler = async (m, { conn, command, text }) => {
  conn.game = conn.game ? conn.game : {}
  if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) {
    return m.reply('⚠️ Ya estás en una sala de TicTacToe.')
  }

  let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
  if (room) {
    room.o = m.chat
    room.game.playerO = m.sender
    room.state = 'PLAYING'

    let arr = room.game.render().map(v => {
      return {
        X: '❌', 
        O: '⭕', 
      }[v] || v
    })

    let str = `
🎮 *TicTacToe*

❌: @${room.game.playerX.split('@')[0]}
⭕: @${room.game.playerO.split('@')[0]}

Turno de: @${room.game.currentTurn.split('@')[0]}
${arr.slice(0, 3).join(' ')}
${arr.slice(3, 6).join(' ')}
${arr.slice(6).join(' ')}
`.trim()

    m.reply(str, null, {
      mentions: [room.game.playerX, room.game.playerO]
    })
  } else {
    let id = 'tictactoe-' + (+new Date)
    let game = new TicTacToe(m.sender, 'o')
    conn.game[id] = {
      id,
      x: m.chat,
      game,
      state: 'WAITING',
      name: text,
      timeout: setTimeout(() => {
        if (conn.game[id]) {
          m.reply('⌛ La sala de *TicTacToe* se eliminó por inactividad (30 min).')
          delete conn.game[id]
        }
      }, 30 * 60 * 1000) // 30 min
    }
    m.reply(`✅ Sala creada.
Espera a un oponente para jugar.

Usa: *.ttt ${text ? text : ''}* para unirte.
Responde con *salir* para cancelar.`)
  }
}

handler.command = /^t(ic)?t(ac)?toe|ttt?$/i

export default handler

// 👇 Controlar mensajes "salir"
export async function before(m, { conn }) {
  conn.game = conn.game ? conn.game : {}

  let room = Object.values(conn.game).find(r => 
    [r.game.playerX, r.game.playerO].includes(m.sender)
  )
  if (!room) return

  let isSalir = m.text?.toLowerCase() === 'salir'

  // 🚪 salir cuando está en WAITING (solo el creador)
  if (isSalir && room.state === 'WAITING' && room.game.playerX === m.sender) {
    conn.sendMessage(m.chat, { 
      text: `🚪 @${m.sender.split('@')[0]} canceló la sala de *TicTacToe*.`, 
      mentions: [m.sender] 
    })
    clearTimeout(room.timeout)
    delete conn.game[room.id]
    return !0
  }

  // 🚪 salir cuando ya está en PLAYING (cualquiera de los 2)
  if (isSalir && room.state === 'PLAYING') {
    conn.sendMessage(m.chat, { 
      text: `🚪 @${m.sender.split('@')[0]} salió del juego de *TicTacToe*.`, 
      mentions: [m.sender] 
    })
    clearTimeout(room.timeout)
    delete conn.game[room.id]
    return !0
  }
}