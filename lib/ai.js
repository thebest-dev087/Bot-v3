const axios = require("axios");

async function askAI(prompt, senderName = "usuário") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return "🤖 IA não configurada. Define `GEMINI_API_KEY` no Termux:\n\n`export GEMINI_API_KEY=\"sua_chave\"`";
  }

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const system = `Você é um assistente útil e divertido. Responde em português.
Regra de saudação:
- Se o usuário se chama "thebest", cumprimente como "Olá, thebest-dev, meu criador!"
- Para qualquer outro usuário, cumprimente só com "Olá".
Hoje é ${hoje}.`;

  try {
    const r = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ parts: [{ text: `Usuário: ${senderName}\nMensagem: ${prompt}` }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      },
      { timeout: 60000 }
    );

    const candidate = r.data?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || "🤖 Sem resposta.";

    if (candidate?.finishReason === "MAX_TOKENS") {
      return text + "\n\n[Resposta cortada. Manda 'continua']";
    }

    return text;
  } catch (e) {
    return "🤖 Erro na IA: " + (e.response?.data?.error?.message || e.message);
  }
}

module.exports = { askAI };
