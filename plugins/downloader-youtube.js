import axios from 'axios';
import yts from 'yt-search';

let handler = async (m, { conn, args, command }) => {
  if (!args || !args.length) return m.reply(' Pon un nombre de canción o enlace ');

  let searchQuery = args.join(' ');

  
  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  try {
    let url = searchQuery;
    if (!searchQuery.includes('http')) {
      const search = await yts(searchQuery);
      if (!search || !search.all.length) return m.reply('😢 No encontré nada wey');
      url = search.all[0].url;
    }

    if (command === 'play' || command === 'ytmp3') {
      const res = await axios.get(`https://myapiadonix.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`);
      if (!res.data?.status || !res.data.url) return m.reply('😢 No se pudo obtener el audio');
      const title = res.data.title;
      const audioUrl = res.data.url;

      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      });
    }

    if (command === 'play2') {
      const res = await axios.get(`https://myapiadonix.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`);
      if (!res.data?.status || !res.data.url) return m.reply('😢 No se pudo obtener el video');
      const title = res.data.title;
      const videoUrl = res.data.url;

      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
      });
    }

  } catch (e) {
    console.log(e);
    m.reply('🔥 Ocurrió un error wey, intenta de nuevo');
  }
};

handler.help = ['play', 'ytmp3', 'play2'];
handler.tags = ['downloader'];
handler.command = /^(play|ytmp3|play2)$/i;

export default handler;