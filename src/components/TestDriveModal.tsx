import React, { useState } from 'react';
import { Vehicle } from '../types';
import { X, Calendar, Clock, User, Mail, Phone, Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getOrCreateCustomer, linkTestDriveToCustomer } from '../services/customerService';

interface TestDriveModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({ vehicle, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
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

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone is required';
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Date is required';
    }
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Time is required';
    }

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
          source: ['test-drive'],
          status: 'lead'
        }
      );

      const testDriveData = {
        customerId,
        ...formData,
        vehicleId: vehicle.id,
        vehicleMake: vehicle.make,
        vehicleModel: vehicle.model,
        vehicleYear: vehicle.year,
        status: 'pending',
        driversLicenseVerified: false,
        duration: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const testDriveRef = await addDoc(collection(db, 'test_drives'), testDriveData);

      await linkTestDriveToCustomer(customerId, testDriveRef.id);

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          preferredDate: '',
          preferredTime: '',
          notes: '',
        });
      }, 2000);
    } catch (error) {
      console.error('Error scheduling test drive:', error);
      setErrors({ submit: 'Failed to schedule test drive. Please try again.' });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Schedule Test Drive</h2>
            <p className="text-sm text-gray-400 mt-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
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
            <p className="text-gray-400">We'll contact you shortly to confirm your test drive.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <User size={16} className="inline mr-1 text-yellow-500" />
                Full Name
              </label>
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
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Mail size={16} className="inline mr-1 text-yellow-500" />
                Email Address
              </label>
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

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Phone size={16} className="inline mr-1 text-yellow-500" />
                Phone Number
              </label>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Calendar size={16} className="inline mr-1 text-yellow-500" />
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleChange('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white ${
                    errors.preferredDate ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.preferredDate && (
                  <p className="text-red-400 text-sm mt-1">{errors.preferredDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Clock size={16} className="inline mr-1 text-yellow-500" />
                  Preferred Time
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => handleChange('preferredTime', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-white ${
                    errors.preferredTime ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
                {errors.preferredTime && (
                  <p className="text-red-400 text-sm mt-1">{errors.preferredTime}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition resize-none text-white placeholder-gray-500"
                placeholder="Any special requests or questions..."
              />
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
                {isSubmitting ? 'Scheduling...' : 'Schedule Test Drive'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
