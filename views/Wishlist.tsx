import React from 'react';
import { AppState } from '../types';
import { Gift, Target } from 'lucide-react';

interface WishlistProps {
  state: AppState;
}

export const Wishlist: React.FC<WishlistProps> = ({ state }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-gray-900 mb-2">Wishlist</h1>
      <p className="text-gray-500 text-sm mb-6">Save up for your rewards!</p>

      <div className="space-y-6">
        {state.wishes.map(wish => {
            const progress = Math.min((state.balance / wish.price) * 100, 100);
            const remaining = Math.max(wish.price - state.balance, 0);

            return (
                <div key={wish.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg shadow-gray-100/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-pink-100 p-3 rounded-2xl text-pink-500">
                            <Gift size={24} />
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-gray-900">¥{wish.price}</span>
                            <span className="text-xs text-gray-400 font-medium uppercase">Target Price</span>
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{wish.name}</h3>
                    
                    <div className="mb-2 flex justify-between text-xs font-semibold">
                        <span className={progress >= 100 ? 'text-green-600' : 'text-indigo-600'}>
                            {progress >= 100 ? 'Goal Reached!' : `${progress.toFixed(0)}% Saved`}
                        </span>
                        {remaining > 0 && <span className="text-gray-400">¥{remaining.toFixed(2)} to go</span>}
                    </div>
                    
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {progress >= 100 && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm font-medium text-center animate-pulse">
                            Ask parents to redeem this!
                        </div>
                    )}
                </div>
            );
        })}

        {/* Add new wish placeholder */}
        <button className="w-full py-6 border-2 border-dashed border-gray-300 rounded-3xl text-gray-400 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <Target size={24} />
            <span className="font-semibold text-sm">Add New Goal</span>
        </button>
      </div>
    </div>
  );
};
