import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';

const QuickActions = ({ zap, onAction, className = '' }) => {
  const actions = [
    {
      key: 'toggle',
      icon: zap.status === 'active' ? 'Pause' : 'Play',
      tooltip: zap.status === 'active' ? 'Pause Zap' : 'Resume Zap',
      color: zap.status === 'active' ? 'text-warning' : 'text-success',
    },
    {
      key: 'test',
      icon: 'TestTube',
      tooltip: 'Test Zap',
      color: 'text-info',
    },
    {
      key: 'history',
      icon: 'History',
      tooltip: 'View History',
      color: 'text-gray-600',
    },
    {
      key: 'edit',
      icon: 'Settings',
      tooltip: 'Edit Zap',
      color: 'text-gray-600',
    },
  ];

  const handleAction = async (action) => {
    try {
      await onAction?.(action, zap);
      
      const messages = {
        toggle: zap.status === 'active' ? 'Zap paused successfully' : 'Zap resumed successfully',
        test: 'Test completed successfully',
        history: 'Loading history...',
        edit: 'Opening editor...',
      };
      
      toast.success(messages[action]);
    } catch (error) {
      toast.error(`Failed to ${action} zap`);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {actions.map((action) => (
        <motion.button
          key={action.key}
          onClick={() => handleAction(action.key)}
          className={`p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${action.color}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={action.tooltip}
        >
          <ApperIcon name={action.icon} className="w-4 h-4" />
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;