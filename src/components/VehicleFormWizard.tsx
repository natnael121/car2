import React, { useState } from 'react';
import { VehicleFormData } from '../types';
import { VehicleFormStep1BasicInfo } from './VehicleFormStep1BasicInfo';
import { VehicleFormStep2Specifications } from './VehicleFormStep2Specifications';
import { VehicleFormStep3ConditionHistory } from './VehicleFormStep3ConditionHistory';
import { validateStep1, validateStep2, validateStep3 } from '../utils/validation';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const TOTAL_STEPS = 3;

export const VehicleFormWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState<VehicleFormData>({
    make: '',
    model: '',
    year: '',
    vin: '',
    trim: '',
    condition: '',
    bodyType: '',
    exteriorColor: '',
    interiorColor: '',
    mileage: '',
    mileageUnit: 'miles',
    engineSize: '',
    engineType: '',
    cylinders: '',
    transmission: '',
    drivetrain: '',
    fuelType: '',
    mpgCity: '',
    mpgHighway: '',
    mpgCombined: '',
    seatingCapacity: '',
    doors: '',
    numberOfOwners: '',
    titleStatus: '',
    hasAccidents: false,
    accidentHistory: [],
    serviceHistory: [],
    features: [],
    price: '',
    description: '',
    imageUrls: [],
  });

  const handleFieldChange = (field: keyof VehicleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    let stepErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        stepErrors = validateStep1(formData);
        break;
      case 2:
        stepErrors = validateStep2(formData);
        break;
      case 3:
        stepErrors = validateStep3(formData);
        break;
      default:
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step - 1)) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const vehicleData = {
        ...formData,
        daysOnLot: 0,
        viewCount: 0,
        inquiryCount: 0,
        inStock: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'vehicles'), vehicleData);

      setSubmitSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      setErrors({ submit: 'Failed to save vehicle. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <VehicleFormStep1BasicInfo
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        );
      case 2:
        return (
          <VehicleFormStep2Specifications
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        );
      case 3:
        return (
          <VehicleFormStep3ConditionHistory
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        );
      default:
        return null;
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Check size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Vehicle Added Successfully!</h2>
          <p className="text-green-700">The vehicle has been saved to your inventory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Vehicle</h1>
        <p className="text-gray-600">Complete the form to add a vehicle to your inventory</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => handleStepClick(step)}
                  disabled={step > currentStep && !completedSteps.includes(step - 1)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step === currentStep
                      ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                      : completedSteps.includes(step)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  } ${
                    step <= currentStep || completedSteps.includes(step - 1)
                      ? 'cursor-pointer hover:scale-110'
                      : 'cursor-not-allowed'
                  }`}
                >
                  {completedSteps.includes(step) ? <Check size={20} /> : step}
                </button>
                <span
                  className={`mt-2 text-sm font-medium ${
                    step === currentStep ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Specifications'}
                  {step === 3 && 'Condition'}
                </span>
              </div>
              {step < TOTAL_STEPS && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    completedSteps.includes(step) ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">{renderStepContent()}</div>

      {errors.submit && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{errors.submit}</p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        {currentStep < TOTAL_STEPS ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Next
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Vehicle'}
            {!isSubmitting && <Check size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};
