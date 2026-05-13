const { GoogleGenerativeAI } = require('@google/generative-ai')

const MAX_MESSAGE_LENGTH = 500

const FARMING_CONTEXT = `You are AgroBot, an expert AI farming assistant for AgroVision AI.
You help farmers with: crop disease diagnosis, treatment recommendations, fertilizer advice,
soil health, pest control, irrigation, harvesting, and general agricultural best practices.
Keep responses concise (under 150 words), practical, and farmer-friendly. Use simple language.
If a question is not related to farming or agriculture, politely redirect to farming topics.`

const FALLBACK_RESPONSES = {
  blight:     'Early blight is caused by Alternaria solani. Apply Chlorothalonil or Mancozeb fungicide. Remove infected leaves and avoid overhead watering. Rotate crops next season.',
  rust:       'Leaf rust is a fungal disease. Apply Propiconazole or Tebuconazole fungicide early. Ensure good air circulation and avoid excess nitrogen.',
  nitrogen:   'Nitrogen deficiency shows as yellowing of older leaves. Apply urea (46-0-0) at 50 kg/ha or ammonium nitrate. Split application gives better results.',
  fertilizer: 'For most crops, use a balanced NPK fertilizer (19-19-19) as a base. Add specific nutrients based on soil test results. Apply in split doses for better uptake.',
  soil:       'Healthy soil needs balanced NPK, pH between 6–7.5, and good organic matter (>2.5%). Add compost, practice crop rotation, and avoid over-tilling.',
  irrigation: 'Most crops need 25–50mm of water per week. Drip irrigation saves 30–50% water. Water early morning to reduce evaporation and disease risk.',
  pest:       'For pest control: identify the pest first, then use targeted pesticides. Prefer IPM (Integrated Pest Management) — combine biological, cultural, and chemical controls.',
  harvest:    'Harvest at the right maturity stage for best quality. Avoid harvesting when wet to reduce post-harvest losses. Store in cool, dry, well-ventilated conditions.',
  default:    'I can help with crop diseases, fertilizers, soil health, irrigation, and pest control. Could you provide more details about your specific crop and issue?',
}

const getKeywordResponse = (message) => {
  const msg = message.toLowerCase()
  if (msg.includes('blight'))                                  return FALLBACK_RESPONSES.blight
  if (msg.includes('rust'))                                    return FALLBACK_RESPONSES.rust
  if (msg.includes('nitrogen') || msg.includes('deficiency'))  return FALLBACK_RESPONSES.nitrogen
  if (msg.includes('fertilizer') || msg.includes('fertiliser')) return FALLBACK_RESPONSES.fertilizer
  if (msg.includes('soil') || msg.includes('npk'))             return FALLBACK_RESPONSES.soil
  if (msg.includes('water') || msg.includes('irrigation'))     return FALLBACK_RESPONSES.irrigation
  if (msg.includes('pest') || msg.includes('insect'))          return FALLBACK_RESPONSES.pest
  if (msg.includes('harvest') || msg.includes('yield'))        return FALLBACK_RESPONSES.harvest
  return FALLBACK_RESPONSES.default
}

const chat = async (req, res, next) => {
  try {
    const { message } = req.body

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required' })
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ message: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` })
    }

    const sanitizedMessage = message.trim()

    // Use Gemini if API key is configured
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key') {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const prompt = `${FARMING_CONTEXT}\n\nFarmer's question: ${sanitizedMessage}`
        const result = await model.generateContent(prompt)
        const reply = result.response.text().trim()

        return res.json({ reply })
      } catch (apiErr) {
        // Log Gemini error and fall through to keyword fallback
        console.error('Gemini API error:', apiErr.message)
      }
    }

    // Keyword-based fallback
    res.json({ reply: getKeywordResponse(sanitizedMessage) })
  } catch (err) {
    next(err)
  }
}

module.exports = { chat }
