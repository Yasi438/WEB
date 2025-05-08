const OpenAI = require("openai");
const axios = require('axios');

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
