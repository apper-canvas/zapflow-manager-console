import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  title = 'Something went wrong',
  message = 'We encountered an error while loading the data. Please try again.',
  onRetry,
  showRetry = true,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-8 text-center max-w-md mx-auto ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
        className="w-16 h-16 bg-gradient-to-br from-error/10 to-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </motion.div>

      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          icon="RefreshCw"
          className="mx-auto"
        >
          Try Again
        </Button>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-sm text-gray-500"
      >
        If the problem persists, please contact support.
      </motion.div>
    </motion.div>
  );
};

export default Error;