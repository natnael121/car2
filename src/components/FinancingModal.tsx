import React, { useState } from 'react';
import { Vehicle } from '../types';
import { X, DollarSign, User, Mail, Phone, MapPin, Briefcase, Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface FinancingModalProps {
  vehicle?: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export const FinancingModal: React.FC<FinancingModalProps> = ({ vehicle, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    creditScoreRange: '',
    downPayment: '',
    loanTermPreference: '',
    monthlyBudget: '',
    employerName: '',
    jobTitle: '',
    employmentType: '',
    yearsEmployed: '',
    monthlyIncome: '',
    employerPhone: '',
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

    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.creditScoreRange) newErrors.creditScoreRange = 'Credit score range is required';
    if (!formData.downPayment) {
      newErrors.downPayment = 'Down payment is required';
    } else if (parseFloat(formData.downPayment) < 0) {
      newErrors.downPayment = 'Invalid down payment';
    }
    if (!formData.loanTermPreference) newErrors.loanTermPreference = 'Loan term is required';
    if (!formData.employerName.trim()) newErrors.employerName = 'Employer name is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.employmentType) newErrors.employmentType = 'Employment type is required';
    if (!formData.yearsEmployed) {
      newErrors.yearsEmployed = 'Years employed is required';
    } else if (parseFloat(formData.yearsEmployed) < 0) {
      newErrors.yearsEmployed = 'Invalid years employed';
    }
    if (!formData.monthlyIncome) {
      newErrors.monthlyIncome = 'Monthly income is required';
    } else if (parseFloat(formData.monthlyIncome) < 0) {
      newErrors.monthlyIncome = 'Invalid monthly income';
    }
    if (!formData.employerPhone.trim()) newErrors.employerPhone = 'Employer phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const financingData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        creditScoreRange: formData.creditScoreRange,
        downPayment: parseFloat(formData.downPayment),
        loanTermPreference: parseInt(formData.loanTermPreference),
        monthlyBudget: formData.monthlyBudget ? parseFloat(formData.monthlyBudget) : undefined,
        applicantEmployment: {
          employer: formData.employerName,
          jobTitle: formData.jobTitle,
          employmentType: formData.employmentType,
          yearsEmployed: parseFloat(formData.yearsEmployed),
          monthlyIncome: parseFloat(formData.monthlyIncome),
          phoneNumber: formData.employerPhone,
        },
        ...(vehicle && {
          vehicleId: vehicle.id,
          vehiclePrice: vehicle.price,
        }),
        documents: [],
        status: 'submitted',
        preApprovalStatus: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'financing_applications'), financingData);

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          dateOfBirth: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          creditScoreRange: '',
          downPayment: '',
          loanTermPreference: '',
          monthlyBudget: '',
          employerName: '',
          jobTitle: '',
          employmentType: '',
          yearsEmployed: '',
          monthlyIncome: '',
          employerPhone: '',
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting financing application:', error);
      setErrors({ submit: 'Failed to submit financing application. Please try again.' });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Apply for Financing</h2>
            {vehicle && (
              <p className="text-sm text-gray-600 mt-1">
                {vehicle.year} {vehicle.make} {vehicle.model} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(vehicle.price)}
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-600">We'll review your application and contact you shortly with financing options.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <User size={20} className="inline mr-2" />
                Personal Information
              </h3>
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
                    {errors.customerName && <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail size={14} className="inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleChange('customerEmail', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.customerEmail && <p className="text-red-600 text-sm mt-1">{errors.customerEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone size={14} className="inline mr-1" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleChange('customerPhone', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.customerPhone && <p className="text-red-600 text-sm mt-1">{errors.customerPhone}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <MapPin size={20} className="inline mr-2" />
                Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123 Main St"
                  />
                  {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="New York"
                    />
                    {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="NY"
                    />
                    {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleChange('zipCode', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="10001"
                    />
                    {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <DollarSign size={20} className="inline mr-2" />
                Financing Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Credit Score Range</label>
                    <select
                      value={formData.creditScoreRange}
                      onChange={(e) => handleChange('creditScoreRange', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.creditScoreRange ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select range</option>
                      <option value="excellent">Excellent (720+)</option>
                      <option value="good">Good (680-719)</option>
                      <option value="fair">Fair (640-679)</option>
                      <option value="poor">Poor (Below 640)</option>
                      <option value="unknown">Unknown</option>
                    </select>
                    {errors.creditScoreRange && <p className="text-red-600 text-sm mt-1">{errors.creditScoreRange}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Down Payment</label>
                    <input
                      type="number"
                      value={formData.downPayment}
                      onChange={(e) => handleChange('downPayment', e.target.value)}
                      min="0"
                      step="100"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.downPayment ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="5000"
                    />
                    {errors.downPayment && <p className="text-red-600 text-sm mt-1">{errors.downPayment}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Term (months)</label>
                    <select
                      value={formData.loanTermPreference}
                      onChange={(e) => handleChange('loanTermPreference', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.loanTermPreference ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select term</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                      <option value="48">48 months</option>
                      <option value="60">60 months</option>
                      <option value="72">72 months</option>
                      <option value="84">84 months</option>
                    </select>
                    {errors.loanTermPreference && <p className="text-red-600 text-sm mt-1">{errors.loanTermPreference}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Budget (Optional)</label>
                    <input
                      type="number"
                      value={formData.monthlyBudget}
                      onChange={(e) => handleChange('monthlyBudget', e.target.value)}
                      min="0"
                      step="50"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Briefcase size={20} className="inline mr-2" />
                Employment Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Employer Name</label>
                    <input
                      type="text"
                      value={formData.employerName}
                      onChange={(e) => handleChange('employerName', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.employerName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="ABC Company"
                    />
                    {errors.employerName && <p className="text-red-600 text-sm mt-1">{errors.employerName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleChange('jobTitle', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.jobTitle ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Software Engineer"
                    />
                    {errors.jobTitle && <p className="text-red-600 text-sm mt-1">{errors.jobTitle}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Employment Type</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => handleChange('employmentType', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.employmentType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="self-employed">Self-employed</option>
                      <option value="retired">Retired</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.employmentType && <p className="text-red-600 text-sm mt-1">{errors.employmentType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years Employed</label>
                    <input
                      type="number"
                      value={formData.yearsEmployed}
                      onChange={(e) => handleChange('yearsEmployed', e.target.value)}
                      min="0"
                      step="0.5"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.yearsEmployed ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="2.5"
                    />
                    {errors.yearsEmployed && <p className="text-red-600 text-sm mt-1">{errors.yearsEmployed}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Income</label>
                    <input
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                      min="0"
                      step="100"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="5000"
                    />
                    {errors.monthlyIncome && <p className="text-red-600 text-sm mt-1">{errors.monthlyIncome}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Employer Phone</label>
                  <input
                    type="tel"
                    value={formData.employerPhone}
                    onChange={(e) => handleChange('employerPhone', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.employerPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(555) 987-6543"
                  />
                  {errors.employerPhone && <p className="text-red-600 text-sm mt-1">{errors.employerPhone}</p>}
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
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
