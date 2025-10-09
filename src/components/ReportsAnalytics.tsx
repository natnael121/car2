import React from 'react';
import { FileText, Download, TrendingUp, BarChart3, PieChart, LineChart } from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View insights and generate reports</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition text-left">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">Sales Report</h3>
          </div>
          <p className="text-sm text-gray-600">Comprehensive sales analysis and trends</p>
        </button>

        <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition text-left">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">Inventory Report</h3>
          </div>
          <p className="text-sm text-gray-600">Stock levels and turnover analysis</p>
        </button>

        <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition text-left">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <PieChart className="text-orange-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">Customer Report</h3>
          </div>
          <p className="text-sm text-gray-600">Customer demographics and behavior</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <LineChart size={48} className="text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option>This month</option>
              <option>Last month</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <PieChart size={48} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold text-blue-600">24.5%</p>
            <p className="text-xs text-green-600 mt-1">+2.3% from last month</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Avg. Time to Sale</p>
            <p className="text-2xl font-bold text-green-600">12 days</p>
            <p className="text-xs text-green-600 mt-1">-1 day from last month</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Customer Satisfaction</p>
            <p className="text-2xl font-bold text-orange-600">4.8/5</p>
            <p className="text-xs text-green-600 mt-1">+0.2 from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};
