import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

export interface VehicleFilters {
  priceRange: [number, number];
  makes: string[];
  models: string[];
  yearRange: [number, number];
  mileageRange: [number, number];
  bodyTypes: string[];
  transmissions: string[];
  fuelTypes: string[];
  colors: string[];
  conditions: string[];
}

interface FilterPanelProps {
  filters: VehicleFilters;
  onChange: (filters: VehicleFilters) => void;
  availableOptions: {
    makes: string[];
    models: string[];
    bodyTypes: string[];
    transmissions: string[];
    fuelTypes: string[];
    colors: string[];
    conditions: string[];
  };
  priceRange: [number, number];
  yearRange: [number, number];
  mileageRange: [number, number];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  availableOptions,
  priceRange,
  yearRange,
  mileageRange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    make: false,
    year: false,
    mileage: false,
    body: false,
    transmission: false,
    fuel: false,
    color: false,
    condition: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange] as [number, number];
    newRange[index] = value;
    onChange({ ...filters, priceRange: newRange });
  };

  const handleYearChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.yearRange] as [number, number];
    newRange[index] = value;
    onChange({ ...filters, yearRange: newRange });
  };

  const handleMileageChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.mileageRange] as [number, number];
    newRange[index] = value;
    onChange({ ...filters, mileageRange: newRange });
  };

  const toggleArrayFilter = (key: keyof VehicleFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    onChange({ ...filters, [key]: newArray });
  };

  const clearFilters = () => {
    onChange({
      priceRange,
      makes: [],
      models: [],
      yearRange,
      mileageRange,
      bodyTypes: [],
      transmissions: [],
      fuelTypes: [],
      colors: [],
      conditions: [],
    });
  };

  const activeFilterCount =
    filters.makes.length +
    filters.models.length +
    filters.bodyTypes.length +
    filters.transmissions.length +
    filters.fuelTypes.length +
    filters.colors.length +
    filters.conditions.length +
    (filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1] ? 1 : 0) +
    (filters.yearRange[0] !== yearRange[0] || filters.yearRange[1] !== yearRange[1] ? 1 : 0) +
    (filters.mileageRange[0] !== mileageRange[0] || filters.mileageRange[1] !== mileageRange[1] ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="flex items-center justify-between p-4 bg-blue-600 text-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="text-sm hover:underline flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
          <FilterSection
            title="Price Range"
            isExpanded={expandedSections.price}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Min"
                  min={priceRange[0]}
                  max={filters.priceRange[1]}
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
                  min={filters.priceRange[0]}
                  max={priceRange[1]}
                />
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="range"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="text-sm text-gray-600 text-center">
                ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
              </div>
            </div>
          </FilterSection>

          <FilterSection
            title="Make"
            isExpanded={expandedSections.make}
            onToggle={() => toggleSection('make')}
            count={filters.makes.length}
          >
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableOptions.makes.map((make) => (
                <CheckboxItem
                  key={make}
                  label={make}
                  checked={filters.makes.includes(make)}
                  onChange={() => toggleArrayFilter('makes', make)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Year Range"
            isExpanded={expandedSections.year}
            onToggle={() => toggleSection('year')}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.yearRange[0]}
                  onChange={(e) => handleYearChange(0, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Min"
                  min={yearRange[0]}
                  max={filters.yearRange[1]}
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={filters.yearRange[1]}
                  onChange={(e) => handleYearChange(1, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
                  min={filters.yearRange[0]}
                  max={yearRange[1]}
                />
              </div>
            </div>
          </FilterSection>

          <FilterSection
            title="Mileage Range"
            isExpanded={expandedSections.mileage}
            onToggle={() => toggleSection('mileage')}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.mileageRange[0]}
                  onChange={(e) => handleMileageChange(0, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Min"
                  min={mileageRange[0]}
                  max={filters.mileageRange[1]}
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={filters.mileageRange[1]}
                  onChange={(e) => handleMileageChange(1, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
                  min={filters.mileageRange[0]}
                  max={mileageRange[1]}
                />
              </div>
              <div className="text-sm text-gray-600 text-center">
                {filters.mileageRange[0].toLocaleString()} - {filters.mileageRange[1].toLocaleString()} miles
              </div>
            </div>
          </FilterSection>

          <FilterSection
            title="Body Type"
            isExpanded={expandedSections.body}
            onToggle={() => toggleSection('body')}
            count={filters.bodyTypes.length}
          >
            <div className="space-y-2">
              {availableOptions.bodyTypes.map((type) => (
                <CheckboxItem
                  key={type}
                  label={type}
                  checked={filters.bodyTypes.includes(type)}
                  onChange={() => toggleArrayFilter('bodyTypes', type)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Transmission"
            isExpanded={expandedSections.transmission}
            onToggle={() => toggleSection('transmission')}
            count={filters.transmissions.length}
          >
            <div className="space-y-2">
              {availableOptions.transmissions.map((type) => (
                <CheckboxItem
                  key={type}
                  label={type}
                  checked={filters.transmissions.includes(type)}
                  onChange={() => toggleArrayFilter('transmissions', type)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Fuel Type"
            isExpanded={expandedSections.fuel}
            onToggle={() => toggleSection('fuel')}
            count={filters.fuelTypes.length}
          >
            <div className="space-y-2">
              {availableOptions.fuelTypes.map((type) => (
                <CheckboxItem
                  key={type}
                  label={type}
                  checked={filters.fuelTypes.includes(type)}
                  onChange={() => toggleArrayFilter('fuelTypes', type)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Color"
            isExpanded={expandedSections.color}
            onToggle={() => toggleSection('color')}
            count={filters.colors.length}
          >
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableOptions.colors.map((color) => (
                <CheckboxItem
                  key={color}
                  label={color}
                  checked={filters.colors.includes(color)}
                  onChange={() => toggleArrayFilter('colors', color)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Condition"
            isExpanded={expandedSections.condition}
            onToggle={() => toggleSection('condition')}
            count={filters.conditions.length}
          >
            <div className="space-y-2">
              {availableOptions.conditions.map((condition) => (
                <CheckboxItem
                  key={condition}
                  label={condition}
                  checked={filters.conditions.includes(condition)}
                  onChange={() => toggleArrayFilter('conditions', condition)}
                />
              ))}
            </div>
          </FilterSection>
        </div>
      )}
    </div>
  );
};

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  count?: number;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  count,
  children,
}) => {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-blue-600"
      >
        <span className="flex items-center gap-2">
          {title}
          {count !== undefined && count > 0 && (
            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isExpanded && <div className="mt-3">{children}</div>}
    </div>
  );
};

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-700 capitalize">{label}</span>
    </label>
  );
};

export default FilterPanel;
