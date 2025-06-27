import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = 'No data found',
  message = 'Get started by creating your first item.',
  action,
  actionLabel = 'Get Started',
  icon = 'Package',
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 px-4 ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
        className="w-20 h-20 bg-gradient-to-br from-accent/10 to-orange-400/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <ApperIcon name={icon} className="w-10 h-10 text-accent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      </motion.div>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={action}
            variant="primary"
            size="lg"
            icon="Plus"
            className="mx-auto"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-sm text-gray-500"
      >
        Need help getting started? Check out our documentation.
      </motion.div>
    </motion.div>
  );
};

export default Empty;