import React from 'react';
import { Car, Search, Heart, Phone, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAdminClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onAdminClick,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 px-4 py-3 shadow-lg safe-area-pb">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        <button
          onClick={() => onTabChange('inventory')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
            activeTab === 'inventory'
              ? 'text-yellow-400'
              : 'text-gray-400 hover:text-yellow-400'
          }`}
        >
          <Car className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </button>

        <button
          onClick={() => onTabChange('search')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
            activeTab === 'search'
              ? 'text-yellow-400'
              : 'text-gray-400 hover:text-yellow-400'
          }`}
        >
          <Search className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Search</span>
        </button>

        <button
          onClick={() => onTabChange('favorites')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
            activeTab === 'favorites'
              ? 'text-yellow-400'
              : 'text-gray-400 hover:text-yellow-400'
          }`}
        >
          <Heart className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Favorites</span>
        </button>

        <button
          onClick={() => onTabChange('contact')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
            activeTab === 'contact'
              ? 'text-yellow-400'
              : 'text-gray-400 hover:text-yellow-400'
          }`}
        >
          <Phone className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Contact</span>
        </button>

        <button
          onClick={onAdminClick}
          className="flex flex-col items-center py-2 px-3 rounded-lg transition-all text-gray-400 hover:text-yellow-400"
        >
          <Settings className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Admin</span>
        </button>
      </div>
    </div>
  );
};