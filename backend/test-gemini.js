import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

console.log("🔑 API Key loaded:", process.env.GOOGLE_API_KEY); // Confirm loaded!

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const test = async () => {
  try {
    const result = await model.generateContent("What is asthma?");
    const response = await result.response.text();
    console.log("✅ Gemini Response:", response);
  } catch (error) {
    console.error("❌ Gemini Test Error:", error.message);
  }
};

test();
