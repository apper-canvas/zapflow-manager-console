import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Badge from '@/components/atoms/Badge';
import QuickActions from '@/components/molecules/QuickActions';
import ApperIcon from '@/components/ApperIcon';

const ZapCard = ({ zap, onAction, className = '' }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'Play';
      case 'paused':
        return 'Pause';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const formatLastRun = (timestamp) => {
    if (!timestamp) return 'Never';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <motion.div
      className={`card p-6 ${zap.status === 'error' ? 'border-l-4 border-error' : ''} ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-primary truncate">
              {zap.name}
            </h3>
            <Badge 
              status={zap.status} 
              pulse={zap.status === 'active'}
              icon={getStatusIcon(zap.status)}
            >
              {zap.status.charAt(0).toUpperCase() + zap.status.slice(1)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" className="w-4 h-4" />
              <span>Last run: {formatLastRun(zap.lastRun)}</span>
            </div>
            {zap.errorCount > 0 && (
              <div className="flex items-center gap-1 text-error">
                <ApperIcon name="AlertTriangle" className="w-4 h-4" />
                <span>{zap.errorCount} errors</span>
              </div>
            )}
          </div>

          {/* App Icons */}
          <div className="flex items-center gap-2 mb-4">
            {zap.apps.slice(0, 3).map((app, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {app.charAt(0).toUpperCase()}
                  </span>
                </div>
                {index < Math.min(zap.apps.length - 1, 2) && (
                  <ApperIcon name="ArrowRight" className="w-4 h-4 text-gray-400 mx-2" />
                )}
              </div>
            ))}
            {zap.apps.length > 3 && (
              <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                <span>+{zap.apps.length - 3} more</span>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-gray-600">Success: {zap.successRate}%</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Timer" className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Avg: {zap.avgDuration}s</span>
            </div>
          </div>
        </div>

        <QuickActions zap={zap} onAction={onAction} />
      </div>

      {zap.status === 'error' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-error/5 border border-error/20 rounded-lg"
        >
          <div className="flex items-center gap-2 text-error text-sm">
            <ApperIcon name="AlertCircle" className="w-4 h-4" />
            <span className="font-medium">Recent Error</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Last error occurred {formatLastRun(zap.lastRun)}. Click history for details.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ZapCard;