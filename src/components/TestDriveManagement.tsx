import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Car, CheckCircle, XCircle, Filter, Search, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { TestDrive, TestDriveStatus, Vehicle } from '../types';
import { TestDriveModal } from './TestDriveModal';
import { format } from 'date-fns';

export const TestDriveManagement: React.FC = () => {
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TestDriveStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const testDrivesQuery = query(collection(db, 'test_drives'), orderBy('createdAt', 'desc'));
    const vehiclesQuery = query(collection(db, 'vehicles'));

    const unsubscribeTestDrives = onSnapshot(testDrivesQuery, (snapshot) => {
      const testDrivesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TestDrive[];
      setTestDrives(testDrivesData);
      setLoading(false);
    });

    const unsubscribeVehicles = onSnapshot(vehiclesQuery, (snapshot) => {
      const vehiclesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Vehicle[];
      setVehicles(vehiclesData);
    });

    return () => {
      unsubscribeTestDrives();
      unsubscribeVehicles();
    };
  }, []);

  const handleScheduleTestDrive = () => {
    if (vehicles.length > 0) {
      setSelectedVehicle(vehicles[0]);
      setIsModalOpen(true);
    }
  };

  const handleStatusUpdate = async (testDriveId: string, newStatus: TestDriveStatus) => {
    try {
      await updateDoc(doc(db, 'test_drives', testDriveId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating test drive status:', error);
    }
  };

  const handleDelete = async (testDriveId: string) => {
    if (window.confirm('Are you sure you want to delete this test drive?')) {
      try {
        await deleteDoc(doc(db, 'test_drives', testDriveId));
      } catch (error) {
        console.error('Error deleting test drive:', error);
      }
    }
  };

  const filteredTestDrives = testDrives.filter((td) => {
    const matchesSearch =
      td.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      td.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${td.vehicleMake} ${td.vehicleModel}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || td.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    scheduled: testDrives.filter((td) => td.status === 'scheduled').length,
    today: testDrives.filter((td) => {
      const today = new Date().toISOString().split('T')[0];
      return td.preferredDate === today;
    }).length,
    completed: testDrives.filter((td) => td.status === 'completed').length,
    cancelled: testDrives.filter((td) => td.status === 'cancelled').length,
  };

  const getStatusColor = (status: TestDriveStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Drive Management</h1>
          <p className="text-gray-600 mt-1">Schedule and manage test drive appointments</p>
        </div>
        <button
          onClick={handleScheduleTestDrive}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Schedule Test Drive
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
            </div>
            <Calendar className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today</p>
              <p className="text-2xl font-bold text-orange-600">{stats.today}</p>
            </div>
            <Clock className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <XCircle className="text-red-600" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search test drives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TestDriveStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <Clock size={48} className="mx-auto mb-4 text-gray-400 animate-spin" />
            <p>Loading test drives...</p>
          </div>
        ) : filteredTestDrives.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Car size={48} className="mx-auto mb-4 text-gray-400" />
            <p>No test drives found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vehicle</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTestDrives.map((testDrive) => (
                  <tr key={testDrive.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{testDrive.customerName}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Mail size={14} /> {testDrive.customerEmail}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Phone size={14} /> {testDrive.customerPhone}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">
                        {testDrive.vehicleYear} {testDrive.vehicleMake} {testDrive.vehicleModel}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{format(new Date(testDrive.preferredDate), 'MMM dd, yyyy')}</p>
                      <p className="text-sm text-gray-600">{testDrive.preferredTime}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(testDrive.status)}`}>
                        {testDrive.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={testDrive.status}
                          onChange={(e) => handleStatusUpdate(testDrive.id, e.target.value as TestDriveStatus)}
                          className="text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                          <option value="pending">Pending</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="no-show">No Show</option>
                        </select>
                        <button
                          onClick={() => handleDelete(testDrive.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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

      {selectedVehicle && (
        <TestDriveModal
          vehicle={selectedVehicle}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVehicle(null);
          }}
        />
      )}
    </div>
  );
};
