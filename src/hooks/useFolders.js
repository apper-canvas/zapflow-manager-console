import { useState, useEffect } from 'react';
import folderService from '@/services/api/folderService';

export const useFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await folderService.getAll();
      setFolders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (folderData) => {
    try {
      const newFolder = await folderService.create(folderData);
      setFolders(prevFolders => [...prevFolders, newFolder]);
      return newFolder;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const updateFolder = async (folderId, updates) => {
    try {
      const updatedFolder = await folderService.update(folderId, updates);
      setFolders(prevFolders =>
        prevFolders.map(folder =>
          folder.Id === folderId ? updatedFolder : folder
        )
      );
      return updatedFolder;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      await folderService.delete(folderId);
      setFolders(prevFolders =>
        prevFolders.filter(folder => folder.Id !== folderId)
      );
    } catch (err) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  return {
    folders,
    loading,
    error,
    refetch: loadFolders,
    createFolder,
    updateFolder,
    deleteFolder
  };
};