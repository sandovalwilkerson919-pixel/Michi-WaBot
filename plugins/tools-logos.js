import axios from 'axios'

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.sendMessage(
      m.chat,
      { text: `⚠️ Ingresa un texto para generar un logo con IA\n\n> *Uso correcto:*\n» .ai-logo <tu prompt aquí>`, ...global.rcanal },
      { quoted: m }
    )
  }

  try {
    const initialPrompt = text.trim()

    const fluxaiUrl = 'https://fluxai.pro/api/prompts/generate'
    const nirkyyUrlBase = 'https://nirkyy.koyeb.app/api/v1/writecream-text2image'

    const fluxaiResponse = await axios.post(
      fluxaiUrl,
      { prompt: initialPrompt, style: 'logo-design' },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; RMX2185 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.7103.60 Mobile Safari/537.36',
          'Referer': 'https://fluxai.pro/image-prompt-generator'
        },
        responseType: 'text'
      }
    )

    if (fluxaiResponse.status !== 200 || !fluxaiResponse.data) {
      return conn.sendMessage(
        m.chat,
        { text: `❌ No se pudieron obtener ideas de *FluxAI*.\n⟩ Intenta de nuevo más tarde.`, ...global.rcanal },
        { quoted: m }
      )
    }

    const rawTextData = fluxaiResponse.data
    const lines = rawTextData.split('\n').filter(line => line.trim() !== '')
    let promptParts = []

    for (const line of lines) {
      if (line.startsWith('0:')) {
        let contentJsonString = line.substring(2).trim()
        if (contentJsonString.startsWith('"') && contentJsonString.endsWith('"')) {
          try {
            promptParts.push(JSON.parse(contentJsonString))
          } catch {}
        }
      }
    }

    const generatedPrompt = promptParts.join("").trim()

    if (!generatedPrompt) {
      return conn.sendMessage(
        m.chat,
        { text: `⚠️ *FluxAI* devolvió un formato inesperado o vacío.\n⟩ No se puede continuar.`, ...global.rcanal },
        { quoted: m }
      )
    }

    const encodedPrompt = encodeURIComponent(generatedPrompt)
    const nirkyyImageUrl = `${nirkyyUrlBase}?prompt=${encodedPrompt}&aspect_ratio=1%3A1`

    await conn.sendMessage(
      m.chat,
      {
        image: { url: nirkyyImageUrl },
        caption: `⟩ *Logo generado con IA* ✅\n\n» *Prompt original:* ${initialPrompt}\n» *Prompt usado:* ${generatedPrompt}`,
        ...global.rcanal
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    return conn.sendMessage(
      m.chat,
      { text: `✘ Ocurrió un error técnico al generar el logo.\n⟩ Intenta nuevamente más tarde.`, ...global.rcanal },
      { quoted: m }
    )
  }
}

handler.help = ['logo']
handler.tags = ['tools']
handler.command = ['logo']

export default handler