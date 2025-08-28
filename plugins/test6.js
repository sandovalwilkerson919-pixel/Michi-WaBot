import TicTacToe from '../lib/tictactoe.js'

let handler = m => m

handler.before = async function (m, { conn }) {
  conn.game = conn.game || {}
  let room = Object.values(conn.game).find(room =>
    room.id.startsWith('tictactoe') &&
    room.state === 'PLAYING' &&
    [room.game.playerX, room.game.playerO].includes(m.sender)
  )

  if (!room) return !1
  if (!m.quoted) return !0
  if (!/^(🎮 \*Juego: Gato|Clasico juego de gato)/i.test(m.quoted.text)) return !0

  // Salir o rendirse
  if (/^(salir|rendirse)$/i.test(m.text)) {
    let loser = m.sender
    let winner = room.game.playerX === loser ? room.game.playerO : room.game.playerX
    let msg = `🏳️ @${loser.split('@')[0]} se rindió.\n🎉 ¡Ganador: @${winner.split('@')[0]}!`
    await conn.sendMessage(room.x, { text: msg, mentions: conn.parseMention(msg) })
    if (room.o && room.o !== room.x) await conn.sendMessage(room.o, { text: msg, mentions: conn.parseMention(msg) })
    delete conn.game[room.id]
    clearTimeout(room.timeout)
    return !0
  }

  // Jugar número 1–9
  let isNumber = /^[1-9]$/.test(m.text)
  if (!isNumber) return !0

  let player = room.game.currentTurn === m.sender ? (room.game.playerX === m.sender ? 0 : 1) : -1
  if (player === -1) {
    await m.reply(`⏳ No es tu turno todavía!`)
    return !0
  }

  let index = parseInt(m.text) - 1
  let result = room.game.turn(player, index)

  if (result < 1) {
    let msg = result === -1 ? '❌ Posición inválida'
      : result === 0 ? '⚠️ Esa casilla ya está ocupada'
      : result === -2 ? '🚫 No es tu turno'
      : result === -3 ? '🏁 El juego ya terminó'
      : 'Error desconocido'
    await m.reply(msg)
    return !0
  }

  let arr = room.game.render().map(v => ({
    X: '❌', O: '⭕',
    1: '1️⃣', 2: '2️⃣', 3: '3️⃣',
    4: '4️⃣', 5: '5️⃣', 6: '6️⃣',
    7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
  }[v]))

  let str = `
🎮 *Juego: Gato / 3 en raya*

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

${room.game.winner ? `🎉 ¡Ganador: @${room.game.winner.split('@')[0]}!` :
room.game.board === 511 ? '🤝 ¡Empate!' :
`👉 Es turno de @${room.game.currentTurn.split('@')[0]}`}
`.trim()

  let mentions = conn.parseMention(str)
  await conn.sendMessage(room.x, { text: str, mentions })
  if (room.o && room.o !== room.x) await conn.sendMessage(room.o, { text: str, mentions })

  if (room.game.winner || room.game.board === 511) {
    room.state = 'END'
    delete conn.game[room.id]
    clearTimeout(room.timeout)
  }
}

export default handler