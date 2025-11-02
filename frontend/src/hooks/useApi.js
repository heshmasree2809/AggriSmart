import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls
export const useApi = (apiFunc, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunc(...args);
      
      if (response.success) {
        setData(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'API request failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { data, loading, error, execute, refetch: execute };
};

// Custom hook for paginated data
export const usePaginatedApi = (apiFunc, initialPage = 1, initialLimit = 10) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async (pageNum = page, pageLimit = limit, reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunc({
        page: pageNum,
        limit: pageLimit
      });

      if (response.success) {
        const { items, total, pages } = response.data;
        
        setData(prev => reset ? items : [...prev, ...items]);
        setTotalItems(total);
        setTotalPages(pages);
        setHasMore(pageNum < pages);
        
        return response.data;
      } else {
        throw new Error(response.error || 'API request failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Paginated API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunc, page, limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, limit, false);
    }
  }, [page, limit, loading, hasMore, fetchData]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchData(1, limit, true);
  }, [limit, fetchData]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
    fetchData(1, newLimit, true);
  }, [fetchData]);

  useEffect(() => {
    fetchData(1, limit, true);
  }, []);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    hasMore,
    loadMore,
    refresh,
    changeLimit
  };
};

// Custom hook for form submission
export const useApiForm = (apiFunc, onSuccess = null, onError = null) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (data) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiFunc(data);
      
      if (response.success) {
        setSuccess(true);
        if (onSuccess) {
          onSuccess(response.data);
        }
        return response.data;
      } else {
        throw new Error(response.error || 'Submission failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [apiFunc, onSuccess, onError]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    submit,
    submitting,
    error,
    success,
    reset
  };
};

// Custom hook for debounced API search
export const useApiSearch = (apiFunc, delay = 500) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      setError(null);

      try {
        const response = await apiFunc(query);
        
        if (response.success) {
          setResults(response.data);
        } else {
          throw new Error(response.error || 'Search failed');
        }
      } catch (err) {
        setError(err.message || 'Search error');
        console.error('Search Error:', err);
      } finally {
        setSearching(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, apiFunc, delay]);

  return {
    query,
    setQuery,
    results,
    searching,
    error
  };
};

// Custom hook for real-time data updates
export const useRealTimeApi = (apiFunc, interval = 30000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunc();
      
      if (response.success) {
        setData(response.data);
        setLastUpdated(new Date());
        return response.data;
      } else {
        throw new Error(response.error || 'API request failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Real-time API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval
    const intervalId = setInterval(fetchData, interval);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [fetchData, interval]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh: fetchData
  };
};
