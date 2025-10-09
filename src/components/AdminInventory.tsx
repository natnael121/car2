import React, { useEffect, useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Car, Loader, Trash2, Eye, EyeOff, TrendingUp, LayoutGrid, Table as TableIcon, Search, Filter, DollarSign } from 'lucide-react';
import FilterPanel, { VehicleFilters } from './FilterPanel';

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
  const [showFilters, setShowFilters] = useState(true);

  const priceRange: [number, number] = useMemo(() => {
    if (vehicles.length === 0) return [0, 100000];
    const prices = vehicles.map((v) => v.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [vehicles]);

  const yearRange: [number, number] = useMemo(() => {
    if (vehicles.length === 0) return [new Date().getFullYear() - 20, new Date().getFullYear()];
    const years = vehicles.map((v) => v.year);
    return [Math.min(...years), Math.max(...years)];
  }, [vehicles]);

  const mileageRange: [number, number] = useMemo(() => {
    if (vehicles.length === 0) return [0, 200000];
    const mileages = vehicles.map((v) => v.mileage);
    return [Math.min(...mileages), Math.max(...mileages)];
  }, [vehicles]);

  const [filters, setFilters] = useState<VehicleFilters>({
    priceRange,
    makes: [],
    models: [],
    yearRange,
    mileageRange,
    bodyTypes: [],
    transmissions: [],
    fuelTypes: [],
    colors: [],
    conditions: [],
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange,
      yearRange,
      mileageRange,
    }));
  }, [priceRange, yearRange, mileageRange]);

  const availableOptions = useMemo(() => {
    const makes = Array.from(new Set(vehicles.map((v) => v.make))).sort();
    const models = Array.from(new Set(vehicles.map((v) => v.model))).sort();
    const bodyTypes = Array.from(new Set(vehicles.map((v) => v.bodyType))).sort();
    const transmissions = Array.from(new Set(vehicles.map((v) => v.transmission))).sort();
    const fuelTypes = Array.from(new Set(vehicles.map((v) => v.fuelType))).sort();
    const colors = Array.from(
      new Set([
        ...vehicles.map((v) => v.exteriorColor),
        ...vehicles.map((v) => v.interiorColor),
      ])
    ).sort();
    const conditions = Array.from(new Set(vehicles.map((v) => v.condition))).sort();

    return {
      makes,
      models,
      bodyTypes,
      transmissions,
      fuelTypes,
      colors,
      conditions,
    };
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles.filter((vehicle) => {
      if (vehicle.price < filters.priceRange[0] || vehicle.price > filters.priceRange[1]) {
        return false;
      }
      if (vehicle.year < filters.yearRange[0] || vehicle.year > filters.yearRange[1]) {
        return false;
      }
      if (vehicle.mileage < filters.mileageRange[0] || vehicle.mileage > filters.mileageRange[1]) {
        return false;
      }
      if (filters.makes.length > 0 && !filters.makes.includes(vehicle.make)) {
        return false;
      }
      if (filters.models.length > 0 && !filters.models.includes(vehicle.model)) {
        return false;
      }
      if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(vehicle.bodyType)) {
        return false;
      }
      if (filters.transmissions.length > 0 && !filters.transmissions.includes(vehicle.transmission)) {
        return false;
      }
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(vehicle.fuelType)) {
        return false;
      }
      if (
        filters.colors.length > 0 &&
        !filters.colors.includes(vehicle.exteriorColor) &&
        !filters.colors.includes(vehicle.interiorColor)
      ) {
        return false;
      }
      if (filters.conditions.length > 0 && !filters.conditions.includes(vehicle.condition)) {
        return false;
      }
      return true;
    });

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((vehicle) => {
        const searchableText = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} ${vehicle.vin}`.toLowerCase();
        return searchableText.includes(search);
      });
    }

    return filtered;
  }, [vehicles, filters, searchTerm]);

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Inventory Management</h2>
          <p className="text-gray-600">
            Showing {filteredVehicles.length} of {totalVehicles}{' '}
            {totalVehicles === 1 ? 'vehicle' : 'vehicles'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter size={18} />
            Filters
          </button>
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
              <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p className="text-2xl font-bold text-orange-600">{outOfStockCount}</p>
            </div>
            <EyeOff className="text-orange-600" size={32} />
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

      <div className={`grid ${showFilters ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        {showFilters && (
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              availableOptions={availableOptions}
              priceRange={priceRange}
              yearRange={yearRange}
              mileageRange={mileageRange}
            />
          </div>
        )}

        <div className={showFilters ? 'lg:col-span-3' : 'col-span-1'}>
          {filteredVehicles.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Car size={64} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Vehicles Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search term.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    priceRange,
                    makes: [],
                    models: [],
                    yearRange,
                    mileageRange,
                    bodyTypes: [],
                    transmissions: [],
                    fuelTypes: [],
                    colors: [],
                    conditions: [],
                  });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear All Filters
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
                          <div className="flex items-center justify-end gap-2">
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
  );
};
