const axios = require('axios');

const chatWithAI = async (req, res) => {
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

module.exports = { chatWithAI };
