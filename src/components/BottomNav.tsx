import React from 'react';
import { Car, Search, Heart, Phone, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg safe-area-pb">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        <button
          onClick={() => onTabChange('inventory')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
            activeTab === 'inventory'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <Car className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Inventory</span>
        </button>

        <button
          onClick={() => onTabChange('search')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
            activeTab === 'search'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <Search className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Search</span>
        </button>

        <button
          onClick={() => onTabChange('favorites')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
            activeTab === 'favorites'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <Heart className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Favorites</span>
        </button>

        <button
          onClick={() => onTabChange('contact')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
            activeTab === 'contact'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <Phone className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Contact</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
            activeTab === 'profile'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};