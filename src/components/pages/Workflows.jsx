import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useZaps } from '@/hooks/useZaps';
import { useFolders } from '@/hooks/useFolders';
import ZapList from '@/components/organisms/ZapList';
import FilterPanel from '@/components/organisms/FilterPanel';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import ViewToggle from '@/components/molecules/ViewToggle';
import { toast } from 'react-toastify';

const Workflows = () => {
  const [view, setView] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    statuses: [],
    folderId: '',
    app: '',
    search: '',
  });

  const { zaps, loading, error, refetch, toggleZapStatus, testZap } = useZaps(filters);
  const { folders } = useFolders();

  const handleZapAction = async (action, zap) => {
    try {
      switch (action) {
case 'toggle': {
          await toggleZapStatus(zap.Id);
          const newStatus = zap.status === 'active' ? 'paused' : 'active';
          toast.success(`Zap ${newStatus === 'active' ? 'resumed' : 'paused'} successfully`);
          break;
        }
        case 'test': {
          const result = await testZap(zap.Id);
          if (result.success) {
            toast.success('Test completed successfully');
          } else {
            toast.error(result.message);
          }
          break;
        }
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

  const handleBulkAction = async (action) => {
    try {
      toast.info(`Performing bulk ${action}...`);
      // Simulate bulk action
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Bulk ${action} completed successfully`);
    } catch (err) {
      toast.error(`Bulk ${action} failed`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Loading type={view} count={9} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Error
            title="Failed to load workflows"
            message={error}
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowFilters(false)} />
      )}

      {/* Filter Sidebar */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        folders={folders}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        className="z-50 lg:z-auto"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 lg:p-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              icon="Filter"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              Filters
            </Button>
            <div className="text-sm text-gray-600">
              Showing {zaps.length} workflows
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <Button
              variant="secondary"
              icon="Download"
              size="sm"
              onClick={() => toast.info('Export started...')}
            >
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="primary"
              icon="Plus"
              size="sm"
              onClick={() => toast.info('Create zap...')}
            >
              <span className="hidden sm:inline">New Zap</span>
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {zaps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-3 bg-gray-50 border-b border-gray-200"
          >
            <span className="text-sm text-gray-600 mr-4">Bulk Actions:</span>
            <Button
              variant="ghost"
              size="sm"
              icon="Play"
              onClick={() => handleBulkAction('resume')}
            >
              Resume All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="Pause"
              onClick={() => handleBulkAction('pause')}
            >
              Pause All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="TestTube"
              onClick={() => handleBulkAction('test')}
            >
              Test All
            </Button>
          </motion.div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {zaps.length === 0 ? (
            <Empty
              title="No workflows found"
              message="Create your first Zap or adjust your filters to see workflows."
              actionLabel="Create New Zap"
              icon="GitBranch"
              action={() => toast.info('Create zap...')}
            />
          ) : (
            <ZapList
              zaps={zaps}
              view={view}
              onZapAction={handleZapAction}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Workflows;