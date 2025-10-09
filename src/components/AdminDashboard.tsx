import React, { useState } from 'react';
import {
  LayoutDashboard,
  Car,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  ClipboardList,
  Wrench,
  TrendingUp,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { AdminInventory } from './AdminInventory';
import { VehicleFormWizard } from './VehicleFormWizard';
import { DashboardOverview } from './DashboardOverview';
import { LeadsManagement } from './LeadsManagement';
import { TestDriveManagement } from './TestDriveManagement';
import { TradeInManagement } from './TradeInManagement';
import { FinancingManagement } from './FinancingManagement';
import { ServiceManagement } from './ServiceManagement';
import { SalesManagement } from './SalesManagement';
import { CustomersManagement } from './CustomersManagement';
import { ReportsAnalytics } from './ReportsAnalytics';

type AdminTab =
  | 'overview'
  | 'inventory'
  | 'add-vehicle'
  | 'leads'
  | 'test-drives'
  | 'trade-ins'
  | 'financing'
  | 'service'
  | 'sales'
  | 'customers'
  | 'reports'
  | 'settings';

interface MenuItem {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const menuItems: MenuItem[] = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'inventory', label: 'Inventory', icon: <Car size={20} /> },
    { id: 'leads', label: 'Leads', icon: <Users size={20} />, badge: 12 },
    { id: 'test-drives', label: 'Test Drives', icon: <Calendar size={20} />, badge: 5 },
    { id: 'trade-ins', label: 'Trade-Ins', icon: <ClipboardList size={20} />, badge: 8 },
    { id: 'financing', label: 'Financing', icon: <DollarSign size={20} />, badge: 3 },
    { id: 'service', label: 'Service', icon: <Wrench size={20} /> },
    { id: 'sales', label: 'Sales', icon: <TrendingUp size={20} /> },
    { id: 'customers', label: 'Customers', icon: <MessageSquare size={20} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    console.log('Logout');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview onNavigate={setActiveTab} />;
      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600 mt-1">Manage your vehicle inventory</p>
              </div>
              <button
                onClick={() => setActiveTab('add-vehicle')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Add Vehicle
              </button>
            </div>
            <AdminInventory onAddVehicle={() => setActiveTab('add-vehicle')} />
          </div>
        );
      case 'add-vehicle':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setActiveTab('inventory')}
                className="text-blue-600 hover:text-blue-700 font-medium mb-4"
              >
                ← Back to Inventory
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
              <p className="text-gray-600 mt-1">Fill in the vehicle details</p>
            </div>
            <VehicleFormWizard onSuccess={() => setActiveTab('inventory')} />
          </div>
        );
      case 'leads':
        return <LeadsManagement />;
      case 'test-drives':
        return <TestDriveManagement />;
      case 'trade-ins':
        return <TradeInManagement />;
      case 'financing':
        return <FinancingManagement />;
      case 'service':
        return <ServiceManagement />;
      case 'sales':
        return <SalesManagement />;
      case 'customers':
        return <CustomersManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings management coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Auto Dealership</h2>
          <p className="text-sm text-gray-600 mt-1">Admin Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
