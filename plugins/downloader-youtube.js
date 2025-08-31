import axios from 'axios';
import yts from 'yt-search';

let handler = async (m, { conn, args, command }) => {
  if (!args || !args.length) return m.reply('Pon un nombre de canción o enlace wey');

  let searchQuery = args.join(' ');

 
  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  try {
    let url = searchQuery;

    
    if (!searchQuery.includes('http')) {
      const search = await yts(searchQuery);
      if (!search || !search.all.length) return m.reply('😢 No encontré nada wey');
      url = search.all[0].url;
    }

    
    const apiUrl = (command === 'play2')
      ? `https://myapiadonix.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`
      : `https://myapiadonix.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`;

    const res = await axios.get(apiUrl);
    if (!res.data?.status || !res.data.url) return m.reply('😢 No se pudo obtener el archivo wey');

    const mediaUrl = res.data.url;
    const title = res.data.title;
    const type = res.data.type; 

    if (type === 'mp3') {
      await conn.sendMessage(m.chat, {
        audio: { url: mediaUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      });
    } else if (type === 'mp4') {
      await conn.sendMessage(m.chat, {
        video: { url: mediaUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
      });
    } else {
      m.reply('😢 Tipo de archivo no soportado wey');
    }

  } catch (e) {
    console.log(e);
    m.reply('🔥 Ocurrió un error wey, intenta de nuevo');
  }
};

handler.help = ['play <nombre o link>', 'ytmp3 <nombre o link>', 'play2 <nombre o link>'];
handler.tags = ['downloader'];
handler.command = /^(play|ytmp3|play2)$/i;

export default handler;