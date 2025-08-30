let handler = async (m, { conn }) => {
  const fkontak = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
    },
    message: {
      contactMessage: {
        displayName: "Michi Sub Bots",
        vcard: `BEGIN:VCARD
VERSION:3.0
FN:Michi Sub Bots
ORG:Michi Sub Bots
TEL;type=CELL;waid=0:+0
URL:https://chat.whatsapp.com/FiqTXI5AxZGD2jylnd0Q8H?mode=ems_copy_c
NOTE:Únete al grupo tocando aquí
END:VCARD`
      }
    }
  }

  await conn.sendMessage(m.chat, {
    text: "📌 Prueba de fkontak para unirse al grupo Michi Sub Bots 😎",
  }, { quoted: fkontak })
}

handler.command = ['test']

export default handler