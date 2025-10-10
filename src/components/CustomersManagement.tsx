import React, { useEffect, useState, useMemo } from 'react';
import { Users, UserPlus, Mail, Phone, Filter, Search, MessageSquare, Loader, Eye, Tag, DollarSign, Calendar, MapPin } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Customer } from '../types';
import { format } from 'date-fns';

export const CustomersManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const customersRef = collection(db, 'customers');
      const q = query(customersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const customerData: Customer[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        customerData.push({
          id: doc.id,
          ...data,
        } as Customer);
      });

      setCustomers(customerData);
    } catch (err) {
      console.error('Error loading customers:', err);
      setError('Failed to load customers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((customer) => {
        const searchableText = `${customer.firstName} ${customer.lastName} ${customer.email} ${customer.phone}`.toLowerCase();
        return searchableText.includes(search);
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((customer) => customer.status === statusFilter);
    }

    return filtered;
  }, [customers, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const newThisMonth = customers.filter(c =>
      new Date(c.createdAt) >= thisMonth
    ).length;

    const activeCustomers = customers.filter(c =>
      c.status === 'active' || c.status === 'vip'
    ).length;

    const repeatCustomers = customers.filter(c =>
      c.totalPurchases > 1
    ).length;

    return {
      totalCustomers,
      newThisMonth,
      activeCustomers,
      repeatCustomers
    };
  }, [customers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader size={48} className="text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 mb-4">{error}</p>
        <button
          onClick={loadCustomers}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage customer relationships and interactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalCustomers}</p>
            </div>
            <Users className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">New This Month</p>
              <p className="text-2xl font-bold text-green-600">{stats.newThisMonth}</p>
            </div>
            <UserPlus className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Customers</p>
              <p className="text-2xl font-bold text-orange-600">{stats.activeCustomers}</p>
            </div>
            <MessageSquare className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Repeat Customers</p>
              <p className="text-2xl font-bold text-blue-600">{stats.repeatCustomers}</p>
            </div>
            <Users className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No customers found</p>
            <p className="text-sm">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Customers will appear here when they interact with your dealership'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Purchases
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </p>
                        {customer.tags && customer.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {customer.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                <Tag size={10} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="flex items-center gap-1 text-gray-900">
                          <Mail size={14} className="text-gray-400" />
                          {customer.email}
                        </p>
                        <p className="flex items-center gap-1 text-gray-600 mt-1">
                          <Phone size={14} className="text-gray-400" />
                          {customer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {customer.city && customer.state ? (
                          <p className="flex items-center gap-1">
                            <MapPin size={14} className="text-gray-400" />
                            {customer.city}, {customer.state}
                          </p>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {customer.source.slice(0, 2).map((source, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                            {source}
                          </span>
                        ))}
                        {customer.source.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            +{customer.source.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {customer.totalPurchases}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <DollarSign size={14} className="text-gray-400" />
                        {customer.totalSpent.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {format(new Date(customer.createdAt), 'MMM d, yyyy')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCustomer.status)}`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{selectedCustomer.phone}</p>
                  </div>
                  {selectedCustomer.address && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">
                        {selectedCustomer.address}
                        {selectedCustomer.city && `, ${selectedCustomer.city}`}
                        {selectedCustomer.state && `, ${selectedCustomer.state}`}
                        {selectedCustomer.zipCode && ` ${selectedCustomer.zipCode}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase History</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Purchases</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedCustomer.totalPurchases}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">${selectedCustomer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Avg Purchase</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${selectedCustomer.totalPurchases > 0
                        ? Math.round(selectedCustomer.totalSpent / selectedCustomer.totalPurchases).toLocaleString()
                        : 0}
                    </p>
                  </div>
                </div>
                {selectedCustomer.vehiclesPurchased.length > 0 && (
                  <div className="space-y-3">
                    {selectedCustomer.vehiclesPurchased.map((purchase, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{purchase.vehicleName}</p>
                            <p className="text-sm text-gray-600">VIN: {purchase.vin}</p>
                            <p className="text-sm text-gray-600">
                              Purchased: {format(new Date(purchase.purchaseDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">${purchase.salePrice.toLocaleString()}</p>
                            {purchase.downPayment && (
                              <p className="text-sm text-gray-600">Down: ${purchase.downPayment.toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Test Drives</p>
                    <p className="text-xl font-bold text-gray-900">{selectedCustomer.testDrives.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Trade-Ins</p>
                    <p className="text-xl font-bold text-gray-900">{selectedCustomer.tradeIns.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Financing Apps</p>
                    <p className="text-xl font-bold text-gray-900">{selectedCustomer.financingApplications.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Service Appointments</p>
                    <p className="text-xl font-bold text-gray-900">{selectedCustomer.serviceAppointments.length}</p>
                  </div>
                </div>
              </div>

              {selectedCustomer.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedCustomer.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
