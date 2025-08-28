// ••> # Hecho x Ado [ github.com/Ado-rgb ]
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {

  const artly = {
    api: {
      base: 'https://getimg-x4mrsuupda-uc.a.run.app',
      endpoint: {
        generate: '/api-premium',
      }
    },
    headers: {
      'user-agent': 'NB Android/1.0.0',
      'accept-encoding': 'gzip',
      'content-type': 'application/x-www-form-urlencoded'
    },

    generate: async (prompt = '', width = 512, height = 512, steps = 25) => {
      if (!prompt.trim()) {
        return {
          success: false,
          code: 400,
          result: {
            error: '⚠️ El prompt no puede estar vacío.'
          }
        }
      }
      try {
        const payload = new URLSearchParams()
        payload.append('prompt', prompt)
        payload.append('width', width.toString())
        payload.append('height', height.toString())
        payload.append('num_inference_steps', steps.toString())

        const response = await axios.post(`${artly.api.base}${artly.api.endpoint.generate}`, payload, {
          headers: artly.headers
        })
        const data = response.data
        return {
          success: true,
          code: 200,
          result: {
            seed: data.seed,
            cost: data.cost,
            url: data.url
          }
        }
      } catch (err) {
        return {
          success: false,
          code: err.response?.status || 500,
          result: {
            error: '✘ Ocurrió un error durante la generación.'
          }
        }
      }
    },
  }

  if (command === 'artly') {
    if (!text) {
      return conn.sendMessage(
        m.chat,
        { text: `⟩ *Uso correcto:*\n» ${usedPrefix + command} <prompt>\n\n> Ejemplo:\n» ${usedPrefix + command} un gato con sombrero`, ...global.rcanal },
        { quoted: m }
      )
    }

    await conn.sendMessage(
      m.chat,
      { text: `🕒 Generando tu imagen...\n> Por favor espera un momento.`, ...global.rcanal },
      { quoted: m }
    )

    const result = await artly.generate(text)

    if (result.success) {
      await conn.sendMessage(
        m.chat,
        {
          image: { url: result.result.url },
          caption: `⟩ *Imagen generada con Artly* ✅\n\n» *Seed:* ${result.result.seed}\n» *Cost:* ${result.result.cost}`,
          ...global.rcanal
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        { text: `✘ Error: ${result.result.error}\n⟩ (Código: ${result.code})`, ...global.rcanal },
        { quoted: m }
      )
    }
  }
}

handler.help = ['artly']
handler.command = ['artly']
handler.tags = ['ia']


export default handler