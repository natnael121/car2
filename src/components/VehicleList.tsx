import React, { useEffect, useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import { VehicleDetailModal } from './VehicleDetailModal';
import { BottomNav } from './BottomNav';
import { About } from './About';
import { AdminLogin } from './AdminLogin';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Car, Loader, Search, X } from 'lucide-react';
import FilterPanel, { VehicleFilters } from './FilterPanel';

export const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

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
    return vehicles.filter((vehicle) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          vehicle.make.toLowerCase().includes(query) ||
          vehicle.model.toLowerCase().includes(query) ||
          vehicle.year.toString().includes(query);
        if (!matchesSearch) return false;
      }

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
  }, [vehicles, filters, searchQuery]);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader size={48} className="text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading vehicles...</p>
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

  if (vehicles.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <Car size={64} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Vehicles Yet</h3>
        <p className="text-gray-600">Add your first vehicle to get started!</p>
      </div>
    );
  }

  const categories = ['Popular', 'Runs', 'Tributo'];

  return (
    <>
      {activeTab === 'about' ? (
        <About />
      ) : (
        <div className="min-h-screen bg-black space-y-4 pb-24">
          <div className="px-4 pt-6 space-y-4">
            <div className="flex items-center gap-2">
              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex items-center gap-2 w-full bg-gray-900 text-gray-400 px-4 py-3 rounded-xl"
                >
                  <Search size={20} />
                  <span>Type here to search</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full bg-gray-900 px-4 py-3 rounded-xl">
                  <Search size={20} className="text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type here to search"
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-gray-400">
                      <X size={20} />
                    </button>
                  )}
                  <button onClick={() => setShowSearch(false)} className="text-gray-400">
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                    selectedCategory === category
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-900 text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Popular</h2>
              <button className="text-yellow-400 text-sm font-medium">See All</button>
            </div>

            {filteredVehicles.length === 0 ? (
              <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center">
                <Car size={64} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Vehicles Found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your search.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onViewDetails={(id) => {
                      const vehicle = vehicles.find(v => v.id === id);
                      if (vehicle) {
                        setSelectedVehicle(vehicle);
                        setShowDetailModal(true);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {showFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
              <div className="bg-white w-full max-h-[80vh] rounded-t-3xl overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="p-4">
                  <FilterPanel
                    filters={filters}
                    onChange={setFilters}
                    availableOptions={availableOptions}
                    priceRange={priceRange}
                    yearRange={yearRange}
                    mileageRange={mileageRange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAdminClick={() => setShowAdminLogin(true)}
      />

      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedVehicle(null);
          }}
        />
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <AdminLogin onClose={() => setShowAdminLogin(false)} />
          </div>
        </div>
      )}
    </>
  );
};
