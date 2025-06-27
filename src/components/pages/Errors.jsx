import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useErrors } from '@/hooks/useErrors';
import { useZaps } from '@/hooks/useZaps';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Errors = () => {
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [expandedError, setExpandedError] = useState(null);

  const { errors, loading, error, refetch, deleteError } = useErrors();
  const { zaps } = useZaps();

  const severityOptions = [
    { value: '', label: 'All Severities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getZapName = (zapId) => {
    const zap = zaps.find(z => z.Id === zapId);
    return zap ? zap.name : `Zap #${zapId}`;
  };

  const handleDeleteError = async (errorId) => {
    try {
      await deleteError(errorId);
      toast.success('Error deleted successfully');
    } catch (err) {
      toast.error('Failed to delete error');
    }
  };

  const handleClearAll = async () => {
    try {
      toast.info('Clearing all errors...');
      // Simulate clearing all errors
      await new Promise(resolve => setTimeout(resolve, 1000));
      refetch();
      toast.success('All errors cleared successfully');
    } catch (err) {
      toast.error('Failed to clear errors');
    }
  };

  const filteredErrors = selectedSeverity
    ? errors.filter(err => err.severity === selectedSeverity)
    : errors;

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Loading type="list" count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Error
          title="Failed to load error logs"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary">Error Logs</h1>
          <Badge variant="soft" size="sm">
            {filteredErrors.length} errors
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-48">
            <Select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              options={severityOptions}
              placeholder="Filter by severity"
            />
          </div>
          {errors.length > 0 && (
            <Button
              variant="secondary"
              icon="Trash2"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Error Stats */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertCircle" className="w-5 h-5 text-error" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Severity</p>
                <p className="text-xl font-bold text-primary">
                  {errors.filter(e => e.severity === 'high').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Medium Severity</p>
                <p className="text-xl font-bold text-primary">
                  {errors.filter(e => e.severity === 'medium').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Info" className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Severity</p>
                <p className="text-xl font-bold text-primary">
                  {errors.filter(e => e.severity === 'low').length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error List */}
      {filteredErrors.length === 0 ? (
        <Empty
          title="No errors found"
          message={selectedSeverity 
            ? `No ${selectedSeverity} severity errors found. Try adjusting your filters.`
            : "Great! No error logs to display. Your workflows are running smoothly."
          }
          actionLabel="Refresh"
          icon="CheckCircle"
          action={refetch}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {filteredErrors.map((errorLog) => (
            <motion.div
              key={errorLog.Id}
              layout
              className={`card p-6 ${
                errorLog.severity === 'high' ? 'border-l-4 border-error' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge status={getSeverityColor(errorLog.severity)} size="sm">
                      {errorLog.severity.toUpperCase()}
                    </Badge>
                    <h3 className="font-medium text-primary truncate">
                      {getZapName(errorLog.zapId)}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(errorLog.timestamp), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-2">{errorLog.message}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Settings" className="w-4 h-4" />
                      <span>Task: {errorLog.task}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Clock" className="w-4 h-4" />
                      <span>{new Date(errorLog.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  {expandedError === errorLog.Id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <h4 className="font-medium text-primary mb-2">Error Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Error ID:</strong> {errorLog.Id}</div>
                        <div><strong>Zap ID:</strong> {errorLog.zapId}</div>
                        <div><strong>Timestamp:</strong> {errorLog.timestamp}</div>
                        <div><strong>Task:</strong> {errorLog.task}</div>
                        <div><strong>Message:</strong> {errorLog.message}</div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={expandedError === errorLog.Id ? "ChevronUp" : "ChevronDown"}
                    onClick={() => setExpandedError(
                      expandedError === errorLog.Id ? null : errorLog.Id
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => handleDeleteError(errorLog.Id)}
                    className="text-error hover:text-error"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Errors;