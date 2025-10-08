import { VehicleFormData } from '../types';

export const validateVIN = (vin: string): boolean => {
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin);
};

export const validateStep1 = (formData: VehicleFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.vin) {
    errors.vin = 'VIN is required';
  } else if (!validateVIN(formData.vin)) {
    errors.vin = 'Invalid VIN format. VIN must be 17 characters (excluding I, O, Q)';
  }

  if (!formData.year) {
    errors.year = 'Year is required';
  } else if (formData.year < 1900 || formData.year > new Date().getFullYear() + 2) {
    errors.year = 'Invalid year';
  }

  if (!formData.make || formData.make.trim() === '') {
    errors.make = 'Make is required';
  }

  if (!formData.model || formData.model.trim() === '') {
    errors.model = 'Model is required';
  }

  if (!formData.condition) {
    errors.condition = 'Condition is required';
  }

  if (!formData.bodyType) {
    errors.bodyType = 'Body type is required';
  }

  return errors;
};

export const validateStep2 = (formData: VehicleFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.mileage && formData.mileage !== 0) {
    errors.mileage = 'Mileage is required';
  } else if (formData.mileage < 0) {
    errors.mileage = 'Mileage cannot be negative';
  }

  if (!formData.transmission) {
    errors.transmission = 'Transmission is required';
  }

  if (!formData.drivetrain) {
    errors.drivetrain = 'Drivetrain is required';
  }

  if (!formData.fuelType) {
    errors.fuelType = 'Fuel type is required';
  }

  if (!formData.exteriorColor || formData.exteriorColor.trim() === '') {
    errors.exteriorColor = 'Exterior color is required';
  }

  if (!formData.interiorColor || formData.interiorColor.trim() === '') {
    errors.interiorColor = 'Interior color is required';
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

  if (!formData.numberOfOwners && formData.numberOfOwners !== 0) {
    errors.numberOfOwners = 'Number of owners is required';
  } else if (formData.numberOfOwners < 0) {
    errors.numberOfOwners = 'Number of owners cannot be negative';
  }

  if (!formData.titleStatus) {
    errors.titleStatus = 'Title status is required';
  }

  if (formData.hasAccidents && formData.accidentHistory.length === 0) {
    errors.accidentHistory = 'Please add at least one accident record or uncheck the accidents box';
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
