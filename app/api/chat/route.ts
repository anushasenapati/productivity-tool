import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase, { Conversation, Task } from '@/lib/mongodb';
import { getUserFromToken } from '@/lib/auth';
import { analyzeMessage, generateResponse } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { message, conversationId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      );
    }

    // Analyze the message with OpenAI
    const analysis = await analyzeMessage(message);

    // Generate AI response
    const aiResponse = await generateResponse(message, analysis);

    // Create or update conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.userId.toString() !== user._id.toString()) {
        return NextResponse.json(
          { message: 'Conversation not found' },
          { status: 404 }
        );
      }
    } else {
      conversation = new Conversation({
        userId: user._id,
        messages: [],
        extractedTasks: [],
        mood: analysis.mood,
        reflection: analysis.reflection,
      });
    }

    // Add messages to conversation
    const userMessageId = Date.now().toString();
    const aiMessageId = (Date.now() + 1).toString();

    conversation.messages.push({
      id: userMessageId,
      content: message,
      role: 'user',
      timestamp: new Date(),
    });

    conversation.messages.push({
      id: aiMessageId,
      content: aiResponse,
      role: 'assistant',
      timestamp: new Date(),
    });

    // Update mood and reflection if provided
    if (analysis.mood) conversation.mood = analysis.mood;
    if (analysis.reflection) conversation.reflection = analysis.reflection;

    // Create tasks from analysis
    const newTasks = [];
    for (const taskData of analysis.tasks) {
      const task = new Task({
        userId: user._id,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        category: taskData.category,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
        extractedFrom: conversation._id,
      });

      const savedTask = await task.save();
      newTasks.push(savedTask);
      conversation.extractedTasks.push(savedTask._id);
    }

    await conversation.save();

    return NextResponse.json({
      message: 'Message processed successfully',
      conversation: {
        _id: conversation._id,
        messages: conversation.messages,
        mood: conversation.mood,
        reflection: conversation.reflection,
      },
      extractedTasks: newTasks,
      analysis,
    });
  } catch (error) {
    console.error('Chat processing error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 