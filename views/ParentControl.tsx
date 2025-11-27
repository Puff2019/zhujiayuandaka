import React, { useState } from 'react';
import { AppState, Task, TaskStatus } from '../types';
import { Check, X, Lock, Play, Mic, AlertCircle } from 'lucide-react';

interface ParentControlProps {
  state: AppState;
  onApproveTask: (taskId: string) => void;
  onRejectTask: (taskId: string) => void;
  onDeductFunds: (amount: number, reason: string) => void;
}

export const ParentControl: React.FC<ParentControlProps> = ({ state, onApproveTask, onRejectTask, onDeductFunds }) => {
  const [locked, setLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [deductAmount, setDeductAmount] = useState('');
  const [deductReason, setDeductReason] = useState('');

  const pendingTasks = state.tasks.filter(t => t.status === 'pending');

  const handleUnlock = () => {
    if (pin === '1234') { // Simple PIN for demo
        setLocked(false);
    } else {
        alert('Incorrect PIN (Hint: 1234)');
        setPin('');
    }
  };

  const handleDeduct = () => {
    const amount = parseFloat(deductAmount);
    if (amount > 0 && deductReason) {
        if (amount > state.balance) {
            alert("Insufficient funds in child's account!");
            return;
        }
        onDeductFunds(amount, deductReason);
        setDeductAmount('');
        setDeductReason('');
        alert('Funds deducted successfully.');
    }
  };

  if (locked) {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={32} className="text-gray-500"/>
                </div>
                <h2 className="text-xl font-bold mb-2">Parent Access</h2>
                <p className="text-gray-500 text-sm mb-6">Enter PIN to manage tasks and funds.</p>
                <input 
                    type="password" 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                    className="w-full text-center text-3xl font-mono tracking-widest border-b-2 border-gray-200 py-2 mb-6 focus:border-indigo-500 outline-none"
                    placeholder="••••"
                />
                <button 
                    onClick={handleUnlock}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold"
                >
                    Unlock
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="p-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-900">Parent Control</h1>
        <button onClick={() => setLocked(true)} className="text-sm font-bold text-gray-500">Lock</button>
      </div>

      {/* Pending Tasks Section */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            Pending Approval 
            {pendingTasks.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingTasks.length}</span>}
        </h2>
        
        <div className="space-y-4">
            {pendingTasks.length === 0 ? (
                <div className="p-6 bg-white rounded-2xl border border-gray-100 text-center text-gray-400 text-sm">
                    No tasks waiting for review.
                </div>
            ) : (
                pendingTasks.map(task => (
                    <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-800">{task.title}</h3>
                                <p className="text-xs text-gray-500">{task.type === 'READING' ? `Book: ${task.bookName || 'N/A'} • ${task.duration} mins` : 'English Challenge'}</p>
                            </div>
                            <span className="font-bold text-indigo-600">+¥{task.reward}</span>
                        </div>

                        {/* Evidence Preview */}
                        <div className="mb-4 bg-gray-50 rounded-lg p-3">
                            {task.videoPreviewUrl ? (
                                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                                    <Play size={16} /> Video Proof Attached
                                </div>
                            ) : task.audioUrl ? (
                                <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                                    <Mic size={16} /> Audio Recording Attached
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
                                    <AlertCircle size={16} /> No Proof Provided
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => onRejectTask(task.id)}
                                className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-1 hover:bg-red-100 transition-colors"
                            >
                                <X size={16} /> Reject
                            </button>
                            <button 
                                onClick={() => onApproveTask(task.id)}
                                className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-1 hover:bg-green-100 transition-colors"
                            >
                                <Check size={16} /> Approve
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </section>

      {/* Manual Deduction / Store */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Cash Out / Deduct</h2>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Amount (¥)</label>
                <input 
                    type="number" 
                    value={deductAmount}
                    onChange={(e) => setDeductAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-lg font-mono"
                    placeholder="0.00"
                />
            </div>
            <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Reason / Item</label>
                <input 
                    type="text" 
                    value={deductReason}
                    onChange={(e) => setDeductReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                    placeholder="e.g. Lego Set"
                />
            </div>
            <button 
                onClick={handleDeduct}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all"
            >
                Confirm Deduction
            </button>
        </div>
      </section>
    </div>
  );
};
