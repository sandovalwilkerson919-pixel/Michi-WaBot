let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    interactiveMessage: {
      body: { text: "✨ Menú de prueba ✨" },
      footer: { text: "⭐ MichiBot-MD ⭐" },
      header: { title: "📖 Selecciona una opción:" },
      nativeFlowMessage: {
        buttons: [
          {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: "Abrir Menú",
              sections: [
                {
                  title: "Opciones",
                  rows: [
                    { header: "Menú", title: "Opción 1", id: "test1" },
                    { header: "Menú", title: "Opción 2", id: "test2" },
                    { header: "Menú", title: "Opción 3", id: "test3" }
                  ]
                }
              ]
            })
          }
        ]
      }
    }
  }, { quoted: m })
}

handler.command = ['t6']
export default handler