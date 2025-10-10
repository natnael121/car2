import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Award, Filter, Search, BarChart3, Calendar } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Customer, CustomerVehiclePurchase } from '../types';
import { format } from 'date-fns';

interface SaleRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  vehicleName: string;
  vin: string;
  saleAmount: number;
  purchaseDate: string;
}

export const SalesManagement: React.FC = () => {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const customersRef = collection(db, 'customers');
      const q = query(customersRef, where('source', 'array-contains', 'purchase'));
      const querySnapshot = await getDocs(q);

      const salesRecords: SaleRecord[] = [];

      querySnapshot.forEach((doc) => {
        const customer = { id: doc.id, ...doc.data() } as Customer;

        customer.vehiclesPurchased.forEach((purchase: CustomerVehiclePurchase) => {
          salesRecords.push({
            id: `${customer.id}-${purchase.vehicleId}`,
            customerName: `${customer.firstName} ${customer.lastName}`,
            customerEmail: customer.email,
            vehicleName: purchase.vehicleName,
            vin: purchase.vin,
            saleAmount: purchase.salePrice,
            purchaseDate: purchase.purchaseDate
          });
        });
      });

      salesRecords.sort((a, b) =>
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
      );

      setSales(salesRecords);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThisMonthSales = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return sales.filter(sale => {
      const saleDate = new Date(sale.purchaseDate);
      return saleDate.getMonth() === thisMonth && saleDate.getFullYear() === thisYear;
    });
  };

  const calculateTotalRevenue = () => {
    return sales.reduce((total, sale) => total + sale.saleAmount, 0);
  };

  const calculateAvgDealSize = () => {
    if (sales.length === 0) return 0;
    return calculateTotalRevenue() / sales.length;
  };

  const filteredSales = sales.filter(sale =>
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.vin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const thisMonthSales = getThisMonthSales();
  const totalRevenue = calculateTotalRevenue();
  const avgDealSize = calculateAvgDealSize();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600 mt-1">Track sales performance and deals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className="text-2xl font-bold text-blue-600">{thisMonthSales.length}</p>
            </div>
            <TrendingUp className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${(totalRevenue / 1000).toFixed(1)}K
              </p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Deal Size</p>
              <p className="text-2xl font-bold text-orange-600">
                ${(avgDealSize / 1000).toFixed(1)}K
              </p>
            </div>
            <BarChart3 className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-2xl font-bold text-blue-600">{sales.length}</p>
            </div>
            <Award className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <p>Loading sales data...</p>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
            <p>No sales records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">VIN</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sale Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{sale.customerName}</p>
                        <p className="text-sm text-gray-600">{sale.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{sale.vehicleName}</td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-sm">{sale.vin}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-600">
                        ${sale.saleAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span>{format(new Date(sale.purchaseDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
