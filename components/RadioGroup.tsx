
import React from 'react';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: any) => void;
  required?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, value, onChange, required = false }) => {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </legend>
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              required={required}
              className="h-4 w-4 text-[#8BC34A] border-gray-300 focus:ring-[#8BC34A]"
            />
            <label htmlFor={`${name}-${option.value}`} className="ml-3 block text-sm font-medium text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default RadioGroup;
