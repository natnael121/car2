import React from 'react';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { VehicleFormData, VehicleCondition, BodyType } from '../types';

interface VehicleFormStep1Props {
  formData: VehicleFormData;
  errors: Record<string, string>;
  onChange: (field: keyof VehicleFormData, value: any) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i + 1);

const makeOptions = [
  'Chevrolet',
  'Ford',
  'Honda',
  'Toyota',
  'Nissan',
  'Jeep',
  'Ram',
  'GMC',
  'Hyundai',
  'Subaru',
  'Kia',
  'Mazda',
  'Volkswagen',
  'Dodge',
  'Buick',
  'Chrysler',
  'Mitsubishi',
  'Volvo',
  'Acura',
  'Infiniti',
].map((make) => ({ value: make, label: make }));

const conditionOptions: { value: VehicleCondition; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
  { value: 'certified-pre-owned', label: 'Certified Pre-Owned' },
];

const bodyTypeOptions: { value: BodyType; label: string }[] = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'truck', label: 'Truck' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'wagon', label: 'Wagon' },
  { value: 'van', label: 'Van' },
  { value: 'hatchback', label: 'Hatchback' },
];

export const VehicleFormStep1BasicInfo: React.FC<VehicleFormStep1Props> = ({
  formData,
  errors,
  onChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['year'];

    if (numericFields.includes(name)) {
      onChange(name as keyof VehicleFormData, value ? parseInt(value, 10) : '');
    } else {
      onChange(name as keyof VehicleFormData, value);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic Vehicle Information</h2>
      <p className="text-gray-600 mb-6">Enter the primary details about the vehicle</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="VIN (Vehicle Identification Number)"
          name="vin"
          type="text"
          value={formData.vin}
          onChange={handleInputChange}
          error={errors.vin}
          placeholder="1HGBH41JXMN109186"
        />

        <FormSelect
          label="Year"
          name="year"
          value={formData.year}
          onChange={handleInputChange}
          options={years.map((year) => ({ value: year, label: year.toString() }))}
          error={errors.year}
          placeholder="Select year"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Make"
          name="make"
          value={formData.make}
          onChange={handleInputChange}
          options={makeOptions}
          error={errors.make}
          placeholder="Select make"
        />

        <FormInput
          label="Model"
          name="model"
          type="text"
          value={formData.model}
          onChange={handleInputChange}
          error={errors.model}
          placeholder="Camry"
        />
      </div>

      <FormInput
        label="Trim"
        name="trim"
        type="text"
        value={formData.trim}
        onChange={handleInputChange}
        error={errors.trim}
        placeholder="XLE, Sport, Limited, etc."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Condition"
          name="condition"
          value={formData.condition}
          onChange={handleInputChange}
          options={conditionOptions}
          error={errors.condition}
          placeholder="Select condition"
        />

        <FormSelect
          label="Body Type"
          name="bodyType"
          value={formData.bodyType}
          onChange={handleInputChange}
          options={bodyTypeOptions}
          error={errors.bodyType}
          placeholder="Select body type"
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> All fields are optional. Fill in the information you have available.
        </p>
      </div>
    </div>
  );
};
