const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("🚀 API Resolve Agora está funcionando!");
});

app.post("/perguntar", async (req, res) => {
  const pergunta = req.body.pergunta;

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
    res.json({ resposta: data.choices[0].message.content });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao conectar à OpenAI", detalhe: erro.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Servidor ativo na porta ${PORT}`));
