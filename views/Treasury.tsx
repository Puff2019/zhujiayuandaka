import React from 'react';
import { AppState } from '../types';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface TreasuryProps {
  state: AppState;
}

export const Treasury: React.FC<TreasuryProps> = ({ state }) => {
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-black text-gray-900 mb-6">The Treasury</h1>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-200 mb-8 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-indigo-400 opacity-20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col items-center">
            <span className="text-indigo-200 text-sm font-medium mb-1 tracking-wide">Current Balance</span>
            <div className="text-5xl font-black mb-2 tracking-tighter">
                <span className="text-2xl align-top opacity-70 mr-1">¥</span>
                {state.balance.toFixed(2)}
            </div>
            <div className="mt-4 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold flex items-center gap-2">
                <Wallet size={12} />
                Lifetime Earnings: ¥{state.totalEarnings.toFixed(2)}
            </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">History</h3>
        <div className="space-y-6">
            {state.transactions.slice().reverse().map(t => (
                <div key={t.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                            {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">{t.description}</p>
                            <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <span className={`font-mono font-bold ${t.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                        {t.type === 'income' ? '+' : '-'} {Math.abs(t.amount).toFixed(2)}
                    </span>
                </div>
            ))}
            
            {state.transactions.length === 0 && (
                <div className="text-center text-gray-400 py-4 text-sm">No transactions yet.</div>
            )}
        </div>
      </div>
    </div>
  );
};
