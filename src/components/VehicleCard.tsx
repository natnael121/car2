import React, { useState } from 'react';
import { Vehicle } from '../types';
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Eye
} from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails?: (vehicleId: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = vehicle.imageUrl ? [vehicle.imageUrl] : [];

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number, unit: string): string => {
    return new Intl.NumberFormat('en-US').format(mileage) + ' ' + unit;
  };

  const getConditionColor = (condition: string): string => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'certified-pre-owned':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'used':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getConditionLabel = (condition: string): string => {
    switch (condition) {
      case 'certified-pre-owned':
        return 'Certified';
      case 'new':
        return 'New';
      case 'used':
        return 'Used';
      default:
        return condition;
    }
  };

  const getDaysOnLotColor = (days: number): string => {
    if (days <= 30) return 'text-green-600';
    if (days <= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => onViewDetails?.(vehicle.id)}
    >
      <div className="relative h-56 bg-gray-200 overflow-hidden group">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <MapPin size={48} />
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getConditionColor(vehicle.condition)}`}>
            {getConditionLabel(vehicle.condition)}
          </span>
        </div>

        {vehicle.daysOnLot > 0 && (
          <div className="absolute top-3 right-3 bg-white bg-opacity-95 px-3 py-1.5 rounded-full">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className={getDaysOnLotColor(vehicle.daysOnLot)} />
              <span className={`text-xs font-semibold ${getDaysOnLotColor(vehicle.daysOnLot)}`}>
                {vehicle.daysOnLot} days
              </span>
            </div>
          </div>
        )}

        {vehicle.viewCount > 0 && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 px-2.5 py-1 rounded-full">
            <div className="flex items-center gap-1.5">
              <Eye size={12} className="text-white" />
              <span className="text-xs font-medium text-white">
                {vehicle.viewCount}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.trim && (
            <p className="text-sm text-gray-600 font-medium">{vehicle.trim}</p>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <Gauge size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {formatMileage(vehicle.mileage, vehicle.mileageUnit)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <Settings size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {vehicle.transmission}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <Fuel size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {vehicle.fuelType.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(vehicle.price)}
          </span>
        </div>

        {vehicle.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {vehicle.description}
          </p>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>VIN: {vehicle.vin.substring(0, 8)}...</span>
            <span className="capitalize">{vehicle.bodyType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
