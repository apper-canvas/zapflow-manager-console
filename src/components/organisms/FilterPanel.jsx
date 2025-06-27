import React from 'react';
import { motion } from 'framer-motion';
import StatusFilter from '@/components/molecules/StatusFilter';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const FilterPanel = ({ 
  filters = {}, 
  onFiltersChange, 
  folders = [],
  isOpen = false,
  onClose,
  className = '' 
}) => {
  const appOptions = [
    { value: 'gmail', label: 'Gmail' },
    { value: 'slack', label: 'Slack' },
    { value: 'trello', label: 'Trello' },
    { value: 'sheets', label: 'Google Sheets' },
    { value: 'hubspot', label: 'HubSpot' },
    { value: 'salesforce', label: 'Salesforce' },
  ];

  const folderOptions = folders.map(folder => ({
    value: folder.Id.toString(),
    label: folder.name
  }));

  const handleStatusChange = (statuses) => {
    onFiltersChange({ ...filters, statuses });
  };

  const handleFolderChange = (e) => {
    onFiltersChange({ ...filters, folderId: e.target.value });
  };

  const handleAppChange = (e) => {
    onFiltersChange({ ...filters, app: e.target.value });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      statuses: [],
      folderId: '',
      app: ''
    });
  };

  const hasActiveFilters = filters.statuses?.length > 0 || filters.folderId || filters.app;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-surface border-r border-gray-200 shadow-lg overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:shadow-none ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-primary">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onClose}
            className="lg:hidden"
          />
        </div>

        <div className="space-y-6">
          <StatusFilter
            selectedStatuses={filters.statuses || []}
            onStatusChange={handleStatusChange}
          />

          <div>
            <Select
              label="Folder"
              value={filters.folderId || ''}
              onChange={handleFolderChange}
              options={folderOptions}
              placeholder="All folders"
            />
          </div>

          <div>
            <Select
              label="App"
              value={filters.app || ''}
              onChange={handleAppChange}
              options={appOptions}
              placeholder="All apps"
            />
          </div>

          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClearFilters}
                className="w-full"
                icon="RotateCcw"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;