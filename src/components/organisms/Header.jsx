import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '@/components/molecules/SearchBar';
import ViewToggle from '@/components/molecules/ViewToggle';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Header = () => {
  const location = useLocation();
  const [view, setView] = React.useState('grid');
  const [searchTerm, setSearchTerm] = React.useState('');

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/workflows':
        return 'Workflows';
      case '/errors':
        return 'Error Logs';
      case '/performance':
        return 'Performance';
      case '/settings':
        return 'Settings';
      default:
        return 'ZapFlow Manager';
    }
  };

  const showViewToggle = location.pathname === '/' || location.pathname === '/workflows';
  const showSearch = location.pathname === '/' || location.pathname === '/workflows' || location.pathname === '/errors';

  return (
    <header className="bg-surface border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary">
            {getPageTitle(location.pathname)}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ApperIcon name="Activity" className="w-4 h-4 text-success animate-pulse" />
            <span>System Healthy</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="flex-1 sm:flex-none sm:w-80">
              <SearchBar
                placeholder="Search zaps, apps, or errors..."
                value={searchTerm}
                onSearch={setSearchTerm}
                onClear={() => setSearchTerm('')}
              />
            </div>
          )}
          
          {showViewToggle && (
            <ViewToggle view={view} onViewChange={setView} />
          )}
          
          <Button
            variant="secondary"
            icon="RefreshCw"
            size="sm"
            className="flex-shrink-0"
          >
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;