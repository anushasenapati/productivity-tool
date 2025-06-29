export interface User {
  _id: string;
  email: string;
  name: string;
  password?: string;
  createdAt: Date;
  isOnboarded: boolean;
}

export interface Goal {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: 'short-term' | 'long-term';
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  targetDate?: Date;
  progress: number; // 0-100
}

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  extractedFrom?: string; // conversation ID if extracted from chat
  category?: string;
}

export interface Conversation {
  _id: string;
  userId: string;
  messages: Message[];
  createdAt: Date;
  extractedTasks: string[]; // task IDs
  mood?: string;
  reflection?: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatAnalysis {
  tasks: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    dueDate?: string;
  }[];
  mood?: string;
  reflection?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface OnboardingData {
  shortTermTasks: string[];
  longTermGoals: {
    title: string;
    description: string;
    targetDate?: string;
  }[];
} 