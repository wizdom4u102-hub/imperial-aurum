import { useState, useEffect, useCallback } from 'react';
import { getTradingBotPerformance } from '@/lib/trading-bot/api-client';
import { ApiResponse, TradingBotPerformanceResponse } from '@/lib/trading-bot/api.types';

const useTradingBotPerformance = () => {
  const [performance, setPerformance] = useState<TradingBotPerformanceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<TradingBotPerformanceResponse> = await getTradingBotPerformance();
      setPerformance(response.data);
   } catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "Failed to load trading bot performance."
  );
}
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  const refreshPerformance = () => {
    fetchPerformance();
  };

  return { performance, loading, error, refreshPerformance };
};

export default useTradingBotPerformance;