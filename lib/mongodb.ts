import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  isOnboarded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Goal Schema
const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['short-term', 'long-term'], required: true },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  targetDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Task Schema
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  extractedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  category: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    id: { type: String, required: true },
    content: { type: String, required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  extractedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  mood: { type: String },
  reflection: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Export models
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Goal = mongoose.models.Goal || mongoose.model('Goal', goalSchema);
export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

export default connectToDatabase; 