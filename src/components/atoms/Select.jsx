import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full pl-3 pr-10 py-2 border ${
            error
              ? 'border-error focus:border-error focus:ring-error'
              : 'border-gray-300 focus:border-accent focus:ring-accent'
          } rounded-lg focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-200 ${
            disabled ? 'bg-gray-50 text-gray-400' : 'bg-white'
          } ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ApperIcon name="ChevronDown" className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default Select;