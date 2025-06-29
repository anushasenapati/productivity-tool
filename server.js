import express from 'express';
import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
console.log("Loaded GROQ_API_KEY:", process.env.GROQ_API_KEY);

const SUPABASE_URL = 'https://qrtzijoywwflzmvreskv.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFydHppam95d3dmbHptdnJlc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMTY4MTQsImV4cCI6MjA2Njc5MjgxNH0.9IEeF32R9u4RaG2R8AWgUM-vVJdSqR4ORX2J8Zmqlxw';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

// System prompt to reduce hallucination and define the chatbot's role
const SYSTEM_PROMPT = `You are a helpful productivity coach and assistant. Your role is to:

1. Provide practical, actionable advice for improving productivity
2. Help users with time management, goal setting, and task organization
3. Suggest specific techniques and tools when appropriate
4. Ask clarifying questions when needed to provide better assistance
5. Stay focused on productivity-related topics
6. Be honest about limitations and don't make up information
7. If you're unsure about something, say so rather than guessing

Always respond in a helpful, encouraging tone while being realistic and practical.`;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    
    if (!userMessage || userMessage.trim() === '') {
        return res.status(400).json({ error: "Message cannot be empty" });
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMessage }
            ],
            model: "llama3-70b-8192",
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 1,
            stream: false 
        });

        // Extract the reply
        const reply = chatCompletion.choices?.[0]?.message?.content || "I couldn't generate a response.";
        res.json({ reply: reply.trim() });

    } catch (err) {
        console.error("Groq API error full details:", JSON.stringify(err, null, 2));
        res.status(500).json({ error: "Groq API failed. Check your terminal for details." });
    }
});

// --- Supabase Endpoints ---
app.post('/api/tasks', async (req, res) => {
    const { content } = req.body;
    if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Task description cannot be empty.' });
    }
    const { data, error } = await supabase.from('tasks').insert([{ description: content }]);
    if (error) {
        console.error('Supabase tasks insert error:', error);
        return res.status(500).json({ error: 'Failed to save task.' });
    }
    res.json({ success: true, data });
});

app.post('/api/milestones', async (req, res) => {
    const { content } = req.body;
    if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Milestone description cannot be empty.' });
    }
    const { data, error } = await supabase.from('milestones').insert([{ description: content }]);
    if (error) {
        console.error('Supabase milestones insert error:', error);
        return res.status(500).json({ error: 'Failed to save milestone.' });
    }
    res.json({ success: true, data });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Productivity chatbot is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Productivity chatbot running at http://localhost:${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

