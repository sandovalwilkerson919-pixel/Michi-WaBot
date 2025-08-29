const handler = async (m, { conn, text }) => {
  const isCreator = global.owner.find(([num]) => m.sender.includes(num));
  if (!isCreator) {
    return m.reply(
      '🚫 Acceso denegado.\nEste comando solo está permitido para el creador del bot.'
    );
  }

  if (!text) {
    return m.reply('⚠️ Debes escribir el mensaje que quieres enviar a todos los grupos.');
  }

  //const gp = {key:{fromMe:false,participant:`0@s.whatsapp.net`},message:{productMessage:{product:{productImage:{mimetype:'image/jpeg',jpegThumbnail:require('fs').readFileSync('./storage/img/menu2.jpg')},title:`🛠️ AVISOS MICHI`,description:'by GP',currencyCode:'USD',priceAmount1000:'1000000000',retailerId:'Ghost',productImageCount:1},businessOwnerJid:`0@s.whatsapp.net`}}};

  const fakeContact = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      id: 'broadcast'
    },
    message: {
      contactMessage: {
        displayName: '🛠️ Avisos Michi',
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Michi WaBot\nTEL;type=CELL:${conn.user.jid.split('@')[0]}\nEND:VCARD`
      }
    }
  };

  const message = `
*📢 ATENCION*
${text}

> Mensaje enviado por el creador del bot.
  `.trim();

  const conns = [conn, ...(global.conns || [])];
  let totalGrupos = 0;

  for (const bot of conns) {
    try {
      const grupos = await bot.groupFetchAllParticipating();
      const ids = Object.keys(grupos);

      for (const gid of ids) {
        if (grupos[gid].announce) continue;
        await bot.sendMessage(gid, { text: message }, { quoted: fakeContact });
        totalGrupos++;
      }
    } catch (err) {
      console.error('Error en difusión:', err);
    }
  }

  return m.reply(
    `✅ Difusión completada.\nGrupos alcanzados: ${totalGrupos}\nSistema: Michi WaBot`
  );
};

handler.help = ['bcgc', 'bcg'];
handler.tags = ['owner'];
handler.command = ['bcgc', 'bcg'];
handler.rowner = true;

export default handler;