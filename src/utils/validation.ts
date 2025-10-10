import { VehicleFormData } from '../types';

export const validateVIN = (vin: string): boolean => {
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin);
};

export const validateStep1 = (formData: VehicleFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (formData.vin && !validateVIN(formData.vin)) {
    errors.vin = 'Invalid VIN format. VIN must be 17 characters (excluding I, O, Q)';
  }

  if (formData.year && (formData.year < 1900 || formData.year > new Date().getFullYear() + 2)) {
    errors.year = 'Invalid year';
  }

  return errors;
};

export const validateStep2 = (formData: VehicleFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (formData.mileage && formData.mileage < 0) {
    errors.mileage = 'Mileage cannot be negative';
  }

  if (formData.mpgCity && formData.mpgCity < 0) {
    errors.mpgCity = 'MPG cannot be negative';
  }

  if (formData.mpgHighway && formData.mpgHighway < 0) {
    errors.mpgHighway = 'MPG cannot be negative';
  }

  if (formData.mpgCombined && formData.mpgCombined < 0) {
    errors.mpgCombined = 'MPG cannot be negative';
  }

  return errors;
};

export const validateStep3 = (formData: VehicleFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (formData.numberOfOwners && formData.numberOfOwners < 0) {
    errors.numberOfOwners = 'Number of owners cannot be negative';
  }

  return errors;
};

export const validateAllSteps = (formData: VehicleFormData): Record<string, string> => {
  return {
    ...validateStep1(formData),
    ...validateStep2(formData),
    ...validateStep3(formData),
  };
};
