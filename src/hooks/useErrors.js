import { useState, useEffect } from 'react';
import errorService from '@/services/api/errorService';

export const useErrors = (zapId = null) => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadErrors = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      
      if (zapId) {
        data = await errorService.getByZapId(zapId);
      } else {
        data = await errorService.getAll();
      }
      
      setErrors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = async (zapId) => {
    try {
      await errorService.clearByZapId(zapId);
      setErrors(prevErrors => 
        prevErrors.filter(err => err.zapId !== zapId)
      );
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const deleteError = async (errorId) => {
    try {
      await errorService.delete(errorId);
      setErrors(prevErrors => 
        prevErrors.filter(err => err.Id !== errorId)
      );
    } catch (err) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    loadErrors();
  }, [zapId]);

  return {
    errors,
    loading,
    error,
    refetch: loadErrors,
    clearErrors,
    deleteError
  };
};