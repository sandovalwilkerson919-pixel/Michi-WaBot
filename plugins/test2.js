let handler = async (m, { conn }) => {
  const fkontak = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
    },
    message: {
      extendedTextMessage: {
        text: "📌 Únete al grupo Michi Sub Bots 😎\n🔗 https://chat.whatsapp.com/FiqTXI5AxZGD2jylnd0Q8H",
        title: "Michi Sub Bots"
      }
    }
  }

  await conn.sendMessage(m.chat, {
    text: "¡Toca el mensaje para unirte al grupo! 👇"
  }, { quoted: fkontak })
}


handler.command = ['test']

export default handler