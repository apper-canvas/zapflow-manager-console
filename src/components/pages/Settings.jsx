import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFolders } from '@/hooks/useFolders';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('folders');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#EF8354');
  const [exportFormat, setExportFormat] = useState('json');

  const { folders, loading, error, refetch, createFolder, updateFolder, deleteFolder } = useFolders();

  const tabs = [
    { id: 'folders', label: 'Folders', icon: 'FolderPlus' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
    { id: 'export', label: 'Export', icon: 'Download' },
    { id: 'about', label: 'About', icon: 'Info' },
  ];

  const colorOptions = [
    { value: '#EF8354', label: 'Orange' },
    { value: '#06D6A0', label: 'Green' },
    { value: '#118AB2', label: 'Blue' },
    { value: '#EF476F', label: 'Red' },
    { value: '#FFD166', label: 'Yellow' },
    { value: '#9D4EDD', label: 'Purple' },
  ];

  const exportOptions = [
    { value: 'json', label: 'JSON' },
    { value: 'csv', label: 'CSV' },
    { value: 'xlsx', label: 'Excel' },
  ];

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    try {
      await createFolder({
        name: newFolderName,
        color: newFolderColor
      });
      setNewFolderName('');
      setNewFolderColor('#EF8354');
      toast.success('Folder created successfully');
    } catch (err) {
      toast.error('Failed to create folder');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await deleteFolder(folderId);
      toast.success('Folder deleted successfully');
    } catch (err) {
      toast.error('Failed to delete folder');
    }
  };

  const handleExport = async () => {
    try {
      toast.info(`Exporting data as ${exportFormat.toUpperCase()}...`);
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Export completed successfully');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const renderFoldersTab = () => {
    if (loading) {
      return <Loading type="list" count={4} />;
    }

    if (error) {
      return (
        <Error
          title="Failed to load folders"
          message={error}
          onRetry={refetch}
        />
      );
    }

    return (
      <div className="space-y-6">
        {/* Create New Folder */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Create New Folder</h3>
          <form onSubmit={handleCreateFolder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Folder Name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                required
              />
              <Select
                label="Color"
                value={newFolderColor}
                onChange={(e) => setNewFolderColor(e.target.value)}
                options={colorOptions}
              />
            </div>
            <Button type="submit" variant="primary" icon="Plus">
              Create Folder
            </Button>
          </form>
        </div>

        {/* Existing Folders */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Existing Folders</h3>
          {folders.length === 0 ? (
            <Empty
              title="No folders created"
              message="Create your first folder to organize your Zaps."
              actionLabel="Create Folder"
              icon="FolderPlus"
            />
          ) : (
            <div className="space-y-3">
              {folders.map((folder) => (
                <motion.div
                  key={folder.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: folder.color }}
                    />
                    <div>
                      <h4 className="font-medium text-primary">{folder.name}</h4>
                      <p className="text-sm text-gray-600">{folder.zapCount} zaps</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={() => toast.info('Edit folder functionality coming soon')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDeleteFolder(folder.Id)}
                      className="text-error hover:text-error"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Display Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-primary">Default View</h4>
              <p className="text-sm text-gray-600">Choose your preferred view for workflows</p>
            </div>
            <Select
              value="grid"
              onChange={() => {}}
              options={[
                { value: 'grid', label: 'Grid View' },
                { value: 'list', label: 'List View' },
              ]}
              className="w-32"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-primary">Auto Refresh</h4>
              <p className="text-sm text-gray-600">Automatically refresh data every 30 seconds</p>
            </div>
            <Button variant="secondary" size="sm">
              Enable
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-primary">Notifications</h4>
              <p className="text-sm text-gray-600">Show desktop notifications for errors</p>
            </div>
            <Button variant="secondary" size="sm">
              Enable
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Performance Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-primary">Cache Duration</h4>
              <p className="text-sm text-gray-600">How long to cache zap data</p>
            </div>
            <Select
              value="5"
              onChange={() => {}}
              options={[
                { value: '1', label: '1 minute' },
                { value: '5', label: '5 minutes' },
                { value: '10', label: '10 minutes' },
                { value: '30', label: '30 minutes' },
              ]}
              className="w-32"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderExportTab = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Export Data</h3>
        <div className="space-y-4">
          <Select
            label="Export Format"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            options={exportOptions}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="primary" icon="Download" onClick={handleExport}>
              Export All Zaps
            </Button>
            <Button variant="secondary" icon="FileDown" onClick={handleExport}>
              Export Error Logs
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Import Data</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <ApperIcon name="Upload" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop your backup file here</p>
            <p className="text-sm text-gray-500">or click to select a file</p>
            <Button variant="secondary" className="mt-4" icon="Upload">
              Select File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAboutTab = () => (
    <div className="space-y-6">
      <div className="card p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-accent to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="Zap" className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-primary mb-2">ZapFlow Manager</h3>
        <p className="text-gray-600 mb-4">Version 1.0.0</p>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          A powerful dashboard for managing and monitoring your Zapier automations.
          Track performance, debug errors, and organize workflows efficiently.
        </p>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="CheckCircle" className="w-4 h-4 text-success" />
            </div>
            <div>
              <h4 className="font-medium text-primary">Real-time Monitoring</h4>
              <p className="text-sm text-gray-600">Track zap status and performance in real-time</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="BarChart3" className="w-4 h-4 text-info" />
            </div>
            <div>
              <h4 className="font-medium text-primary">Analytics Dashboard</h4>
              <p className="text-sm text-gray-600">Comprehensive performance analytics and insights</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="AlertCircle" className="w-4 h-4 text-error" />
            </div>
            <div>
              <h4 className="font-medium text-primary">Error Management</h4>
              <p className="text-sm text-gray-600">Centralized error logging and debugging tools</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="FolderPlus" className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h4 className="font-medium text-primary">Organization</h4>
              <p className="text-sm text-gray-600">Organize zaps with folders and advanced filtering</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'folders':
        return renderFoldersTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'export':
        return renderExportTab();
      case 'about':
        return renderAboutTab();
      default:
        return renderFoldersTab();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-accent/10 to-orange-400/10 text-accent font-medium'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;