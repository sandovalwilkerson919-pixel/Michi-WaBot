let handler = async (m, { conn }) => {
  const buttonMessage = {
    text: "📌 Únete al grupo Michi Sub Bots 😎",
    footer: "Haz clic en el botón para unirte",
    buttons: [
      { buttonId: "join_group", buttonText: { displayText: "Unirme al grupo" }, type: 1 }
    ],
    headerType: 1
  }

  await conn.sendMessage(m.chat, buttonMessage)

  
  conn.on('message', async (message) => {
    if (message.buttonId === "join_group") {
      await conn.sendMessage(m.chat, {
        text: "Aquí tienes el enlace para unirte: https://chat.whatsapp.com/FiqTXI5AxZGD2jylnd0Q8H"
      })
    }
  })
}


handler.command = ['test']

export default handler