import React from 'react';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormTextarea } from './FormTextarea';
import { VehicleFormData, TitleStatus, AccidentHistory, ServiceRecord } from '../types';
import { Trash2, Plus } from 'lucide-react';

interface VehicleFormStep3Props {
  formData: VehicleFormData;
  errors: Record<string, string>;
  onChange: (field: keyof VehicleFormData, value: any) => void;
}

const titleStatusOptions: { value: TitleStatus; label: string }[] = [
  { value: 'clean', label: 'Clean' },
  { value: 'salvage', label: 'Salvage' },
  { value: 'rebuilt', label: 'Rebuilt' },
  { value: 'lemon', label: 'Lemon' },
  { value: 'flood-damage', label: 'Flood Damage' },
];

const accidentSeverityOptions = [
  { value: 'minor', label: 'Minor' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'major', label: 'Major' },
];

export const VehicleFormStep3ConditionHistory: React.FC<VehicleFormStep3Props> = ({
  formData,
  errors,
  onChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onChange(name as keyof VehicleFormData, checked);
    } else if (name === 'numberOfOwners') {
      onChange(name as keyof VehicleFormData, value ? parseInt(value, 10) : '');
    } else {
      onChange(name as keyof VehicleFormData, value);
    }
  };

  const addAccidentRecord = () => {
    const newAccident: AccidentHistory = {
      id: Date.now().toString(),
      date: '',
      severity: 'minor',
      description: '',
    };
    onChange('accidentHistory', [...formData.accidentHistory, newAccident]);
  };

  const removeAccidentRecord = (id: string) => {
    onChange(
      'accidentHistory',
      formData.accidentHistory.filter((accident) => accident.id !== id)
    );
  };

  const updateAccidentRecord = (id: string, field: keyof AccidentHistory, value: any) => {
    onChange(
      'accidentHistory',
      formData.accidentHistory.map((accident) =>
        accident.id === id ? { ...accident, [field]: value } : accident
      )
    );
  };

  const addServiceRecord = () => {
    const newService: ServiceRecord = {
      id: Date.now().toString(),
      date: '',
      mileage: 0,
      serviceType: '',
      description: '',
      cost: 0,
      serviceProvider: '',
    };
    onChange('serviceHistory', [...formData.serviceHistory, newService]);
  };

  const removeServiceRecord = (id: string) => {
    onChange(
      'serviceHistory',
      formData.serviceHistory.filter((service) => service.id !== id)
    );
  };

  const updateServiceRecord = (id: string, field: keyof ServiceRecord, value: any) => {
    onChange(
      'serviceHistory',
      formData.serviceHistory.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Condition & History</h2>
      <p className="text-gray-600 mb-6">Provide detailed information about the vehicle's condition and history</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Number of Previous Owners"
          name="numberOfOwners"
          type="number"
          value={formData.numberOfOwners}
          onChange={handleInputChange}
          error={errors.numberOfOwners}
          required
          placeholder="1"
          min={0}
        />

        <FormSelect
          label="Title Status"
          name="titleStatus"
          value={formData.titleStatus}
          onChange={handleInputChange}
          options={titleStatusOptions}
          error={errors.titleStatus}
          required
          placeholder="Select title status"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="hasAccidents"
          name="hasAccidents"
          checked={formData.hasAccidents}
          onChange={handleInputChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="hasAccidents" className="text-sm font-medium text-gray-700">
          This vehicle has been in accidents
        </label>
      </div>

      {formData.hasAccidents && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Accident History</h3>
            <button
              type="button"
              onClick={addAccidentRecord}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={16} />
              Add Accident
            </button>
          </div>

          {formData.accidentHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No accident records added yet</p>
          ) : (
            <div className="space-y-4">
              {formData.accidentHistory.map((accident) => (
                <div key={accident.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-800">Accident Record</h4>
                    <button
                      type="button"
                      onClick={() => removeAccidentRecord(accident.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={accident.date}
                      onChange={(e) => updateAccidentRecord(accident.id, 'date', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Date"
                    />

                    <select
                      value={accident.severity}
                      onChange={(e) => updateAccidentRecord(accident.id, 'severity', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {accidentSeverityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={accident.description}
                    onChange={(e) => updateAccidentRecord(accident.id, 'description', e.target.value)}
                    placeholder="Describe the accident and repairs performed"
                    rows={3}
                    className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="number"
                    value={accident.repairCost || ''}
                    onChange={(e) =>
                      updateAccidentRecord(accident.id, 'repairCost', e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    placeholder="Repair cost (optional)"
                    className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Service History</h3>
          <button
            type="button"
            onClick={addServiceRecord}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus size={16} />
            Add Service Record
          </button>
        </div>

        {formData.serviceHistory.length === 0 ? (
          <p className="text-gray-500 text-sm">No service records added yet</p>
        ) : (
          <div className="space-y-4">
            {formData.serviceHistory.map((service) => (
              <div key={service.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-800">Service Record</h4>
                  <button
                    type="button"
                    onClick={() => removeServiceRecord(service.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="date"
                    value={service.date}
                    onChange={(e) => updateServiceRecord(service.id, 'date', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Date"
                  />

                  <input
                    type="number"
                    value={service.mileage}
                    onChange={(e) => updateServiceRecord(service.id, 'mileage', parseInt(e.target.value, 10))}
                    placeholder="Mileage at service"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    value={service.serviceType}
                    onChange={(e) => updateServiceRecord(service.id, 'serviceType', e.target.value)}
                    placeholder="Service type"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <textarea
                  value={service.description}
                  onChange={(e) => updateServiceRecord(service.id, 'description', e.target.value)}
                  placeholder="Service description"
                  rows={2}
                  className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <input
                    type="text"
                    value={service.serviceProvider}
                    onChange={(e) => updateServiceRecord(service.id, 'serviceProvider', e.target.value)}
                    placeholder="Service provider"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="number"
                    value={service.cost}
                    onChange={(e) => updateServiceRecord(service.id, 'cost', parseFloat(e.target.value))}
                    placeholder="Cost"
                    step="0.01"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Complete service and accident history builds buyer confidence and can increase the vehicle's value.
        </p>
      </div>
    </div>
  );
};
