import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'up',
  gradient = false,
  className = '' 
}) => {
  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <motion.div
      className={`card p-6 ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${
            gradient 
              ? 'bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent' 
              : 'text-primary'
          }`}>
            {value}
          </p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 ${getTrendColor(trend)}`}>
              <ApperIcon name={getTrendIcon(trend)} className="w-4 h-4" />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-orange-400/10 rounded-xl flex items-center justify-center">
              <ApperIcon name={icon} className="w-6 h-6 text-accent" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;