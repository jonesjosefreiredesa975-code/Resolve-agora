const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const USE_MOCK = process.env.USE_MOCK === "true";

// 🟢 Rota de teste
app.get("/", (req, res) => {
  res.send("🚀 API Resolve Agora está funcionando!");
});

// 🤖 Rota principal
app.post("/perguntar", async (req, res) => {
  const pergunta = req.body.pergunta;

  // Modo de simulação (sem precisar de chave agora)
  if (USE_MOCK || !process.env.OPENAI_API_KEY) {
    return res.json({
      resposta: `Solução simulada: "${pergunta}" — API ainda sem chave ativa.`,
    });
  }

  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: pergunta }]
      })
    });

    const data = await resposta.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    res.json({ resposta: data.choices[0].message.content });
  } catch (erro) {
    console.error("Erro:", erro.message);
    res.status(500).json({ erro: "Erro ao conectar à API", detalhe: erro.message });
  }
});

// 🔊 Inicialização do servidor
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
