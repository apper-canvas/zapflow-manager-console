import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ViewToggle = ({ view, onViewChange, className = '' }) => {
  const views = [
    { value: 'grid', icon: 'Grid3x3', label: 'Grid' },
    { value: 'list', icon: 'List', label: 'List' },
  ];

  return (
    <div className={`inline-flex bg-gray-100 rounded-lg p-1 ${className}`}>
      {views.map((viewOption) => {
        const isActive = view === viewOption.value;
        return (
          <motion.button
            key={viewOption.value}
            onClick={() => onViewChange(viewOption.value)}
            className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive 
                ? 'text-primary' 
                : 'text-gray-500 hover:text-primary'
            }`}
            whileHover={{ scale: isActive ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeViewBg"
                className="absolute inset-0 bg-white rounded-md shadow-sm"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative flex items-center gap-2">
              <ApperIcon name={viewOption.icon} className="w-4 h-4" />
              <span className="hidden sm:inline">{viewOption.label}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ViewToggle;