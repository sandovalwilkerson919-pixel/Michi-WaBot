import { promises as fs, existsSync } from 'fs';
import path from 'path';

var handler = async (m, { conn }) => {
  await conn.reply(m.chat, `Iniciando limpieza de todos los *SubBots*, manteniendo creds.json...`, m);
  m.react('🕓');

  const baseDir = './JadiBots/';
  try {
    if (!existsSync(baseDir)) {
      return conn.reply(m.chat, `No existe la carpeta JadiBots.`, m);
    }

    const subBots = await fs.readdir(baseDir);
    let totalDeleted = 0;
    let logs = [];

    for (const bot of subBots) {
      const botPath = path.join(baseDir, bot);
      const stat = await fs.stat(botPath);
      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(botPath);
      if (files.length === 0) {
        logs.push(`*「🌾」* SubBot ${bot} está vacío.`);
        continue;
      }

      let deletedInBot = 0;
      for (const file of files) {
        if (file !== 'creds.json') {
          const filePath = path.join(botPath, file);
          const fileStat = await fs.stat(filePath);
          try {
            if (fileStat.isDirectory()) {
              await fs.rm(filePath, { recursive: true, force: true });
            } else {
              await fs.unlink(filePath);
            }
            deletedInBot++;
            totalDeleted++;
          } catch (err) {
            logs.push(`❌ Error eliminando ${bot}/${file}: ${err.message}`);
          }
        }
      }

      logs.push(`*「🧃」* SubBot ${bot} limpio, ${deletedInBot} archivos eliminados, creds.json intacto.`);
    }

    if (totalDeleted === 0) {
      m.react('ℹ️');
      await conn.reply(m.chat, `No se eliminaron archivos, solo creds.json está presente en todos los subBots.`, m);
    } else {
      m.react('✅');
      let summary = `*「🧇」* Limpieza completa de SubBots\nArchivos eliminados: ${totalDeleted}\n\n` + logs.join('\n');
      await conn.reply(m.chat, summary, m);
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