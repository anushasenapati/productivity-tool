import OpenAI from 'openai';
import { ChatAnalysis } from '@/types';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeMessage(message: string): Promise<ChatAnalysis> {
  try {
    const systemPrompt = `You are Gideon AI, an expert personal productivity assistant. Carefully analyze the user's message and extract ALL actionable tasks, including both explicit and implicit ones.

TASK EXTRACTION RULES:
1. Extract ANY action that needs to be done (follow-ups, appointments, study sessions, personal goals)
2. Include both urgent tasks and general goals/intentions mentioned
3. Capture specific deadlines when mentioned (e.g., "before Friday", "this weekend")
4. Don't ignore small tasks like phone calls, appointments, or personal commitments
5. Include habits or routines the user wants to start/continue
6. Extract both work/academic tasks AND personal/social tasks

CATEGORIES TO LOOK FOR:
- Follow-ups with people (networking, social connections)
- Academic/work tasks (studying, assignments, applications)
- Health & fitness activities
- Family responsibilities
- Personal development (journaling, hobbies)
- Creative projects or side ideas
- Makeup tasks for things skipped

PRIORITY LEVELS:
- "high": Urgent with deadlines or important consequences
- "medium": Important but flexible timing
- "low": Nice to have, personal goals, habits

RESPONSE FORMAT - Return ONLY valid JSON:
{
  "tasks": [
    {
      "title": "Clear, actionable task description",
      "description": "Additional context if helpful",
      "priority": "low|medium|high",
      "category": "work|personal|study|health|social|creative",
      "dueDate": "YYYY-MM-DD format or null"
    }
  ],
  "mood": "Brief description of emotional state (scattered, motivated, tired, etc.)",
  "reflection": "Key insight about their day or mindset",
  "sentiment": "positive|negative|neutral"
}

EXAMPLE - If user says: "Had coffee with Sarah from marketing, should follow up about that project. Also need to prep for Monday's presentation and my gym membership expires Friday."

Expected tasks:
- Follow up with Sarah about the project (medium priority, work)
- Prepare for Monday's presentation (high priority, work, due 2024-XX-XX)
- Renew gym membership before Friday (high priority, health, due 2024-XX-XX)

Extract ALL actionable items. Be thorough and don't miss anything!`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Using the more reliable gpt-4o model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.2, // Lower temperature for more consistent results
      max_tokens: 2000, // Increased token limit for longer responses
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI raw response:', content); // Debug logging

    // Clean up the response to ensure it's valid JSON
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/, '').replace(/```$/, '');
    }
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/, '').replace(/```$/, '');
    }

    // Parse the JSON response
    const analysis: ChatAnalysis = JSON.parse(cleanContent);
    
    // Validate and set defaults
    if (!analysis.tasks || !Array.isArray(analysis.tasks)) {
      analysis.tasks = [];
    }
    
    if (!analysis.sentiment) {
      analysis.sentiment = 'neutral';
    }

    if (!analysis.mood) {
      analysis.mood = 'Unable to determine mood';
    }

    if (!analysis.reflection) {
      analysis.reflection = 'No specific reflection extracted';
    }

    console.log('Parsed analysis:', analysis); // Debug logging

    return analysis;
  } catch (error) {
    console.error('Error analyzing message:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    
    // Return a fallback analysis with some manual task extraction
    const fallbackTasks: any[] = [];
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword-based fallback extraction
    if (lowerMessage.includes('follow up') || lowerMessage.includes('contact')) {
      fallbackTasks.push({
        title: 'Follow up on mentioned conversation',
        description: 'Follow up based on recent conversation',
        priority: 'medium',
        category: 'personal',
        dueDate: null
      });
    }

    return {
      tasks: fallbackTasks,
      mood: 'Unable to analyze mood - processing error',
      reflection: 'Unable to extract reflection - processing error',
      sentiment: 'neutral' as const
    };
  }
}

export async function generateResponse(message: string, analysis: ChatAnalysis): Promise<string> {
  try {
    const tasksText = analysis.tasks.length > 0 
      ? analysis.tasks.map(task => `• ${task.title}${task.dueDate ? ` (${task.dueDate})` : ''}`).join('\n')
      : 'No specific tasks identified this time.';

    const systemPrompt = `You are Gideon AI, a warm and encouraging personal productivity assistant. The user just shared their day with you, and you've successfully extracted ${analysis.tasks.length} tasks from their message.

Respond naturally and supportively. Your response should:
1. Acknowledge their day/experience with empathy
2. Highlight the tasks you've identified (be enthusiastic about helping them stay organized)
3. Offer gentle encouragement or support
4. Keep it conversational and warm (like a helpful friend)

Tasks extracted:
${tasksText}

Mood detected: ${analysis.mood}
Sentiment: ${analysis.sentiment}

Keep your response concise but meaningful (2-3 sentences).`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    return response.choices[0]?.message?.content || 
      `Thanks for sharing! I've extracted ${analysis.tasks.length} tasks from what you told me. I'm here to help keep you organized and on track! 🎯`;
  } catch (error) {
    console.error('Error generating response:', error);
    return `Thanks for sharing! I've processed your message and extracted ${analysis.tasks.length} tasks to help keep you organized. Keep up the great work! 🌟`;
  }
} 