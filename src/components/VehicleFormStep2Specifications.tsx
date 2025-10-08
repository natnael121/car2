import React from 'react';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { VehicleFormData, TransmissionType, DrivetrainType, FuelType, MileageUnit } from '../types';

interface VehicleFormStep2Props {
  formData: VehicleFormData;
  errors: Record<string, string>;
  onChange: (field: keyof VehicleFormData, value: any) => void;
}

const transmissionOptions: { value: TransmissionType; label: string }[] = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'CVT', label: 'CVT (Continuously Variable)' },
  { value: 'dual-clutch', label: 'Dual-Clutch' },
];

const drivetrainOptions: { value: DrivetrainType; label: string }[] = [
  { value: 'FWD', label: 'Front-Wheel Drive (FWD)' },
  { value: 'RWD', label: 'Rear-Wheel Drive (RWD)' },
  { value: 'AWD', label: 'All-Wheel Drive (AWD)' },
  { value: '4WD', label: 'Four-Wheel Drive (4WD)' },
];

const fuelTypeOptions: { value: FuelType; label: string }[] = [
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'plug-in-hybrid', label: 'Plug-in Hybrid' },
  { value: 'electric', label: 'Electric' },
  { value: 'flex-fuel', label: 'Flex Fuel' },
];

const mileageUnitOptions: { value: MileageUnit; label: string }[] = [
  { value: 'miles', label: 'Miles' },
  { value: 'km', label: 'Kilometers' },
];

const cylinderOptions = [
  { value: 3, label: '3 Cylinders' },
  { value: 4, label: '4 Cylinders' },
  { value: 5, label: '5 Cylinders' },
  { value: 6, label: '6 Cylinders' },
  { value: 8, label: '8 Cylinders' },
  { value: 10, label: '10 Cylinders' },
  { value: 12, label: '12 Cylinders' },
];

const doorsOptions = [
  { value: 2, label: '2 Doors' },
  { value: 3, label: '3 Doors' },
  { value: 4, label: '4 Doors' },
  { value: 5, label: '5 Doors' },
];

const seatingOptions = [
  { value: 2, label: '2 Seats' },
  { value: 4, label: '4 Seats' },
  { value: 5, label: '5 Seats' },
  { value: 6, label: '6 Seats' },
  { value: 7, label: '7 Seats' },
  { value: 8, label: '8 Seats' },
  { value: 9, label: '9+ Seats' },
];

export const VehicleFormStep2Specifications: React.FC<VehicleFormStep2Props> = ({
  formData,
  errors,
  onChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['mileage', 'cylinders', 'mpgCity', 'mpgHighway', 'mpgCombined', 'seatingCapacity', 'doors'];

    if (numericFields.includes(name)) {
      onChange(name as keyof VehicleFormData, value ? parseInt(value, 10) : '');
    } else {
      onChange(name as keyof VehicleFormData, value);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Technical Specifications</h2>
      <p className="text-gray-600 mb-6">Provide detailed technical information about the vehicle</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormInput
            label="Mileage"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={handleInputChange}
            error={errors.mileage}
            required
            placeholder="50000"
            min={0}
          />
        </div>
        <div>
          <FormSelect
            label="Mileage Unit"
            name="mileageUnit"
            value={formData.mileageUnit}
            onChange={handleInputChange}
            options={mileageUnitOptions}
            error={errors.mileageUnit}
            required
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Engine & Performance</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Engine Size"
          name="engineSize"
          type="text"
          value={formData.engineSize}
          onChange={handleInputChange}
          error={errors.engineSize}
          placeholder="2.5L, 3.0L V6, etc."
        />

        <FormInput
          label="Engine Type"
          name="engineType"
          type="text"
          value={formData.engineType}
          onChange={handleInputChange}
          error={errors.engineType}
          placeholder="Inline-4, V6, V8, etc."
        />

        <FormSelect
          label="Cylinders"
          name="cylinders"
          value={formData.cylinders}
          onChange={handleInputChange}
          options={cylinderOptions}
          error={errors.cylinders}
          placeholder="Select cylinders"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Transmission"
          name="transmission"
          value={formData.transmission}
          onChange={handleInputChange}
          options={transmissionOptions}
          error={errors.transmission}
          required
          placeholder="Select transmission"
        />

        <FormSelect
          label="Drivetrain"
          name="drivetrain"
          value={formData.drivetrain}
          onChange={handleInputChange}
          options={drivetrainOptions}
          error={errors.drivetrain}
          required
          placeholder="Select drivetrain"
        />
      </div>

      <FormSelect
        label="Fuel Type"
        name="fuelType"
        value={formData.fuelType}
        onChange={handleInputChange}
        options={fuelTypeOptions}
        error={errors.fuelType}
        required
        placeholder="Select fuel type"
      />

      <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Fuel Economy (MPG)</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="City MPG"
          name="mpgCity"
          type="number"
          value={formData.mpgCity}
          onChange={handleInputChange}
          error={errors.mpgCity}
          placeholder="25"
          min={0}
        />

        <FormInput
          label="Highway MPG"
          name="mpgHighway"
          type="number"
          value={formData.mpgHighway}
          onChange={handleInputChange}
          error={errors.mpgHighway}
          placeholder="32"
          min={0}
        />

        <FormInput
          label="Combined MPG"
          name="mpgCombined"
          type="number"
          value={formData.mpgCombined}
          onChange={handleInputChange}
          error={errors.mpgCombined}
          placeholder="28"
          min={0}
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Colors & Configuration</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Exterior Color"
          name="exteriorColor"
          type="text"
          value={formData.exteriorColor}
          onChange={handleInputChange}
          error={errors.exteriorColor}
          required
          placeholder="Pearl White, Midnight Black, etc."
        />

        <FormInput
          label="Interior Color"
          name="interiorColor"
          type="text"
          value={formData.interiorColor}
          onChange={handleInputChange}
          error={errors.interiorColor}
          required
          placeholder="Beige, Black Leather, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Number of Doors"
          name="doors"
          value={formData.doors}
          onChange={handleInputChange}
          options={doorsOptions}
          error={errors.doors}
          placeholder="Select doors"
        />

        <FormSelect
          label="Seating Capacity"
          name="seatingCapacity"
          value={formData.seatingCapacity}
          onChange={handleInputChange}
          options={seatingOptions}
          error={errors.seatingCapacity}
          placeholder="Select seating"
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Accurate specifications help buyers find exactly what they're looking for and increase trust in your listing.
        </p>
      </div>
    </div>
  );
};
