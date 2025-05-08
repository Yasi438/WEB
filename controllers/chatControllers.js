const OpenAI = require("openai");
const axios = require('axios');

// ✅ Replace with your actual Gemini API key
// const openai = new OpenAI({
//   apiKey: "AIzaSyA7ACDCE8nikoRfRfxVoV67Q6Xxn5jN7oQ",
//   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
// // });

// const chatWithAILocal = async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ reply: 'Message is required.' });
//   }

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gemini-1.5-flash",
//       messages: [
//         {
//           role: "system",
//           content: "You are a helpful assistant."
//         },
//         {
//           role: "user",
//           content: message
//         }
//       ]
//     });

//     const reply = response.choices[0]?.message?.content || "No reply from Gemini.";
//     res.json({ reply });
//   } catch (error) {
//     console.error("Gemini (OpenAI wrapper) error:", error.message);
//     res.status(500).json({ reply: "Error communicating with Gemini (OpenAI style)." });
//   }
// };


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
