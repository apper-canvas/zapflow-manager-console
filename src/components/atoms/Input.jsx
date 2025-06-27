import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
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
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full ${
            icon ? 'pl-10' : 'pl-3'
          } pr-3 py-2 border ${
            error
              ? 'border-error focus:border-error focus:ring-error'
              : 'border-gray-300 focus:border-accent focus:ring-accent'
          } rounded-lg focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-200 ${
            disabled ? 'bg-gray-50 text-gray-400' : 'bg-white'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;