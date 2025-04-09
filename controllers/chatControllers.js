const OpenAI = require("openai");

// ✅ Replace with your actual Gemini API key
const openai = new OpenAI({
  apiKey: "AIzaSyA7ACDCE8nikoRfRfxVoV67Q6Xxn5jN7oQ",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: 'Message is required.' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.choices[0]?.message?.content || "No reply from Gemini.";
    res.json({ reply });
  } catch (error) {
    console.error("Gemini (OpenAI wrapper) error:", error.message);
    res.status(500).json({ reply: "Error communicating with Gemini (OpenAI style)." });
  }
};

module.exports = { chatWithAI };
