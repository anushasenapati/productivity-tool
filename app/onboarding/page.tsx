'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [shortTermTasks, setShortTermTasks] = useState<string[]>(['']);
  const [longTermGoals, setLongTermGoals] = useState([
    { title: '', description: '', targetDate: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addTask = () => {
    setShortTermTasks([...shortTermTasks, '']);
  };

  const removeTask = (index: number) => {
    if (shortTermTasks.length > 1) {
      setShortTermTasks(shortTermTasks.filter((_, i) => i !== index));
    }
  };

  const updateTask = (index: number, value: string) => {
    const updated = [...shortTermTasks];
    updated[index] = value;
    setShortTermTasks(updated);
  };

  const addGoal = () => {
    setLongTermGoals([...longTermGoals, { title: '', description: '', targetDate: '' }]);
  };

  const removeGoal = (index: number) => {
    if (longTermGoals.length > 1) {
      setLongTermGoals(longTermGoals.filter((_, i) => i !== index));
    }
  };

  const updateGoal = (index: number, field: keyof typeof longTermGoals[0], value: string) => {
    const updated = [...longTermGoals];
    updated[index] = { ...updated[index], [field]: value };
    setLongTermGoals(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Create tasks
      const validTasks = shortTermTasks.filter(task => task.trim());
      for (const taskTitle of validTasks) {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: taskTitle,
            priority: 'medium',
            category: 'personal',
          }),
        });
      }

      // Create goals
      const validGoals = longTermGoals.filter(goal => goal.title.trim() && goal.description.trim());
      for (const goal of validGoals) {
        await fetch('/api/goals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: goal.title,
            description: goal.description,
            category: 'long-term',
            targetDate: goal.targetDate || undefined,
          }),
        });
      }

      // Mark user as onboarded
      // This would typically be done through a user update API
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Gideon AI!</h1>
          <p className="text-gray-600">Let's get you set up with your initial tasks and goals.</p>
        </div>

        {step === 1 && (
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What's on your mind today?</h2>
            <p className="text-gray-600 mb-6">
              Add any short-term tasks you need to accomplish. Don't worry about being perfect - 
              you can always edit these later or let Gideon AI extract more tasks from your conversations.
            </p>

            <div className="space-y-4">
              {shortTermTasks.map((task, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Task ${index + 1}`}
                    value={task}
                    onChange={(e) => updateTask(index, e.target.value)}
                    className="flex-1"
                  />
                  {shortTermTasks.length > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => removeTask(index)}
                      className="px-3"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={addTask}>
                + Add Another Task
              </Button>
              <Button onClick={() => setStep(2)}>
                Next: Long-term Goals
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What are your long-term goals?</h2>
            <p className="text-gray-600 mb-6">
              Think bigger picture - what do you want to achieve in the coming weeks, months, or years?
            </p>

            <div className="space-y-6">
              {longTermGoals.map((goal, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">Goal {index + 1}</h3>
                    {longTermGoals.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeGoal(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <Input
                      label="Goal Title"
                      placeholder="e.g., Learn Spanish, Get promoted, Run a marathon"
                      value={goal.title}
                      onChange={(e) => updateGoal(index, 'title', e.target.value)}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        placeholder="Describe your goal in more detail..."
                        value={goal.description}
                        onChange={(e) => updateGoal(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent h-24 resize-none"
                      />
                    </div>
                    <Input
                      label="Target Date (Optional)"
                      type="date"
                      value={goal.targetDate}
                      onChange={(e) => updateGoal(index, 'targetDate', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={addGoal}>
                + Add Another Goal
              </Button>
              <div className="space-x-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleSubmit} loading={loading}>
                  Complete Setup
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 