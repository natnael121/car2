import React, { useEffect, useState } from 'react';
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
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Vehicle, TestDrive, TradeIn, FinancingApplication, Customer } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

interface DashboardStats {
  totalInventory: number;
  totalValue: number;
  salesThisMonth: number;
  activeLeads: number;
  pendingTestDrives: number;
  pendingTradeIns: number;
  pendingFinancing: number;
}

interface ActivityItem {
  id: string;
  type: 'lead' | 'sale' | 'test-drive' | 'inventory';
  message: string;
  timestamp: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalInventory: 0,
    totalValue: 0,
    salesThisMonth: 0,
    activeLeads: 0,
    pendingTestDrives: 0,
    pendingTradeIns: 0,
    pendingFinancing: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const vehiclesRef = collection(db, 'vehicles');
        const vehiclesSnapshot = await getDocs(vehiclesRef);
        const vehicles = vehiclesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vehicle[];

        const availableVehicles = vehicles.filter(v => !v.sold);
        const totalInventory = availableVehicles.length;
        const totalValue = availableVehicles.reduce((sum, v) => sum + (v.price || 0), 0);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const soldVehicles = vehicles.filter(v => {
          if (!v.sold || !v.updatedAt) return false;
          const saleDate = new Date(v.updatedAt);
          return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
        });
        const salesThisMonth = soldVehicles.length;

        const customersRef = collection(db, 'customers');
        const leadsQuery = query(customersRef, where('status', '==', 'lead'));
        const leadsSnapshot = await getDocs(leadsQuery);
        const activeLeads = leadsSnapshot.size;

        const testDrivesRef = collection(db, 'test-drives');
        const pendingTestDrivesQuery = query(testDrivesRef, where('status', 'in', ['pending', 'scheduled']));
        const testDrivesSnapshot = await getDocs(pendingTestDrivesQuery);
        const pendingTestDrives = testDrivesSnapshot.size;

        const tradeInsRef = collection(db, 'trade-ins');
        const pendingTradeInsQuery = query(tradeInsRef, where('status', 'in', ['submitted', 'evaluating', 'inspected']));
        const tradeInsSnapshot = await getDocs(pendingTradeInsQuery);
        const pendingTradeIns = tradeInsSnapshot.size;

        const financingRef = collection(db, 'financing-applications');
        const pendingFinancingQuery = query(financingRef, where('status', 'in', ['submitted', 'reviewing', 'documents-requested']));
        const financingSnapshot = await getDocs(pendingFinancingQuery);
        const pendingFinancing = financingSnapshot.size;

        setStats({
          totalInventory,
          totalValue,
          salesThisMonth,
          activeLeads,
          pendingTestDrives,
          pendingTradeIns,
          pendingFinancing,
        });

        const activities: ActivityItem[] = [];

        const recentLeadsQuery = query(customersRef, orderBy('createdAt', 'desc'), limit(2));
        const recentLeadsSnapshot = await getDocs(recentLeadsQuery);
        recentLeadsSnapshot.docs.forEach(doc => {
          const customer = doc.data() as Customer;
          activities.push({
            id: doc.id,
            type: 'lead',
            message: `New lead: ${customer.firstName} ${customer.lastName}`,
            timestamp: customer.createdAt,
          });
        });

        const recentSoldVehicles = soldVehicles
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 2);
        recentSoldVehicles.forEach(vehicle => {
          activities.push({
            id: vehicle.id,
            type: 'sale',
            message: `Vehicle sold: ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            timestamp: vehicle.updatedAt,
          });
        });

        const completedTestDrivesQuery = query(testDrivesRef, where('status', '==', 'completed'), orderBy('updatedAt', 'desc'), limit(2));
        const completedTestDrivesSnapshot = await getDocs(completedTestDrivesQuery);
        completedTestDrivesSnapshot.docs.forEach(doc => {
          const testDrive = doc.data() as TestDrive;
          activities.push({
            id: doc.id,
            type: 'test-drive',
            message: `Test drive completed: ${testDrive.vehicleYear} ${testDrive.vehicleMake} ${testDrive.vehicleModel}`,
            timestamp: testDrive.updatedAt,
          });
        });

        const recentVehicles = vehicles
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 2);
        recentVehicles.forEach(vehicle => {
          activities.push({
            id: vehicle.id,
            type: 'inventory',
            message: `New vehicle added: ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            timestamp: vehicle.createdAt,
          });
        });

        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentActivity(activities.slice(0, 4));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'lead':
        return 'bg-blue-600';
      case 'sale':
        return 'bg-green-600';
      case 'test-drive':
        return 'bg-orange-600';
      case 'inventory':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

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
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalInventory}</h3>
          <p className="text-gray-600 text-sm mt-1">Total Inventory</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</h3>
          <p className="text-gray-600 text-sm mt-1">Total Value</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.salesThisMonth}</h3>
          <p className="text-gray-600 text-sm mt-1">Sales This Month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Users className="text-red-600" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.activeLeads}</h3>
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
                  <p className="font-medium text-gray-900">{stats.pendingTestDrives} Test Drives Scheduled</p>
                  <p className="text-sm text-gray-600">Pending & scheduled</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">{stats.pendingTestDrives}</span>
            </button>

            <button
              onClick={() => onNavigate('trade-ins')}
              className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition text-left"
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="text-orange-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">{stats.pendingTradeIns} Trade-In Evaluations</p>
                  <p className="text-sm text-gray-600">Awaiting review</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-orange-600 text-white text-sm font-medium rounded-full">{stats.pendingTradeIns}</span>
            </button>

            <button
              onClick={() => onNavigate('financing')}
              className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition text-left"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="text-green-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">{stats.pendingFinancing} Financing Applications</p>
                  <p className="text-sm text-gray-600">Pending approval</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">{stats.pendingFinancing}</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
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
