import React, { useState } from 'react';
import { Vehicle } from '../types';
import {
  X,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Droplet,
  Package,
  Shield,
  FileText,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Car,
  DollarSign,
  Share2,
  Eye,
  Users,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award
} from 'lucide-react';
import { TestDriveModal } from './TestDriveModal';
import { TradeInModal } from './TradeInModal';
import { FinancingModal } from './FinancingModal';

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicle, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [showFinancingModal, setShowFinancingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'history' | 'features'>('overview');

  const images = vehicle.imageUrl ? [vehicle.imageUrl] : [];

  if (!isOpen) return null;

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
        return 'bg-green-100 text-green-800';
      case 'certified-pre-owned':
        return 'bg-blue-100 text-blue-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionLabel = (condition: string): string => {
    switch (condition) {
      case 'certified-pre-owned':
        return 'Certified Pre-Owned';
      case 'new':
        return 'New';
      case 'used':
        return 'Used';
      default:
        return condition;
    }
  };

  const getTitleStatusColor = (status: string): string => {
    switch (status) {
      case 'clean':
        return 'text-green-600';
      case 'salvage':
      case 'flood-damage':
        return 'text-red-600';
      case 'rebuilt':
      case 'lemon':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const handlePreviousImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleShare = async () => {
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

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden group">
                  {images.length > 0 ? (
                    <>
                      <img
                        src={images[currentImageIndex]}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={handlePreviousImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                          >
                            <ChevronRight size={24} />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-3 h-3 rounded-full transition ${
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
                      <MapPin size={64} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getConditionColor(vehicle.condition)}`}>
                    {getConditionLabel(vehicle.condition)}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye size={16} />
                    <span>{vehicle.viewCount} views</span>
                  </div>
                  {vehicle.daysOnLot > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{vehicle.daysOnLot} days on lot</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {formatPrice(vehicle.price)}
                  </div>
                  {vehicle.trim && (
                    <p className="text-lg text-gray-600">{vehicle.trim}</p>
                  )}
                </div>

                {vehicle.description && (
                  <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowTestDriveModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    <Car size={20} />
                    Schedule Test Drive
                  </button>
                  <button
                    onClick={() => setShowTradeInModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    <DollarSign size={20} />
                    Trade-In Value
                  </button>
                  <button
                    onClick={() => setShowFinancingModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-semibold"
                  >
                    <FileText size={20} />
                    Get Financing
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                  >
                    <Share2 size={20} />
                    Share
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Contact Dealer</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-gray-600" />
                    <a href="tel:+15551234567" className="text-blue-600 hover:underline">
                      (555) 123-4567
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-600" />
                    <a href="mailto:info@dealership.com" className="text-blue-600 hover:underline">
                      info@dealership.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                {['overview', 'specifications', 'history', 'features'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-3 font-medium capitalize transition ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Gauge className="text-blue-600 mt-1" size={24} />
                    <div>
                      <div className="text-sm text-gray-600">Mileage</div>
                      <div className="font-semibold text-gray-900">{formatMileage(vehicle.mileage, vehicle.mileageUnit)}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Settings className="text-blue-600 mt-1" size={24} />
                    <div>
                      <div className="text-sm text-gray-600">Transmission</div>
                      <div className="font-semibold text-gray-900 capitalize">{vehicle.transmission}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Fuel className="text-blue-600 mt-1" size={24} />
                    <div>
                      <div className="text-sm text-gray-600">Fuel Type</div>
                      <div className="font-semibold text-gray-900 capitalize">{vehicle.fuelType.replace('-', ' ')}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Package className="text-blue-600 mt-1" size={24} />
                    <div>
                      <div className="text-sm text-gray-600">Body Type</div>
                      <div className="font-semibold text-gray-900 capitalize">{vehicle.bodyType}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Droplet className="text-blue-600 mt-1" size={24} />
                    <div>
                      <div className="text-sm text-gray-600">Exterior Color</div>
                      <div className="font-semibold text-gray-900">{vehicle.exteriorColor}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Droplet className="text-blue-600 mt-1" size={24} />
                    <div>
                      <div className="text-sm text-gray-600">Interior Color</div>
                      <div className="font-semibold text-gray-900">{vehicle.interiorColor}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="text-blue-600 mt-1" size={24} />
                    <div>
                      <div className="text-sm text-gray-600">Seating</div>
                      <div className="font-semibold text-gray-900">{vehicle.seatingCapacity || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="text-blue-600 mt-1" size={24} />
                    <div>
                      <div className="text-sm text-gray-600">Doors</div>
                      <div className="font-semibold text-gray-900">{vehicle.doors || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="text-blue-600 mt-1" size={24} />
                    <div>
                      <div className="text-sm text-gray-600">Drivetrain</div>
                      <div className="font-semibold text-gray-900">{vehicle.drivetrain}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Engine & Performance</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {vehicle.engineSize && (
                        <div>
                          <div className="text-sm text-gray-600">Engine Size</div>
                          <div className="font-semibold text-gray-900">{vehicle.engineSize}</div>
                        </div>
                      )}
                      {vehicle.engineType && (
                        <div>
                          <div className="text-sm text-gray-600">Engine Type</div>
                          <div className="font-semibold text-gray-900">{vehicle.engineType}</div>
                        </div>
                      )}
                      {vehicle.cylinders && (
                        <div>
                          <div className="text-sm text-gray-600">Cylinders</div>
                          <div className="font-semibold text-gray-900">{vehicle.cylinders}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-600">Drivetrain</div>
                        <div className="font-semibold text-gray-900">{vehicle.drivetrain}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Fuel Economy</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {vehicle.mpgCity && (
                        <div>
                          <div className="text-sm text-gray-600">City</div>
                          <div className="font-semibold text-gray-900">{vehicle.mpgCity} MPG</div>
                        </div>
                      )}
                      {vehicle.mpgHighway && (
                        <div>
                          <div className="text-sm text-gray-600">Highway</div>
                          <div className="font-semibold text-gray-900">{vehicle.mpgHighway} MPG</div>
                        </div>
                      )}
                      {vehicle.mpgCombined && (
                        <div>
                          <div className="text-sm text-gray-600">Combined</div>
                          <div className="font-semibold text-gray-900">{vehicle.mpgCombined} MPG</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Identification</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-gray-600">VIN</div>
                        <div className="font-mono text-sm font-semibold text-gray-900">{vehicle.vin}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="text-blue-600" size={24} />
                      Title & Ownership
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Title Status</div>
                        <div className={`font-semibold ${getTitleStatusColor(vehicle.titleStatus)} capitalize`}>
                          {vehicle.titleStatus.replace('-', ' ')}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Number of Owners</div>
                        <div className="font-semibold text-gray-900">{vehicle.numberOfOwners}</div>
                      </div>
                    </div>
                  </div>

                  {vehicle.accidentHistory && vehicle.accidentHistory.length > 0 ? (
                    <div className="bg-red-50 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-red-600" size={24} />
                        Accident History
                      </h3>
                      <div className="space-y-3">
                        {vehicle.accidentHistory.map((accident) => (
                          <div key={accident.id} className="bg-white rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {new Date(accident.date).toLocaleDateString()}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                accident.severity === 'major' ? 'bg-red-100 text-red-800' :
                                accident.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {accident.severity}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{accident.description}</p>
                            {accident.repairCost && (
                              <p className="text-sm text-gray-600 mt-1">
                                Repair Cost: {formatPrice(accident.repairCost)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle size={24} />
                        <span className="font-semibold">No accidents reported</span>
                      </div>
                    </div>
                  )}

                  {vehicle.serviceHistory && vehicle.serviceHistory.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Wrench className="text-blue-600" size={24} />
                        Service History
                      </h3>
                      <div className="space-y-3">
                        {vehicle.serviceHistory.map((service) => (
                          <div key={service.id} className="bg-white rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {new Date(service.date).toLocaleDateString()}
                              </span>
                              <span className="text-sm text-gray-600">
                                {formatMileage(service.mileage, vehicle.mileageUnit)}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{service.serviceType}</p>
                            <p className="text-sm text-gray-700">{service.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-gray-600">{service.serviceProvider}</span>
                              <span className="text-sm font-semibold text-gray-900">{formatPrice(service.cost)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {vehicle.warranty && vehicle.warranty.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="text-blue-600" size={24} />
                        Warranty Information
                      </h3>
                      <div className="space-y-3">
                        {vehicle.warranty.map((warranty, index) => (
                          <div key={index} className="bg-white rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-900 capitalize">
                                {warranty.type.replace('-', ' ')}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                warranty.transferable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {warranty.transferable ? 'Transferable' : 'Non-transferable'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{warranty.provider}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Expires:</span>
                                <span className="ml-2 font-medium">{new Date(warranty.expiryDate).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">or</span>
                                <span className="ml-2 font-medium">{formatMileage(warranty.expiryMileage, vehicle.mileageUnit)}</span>
                              </div>
                            </div>
                            {warranty.details && (
                              <p className="text-sm text-gray-600 mt-2">{warranty.details}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-4">
                  {vehicle.features && vehicle.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {vehicle.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                          <span className="text-gray-900">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600">
                      No features listed for this vehicle
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
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
      <FinancingModal
        vehicle={vehicle}
        isOpen={showFinancingModal}
        onClose={() => setShowFinancingModal(false)}
      />
    </>
  );
};
