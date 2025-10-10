import React, { useEffect, useState, useMemo } from 'react';
import { Vehicle, CustomerVehiclePurchase } from '../types';
import { VehicleCard } from './VehicleCard';
import { SoldModal, BuyerInfo } from './SoldModal';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Car, Loader, Trash2, Eye, EyeOff, TrendingUp, LayoutGrid, Table as TableIcon, Search, DollarSign, CheckCircle, Send } from 'lucide-react';
import { getOrCreateCustomer, addPurchaseToCustomer } from '../services/customerService';
import { promoteVehicleToChannel } from '../services/telegramService';

type ViewMode = 'grid' | 'table';

interface AdminInventoryProps {
  onAddVehicle?: () => void;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({ onAddVehicle }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sellingSoldId, setSellingSoldId] = useState<string | null>(null);
  const [soldModalOpen, setSoldModalOpen] = useState(false);
  const [selectedVehicleForSale, setSelectedVehicleForSale] = useState<Vehicle | null>(null);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  const filteredVehicles = useMemo(() => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return vehicles.filter((vehicle) => {
        const searchableText = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} ${vehicle.vin}`.toLowerCase();
        return searchableText.includes(search);
      });
    }
    return vehicles;
  }, [vehicles, searchTerm]);

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

  const handleToggleSold = async (vehicle: Vehicle) => {
    if (vehicle.sold) {
      if (!confirm('Mark this vehicle as not sold?')) {
        return;
      }
      try {
        setSellingSoldId(vehicle.id);
        await updateDoc(doc(db, 'vehicles', vehicle.id), {
          sold: false,
          updatedAt: new Date().toISOString(),
        });
        setVehicles(vehicles.map(v =>
          v.id === vehicle.id ? { ...v, sold: false } : v
        ));
      } catch (err) {
        console.error('Error toggling sold status:', err);
        alert('Failed to update sold status. Please try again.');
      } finally {
        setSellingSoldId(null);
      }
    } else {
      setSelectedVehicleForSale(vehicle);
      setSoldModalOpen(true);
    }
  };

  const handleCompleteSale = async (buyerInfo: BuyerInfo) => {
    if (!selectedVehicleForSale) return;

    try {
      setSellingSoldId(selectedVehicleForSale.id);

      const customerId = await getOrCreateCustomer(
        buyerInfo.firstName,
        buyerInfo.lastName,
        buyerInfo.email,
        buyerInfo.phone,
        {
          address: buyerInfo.address,
          city: buyerInfo.city,
          state: buyerInfo.state,
          zipCode: buyerInfo.zipCode,
          source: ['purchase'],
          status: 'active',
          notes: buyerInfo.notes
        }
      );

      const vehicleName = `${selectedVehicleForSale.year} ${selectedVehicleForSale.make} ${selectedVehicleForSale.model}`;
      const purchase: CustomerVehiclePurchase = {
        vehicleId: selectedVehicleForSale.id,
        vehicleName,
        vin: selectedVehicleForSale.vin,
        purchaseDate: new Date().toISOString(),
        salePrice: buyerInfo.salePrice,
        downPayment: buyerInfo.downPayment,
        financedAmount: buyerInfo.financedAmount,
        tradeinValue: buyerInfo.tradeinValue,
        notes: buyerInfo.notes
      };

      await addPurchaseToCustomer(customerId, purchase);

      await updateDoc(doc(db, 'vehicles', selectedVehicleForSale.id), {
        sold: true,
        updatedAt: new Date().toISOString(),
      });

      setVehicles(vehicles.map(v =>
        v.id === selectedVehicleForSale.id ? { ...v, sold: true } : v
      ));

      alert(`Sale completed successfully! Customer record ${customerId} created/updated.`);
    } catch (err) {
      console.error('Error completing sale:', err);
      alert('Failed to complete sale. Please try again.');
      throw err;
    } finally {
      setSellingSoldId(null);
      setSelectedVehicleForSale(null);
    }
  };

  const handlePromote = async (vehicle: Vehicle) => {
    setPromotingId(vehicle.id);
    try {
      const success = await promoteVehicleToChannel({
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        price: vehicle.price,
        mileage: vehicle.mileage,
        mileageUnit: vehicle.mileageUnit,
        condition: vehicle.condition,
        transmission: vehicle.transmission,
        fuelType: vehicle.fuelType,
        exteriorColor: vehicle.exteriorColor,
        imageUrls: vehicle.imageUrls,
        description: vehicle.description,
      });

      if (success) {
        alert('Vehicle promoted to Telegram channel successfully!');
      } else {
        alert('Failed to promote vehicle. Please configure your Telegram settings in Settings.');
      }
    } catch (error) {
      console.error('Error promoting vehicle:', error);
      alert('Error promoting vehicle. Please check your configuration in Settings.');
    } finally {
      setPromotingId(null);
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
  const soldCount = vehicles.filter(v => v.sold).length;
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
    <>
      <SoldModal
        isOpen={soldModalOpen}
        onClose={() => {
          setSoldModalOpen(false);
          setSelectedVehicleForSale(null);
        }}
        onConfirm={handleCompleteSale}
        vehicleName={selectedVehicleForSale ? `${selectedVehicleForSale.year} ${selectedVehicleForSale.make} ${selectedVehicleForSale.model}` : ''}
        vehiclePrice={selectedVehicleForSale?.price || 0}
      />
      <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Inventory Management</h2>
          <p className="text-gray-600">
            Showing {filteredVehicles.length} of {totalVehicles}{' '}
            {totalVehicles === 1 ? 'vehicle' : 'vehicles'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              title="Grid view"
            >
              <LayoutGrid size={18} className={viewMode === 'grid' ? 'text-blue-600' : 'text-gray-600'} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`}
              title="Table view"
            >
              <TableIcon size={18} className={viewMode === 'table' ? 'text-blue-600' : 'text-gray-600'} />
            </button>
          </div>
        </div>
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
              <p className="text-sm text-gray-600 mb-1">Sold</p>
              <p className="text-2xl font-bold text-orange-600">{soldCount}</p>
            </div>
            <CheckCircle className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${(totalValue / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by make, model, year, VIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          {filteredVehicles.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Car size={64} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Vehicles Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search term.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear Search
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="relative">
                  <VehicleCard
                    vehicle={vehicle}
                    onViewDetails={(id) => console.log('View details:', id)}
                  />
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button
                      onClick={() => handleToggleStock(vehicle)}
                      disabled={togglingId === vehicle.id}
                      className={`p-2 rounded-lg shadow-lg transition ${
                        vehicle.inStock
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      } ${togglingId === vehicle.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={vehicle.inStock ? 'Mark as out of stock' : 'Mark as in stock'}
                    >
                      {togglingId === vehicle.id ? (
                        <Loader size={16} className="animate-spin" />
                      ) : vehicle.inStock ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => handleToggleSold(vehicle)}
                      disabled={sellingSoldId === vehicle.id}
                      className={`p-2 rounded-lg shadow-lg transition ${
                        vehicle.sold
                          ? 'bg-orange-600 hover:bg-orange-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      } ${sellingSoldId === vehicle.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={vehicle.sold ? 'Mark as not sold' : 'Mark as sold'}
                    >
                      {sellingSoldId === vehicle.id ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => handlePromote(vehicle)}
                      disabled={promotingId === vehicle.id || vehicle.sold}
                      className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Promote to Telegram channel"
                    >
                      {promotingId === vehicle.id ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      disabled={deletingId === vehicle.id}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete vehicle"
                    >
                      {deletingId === vehicle.id ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredVehicles.map((vehicle) => (
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
                          <div className="flex gap-2">
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
                            <button
                              onClick={() => handleToggleSold(vehicle)}
                              disabled={sellingSoldId === vehicle.id}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
                                vehicle.sold
                                  ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              } ${sellingSoldId === vehicle.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {sellingSoldId === vehicle.id ? (
                                <Loader size={12} className="animate-spin" />
                              ) : (
                                <CheckCircle size={12} />
                              )}
                              {vehicle.sold ? 'Sold' : 'Available'}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{vehicle.daysOnLot || 0} days</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handlePromote(vehicle)}
                              disabled={promotingId === vehicle.id || vehicle.sold}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Promote to Telegram channel"
                            >
                              {promotingId === vehicle.id ? (
                                <Loader size={18} className="animate-spin" />
                              ) : (
                                <Send size={18} />
                              )}
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
          )}
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
              {' | '}
              Average days on lot: <span className="font-semibold">{avgDaysOnLot} days</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
