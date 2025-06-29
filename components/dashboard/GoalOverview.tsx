'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Goal } from '@/types';
import { formatDate, getProgressColor } from '@/lib/utils';

export default function GoalOverview() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/goals', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const updateGoalProgress = async (goalId: string, progress: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: goalId,
          progress: Math.max(0, Math.min(100, progress)),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(prev => prev.map(g => 
          g._id === goalId ? data.goal : g
        ));
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const updateGoalStatus = async (goalId: string, status: 'active' | 'completed' | 'paused') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: goalId,
          status,
          progress: status === 'completed' ? 100 : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(prev => prev.map(g => 
          g._id === goalId ? data.goal : g
        ));
      }
    } catch (error) {
      console.error('Error updating goal status:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Goals</h2>
          <div className="text-sm text-gray-400">
            {activeGoals.length} active • {completedGoals.length} completed
          </div>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg mb-2">No goals yet</p>
          <p className="text-gray-500 text-sm">Add some during onboarding or chat with Gideon AI about your aspirations! 🎯</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-300 mb-4 flex items-center space-x-2">
                <span>Active Goals</span>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              </h3>
              <div className="space-y-4">
                {activeGoals.map((goal) => (
                  <div key={goal._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-2 text-lg">{goal.title}</h4>
                        <p className="text-sm text-gray-400 mb-3">{goal.description}</p>
                        {goal.targetDate && (
                          <p className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full inline-block">
                            🎯 Target: {formatDate(goal.targetDate)}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGoalStatus(goal._id, 'paused')}
                          className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                        >
                          ⏸️ Pause
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateGoalStatus(goal._id, 'completed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ✅ Complete
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Progress</span>
                        <span className="text-sm text-gray-400">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            goal.progress < 30 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                            goal.progress < 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                            'bg-gradient-to-r from-green-500 to-green-400'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Progress Controls */}
                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGoalProgress(goal._id, goal.progress - 10)}
                        disabled={goal.progress <= 0}
                        className="border-white/20 text-gray-300 hover:bg-white/10 disabled:opacity-30"
                      >
                        -10%
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGoalProgress(goal._id, goal.progress + 10)}
                        disabled={goal.progress >= 100}
                        className="border-white/20 text-gray-300 hover:bg-white/10 disabled:opacity-30"
                      >
                        +10%
                      </Button>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => updateGoalProgress(goal._id, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-300 mb-4 flex items-center space-x-2">
                <span>Completed Goals</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </h3>
              <div className="space-y-3">
                {completedGoals.map((goal) => (
                  <div key={goal._id} className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-green-300 mb-1 flex items-center space-x-2">
                          <span>🏆</span>
                          <span>{goal.title}</span>
                        </h4>
                        <p className="text-sm text-green-400/80">{goal.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGoalStatus(goal._id, 'active')}
                        className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                      >
                        🔄 Reactivate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 