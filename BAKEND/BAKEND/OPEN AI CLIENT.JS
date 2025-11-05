const fetch = require('node-fetch');

async function getSolution(content, location) {
  try {
    const prompt = `
Você é o Resolve Agora, um assistente que sempre responde com as 3 melhores soluções do mundo para qualquer problema.
A resposta deve conter:
1️⃣ Solução caseira (simples e prática)
2️⃣ Solução econômica/OTC (baixo custo)
3️⃣ Solução profissional (com indicação de serviços)
E no final, um passo instantâneo recomendado.
O problema é: "${content}".
A cidade do usuário é: ${location?.city || "não informada"}.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      return 'Erro ao conectar com a OpenAI.';
    }

    return data.choices?.[0]?.message?.content || 'Sem resposta gerada.';
  } catch (error) {
    console.error(error);
    return 'Erro na comunicação com a OpenAI.';
  }
}

module.exports = { getSolution };
