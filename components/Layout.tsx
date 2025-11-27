import React from 'react';
import { Home, Wallet, Gift, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
      <div className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {children}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center max-w-md mx-auto h-16">
          <NavButton 
            active={activeTab === 'tasks'} 
            onClick={() => onTabChange('tasks')} 
            icon={<Home size={24} />} 
            label="Tasks" 
          />
          <NavButton 
            active={activeTab === 'treasury'} 
            onClick={() => onTabChange('treasury')} 
            icon={<Wallet size={24} />} 
            label="Treasury" 
          />
          <NavButton 
            active={activeTab === 'wishlist'} 
            onClick={() => onTabChange('wishlist')} 
            icon={<Gift size={24} />} 
            label="Wishes" 
          />
          <NavButton 
            active={activeTab === 'parent'} 
            onClick={() => onTabChange('parent')} 
            icon={<Settings size={24} />} 
            label="Admin" 
          />
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center w-16 transition-all duration-300 ${active ? 'text-indigo-600 -translate-y-1' : 'text-gray-400'}`}
  >
    <div className={`p-1 rounded-full ${active ? 'bg-indigo-50' : 'bg-transparent'}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium mt-1">{label}</span>
  </button>
);
