import TicTacToe from '../lib/tictactoe.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.game = conn.game ? conn.game : {}
  if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) {
    return m.reply('Ya estás en una sala de TicTacToe.')
  }

  let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
  if (room) {
    // se une como O
    room.o = m.chat
    room.game.playerO = m.sender
    room.state = 'PLAYING'
    let arr = room.game.render().map((v, i) => [i + 1, v])
    let str = `
🎮 *TicTacToe*

❌ = @${room.game.playerX.split('@')[0]}
⭕ = @${room.game.playerO.split('@')[0]}

Turno de: ${room.game.currentTurn === 'x' ? '❌' : '⭕'}
    
${arr.slice(0, 3).map(v => v[1]).join(' | ')}
${arr.slice(3, 6).map(v => v[1]).join(' | ')}
${arr.slice(6).map(v => v[1]).join(' | ')}
`.trim()

    let msg = await conn.sendMessage(m.chat, { text: str, mentions: [room.game.playerX, room.game.playerO] }, { quoted: m })
    room.msg = msg

    // autodestruir sala a los 30 min
    room.timeout = setTimeout(() => {
      delete conn.game[room.id]
      conn.sendMessage(m.chat, { text: '⏰ La partida de *TicTacToe* fue eliminada por inactividad.' })
    }, 1800000)

  } else {
    // crea sala como X
    let id = 'tictactoe-' + (+new Date)
    let game = new TicTacToe(m.sender, 'o')
    conn.game[id] = {
      id,
      x: m.chat,
      o: '',
      game,
      state: 'WAITING',
      name: text || '',
      msg: null,
      timeout: null
    }
    m.reply(`✅ Sala creada.\nEspera a un oponente para jugar.\n\nUsa: *${usedPrefix + command} ${text || ''}* para unirte.`)
  }
}

handler.command = /^tictactoe|ttt$/i
export default handler


// Listener de jugadas
export async function before(m, { conn }) {
  conn.game = conn.game ? conn.game : {}
  let room = Object.values(conn.game).find(r => r.state === 'PLAYING' && [r.game.playerX, r.game.playerO].includes(m.sender))

  if (!room) return
  let isNumber = /^[1-9]$/.test(m.text)
  let isSalir = m.text?.toLowerCase() === 'salir'

  // salir
  if (isSalir) {
    conn.sendMessage(m.chat, { text: `🚪 @${m.sender.split('@')[0]} salió de la partida.`, mentions: [m.sender] })
    clearTimeout(room.timeout)
    delete conn.game[room.id]
    return !0
  }

  if (!isNumber) return
  let choice = m.text - 1
  let player = room.game.playerX === m.sender ? 0 : 1
  let status = room.game.turn(player, choice)

  if (status < 1) return // movimiento inválido

  let arr = room.game.render().map((v, i) => [i + 1, v])
  let str = `
🎮 *TicTacToe*

❌ = @${room.game.playerX.split('@')[0]}
⭕ = @${room.game.playerO.split('@')[0]}

Turno de: ${room.game.currentTurn === 'x' ? '❌' : '⭕'}
    
${arr.slice(0, 3).map(v => v[1]).join(' | ')}
${arr.slice(3, 6).map(v => v[1]).join(' | ')}
${arr.slice(6).map(v => v[1]).join(' | ')}
`.trim()

  if (room.game.winner) {
    str += `\n\n🏆 Ganador: ${room.game.winner === 'x' ? '❌' : '⭕'}`
    clearTimeout(room.timeout)
    delete conn.game[room.id]
  } else if (room.game.turns >= 9) {
    str += `\n\n🤝 Empate.`
    clearTimeout(room.timeout)
    delete conn.game[room.id]
  }

  await conn.sendMessage(m.chat, { text: str, mentions: [room.game.playerX, room.game.playerO] }, { quoted: room.msg })
  return !0
}