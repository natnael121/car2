import React, { useState } from 'react';
import { Vehicle } from '../types';
import { X, Car, Calendar, Gauge, AlertCircle, Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

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
      const tradeInData = {
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
          accidentDetails: formData.accidentDetails || undefined,
          knownIssues: formData.knownIssues || undefined,
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

      await addDoc(collection(db, 'trade_ins'), tradeInData);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Request Trade-In Evaluation</h2>
            {targetVehicle && (
              <p className="text-sm text-gray-600 mt-1">
                Applying toward: {targetVehicle.year} {targetVehicle.make} {targetVehicle.model}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Check size={32} className="text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-gray-600">We'll evaluate your vehicle and contact you with an offer.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Contact Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleChange('customerName', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.customerName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.customerName && (
                      <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleChange('customerPhone', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.customerPhone && (
                      <p className="text-red-600 text-sm mt-1">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleChange('customerEmail', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.customerEmail && (
                    <p className="text-red-600 text-sm mt-1">{errors.customerEmail}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Car size={20} className="inline mr-2" />
                Your Vehicle Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar size={14} className="inline mr-1" />
                      Year
                    </label>
                    <input
                      type="number"
                      value={formData.vehicleYear}
                      onChange={(e) => handleChange('vehicleYear', e.target.value)}
                      min="1950"
                      max={currentYear + 1}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.vehicleYear ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="2020"
                    />
                    {errors.vehicleYear && (
                      <p className="text-red-600 text-sm mt-1">{errors.vehicleYear}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Make</label>
                    <input
                      type="text"
                      value={formData.vehicleMake}
                      onChange={(e) => handleChange('vehicleMake', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.vehicleMake ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Toyota"
                    />
                    {errors.vehicleMake && (
                      <p className="text-red-600 text-sm mt-1">{errors.vehicleMake}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={formData.vehicleModel}
                      onChange={(e) => handleChange('vehicleModel', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.vehicleModel ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Camry"
                    />
                    {errors.vehicleModel && (
                      <p className="text-red-600 text-sm mt-1">{errors.vehicleModel}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Gauge size={14} className="inline mr-1" />
                      Mileage
                    </label>
                    <input
                      type="number"
                      value={formData.vehicleMileage}
                      onChange={(e) => handleChange('vehicleMileage', e.target.value)}
                      min="0"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.vehicleMileage ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="50000"
                    />
                    {errors.vehicleMileage && (
                      <p className="text-red-600 text-sm mt-1">{errors.vehicleMileage}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                    <select
                      value={formData.vehicleCondition}
                      onChange={(e) => handleChange('vehicleCondition', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.vehicleCondition ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select condition</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                    {errors.vehicleCondition && (
                      <p className="text-red-600 text-sm mt-1">{errors.vehicleCondition}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Exterior Color</label>
                    <input
                      type="text"
                      value={formData.exteriorColor}
                      onChange={(e) => handleChange('exteriorColor', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.exteriorColor ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Black"
                    />
                    {errors.exteriorColor && (
                      <p className="text-red-600 text-sm mt-1">{errors.exteriorColor}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Interior Color</label>
                    <input
                      type="text"
                      value={formData.interiorColor}
                      onChange={(e) => handleChange('interiorColor', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.interiorColor ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Beige"
                    />
                    {errors.interiorColor && (
                      <p className="text-red-600 text-sm mt-1">{errors.interiorColor}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasAccidents}
                      onChange={(e) => handleChange('hasAccidents', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      <AlertCircle size={14} className="inline mr-1" />
                      Vehicle has been in accidents
                    </span>
                  </label>
                </div>

                {formData.hasAccidents && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Accident Details</label>
                    <textarea
                      value={formData.accidentDetails}
                      onChange={(e) => handleChange('accidentDetails', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      placeholder="Please describe the accidents..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Known Issues (Optional)
                  </label>
                  <textarea
                    value={formData.knownIssues}
                    onChange={(e) => handleChange('knownIssues', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    placeholder="Describe any mechanical or cosmetic issues..."
                  />
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
