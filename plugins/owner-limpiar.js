import { promises as fs, existsSync } from 'fs';
import path from 'path';

var handler = async (m, { conn }) => {
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.reply(m.chat, `Usa este comando solo en el número principal del bot.`, m);
  }

  await conn.reply(m.chat, `Iniciando limpieza de todos los subBots, manteniendo creds.json...`, m);
  m.react('⌛');

  const baseDir = './JadiBots/';
  try {
    if (!existsSync(baseDir)) {
      return conn.reply(m.chat, `No existe la carpeta JadiBots.`, m);
    }

    const subBots = await fs.readdir(baseDir);
    let totalDeleted = 0;

    for (const bot of subBots) {
      const botPath = path.join(baseDir, bot);
      const stat = await fs.stat(botPath);
      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(botPath);
      for (const file of files) {
        if (file !== 'creds.json') {
          const filePath = path.join(botPath, file);
          const fileStat = await fs.stat(filePath);
          if (fileStat.isDirectory()) {
            await fs.rm(filePath, { recursive: true, force: true });
          } else {
            await fs.unlink(filePath);
          }
          totalDeleted++;
        }
      }
    }

    if (totalDeleted === 0) {
      m.react('ℹ️');
      await conn.reply(m.chat, `No había archivos que eliminar, solo creds.json está presente.`, m);
    } else {
      m.react('✅');
      await conn.reply(m.chat, `Se eliminaron ${totalDeleted} archivos de los subBots, creds.json quedó intacto.`, m);
    }
  } catch (error) {
    console.error('Error limpiando subBots:', error);
    await conn.reply(m.chat, `Ocurrió un error durante la limpieza.`, m);
  }
};

handler.help = ['limpiarsubbots'];
handler.tags = ['owner'];
handler.command = ['limpiarsubbots', 'clearbots', 'cleanall'];
handler.rowner = true;

export default handler;