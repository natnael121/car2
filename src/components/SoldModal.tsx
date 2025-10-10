import React, { useState } from 'react';
import { X, Loader, User, DollarSign } from 'lucide-react';
import { FormInput } from './FormInput';

interface SoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (buyerInfo: BuyerInfo) => Promise<void>;
  vehicleName: string;
  vehiclePrice: number;
}

export interface BuyerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  salePrice: number;
  downPayment?: number;
  financedAmount?: number;
  tradeinValue?: number;
  notes?: string;
}

export const SoldModal: React.FC<SoldModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  vehicleName,
  vehiclePrice
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BuyerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    salePrice: vehiclePrice,
    downPayment: 0,
    financedAmount: 0,
    tradeinValue: 0,
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BuyerInfo, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BuyerInfo, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    if (!formData.salePrice || formData.salePrice <= 0) {
      newErrors.salePrice = 'Sale price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(formData);
      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        salePrice: vehiclePrice,
        downPayment: 0,
        financedAmount: 0,
        tradeinValue: 0,
        notes: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting buyer info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BuyerInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTextAreaChange = (field: keyof BuyerInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Record Vehicle Sale</h2>
            <p className="text-sm text-gray-600 mt-1">{vehicleName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <User size={18} />
              Buyer Information
            </h3>
            <p className="text-sm text-blue-800">
              Enter the buyer's details to complete the sale and create a customer record.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              error={errors.firstName}
              placeholder="John"
              required
            />
            <FormInput
              label="Last Name"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              error={errors.lastName}
              placeholder="Doe"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              placeholder="john.doe@example.com"
              required
            />
            <FormInput
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              error={errors.phone}
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div className="space-y-4">
            <FormInput
              label="Address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange('address')}
              error={errors.address}
              placeholder="123 Main St"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="City"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange('city')}
                error={errors.city}
                placeholder="New York"
                required
              />
              <FormInput
                label="State"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleInputChange('state')}
                error={errors.state}
                placeholder="NY"
                required
              />
              <FormInput
                label="ZIP Code"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={handleInputChange('zipCode')}
                error={errors.zipCode}
                placeholder="10001"
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={18} />
              Sale Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Sale Price"
                name="salePrice"
                type="number"
                value={formData.salePrice}
                onChange={handleInputChange('salePrice')}
                error={errors.salePrice}
                placeholder="25000"
                required
              />
              <FormInput
                label="Down Payment"
                name="downPayment"
                type="number"
                value={formData.downPayment || 0}
                onChange={handleInputChange('downPayment')}
                placeholder="5000"
              />
              <FormInput
                label="Financed Amount"
                name="financedAmount"
                type="number"
                value={formData.financedAmount || 0}
                onChange={handleInputChange('financedAmount')}
                placeholder="20000"
              />
              <FormInput
                label="Trade-in Value"
                name="tradeinValue"
                type="number"
                value={formData.tradeinValue || 0}
                onChange={handleInputChange('tradeinValue')}
                placeholder="3000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleTextAreaChange('notes', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes about the sale..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                'Complete Sale'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
