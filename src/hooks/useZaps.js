import { useState, useEffect } from 'react';
import zapService from '@/services/api/zapService';

export const useZaps = (filters = {}) => {
  const [zaps, setZaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadZaps = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = await zapService.getAll();
      
      // Apply filters
      if (filters.statuses && filters.statuses.length > 0) {
        data = data.filter(zap => filters.statuses.includes(zap.status));
      }
      
      if (filters.folderId) {
        data = data.filter(zap => zap.folderId === parseInt(filters.folderId));
      }
      
      if (filters.app) {
        data = data.filter(zap => 
          zap.apps.some(app => app.toLowerCase().includes(filters.app.toLowerCase()))
        );
      }

      if (filters.search) {
        data = data.filter(zap =>
          zap.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          zap.apps.some(app => app.toLowerCase().includes(filters.search.toLowerCase()))
        );
      }

      setZaps(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleZapStatus = async (zapId) => {
    try {
      const updatedZap = await zapService.toggleStatus(zapId);
      setZaps(prevZaps => 
        prevZaps.map(zap => 
          zap.Id === zapId ? updatedZap : zap
        )
      );
      return updatedZap;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const testZap = async (zapId) => {
    try {
      return await zapService.testZap(zapId);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    loadZaps();
  }, [filters.statuses, filters.folderId, filters.app, filters.search]);

  return {
    zaps,
    loading,
    error,
    refetch: loadZaps,
    toggleZapStatus,
    testZap
  };
};