'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/dashboard/ChatInterface';
import TaskList from '@/components/dashboard/TaskList';
import GoalOverview from '@/components/dashboard/GoalOverview';
import Button from '@/components/ui/Button';
import { Task } from '@/types';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [newTasks, setNewTasks] = useState<Task[]>([]);
  const [taskUpdateKey, setTaskUpdateKey] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    setUser({ name: 'User' }); // Placeholder

    return () => clearInterval(timer);
  }, [router]);

  const handleTasksExtracted = (tasks: Task[]) => {
    setNewTasks(tasks);
  };

  const handleTaskUpdate = () => {
    setNewTasks([]);
    setTaskUpdateKey(prev => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="text-white text-lg">Loading your AI assistant...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Gideon AI
                </h1>
                <p className="text-xs text-gray-400">AI-Powered Productivity</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-300">{getGreeting()}!</p>
                <p className="text-xs text-gray-500">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {getGreeting()}, ready to be productive? ✨
            </h2>
            <p className="text-gray-400 text-lg">
              Share your thoughts with Gideon and watch your tasks organize themselves
            </p>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl border border-blue-500/30 p-4 text-center">
            <div className="text-2xl font-bold text-blue-300">0</div>
            <div className="text-xs text-gray-400">Conversations</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl border border-green-500/30 p-4 text-center">
            <div className="text-2xl font-bold text-green-300">0</div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl border border-purple-500/30 p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">0</div>
            <div className="text-xs text-gray-400">Active Goals</div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chat Interface */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden h-[600px]">
              <ChatInterface onTasksExtracted={handleTasksExtracted} />
            </div>
          </div>

          {/* Tasks Section */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden h-[600px]">
              <TaskList 
                key={taskUpdateKey}
                newTasks={newTasks} 
                onTaskUpdate={handleTaskUpdate}
              />
            </div>
          </div>
        </div>

        {/* Goals Section - Full Width */}
        <div className="mb-8">
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <GoalOverview />
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Productivity Streak</h4>
              <div className="text-2xl font-bold text-yellow-400">3 days</div>
              <p className="text-xs text-gray-500">Keep it up! 🔥</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Focus Time</h4>
              <div className="text-2xl font-bold text-blue-400">2.5h</div>
              <p className="text-xs text-gray-500">Today's deep work</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Mood Trend</h4>
              <div className="text-2xl font-bold text-green-400">📈 Up</div>
              <p className="text-xs text-gray-500">Feeling positive</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Next Priority</h4>
              <div className="text-sm font-medium text-purple-400">GMAT Prep</div>
              <p className="text-xs text-gray-500">Due this weekend</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 