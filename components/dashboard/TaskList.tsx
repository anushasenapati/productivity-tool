'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Task } from '@/types';
import { getPriorityColor, formatDate } from '@/lib/utils';

interface TaskListProps {
  newTasks: Task[];
  onTaskUpdate: () => void;
}

export default function TaskList({ newTasks, onTaskUpdate }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  });

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (newTasks.length > 0) {
      setTasks(prev => [...newTasks, ...prev]);
      onTaskUpdate();
    }
  }, [newTasks, onTaskUpdate]);

  const toggleComplete = async (task: Task) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: task._id,
          completed: !task.completed,
        }),
      });

      if (response.ok) {
        setTasks(prev => prev.map(t => 
          t._id === task._id ? { ...t, completed: !t.completed } : t
        ));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task._id);
    setEditForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    });
  };

  const saveEdit = async () => {
    if (!editingTask) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: editingTask,
          ...editForm,
          dueDate: editForm.dueDate || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(prev => prev.map(t => 
          t._id === editingTask ? data.task : t
        ));
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks(prev => prev.filter(t => t._id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Tasks</h2>
            <p className="text-sm text-gray-400">
              {activeTasks.length} active • {completedTasks.length} completed
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-300 mb-4 flex items-center space-x-2">
              <span>Active Tasks</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </h3>
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <div key={task._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
                  {editingTask === task._id ? (
                    <div className="space-y-4">
                      <input
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Task title"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description (optional)"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                      />
                      <div className="flex space-x-4">
                        <select
                          value={editForm.priority}
                          onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value as any }))}
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low" className="bg-gray-800">Low Priority</option>
                          <option value="medium" className="bg-gray-800">Medium Priority</option>
                          <option value="high" className="bg-gray-800">High Priority</option>
                        </select>
                        <input
                          type="date"
                          value={editForm.dueDate}
                          onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingTask(null)} className="border-white/20 text-gray-300">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleComplete(task)}
                          className="mt-1 h-4 w-4 text-green-500 bg-white/10 border border-white/30 rounded focus:ring-green-500 focus:ring-2"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white mb-1">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-3 flex-wrap gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                              task.priority === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                              task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                              'bg-green-500/20 text-green-300 border-green-500/30'
                            }`}>
                              {task.priority} priority
                            </span>
                            {task.dueDate && (
                              <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                                📅 Due: {formatDate(task.dueDate)}
                              </span>
                            )}
                            {task.category && (
                              <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full capitalize">
                                🏷️ {task.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => startEdit(task)}
                          className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          ✏️
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => deleteTask(task._id)}
                          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-300 mb-4 flex items-center space-x-2">
              <span>Completed Tasks</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </h3>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div key={task._id} className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task)}
                    className="h-4 w-4 text-green-500 bg-white/10 border border-white/30 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-400 line-through flex-1">{task.title}</span>
                  <div className="text-xs text-green-400">✅</div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => deleteTask(task._id)}
                    className="text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    🗑️
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg mb-2">No tasks yet</p>
            <p className="text-gray-500 text-sm">Start a conversation with Gideon AI to extract tasks automatically! ✨</p>
          </div>
        )}
      </div>
    </div>
  );
} 