import React from 'react';
import { motion } from 'framer-motion';

const StatusFilter = ({ selectedStatuses = [], onStatusChange, className = '' }) => {
  const statuses = [
    { value: 'active', label: 'Active', color: 'bg-success' },
    { value: 'paused', label: 'Paused', color: 'bg-gray-400' },
    { value: 'error', label: 'Error', color: 'bg-error' },
  ];

  const handleStatusToggle = (status) => {
    const isSelected = selectedStatuses.includes(status);
    if (isSelected) {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-medium text-primary">Filter by Status</h3>
      <div className="space-y-2">
        {statuses.map((status) => {
          const isSelected = selectedStatuses.includes(status.value);
          return (
            <motion.label
              key={status.value}
              className="flex items-center gap-3 cursor-pointer group"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.15 }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleStatusToggle(status.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                isSelected 
                  ? `${status.color} border-transparent` 
                  : 'border-gray-300 group-hover:border-gray-400'
              }`}>
                {isSelected && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm transition-colors duration-200 ${
                isSelected ? 'text-primary font-medium' : 'text-gray-600 group-hover:text-primary'
              }`}>
                {status.label}
              </span>
            </motion.label>
          );
        })}
      </div>
    </div>
  );
};

export default StatusFilter;