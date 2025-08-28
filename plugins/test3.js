import fetch from 'node-fetch';

const handler = async (m, { conn, command }) => {
  try {
    // Obtener lista desde GitHub
    const ne = await (await fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/anime/doraemon.txt')).text();
    const nek = ne.split('\n');
    const anime = nek[Math.floor(Math.random() * nek.length)];

    if (!anime) throw 'Error al obtener imagen';

    // Enviar con botón
    await conn.sendButton(
      m.chat,
      'Nyaww~ 🐾💗', // texto
      namebot,      
      anime,         // URL de la imagen
      [['🔄 SIGUIENTE 🔄', `/${command}`]], // botones
      m
    );
  } catch (e) {
    m.reply('❌ Hubo un error al cargar la imagen.');
    console.error(e);
  }
};

handler.command = /^(doraemon)$/i;
handler.tags = ['anime'];
handler.help = ['doraemon'];

export default handler;