import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children, 
  status, 
  variant = 'default', 
  size = 'md',
  icon,
  pulse = false,
  className = '' 
}) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-white';
      case 'paused':
        return 'bg-gray-400 text-white';
      case 'error':
        return 'bg-error text-white';
      case 'warning':
        return 'bg-warning text-primary';
      case 'info':
        return 'bg-info text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getVariantClasses = (variant) => {
    switch (variant) {
      case 'outlined':
        return 'border border-gray-300 bg-transparent text-gray-700';
      case 'soft':
        return 'bg-gray-100 text-gray-700';
      default:
        return '';
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const statusClasses = status ? getStatusClasses(status) : getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  
  const baseClasses = `inline-flex items-center gap-1.5 font-medium rounded-full ${statusClasses} ${sizeClasses} ${className}`;

  return (
    <motion.span
      className={baseClasses}
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: pulse ? Infinity : 0 }}
    >
      {icon && <ApperIcon name={icon} className="w-3 h-3" />}
      {status === 'active' && pulse && (
        <span className="w-2 h-2 bg-white rounded-full animate-pulse-dot" />
      )}
      {children}
    </motion.span>
  );
};

export default Badge;