import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TaskBoard } from './views/TaskBoard';
import { Treasury } from './views/Treasury';
import { Wishlist } from './views/Wishlist';
import { ParentControl } from './views/ParentControl';
import { loadState, saveState } from './services/storageService';
import { AppState, Task } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [appState, setAppState] = useState<AppState>(loadState());

  // Save state whenever it changes
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  // Handler: Update a single task (e.g. moving from todo -> pending)
  const handleUpdateTask = (updatedTask: Task) => {
    setAppState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    }));
  };

  // Handler: Parent approves task
  const handleApproveTask = (taskId: string) => {
    setAppState(prev => {
      const taskIndex = prev.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;

      const task = prev.tasks[taskIndex];
      // Only pay if not already paid
      if (task.status === 'approved') return prev;

      const newBalance = prev.balance + task.reward;
      const newTotalEarnings = prev.totalEarnings + task.reward;
      
      const transaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount: task.reward,
        description: `${task.title} Completed`,
        type: 'income' as const
      };

      const updatedTasks = [...prev.tasks];
      updatedTasks[taskIndex] = { ...task, status: 'approved' };

      return {
        ...prev,
        balance: newBalance,
        totalEarnings: newTotalEarnings,
        transactions: [...prev.transactions, transaction],
        tasks: updatedTasks
      };
    });
  };

  // Handler: Parent rejects task
  const handleRejectTask = (taskId: string) => {
    setAppState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: 'rejected' } : t)
    }));
  };

  // Handler: Deduct funds
  const handleDeductFunds = (amount: number, reason: string) => {
    setAppState(prev => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [...prev.transactions, {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount: -amount,
        description: reason,
        type: 'expense'
      }]
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TaskBoard state={appState} updateTask={handleUpdateTask} />;
      case 'treasury':
        return <Treasury state={appState} />;
      case 'wishlist':
        return <Wishlist state={appState} />;
      case 'parent':
        return (
            <ParentControl 
                state={appState} 
                onApproveTask={handleApproveTask} 
                onRejectTask={handleRejectTask}
                onDeductFunds={handleDeductFunds}
            />
        );
      default:
        return <TaskBoard state={appState} updateTask={handleUpdateTask} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
