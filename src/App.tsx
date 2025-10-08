import React, { useState } from 'react';
import { VehicleFormWizard } from './components/VehicleFormWizard';
import { VehicleList } from './components/VehicleList';
import { AdminInventory } from './components/AdminInventory';
import { Plus, List, LayoutDashboard } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState<'list' | 'add' | 'admin'>('list');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Car Dealership</h1>
              <p className="text-sm text-gray-600 mt-0.5">Manage your vehicle inventory</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeView === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List size={20} />
                Browse Cars
              </button>
              <button
                onClick={() => setActiveView('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeView === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LayoutDashboard size={20} />
                Inventory
              </button>
              <button
                onClick={() => setActiveView('add')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeView === 'add'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Plus size={20} />
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeView === 'list' && <VehicleList />}
        {activeView === 'admin' && <AdminInventory />}
        {activeView === 'add' && <VehicleFormWizard />}
      </main>
    </div>
  );
}

export default App;
