import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useZaps } from '@/hooks/useZaps';
import { useErrors } from '@/hooks/useErrors';
import MetricCard from '@/components/molecules/MetricCard';
import ZapList from '@/components/organisms/ZapList';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [filters, setFilters] = useState({
    statuses: [],
    search: '',
  });

  const { zaps, loading, error, refetch, toggleZapStatus, testZap } = useZaps(filters);
  const { errors: errorLogs } = useErrors();

  const handleZapAction = async (action, zap) => {
    try {
      switch (action) {
        case 'toggle':
          await toggleZapStatus(zap.Id);
          break;
        case 'test':
          const result = await testZap(zap.Id);
          if (result.success) {
            toast.success('Test completed successfully');
          } else {
            toast.error(result.message);
          }
          break;
        case 'history':
          toast.info('Loading history...');
          break;
        case 'edit':
          toast.info('Opening editor...');
          break;
        default:
          break;
      }
    } catch (err) {
      toast.error(`Failed to ${action} zap: ${err.message}`);
    }
  };

  // Calculate metrics
  const activeZaps = zaps.filter(z => z.status === 'active').length;
  const errorZaps = zaps.filter(z => z.status === 'error').length;
  const totalRuns = zaps.reduce((sum, z) => sum + (z.successRate || 0), 0);
  const avgSuccessRate = zaps.length > 0 ? Math.round(totalRuns / zaps.length) : 0;
  const recentErrors = errorLogs.slice(0, 5).length;

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <Loading type="metrics" />
        <Loading type="cards" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Error
          title="Failed to load dashboard"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Metrics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Active Zaps"
          value={activeZaps}
          icon="Zap"
          gradient={true}
          change={activeZaps > 0 ? `${Math.round((activeZaps / zaps.length) * 100)}% of total` : null}
          trend="up"
        />
        <MetricCard
          title="Success Rate"
          value={`${avgSuccessRate}%`}
          icon="CheckCircle"
          change={avgSuccessRate > 95 ? "Excellent" : avgSuccessRate > 85 ? "Good" : "Needs attention"}
          trend={avgSuccessRate > 95 ? "up" : avgSuccessRate > 85 ? "neutral" : "down"}
        />
        <MetricCard
          title="Error Zaps"
          value={errorZaps}
          icon="AlertCircle"
          change={errorZaps === 0 ? "All clear!" : `${errorZaps} need attention`}
          trend={errorZaps === 0 ? "up" : "down"}
        />
        <MetricCard
          title="Recent Errors"
          value={recentErrors}
          icon="AlertTriangle"
          change="Last 24 hours"
          trend={recentErrors < 3 ? "up" : "down"}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-success/10 to-green-500/10 rounded-lg hover:from-success/20 hover:to-green-500/20 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">+</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-primary">Create Zap</p>
              <p className="text-sm text-gray-600">Build new automation</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-info/10 to-blue-500/10 rounded-lg hover:from-info/20 hover:to-blue-500/20 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-info rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">⚡</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-primary">Test All</p>
              <p className="text-sm text-gray-600">Run system check</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-warning/10 to-yellow-500/10 rounded-lg hover:from-warning/20 hover:to-yellow-500/20 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
              <span className="text-primary font-semibold">📊</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-primary">View Reports</p>
              <p className="text-sm text-gray-600">Analytics dashboard</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent/10 to-orange-400/10 rounded-lg hover:from-accent/20 hover:to-orange-400/20 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">⚙️</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-primary">Settings</p>
              <p className="text-sm text-gray-600">Configure system</p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Recent Zaps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Recent Zaps</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-accent hover:text-orange-400 font-medium text-sm transition-colors duration-200"
          >
            View All →
          </motion.button>
        </div>

        {zaps.length === 0 ? (
          <Empty
            title="No Zaps Found"
            message="Get started by creating your first automation workflow."
            actionLabel="Create Your First Zap"
            icon="Zap"
          />
        ) : (
          <ZapList
            zaps={zaps.slice(0, 6)}
            view="grid"
            onZapAction={handleZapAction}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;