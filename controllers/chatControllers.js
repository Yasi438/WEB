const axios = require('axios');

const chatWithAILocal = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: 'Message is required.' });
  }

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral', 
      prompt: message,
      stream: false 
    });

    const reply = response.data?.response || 'No response received from model.';
    res.json({ reply });
  } catch (err) {
    console.error('Ollama error:', err.message);
    res.status(500).json({ reply: 'Local AI service unavailable. Make sure Ollama is running.' });
  }
};


/*

curl "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer GEMINI_API_KEY" \
-d '{
    "model": "gemini-2.0-flash",
    "messages": [
        {"role": "user", "content": "Explain to me how AI works"}
    ]
    }'

*/

const chatWithAI = async (req, res) => {
  const { message } = req.body;

  const token = "AIzaSyBsFoGt1d-82xVUOLIjzWy8ITyAd_ZCxko"
  const headersConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  if (!message) {
    return res.status(400).json({ reply: 'Message is required.' });
  }

  try {
    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      model: 'gemini-2.0-flash', 
      messages: [
        {"role": "user", "content": message}
      ]
    },headersConfig);

    console.log(response.data.choices[0].message);

    const reply = response.data?.choices[0].message.content || 'No response received from model.';
    res.json({ reply });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ reply: 'Gemini API error' });
  }
};



module.exports = { chatWithAI };
