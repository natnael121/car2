import React, { useEffect, useState } from 'react';
import { Vehicle } from '../types';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Car, Loader, Edit2, Trash2, Eye, EyeOff, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export const AdminInventory: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const vehiclesRef = collection(db, 'vehicles');
      const q = query(vehiclesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const vehicleData: Vehicle[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        vehicleData.push({
          id: doc.id,
          ...data,
        } as Vehicle);
      });

      setVehicles(vehicleData);
    } catch (err) {
      console.error('Error loading vehicles:', err);
      setError('Failed to load vehicles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, 'vehicles', id));
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      alert('Failed to delete vehicle. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStock = async (vehicle: Vehicle) => {
    try {
      setTogglingId(vehicle.id);
      const newStatus = !vehicle.inStock;
      await updateDoc(doc(db, 'vehicles', vehicle.id), {
        inStock: newStatus,
        updatedAt: new Date().toISOString(),
      });
      setVehicles(vehicles.map(v =>
        v.id === vehicle.id ? { ...v, inStock: newStatus } : v
      ));
    } catch (err) {
      console.error('Error toggling stock status:', err);
      alert('Failed to update stock status. Please try again.');
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader size={48} className="text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading inventory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 mb-4">{error}</p>
        <button
          onClick={loadVehicles}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const totalVehicles = vehicles.length;
  const inStockCount = vehicles.filter(v => v.inStock).length;
  const outOfStockCount = totalVehicles - inStockCount;
  const totalValue = vehicles.reduce((sum, v) => sum + v.price, 0);
  const avgDaysOnLot = totalVehicles > 0
    ? Math.round(vehicles.reduce((sum, v) => sum + (v.daysOnLot || 0), 0) / totalVehicles)
    : 0;

  if (vehicles.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <Car size={64} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Vehicles in Inventory</h3>
        <p className="text-gray-600">Add your first vehicle to start managing your inventory.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Inventory Management</h2>
        <p className="text-gray-600">Manage your vehicle inventory and track performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{totalVehicles}</p>
            </div>
            <Car className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{inStockCount}</p>
            </div>
            <Eye className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p className="text-2xl font-bold text-orange-600">{outOfStockCount}</p>
            </div>
            <EyeOff className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Days on Lot</p>
              <p className="text-2xl font-bold text-gray-900">{avgDaysOnLot}</p>
            </div>
            <Calendar className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  VIN
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Mileage
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Days on Lot
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Views
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {vehicle.imageUrl && (
                        <img
                          src={vehicle.imageUrl}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-16 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-sm text-gray-600">{vehicle.trim}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-gray-700">{vehicle.vin}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      ${vehicle.price.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">
                      {vehicle.mileage.toLocaleString()} {vehicle.mileageUnit}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStock(vehicle)}
                      disabled={togglingId === vehicle.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
                        vehicle.inStock
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } ${togglingId === vehicle.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {togglingId === vehicle.id ? (
                        <Loader size={12} className="animate-spin" />
                      ) : vehicle.inStock ? (
                        <Eye size={12} />
                      ) : (
                        <EyeOff size={12} />
                      )}
                      {vehicle.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{vehicle.daysOnLot || 0} days</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <TrendingUp size={14} className="text-gray-400" />
                      {vehicle.viewCount || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => alert('Edit functionality coming soon!')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit vehicle"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        disabled={deletingId === vehicle.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete vehicle"
                      >
                        {deletingId === vehicle.id ? (
                          <Loader size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="text-blue-600 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-blue-900 mb-1">Inventory Insights</p>
            <p className="text-sm text-blue-800">
              Total inventory value: <span className="font-semibold">${totalValue.toLocaleString()}</span>
              {' | '}
              Average vehicle price: <span className="font-semibold">${Math.round(totalValue / totalVehicles).toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
