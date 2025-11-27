import React from 'react';
import { Task, AppState } from '../types';
import { TaskCard } from '../components/TaskCard';
import { Flame } from 'lucide-react';

interface TaskBoardProps {
  state: AppState;
  updateTask: (task: Task) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ state, updateTask }) => {
  const todayTasks = state.tasks.filter(t => t.date === new Date().toISOString().split('T')[0]);
  
  // Calculate completion percentage
  const completedCount = todayTasks.filter(t => t.status === 'approved' || t.status === 'completed').length;
  const progress = todayTasks.length > 0 ? (completedCount / todayTasks.length) * 100 : 0;

  return (
    <div className="p-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-black text-gray-900">Hello, Hunter!</h1>
            <p className="text-gray-500 text-sm mt-1">Ready to defeat today's monsters?</p>
        </div>
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <Flame size={16} fill="currentColor" />
                <span className="font-bold text-sm">{state.streak} Day Streak</span>
            </div>
        </div>
      </header>

      {/* Progress Card */}
      <div className="bg-gray-900 rounded-3xl p-6 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-40 -mr-10 -mt-10"></div>
        <div className="relative z-10">
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">Daily Progress</span>
                <span className="font-mono text-xl">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            {progress === 100 && (
                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                    <div className="bg-yellow-400 rounded-full p-1">
                        <Flame size={16} className="text-yellow-900" fill="currentColor"/>
                    </div>
                    <span className="text-sm font-medium">All clear! Bonus unlocked?</span>
                </div>
            )}
        </div>
      </div>

      <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
        Today's Quests <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{todayTasks.length}</span>
      </h2>

      <div className="space-y-4">
        {todayTasks.length > 0 ? (
            todayTasks.map(task => (
                <TaskCard key={task.id} task={task} onUpdate={updateTask} />
            ))
        ) : (
            <div className="text-center py-10 text-gray-400">
                No monsters found today...
            </div>
        )}
      </div>
    </div>
  );
};
