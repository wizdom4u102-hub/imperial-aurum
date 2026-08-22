import { useState, useEffect, useCallback } from 'react';
import { getTradingBotHistory } from '@/lib/trading-bot/api-client';
import { ApiResponse, TradingBotHistoryResponse } from '@/lib/trading-bot/api.types';

const useTradingBotHistory = () => {
  const [history, setHistory] = useState<TradingBotHistoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<TradingBotHistoryResponse> = await getTradingBotHistory();
      setHistory(response.data);
      
    } catch (err: unknown) {

  setError(
    err instanceof Error
      ? err.message
      : "Failed to load trading history."
  );

}
    
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const refreshHistory = () => {
    fetchHistory();
  };

  return { history, loading, error, refreshHistory };
};

export default useTradingBotHistory;