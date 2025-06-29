import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

// Test the Gemini API integration
async function testGeminiAPI() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY not found in environment variables");
        console.log("Please create a .env file with your API key:");
        console.log("GEMINI_API_KEY=your_api_key_here");
        return;
    }

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    try {
        console.log("🧪 Testing Gemini API...");
        
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: "Hello! Can you give me one quick productivity tip?",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 100,
            }
        });

        const reply = response.candidates?.[0]?.content?.parts?.[0]?.text || 
                     response.text || 
                     "No response received";

        console.log("API Test Successful!");
        console.log("Response:", reply);
        
    } catch (error) {
        console.error("API Test Failed:", error.message);
        
        if (error.message?.includes('API_KEY')) {
            console.log("Make sure your API key is valid and properly set in .env file");
        } else if (error.message?.includes('quota')) {
            console.log("You may have exceeded your API quota");
        }
    }
}

testGeminiAPI(); 