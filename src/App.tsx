import React from 'react';
import { VehicleList } from './components/VehicleList';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user } = useAuth();

  if (user) {
    return <AdminDashboard />;
  }

  return <VehicleList />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
