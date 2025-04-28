// index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

// App setup
const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GOOGLE_API_KEY;

// Middleware
app.use(cors()); // Allow all origins temporarily for development
app.use(express.json()); // ✅ Needed to parse JSON from incoming requests

// Load Gemini AI model
console.log("🔑 API Key loaded:", API_KEY ? "Yes" : "No");
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// ✨ Asthma-Focused Chatbot Route
app.post('/api/chat', async (req, res) => {
  try {
    const userInput = req.body.message;
    console.log("📥 Received message:", userInput);

    const systemInstruction = `
You are Respira, a friendly and supportive asthma wellness assistant.
- You have already introduced yourself when the chat started.
- Do not repeat your introduction again unless the user explicitly asks "Who are you?" or "Introduce yourself".

- Help users manage asthma by offering guidance about triggers, medication usage, breathing exercises, symptom monitoring, and air quality (AQI) awareness.
- Offer tips such as staying hydrated, avoiding smoke/allergens, practicing controlled breathing techniques, and managing flare-ups carefully.
- Provide positive encouragement and practical advice in a compassionate tone.
- Always include a reminder to consult a healthcare provider for medical advice or emergencies.
- Politely decline questions unrelated to asthma, respiratory health, or air quality.
`;

    const fullPrompt = `
System: ${systemInstruction}

User: ${userInput}
`;

    const result = await model.generateContent(fullPrompt);

    if (!result || !result.response) {
      console.error("❌ No response from Gemini");
      return res.status(500).json({ response: 'Gemini did not return a response.' });
    }

    const responseText = await result.response.text();
    console.log("🤖 Gemini response:", responseText);

    res.json({ response: responseText });

  } catch (err) {
    console.error('❌ Gemini API FAILED:', err.message || err);
    res.status(500).json({ response: 'Gemini API failed internally: ' + (err.message || err) });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Gemini backend running at http://localhost:${PORT}`);
});
