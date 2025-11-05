const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const openaiClient = require('./openaiClient');
const mapsClient = require('./mapsClient');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Rota principal da API
app.post('/api/resolve', async (req, res) => {
  try {
    const { type, content, location } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Conteúdo ausente.' });
    }

    // Usa o OpenAI para gerar resposta
    const aiResponse = await openaiClient.getSolution(content, location);

    // Busca profissionais na cidade, se houver
    let professionals = [];
    if (location && location.city) {
      professionals = await mapsClient.findProfessionals(location.city);
    }

    res.json({
      ai: aiResponse,
      professionals,
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ API Resolve Agora rodando com sucesso!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
