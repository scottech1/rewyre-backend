const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'rewyre-backend' });
});

app.post('/api/ai-coaching', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Rewyre Backend running on port ${PORT}`);
});
