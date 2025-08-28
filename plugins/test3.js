import fetch from 'node-fetch';

const handler = async (m, { conn, command }) => {
  try {
    const ne = await (await fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/anime/doraemon.txt')).text();
    const nek = ne.split('\n');
    const anime = nek[Math.floor(Math.random() * nek.length)];

    if (!anime) throw 'Error al obtener imagen';

    await conn.sendMessage(m.chat, {
      image: { url: anime },
      caption: 'Nyaww~ 🐾💗',
      footer: wm,
      buttons: [
        { buttonId: `/${command}`, buttonText: { displayText: '🔄 SIGUIENTE 🔄' }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m });

  } catch (e) {
    m.reply('❌ Hubo un error al cargar la imagen.');
    console.error(e);
  }
};

handler.command = /^(doraemon)$/i;
handler.tags = ['anime'];
handler.help = ['doraemon'];

export default handler;