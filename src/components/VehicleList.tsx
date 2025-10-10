import React, { useEffect, useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import { VehicleDetailModal } from './VehicleDetailModal';
import { BottomNav } from './BottomNav';
import { About } from './About';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Car, Loader } from 'lucide-react';
import FilterPanel, { VehicleFilters } from './FilterPanel';

export const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
  }, [vehicles, filters]);

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

  return (
    <>
      {activeTab === 'about' ? (
        <About />
      ) : (
        <div className="space-y-6 pb-24">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Available Cars</h2>
            <p className="text-gray-600">
              Showing {filteredVehicles.length} of {vehicles.length}{' '}
              {vehicles.length === 1 ? 'vehicle' : 'vehicles'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

            <div className="lg:col-span-3">
              {filteredVehicles.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Car size={64} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Vehicles Found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
                  <button
                    onClick={() =>
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
                      })
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </div>
      )}

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
    </>
  );
};
