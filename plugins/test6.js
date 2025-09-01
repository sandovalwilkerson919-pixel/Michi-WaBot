let handler = async (m, { conn }) => {
  let listMessage = {
    text: "✨ Menú de prueba ✨",
    footer: "⭐ MichiBot-MD ⭐",
    title: "📖 Selecciona una opción:",
    buttonText: "Abrir Menú",
    sections: [
      {
        title: "Opciones",
        rows: [
          { title: "Opción 1", rowId: "test1" },
          { title: "Opción 2", rowId: "test2" },
          { title: "Opción 3", rowId: "test3" }
        ]
      }
    ]
  }

  await conn.sendMessage(m.chat, listMessage, { quoted: m })
}

handler.command = /^t6$/i
export default handler