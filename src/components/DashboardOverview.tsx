import React from 'react';
import {
  Car,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  ClipboardList,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your dealership.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Car className="text-blue-600" size={24} />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <ArrowUp size={16} />
              <span>12%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">156</h3>
          <p className="text-gray-600 text-sm mt-1">Total Inventory</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <ArrowUp size={16} />
              <span>8%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">$4.2M</h3>
          <p className="text-gray-600 text-sm mt-1">Total Value</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <ArrowUp size={16} />
              <span>23%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">42</h3>
          <p className="text-gray-600 text-sm mt-1">Sales This Month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Users className="text-red-600" size={24} />
            </div>
            <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
              <ArrowDown size={16} />
              <span>5%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">28</h3>
          <p className="text-gray-600 text-sm mt-1">Active Leads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('test-drives')}
              className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-left"
            >
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">5 Test Drives Scheduled</p>
                  <p className="text-sm text-gray-600">Today & Tomorrow</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">5</span>
            </button>

            <button
              onClick={() => onNavigate('trade-ins')}
              className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition text-left"
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="text-orange-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">8 Trade-In Evaluations</p>
                  <p className="text-sm text-gray-600">Awaiting review</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-orange-600 text-white text-sm font-medium rounded-full">8</span>
            </button>

            <button
              onClick={() => onNavigate('financing')}
              className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition text-left"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="text-green-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">3 Financing Applications</p>
                  <p className="text-sm text-gray-600">Pending approval</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">3</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New lead from website</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Vehicle sold: 2023 Toyota Camry</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Test drive completed</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New vehicle added to inventory</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Performance</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chart placeholder - Inventory trends and analytics</p>
        </div>
      </div>
    </div>
  );
};
