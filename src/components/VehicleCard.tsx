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
  Eye,
  Car,
  DollarSign,
  Share2,
  Star
} from 'lucide-react';
import { TestDriveModal } from './TestDriveModal';
import { TradeInModal } from './TradeInModal';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails?: (vehicleId: string) => void;
  onUpdate?: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onViewDetails, onUpdate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTogglingFeatured, setIsTogglingFeatured] = useState(false);

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

  const handleToggleFeatured = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTogglingFeatured(true);
    try {
      const newFeaturedStatus = !isFeatured;
      await updateDoc(doc(db, 'vehicles', vehicle.id), {
        isFeatured: newFeaturedStatus,
        updatedAt: new Date().toISOString(),
      });
      setIsFeatured(newFeaturedStatus);
      onUpdate?.();
    } catch (error) {
      console.error('Error toggling featured status:', error);
    } finally {
      setIsTogglingFeatured(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      text: `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} for ${formatPrice(vehicle.price)}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title} - ${shareData.text} ${shareData.url}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(vehicle.id);
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden hover:shadow-yellow-500/20 transition-all duration-300 cursor-pointer border border-gray-700"
      onClick={handleCardClick}
    >
      <div className="relative h-56 bg-gray-900 overflow-hidden group">
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
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-900/80 text-gray-300 border border-gray-700">
            {getConditionLabel(vehicle.condition)}
          </span>
        </div>

        {vehicle.daysOnLot > 0 && (
          <div className="absolute top-3 right-3 bg-gray-900/80 px-3 py-1.5 rounded-full border border-gray-700">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-yellow-500" />
              <span className="text-xs font-semibold text-gray-300">
                {vehicle.daysOnLot} days
              </span>
            </div>
          </div>
        )}

        {vehicle.viewCount > 0 && (
          <div className="absolute bottom-3 right-3 bg-gray-900/80 px-2.5 py-1 rounded-full border border-gray-700">
            <div className="flex items-center gap-1.5">
              <Eye size={12} className="text-yellow-500" />
              <span className="text-xs font-medium text-gray-300">
                {vehicle.viewCount}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-white mb-1">
            {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.trim && (
            <p className="text-sm text-gray-400 font-medium">{vehicle.trim}</p>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700/50 rounded-full border border-gray-600">
            <Gauge size={14} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-300">
              {formatMileage(vehicle.mileage, vehicle.mileageUnit)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700/50 rounded-full border border-gray-600">
            <Settings size={14} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-300 capitalize">
              {vehicle.transmission}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700/50 rounded-full border border-gray-600">
            <Fuel size={14} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-300 capitalize">
              {vehicle.fuelType.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">
            {formatPrice(vehicle.price)}
          </span>
          <span className="text-sm text-gray-500">/day</span>
        </div>

        {vehicle.description && (
          <p className="text-sm text-gray-400 line-clamp-2 mb-4">
            {vehicle.description}
          </p>
        )}

        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Settings size={12} />
              {vehicle.seatingCapacity || 4} Seats
            </span>
            <span className="flex items-center gap-1">
              <Gauge size={12} />
              {vehicle.engineSize || 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <Fuel size={12} />
              {vehicle.mpgCombined || '--'} L
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-full text-sm font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg hover:shadow-yellow-500/50"
          >
            Book Now
          </button>
        </div>
      </div>

      {showTestDriveModal && (
        <TestDriveModal
          vehicle={vehicle}
          isOpen={showTestDriveModal}
          onClose={() => setShowTestDriveModal(false)}
        />
      )}
      {showTradeInModal && (
        <TradeInModal
          targetVehicle={vehicle}
          isOpen={showTradeInModal}
          onClose={() => setShowTradeInModal(false)}
        />
      )}
    </div>
  );
};
