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

  const images = vehicle.imageUrls && vehicle.imageUrls.length > 0 ? vehicle.imageUrls : [];

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

  const rating = 4.5;

  return (
    <div
      className="bg-gray-900 rounded-2xl overflow-hidden cursor-pointer flex gap-4 p-4"
      onClick={handleCardClick}
    >
      <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
            <Car size={32} />
          </div>
        )}
        {vehicle.sold && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            SOLD
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-1 mb-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0 mt-0.5" />
            <span className="text-yellow-400 text-sm font-bold">{rating}</span>
          </div>
          <h3 className="text-white font-bold text-base mb-0.5">
            {vehicle.make}
          </h3>
          <p className="text-gray-400 text-sm">
            {vehicle.model}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-xl font-bold">
              {formatPrice(vehicle.price)}
            </div>
            <div className="text-gray-500 text-xs"></div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onViewDetails) {
                onViewDetails(vehicle.id);
              }
            }}
            className="bg-yellow-400 text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-300 transition flex-shrink-0"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      <TestDriveModal
        vehicle={vehicle}
        isOpen={showTestDriveModal}
        onClose={() => setShowTestDriveModal(false)}
      />
      <TradeInModal
        targetVehicle={vehicle}
        isOpen={showTradeInModal}
        onClose={() => setShowTradeInModal(false)}
      />
    </div>
  );
};