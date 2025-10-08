import React, { useEffect, useState } from 'react';
import { Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Car, Loader } from 'lucide-react';

export const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Vehicle Inventory</h2>
        <p className="text-gray-600">
          {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} in stock
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onViewDetails={(id) => console.log('View details:', id)}
          />
        ))}
      </div>
    </div>
  );
};
