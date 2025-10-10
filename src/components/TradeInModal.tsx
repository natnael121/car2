import React, { useState } from 'react';
import { Vehicle } from '../types';
import { X, Car, Calendar, Gauge, AlertCircle, Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getOrCreateCustomer, linkTradeInToCustomer } from '../services/customerService';
import { sendTradeInNotification } from '../services/telegramService';

interface TradeInModalProps {
  targetVehicle?: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export const TradeInModal: React.FC<TradeInModalProps> = ({ targetVehicle, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleMileage: '',
    vehicleCondition: '',
    exteriorColor: '',
    interiorColor: '',
    hasAccidents: false,
    accidentDetails: '',
    knownIssues: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required';
    if (!formData.vehicleMake.trim()) newErrors.vehicleMake = 'Make is required';
    if (!formData.vehicleModel.trim()) newErrors.vehicleModel = 'Model is required';
    if (!formData.vehicleYear) {
      newErrors.vehicleYear = 'Year is required';
    } else if (parseInt(formData.vehicleYear) < 1950 || parseInt(formData.vehicleYear) > new Date().getFullYear() + 1) {
      newErrors.vehicleYear = 'Invalid year';
    }
    if (!formData.vehicleMileage) {
      newErrors.vehicleMileage = 'Mileage is required';
    } else if (parseInt(formData.vehicleMileage) < 0) {
      newErrors.vehicleMileage = 'Invalid mileage';
    }
    if (!formData.vehicleCondition) newErrors.vehicleCondition = 'Condition is required';
    if (!formData.exteriorColor.trim()) newErrors.exteriorColor = 'Exterior color is required';
    if (!formData.interiorColor.trim()) newErrors.interiorColor = 'Interior color is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const nameParts = formData.customerName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const customerId = await getOrCreateCustomer(
        firstName,
        lastName,
        formData.customerEmail,
        formData.customerPhone,
        {
          source: ['trade-in'],
          status: 'lead'
        }
      );

      const tradeInData = {
        customerId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        vehicle: {
          make: formData.vehicleMake,
          model: formData.vehicleModel,
          year: parseInt(formData.vehicleYear),
          mileage: parseInt(formData.vehicleMileage),
          condition: formData.vehicleCondition,
          exteriorColor: formData.exteriorColor,
          interiorColor: formData.interiorColor,
          hasAccidents: formData.hasAccidents,
          ...(formData.accidentDetails && { accidentDetails: formData.accidentDetails }),
          ...(formData.knownIssues && { knownIssues: formData.knownIssues }),
        },
        photos: [],
        status: 'submitted',
        ...(targetVehicle && {
          applyTowardsPurchase: {
            vehicleId: targetVehicle.id,
            vehicleName: `${targetVehicle.year} ${targetVehicle.make} ${targetVehicle.model}`,
          },
        }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const tradeInRef = await addDoc(collection(db, 'trade_ins'), tradeInData);

      await linkTradeInToCustomer(customerId, tradeInRef.id);

      await sendTradeInNotification({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        vehicleYear: parseInt(formData.vehicleYear),
        vehicleMileage: parseInt(formData.vehicleMileage),
        vehicleCondition: formData.vehicleCondition,
        targetVehicle: targetVehicle
          ? {
              year: targetVehicle.year,
              make: targetVehicle.make,
              model: targetVehicle.model,
            }
          : undefined,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          vehicleMake: '',
          vehicleModel: '',
          vehicleYear: '',
          vehicleMileage: '',
          vehicleCondition: '',
          exteriorColor: '',
          interiorColor: '',
          hasAccidents: false,
          accidentDetails: '',
          knownIssues: '',
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting trade-in:', error);
      setErrors({ submit: 'Failed to submit trade-in evaluation. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setErrors({});
      setSubmitSuccess(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Request Trade-In Evaluation</h2>
            {targetVehicle && (
              <p className="text-sm text-gray-400 mt-1">
                Applying toward: {targetVehicle.year} {targetVehicle.make} {targetVehicle.model}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                <Check size={32} className="text-gray-900" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Request Submitted!</h3>
            <p className="text-gray-400">We'll evaluate your vehicle and contact you with an offer.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Your Contact Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleChange('customerName', e.target.value)}
                      className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white placeholder-gray-500 ${
                        errors.customerName ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.customerName && (
                      <p className="text-red-400 text-sm mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleChange('customerPhone', e.target.value)}
                      className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white placeholder-gray-500 ${
                        errors.customerPhone ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.customerPhone && (
                      <p className="text-red-400 text-sm mt-1">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleChange('customerEmail', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white placeholder-gray-500 ${
                      errors.customerEmail ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.customerEmail && (
                    <p className="text-red-400 text-sm mt-1">{errors.customerEmail}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                <Car size={20} className="inline mr-2 text-yellow-500" />
                Your Vehicle Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <Calendar size={14} className="inline mr-1 text-yellow-500" />
                      Year
                    </label>
                    <input
                      type="number"
                      value={formData.vehicleYear}
                      onChange={(e) => handleChange('vehicleYear', e.target.value)}
                      min="1950"
                      max={currentYear + 1}
                      className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white placeholder-gray-500 ${
                        errors.vehicleYear ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="2020"
                    />
                    {errors.vehicleYear && (
                      <p className="text-red-400 text-sm mt-1">{errors.vehicleYear}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Make</label>
                    <input
                      type="text"
                      value={formData.vehicleMake}
                      onChange={(e) => handleChange('vehicleMake', e.target.value)}
                      className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white placeholder-gray-500 ${
                        errors.vehicleMake ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Toyota"
                    />
                    {errors.vehicleMake && (
                      <p className="text-red-400 text-sm mt-1">{errors.vehicleMake}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Model</label>
                    <input
                      type="text"
                      value={formData.vehicleModel}
                      onChange={(e) => handleChange('vehicleModel', e.target.value)}
                      className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white placeholder-gray-500 ${
                        errors.vehicleModel ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Camry"
                    />
                    {errors.vehicleModel && (
                      <p className="text-red-400 text-sm mt-1">{errors.vehicleModel}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <Gauge size={14} className="inline mr-1 text-yellow-500" />
                      Mileage
                    </label>
                    <input
                      type="number"
                      value={formData.vehicleMileage}
                      onChange={(e) => handleChange('vehicleMileage', e.target.value)}
                      min="0"
                      className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white placeholder-gray-500 ${
                        errors.vehicleMileage ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="50000"
                    />
                    {errors.vehicleMileage && (
                      <p className="text-red-400 text-sm mt-1">{errors.vehicleMileage}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Condition</label>
                    <select
                      value={formData.vehicleCondition}
                      onChange={(e) => handleChange('vehicleCondition', e.target.value)}
                      className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white ${
                        errors.vehicleCondition ? 'border-red-500' : 'border-gray-600'
                      }`}
                    >
                      <option value="">Select condition</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                    {errors.vehicleCondition && (
                      <p className="text-red-400 text-sm mt-1">{errors.vehicleCondition}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Exterior Color</label>
                    <input
                      type="text"
                      value={formData.exteriorColor}
                      onChange={(e) => handleChange('exteriorColor', e.target.value)}
                      className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white placeholder-gray-500 ${
                        errors.exteriorColor ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Black"
                    />
                    {errors.exteriorColor && (
                      <p className="text-red-400 text-sm mt-1">{errors.exteriorColor}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Interior Color</label>
                    <input
                      type="text"
                      value={formData.interiorColor}
                      onChange={(e) => handleChange('interiorColor', e.target.value)}
                      className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white placeholder-gray-500 ${
                        errors.interiorColor ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Beige"
                    />
                    {errors.interiorColor && (
                      <p className="text-red-400 text-sm mt-1">{errors.interiorColor}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasAccidents}
                      onChange={(e) => handleChange('hasAccidents', e.target.checked)}
                      className="w-4 h-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-yellow-500"
                    />
                    <span className="text-sm font-semibold text-gray-300">
                      <AlertCircle size={14} className="inline mr-1 text-yellow-500" />
                      Vehicle has been in accidents
                    </span>
                  </label>
                </div>

                {formData.hasAccidents && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Accident Details</label>
                    <textarea
                      value={formData.accidentDetails}
                      onChange={(e) => handleChange('accidentDetails', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition resize-none text-white placeholder-gray-500"
                      placeholder="Please describe the accidents..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Known Issues (Optional)
                  </label>
                  <textarea
                    value={formData.knownIssues}
                    onChange={(e) => handleChange('knownIssues', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition resize-none text-white placeholder-gray-500"
                    placeholder="Describe any mechanical or cosmetic issues..."
                  />
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 border border-gray-600 rounded-lg font-semibold text-gray-300 hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-500/50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Trade-In Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
