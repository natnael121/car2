import React, { useState } from 'react';
import { VehicleList } from './components/VehicleList';
import { AdminDashboard } from './components/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { List, LayoutDashboard } from 'lucide-react';

function AppContent() {
  const [activeView, setActiveView] = useState<'list' | 'admin'>('list');
  const [showAdminRoute, setShowAdminRoute] = useState(false);
  const { user } = useAuth();

  const handleAdminAccess = () => {
    setShowAdminRoute(true);
  };

  if (showAdminRoute && !user) {
    return (
      <ProtectedRoute>
        <div></div>
      </ProtectedRoute>
    );
  }

  if (user) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Car Dealership</h1>
              <p className="text-sm text-gray-600 mt-0.5">Browse our vehicle inventory</p>
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
                onClick={handleAdminAccess}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700"
              >
                <LayoutDashboard size={20} />
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <VehicleList />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
