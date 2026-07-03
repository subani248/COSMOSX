import { useState, useCallback } from 'react';
import { nasaAPI } from '../services/api';

export function useNasa() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (apiFunc, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiFunc(params);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch data';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchData };
}
