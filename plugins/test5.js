import TicTacToe from '../lib/tictactoe.js'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  conn.game = conn.game || {}

  // Verificar si ya está en un juego
  let exist = Object.values(conn.game).find(room =>
    room.id.startsWith('tictactoe') &&
    [room.game.playerX, room.game.playerO].includes(m.sender)
  )
  if (exist) throw `*🔰 Aún estás en una sala de juego*\n\n👉 Para salir responde con *salir* al mensaje del juego.`

  // Buscar sala en espera
  let room = Object.values(conn.game).find(room =>
    room.state === 'WAITING' && (text ? room.name === text : true)
  )

  if (room) {
    m.reply('*✅ Un jugador ingresó a la sala*')
    room.o = m.chat
    room.game.playerO = m.sender
    room.state = 'PLAYING'

    let arr = room.game.render().map(v => ({
      X: '❌',
      O: '⭕',
      1: '1️⃣',
      2: '2️⃣',
      3: '3️⃣',
      4: '4️⃣',
      5: '5️⃣',
      6: '6️⃣',
      7: '7️⃣',
      8: '8️⃣',
      9: '9️⃣',
    }[v]))

    let str = `
🎮 *Juego: Gato / 3 en raya*

📌 ¿Cómo jugar?
_Responde al tablero con el número (1–9)_

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

👉 Es turno de @${room.game.currentTurn.split('@')[0]}

*Para rendirse responde con "salir"*
`.trim()

    if (room.x !== room.o) await conn.sendMessage(room.x, { text: str, mentions: conn.parseMention(str) })
    await conn.sendMessage(room.o, { text: str, mentions: conn.parseMention(str) })

  } else {
    // Crear sala nueva
    room = {
      id: 'tictactoe-' + Date.now(),
      x: m.chat,
      o: '',
      game: new TicTacToe(m.sender, 'o'),
      state: 'WAITING'
    }
    if (text) room.name = text
    conn.game[room.id] = room

    // ⏰ Autodestruir sala a los 30 min (1800000 ms)
    room.timeout = setTimeout(() => {
      if (conn.game[room.id]) {
        conn.sendMessage(room.x, { text: '⌛ La sala de *TicTacToe* se cerró automáticamente por inactividad (30 min).' })
        if (room.o && room.o !== room.x) conn.sendMessage(room.o, { text: '⌛ La sala de *TicTacToe* se cerró automáticamente por inactividad (30 min).' })
        delete conn.game[room.id]
      }
    }, 1800000)

    await m.reply(`*👾 Sala creada, esperando jugador 2...*` + 
      (text ? `\nEl jugador 2 debe unirse con:\n*${usedPrefix}${command} ${text}*` : '')
    )
  }
}

handler.help = ['tictactoe', 'ttt'].map(v => v + ' [nombreSala]')
handler.tags = ['game']
handler.command = /^(tictactoe|ttt)$/i

export default handler